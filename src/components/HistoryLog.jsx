import React, { useState, useEffect } from 'react';
import { 
  History, 
  FileSpreadsheet, 
  Trash2, 
  MessageCircle, 
  Phone 
} from 'lucide-react';

export default function HistoryLog({ onToast }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const records = JSON.parse(localStorage.getItem('altall_submissions') || '[]');
      setHistory(records);
    } catch {
      setHistory([]);
    }
  };

  const clearHistory = () => {
    if (window.confirm('هل أنت متأكد من مسح جميع الطلبات المحفوظة؟')) {
      localStorage.removeItem('altall_submissions');
      setHistory([]);
      if (onToast) onToast('تم مسح السجل بنجاح', 'success');
    }
  };

  const exportCsv = () => {
    if (history.length === 0) {
      if (onToast) onToast('لا توجد بيانات لتصديرها', 'error');
      return;
    }

    const headers = ['التاريخ', 'اسم العميل', 'الموبايل 1', 'الموبايل 2', 'العنوان', 'الخدمات المطلوبة', 'ملاحظات'];
    const rows = history.map((item) => [
      item.formattedTime || item.timestamp,
      `"${(item.name || '').replace(/"/g, '""')}"`,
      `"${(item.phone1 || '').replace(/"/g, '""')}"`,
      `"${(item.phone2 || '').replace(/"/g, '""')}"`,
      `"${(item.address || '').replace(/"/g, '""')}"`,
      `"${(item.services || []).join(' - ').replace(/"/g, '""')}"`,
      `"${(item.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `altall_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();

    if (onToast) onToast('تم تصدير ملف CSV / Excel بنجاح', 'success');
  };

  const resendWhatsApp = (item) => {
    const text = item.rawMessage || `طلب من: ${item.name} - هاتف: ${item.phone1}`;
    const url = `https://wa.me/923431982051?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="tool-card view-container">
      <div className="tool-header">
        <div className="tool-icon-wrap">
          <History size={28} />
        </div>
        <div>
          <h2 className="tool-title">سجل الطلبات المحفوظة</h2>
          <p className="tool-subtitle">نسخة احتياطية من جميع طلبات حجز المقاسات التي تم إرسالها</p>
        </div>
      </div>

      <div className="history-actions-bar">
        <div className="badge-count">
          {history.length} {history.length === 1 ? 'طلب محفوظ' : 'طلبات محفوظة'}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-sm btn-outline" onClick={exportCsv}>
            <FileSpreadsheet size={16} />
            <span>تصدير إلى Excel / CSV</span>
          </button>
          <button className="btn btn-sm btn-danger" onClick={clearHistory}>
            <Trash2 size={16} />
            <span>مسح السجل</span>
          </button>
        </div>
      </div>

      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>#</th>
              <th>التاريخ والوقت</th>
              <th>اسم العميل</th>
              <th>الهاتف</th>
              <th>العنوان</th>
              <th>الخدمات المطلوبة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  لا توجد طلبات محفوظة حتى الآن
                </td>
              </tr>
            ) : (
              history.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{index + 1}</td>
                  <td style={{ fontSize: '0.85rem' }}>{item.formattedTime || item.timestamp}</td>
                  <td style={{ fontWeight: '700' }}>{item.name}</td>
                  <td dir="ltr" style={{ fontWeight: '600' }}>{item.phone1}</td>
                  <td>{item.address}</td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {(item.services || []).map((s, i) => (
                        <span key={i} className="service-tag">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary" 
                      onClick={() => resendWhatsApp(item)}
                      title="إعادة الإرسال عبر الواتساب"
                    >
                      <MessageCircle size={14} />
                      <span>واتساب</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
