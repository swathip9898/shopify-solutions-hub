import { NextResponse } from 'next/server';
import { fetchBrands, addBrand } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const brands = await fetchBrands();
    return NextResponse.json({ success: true, data: brands });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.shopifyDomain) {
      return NextResponse.json(
        { success: false, error: 'Brand Name and Shopify Domain are required.' },
        { status: 400 }
      );
    }

    const created = await addBrand({
      name: body.name,
      shopifyDomain: body.shopifyDomain,
      liveUrl: body.liveUrl || '',
      theme: body.theme || 'Dawn',
      leadDeveloper: body.leadDeveloper || 'Unassigned',
      accountManager: body.accountManager || '',
      notes: body.notes || '',
      status: body.status || 'Active',
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
