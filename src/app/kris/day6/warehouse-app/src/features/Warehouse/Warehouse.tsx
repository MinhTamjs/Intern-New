import { useDispatch, useSelector } from 'react-redux';    // lấy hàm từ thư viện, dispatch dùng để gửi action (import,export)
                                                           // selectpr dùng để lấy dữ liệu stock từ store 
import { RootState, AppDispatch } from '../../app/configureStore'; // RootState: Kiểu (type) đại diện cho toàn bộ Redux Store
                                                                   // AppDispatch: Kiểu (type) của hàm dispatch Redux dùng để gửi action

import { importStock, exportStock } from './WarehouseSlice'; // Hàm action dùng để nhập hàng hoặc xuất hàng, những hàm này đã được tạo từ trước.

export default function Warehouse() {
  const stock = useSelector((state: RootState) => state.warehouse.stock);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Kho hàng: {stock} sản phẩm</h2>
      <button onClick={() => dispatch(exportStock())}>Xuất hàng (-1)</button>
      <button onClick={() => dispatch(importStock())} style={{ marginLeft: 10 }}>Nhập hàng (+1)</button>
    </div>
  );
}
