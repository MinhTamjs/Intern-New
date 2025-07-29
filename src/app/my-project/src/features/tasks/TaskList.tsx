import { useTasks } from './hooks/useTasks.ts';
import { Badge } from '../../components/ui/badge';
import type { Task } from './types';
import { Button } from '../../components/ui/button';
import { Plus, Filter, Search, MoreHorizontal, Clock, User, MessageSquare } from 'lucide-react';

export function TaskList() {
  const { data: tasks, isLoading } = useTasks();

  if (isLoading) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading issues...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Issues</h1>
            <p className="text-sm text-gray-600">View and manage all project issues</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Issue
            </Button>
          </div>
        </div>
        
        {/* Search and Stats */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search issues..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          <div className="text-sm text-gray-600">
            {tasks.length} issues
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200 px-6 py-3">
          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="col-span-4">Issue</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Assignee</div>
            <div className="col-span-2">Due Date</div>
            <div className="col-span-1">Priority</div>
            <div className="col-span-1"></div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {tasks.map((task: Task) => (
            <div key={task.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Issue Details */}
                <div className="col-span-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center mt-1">
                      <span className="text-white text-xs font-bold">T</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 truncate mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>0</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>No due date</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Status */}
                <div className="col-span-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      task.status === 'done' ? 'bg-green-100 text-green-800 border-green-200' :
                      task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      task.status === 'in-review' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                      'bg-blue-100 text-blue-800 border-blue-200'
                    }`}
                  >
                    {task.status.replace('-', ' ')}
                  </Badge>
                </div>
                
                {/* Assignee */}
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-600">Unassigned</span>
                  </div>
                </div>
                
                {/* Due Date */}
                <div className="col-span-2">
                  <span className="text-sm text-gray-500">No due date</span>
                </div>
                
                {/* Priority */}
                <div className="col-span-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
                
                {/* Actions */}
                <div className="col-span-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}