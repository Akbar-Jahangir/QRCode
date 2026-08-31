import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Phone, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';

export default function SuccessModal({ modalData, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!modalData) return null;

  const { messageText, whatsappUrl, targetNumber } = modalData;

  const handleCopy = () => {
    if (!messageText) return;
    navigator.clipboard.writeText(messageText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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

        <div className="wa-bubble-pulse">
          <MessageCircle size={32} />
        </div>

        <h3 className="modal-title">جاري التوجيه إلى واتساب...</h3>
        <p className="modal-desc">
          تم تجهيز بيانات حجز موعد رفع المقاسات بنجاح وإرسالها إلى الرقم المعتمد:
        </p>

        <div className="modal-phone-badge" dir="ltr">
          <Phone size={18} />
          <span>{targetNumber || '+92 343 1982051'}</span>
        </div>

        {/* Message Preview Box */}
        <div className="message-preview-box">
          <div className="preview-header">
            <span>نص الرسالة المجهزة:</span>
            <button className="btn-mini-copy" onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'تم النسخ!' : 'نسخ النص'}</span>
            </button>
          </div>
          <pre className="preview-content">{messageText}</pre>
        </div>

        <div className="modal-actions-grid">
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="btn btn-whatsapp-direct"
          >
            <ExternalLink size={20} />
            <span>فتح محادثة واتساب الآن</span>
          </a>
          <button className="btn btn-outline" onClick={onClose}>
            <span>إغلاق وعودة للنموذج</span>
          </button>
        </div>
      </div>
    </div>
  );
}
