import { useEmployees } from '../hooks/useEmployees';
import { Avatar } from '../../../components/ui/avatar';
import { Card } from '../../../components/ui/card';

export function EmployeeList({ currentUser }) {
  const { data: employees, isLoading } = useEmployees();

  if (isLoading) return <p>Đang tải danh sách nhân viên...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {employees.map((emp) => (
        <Card key={emp.id} className="p-4 flex items-center gap-4">
          <Avatar src={emp.avatar} alt={emp.name} />
          <div>
            <p className="font-semibold">{emp.name}</p>
            <p className="text-sm text-muted-foreground">{emp.position}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}