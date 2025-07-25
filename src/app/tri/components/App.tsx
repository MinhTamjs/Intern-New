import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "./store";
import { deleteTaskAsync, setEditing, fetchTasks, updateTaskAsync } from "../features/tasks/taskSlice";
import TaskTable from "./tasks/TaskTable";
import TaskForm from "./tasks/TaskForm";
import TaskFilters from "./tasks/TaskFilters";
import LoadingError from "./LoadingError";
import SplashScreen from './animations/SplashScreen';
import AnimationWrapper from './animations/AnimationWrapper';
import { Container, Typography, Box, ThemeProvider, createTheme, CssBaseline, IconButton, Paper } from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { PaletteMode } from '@mui/material';
import { motion } from 'framer-motion';
import AddTaskBox from './tasks/AddTaskBox';
import TaskListBox from './tasks/TaskListBox';
import { getEmployees } from "../features/tasks/taskApi";
import type { Employee } from "../../../types/schema";
import Employees from "./employees/Employees";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';

const App: React.FC = () => {
  // Lấy danh sách task, id đang edit, filter từ Redux store
  const tasks = useAppSelector(state => state.tasks.tasks);
  const loading = useAppSelector(state => state.tasks.loading);
  const error = useAppSelector(state => state.tasks.error);
  const editingId = useAppSelector(state => state.tasks.editingId);
  const filter = useAppSelector(state => state.filter);
  const dispatch = useAppDispatch();

  // State lưu các task được chọn để xóa đồng loạt
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // State lấy danh sách nhân viên từ API để truyền xuống các component con
  const [employees, setEmployees] = useState<Employee[]>([]);
  useEffect(() => {
    getEmployees().then(setEmployees);
  }, []);

  // State hiển thị splash screen khi vào app
  const [showSplash, setShowSplash] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000); // 4 giây
    return () => clearTimeout(timer);
  }, []);

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
      filter.labels.some((lab: string) =>
        (Array.isArray(task.labels) ? task.labels : []).some((tlab: string) => tlab.trim().toLowerCase() === lab.trim().toLowerCase())
      );
    // Lọc theo nhiều dự án: task.projects phải chứa ít nhất 1 project trong filter.projects (OR logic, không phân biệt hoa thường/hoa, loại bỏ khoảng trắng)
    const matchProjects =
      !filter.projects || filter.projects.length === 0 ||
      filter.projects.some((proj: string) =>
        (Array.isArray(task.projects) ? task.projects : []).some((tproj: string) => tproj.trim().toLowerCase() === proj.trim().toLowerCase())
      );
    return matchKeyword && matchStatus && matchPriority && matchLabels && matchProjects;
  }), [tasks, filter]);

  // Hàm callback khi thêm mới task xong (hiện tại chỉ reset form)
  const handleFinish = () => {};

  // Hàm xóa đồng loạt
  const handleBulkDelete = async (): Promise<void> => {
    if (selectedIds.length === 0) return;
    for (const id of selectedIds) {
      await dispatch(deleteTaskAsync(id));
    }
    setSelectedIds([]);
    dispatch(fetchTasks());
  };

  // Hàm chọn tất cả task đang hiển thị
  const handleSelectAll = (): void => {
    setSelectedIds(filteredTasks.map((t: typeof tasks[0]) => t.id.toString()));
  };

  // State dark mode, lấy từ localStorage nếu có
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // State điều hướng giữa QLCV và QLNV
  const [showEmployees, setShowEmployees] = useState(false);

  // Theme cho light mode: chỉ áp dụng khi isDarkMode === false
  const lightThemeOptions = {
    palette: {
      mode: 'light' as PaletteMode,
      primary: { main: '#1976d2' },
      background: { default: '#f8fafc', paper: '#fff' },
      text: { primary: '#181a1b', secondary: '#555' },
      divider: '#e0e0e0',
      action: { active: '#1976d2' },
    },
    shape: { borderRadius: 8 },
  };

  // Theme cho dark mode: chỉ áp dụng khi isDarkMode === true
  const darkThemeOptions = {
    palette: {
      mode: 'dark' as PaletteMode,
      primary: { main: '#43e97b' },
      background: { default: '#181a1b', paper: '#23272a' },
      text: { primary: '#e0e6ff', secondary: '#b0b3b8' },
      divider: '#333',
      action: { active: '#43e97b' },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiTableCell: {
        styleOverrides: {
          // Chỉ override màu header table ở dark mode
          head: {
            backgroundColor: 'rgba(35, 42, 77, 0.7)', // dùng backgroundColor để chắc chắn override
            color: '#e0e6ff',
            fontWeight: 'bold',
          },
        },
      },
    },
  };

  // Chọn theme phù hợp theo isDarkMode
  const theme = React.useMemo(() => createTheme(isDarkMode ? darkThemeOptions : lightThemeOptions), [isDarkMode]);

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

  // Trả về splash hoặc giao diện chính dựa vào showSplash
  if (showSplash) return <SplashScreen />;
  if (showEmployees) {
    return (
      <Box position="relative">
        <Employees />
        {/* Nút chuyển về QLCV ở góc dưới bên phải */}
        <IconButton
          onClick={() => setShowEmployees(false)}
          sx={{ position: 'fixed', bottom: 32, right: 32, bgcolor: '#1976d2', color: '#fff', boxShadow: 3, '&:hover': { bgcolor: '#1565c0' } }}
          size="large"
        >
          <AssignmentIcon />
        </IconButton>
      </Box>
    );
  }
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
        {/* Bố cục 2 cột: Trái (Add Task), Phải (Task List + Filter) */}
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            alignItems: 'flex-start',
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            flexDirection: { xs: 'column', md: 'row' },
            mb: 3
          }}
        >
          {/* Box trái: Add New Task */}
          <Box sx={{ flex: { xs: 'unset', md: '0 0 30%' }, maxWidth: { md: '30%' }, minWidth: 280 }}>
            <AddTaskBox onFinish={handleFinish} />
          </Box>
          {/* Box phải: Task List + Filter */}
          <Box sx={{ flex: 1, minWidth: 400 }}>
            <TaskListBox
              employees={employees}
              filteredTasks={filteredTasks}
              editingId={editingId}
              loading={loading}
              error={error}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              onEdit={(task: typeof tasks[0]) => dispatch(setEditing(task.id.toString()))}
              onBulkDelete={handleBulkDelete}
              onSelectAll={handleSelectAll}
            />
          </Box>
        </Box>
        {/* Nút chuyển sang QLNV ở góc dưới bên phải */}
        <IconButton
          onClick={() => setShowEmployees(true)}
          sx={{ position: 'fixed', bottom: 32, right: 32, bgcolor: '#43e97b', color: '#232a4d', boxShadow: 3, '&:hover': { bgcolor: '#388e3c', color: '#fff' } }}
          size="large"
        >
          <PeopleAltIcon />
        </IconButton>
      </Container>
    </ThemeProvider>
  );
};

export default App; 