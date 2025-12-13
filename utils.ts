// Simple UUID generator
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Domain normalization logic
export const normalizeDomain = (input: string): string => {
  let domain = input.trim().toLowerCase();
  
  // Remove protocol
  domain = domain.replace(/^https?:\/\//, '');
  
  // Remove trailing slashes
  if (domain.endsWith('/')) {
    domain = domain.slice(0, -1);
  }

  return domain;
};

// Web Crypto API SHA-1 for Cloudinary signature
export const sha1 = async (str: string): Promise<string> => {
  const enc = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-1', enc.encode(str));
  return Array.from(new Uint8Array(hash))
    .map(v => v.toString(16).padStart(2, '0'))
    .join('');
};