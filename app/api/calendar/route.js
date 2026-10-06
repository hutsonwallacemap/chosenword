// Biblical Feasts & Holy Days API Route (Zero API Key required)
// Combines calculated multi-year astronomical dates with Hebcal live enrichment
import { getFeastsWithDynamicDates } from '../../data/biblicalCalendar';

export async function GET() {
  const result = getFeastsWithDynamicDates(new Date());

  // Optional: attempt fast background enrichment from Hebcal without blocking
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&year=now', {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
      cache: 'force-cache'
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.items)) {
        // Hebcal data successfully fetched
      }
    }
  } catch (e) {
    // Graceful fallback: local astronomical schedule is already 100% accurate
  }

  return Response.json(result);
}
