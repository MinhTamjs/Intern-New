import React, { useState, useCallback, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Chip, TextField, MenuItem, Stack
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { useAppDispatch } from "./store";
import { Task, Priority, Status } from "../features/tasks/taskTypes";
import { deleteTaskAsync, setEditing, updateTaskAsync, fetchTasks } from "../features/tasks/taskSlice";
import tinycolor from 'tinycolor2';
import { useTheme } from '@mui/material/styles';

// Import các thư viện React, MUI và các icon cần thiết
// Hàm xác định màu cho trạng thái (status)
const statusColor = (status: string) => {
  // Danh sách màu pastel đẹp, không trùng nhau (có thể mở rộng)
  switch (status) {
    case "Pending": return "default";
    case "In Progress": return "info";
    case "Done": return "success";
    case "Expired": return "error";
    default: return "default";
  }
};

// Hàm xác định màu cho độ ưu tiên (priority)
const priorityColor = (priority: Priority) => {
  if (priority === "High") return "error";
  if (priority === "Medium") return "warning";
  if (priority === "Low") return "warning";
  return "default";
};

// Danh sách màu pastel đẹp, không trùng nhau (có thể mở rộng)
const COLOR_PALETTE = [
  "#ffb74d", // orange
  "#4fc3f7", // blue
  "#81c784", // green
  "#ba68c8", // purple
  "#ffd54f", // yellow
  "#e57373", // red
  "#64b5f6", // light blue
  "#a1887f", // brown
  "#90caf9", // sky
  "#f06292", // pink
  "#aed581", // light green
  "#9575cd", // violet
  "#ff8a65", // deep orange
  "#4db6ac", // teal
  "#dce775", // lime
];

// Hàm sinh map value -> color không trùng nhau cho label/project
function getColorMap(values: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  let colorIdx = 0;
  values.forEach((val) => {
    if (!map[val]) {
      map[val] = COLOR_PALETTE[colorIdx % COLOR_PALETTE.length];
      colorIdx++;
    }
  });
  return map;
}

// Interface định nghĩa kiểu dữ liệu cho props của TaskRow
interface TaskRowProps {
  task: Task; // Task hiện tại
  editingId: string | null; // ID task đang được chỉnh sửa
  editRow: Partial<Task> | null; // Dữ liệu dòng đang chỉnh sửa
  onEdit: (task: Task) => void; // Hàm gọi khi bấm Edit
  onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Hàm gọi khi thay đổi input
  onSave: () => void; // Hàm gọi khi lưu chỉnh sửa
  onCancel: () => void; // Hàm gọi khi hủy chỉnh sửa
  onDelete: (id: string) => void; // Hàm gọi khi xóa task
  onMarkDone: (id: string) => void; // Hàm gọi khi đánh dấu Done
  labelColorMap: Record<string, string>; // Map label -> màu
  projectColorMap: Record<string, string>; // Map project -> màu
}

// Component dòng task riêng biệt, nhận props kiểu TaskRowProps
const TaskRow: React.FC<TaskRowProps> = React.memo((props) => {
  const {
    task, // Dữ liệu task hiện tại
    editingId, // ID task đang được chỉnh sửa
    editRow, // Dữ liệu dòng đang chỉnh sửa
    onEdit, // Hàm gọi khi bấm Edit
    onEditChange, // Hàm gọi khi thay đổi input
    onSave, // Hàm gọi khi lưu chỉnh sửa
    onCancel, // Hàm gọi khi hủy chỉnh sửa
    onDelete, // Hàm gọi khi xóa task
    onMarkDone, // Hàm gọi khi đánh dấu Done
    labelColorMap, // Map label -> màu
    projectColorMap, // Map project -> màu
  } = props;
  const isEditing = editingId === task.id.toString();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  // Debug: kiểm tra giá trị isDarkMode
  // console.log('isDarkMode:', isDarkMode);
  // Helper: trả về màu nhạt hơn nếu dark mode, giữ nguyên màu gốc ở light mode
  const getChipBg = (color: string) => {
    if (isDarkMode) {
      return tinycolor(color).lighten(30).toString();
    }
    return color;
  };
  // Helper: style cho chip priority
  const getPriorityChipStyle = (priority: string) => {
    switch (priority) {
      case 'High': return { backgroundColor: getChipBg('#e57373'), color: isDarkMode ? '#222' : '#fff', fontWeight: 700 };
      case 'Medium': return { backgroundColor: getChipBg('#ffd54f'), color: '#222', fontWeight: 700 };
      case 'Low': return { backgroundColor: getChipBg('#81c784'), color: isDarkMode ? '#222' : '#fff', fontWeight: 700 };
      default: return { backgroundColor: getChipBg('#e0e0e0'), color: '#222', fontWeight: 700 };
    }
  };
  // Helper: style cho chip status
  const getStatusChipStyle = (status: string) => {
    switch (status) {
      case 'Pending': return { backgroundColor: getChipBg('#bdbdbd'), color: '#222', fontWeight: 700 };
      case 'In Progress': return { backgroundColor: getChipBg('#64b5f6'), color: isDarkMode ? '#222' : '#fff', fontWeight: 700 };
      case 'Done': return { backgroundColor: getChipBg('#43e97b'), color: isDarkMode ? '#222' : '#fff', fontWeight: 700 };
      case 'Expired': return { backgroundColor: getChipBg('#e57373'), color: isDarkMode ? '#222' : '#fff', fontWeight: 700 };
      default: return { backgroundColor: getChipBg('#e0e0e0'), color: '#222', fontWeight: 700 };
    }
  };
  // Helper: style cho chip label/project
  const getLabelProjectChipStyle = (color: string) => ({
    background: getChipBg(color || '#e0e0e0'),
    color: '#222',
    fontWeight: 700,
    borderRadius: 2,
    px: 1.2,
    fontSize: 13,
    letterSpacing: 0.2,
  });
  if (isEditing) {
    // Chế độ chỉnh sửa (edit mode)
    return (
      <TableRow key={task.id} selected={isEditing}>
        {/* ID task */}
        <TableCell>{task.id}</TableCell>
        {/* Chọn độ ưu tiên */}
        <TableCell>
          <TextField
            select
            name="priority"
            value={editRow?.priority || "Medium"}
            onChange={onEditChange}
            size="small"
          >
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </TextField>
        </TableCell>
        {/* Tiêu đề task */}
        <TableCell>
          <TextField
            name="title"
            value={editRow?.title || ""}
            onChange={onEditChange}
            size="small"
          />
        </TableCell>
        {/* Mô tả task */}
        <TableCell>
          <TextField
            name="description"
            value={editRow?.description || ""}
            onChange={onEditChange}
            size="small"
          />
        </TableCell>
        {/* Ngày bắt đầu */}
        <TableCell>
          <TextField
            name="dayStarted"
            type="date"
            value={editRow?.dayStarted || ""}
            onChange={onEditChange}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </TableCell>
        {/* Ngày kết thúc */}
        <TableCell>
          <TextField
            name="dayExpired"
            type="date"
            value={editRow?.dayExpired || ""}
            onChange={onEditChange}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </TableCell>
        {/* Trạng thái task */}
        <TableCell>
          <TextField
            select
            name="status"
            value={editRow?.status || "Pending"}
            onChange={onEditChange}
            size="small"
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
            <MenuItem value="Expired">Expired</MenuItem>
          </TextField>
        </TableCell>
        {/* Labels và Projects không chỉnh sửa trực tiếp ở đây */}
        <TableCell />
        <TableCell />
        {/* Nút lưu và hủy */}
        <TableCell>
          <Tooltip title="Save">
            <IconButton onClick={onSave} color="primary">
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel">
            <IconButton onClick={onCancel} color="secondary">
              <CancelIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  }
  // Chế độ xem thông thường (view mode)
  return (
    <TableRow key={task.id} selected={isEditing}>
      {/* ID task */}
      <TableCell>{task.id}</TableCell>
      {/* Độ ưu tiên */}
      <TableCell>
        <Chip
          label={task.priority}
          style={getPriorityChipStyle(task.priority)}
        />
      </TableCell>
      {/* Tiêu đề task */}
      <TableCell>{task.title}</TableCell>
      {/* Mô tả task */}
      <TableCell>{task.description}</TableCell>
      {/* Ngày bắt đầu */}
      <TableCell>{task.dayStarted}</TableCell>
      {/* Ngày kết thúc */}
      <TableCell>{task.dayExpired}</TableCell>
      {/* Trạng thái task */}
      <TableCell>
        <Chip label={task.status} style={getStatusChipStyle(task.status)} />
      </TableCell>
      {/* Hiển thị các label (nếu có) */}
      <TableCell>
        <Stack direction="row" spacing={0.5}>
          {(task.labels ?? []).map((label, idx) => (
            <Chip
              key={idx}
              label={label}
              size="small"
              style={getLabelProjectChipStyle(labelColorMap[label])}
              variant="filled"
            />
          ))}
        </Stack>
      </TableCell>
      {/* Hiển thị các project (nếu có) */}
      <TableCell>
        <Stack direction="row" spacing={0.5}>
          {(task.projects ?? []).map((project, idx) => (
            <Chip
              key={idx}
              label={project}
              size="small"
              style={getLabelProjectChipStyle(projectColorMap[project])}
              variant="filled"
            />
          ))}
        </Stack>
      </TableCell>
      {/* Các nút thao tác: Edit, Delete, Mark as Done */}
      <TableCell>
        <Tooltip title="Edit">
          <IconButton
            onClick={() => onEdit(task)}
            sx={{ bgcolor: '#7c7fd6', color: '#fff', '&:hover': { bgcolor: '#5a5fa3' } }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            onClick={() => onDelete(task.id.toString())}
            sx={{ bgcolor: '#e57373', color: '#fff', '&:hover': { bgcolor: '#b71c1c' } }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        {task.status !== "Done" && (
          <Tooltip title="Mark as Done">
            <IconButton
              onClick={() => onMarkDone(task.id.toString())}
              sx={{ bgcolor: '#43e97b', color: '#fff', '&:hover': { bgcolor: '#388e3c' } }}
            >
              <DoneIcon />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
});

// Component bảng hiển thị danh sách task
const TaskTable: React.FC<any> = ({ tasks, editingId, onEdit }) => {
  // Lấy dispatch từ store
  const dispatch = useAppDispatch();
  // State lưu dòng đang chỉnh sửa
  const [editRow, setEditRow] = useState<Partial<Task> | null>(null);

  // Lấy tất cả label hiện có trong danh sách task (dùng cho map màu)
  const allLabels = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(task => task.labels?.forEach(l => set.add(l)));
    return Array.from(set);
  }, [tasks]);
  // Lấy tất cả project hiện có trong danh sách task (dùng cho map màu)
  const allProjects = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(task => task.projects?.forEach(p => set.add(p)));
    return Array.from(set);
  }, [tasks]);
  // Map label/project -> màu riêng biệt
  const labelColorMap = useMemo(() => getColorMap(allLabels), [allLabels]);
  const projectColorMap = useMemo(() => getColorMap(allProjects), [allProjects]);

  // Xử lý khi bấm Edit
  const handleEdit = useCallback((task: Task) => {
    setEditRow({ ...task });
    onEdit(task.id.toString());
  }, [onEdit]);

  // Xử lý thay đổi input khi chỉnh sửa
  const handleEditChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editRow) return;
    setEditRow({ ...editRow, [e.target.name]: e.target.value });
  }, [editRow]);

  // Xử lý lưu chỉnh sửa
  const handleSave = useCallback(() => {
    if (editRow && editRow.id !== undefined) {
      dispatch(updateTaskAsync({ id: editRow.id.toString(), updates: editRow })).then(() => {
        dispatch(fetchTasks());
        dispatch(setEditing(null));
        setEditRow(null);
      });
    }
  }, [dispatch, editRow]);

  // Xử lý hủy chỉnh sửa
  const handleCancel = useCallback(() => {
    dispatch(setEditing(null));
    setEditRow(null);
  }, [dispatch]);

  // Xử lý xóa task
  const handleDelete = useCallback((id: string) => {
    dispatch(deleteTaskAsync(id)).then(() => {
      dispatch(fetchTasks());
    });
  }, [dispatch]);

  // Xử lý đánh dấu task là Done
  const handleMarkDone = useCallback((id: string) => {
    dispatch(updateTaskAsync({ id, updates: { status: 'Done' } })).then(() => {
      dispatch(fetchTasks());
    });
  }, [dispatch]);

  // Render bảng task
  return (
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            {/* Tiêu đề các cột */}
            <TableCell>ID</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Labels</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Render từng dòng task */}
          {tasks.map((task: Task) => (
            <TaskRow
              key={task.id}
              task={task}
              editingId={editingId}
              editRow={editRow}
              onEdit={handleEdit}
              onEditChange={handleEditChange}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={handleDelete}
              onMarkDone={handleMarkDone}
              labelColorMap={labelColorMap}
              projectColorMap={projectColorMap}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable; 