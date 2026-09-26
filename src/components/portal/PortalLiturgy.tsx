import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { LiturgicalPosition } from '../../types';

export const PortalLiturgy: React.FC = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = dataService.subscribe(() => setTick(t => t + 1));
    return () => unsub();
  }, []);

  const liturgies = dataService.getLiturgies();

  const positionLabels: Record<LiturgicalPosition, string> = {
    nhap_le: 'Nhập Lễ',
    dap_ca: 'Đáp Ca',
    alleluia: 'Alleluia',
    dang_le: 'Dâng Lễ',
    hiep_le: 'Hiệp Lễ',
    ket_le: 'Kết Lễ'
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Lịch phụng vụ Thánh Lễ</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Danh mục các bài hát phục vụ Thánh Lễ Chúa Nhật và Lễ Trọng</p>
      </div>

      {liturgies.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          <div className="text-4xl mb-3">🎼</div>
          <p>Chưa có lịch phụng vụ nào được đăng.</p>
          <p className="text-xs mt-1">Vui lòng quay lại sau.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {liturgies.map((lit) => (
            <div key={lit.id} className="p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-3xl border border-amber-100 dark:border-slate-700/80 shadow-md space-y-6">
              <div className="border-b border-amber-100 dark:border-slate-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-400">
                    {lit.service_date} lúc {lit.service_time}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{lit.title}</h2>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-semibold self-start sm:self-auto">
                  {lit.location}
                </span>
              </div>

              {/* 6 POSITIONS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(['nhap_le', 'dap_ca', 'alleluia', 'dang_le', 'hiep_le', 'ket_le'] as LiturgicalPosition[]).map((pos) => {
                  const slot = lit.songs[pos];
                  return (
                    <div key={pos} className="p-4 bg-amber-50/50 dark:bg-slate-900/60 rounded-2xl border border-amber-200/60 dark:border-slate-700 space-y-1">
                      <div className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                        {positionLabels[pos]}
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {slot?.song_title || 'Chưa phân công'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {slot?.composer ? `Tác giả: ${slot.composer}` : '---'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {lit.notes && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-xs text-slate-600 dark:text-slate-300 italic border border-slate-100 dark:border-slate-700">
                  Ghi chú: {lit.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
