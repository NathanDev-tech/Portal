import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Eye, EyeOff, AlertCircle, Cross, Loader2 } from 'lucide-react';

export const AdminLoginPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setIsLoading(true);
    setError('');

    const { error } = await signIn(email.trim(), password);
    if (error) {
      setError(error);
      setIsLoading(false);
    }
    // On success, AuthContext updates user state, App.tsx re-renders automatically
  };

  return (
    <div className="min-h-screen bg-[#0B192C] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background archangel image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-archangels.jpg"
          alt=""
          className="w-full h-full object-cover opacity-20 scale-105 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B192C]/90 via-[#0B192C]/80 to-[#1E293B]/90" />
      </div>

      {/* Decorative cross */}
      <div className="absolute top-8 right-8 opacity-10">
        <Cross className="w-24 h-24 text-amber-300" />
      </div>
      <div className="absolute bottom-8 left-8 opacity-10">
        <Cross className="w-16 h-16 text-amber-300" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back to Portal link */}
        <button
          onClick={onBack}
          className="mb-6 text-xs text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          Quay về Cổng thông tin giáo dân
        </button>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-800/60 to-amber-950/80 border-b border-amber-300/20 px-8 py-6 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-400/20 border-2 border-amber-300/60 flex items-center justify-center shadow-xl">
              <Shield className="w-8 h-8 text-amber-300" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Admin Center
            </h1>
            <p className="text-xs text-amber-200/80 mt-1">
              Ca Đoàn Thiên Thần — Giáo Xứ Bắc Hòa
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-7">
            <p className="text-sm text-slate-300 mb-5 text-center">
              Đăng nhập bằng tài khoản Ban Điều Hành
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="flex items-start gap-2.5 p-3.5 bg-red-500/15 border border-red-400/30 rounded-2xl text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="admin@bachoa.org"
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-2xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/40 transition-all"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-12 bg-white/8 border border-white/15 rounded-2xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/40 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-2 bg-amber-400 hover:bg-amber-300 text-[#0B192C] font-bold text-sm rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 disabled:opacity-60 disabled:pointer-events-none active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xác thực...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Đăng nhập vào Admin Center
                  </>
                )}
              </button>
            </form>

            {/* Security Notice */}
            <p className="mt-5 text-center text-[11px] text-slate-500 leading-relaxed">
              🔒 Khu vực quản trị dành riêng cho Ban Điều Hành.<br />
              Mọi hành động đều được ghi nhật ký qua Supabase Auth.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-slate-600 mt-6">
          Ca Đoàn Thiên Thần • Giáo Xứ Bắc Hòa • Giáo Hạt Phú Thịnh
        </p>
      </div>
    </div>
  );
};
