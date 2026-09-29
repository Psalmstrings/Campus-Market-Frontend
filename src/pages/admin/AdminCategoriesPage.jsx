import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Modal from '../../components/common/Modal';
import { TableSkeleton } from '../../components/common/Skeleton';

export const AdminCategoriesPage = () => {
  const { showSuccess, showError } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Package',
    isActive: true,
  });

  const fetchCategoriesList = async () => {
    try {
      setLoading(true);
      const res = await getCategories(true);
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch {
      showError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesList();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', icon: 'Package', isActive: true });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      icon: cat.icon || 'Package',
      isActive: cat.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const res = await updateCategory(editingCategory._id, formData);
        if (res.success) {
          showSuccess('Category updated');
          setModalOpen(false);
          fetchCategoriesList();
        }
      } else {
        const res = await createCategory(formData);
        if (res.success) {
          showSuccess('Category created');
          setModalOpen(false);
          fetchCategoriesList();
        }
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      const res = await deleteCategory(cat._id);
      if (res.success) {
        showSuccess('Category deleted');
        fetchCategoriesList();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Could not delete category');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 className="admin-page-title">Categories Management</h1>
            <p className="admin-page-sub">
              Add, edit, or deactivate marketplace classification categories.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>

        {/* Categories Table */}
        <div className="admin-table-card">
          {loading ? (
            <div style={{ padding: '2rem' }}>
              <TableSkeleton rows={4} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Slug</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id}>
                      <td style={{ fontWeight: '700', color: 'var(--text-dark)' }}>
                        {cat.name}
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        {cat.slug}
                      </td>
                      <td style={{ color: 'var(--text-muted)', maxWidth: '280px' }} className="truncate">
                        {cat.description || '—'}
                      </td>
                      <td>
                        <span className={`badge ${cat.isActive ? 'badge-success' : 'badge-muted'}`}>
                          {cat.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-action-row">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(cat)}
                            className="admin-action-btn"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(cat)}
                            className="admin-action-btn danger"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Category Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Category Name *</label>
            <input
              type="text"
              placeholder="e.g. Health & Wellness"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              rows="3"
              placeholder="Brief description of items in this category"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
            >
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCategoriesPage;
