import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Kiểu filter cho danh sách công việc
export type FilterType = 'all' | 'active' | 'completed';

// State filter hiện tại
interface FilterState {
  filter: FilterType; // Trạng thái lọc hiện tại
}

const initialState: FilterState = {
  filter: 'all'
};

// Slice quản lý trạng thái filter
const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    // Đổi trạng thái filter
    setFilter(state, action: PayloadAction<FilterType>) {
      state.filter = action.payload;
    }
  }
});

// Export action để component sử dụng
export const { setFilter } = filterSlice.actions;
// Export reducer để store sử dụng
export default filterSlice.reducer; 