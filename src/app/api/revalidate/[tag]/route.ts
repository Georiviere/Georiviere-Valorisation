import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { tag: string } },
) {
  const tag = params.tag;

  revalidateTag(tag);

  return NextResponse.json({ revalidated: tag });
}
