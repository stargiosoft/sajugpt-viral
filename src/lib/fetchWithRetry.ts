interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  timeoutMs?: number;
}

const DEFAULTS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  timeoutMs: 60000,
};

function delay(ms: number): Promise<void> {
  const jitter = ms * 0.1 * Math.random();
  return new Promise(resolve => setTimeout(resolve, ms + jitter));
}

export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  options?: RetryOptions
): Promise<Response> {
  const opts = { ...DEFAULTS, ...options };
  let lastError: Error | null = null;
  let attempt = 0;

  while (attempt <= opts.maxRetries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), opts.timeoutMs);

    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok || response.status < 500) {
        return response;
      }

      lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error instanceof Error ? error : new Error(String(error));
    }

    if (attempt === opts.maxRetries) break;

    const delayMs = Math.min(opts.initialDelayMs * Math.pow(2, attempt), 10000);
    await delay(delayMs);
    attempt++;
  }

  throw lastError || new Error('Unknown fetch error');
}

export async function callEdgeFunction<T>(
  functionName: string,
  body?: Record<string, unknown>,
  options?: RetryOptions
): Promise<T> {
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const url = `https://${projectId}.supabase.co/functions/v1/${functionName}`;

  const response = await fetchWithRetry(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    },
    options
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Edge Function 에러 (${response.status}): ${errorText}`);
  }

  return response.json();
}
