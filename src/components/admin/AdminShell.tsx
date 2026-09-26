import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Bell, 
  Calendar, 
  BookOpen, 
  FileText, 
  UserPlus, 
  BarChart3, 
  Settings, 
  ExternalLink,
  Menu,
  X,
  LogOut,
  Shield
} from 'lucide-react';
import { SearchInput } from '../common/SearchInput';
import { ThemeToggleSwitch } from '../common/ThemeToggleSwitch';
import { useAuth } from '../../context/AuthContext';

export type AdminTab = 
  | 'dashboard'
  | 'members'
  | 'announcements'
  | 'rehearsals'
  | 'liturgy'
  | 'registrations'
  | 'analytics'
  | 'settings';

interface AdminShellProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  children: React.ReactNode;
  onOpenPortal: () => void;
  onSignOut: () => Promise<void>;
}

export const AdminShell: React.FC<AdminShellProps> = ({
  currentTab,
  onTabChange,
  children,
  onOpenPortal,
  onSignOut
}) => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [signingOut, setSigningOut] = useState(false);

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'members', label: 'Ca viên', icon: <Users className="w-4 h-4" /> },
    { id: 'announcements', label: 'Thông báo', icon: <Bell className="w-4 h-4" /> },
    { id: 'rehearsals', label: 'Lịch tập', icon: <Calendar className="w-4 h-4" /> },
    { id: 'liturgy', label: 'Phụng vụ', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'registrations', label: 'Đăng ký', icon: <UserPlus className="w-4 h-4" /> },
    { id: 'analytics', label: 'Thống kê', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Cài đặt', icon: <Settings className="w-4 h-4" /> }
  ];

  const handleSignOut = async () => {
    setSigningOut(true);
    await onSignOut();
    setSigningOut(false);
  };

  const displayEmail = user?.email || 'admin@bachoa.org';
  const displayName = displayEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0F19] transition-colors p-3 sm:p-6 text-slate-900 dark:text-slate-100 font-sans">
      <div className="crextio-outer-container max-w-7xl mx-auto min-h-[92vh] flex flex-col overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
        
        {/* HEADER BAR */}
        <header className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0 bg-white/50 dark:bg-slate-900/50">
          
          {/* LOGO & TITLE */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onOpenPortal}>
            <img 
              src="/logo.png" 
              alt="Logo Tổng Lãnh Thiên Thần" 
              className="w-11 h-11 rounded-full object-cover shadow-sm hover:scale-105 transition-transform border border-amber-300" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Ca Đoàn Thiên Thần
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-semibold uppercase tracking-wider">
                  Admin Center
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Giáo Xứ Bắc Hòa — Giáo Hạt Phú Thịnh</p>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="hidden lg:block w-72">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Tìm kiếm nhanh trong admin..."
            />
          </div>

          {/* RIGHT UTILITIES */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPortal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-amber-100/70 hover:bg-amber-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors"
              title="Mở Cổng thông tin Public Portal"
            >
              <span>Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* THEME TOGGLE */}
            <ThemeToggleSwitch />

            {/* USER PROFILE + SIGN OUT */}
            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full border border-amber-300/80 bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100 text-[10px] font-bold flex items-center justify-center shadow-sm shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-left text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200">{displayName}</div>
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{displayEmail}</div>
              </div>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                title="Đăng xuất"
                className="ml-1 p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* NAVIGATION BAR (Desktop Capsule Pills) */}
        <nav className="hidden lg:flex items-center gap-1.5 px-6 py-3 border-b border-slate-200/60 dark:border-slate-800/60 overflow-x-auto shrink-0 bg-slate-50/50 dark:bg-slate-900/30">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-[#0B192C] text-white shadow-sm dark:bg-amber-400 dark:text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* MOBILE DRAWER MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-col gap-1">
            {/* User info on mobile */}
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-slate-800 rounded-xl mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{displayEmail}</div>
                <div className="text-[10px] text-slate-400">Admin đã đăng nhập</div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-950/30 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => { onOpenPortal(); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between p-2.5 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 rounded-xl mb-1"
            >
              <span>Xem Cổng Thông Tin Public Portal</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onTabChange(item.id); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium ${
                  currentTab === item.id
                    ? 'bg-[#0B192C] dark:bg-amber-400 text-white dark:text-slate-900 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* MAIN BODY AREA */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
