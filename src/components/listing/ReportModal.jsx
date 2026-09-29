import React, { useState } from 'react';
import Modal from '../common/Modal';
import { submitReport } from '../../services/reportService';
import { useToast } from '../../context/ToastContext';
import { AlertTriangle, Send } from 'lucide-react';

const REASONS = [
  'Possible Scam',
  'Fake Product',
  'Wrong Information',
  'Spam',
  'Prohibited Item',
  'Offensive Content',
  'Other',
];

export const ReportModal = ({ isOpen, onClose, listingId, listingTitle }) => {
  const [reason, setReason] = useState(REASONS[0]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return;

    setSubmitting(true);
    try {
      const res = await submitReport({
        listingId,
        reason,
        description: description.trim(),
      });
      if (res.success) {
        showSuccess(res.message);
        onClose();
        setDescription('');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Suspicious Listing">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="report-warning">
          <AlertTriangle size={18} className="report-warning-icon" />
          <div>
            <div className="report-warning-title">Reporting: {listingTitle}</div>
            Help us protect students. Reports are reviewed promptly by our campus moderation team.
          </div>
        </div>

        <div>
          <label className="form-label">Reason for reporting</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="form-select"
          >
            {REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Additional details (optional)</label>
          <textarea
            rows="3"
            placeholder="Please share what made you suspicious or details about this listing..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-danger btn-sm"
          >
            <Send size={14} />
            <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReportModal;
