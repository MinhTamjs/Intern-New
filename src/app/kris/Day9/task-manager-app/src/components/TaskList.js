import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, updateTaskAsync, deleteTaskAsync } from '../features/tasks/taskSlice';
import {
  Card, CardContent, Typography, Checkbox, Button, Grid, Box, Chip, Stack, TextField, MenuItem, Paper, Divider, Tooltip, FormControl, InputLabel, Select
} from '@mui/material';
import { Delete, Edit, FilterAlt, Clear, CheckCircle, HourglassEmpty, PriorityHigh, LowPriority } from '@mui/icons-material';
import dayjs from 'dayjs';

const PRIORITY_LABELS = {
  high: { label: 'Cao (High)', color: 'error', icon: <PriorityHigh fontSize="small" /> },
  medium: { label: 'Trung bình (Medium)', color: 'warning', icon: <HourglassEmpty fontSize="small" /> },
  low: { label: 'Thấp (Low)', color: 'success', icon: <LowPriority fontSize="small" /> },
};

const TaskList = () => {
  const { tasks, status, error } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  // Filter & search state
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchTitle = task.title.toLowerCase().includes(search.toLowerCase());
      const matchPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      return matchTitle && matchPriority;
    });
  }, [tasks, search, priorityFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const high = tasks.filter(t => t.priority === 'high').length;
    return {
      total,
      completed,
      uncompleted: total - completed,
      high,
    };
  }, [tasks]);

  const handleToggle = (task) => {
    dispatch(updateTaskAsync({ id: task._id, updatedTask: { ...task, completed: !task.completed } }));
  };

  const handleDelete = (id) => {
    dispatch(deleteTaskAsync(id));
  };

  if (status === 'loading') return <Typography>Loading...</Typography>;
  if (status === 'failed') return <Typography color="error">Error: {error}</Typography>;

  return (
    <>
      {/* Filter & Search */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>🔎 Tìm Kiếm & Lọc</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid gridColumn="span 5">
              <TextField
                label="Tìm kiếm theo tên"
                value={search}
                onChange={e => setSearch(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid gridColumn="span 3">
              <FormControl fullWidth>
                <InputLabel id="priority-filter-label">Lọc theo mức độ ưu tiên</InputLabel>
                <Select
                  labelId="priority-filter-label"
                  id="priority-filter"
                  value={priorityFilter}
                  label="Lọc theo mức độ ưu tiên"
                  onChange={e => setPriorityFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="high">Cao (High)</MenuItem>
                  <MenuItem value="medium">Trung bình (Medium)</MenuItem>
                  <MenuItem value="low">Thấp (Low)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid gridColumn="span 2">
              <Button
                variant="contained"
                color="success"
                startIcon={<Clear />}
                onClick={() => { setSearch(''); setPriorityFilter('all'); }}
                fullWidth
              >
                Xóa Bộ Lọc
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={2} columns={12} mb={2}>
        <Grid gridColumn="span 3">
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" color="primary">{stats.total}</Typography>
            <Typography variant="body2">Tổng số công việc</Typography>
          </Paper>
        </Grid>
        <Grid gridColumn="span 3">
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" color="success.main">{stats.completed}</Typography>
            <Typography variant="body2">Đã hoàn thành</Typography>
          </Paper>
        </Grid>
        <Grid gridColumn="span 3">
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" color="warning.main">{stats.uncompleted}</Typography>
            <Typography variant="body2">Chưa hoàn thành</Typography>
          </Paper>
        </Grid>
        <Grid gridColumn="span 3">
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" color="error.main">{stats.high}</Typography>
            <Typography variant="body2">Ưu tiên cao</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Task List */}
      <Card sx={{ borderRadius: 3, boxShadow: 3, borderLeft: '6px solid #1976d2', mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>📝 Danh Sách Công Việc</Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {filteredTasks.length === 0 && (
              <Typography color="text.secondary">Không có công việc nào phù hợp.</Typography>
            )}
            {filteredTasks.map((task) => {
              const isOverdue = !task.completed && dayjs(task.endDate).isBefore(dayjs(), 'day');
              return (
                <Paper
                  key={task._id}
                  elevation={4}
                  sx={{
                    p: 2,
                    borderLeft: `6px solid ${
                      task.priority === 'high' ? '#d32f2f' : task.priority === 'medium' ? '#fbc02d' : '#388e3c'
                    }`,
                    background: task.completed ? '#f0f4c3' : '#fff',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    '&:hover': { boxShadow: 8, transform: 'scale(1.01)' },
                  }}
                >
                  <Grid container alignItems="center" spacing={2} columns={12}>
                    <Grid gridColumn="span 8">
                      <Typography variant="h6" sx={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'gray' : 'inherit' }}>
                        {task.title}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                        <Chip
                          label={PRIORITY_LABELS[task.priority]?.label || 'Không rõ'}
                          color={PRIORITY_LABELS[task.priority]?.color || 'default'}
                          icon={PRIORITY_LABELS[task.priority]?.icon}
                          size="small"
                        />
                        <Typography variant="body2" color="text.secondary">
                          Hạn chót: {dayjs(task.endDate).format('dddd, DD [tháng] MM, YYYY')}
                        </Typography>
                        {isOverdue && (
                          <Chip label="Quá hạn" color="error" size="small" sx={{ fontWeight: 700 }} />
                        )}
                        <Typography variant="body2" color={task.completed ? 'success.main' : 'warning.main'}>
                          Trạng thái: {task.completed ? <><CheckCircle fontSize="small" color="success" /> Đã hoàn thành</> : <><HourglassEmpty fontSize="small" color="warning" /> Chưa hoàn thành</>}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid gridColumn="span 2">
                      <Tooltip title={task.completed ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}>
                        <Checkbox
                          checked={task.completed}
                          onChange={() => handleToggle(task)}
                          color="success"
                          sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid gridColumn="span 2">
                      <Stack direction="row" spacing={1}>
                        {/* Nút Sửa có thể mở modal chỉnh sửa nếu muốn mở rộng */}
                        {/* <Button variant="outlined" color="warning" startIcon={<Edit />}>Sửa</Button> */}
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(task._id)}
                          sx={{ fontWeight: 700, boxShadow: 2, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.08)' } }}
                        >
                          Xóa
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default TaskList;