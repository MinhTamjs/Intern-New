import React from 'react';
import { TodoFilter as FilterType } from '../types/Todo';

// Props interface cho TodoFilter component
interface TodoFilterProps {
  currentFilter: FilterType;
  stats: {
    total: number;
    completed: number;
    active: number;
  };
  onFilterChange: (filter: FilterType) => void;
  onMarkAllCompleted: () => void;
  onClearCompleted: () => void;
}

// Component để lọc và thống kê todos
const TodoFilter: React.FC<TodoFilterProps> = ({
  currentFilter,
  stats,
  onFilterChange,
  onMarkAllCompleted,
  onClearCompleted
}) => {
  // Nếu không có todo nào thì không hiển thị filter
  if (stats.total === 0) {
    return null;
  }

  /**
   * Xử lý khi người dùng thay đổi filter
   * @param filter - Loại filter mới
   */
  const handleFilterChange = (filter: FilterType): void => {
    onFilterChange(filter);
  };

  /**
   * Xử lý khi người dùng đánh dấu tất cả hoàn thành
   */
  const handleMarkAllCompleted = (): void => {
    if (stats.active > 0) {
      if (confirm(`Đánh dấu ${stats.active} công việc chưa hoàn thành là hoàn thành?`)) {
        onMarkAllCompleted();
      }
    }
  };

  /**
   * Xử lý khi người dùng xóa tất cả đã hoàn thành
   */
  const handleClearCompleted = (): void => {
    if (stats.completed > 0) {
      if (confirm(`Xóa ${stats.completed} công việc đã hoàn thành?`)) {
        onClearCompleted();
      }
    }
  };

  return (
    <div className="todo-filter-container">
      {/* Thống kê */}
      <div className="filter-stats">
        <div className="stat-item">
          <span className="stat-label">Tổng cộng:</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Đã hoàn thành:</span>
          <span className="stat-value completed">{stats.completed}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Chưa hoàn thành:</span>
          <span className="stat-value active">{stats.active}</span>
        </div>
      </div>

      {/* Các nút filter */}
      <div className="filter-buttons">
        <button
          onClick={() => handleFilterChange('all')}
          className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
        >
          📋 Tất cả
        </button>
        <button
          onClick={() => handleFilterChange('active')}
          className={`filter-btn ${currentFilter === 'active' ? 'active' : ''}`}
        >
          ⏳ Chưa hoàn thành
        </button>
        <button
          onClick={() => handleFilterChange('completed')}
          className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
        >
          ✅ Đã hoàn thành
        </button>
      </div>

      {/* Các nút hành động hàng loạt */}
      <div className="bulk-actions">
        {stats.active > 0 && (
          <button
            onClick={handleMarkAllCompleted}
            className="bulk-btn mark-all-btn"
            title={`Đánh dấu ${stats.active} công việc chưa hoàn thành là hoàn thành`}
          >
            ✅ Hoàn thành tất cả
          </button>
        )}
        
        {stats.completed > 0 && (
          <button
            onClick={handleClearCompleted}
            className="bulk-btn clear-completed-btn"
            title={`Xóa ${stats.completed} công việc đã hoàn thành`}
          >
            🗑️ Xóa đã hoàn thành
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoFilter; 