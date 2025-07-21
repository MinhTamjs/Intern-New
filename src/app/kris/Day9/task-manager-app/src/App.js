import React from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { Box, Typography, Container } from '@mui/material';

const App = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', py: 5 }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight={900} align="center" mb={4} color="#1976d2" letterSpacing={2}>
          Task Manager 4.0
        </Typography>
        <TaskForm />
        <TaskList />
      </Container>
    </Box>
  );
};

export default App;