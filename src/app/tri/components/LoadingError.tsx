// Import các component từ React và Material-UI
import React from "react";
import { Typography, CircularProgress, Box } from "@mui/material";

// Định nghĩa kiểu props cho component LoadingError
interface LoadingErrorProps {
  loading?: boolean; // Tuỳ chọn: có hiển thị trạng thái loading không
  error?: string | null; // Tuỳ chọn: thông báo lỗi cần hiển thị
}

// Component LoadingError hiển thị spinner loading hoặc thông báo lỗi dựa vào props
const LoadingError: React.FC<LoadingErrorProps> = ({ loading, error }) => {
  // Nếu loading là true, hiển thị spinner và dòng chữ đang tải dữ liệu
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" my={2}>
        <CircularProgress size={28} sx={{ mr: 1 }} />
        <Typography color="text.secondary">Loading data...</Typography>
      </Box>
    );
  }
  // Nếu có lỗi, hiển thị thông báo lỗi
  if (error) {
    return (
      <Typography align="center" sx={{ my: 2 }} color="error">
        Error: {error}
      </Typography>
    );
  }
  // Nếu không loading và không có lỗi, không render gì cả
  return null;
};

// Export component để sử dụng ở file khác
export default LoadingError; 