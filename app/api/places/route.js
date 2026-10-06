// Biblical Places & Geospatial API Route (Zero API Key required)
import { biblicalPlaces } from '../../data/biblicalPlaces';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').toLowerCase().trim();
  const testament = searchParams.get('testament');

  let places = [...biblicalPlaces];

  if (testament && (testament === 'ot' || testament === 'nt')) {
    places = places.filter(p => p.testament === testament || p.testament === 'both');
  }

  if (q) {
    places = places.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.ancientName.toLowerCase().includes(q) ||
      p.region.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q)
    );
  }

  return Response.json({
    total: places.length,
    places
  });
}
