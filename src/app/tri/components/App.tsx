import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./store";
import { deleteTaskAsync, setEditing, fetchTasks } from "../features/tasks/taskSlice";
import TaskTable from "./TaskTable";
import TaskForm from "./TaskForm";
import TaskFilters from "./TaskFilters";
import LoadingError from "./LoadingError";
import SplashScreen from './animations/SplashScreen';
import AnimationWrapper from './animations/AnimationWrapper';
import { Container, Typography, Box, ThemeProvider, createTheme, CssBaseline, IconButton } from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { PaletteMode } from '@mui/material';
import { motion } from 'framer-motion';

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

  // Hàm xóa đồng loạt
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    for (const id of selectedIds) {
      await dispatch(deleteTaskAsync(id));
    }
    setSelectedIds([]);
    dispatch(fetchTasks());
  };

  // Hàm chọn tất cả task đang hiển thị
  const handleSelectAll = () => {
    setSelectedIds(filteredTasks.map(t => t.id.toString()));
  };

  // State dark mode, lấy từ localStorage nếu có
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

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
  return showSplash
    ? <SplashScreen />
    : (
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
            {/* Hiệu ứng hiện dần từng phần bằng AnimationWrapper */}
            <AnimationWrapper delay={0.1} duration={0.8}>
              <TaskForm onFinish={handleFinish} />
            </AnimationWrapper>
            <AnimationWrapper delay={1.0} duration={0.8}>
              <TaskFilters
                selectedIds={selectedIds}
                onBulkDelete={handleBulkDelete}
                onSelectAll={handleSelectAll}
                totalTasks={filteredTasks.length}
              />
            </AnimationWrapper>
            <AnimationWrapper staggerChildren delay={2.0} duration={1.0}>
              <LoadingError loading={loading} error={error} />
              {/* Stagger từng dòng bảng: mỗi dòng là một motion.div */}
              <TaskTable
                tasks={filteredTasks}
                editingId={editingId}
                onEdit={id => dispatch(setEditing(id))}
                selectedIds={selectedIds}
                onSelectIds={setSelectedIds}
                rowWrapper={rowProps => (
                  <motion.div
                    variants={{
                      initial: { opacity: 0, y: 20 },
                      animate: { opacity: 1, y: 0 },
                      exit: { opacity: 0, y: -10 },
                    }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {rowProps.children}
                  </motion.div>
                )}
              />
            </AnimationWrapper>
          </Box>
        </Container>
      </ThemeProvider>
    );
};

export default App; 