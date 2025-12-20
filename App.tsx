import React, { useState } from 'react';
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
import { danhSachUserMau } from './services/mockData';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  // Giả lập user đang đăng nhập (Lấy user đầu tiên trong danh sách - là ORG_ADMIN của toChucHienTai)
  const currentUser = danhSachUserMau[0];

  // Simple Auth Logic
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // Handle Routing
  const handleNavigate = (page: string) => {
      setActivePage(page);
      setIsCreatingCampaign(false);
      setSelectedCampaignId(null);
  };

  // Route: Campaign Create Wizard
  if (activePage === 'campaigns' && isCreatingCampaign) {
      return (
          <Layout activePage={activePage} onNavigate={handleNavigate} onLogout={() => setIsLoggedIn(false)} currentUser={currentUser}>
              <CampaignCreate onBack={() => setIsCreatingCampaign(false)} />
          </Layout>
      );
  }

  // Route: Campaign Detail View
  if (activePage === 'campaigns' && selectedCampaignId) {
      return (
           <Layout activePage={activePage} onNavigate={handleNavigate} onLogout={() => setIsLoggedIn(false)} currentUser={currentUser}>
              <CampaignDetail 
                  campaignId={selectedCampaignId} 
                  onBack={() => setSelectedCampaignId(null)} 
              />
          </Layout>
      );
  }

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'leads':
        return <Leads />;
      case 'agent':
        return <AgentWorkspace />;
      case 'campaigns':
        return (
            <Campaigns 
                onCreateClick={() => setIsCreatingCampaign(true)} 
                onSelectCampaign={(id) => setSelectedCampaignId(id)}
            />
        );
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings />;
      case 'dev-specs':
        return <BackendSpecs />;
      case 'notifications':
        return <NotificationsPage />;
      default:
        return <div className="p-10 text-center text-slate-500">Trang đang được phát triển...</div>;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={handleNavigate} onLogout={() => setIsLoggedIn(false)} currentUser={currentUser}>
      {renderContent()}
    </Layout>
  );
};

export default App;