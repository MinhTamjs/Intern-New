import React, { useState } from "react";
import { Stack, TextField, MenuItem, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useAppDispatch, useAppSelector } from "./store";
import { setFilter } from "../features/filter/filterSlice";
import { Priority, Status } from "../features/tasks/taskTypes";
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

// Danh sách nhãn và dự án mẫu (nên đồng bộ với form, có thể lấy từ API)
// Xóa sampleLabels, chỉ giữ sampleProjects cho project
const sampleProjects = ["E-commerce Website", "Study Management App", "Internal Project"];

const filterBoxStyle = { minWidth: 160, maxWidth: 200, height: 40 };
const filterButtonStyle = { minWidth: 160, maxWidth: 200, height: 40, fontWeight: 600 };

interface TaskFiltersProps {
  selectedIds: string[];
  onBulkDelete: () => void;
  onSelectAll: () => void;
  totalTasks: number;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ selectedIds, onBulkDelete, onSelectAll, totalTasks }) => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(state => state.filter);
  // Lấy danh sách task thực tế từ store để lấy tất cả label/project đã có
  const tasks = useAppSelector(state => state.tasks.tasks);

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
    dispatch(setFilter({ [e.target.name]: e.target.value }));
  };

  // Xử lý chọn nhãn filter (multi-select)
  const handleLabelChange = (_: any, value: string[]) => {
    dispatch(setFilter({ labels: value }));
  };
  // Xử lý chọn dự án filter (multi-select)
  const handleProjectChange = (_: any, value: string[]) => {
    dispatch(setFilter({ projects: value }));
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
          label="Search keyword"
          name="keyword"
          value={filter.keyword}
          onChange={handleChange}
          size="small"
          sx={{ minWidth: 160, flex: '1 1 200px', maxWidth: 300 }}
        />
        <TextField
          select
          label="Status"
          name="status"
          value={filter.status}
          onChange={handleChange}
          size="small"
          sx={{ minWidth: 160, flex: '1 1 200px', maxWidth: 300 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
          <MenuItem value="Expired">Expired</MenuItem>
        </TextField>
        <TextField
          select
          label="Priority"
          name="priority"
          value={filter.priority}
          onChange={handleChange}
          size="small"
          sx={{ minWidth: 160, flex: '1 1 200px', maxWidth: 300 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
        </TextField>
        {/* Bộ lọc nhãn (label, multi-select) */}
        <Autocomplete
          multiple
          freeSolo
          options={allLabels}
          value={filter.labels}
          onChange={handleLabelChange}
          renderInput={(params) => (
            <TextField {...params} label="Labels" placeholder="Type label(s) to filter" size="small" />
          )}
          size="small"
          sx={{ minWidth: 160, flex: '1 1 200px', maxWidth: 300 }}
        />
        {/* Bộ lọc dự án (project, multi-select) */}
        <Autocomplete
          multiple
          freeSolo
          options={allProjects}
          value={filter.projects}
          onChange={handleProjectChange}
          renderInput={(params) => (
            <TextField {...params} label="Projects" placeholder="Type project(s) to filter" size="small" />
          )}
          size="small"
          sx={{ minWidth: 160, flex: '1 1 200px', maxWidth: 300 }}
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
          Filter
        </Button>
        {/* Nút Delete task với icon, màu đỏ nhạt (outlined) */}
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteClick}
          sx={{ minWidth: 120, flex: '0 0 auto', height: 40, fontWeight: 600, borderWidth: 2 }}
          startIcon={<DeleteIcon />}
        >
          Delete task
        </Button>
        {/* Nút Delete all với icon, màu cam nổi bật */}
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteAllClick}
          sx={{
            minWidth: 120,
            flex: '0 0 auto',
            height: 40,
            fontWeight: 600,
            backgroundColor: '#ff9800', // cam nhạt
            color: '#fff',
            '&:hover': { backgroundColor: '#f57c00' }, // cam đậm hơn khi hover
            borderWidth: 2
          }}
          startIcon={<DeleteForeverIcon />}
        >
          Delete all
        </Button>
      </Stack>
      <Dialog open={openConfirm} onClose={handleCancelDelete}>
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent>
          {confirmAll
            ? 'Are you sure you want to delete all tasks?'
            : `Are you sure you want to delete ${selectedIds.length} selected task(s)?`}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="warning" onClose={() => setSnackbarOpen(false)}>
          Please select at least one task to delete.
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default TaskFilters; 