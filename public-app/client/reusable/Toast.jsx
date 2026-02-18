import React, { useState, useEffect } from 'react';

const TOAST_EVENT = 'show-toast';

export function showPopup(type, message) {
  const msg = typeof message === 'object' && message?.errors ? message.errors : String(message || '');
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { type, message: msg } }));
}

export default function Toast() {
  const [toast, setToast] = useState({ visible: false, type: '', message: '' });

  useEffect(() => {
    const handler = (e) => {
      setToast({ visible: true, type: e.detail.type, message: e.detail.message });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 4000);
    };
    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, []);

  if (!toast.visible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-[9999] px-4 py-3 rounded-lg shadow-lg text-white ${
        toast.type === 'success'
          ? 'bg-green-600'
          : toast.type === 'error'
          ? 'bg-red-600'
          : toast.type === 'warning'
          ? 'bg-amber-600'
          : 'bg-gray-800'
      }`}
      role="alert"
    >
      {toast.message}
    </div>
  );
}
