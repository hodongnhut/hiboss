import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, User, Clock, CheckCircle, XCircle, Play, Loader2, Headset, BarChart3, FileText } from 'lucide-react';
import { danhSachKhachHangMau } from '../services/mockData';
import { KhachHang } from '../types';

const AgentWorkspace = () => {
  // Trạng thái phiên làm việc: IDLE (Chờ), FETCHING (Đang lấy số), ACTIVE (Đang có lead)
  const [sessionState, setSessionState] = useState<'IDLE' | 'FETCHING' | 'ACTIVE'>('IDLE');
  
  const [currentLeadIndex, setCurrentLeadIndex] = useState(0);
  const [callStatus, setCallStatus] = useState<'IDLE' | 'DIALING' | 'CONNECTED' | 'ENDED'>('IDLE');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [note, setNote] = useState('');

  // Lấy lead hiện tại nếu đang trong phiên
  const currentLead: KhachHang | undefined = sessionState === 'ACTIVE' ? danhSachKhachHangMau[currentLeadIndex] : undefined;

  // Timer cho cuộc gọi
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
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

  // Hàm mô phỏng lấy lead từ Queue (Redis/BullMQ)
  const fetchNextLeadFromQueue = () => {
    setSessionState('FETCHING');
    // Giả lập độ trễ mạng khi gọi API lấy Job
    setTimeout(() => {
        setCurrentLeadIndex((prev) => (prev + 1) % danhSachKhachHangMau.length);
        setSessionState('ACTIVE');
        setCallStatus('IDLE');
        setDuration(0);
        setNote('');
    }, 1500); 
  };

  const handleStartSession = () => {
    // Bắt đầu phiên làm việc
    fetchNextLeadFromQueue();
  };

  const handleCall = () => {
    setCallStatus('DIALING');
    // Giả lập Stringee kết nối
    setTimeout(() => {
        setCallStatus('CONNECTED');
    }, 1500);
  };

  const handleHangup = () => {
    setCallStatus('ENDED');
  };

  const handleSubmitDisposition = () => {
    // Lưu kết quả cuộc gọi và lấy số tiếp theo
    fetchNextLeadFromQueue();
  };

  // --- MÀN HÌNH CHỜ (IDLE STATE) ---
  if (sessionState === 'IDLE') {
      return (
          <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-slate-200 dark:border-slate-700">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Headset size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Xin chào, Agent!</h2>
                  <p className="text-slate-500 mb-8">Bạn đang ở trạng thái chờ. Vui lòng kết nối vào hệ thống để nhận cuộc gọi.</p>
                  
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-8 text-left">
                      <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-500">Chiến dịch ưu tiên:</span>
                          <span className="text-sm font-bold text-green-600">Bán Hàng Tháng 10</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Leads trong hàng chờ:</span>
                          <span className="text-sm font-bold text-slate-800 dark:text-white">1,450</span>
                      </div>
                  </div>

                  <button 
                      onClick={handleStartSession}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105"
                  >
                      <Play size={20} fill="currentColor" />
                      Bắt Đầu Làm Việc
                  </button>
              </div>
          </div>
      );
  }

  // --- MÀN HÌNH ĐANG TẢI LEAD (FETCHING STATE) ---
  if (sessionState === 'FETCHING') {
      return (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
              <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Đang tìm khách hàng tiềm năng tiếp theo...</p>
              <p className="text-xs text-slate-400 mt-2">Đang kết nối Redis Queue...</p>
          </div>
      );
  }

  // --- MÀN HÌNH LÀM VIỆC CHÍNH (ACTIVE STATE) ---
  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Left: Call Control & Script */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Dialer Panel */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
          
          <div className="absolute top-4 left-4 flex gap-2">
             <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">
                Chiến dịch: Bán Hàng T10
             </span>
             <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-xs font-medium text-blue-600">
                Predictive Dialer
             </span>
          </div>

          {callStatus === 'DIALING' && (
             <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Phone className="text-blue-600 animate-bounce" size={32} />
                    </div>
                    <span className="text-lg font-semibold text-slate-700">Đang gọi...</span>
                </div>
             </div>
          )}

          <div className="text-center mb-8 z-10 mt-6">
             <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-400 border-4 border-white shadow-sm">
                <User size={48} />
             </div>
             <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{currentLead?.nguoiLienHe}</h2>
             <p className="text-lg text-slate-500">{currentLead?.tenCongTy}</p>
             <p className="text-2xl font-mono mt-2 text-slate-700 dark:text-slate-300 font-bold tracking-wider">{currentLead?.soDienThoai}</p>
             
             {callStatus === 'CONNECTED' && (
                 <div className="mt-4 px-6 py-2 bg-green-100 text-green-700 rounded-full inline-flex items-center gap-3 font-mono text-lg shadow-inner">
                    <span className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></span>
                    {formatTime(duration)}
                 </div>
             )}
          </div>

          <div className="flex items-center gap-6 z-10">
            {callStatus === 'IDLE' || callStatus === 'ENDED' ? (
                <button 
                    onClick={handleCall}
                    disabled={callStatus === 'ENDED'} // Bắt buộc phải chọn disposition mới gọi tiếp được (nếu muốn) hoặc bấm Next
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                        callStatus === 'ENDED' ? 'bg-slate-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                >
                    <Phone size={32} fill="currentColor" />
                </button>
            ) : (
                <>
                    <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-4 rounded-full border shadow-sm transition-colors ${isMuted ? 'bg-red-100 text-red-600 border-red-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    <button 
                        onClick={handleHangup}
                        className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                    >
                        <PhoneOff size={32} fill="currentColor" />
                    </button>
                </>
            )}
          </div>
          
          {callStatus === 'ENDED' && (
              <p className="mt-4 text-sm text-red-500 font-medium animate-pulse">Cuộc gọi đã kết thúc. Vui lòng nhập kết quả.</p>
          )}
        </div>

        {/* Script & History */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-200 border-b pb-2 flex items-center gap-2">
                <FileText size={18} />
                Kịch Bản Gọi (Telemarketing)
            </h3>
            <div className="prose prose-slate dark:prose-invert max-w-none text-sm bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                <p className="mb-2"><span className="font-bold text-blue-600">Bước 1 (Chào hỏi):</span> "Dạ chào anh/chị {currentLead?.nguoiLienHe}, em gọi từ hệ thống HISep Marketing."</p>
                <p className="mb-2"><span className="font-bold text-blue-600">Bước 2 (Lý do):</span> "Bên em đang có giải pháp giúp {currentLead?.tenCongTy} tìm kiếm khách hàng tự động."</p>
                <p><span className="font-bold text-blue-600">Bước 3 (Khai thác):</span> "Hiện tại bên mình đang tìm kiếm khách hàng qua kênh nào ạ?"</p>
            </div>
        </div>
      </div>

      {/* Right: Lead Info & Disposition */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <User size={18} /> Thông Tin Khách Hàng
            </h3>
            <div className="space-y-4 text-sm">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <label className="text-xs text-slate-500 uppercase font-bold">Email</label>
                    <p className="font-medium truncate" title={currentLead?.email}>{currentLead?.email}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <label className="text-xs text-slate-500 uppercase font-bold">Địa Chỉ</label>
                    <p className="font-medium">{currentLead?.diaChi}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <label className="text-xs text-slate-500 uppercase font-bold">Ngành Nghề (AI)</label>
                    <p className="font-medium text-blue-600">{currentLead?.nganhNghe || 'Đang cập nhật...'}</p>
                </div>
                 <div>
                    <label className="text-xs text-slate-500 uppercase font-bold">Lịch sử tương tác</label>
                    <div className="mt-2 space-y-2 pl-2 border-l-2 border-slate-200">
                        <div className="flex items-center gap-2 text-xs text-slate-600 ml-2">
                            <Clock size={12} />
                            <span>System: Đã import từ Excel</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex-1 flex flex-col relative">
            {/* Overlay nếu chưa gọi xong */}
            {callStatus !== 'ENDED' && callStatus !== 'IDLE' && (
                <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 z-20 cursor-not-allowed"></div>
            )}

            <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <CheckCircle size={18} /> Kết Quả & Ghi Chú
            </h3>
            
            <textarea 
                className="flex-1 w-full border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none mb-4 bg-slate-50 dark:bg-slate-900 dark:text-white"
                placeholder="Nhập ghi chú quan trọng về khách hàng này..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
            ></textarea>

            <div className="grid grid-cols-2 gap-3">
                <button onClick={handleSubmitDisposition} className="p-3 border border-green-200 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex flex-col items-center gap-1 transition-colors">
                    <CheckCircle size={20} />
                    <span className="text-xs font-bold">Quan Tâm</span>
                </button>
                 <button onClick={handleSubmitDisposition} className="p-3 border border-yellow-200 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 flex flex-col items-center gap-1 transition-colors">
                    <Clock size={20} />
                    <span className="text-xs font-bold">Gọi Lại Sau</span>
                </button>
                 <button onClick={handleSubmitDisposition} className="p-3 border border-red-200 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 flex flex-col items-center gap-1 transition-colors">
                    <XCircle size={20} />
                    <span className="text-xs font-bold">Từ Chối</span>
                </button>
                 <button onClick={handleSubmitDisposition} className="p-3 border border-slate-200 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 flex flex-col items-center gap-1 transition-colors">
                    <PhoneOff size={20} />
                    <span className="text-xs font-bold">Sai Số / KLL</span>
                </button>
            </div>
            
            <button 
                onClick={() => setSessionState('IDLE')} 
                className="mt-4 w-full py-2 text-xs text-slate-400 hover:text-slate-600 underline"
            >
                Dừng phiên làm việc
            </button>
        </div>
      </div>
    </div>
  );
};

export default AgentWorkspace;