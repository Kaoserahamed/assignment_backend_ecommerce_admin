import useAuthStore from '../store/authStore';
import { Package, Users, FolderTree, Tag } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();

  const stats = [
    { name: 'Total Products', value: '0', icon: Package, color: 'bg-blue-500' },
    { name: 'Total Users', value: '0', icon: Users, color: 'bg-green-500' },
    { name: 'Categories', value: '0', icon: FolderTree, color: 'bg-purple-500' },
    { name: 'Brands', value: '0', icon: Tag, color: 'bg-orange-500' },
  ];

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
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
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
