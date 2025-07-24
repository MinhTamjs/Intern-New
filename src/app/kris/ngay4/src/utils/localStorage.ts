import type { RootState } from '../store/store';

const STORAGE_KEY = 'todo-redux-toolkit-state';

/**
 * Đọc state từ localStorage (nếu có), trả về object hoặc undefined.
 */
export function loadState(): any {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch {
    return undefined;
  }
}

/**
 * Lưu state vào localStorage (chỉ lưu phần todo và filter).
 */
export function saveState(state: Partial<RootState>) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch {
    // ignore write errors
  }
} 