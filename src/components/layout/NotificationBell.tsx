'use client';

import React, { useState, useEffect } from 'react';
import { CarePlusStore } from '@/lib/store';
import { AppNotification } from '@/lib/types';
import { Bell, FileText, CalendarCheck, Pill, CheckCheck } from 'lucide-react';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const loadNotifications = () => {
    const user = CarePlusStore.getCurrentUser();
    if (user) {
      const notifs = CarePlusStore.getNotifications(user.id);
      setNotifications(notifs);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 3000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = () => {
    const user = CarePlusStore.getCurrentUser();
    if (user) {
      CarePlusStore.markNotificationsAsRead(user.id);
      loadNotifications();
    }
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'report':
        return <FileText className="w-4 h-4 text-sky-500" />;
      case 'appointment':
        return <CalendarCheck className="w-4 h-4 text-teal-500" />;
      case 'prescription':
        return <Pill className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="relative z-50">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) handleMarkRead();
        }}
        className="relative p-2 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-all"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden py-2">
          <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <span>Notifications</span>
              {unreadCount === 0 && <span className="text-xs text-slate-400 font-normal">(All read)</span>}
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkRead}
                className="text-xs text-teal-600 font-semibold hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No notifications right now.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors ${
                    !notif.isRead ? 'bg-teal-50/40' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 mt-0.5">{getIcon(notif.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <h5 className="font-semibold text-slate-800 text-xs">{notif.title}</h5>
                      <span className="text-[10px] text-slate-400">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs leading-snug">{notif.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
