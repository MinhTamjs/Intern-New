import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import AnimationWrapper from '../animations/AnimationWrapper';
import TaskForm from "./TaskForm";

// Box riêng cho phần Add New Task
const AddTaskBox: React.FC<{ onFinish: () => void }> = ({ onFinish }) => (
  // Bọc Paper bằng Box để căn giữa
  <Box display="flex" justifyContent="center" width="100%">
    {/* Paper chứa form thêm task, thu gọn width */}
    <Paper elevation={3} sx={{ minWidth: 260, maxWidth: 400, width: '100%', p: 2, mb: { xs: 2, md: 0 } }}>
      {/* Tiêu đề form */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
        Add New Task
      </Typography>
      {/* Hiệu ứng AnimationWrapper cho form */}
      <AnimationWrapper delay={0.1} duration={0.8}>
        {/* Form thêm task */}
        <TaskForm onFinish={onFinish} />
      </AnimationWrapper>
    </Paper>
  </Box>
);

export default AddTaskBox; 