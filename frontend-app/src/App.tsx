import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import Layout from './layouts/Layout';
import SignUpPage from './pages/SignUpPage';
import CategoryPage from './pages/CategoryPage';
import UserLayout from './layouts/UserPortal/UserLayout';
import AdminLayout from './layouts/adminPortal/AdminLayout';
import UserDashboard from './pages/User/UserDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AuthRoute from './components/AuthRoute';
import { useContext } from 'react';
import { UserContext } from './context/UserContext';
import ProfilePage from './pages/ProfilePage';
import ListingManagementPage from './pages/ListingManagementPage';
import UsersPage from './pages/Admin/UsersPages';

function App() {

  const  userContext  = useContext(UserContext);
  const { token } = userContext || {};

  return(
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/categories/:id" element={<CategoryPage />} />
      </Route>
      <Route element={<AuthRoute isAuthenticated={!!token} />}>
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="/user/profile" element={<ProfilePage />} />
          <Route path="/user/listings" element={<ListingManagementPage />} />
        </Route>
         <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<ProfilePage />} />
          <Route path="/admin/listings" element={<ListingManagementPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/users/:action" element={<UsersPage />} />
          <Route path="/admin/users/:action/:userId" element={<UsersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
