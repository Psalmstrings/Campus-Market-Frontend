import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  X,
  Info,
} from 'lucide-react';
import { createListing, uploadImages } from '../services/listingService';
import { getCampuses } from '../services/campusService';
import { getCategories } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const SellPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [campuses, setCampuses] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    campus: user?.campus?._id || user?.campus || '',
    price: '',
    condition: 'Good',
    location: '',
    description: '',
  });

  const [images, setImages] = useState([]);
  const [imageInputUrl, setImageInputUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [cRes, catRes] = await Promise.all([getCampuses(), getCategories()]);
        if (cRes.success) {
          setCampuses(cRes.data);
          if (!formData.campus && cRes.data.length > 0) {
            setFormData((prev) => ({ ...prev, campus: cRes.data[0]._id }));
          }
        }
        if (catRes.success) {
          setCategories(catRes.data);
          if (catRes.data.length > 0) {
            setFormData((prev) => ({ ...prev, category: catRes.data[0]._id }));
          }
        }
      } catch (err) {
        console.error('Error loading metadata for selling:', err);
      }
    };

    fetchMetadata();
  }, [formData.campus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.length + files.length > 5) {
      showError('You can upload a maximum of 5 images');
      return;
    }

    setUploading(true);
    const data = new FormData();
    files.forEach((file) => data.append('images', file));

    try {
      const res = await uploadImages(data);
      if (res.success && res.urls) {
        setImages((prev) => [...prev, ...res.urls]);
        showSuccess('Images uploaded successfully');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!imageInputUrl.trim()) return;
    if (images.length >= 5) {
      showError('Maximum 5 images allowed');
      return;
    }
    setImages((prev) => [...prev, imageInputUrl.trim()]);
    setImageInputUrl('');
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showError('Please provide a listing title');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      showError('Please enter a valid price in Naira');
      return;
    }
    if (!formData.location.trim()) {
      showError('Please enter your specific location on campus');
      return;
    }
    if (!formData.description.trim()) {
      showError('Please describe the item or service');
      return;
    }
    if (images.length === 0) {
      showError('Please upload at least one image of your item');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createListing({
        ...formData,
        price: Number(formData.price),
        images,
      });

      if (res.success) {
        showSuccess('Your listing has been submitted and is awaiting approval by admin!');
        navigate('/dashboard');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sell-page">
      <div className="sell-page-header">
        <h1 className="sell-page-title">Create New Listing</h1>
        <p className="sell-page-sub">
          Post an item or offer a service to students on your campus.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Notice on Approval */}
        <div className="sell-notice">
          <Info size={20} className="sell-notice-icon" />
          <div>
            <strong>Campus Verification:</strong> All newly submitted listings enter <em>Pending</em> review by campus moderators before becoming publicly visible to ensure community safety.
          </div>
        </div>

        {/* Basic Information Card */}
        <div className="sell-section-card">
          <h2 className="sell-section-title">1. Listing Details</h2>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Listing Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. HP EliteBook 840 G5 (Core i5, 16GB RAM) or Calculus Textbook"
              value={formData.title}
              onChange={handleChange}
              maxLength={120}
              className="form-input"
              required
            />
          </div>

          <div className="form-row" style={{ marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
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
              <label className="form-label">Condition *</label>
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

          <div className="form-group">
            <label className="form-label">Price (Nigerian Naira ₦) *</label>
            <input
              type="number"
              name="price"
              placeholder="25000"
              value={formData.price}
              onChange={handleChange}
              min="0"
              className="form-input"
              style={{ fontWeight: '700' }}
              required
            />
          </div>
        </div>

        {/* Campus & Location Card */}
        <div className="sell-section-card">
          <h2 className="sell-section-title">2. Campus & Location</h2>

          <div className="form-row" style={{ marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Campus *</label>
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
              <label className="form-label">Location on Campus *</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Moremi Hall, Faculty of Science, or SUB"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Description *</label>
            <textarea
              name="description"
              rows="4"
              placeholder="Provide key details, specifications, reason for selling, accessories included, and pick-up arrangements..."
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              required
            />
          </div>
        </div>

        {/* Images Upload Card */}
        <div className="sell-section-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 className="sell-section-title" style={{ margin: 0 }}>3. Product Images (Up to 5)</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {images.length}/5 uploaded
            </span>
          </div>

          {/* Upload Dropzone */}
          <div className="upload-zone">
            <input
              type="file"
              id="imageUploadInput"
              multiple
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              disabled={uploading || images.length >= 5}
            />
            <label htmlFor="imageUploadInput" style={{ cursor: 'pointer' }}>
              <div className="upload-icon">
                <Upload size={24} />
              </div>
              <div className="upload-text">
                {uploading ? 'Uploading images...' : 'Click to upload pictures from device'}
              </div>
              <p className="upload-hint">JPEG, PNG, or WEBP up to 5MB each</p>
            </label>
          </div>

          {/* Optional Direct URL input */}
          <div style={{ paddingTop: '1rem' }}>
            <label style={{ fontSize: '0.6875rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '0.375rem' }}>
              Or paste image web link
            </label>
            <div className="image-url-row">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageInputUrl}
                onChange={(e) => setImageInputUrl(e.target.value)}
                className="image-url-input"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="btn btn-secondary btn-sm"
              >
                Add Link
              </button>
            </div>
          </div>

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="image-previews">
              {images.map((img, index) => (
                <div key={index} className="image-preview-item">
                  <img src={img} alt={`Upload ${index + 1}`} className="image-preview-img" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="image-preview-remove"
                    title="Remove image"
                  >
                    <X size={12} />
                  </button>
                  {index === 0 && (
                    <span className="image-cover-tag">Cover</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="sell-submit-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || uploading}
            className="btn btn-primary btn-lg"
          >
            {submitting ? 'Submitting...' : 'Submit Listing for Approval'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellPage;
