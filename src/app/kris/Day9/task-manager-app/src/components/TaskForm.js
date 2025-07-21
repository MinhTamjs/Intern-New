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
    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3, p: 3, minWidth: 500, display: 'flex', justifyContent: 'center' }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          + Thêm Công Việc Mới
        </Typography>
        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          <Grid container spacing={2} columns={12} alignItems="center">
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
            <Grid gridColumn="span 3">
              <FormControl fullWidth required sx={{ minWidth: 180 }}>
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
                  height: '100%',
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