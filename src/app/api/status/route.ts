import { NextResponse } from 'next/server';
import { getGoogleSheetStatus } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET() {
  const status = getGoogleSheetStatus();
  return NextResponse.json({ success: true, ...status });
}
