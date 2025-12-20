import React, { useState } from 'react';
import { Lock, Loader2, AlertCircle, User, ShieldCheck, Globe, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin@chaosep.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Endpoint đi qua Vite Proxy (đã cấu hình trỏ đến https://api.chaosep.com)
    const API_URL = '/api/site/login';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error('Không tìm thấy API (404). Sếp check lại UrlManager nhé.');
        if (response.status === 401) throw new Error('Tài khoản hoặc mật khẩu không đúng.');
        throw new Error(`Lỗi Server (${response.status}).`);
      }

      const data = await response.json();
      console.log('Backend Response:', data);

      const token = data.access_token || data.token || data.auth_key || (data.data && data.data.access_token);
      const isSuccess = data.success === true || data.status === 'success' || !!token;

      if (isSuccess) {
        if (token) {
          localStorage.setItem('auth_token', token);
        }

        const userInfo = data.user || data.data?.user || { hoTen: username, vaiTro: 'ADMIN' };
        localStorage.setItem('user_info', JSON.stringify(userInfo));

        onLogin();
      } else {
        throw new Error(data.message || 'Đăng nhập không thành công.');
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      setError(err.message || 'Không thể kết nối tới máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-white dark:bg-slate-800 w-full max-w-[440px] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative z-10 animate-fade-in">
        {/* Header Section */}
        <div className="pt-12 pb-8 px-8 text-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-800 border-b dark:border-slate-700/50">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-blue-500/30 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Chào Sếp CRM</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">B2B Marketing & Automation</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl flex items-start gap-3 animate-shake">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-600 dark:text-red-400 font-medium leading-relaxed">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Tài khoản</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <User size={20} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none dark:text-white transition-all font-medium"
                placeholder="Email hoặc tên đăng nhập"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Mật khẩu</label>
              <a href="#" className="text-[11px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-tighter hover:underline">Quên mật khẩu?</a>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none dark:text-white transition-all font-medium"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/25 active:scale-[0.98] ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span className="tracking-wide">Đang xác thực...</span>
              </>
            ) : (
              <span className="tracking-wide text-lg">Đăng Nhập</span>
            )}
          </button>

          <div className="text-center pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900/50 rounded-full border border-slate-200 dark:border-slate-700">
              <Globe size={14} className="text-blue-500" />
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">chaosep.com</span>
            </div>
          </div>
        </form>
      </div>

      {/* Footer copyright */}
      <div className="absolute bottom-8 text-slate-500 dark:text-slate-600 text-xs font-medium">
        &copy; 2024 Chaos CRM. All rights reserved.
      </div>
    </div>
  );
};

export default Login;