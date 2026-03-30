export const isProduction = (): boolean => {
  if (typeof window === 'undefined') return process.env.NODE_ENV === 'production';
  const hostname = window.location.hostname;
  return !hostname.startsWith('localhost') && !hostname.startsWith('127.0.0.1');
};

export const isDevelopment = (): boolean => !isProduction();

export const DEV = typeof window !== 'undefined'
  && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
