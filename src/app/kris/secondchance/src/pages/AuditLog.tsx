import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { FileText, Search, Filter, Calendar, User, Activity, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { getRolePermissions } from '../lib/roles/roleManager';

interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  userRole: string;
  timestamp: string;
  entity: string;
  entityType: 'task' | 'employee' | 'system';
  details: string;
}

export const AuditLog = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');

  const { currentRole } = useAuth();
  const permissions = getRolePermissions(currentRole);
  const canClearLogs = permissions.canClearAuditLog;

  // Load audit logs from localStorage
  useEffect(() => {
    const storedLogs = localStorage.getItem('auditLogs');
    if (storedLogs) {
      try {
        const parsedLogs = JSON.parse(storedLogs);
        setLogs(parsedLogs);
        setFilteredLogs(parsedLogs);
      } catch (error) {
        console.error('Error parsing audit logs:', error);
        setLogs([]);
        setFilteredLogs([]);
      }
    }
  }, []);

  // Filter logs based on search and filters
  useEffect(() => {
    let filtered = logs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Action filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    // Entity filter
    if (entityFilter !== 'all') {
      filtered = filtered.filter(log => log.entityType === entityFilter);
    }

    // User filter
    if (userFilter !== 'all') {
      filtered = filtered.filter(log => log.user === userFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, actionFilter, entityFilter, userFilter]);

  // Get unique actions for filter
  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));
  const uniqueUsers = Array.from(new Set(logs.map(log => log.user)));

  // Get color for action badge
  const getActionColor = (action: string) => {
    if (action.includes('created')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (action.includes('updated')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (action.includes('deleted')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (action.includes('moved') || action.includes('changed')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  // Get color for entity type badge
  const getEntityColor = (entityType: string) => {
    switch (entityType) {
      case 'task': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'employee': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'system': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setActionFilter('all');
    setEntityFilter('all');
    setUserFilter('all');
  };

  // Clear audit logs
  const clearLogs = () => {
    if (!canClearLogs) {
      toast.error('Only administrators can clear audit logs');
      return;
    }

    if (window.confirm('Are you sure you want to clear all audit logs? This action cannot be undone.')) {
      localStorage.removeItem('auditLogs');
      setLogs([]);
      setFilteredLogs([]);
      toast.success('Audit logs cleared successfully');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Audit Log</h1>
        <p className="text-xl font-bold text-gray-900 dark:text-white mt-2">
          Track all important actions and changes in the system
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        {/* Search and filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800 border-[#5ce7ff] dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map(action => (
                  <SelectItem key={action} value={action}>{action}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="task">Tasks</SelectItem>
                <SelectItem value="employee">Employees</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>

            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user} value={user}>{user}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Clear Filters
          </Button>
          {canClearLogs ? (
            <Button variant="outline" onClick={clearLogs} className="flex items-center gap-2 text-red-600 hover:text-red-700">
              <Activity className="h-4 w-4" />
              Clear Logs
            </Button>
          ) : (
            <Button 
              variant="outline" 
              disabled 
              className="flex items-center gap-2 text-gray-400 cursor-not-allowed"
              title="Only administrators can clear audit logs"
            >
              <Shield className="h-4 w-4" />
              Clear Logs
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{logs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unique Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{uniqueUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Action Types</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{uniqueActions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Filtered</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit log table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Audit Log Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {logs.length === 0 ? 'No audit logs found' : 'No logs match your filters'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">{log.user}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{log.userRole}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={getEntityColor(log.entityType)}>
                            {log.entityType}
                          </Badge>
                          <span className="text-sm">{log.entity}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {log.details}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 