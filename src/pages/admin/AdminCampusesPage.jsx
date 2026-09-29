import React, { useState, useEffect } from 'react';
import { Plus, Edit } from 'lucide-react';
import {
  getCampuses,
  createCampus,
  updateCampus,
} from '../../services/campusService';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Modal from '../../components/common/Modal';
import { TableSkeleton } from '../../components/common/Skeleton';

export const AdminCampusesPage = () => {
  const { showSuccess, showError } = useToast();
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCampus, setEditingCampus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    location: '',
    description: '',
    isActive: true,
  });

  const fetchCampusesList = async () => {
    try {
      setLoading(true);
      const res = await getCampuses(true);
      if (res.success && res.data) {
        setCampuses(res.data);
      }
    } catch {
      showError('Failed to fetch campuses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampusesList();
  }, []);

  const handleOpenCreate = () => {
    setEditingCampus(null);
    setFormData({
      name: '',
      shortName: '',
      location: '',
      description: '',
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCampus(c);
    setFormData({
      name: c.name,
      shortName: c.shortName,
      location: c.location,
      description: c.description || '',
      isActive: c.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCampus) {
        const res = await updateCampus(editingCampus._id, formData);
        if (res.success) {
          showSuccess('Campus updated successfully');
          setModalOpen(false);
          fetchCampusesList();
        }
      } else {
        const res = await createCampus(formData);
        if (res.success) {
          showSuccess('New campus added successfully');
          setModalOpen(false);
          fetchCampusesList();
        }
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleToggleActive = async (c) => {
    try {
      const res = await updateCampus(c._id, { isActive: !c.isActive });
      if (res.success) {
        showSuccess(c.isActive ? 'Campus deactivated' : 'Campus activated');
        fetchCampusesList();
      }
    } catch {
      showError('Failed to update campus');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 className="admin-page-title">Campuses Management</h1>
            <p className="admin-page-sub">
              Add and manage supported Nigerian universities and polytechnics dynamically.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Add New Campus</span>
          </button>
        </div>

        {/* Campuses Table */}
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
                    <th>Campus</th>
                    <th>Short Code</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campuses.map((c) => (
                    <tr key={c._id}>
                      <td style={{ fontWeight: '700', color: 'var(--text-dark)' }}>
                        {c.name}
                        {c.description && (
                          <span style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--text-light)', fontWeight: 'normal' }}>
                            {c.description}
                          </span>
                        )}
                      </td>
                      <td style={{ fontWeight: '800', color: 'var(--primary)' }}>
                        {c.shortName}
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        {c.location}
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(c)}
                          className={`badge ${c.isActive ? 'badge-success' : 'badge-muted'}`}
                          style={{ cursor: 'pointer', border: 'none' }}
                        >
                          {c.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(c)}
                          className="admin-action-btn"
                          title="Edit campus"
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Campus Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCampus ? 'Edit Campus' : 'Add New Campus'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Full Institution Name *</label>
            <input
              type="text"
              placeholder="e.g. University of Ibadan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Short Name / Acronym *</label>
              <input
                type="text"
                placeholder="e.g. UI"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value.toUpperCase() })}
                className="form-input"
                style={{ textTransform: 'uppercase' }}
                required
              />
            </div>

            <div>
              <label className="form-label">Location *</label>
              <input
                type="text"
                placeholder="e.g. Ibadan, Oyo"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Motto or Description</label>
            <input
              type="text"
              placeholder="e.g. Recte Sapere Fons"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
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
              {editingCampus ? 'Save Changes' : 'Create Campus'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCampusesPage;
