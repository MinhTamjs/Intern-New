import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TaskBoardFilter, type TaskFilters } from '../features/kanban/TaskBoardFilter';
import type { Employee } from '../features/employees/types';
import type { Task } from '../features/tasks/types';

// Sample employee data for demo
const sampleEmployees: Employee[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@company.com', role: 'admin' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'manager' },
  { id: '3', name: 'Mike Davis', email: 'mike.davis@company.com', role: 'employee' },
  { id: '4', name: 'Emily Wilson', email: 'emily.wilson@company.com', role: 'employee' },
  { id: '5', name: 'David Brown', email: 'david.brown@company.com', role: 'manager' },
  { id: '6', name: 'Lisa Anderson', email: 'lisa.anderson@company.com', role: 'employee' },
  { id: '7', name: 'Tom Martinez', email: 'tom.martinez@company.com', role: 'employee' },
  { id: '8', name: 'Anna Taylor', email: 'anna.taylor@company.com', role: 'employee' },
];

// Sample task data for demo
const sampleTasks: Task[] = [
  { id: '1', title: 'Design new landing page', description: 'Create wireframes and mockups for the new landing page', assigneeIds: ['1'], status: 'pending' },
  { id: '2', title: 'Implement user authentication', description: 'Set up JWT authentication system', assigneeIds: ['2'], status: 'in-progress' },
  { id: '3', title: 'Write API documentation', description: 'Document all REST API endpoints', assigneeIds: ['3'], status: 'in-review' },
  { id: '4', title: 'Fix navigation bug', description: 'Resolve issue with mobile navigation menu', assigneeIds: ['4'], status: 'done' },
  { id: '5', title: 'Optimize database queries', description: 'Improve performance of slow database queries', assigneeIds: ['5'], status: 'pending' },
  { id: '6', title: 'Add unit tests', description: 'Write comprehensive unit tests for core modules', assigneeIds: ['6'], status: 'in-progress' },
  { id: '7', title: 'Update dependencies', description: 'Update all npm packages to latest versions', assigneeIds: ['7'], status: 'in-review' },
  { id: '8', title: 'Deploy to staging', description: 'Deploy the latest changes to staging environment', assigneeIds: ['8'], status: 'done' },
];

/**
 * Demo component showcasing the TaskBoardFilter functionality
 * Displays sample data and demonstrates filtering capabilities
 */
export function TaskBoardFilterDemo() {
  const [filters, setFilters] = useState<TaskFilters>({
    searchTerm: '',
    selectedAssigneeIds: []
  });

  // Filter tasks based on current filters
  const filteredTasks = sampleTasks.filter(task => {
    // Filter by assignee if selected
    if (filters.selectedAssigneeIds.length > 0 && !task.assigneeIds.some(id => filters.selectedAssigneeIds.includes(id))) {
      return false;
    }
    
    // Filter by search term
    if (filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase();
      const assignees = task.assigneeIds.map(id => sampleEmployees.find(emp => emp.id === id)).filter(Boolean);
      const assigneeNames = assignees.map(emp => emp?.name.toLowerCase() || '').join(' ');
      
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        assigneeNames.includes(searchLower)
      );
    }
    
    return true;
  });

  const handleFilterChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          TaskBoard Filter Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Interactive demo of the filtering component with search and assignee selection
        </p>
      </div>

      {/* Filter Component */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Controls</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <TaskBoardFilter
            employees={sampleEmployees}
            onFilterChange={handleFilterChange}
          />
        </CardContent>
      </Card>

      {/* Filter Status */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Search Term:</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filters.searchTerm || 'None'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Selected Assignees:</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filters.selectedAssigneeIds.length > 0 
                  ? filters.selectedAssigneeIds.map(id => sampleEmployees.find(emp => emp.id === id)?.name).filter(Boolean).join(', ')
                  : 'None'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Filtered Results:</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredTasks.length} of {sampleTasks.length} tasks
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtered Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Filtered Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No tasks match your current filters
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map(task => {
                const assignees = task.assigneeIds.map(id => sampleEmployees.find(emp => emp.id === id)).filter(Boolean);
                return (
                  <div
                    key={task.id}
                    className="p-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Status: <span className="font-medium">{task.status}</span>
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Assignees: <span className="font-medium">{assignees.map(emp => emp?.name).filter(Boolean).join(', ')}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                         <div className="flex items-start gap-2">
               <span className="text-blue-500 font-medium">1.</span>
               <span>Use the search box to filter tasks by title, description, or employee name</span>
             </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-medium">2.</span>
              <span>Click on any avatar to filter tasks by that specific assignee</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-medium">3.</span>
              <span>Click the X button to clear all filters and show all tasks</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-medium">4.</span>
              <span>Hover over avatars to see employee details in tooltips</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-medium">5.</span>
              <span>Selected avatars are highlighted with a blue ring and indicator</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 