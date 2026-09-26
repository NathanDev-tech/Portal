import React from 'react';
import { Button } from '../common/Button';
import { Shield, Church, User, Lock, Cross } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Cài đặt hệ thống</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Thông tin Ca Đoàn Thiên Thần và tài khoản điều hành</p>
      </div>

      <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100 border-b pb-3">
          <Church className="w-5 h-5 text-amber-600" />
          <span>Thông tin Ca Đoàn & Giáo Xứ</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Tên Ca Đoàn</label>
            <input type="text" defaultValue="Ca Đoàn Thiên Thần" className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100" />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Giáo Xứ trực thuộc</label>
            <input type="text" defaultValue="Giáo Xứ Bắc Hòa" className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100" />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Giáo Hạt</label>
            <input type="text" defaultValue="Giáo Hạt Phú Thịnh" className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100" />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Giáo Phận</label>
            <input type="text" defaultValue="Giáo Phận Xuân Lộc" className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100" />
          </div>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100 border-b pb-3">
          <User className="w-5 h-5 text-amber-600" />
          <span>Tài khoản & Phân quyền</span>
        </div>

        <div className="text-xs space-y-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">Ban Điều Hành (admin@bachoa.org)</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Quyền hạn: Full Admin Access (Quản lý ca viên, phụng vụ, biểu mẫu)</div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-200 dark:bg-amber-900/60 text-slate-900 dark:text-amber-200 font-bold text-[10px]">
              ADMIN ROLE
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="yellow">Lưu cài đặt</Button>
      </div>
    </div>
  );
};
