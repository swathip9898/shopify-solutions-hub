import { google } from 'googleapis';
import { Brand, Solution, SheetConfigStatus } from '@/types';
import { INITIAL_BRANDS, INITIAL_SOLUTIONS } from './sampleData';

// In-memory fallback cache when Google Sheets env vars are not yet configured
const localBrands: Brand[] = [...INITIAL_BRANDS];
const localSolutions: Solution[] = [...INITIAL_SOLUTIONS];

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const RAW_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

// Normalize private key from env var (handling escaped \n)
const PRIVATE_KEY = RAW_PRIVATE_KEY ? RAW_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;

export function getGoogleSheetStatus(): SheetConfigStatus {
  if (!SHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    return {
      isConfigured: false,
      sheetId: SHEET_ID || undefined,
      serviceAccountEmail: CLIENT_EMAIL || undefined,
      error: 'Google Sheets credentials not set in environment variables (Using local demo database).',
    };
  }
  return {
    isConfigured: true,
    sheetId: SHEET_ID,
    serviceAccountEmail: CLIENT_EMAIL,
  };
}

function getSheetsClient() {
  if (!SHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    return null;
  }

  const auth = new google.auth.JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

// Ensure the required tabs and header rows exist
async function ensureSheetStructure(sheets: ReturnType<typeof google.sheets>) {
  if (!SHEET_ID) return;

  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const sheetTitles = meta.data.sheets?.map((s) => s.properties?.title) || [];

    // Create 'Brands' tab if it does not exist
    if (!sheetTitles.includes('Brands')) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          requests: [{ addSheet: { properties: { title: 'Brands' } } }],
        },
      });
      // Add Brands header
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: 'Brands!A1:H1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [
            ['ID', 'Brand Name', 'Shopify Domain', 'Live URL', 'Theme Used', 'Lead Developer', 'Account Manager', 'Status'],
          ],
        },
      });
      // Seed initial brands
      const initialBrandRows = INITIAL_BRANDS.map((b) => [
        b.id,
        b.name,
        b.shopifyDomain,
        b.liveUrl || '',
        b.theme,
        b.leadDeveloper,
        b.accountManager || '',
        b.status,
      ]);
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'Brands!A2',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: initialBrandRows },
      });
    }

    // Create 'Solutions' tab if it does not exist
    if (!sheetTitles.includes('Solutions')) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          requests: [{ addSheet: { properties: { title: 'Solutions' } } }],
        },
      });
      // Add Solutions header
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: 'Solutions!A1:M1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [
            [
              'ID',
              'Brand Name',
              'Title',
              'Category',
              'Theme Used',
              'Problem',
              'Implementation',
              'Code Snippet',
              'Repo / PR Link',
              'Docs Link',
              'Tags',
              'Author Name',
              'Date',
            ],
          ],
        },
      });
      // Seed initial solutions
      const initialSolRows = INITIAL_SOLUTIONS.map((s) => [
        s.id,
        s.brandName,
        s.title,
        s.category,
        s.themeUsed,
        s.problem,
        s.implementation,
        s.codeSnippet || '',
        s.repoLink || '',
        s.documentationLink || '',
        s.tags.join(', '),
        s.authorName,
        s.createdAt,
      ]);
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'Solutions!A2',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: initialSolRows },
      });
    }
  } catch (err) {
    console.warn('Error while ensuring sheet structure:', err);
  }
}

// ======================== BRANDS API ========================

export async function fetchBrands(): Promise<Brand[]> {
  const sheets = getSheetsClient();
  if (!sheets || !SHEET_ID) {
    return localBrands;
  }

  try {
    await ensureSheetStructure(sheets);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Brands!A2:H',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return localBrands;
    }

    return rows.map((row, index) => ({
      id: row[0] || `BRD-${String(index + 1).padStart(3, '0')}`,
      name: row[1] || 'Unnamed Brand',
      shopifyDomain: row[2] || '',
      liveUrl: row[3] || undefined,
      theme: row[4] || 'Dawn',
      leadDeveloper: row[5] || 'Unassigned',
      accountManager: row[6] || undefined,
      status: (row[7] as Brand['status']) || 'Active',
    }));
  } catch (error) {
    console.error('Failed to read Brands from Google Sheets, using fallback:', error);
    return localBrands;
  }
}

export async function addBrand(brand: Omit<Brand, 'id'>): Promise<Brand> {
  const sheets = getSheetsClient();
  const newId = `BRD-${String(Date.now()).slice(-4)}`;
  const fullBrand: Brand = { id: newId, ...brand };

  if (!sheets || !SHEET_ID) {
    localBrands.unshift(fullBrand);
    return fullBrand;
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Brands!A:H',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            fullBrand.id,
            fullBrand.name,
            fullBrand.shopifyDomain,
            fullBrand.liveUrl || '',
            fullBrand.theme,
            fullBrand.leadDeveloper,
            fullBrand.accountManager || '',
            fullBrand.status,
          ],
        ],
      },
    });
    localBrands.unshift(fullBrand);
    return fullBrand;
  } catch (error) {
    console.error('Failed to append Brand to Google Sheets:', error);
    localBrands.unshift(fullBrand);
    return fullBrand;
  }
}

// ======================== SOLUTIONS API ========================

export async function fetchSolutions(): Promise<Solution[]> {
  const sheets = getSheetsClient();
  if (!sheets || !SHEET_ID) {
    return localSolutions;
  }

  try {
    await ensureSheetStructure(sheets);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Solutions!A2:M',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return localSolutions;
    }

    return rows.map((row, index) => {
      const tags = row[10] ? String(row[10]).split(',').map((t) => t.trim()).filter(Boolean) : [];
      return {
        id: row[0] || `SOL-${String(index + 1).padStart(3, '0')}`,
        brandName: row[1] || 'General',
        title: row[2] || 'Untitled Solution',
        category: (row[3] as Solution['category']) || 'Theme / Liquid',
        themeUsed: row[4] || 'Dawn',
        problem: row[5] || '',
        implementation: row[6] || '',
        codeSnippet: row[7] || '',
        repoLink: row[8] || '',
        documentationLink: row[9] || '',
        tags,
        authorName: row[11] || 'Developer',
        difficulty: 'Medium (1-2 days)',
        createdAt: row[12] || new Date().toISOString().split('T')[0],
      };
    });
  } catch (error) {
    console.error('Failed to read Solutions from Google Sheets, using fallback:', error);
    return localSolutions;
  }
}

export async function addSolution(
  solution: Omit<Solution, 'id' | 'createdAt'>
): Promise<Solution> {
  const sheets = getSheetsClient();
  const newId = `SOL-${String(Date.now()).slice(-4)}`;
  const dateStr = new Date().toISOString().split('T')[0];

  const fullSolution: Solution = {
    ...solution,
    id: newId,
    createdAt: dateStr,
  };

  if (!sheets || !SHEET_ID) {
    localSolutions.unshift(fullSolution);
    return fullSolution;
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Solutions!A:M',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            fullSolution.id,
            fullSolution.brandName,
            fullSolution.title,
            fullSolution.category,
            fullSolution.themeUsed,
            fullSolution.problem,
            fullSolution.implementation,
            fullSolution.codeSnippet || '',
            fullSolution.repoLink || '',
            fullSolution.documentationLink || '',
            fullSolution.tags.join(', '),
            fullSolution.authorName,
            fullSolution.createdAt,
          ],
        ],
      },
    });
    localSolutions.unshift(fullSolution);
    return fullSolution;
  } catch (error) {
    console.error('Failed to append Solution to Google Sheets:', error);
    localSolutions.unshift(fullSolution);
    return fullSolution;
  }
}
