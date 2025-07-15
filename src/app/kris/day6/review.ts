import { createSlice } from '@reduxjs/toolkit';
import { incrementByAmount } from './learningredux';

const counterSlice = createSlice ({ //tên định dang dùng làm prefix cho action 
    name: 'warehouse',
    initialState: { value:0 },
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        incrementByAmount: (state,action) => {
            state.value += action.payload;
        }
    }
});
export const {increment, decrement, incrementByAmount} = warehouseSlice.actions;
export default warehouseSlice.reducer;
