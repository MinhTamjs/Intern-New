import React, { useState } from "react";
import { Stack, TextField, MenuItem, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useAppDispatch, useAppSelector } from "../store";
import { setFilter } from "../../features/filter/filterSlice";
import type { Task } from "../../../../types/schema";
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const filterButtonStyle = { minWidth: 160, maxWidth: 200, height: 40, fontWeight: 600 };

interface TaskFiltersProps {
  selectedIds: string[];
  onBulkDelete: () => void;
  onSelectAll: () => void;
  totalTasks: number;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ selectedIds, onBulkDelete, onSelectAll, totalTasks }) => {
  const dispatch = useAppDispatch();
  const filterStore = useAppSelector(state => state.filter);
  const tasks = useAppSelector(state => state.tasks.tasks);

  // State cục bộ cho filter, chỉ dispatch khi nhấn nút Filter
  const [filter, setFilterState] = useState(filterStore);

  // Lấy tất cả label thực tế từ danh sách task (không trùng lặp)
  const allLabels = Array.from(new Set(tasks.flatMap(task => task.labels ?? [])));
  // Lấy tất cả project thực tế từ danh sách task (không trùng lặp)
  const allProjects = Array.from(new Set(tasks.flatMap(task => task.projects ?? [])));

  // State dialog xác nhận xóa
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmAll, setConfirmAll] = useState(false);
  // State cho Snackbar cảnh báo
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleFilter = () => {
    dispatch(setFilter(filter));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterState({ ...filter, [e.target.name]: e.target.value });
  };

  // Xử lý chọn nhãn filter (multi-select)
  const handleLabelChange = (_: any, value: string[]) => {
    setFilterState({ ...filter, labels: value });
  };
  // Xử lý chọn dự án filter (multi-select)
  const handleProjectChange = (_: any, value: string[]) => {
    setFilterState({ ...filter, projects: value });
  };

  const handleDeleteClick = () => {
    if (selectedIds.length === 0) {
      setSnackbarOpen(true);
      return;
    }
    if (selectedIds.length === 1) {
      onBulkDelete();
    } else if (selectedIds.length > 1) {
      setOpenConfirm(true);
      setConfirmAll(false);
    }
  };
  const handleDeleteAllClick = () => {
    if (totalTasks === 0) {
      setSnackbarOpen(true);
      return;
    }
    onSelectAll();
    setOpenConfirm(true);
    setConfirmAll(true);
  };
  const handleConfirmDelete = () => {
    setOpenConfirm(false);
    onBulkDelete();
  };
  const handleCancelDelete = () => setOpenConfirm(false);

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="flex-start"
        useFlexGap
        sx={{ flexWrap: 'wrap', rowGap: 2, columnGap: 2 }}
      >
        <TextField
          label="Từ khóa tìm kiếm"
          name="keyword"
          value={filter.keyword}
          onChange={handleChange}
          size="small"
          sx={{ minWidth: 160, flex: '1 1 200px', maxWidth: 300 }}
        />
        {/* Combo box trạng thái */}
        <TextField
          select
          label="Trạng thái"
          name="status"
          value={filter.status}
          onChange={handleChange}
          size="small"
          sx={{ minWidth: 180, maxWidth: 260, flex: '1 1 220px' }} // Cho phép rộng hơn
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="Pending">Chưa làm</MenuItem>
          <MenuItem value="In Progress">Đang làm</MenuItem>
          <MenuItem value="Done">Hoàn thành</MenuItem>
          <MenuItem value="Expired">Quá hạn</MenuItem>
        </TextField>
        {/* Combo box độ ưu tiên */}
        <TextField
          select
          label="Độ ưu tiên"
          name="priority"
          value={filter.priority}
          onChange={handleChange}
          size="small"
          sx={{ minWidth: 180, maxWidth: 260, flex: '1 1 220px' }} // Cho phép rộng hơn
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="High">Cao</MenuItem>
          <MenuItem value="Medium">Trung bình</MenuItem>
          <MenuItem value="Low">Thấp</MenuItem>
        </TextField>
        {/* Bộ lọc nhãn (label, multi-select) */}
        <Autocomplete
          multiple
          freeSolo
          options={allLabels}
          value={filter.labels}
          onChange={handleLabelChange}
          renderInput={(params) => (
            <TextField {...params} label="Nhãn" placeholder="Nhập nhãn để lọc" size="small" fullWidth />
          )}
          size="small"
          sx={{ minWidth: 200, maxWidth: 340, flex: '2 1 260px' }} // Cho phép rộng hơn
        />
        {/* Bộ lọc dự án (project, multi-select) */}
        <Autocomplete
          multiple
          freeSolo
          options={allProjects}
          value={filter.projects}
          onChange={handleProjectChange}
          renderInput={(params) => (
            <TextField {...params} label="Dự án" placeholder="Nhập dự án để lọc" size="small" fullWidth />
          )}
          size="small"
          sx={{ minWidth: 200, maxWidth: 340, flex: '2 1 260px' }} // Cho phép rộng hơn
        />
        {/* Nút Filter với icon, màu primary nổi bật */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleFilter}
          sx={filterButtonStyle}
          size="small"
          startIcon={<FilterListIcon />}
        >
          Lọc
        </Button>
        {/* Nút Delete task với icon, màu đỏ nhạt (outlined) */}
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteClick}
          sx={{ minWidth: 120, flex: '0 0 auto', height: 40, fontWeight: 600, borderWidth: 2 }}
          startIcon={<DeleteIcon />}
        >
          Xóa công việc
        </Button>
        {/* Nút Delete all với icon, nền cam, chữ trắng, dùng class riêng */}
        <Button
          variant="contained"
          className="delete-all-btn"
          onClick={handleDeleteAllClick}
          sx={{
            minWidth: 120,
            flex: '0 0 auto',
            height: 40,
            fontWeight: 600,
            borderWidth: 2
          }}
          startIcon={<DeleteForeverIcon />}
        >
          Xóa tất cả
        </Button>
      </Stack>
      <Dialog open={openConfirm} onClose={handleCancelDelete}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          {confirmAll
            ? 'Bạn có chắc chắn muốn xóa tất cả các công việc?'
            : `Bạn có chắc chắn muốn xóa ${selectedIds.length} công việc đã chọn?`}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Hủy</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Xóa</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="warning" onClose={() => setSnackbarOpen(false)}>
          Vui lòng chọn ít nhất một công việc để xóa.
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default TaskFilters; 