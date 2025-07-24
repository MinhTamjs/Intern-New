import React from 'react';
import { Card, CardContent, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Box } from '@mui/material';
import { Clear } from '@mui/icons-material';

const SearchBox = ({ search, setSearch, priorityFilter, setPriorityFilter, handleDeleteAll }) => (
  <Card sx={{ mb: 4, borderRadius: 0, boxShadow: 3, p: 0.2, maxWidth: 1060, mx: 'auto', width: '100%', background: '#fff', border: '4px solid #1976d2', fontSize: '0.95rem', minHeight: 0 }}>
    <CardContent sx={{ p: 0.7 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom align="center" sx={{ mb: 0.5, fontSize: '1.05rem', width: '100%' }}>
          🔎 Tìm Kiếm & Lọc
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 0, gap: 0, width: '100%' }}>
        <Box sx={{ flex: 1, px: 1 }}>
          <TextField 
            label="Tìm kiếm theo tên" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            variant="outlined" 
            fullWidth
            InputProps={{
              sx: { height: 40 },
              inputProps: { style: { textAlign: 'left' } }
            }}
            InputLabelProps={{
              sx: { marginTop: '-6px' }
            }}
            sx={{ height: 40, '.MuiInputBase-root': { height: 40 } }} 
          />
        </Box>
        <Box sx={{ flex: 1, px: 1 }}>
          <FormControl fullWidth sx={{ height: 40, '.MuiInputBase-root': { height: 40 } }}>
            <InputLabel id="priority-filter-label">Lọc theo mức độ ưu tiên</InputLabel>
            <Select
              labelId="priority-filter-label"
              id="priority-filter"
              value={priorityFilter}
              label="Lọc theo mức độ ưu tiên"
              onChange={e => setPriorityFilter(e.target.value)}
              sx={{ height: 40 }}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="high">Cao (High)</MenuItem>
              <MenuItem value="medium">Trung bình (Medium)</MenuItem>
              <MenuItem value="low">Thấp (Low)</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: 1, px: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Clear />}
            onClick={() => { setSearch(''); setPriorityFilter('all'); }}
            fullWidth
            sx={{ height: 40, fontSize: '0.95rem', p: 0 }}
          >
            Xóa Bộ Lọc
          </Button>
        </Box>
        <Box sx={{ flex: 1, px: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAll}
            fullWidth
            sx={{ height: 40, fontSize: '0.95rem', p: 0 }}
          >
            Xóa Tất Cả
          </Button>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default SearchBox; 