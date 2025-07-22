import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./store";
import { setEditing, fetchTasks } from "../features/tasks/taskSlice";
import TaskTable from "./TaskTable";
import TaskForm from "./TaskForm";
import TaskFilters from "./TaskFilters";
import LoadingError from "./LoadingError";
import { Container, Typography, Box, ThemeProvider, createTheme, CssBaseline, IconButton } from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const App: React.FC = () => {
  // Lấy danh sách task, id đang edit, filter từ Redux store
  const tasks = useAppSelector(state => state.tasks.tasks);
  const loading = useAppSelector(state => state.tasks.loading);
  const error = useAppSelector(state => state.tasks.error);
  const editingId = useAppSelector(state => state.tasks.editingId);
  const filter = useAppSelector(state => state.filter);
  const dispatch = useAppDispatch();

  // Khi component mount, tự động fetch danh sách Task từ API
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Lọc task theo từ khóa, trạng thái, độ ưu tiên, nhiều nhãn (labels) và nhiều dự án (projects)
  // Dùng useMemo để chỉ lọc lại khi tasks hoặc filter thay đổi (memo hóa)
  const filteredTasks = useMemo(() => tasks.filter(task => {
    const matchKeyword =
      filter.keyword === "" ||
      task.title.toLowerCase().includes(filter.keyword.toLowerCase()) ||
      task.description.toLowerCase().includes(filter.keyword.toLowerCase());
    const matchStatus =
      filter.status === "" || filter.status === "All" || task.status === filter.status;
    const matchPriority =
      filter.priority === "" || filter.priority === "All" || task.priority === filter.priority;
    // Lọc theo nhiều nhãn: task.labels phải chứa ít nhất 1 nhãn trong filter.labels (OR logic, không phân biệt hoa thường/hoa, loại bỏ khoảng trắng)
    const matchLabels =
      !filter.labels || filter.labels.length === 0 ||
      filter.labels.some(lab =>
        (task.labels ?? []).some(tlab => tlab.trim().toLowerCase() === lab.trim().toLowerCase())
      );
    // Lọc theo nhiều dự án: task.projects phải chứa ít nhất 1 project trong filter.projects (OR logic, không phân biệt hoa thường/hoa, loại bỏ khoảng trắng)
    const matchProjects =
      !filter.projects || filter.projects.length === 0 ||
      filter.projects.some(proj =>
        (task.projects ?? []).some(tproj => tproj.trim().toLowerCase() === proj.trim().toLowerCase())
      );
    return matchKeyword && matchStatus && matchPriority && matchLabels && matchProjects;
  }), [tasks, filter]);

  // Hàm callback khi thêm mới task xong (hiện tại chỉ reset form)
  const handleFinish = () => {};

  // State dark mode, lấy từ localStorage nếu có
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Tạo theme light và dark
  const theme = React.useMemo(() => createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: isDarkMode ? '#43e97b' : '#1976d2',
      },
      background: {
        default: isDarkMode ? '#181a1b' : '#f8fafc',
        paper: isDarkMode ? '#23272a' : '#fff',
      },
      text: {
        primary: isDarkMode ? '#f8fafc' : '#181a1b',
        secondary: isDarkMode ? '#b0b3b8' : '#555',
      },
      divider: isDarkMode ? '#333' : '#e0e0e0',
      action: {
        active: isDarkMode ? '#43e97b' : '#1976d2',
      },
    },
    shape: { borderRadius: 8 },
  }), [isDarkMode]);

  // Thêm/xóa class dark-mode vào body khi chuyển dark mode
  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Hàm chuyển đổi dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      localStorage.setItem('darkMode', JSON.stringify(!prev));
      return !prev;
    });
  };

  // Giao diện chính: Form thêm, bộ lọc, bảng task
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header với nút chuyển đổi dark/light */}
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <Typography variant="h4" align="center" gutterBottom flex={1}>
            Task Management
          </Typography>
          <IconButton onClick={toggleDarkMode} color="inherit" sx={{ ml: 2 }}>
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
        <Box sx={{ mb: 3 }}>
          <TaskForm onFinish={handleFinish} />
          <TaskFilters />
          <LoadingError loading={loading} error={error} />
          <TaskTable
            tasks={filteredTasks}
            editingId={editingId}
            onEdit={id => dispatch(setEditing(id))}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App; 