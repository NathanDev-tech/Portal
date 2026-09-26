import React, { useState, useEffect } from 'react';
import { RehearsalSchedule } from '../../types';
import { dataService } from '../../services/dataService';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Calendar as CalendarIcon, Clock, MapPin, Plus } from 'lucide-react';

export const AdminScheduleManager: React.FC = () => {
  const [rehearsals, setRehearsals] = useState<RehearsalSchedule[]>(() => dataService.getRehearsals());
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('19:30');
  const [endTime, setEndTime] = useState('21:00');
  const [location, setLocation] = useState('Phòng Tập Ca Đoàn - Giáo Xứ Bắc Hòa');
  const [description, setDescription] = useState('');

  useEffect(() => {
    dataService.fetchRehearsals();
    const unsub = dataService.subscribe(() => setRehearsals(dataService.getRehearsals()));
    return () => unsub();
  }, []);

  const reloadData = () => setRehearsals(dataService.getRehearsals());

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !eventDate) return;

    dataService.saveRehearsal({
      title: title.trim(),
      event_date: eventDate,
      start_time: startTime,
      end_time: endTime,
      location,
      description,
      status: 'sap_toi'
    });

    reloadData();
    setIsFormOpen(false);
    // Reset form
    setTitle('');
    setEventDate('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Lịch tập ca đoàn</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Quản lý lịch tập hát luyện giọng và chuẩn bị Phụng Vụ</p>
        </div>
        <Button
          variant="yellow"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsFormOpen(true)}
        >
          Tạo lịch tập mới
        </Button>
      </div>

      {/* DIALOG ON CLICK (ShowDialog without dimmed backdrop overlay) */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Tạo lịch tập hát mới"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Tên buổi tập *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Buổi tập Phụng Vụ Lễ Chúa Nhật..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Ngày tập *</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Giờ bắt đầu</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Giờ kết thúc</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Địa điểm tập</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Nội dung / Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Tập hát các bài Nhập Lễ, Đáp Ca..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsFormOpen(false)}>Hủy</Button>
            <Button type="submit" variant="yellow" size="sm">Lưu lịch tập</Button>
          </div>
        </form>
      </Modal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REHEARSALS LIST */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Danh sách buổi tập</h3>
          {rehearsals.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 text-slate-400 text-xs">
              Chưa có lịch tập nào. Hãy bấm "Tạo lịch tập mới" ở trên để thêm.
            </div>
          ) : rehearsals.map((reh) => (
            <div key={reh.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 shadow-xs flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-200 text-slate-900 font-bold flex flex-col items-center justify-center shrink-0">
                  <span className="text-base">{reh.event_date.split('-')[2]}</span>
                  <span className="text-[10px] uppercase font-normal">Thg {reh.event_date.split('-')[1]}</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{reh.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {reh.start_time} - {reh.end_time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {reh.location}</span>
                  </p>
                  {reh.description && <p className="text-xs text-slate-600 italic mt-2">"{reh.description}"</p>}
                </div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold shrink-0">
                Sắp diễn ra
              </span>
            </div>
          ))}
        </div>

        {/* SIDEBAR CALENDAR INFO */}
        <div className="p-5 bg-gradient-to-br from-amber-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
            <CalendarIcon className="w-5 h-5" />
            <span>Lịch cố định hàng tuần</span>
          </div>
          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-amber-100">
              <div className="font-bold text-slate-900 dark:text-slate-100">Buổi tập Tối Thứ Năm</div>
              <div>• Giờ: 19:30 - 21:00</div>
              <div>• Địa điểm: Phòng tập Ca đoàn</div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-amber-100">
              <div className="font-bold text-slate-900 dark:text-slate-100">Buổi tập Tối Thứ Bảy</div>
              <div>• Giờ: 19:30 - 21:00</div>
              <div>• Địa điểm: Ca đoàn đài trên Nhà Thờ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
