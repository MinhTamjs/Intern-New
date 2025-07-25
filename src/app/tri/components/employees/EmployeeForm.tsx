import React, { useState, useEffect } from "react";
import { TextField, Button, Stack } from "@mui/material";
// import API Employee
import { createEmployee, updateEmployee } from "../../features/tasks/taskApi";
import type { Employee } from "../../../../types/schema";

// Form thêm/sửa nhân viên
const EmployeeForm: React.FC<{
  onSave: (emp: Employee) => void;
  employee?: Employee | null;
  onCancel?: () => void;
}> = ({ onSave, employee, onCancel }) => {
  // State lưu thông tin form
  const [form, setForm] = useState<Employee>({
    id: "",
    name: "",
    email: "",
    position: "",
    department: "",
    avatar: "",
    phone: "",
    isManager: false,
    createdAt: ""
  });
  // Khi sửa, fill dữ liệu vào form
  useEffect(() => {
    if (employee) setForm(employee);
    else setForm({
      id: "",
      name: "",
      email: "",
      position: "",
      department: "",
      avatar: "",
      phone: "",
      isManager: false,
      createdAt: ""
    });
  }, [employee]);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let saved: Employee;
    if (form.id) {
      saved = await updateEmployee(form.id, form);
    } else {
      saved = await createEmployee(form);
    }
    onSave(saved);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField label="Tên" name="name" value={form.name} onChange={handleChange} required />
        <TextField label="Email" name="email" value={form.email} onChange={handleChange} required />
        <TextField label="Chức vụ" name="position" value={form.position} onChange={handleChange} />
        <TextField label="Phòng ban" name="department" value={form.department} onChange={handleChange} />
        <TextField label="Số điện thoại" name="phone" value={form.phone} onChange={handleChange} />
        <TextField label="Avatar (URL)" name="avatar" value={form.avatar} onChange={handleChange} />
        {/* Có thể thêm checkbox isManager nếu muốn */}
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" color="primary">
            {form.id ? "Cập nhật" : "Thêm mới"}
          </Button>
          {onCancel && <Button onClick={onCancel}>Huỷ</Button>}
        </Stack>
      </Stack>
    </form>
  );
};

export default EmployeeForm; 