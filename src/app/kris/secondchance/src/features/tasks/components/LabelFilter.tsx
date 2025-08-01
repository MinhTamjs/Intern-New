import { useState, useEffect, useMemo } from 'react';
import { Filter, X, Search, Check } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Checkbox } from '../../../components/ui/checkbox';
import { Label } from './Label';
import { getAllLabels, type TaskLabel } from '../labels';
import type { Task } from '../types';

interface LabelFilterProps {
  selectedLabels: TaskLabel[];
  onLabelsChange: (labels: TaskLabel[]) => void;
  className?: string;
  tasks?: Task[]; // Add tasks prop to extract custom labels
}

// Function to extract all unique labels from tasks
function extractLabelsFromTasks(tasks: Task[]): TaskLabel[] {
  const labelMap = new Map<string, TaskLabel>();
  
  tasks.forEach(task => {
    if (task.labels && Array.isArray(task.labels)) {
      task.labels.forEach(label => {
        if (label && label.id && label.name) {
          // Use label ID as key to avoid duplicates
          labelMap.set(label.id, label);
        }
      });
    }
  });
  
  return Array.from(labelMap.values());
}

// Function to get all available labels (predefined + custom from tasks)
function getAllAvailableLabels(tasks: Task[] = []): TaskLabel[] {
  const predefinedLabels = getAllLabels();
  const customLabelsFromTasks = extractLabelsFromTasks(tasks);
  
  // Combine predefined and custom labels, avoiding duplicates
  const allLabelsMap = new Map<string, TaskLabel>();
  
  // Add predefined labels first
  predefinedLabels.forEach(label => {
    allLabelsMap.set(label.id, label);
  });
  
  // Add custom labels from tasks, overwriting if they have the same ID
  customLabelsFromTasks.forEach(label => {
    allLabelsMap.set(label.id, label);
  });
  
  return Array.from(allLabelsMap.values());
}

export function LabelFilter({ selectedLabels, onLabelsChange, className = '', tasks = [] }: LabelFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get all available labels including custom ones from tasks
  const allLabels = useMemo(() => getAllAvailableLabels(tasks), [tasks]);

  // Filter labels based ONLY on search term - NOT on selection status
  // This ensures the dropdown list remains static and predictable
  const filteredLabels = useMemo(() => {
    if (!searchTerm.trim()) {
      // If no search term, show all labels
      return allLabels;
    }
    
    // Only filter by search term, never by selection status
    return allLabels.filter(label =>
      label.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      label.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allLabels, searchTerm]);

  const handleLabelToggle = (label: TaskLabel) => {
    const isSelected = selectedLabels.some(l => l.id === label.id);
    
    if (isSelected) {
      onLabelsChange(selectedLabels.filter(l => l.id !== label.id));
    } else {
      onLabelsChange([...selectedLabels, label]);
    }
  };

  const clearAllFilters = () => {
    onLabelsChange([]);
    setSearchTerm('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.label-filter-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Debug logging to help understand the behavior
  useEffect(() => {
    if (isOpen) {
      console.log('LabelFilter Debug:', {
        totalLabels: allLabels.length,
        filteredLabels: filteredLabels.length,
        selectedLabels: selectedLabels.length,
        searchTerm,
        isSearching: searchTerm.trim().length > 0,
        customLabelsFromTasks: extractLabelsFromTasks(tasks).length
      });
    }
  }, [isOpen, allLabels.length, filteredLabels.length, selectedLabels.length, searchTerm, tasks]);

  return (
    <div className={`relative label-filter-container ${className}`}>
      {/* Filter Button - removed visual indicators */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-8"
      >
        <Filter className="h-3 w-3" />
        Filter by Labels
      </Button>

      {/* Filter Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Filter by Labels</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <Input
                placeholder="Search labels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-sm"
              />
            </div>

            {/* Labels List - This list is static and doesn't change based on selection */}
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {filteredLabels.length > 0 ? (
                filteredLabels.map(label => {
                  const isSelected = selectedLabels.some(l => l.id === label.id);
                  return (
                    <div
                      key={label.id}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => handleLabelToggle(label)}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleLabelToggle(label)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4"
                        />
                        <Label label={label} />
                        <span className="text-xs text-gray-500 capitalize">({label.category})</span>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  {searchTerm 
                    ? 'No labels found matching your search' 
                    : 'No labels available'
                  }
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {selectedLabels.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="flex-1"
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="flex-1"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 