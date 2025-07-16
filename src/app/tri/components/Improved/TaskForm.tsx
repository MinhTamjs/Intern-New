import React, { useState } from "react";
import { TextField, Button, MenuItem, Paper, Typography, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { addTask } from "../../features/tasks/taskSlice";
import { Priority, Status } from "../../features/tasks/taskTypes";

const defaultForm = {
  title: "",
  description: "",
  dayStarted: "",
  dayExpired: "",
  priority: "Medium" as Priority,
  status: "Pending" as Status,
};

const TaskForm: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.dayStarted || !form.dayExpired) {
      setError("Please fill in all fields.");
      return;
    }
    dispatch(addTask(form));
    setForm(defaultForm);
    setError("");
    onFinish();
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom
      sx={{
        color: "#43e97b",
        fontFamily: "Arial, Segoe UI, sans-serif",
        fontWeight: 700,
        letterSpacing: 1,
        textShadow: "0 2px 8px #b2dfdb44, 0 2px 8px #fff"
      }}
      >
        Add New Task
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="title"
              label="Title"
              value={form.title}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="description"
              label="Description"
              value={form.description}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              name="dayStarted"
              label="Start Date"
              type="date"
              value={form.dayStarted}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              name="dayExpired"
              label="End Date"
              type="date"
              value={form.dayExpired}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              name="priority"
              label="Priority"
              value={form.priority}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              name="status"
              label="Status"
              value={form.status}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
              <MenuItem value="Expired">Expired</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item>
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default TaskForm; 