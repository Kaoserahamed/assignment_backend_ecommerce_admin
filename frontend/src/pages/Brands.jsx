import { useState, useEffect } from 'react';
import axios from '../lib/axios';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import useAuthStore from '../store/authStore';
import PermissionGate from '../components/PermissionGate';
import Toast from '../components/Toast';
import { getErrorMessage } from '../lib/errorMessages';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: true,
    logoId: '',
  });
  const { hasPermission } = useAuthStore();

  useEffect(() => {
    if (hasPermission('brand:read')) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    try {
      const requests = [axios.get('/brands')];
      
      // Only fetch media if user can read it (for logo dropdown in forms)
      if (hasPermission('media:read')) {
        requests.push(axios.get('/media', { params: { page: 1, limit: 50 } }));
      }

      const responses = await Promise.all(requests);
      
      setBrands(responses[0].data?.data || []);
      
      if (responses[1]) {
        setMedia(responses[1].data?.data?.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        status: formData.status,
        logoId: formData.logoId || null,
      };

      if (editingBrand) {
        await axios.put(`/brands/${editingBrand.id}`, payload);
        setToast({ message: 'Brand updated successfully', type: 'success' });
      } else {
        await axios.post('/brands', payload);
        setToast({ message: 'Brand created successfully', type: 'success' });
      }
      setShowModal(false);
      setEditingBrand(null);
      setFormData({ name: '', slug: '', description: '', status: true, logoId: '' });
      fetchData();
    } catch (error) {
      const message = getErrorMessage(error, editingBrand ? 'Failed to update brand' : 'Failed to create brand');
      setToast({ message, type: 'error' });
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || '',
      status: brand.status,
      logoId: brand.logoId || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    
    try {
      await axios.delete(`/brands/${id}`);
      setToast({ message: 'Brand deleted successfully', type: 'success' });
      fetchData();
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to delete brand');
      setToast({ message, type: 'error' });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!hasPermission('brand:read')) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Brands</h1>
        </div>
        <div className="card">
          <PermissionGate permission="brand:read" action="view brands" />
        </div>
      </div>
    );
  }

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || brand.status.toString() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Brands</h1>
        {hasPermission('brand:create') && (
          <button
            onClick={() => {
              setEditingBrand(null);
              setFormData({ name: '', slug: '', description: '', status: true, logoId: '' });
              setShowModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Brand
          </button>
        )}
      </div>

      <div className="card mb-6 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBrands.map((brand) => {
                const logoMedia = media.find(m => m.id === brand.logoId);
                return (
                  <tr key={brand.id}>
                    <td>
                      {logoMedia?.thumbnail ? (
                        <img src={`http://localhost:3000${logoMedia.thumbnail}`} alt={brand.name} className="h-8 w-8 rounded object-cover" />
                      ) : (
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      )}
                    </td>
                    <td className="font-medium">{brand.name}</td>
                    <td className="text-gray-600 text-sm">{brand.slug}</td>
                    <td className="text-gray-600 text-sm">{brand.description}</td>
                    <td>
                      <span className={`px-2 py-1 text-xs rounded ${
                        brand.status 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {brand.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {hasPermission('brand:update') && (
                          <button
                            onClick={() => handleEdit(brand)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {hasPermission('brand:delete') && (
                          <button
                            onClick={() => handleDelete(brand.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingBrand ? 'Edit Brand' : 'Create Brand'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo (from media library)
                  </label>
                  <select
                    value={formData.logoId}
                    onChange={(e) => setFormData({ ...formData, logoId: e.target.value })}
                    className="input-field"
                  >
                    <option value="">None</option>
                    {media.map(m => (
                      <option key={m.id} value={m.id}>{m.fileName}</option>
                    ))}
                  </select>
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

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  {editingBrand ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingBrand(null);
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
