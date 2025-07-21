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
    <Card sx={{ mb: 4, borderRadius: 0, boxShadow: 2, p: 0.2, maxWidth: 1000, display: 'flex', justifyContent: 'center', margin: '0 auto', width: '100%', background: '#fff', border: '1px solid #e0e0e0', fontSize: '0.85rem' }}>
      <CardContent sx={{ p: 0.7 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', mb: 0.5 }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom align="center" sx={{ width: '100%', fontSize: '0.95rem' }}>
            + Thêm Công Việc Mới
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          <Grid container spacing={0.7} columns={10} alignItems="center" sx={{ fontSize: '0.85rem' }}>
            <Grid gridColumn="span 5">
              <TextField
                label="Tiêu đề công việc"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                variant="outlined"
              />
            </Grid>
            <Grid gridColumn="span 5">
              <FormControl fullWidth required sx={{ minWidth: 10 }}>
                <InputLabel id="priority-label">Mức độ ưu tiên</InputLabel>
                <Select
                  labelId="priority-label"
                  value={priority}
                  label="Mức độ ưu tiên"
                  onChange={(e) => setPriority(e.target.value)}
                  sx={{ minWidth: 180 }}
                >
                  {PRIORITY_OPTIONS.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid gridColumn="span 3">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Ngày hết hạn"
                  value={endDate}
                  onChange={setEndDate}
                  format="DD/MM/YYYY"
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid gridColumn="span 1">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  height: '50px',
                  background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
                  fontWeight: 700,
                  boxShadow: 2,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.05)', background: 'linear-gradient(90deg, #2575fc 0%, #6a11cb 100%)' }
                }}
                fullWidth
              >
                Thêm Công Việc
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskForm;