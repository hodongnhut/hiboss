import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Users, Phone, Megaphone, Settings, Database, Code, Menu, X, Bell, LogOut, Check, Info, AlertTriangle, XCircle, CheckCircle, Building2 } from 'lucide-react';
import { danhSachThongBaoMau, toChucHienTai, danhSachUserMau } from '../services/mockData';
import { ThongBao, NguoiDung } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
  currentUser?: NguoiDung;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate, onLogout, currentUser }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lấy user mặc định nếu không truyền vào (cho dev)
  const user = currentUser || danhSachUserMau[0];

  // Notification State
  const [notifications, setNotifications] = useState<ThongBao[]>(danhSachThongBaoMau);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const notiRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.daXem).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, daXem: true })));
  };

  const handleNotificationClick = () => {
    setIsNotiOpen(!isNotiOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
        setIsNotiOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return past.toLocaleDateString('vi-VN');
  };

  const getNotiIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle size={16} className="text-green-500" />;
      case 'WARNING': return <AlertTriangle size={16} className="text-orange-500" />;
      case 'ERROR': return <XCircle size={16} className="text-red-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Tổng Quan', icon: <LayoutDashboard size={20} /> },
    { id: 'leads', label: 'Dữ Liệu Khách', icon: <Database size={20} /> },
    { id: 'agent', label: 'Agent Workspace', icon: <Phone size={20} /> },
    { id: 'campaigns', label: 'Chiến Dịch', icon: <Megaphone size={20} /> },
    { id: 'users', label: 'Quản Lý Nhân Sự', icon: <Users size={20} /> },
    { id: 'settings', label: 'Cấu Hình', icon: <Settings size={20} /> },
    { id: 'dev-specs', label: 'Backend Specs', icon: <Code size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white border-r border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">H</div>
            <span className="text-xl font-bold tracking-tight">ChàoSếp. CRM</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Building2 size={12} />
            <span className="truncate">{toChucHienTai.tenToChuc}</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activePage === item.id
                    ? 'bg-blue-600 text-white font-medium shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${user.vaiTro === 'ORG_ADMIN' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'
              }`}>
              {user.username.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.username}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{user.vaiTro}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-2 rounded bg-slate-800 hover:bg-red-900/30 text-slate-300 hover:text-red-400 transition-colors text-sm"
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b dark:border-slate-700 flex items-center justify-between px-4 md:px-6 shadow-sm z-10">
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
            <span className="font-bold text-lg text-slate-800 dark:text-white">ChàoSếp.</span>
          </div>

          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              {menuItems.find(m => m.id === activePage)?.label || (activePage === 'notifications' ? 'Thông báo' : '')}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative" ref={notiRef}>
              <button
                onClick={handleNotificationClick}
                className={`relative p-2 transition-colors rounded-full ${isNotiOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white dark:border-slate-800">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {isNotiOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-fade-in origin-top-right">
                  <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-white">Thông báo</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        <Check size={12} /> Đánh dấu đã đọc
                      </button>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((noti) => (
                        <div
                          key={noti.id}
                          onClick={() => {
                            onNavigate('notifications');
                            setIsNotiOpen(false);
                          }}
                          className={`p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${!noti.daXem ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        >
                          <div className="flex gap-3">
                            <div className={`mt-1 shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700`}>
                              {getNotiIcon(noti.loai)}
                            </div>
                            <div>
                              <h4 className={`text-sm font-semibold mb-1 ${!noti.daXem ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                                {noti.tieuDe}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
                                {noti.noiDung}
                              </p>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {timeAgo(noti.thoiGian)}
                              </span>
                            </div>
                            {!noti.daXem && (
                              <div className="shrink-0">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-500 text-sm">
                        Không có thông báo mới.
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 text-center border-t border-slate-100 dark:border-slate-700">
                    <button
                      onClick={() => {
                        setIsNotiOpen(false);
                        onNavigate('notifications');
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      Xem tất cả thông báo
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center">
              Số dư: 5,000,000 đ
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 relative">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute inset-0 z-50 md:hidden flex">
          <div className="w-64 bg-slate-900 h-full text-white p-4 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold">ChàoSếp. CRM</span>
              <button onClick={() => setIsMobileMenuOpen(false)}><X /></button>
            </div>
            <nav>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onNavigate(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activePage === item.id ? 'bg-blue-600' : 'hover:bg-slate-800'
                        }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
        </div>
      )}
    </div>
  );
};

export default Layout;