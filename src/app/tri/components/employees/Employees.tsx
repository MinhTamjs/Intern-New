import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import EmployeeForm from "./EmployeeForm";
import EmployeeTable from "./EmployeeTable";
import { getEmployees, deleteEmployee, getTasks, assignTask } from "../../features/tasks/taskApi";
import type { Employee } from "../../../types/schema";
import type { Task } from "../../../types/schema";

// Trang quản lý nhân viên (Employee Management)
const Employees: React.FC = () => {
  // State danh sách nhân viên
  const [employees, setEmployees] = useState<Employee[]>([]);
  // State nhân viên đang sửa (nếu có)
  const [editing, setEditing] = useState<Employee | null>(null);
  // State mở form thêm/sửa
  const [openForm, setOpenForm] = useState(false);
  // State nhân viên đang giao việc
  const [assigning, setAssigning] = useState<Employee | null>(null);
  // State danh sách task để giao
  const [tasks, setTasks] = useState<Task[]>([]);
  // State task được chọn để giao
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  // Lấy danh sách nhân viên từ API khi mount
  useEffect(() => {
    fetchEmployees();
  }, []);
  const fetchEmployees = async () => {
    const data = await getEmployees();
    setEmployees(data);
  };

  // Lấy danh sách task khi mở dialog giao việc
  useEffect(() => {
    if (assigning) fetchTasksList();
  }, [assigning]);
  const fetchTasksList = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  // Xử lý lưu nhân viên (thêm/sửa)
  const handleSave = (emp: Employee) => {
    setOpenForm(false);
    setEditing(null);
    fetchEmployees(); // Reload danh sách
  };
  // Xử lý sửa
  const handleEdit = (emp: Employee) => {
    setEditing(emp);
    setOpenForm(true);
  };
  // Xử lý xóa
  const handleDelete = async (id: string) => {
    await deleteEmployee(id);
    fetchEmployees();
  };
  // Xử lý giao việc
  const handleAssignTask = (emp: Employee) => {
    setAssigning(emp);
  };
  // Đóng dialog giao việc
  const handleCloseAssign = () => setAssigning(null);

  // Xử lý giao task cho nhân viên
  const handleConfirmAssign = async () => {
    if (assigning && selectedTaskId) {
      await assignTask(selectedTaskId, assigning.id);
      setAssigning(null);
      setSelectedTaskId("");
      // Có thể reload task hoặc employee nếu cần
    }
  };

  return (
    <Box>
      {/* Tiêu đề trang */}
      <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          fontWeight={700}
          flex={1}
          sx={{ fontFamily: 'Montserrat, Arial, sans-serif', color: 'primary.main' }}
        >
          Employee Management
        </Typography>
      </Box>
      <Box display="flex" gap={4}>
        {/* Form thêm/sửa nhân viên */}
        <Paper sx={{ width: 350, p: 2, fontFamily: 'Montserrat, Arial, sans-serif' }}>
          <Typography variant="h6" mb={2} sx={{ fontFamily: 'Montserrat, Arial, sans-serif', color: 'primary.main', fontWeight: 700 }}>Add / Edit Employee</Typography>
          <Button variant="contained" onClick={() => { setEditing(null); setOpenForm(true); }} sx={{ mb: 2, fontFamily: 'Montserrat, Arial, sans-serif' }}>
            Add Employee
          </Button>
          {openForm && (
            <EmployeeForm
              onSave={handleSave}
              employee={editing}
              onCancel={() => { setOpenForm(false); setEditing(null); }}
            />
          )}
        </Paper>
        {/* Bảng danh sách nhân viên */}
        <Paper sx={{ flex: 1, p: 2, fontFamily: 'Montserrat, Arial, sans-serif' }}>
          <Typography variant="h6" mb={2} sx={{ fontFamily: 'Montserrat, Arial, sans-serif', color: 'primary.main', fontWeight: 700 }}>Employee List</Typography>
          <EmployeeTable
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAssignTask={handleAssignTask}
          />
        </Paper>
      </Box>
      {/* Dialog giao việc cho nhân viên */}
      <Dialog open={!!assigning} onClose={handleCloseAssign} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>Assign Task to Employee</DialogTitle>
        <DialogContent sx={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
          {/* Danh sách task, chọn 1 task để giao */}
          <Typography mb={2} sx={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>Select a task to assign to <b>{assigning?.name}</b>:</Typography>
          <Box>
            {tasks.length === 0 ? (
              <Typography color="text.secondary" sx={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>No tasks available.</Typography>
            ) : (
              tasks.map(task => (
                <Box key={task.id} display="flex" alignItems="center" mb={1}>
                  <input
                    type="radio"
                    name="selectedTask"
                    value={task.id}
                    checked={selectedTaskId === task.id}
                    onChange={() => setSelectedTaskId(task.id)}
                    style={{ marginRight: 8 }}
                  />
                  <Typography sx={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>{task.title}</Typography>
                </Box>
              ))
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssign} sx={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>Close</Button>
          <Button onClick={handleConfirmAssign} variant="contained" disabled={!selectedTaskId} sx={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
            Confirm Assignment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Employees; 