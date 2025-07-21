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

// Hàm chuyển đổi thứ tiếng Anh sang tiếng Việt
function formatVietnameseDate(dateStr) {
  const d = dayjs(dateStr);
  return d.format('DD/MM/YY');
}

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
    dispatch(updateTaskAsync({ id: task.id, updatedTask: { ...task, completed: !task.completed } }));
  };

  const handleDelete = (id) => {
    dispatch(deleteTaskAsync(id));
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ công việc?')) {
      for (const task of tasks) {
        if (task.id) {
          await dispatch(deleteTaskAsync(task.id));
        }
      }
      dispatch(fetchTasks());
    }
  };

  if (status === 'loading') return <Typography>Loading...</Typography>;
  if (status === 'failed') return <Typography color="error">Error: {error}</Typography>;

  return (
    <>
      {/* Stats */}
      <Grid container spacing={2} columns={12} mb={2} justifyContent="center" alignItems="center" textAlign="center">
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
      <Card
        sx={{
          borderRadius: 10,
          boxShadow: 1,
          borderLeft: '10px solid #1976d2',
          mb: 5,
          p: 9,
          display: 'flex',
          justifyContent: 'center',
          maxWidth: 1000,
          pt: 10,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight={1000} gutterBottom align="center">📝 Danh Sách Công Việc</Typography>
          <Divider sx={{ mb: 1 }} />
          <Stack spacing={1}>
            {filteredTasks.length === 0 && (
              <Typography color="text.secondary">Không có công việc nào phù hợp.</Typography>
            )}
            {filteredTasks.filter(task => !!task.id).length === 0 && filteredTasks.length > 0 && (
              <Typography color="text.secondary">Dữ liệu task không hợp lệ (thiếu id).</Typography>
            )}
            {filteredTasks.filter(task => !!task.id).map((task, idx) => {
              const isOverdue = !task.completed && dayjs(task.endDate).isBefore(dayjs(), 'day');
              return (
                <Paper key={task.id || idx} elevation={4}
                  sx={{
                    p: 1.5,
                    minHeight: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderLeft: `5px solid ${
                      task.priority === 'high' ? '#d32f2f' : task.priority === 'medium' ? '#fbc02d' : '#388e3c'
                    }`,
                    background: task.completed ? '#f0f4c3' : '#fff',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    width: '100%',
                    margin: 0,
                    marginBottom: '40px',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', p: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: 19,
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'gray' : 'inherit',
                        mr: 4,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flexGrow: 1,
                      }}
                      title={task.title}
                    >
                      {task.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 10, justifyContent: 'flex-end' }}>
                      <Chip
                        label={(() => {
                          if (task.priority === 'high') return 'Cao';
                          if (task.priority === 'medium') return 'Trung bình';
                          if (task.priority === 'low') return 'Thấp';
                          return 'Không rõ';
                        })()}
                        color={PRIORITY_LABELS[task.priority]?.color || 'default'}
                        size="medium"
                        sx={{ fontSize: 15, height: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 14, textAlign: 'right', minWidth: 120 }}>
                        Hạn chót: {formatVietnameseDate(task.endDate)}
                      </Typography>
                    </Box>
                    {isOverdue && (
                      null
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pr: 3, gap: 2 }}>
                      <Tooltip title={task.completed ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}>
                        <Checkbox
                          checked={task.completed}
                          onChange={() => handleToggle(task)}
                          color="success"
                          sx={{ '& .MuiSvgIcon-root': { fontSize: 25 } }}
                        />
                      </Tooltip>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(task.id)}
                        sx={{ fontWeight: 700, boxShadow: 2, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.08)' } }}
                      >
                        Xóa
                      </Button>
                    </Box>
                  </Box>
                  {isOverdue && (
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
                      <Chip label="Quá hạn" color="error" size="small" sx={{ fontWeight: 500 }} />
                    </Box>
                  )}
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