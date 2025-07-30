# 🌙 Dark Mode & TaskCard Color Customization Guide

This guide covers the comprehensive dark mode system and TaskCard color customization features implemented in your React + Tailwind CSS Kanban task manager.

## 🌙 Full Dark Mode Implementation

### Features Implemented

✅ **Complete Dark Mode Toggle**
- Toggle button switches between light and dark themes
- Changes entire application background to dark
- Switches all text, buttons, and UI elements to light-friendly colors
- Uses localStorage to remember selected mode across page refreshes

✅ **Theme-Aware Components**
- All components automatically adapt to current theme
- Proper contrast ratios for accessibility
- Smooth transitions between themes

### How It Works

The dark mode system is built using:

1. **Theme Context** (`src/lib/themeContext.ts`)
   - Defines theme types and context interface
   - Provides theme state management

2. **Theme Provider** (`src/lib/theme.tsx`)
   - Manages theme state with useState
   - Handles localStorage persistence
   - Applies theme classes to document root
   - Updates meta theme-color for mobile browsers

3. **Theme Hook** (`src/lib/useTheme.ts`)
   - Custom hook for accessing theme context
   - Provides theme state and toggle functions

4. **CSS Variables** (`src/index.css`)
   - Comprehensive CSS custom properties for both themes
   - Automatic color switching based on `.dark` class

### Usage

```tsx
import { useTheme } from '../lib/useTheme';

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

## 🎨 TaskCard Color Customization

### Features Implemented

✅ **Admin-Only Color Control**
- Only admin users can set custom colors for tasks
- Color picker with preset colors and custom color input
- Real-time preview with proper contrast calculation

✅ **Persistent Color Storage**
- Custom colors stored in task object (`task.customColor`)
- Colors persist across theme changes
- Fallback to default theme colors when no custom color is set

✅ **Smart Contrast Calculation**
- Automatic text color selection based on background color
- Ensures readability regardless of chosen background color
- Uses luminance calculation for optimal contrast

### Components

#### 1. Enhanced TaskCard (`src/features/kanban/TaskCard.tsx`)

**Key Features:**
- Automatically applies custom background colors
- Calculates proper text contrast for readability
- Maintains theme-aware styling for non-customized cards
- Supports both light and dark mode with custom colors

**How it works:**
```tsx
// Custom color takes precedence over theme
if (task.customColor) {
  // Apply custom background color
  style={{ backgroundColor: task.customColor }}
  
  // Calculate proper text color for contrast
  const textColor = getContrastTextColor(task.customColor);
}
```

#### 2. Enhanced ColorPicker (`src/components/ColorPicker.tsx`)

**Key Features:**
- Dark mode support with proper styling
- Extended color palette including dark colors
- Real-time preview with contrast calculation
- Hex color input with validation

**Color Palette:**
- Light colors: White, grays, ambers, blues, emeralds, pinks, purples, oranges, reds
- Dark colors: Gray-800, Gray-700, Gray-600, Gray-500
- Custom color picker for any hex color

#### 3. TaskColorEditor (`src/features/tasks/components/TaskColorEditor.tsx`)

**Key Features:**
- Admin-only task color editing dialog
- Live preview of color changes
- Color validation and normalization
- Reset to default functionality

### Utility Functions (`src/lib/themeUtils.ts`)

#### `getContrastTextColor(backgroundColor: string)`
Calculates optimal text color (black or white) for any background color.

```tsx
const textColor = getContrastTextColor('#ff0000'); // Returns 'text-white'
```

#### `getTextColorForBackground(backgroundColor: string)`
Returns Tailwind text color class for custom backgrounds.

```tsx
const textClass = getTextColorForBackground('#ffffff'); // Returns 'text-gray-900'
```

#### `getDescriptionColorForBackground(backgroundColor: string)`
Returns Tailwind text color class for descriptions with reduced opacity.

#### `isValidHexColor(color: string)`
Validates hex color format.

#### `normalizeHexColor(color: string)`
Normalizes hex colors to 6-digit format.

## 🔧 Tailwind Configuration

### Dark Mode Setup

The project uses Tailwind CSS v4 with the following configuration:

```css
@custom-variant dark (&:is(.dark *));
```

This enables dark mode variants using the `.dark` class on the root element.

### CSS Variables

Comprehensive CSS custom properties are defined for both themes:

```css
:root {
  --background: oklch(1 0 0); /* Light theme */
  --foreground: oklch(0.141 0.005 285.823);
  /* ... more variables */
}

.dark {
  --background: oklch(0.141 0.005 285.823); /* Dark theme */
  --foreground: oklch(0.985 0 0);
  /* ... more variables */
}
```

## 🎯 Usage Examples

### Creating a Task with Custom Color (Admin)

```tsx
// In TaskForm component
{currentRole === 'admin' && (
  <div className="space-y-2">
    <Label className="text-sm font-medium">
      Task Color (Optional)
    </Label>
    <ColorPicker
      selectedColor={formData.customColor}
      onColorChange={(color) => handleInputChange('customColor', color || '')}
      disabled={isLoading}
    />
  </div>
)}
```

### Editing Task Color (Admin)

```tsx
// In task management components
<TaskColorEditor
  task={task}
  onColorChange={(taskId, color) => handleTaskColorUpdate(taskId, color)}
  disabled={isLoading}
/>
```

### Theme-Aware Styling

```tsx
// Automatic theme adaptation
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content adapts to current theme
</div>

// Custom color with contrast calculation
<div 
  style={{ backgroundColor: task.customColor }}
  className={getTextColorForBackground(task.customColor)}
>
  Text automatically adjusts for readability
</div>
```

## 🚀 Key Benefits

1. **Accessibility**: Automatic contrast calculation ensures readable text
2. **Performance**: Efficient theme switching with CSS variables
3. **User Experience**: Smooth transitions and persistent preferences
4. **Admin Control**: Granular color customization for task organization
5. **Fallback Support**: Graceful degradation when custom colors aren't set

## 🔍 Testing

To test the implementation:

1. **Dark Mode Toggle**: Click the theme toggle button in the header
2. **Color Customization**: 
   - Switch to admin role
   - Create a new task with custom color
   - Edit existing task colors
3. **Persistence**: Refresh the page to verify theme and colors are saved
4. **Contrast**: Test various background colors to ensure text readability

## 📝 Notes

- Custom colors take precedence over theme colors
- All color inputs are validated for proper hex format
- The system gracefully handles invalid colors
- Theme changes don't affect custom task colors
- localStorage key: `zira-theme` for theme persistence 