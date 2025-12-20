import React, { useState } from 'react';
import { CreditCard, History, Key, Save, CheckCircle, X, Download, QrCode, Copy, Loader2, DollarSign } from 'lucide-react';
import { lichSuGiaoDichMau } from '../services/mockData';
import { GiaoDich } from '../types';

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'BILLING' | 'API'>('BILLING');
  
  // State quản lý Billing
  const [balance, setBalance] = useState(5000000);
  const [transactions, setTransactions] = useState<GiaoDich[]>(lichSuGiaoDichMau);
  
  // State Modal Nạp Tiền
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(1000000);
  const [depositStep, setDepositStep] = useState<1 | 2>(1); // 1: Chọn số tiền, 2: Quét QR
  
  // State Xuất hóa đơn
  const [isExporting, setIsExporting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleOpenDeposit = () => {
    setDepositStep(1);
    setIsDepositModalOpen(true);
  };

  const handleNextStep = () => {
    if (depositAmount < 100000) {
        alert("Số tiền nạp tối thiểu là 100,000đ");
        return;
    }
    setDepositStep(2);
  };

  const handleConfirmDeposit = () => {
    // Mô phỏng call API xác nhận giao dịch
    const newTx: GiaoDich = {
        id: `GD${Date.now()}`,
        loai: 'NAP_TIEN',
        soTien: depositAmount,
        noiDung: `Nạp tiền qua QR Code - H${Date.now().toString().slice(-6)}`,
        thoiGian: new Date().toISOString(),
        trangThai: 'THANH_CONG'
    };

    setTransactions([newTx, ...transactions]);
    setBalance(prev => prev + depositAmount);
    setIsDepositModalOpen(false);
    alert("Giao dịch thành công! Số tiền đã được cộng vào tài khoản.");
  };

  const handleExportInvoice = () => {
    setIsExporting(true);
    // Mô phỏng delay server render PDF
    setTimeout(() => {
        setIsExporting(false);
        alert("Hóa đơn điện tử Tháng 10 đã được tạo và gửi về email: admin@hisep.vn");
    }, 2000);
  };

  return (
    <div className="space-y-6 relative">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Cấu Hình & Billing</h1>

      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button 
            onClick={() => setActiveTab('BILLING')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'BILLING' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
            Billing & Nạp Tiền
        </button>
        <button 
            onClick={() => setActiveTab('API')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'API' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
            Cấu Hình API
        </button>
      </div>

      {activeTab === 'BILLING' && (
        <div className="space-y-6">
            {/* Balance Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 bg-white/5 rounded-full -mr-10 -mt-10"></div>
                    <p className="text-blue-100 font-medium mb-1 flex items-center gap-2">
                        <CreditCard size={18} />
                        Số dư khả dụng
                    </p>
                    <h2 className="text-4xl font-bold mb-6 tracking-tight">{formatCurrency(balance)}</h2>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleOpenDeposit}
                            className="bg-white text-blue-700 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm flex items-center gap-2"
                        >
                            <DollarSign size={16} />
                            Nạp Tiền Ngay
                        </button>
                        <button 
                            onClick={handleExportInvoice}
                            disabled={isExporting}
                            className="bg-blue-500/30 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-500/40 transition-colors flex items-center gap-2"
                        >
                            {isExporting ? <Loader2 size={16} className="animate-spin"/> : <Download size={16} />}
                            {isExporting ? 'Đang xuất...' : 'Xuất Hóa Đơn'}
                        </button>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4">Chi Phí Tạm Tính (Tháng 10)</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Call (1,200 phút)</span>
                            <span className="font-medium">1,200,000 đ</span>
                        </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Zalo ZNS (500 tin)</span>
                            <span className="font-medium">250,000 đ</span>
                        </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Email (10k emails)</span>
                            <span className="font-medium">200,000 đ</span>
                        </div>
                        <div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
                         <div className="flex justify-between font-bold text-slate-800 dark:text-white">
                            <span>Tổng cộng</span>
                            <span>1,650,000 đ</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 font-bold flex items-center gap-2">
                    <History size={18} />
                    Lịch Sử Giao Dịch
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-medium sticky top-0">
                            <tr>
                                <th className="px-6 py-4">Thời Gian</th>
                                <th className="px-6 py-4">Loại GD</th>
                                <th className="px-6 py-4">Nội Dung</th>
                                <th className="px-6 py-4 text-right">Số Tiền</th>
                                <th className="px-6 py-4 text-right">Trạng Thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {transactions.map((gd) => (
                                <tr key={gd.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4 text-slate-500">{new Date(gd.thoiGian).toLocaleString('vi-VN')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${gd.loai === 'NAP_TIEN' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {gd.loai === 'NAP_TIEN' ? 'Nạp Tiền' : 'Trừ Phí'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium">{gd.noiDung}</td>
                                    <td className={`px-6 py-4 text-right font-bold ${gd.loai === 'NAP_TIEN' ? 'text-green-600' : 'text-slate-800 dark:text-white'}`}>
                                        {gd.loai === 'NAP_TIEN' ? '+' : ''} {formatCurrency(gd.soTien)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-green-600 text-xs font-bold uppercase flex items-center justify-end gap-1">
                                            {gd.trangThai === 'THANH_CONG' && <CheckCircle size={14} />}
                                            {gd.trangThai}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}

      {/* API Tab Content */}
      {activeTab === 'API' && (
          <div className="max-w-2xl bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
              <div>
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Key size={20} className="text-blue-600" />
                      Cấu hình Nhà Cung Cấp
                  </h3>
                  <p className="text-sm text-slate-500 mb-6">Điền API Key của các dịch vụ bên thứ 3 để hệ thống kết nối.</p>
              </div>

              <div className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stringee API Key (Call Center)</label>
                      <input type="password" value="************************" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm" readOnly />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Zalo OA Access Token</label>
                      <input type="password" value="************************" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm" readOnly />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Resend API Key (Email)</label>
                      <input type="password" value="re_123456789" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm" readOnly />
                  </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors">
                      <Save size={18} />
                      Lưu Cấu Hình
                  </button>
              </div>
          </div>
      )}

      {/* Modal Nạp Tiền */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Nạp Tiền Vào Tài Khoản</h3>
                    <button onClick={() => setIsDepositModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                </div>
                
                <div className="p-6">
                    {depositStep === 1 ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Chọn mệnh giá</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[1000000, 2000000, 5000000, 10000000].map(amount => (
                                        <button 
                                            key={amount}
                                            onClick={() => setDepositAmount(amount)}
                                            className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                                                depositAmount === amount 
                                                ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' 
                                                : 'border-slate-200 hover:border-blue-400'
                                            }`}
                                        >
                                            {formatCurrency(amount)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hoặc nhập số tiền khác (VNĐ)</label>
                                <input 
                                    type="number" 
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <p className="text-xs text-slate-500 mt-1">Tối thiểu 100,000đ. Phí giao dịch 0%.</p>
                            </div>
                            <button 
                                onClick={handleNextStep}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                            >
                                Tiếp Tục <CreditCard size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 text-center">
                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 inline-block">
                                <QrCode size={160} className="text-slate-800 dark:text-white mx-auto" />
                                <p className="text-xs text-slate-500 mt-2">Quét mã QR bằng App Ngân Hàng</p>
                            </div>
                            
                            <div className="space-y-3 text-left bg-blue-50 dark:bg-slate-900/50 p-4 rounded-lg border border-blue-100 dark:border-slate-700">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Ngân hàng</span>
                                    <span className="font-bold">Vietcombank</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Số tài khoản</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold font-mono">0071001234567</span>
                                        <button className="text-blue-600"><Copy size={14}/></button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Số tiền</span>
                                    <span className="font-bold text-blue-600 text-lg">{formatCurrency(depositAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Nội dung CK</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-red-600">HISep 88392</span>
                                        <button className="text-blue-600"><Copy size={14}/></button>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleConfirmDeposit}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={18} />
                                Tôi Đã Chuyển Khoản
                            </button>
                             <button 
                                onClick={() => setDepositStep(1)}
                                className="w-full text-slate-500 hover:text-slate-700 py-2 text-sm"
                            >
                                Quay lại chọn số tiền
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Settings;