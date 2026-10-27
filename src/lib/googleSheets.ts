import { Brand, Solution, SheetConfigStatus } from '@/types';
import { INITIAL_BRANDS, INITIAL_SOLUTIONS } from './sampleData';

const localBrands: Brand[] = [...INITIAL_BRANDS];
const localSolutions: Solution[] = [...INITIAL_SOLUTIONS];

const WEBAPP_URL = process.env.GOOGLE_SHEET_WEBAPP_URL;

export function getGoogleSheetStatus(): SheetConfigStatus {
  if (WEBAPP_URL) {
    return {
      isConfigured: true,
      sheetId: 'Live Google Sheet Connected',
      serviceAccountEmail: 'Google Apps Script Web App',
    };
  }
  return {
    isConfigured: false,
    error: 'Google Sheet Web App URL not set in environment variables (Using local demo database).',
  };
}

export async function fetchBrands(): Promise<Brand[]> {
  if (!WEBAPP_URL) {
    return localBrands;
  }

  try {
    const res = await fetch(`${WEBAPP_URL}?action=getBrands`, { cache: 'no-store' });
    const rows: string[][] = await res.json();

    if (!rows || rows.length === 0 || (rows.length === 1 && (!rows[0][0] || rows[0][0] === ''))) {
      return localBrands;
    }

    // Skip header row if first cell is 'ID' or 'Brand Name'
    const dataRows = (rows[0][0] === 'ID' || rows[0][1] === 'Brand Name') ? rows.slice(1) : rows;

    if (dataRows.length === 0) {
      return localBrands;
    }

    return dataRows.map((row, index) => ({
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
    console.error('Failed to read Brands from Google Sheet WebApp:', error);
    return localBrands;
  }
}

export async function addBrand(brand: Omit<Brand, 'id'>): Promise<Brand> {
  const newId = `BRD-${String(Date.now()).slice(-4)}`;
  const fullBrand: Brand = { id: newId, ...brand };

  if (!WEBAPP_URL) {
    localBrands.unshift(fullBrand);
    return fullBrand;
  }

  try {
    await fetch(WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        sheet: 'Brands',
        row: [
          fullBrand.id,
          fullBrand.name,
          fullBrand.shopifyDomain,
          fullBrand.liveUrl || '',
          fullBrand.theme,
          fullBrand.leadDeveloper,
          fullBrand.accountManager || '',
          fullBrand.status,
        ],
      }),
    });
    localBrands.unshift(fullBrand);
    return fullBrand;
  } catch (error) {
    console.error('Failed to append Brand to Google Sheet:', error);
    localBrands.unshift(fullBrand);
    return fullBrand;
  }
}

export async function fetchSolutions(): Promise<Solution[]> {
  if (!WEBAPP_URL) {
    return localSolutions;
  }

  try {
    const res = await fetch(`${WEBAPP_URL}?action=getSolutions`, { cache: 'no-store' });
    const rows: string[][] = await res.json();

    if (!rows || rows.length === 0 || (rows.length === 1 && (!rows[0][0] || rows[0][0] === ''))) {
      return localSolutions;
    }

    const dataRows = (rows[0][0] === 'ID' || rows[0][1] === 'Brand Name') ? rows.slice(1) : rows;

    if (dataRows.length === 0) {
      return localSolutions;
    }

    return dataRows.map((row, index) => {
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
    console.error('Failed to read Solutions from Google Sheet WebApp:', error);
    return localSolutions;
  }
}

export async function addSolution(
  solution: Omit<Solution, 'id' | 'createdAt'>
): Promise<Solution> {
  const newId = `SOL-${String(Date.now()).slice(-4)}`;
  const dateStr = new Date().toISOString().split('T')[0];

  const fullSolution: Solution = {
    ...solution,
    id: newId,
    createdAt: dateStr,
  };

  if (!WEBAPP_URL) {
    localSolutions.unshift(fullSolution);
    return fullSolution;
  }

  try {
    await fetch(WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        sheet: 'Solutions',
        row: [
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
      }),
    });
    localSolutions.unshift(fullSolution);
    return fullSolution;
  } catch (error) {
    console.error('Failed to append Solution to Google Sheet:', error);
    localSolutions.unshift(fullSolution);
    return fullSolution;
  }
}
