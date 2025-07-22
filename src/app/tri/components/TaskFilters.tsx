import React from "react";
import { Stack, TextField, MenuItem, Button, Paper } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useAppDispatch, useAppSelector } from "./store";
import { setFilter } from "../features/filter/filterSlice";
import { Priority, Status } from "../features/tasks/taskTypes";

// Danh sách nhãn và dự án mẫu (nên đồng bộ với form, có thể lấy từ API)
// Xóa sampleLabels, chỉ giữ sampleProjects cho project
const sampleProjects = ["E-commerce Website", "Study Management App", "Internal Project"];

const filterBoxStyle = { minWidth: 160, maxWidth: 200, height: 40 };
const filterButtonStyle = { minWidth: 160, maxWidth: 200, height: 40, fontWeight: 600 };

const TaskFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(state => state.filter);
  // Lấy danh sách task thực tế từ store để lấy tất cả label/project đã có
  const tasks = useAppSelector(state => state.tasks.tasks);

  // Lấy tất cả label thực tế từ danh sách task (không trùng lặp)
  const allLabels = Array.from(new Set(tasks.flatMap(task => task.labels ?? [])));
  // Lấy tất cả project thực tế từ danh sách task (không trùng lặp)
  const allProjects = Array.from(new Set(tasks.flatMap(task => task.projects ?? [])));

  const handleFilter = () => {
    dispatch(setFilter(filter));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilter({ [e.target.name]: e.target.value }));
  };

  // Xử lý chọn nhãn filter (multi-select)
  const handleLabelChange = (_: any, value: string[]) => {
    dispatch(setFilter({ labels: value }));
  };
  // Xử lý chọn dự án filter (multi-select)
  const handleProjectChange = (_: any, value: string[]) => {
    dispatch(setFilter({ projects: value }));
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Search keyword"
          name="keyword"
          value={filter.keyword}
          onChange={handleChange}
          size="small"
          sx={filterBoxStyle}
        />
        <TextField
          select
          label="Status"
          name="status"
          value={filter.status}
          onChange={handleChange}
          size="small"
          sx={filterBoxStyle}
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
          size="small"
          sx={filterBoxStyle}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
        </TextField>
        {/* Bộ lọc nhãn (label, multi-select) */}
        <Autocomplete
          multiple
          freeSolo
          options={allLabels}
          value={filter.labels}
          onChange={handleLabelChange}
          renderInput={(params) => (
            <TextField {...params} label="Labels" placeholder="Type label(s) to filter" size="small" />
          )}
          size="small"
          sx={filterBoxStyle}
        />
        {/* Bộ lọc dự án (project, multi-select) */}
        <Autocomplete
          multiple
          freeSolo
          options={allProjects}
          value={filter.projects}
          onChange={handleProjectChange}
          renderInput={(params) => (
            <TextField {...params} label="Projects" placeholder="Type project(s) to filter" size="small" />
          )}
          size="small"
          sx={filterBoxStyle}
        />
        <Button variant="contained" onClick={handleFilter} sx={filterButtonStyle} size="small">
          Filter
        </Button>
      </Stack>
    </Paper>
  );
};

export default TaskFilters; 