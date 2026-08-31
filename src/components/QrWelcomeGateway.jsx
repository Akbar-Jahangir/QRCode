import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  QrCode, 
  ArrowLeft, 
  ScanLine, 
  Download, 
  Share2, 
  Check, 
  Sparkles, 
  Phone, 
  MapPin 
} from 'lucide-react';

export default function QrWelcomeGateway({ onOpenForm, onOpenScanner, onToast }) {
  const [formUrl, setFormUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // URL with explicit form parameter
    const baseUrl = window.location.href.split('?')[0].split('#')[0];
    setFormUrl(`${baseUrl}?view=form`);
  }, []);

  const handleCopyLink = () => {
    if (!formUrl) return;
    navigator.clipboard.writeText(formUrl).then(() => {
      setCopied(true);
      if (onToast) onToast('تم نسخ رابط الاستمارة بنجاح', 'success');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadQr = () => {
    const svg = document.getElementById('gatewayQrSvg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 800;
    canvas.height = 800;

    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const link = document.createElement('a');
      link.download = 'AlTall-Booking-QR.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      if (onToast) onToast('تم تنزيل رمز QR بنجاح', 'success');
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="gateway-container view-container">
      <div className="gateway-card">
        
        {/* Header Badge */}
        <div className="gateway-header">
          <div className="gateway-logo-wrap">
            <img src="/logo.svg" alt="Al Tall Logo" className="gateway-logo" />
          </div>
          <h1 className="gateway-title">شركة التل الدولية للتجارة العامة</h1>
          <p className="gateway-subtitle">امسح رمز الباركود (QR Code) أو انتقل مباشرة لتعبئة الاستمارة</p>
        </div>

        {/* Big Interactive QR Code Card */}
        <div className="gateway-qr-badge" onClick={onOpenForm} title="اضغط لفتح الاستمارة مباشرة">
          <div className="qr-interactive-frame">
            <div className="scan-corners">
              <span className="corner top-left"></span>
              <span className="corner top-right"></span>
              <span className="corner bottom-left"></span>
              <span className="corner bottom-right"></span>
            </div>

            <QRCodeSVG
              id="gatewayQrSvg"
              value={formUrl || window.location.href}
              size={240}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: '/logo.svg',
                x: undefined,
                y: undefined,
                height: 42,
                width: 42,
                excavate: true,
              }}
            />
            
            <div className="qr-tap-hint">
              <Sparkles size={16} />
              <span>اضغط هنا أو على الزر أدناه لفتح الاستمارة</span>
            </div>
          </div>
        </div>

        {/* Primary Call to Action Button */}
        <div className="gateway-actions">
          <button className="btn-gateway-primary" onClick={onOpenForm}>
            <span className="btn-main-text">الانتقال إلى استمارة حجز المقاسات</span>
            <span className="btn-sub-arrow">
              <ArrowLeft size={20} />
            </span>
          </button>

          <div className="gateway-secondary-row">
            <button className="btn btn-secondary flex-1" onClick={onOpenScanner}>
              <ScanLine size={18} />
              <span>مسح باركود بالكاميرا</span>
            </button>
            <button className="btn btn-outline flex-1" onClick={handleCopyLink}>
              {copied ? <Check size={18} /> : <Share2 size={18} />}
              <span>{copied ? 'تم النسخ' : 'مشاركة الرابط'}</span>
            </button>
            <button className="btn btn-outline" onClick={handleDownloadQr} title="تنزيل الباركود">
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Quick Contact Footer */}
        <div className="gateway-footer">
          <div className="gf-item">
            <MapPin size={16} />
            <span>حولي - شارع تونس - مجمع الرحاب - الدور 1 - مكتب 3</span>
          </div>
          <div className="gf-item gf-phone" dir="ltr">
            <Phone size={16} />
            <a href="tel:90008278">90008278</a>
            <span>-</span>
            <a href="tel:51503952">51503952</a>
          </div>
        </div>

      </div>
    </div>
  );
}
