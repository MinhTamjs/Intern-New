// Import các thư viện React, MUI, Redux cần thiết
import React, { useState } from "react";
import { TextField, Button, MenuItem, Paper, Typography, Grid, Box, Chip, InputAdornment, IconButton } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useAppDispatch, useAppSelector } from "./store";
import { addTask, fetchTasks } from "../features/tasks/taskSlice";
import { Priority, Status } from "../features/tasks/taskTypes";
import CloseIcon from "@mui/icons-material/Close";

// Danh sách nhãn mẫu và dự án mẫu (có thể lấy từ API hoặc hardcode demo)
const sampleProjects = ["E-commerce Website", "Study Management App", "Internal Project"];

// Giá trị mặc định cho form nhập task
const defaultForm = {
  title: "",
  description: "",
  dayStarted: "",
  dayExpired: "",
  priority: "Medium" as Priority,
  status: "Pending" as Status,
  labels: [] as string[],
  projects: [] as string[], // Danh sách dự án cho task
};

// Component form thêm mới task
const TaskForm: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  // State lưu giá trị form
  const [form, setForm] = useState(defaultForm);
  // State lưu lỗi nhập liệu
  const [error, setError] = useState("");
  // Thêm state cho input tạm thời của labels/projects
  const [labelInput, setLabelInput] = useState("");
  const [projectInput, setProjectInput] = useState("");
  // Lấy dispatch từ store
  const dispatch = useAppDispatch();
  // Lấy danh sách task hiện tại từ store
  const tasks = useAppSelector(state => state.tasks.tasks);

  // Xử lý thay đổi input cơ bản (text, date, select)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // Xử lý thay đổi nhãn (labels) - Autocomplete
  const handleLabelsChange = (_: any, value: string[]) => {
    setForm({ ...form, labels: value });
  };
  // Xử lý thay đổi project (multi-select) - Autocomplete
  const handleProjectsChange = (_: any, value: string[]) => {
    setForm({ ...form, projects: value });
  };

  // Hàm tách tất cả hashtag hợp lệ từ input (chỉ nhận chữ, số, _ hoặc -)
  function extractTags(input: string) {
    return (input.match(/#([\w-]+)/g) || []).map(t => t.slice(1));
  }

  // Xử lý thay đổi input label: chỉ cập nhật input, không tách tag ở đây!
  const handleLabelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelInput(e.target.value);
  };
  // Xử lý thay đổi input project: chỉ cập nhật input, không tách tag ở đây!
  const handleProjectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectInput(e.target.value);
  };

  // Xử lý khi người dùng nhấn phím (Space, Comma, Enter) để xác nhận hashtag cho labels
  const handleLabelInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ([" ", ",", "Enter"].includes(e.key)) {
      const tags = extractTags(labelInput);
      if (tags.length > 0) {
        setForm({
          ...form,
          labels: [...form.labels, ...tags.filter(t => !form.labels.includes(t))],
        });
        setLabelInput("");
        e.preventDefault();
      }
    }
  };
  // Khi input mất focus, cũng tách toàn bộ hashtag hợp lệ
  const handleLabelInputBlur = () => {
    const tags = extractTags(labelInput);
    if (tags.length > 0) {
      setForm({
        ...form,
        labels: [...form.labels, ...tags.filter(t => !form.labels.includes(t))],
      });
      setLabelInput("");
    }
  };
  // Xử lý khi người dùng nhấn phím (Space, Comma, Enter) để xác nhận hashtag cho projects
  const handleProjectInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ([" ", ",", "Enter"].includes(e.key)) {
      const tags = extractTags(projectInput);
      if (tags.length > 0) {
        setForm({
          ...form,
          projects: [...form.projects, ...tags.filter(t => !form.projects.includes(t))],
        });
        setProjectInput("");
        e.preventDefault();
      }
    }
  };
  const handleProjectInputBlur = () => {
    const tags = extractTags(projectInput);
    if (tags.length > 0) {
      setForm({
        ...form,
        projects: [...form.projects, ...tags.filter(t => !form.projects.includes(t))],
      });
      setProjectInput("");
    }
  };

  // Xóa label đã chọn khỏi mảng labels
  const handleDeleteLabel = (labelToDelete: string) => {
    setForm((prev) => ({ ...prev, labels: prev.labels.filter((l) => l !== labelToDelete) }));
  };
  // Xóa project đã chọn khỏi mảng projects
  const handleDeleteProject = (projectToDelete: string) => {
    setForm((prev) => ({ ...prev, projects: prev.projects.filter((p) => p !== projectToDelete) }));
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Kiểm tra các trường bắt buộc
    if (!form.title || !form.description || !form.dayStarted || !form.dayExpired) {
      setError("Please fill in all fields.");
      return;
    }
    // Kiểm tra trùng lặp title (không phân biệt hoa thường, loại bỏ khoảng trắng)
    const isDuplicate = tasks.some(
      (task) => task.title.trim().toLowerCase() === form.title.trim().toLowerCase()
    );
    if (isDuplicate) {
      setError("Task title already exists.");
      return;
    }
    try {
      // Gửi action thêm task
      await dispatch(addTask(form)).unwrap();
      // Lấy lại danh sách task mới
      await dispatch(fetchTasks());
      // Reset form về mặc định
      setForm(defaultForm);
      setError("");
      // Gọi callback khi hoàn thành
      onFinish();
    } catch (err) {
      setError("Failed to add task");
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        boxShadow: 3,
        background: '#f8fafc',
      }}
    >
      {/* Tiêu đề form */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: "#43e97b",
          fontWeight: 700,
          letterSpacing: 1,
          mb: 2,
        }}
      >
        Add New Task
      </Typography>
      {/* Hiển thị lỗi nếu có */}
      {error && (
        <Typography color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        {/* Hàng 1: Title & Projects */}
        <Grid container spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={12} md={8}>
            {/* Nhập tiêu đề task */}
            <TextField
              name="title"
              label="Title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            {/* Nhập/chọn nhiều project cho task bằng #hashtag. Chỉ tạo khi nhấn Space, Comma, Enter hoặc blur. */}
            <TextField
              label="Projects"
              value={projectInput}
              onChange={handleProjectInputChange}
              onKeyDown={handleProjectInputKeyDown} // Xử lý xác nhận hashtag
              onBlur={handleProjectInputBlur} // Xử lý khi mất focus
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {form.projects.map((project) => (
                      <Chip
                        key={project}
                        label={project}
                        size="small"
                        onDelete={() => handleDeleteProject(project)}
                        sx={{ mr: 0.5 }}
                      />
                    ))}
                  </InputAdornment>
                ),
              }}
              placeholder="Type #project to add (#web #app)"
            />
          </Grid>
        </Grid>
        {/* Hàng 2: Description & Labels */}
        <Grid container spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={12} md={8}>
            {/* Nhập mô tả task */}
            <TextField
              name="description"
              label="Description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              size="small"
              multiline
              minRows={2}
              maxRows={4}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            {/* Nhập/chọn nhiều label cho task bằng #hashtag. Chỉ tạo khi nhấn Space, Comma, Enter hoặc blur. */}
            <TextField
              label="Labels"
              value={labelInput}
              onChange={handleLabelInputChange}
              onKeyDown={handleLabelInputKeyDown} // Xử lý xác nhận hashtag
              onBlur={handleLabelInputBlur} // Xử lý khi mất focus
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {form.labels.map((label) => (
                      <Chip
                        key={label}
                        label={label}
                        size="small"
                        onDelete={() => handleDeleteLabel(label)}
                        sx={{ mr: 0.5 }}
                      />
                    ))}
                  </InputAdornment>
                ),
              }}
              placeholder="Type #label to add (#urgent #bug)"
            />
          </Grid>
        </Grid>
        {/* Hàng 3: Start/End Date, Priority, Status */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            {/* Ngày bắt đầu */}
            <TextField
              name="dayStarted"
              label="Start Date"
              type="date"
              value={form.dayStarted}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {/* Ngày kết thúc */}
            <TextField
              name="dayExpired"
              label="End Date"
              type="date"
              value={form.dayExpired}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {/* Chọn độ ưu tiên */}
            <TextField
              select
              name="priority"
              label="Priority"
              value={form.priority}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {/* Chọn trạng thái task */}
            <TextField
              select
              name="status"
              label="Status"
              value={form.status}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
              <MenuItem value="Expired">Expired</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        {/* Nút Add fullWidth, cùng độ rộng với input */}
        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Add
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default TaskForm; 