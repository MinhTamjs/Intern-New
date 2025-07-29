import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import TaskBoardPage from '../pages/TaskBoardPage';
import { EmployeeList } from '../features/employees/components/EmployeeList';
import { TaskList } from '../features/tasks/TaskList';
import { Toaster } from 'sonner';
import { Button } from '../components/ui/button';
import { Search, Plus, Bell, User, Settings, Home, Users, CheckSquare } from 'lucide-react';
import { ShadCNTest } from '../components/ShadCNTest';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster richColors position="top-right" />
      
      {/* JIRA-like Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">JIRA Clone</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <CheckSquare className="w-4 h-4 mr-2" />
                Projects
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Users className="w-4 h-4 mr-2" />
                Teams
              </Button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Project Management
              </h3>
              <nav className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                  <CheckSquare className="w-4 h-4 mr-3" />
                  Kanban Board
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                  <Users className="w-4 h-4 mr-3" />
                  Team Members
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                  <CheckSquare className="w-4 h-4 mr-3" />
                  All Issues
                </Button>
              </nav>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Issue
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-50 overflow-auto">
          <div className="p-6">
            {/* DEBUG: Test if main content is working */}
            <div className="mb-4 p-4 bg-red-500 text-white rounded-lg">
              <h2 className="text-xl font-bold">DEBUG: Main Content Area</h2>
              <p>If you can see this red box, the main content is working!</p>
            </div>
            
            <Tabs defaultValue="test" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-lg p-1 mb-6">
                <TabsTrigger value="test" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  ShadCN Test
                </TabsTrigger>
                <TabsTrigger value="board" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Kanban Board
                </TabsTrigger>
                <TabsTrigger value="employees" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Team Members
                </TabsTrigger>
                <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  All Issues
                </TabsTrigger>
              </TabsList>

              <TabsContent value="test" className="mt-0">
                <ShadCNTest />
              </TabsContent>
              <TabsContent value="board" className="mt-0">
                <div className="bg-yellow-200 p-4 rounded-lg mb-4">
                  <h3 className="font-bold">DEBUG: TaskBoardPage should appear here</h3>
                </div>
                <TaskBoardPage />
              </TabsContent>
              <TabsContent value="employees" className="mt-0">
                <div className="bg-green-200 p-4 rounded-lg mb-4">
                  <h3 className="font-bold">DEBUG: EmployeeList should appear here</h3>
                </div>
                <EmployeeList />
              </TabsContent>
              <TabsContent value="tasks" className="mt-0">
                <div className="bg-blue-200 p-4 rounded-lg mb-4">
                  <h3 className="font-bold">DEBUG: TaskList should appear here</h3>
                </div>
                <TaskList />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
