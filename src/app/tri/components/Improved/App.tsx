import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../components/store";
import { Task } from "../../features/tasks/taskTypes";
import TaskTable from "./TaskTable";
import TaskForm from "./TaskForm";
import TaskFilters from "./TaskFilters";
import { Container, Typography, Box } from "@mui/material";
import { setEditing } from "../../features/tasks/taskSlice";

const App: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const editingId = useSelector((state: RootState) => state.tasks.editingId);
  const filter = useSelector((state: RootState) => state.filter);
  const dispatch = useDispatch();

  const filteredTasks = tasks.filter(task => {
    const matchKeyword =
      filter.keyword === "" ||
      task.title.toLowerCase().includes(filter.keyword.toLowerCase()) ||
      task.description.toLowerCase().includes(filter.keyword.toLowerCase());
    const matchStatus =
      filter.status === "" || filter.status === "All" || task.status === filter.status;
    const matchPriority =
      filter.priority === "" || filter.priority === "All" || task.priority === filter.priority;
    return matchKeyword && matchStatus && matchPriority;
  });

  // Khi form thêm mới hoàn thành, chỉ cần reset form (TaskForm tự xử lý)
  const handleFinish = () => {};

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Task Management
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TaskForm onFinish={handleFinish} />
        <TaskFilters />
        <TaskTable
          tasks={filteredTasks}
          editingId={editingId}
          onEdit={id => dispatch(setEditing(id))}
        />
      </Box>
    </Container>
  );
};

export default App; 