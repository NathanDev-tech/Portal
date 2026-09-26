import React, { useState, useEffect } from 'react';
import { Member, MemberDuty, MemberStatus } from '../../types';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { ImageUploader } from '../common/ImageUploader';

interface AdminMemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Member, 'id'> & { id?: string }) => void;
  initialMember?: Member | null;
}

export const AdminMemberFormModal: React.FC<AdminMemberFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMember
}) => {
  const [holyName, setHolyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [duty, setDuty] = useState<MemberDuty>('Ca Viên');
  const [catechismClass, setCatechismClass] = useState<string>('Chưa cập nhật');
  const [status, setStatus] = useState<MemberStatus>('hoat_dong');
  const [joinedDate, setJoinedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const extractYear = (d?: string) => {
    if (!d || !d.trim()) return '';
    const y = d.split('-')[0].trim();
    return /^\d{4}$/.test(y) ? y : '';
  };

  useEffect(() => {
    if (initialMember) {
      setHolyName(initialMember.holy_name);
      setFullName(initialMember.full_name);
      setBirthYear(extractYear(initialMember.birth_date));
      setPhone(initialMember.phone);
      setAvatarUrl(initialMember.avatar_url || '');
      setDuty(initialMember.duty);
      setCatechismClass(initialMember.catechism_class || 'Chưa cập nhật');
      setStatus(initialMember.status || 'hoat_dong');
      setJoinedDate(initialMember.joined_date || new Date().toISOString().substring(0, 10));
      setNotes(initialMember.notes || '');
    } else {
      setHolyName('');
      setFullName('');
      setBirthYear('');
      setPhone('');
      setAvatarUrl('');
      setDuty('Ca Viên');
      setCatechismClass('Chưa cập nhật');
      setStatus('hoat_dong');
      setJoinedDate(new Date().toISOString().substring(0, 10));
      setNotes('');
    }
    setError('');
  }, [initialMember, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holyName.trim() || !fullName.trim() || !phone.trim()) {
      setError('Vui lòng điền đầy đủ Tên Thánh, Họ tên và Số điện thoại!');
      return;
    }

    if (birthYear && (!/^\d{4}$/.test(birthYear) || Number(birthYear) < 1900 || Number(birthYear) > new Date().getFullYear())) {
      setError('Năm sinh không hợp lệ (phải gồm 4 chữ số, ví dụ 2004)!');
      return;
    }

    onSave({
      id: initialMember?.id,
      holy_name: holyName.trim(),
      full_name: fullName.trim(),
      birth_date: birthYear.trim(),
      phone: phone.trim(),
      avatar_url: avatarUrl.trim() || undefined,
      duty,
      status,
      joined_date: joinedDate || new Date().toISOString().substring(0, 10),
      catechism_class: catechismClass,
      notes: notes.trim()
    });

    onClose();
  };

  const duties: MemberDuty[] = [
    'Ban Điều Hành',
    'Nhạc Công',
    'Thư Ký',
    'Thủ Quỹ',
    'Ca Trưởng',
    'Ca Viên'
  ];

  const catechismOptions = [
    'Xưng Tội',
    'Thêm Sức',
    'Sống Đạo',
    'Vào Đời',
    'GLV/Dự Trưởng',
    'Chưa cập nhật'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialMember ? 'Cập nhật thông tin ca viên' : 'Thêm ca viên mới'}
      subtitle="Quản lý thành viên Ca Đoàn Thiên Thần — Giáo Xứ Bắc Hòa"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <ImageUploader
          value={avatarUrl}
          onChange={setAvatarUrl}
          label="Ảnh chân dung ca viên (tùy chọn)"
          maxWidth={600}
          maxHeight={600}
          helpText="Tải ảnh chân dung rõ mặt ca viên. Tự động nén dung lượng."
        />

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
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-300 focus:outline-none"
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
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-300 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Năm sinh
            </label>
            <input
              type="text"
              value={birthYear}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d{0,4}$/.test(val)) {
                  setBirthYear(val);
                }
              }}
              maxLength={4}
              placeholder="YYYY (ví dụ: 2004)"
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-300 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09xx xxx xxx"
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-300 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Lớp Giáo Lý
            </label>
            <select
              value={catechismClass}
              onChange={(e) => setCatechismClass(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-300 focus:outline-none"
            >
              {catechismOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Bổn phận ca đoàn
            </label>
            <select
              value={duty}
              onChange={(e) => setDuty(e.target.value as MemberDuty)}
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-300 focus:outline-none"
            >
              {duties.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Ghi chú thêm
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Ghi chú quá trình sinh hoạt, sở trường âm nhạc..."
            className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-300 focus:outline-none"
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" variant="yellow">
            Lưu ca viên
          </Button>
        </div>
      </form>
    </Modal>
  );
};
