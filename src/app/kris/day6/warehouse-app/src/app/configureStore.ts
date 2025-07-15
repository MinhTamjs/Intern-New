import { configureStore } from "@reduxjs/toolkit";
import warehouseReducer from "../features/Warehouse/WarehouseSlice";

export const store = configureStore ({  // hàm của ReduxTK 
    reducer: {
        warehouse: warehouseReducer, // tên "kệ" mình dùng để gắn reducer vào, gắn reducer từ slice warehouse vào store.
                                     //  Có thể hình dung như đưa kệ hàng vào kho chính
    },
});

// Dùng cho TS và React Redux
export type RootState = ReturnType<typeof store.getState>; // Kiểu dữ liệu đại diện cho toàn bộ Redux Store 
                                                           //  để React biết state.warehouse.stock là gì)
export type AppDispatch = typeof store.dispatch; 

// Hình dung đơn giản thì App giống một siêu thị
// Store là kho trung tâm
// warehouseReducer là kệ hàng tên warehouse 
// configureStore() là người sắp xép kệ 