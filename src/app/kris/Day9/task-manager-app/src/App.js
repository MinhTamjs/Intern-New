import React, { useState, useMemo } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import SearchBox from './components/SearchBox';
import { Box, Typography, Container } from '@mui/material';

const App = () => {
  // Lift state up from TaskList
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // handleDeleteAll will be passed down to TaskList and SearchBox
  // We'll define a dummy function here and override it in TaskList
  const [handleDeleteAll, setHandleDeleteAll] = useState(() => () => {});

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f6fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Typography variant="h3" fontWeight={900} align="center" mb={4} color="#1976d2" letterSpacing={2}>
          Task Manager 4.0
        </Typography>
        <TaskForm />
        <SearchBox 
          search={search}
          setSearch={setSearch}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          handleDeleteAll={handleDeleteAll}
        />
        <TaskList 
          search={search}
          setSearch={setSearch}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          setHandleDeleteAll={setHandleDeleteAll}
        />
      </Container>
    </Box>
  );
};

export default App;