import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Scan, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  Phone, 
  MapPin 
} from 'lucide-react';
import BookingForm from './components/BookingForm';
import SuccessModal from './components/SuccessModal';

export default function App() {
  // State: 'qr' (first only QR code) or 'form' (after scanning/clicking QR)
  const [currentScreen, setCurrentScreen] = useState('qr');
  const [modalData, setModalData] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    // Generate target URL for QR code that directly opens the form
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const directFormUrl = `${origin}${pathname}?scan=true`;
    setQrUrl(directFormUrl);

    // Check if user came directly from scanning the QR code (?scan=true or ?view=form)
    const params = new URLSearchParams(window.location.search);
    if (params.get('scan') === 'true' || params.get('view') === 'form') {
      setCurrentScreen('form');
    }
  }, []);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleFormSuccess = (data) => {
    setModalData(data);
    addToast('تم تجهيز طلب الحجز وفتح الواتساب!', 'success');
  };

  const openFormDirectly = () => {
    // Update URL parameter without reload
    window.history.pushState({}, '', '?scan=true');
    setCurrentScreen('form');
  };

  const backToQr = () => {
    window.history.pushState({}, '', window.location.pathname);
    setCurrentScreen('qr');
  };

  return (
    <div className="simple-app-wrapper">
      
      {/* ================= STAGE 1: ONLY QR CODE INITIALLY ================= */}
      {currentScreen === 'qr' && (
        <div className="qr-landing-screen">
          <div className="qr-card-container">
            
            {/* Header */}
            <div className="qr-card-header">
              <div className="qr-logo-frame">
                <img src="/altal_logo_clean.png" alt="Al Tall Logo" className="qr-card-logo" />
              </div>
              <h1 className="qr-company-name">شركة التل الدولية للتجارة العامة</h1>
              <div className="qr-badge-pill">
                <Sparkles size={16} />
                <span>حجز موعد رفع مقاسات</span>
              </div>
            </div>

            {/* QR Code Frame */}
            <div className="qr-code-interactive-card" onClick={openFormDirectly} title="اضغط لفتح الاستمارة">
              <div className="scan-target-corners">
                <span className="corner-bracket top-left"></span>
                <span className="corner-bracket top-right"></span>
                <span className="corner-bracket bottom-left"></span>
                <span className="corner-bracket bottom-right"></span>
              </div>

              <div className="qr-svg-holder">
                <QRCodeSVG
                  value={qrUrl || `${window.location.href}?scan=true`}
                  size={260}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: '/altal_logo_clean.png',
                    x: undefined,
                    y: undefined,
                    height: 48,
                    width: 48,
                    excavate: true,
                  }}
                />
              </div>

              <div className="scan-instruction-box">
                <Scan size={18} className="scan-anim-icon" />
                <p>امسح رمز QR بكاميرا الهاتف لفتح الاستمارة</p>
              </div>
            </div>


            {/* Footer */}
            <div className="qr-card-footer">
              <div className="footer-contact-row">
                <MapPin size={15} />
                <span>حولي - مجمع الرحاب - الدور 1 - مكتب 3</span>
              </div>
              <div className="footer-contact-row" dir="ltr">
                <Phone size={15} />
                <span>90008278 - 51503952</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= STAGE 2: THE FORM (AFTER SCANNING QR) ================= */}
      {currentScreen === 'form' && (
        <div className="form-active-screen">
          {/* Main Booking Form - no top bar, opens directly after QR scan */}
          <BookingForm 
            onFormSubmitSuccess={handleFormSuccess}
            onNavigate={(screen) => setCurrentScreen(screen === 'qr-generator' ? 'qr' : screen)}
          />
        </div>
      )}

      {/* WhatsApp Redirect / Confirmation Modal */}
      {modalData && (
        <SuccessModal 
          modalData={modalData}
          onClose={() => setModalData(null)}
        />
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}
          >
            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
