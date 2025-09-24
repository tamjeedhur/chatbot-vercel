/**
 * Utility functions for consistent date formatting across the application
 * to prevent hydration mismatches between server and client
 */

/**
 * Format a date consistently for display
 * @param date - Date object or date string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }
): string => {
  if (!date) return 'Unknown';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  return dateObj.toLocaleDateString('en-US', options);
};

/**
 * Format a time consistently for display
 * @param date - Date object or date string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted time string
 */
export const formatTime = (
  date: Date | string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  }
): string => {
  if (!date) return 'Unknown';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return 'Invalid Time';

  return dateObj.toLocaleTimeString('en-US', options);
};

/**
 * Format a date and time consistently for display
 * @param date - Date object or date string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date and time string
 */
export const formatDateTime = (
  date: Date | string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }
): string => {
  if (!date) return 'Unknown';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  return dateObj.toLocaleString('en-US', options);
};

/**
 * Format a relative time (e.g., "2 hours ago", "yesterday")
 * @param date - Date object or date string
 * @param referenceTime - Optional reference time for consistent server/client rendering
 * @returns Relative time string
 */
export const formatRelativeTime = (
  date: Date | string | null | undefined,
  referenceTime?: Date
): string => {
  if (!date) return 'Unknown';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  // Use provided reference time or current time
  const now = referenceTime || new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return `Yesterday ${formatTime(dateObj)}`;
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return formatDate(dateObj);
};

/**
 * Format a relative time with hydration-safe rendering
 * This version prevents hydration mismatches by using a consistent time reference
 * @param date - Date object or date string
 * @param isHydrated - Whether the component is fully hydrated on client
 * @returns Relative time string that's safe for SSR
 */
export const formatRelativeTimeSSR = (
  date: Date | string | null | undefined,
  isHydrated: boolean = true
): string => {
  if (!date) return 'Unknown';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  // For initial render (server and client before hydration), use static time format
  if (typeof window === 'undefined' || !isHydrated) {
    // Use absolute time format to prevent any hydration mismatches
    // This ensures server and client render exactly the same content
    return formatTime(dateObj);
  }
  
  // Client-side after hydration: Use current time for live updates
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return `Yesterday ${formatTime(dateObj)}`;
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return formatDate(dateObj);
};
