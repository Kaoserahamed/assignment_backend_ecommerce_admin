import { useState, useEffect, useRef } from 'react';
import axios from '../lib/axios';
import { Upload, Trash2, Search, Edit2, X, Image as ImageIcon } from 'lucide-react';
import useAuthStore from '../store/authStore';
import PermissionGate from '../components/PermissionGate';
import Toast from '../components/Toast';
import { getErrorMessage } from '../lib/errorMessages';

export default function Media() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [editingMedia, setEditingMedia] = useState(null);
  const [toast, setToast] = useState(null);
  const [editForm, setEditForm] = useState({ altText: '', title: '' });
  const fileInputRef = useRef(null);
  const { hasPermission } = useAuthStore();

  useEffect(() => {
    if (hasPermission('media:read')) {
      fetchMedia();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await axios.get('/media', {
        params: {
          page: 1,
          limit: 50,
        },
      });
      // response.data structure: { success: true, data: { data: [...], meta: {...} } }
      const mediaList = response.data?.data?.data || [];
      setMedia(mediaList);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        
        // Determine type from mime type
        const type = file.type.startsWith('image/') ? 'image' : 'video';
        formData.append('type', type);

        await axios.post('/media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      
      setToast({ message: 'File(s) uploaded successfully', type: 'success' });
      fetchMedia();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to upload file(s)');
      setToast({ message, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingMedia(item);
    setEditForm({
      altText: item.altText || '',
      title: item.title || '',
    });
  };

  const handleUpdateMetadata = async (e) => {
    e.preventDefault();
    
    try {
      await axios.put(`/media/${editingMedia.id}`, editForm);
      setToast({ message: 'Metadata updated successfully', type: 'success' });
      setEditingMedia(null);
      fetchMedia();
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to update metadata');
      setToast({ message, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this media file?')) return;
    
    try {
      await axios.delete(`/media/${id}`);
      setToast({ message: 'Media deleted successfully', type: 'success' });
      fetchMedia();
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to delete media');
      setToast({ message, type: 'error' });
    }
  };

  const filteredMedia = media.filter(item => {
    const matchesSearch = 
      item.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.altText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterType || item.type === filterType;

    return matchesSearch && matchesType;
  });

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!hasPermission('media:read')) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
        </div>
        <div className="card">
          <PermissionGate permission="media:read" action="view media files" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
        {hasPermission('media:upload') && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="btn-primary flex items-center gap-2 cursor-pointer inline-flex"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Files
                </>
              )}
            </label>
          </div>
        )}
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by filename, alt text, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field"
          >
            <option value="">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredMedia.map((item) => (
          <div key={item.id} className="card p-3 relative group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
              {item.type === 'image' ? (
                <img
                  src={`http://localhost:3000${item.thumbnail || item.publicUrl}`}
                  alt={item.altText || item.fileName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              {hasPermission('media:write') && (
                <button
                  onClick={() => handleEdit(item)}
                  className="p-1.5 bg-white rounded shadow-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {hasPermission('media:delete') && (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 bg-white rounded shadow-lg text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-xs text-gray-600 truncate" title={item.fileName}>
              {item.fileName}
            </p>
            <p className="text-xs text-gray-400">
              {(item.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No media files found</p>
        </div>
      )}

      {/* Edit Metadata Modal */}
      {editingMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Metadata</h2>
              <button
                onClick={() => setEditingMedia(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateMetadata}>
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={`http://localhost:3000${editingMedia.thumbnail || editingMedia.publicUrl}`}
                    alt={editingMedia.fileName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={editForm.altText}
                    onChange={(e) => setEditForm({ ...editForm, altText: e.target.value })}
                    className="input-field"
                    placeholder="Describe the image"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="input-field"
                    placeholder="Image title"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn-primary">
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setEditingMedia(null)}
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
