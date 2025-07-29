import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../ui/select";
import { FlameIcon, CircleIcon, AlertTriangleIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from '../ui/badge';

// Định nghĩa type Task phù hợp với TaskBoard
export type Task = {
  id: string;
  name: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  description?: string;
  status: 'planning' | 'in progress' | 'done' | 'failed';
  assignTo: string;
  createdBy: string;
};

interface Employee {
  id: string;
  name: string;
  email?: string;
  position?: string;
  avatar?: string;
}

interface TaskFormProps {
  employees: Employee[];
  onSubmit: (task: Omit<Task, 'id'>) => void;
  currentUser: { id: string; name: string; role: 'employee' | 'manager' | 'admin' };
}

export function TaskForm({ employees, onSubmit, currentUser }: TaskFormProps) {
  const [form, setForm] = useState<Omit<Task, 'id'>>({
    name: '',
    priority: 'medium',
    dueDate: '',
    description: '',
    status: 'planning',
    assignTo: employees[0]?.id || '',
    createdBy: currentUser.id,
  });
  const [assigneeSearch, setAssigneeSearch] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-6 rounded shadow">
      <div>
        <label className="block mb-1 font-medium">Tên công việc</label>
        <input name="name" value={form.name} onChange={handleChange} className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300" required />
      </div>
      <div>
        <label className="block mb-1 font-medium">Mức độ ưu tiên</label>
        <Select name="priority" value={form.priority} onValueChange={(v: 'low' | 'medium' | 'high') => setForm(f => ({ ...f, priority: v }))}>
          <SelectTrigger className="w-full" />
          <SelectContent>
            <SelectItem value="low">
              <span className="flex items-center gap-2"><CircleIcon className="text-green-500 w-4 h-4" /><Badge variant="secondary">Low</Badge></span>
            </SelectItem>
            <SelectItem value="medium">
              <span className="flex items-center gap-2"><AlertTriangleIcon className="text-yellow-500 w-4 h-4" /><Badge variant="secondary">Medium</Badge></span>
            </SelectItem>
            <SelectItem value="high">
              <span className="flex items-center gap-2"><FlameIcon className="text-red-500 w-4 h-4" /><Badge variant="destructive">High</Badge></span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Hạn chót</label>
        <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300" required />
      </div>
      <div>
        <label className="block mb-1 font-medium">Mô tả</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Trạng thái</label>
        <Select name="status" value={form.status} onValueChange={(v: 'planning' | 'in progress' | 'done' | 'failed') => setForm(f => ({ ...f, status: v }))}>
          <SelectTrigger className="w-full" />
          <SelectContent>
            <SelectItem value="planning"><span className="flex items-center gap-2">📝 <span className="text-blue-600">Planning</span></span></SelectItem>
            <SelectItem value="in progress"><span className="flex items-center gap-2">🕒 <span className="text-yellow-600">In Progress</span></span></SelectItem>
            <SelectItem value="done"><span className="flex items-center gap-2">✅ <span className="text-green-600">Done</span></span></SelectItem>
            <SelectItem value="failed"><span className="flex items-center gap-2">❌ <span className="text-red-600">Failed</span></span></SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Giao cho</label>
        <Select name="assignTo" value={form.assignTo} onValueChange={(v: string) => setForm(f => ({ ...f, assignTo: v }))}>
          <SelectTrigger className="w-full" />
          <SelectContent>
            {/* Search input */}
            <div className="px-2 py-1">
              <input type="text" placeholder="Tìm kiếm..." className="w-full px-2 py-1 rounded border text-sm mb-1" onChange={e => setAssigneeSearch(e.target.value)} />
            </div>
            {employees.filter(e => !assigneeSearch || e.name.toLowerCase().includes(assigneeSearch.toLowerCase())).map(e => (
              <SelectItem key={e.id} value={e.id}>
                <span className="flex items-center gap-2">
                  {e.avatar ? (
                    <Avatar className="w-6 h-6"><AvatarImage src={e.avatar} /><AvatarFallback>{e.name[0]}</AvatarFallback></Avatar>
                  ) : (
                    <Avatar className="w-6 h-6"><AvatarFallback>{e.name[0]}</AvatarFallback></Avatar>
                  )}
                  <span>{e.name}</span>
                  <Badge variant="secondary" className="ml-2 text-xs">{e.position || 'Staff'}</Badge>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={currentUser.role === 'employee'}>
        Thêm công việc
      </Button>
      {currentUser.role === 'employee' && (
        <div className="text-red-500 text-xs mt-2 text-center">Chỉ quản lý (manager) hoặc admin mới được giao việc!</div>
      )}
    </form>
  );
} 