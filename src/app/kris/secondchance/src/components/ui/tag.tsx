import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const tagVariants = cva(
  "inline-flex items-center rounded px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:shadow-md hover:scale-105",
  {
    variants: {
      variant: {
        analytics: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800",
        features: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
        story: "bg-transparent text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600",
        default: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border border-gray-200 dark:border-gray-800",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  children: React.ReactNode
  /**
   * Optional aria-label for screen readers. If not provided, the children text will be used.
   */
  "aria-label"?: string
  /**
   * Optional role attribute. Defaults to "status" for tags that represent status information.
   */
  role?: string
  /**
   * Custom background color. Overrides variant background.
   */
  customBgColor?: string
  /**
   * Custom text color. Overrides variant text color.
   */
  customTextColor?: string
  /**
   * Custom border color. Overrides variant border color.
   */
  customBorderColor?: string
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ 
    className, 
    variant, 
    size, 
    children, 
    "aria-label": ariaLabel, 
    role = "status",
    customBgColor,
    customTextColor,
    customBorderColor,
    ...props 
  }, ref) => {
    // Generate a descriptive aria-label if not provided
    const getAriaLabel = () => {
      if (ariaLabel) return ariaLabel
      
      const variantDescriptions = {
        analytics: "analytics category",
        features: "feature category", 
        story: "story category",
        default: "tag"
      }
      
      const variantDesc = variantDescriptions[variant || "default"]
      const childrenText = typeof children === "string" ? children : "tag"
      
      return `${childrenText} ${variantDesc}`
    }

    // Apply custom colors if provided
    const customStyles: React.CSSProperties = {}
    if (customBgColor) customStyles.backgroundColor = customBgColor
    if (customTextColor) customStyles.color = customTextColor
    if (customBorderColor) customStyles.borderColor = customBorderColor

    return (
      <span
        className={cn(tagVariants({ variant, size, className }))}
        ref={ref}
        role={role}
        aria-label={getAriaLabel()}
        style={customStyles}
        {...props}
      >
        {children}
      </span>
    )
  }
)
Tag.displayName = "Tag"

export { Tag } 