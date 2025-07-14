import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // ✅ Action bạn cần thêm:
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// ✅ Phải export action này ra:
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
