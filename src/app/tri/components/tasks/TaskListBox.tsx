import React, { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";
import AnimationWrapper from '../animations/AnimationWrapper';
import TaskFilters from "./TaskFilters";
import LoadingError from "../LoadingError";
import TaskTable from "./TaskTable";
import { getEmployees } from "../../features/tasks/taskApi";
import type { Employee } from "../../../../types/schema";

// Box riêng cho phần Task List + Filter
const TaskListBox: React.FC<any> = ({
  filteredTasks,
  editingId,
  loading,
  error,
  selectedIds,
  setSelectedIds,
  onEdit,
  onMarkDone,
  onBulkDelete,
  onSelectAll
}) => {
  // Xóa mọi logic fetch employees, chỉ truyền props liên quan đến Task cho TaskTable
  // Paper bọc toàn bộ phần Task List + Filter, kéo dài hơn để hiển thị đủ cột
  return (
    <Paper elevation={3} sx={{ flex: 1, width: '100%', minWidth: 0, maxWidth: 1200, p: 2 }}>
      {/* Tiêu đề Task List */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
        Task List
      </Typography>
      {/* AnimationWrapper cho filter */}
      <AnimationWrapper delay={1.0} duration={0.8}>
        {/* Bộ lọc filter */}
        <TaskFilters
          selectedIds={selectedIds}
          onBulkDelete={onBulkDelete}
          onSelectAll={onSelectAll}
          totalTasks={filteredTasks.length}
        />
      </AnimationWrapper>
      {/* AnimationWrapper cho bảng và loading/error */}
      <AnimationWrapper staggerChildren delay={2.0} duration={1.0}>
        {/* Hiển thị loading/error nếu có */}
        <LoadingError loading={loading} error={error} />
        {/* Bảng danh sách task */}
        <TaskTable
          tasks={filteredTasks}
          editingId={editingId}
          onEdit={onEdit}
          selectedIds={selectedIds}
          onSelectIds={setSelectedIds}
          // Đã loại bỏ onMarkDone
        />
      </AnimationWrapper>
    </Paper>
  );
};

export default TaskListBox; 