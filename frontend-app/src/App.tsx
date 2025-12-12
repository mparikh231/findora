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
import CategoriesManagementPage from './pages/Admin/CategoriesManagementPage';
import StateCityManagementPage from './pages/Admin/StateCityManagementPage';
import ListingDetailsPage from './pages/ListingsDetailsPage';
import SettingsPage from './pages/Admin/SettingsPage';

function App() {

  const  userContext  = useContext(UserContext);
  const { token } = userContext || {};

  return(
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/category/:id' element={<CategoryPage />} />
        <Route path='/listing/:id' element={<ListingDetailsPage />} />
      </Route>
      <Route element={<AuthRoute isAuthenticated={!!token} />}>
        <Route path='/user' element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path='profile' element={<ProfilePage />} />
          <Route path='states' element={<StateCityManagementPage />} />
          <Route path='listings' element={<ListingManagementPage />} />
        </Route>
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path='profile' element={<ProfilePage />} />
          <Route path='states' element={<StateCityManagementPage />} />
          <Route path='settings' element={<SettingsPage />} />
          <Route path='listings'>
            <Route index element={<ListingManagementPage />} />
            <Route path=':action' element={<ListingManagementPage />} />
            <Route path=':action/:listingId' element={<ListingManagementPage />} />
            <Route path='categories' element={<CategoriesManagementPage />} />
          </Route>
          <Route path='users'>
            <Route index element={<UsersPage />} />
            <Route path=':action' element={<UsersPage />} />
            <Route path=':action/:userId' element={<UsersPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
