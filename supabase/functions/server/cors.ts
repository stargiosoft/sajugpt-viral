/**
 * CORS 유틸리티 — 색기 배틀 Edge Functions 공통
 */

const ALLOWED_ORIGINS = [
  'https://sajugpt-viral.vercel.app',
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;

  // 로컬 개발
  if (origin.startsWith('http://localhost:') || origin === 'http://localhost') return true;

  // Vercel Preview
  if (origin.match(/^https:\/\/sajugpt-viral(-[a-z0-9-]+)?\.vercel\.app$/)) return true;

  return false;
}

export function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin');
  const headers: Record<string, string> = {
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };
  if (isAllowedOrigin(origin)) {
    headers['Access-Control-Allow-Origin'] = origin!;
  }
  return headers;
}

export function handleCorsPreflightRequest(request: Request): Response {
  return new Response('ok', { headers: getCorsHeaders(request) });
}

export function jsonResponse(request: Request, data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' },
  });
}

export function errorResponse(request: Request, message: string, status = 500): Response {
  return jsonResponse(request, { success: false, error: message }, status);
}
