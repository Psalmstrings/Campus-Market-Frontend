import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, X, ArrowLeft } from 'lucide-react';
import { getListingById, updateListing, uploadImages } from '../services/listingService';
import { getCampuses } from '../services/campusService';
import { getCategories } from '../services/categoryService';
import { useToast } from '../context/ToastContext';

export const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [campuses, setCampuses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    campus: '',
    price: '',
    condition: 'Good',
    location: '',
    description: '',
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cRes, catRes, listingRes] = await Promise.all([
          getCampuses(),
          getCategories(),
          getListingById(id),
        ]);

        if (cRes.success) setCampuses(cRes.data);
        if (catRes.success) setCategories(catRes.data);
        if (listingRes.success && listingRes.data) {
          const l = listingRes.data;
          setFormData({
            title: l.title,
            category: l.category?._id || l.category,
            campus: l.campus?._id || l.campus,
            price: l.price,
            condition: l.condition,
            location: l.location,
            description: l.description,
          });
          setImages(l.images || []);
        }
      } catch {
        showError('Failed to load listing for editing');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (images.length + files.length > 5) {
      showError('Maximum 5 images allowed');
      return;
    }

    setUploading(true);
    const data = new FormData();
    files.forEach((file) => data.append('images', file));

    try {
      const res = await uploadImages(data);
      if (res.success && res.urls) {
        setImages((prev) => [...prev, ...res.urls]);
        showSuccess('Images uploaded');
      }
    } catch {
      showError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || images.length === 0) {
      showError('Please complete required fields and include at least one image');
      return;
    }

    setSaving(true);
    try {
      const res = await updateListing(id, {
        ...formData,
        price: Number(formData.price),
        images,
      });

      if (res.success) {
        showSuccess('Listing updated successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="sell-page">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="detail-back-btn"
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div className="sell-page-header">
        <h1 className="sell-page-title">Edit Listing</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="sell-section-card">
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Listing Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-row" style={{ marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Campus</label>
              <select
                name="campus"
                value={formData.campus}
                onChange={handleChange}
                className="form-select"
                required
              >
                {campuses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.shortName} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>

          <div className="form-row" style={{ marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Price (₦)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                className="form-input"
                style={{ fontWeight: '700' }}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Campus Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              required
            />
          </div>

          {/* Images */}
          <div style={{ marginTop: '1.25rem' }}>
            <label className="form-label">
              Images ({images.length}/5)
            </label>
            <div className="image-previews" style={{ marginBottom: '1rem' }}>
              {images.map((img, i) => (
                <div key={i} className="image-preview-item">
                  <img src={img} alt={`Upload ${i + 1}`} className="image-preview-img" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="image-preview-remove"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            {images.length < 5 && (
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                <Upload size={14} />
                <span>Upload more images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>

        <div className="sell-submit-row">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary btn-lg"
          >
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditListingPage;
