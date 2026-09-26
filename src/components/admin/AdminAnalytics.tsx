import React from 'react';
import { dataService } from '../../services/dataService';
import { Users, UserCheck, Calendar, FileText, TrendingUp } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const stats = dataService.getStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Thống kê hoạt động</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Báo cáo tổng quan số liệu sinh hoạt Ca Đoàn Thiên Thần</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Tỷ lệ ca viên hoạt động</span>
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {Math.round((stats.active_members / (stats.total_members || 1)) * 100)}%
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full" 
              style={{ width: `${(stats.active_members / (stats.total_members || 1)) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">{stats.active_members} trên tổng số {stats.total_members} ca viên đang phục vụ thường xuyên.</p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Lịch tập sắp tới</span>
            <Calendar className="w-5 h-5 text-sky-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {stats.upcoming_rehearsals} buổi
          </div>
          <p className="text-xs text-slate-500">Buổi tập hát luyện giọng tại Phòng tập Ca đoàn.</p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Đơn gia nhập chờ duyệt</span>
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-800 dark:text-amber-300">
            {stats.pending_registrations} đơn
          </div>
          <p className="text-xs text-slate-500">Cần xem xét và duyệt vào danh sách chính thức.</p>
        </div>
      </div>
    </div>
  );
};
