import React from 'react';
import type { TaskPriority, TaskStatus } from '../features/tasks';
import type { Employee } from '../features/employees';

interface FilterSearchProps {
  status: TaskStatus | '';
  priority: TaskPriority | '';
  assignee: string;
  search: string;
  onChange: (filters: { status: TaskStatus | ''; priority: TaskPriority | ''; assignee: string; search: string }) => void;
  employees: Employee[];
}

export function FilterSearch({ status, priority, assignee, search, onChange, employees }: FilterSearchProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      <select value={status} onChange={e => onChange({ status: e.target.value as TaskStatus | '', priority, assignee, search })} className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300">
        <option value="">Tất cả trạng thái</option>
        <option value="planning">Planning</option>
        <option value="in progress">In Progress</option>
        <option value="done">Done</option>
        <option value="failed">Failed</option>
      </select>
      <select value={priority} onChange={e => onChange({ status, priority: e.target.value as TaskPriority | '', assignee, search })} className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300">
        <option value="">Tất cả ưu tiên</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select value={assignee} onChange={e => onChange({ status, priority, assignee: e.target.value, search })} className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300">
        <option value="">Tất cả nhân viên</option>
        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
      </select>
      <input
        type="text"
        placeholder="Tìm kiếm tên hoặc mô tả..."
        value={search}
        onChange={e => onChange({ status, priority, assignee, search: e.target.value })}
        className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 min-w-[220px]"
      />
    </div>
  );
} 