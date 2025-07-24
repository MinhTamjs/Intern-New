import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateTaskAsync } from '../features/tasks/taskSlice';
import { Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'Cao (High)' },
  { value: 'medium', label: 'Trung bình (Medium)' },
  { value: 'low', label: 'Thấp (Low)' },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#e0ffff',
  border: '4px solid #1976d2',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const EditTaskModal = ({ open, task, onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('');
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setPriority(task.priority || '');
      setEndDate(task.endDate ? dayjs(task.endDate) : null);
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !priority || !endDate) return;
    await dispatch(updateTaskAsync({
      id: task.id,
      updatedTask: {
        ...task,
        title,
        priority,
        endDate: endDate.format('YYYY-MM-DD'),
      },
    }));
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" fontWeight={700} mb={2} align="center">
          Chỉnh sửa công việc
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Tiêu đề công việc"
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth required sx={{ mb: 2 }}>
            <InputLabel id="edit-priority-label">Mức độ ưu tiên</InputLabel>
            <Select
              labelId="edit-priority-label"
              value={priority}
              label="Mức độ ưu tiên"
              onChange={e => setPriority(e.target.value)}
            >
              {PRIORITY_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Ngày hết hạn"
              value={endDate}
              onChange={setEndDate}
              format="DD/MM/YYYY"
              slotProps={{ textField: { fullWidth: true, required: true, sx: { mb: 2 } } }}
            />
          </LocalizationProvider>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button onClick={onClose} color="secondary" variant="outlined">Hủy</Button>
            <Button type="submit" variant="contained" color="primary">Lưu</Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditTaskModal; 