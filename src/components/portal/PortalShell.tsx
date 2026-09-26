import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import { ThemeToggleSwitch } from '../common/ThemeToggleSwitch';

export type PortalPage =
  | 'home'
  | 'announcements'
  | 'announcement-detail'
  | 'rehearsals'
  | 'liturgy'
  | 'registration';

interface PortalShellProps {
  currentPage: PortalPage;
  onPageChange: (page: PortalPage, params?: any) => void;
  children: React.ReactNode;
}

export const PortalShell: React.FC<PortalShellProps> = ({
  currentPage,
  onPageChange,
  children
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { id: PortalPage; label: string }[] = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'announcements', label: 'Thông báo' },
    { id: 'rehearsals', label: 'Lịch tập' },
    { id: 'liturgy', label: 'Phụng vụ' },
    { id: 'registration', label: 'Đăng ký tham gia' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-amber-200 transition-colors">

      {/* PUBLIC HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-amber-100/80 dark:border-slate-800 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

          {/* LOGO & BRAND NAME */}
          <div
            onClick={() => onPageChange('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="/logo.png"
              alt="Logo Tổng Lãnh Thiên Thần"
              className="w-11 h-11 rounded-full object-cover border border-amber-300 shadow-sm group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Ca Đoàn Thiên Thần
              </div>
              <p className="text-[11px] font-medium text-amber-800 dark:text-amber-400">Giáo Xứ Bắc Hòa — Phú Thịnh</p>
            </div>
          </div>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`text-sm font-medium transition-colors py-1 ${currentPage === item.id
                  ? 'text-amber-800 dark:text-amber-400 font-bold border-b-2 border-amber-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* DESKTOP UTILITIES & CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggleSwitch />

            <Button
              size="sm"
              variant="yellow"
              onClick={() => onPageChange('registration')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Đăng ký tham gia
            </Button>
          </div>

          {/* MOBILE TOGGLE & THEME BTN */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggleSwitch size="sm" />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-amber-100 dark:border-slate-800 px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl text-left text-sm font-medium ${currentPage === item.id
                  ? 'bg-amber-50 dark:bg-slate-800 text-amber-900 dark:text-amber-300 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <Button variant="yellow" onClick={() => { onPageChange('registration'); setIsMobileMenuOpen(false); }}>
                Đăng ký tham gia ngay
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        {children}
      </main>

      {/* PUBLIC FOOTER */}
      <footer className="bg-[#0B192C] text-slate-300 py-12 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-white font-bold text-base">
              <img src={`${import.meta.env.BASE_URL}logo.png`} className="w-9 h-9 rounded-full border border-amber-300 object-cover" alt="Logo Footer" />
              <span>Ca Đoàn Thiên Thần</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Cổng thông tin phục vụ ca viên và giáo dân Giáo Xứ Bắc Hòa.<br />Bổn mạng: Các Thánh Tổng Lãnh Thiên Thần Michael, Gabriel, Raphael.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-white font-bold text-sm mb-1">Thông tin liên hệ</div>
            <div>• Giáo Xứ Bắc Hòa</div>
            <div>• Giáo Hạt Phú Thịnh</div>
            <div>• Giáo Phận Xuân Lộc</div>
            <div>• Địa chỉ: Xã Bình Minh, TP. Đồng Nai</div>
          </div>

          <div className="space-y-2">
            <div className="text-white font-bold text-sm mb-1">Sinh Hoạt Ca Đoàn</div>
            <div>• Lịch tập hát: Tối T5 & T7 lúc 19:30</div>
            <div>• Thánh Lễ phục vụ chính: <br />18h từ T2 đến T6 <br />6h30 Lễ Thiếu Nhi/Chúa Nhật</div>
            <div className="pt-2">
              <span className="text-amber-300 font-semibold">© 2026 Ca Đoàn Thiên Thần</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
