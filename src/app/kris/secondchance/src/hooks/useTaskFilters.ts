import { useState, useMemo } from 'react';
import type { Task, TaskStatus } from '../features/tasks/types';
import type { TaskFilters } from '../features/kanban/TaskBoardFilter';

export const useTaskFilters = (tasks: Task[]) => {
  const [filters, setFilters] = useState<TaskFilters>({ 
    searchTerm: '', 
    selectedAssigneeIds: [] 
  });

  const filteredTasks = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) {
      return [];
    }
    
    return tasks.filter(task => {
      if (!task || !task.title) return false;
      
      const matchesTitle = task.title.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesAssignee = filters.selectedAssigneeIds.length === 0 || 
        (task.assigneeIds && task.assigneeIds.some(id => filters.selectedAssigneeIds.includes(id)));
      return matchesTitle && matchesAssignee;
    });
  }, [tasks, filters]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      'pending': [],
      'in-progress': [],
      'in-review': [],
      'done': []
    };
    
    filteredTasks.forEach(task => {
      if (!task || !task.status) {
        // Fallback to pending if task or status is invalid
        grouped['pending'].push(task);
        return;
      }
      
      // Ensure the status is valid before pushing
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      } else {
        // Fallback to pending if status is invalid
        grouped['pending'].push(task);
      }
    });
    
    return grouped;
  }, [filteredTasks]);

  return {
    filters,
    setFilters,
    filteredTasks,
    tasksByStatus
  };
}; 