// Import các thư viện React, MUI và các icon cần thiết
import React, { useState, useCallback, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Chip, TextField, MenuItem, Stack, Checkbox
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { useAppDispatch } from "../store";
import type { Task } from "../../../../types/schema";
import { deleteTaskAsync, setEditing, updateTaskAsync, fetchTasks } from "../../features/tasks/taskSlice";
import { useTheme } from '@mui/material/styles';


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

// Đặt các hàm getPriorityChipStyle, getStatusChipStyle, getLabelProjectChipStyle ở scope ngoài cùng của file để dùng chung cho cả TaskTable
const getChipBg = (color: string) => color;
const getPriorityChipStyle = (priority: string, isDarkMode = false) => {
  switch (priority) {
    case 'High': return { backgroundColor: getChipBg('#e57373'), color: isDarkMode ? '#222' : '#fff', fontWeight: 700 };
    case 'Medium': return { backgroundColor: getChipBg('#ffd54f'), color: '#222', fontWeight: 700 };
    case 'Low': return { backgroundColor: getChipBg('#81c784'), color: isDarkMode ? '#222' : '#fff', fontWeight: 700 };
    default: return { backgroundColor: getChipBg('#e0e0e0'), color: '#222', fontWeight: 700 };
  }
};
const getStatusChipStyle = (status: string, isDarkMode = false) => {
  switch (status) {
    case 'Pending': return { backgroundColor: getChipBg('#bdbdbd'), color: '#222', fontWeight: 700 };
    case 'In Progress': return { backgroundColor: getChipBg('#64b5f6'), color: isDarkMode ? '#222' : '#fff', fontWeight: 700 };
    case 'Done': return { backgroundColor: getChipBg('#43e97b'), color: isDarkMode ? '#222' : '#fff', fontWeight: 700 };
    case 'Expired': return { backgroundColor: getChipBg('#e57373'), color: isDarkMode ? '#222' : '#fff', fontWeight: 700 };
    default: return { backgroundColor: getChipBg('#e0e0e0'), color: '#222', fontWeight: 700 };
  }
};
const getLabelProjectChipStyle = (color: string) => ({
  background: getChipBg(color || '#e0e0e0'),
  color: '#222',
  fontWeight: 700,
  borderRadius: 2,
  px: 1.2,
  fontSize: 13,
  letterSpacing: 0.2,
});

// CustomChip component để kiểm soát màu sắc, style chip trong table
const CustomChip = ({ label, bg, color, fontWeight = 700, fontSize = 14, style = {}, ...rest }: any) => (
  <span
    style={{
      background: bg,
      color,
      fontWeight,
      fontSize,
      borderRadius: 10, // nhỏ hơn để ôm sát chữ
      padding: '2px 8px', // giảm padding để ôm sát chữ
      marginRight: 4,
      display: 'inline-block',
      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
      letterSpacing: 0.5,
      ...style,
    }}
    {...rest}
  >
    {label}
  </span>
);

// Interface định nghĩa kiểu dữ liệu cho props của TaskRow
interface TaskRowProps {
  task: Task; // Task hiện tại
  editingId: string | null; // ID task đang được chỉnh sửa
  editRow: Partial<Task> | null; // Dữ liệu dòng đang chỉnh sửa
  onEdit: (task: Task) => void; // Hàm gọi khi bấm Edit
  onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Hàm gọi khi thay đổi input
  onSave: () => void; // Hàm gọi khi lưu chỉnh sửa
  onCancel: () => void; // Hàm gọi khi hủy chỉnh sửa
  labelColorMap: Record<string, string>; // Map label -> màu
  projectColorMap: Record<string, string>; // Map project -> màu
  selected: boolean; // Trạng thái đã chọn của dòng
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void; // Hàm gọi khi chọn dòng
  // Đã loại bỏ employees
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
    labelColorMap, // Map label -> màu
    projectColorMap, // Map project -> màu
    selected, // Trạng thái đã chọn của dòng
    onSelect, // Hàm gọi khi chọn dòng
    // Đã loại bỏ employees
  } = props;
  const isEditing = editingId === task.id.toString();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  if (isEditing) {
    // Chế độ chỉnh sửa (edit mode)
    return (
      <TableRow key={task.id} selected={isEditing}>
        {/* Checkbox chọn dòng */}
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onChange={onSelect} />
        </TableCell>
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
        {/* Sửa lại trường ngày kết thúc: dayExpired => dueDate (theo schema mới) */}
        <TableCell>
          <TextField
            name="dueDate"
            type="date"
            value={editRow?.dueDate || ""}
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
      {/* Checkbox chọn dòng */}
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={onSelect} />
      </TableCell>
      {/* ID task */}
      <TableCell>{task.id}</TableCell>
      {/* Độ ưu tiên */}
      <TableCell>
        <CustomChip
          label={task.priority}
          bg={getPriorityChipStyle(task.priority, false).backgroundColor}
          color={getPriorityChipStyle(task.priority, false).color}
        />
      </TableCell>
      {/* Tiêu đề task */}
      <TableCell>{task.title}</TableCell>
      {/* Mô tả task */}
      <TableCell>{task.description}</TableCell>
      {/* Ngày bắt đầu */}
      <TableCell>{task.dayStarted}</TableCell>
      {/* Ở chế độ view: */}
      <TableCell>{task.dueDate}</TableCell>
      {/* Trạng thái task */}
      <TableCell>
        <CustomChip
          label={task.status}
          bg={getStatusChipStyle(task.status, false).backgroundColor}
          color={getStatusChipStyle(task.status, false).color}
        />
      </TableCell>
      {/* Hiển thị các label (nếu có), luôn ép kiểu về mảng để tránh lỗi map trên string */}
      <TableCell>
        <Stack direction="row" spacing={0.5}>
          {(Array.isArray(task.labels) ? task.labels : []).map((label: string, idx: number) => (
            <CustomChip
              key={idx}
              label={label}
              bg={getLabelProjectChipStyle(labelColorMap[label]).background}
              color={getLabelProjectChipStyle(labelColorMap[label]).color}
              fontSize={13}
              style={{ fontWeight: 700, borderRadius: 8, letterSpacing: 0.2, padding: '3px 10px' }}
            />
          ))}
        </Stack>
      </TableCell>
      {/* Hiển thị các project (nếu có), luôn ép kiểu về mảng để tránh lỗi map trên string */}
      <TableCell>
        <Stack direction="row" spacing={0.5}>
          {(Array.isArray(task.projects) ? task.projects : []).map((project: string, idx: number) => (
            <CustomChip
              key={idx}
              label={project}
              bg={getLabelProjectChipStyle(projectColorMap[project]).background}
              color={getLabelProjectChipStyle(projectColorMap[project]).color}
              fontSize={13}
              style={{ fontWeight: 700, borderRadius: 8, letterSpacing: 0.2, padding: '3px 10px' }}
            />
          ))}
        </Stack>
      </TableCell>
      {/* Các nút thao tác: Edit, Delete */}
      <TableCell>
        <Tooltip title="Edit">
          <IconButton
            onClick={() => onEdit(task)}
            sx={{ bgcolor: '#7c7fd6', color: '#fff', '&:hover': { bgcolor: '#5a5fa3' } }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
      {/* Chỉ render các trường liên quan đến Task, không tra cứu tên nhân viên nếu chưa dùng tới */}
      <TableCell>{task.assignedTo || ''}</TableCell>
      <TableCell>{task.createdBy || ''}</TableCell>
    </TableRow>
  );
});

// Định nghĩa interface cho props của TaskTable
interface TaskTableProps {
  tasks: Task[];
  editingId: string | null;
  onEdit: (task: Task) => void;
  selectedIds: string[];
  onSelectIds: (ids: string[]) => void;
}

// Component bảng hiển thị danh sách task
const TaskTable: React.FC<TaskTableProps> = ({ tasks, editingId, onEdit, selectedIds, onSelectIds }) => {
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
    onEdit(task); // truyền object task thay vì chỉ id
  }, [onEdit]);

  // Xử lý thay đổi input khi chỉnh sửa
  const handleEditChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editRow) return;
    setEditRow({ ...editRow, [e.target.name]: e.target.value });
  }, [editRow]);

  // Xử lý lưu chỉnh sửa
  const handleSave = useCallback(() => {
    if (editRow && editRow.id !== undefined) {
      // Tìm task gốc theo id
      const originalTask = tasks.find(t => t.id.toString() === editRow.id.toString());
      // Gộp task gốc và editRow để đảm bảo đủ field
      const updates = { ...originalTask, ...editRow };
      dispatch(updateTaskAsync({ id: editRow.id.toString(), updates })).then(() => {
        dispatch(fetchTasks());
        dispatch(setEditing(null));
        setEditRow(null);
      });
    }
  }, [dispatch, editRow, tasks]);

  // Xử lý hủy chỉnh sửa
  const handleCancel = useCallback(() => {
    dispatch(setEditing(null));
    setEditRow(null);
  }, [dispatch]);

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Hàm kiểm tra đã chọn hết chưa
  const isAllSelected = tasks.length > 0 && selectedIds.length === tasks.length;
  // Hàm chọn tất cả
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectIds(tasks.map((t: Task) => t.id.toString()));
    } else {
      onSelectIds([]);
    }
  };
  // Hàm chọn từng dòng
  const handleSelectRow = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectIds([...selectedIds, id]);
    } else {
      onSelectIds(selectedIds.filter((sid: string) => sid !== id));
    }
  };

  // Render bảng task
  return (
    <TableContainer component={Paper} sx={{ width: '100%', mb: 2 }}>
      {/* XÓA Chip custom test style inline */}
      <Table>
        <TableHead>
          <TableRow>
            {/* Cột checkbox đầu dòng, không hiển thị checkbox chọn tất cả */}
            <TableCell padding="checkbox"></TableCell>
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
            <TableCell>Assigned To</TableCell>
            <TableCell>Created By</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task: Task) => (
            <TaskRow
              key={task.id}
              task={task}
              editingId={editingId}
              editRow={editingId === task.id.toString() ? editRow : null}
              onEdit={handleEdit}
              onEditChange={handleEditChange}
              onSave={handleSave}
              onCancel={handleCancel}
              labelColorMap={labelColorMap}
              projectColorMap={projectColorMap}
              selected={selectedIds.includes(task.id.toString())}
              onSelect={handleSelectRow(task.id.toString())}
              // Đã loại bỏ employees
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable; 