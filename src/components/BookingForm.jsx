import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  PhoneCall, 
  MapPin, 
  Calendar, 
  Check, 
  MessageCircle, 
  Send 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TARGET_WHATSAPP_NUMBER = '923431982051'; // Owner's WhatsApp number: +923431982051
const TEXTMEBOT_API_KEY = 'XkQfa6axBECn'; // TextMeBot API Key

export default function BookingForm({ onFormSubmitSuccess, onNavigate }) {
  const [formData, setFormData] = useState({
    custName: '',
    custPhone1: '',
    custPhone2: '',
    custAddress: '',
    appointmentDate: '',
    notes: '',
  });

  const [services, setServices] = useState({
    indoorStairs: true,    // درج داخلي (checked in screenshot)
    outdoorStairs: false,   // درج خارجي
    balconies: false,       // بلكونات
    showerBox: false,       // شاور بوكس
    canopies: false,        // مظلات
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
    if (services.indoorStairs) list.push('درج داخلي');
    if (services.outdoorStairs) list.push('درج خارجي');
    if (services.balconies) list.push('بلكونات');
    if (services.showerBox) list.push('شاور بوكس');
    if (services.canopies) list.push('مظلات');
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
    messageText += `📱 *رقم الموبايل 1:* ${formData.custPhone1.trim()}\n`;
    if (formData.custPhone2.trim()) {
      messageText += `📱 *رقم الموبايل 2:* ${formData.custPhone2.trim()}\n`;
    }
    messageText += `📍 *العنوان:* ${formData.custAddress.trim()}\n`;
    if (formData.appointmentDate) {
      messageText += `📅 *الموعد المفضل:* ${formData.appointmentDate}\n`;
    }
    messageText += `\n🛠️ *الخدمات المطلوبة:*\n`;
    if (selectedServices.length > 0) {
      selectedServices.forEach((srv) => {
        messageText += ` • ${srv}\n`;
      });
    } else {
      messageText += ` • لم يتم تحديد خدمة محددة\n`;
    }

    if (formData.notes.trim()) {
      messageText += `\n📝 *ملاحظات إضافية:* ${formData.notes.trim()}\n`;
    }

    messageText += `\n⏰ *تاريخ الطلب:* ${new Date().toLocaleString('ar-KW', { dateStyle: 'short', timeStyle: 'short' })}\n`;
    messageText += `━━━━━━━━━━━━━━━━━\n`;
    messageText += `*شركة التل الدولية للتجارة العامة*`;

    // Confetti effect
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#25d366', '#144d82', '#c29d47']
      });
    } catch {
      // ignore
    }

    // Save to local history
    const submissionRecord = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      formattedTime: new Date().toLocaleString('ar-EG'),
      name: formData.custName.trim(),
      phone1: formData.custPhone1.trim(),
      phone2: formData.custPhone2.trim(),
      address: formData.custAddress.trim(),
      appointmentDate: formData.appointmentDate,
      services: selectedServices,
      notes: formData.notes.trim(),
      rawMessage: messageText
    };

    const existingHistory = JSON.parse(localStorage.getItem('altall_submissions') || '[]');
    existingHistory.unshift(submissionRecord);
    localStorage.setItem('altall_submissions', JSON.stringify(existingHistory.slice(0, 100)));

    // Send in background via TextMeBot WhatsApp API directly to owner
    const encodedMessage = encodeURIComponent(messageText);
    const textMeBotUrl = `https://api.textmebot.com/send.php?recipient=+${TARGET_WHATSAPP_NUMBER}&apikey=${TEXTMEBOT_API_KEY}&text=${encodedMessage}`;
    
    try {
      fetch(textMeBotUrl, { mode: 'no-cors' }).catch(() => {});
      const img = new Image();
      img.src = textMeBotUrl;
    } catch {
      // ignore background fetch errors
    }

    setIsSubmitting(false);

    // Reset form fields
    setFormData({
      custName: '',
      custPhone1: '',
      custPhone2: '',
      custAddress: '',
      appointmentDate: '',
      notes: '',
    });

    // Trigger modal for user confirmation
    if (onFormSubmitSuccess) {
      onFormSubmitSuccess({
        record: submissionRecord,
        messageText,
      });
    }
  };

  return (
    <div className="form-device-container view-container">
      <div className="form-card">
        
        {/* Header Area matching Screenshot */}
        <header className="form-header">
          <div className="header-content">
            <div className="header-text-block">
              <h1 className="company-title">شركة التل الدولية للتجارة العامة</h1>
              <p className="company-tagline">دقة في التنفيذ • جودة في الأداء</p>
            </div>
            <div className="logo-box">
              <img src="/logo.svg" alt="Al Tall Logo" className="brand-logo" />
            </div>
          </div>
          
          {/* Grey Separator Bar from screenshot */}
          <div className="separator-bar">
            <span className="separator-label">شعار</span>
          </div>
          
          {/* Main Title Banner */}
          <div className="title-banner">
            <h2 className="form-heading">حجز موعد رفع مقاسات</h2>
          </div>
        </header>

        {/* Form Element */}
        <form id="bookingForm" className="booking-form" onSubmit={handleSubmit} noValidate>
          
          {/* Section 1: Customer Details (بيانات العميل) */}
          <div className="form-section">
            <div className="section-title-row">
              <h3 className="section-title">بيانات العميل</h3>
            </div>
            
            {/* Name Input */}
            <div className="field-row">
              <div className="input-wrapper full-width">
                <input 
                  type="text" 
                  id="custName" 
                  name="custName" 
                  className={`form-input ${errors.custName ? 'is-invalid' : ''}`}
                  placeholder=" " 
                  value={formData.custName}
                  onChange={handleInputChange}
                  required 
                  autoComplete="name"
                />
                <label htmlFor="custName" className="floating-label">الإسم الكامل</label>
                <span className="field-icon"><User size={18} /></span>
              </div>
              <div className="field-label-side">الإسم</div>
            </div>

            {/* Phone Inputs (2 side-by-side inputs as in screenshot) */}
            <div className="field-row">
              <div className="phone-dual-grid">
                <div className="input-wrapper">
                  <input 
                    type="tel" 
                    id="custPhone1" 
                    name="custPhone1" 
                    className={`form-input ${errors.custPhone1 ? 'is-invalid' : ''}`}
                    placeholder=" " 
                    value={formData.custPhone1}
                    onChange={handleInputChange}
                    required 
                    autoComplete="tel" 
                    dir="ltr"
                  />
                  <label htmlFor="custPhone1" className="floating-label">رقم الموبايل الأساسي</label>
                  <span className="field-icon"><Phone size={18} /></span>
                </div>
                <div className="input-wrapper">
                  <input 
                    type="tel" 
                    id="custPhone2" 
                    name="custPhone2" 
                    className="form-input" 
                    placeholder=" " 
                    value={formData.custPhone2}
                    onChange={handleInputChange}
                    autoComplete="tel" 
                    dir="ltr"
                  />
                  <label htmlFor="custPhone2" className="floating-label">موبايل إضافي (اختياري)</label>
                  <span className="field-icon"><PhoneCall size={18} /></span>
                </div>
              </div>
              <div className="field-label-side">الموبايل</div>
            </div>

            {/* Address Input */}
            <div className="field-row">
              <div className="input-wrapper full-width">
                <input 
                  type="text" 
                  id="custAddress" 
                  name="custAddress" 
                  className={`form-input ${errors.custAddress ? 'is-invalid' : ''}`}
                  placeholder=" " 
                  value={formData.custAddress}
                  onChange={handleInputChange}
                  required 
                  autoComplete="street-address"
                />
                <label htmlFor="custAddress" className="floating-label">المنطقة - القطعة - الشارع - رقم المنزل</label>
                <span className="field-icon"><MapPin size={18} /></span>
              </div>
              <div className="field-label-side">العنوان</div>
            </div>

            {/* Optional Appointment Date */}
            <div className="field-row">
              <div className="input-wrapper full-width">
                <input 
                  type="date" 
                  id="appointmentDate" 
                  name="appointmentDate" 
                  className="form-input"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                />
                <label htmlFor="appointmentDate" className="floating-label active-static">الموعد المفضل لرفع المقاسات (اختياري)</label>
                <span className="field-icon"><Calendar size={18} /></span>
              </div>
              <div className="field-label-side">الموعد</div>
            </div>
          </div>

          {/* Section 2: Requested Services (الخدمات المطلوبة) */}
          <div className="form-section services-section">
            <div className="section-title-row">
              <h3 className="section-title">الخدمات المطلوبة</h3>
            </div>

            <div className="services-list" id="servicesList">
              
              <label className="service-checkbox-card" htmlFor="srv-indoor-stairs">
                <input 
                  type="checkbox" 
                  id="srv-indoor-stairs" 
                  checked={services.indoorStairs}
                  onChange={() => handleServiceToggle('indoorStairs')}
                />
                <span className="custom-checkbox">
                  {services.indoorStairs && <Check size={18} />}
                </span>
                <span className="service-text">درج داخلي</span>
                <span className="service-tag">Indoor Stairs</span>
              </label>

              <label className="service-checkbox-card" htmlFor="srv-outdoor-stairs">
                <input 
                  type="checkbox" 
                  id="srv-outdoor-stairs" 
                  checked={services.outdoorStairs}
                  onChange={() => handleServiceToggle('outdoorStairs')}
                />
                <span className="custom-checkbox">
                  {services.outdoorStairs && <Check size={18} />}
                </span>
                <span className="service-text">درج خارجي</span>
                <span className="service-tag">Outdoor Stairs</span>
              </label>

              <label className="service-checkbox-card" htmlFor="srv-balconies">
                <input 
                  type="checkbox" 
                  id="srv-balconies" 
                  checked={services.balconies}
                  onChange={() => handleServiceToggle('balconies')}
                />
                <span className="custom-checkbox">
                  {services.balconies && <Check size={18} />}
                </span>
                <span className="service-text">بلكونات</span>
                <span className="service-tag">Balconies / Railings</span>
              </label>

              <label className="service-checkbox-card" htmlFor="srv-shower-box">
                <input 
                  type="checkbox" 
                  id="srv-shower-box" 
                  checked={services.showerBox}
                  onChange={() => handleServiceToggle('showerBox')}
                />
                <span className="custom-checkbox">
                  {services.showerBox && <Check size={18} />}
                </span>
                <span className="service-text">شاور بوكس</span>
                <span className="service-tag">Shower Box</span>
              </label>

              <label className="service-checkbox-card" htmlFor="srv-canopies">
                <input 
                  type="checkbox" 
                  id="srv-canopies" 
                  checked={services.canopies}
                  onChange={() => handleServiceToggle('canopies')}
                />
                <span className="custom-checkbox">
                  {services.canopies && <Check size={18} />}
                </span>
                <span className="service-text">مظلات</span>
                <span className="service-tag">Canopies / Pergolas</span>
              </label>

            </div>

            {/* Notes / Custom Request */}
            <div className="notes-field-wrap">
              <textarea 
                id="notes" 
                name="notes" 
                className="form-textarea" 
                rows="2" 
                placeholder="ملاحظات أو تفاصيل إضافية عن العمل المطلوب..."
                value={formData.notes}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-container">
            <button 
              type="submit" 
              id="submitBtn" 
              className="whatsapp-submit-btn"
              disabled={isSubmitting}
            >
              <span className="btn-icon">
                <Send size={22} />
              </span>
              <span className="btn-text">{isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال طلب حجز المقاسات'}</span>
            </button>
          </div>

        </form>

        {/* Footer Box (Exact replica of screenshot contact box) */}
        <footer className="form-footer-box">
          <div className="footer-inner-card">
            <div className="address-text">
              <MapPin size={20} className="footer-icon" />
              <span>حولي - شارع تونس - مجمع الرحاب - الدور الأول - مكتب 3</span>
            </div>
            <div className="phones-text" dir="ltr">
              <a href="tel:90008278" className="phone-link">90008278</a>
              <span className="phone-sep">-</span>
              <a href="tel:51503952" className="phone-link">51503952</a>
            </div>
          </div>

          {/* Copyright bar */}
          <div className="copyright-bar">
            <p>
              Copyright &copy; Al Tall In. All | {' '}
              <a href="#qr" onClick={(e) => { e.preventDefault(); onNavigate('qr-generator'); }}>QR Code</a> | {' '}
              <a href={`https://wa.me/${TARGET_WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">Contact Us</a>
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}
