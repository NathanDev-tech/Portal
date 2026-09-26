import React, { useState } from 'react';
import { Announcement } from '../../types';
import { dataService } from '../../services/dataService';
import { Button } from '../common/Button';
import { Calendar, User, ArrowLeft } from 'lucide-react';

export const PortalAnnouncements: React.FC<{
  onSelectAnn?: (ann: Announcement) => void;
}> = () => {
  const announcements = dataService.getAnnouncements().filter(a => a.status === 'published');
  const [selectedAnn, setSelectedAnn] = useState<Announcement | null>(null);

  if (selectedAnn) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <Button size="sm" variant="outline" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => setSelectedAnn(null)}>
          Quay lại danh sách thông báo
        </Button>

        <article className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-amber-100 dark:border-slate-700/80 shadow-md space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
              {selectedAnn.category}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{selectedAnn.title}</h1>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {selectedAnn.published_date}</span>
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> {selectedAnn.author_name}</span>
            </div>
          </div>

          {selectedAnn.cover_image && (
            <div className="h-64 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900">
              <img src={selectedAnn.cover_image} alt={selectedAnn.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose max-w-none text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans text-sm sm:text-base">
            {selectedAnn.content}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Thông báo ca đoàn</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tin tức sinh hoạt và phụng vụ từ Ban Điều Hành Ca Đoàn Thiên Thần</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            onClick={() => setSelectedAnn(ann)}
            className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {ann.is_pinned && <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-200 text-slate-900 rounded-full">Ghim</span>}
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
                  {ann.category}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2">{ann.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">{ann.excerpt}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{ann.published_date}</span>
              <span className="font-semibold text-amber-800 dark:text-amber-400">Đọc bài viết →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
