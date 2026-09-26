import React, { useState, useEffect } from 'react';
import { PortalPage } from './PortalShell';
import { dataService } from '../../services/dataService';
import { Button } from '../common/Button';
import { Calendar, Bell, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

interface PortalHomeProps {
  onPageChange: (page: PortalPage, params?: any) => void;
}

export const PortalHome: React.FC<PortalHomeProps> = ({ onPageChange }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    // Re-render khi dataService cập nhật (Admin đăng dữ liệu mới)
    const unsub = dataService.subscribe(() => setTick(t => t + 1));
    return () => unsub();
  }, []);

  const announcements = dataService.getAnnouncements().filter(a => a.status === 'published').slice(0, 3);
  const rehearsals = dataService.getRehearsals().filter(r => r.status === 'sap_toi').slice(0, 2);
  const liturgies = dataService.getLiturgies().slice(0, 1);

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">

      {/* ARCHANGEL HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-[#0B192C] text-white py-24 sm:py-36 min-h-[520px] sm:min-h-[640px] flex flex-col justify-center px-4 text-center">
        {/* BACKGROUND ARTWORK */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-archangels.jpg"
            alt="Các Thánh Tổng Lãnh Thiên Thần - Bổn Mạng Ca Đoàn Thiên Thần"
            className="w-full h-full object-cover object-top sm:object-center opacity-65 filter brightness-105 saturate-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/40 to-[#0B192C]/20" />
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/60 backdrop-blur-md border border-amber-300/60 text-amber-300 text-xs font-bold shadow-xl">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Mừng Kính Tổng Lãnh Thiên Thần Michael • Gabriel • Raphael</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-xl">
            Ca Đoàn Thiên Thần
          </h1>

          <p className="text-lg sm:text-xl font-medium text-amber-100 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            "Phụng vụ bằng lời ca tiếng hát" — Giáo Xứ Bắc Hòa
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              variant="yellow"
              onClick={() => onPageChange('registration')}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Đăng ký tham gia ca đoàn
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-slate-900/60 text-white border-white/40 hover:bg-slate-900/80 backdrop-blur-md"
              onClick={() => onPageChange('liturgy')}
              icon={<BookOpen className="w-5 h-5" />}
            >
              Xem Lịch Phụng Vụ
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">

        {/* LỊCH PHỤNG VỤ THÁNH LỄ GẦN NHẤT */}
        {liturgies.length > 0 && (
          <section className="p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-3xl border border-amber-100 dark:border-slate-700/80 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                  Thánh Lễ Sắp Tới
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {liturgies[0].title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {liturgies[0].service_date} lúc {liturgies[0].service_time} tại {liturgies[0].location}
                </p>
              </div>

              <Button size="sm" variant="outline" onClick={() => onPageChange('liturgy')}>
                Chi tiết tất cả bài hát
              </Button>
            </div>

            {/* 6 SONGS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(liturgies[0].songs).map(([pos, songSlot]) => (
                <div key={pos} className="p-3 bg-amber-50/50 dark:bg-slate-900/60 rounded-2xl border border-amber-200/60 dark:border-slate-700 text-xs space-y-1">
                  <div className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase">
                    {pos.replace('_', ' ')}
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {songSlot.song_title || 'Chưa phân công'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {songSlot.composer || '---'}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LỊCH TẬP HÁT & THÔNG BÁO MỚI (TWO-COLUMN) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Lịch tập hát sắp tới</h3>
              </div>
              <button
                onClick={() => onPageChange('rehearsals')}
                className="text-xs font-semibold text-amber-800 dark:text-amber-400 hover:underline"
              >
                Xem tất cả
              </button>
            </div>

            <div className="space-y-3">
              {rehearsals.length === 0 ? (
                <div className="p-5 text-center bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/80 space-y-1">
                  <Calendar className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto" />
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Chưa có lịch tập</div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">Lịch tập mới sẽ được cập nhật tại đây.</p>
                </div>
              ) : rehearsals.map((reh) => (
                <div key={reh.id} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-200 text-slate-900 font-bold flex flex-col items-center justify-center shrink-0 text-xs">
                    <span>{reh.event_date.split('-')[2]}</span>
                    <span className="text-[9px] uppercase font-normal">Thg {reh.event_date.split('-')[1]}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{reh.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {reh.start_time} - {reh.end_time} | {reh.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Thông báo mới nhất</h3>
              </div>
              <button
                onClick={() => onPageChange('announcements')}
                className="text-xs font-semibold text-amber-800 dark:text-amber-400 hover:underline"
              >
                Xem tất cả
              </button>
            </div>

            <div className="space-y-3">
              {announcements.length === 0 ? (
                <div className="p-5 text-center bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/80 space-y-1">
                  <Bell className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto" />
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Chưa có thông báo</div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">Các thông báo mới của ca đoàn sẽ xuất hiện tại đây.</p>
                </div>
              ) : announcements.map((ann) => (
                <div
                  key={ann.id}
                  onClick={() => onPageChange('announcements')}
                  className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-700 hover:bg-amber-50/50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors space-y-1"
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                    {ann.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{ann.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{ann.excerpt}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
