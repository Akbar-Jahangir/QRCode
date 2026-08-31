import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  QrCode, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Camera, 
  Sparkles 
} from 'lucide-react';

export default function QrGenerator({ onToast }) {
  const [targetUrl, setTargetUrl] = useState('');
  const [qrSize, setQrSize] = useState(260);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Current application URL for the form
    const currentUrl = window.location.href.split('#')[0].split('?')[0];
    setTargetUrl(currentUrl);
  }, []);

  const handleCopyUrl = () => {
    if (!targetUrl) return;
    navigator.clipboard.writeText(targetUrl).then(() => {
      setCopied(true);
      if (onToast) onToast('تم نسخ رابط الاستمارة بنجاح', 'success');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadQrCode = () => {
    const svgElement = document.getElementById('qrCodeSvg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // High resolution export
    const scaleFactor = 3;
    canvas.width = qrSize * scaleFactor;
    canvas.height = qrSize * scaleFactor;

    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'AlTall-Booking-Form-QR.png';
      downloadLink.href = pngFile;
      downloadLink.click();
      if (onToast) onToast('تم تنزيل رمز الباركود بصيغة PNG عالية الدقة', 'success');
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const printQrCard = () => {
    window.print();
  };

  return (
    <div className="tool-card view-container">
      <div className="tool-header">
        <div className="tool-icon-wrap">
          <QrCode size={28} />
        </div>
        <div>
          <h2 className="tool-title">إنشاء وطباعة باركود الاستمارة (QR Code)</h2>
          <p className="tool-subtitle">قم بإنشاء وطباعة رمز الاستجابة السريعة لمشاركته مع العملاء أو وضعه على الإعلانات والبروشورات</p>
        </div>
      </div>

      <div className="qr-gen-layout">
        {/* Printable Card Preview */}
        <div className="qr-preview-side">
          <div className="qr-card-print" id="printableQrCard">
            <div className="qr-print-header">
              <img src="/logo.svg" alt="Al Tall Logo" className="qr-logo" />
              <div className="qr-print-title">شركة التل الدولية للتجارة العامة</div>
              <div className="qr-print-subtitle">امسح الباركود لحجز موعد رفع مقاسات</div>
            </div>

            {/* Rendered QR Box */}
            <div className="qr-code-canvas-wrap">
              <QRCodeSVG
                id="qrCodeSvg"
                value={targetUrl || 'https://altall.com'}
                size={qrSize}
                level="H"
                includeMargin={true}
                imageSettings={{
                  src: '/logo.svg',
                  x: undefined,
                  y: undefined,
                  height: 36,
                  width: 36,
                  excavate: true,
                }}
              />
            </div>

            <div className="qr-print-footer">
              <div className="qr-scan-instruction">
                <Camera size={16} />
                <span>وجّه كاميرا هاتفك لمسح الرمز والبدء فوراً</span>
              </div>
              <div className="qr-phone-number">خدمة العملاء: 90008278 - 51503952</div>
            </div>
          </div>

          <div className="qr-actions-row">
            <button className="btn btn-primary" onClick={downloadQrCode}>
              <Download size={18} />
              <span>تحميل صورة الباركود (PNG)</span>
            </button>
            <button className="btn btn-secondary" onClick={printQrCard}>
              <Printer size={18} />
              <span>طباعة بطاقة الباركود</span>
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="qr-controls-side">
          <div className="control-group">
            <label className="control-label">رابط الاستمارة المشفر داخل الباركود:</label>
            <div className="input-with-copy">
              <input 
                type="text" 
                className="form-input" 
                dir="ltr" 
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
              />
              <button 
                type="button" 
                className="copy-btn" 
                onClick={handleCopyUrl} 
                title="نسخ الرابط"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            <small className="control-help">يمكنك تغيير الرابط إذا كنت تود توجيه الباركود لرابط استضافة مخصص.</small>
          </div>

          <div className="control-group">
            <label className="control-label">حجم الباركود (بيكسل):</label>
            <select 
              className="form-input" 
              value={qrSize}
              onChange={(e) => setQrSize(Number(e.target.value))}
            >
              <option value={200}>صغير (200x200)</option>
              <option value={260}>متوسط (260x260) - موصى به</option>
              <option value={320}>كبير (320x320)</option>
              <option value={400}>عالي الدقة للطباعة (400x400)</option>
            </select>
          </div>

          <div className="qr-features-box">
            <h4><Sparkles size={18} /> مميزات نظام الباركود:</h4>
            <ul>
              <li>يعمل مباشرة وتلقائياً مع كاميرا جميع الهواتف (iPhone & Android).</li>
              <li>يفتح استمارة حجز المقاسات في ثوانٍ معدودة دون الحاجة لتطبيق خاص.</li>
              <li>يمكن طباعته كملصق أو بطاقة مكتبية في المعرض والمكتب.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
