import React from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import SearchBox from './components/SearchBox';
import { Box, Typography, Container } from '@mui/material';

const App = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f6fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Typography variant="h3" fontWeight={900} align="center" mb={4} color="#1976d2" letterSpacing={2}>
          Task Manager 4.0
        </Typography>
        <SearchBox />
        <TaskForm />
        <TaskList />
      </Container>
    </Box>
  );
};

export default App;