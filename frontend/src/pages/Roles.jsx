import { useState, useEffect } from 'react';
import axios from '../lib/axios';
import { Plus, Edit, Trash2, Search, Users as UsersIcon } from 'lucide-react';
import useAuthStore from '../store/authStore';
import PermissionGate from '../components/PermissionGate';
import Toast from '../components/Toast';
import { getErrorMessage } from '../lib/errorMessages';

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [groups, setGroups] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: true,
    permissions: [],
  });
  const { hasPermission } = useAuthStore();

  useEffect(() => {
    if (hasPermission('role:read')) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    try {
      const requests = [axios.get('/roles')];
      
      // Only fetch permissions if user has permission:read
      if (hasPermission('permission:read')) {
        requests.push(axios.get('/permissions'));
      }

      const responses = await Promise.all(requests);
      
      setRoles(responses[0].data?.data || []);
      
      if (responses[1]) {
        const allPermissions = responses[1].data?.data || [];
        setPermissions(allPermissions);
        
        // Group permissions by their group
        const groupedPermissions = {};
        
        allPermissions.forEach(perm => {
          const groupName = perm.group?.name || 'Other';
          if (!groupedPermissions[groupName]) {
            groupedPermissions[groupName] = {
              id: perm.group?.id || 'other',
              name: groupName,
              permissions: []
            };
          }
          groupedPermissions[groupName].permissions.push(perm);
        });
        
        setGroups(Object.values(groupedPermissions));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const rolePayload = { 
        name: formData.name, 
        description: formData.description, 
        status: formData.status,
        permissionIds: formData.permissions // Include permissions in creation
      };
      
      if (editingRole) {
        // For update, still use PUT to update role details
        await axios.put(`/roles/${editingRole.id}`, { 
          name: formData.name, 
          description: formData.description, 
          status: formData.status 
        });
        
        // Then update permissions separately
        if (formData.permissions.length > 0) {
          await axios.post(`/roles/${editingRole.id}/permissions`, { permissionIds: formData.permissions });
        }
        setToast({ message: 'Role updated successfully', type: 'success' });
      } else {
        // For create, send everything in one request
        await axios.post('/roles', rolePayload);
        setToast({ message: 'Role created successfully', type: 'success' });
      }
      
      setShowModal(false);
      setEditingRole(null);
      setFormData({ name: '', description: '', status: true, permissions: [] });
      fetchData();
    } catch (error) {
      const message = getErrorMessage(error, editingRole ? 'Failed to update role' : 'Failed to create role');
      setToast({ message, type: 'error' });
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      status: role.status,
      permissions: role.permissions?.map(p => p.permission.id) || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    
    try {
      await axios.delete(`/roles/${id}`);
      setToast({ message: 'Role deleted successfully', type: 'success' });
      fetchData();
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to delete role');
      setToast({ message, type: 'error' });
    }
  };

  const togglePermission = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const selectAllInGroup = (group) => {
    const groupPermissionIds = (group.permissions || []).map(p => p.id);
    const allSelected = groupPermissionIds.every(id => formData.permissions.includes(id));
    
    setFormData(prev => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter(id => !groupPermissionIds.includes(id))
        : [...new Set([...prev.permissions, ...groupPermissionIds])]
    }));
  };

  const selectAll = () => {
    const allPermissionIds = permissions.map(p => p.id);
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.length === allPermissionIds.length ? [] : allPermissionIds
    }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!hasPermission('role:read')) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Roles</h1>
        </div>
        <div className="card">
          <PermissionGate permission="role:read" action="view roles" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Roles</h1>
        {hasPermission('role:create') && (
          <button
            onClick={() => {
              setEditingRole(null);
              setFormData({ name: '', description: '', status: true, permissions: [] });
              setShowModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Role
          </button>
        )}
      </div>

      <div className="card mb-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Permissions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {roles
                .filter(role => 
                  role.name?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((role) => (
                  <tr key={role.id}>
                    <td className="font-medium">{role.name}</td>
                    <td className="text-gray-600">{role.description}</td>
                    <td>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {role.permissions?.length || 0} permissions
                      </span>
                    </td>
                    <td>
                      <span className={`px-2 py-1 text-xs rounded ${
                        role.status 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {role.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {hasPermission('role:update') && (
                          <button
                            onClick={() => handleEdit(role)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {hasPermission('role:delete') && (
                          <button
                            onClick={() => handleDelete(role.id)}
                            className="text-red-600 hover:text-red-800"
                          >
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingRole ? 'Edit Role' : 'Create Role'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })}
                      className="input-field"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows="2"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Permissions *
                    </label>
                    <button
                      type="button"
                      onClick={selectAll}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {formData.permissions.length === permissions.length && permissions.length > 0
                        ? 'Deselect All'
                        : 'Select All'}
                    </button>
                  </div>
                  
                  <div className="border rounded-lg p-4 max-h-96 overflow-y-auto space-y-4">
                    {groups && groups.length > 0 ? (
                      groups.map((group) => (
                        <div key={group.id} className="border-b pb-3 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">{group.name}</h3>
                            <button
                              type="button"
                              onClick={() => selectAllInGroup(group)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Toggle All
                            </button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {group.permissions && group.permissions.length > 0 ? (
                              group.permissions.map((permission) => (
                                <label
                                  key={permission.id}
                                  className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.permissions.includes(permission.id)}
                                    onChange={() => togglePermission(permission.id)}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-sm">
                                    {permission.name.split(':')[1] || permission.name}
                                  </span>
                                </label>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 col-span-4">No permissions in this group</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">Loading permissions...</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  {editingRole ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingRole(null);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={5000}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
