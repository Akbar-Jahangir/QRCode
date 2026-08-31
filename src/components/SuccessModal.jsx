import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export default function SuccessModal({ modalData, onClose }) {
  if (!modalData) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-card">
        <button className="modal-close-btn" onClick={onClose} aria-label="إغلاق">
          <X size={18} />
        </button>

        <div className="wa-bubble-pulse" style={{ background: '#dcfce7', color: '#16a34a' }}>
          <CheckCircle2 size={36} />
        </div>

        <h3 className="modal-title" style={{ color: '#15803d' }}>تم إرسال طلب الحجز بنجاح!</h3>
        <p className="modal-desc" style={{ fontSize: '0.98rem', lineHeight: '1.7', color: '#475569', marginTop: '0.5rem' }}>
          شكراً لثقتكم بـ <strong>شركة التل الدولية</strong>.<br />
          تم استلام بياناتكم بنجاح وسيقوم فريق العمل بالتواصل معكم هاتفياً لتأكيد موعد المعاينة ورفع المقاسات في أقرب وقت.
        </p>

        <div className="modal-actions-grid" style={{ marginTop: '1.5rem' }}>
          <button 
            className="btn btn-whatsapp-direct" 
            onClick={onClose}
            style={{ background: 'var(--primary-color)', color: '#fff', justifyContent: 'center' }}
          >
            <Sparkles size={18} />
            <span>حسناً، شكراً لكم</span>
          </button>
        </div>
      </div>
    </div>
  );
}
