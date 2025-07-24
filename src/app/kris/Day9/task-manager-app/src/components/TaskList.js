import React, { useEffect, useMemo } from 'react';
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

const TaskList = ({ search, setSearch, priorityFilter, setPriorityFilter, setHandleDeleteAll }) => {
  const { tasks, status, error } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Provide handleDeleteAll to parent for SearchBox
  useEffect(() => {
    if (setHandleDeleteAll) {
      setHandleDeleteAll(() => handleDeleteAll);
    }
    // eslint-disable-next-line
  }, [tasks]);

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
      {/* Task List */}
      <Card
        sx={{
          borderRadius: 0,
          boxShadow: 1,
          border: '4px solid #1976d2',
          mb: 5,
          p: 4,
          maxWidth: 1000,
          mx: 'auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <CardContent sx={{ p: 0 }}>
            <Typography variant="h5" fontWeight={1000} gutterBottom align="center">📝 Danh Sách Công Việc</Typography>
            {/* Horizontal Status Bar */}
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Paper elevation={3} sx={{ p: 0.5, textAlign: 'center', borderRadius: 2, border: '2px solid', borderImage: 'linear-gradient(90deg, #ff69b4, #c471f5) 1', minWidth: 70, width: 'auto' }}>
                <Typography variant="subtitle1" color="primary" sx={{ fontSize: 16 }}>{stats.total}</Typography>
                <Typography variant="caption">Tổng</Typography>
              </Paper>
              <Paper elevation={3} sx={{ p: 0.5, textAlign: 'center', borderRadius: 2, border: '2px solid', borderImage: 'linear-gradient(90deg, #ff69b4, #c471f5) 1', minWidth: 70, width: 'auto' }}>
                <Typography variant="subtitle1" color="success.main" sx={{ fontSize: 16 }}>{stats.completed}</Typography>
                <Typography variant="caption">Hoàn thành</Typography>
              </Paper>
              <Paper elevation={3} sx={{ p: 0.5, textAlign: 'center', borderRadius: 2, border: '2px solid', borderImage: 'linear-gradient(90deg, #ff69b4, #c471f5) 1', minWidth: 70, width: 'auto' }}>
                <Typography variant="subtitle1" color="warning.main" sx={{ fontSize: 16 }}>{stats.uncompleted}</Typography>
                <Typography variant="caption">Chưa xong</Typography>
              </Paper>
              <Paper elevation={3} sx={{ p: 0.5, textAlign: 'center', borderRadius: 2, border: '2px solid', borderImage: 'linear-gradient(90deg, #ff69b4, #c471f5) 1', minWidth: 70, width: 'auto' }}>
                <Typography variant="subtitle1" color="error.main" sx={{ fontSize: 16 }}>{stats.high}</Typography>
                <Typography variant="caption">Ưu tiên cao</Typography>
              </Paper>
            </Box>
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
                      width: 950,
                      maxWidth: '100%',
                      mx: 'auto',
                      marginBottom: '32px',
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
                        {isOverdue && (
                          <Chip label="Quá hạn" color="error" size="small" sx={{ fontWeight: 500, ml: 1, verticalAlign: 'middle' }} />
                        )}
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
                  </Paper>
                );
              })}
            </Stack>
          </CardContent>
        </Box>
      </Card>
    </>
  );
};

export default TaskList;