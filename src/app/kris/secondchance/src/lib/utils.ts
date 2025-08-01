import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TaskStatus } from '../features/tasks/types';

/**
 * Utility function to merge Tailwind CSS classes with conflict resolution
 * Combines clsx for conditional classes and twMerge for Tailwind class deduplication
 * @param inputs - Array of class values (strings, objects, arrays, etc.)
 * @returns Merged and deduplicated CSS class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalize task status to handle case variations
 * @param status - Raw status string
 * @returns Normalized status or null if invalid
 */
export function normalizeTaskStatus(status: string): TaskStatus | null {
  const normalized = status.toLowerCase().replace(/\s+/g, '-');
  
  const validStatuses: TaskStatus[] = ['pending', 'in-progress', 'in-review', 'done'];
  
  return validStatuses.includes(normalized as TaskStatus) ? normalized as TaskStatus : null;
}

/**
 * Debug function to check if a date string is valid
 * Provides detailed validation information for troubleshooting date issues
 * @param dateString - The date string to validate
 * @returns Object with validation results including parsed date and error details
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
 * Handles Unix timestamps (seconds since epoch) and converts them to human-readable format
 * @param unixTimestamp - Unix timestamp (seconds since epoch)
 * @param fallback - Fallback text if timestamp is invalid
 * @returns Formatted date string or fallback text
 */
export function formatUnixTimestamp(unixTimestamp: number | null | undefined, fallback: string = "Not set"): string {
  if (!unixTimestamp || typeof unixTimestamp !== 'number') {
    return fallback;
  }

  try {
    // Convert Unix timestamp (seconds) to milliseconds for JavaScript Date constructor
    const date = new Date(unixTimestamp * 1000);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return fallback;
    }

    // Format the date with both date and time information
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
 * Creates standardized timestamps for database operations and API calls
 * @returns ISO timestamp string in UTC format
 */
export function generateTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Format date to readable string
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Safely formats a date string for display in a more compact format
 * Provides date-only formatting without time for space-constrained displays
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

    // Format the date in a compact format (date only, no time)
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
 * Provides detailed timestamp formatting for audit trail entries
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

    // Format the date for audit log display with seconds for precise timing
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

/**
 * Get relative time string
 * @param date - Date to compare
 * @returns Relative time string
 */
export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(target);
}

/**
 * Generate unique ID
 * @returns Unique ID string
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Debounce function execution
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Capitalize first letter of string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert status to display text
 * @param status - Task status
 * @returns Display text
 */
export function statusToDisplayText(status: TaskStatus): string {
  return status.split('-').map(capitalize).join(' ');
}
