import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import Layout from './layouts/Layout';
import SignUpPage from './pages/SignUpPage';
import CategoryPage from './pages/CategoryPage';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import UserDashboard from './pages/User/UserDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';

function App() {
  return(
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="signin" element={<SignInPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="categories/:id" element={<CategoryPage />} />
      </Route>
      <Route path='user' element={<UserLayout />}>
        <Route index element={<UserDashboard />} />
      </Route>
      <Route path='admin' element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
