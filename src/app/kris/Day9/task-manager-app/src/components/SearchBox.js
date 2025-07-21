import React from 'react';
import { Card, CardContent, Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, Divider } from '@mui/material';
import { Clear } from '@mui/icons-material';

const SearchBox = ({ search, setSearch, priorityFilter, setPriorityFilter, handleDeleteAll }) => (
  <Card sx={{ mb: 14, borderRadius: 0, boxShadow: 3, p: 0.5, maxWidth: 1000, display: 'flex', justifyContent: 'center', margin: '0 auto', width: '100%', background: '#fff', border: '1px solid #e0e0e0', fontSize: '0.95rem' }}>
    <CardContent sx={{ p: 1.2 }}>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ mb: 1, fontSize: '1.1rem' }}>
        🔎 Tìm Kiếm & Lọc
      </Typography>
      <Grid container spacing={1} alignItems="center" sx={{ fontSize: '0.95rem' }}>
        <Grid item xs={5} sx={{ width: '100%' }}>
          <TextField label="Tìm kiếm theo tên" value={search} onChange={e => setSearch(e.target.value)} fullWidth variant="outlined" sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="priority-filter-label">Lọc theo mức độ ưu tiên</InputLabel>
            <Select
              labelId="priority-filter-label"
              id="priority-filter"
              value={priorityFilter}
              label="Lọc theo mức độ ưu tiên"
              onChange={e => setPriorityFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="high">Cao (High)</MenuItem>
              <MenuItem value="medium">Trung bình (Medium)</MenuItem>
              <MenuItem value="low">Thấp (Low)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Clear />}
            onClick={() => { setSearch(''); setPriorityFilter('all'); }}
            fullWidth
          >
            Xóa Bộ Lọc
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAll}
            fullWidth
          >
            Xóa Tất Cả
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default SearchBox; 