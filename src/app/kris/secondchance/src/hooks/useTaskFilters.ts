import { useState, useMemo } from 'react';
import type { Task, TaskStatus, TaskLabel } from '../features/tasks/types';
import type { TaskFilters } from '../features/kanban/TaskBoardFilter';

export const useTaskFilters = (tasks: Task[]) => {
  const [filters, setFilters] = useState<TaskFilters>({ 
    searchTerm: '', 
    selectedAssigneeIds: [] 
  });
  
  // Add label filter state
  const [selectedLabels, setSelectedLabels] = useState<TaskLabel[]>([]);

  const filteredTasks = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) {
      return [];
    }
    
    console.log('Filtering tasks:', {
      totalTasks: tasks.length,
      selectedLabels: selectedLabels,
      searchTerm: filters.searchTerm,
      selectedAssigneeIds: filters.selectedAssigneeIds
    });
    
    return tasks.filter(task => {
      if (!task || !task.description) return false;
      
      // Search term filter
      const matchesTitle = task.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      // Assignee filter
      const matchesAssignee = filters.selectedAssigneeIds.length === 0 || 
        (task.assigneeIds && task.assigneeIds.some(id => filters.selectedAssigneeIds.includes(id)));
      
      // Label filter with detailed logging
      let matchesLabels = true;
      if (selectedLabels.length > 0) {
        console.log(`Checking labels for task ${task.id}:`, {
          taskLabels: task.labels,
          selectedLabels: selectedLabels
        });
        
        if (task.labels && Array.isArray(task.labels)) {
          matchesLabels = selectedLabels.some(selectedLabel => {
            const found = task.labels.some(taskLabel => {
              // Try multiple matching strategies
              const matchById = taskLabel.id === selectedLabel.id;
              const matchByName = taskLabel.name === selectedLabel.name;
              const match = matchById || matchByName;
              
              if (match) {
                console.log('Label match found:', { taskLabel, selectedLabel, matchById, matchByName });
              }
              return match;
            });
            
            if (!found) {
              console.log('No match for selectedLabel:', selectedLabel, 'in task', task.id);
            }
            return found;
          });
        } else {
          console.log('Task has no labels or labels is not an array:', task.labels);
          matchesLabels = false;
        }
      }
      
      const result = matchesTitle && matchesAssignee && matchesLabels;
      if (!result && selectedLabels.length > 0) {
        console.log('Task filtered out:', {
          taskId: task.id,
          matchesTitle,
          matchesAssignee,
          matchesLabels
        });
      }
      
      return result;
    });
  }, [tasks, filters, selectedLabels]);

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
    selectedLabels,
    setSelectedLabels,
    filteredTasks,
    tasksByStatus
  };
}; 