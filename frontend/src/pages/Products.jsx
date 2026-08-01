import { useState, useEffect } from 'react';
import axios from '../lib/axios';
import { Plus, Edit, Trash2, Search, ChevronDown, ChevronUp } from 'lucide-react';
import useAuthStore from '../store/authStore';
import PermissionGate from '../components/PermissionGate';
import Toast from '../components/Toast';
import { getErrorMessage } from '../lib/errorMessages';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [expandedTab, setExpandedTab] = useState('details');
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    shortDescription: '',
    longDescription: '',
    hasVariants: false,
    price: 0,
    salePrice: 0,
    stock: 0,
    weight: 0,
    active: true,
    featured: false,
    sortOrder: 0,
    brand: '',
    categories: [],
    variants: [],
    media: [],
  });
  const [selectedVariantAttributes, setSelectedVariantAttributes] = useState([]);
  const { hasPermission } = useAuthStore();

  useEffect(() => {
    if (hasPermission('product:read')) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [page]);

  const fetchData = async () => {
    try {
      const requests = [];
      
      // Always need products if user has product:read
      if (hasPermission('product:read')) {
        requests.push(
          axios.get('/products', { 
            params: { page, limit: 20, search: searchTerm, brandId: filterBrand, categoryId: filterCategory, active: filterStatus } 
          })
        );
      }
      
      // Fetch supporting data only if user has permissions (for dropdowns in forms)
      if (hasPermission('brand:read')) {
        requests.push(axios.get('/brands'));
      }
      
      if (hasPermission('category:read')) {
        requests.push(axios.get('/categories'));
      }
      
      if (hasPermission('attribute:read')) {
        requests.push(axios.get('/attributes'));
      }
      
      if (hasPermission('media:read')) {
        requests.push(axios.get('/media', { params: { page: 1, limit: 50 } }));
      }

      const responses = await Promise.all(requests);
      
      let responseIndex = 0;
      
      if (hasPermission('product:read')) {
        setProducts(responses[responseIndex]?.data?.data?.data || []);
        responseIndex++;
      }
      
      if (hasPermission('brand:read')) {
        setBrands(responses[responseIndex]?.data?.data || []);
        responseIndex++;
      }
      
      if (hasPermission('category:read')) {
        setCategories(responses[responseIndex]?.data?.data || []);
        responseIndex++;
      }
      
      if (hasPermission('attribute:read')) {
        setAttributes(responses[responseIndex]?.data?.data || []);
        responseIndex++;
      }
      
      if (hasPermission('media:read')) {
        setMedia(responses[responseIndex]?.data?.data?.data || []);
        responseIndex++;
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

  const generateSKU = () => {
    return 'SKU-' + Date.now().toString().slice(-6);
  };

  const generateVariantCombinations = () => {
    if (selectedVariantAttributes.length === 0) return [];
    
    const selectedAttrs = attributes.filter(a => selectedVariantAttributes.includes(a.id));
    const combinations = [[]];

    selectedAttrs.forEach(attr => {
      const newCombinations = [];
      combinations.forEach(combo => {
        attr.values?.forEach(value => {
          newCombinations.push([...combo, { attributeId: attr.id, valueId: value.id }]);
        });
      });
      combinations.splice(0, combinations.length, ...newCombinations);
    });

    return combinations.map((combo, idx) => ({
      id: 'variant-' + idx,
      sku: generateSKU(),
      price: formData.price,
      salePrice: formData.salePrice,
      stock: formData.stock,
      attributeValues: combo,
      media: [],
      active: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        sku: formData.sku,
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription,
        hasVariants: formData.hasVariants,
        price: formData.hasVariants ? null : parseFloat(formData.price),
        salePrice: formData.hasVariants ? null : parseFloat(formData.salePrice),
        stock: formData.hasVariants ? null : parseInt(formData.stock),
        weight: parseFloat(formData.weight) || 0,
        active: formData.active,
        featured: formData.featured,
        sortOrder: parseInt(formData.sortOrder) || 0,
        brandId: formData.brand || null,
        categoryIds: formData.categories,
        mediaIds: formData.media.map(m => m.mediaId),
      };

      if (editingProduct) {
        await axios.put(`/products/${editingProduct.id}`, payload);
        setToast({ message: 'Product updated successfully', type: 'success' });
      } else {
        await axios.post('/products', payload);
        setToast({ message: 'Product created successfully', type: 'success' });
      }
      setShowModal(false);
      setEditingProduct(null);
      resetFormData();
      setPage(1);
      fetchData();
    } catch (error) {
      const message = getErrorMessage(error, editingProduct ? 'Failed to update product' : 'Failed to create product');
      setToast({ message, type: 'error' });
    }
  };

  const resetFormData = () => {
    setFormData({
      name: '',
      slug: '',
      sku: '',
      shortDescription: '',
      longDescription: '',
      hasVariants: false,
      price: 0,
      salePrice: 0,
      stock: 0,
      weight: 0,
      active: true,
      featured: false,
      sortOrder: 0,
      brand: '',
      categories: [],
      variants: [],
      media: [],
    });
    setSelectedVariantAttributes([]);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      shortDescription: product.shortDescription || '',
      longDescription: product.longDescription || '',
      hasVariants: product.hasVariants,
      price: product.price || 0,
      salePrice: product.salePrice || 0,
      stock: product.stock || 0,
      weight: product.weight || 0,
      active: product.active,
      featured: product.featured,
      sortOrder: product.sortOrder || 0,
      brand: product.brand?.id || '',
      categories: product.categories?.map(c => c.id) || [],
      variants: product.variants || [],
      media: product.media || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axios.delete(`/products/${id}`);
      setToast({ message: 'Product deleted successfully', type: 'success' });
      fetchData();
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to delete product');
      setToast({ message, type: 'error' });
    }
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

  if (!hasPermission('product:read')) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        </div>
        <div className="card">
          <PermissionGate permission="product:read" action="view products" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        {hasPermission('product:create') && (
          <button
            onClick={() => {
              setEditingProduct(null);
              resetFormData();
              setShowModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Product
          </button>
        )}
      </div>

      <div className="card mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="input-field pl-10"
            />
          </div>
          <select
            value={filterBrand}
            onChange={(e) => { setFilterBrand(e.target.value); setPage(1); }}
            className="input-field"
          >
            <option value="">All Brands</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
            className="input-field"
          >
            <option value="">All Categories</option>
            {flattenCategories(categories).map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
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
                <th>Thumbnail</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Brand</th>
                <th>Categories</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => {
                const thumbnail = product.media?.find(m => m.isThumbnail);
                const thumbnailMedia = thumbnail ? media.find(m => m.id === thumbnail.mediaId) : null;
                return (
                  <tr key={product.id}>
                    <td>
                      {thumbnailMedia?.thumbnail ? (
                        <img src={`http://localhost:3000${thumbnailMedia.thumbnail}`} alt={product.name} className="h-8 w-8 rounded object-cover" />
                      ) : (
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      )}
                    </td>
                    <td className="font-medium">{product.name}</td>
                    <td className="text-sm text-gray-600">{product.sku}</td>
                    <td className="text-sm">{product.brand?.name || 'N/A'}</td>
                    <td className="text-sm">{product.categories?.length || 0} categories</td>
                    <td className="text-sm">
                      {product.hasVariants ? (
                        <span className="text-gray-600">Variants</span>
                      ) : (
                        <span>${parseFloat(product.price || 0).toFixed(2)}</span>
                      )}
                    </td>
                    <td className="text-sm">{product.stock || '-'}</td>
                    <td>
                      <span className={`px-2 py-1 text-xs rounded ${
                        product.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {hasPermission('product:update') && (
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {hasPermission('product:delete') && (
                          <button
                            onClick={() => handleDelete(product.id)}
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
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Create Product'}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Tabs */}
              <div className="border-b mb-6 flex gap-4">
                {['details', 'organization', 'media', 'variants'].map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setExpandedTab(tab)}
                    className={`px-4 py-2 border-b-2 font-medium capitalize ${
                      expandedTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Details Tab */}
              {expandedTab === 'details' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description
                    </label>
                    <textarea
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="input-field"
                      rows="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Long Description
                    </label>
                    <textarea
                      value={formData.longDescription}
                      onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                      className="input-field"
                      rows="4"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.hasVariants}
                        onChange={(e) => setFormData({ ...formData, hasVariants: e.target.checked, variants: [] })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">Has Variants</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">Featured</span>
                    </label>
                  </div>

                  {!formData.hasVariants && (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price</label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.salePrice}
                            onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                          <input
                            type="number"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            className="input-field"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                      <input
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
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
              )}

              {/* Organization Tab */}
              {expandedTab === 'organization' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                    <select
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="input-field"
                    >
                      <option value="">None</option>
                      {brands.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                    <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                      {flattenCategories(categories).map(cat => (
                        <label key={cat.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.categories.includes(cat.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, categories: [...formData.categories, cat.id] });
                              } else {
                                setFormData({ ...formData, categories: formData.categories.filter(c => c !== cat.id) });
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <span>{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Media Tab */}
              {expandedTab === 'media' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Media</label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setFormData({
                            ...formData,
                            media: [...formData.media, { mediaId: e.target.value, isThumbnail: formData.media.length === 0 }]
                          });
                          e.target.value = '';
                        }
                      }}
                      className="input-field"
                    >
                      <option value="">Add Media...</option>
                      {media.map(m => (
                        <option key={m.id} value={m.id}>{m.fileName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {formData.media.map((m, idx) => {
                      const mediaItem = media.find(mi => mi.id === m.mediaId);
                      return mediaItem ? (
                        <div key={idx} className="relative border rounded p-2">
                          <img src={`http://localhost:3000${mediaItem.thumbnail}`} alt="media" className="w-full h-24 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                media: formData.media.filter((_, i) => i !== idx)
                              });
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded"
                          >
                            ✕
                          </button>
                          <label className="mt-2 flex items-center gap-1 text-xs">
                            <input
                              type="checkbox"
                              checked={m.isThumbnail}
                              onChange={(e) => {
                                const newMedia = formData.media.map((mi, i) => ({
                                  ...mi,
                                  isThumbnail: i === idx ? e.target.checked : false
                                }));
                                setFormData({ ...formData, media: newMedia });
                              }}
                              className="w-3 h-3"
                            />
                            Thumbnail
                          </label>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Variants Tab */}
              {expandedTab === 'variants' && formData.hasVariants && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Attributes for Variants</label>
                    <div className="border rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
                      {attributes.map(attr => (
                        <label key={attr.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedVariantAttributes.includes(attr.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedVariantAttributes([...selectedVariantAttributes, attr.id]);
                              } else {
                                setSelectedVariantAttributes(selectedVariantAttributes.filter(a => a !== attr.id));
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <span>{attr.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, variants: generateVariantCombinations() });
                    }}
                    className="btn-secondary w-full"
                  >
                    Generate Variant Combinations
                  </button>

                  {formData.variants.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Variants ({formData.variants.length})</h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {formData.variants.map((variant, idx) => (
                          <div key={idx} className="border rounded p-3 bg-gray-50">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <input
                                type="text"
                                value={variant.sku}
                                onChange={(e) => {
                                  const newVariants = [...formData.variants];
                                  newVariants[idx].sku = e.target.value;
                                  setFormData({ ...formData, variants: newVariants });
                                }}
                                placeholder="SKU"
                                className="input-field"
                              />
                              <input
                                type="number"
                                step="0.01"
                                value={variant.price}
                                onChange={(e) => {
                                  const newVariants = [...formData.variants];
                                  newVariants[idx].price = e.target.value;
                                  setFormData({ ...formData, variants: newVariants });
                                }}
                                placeholder="Price"
                                className="input-field"
                              />
                              <input
                                type="number"
                                step="0.01"
                                value={variant.salePrice}
                                onChange={(e) => {
                                  const newVariants = [...formData.variants];
                                  newVariants[idx].salePrice = e.target.value;
                                  setFormData({ ...formData, variants: newVariants });
                                }}
                                placeholder="Sale Price"
                                className="input-field"
                              />
                              <input
                                type="number"
                                value={variant.stock}
                                onChange={(e) => {
                                  const newVariants = [...formData.variants];
                                  newVariants[idx].stock = e.target.value;
                                  setFormData({ ...formData, variants: newVariants });
                                }}
                                placeholder="Stock"
                                className="input-field"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                    resetFormData();
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
