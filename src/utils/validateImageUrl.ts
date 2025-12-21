/**
 * Security: Validate that image URL is from Cloudinary
 * Prevents malicious URLs or non-Cloudinary domains
 */
export function validateImageUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== 'string') {
    return true; // Empty URL is allowed (optional field)
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Security: Only allow Cloudinary CDN domains
    const allowedDomains = [
      'res.cloudinary.com',
      'cloudinary.com',
    ];

    // Check if hostname matches allowed domains
    const isValidDomain = allowedDomains.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );

    if (!isValidDomain) {
      return false;
    }

    // Security: Ensure HTTPS protocol
    if (urlObj.protocol !== 'https:') {
      return false;
    }

    // Security: Validate URL format (should contain /image/upload/ or /image/upload/)
    const pathname = urlObj.pathname;
    if (!pathname.includes('/image/upload')) {
      return false;
    }

    return true;
  } catch (error) {
    // Invalid URL format
    return false;
  }
}

/**
 * Security: Sanitize image URL to prevent XSS
 */
export function sanitizeImageUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Remove any potential script tags or dangerous characters
  return url
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

