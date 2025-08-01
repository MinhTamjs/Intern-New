import { useState, useMemo, useCallback } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Label } from './Label';
import { getAllLabels, type TaskLabel } from '../labels';
import type { Task } from '../types';

// Types
interface LabelSelectorProps {
  selectedLabels: TaskLabel[];
  onLabelsChange: (labels: TaskLabel[]) => void;
  className?: string;
  tasks?: Task[]; // Add tasks prop to extract custom labels
}

interface CustomLabelFormProps {
  onSubmit: (label: TaskLabel) => void;
  onCancel: () => void;
}

interface LabelGridProps {
  labels: TaskLabel[];
  selectedLabels: TaskLabel[];
  onLabelToggle: (label: TaskLabel) => void;
}

interface CategoryFilterProps {
  categories: readonly string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

// Constants
const CATEGORIES = ['all', 'priority', 'type', 'status', 'team', 'custom'] as const;
const COLOR_OPTIONS = [
  '#dc2626', '#ea580c', '#d97706', '#16a34a', '#059669', '#0891b2', 
  '#2563eb', '#7c3aed', '#ec4899', '#6b7280', '#374151', '#1f2937'
] as const;

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

// Custom hook for label filtering
function useLabelFilter(searchTerm: string, selectedCategory: string, tasks: Task[] = []) {
  return useMemo(() => {
    const allLabels = getAllAvailableLabels(tasks);
    return allLabels.filter(label => {
      const matchesSearch = label.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || label.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, tasks]);
}

// Custom hook for custom label form
function useCustomLabelForm(onSubmit: (label: TaskLabel) => void) {
  const [showForm, setShowForm] = useState(false);
  const [labelName, setLabelName] = useState('');
  const [labelColor, setLabelColor] = useState('#3b82f6');

  const handleSubmit = useCallback(() => {
    if (labelName.trim()) {
      const newLabel: TaskLabel = {
        id: `custom-${Date.now()}`,
        name: labelName.trim(),
        color: labelColor,
        category: 'custom',
        bgColor: `${labelColor}20`,
        textColor: labelColor,
      };
      onSubmit(newLabel);
      setLabelName('');
      setLabelColor('#3b82f6');
      setShowForm(false);
    }
  }, [labelName, labelColor, onSubmit]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setLabelName('');
    setLabelColor('#3b82f6');
  }, []);

  return {
    showForm,
    labelName,
    labelColor,
    setShowForm,
    setLabelName,
    setLabelColor,
    handleSubmit,
    handleCancel,
  };
}

// Sub-components
function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Categories
      </h4>
      <div className="flex flex-wrap gap-2 overflow-x-auto">
        {categories.map(category => (
          <Badge
            key={category}
            variant={selectedCategory === category ? 'default' : 'secondary'}
            className="cursor-pointer text-xs flex-shrink-0"
            onClick={() => onCategoryChange(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function CustomLabelForm({ onSubmit }: Omit<CustomLabelFormProps, 'onCancel'>) {
  const {
    showForm,
    labelName,
    labelColor,
    setShowForm,
    setLabelName,
    setLabelColor,
    handleSubmit,
    handleCancel,
  } = useCustomLabelForm(onSubmit);

  if (!showForm) {
    return (
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Create Custom Label
          </h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Custom
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Create Custom Label
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancel}
          className="flex items-center gap-1"
        >
          <X className="h-3 w-3" />
          Cancel
        </Button>
      </div>
      
      <div className="space-y-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <div>
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">
            Label Name
          </label>
          <Input
            placeholder="Enter label name..."
            value={labelName}
            onChange={(e) => setLabelName(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  labelColor === color 
                    ? 'border-gray-900 dark:border-white scale-110' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setLabelColor(color)}
                type="button"
              />
            ))}
          </div>
        </div>
        
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!labelName.trim()}
          className="w-full"
        >
          Create Label
        </Button>
      </div>
    </div>
  );
}

function LabelGrid({ labels, selectedLabels, onLabelToggle }: LabelGridProps) {
  const isLabelSelected = useCallback((label: TaskLabel) => {
    return selectedLabels.some(l => l.id === label.id);
  }, [selectedLabels]);

  if (labels.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No labels found
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto overflow-x-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-max">
        {labels.map(label => {
          const selected = isLabelSelected(label);
          return (
            <div
              key={label.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border cursor-pointer
                transition-all duration-200 hover:shadow-sm min-w-0
                ${selected 
                  ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
              onClick={() => onLabelToggle(label)}
            >
              <Label label={label} />
              {selected && (
                <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SelectedLabelsSummary({ 
  selectedLabels, 
  onRemoveLabel 
}: { 
  selectedLabels: TaskLabel[]; 
  onRemoveLabel: (labelId: string) => void; 
}) {
  if (selectedLabels.length === 0) return null;

  return (
    <div className="border-t pt-4">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Selected Labels ({selectedLabels.length})
      </h4>
      <div className="flex flex-wrap gap-1 overflow-x-auto">
        {selectedLabels.map(label => (
          <Label
            key={label.id}
            label={label}
            onRemove={() => onRemoveLabel(label.id)}
            showRemoveButton={true}
          />
        ))}
      </div>
    </div>
  );
}

// Main component
export function LabelSelector({ selectedLabels, onLabelsChange, className = '', tasks = [] }: LabelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Custom hooks
  const filteredLabels = useLabelFilter(searchTerm, selectedCategory, tasks);

  // Event handlers
  const handleLabelToggle = useCallback((label: TaskLabel) => {
    const isSelected = selectedLabels.some(l => l.id === label.id);
    
    if (isSelected) {
      onLabelsChange(selectedLabels.filter(l => l.id !== label.id));
    } else {
      onLabelsChange([...selectedLabels, label]);
    }
  }, [selectedLabels, onLabelsChange]);

  const handleCustomLabelSubmit = useCallback((newLabel: TaskLabel) => {
    onLabelsChange([...selectedLabels, newLabel]);
  }, [selectedLabels, onLabelsChange]);

  const handleRemoveLabel = useCallback((labelId: string) => {
    onLabelsChange(selectedLabels.filter(l => l.id !== labelId));
  }, [selectedLabels, onLabelsChange]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  return (
    <div className={className}>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 h-8"
      >
        <Plus className="h-3 w-3" />
        Labels
        {selectedLabels.length > 0 && (
          <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
            {selectedLabels.length}
          </Badge>
        )}
      </Button>

      {/* Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Select Labels</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search labels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>

            {/* Category Filter */}
            <CategoryFilter
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />

            {/* Custom Label Creation */}
            <CustomLabelForm
              onSubmit={handleCustomLabelSubmit}
            />

            {/* Labels Grid */}
            <LabelGrid
              labels={filteredLabels}
              selectedLabels={selectedLabels}
              onLabelToggle={handleLabelToggle}
            />

            {/* Selected Labels Summary */}
            <SelectedLabelsSummary
              selectedLabels={selectedLabels}
              onRemoveLabel={handleRemoveLabel}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 