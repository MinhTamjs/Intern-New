import React from 'react';  
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/configureStore';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}> {/* 👈 Kết nối Redux Store */}
      <App />
    </Provider>
  </React.StrictMode>
);

// | Dòng code                                       | Giải thích đơn giản                                     |
// | ----------------------------------------------- | ------------------------------------------------------- |
// | `import React from 'react';`                    | Nhập React – để dùng JSX (<App />)                    |
// | `import ReactDOM from 'react-dom/client';`      | Nhập thư viện để render React ra giao diện          |
// | `import App from './App';`                      | Nhập `App.tsx` – file chứa component gốc của ứng dụng   |
// | `import { Provider } from 'react-redux';`       | Provider là **“cầu nối” giữa Redux Store và React app** |
// | `import { store } from './app/configureStore';` | Nhập Redux Store bạn vừa tạo ở bước 2                   |
