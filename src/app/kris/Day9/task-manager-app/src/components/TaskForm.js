import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../features/tasks/taskSlice';
import {
  Card, CardContent, Typography, TextField, Button, MenuItem, Grid, InputLabel, Select, FormControl, Box
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'Cao (High)' },
  { value: 'medium', label: 'Trung bình (Medium)' },
  { value: 'low', label: 'Thấp (Low)' },
];

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('');
  const [endDate, setEndDate] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && priority && endDate) {
      dispatch(createTask({
        title,
        priority,
        endDate: endDate.format('YYYY-MM-DD'),
        completed: false,
      }));
      setTitle('');
      setPriority('');
      setEndDate(null);
    }
  };

  return (
    <Card sx={{ mb: 4, borderRadius: 0, boxShadow: 2, p: 0.2, maxWidth: 1060, mx: 'auto', width: '100%', background: '#fff', border: '4px solid #1976d2', fontSize: '0.85rem' }}>
      <CardContent sx={{ p: 0.7 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', mb: 0.5 }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom align="center" sx={{ width: '100%', fontSize: '0.95rem' }}>
            + Thêm Công Việc Mới
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 0, gap: 0, width: '100%' }}>
            <Box sx={{ flex: 1, px: 1, display: 'flex', alignItems: 'center' }}>
              <TextField
                label="Tiêu đề công việc"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                variant="outlined"
                sx={{
                  height: 56,
                  '.MuiInputBase-root': { height: 56, boxSizing: 'border-box', alignItems: 'center' },
                  '.MuiOutlinedInput-input': { p: '16.5px 14px' }
                }}
              />
            </Box>
            <Box sx={{ flex: 1, px: 1, display: 'flex', alignItems: 'center' }}>
              <FormControl fullWidth required sx={{
                height: 56,
                '.MuiInputBase-root': { height: 56, boxSizing: 'border-box', alignItems: 'center' },
                '.MuiSelect-select': { p: '16.5px 14px' }
              }}>
                <InputLabel id="priority-label">Mức độ ưu tiên</InputLabel>
                <Select
                  labelId="priority-label"
                  value={priority}
                  label="Mức độ ưu tiên"
                  onChange={(e) => setPriority(e.target.value)}
                  sx={{ height: 56 }}
                >
                  {PRIORITY_OPTIONS.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1, px: 1, display: 'flex', alignItems: 'center' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Ngày hết hạn"
                  value={endDate}
                  onChange={setEndDate}
                  format="DD/MM/YYYY"
                  slotProps={{ textField: { fullWidth: true, required: true, sx: { height: 56, '.MuiInputBase-root': { height: 56, boxSizing: 'border-box', alignItems: 'center' }, '.MuiOutlinedInput-input': { p: '16.5px 14px' } } } }}
                />
              </LocalizationProvider>
            </Box>
            <Box sx={{ flex: 1, px: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ height: 56, fontWeight: 700, boxShadow: 2, fontSize: '0.95rem', p: 0, background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', '&:hover': { background: 'linear-gradient(90deg, #2575fc 0%, #6a11cb 100%)', transform: 'scale(1.05)' } }}
                fullWidth
              >
                Thêm Công Việc
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskForm;