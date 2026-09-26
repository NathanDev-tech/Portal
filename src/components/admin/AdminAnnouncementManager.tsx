import React, { useState, useEffect } from 'react';
import { Announcement, AnnouncementCategory } from '../../types';
import { dataService } from '../../services/dataService';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { FilterPill } from '../common/SearchInput';
import { ImageUploader } from '../common/ImageUploader';
import { Plus, Pin, Star, Edit2, Trash2 } from 'lucide-react';

export const AdminAnnouncementManager: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => dataService.getAnnouncements());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);

  // Confirm Delete Dialog state
  const [deletingAnn, setDeletingAnn] = useState<Announcement | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('Thông Báo Chung');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isImportant, setIsImportant] = useState(false);

  useEffect(() => {
    dataService.fetchAnnouncements();
    const unsub = dataService.subscribe(() => setAnnouncements(dataService.getAnnouncements()));
    return () => unsub();
  }, []);

  const reloadData = () => setAnnouncements(dataService.getAnnouncements());

  const handleOpenForm = (ann?: Announcement) => {
    if (ann) {
      setEditingAnn(ann);
      setTitle(ann.title);
      setCategory(ann.category);
      setExcerpt(ann.excerpt);
      setContent(ann.content);
      setCoverImage(ann.cover_image || '');
      setIsPinned(ann.is_pinned);
      setIsImportant(ann.is_important);
    } else {
      setEditingAnn(null);
      setTitle('');
      setCategory('Thông Báo Chung');
      setExcerpt('');
      setContent('');
      setCoverImage('');
      setIsPinned(false);
      setIsImportant(false);
    }
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await dataService.saveAnnouncement({
      id: editingAnn?.id,
      title: title.trim(),
      slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      category,
      excerpt: excerpt.trim(),
      content: content.trim(),
      cover_image: coverImage.trim() || undefined,
      is_pinned: isPinned,
      is_important: isImportant,
      published_date: new Date().toISOString().substring(0, 10),
      author_name: 'Ban Điều Hành',
      status: 'published'
    });

    reloadData();
    setIsFormOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAnn) return;
    await dataService.deleteAnnouncement(deletingAnn.id);
    setDeletingAnn(null);
    reloadData();
  };

  const filtered = announcements.filter(a => statusFilter === 'all' || a.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Thông báo</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Quản lý bài viết và thông báo tin tức ca đoàn</p>
        </div>
        <Button
          variant="yellow"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => handleOpenForm()}
        >
          Tạo thông báo mới
        </Button>
      </div>

      {/* DIALOG ON CLICK (ShowDialog without dark backdrop overlay) */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingAnn ? 'Sửa thông báo' : 'Tạo thông báo mới'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Tiêu đề thông báo *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Nhập tiêu đề bài viết..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Danh mục thông báo</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
            >
              <option value="Lịch Tập">Lịch Tập</option>
              <option value="Thánh Lễ">Thánh Lễ</option>
              <option value="Sinh Hoạt">Sinh Hoạt</option>
              <option value="Thông Báo Chung">Thông Báo Chung</option>
            </select>
          </div>

          <ImageUploader
            value={coverImage}
            onChange={setCoverImage}
            label="Ảnh Cover bài viết"
            helpText="Tải ảnh bìa cho bài viết (JPEG, PNG, WEBP). Tự động tối ưu dung lượng."
          />
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Tóm tắt ngắn</label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Nội dung tóm tắt hiển thị ngoài danh sách..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Nội dung chi tiết</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="Nội dung đầy đủ của thông báo..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>
          <div className="flex gap-4 p-3 bg-amber-50/60 dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-slate-700">
            <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
              <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} className="rounded text-amber-600" /> Ghim lên đầu
            </label>
            <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
              <input type="checkbox" checked={isImportant} onChange={(e) => setIsImportant(e.target.checked)} className="rounded text-red-600" /> Đánh dấu quan trọng
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsFormOpen(false)}>Hủy</Button>
            <Button type="submit" variant="yellow" size="sm">Xuất bản thông báo</Button>
          </div>
        </form>
      </Modal>

      <div className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-2">
        <FilterPill label="Tất cả" isActive={statusFilter === 'all'} onClick={() => setStatusFilter('all')} count={announcements.length} />
        <FilterPill label="Đã xuất bản" isActive={statusFilter === 'published'} onClick={() => setStatusFilter('published')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((a) => (
          <div key={a.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {a.is_pinned && <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-200 text-slate-900 rounded-full flex items-center gap-1"><Pin className="w-3 h-3" /> Ghim</span>}
                {a.is_important && <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-800 rounded-full flex items-center gap-1"><Star className="w-3 h-3" /> Quan trọng</span>}
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{a.category}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{a.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{a.excerpt}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-[10px] text-slate-400">Đăng ngày {a.published_date}</span>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => handleOpenForm(a)}><Edit2 className="w-3.5 h-3.5" /></Button>
                <Button size="sm" variant="ghost" className="text-red-500" onClick={() => setDeletingAnn(a)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={Boolean(deletingAnn)}
        onClose={() => setDeletingAnn(null)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa thông báo"
        description={`Bạn có chắc chắn muốn xóa bài viết "${deletingAnn?.title}" không?`}
        confirmLabel="Đồng ý xóa"
      />
    </div>
  );
};
