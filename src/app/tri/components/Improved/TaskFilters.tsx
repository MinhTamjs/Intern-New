import React from "react";
import { Stack, TextField, MenuItem, Button, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../components/store";
import { setFilter } from "../../features/filter/filterSlice";
import { Priority, Status } from "../../features/tasks/taskTypes";

const TaskFilters: React.FC = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state: RootState) => state.filter);

  const handleFilter = () => {
    dispatch(setFilter(filter));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilter({ [e.target.name]: e.target.value }));
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Search keyword"
          name="keyword"
          value={filter.keyword}
          onChange={handleChange}
        />
        <TextField
          select
          label="Status"
          name="status"
          value={filter.status}
          onChange={handleChange}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
          <MenuItem value="Expired">Expired</MenuItem>
        </TextField>
        <TextField
          select
          label="Priority"
          name="priority"
          value={filter.priority}
          onChange={handleChange}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
        </TextField>
        <Button variant="contained" onClick={handleFilter} sx={{ minWidth: 120 }}>
          Filter
        </Button>
      </Stack>
    </Paper>
  );
};

export default TaskFilters; 