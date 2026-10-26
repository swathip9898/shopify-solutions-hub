import { NextResponse } from 'next/server';
import { fetchSolutions, addSolution } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const solutions = await fetchSolutions();
    return NextResponse.json({ success: true, data: solutions });
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
    if (!body.title || !body.brandName || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Title, Brand Name, and Category are required.' },
        { status: 400 }
      );
    }

    const created = await addSolution({
      brandName: body.brandName,
      title: body.title,
      category: body.category,
      themeUsed: body.themeUsed || 'Dawn',
      problem: body.problem || '',
      implementation: body.implementation || '',
      codeSnippet: body.codeSnippet || '',
      repoLink: body.repoLink || '',
      documentationLink: body.documentationLink || '',
      tags: Array.isArray(body.tags) ? body.tags : [],
      authorName: body.authorName || 'Developer',
      authorEmail: body.authorEmail || '',
      difficulty: body.difficulty || 'Medium (1-2 days)',
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
