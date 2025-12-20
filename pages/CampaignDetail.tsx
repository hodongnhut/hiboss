import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Mail, Eye, MousePointer, Layers, Terminal, MessageSquare, Check, Smartphone, Send } from 'lucide-react';
import { logsEmailMau, logsZaloMau, logsSmsMau, danhSachChienDichMau } from '../services/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { KenhMarketing } from '../types';

interface CampaignDetailProps {
    campaignId: string;
    onBack: () => void;
}

const CampaignDetail: React.FC<CampaignDetailProps> = ({ campaignId, onBack }) => {
    // Tìm chiến dịch (Mock)
    const campaign = danhSachChienDichMau.find(c => c.id === campaignId) || danhSachChienDichMau[0];
    const channelType = campaign.kenh[0]; // Giả sử hiển thị channel đầu tiên cho demo

    // State mô phỏng Real-time
    const [isRunning, setIsRunning] = useState(campaign.trangThai === 'DANG_CHAY');
    const [queueStats, setQueueStats] = useState({
        waiting: 850,
        active: 5,
        completed: 645,
        failed: 12
    });
    
    // Stats chung cho các kênh: sent (gửi), step2 (delivered/opened), step3 (clicked/seen)
    const [channelStats, setChannelStats] = useState({ step1: 645, step2: 210, step3: 45 });
    
    // Logs theo kênh
    const getInitialLogs = () => {
        if (channelType === KenhMarketing.ZALO) return logsZaloMau;
        if (channelType === KenhMarketing.SMS) return logsSmsMau;
        return logsEmailMau;
    };
    const [logs, setLogs] = useState(getInitialLogs());

    // Hiệu ứng chạy giả lập (Automation Simulation)
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (isRunning) {
            interval = setInterval(() => {
                // 1. Giảm Waiting, Tăng Completed
                setQueueStats(prev => {
                    if (prev.waiting <= 0) return prev;
                    return {
                        ...prev,
                        waiting: prev.waiting - 1,
                        active: Math.floor(Math.random() * 5) + 3,
                        completed: prev.completed + 1
                    };
                });

                // 2. Cập nhật Stats
                setChannelStats(prev => ({
                    step1: prev.step1 + 1,
                    step2: Math.random() > 0.6 ? prev.step2 + 1 : prev.step2,
                    step3: Math.random() > 0.9 ? prev.step3 + 1 : prev.step3
                }));

                // 3. Thêm Log mới dựa trên loại kênh
                let newLog;
                const time = new Date().toLocaleTimeString('vi-VN');
                
                if (channelType === KenhMarketing.ZALO) {
                    newLog = {
                        time,
                        type: Math.random() > 0.8 ? 'WARN' : (Math.random() > 0.5 ? 'SUCCESS' : 'INFO'),
                        msg: Math.random() > 0.8 
                            ? `ZNS: Gửi thất bại user ${Math.floor(Math.random()*1000)} (User chặn OA).` 
                            : (Math.random() > 0.5 ? `Webhook: User ${Math.floor(Math.random()*1000)} ĐÃ XEM tin nhắn.` : `Zalo API: Gửi thành công ID ${Math.floor(Math.random()*10000)}`)
                    };
                } else if (channelType === KenhMarketing.SMS) {
                     newLog = {
                        time,
                        type: Math.random() > 0.9 ? 'WARN' : 'INFO',
                        msg: Math.random() > 0.9 
                            ? `SMS: Lỗi gateway nhà mạng Mobifone.` 
                            : `Telco: Gửi tin Brandname thành công tới 09${Math.floor(Math.random()*10000000)}`
                    };
                } else {
                     newLog = {
                        time,
                        type: Math.random() > 0.9 ? 'WARN' : 'INFO',
                        msg: Math.random() > 0.9 
                            ? `Email: Bounced (Địa chỉ không tồn tại).` 
                            : `Webhook: Email delivered.`
                    };
                }

                setLogs(prevLogs => [newLog, ...prevLogs].slice(0, 20));

            }, 800); // Tốc độ chạy
        }

        return () => clearInterval(interval);
    }, [isRunning, channelType]);

    // Data biểu đồ
    const chartData = [
        { name: '10:00', sent: 100, step2: 20 },
        { name: '10:15', sent: 300, step2: 80 },
        { name: '10:30', sent: 500, step2: 150 },
        { name: '10:45', sent: channelStats.step1, step2: channelStats.step2 },
    ];

    // Cấu hình hiển thị theo kênh (Theme & Labels)
    const getChannelConfig = () => {
        switch (channelType) {
            case KenhMarketing.ZALO:
                return {
                    icon: <span className="font-bold text-xl">Z</span>,
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-100',
                    chartColor1: '#2563eb', // Blue
                    chartColor2: '#60a5fa',
                    title: 'Hiệu Quả Zalo ZNS',
                    step1Label: 'Đã gửi ZNS',
                    step2Label: 'Đã nhận',
                    step3Label: 'Đã xem (Seen)',
                    step1Icon: <Send size={24} />,
                    step2Icon: <Check size={24} />,
                    step3Icon: <Eye size={24} />,
                };
            case KenhMarketing.SMS:
                return {
                    icon: <MessageSquare size={24} />,
                    color: 'text-orange-600',
                    bgColor: 'bg-orange-100',
                    chartColor1: '#ea580c', // Orange
                    chartColor2: '#fdba74',
                    title: 'Hiệu Quả SMS Brandname',
                    step1Label: 'Đã gửi Gateway',
                    step2Label: 'Telco nhận',
                    step3Label: 'Khách nhận (Est)',
                    step1Icon: <Send size={24} />,
                    step2Icon: <Smartphone size={24} />,
                    step3Icon: <Check size={24} />,
                };
            default: // Email
                return {
                    icon: <Mail size={24} />,
                    color: 'text-purple-600',
                    bgColor: 'bg-purple-100',
                    chartColor1: '#8884d8', // Purple
                    chartColor2: '#82ca9d',
                    title: 'Hiệu Quả Email Marketing',
                    step1Label: 'Đã gửi',
                    step2Label: 'Đã mở (Opened)',
                    step3Label: 'Đã click Link',
                    step1Icon: <Mail size={24} />,
                    step2Icon: <Eye size={24} />,
                    step3Icon: <MousePointer size={24} />,
                };
        }
    };

    const config = getChannelConfig();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-slate-800 dark:text-white">{campaign.tenChienDich}</h1>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isRunning ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {isRunning ? 'RUNNING' : 'PAUSED'}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">ID: {campaign.id} • Kênh: {campaign.kenh.join(', ')}</p>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsRunning(!isRunning)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white transition-colors ${isRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {isRunning ? <><Pause size={18} /> Tạm Dừng</> : <><Play size={18} /> Tiếp Tục</>}
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 border rounded-lg">
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Queue & Funnel */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Queue Monitor (BullMQ Visualization) */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <Layers size={18} className="text-blue-600" />
                            Trạng Thái Hàng Đợi (Queue Monitor)
                        </h3>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg text-center border-b-4 border-slate-300">
                                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Waiting</p>
                                <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">{queueStats.waiting}</p>
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center border-b-4 border-blue-500 animate-pulse">
                                <p className="text-xs text-blue-600 uppercase font-bold mb-1">Active</p>
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{queueStats.active}</p>
                            </div>
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center border-b-4 border-green-500">
                                <p className="text-xs text-green-600 uppercase font-bold mb-1">Completed</p>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{queueStats.completed}</p>
                            </div>
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center border-b-4 border-red-500">
                                <p className="text-xs text-red-600 uppercase font-bold mb-1">Failed</p>
                                <p className="text-2xl font-bold text-red-700 dark:text-red-300">{queueStats.failed}</p>
                            </div>
                        </div>
                    </div>

                    {/* Channel Funnel & Chart */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                         <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                            <div className={config.color}>{config.icon}</div>
                            {config.title} (Real-time)
                        </h3>
                        
                        <div className="flex justify-between items-center mb-8 px-4">
                            <div className="text-center">
                                <div className={`w-12 h-12 ${config.bgColor} ${config.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                                    {config.step1Icon}
                                </div>
                                <p className="text-2xl font-bold">{channelStats.step1}</p>
                                <p className="text-xs text-slate-500">{config.step1Label}</p>
                            </div>
                            <div className="flex-1 h-1 bg-slate-100 mx-4 relative">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">
                                    {((channelStats.step2 / (channelStats.step1 || 1)) * 100).toFixed(1)}%
                                </div>
                            </div>
                            <div className="text-center">
                                <div className={`w-12 h-12 ${config.bgColor} ${config.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                                    {config.step2Icon}
                                </div>
                                <p className="text-2xl font-bold">{channelStats.step2}</p>
                                <p className="text-xs text-slate-500">{config.step2Label}</p>
                            </div>
                            <div className="flex-1 h-1 bg-slate-100 mx-4 relative">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">
                                    {((channelStats.step3 / (channelStats.step2 || 1)) * 100).toFixed(1)}%
                                </div>
                            </div>
                            <div className="text-center">
                                <div className={`w-12 h-12 ${config.bgColor} ${config.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                                    {config.step3Icon}
                                </div>
                                <p className="text-2xl font-bold">{channelStats.step3}</p>
                                <p className="text-xs text-slate-500">{config.step3Label}</p>
                            </div>
                        </div>

                        <div className="h-[250px] w-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={config.chartColor1} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor={config.chartColor1} stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorStep2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={config.chartColor2} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor={config.chartColor2} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="sent" stroke={config.chartColor1} fillOpacity={1} fill="url(#colorSent)" />
                                <Area type="monotone" dataKey="step2" stroke={config.chartColor2} fillOpacity={1} fill="url(#colorStep2)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Column: Live Logs */}
                <div className="bg-slate-900 text-slate-300 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col h-[600px]">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-700 pb-4">
                        <Terminal size={18} className="text-green-500" />
                        System Live Logs
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-3 font-mono text-xs pr-2 custom-scrollbar">
                        {logs.map((log, idx) => (
                            <div key={idx} className="flex gap-3">
                                <span className="text-slate-500 shrink-0">[{log.time}]</span>
                                <div className="flex-1 break-words">
                                    <span className={`font-bold mr-2 ${
                                        log.type === 'INFO' ? 'text-blue-400' : 
                                        log.type === 'WARN' ? 'text-yellow-400' : 
                                        'text-green-400'
                                    }`}>
                                        {log.type}:
                                    </span>
                                    {log.msg}
                                </div>
                            </div>
                        ))}
                        {isRunning && (
                             <div className="flex gap-2 items-center text-slate-500 animate-pulse mt-2">
                                <span className="w-2 h-4 bg-green-500 block"></span>
                                <span>_worker_process executing...</span>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignDetail;