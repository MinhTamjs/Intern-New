import { useState, useMemo } from 'react';
import { Search, X, User } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import type { Employee } from '../employees/types';

interface TaskBoardFilterProps {
  employees: Employee[];
  onFilterChange: (filters: TaskFilters) => void;
  className?: string;
}

export interface TaskFilters {
  searchTerm: string;
  selectedAssigneeIds: string[];
}

/**
 * TaskBoardFilter component provides filtering capabilities for the Kanban board
 * Includes search functionality for tasks and employees, plus assignee filtering with stacked avatars
 */
export function TaskBoardFilter({ 
  employees, 
  onFilterChange, 
  className = "" 
}: TaskBoardFilterProps) {
  const [filters, setFilters] = useState<TaskFilters>({
    searchTerm: '',
    selectedAssigneeIds: []
  });

  // Maximum number of visible avatars before showing "+N" badge
  const MAX_VISIBLE_AVATARS = 4;

  // Filter employees based on search term
  const filteredEmployees = useMemo(() => {
    if (!filters.searchTerm.trim()) {
      return employees;
    }
    
    return employees.filter(employee =>
      employee.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(filters.searchTerm.toLowerCase())
    );
  }, [employees, filters.searchTerm]);

  // Split employees into visible and hidden for avatar display
  const { visibleEmployees, hiddenEmployees, hiddenCount } = useMemo(() => {
    const visible = filteredEmployees.slice(0, MAX_VISIBLE_AVATARS);
    const hidden = filteredEmployees.slice(MAX_VISIBLE_AVATARS);
    const hiddenCount = hidden.length;
    return { visibleEmployees: visible, hiddenEmployees: hidden, hiddenCount };
  }, [filteredEmployees]);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, searchTerm: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle assignee selection
  const handleAssigneeSelect = (assigneeId: string) => {
    const newFilters = { 
      ...filters, 
      selectedAssigneeIds: filters.selectedAssigneeIds.includes(assigneeId) 
        ? filters.selectedAssigneeIds.filter(id => id !== assigneeId)
        : [...filters.selectedAssigneeIds, assigneeId]
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };



  // Clear all filters
  const handleClearFilters = () => {
    const newFilters = { searchTerm: '', selectedAssigneeIds: [] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Get initials from employee name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role-based color for avatar
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-600 hover:bg-red-700 shadow-sm';
      case 'manager':
        return 'bg-blue-600 hover:bg-blue-700 shadow-sm';
      case 'employee':
        return 'bg-green-600 hover:bg-green-700 shadow-sm';
      default:
        return 'bg-gray-600 hover:bg-gray-700 shadow-sm';
    }
  };

  // Get selected state styles
  const getSelectedStyles = (assigneeId: string) => {
    const isSelected = filters.selectedAssigneeIds.includes(assigneeId);
    return isSelected 
      ? 'ring-2 ring-offset-1 ring-blue-500 dark:ring-blue-400 scale-110 shadow-lg' 
      : '';
  };

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            value={filters.searchTerm}
            onChange={e => handleSearchChange(e.target.value)}
            className="pl-8 pr-8 py-1.5 rounded-md border border-[#5ce7ff] dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-sm w-44 max-w-xs"
          />
        </div>

        {/* Stacked Avatar Chips */}
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            {visibleEmployees.map((employee, index) => (
              <Tooltip key={employee.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleAssigneeSelect(employee.id)}
                    className={`relative inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-800 text-white text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-110 hover:z-10 ${getRoleColor(employee.role)} ${getSelectedStyles(employee.id)}`}
                    style={{ 
                      zIndex: visibleEmployees.length - index,
                      marginLeft: index > 0 ? '-0.5rem' : '0'
                    }}
                  >
                    {getInitials(employee.name)}
                    {filters.selectedAssigneeIds.includes(employee.id) && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center ring-1 ring-white dark:ring-gray-800">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-xs text-gray-500">{employee.role}</p>
                    <p className="text-xs text-gray-400">{employee.email}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}

            {/* Hidden employees dropdown button (only show when there are hidden employees) */}
            {hiddenCount > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={`relative inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-110 hover:z-10`}
                    style={{ 
                      zIndex: 1,
                      marginLeft: visibleEmployees.length > 0 ? '-0.5rem' : '0'
                    }}
                  >
                    +{hiddenCount}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2" align="start">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      More Employees ({hiddenCount})
                    </div>
                    {hiddenEmployees.map((employee) => (
                      <button
                        key={employee.id}
                        onClick={() => handleAssigneeSelect(employee.id)}
                        className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors ${
                          filters.selectedAssigneeIds.includes(employee.id)
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${getRoleColor(employee.role)}`}>
                          {getInitials(employee.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{employee.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{employee.email}</div>
                        </div>
                        {filters.selectedAssigneeIds.includes(employee.id) && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}


          </div>
        </div>

        {/* Clear Filter Button */}
        {(filters.searchTerm || filters.selectedAssigneeIds.length > 0) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear all filters</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Active Filter Indicator */}
        {filters.selectedAssigneeIds.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <User className="h-4 w-4" />
            <span>
              Filtered by: {filters.selectedAssigneeIds.map(id => employees.find(emp => emp.id === id)?.name).filter(Boolean).join(', ')}
            </span>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
} 