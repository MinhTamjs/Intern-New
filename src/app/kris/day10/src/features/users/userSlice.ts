import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UsersState {
  showAddUserModal: boolean;
  selectedUserId: number | null;
}

const initialState: UsersState = {
  showAddUserModal: false,
  selectedUserId: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    openAddUserModal(state) {
      state.showAddUserModal = true;
    },
    closeAddUserModal(state) {
      state.showAddUserModal = false;
    },
    setSelectedUserId(state, action: PayloadAction<number | null>) {
      state.selectedUserId = action.payload;
    },
  },
});

export const { openAddUserModal, closeAddUserModal, setSelectedUserId } = usersSlice.actions;
export default usersSlice.reducer; 