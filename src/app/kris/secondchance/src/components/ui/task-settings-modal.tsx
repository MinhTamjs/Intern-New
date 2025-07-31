import * as React from "react"
import { Button } from "./button"
import { Settings, Users, Palette, Edit, Trash2, Move } from "lucide-react"
import { Avatar, AvatarFallback } from "./avatar"
import { Badge } from "./badge"
import { Input } from "./input"
import { ScrollArea } from "./scroll-area"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "./dialog"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog"
import type { Task } from "../../features/tasks/types"
import type { Employee } from "../../features/employees/types"

interface TaskSettingsModalProps {
  task: Task
  employees: Employee[]
  currentUserRole: 'admin' | 'manager' | 'employee'
  isOpen: boolean
  onClose: () => void
  onAssignUsers: (taskId: string, userIds: string[]) => void
  onColorChange?: (taskId: string, color: string) => void
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  onMove?: (taskId: string, newStatus: string) => void
}

export function TaskSettingsModal({
  task,
  employees,
  currentUserRole,
  isOpen,
  onClose,
  onAssignUsers,
  onColorChange,
  onEdit,
  onDelete,
  onMove,
}: TaskSettingsModalProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>(
    task.assigneeIds || []
  )
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      setSelectedUserIds(task.assigneeIds || [])
      setSearchTerm("")
    }
  }, [isOpen, task.assigneeIds])

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
  }

  const handleDelete = () => {
    onDelete?.(task.id)
    setShowDeleteDialog(false)
    onClose()
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
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Task Settings
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Task Info */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                {task.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {task.description}
              </p>
            </div>

            {/* Assign Users Section */}
            {canAssignUsers && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Assign Users</span>
                </div>
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {filteredEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
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
                  className="w-full"
                  onClick={handleAssignUsers}
                >
                  Assign Selected Users
                </Button>
              </div>
            )}

            {/* Color Change Section */}
            {onColorChange && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="text-sm font-medium">Change Color</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      className={`w-10 h-10 rounded-md border-2 ${color.bg} ${color.border} hover:scale-110 transition-transform ${
                        task.customColor === color.value ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => onColorChange(task.id, color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Move Task Section */}
            {onMove && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Move className="h-4 w-4" />
                  <span className="text-sm font-medium">Move Task</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-left"
                      onClick={() => onMove(task.id, status.value)}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {canEdit && onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onEdit(task)
                  onClose()
                }}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Task
              </Button>
            )}
            
            {canDelete && onDelete && (
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Task
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Task</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{task.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 