import type { Theme } from './themeContext';

/**
 * Calculates the contrast ratio between a background color and determines the best text color
 * Uses luminance calculation to ensure readability and accessibility
 * @param backgroundColor - Hex color string (e.g., "#ffffff")
 * @returns CSS class for optimal text color ('text-black' or 'text-white')
 */
export function getContrastTextColor(backgroundColor: string): 'text-black' | 'text-white' {
  // Add null/undefined checks to prevent errors
  if (!backgroundColor || typeof backgroundColor !== 'string') {
    console.warn('getContrastTextColor: Invalid background color provided', { backgroundColor });
    return 'text-black'; // Default fallback
  }

  // Remove # if present
  const hex = backgroundColor.replace('#', '');
  
  // Validate hex format
  if (!/^[A-Fa-f0-9]{6}$|^[A-Fa-f0-9]{3}$/.test(hex)) {
    console.warn('getContrastTextColor: Invalid hex color format', { backgroundColor, hex });
    return 'text-black'; // Default fallback
  }

  // Convert 3-digit hex to 6-digit if needed
  const fullHex = hex.length === 3 
    ? hex.split('').map(char => char + char).join('')
    : hex;
  
  // Convert to RGB values
  const r = parseInt(fullHex.substr(0, 2), 16);
  const g = parseInt(fullHex.substr(2, 2), 16);
  const b = parseInt(fullHex.substr(4, 2), 16);
  
  // Calculate luminance using WCAG formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black text for light backgrounds, white text for dark backgrounds
  return luminance > 0.5 ? 'text-black' : 'text-white';
}

/**
 * Returns color configuration for task cards based on custom color or theme
 * Handles both custom colors and default theme-based colors
 * @param customColor - Optional custom background color for the task
 * @param theme - Current theme ('light' or 'dark')
 * @returns Object with background, text, and description colors
 */
export function getTaskCardColors(customColor?: string, theme: Theme = 'light') {
  if (customColor) {
    return {
      backgroundColor: customColor,
      textColor: getContrastTextColor(customColor),
      descriptionColor: getContrastTextColor(customColor) === 'text-black' ? 'text-gray-700' : 'text-gray-200'
    };
  }
  
  return {
    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
    textColor: theme === 'dark' ? 'text-white' : 'text-gray-900',
    descriptionColor: theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  };
}

/**
 * Returns appropriate text color for a given background color
 * Converts contrast calculation to actual CSS color classes
 * @param backgroundColor - Hex color string
 * @returns CSS class for text color
 */
export function getTextColorForBackground(backgroundColor: string): string {
  const contrastClass = getContrastTextColor(backgroundColor);
  return contrastClass === 'text-black' ? 'text-gray-900' : 'text-white';
}

/**
 * Returns appropriate description text color for a given background color
 * Provides slightly muted colors for secondary text
 * @param backgroundColor - Hex color string
 * @returns CSS class for description text color
 */
export function getDescriptionColorForBackground(backgroundColor: string): string {
  const contrastClass = getContrastTextColor(backgroundColor);
  return contrastClass === 'text-black' ? 'text-gray-700' : 'text-gray-200';
}

/**
 * Validates if a string is a valid hex color
 * Checks for both 3-digit and 6-digit hex formats
 * @param color - Color string to validate
 * @returns True if valid hex color, false otherwise
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * Normalizes a hex color string to 6-digit format
 * Converts 3-digit hex to 6-digit and ensures lowercase format
 * @param color - Color string to normalize
 * @returns Normalized 6-digit hex color string
 */
export function normalizeHexColor(color: string): string {
  if (!color.startsWith('#')) {
    color = '#' + color;
  }
  
  // Convert 3-digit hex to 6-digit
  if (color.length === 4) {
    color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
  }
  
  return color.toLowerCase();
}

// Status color management for light and dark modes
/**
 * Interface defining color schemes for each status in both light and dark themes
 * Each status has background, border, text, badge, and header background colors
 */
export interface StatusColors {
  light: {
    background: string; // Column background color
    border: string; // Column border color
    text: string; // Text color for headers and content
    badge: string; // Badge background color
    headerBg: string; // Header background color
  };
  dark: {
    background: string; // Column background color in dark mode
    border: string; // Column border color in dark mode
    text: string; // Text color for headers and content in dark mode
    badge: string; // Badge background color in dark mode
    headerBg: string; // Header background color in dark mode
  };
}

/**
 * Default color schemes for each task status
 * Provides consistent branding and visual hierarchy across the application
 * Colors are optimized for both light and dark themes with proper contrast
 */
export const DEFAULT_STATUS_COLORS: Record<string, StatusColors> = {
  pending: {
    light: {
      background: '#fdf2f8', // Light pink background
      border: '#fbcfe8', // Pink border
      text: '#be185d', // Dark pink text
      badge: '#fce7f3', // Light pink badge
      headerBg: '#fdf2f8' // Light pink header
    },
    dark: {
      background: '#882e63', // Dark rose background
      border: '#a855f7', // Purple border
      text: '#fce7f3', // Light pink text
      badge: '#a855f7', // Purple badge
      headerBg: '#7c2d12' // Dark header
    }
  },
  'in-progress': {
    light: {
      background: '#eff6ff', // Light blue background
      border: '#bfdbfe', // Blue border
      text: '#1d4ed8', // Dark blue text
      badge: '#dbeafe', // Light blue badge
      headerBg: '#eff6ff' // Light blue header
    },
    dark: {
      background: '#2b5db4', // Dark steel blue background
      border: '#3b82f6', // Blue border
      text: '#dbeafe', // Light blue text
      badge: '#3b82f6', // Blue badge
      headerBg: '#1e3a8a' // Dark header
    }
  },
  'in-review': {
    light: {
      background: '#fffbeb', // Light yellow background
      border: '#fed7aa', // Orange border
      text: '#d97706', // Dark orange text
      badge: '#fef3c7', // Light yellow badge
      headerBg: '#fffbeb' // Light yellow header
    },
    dark: {
      background: '#b28a00', // Deep gold background
      border: '#f59e0b', // Orange border
      text: '#fef3c7', // Light yellow text
      badge: '#f59e0b', // Orange badge
      headerBg: '#92400e' // Dark header
    }
  },
  done: {
    light: {
      background: '#ecfdf5', // Light green background
      border: '#a7f3d0', // Green border
      text: '#047857', // Dark green text
      badge: '#d1fae5', // Light green badge
      headerBg: '#ecfdf5' // Light green header
    },
    dark: {
      background: '#2e8b57', // Sea green background
      border: '#10b981', // Green border
      text: '#d1fae5', // Light green text
      badge: '#10b981', // Green badge
      headerBg: '#064e3b' // Dark header
    }
  }
};

/**
 * Gets the color scheme for a specific status and theme
 * Falls back to default colors if custom colors are not provided
 * @param status - Task status ('pending', 'in-progress', 'in-review', 'done')
 * @param theme - Current theme ('light' or 'dark')
 * @param customColors - Optional custom color overrides
 * @returns Color scheme for the status and theme
 */
export function getStatusColors(status: string, theme: Theme = 'light', customColors?: Record<string, StatusColors>): StatusColors['light'] | StatusColors['dark'] {
  // Validate inputs
  if (!status || !theme) {
    console.warn('getStatusColors: Invalid status or theme provided', { status, theme });
    return DEFAULT_STATUS_COLORS.pending[theme as keyof StatusColors] || DEFAULT_STATUS_COLORS.pending.light;
  }

  // Check if status exists in default colors
  if (!DEFAULT_STATUS_COLORS[status]) {
    console.warn('getStatusColors: Unknown status provided', { status, availableStatuses: Object.keys(DEFAULT_STATUS_COLORS) });
    return DEFAULT_STATUS_COLORS.pending[theme as keyof StatusColors] || DEFAULT_STATUS_COLORS.pending.light;
  }

  const colors = customColors?.[status] || DEFAULT_STATUS_COLORS[status];
  
  // Ensure we have valid colors for the requested theme
  const themeColors = colors?.[theme];
  if (!themeColors) {
    console.warn('getStatusColors: No colors found for theme', { status, theme, availableThemes: Object.keys(colors || {}) });
    return DEFAULT_STATUS_COLORS[status]?.[theme as keyof StatusColors] || DEFAULT_STATUS_COLORS.pending[theme as keyof StatusColors] || DEFAULT_STATUS_COLORS.pending.light;
  }

  return themeColors;
}

/**
 * Gets complete status information including colors, title, icon, and description
 * Provides a unified interface for status display across the application
 * @param status - Task status string
 * @param theme - Current theme
 * @param customColors - Optional custom color overrides
 * @returns Complete status information object
 */
export function getStatusInfo(status: string, theme: Theme = 'light', customColors?: Record<string, StatusColors>) {
  // Validate inputs
  if (!status || !theme) {
    console.warn('getStatusInfo: Invalid status or theme provided', { status, theme });
    // Return default pending status info
    return {
      title: 'Pending',
      icon: '⏳',
      description: 'Tasks not started',
      colors: DEFAULT_STATUS_COLORS.pending.light
    };
  }

  const colors = getStatusColors(status, theme, customColors);
  
  // Status configuration with titles, icons, and descriptions
  const statusConfig = {
    pending: {
      title: 'Pending',
      icon: '⏳',
      description: 'Tasks not started'
    },
    'in-progress': {
      title: 'In Progress',
      icon: '🚧',
      description: 'Active work in motion'
    },
    'in-review': {
      title: 'In Review',
      icon: '🔍',
      description: 'Needs attention'
    },
    done: {
      title: 'Done',
      icon: '✅',
      description: 'Successfully completed'
    }
  };
  
  // Get status config or fallback to pending
  const config = statusConfig[status as keyof typeof statusConfig];
  if (!config) {
    console.warn('getStatusInfo: Unknown status provided', { status, availableStatuses: Object.keys(statusConfig) });
    return {
      ...statusConfig.pending,
      colors
    };
  }
  
  return {
    ...config,
    colors
  };
}

/**
 * Calculates the contrast ratio between two colors
 * Uses WCAG 2.1 luminance formula for accessibility compliance
 * @param color1 - First hex color string
 * @param color2 - Second hex color string
 * @returns Contrast ratio as a number
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  // Add null/undefined checks to prevent errors
  if (!color1 || !color2) {
    console.warn('calculateContrastRatio: Invalid color values provided', { color1, color2 });
    return 1; // Return minimum contrast ratio for invalid colors
  }

  const getLuminance = (color: string) => {
    // Ensure color is a valid hex string
    if (!color || typeof color !== 'string') {
      console.warn('getLuminance: Invalid color provided', { color });
      return 0;
    }

    const hex = color.replace('#', '');
    
    // Validate hex format (6 or 3 characters)
    if (!/^[A-Fa-f0-9]{6}$|^[A-Fa-f0-9]{3}$/.test(hex)) {
      console.warn('getLuminance: Invalid hex color format', { color, hex });
      return 0;
    }

    // Convert 3-digit hex to 6-digit if needed
    const fullHex = hex.length === 3 
      ? hex.split('').map(char => char + char).join('')
      : hex;

    const r = parseInt(fullHex.substr(0, 2), 16);
    const g = parseInt(fullHex.substr(2, 2), 16);
    const b = parseInt(fullHex.substr(4, 2), 16);
    
    // Apply gamma correction for sRGB colorspace
    const [rs, gs, bs] = [r, g, b].map(c => {
      if (c <= 0.03928) return c / 12.92;
      return Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    // Calculate relative luminance
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks if a color combination meets WCAG AA accessibility standards
 * AA standard requires a contrast ratio of at least 4.5:1 for normal text
 * @param backgroundColor - Background color hex string
 * @param textColor - Text color hex string
 * @returns True if the combination meets AA standards, false otherwise
 */
export function isAccessibleContrast(backgroundColor: string, textColor: string): boolean {
  // Add null/undefined checks to prevent errors
  if (!backgroundColor || !textColor) {
    console.warn('isAccessibleContrast: Invalid color values provided', { backgroundColor, textColor });
    return false; // Return false for invalid colors
  }

  const contrastRatio = calculateContrastRatio(backgroundColor, textColor);
  return contrastRatio >= 4.5; // AA standard for normal text
} 