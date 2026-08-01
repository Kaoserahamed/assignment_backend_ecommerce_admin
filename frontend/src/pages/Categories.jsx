import { useState, useEffect } from 'react';
import axios from '../lib/axios';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import useAuthStore from '../store/authStore';
import PermissionGate from '../components/PermissionGate';
import Toast from '../components/Toast';
import { getErrorMessage } from '../lib/errorMessages';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent: '',
    image: '',
    active: true,
    sortOrder: 0,
  });
  const { hasPermission } = useAuthStore();

  useEffect(() => {
    if (hasPermission('category:read')) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    try {
      const requests = [axios.get('/categories/tree')];
      
      // Only fetch media if user can read it (for image dropdown in forms)
      if (hasPermission('media:read')) {
        requests.push(axios.get('/media', { params: { page: 1, limit: 50 } }));
      }

      const responses = await Promise.all(requests);
      
      setCategories(responses[0].data?.data || []);
      
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
        parent: formData.parent || null,
        image: formData.image || null,
        active: formData.active,
        sortOrder: parseInt(formData.sortOrder) || 0,
      };

      if (editingCategory) {
        await axios.put(`/categories/${editingCategory.id}`, payload);
        setToast({ message: 'Category updated successfully', type: 'success' });
      } else {
        await axios.post('/categories', payload);
        setToast({ message: 'Category created successfully', type: 'success' });
      }
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '', parent: '', image: '', active: true, sortOrder: 0 });
      fetchData();
    } catch (error) {
      const message = getErrorMessage(error, editingCategory ? 'Failed to update category' : 'Failed to create category');
      setToast({ message, type: 'error' });
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parent: category.parent?.id || '',
      image: category.image || '',
      active: category.active,
      sortOrder: category.sortOrder || 0,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await axios.delete(`/categories/${id}`);
      setToast({ message: 'Category deleted successfully', type: 'success' });
      fetchData();
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to delete category');
      setToast({ message, type: 'error' });
    }
  };

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const CategoryRow = ({ category, level = 0 }) => {
    const hasChildren = category.children && category.children.length > 0;
    const image = media.find(m => m.id === category.image);

    return (
      <div key={category.id}>
        <div className="flex items-center gap-2 border-b hover:bg-gray-50 py-3 px-4">
          <div style={{ marginLeft: `${level * 20}px` }}>
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(category.id)}
                className="p-0 text-gray-400"
              >
                {expandedIds.has(category.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ) : (
              <div className="w-4" />
            )}
          </div>
          
          <div className="flex-1 flex items-center gap-3">
            {image?.thumbnail && (
              <img src={`http://localhost:3000${image.thumbnail}`} alt={category.name} className="h-8 w-8 rounded object-cover" />
            )}
            <div className="flex-1">
              <div className="font-medium text-gray-900">{category.name}</div>
              <div className="text-xs text-gray-600">{category.slug}</div>
            </div>
          </div>

          <span className={`px-2 py-1 text-xs rounded ${
            category.active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {category.active ? 'Active' : 'Inactive'}
          </span>

          <div className="flex gap-2">
            {hasPermission('category:update') && (
              <button
                onClick={() => handleEdit(category)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {hasPermission('category:delete') && (
              <button
                onClick={() => handleDelete(category.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {hasChildren && expandedIds.has(category.id) && (
          <div>
            {category.children.map(child => (
              <CategoryRow key={child.id} category={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const flattenCategories = (cats) => {
    let result = [];
    cats.forEach(cat => {
      result.push(cat);
      if (cat.children) {
        result = result.concat(flattenCategories(cat.children));
      }
    });
    return result;
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!hasPermission('category:read')) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        </div>
        <div className="card">
          <PermissionGate permission="category:read" action="view categories" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        {hasPermission('category:create') && (
          <button
            onClick={() => {
              setEditingCategory(null);
              setFormData({ name: '', slug: '', description: '', parent: '', image: '', active: true, sortOrder: 0 });
              setShowModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Category
          </button>
        )}
      </div>

      <div className="card">
        <div className="divide-y">
          {categories.map(category => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
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
                    Parent Category
                  </label>
                  <select
                    value={formData.parent}
                    onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                    className="input-field"
                  >
                    <option value="">None (Root)</option>
                    {flattenCategories(categories).map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {' '.repeat((cat.level || 0) * 2)}{cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <select
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="input-field"
                  >
                    <option value="">None</option>
                    {media.map(m => (
                      <option key={m.id} value={m.id}>{m.fileName}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                      className="input-field"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  {editingCategory ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
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
