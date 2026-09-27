import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  UserPlus, 
  FileText, 
  ArrowUpRight, 
  Clock, 
  Bell, 
  BookOpen,
  Sparkles
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { AdminTab } from './AdminShell';
import { Button } from '../common/Button';

interface AdminDashboardProps {
  onNavigate: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    dataService.fetchAll();
    const unsub = dataService.subscribe(() => setTick(t => t + 1));
    return () => unsub();
  }, []);

  const stats = dataService.getStats();
  const rehearsals = dataService.getRehearsals().slice(0, 3);
  const registrations = dataService.getRegistrations().filter(r => r.status === 'pending');
  const announcements = dataService.getAnnouncements().slice(0, 3);
  const liturgies = dataService.getLiturgies().slice(0, 2);

  return (
    <div className="space-y-8">
      {/* ARCHANGEL HERO WELCOME BANNER FOR ADMIN */}
      <div className="relative rounded-3xl overflow-hidden shadow-md border border-amber-200/80 bg-[#0B192C] text-white">
        <img 
          src={`${import.meta.env.BASE_URL}hero-archangels.jpg`}
          alt="Mừng Kính Tổng Lãnh Thiên Thần" 
          className="w-full h-32 sm:h-40 object-cover opacity-45 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/60 to-transparent p-6 sm:p-8 flex flex-col justify-end">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-amber-300 bg-amber-400/20 backdrop-blur-md flex items-center justify-center shadow-md shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                Bổn Mạng Ca Đoàn Thiên Thần
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Mừng Kính Các Thánh Tổng Lãnh Thiên Thần Michael - Gabriel - Raphael
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Trung tâm điều hành
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quản lý hoạt động Ca Đoàn Thiên Thần — Giáo Xứ Bắc Hòa
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="yellow" onClick={() => onNavigate('registrations')}>
            Duyệt đơn gia nhập ({registrations.length})
          </Button>
          <Button size="sm" variant="primary" onClick={() => onNavigate('members')}>
            Thêm ca viên mới
          </Button>
        </div>
      </div>

      {/* 4 LARGE SUMMARY BLOCKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('members')}
          className="p-6 bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-800 dark:to-amber-950/20 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {stats.total_members}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
            Tổng số ca viên
          </div>
          <div className="mt-3 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            {stats.active_members} ca viên đang hoạt động
          </div>
        </div>

        <div 
          onClick={() => onNavigate('rehearsals')}
          className="p-6 bg-gradient-to-br from-white to-sky-50/30 dark:from-slate-800 dark:to-sky-950/20 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {stats.upcoming_rehearsals}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
            Lịch tập sắp tới
          </div>
          <div className="mt-3 text-[11px] text-sky-600 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Tập định kỳ T5 & T7 lúc 19:30
          </div>
        </div>

        <div 
          onClick={() => onNavigate('registrations')}
          className="p-6 bg-gradient-to-br from-white to-amber-50/50 dark:from-slate-800 dark:to-amber-950/30 rounded-3xl border border-amber-200 dark:border-amber-900/50 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 flex items-center justify-center">
              <UserPlus className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-amber-600 dark:text-amber-400 transition-colors" />
          </div>
          <div className="text-3xl font-extrabold text-amber-900 dark:text-amber-200">
            {stats.pending_registrations}
          </div>
          <div className="text-xs font-semibold text-amber-800 dark:text-amber-300 mt-1">
            Đăng ký gia nhập chờ duyệt
          </div>
          <div className="mt-3 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
            Cần Ban Điều Hành xem xét & phỏng vấn
          </div>
        </div>

        <div 
          onClick={() => onNavigate('announcements')}
          className="p-6 bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-800 dark:to-emerald-950/20 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {stats.published_announcements}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
            Thông báo đã đăng
          </div>
          <div className="mt-3 text-[11px] text-emerald-600 font-medium">
            Tin tức & thông tin ca đoàn
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Lịch tập sắp tới</h3>
              </div>
              <button 
                onClick={() => onNavigate('rehearsals')}
                className="text-xs text-amber-700 dark:text-amber-400 font-medium hover:underline"
              >
                Xem tất cả
              </button>
            </div>

            <div className="space-y-3">
              {rehearsals.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Chưa có lịch tập nào</p>
              ) : (
                rehearsals.map((reh) => (
                  <div 
                    key={reh.id} 
                    className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl flex items-start justify-between gap-4 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-200 text-slate-900 font-bold flex flex-col items-center justify-center shrink-0 text-xs">
                        <span>{(reh.event_date || '01-01').split('-')[2] || '01'}</span>
                        <span className="text-[9px] uppercase font-normal">Thg {(reh.event_date || '01-01').split('-')[1] || '01'}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{reh.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {reh.start_time} - {reh.end_time} | {reh.location}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium shrink-0">
                      Sắp tới
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Lịch phụng vụ gần nhất</h3>
              </div>
              <button 
                onClick={() => onNavigate('liturgy')}
                className="text-xs text-amber-700 dark:text-amber-400 font-medium hover:underline"
              >
                Quản lý bài hát
              </button>
            </div>

            {liturgies.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Chưa có lịch phụng vụ nào</p>
            ) : (
              liturgies.map((lit) => (
                <div key={lit.id} className="p-5 bg-gradient-to-r from-amber-50/40 to-slate-50 dark:from-slate-900 dark:to-slate-900/60 rounded-2xl border border-amber-200/60 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                        {lit.service_date} ({lit.service_time})
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{lit.title}</h4>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-amber-200 text-slate-900 font-medium">
                      {lit.location}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="text-[10px] text-slate-400 font-medium uppercase">Nhập Lễ</div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{lit.songs?.nhap_le?.song_title || 'Chưa gán'}</div>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="text-[10px] text-slate-400 font-medium uppercase">Đáp Ca</div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{lit.songs?.dap_ca?.song_title || 'Chưa gán'}</div>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="text-[10px] text-slate-400 font-medium uppercase">Alleluia</div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{lit.songs?.alleluia?.song_title || 'Chưa gán'}</div>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="text-[10px] text-slate-400 font-medium uppercase">Dâng Lễ</div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{lit.songs?.dang_le?.song_title || 'Chưa gán'}</div>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="text-[10px] text-slate-400 font-medium uppercase">Hiệp Lễ</div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{lit.songs?.hiep_le?.song_title || 'Chưa gán'}</div>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="text-[10px] text-slate-400 font-medium uppercase">Kết Lễ</div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{lit.songs?.ket_le?.song_title || 'Chưa gán'}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Đăng ký gia nhập mới</h3>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                {registrations.length}
              </span>
            </div>

            {registrations.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Không có đơn gia nhập chờ duyệt</p>
            ) : (
              <div className="space-y-3">
                {registrations.map((reg) => (
                  <div key={reg.id} className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0B192C] dark:text-amber-300">
                        {reg.holy_name} {reg.full_name}
                      </span>
                      <span className="text-[10px] text-slate-400">{(reg.submitted_at || '').split(' ')[0]}</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      ĐT: {reg.phone}
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="yellow" 
                        onClick={() => onNavigate('registrations')}
                      >
                        Xem & Duyệt
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Thông báo mới đăng</h3>
              </div>
              <button onClick={() => onNavigate('announcements')} className="text-xs text-amber-700 dark:text-amber-400 font-medium hover:underline">
                Tạo bài mới
              </button>
            </div>

            <div className="space-y-3">
              {announcements.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Chưa có thông báo nào</p>
              ) : (
                announcements.map((ann) => (
                  <div key={ann.id} className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {ann.category}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 line-clamp-2">
                      {ann.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Đăng ngày {ann.published_date} bởi {ann.author_name}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
