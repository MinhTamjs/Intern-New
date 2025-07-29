// src/pages/TaskBoardPage.tsx
import { TaskBoard } from '../features/kanban/TaskBoard';
import { useAuth } from '../lib/auth';
import { Filter, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useTaskStats } from '../features/tasks/hooks/useTaskStats';

export default function TaskBoardPage() {
  const currentUser = useAuth();
  const { data: stats } = useTaskStats();

  return (
    <div className="space-y-6">
      {/* DEBUG: Simple test */}
      <div className="bg-purple-500 text-white p-4 rounded-lg">
        <h2 className="text-xl font-bold">DEBUG: TaskBoardPage is rendering!</h2>
        <p>Current user: {currentUser.name}</p>
      </div>

      {/* JIRA-like Board Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sprint Backlog</h1>
            <p className="text-sm text-gray-600">Manage your team's work and track progress</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Issue
            </Button>
          </div>
        </div>
        
        {/* Board Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">To Do</p>
                <p className="text-2xl font-bold text-blue-900">{stats?.pending || 0}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">T</span>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-900">{stats?.inProgress || 0}</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-semibold">I</span>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">In Review</p>
                <p className="text-2xl font-bold text-purple-900">{stats?.inReview || 0}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold">R</span>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Done</p>
                <p className="text-2xl font-bold text-green-900">{stats?.done || 0}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">D</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <TaskBoard currentUser={currentUser} />
      </div>
    </div>
  );
}
