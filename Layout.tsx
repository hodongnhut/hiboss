import React, { useState } from 'react';
import { LayoutDashboard, Users, Phone, Megaphone, Settings, Database, Code, Menu, X, Bell, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Tổng Quan', icon: <LayoutDashboard size={20} /> },
    { id: 'leads', label: 'Dữ Liệu Khách', icon: <Database size={20} /> },
    { id: 'agent', label: 'Agent Workspace', icon: <Phone size={20} /> },
    { id: 'campaigns', label: 'Chiến Dịch', icon: <Megaphone size={20} /> },
    { id: 'users', label: 'Quản Lý User', icon: <Users size={20} /> },
    { id: 'settings', label: 'Cấu Hình', icon: <Settings size={20} /> },
    { id: 'dev-specs', label: 'Backend Specs', icon: <Code size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white border-r border-slate-700">
        <div className="p-6 border-b border-slate-700 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">H</div>
          <span className="text-xl font-bold tracking-tight">ChàoSếp CRM</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activePage === item.id
                      ? 'bg-blue-600 text-white font-medium'
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
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
              <span className="font-bold">AD</span>
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-slate-400">admin@hisep.vn</p>
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
            <span className="font-bold text-lg text-slate-800 dark:text-white">HISep</span>
          </div>

          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              {menuItems.find(m => m.id === activePage)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:text-blue-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
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
              <span className="text-xl font-bold">HISep CRM</span>
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
