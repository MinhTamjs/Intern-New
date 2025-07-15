import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { setFilter, FilterType } from './filterSlice';

// Danh sách các filter có thể chọn
const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chưa hoàn thành', value: 'active' },
  { label: 'Đã hoàn thành', value: 'completed' },
];

/**
 * Component chọn trạng thái lọc công việc (all, active, completed)
 */
const TodoFilter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filter = useSelector((state: RootState) => state.filter.filter);

  return (
    <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
      {/* Hiển thị các nút filter */}
      {FILTERS.map(f => (
        <button
          key={f.value}
          onClick={() => dispatch(setFilter(f.value))}
          style={{
            fontWeight: filter === f.value ? 'bold' : 'normal',
            textDecoration: filter === f.value ? 'underline' : 'none',
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default TodoFilter; 