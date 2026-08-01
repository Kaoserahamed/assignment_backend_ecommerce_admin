import { useState, useEffect } from 'react';
import axios from '../lib/axios';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import useAuthStore from '../store/authStore';
import PermissionGate from '../components/PermissionGate';
import Toast from '../components/Toast';
import { getErrorMessage } from '../lib/errorMessages';

export default function Attributes() {
  const [attributes, setAttributes] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showValueModal, setShowValueModal] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'dropdown',
  });
  const [valueFormData, setValueFormData] = useState({
    value: '',
    slug: '',
    refValue: '',
  });
  const { hasPermission } = useAuthStore();

  useEffect(() => {
    if (hasPermission('attribute:read')) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    try {
      const requests = [axios.get('/attributes')];
      
      // Only fetch media if user can read it (for image swatches in forms)
      if (hasPermission('media:read')) {
        requests.push(axios.get('/media', { params: { page: 1, limit: 50 } }));
      }

      const responses = await Promise.all(requests);
      
      setAttributes(responses[0].data?.data || []);
      
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

  const handleValueChange = (e) => {
    const value = e.target.value;
    setValueFormData(prev => ({
      ...prev,
      value,
      slug: generateSlug(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        type: formData.type,
      };

      if (editingAttribute) {
        await axios.put(`/attributes/${editingAttribute.id}`, payload);
        setToast({ message: 'Attribute updated successfully', type: 'success' });
      } else {
        await axios.post('/attributes', payload);
        setToast({ message: 'Attribute created successfully', type: 'success' });
      }
      setShowModal(false);
      setEditingAttribute(null);
      setFormData({ name: '', slug: '', type: 'dropdown' });
      fetchData();
    } catch (error) {
      const message = getErrorMessage(error, editingAttribute ? 'Failed to update attribute' : 'Failed to create attribute');
      setToast({ message, type: 'error' });
    }
  };

  const handleAddValue = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        value: valueFormData.value,
        slug: valueFormData.slug,
        refValue: valueFormData.refValue || null,
      };

      if (editingValue) {
        await axios.put(
          `/attributes/${editingAttribute.id}/values/${editingValue.id}`,
          payload
        );
        setToast({ message: 'Attribute value updated successfully', type: 'success' });
      } else {
        await axios.post(
          `/attributes/${editingAttribute.id}/values`,
          payload
        );
        setToast({ message: 'Attribute value created successfully', type: 'success' });
      }
      setShowValueModal(false);
      setEditingValue(null);
      setValueFormData({ value: '', slug: '', refValue: '' });
      fetchData();
    } catch (error) {
      const message = getErrorMessage(error, editingValue ? 'Failed to update value' : 'Failed to create value');
      setToast({ message, type: 'error' });
    }
  };

  const handleEdit = (attribute) => {
    setEditingAttribute(attribute);
    setFormData({
      name: attribute.name,
      slug: attribute.slug,
      type: attribute.type,
    });
    setShowModal(true);
  };

  const handleEditValue = (attribute, value) => {
    setEditingAttribute(attribute);
    setEditingValue(value);
    setValueFormData({
      value: value.value,
      slug: value.slug,
      refValue: value.refValue || '',
    });
    setShowValueModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this attribute?')) return;
    
    try {
      await axios.delete(`/attributes/${id}`);
      setToast({ message: 'Attribute deleted successfully', type: 'success' });
      fetchData();
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to delete attribute');
      setToast({ message, type: 'error' });
    }
  };

  const handleDeleteValue = async (attributeId, valueId) => {
    if (!confirm('Are you sure you want to delete this value?')) return;
    
    try {
      await axios.delete(`/attributes/${attributeId}/values/${valueId}`);
      setToast({ message: 'Attribute value deleted successfully', type: 'success' });
      fetchData();
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to delete value');
      setToast({ message, type: 'error' });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!hasPermission('attribute:read')) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Attributes</h1>
        </div>
        <div className="card">
          <PermissionGate permission="attribute:read" action="view attributes" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Attributes</h1>
        {hasPermission('attribute:create') && (
          <button
            onClick={() => {
              setEditingAttribute(null);
              setFormData({ name: '', slug: '', type: 'dropdown' });
              setShowModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Attribute
          </button>
        )}
      </div>

      <div className="space-y-4">
        {attributes.map(attribute => (
          <div key={attribute.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{attribute.name}</h3>
                <p className="text-sm text-gray-600">
                  Type: {attribute.type} • {attribute.values?.length || 0} values
                </p>
              </div>
              <div className="flex gap-2">
                {hasPermission('attribute:update') && (
                  <button
                    onClick={() => handleEdit(attribute)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {hasPermission('attribute:delete') && (
                  <button
                    onClick={() => handleDelete(attribute.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700">Values</h4>
                {hasPermission('attribute:update') && (
                  <button
                    onClick={() => {
                      setEditingAttribute(attribute);
                      setEditingValue(null);
                      setValueFormData({ value: '', slug: '', refValue: '' });
                      setShowValueModal(true);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Value
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {attribute.values?.length ? (
                  attribute.values.map(value => {
                    const refMedia = media.find(m => m.id === value.refValue);
                    return (
                      <div key={value.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{value.value}</span>
                          {attribute.type === 'colour swatch' && value.refValue && (
                            <div
                              className="w-6 h-6 rounded border border-gray-300"
                              style={{ backgroundColor: value.refValue }}
                            />
                          )}
                          {attribute.type === 'image swatch' && refMedia?.thumbnail && (
                            <img
                              src={`http://localhost:3000${refMedia.thumbnail}`}
                              alt={value.value}
                              className="w-6 h-6 rounded object-cover"
                            />
                          )}
                        </div>
                        <div className="flex gap-2">
                          {hasPermission('attribute:update') && (
                            <button
                              onClick={() => handleEditValue(attribute, value)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          )}
                          {hasPermission('attribute:delete') && (
                            <button
                              onClick={() => handleDeleteValue(attribute.id, value.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm">No values yet</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Attribute Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingAttribute ? 'Edit Attribute' : 'Create Attribute'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
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
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="dropdown">Dropdown</option>
                    <option value="radio">Radio</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="colour swatch">Colour Swatch</option>
                    <option value="image swatch">Image Swatch</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  {editingAttribute ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAttribute(null);
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

      {/* Add/Edit Value Modal */}
      {showValueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingValue ? 'Edit Value' : 'Add Value'}
            </h2>
            <form onSubmit={handleAddValue}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value *
                  </label>
                  <input
                    type="text"
                    value={valueFormData.value}
                    onChange={handleValueChange}
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
                    value={valueFormData.slug}
                    onChange={(e) => setValueFormData({ ...valueFormData, slug: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                {editingAttribute.type === 'colour swatch' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Colour (Hex Code)
                    </label>
                    <input
                      type="color"
                      value={valueFormData.refValue || '#000000'}
                      onChange={(e) => setValueFormData({ ...valueFormData, refValue: e.target.value })}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                )}

                {editingAttribute.type === 'image swatch' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image
                    </label>
                    <select
                      value={valueFormData.refValue}
                      onChange={(e) => setValueFormData({ ...valueFormData, refValue: e.target.value })}
                      className="input-field"
                    >
                      <option value="">None</option>
                      {media.map(m => (
                        <option key={m.id} value={m.id}>{m.fileName}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  {editingValue ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowValueModal(false);
                    setEditingAttribute(null);
                    setEditingValue(null);
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
