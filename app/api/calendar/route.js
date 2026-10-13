// Biblical Feasts & Holy Days API Route (Zero API Key required)
// Dates are calculated locally from today's date on every request.
import { getFeastsWithDynamicDates } from '../../data/biblicalCalendar';

// Without this, Next.js prerenders the route at build time and the
// "upcoming feast" dates stay frozen at whatever day the app was built.
export const dynamic = 'force-dynamic';

export async function GET() {
  const result = getFeastsWithDynamicDates(new Date());
  return Response.json(result, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  });
}
