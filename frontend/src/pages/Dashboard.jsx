import { useEffect, useState } from 'react';
import axios from '../lib/axios';
import useAuthStore from '../store/authStore';
import { Package, Users, FolderTree, Tag, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  const { user, hasPermission } = useAuthStore();
  const [stats, setStats] = useState([
    { name: 'Total Products', value: '0', icon: Package, color: 'bg-blue-500', permission: 'product:read' },
    { name: 'Total Users', value: '0', icon: Users, color: 'bg-green-500', permission: 'user:read' },
    { name: 'Categories', value: '0', icon: FolderTree, color: 'bg-purple-500', permission: 'category:read' },
    { name: 'Brands', value: '0', icon: Tag, color: 'bg-orange-500', permission: 'brand:read' },
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const newStats = [...stats];

      // Only fetch data for stats where user has read permission
      if (hasPermission('product:read')) {
        try {
          const productsRes = await axios.get('/products', { params: { page: 1, limit: 1 } });
          const productCount = productsRes.data?.data?.meta?.total || 0;
          newStats[0] = { ...newStats[0], value: productCount.toString() };
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }

      if (hasPermission('user:read')) {
        try {
          const usersRes = await axios.get('/users', { params: { page: 1, limit: 1 } });
          const userCount = usersRes.data?.data?.meta?.total || 0;
          newStats[1] = { ...newStats[1], value: userCount.toString() };
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }

      if (hasPermission('category:read')) {
        try {
          const categoriesRes = await axios.get('/categories');
          const categoryCount = categoriesRes.data?.data?.length || 0;
          newStats[2] = { ...newStats[2], value: categoryCount.toString() };
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      }

      if (hasPermission('brand:read')) {
        try {
          const brandsRes = await axios.get('/brands');
          const brandCount = brandsRes.data?.data?.length || 0;
          newStats[3] = { ...newStats[3], value: brandCount.toString() };
        } catch (error) {
          console.error('Error fetching brands:', error);
        }
      }

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name}! You're logged in as {user?.role?.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const canView = hasPermission(stat.permission);
          
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                  {canView ? (
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-yellow-600" />
                      <p className="text-sm text-yellow-700">No permission</p>
                    </div>
                  )}
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Permissions</h2>
        <div className="flex flex-wrap gap-2">
          {user?.permissions?.map((permission) => (
            <span
              key={permission}
              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {permission}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
