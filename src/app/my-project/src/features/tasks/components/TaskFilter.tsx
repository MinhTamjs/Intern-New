import { useState } from 'react';
import { Input } from '../../../components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';
import { TASK_STATUSES } from '../../../lib/constants';
import { useEmployees } from '../../employees/hooks/useEmployees';
import type { Employee } from '../../employees/types';
import { Filter, X, Search } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface TaskFilters {
  status: string;
  assigneeId: string;
  keyword: string;
}

interface TaskFilterProps {
  onFilterChange: (filters: TaskFilters) => void;
}

export function TaskFilter({ onFilterChange }: TaskFilterProps) {
  const [filters, setFilters] = useState<TaskFilters>({
    status: '',
    assigneeId: '',
    keyword: '',
  });

  const { data: employees = [] } = useEmployees();

  const handleChange = (field: keyof TaskFilters, value: string) => {
    const cleanedValue = value === 'all' ? '' : value;
    const updated = { ...filters, [field]: cleanedValue };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const cleared = { status: '', assigneeId: '', keyword: '' };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const hasActiveFilters = filters.status || filters.assigneeId || filters.keyword;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <h3 className="font-medium text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-gray-700">
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search issues..."
            value={filters.keyword}
            onChange={(e) => handleChange('keyword', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <div>
          <Label className="text-xs font-medium text-gray-700 mb-2 block">Status</Label>
          <Select value={filters.status || 'all'} onValueChange={(val) => handleChange('status', val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {TASK_STATUSES.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Assignee Filter */}
        <div>
          <Label className="text-xs font-medium text-gray-700 mb-2 block">Assignee</Label>
          <Select value={filters.assigneeId || 'all'} onValueChange={(val) => handleChange('assigneeId', val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All assignees</SelectItem>
              {employees
                .filter((emp) => emp.id && emp.id.trim() !== '')
                .map((emp: Employee) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
