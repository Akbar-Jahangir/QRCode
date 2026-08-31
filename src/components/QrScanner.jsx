import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  ScanLine, 
  Video, 
  VideoOff, 
  ImagePlus, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export default function QrScanner({ onScanSuccess, onNavigate }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup camera on unmount
      if (html5QrCodeRef.current && isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, [isScanning]);

  const handleScanSuccess = (decodedText) => {
    setScanResult(decodedText);
    stopScanner();

    if (onScanSuccess) {
      onScanSuccess(decodedText);
    }
  };

  const startScanner = async () => {
    setErrorMsg('');
    setScanResult('');
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader');
      }

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        handleScanSuccess,
        () => {
          // ignore scan frame errors
        }
      );
      setIsScanning(true);
    } catch (err) {
      console.error('Camera start error:', err);
      setErrorMsg('تعذر الوصول إلى الكاميرا. يرجى التأكد من إعطاء إذن الكاميرا أو استخدام ميزة رفع صورة الباركود.');
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Camera stop error:', err);
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setScanResult('');

    try {
      const html5QrCode = new Html5Qrcode('qr-reader-temp');
      const result = await html5QrCode.scanFile(file, true);
      handleScanSuccess(result);
    } catch {
      setErrorMsg('لم يتم العثور على باركود صالح في الصورة المحددة. يرجى تجربة صورة أوضح.');
    }
  };

  const handleOpenLink = () => {
    if (scanResult.startsWith('http')) {
      window.location.href = scanResult;
    } else {
      onNavigate('form');
    }
  };

  return (
    <div className="tool-card view-container">
      <div className="tool-header">
        <div className="tool-icon-wrap">
          <ScanLine size={28} />
        </div>
        <div>
          <h2 className="tool-title">مسح باركود / QR Code</h2>
          <p className="tool-subtitle">استخدم كاميرا جهازك أو ارفع صورة باركود لفتح نموذج الحجز مباشرة</p>
        </div>
      </div>

      <div className="scanner-container">
        {/* Scanner Viewport */}
        <div className="scanner-viewport-wrapper">
          <div id="qr-reader" className="camera-reader-box"></div>
          <div id="qr-reader-temp" style={{ display: 'none' }}></div>
          
          <div className="scanner-controls-bar">
            {!isScanning ? (
              <button className="btn btn-primary" onClick={startScanner}>
                <Video size={18} />
                <span>تشغيل الكاميرا للمسح</span>
              </button>
            ) : (
              <button className="btn btn-outline" onClick={stopScanner}>
                <VideoOff size={18} />
                <span>إيقاف الكاميرا</span>
              </button>
            )}
          </div>
        </div>

        {errorMsg && (
          <div style={{ color: '#dc2626', background: '#fee2e2', padding: '0.75rem', borderRadius: '10px', marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
            {errorMsg}
          </div>
        )}

        {/* Alternative: Image File Upload */}
        <div className="scanner-alternative">
          <div className="divider-text">أو مسح من ملف صورة</div>
          <label className="file-upload-dropzone" htmlFor="qrFileInput">
            <ImagePlus size={32} className="upload-icon" />
            <span>اضغط لاختيار صورة باركود من جهازك</span>
            <input 
              type="file" 
              id="qrFileInput" 
              accept="image/*" 
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Result Card */}
        {scanResult && (
          <div className="scan-result-card">
            <div className="result-icon-success">
              <CheckCircle2 size={28} />
            </div>
            <div className="result-details">
              <h4>تم مسح الباركود بنجاح!</h4>
              <p className="scanned-link" dir="ltr">{scanResult}</p>
              <div className="result-actions">
                <button className="btn btn-primary" onClick={handleOpenLink}>
                  <ExternalLink size={18} />
                  <span>فتح نموذج الحجز الآن</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
