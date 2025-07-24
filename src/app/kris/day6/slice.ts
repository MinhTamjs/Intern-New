const cartSlice = createSlice({
    name: 'cart', // tên kệ
    initialState: { items: [] }, // hàng hóa ban đầu (giỏ hàng trống)
    reducers: {
      addItem: (state, action) => {
        state.items.push(action.payload); // thêm hàng mới
      },
      removeItem: (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      }
    }
  });

  export const { addItem, removeItem } = cartSlice.actions;
  export default cartSlice.reducer;