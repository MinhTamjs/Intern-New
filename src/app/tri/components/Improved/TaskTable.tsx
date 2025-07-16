import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Chip, TextField, MenuItem, Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { useDispatch } from "react-redux";
import { Task, Priority, Status } from "../../features/tasks/taskTypes";
import { deleteTask, setEditing, markAsDone, updateTask } from "../../features/tasks/taskSlice";

export interface TaskTableProps {
  tasks: Task[];               // Danh sách task để hiển thị
  editingId: number | null;    // ID task đang sửa inline
  onEdit: (id: number) => void;// Callback khi bấm Edit
}

const statusColor = (status: string) => {
  switch (status) {
    case "Pending": return "default";
    case "In Progress": return "info";
    case "Done": return "success";
    case "Expired": return "error";
    default: return "default";
  }
};

const priorityColor = (priority: Priority) => {
  if (priority === "High") return "error";
  if (priority === "Medium") return "warning";
  if (priority === "Low") return "warning";
  return "default";
};

const TaskTable: React.FC<TaskTableProps> = ({ tasks, editingId, onEdit }) => {
  const dispatch = useDispatch();
  const [editRow, setEditRow] = useState<Partial<Task> | null>(null);

  const handleEdit = (task: Task) => {
    setEditRow({ ...task });
    onEdit(task.id);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editRow) return;
    setEditRow({ ...editRow, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (editRow && editRow.id !== undefined) {
      dispatch(updateTask(editRow as Task));
      dispatch(setEditing(null));
      setEditRow(null);
    }
  };

  const handleCancel = () => {
    dispatch(setEditing(null));
    setEditRow(null);
  };

  return (
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} selected={editingId === task.id}>
              <TableCell>{task.id}</TableCell>
              {editingId === task.id ? (
                <>
                  <TableCell>
                    <TextField
                      select
                      name="priority"
                      value={editRow?.priority || "Medium"}
                      onChange={handleEditChange}
                      size="small"
                    >
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="title"
                      value={editRow?.title || ""}
                      onChange={handleEditChange}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="description"
                      value={editRow?.description || ""}
                      onChange={handleEditChange}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="dayStarted"
                      type="date"
                      value={editRow?.dayStarted || ""}
                      onChange={handleEditChange}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="dayExpired"
                      type="date"
                      value={editRow?.dayExpired || ""}
                      onChange={handleEditChange}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      select
                      name="status"
                      value={editRow?.status || "Pending"}
                      onChange={handleEditChange}
                      size="small"
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Done">Done</MenuItem>
                      <MenuItem value="Expired">Expired</MenuItem>
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Save">
                      <IconButton onClick={handleSave} color="primary">
                        <SaveIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancel">
                      <IconButton onClick={handleCancel} color="secondary">
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>
                    <Chip
                      label={task.priority}
                      color={priorityColor(task.priority)}
                      sx={task.priority === "Low" ? { backgroundColor: '#1de9b6', color: '#fff' } : {}}
                    />
                  </TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.dayStarted}</TableCell>
                  <TableCell>{task.dayExpired}</TableCell>
                  <TableCell>
                    <Chip label={task.status} color={statusColor(task.status)} />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(task)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => dispatch(deleteTask(task.id))} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    {task.status !== "Done" && (
                      <Tooltip title="Mark as Done">
                        <IconButton onClick={() => dispatch(markAsDone(task.id))} color="success">
                          <DoneIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable; 