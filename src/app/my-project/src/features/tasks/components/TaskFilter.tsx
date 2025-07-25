import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TASK_STATUSES } from '@/lib/constants';
import { useEmployees } from '@/features/employees/hooks/useEmployees';
import type { Employee } from '../../employees/types'; // đảm bảo bạn có file này

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
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div>
        <Label>Trạng thái</Label>
        <Select value={filters.status} onValueChange={(val) => handleChange('status', val)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tất cả</SelectItem>
            {TASK_STATUSES.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Người nhận</Label>
        <Select value={filters.assigneeId} onValueChange={(val) => handleChange('assigneeId', val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tất cả</SelectItem>
            {employees.map((emp: Employee) => (
              <SelectItem key={emp.id} value={emp.id}>
                {emp.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Từ khóa</Label>
        <Input
          placeholder="Tìm tiêu đề..."
          value={filters.keyword}
          onChange={(e) => handleChange('keyword', e.target.value)}
          className="w-[200px]"
        />
      </div>
    </div>
  );
}
