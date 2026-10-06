import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function NotificationPoller() {
  const { user } = useAuth();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Only poll if user is logged in
    if (!user) return;

    const checkNotifications = async () => {
      try {
        const res = await api.get('/notifications/unread');
        if (res.data.success && res.data.notifications.length > 0) {
          // Show the most recent unread notification
          const latest = res.data.notifications[0];
          setToast(latest);
        } else {
          setToast(null);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    // Check immediately, then every 10 seconds
    checkNotifications();
    const intervalId = setInterval(checkNotifications, 10000);

    return () => clearInterval(intervalId);
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setToast(null); // Close the toast after marking read
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (!toast) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      background: 'var(--card)',
      border: '1px solid var(--border)',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      padding: '24px 28px',
      borderRadius: '12px',
      zIndex: 9999,
      width: '400px',
      maxWidth: '90vw',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ color: 'var(--primary)', fontSize: '18px' }}>🔔 {toast.title}</strong>
        <button 
          onClick={() => setToast(null)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--text-muted)' }}
        >
          ×
        </button>
      </div>
      <p style={{ margin: 0, fontSize: '15px', color: 'var(--text)', lineHeight: 1.5 }}>
        {toast.message}
      </p>
      <button 
        onClick={() => markAsRead(toast.id)}
        className="btn btn-primary" 
        style={{ padding: '8px 16px', fontSize: '14px', marginTop: '8px', alignSelf: 'flex-start' }}
      >
        Mark as Read
      </button>
    </div>
  );
}
