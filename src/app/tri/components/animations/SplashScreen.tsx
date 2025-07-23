import React from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import AnimationWrapper from './AnimationWrapper';

// SplashScreen hiển thị logo OneXApis và hiệu ứng loading khi vào app, có animation zoom
const SplashScreen: React.FC = () => {
  const theme = useTheme();
  return (
    <AnimationWrapper type="zoom" duration={1.2}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        sx={{
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
          transition: 'background 0.3s',
        }}
      >
        {/* Logo chữ OneXApis màu xanh lá ngọc */}
        <Typography variant="h2" fontWeight={900} mb={2} letterSpacing={2} sx={{ color: '#43e97b' }}>
          OneXApis
        </Typography>
        {/* Biểu tượng loading màu xanh lá ngọc */}
        <CircularProgress sx={{ color: '#43e97b' }} size={48} thickness={4} />
        <Typography variant="body2" mt={2}>
          Loading...
        </Typography>
      </Box>
    </AnimationWrapper>
  );
};

export default SplashScreen; 