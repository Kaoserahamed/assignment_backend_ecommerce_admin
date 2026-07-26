import { useState, useEffect } from 'react';
import axios from '../lib/axios';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Permissions() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    actions: [],
    customAction: '',
  });
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const standardActions = ['watch', 'create', 'read', 'update', 'delete', 'upload', 'write'];

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('/permissions');
      setGroups(response.data.data || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      description: formData.description,
      actions: formData.actions,
    };

    if (formData.customAction) {
      payload.actions.push(formData.customAction);
    }

    try {
      await axios.post('/permissions/groups', payload);
      setShowModal(false);
      setFormData({ name: '', description: '', actions: [], customAction: '' });
      fetchGroups();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create permission group');
    }
  };

  const toggleAction = (action) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.includes(action)
        ? prev.actions.filter(a => a !== action)
        : [...prev.actions, action]
    }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Permissions</h1>
        {hasPermission('permission:create') && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Permission Group
          </button>
        )}
      </div>

      <div className="card mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Module</th>
                <th>Description</th>
                <th>Permissions Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {groups
                .filter(group => 
                  group.name?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((group) => (
                  <tr key={group.id}>
                    <td className="font-medium">{group.name}</td>
                    <td className="text-gray-600">{group.description}</td>
                    <td>{group.permissions?.length || 0}</td>
                    <td>
                      <div className="flex gap-2">
                        {hasPermission('permission:delete') && (
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Create Permission Group</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Module Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Product"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    placeholder="Brief description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Actions
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {standardActions.map((action) => (
                      <label key={action} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.actions.includes(action)}
                          onChange={() => toggleAction(action)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{action}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Action (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.customAction}
                    onChange={(e) => setFormData({ ...formData, customAction: e.target.value })}
                    className="input-field"
                    placeholder="e.g., approve"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn-primary">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
