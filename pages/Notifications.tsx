import React, { useState } from 'react';
import { Bell, Check, CheckCircle, Info, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { danhSachThongBaoMau } from '../services/mockData';
import { ThongBao } from '../types';

const NotificationsPage = () => {
    // Sử dụng mock data, thực tế sẽ lấy từ API hoặc Global State
    const [notifications, setNotifications] = useState<ThongBao[]>(danhSachThongBaoMau);
    const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

    const handleMarkAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, daXem: true } : n));
    };

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, daXem: true })));
    };

    const handleDelete = (id: string) => {
        // Optional: Chức năng xóa thông báo
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle size={24} className="text-green-500" />;
            case 'WARNING': return <AlertTriangle size={24} className="text-orange-500" />;
            case 'ERROR': return <XCircle size={24} className="text-red-500" />;
            default: return <Info size={24} className="text-blue-500" />;
        }
    };

    const filteredList = filter === 'ALL' 
        ? notifications 
        : notifications.filter(n => !n.daXem);

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                         <Bell size={24} />
                    </div>
                    Trung Tâm Thông Báo
                </h1>
                <div className="flex gap-3">
                    <button 
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors shadow-sm"
                    >
                        <Check size={16} />
                        Đánh dấu đã đọc tất cả
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-700">
                    <button 
                        onClick={() => setFilter('ALL')}
                        className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${filter === 'ALL' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Tất cả
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{notifications.length}</span>
                    </button>
                    <button 
                        onClick={() => setFilter('UNREAD')}
                        className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${filter === 'UNREAD' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Chưa đọc
                        {notifications.filter(n => !n.daXem).length > 0 && (
                            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                                {notifications.filter(n => !n.daXem).length}
                            </span>
                        )}
                    </button>
                </div>

                {/* List */}
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredList.length > 0 ? filteredList.map((noti) => (
                        <div 
                            key={noti.id} 
                            className={`p-6 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group ${!noti.daXem ? 'bg-blue-50/40' : ''}`}
                            onClick={() => handleMarkAsRead(noti.id)}
                        >
                            <div className="mt-1 shrink-0 p-3 bg-slate-50 dark:bg-slate-700 rounded-full h-fit">
                                {getIcon(noti.loai)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-semibold text-base ${!noti.daXem ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                        {noti.tieuDe}
                                    </h3>
                                    <span className="text-xs text-slate-400 whitespace-nowrap ml-2 flex items-center gap-1">
                                        <Clock size={12} />
                                        {new Date(noti.thoiGian).toLocaleString('vi-VN')}
                                    </span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
                                    {noti.noiDung}
                                </p>
                                
                                <div className="flex items-center gap-4">
                                    {!noti.daXem ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                            MỚI
                                        </span>
                                    ) : (
                                        <span className="text-xs text-slate-400 font-medium">Đã xem</span>
                                    )}
                                    
                                    {/* Actions on hover (Optional) */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDelete(noti.id); }}
                                            className="text-xs text-red-500 hover:underline"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-16 text-center text-slate-500 flex flex-col items-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
                                <Bell size={40} />
                            </div>
                            <h3 className="font-bold text-lg text-slate-700">Không có thông báo nào</h3>
                            <p className="text-sm">Bạn đã đọc hết tất cả các thông báo.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;