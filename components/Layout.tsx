import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Users, Phone, Megaphone, Settings, Database, Code, Menu, X, Bell, LogOut, Check, Info, AlertTriangle, XCircle, CheckCircle, Building2, Sparkles, ChevronRight } from 'lucide-react';
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
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

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

  // Đóng thông báo khi click ra ngoài
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
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900 overflow-hidden">
      {/* Sidebar Desktop - Smart Collapsible */}
      <aside
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className={`hidden md:flex flex-col bg-slate-900 text-white border-r border-slate-700 shrink-0 transition-all duration-300 ease-in-out z-[60] ${isSidebarHovered ? 'w-64' : 'w-20'
          }`}
      >
        {/* Logo Section */}
        <div className="p-5 border-b border-slate-700 h-16 flex items-center overflow-hidden">
          <div className="flex items-center gap-3 min-w-max">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shrink-0">
              H
            </div>
            <div className={`transition-all duration-300 ${isSidebarHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
              <span className="text-lg font-black tracking-tighter whitespace-nowrap">ChàoSếp. CRM</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar overflow-x-hidden">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center rounded-2xl transition-all duration-200 group relative ${isSidebarHovered ? 'px-4 py-3' : 'justify-center p-3'
                      } ${isActive
                        ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                  >
                    <div className={`shrink-0 transition-transform duration-200 ${!isSidebarHovered && isActive ? 'scale-110' : ''}`}>
                      {item.icon}
                    </div>

                    <span className={`ml-3 text-sm font-bold whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarHovered ? 'max-w-[150px] opacity-100' : 'max-w-0 opacity-0'
                      }`}>
                      {item.label}
                    </span>

                    {/* Tooltip khi Sidebar đang thu nhỏ */}
                    {!isSidebarHovered && (
                      <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-slate-700">
                        {item.label}
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-700 bg-slate-900/50">
          <div className={`flex items-center gap-3 mb-4 overflow-hidden transition-all duration-300 ${isSidebarHovered ? 'px-2' : 'justify-center'}`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shrink-0 transition-transform duration-300 ${!isSidebarHovered ? 'scale-90' : ''}`}>
              {user.hoTen?.charAt(0)}
            </div>
            <div className={`transition-all duration-300 min-w-0 ${isSidebarHovered ? 'opacity-100 w-full' : 'opacity-0 w-0'}`}>
              <p className="text-xs font-black truncate text-white uppercase tracking-tight">{user.hoTen}</p>
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest truncate">{user.vaiTro}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className={`w-full flex items-center transition-all duration-300 rounded-xl bg-slate-800 hover:bg-red-600/20 text-slate-400 hover:text-red-500 font-black uppercase text-[10px] tracking-widest ${isSidebarHovered ? 'px-4 py-3 justify-start gap-3' : 'p-3 justify-center'
              }`}
          >
            <LogOut size={18} />
            <span className={`transition-opacity duration-300 whitespace-nowrap ${isSidebarHovered ? 'opacity-100' : 'opacity-0 hidden'}`}>
              Đăng xuất
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b dark:border-slate-700 flex items-center justify-between px-4 md:px-6 shadow-sm z-40 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-600 dark:text-slate-300 md:hidden hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="text-blue-500 hidden sm:block" size={20} />
              <span className="font-black text-lg text-slate-800 dark:text-white uppercase tracking-tighter">CRM Automation</span>
            </div>
          </div>

          <div className="hidden lg:block">
            <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
              {menuItems.find(m => m.id === activePage)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex h-9 px-4 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl text-[10px] font-black items-center border border-blue-100 dark:border-blue-800/30 uppercase tracking-widest">
              SỐ DƯ: 5,000,000 đ
            </div>

            {/* Notification Bell Component */}
            <div className="relative" ref={notiRef}>
              <button
                onClick={handleNotificationClick}
                className={`relative p-2.5 transition-all rounded-xl ${isNotiOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center border-2 border-white dark:border-slate-800 font-black shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {isNotiOpen && (
                <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-[100] animate-slide-up origin-top-right">
                  <div className="flex justify-between items-center p-5 border-b dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                    <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">Thông báo mới</h3>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-[10px] font-black text-blue-600 uppercase hover:underline">Đánh dấu đã đọc</button>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map((noti) => (
                        <div key={noti.id} className={`p-5 border-b dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${!noti.daXem ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                          <div className="flex gap-4">
                            <div className="shrink-0 mt-1">{getNotiIcon(noti.loai)}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-black text-slate-800 dark:text-white line-clamp-1 uppercase tracking-tight leading-none mb-1">{noti.tieuDe}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">{noti.noiDung}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">{timeAgo(noti.thoiGian)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">Không có thông báo mới</div>
                    )}
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t dark:border-slate-700 text-center">
                    <button
                      onClick={() => { onNavigate('notifications'); setIsNotiOpen(false); }}
                      className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-600"
                    >
                      Xem tất cả thông báo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-900/50 custom-scrollbar relative">
          <div className="mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-slate-900 shadow-2xl flex flex-col animate-slide-right overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg">H</div>
                <span className="text-xl font-black text-white tracking-tighter uppercase">ChàoSếp.</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
              <ul className="space-y-2 px-4">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onNavigate(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-black text-sm tracking-tight ${activePage === item.id
                        ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 uppercase'
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

            <div className="mt-auto p-6 bg-slate-800/50 border-t border-slate-800 shrink-0">
              <div className="flex items-center gap-3 mb-6 p-4 bg-slate-900/50 rounded-3xl border border-slate-700/50">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-xl">
                  {user.hoTen?.charAt(0)}
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="text-sm font-black text-white truncate uppercase tracking-tight leading-none mb-1">{user.hoTen}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black truncate">{user.vaiTro}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  onLogout?.();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full h-14 flex items-center justify-center gap-3 rounded-2xl bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-[0.2em] border border-red-600/20"
              >
                <LogOut size={18} />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;