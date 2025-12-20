import React from 'react';
import { Plus, Play, Pause, MoreVertical, Phone, Mail, MessageSquare } from 'lucide-react';
import { danhSachChienDichMau } from '../services/mockData';
import { KenhMarketing } from '../types';

interface CampaignsProps {
    onCreateClick?: () => void;
    onSelectCampaign?: (id: string) => void;
}

const Campaigns: React.FC<CampaignsProps> = ({ onCreateClick, onSelectCampaign }) => {
  const getChannelIcon = (channel: KenhMarketing) => {
    switch (channel) {
      case KenhMarketing.CALL: return <Phone size={14} />;
      case KenhMarketing.EMAIL: return <Mail size={14} />;
      case KenhMarketing.ZALO: return <span className="text-[10px] font-bold">Z</span>;
      default: return <MessageSquare size={14} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Chiến Dịch Marketing</h1>
        <button 
            onClick={onCreateClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          Tạo Chiến Dịch Mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {danhSachChienDichMau.map((cd) => (
          <div 
            key={cd.id} 
            onClick={() => onSelectCampaign?.(cd.id)}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-2">
                {cd.kenh.map((k) => (
                  <div key={k} className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    {getChannelIcon(k)}
                  </div>
                ))}
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreVertical size={18} />
              </button>
            </div>
            
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">{cd.tenChienDich}</h3>
            
            <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
              <span>{cd.soLuongLead.toLocaleString()} Leads</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cd.trangThai === 'DANG_CHAY' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                {cd.trangThai === 'DANG_CHAY' ? 'Đang Chạy' : 'Hoàn Thành'}
              </span>
            </div>

            <div className="space-y-2">
               <div className="flex justify-between text-xs font-medium text-slate-600">
                 <span>Tiến độ</span>
                 <span>{cd.tienDo}%</span>
               </div>
               <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-600 rounded-full" style={{ width: `${cd.tienDo}%` }}></div>
               </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                 <div className="text-xs text-slate-400">
                    Ngân sách: {cd.nganSachDuKien.toLocaleString()} đ
                 </div>
                 {cd.trangThai === 'DANG_CHAY' ? (
                     <button className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100">
                         <Pause size={18} />
                     </button>
                 ) : (
                    <button className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100">
                        <Play size={18} />
                    </button>
                 )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;
