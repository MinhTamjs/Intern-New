import * as React from "react"
import { Button } from "./button"
import { Settings, Users, Palette, Edit, Trash2, Move } from "lucide-react"
import { Avatar, AvatarFallback } from "./avatar"
import { Badge } from "./badge"
import { Input } from "./input"
import { ScrollArea } from "./scroll-area"
import type { Task } from "../../features/tasks/types"
import type { Employee } from "../../features/employees/types"

interface TaskSettingsMenuProps {
  task: Task
  employees: Employee[]
  currentUserRole: 'admin' | 'manager' | 'employee'
  onAssignUsers: (taskId: string, userIds: string[]) => void
  onColorChange?: (taskId: string, color: string) => void
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  onMove?: (taskId: string, newStatus: string) => void
}

export function TaskSettingsMenu({
  task,
  employees,
  currentUserRole,
  onAssignUsers,
  onColorChange,
  onEdit,
  onDelete,
  onMove,
}: TaskSettingsMenuProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>(
    task.assigneeIds || []
  )
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  React.useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }
    if (open) {
      document.addEventListener("keydown", handleEsc)
    } else {
      document.removeEventListener("keydown", handleEsc)
    }
    return () => document.removeEventListener("keydown", handleEsc)
  }, [open])

  const canAssignUsers = currentUserRole === 'admin' || currentUserRole === 'manager'
  const canEdit = currentUserRole === 'admin' || currentUserRole === 'manager'
  const canDelete = currentUserRole === 'admin' || currentUserRole === 'manager'

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUserToggle = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleAssignUsers = () => {
    onAssignUsers(task.id, selectedUserIds)
    setOpen(false)
  }

  const colorOptions = [
    { name: "Default", value: "", bg: "bg-gray-100", border: "border-gray-200" },
    { name: "Red", value: "#fef2f2", bg: "bg-red-100", border: "border-red-200" },
    { name: "Blue", value: "#eff6ff", bg: "bg-blue-100", border: "border-blue-200" },
    { name: "Green", value: "#f0fdf4", bg: "bg-green-100", border: "border-green-200" },
    { name: "Yellow", value: "#fefce8", bg: "bg-yellow-100", border: "border-yellow-200" },
    { name: "Purple", value: "#faf5ff", bg: "bg-purple-100", border: "border-purple-200" },
    { name: "Pink", value: "#fdf2f8", bg: "bg-pink-100", border: "border-pink-200" },
  ]

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "in-review", label: "In Review" },
    { value: "done", label: "Done" },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open task settings"
        className="h-6 w-6 p-0 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-60 hover:opacity-100"
        onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
      >
        <Settings className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 z-50 bg-white dark:bg-gray-900 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 p-2" role="menu">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Task Settings</div>
          {/* Assign Users Section */}
          {canAssignUsers && (
            <>
              <div className="my-1 border-t border-gray-200 dark:border-gray-700" role="separator" />
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Assign Users</span>
                </div>
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-2"
                />
                <ScrollArea className="h-32">
                  <div className="space-y-1">
                    {filteredEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex items-center gap-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(employee.id)}
                          onChange={() => handleUserToggle(employee.id)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700"
                        />
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {employee.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{employee.name}</p>
                          <p className="text-xs text-gray-500 truncate">{employee.email}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {employee.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Button
                  size="sm"
                  className="w-full mt-2"
                  onClick={handleAssignUsers}
                >
                  Assign Selected Users
                </Button>
              </div>
            </>
          )}
          {/* Color Change Section */}
          {onColorChange && (
            <>
              <div className="my-1 border-t border-gray-200 dark:border-gray-700" role="separator" />
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="h-4 w-4" />
                  <span className="text-sm font-medium">Change Color</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      className={`w-8 h-8 rounded border-2 ${color.bg} ${color.border} hover:scale-110 transition-transform ${
                        task.customColor === color.value ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => { onColorChange(task.id, color.value); setOpen(false); }}
                      title={color.name}
                      type="button"
                    />
                  ))}
                </div>
              </div>
            </>
          )}
          {/* Move Task Section */}
          {onMove && (
            <>
              <div className="my-1 border-t border-gray-200 dark:border-gray-700" role="separator" />
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
                      onClick={() => { onMove(task.id, status.value); setOpen(false); }}
                      type="button"
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          {/* Edit/Delete Actions */}
          {(canEdit || canDelete) && (
            <>
              <div className="my-1 border-t border-gray-200 dark:border-gray-700" role="separator" />
              {canEdit && onEdit && (
                <div
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => { onEdit(task); setOpen(false); }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Task
                </div>
              )}
              {canDelete && onDelete && (
                <div
                  className="px-4 py-2 text-sm text-red-600 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => { onDelete(task.id); setOpen(false); }}
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