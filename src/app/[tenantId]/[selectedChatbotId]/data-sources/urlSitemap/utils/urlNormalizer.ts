/**
 * URL normalization utility
 * Ensures URLs have proper protocol, remove trailing slashes, etc.
 */

export function normalizeUrl(url: string): string {
  if (!url) return '';

  // Remove whitespace
  let normalized = url.trim();

  // Add https:// if no protocol is present
  if (!normalized.match(/^https?:\/\//)) {
    normalized = `https://${normalized}`;
  }

  // Handle www. prefix - add if missing for common domains
  try {
    const urlObj = new URL(normalized);
    const hostname = urlObj.hostname.toLowerCase();

    // Add www. if it's missing and it's a common domain pattern
    if (!hostname.startsWith('www.') && !hostname.includes('.') && hostname !== 'localhost' && !hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      // This is likely a domain without www, add it
      urlObj.hostname = `www.${hostname}`;
      normalized = urlObj.toString();
    }
  } catch (e) {
    // If URL parsing fails, try simple string manipulation
    if (
      !normalized.includes('www.') &&
      !normalized.includes('localhost') &&
      !normalized.match(/^\d+\.\d+\.\d+\.\d+/) &&
      normalized.includes('://') &&
      !normalized.split('://')[1].includes('.')
    ) {
      // Add www. after the protocol
      const parts = normalized.split('://');
      if (parts.length === 2) {
        normalized = `${parts[0]}://www.${parts[1]}`;
      }
    }
  }

  // Remove trailing slash (except for root domain)
  if (normalized.endsWith('/') && normalized.split('/').length > 4) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}

export function normalizeDiscoveredUrl(url: string | { url: string; name?: string }): { name: string; url: string; selected: boolean } {
  const urlString = typeof url === 'string' ? url : url.url;
  const name = typeof url === 'object' && url.name ? url.name : urlString;

  return {
    name,
    url: normalizeUrl(urlString),
    selected: false,
  };
}

export function normalizeDiscoveredUrls(urls: (string | { url: string; name?: string })[]): { name: string; url: string; selected: boolean }[] {
  return urls.map(normalizeDiscoveredUrl);
}
