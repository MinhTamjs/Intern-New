import React from "react";
import { Typography, CircularProgress, Box } from "@mui/material";

interface LoadingErrorProps {
  loading?: boolean;
  error?: string | null;
}

const LoadingError: React.FC<LoadingErrorProps> = ({ loading, error }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" my={2}>
        <CircularProgress size={28} sx={{ mr: 1 }} />
        <Typography color="text.secondary">Loading data...</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Typography align="center" sx={{ my: 2 }} color="error">
        Error: {error}
      </Typography>
    );
  }
  return null;
};

export default LoadingError; 