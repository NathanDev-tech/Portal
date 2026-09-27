import React, { useState } from 'react';
import { dataService } from '../../services/dataService';
import { Button } from '../common/Button';
import { CheckCircle2, UserPlus } from 'lucide-react';

export const PortalRegistration: React.FC = () => {
  const [holyName, setHolyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('2003-01-01');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holyName.trim() || !fullName.trim() || !phone.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      dataService.submitRegistration({
        holy_name: holyName.trim(),
        full_name: fullName.trim(),
        birth_date: birthDate,
        phone: phone.trim(),
        notes: notes.trim()
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Đơn đăng ký của bạn đã được tiếp nhận!</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Cảm ơn bạn đã gửi nguyện vọng gia nhập Ca Đoàn Thiên Thần — Giáo Xứ Bắc Hòa. Ban Điều Hành sẽ liên hệ trực tiếp qua số điện thoại <b>{phone}</b> để phỏng vấn và hẹn buổi sinh hoạt đầu tiên.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">

      {/* LANDING BANNER WITH ARCHANGEL ARTWORK */}
      <div className="relative rounded-3xl overflow-hidden shadow-md bg-[#0B192C] text-white p-8 text-center space-y-4">
       <img
  src={`${import.meta.env.BASE_URL}hero-archangels.jpg`}
  alt="Bổn Mạng Ca Đoàn Thiên Thần"
  className="absolute inset-0 w-full h-full object-cover opacity-40"
/>
        <div className="relative z-10 space-y-3">
          <div className="w-12 h-12 rounded-full border-2 border-amber-300/80 bg-amber-400/20 backdrop-blur-md text-amber-300 flex items-center justify-center mx-auto shadow-md">
            <UserPlus className="w-6 h-6" />
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-amber-300/40">
            <span>Tuyển Ca Viên Mới 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Tham gia Ca Đoàn Thiên Thần
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl mx-auto leading-relaxed">
            Dành cho thiếu nhi thuộc Giáo Xứ Bắc Hòa mong muốn cất tiếng hát phụng vụ Thiên Chúa và tham gia các hoạt động sinh hoạt ca đoàn.
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-amber-100 dark:border-slate-800 shadow-md space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-3">Điền thông tin đăng ký</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tên Thánh <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={holyName}
                onChange={(e) => setHolyName(e.target.value)}
                placeholder="Ví dụ: Giuse, Maria, Teresa..."
                className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-300 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Họ và Tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn Hải"
                className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-300 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-300 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Số điện thoại (Zalo) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xx xxx xxx"
                className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-300 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ghi chú / Đôi lời chia sẻ
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Chia sẻ nguyện vọng hoặc thời gian sinh hoạt của bạn..."
              className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-300 focus:outline-none"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="yellow"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
            >
              Gửi đơn đăng ký tham gia
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
