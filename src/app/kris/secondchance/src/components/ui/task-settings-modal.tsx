/**
 * TaskSettingsModal Component
 * 
 * A comprehensive modal for viewing and editing task details with advanced features:
 * - Task description editing with validation
 * - User assignment management
 * - JIRA-style label system with color coding
 * - Priority and due date management
 * - Role-based permissions
 * - Empty description confirmation dialog
 * 
 * @component
 * @param {TaskSettingsModalProps} props - Component props
 * @returns {JSX.Element} The modal component
 */

import * as React from "react"
import { Button } from "./button"
import { Settings, Users, Trash2, Move, Clock, Save, Calendar, Tag, AlertTriangle, X, Plus, Check, FileText } from "lucide-react"
import { Avatar, AvatarFallback } from "./avatar"
import { Badge } from "./badge"
import { Input } from "./input"
import { Textarea } from "./textarea"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import type { Task, TaskLabel } from "../../features/tasks/types"
import type { Employee } from "../../features/employees/types"
import { Label } from "../../features/tasks/components/Label"

interface TaskSettingsModalProps {
  task: Task
  employees: Employee[]
  currentUserRole: 'admin' | 'manager' | 'employee'
  isOpen: boolean
  onClose: () => void
  onAssignUsers: (taskId: string, userIds: string[]) => void
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  onMove?: (taskId: string, newStatus: string) => void
  onUpdateLabels?: (taskId: string, labels: TaskLabel[]) => void
  onUpdatePriority?: (taskId: string, priority: string) => void
  onUpdateDueDate?: (taskId: string, dueDate: Date | null) => void
}

export function TaskSettingsModal({
  task,
  employees,
  currentUserRole,
  isOpen,
  onClose,
  onAssignUsers,
  onEdit,
  onDelete,
  onMove,
  onUpdateLabels,
  onUpdatePriority,
  onUpdateDueDate,
}: TaskSettingsModalProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>(
    task.assigneeIds || []
  )
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [showEmptyDescriptionDialog, setShowEmptyDescriptionDialog] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editData, setEditData] = React.useState({
    description: task.description || ''
  })

  // New state for enhanced features
  const [taskLabels, setTaskLabels] = React.useState<TaskLabel[]>(() => {
    // Ensure task.labels is always an array
    if (task.labels && Array.isArray(task.labels)) {
      return task.labels as TaskLabel[];
    }
    return [];
  })
  const [taskPriority, setTaskPriority] = React.useState<'low' | 'medium' | 'high'>(
    (task.priority as 'low' | 'medium' | 'high') || 'medium'
  )
  const [taskDueDate, setTaskDueDate] = React.useState<Date | null>(
    task.dueDate ? new Date(task.dueDate) : null
  )
  
  // Global labels management state
  const [globalLabels, setGlobalLabels] = React.useState<TaskLabel[]>([
    { id: '1', name: 'Design', color: '#3B82F6', category: 'type', bgColor: '#eff6ff', textColor: '#3B82F6' },
    { id: '2', name: 'Bug', color: '#EF4444', category: 'type', bgColor: '#fef2f2', textColor: '#EF4444' },
    { id: '3', name: 'Urgent', color: '#DC2626', category: 'priority', bgColor: '#fef2f2', textColor: '#DC2626' },
    { id: '4', name: 'Feature', color: '#10B981', category: 'type', bgColor: '#f0fdf4', textColor: '#10B981' },
    { id: '5', name: 'Documentation', color: '#8B5CF6', category: 'type', bgColor: '#faf5ff', textColor: '#8B5CF6' },
    { id: '6', name: 'Testing', color: '#F59E0B', category: 'type', bgColor: '#fffbeb', textColor: '#F59E0B' }
  ])
  
  // Label picker state
  const [showLabelPicker, setShowLabelPicker] = React.useState(false)
  const [labelSearchTerm, setLabelSearchTerm] = React.useState("")
  const [selectedLabelsInPicker, setSelectedLabelsInPicker] = React.useState<TaskLabel[]>([])
  const [newLabelName, setNewLabelName] = React.useState("")
  const [newLabelColor, setNewLabelColor] = React.useState("#3B82F6")
  const [newLabelCategory, setNewLabelCategory] = React.useState<'type' | 'priority' | 'status' | 'team' | 'custom'>('type')
  const [showCreateLabelModal, setShowCreateLabelModal] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      console.log('TaskSettingsModal opening with task:', {
        taskId: task.id,
        labels: task.labels,
        labelsType: typeof task.labels,
        isArray: Array.isArray(task.labels)
      });
      
      setSelectedUserIds(task.assigneeIds || [])
      setSearchTerm("")
      setEditData({
        description: task.description || ''
      })
      setTaskLabels(() => {
        // Ensure task.labels is always an array
        if (task.labels && Array.isArray(task.labels)) {
          return task.labels as TaskLabel[];
        }
        return [];
      })
      setTaskPriority(task.priority || 'medium')
      setTaskDueDate(task.dueDate ? new Date(task.dueDate) : null)
      setIsEditing(false)
    }
  }, [isOpen, task.id, task.assigneeIds, task.description, task.labels, task.priority, task.dueDate])

  const canAssignUsers = currentUserRole === 'admin' || currentUserRole === 'manager'
  const canEdit = currentUserRole === 'admin' || currentUserRole === 'manager'
  const canDelete = currentUserRole === 'admin' || currentUserRole === 'manager'
  
  // Check if task is completed (status === 'done')
  const isTaskCompleted = task.status === 'done'
  
  // Disable editing features for completed tasks (except admin delete)
  const canEditTask = canEdit && !isTaskCompleted
  const canAssignUsersToTask = canAssignUsers && !isTaskCompleted
  const canMoveTask = !isTaskCompleted // Disable move for completed tasks
  
  // Debug logging for permissions
  console.log('TaskSettingsModal permissions:', {
    currentUserRole,
    canEdit,
    canDelete,
    canAssignUsers,
    isTaskCompleted,
    canEditTask,
    canAssignUsersToTask,
    canMoveTask
  })

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
    if (onDelete) {
      onDelete(task.id)
    }
    setShowDeleteDialog(false)
    onClose()
  }

  /**
   * Handles the application of task settings changes
   * Validates empty description and triggers confirmation dialog if needed
   * Updates task with all modified data including labels, priority, and due date
   */
  const handleApplySettings = () => {
    console.log('handleApplySettings called', {
      onEdit: !!onEdit,
      editData,
      task: task.id
    });

    // Check if description is empty (no characters, no whitespace)
    const trimmedDescription = editData.description.trim();

    if (trimmedDescription === '') {
      // Show confirmation dialog for empty description
      setShowEmptyDescriptionDialog(true);
      return;
    }

    if (onEdit) {
      const updatedTask = {
        ...task,
        description: editData.description,
        labels: taskLabels,
        priority: taskPriority,
        dueDate: taskDueDate ? taskDueDate.toISOString() : ''
      };
      console.log('Calling onEdit with:', updatedTask);
      onEdit(updatedTask);
    } else {
      console.error('onEdit function is not provided');
    }
    setIsEditing(false)
    onClose()
  }

  const handleEmptyDescriptionConfirm = () => {
    // User confirmed they want to delete the task
    if (onDelete) {
      onDelete(task.id);
    }
    setShowEmptyDescriptionDialog(false);
    setIsEditing(false);
    onClose();
  }

  const handleEmptyDescriptionCancel = () => {
    // User cancelled, close the confirmation dialog and stay in edit mode
    setShowEmptyDescriptionDialog(false);
  }

  // Label management functions
  /**
   * Adds a label to the current task
   * @param {TaskLabel} label - The label to add
   */
  const handleAddLabel = (label: TaskLabel) => {
    if (!taskLabels.find(l => l.id === label.id)) {
      const updatedLabels = [...taskLabels, label];
      setTaskLabels(updatedLabels);
      if (onUpdateLabels) {
        onUpdateLabels(task.id, updatedLabels);
      }
    }
  }

  /**
   * Removes a label from the current task
   * @param {string} labelId - The ID of the label to remove
   */
  const handleRemoveLabel = (labelId: string) => {
    const updatedLabels = taskLabels.filter(l => l.id !== labelId);
    setTaskLabels(updatedLabels);
    if (onUpdateLabels) {
      onUpdateLabels(task.id, updatedLabels);
    }
  }

  const handleCreateLabel = () => {
    if (newLabelName.trim()) {
      const newLabel: TaskLabel = {
        id: Date.now().toString(),
        name: newLabelName.trim(),
        color: newLabelColor,
        category: newLabelCategory,
        bgColor: `${newLabelColor}20`,
        textColor: newLabelColor
      };
      // Add to global labels
      setGlobalLabels(prev => [...prev, newLabel]);
      // Add to task labels
      handleAddLabel(newLabel);
      setNewLabelName("");
      setNewLabelColor("#3B82F6");
      setNewLabelCategory('type');
      setShowCreateLabelModal(false);
    }
  }

  // Filter labels based on search term
  const filteredGlobalLabels = globalLabels.filter(labels =>
    labels.name.toLowerCase().includes(labelSearchTerm.toLowerCase())
  );

  const colorOptions = [
    '#dc2626', '#ea580c', '#d97706', '#16a34a', '#059669', '#0891b2', 
    '#2563eb', '#7c3aed', '#ec4899', '#6b7280', '#374151', '#1f2937'
  ]

  /**
   * Handles priority change for the task
   * @param {string} priority - The new priority value
   */
  const handlePriorityChange = (priority: 'low' | 'medium' | 'high') => {
    setTaskPriority(priority as 'low' | 'medium' | 'high');
    if (onUpdatePriority) {
      onUpdatePriority(task.id, priority);
    }
  }

  /**
   * Handles due date change for the task
   * @param {Date | null} date - The new due date
   */
  const handleDueDateChange = (date: Date | null) => {
    setTaskDueDate(date);
    if (onUpdateDueDate) {
      onUpdateDueDate(task.id, date);
    }
  }

  const isOverdue = taskDueDate && new Date() > taskDueDate;

  const statusOptions = [
    { value: 'pending', labels: 'Pending' },
    { value: 'in-progress', labels: 'In Progress' },
    { value: 'in-review', labels: 'In Review' },
    { value: 'done', labels: 'Done' }
  ]

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <span>{isEditing ? 'Edit Task' : 'Task Details'}</span>
              <Badge className={`${
                task.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                task.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                task.status === 'in-review' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              }`}>
                {task.status.replace('-', ' ')}
              </Badge>
              {currentUserRole === 'employee' && (
                <Badge variant="outline" className="text-xs text-gray-500 dark:text-gray-400">
                  Read Only
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

                    <div className="min-w-0 overflow-x-auto">
            {/* Task Details Section */}
            <div className="flex flex-col space-y-1">
              
              {/* Description Section */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Description
                  </label>
                  {canEditTask && onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="h-6 px-2"
                    >
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  )}
                </div>
                
                {isEditing ? (
                  <Textarea
                    value={editData.description}
                    onChange={(e) => {
                      console.log('Textarea onChange:', e.target.value);
                      setEditData({ ...editData, description: e.target.value });
                    }}
                    rows={4}
                    className="w-full min-h-[100px] p-2 border rounded-md resize-none overflow-y-auto break-words"
                    placeholder="Add a description..."
                    autoFocus
                    style={{
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      whiteSpace: 'pre-wrap'
                    }}
                  />
                ) : (
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {task.description || 'No description provided'}
                    </p>
                  </div>
                )}
              </div>

              {/* Last Updated */}
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last Updated
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>

              {/* Labels Section */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    Labels
                  </label>
                  {canEditTask && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowLabelPicker(true)
                        setSelectedLabelsInPicker([])
                        setLabelSearchTerm("")
                      }}
                      className="h-6 px-2"
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </Button>
                  )}
                </div>
                
                {/* Selected Labels Display */}
                {taskLabels && Array.isArray(taskLabels) && taskLabels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {taskLabels.map(label => (
                      <Label
                        key={label.id}
                        label={label}
                        onRemove={canEditTask ? handleRemoveLabel : undefined}
                        showRemoveButton={canEditTask}
                        className="text-xs"
                      />
                    ))}
                  </div>
                )}

                {/* Label Picker */}
                {showLabelPicker && canEditTask && (
                  <div className="mt-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Input
                        placeholder="Search labels..."
                        value={labelSearchTerm}
                        onChange={(e) => setLabelSearchTerm(e.target.value)}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={() => setLabelSearchTerm("")}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {/* Selected Labels Preview */}
                    {selectedLabelsInPicker.length > 0 && (
                      <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                        <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                          Selected Labels:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {selectedLabelsInPicker.map(label => (
                            <div
                              key={label.id}
                              className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded-md text-xs"
                            >
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: label.color }}
                              />
                              <span>{label.name}</span>
                              <button
                                onClick={() => setSelectedLabelsInPicker(prev => prev.filter(l => l.id !== label.id))}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                      {filteredGlobalLabels.map(label => (
                        <div
                          key={label.id}
                          className={`flex items-center gap-2 p-1 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            selectedLabelsInPicker.some(l => l.id === label.id) 
                              ? 'bg-blue-100 dark:bg-blue-800' 
                              : ''
                          }`}
                          onClick={() => {
                            if (selectedLabelsInPicker.some(l => l.id === label.id)) {
                              setSelectedLabelsInPicker(prev => prev.filter(l => l.id !== label.id))
                            } else {
                              setSelectedLabelsInPicker(prev => [...prev, label])
                            }
                          }}
                        >
                          <div
                            className="w-5 h-5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: label.color }}
                          />
                          <span className="text-xs">{label.name}</span>
                          {selectedLabelsInPicker.some(l => l.id === label.id) && (
                            <Check className="h-3 w-3 text-blue-600" />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-1">
                      <Button size="sm" onClick={() => {
                        setShowLabelPicker(false)
                        setSelectedLabelsInPicker([])
                        setLabelSearchTerm("")
                      }}>
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => {
                          const newLabels = [...taskLabels, ...selectedLabelsInPicker.filter(label => 
                            !taskLabels.some(existing => existing.id === label.id)
                          )]
                          setTaskLabels(newLabels)
                          // Also call onUpdateLabels to save immediately
                          if (onUpdateLabels) {
                            onUpdateLabels(task.id, newLabels)
                          }
                          setSelectedLabelsInPicker([])
                          setShowLabelPicker(false)
                        }}
                        disabled={selectedLabelsInPicker.length === 0}
                      >
                        Apply ({selectedLabelsInPicker.length})
                      </Button>
                      <Button size="sm" onClick={() => setShowCreateLabelModal(true)}>
                        Create New Label
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Priority Section */}
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Priority
                </label>
                {canEditTask ? (
                  <Select value={taskPriority} onValueChange={handlePriorityChange}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">⬇️</span>
                          Low
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-600">➖</span>
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <span className="text-red-600">⬆️</span>
                          High
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${taskPriority === 'high' ? 'text-red-600' : taskPriority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                        {taskPriority === 'high' ? '⬆️' : taskPriority === 'medium' ? '➖' : '⬇️'}
                      </span>
                      <span className="text-sm font-medium capitalize">{taskPriority}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Due Date Section */}
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Due Date
                </label>
                {canEditTask ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={taskDueDate ? taskDueDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : null;
                        handleDueDateChange(date);
                      }}
                      className={`h-8 ${isOverdue ? 'border-red-500 text-red-600' : ''}`}
                    />
                    {taskDueDate && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDueDateChange(null)}
                        className="h-8 px-2"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <p className="text-sm">
                      {taskDueDate ? new Date(taskDueDate).toLocaleDateString() : 'No due date set'}
                    </p>
                  </div>
                )}
                {isOverdue && (
                  <p className="text-xs text-red-600 mt-1">
                    ⚠️ Overdue
                  </p>
                )}
              </div>

              {/* Assign Users Section */}
              {canAssignUsersToTask && (
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    <span className="text-xs font-medium">Assign Users</span>
                  </div>
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <ScrollArea className="h-24 overflow-x-auto mt-0">
                    <div className="space-y-1 min-w-0">
                      {filteredEmployees.map((employee) => (
                        <div
                          key={employee.id}
                          className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(employee.id)}
                            onChange={() => handleUserToggle(employee.id)}
                            className="h-4 w-4 rounded border-[#5ce7ff] text-indigo-600 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700"
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
                    className="w-full mt-0"
                    onClick={handleAssignUsers}
                  >
                    Assign Selected Users
                  </Button>
                </div>
              )}

              {/* Color Change Section */}
              {/* Removed as per edit hint */}

              {/* Move Task Section */}
              {canMoveTask && onMove && (
                <div>
                  <div className="flex items-center gap-2">
                    <Move className="h-3 w-3" />
                    <span className="text-xs font-medium">Move Task</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {statusOptions.map((status) => (
                      <button
                        key={status.value}
                        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-xs text-left"
                        onClick={() => onMove(task.id, status.value)}
                      >
                        {status.labels}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {canEditTask && onEdit && isEditing && (
              <Button
                variant="default"
                size="sm"
                onClick={handleApplySettings}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Apply Settings
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
                      Are you sure you want to delete this task? This action cannot be undone.
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

      {/* Label Creation Modal */}
      <Dialog open={showCreateLabelModal} onOpenChange={setShowCreateLabelModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              {/* editingLabel ? 'Edit Label' : */}
              Create New Label
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Label Name */}
            <div>
              <label className="text-sm font-medium">Label Name</label>
              <Input
                placeholder="Enter labels name..."
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Category Selection */}
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={newLabelCategory} onValueChange={(value: 'type' | 'priority' | 'status' | 'team' | 'custom') => setNewLabelCategory(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Color Selection */}
            <div>
              <label className="text-sm font-medium">Color</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      newLabelColor === color ? 'border-gray-800 scale-110' : 'border-[#5ce7ff]'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewLabelColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateLabelModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateLabel}
              disabled={!newLabelName.trim()}
            >
              Create Label
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Empty Description Confirmation Dialog */}
      <AlertDialog open={showEmptyDescriptionDialog} onOpenChange={setShowEmptyDescriptionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Empty Task Description</AlertDialogTitle>
            <AlertDialogDescription>
              The task description is empty. Do you want to delete this task instead?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleEmptyDescriptionCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleEmptyDescriptionConfirm} className="bg-red-600 hover:bg-red-700">
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 