import React, { useState, useEffect } from 'react';
import { LiturgicalService, LiturgicalPosition } from '../../types';
import { dataService } from '../../services/dataService';
import { Button } from '../common/Button';
import { Plus, Check, Calendar, MapPin, Music, X } from 'lucide-react';

export const AdminLiturgyManager: React.FC = () => {
  const [liturgies, setLiturgies] = useState<LiturgicalService[]>(() => dataService.getLiturgies());
  const [assigningPosition, setAssigningPosition] = useState<{ liturgyId: string; position: LiturgicalPosition } | null>(null);

  // Form states for assigned song title and composer
  const [songTitleInput, setSongTitleInput] = useState('');
  const [composerInput, setComposerInput] = useState('');

  useEffect(() => {
    dataService.fetchLiturgies();
    const unsub = dataService.subscribe(() => setLiturgies(dataService.getLiturgies()));
    return () => unsub();
  }, []);

  const reloadData = () => {
    setLiturgies(dataService.getLiturgies());
  };

  const handleOpenAssign = (liturgyId: string, position: LiturgicalPosition) => {
    const target = liturgies.find(l => l.id === liturgyId);
    const existing = target?.songs[position];
    setSongTitleInput(existing?.song_title || '');
    setComposerInput(existing?.composer || '');
    setAssigningPosition({ liturgyId, position });
  };

  const handleSaveSongForPosition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningPosition) return;

    const target = liturgies.find(l => l.id === assigningPosition.liturgyId);
    if (target) {
      const updatedSongs = { ...target.songs };
      updatedSongs[assigningPosition.position] = {
        position: assigningPosition.position,
        song_title: songTitleInput.trim(),
        composer: composerInput.trim()
      };

      dataService.saveLiturgy({
        ...target,
        songs: updatedSongs
      });
      reloadData();
    }
    setAssigningPosition(null);
  };

  const positionLabels: Record<LiturgicalPosition, string> = {
    nhap_le: 'Nhập Lễ',
    dap_ca: 'Đáp Ca',
    alleluia: 'Alleluia',
    dang_le: 'Dâng Lễ',
    hiep_le: 'Hiệp Lễ',
    ket_le: 'Kết Lễ'
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Lịch phụng vụ
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Phân công 6 bài hát phụng vụ cho các Thánh Lễ Ca Đoàn Thiên Thần
          </p>
        </div>

        <Button 
          variant="yellow" 
          size="sm" 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            dataService.saveLiturgy({
              title: `Thánh Lễ Chúa Nhật ${Date.now().toString().slice(-4)}`,
              service_date: new Date().toISOString().substring(0, 10),
              service_time: '17:30',
              location: 'Nhà Thờ Giáo Xứ Bắc Hòa',
              status: 'sap_toi',
              songs: {
                nhap_le: { position: 'nhap_le' },
                dap_ca: { position: 'dap_ca' },
                alleluia: { position: 'alleluia' },
                dang_le: { position: 'dang_le' },
                hiep_le: { position: 'hiep_le' },
                ket_le: { position: 'ket_le' }
              }
            });
            reloadData();
          }}
        >
          Tạo Lễ Mới
        </Button>
      </div>

      {/* SERVICES LIST */}
      <div className="grid grid-cols-1 gap-6">
        {liturgies.map((lit) => (
          <div 
            key={lit.id}
            className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
                  <Calendar className="w-4 h-4" />
                  <span>{lit.service_date} ({lit.service_time})</span>
                  <span className="mx-1">•</span>
                  <MapPin className="w-4 h-4" />
                  <span>{lit.location}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {lit.title}
                </h3>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold self-start sm:self-auto">
                Lịch sắp tới
              </span>
            </div>

            {/* 6 SONG POSITIONS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(['nhap_le', 'dap_ca', 'alleluia', 'dang_le', 'hiep_le', 'ket_le'] as LiturgicalPosition[]).map((pos) => {
                const songSlot = lit.songs[pos];
                const hasSong = Boolean(songSlot?.song_title);
                const isAssigning = assigningPosition?.liturgyId === lit.id && assigningPosition?.position === pos;

                return (
                  <div key={pos} className="space-y-2">
                    <div
                      className={`p-4 rounded-2xl border transition-all ${
                        isAssigning
                          ? 'bg-amber-100/70 border-2 border-amber-400 dark:bg-slate-900'
                          : hasSong
                          ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50'
                          : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/80 border-dashed'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {positionLabels[pos]}
                        </span>
                        {hasSong && !isAssigning && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>

                      {!isAssigning && (
                        <>
                          {hasSong ? (
                            <div>
                              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                                {songSlot.song_title}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Tác giả: {songSlot.composer || 'Khuyết danh'}
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-slate-400 italic">Chưa gán bài hát</div>
                          )}

                          <div className="mt-3">
                            <Button
                              size="sm"
                              variant={hasSong ? 'outline' : 'yellow'}
                              className="w-full text-xs"
                              onClick={() => handleOpenAssign(lit.id, pos)}
                            >
                              {hasSong ? 'Sửa bài hát' : '+ Phân công bài hát'}
                            </Button>
                          </div>
                        </>
                      )}

                      {/* INLINE ASSIGNMENT FORM (Directly inside slot, NO modal popup, NO backdrop) */}
                      {isAssigning && (
                        <form onSubmit={handleSaveSongForPosition} className="space-y-3 pt-1 text-xs">
                          <div className="flex items-center justify-between pb-1 border-b border-amber-200">
                            <span className="font-bold text-amber-900 flex items-center gap-1">
                              <Music className="w-3.5 h-3.5" /> Phân công {positionLabels[pos]}
                            </span>
                            <button
                              type="button"
                              onClick={() => setAssigningPosition(null)}
                              className="text-slate-400 hover:text-slate-600 p-0.5"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold mb-1">Tên bài hát *</label>
                            <input
                              type="text"
                              value={songTitleInput}
                              onChange={(e) => setSongTitleInput(e.target.value)}
                              placeholder="Ví dụ: Về Nơi Đây, Thánh Vịnh 22..."
                              className="w-full p-2 text-xs bg-white dark:bg-slate-800 border border-amber-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400"
                              required
                              autoFocus
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold mb-1">Tác giả</label>
                            <input
                              type="text"
                              value={composerInput}
                              onChange={(e) => setComposerInput(e.target.value)}
                              placeholder="Ví dụ: Lm. Kim Long..."
                              className="w-full p-2 text-xs bg-white dark:bg-slate-800 border border-amber-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400"
                            />
                          </div>

                          <div className="flex justify-end gap-1.5 pt-1">
                            <Button type="button" variant="outline" size="sm" className="text-[11px] py-1 px-2.5" onClick={() => setAssigningPosition(null)}>Hủy</Button>
                            <Button type="submit" variant="yellow" size="sm" className="text-[11px] py-1 px-2.5">Lưu bài hát</Button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
