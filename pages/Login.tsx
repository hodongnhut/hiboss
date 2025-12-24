import React, { useState } from 'react';
import { Lock, Loader2, AlertCircle, User, ShieldCheck, Globe, Eye, EyeOff, Terminal, Zap, ArrowLeft, Mail, Send, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}
type AuthView = 'LOGIN' | 'FORGOT_PASSWORD' | 'FORGOT_SUCCESS';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('LOGIN');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailReset, setEmailReset] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      if (emailReset.includes('@')) {
        setView('FORGOT_SUCCESS');
      } else {
        setError('Vui lòng nhập địa chỉ email hợp lệ.');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-white dark:bg-slate-800 w-full max-w-[440px] rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative z-10 transition-all duration-500">

        {/* Top Branding Section */}
        <div className="pt-12 pb-8 px-8 text-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-800 border-b dark:border-slate-700/50">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/40 transform -rotate-6 hover:rotate-0 transition-all duration-300">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {view === 'LOGIN' ? 'Chào Sếp CRM' : view === 'FORGOT_PASSWORD' ? 'Quên Mật Khẩu' : 'Đã Gửi Email'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
            B2B Marketing & Automation
          </p>
        </div>

        <div className="p-10">
          {view === 'LOGIN' && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
                  <AlertCircle size={20} className="shrink-0" />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tài khoản</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-semibold text-sm transition-all"
                    placeholder="Email hoặc Tên đăng nhập"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mật khẩu</label>
                  <button
                    type="button"
                    onClick={() => setView('FORGOT_PASSWORD')}
                    className="text-[10px] font-black text-blue-600 uppercase hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-semibold text-sm transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 p-1"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="pt-2 space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-70 uppercase tracking-widest text-xs"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={22} /> : 'Đăng Nhập Ngay'}
                </button>
              </div>
            </form>
          )}

          {view === 'FORGOT_PASSWORD' && (
            <form onSubmit={handleForgotSubmit} className="space-y-6 animate-slide-up">
              <p className="text-sm text-slate-500 text-center leading-relaxed font-medium">
                Vui lòng nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu vào hòm thư của Sếp.
              </p>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
                  <AlertCircle size={20} className="shrink-0" />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Địa chỉ Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    type="email"
                    value={emailReset}
                    onChange={(e) => setEmailReset(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-semibold text-sm transition-all"
                    placeholder="vi-du@congty.com"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-70 uppercase tracking-widest text-xs"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={22} /> : (
                    <>
                      Gửi Yêu Cầu <Send size={18} />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setView('LOGIN')}
                  className="w-full h-12 flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 hover:text-slate-800 uppercase tracking-widest"
                >
                  <ArrowLeft size={16} /> Quay lại đăng nhập
                </button>
              </div>
            </form>
          )}

          {view === 'FORGOT_SUCCESS' && (
            <div className="text-center space-y-8 animate-fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Kiểm tra hòm thư!</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Chúng tôi đã gửi đường dẫn đặt lại mật khẩu đến: <br />
                  <strong className="text-slate-900 dark:text-slate-200">{emailReset}</strong>
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-slate-900/50 rounded-2xl border border-blue-100 dark:border-slate-700 text-left">
                <p className="text-[10px] text-blue-700 dark:text-blue-400 font-bold leading-relaxed">
                  * Nếu không thấy email, vui lòng kiểm tra thư mục Spam hoặc gửi lại yêu cầu sau 2 phút.
                </p>
              </div>
              <button
                onClick={() => { setView('LOGIN'); setEmailReset(''); }}
                className="w-full h-14 bg-slate-900 hover:bg-black text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
              >
                Trở về trang chủ
              </button>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border-t dark:border-slate-700 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
            <Globe size={14} className="text-blue-500" />
            <a
              href="https://stonenetworktech.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#007bff' }}
            >
              <span className="text-[10px] font-black text-slate-500 tracking-tighter">Make by StoneNetwork Company</span>
            </a>

          </div>
        </div>
      </div>

      <div className="absolute bottom-8 flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
        <Terminal size={16} /> Make by Stone Network
      </div>
    </div>
  );
};

export default Login;