import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Avatar } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import type { Employee } from "../../../../types/schema";

// Employee list table
const EmployeeTable: React.FC<{
  employees: Employee[];
  onEdit: (emp: Employee) => void;
  onDelete: (id: string) => void;
  onAssignTask: (emp: Employee) => void;
}> = ({ employees, onEdit, onDelete, onAssignTask }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Avatar</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map(emp => (
            <TableRow key={emp.id}>
              <TableCell>
                {emp.avatar ? <Avatar src={emp.avatar} /> : <Avatar>{emp.name?.[0] || '?'}</Avatar>}
              </TableCell>
              <TableCell>{emp.name}</TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell>{emp.position}</TableCell>
              <TableCell>{emp.department}</TableCell>
              <TableCell>
                <Tooltip title="Edit">
                  <IconButton onClick={() => onEdit(emp)}><EditIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => onDelete(emp.id)}><DeleteIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Assign Task">
                  <IconButton onClick={() => onAssignTask(emp)}><AssignmentIndIcon /></IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployeeTable; 