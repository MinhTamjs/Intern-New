import * as React from "react"

// Minimal fallback for DropdownMenu system
export const DropdownMenu = ({ children }: { children: React.ReactNode }) => (
  <div className="relative inline-block text-left">{children}</div>
)

export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, ...props }, ref) => (
    <button ref={ref} {...props} aria-haspopup="menu" aria-expanded="false">
      {children}
    </button>
  )
)
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ${className}`}
      role="menu"
      {...props}
    >
      {children}
    </div>
  )
)
DropdownMenuContent.displayName = "DropdownMenuContent"

export const DropdownMenuLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide" role="presentation">{children}</div>
)

export const DropdownMenuSeparator = () => (
  <div className="my-1 border-t border-gray-200 dark:border-gray-700" role="separator" />
)

export const DropdownMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`px-4 py-2 text-sm text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded ${className}`}
      role="menuitem"
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  )
)
DropdownMenuItem.displayName = "DropdownMenuItem"