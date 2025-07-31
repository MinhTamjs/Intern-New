import { Tag } from './ui/tag'

export function TagDemo() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Tag Component Variants</h2>
        <div className="flex flex-wrap gap-2">
          <Tag variant="analytics">Analytics</Tag>
          <Tag variant="features">Features</Tag>
          <Tag variant="story">Story</Tag>
          <Tag variant="default">Default</Tag>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Tag Component Sizes</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Tag variant="analytics" size="sm">Small</Tag>
          <Tag variant="features" size="md">Medium</Tag>
          <Tag variant="story" size="lg">Large</Tag>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Hover Animations</h2>
        <p className="text-sm text-gray-600 mb-2">
          Hover over tags to see shadow and scale animations:
        </p>
        <div className="flex flex-wrap gap-2">
          <Tag variant="analytics">Hover Me</Tag>
          <Tag variant="features">Hover Me</Tag>
          <Tag variant="story">Hover Me</Tag>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Custom Colors</h2>
        <p className="text-sm text-gray-600 mb-2">
          Tags with custom colors (overrides variant colors):
        </p>
        <div className="flex flex-wrap gap-2">
          <Tag 
            customBgColor="#fef3c7" 
            customTextColor="#92400e" 
            customBorderColor="#f59e0b"
          >
            Custom Yellow
          </Tag>
          <Tag 
            customBgColor="#fce7f3" 
            customTextColor="#be185d" 
            customBorderColor="#ec4899"
          >
            Custom Pink
          </Tag>
          <Tag 
            customBgColor="#dbeafe" 
            customTextColor="#1e40af" 
            customBorderColor="#3b82f6"
          >
            Custom Blue
          </Tag>
          <Tag 
            customBgColor="#dcfce7" 
            customTextColor="#166534" 
            customBorderColor="#22c55e"
          >
            Custom Green
          </Tag>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Accessibility Examples</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Task Type:</span>
            <Tag 
              variant="analytics" 
              aria-label="Bug fix task type"
              role="status"
            >
              Bug Fix
            </Tag>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Priority:</span>
            <Tag 
              variant="features" 
              aria-label="High priority level"
              role="status"
            >
              High
            </Tag>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            <Tag 
              variant="story" 
              aria-label="Task is in review status"
              role="status"
            >
              In Review
            </Tag>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Category:</span>
            <Tag 
              variant="analytics" 
              role="button"
              aria-label="Click to filter by analytics category"
              tabIndex={0}
            >
              Analytics
            </Tag>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Auto-Generated Aria Labels</h2>
        <p className="text-sm text-gray-600 mb-2">
          Tags without explicit aria-label will auto-generate descriptive labels:
        </p>
        <div className="flex flex-wrap gap-2">
          <Tag variant="analytics">Analytics</Tag>
          <Tag variant="features">Features</Tag>
          <Tag variant="story">Story</Tag>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Screen readers will hear: "ANALYTICS analytics category", "FEATURES feature category", etc.
        </p>
      </div>
    </div>
  )
} 