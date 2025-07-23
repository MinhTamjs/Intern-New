import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserList from './features/users/UserList';
import UserDetail from './features/users/UserDetail';
import AddUserModal from './features/users/AddUserModal';
import { useSelector } from 'react-redux';
import type { RootState } from './store';

function App() {
  const showAddUserModal = useSelector((state: RootState) => state.users.showAddUserModal);
  return (
    <Router>
      <div>
        <h1>Quản lý người dùng</h1>
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/users/:id" element={<UserDetail />} />
        </Routes>
        {showAddUserModal && <AddUserModal />}
      </div>
    </Router>
  );
}

export default App;
