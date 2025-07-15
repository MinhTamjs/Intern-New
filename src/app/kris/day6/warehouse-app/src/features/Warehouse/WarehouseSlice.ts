import { createSlice } from "@reduxjs/toolkit";

const warehouseSlice = createSlice({
   name: 'warehouse', // tên slice dùng để debug
   initialState: { stock:100 }, //state(sản phẩm) ban đầu: kho có 100 sản phẩm
   reducers: { // các hành động để thay đổi state, như ở dưới là có 2 loại là nhập và xuất
    importStock(state) {
    state.stock += 1; // nhập một sản phẩm vào kho
   },
   exportStock(state) { // xuất một sản phẩm khỏi kho
    state.stock -= 1; 
    }
}
});

// export action để component gọi được
export const { importStock, exportStock} = warehouseSlice.actions;

// export reducer để store sử dụng
export default warehouseSlice.reducer;