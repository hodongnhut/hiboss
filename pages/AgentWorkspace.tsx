import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, User, Clock, CheckCircle, XCircle, Play, Loader2, Headset, Sparkles, History, MessageSquare, ChevronRight, Star, AlertCircle, Calendar, Target, Flag, Zap, TrendingUp, ChevronLeft } from 'lucide-react';
import { danhSachKhachHangMau } from '../services/mockData';
import { KhachHang } from '../types';

const AgentWorkspace = () => {
    const [sessionState, setSessionState] = useState<'IDLE' | 'FETCHING' | 'ACTIVE'>('IDLE');
    const [currentLeadIndex, setCurrentLeadIndex] = useState(0);
    const [callStatus, setCallStatus] = useState<'IDLE' | 'DIALING' | 'CONNECTED' | 'ENDED'>('IDLE');
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [taskTab, setTaskTab] = useState<'TODAY' | '3DAYS' | 'WEEK'>('TODAY');

    const currentLead: KhachHang | undefined = sessionState === 'ACTIVE' ? danhSachKhachHangMau[currentLeadIndex] : undefined;

    useEffect(() => {
        let interval: any;
        if (callStatus === 'CONNECTED') {
            interval = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [callStatus]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const fetchNextLead = () => {
        setSessionState('FETCHING');
        setTimeout(() => {
            setCurrentLeadIndex((prev) => (prev + 1) % danhSachKhachHangMau.length);
            setSessionState('ACTIVE');
            setCallStatus('IDLE');
            setDuration(0);
            setNote('');
            setIsSubmitting(false);
        }, 1200);
    };

    const handleStartSession = () => fetchNextLead();
    const handleCall = () => {
        setCallStatus('DIALING');
        setTimeout(() => setCallStatus('CONNECTED'), 1500);
    };
    const handleHangup = () => setCallStatus('ENDED');

    const handleSubmitDisposition = (result: string) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setTimeout(() => {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            fetchNextLead();
        }, 800);
    };

    if (sessionState === 'IDLE') {
        return (
            <div className="animate-fade-in space-y-8 pb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Trung Tâm Chỉ Huy Sales</h1>
                        <p className="text-slate-500 font-medium text-sm">Chào Sếp! Lộ trình bùng nổ KPI hôm nay đã sẵn sàng.</p>
                    </div>
                    <button
                        onClick={handleStartSession}
                        className="w-full md:w-auto group relative bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs md:text-sm shadow-2xl shadow-blue-500/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4 overflow-hidden"
                    >
                        <Play size={20} fill="currentColor" /> Bắt Đầu Ca Làm Việc
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden transition-all">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                <div className="flex gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl w-full sm:w-auto">
                                    {(['TODAY', '3DAYS', 'WEEK'] as const).map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setTaskTab(tab)}
                                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${taskTab === tab ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}
                                        >
                                            {tab === 'TODAY' ? 'Hôm Nay' : tab === '3DAYS' ? '3 Ngày' : 'Tuần Này'}
                                        </button>
                                    ))}
                                </div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
                                    <Clock size={14} /> LIVE: {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in relative z-10">
                                {taskTab === 'TODAY' && (
                                    <>
                                        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-800/30">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20"><Phone size={20} /></div>
                                                <span className="text-[10px] font-black text-blue-600 uppercase">Tiến độ: 65%</span>
                                            </div>
                                            <h3 className="font-black text-slate-800 dark:text-white uppercase text-xs mb-1">Mục tiêu cuộc gọi</h3>
                                            <p className="text-2xl font-black text-slate-900 dark:text-white">130 <span className="text-sm text-slate-400">/ 200</span></p>
                                            <div className="mt-4 w-full h-2 bg-blue-200/50 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
                                            </div>
                                        </div>
                                        <div className="bg-purple-50/50 dark:bg-purple-900/10 p-6 rounded-[2rem] border border-purple-100 dark:border-purple-800/30">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-500/20"><Target size={20} /></div>
                                                <span className="text-[10px] font-black text-purple-600 uppercase">Tiềm năng</span>
                                            </div>
                                            <h3 className="font-black text-slate-800 dark:text-white uppercase text-xs mb-1">Chốt Hợp Đồng</h3>
                                            <p className="text-2xl font-black text-slate-900 dark:text-white">8 <span className="text-sm text-slate-400">/ 12</span></p>
                                            <div className="mt-4 w-full h-2 bg-purple-200/50 rounded-full overflow-hidden">
                                                <div className="h-full bg-purple-600 rounded-full" style={{ width: '75%' }}></div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {taskTab === '3DAYS' && (
                                    <div className="col-span-full space-y-4">
                                        <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-700 hover:border-blue-400 transition-all cursor-default group">
                                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm transition-colors"><Calendar size={20} /></div>
                                            <div className="flex-1">
                                                <h4 className="font-black text-slate-800 dark:text-white uppercase text-xs">Phát sinh Lead mới từ Chiến dịch T10</h4>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Dự kiến: +450 Leads • Thứ 4, 25/10</p>
                                            </div>
                                            <div className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase">Ưu tiên</div>
                                        </div>
                                        <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-700 hover:border-blue-400 transition-all cursor-default group">
                                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm transition-colors"><Clock size={20} /></div>
                                            <div className="flex-1">
                                                <h4 className="font-black text-slate-800 dark:text-white uppercase text-xs">Follow-up nhóm khách hàng BĐS Hà Nội</h4>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Dự kiến: 120 cuộc gọi • Thứ 5, 26/10</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {taskTab === 'WEEK' && (
                                    <div className="col-span-full">
                                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[3rem] text-white relative overflow-hidden shadow-xl">
                                            <div className="absolute top-0 right-0 p-12 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                                            <div className="relative z-10">
                                                <h3 className="font-black uppercase tracking-widest text-[10px] text-blue-400 mb-4 flex items-center gap-2">
                                                    <Flag size={14} /> Mục Tiêu Lớn Trong Tuần
                                                </h3>
                                                <p className="text-xl font-medium leading-relaxed mb-6">Đạt mốc <span className="text-blue-400 font-black tracking-widest">1,000</span> cuộc gọi kết nối để nhận Bonus <span className="text-green-400 font-black">2,000,000đ</span></p>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                        <span>Tiến trình hiện tại</span>
                                                        <span>645 / 1,000 (64.5%)</span>
                                                    </div>
                                                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5 p-0.5">
                                                        <div className="h-full bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]" style={{ width: '64.5%' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col gap-2 hover:shadow-md transition-shadow">
                                <TrendingUp size={22} className="text-green-500" />
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Tỷ lệ chốt</p>
                                    <p className="text-lg font-black text-slate-800 dark:text-white">12.5%</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col gap-2 hover:shadow-md transition-shadow">
                                <Clock size={22} className="text-orange-500" />
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">T.Lượng TB</p>
                                    <p className="text-lg font-black text-slate-800 dark:text-white">3m 45s</p>
                                </div>
                            </div>
                            <div className="col-span-2 md:col-span-1 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 flex md:flex-col items-center md:items-start gap-4 md:gap-2 hover:shadow-md transition-shadow">
                                <Zap size={22} className="text-blue-500" />
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Leads Đợi</p>
                                    <p className="text-lg font-black text-slate-800 dark:text-white">1,240</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 bg-blue-500/5 rounded-full -mr-12 -mt-12 blur-xl"></div>
                            <div className="relative w-24 h-24 mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-slate-100 dark:text-slate-900" />
                                    <circle cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 0.8)} className="text-blue-600" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-black text-slate-800 dark:text-white leading-none">8</span>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Level</span>
                                </div>
                            </div>
                            <h3 className="font-black text-slate-800 dark:text-white uppercase text-xs mb-1">Senior Agent</h3>
                            <div className="w-full h-1 bg-slate-100 dark:bg-slate-900 rounded-full mt-4 overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full" style={{ width: '80%' }}></div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex-1">
                            <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 italic">
                                <History size={14} /> Hoạt động gần đây
                            </h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex gap-3 items-start group">
                                        <div className="w-1 h-8 bg-green-500 rounded-full group-hover:scale-y-110 transition-transform"></div>
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase truncate">Gói Professional</p>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">090xxxx12{i}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (sessionState === 'FETCHING') {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center text-center px-6">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping"></div>
                    <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl relative rotate-12 transition-all"><Headset size={40} /></div>
                </div>
                <h3 className="text-slate-800 dark:text-white font-black uppercase tracking-widest text-sm">Hệ thống đang điều hướng Lead...</h3>
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest italic">AI đang tối ưu hóa tỉ lệ chốt cho Sếp dựa trên lịch sử</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col xl:flex-row gap-6 h-full relative pb-10">
            {showToast && (
                <div className="fixed top-20 right-4 md:right-10 z-[100] bg-green-600 text-white px-8 py-4 rounded-3xl shadow-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-4 animate-slide-up border border-white/20">
                    <CheckCircle size={20} /> Đã chốt kết quả & Đang lấy Lead mới!
                </div>
            )}

            <div className="flex-1 flex flex-col gap-6 min-w-0">
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] md:rounded-[4rem] shadow-sm border border-slate-200 dark:border-slate-700 p-8 md:p-12 flex flex-col items-center justify-center min-h-[380px] md:min-h-[450px] relative overflow-hidden shrink-0 transition-all">
                    <div className="absolute top-6 left-8 flex items-center gap-3">
                        <button onClick={() => setSessionState('IDLE')} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all text-slate-400 hover:text-red-500" title="Dừng ca">
                            <ChevronLeft size={24} />
                        </button>
                        <span className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-[9px] font-black text-blue-600 uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                            <Sparkles size={14} /> Predictive Mode
                        </span>
                    </div>

                    {callStatus === 'DIALING' && (
                        <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-[4px] z-20 flex flex-col items-center justify-center animate-fade-in">
                            <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/40 animate-pulse ring-8 ring-blue-500/10">
                                <Phone className="text-white" size={40} />
                            </div>
                            <span className="text-xl font-black text-blue-700 uppercase tracking-[0.3em] animate-pulse">Quay số...</span>
                        </div>
                    )}

                    <div className="text-center mb-10 w-full max-w-sm px-4">
                        <div className="w-24 h-24 md:w-28 md:h-28 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] mx-auto mb-6 flex items-center justify-center text-slate-300 border border-slate-100 dark:border-slate-700 shadow-inner">
                            <User size={56} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-2 truncate">{currentLead?.nguoiLienHe}</h2>
                        <p className="text-sm md:text-base text-slate-500 font-bold italic truncate px-4 opacity-80">{currentLead?.tenCongTy}</p>
                        <p className="text-3xl md:text-4xl font-mono mt-6 text-blue-600 font-black tracking-[0.1em]">{currentLead?.soDienThoai}</p>

                        {callStatus === 'CONNECTED' && (
                            <div className="mt-8 px-8 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 rounded-full inline-flex items-center gap-4 font-mono text-xl font-black border border-green-100 dark:border-green-800 shadow-lg scale-110">
                                <span className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></span>
                                {formatTime(duration)}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-8 md:gap-12">
                        {callStatus === 'IDLE' || callStatus === 'ENDED' ? (
                            <button onClick={handleCall} disabled={callStatus === 'ENDED'} className={`w-24 h-24 md:w-28 md:h-28 rounded-[2.5rem] md:rounded-[3rem] flex items-center justify-center shadow-2xl transition-all active:scale-90 ${callStatus === 'ENDED' ? 'bg-slate-100 text-slate-300' : 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/30'}`}>
                                <Phone size={40} fill="currentColor" />
                            </button>
                        ) : (
                            <>
                                <button onClick={() => setIsMuted(!isMuted)} className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all flex items-center justify-center ${isMuted ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-slate-400 border-slate-200 hover:text-blue-600'}`}>
                                    {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
                                </button>
                                <button onClick={handleHangup} className="w-24 h-24 md:w-28 md:h-28 bg-red-500 hover:bg-red-600 text-white rounded-[2.5rem] md:rounded-[3rem] flex items-center justify-center shadow-2xl shadow-red-500/40 transition-all active:scale-90">
                                    <PhoneOff size={40} fill="currentColor" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm border border-slate-200 dark:border-slate-700 p-8 md:p-10 flex-1 overflow-hidden flex flex-col min-h-[280px]">
                    <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-3 uppercase tracking-widest text-[10px] md:text-xs mb-8 shrink-0">
                        <MessageSquare size={20} className="text-blue-600" /> Kịch Bản Thông Minh
                    </h3>
                    <div className="space-y-4 overflow-y-auto custom-scrollbar pr-4 flex-1">
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-[2rem] border border-blue-100/30">
                            <p className="text-[9px] font-black text-blue-600 uppercase mb-2 tracking-[0.2em] italic">Mở đầu:</p>
                            <p className="text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic">"Dạ em chào Sếp {currentLead?.nguoiLienHe}, em là Sale cấp cao từ HISep CRM. Thấy bên mình {currentLead?.tenCongTy} đang hoạt động trong mảng {currentLead?.nganhNghe}, em có giải pháp tối ưu CRM..."</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                            <p className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em] italic">Giá trị:</p>
                            <p className="text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 leading-relaxed">"HISep giúp Sếp quản lý hàng triệu Leads và tự động hóa Telesale 24/7..."</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full xl:w-[450px] flex flex-col gap-6 min-h-0">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2.5rem] md:rounded-[3rem] p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden shrink-0">
                    <h3 className="font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 relative z-10">
                        <Sparkles size={16} /> AI Assistant Insight
                    </h3>
                    <p className="text-xs md:text-sm font-bold leading-relaxed relative z-10 text-blue-100">
                        Khách hàng từ mảng <span className="text-yellow-400 font-black">{currentLead?.nganhNghe}</span> rất quan tâm đến <span className="underline underline-offset-4 decoration-blue-400">Tự động hóa báo cáo</span>. Chốt hạ vào điểm này Sếp nhé!
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] md:rounded-[4.5rem] shadow-sm border border-slate-200 dark:border-slate-700 p-8 md:p-12 flex-1 flex flex-col min-h-[450px] relative">
                    {(callStatus !== 'ENDED' && callStatus !== 'IDLE') && (
                        <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/60 z-[45] backdrop-blur-[2px] flex items-center justify-center rounded-[2.5rem] md:rounded-[4.5rem]">
                            <div className="px-6 py-3 bg-slate-900/90 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl">
                                <AlertCircle size={18} className="text-yellow-400 animate-pulse" /> Đang nghe máy...
                            </div>
                        </div>
                    )}

                    {isSubmitting && (
                        <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/90 z-[50] backdrop-blur-md flex flex-col items-center justify-center rounded-[2.5rem] md:rounded-[4.5rem]">
                            <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
                            <span className="font-black text-[10px] uppercase tracking-widest text-slate-500">Đang lưu kết quả...</span>
                        </div>
                    )}

                    <h3 className="font-black text-[10px] uppercase tracking-widest mb-6 text-slate-400 flex items-center gap-2 shrink-0">
                        <CheckCircle size={18} /> Chốt Kết Quả
                    </h3>

                    <textarea
                        className={`flex-1 w-full border border-slate-100 dark:border-slate-700 rounded-[2rem] p-8 text-sm md:text-base outline-none resize-none mb-8 bg-slate-50 dark:bg-slate-900 font-medium focus:ring-8 focus:ring-blue-500/5 transition-all ${isSubmitting ? 'opacity-30' : ''}`}
                        placeholder="Ghi chú nhanh thông tin khách hàng tại đây (như giá đề xuất, yêu cầu riêng...)"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        disabled={isSubmitting}
                    ></textarea>

                    <div className="grid grid-cols-2 gap-4 shrink-0">
                        <button
                            onClick={() => handleSubmitDisposition('WON')}
                            disabled={isSubmitting}
                            className="p-6 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-[2rem] border border-green-100 dark:border-green-800 hover:bg-green-100 hover:scale-[1.02] transition-all flex flex-col items-center gap-2 active:scale-95 group shadow-sm"
                        >
                            <CheckCircle size={28} />
                            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Quan Tâm</span>
                        </button>
                        <button
                            onClick={() => handleSubmitDisposition('CALLBACK')}
                            disabled={isSubmitting}
                            className="p-6 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-[2rem] border border-yellow-100 dark:border-yellow-800 hover:bg-yellow-100 hover:scale-[1.02] transition-all flex flex-col items-center gap-2 active:scale-95 group shadow-sm"
                        >
                            <Clock size={28} />
                            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Hẹn Lại</span>
                        </button>
                        <button
                            onClick={() => handleSubmitDisposition('LOST')}
                            disabled={isSubmitting}
                            className="p-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-[2rem] border border-red-100 dark:border-red-800 hover:bg-red-100 hover:scale-[1.02] transition-all flex flex-col items-center gap-2 active:scale-95 group shadow-sm"
                        >
                            <XCircle size={28} />
                            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Từ Chối</span>
                        </button>
                        <button
                            onClick={() => handleSubmitDisposition('MISSED')}
                            disabled={isSubmitting}
                            className="p-6 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 rounded-[2rem] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 hover:scale-[1.02] transition-all flex flex-col items-center gap-2 active:scale-95 group shadow-sm"
                        >
                            <PhoneOff size={28} />
                            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Không Nghe</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentWorkspace;