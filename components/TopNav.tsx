import React, { useState, useRef, useEffect } from 'react';
import { Menu, Calendar, Bell, ChevronDown, User as UserIcon, LogOut, X, Check, ShoppingBag, AlertTriangle, Info } from 'lucide-react';
import { User } from '../types';

interface TopNavProps {
  title: string;
  onMenuClick: () => void;
  user: User | null;
  isGuest: boolean;
  onLogout: () => void;
}

// Mock Notifications Data
const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'order', message: 'Pesanan baru #ORD-009 masuk', time: '2 menit lalu', read: false },
  { id: 2, type: 'stock', message: 'Stok "Keripik Pisang" menipis (Sisa 5)', time: '1 jam lalu', read: false },
  { id: 3, type: 'system', message: 'Backup sistem otomatis berhasil', time: '3 jam lalu', read: true },
];

const TopNav: React.FC<TopNavProps> = ({ title, onMenuClick, user, isGuest, onLogout }) => {
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Refs for click-outside detection
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotifIcon = (type: string) => {
    switch(type) {
      case 'order': return <ShoppingBag size={14} className="text-blue-600" />;
      case 'stock': return <AlertTriangle size={14} className="text-orange-600" />;
      default: return <Info size={14} className="text-slate-600" />;
    }
  };

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full text-sm text-slate-600 border border-slate-200">
          <Calendar size={14} className="text-slate-400" />
          <span>{today}</span>
        </div>

        {!isGuest && (
          <div className="relative" ref={notifMenuRef}>
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`relative p-2 transition-colors rounded-full ${isNotifOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-sm text-slate-800">Notifikasi</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Check size={12} /> Tandai dibaca
                    </button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors relative group ${notif.read ? 'opacity-70' : 'bg-blue-50/30'}`}
                      >
                        <div className="flex gap-3">
                          <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            notif.type === 'order' ? 'bg-blue-100' : 
                            notif.type === 'stock' ? 'bg-orange-100' : 'bg-slate-100'
                          }`}>
                            {getNotifIcon(notif.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-slate-800 leading-snug">{notif.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                          </div>
                          <button 
                            onClick={(e) => deleteNotification(notif.id, e)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      <Bell size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-xs">Tidak ada notifikasi baru</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Profile Dropdown */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 relative" ref={userMenuRef}>
          <button 
            onClick={() => setIsUserOpen(!isUserOpen)}
            className={`flex items-center gap-3 cursor-pointer p-1.5 rounded-xl transition-all ${isUserOpen ? 'bg-slate-100 ring-2 ring-slate-200' : 'hover:bg-slate-50'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center 
              ${isGuest ? 'bg-slate-200 text-slate-500' : 'bg-blue-100 text-blue-600'}
            `}>
              <UserIcon size={18} />
            </div>
            <div className="hidden md:block text-sm text-right">
              <p className="font-medium text-slate-700 leading-none mb-1">{user?.name || 'Tamu'}</p>
              {!isGuest && <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{user?.role}</p>}
            </div>
            <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isUserOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* User Dropdown Menu */}
          {isUserOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              
              {/* Mobile Info View (visible inside dropdown only on small screens) */}
              <div className="md:hidden p-4 border-b border-slate-100 bg-slate-50">
                <p className="font-bold text-slate-800">{user?.name || 'Tamu'}</p>
                <p className="text-xs text-slate-500">{user?.role || 'Guest Mode'}</p>
              </div>

              <div className="p-1.5">
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                    <LogOut size={16} />
                  </div>
                  Keluar Aplikasi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNav;