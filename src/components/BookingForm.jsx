import React, { useState } from 'react';
import { 
  Check, 
  Send,
  Sparkles,
  PhoneCall,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TARGET_WHATSAPP_NUMBER = '+96550266484'; // WhatsApp number: +923431982051
const TEXTMEBOT_API_KEY = 'XkQfa6axBECn'; // TextMeBot API Key

export default function BookingForm({ onFormSubmitSuccess, onNavigate }) {
  const [formData, setFormData] = useState({
    custName: '',
    custPhone1: '',
    custPhone2: '',
    custAddress: '',
    notes: '',
  });

  const [services, setServices] = useState({
    honorStairs: false,   // درج شرفي
    serviceStairs: false, // درج خدمي
    balconies: false,     // بلكونات
    canopies: false,      // مظلات
    showerBox: false,     // شاور بوكس
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleServiceToggle = (key) => {
    setServices((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getSelectedServicesList = () => {
    const list = [];
    if (services.honorStairs) list.push('درج شرفي');
    if (services.serviceStairs) list.push('درج خدمي');
    if (services.balconies) list.push('بلكونات');
    if (services.canopies) list.push('مظلات');
    if (services.showerBox) list.push('شاور بوكس');
    return list;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.custName.trim()) newErrors.custName = true;
    if (!formData.custPhone1.trim()) newErrors.custPhone1 = true;
    if (!formData.custAddress.trim()) newErrors.custAddress = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const selectedServices = getSelectedServicesList();

    // Format Arabic WhatsApp message
    let messageText = `✨ *طلب حجز موعد رفع مقاسات جديد* ✨\n`;
    messageText += `━━━━━━━━━━━━━━━━━\n`;
    messageText += `👤 *الاسم:* ${formData.custName.trim()}\n`;
    messageText += `📱 *الموبايل:* ${formData.custPhone1.trim()}\n`;
    if (formData.custPhone2.trim()) {
      messageText += `📱 *موبايل إضافي:* ${formData.custPhone2.trim()}\n`;
    }
    messageText += `📍 *العنوان:* ${formData.custAddress.trim()}\n`;
    
    messageText += `\n🛠️ *الخدمات المطلوبة:*\n`;
    if (selectedServices.length > 0) {
      selectedServices.forEach((srv) => {
        messageText += ` • ${srv}\n`;
      });
    } else {
      messageText += ` • لم يتم تحديد خدمة محددة\n`;
    }

    if (formData.notes.trim()) {
      messageText += `\n📝 *ملاحظات:* ${formData.notes.trim()}\n`;
    }

    messageText += `\n⏰ *التاريخ:* ${new Date().toLocaleString('ar-KW', { dateStyle: 'short', timeStyle: 'short' })}\n`;
    messageText += `━━━━━━━━━━━━━━━━━\n`;
    messageText += `*شركة التل الدولية للتجارة العامة*`;

    // Confetti celebration effect
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#25d366', '#144d82', '#000000', '#c29d47']
      });
    } catch {
      // ignore
    }

    // Save submission locally
    const submissionRecord = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      formattedTime: new Date().toLocaleString('ar-EG'),
      name: formData.custName.trim(),
      phone1: formData.custPhone1.trim(),
      phone2: formData.custPhone2.trim(),
      address: formData.custAddress.trim(),
      services: selectedServices,
      notes: formData.notes.trim(),
      rawMessage: messageText
    };

    const existingHistory = JSON.parse(localStorage.getItem('altall_submissions') || '[]');
    existingHistory.unshift(submissionRecord);
    localStorage.setItem('altall_submissions', JSON.stringify(existingHistory.slice(0, 100)));

    // Send in background via TextMeBot WhatsApp API
    const encodedMessage = encodeURIComponent(messageText);
    const textMeBotUrl = `https://api.textmebot.com/send.php?recipient=+${TARGET_WHATSAPP_NUMBER}&apikey=${TEXTMEBOT_API_KEY}&text=${encodedMessage}`;
    
    try {
      fetch(textMeBotUrl, { mode: 'no-cors' }).catch(() => {});
      const img = new Image();
      img.src = textMeBotUrl;
    } catch {
      // ignore
    }

    setIsSubmitting(false);

    // Trigger modal for user WhatsApp action
    if (onFormSubmitSuccess) {
      onFormSubmitSuccess({
        record: submissionRecord,
        messageText,
      });
    }
  };

  return (
    <div className="flyer-page-wrapper">
      <div className="flyer-container">
        
        {/* Top Header matching exact screenshot */}
        <header className="flyer-header">
          <div className="flyer-header-row">
            {/* Official Spiral Logo on LEFT (first in RTL = left side) */}
            <div className="flyer-logo-holder">
              <img 
                src="/altal_logo_clean.png" 
                alt="شركة التل الدولية - ALTAL ALDAWLYA CO." 
                className="flyer-official-logo"
              />
            </div>

            {/* Arabic Company Name on RIGHT */}
            <div className="flyer-company-text">
              <h1 className="flyer-title-ar">شـركـة الـــتـــل الـــدولـــيــة</h1>
              <h2 className="flyer-subtitle-ar">للتجارة العامة</h2>
            </div>
          </div>

          {/* Title Banner */}
          <div className="flyer-title-banner">
            <h2 className="flyer-banner-heading">حجز موعد رفع مقاسات</h2>
          </div>
        </header>

        {/* Form Body */}
        <form id="altalBookingForm" className="flyer-form-body" onSubmit={handleSubmit} noValidate>
          
          {/* Section: Customer Info (بيانات العميل -:) */}
          <div className="flyer-section-block">
            <div className="flyer-section-header">
              <h3 className="flyer-section-title">بيانات العميل -:</h3>
            </div>

            {/* Row 1: Name (الإسم) */}
            <div className="flyer-field-row">
              <div className="flyer-input-pill-wrapper">
                <input 
                  type="text" 
                  id="custName" 
                  name="custName" 
                  className={`flyer-pill-input ${errors.custName ? 'has-error' : ''}`}
                  placeholder="اكتب الإسم بالكامل" 
                  value={formData.custName}
                  onChange={handleInputChange}
                  required 
                  autoComplete="name"
                />
              </div>
              <label htmlFor="custName" className="flyer-field-label">الإسم</label>
            </div>

            {/* Row 2: Mobile (الموبايل) - Two pills side by side */}
            <div className="flyer-field-row">
              <div className="flyer-phone-dual-wrapper">
                <input 
                  type="tel" 
                  id="custPhone1" 
                  name="custPhone1" 
                  className={`flyer-pill-input phone-input ${errors.custPhone1 ? 'has-error' : ''}`}
                  placeholder="رقم الموبايل الأساسي" 
                  value={formData.custPhone1}
                  onChange={handleInputChange}
                  required 
                  autoComplete="tel"
                  dir="rtl"
                />
                <input 
                  type="tel" 
                  id="custPhone2" 
                  name="custPhone2" 
                  className="flyer-pill-input phone-input"
                  placeholder="موبايل آخر (اختياري)" 
                  value={formData.custPhone2}
                  onChange={handleInputChange}
                  autoComplete="tel"
                  dir="rtl"
                />
              </div>
              <label htmlFor="custPhone1" className="flyer-field-label">الموبايل</label>
            </div>

            {/* Row 3: Address (العنوان) */}
            <div className="flyer-field-row align-top">
              <div className="flyer-address-wrapper">
                <textarea 
                  id="custAddress" 
                  name="custAddress" 
                  className={`flyer-address-input ${errors.custAddress ? 'has-error' : ''}`}
                  placeholder="المنطقة - القطعة - الشارع - رقم المنزل..." 
                  value={formData.custAddress}
                  onChange={handleInputChange}
                  rows="2"
                  required 
                  autoComplete="street-address"
                />
              </div>
              <label htmlFor="custAddress" className="flyer-field-label">العنوان</label>
            </div>
          </div>

          {/* Section: Requested Services (الخدمات المطلوبة) */}
          <div className="flyer-services-block">
            <h3 className="flyer-services-title">الخدمات المطلوبة</h3>

            {/* Row 1: 4 Services (درج شرفي, درج خدمي, بلكونات, مظلات) */}
            <div className="flyer-services-row-top">
              
              <label className={`flyer-checkbox-item ${services.honorStairs ? 'is-selected' : ''}`} htmlFor="srv-honor">
                <input 
                  type="checkbox" 
                  id="srv-honor" 
                  checked={services.honorStairs}
                  onChange={() => handleServiceToggle('honorStairs')}
                />
                <span className="flyer-square-check">
                  {services.honorStairs && <Check size={18} strokeWidth={3.5} />}
                </span>
                <span className="flyer-check-text">درج شرفي</span>
              </label>

              <label className={`flyer-checkbox-item ${services.serviceStairs ? 'is-selected' : ''}`} htmlFor="srv-service">
                <input 
                  type="checkbox" 
                  id="srv-service" 
                  checked={services.serviceStairs}
                  onChange={() => handleServiceToggle('serviceStairs')}
                />
                <span className="flyer-square-check">
                  {services.serviceStairs && <Check size={18} strokeWidth={3.5} />}
                </span>
                <span className="flyer-check-text">درج خدمي</span>
              </label>

              <label className={`flyer-checkbox-item ${services.balconies ? 'is-selected' : ''}`} htmlFor="srv-balconies">
                <input 
                  type="checkbox" 
                  id="srv-balconies" 
                  checked={services.balconies}
                  onChange={() => handleServiceToggle('balconies')}
                />
                <span className="flyer-square-check">
                  {services.balconies && <Check size={18} strokeWidth={3.5} />}
                </span>
                <span className="flyer-check-text">بلكونات</span>
              </label>

              <label className={`flyer-checkbox-item ${services.canopies ? 'is-selected' : ''}`} htmlFor="srv-canopies">
                <input 
                  type="checkbox" 
                  id="srv-canopies" 
                  checked={services.canopies}
                  onChange={() => handleServiceToggle('canopies')}
                />
                <span className="flyer-square-check">
                  {services.canopies && <Check size={18} strokeWidth={3.5} />}
                </span>
                <span className="flyer-check-text">مظلات</span>
              </label>

            </div>

            {/* Row 2: 1 Service Centered (شاور بوكس) */}
            <div className="flyer-services-row-bottom">
              <label className={`flyer-checkbox-item ${services.showerBox ? 'is-selected' : ''}`} htmlFor="srv-shower">
                <input 
                  type="checkbox" 
                  id="srv-shower" 
                  checked={services.showerBox}
                  onChange={() => handleServiceToggle('showerBox')}
                />
                <span className="flyer-square-check">
                  {services.showerBox && <Check size={18} strokeWidth={3.5} />}
                </span>
                <span className="flyer-check-text">شاور بوكس</span>
              </label>
            </div>

            {/* Optional Notes */}
            <div className="flyer-notes-wrap">
              <input
                type="text"
                id="notes"
                name="notes"
                className="flyer-notes-input"
                placeholder="ملاحظات أو مواصفات خاصة (اختياري)..."
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>

          </div>

          {/* WhatsApp Submit Button */}
          <div className="flyer-submit-area">
            <button 
              type="submit" 
              id="submitBtn" 
              className="flyer-whatsapp-btn"
              disabled={isSubmitting}
            >
              <Send size={20} className="flyer-btn-icon" />
              <span>{isSubmitting ? 'جاري تجهيز الطلب...' : 'إرسال طلب حجز المقاسات'}</span>
            </button>
          </div>

        </form>

        {/* Footer Contact Floating Card matching screenshot */}
        <footer className="flyer-footer-card">
          <div className="flyer-footer-address">
            حولي - شارع تونس - مجمع الرحاب - الدور الاول - مكتب ٣
          </div>
          <div className="flyer-footer-phones" dir="ltr">
            <a href="tel:51503952" className="flyer-tel-link">51503952</a>
            <span className="flyer-tel-divider">-</span>
            <a href="tel:90008278" className="flyer-tel-link">90008278</a>
          </div>
        </footer>

      </div>
    </div>
  );
}
