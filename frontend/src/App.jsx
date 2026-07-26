import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/Layout/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Lazy load other pages (we'll create these next)
import Permissions from './pages/Permissions';
import Roles from './pages/Roles';
import Users from './pages/Users';
import Media from './pages/Media';
import Categories from './pages/Categories';
import Brands from './pages/Brands';
import Attributes from './pages/Attributes';
import Products from './pages/Products';

function App() {
  const fetchSession = useAuthStore((state) => state.fetchSession);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="permissions" element={<Permissions />} />
          <Route path="roles" element={<Roles />} />
          <Route path="users" element={<Users />} />
          <Route path="media" element={<Media />} />
          <Route path="categories" element={<Categories />} />
          <Route path="brands" element={<Brands />} />
          <Route path="attributes" element={<Attributes />} />
          <Route path="products" element={<Products />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
