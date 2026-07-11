import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const bible = searchParams.get('bible');
  const reference = searchParams.get('reference');

  if (!bible || !reference) {
    return NextResponse.json({ error: 'Missing bible or reference parameter' }, { status: 400 });
  }

  try {
    const apiUrl = `https://api.biblesupersearch.com/api?bible=${bible}&reference=${encodeURIComponent(reference)}`;
    const res = await fetch(apiUrl, { cache: 'no-store' });
    
    if (!res.ok) {
      return NextResponse.json({ error: `Upstream API returned ${res.status}` }, { status: res.status });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Failed to fetch from upstream' }, { status: 500 });
  }
}
