export default {
  /**
   * @param {Request} request
   * @param {any} env
   * @param {ExecutionContext} ctx
   */
  async fetch(request, env, ctx) {
    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    // Only allow GET requests
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405, headers });
    }

    const url = new URL(request.url);
    const calendarUrl = url.searchParams.get('url');

    if (!calendarUrl) {
      return new Response('Missing calendar URL', { status: 400, headers });
    }

    try {
      // Validate URL
      const parsedUrl = new URL(calendarUrl);
      if (!parsedUrl.pathname.endsWith('.ics')) {
        return new Response('Invalid calendar URL', { status: 400, headers });
      }

      // Rate limiting
      const ip = request.headers.get('CF-Connecting-IP') || 'anonymous';
      const rateLimitKey = `${ip}:${calendarUrl}`;
      const rateLimited = await env.MY_RATE_LIMITER.limit({key: rateLimitKey});

      if (!rateLimited.success) {
        return new Response('Rate limit exceeded', { status: 429, headers });
      }

      // Fetch calendar
      const response = await fetch(calendarUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch calendar');
      }

      const data = await response.text();

      return new Response(data, {
        headers: {
          ...headers,
          'Content-Type': 'text/calendar',
          'Cache-Control': 'public, max-age=300'
        }
      });
    } catch (error) {
      return new Response('Failed to fetch calendar', { status: 500, headers });
    }
  }
};
