import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import AgentWorkspace from './pages/AgentWorkspace';
import Campaigns from './pages/Campaigns';
import CampaignCreate from './pages/CampaignCreate';
import CampaignDetail from './pages/CampaignDetail';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Login from './pages/Login';
import BackendSpecs from './components/BackendSpecs';
import NotificationsPage from './pages/Notifications';
import { NguoiDung } from './types';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<NguoiDung | null>(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user_info');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        setIsLoggedIn(true);
      } catch (e) {
        handleLogout();
      }
    } else {
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
    setIsInitializing(false);
  };

  // Kiểm tra session khi khởi động
  useEffect(() => {
    checkAuth();

    // Lắng nghe sự thay đổi của localStorage từ các tab khác
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'user_info') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLoginSuccess = () => {
    checkAuth();
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActivePage('dashboard');
  };

  const handleNavigate = (page: string) => {
    setActivePage(page);
    setIsCreatingCampaign(false);
    setSelectedCampaignId(null);
  };

  if (isInitializing) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  if (activePage === 'campaigns' && isCreatingCampaign) {
    return (
      <Layout activePage={activePage} onNavigate={handleNavigate} onLogout={handleLogout} currentUser={currentUser || undefined}>
        <CampaignCreate onBack={() => setIsCreatingCampaign(false)} />
      </Layout>
    );
  }

  if (activePage === 'campaigns' && selectedCampaignId) {
    return (
      <Layout activePage={activePage} onNavigate={handleNavigate} onLogout={handleLogout} currentUser={currentUser || undefined}>
        <CampaignDetail
          campaignId={selectedCampaignId}
          onBack={() => setSelectedCampaignId(null)}
        />
      </Layout>
    );
  }

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'leads': return <Leads />;
      case 'agent': return <AgentWorkspace />;
      case 'campaigns': return <Campaigns onCreateClick={() => setIsCreatingCampaign(true)} onSelectCampaign={(id) => setSelectedCampaignId(id)} />;
      case 'users': return <Users />;
      case 'settings': return <Settings />;
      case 'dev-specs': return <BackendSpecs />;
      case 'notifications': return <NotificationsPage />;
      default: return <div className="p-10 text-center text-slate-500">Trang đang phát triển...</div>;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={handleNavigate} onLogout={handleLogout} currentUser={currentUser || undefined}>
      {renderContent()}
    </Layout>
  );
};

export default App;