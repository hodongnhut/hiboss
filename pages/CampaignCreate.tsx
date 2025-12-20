import React, { useState } from 'react';
import { ArrowLeft, Check, Megaphone, Phone, Mail, MessageSquare, LayoutTemplate, Plus, Edit3, X, FileText, Wand2, Users } from 'lucide-react';
import { KenhMarketing } from '../types';
import { danhSachNhomKhachHangMau } from '../services/mockData';

interface CampaignCreateProps {
    onBack: () => void;
}

// Mock Templates Data
const mauEmailSan = [
    {
        id: 1,
        tenMau: 'Chào mừng khách hàng mới',
        tieuDe: 'Chào mừng {{nguoiLienHe}} đến với hệ thống HISep CRM',
        noiDung: `Kính gửi {{nguoiLienHe}},

Cảm ơn quý công ty {{tenCongTy}} đã quan tâm đến giải pháp Marketing Automation của chúng tôi.

Chúng tôi xin gửi kèm tài liệu hướng dẫn sử dụng cơ bản. Nếu cần hỗ trợ, vui lòng liên hệ hotline.

Trân trọng,
Đội ngũ HISep.`
    },
    {
        id: 2,
        tenMau: 'Gửi báo giá dịch vụ',
        tieuDe: 'Báo giá dịch vụ CRM & Automation - {{tenCongTy}}',
        noiDung: `Chào anh/chị,

Theo yêu cầu của quý khách, chúng tôi xin gửi bảng báo giá chi tiết cho gói Enterprise.

Chi tiết xem tại: [Link_Bao_Gia]

Rất mong được hợp tác cùng {{tenCongTy}}.`
    },
    {
        id: 3,
        tenMau: 'Khuyến mãi tháng 10',
        tieuDe: '[HOT] Ưu đãi 50% cho {{tenCongTy}} duy nhất hôm nay',
        noiDung: `Xin chào {{nguoiLienHe}},

Nhân dịp sinh nhật công ty, chúng tôi tặng voucher giảm giá 50% trọn đời.
Mã khuyến mãi của riêng bạn: HIS_PRO_{{soDienThoai}}

Nhanh tay đăng ký ngay!`
    }
];

const bienDongHoTro = [
    { code: '{{tenCongTy}}', label: 'Tên Công Ty' },
    { code: '{{nguoiLienHe}}', label: 'Người Liên Hệ' },
    { code: '{{email}}', label: 'Email Khách' },
    { code: '{{soDienThoai}}', label: 'SĐT Khách' },
];

const CampaignCreate: React.FC<CampaignCreateProps> = ({ onBack }) => {
    const [step, setStep] = useState(1);
    const [campaignName, setCampaignName] = useState('');
    const [selectedChannels, setSelectedChannels] = useState<KenhMarketing[]>([]);
    
    // State cho Target
    const [selectedGroupId, setSelectedGroupId] = useState<string>('ALL');

    // State cho Email Editor
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [isEditingEmail, setIsEditingEmail] = useState(false); // false: xem list, true: đang soạn

    const steps = [
        { id: 1, title: 'Thông Tin & Đối Tượng' },
        { id: 2, title: 'Kênh & Nội Dung' },
        { id: 3, title: 'Ngân Sách & Lịch' }
    ];

    const toggleChannel = (channel: KenhMarketing) => {
        if (selectedChannels.includes(channel)) {
            setSelectedChannels(selectedChannels.filter(c => c !== channel));
            // Reset email state nếu bỏ chọn email
            if (channel === KenhMarketing.EMAIL) {
                setIsEditingEmail(false);
                setEmailSubject('');
                setEmailBody('');
            }
        } else {
            setSelectedChannels([...selectedChannels, channel]);
        }
    };

    const handleSelectTemplate = (template: typeof mauEmailSan[0]) => {
        setEmailSubject(template.tieuDe);
        setEmailBody(template.noiDung);
        setIsEditingEmail(true);
    };

    const handleCreateNewTemplate = () => {
        setEmailSubject('');
        setEmailBody('');
        setIsEditingEmail(true);
    };

    const insertVariable = (variable: string) => {
        // Đơn giản hóa: chèn vào cuối text area (Trong thực tế dùng ref để chèn đúng vị trí con trỏ)
        setEmailBody(prev => prev + ' ' + variable);
    };

    // Helper: Lấy tên nhóm đã chọn
    const getSelectedGroupName = () => {
        if (selectedGroupId === 'ALL') return 'Tất cả khách hàng';
        const group = danhSachNhomKhachHangMau.find(g => g.id === selectedGroupId);
        return group ? group.tenNhom : 'Không xác định';
    };

    // Helper: Lấy số lượng lead
    const getSelectedGroupCount = () => {
         if (selectedGroupId === 'ALL') return 1500;
         const group = danhSachNhomKhachHangMau.find(g => g.id === selectedGroupId);
         return group ? group.soLuong : 0;
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Tạo Chiến Dịch Mới</h1>
            </div>

            {/* Stepper */}
            <div className="flex justify-between items-center mb-10 px-10">
                {steps.map((s, idx) => (
                    <div key={s.id} className="flex flex-col items-center relative z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-colors ${
                            step >= s.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                            {step > s.id ? <Check size={18} /> : s.id}
                        </div>
                        <span className={`text-xs font-medium ${step >= s.id ? 'text-blue-600' : 'text-slate-400'}`}>
                            {s.title}
                        </span>
                        {/* Connector Line */}
                        {idx < steps.length - 1 && (
                            <div className="absolute top-5 left-1/2 w-[calc(100%+5rem)] h-[2px] -z-10 bg-slate-200">
                                <div 
                                    className="h-full bg-blue-600 transition-all duration-300" 
                                    style={{ width: step > s.id ? '100%' : '0%' }}
                                ></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Form Content */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 min-h-[400px]">
                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên chiến dịch</label>
                            <input 
                                type="text" 
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 dark:border-slate-700" 
                                placeholder="VD: Khuyến mãi tháng 10"
                                value={campaignName}
                                onChange={(e) => setCampaignName(e.target.value)}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Chọn đối tượng khách hàng</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Option: ALL */}
                                <div 
                                    onClick={() => setSelectedGroupId('ALL')}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors flex items-start gap-3 ${selectedGroupId === 'ALL' ? 'border-blue-500 bg-blue-50' : 'hover:bg-slate-50'}`}
                                >
                                    <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center ${selectedGroupId === 'ALL' ? 'border-blue-600' : 'border-slate-400'}`}>
                                        {selectedGroupId === 'ALL' && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                                    </div>
                                    <div>
                                        <span className="font-bold block text-sm">Tất cả khách hàng</span>
                                        <span className="text-xs text-slate-500">1,500 leads chưa được chăm sóc</span>
                                    </div>
                                </div>

                                {/* Dynamic Groups */}
                                {danhSachNhomKhachHangMau.map(group => (
                                    <div 
                                        key={group.id}
                                        onClick={() => setSelectedGroupId(group.id)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-colors flex items-start gap-3 ${selectedGroupId === group.id ? 'border-purple-500 bg-purple-50' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center ${selectedGroupId === group.id ? 'border-purple-600' : 'border-slate-400'}`}>
                                            {selectedGroupId === group.id && <div className="w-3 h-3 bg-purple-600 rounded-full"></div>}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Users size={14} className="text-purple-600"/>
                                                <span className="font-bold block text-sm">{group.tenNhom}</span>
                                            </div>
                                            <span className="text-xs text-slate-500 block mt-0.5">{group.moTa}</span>
                                            <span className="text-xs font-bold text-slate-600 mt-1 block">{group.soLuong} khách hàng</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Chọn kênh tiếp cận</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <button 
                                    onClick={() => toggleChannel(KenhMarketing.CALL)}
                                    className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${
                                        selectedChannels.includes(KenhMarketing.CALL) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
                                    }`}
                                >
                                    <Phone size={24} />
                                    <span className="font-medium text-sm">Auto Call</span>
                                </button>
                                <button 
                                    onClick={() => toggleChannel(KenhMarketing.EMAIL)}
                                    className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${
                                        selectedChannels.includes(KenhMarketing.EMAIL) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
                                    }`}
                                >
                                    <Mail size={24} />
                                    <span className="font-medium text-sm">Email</span>
                                </button>
                                <button 
                                    onClick={() => toggleChannel(KenhMarketing.SMS)}
                                    className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${
                                        selectedChannels.includes(KenhMarketing.SMS) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
                                    }`}
                                >
                                    <MessageSquare size={24} />
                                    <span className="font-medium text-sm">SMS Brandname</span>
                                </button>
                                <button 
                                    onClick={() => toggleChannel(KenhMarketing.ZALO)}
                                    className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${
                                        selectedChannels.includes(KenhMarketing.ZALO) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
                                    }`}
                                >
                                    <span className="text-xl font-bold">Z</span>
                                    <span className="font-medium text-sm">Zalo ZNS</span>
                                </button>
                            </div>
                        </div>

                        {selectedChannels.includes(KenhMarketing.EMAIL) && (
                            <div className="animate-fade-in">
                                {!isEditingEmail ? (
                                    // GIAO DIỆN CHỌN TEMPLATE
                                    <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                                                <LayoutTemplate size={18} className="text-blue-600" /> 
                                                Thư Viện Mẫu Email
                                            </h4>
                                            <button 
                                                onClick={handleCreateNewTemplate}
                                                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 flex items-center gap-1 font-medium"
                                            >
                                                <Plus size={16} /> Soạn mới
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {mauEmailSan.map(mau => (
                                                <div 
                                                    key={mau.id} 
                                                    onClick={() => handleSelectTemplate(mau)}
                                                    className="border bg-white dark:bg-slate-800 p-4 rounded-lg cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h5 className="font-bold text-sm text-slate-700 dark:text-slate-200 group-hover:text-blue-600">{mau.tenMau}</h5>
                                                        <Edit3 size={14} className="text-slate-400 group-hover:text-blue-600" />
                                                    </div>
                                                    <p className="text-xs text-slate-500 line-clamp-2 italic">{mau.tieuDe}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    // GIAO DIỆN EDITOR
                                    <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-900 shadow-sm relative">
                                        <button 
                                            onClick={() => setIsEditingEmail(false)}
                                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
                                            title="Đóng Editor"
                                        >
                                            <X size={20} />
                                        </button>
                                        
                                        <h4 className="font-bold flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-4">
                                            <Edit3 size={18} /> 
                                            Soạn Thảo Email
                                        </h4>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tiêu đề Email</label>
                                                <input 
                                                    type="text" 
                                                    value={emailSubject}
                                                    onChange={(e) => setEmailSubject(e.target.value)}
                                                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                                                    placeholder="Nhập tiêu đề..."
                                                />
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-end mb-1">
                                                    <label className="block text-xs font-bold text-slate-500 uppercase">Nội dung</label>
                                                    <div className="flex gap-1">
                                                        {bienDongHoTro.map((bien) => (
                                                            <button 
                                                                key={bien.code}
                                                                onClick={() => insertVariable(bien.code)}
                                                                className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded hover:bg-blue-200 transition-colors"
                                                                title={`Chèn biến ${bien.label}`}
                                                            >
                                                                {bien.code}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <textarea 
                                                    value={emailBody}
                                                    onChange={(e) => setEmailBody(e.target.value)}
                                                    className="w-full h-48 p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono leading-relaxed" 
                                                    placeholder="Soạn nội dung email..."
                                                ></textarea>
                                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                    <Wand2 size={12} />
                                                    Mẹo: Sử dụng các biến ở trên để cá nhân hóa nội dung cho từng khách hàng.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                                             <button 
                                                onClick={() => setIsEditingEmail(false)}
                                                className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-bold flex items-center gap-2 shadow-sm"
                                            >
                                                <Check size={16} /> Lưu & Sử dụng mẫu này
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h3 className="font-bold text-green-800 mb-2">Tóm tắt chiến dịch</h3>
                            <ul className="text-sm text-green-700 space-y-1">
                                <li>• Tên: <strong>{campaignName || 'Chưa đặt tên'}</strong></li>
                                <li>• Đối tượng: <strong>{getSelectedGroupName()}</strong></li>
                                <li>• Số lượng ước tính: <strong>{getSelectedGroupCount().toLocaleString()} khách hàng</strong></li>
                                <li>• Kênh: <strong>{selectedChannels.join(', ') || 'Chưa chọn'}</strong></li>
                                {selectedChannels.includes(KenhMarketing.EMAIL) && (
                                    <li>• Email Subject: <strong>{emailSubject || '(Chưa nhập tiêu đề)'}</strong></li>
                                )}
                            </ul>
                        </div>

                         <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ngân sách dự kiến</label>
                            <div className="text-3xl font-bold text-slate-800 dark:text-white">
                                {(getSelectedGroupCount() * 5000).toLocaleString()} VND
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Đã bao gồm phí Call, Email và SMS.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="mt-6 flex justify-between">
                <button 
                    onClick={() => setStep(s => Math.max(1, s - 1))}
                    disabled={step === 1}
                    className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Quay lại
                </button>
                
                {step < 3 ? (
                    <button 
                        onClick={() => setStep(s => Math.min(3, s + 1))}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                    >
                        Tiếp tục
                    </button>
                ) : (
                    <button 
                        onClick={onBack}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"
                    >
                        <Megaphone size={18} />
                        Khởi Chạy Chiến Dịch
                    </button>
                )}
            </div>
        </div>
    );
};

export default CampaignCreate;