import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes task status to handle case sensitivity and common variations
 * @param status - The status string to normalize
 * @returns Normalized status or null if invalid
 */
export function normalizeTaskStatus(status: string | null | undefined): 'pending' | 'in-progress' | 'in-review' | 'done' | null {
  if (!status) return null;
  
  const normalized = status.toLowerCase().trim();
  
  // Handle common variations
  switch (normalized) {
    case 'pending':
      return 'pending';
    case 'in-progress':
    case 'inprogress':
    case 'in_progress':
    case 'progress':
      return 'in-progress';
    case 'in-review':
    case 'inreview':
    case 'in_review':
    case 'review':
      return 'in-review';
    case 'done':
    case 'completed':
    case 'finished':
      return 'done';
    default:
      console.warn('Unknown task status:', status, 'normalized to:', normalized);
      return null;
  }
}

/**
 * Debug function to check if a date string is valid
 * @param dateString - The date string to validate
 * @returns Object with validation results
 */
export function debugDate(dateString: string | null | undefined) {
  if (!dateString) {
    return { isValid: false, reason: 'null or undefined', original: dateString };
  }

  try {
    const date = new Date(dateString);
    const isValid = !isNaN(date.getTime());
    
    return {
      isValid,
      reason: isValid ? 'valid' : 'invalid date string',
      original: dateString,
      parsed: isValid ? date.toISOString() : null,
      timestamp: isValid ? date.getTime() : null
    };
  } catch (error) {
    return {
      isValid: false,
      reason: 'parsing error',
      original: dateString,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Converts a Unix timestamp to a readable date string
 * @param unixTimestamp - Unix timestamp (seconds since epoch)
 * @param fallback - Fallback text if timestamp is invalid
 * @returns Formatted date string or fallback text
 */
export function formatUnixTimestamp(unixTimestamp: number | null | undefined, fallback: string = "Not set"): string {
  if (!unixTimestamp || typeof unixTimestamp !== 'number') {
    return fallback;
  }

  try {
    // Convert Unix timestamp (seconds) to milliseconds
    const date = new Date(unixTimestamp * 1000);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return fallback;
    }

    // Format the date
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.warn('formatUnixTimestamp: Error formatting timestamp:', unixTimestamp, error);
    return fallback;
  }
}

/**
 * Generates a proper ISO timestamp string for API usage
 * @returns ISO timestamp string
 */
export function generateTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Safely formats a date string with fallback handling
 * @param dateString - The date string to format
 * @param fallback - Fallback text if date is invalid (default: "Not available")
 * @returns Formatted date string or fallback text
 */
export function formatDate(dateString: string | null | undefined, fallback: string = "Not available"): string {
  if (!dateString) {
    console.warn('formatDate: Received null or undefined date string');
    return fallback;
  }

  try {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('formatDate: Invalid date string:', dateString);
      return fallback;
    }

    // Format the date
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.warn('formatDate: Error formatting date:', dateString, error);
    return fallback;
  }
}

/**
 * Safely formats a date string for display in a more compact format
 * @param dateString - The date string to format
 * @param fallback - Fallback text if date is invalid (default: "N/A")
 * @returns Formatted date string or fallback text
 */
export function formatDateCompact(dateString: string | null | undefined, fallback: string = "N/A"): string {
  if (!dateString) {
    return fallback;
  }

  try {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return fallback;
    }

    // Format the date in a more compact way
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    console.warn('formatDateCompact: Error formatting date:', dateString, error);
    return fallback;
  }
}

/**
 * Formats a date string for audit log display with both date and time
 * @param dateString - The date string to format
 * @param fallback - Fallback text if date is invalid (default: "Time not available")
 * @returns Formatted date and time string or fallback text
 */
export function formatAuditLogDate(dateString: string | null | undefined, fallback: string = "Time not available"): string {
  if (!dateString) {
    return fallback;
  }

  try {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return fallback;
    }

    // Format the date for audit log display
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.warn('formatAuditLogDate: Error formatting date:', dateString, error);
    return fallback;
  }
}
