import React from 'react'
import { MoreHorizontal, Edit, Trash2, Move } from 'lucide-react'
import { Button } from './button'
import type { Task } from '../../features/tasks/types'

interface TaskSettingsMenuProps {
  task: Task;
  onEdit?: () => void;
  onDelete?: () => void;
  onMove?: (newStatus: string) => void;
  disabled?: boolean;
}

const statusOptions = [
  { value: 'pending', label: 'Move to Pending' },
  { value: 'in-progress', label: 'Move to In Progress' },
  { value: 'in-review', label: 'Move to In Review' },
  { value: 'done', label: 'Move to Done' },
]

export function TaskSettingsMenu({
  onEdit,
  onDelete,
  onMove,
  disabled = false,
}: TaskSettingsMenuProps) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element
      if (open && !target.closest('.task-settings-menu')) {
        setOpen(false)
      }
    }

    function handleEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEsc)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open])

  return (
    <div className="task-settings-menu relative">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => setOpen(!open)}
        disabled={disabled}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          {/* Move Task Section */}
          {onMove && (
            <div className="p-2">
              <div className="flex items-center gap-2 mb-2">
                <Move className="h-4 w-4" />
                <span className="text-sm font-medium">Move Task</span>
              </div>
              <div className="space-y-1">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                    onClick={() => { onMove(status.value); setOpen(false); }}
                    type="button"
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Edit/Delete Actions */}
          {(onEdit || onDelete) && (
            <>
              <div className="my-1 border-t border-gray-200 dark:border-gray-700" role="separator" />
              {onEdit && (
                <div
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => { onEdit(); setOpen(false); }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Task
                </div>
              )}
              {onDelete && (
                <div
                  className="px-4 py-2 text-sm text-red-600 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => { onDelete(); setOpen(false); }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Task
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
} 