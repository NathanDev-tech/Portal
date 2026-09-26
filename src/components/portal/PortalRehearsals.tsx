import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { Clock, MapPin } from 'lucide-react';

export const PortalRehearsals: React.FC = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = dataService.subscribe(() => setTick(t => t + 1));
    return () => unsub();
  }, []);

  const rehearsals = dataService.getRehearsals();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Lịch tập ca đoàn</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Thông tin thời gian & địa điểm tập hát cho quý ca viên</p>
      </div>

      {rehearsals.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          <div className="text-4xl mb-3">🎵</div>
          <p>Chưa có lịch tập nào được đăng.</p>
          <p className="text-xs mt-1">Vui lòng quay lại sau.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rehearsals.map((reh) => (
            <div key={reh.id} className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-200 text-slate-900 font-bold flex flex-col items-center justify-center shrink-0">
                  <span className="text-lg">{reh.event_date.split('-')[2]}</span>
                  <span className="text-[10px] uppercase font-normal">Thg {reh.event_date.split('-')[1]}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{reh.title}</h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 space-y-1">
                    <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" /> {reh.start_time} - {reh.end_time}</div>
                    <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" /> {reh.location}</div>
                  </div>
                </div>
              </div>

              {reh.description && (
                <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-amber-50/50 dark:bg-slate-900/60 p-3 rounded-2xl border border-amber-100 dark:border-slate-700">
                  "{reh.description}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
