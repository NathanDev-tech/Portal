import React, { useState, useEffect } from 'react';
import { Member } from '../../types';
import { dataService, ALLOWED_DUTIES, ALLOWED_CATECHISM_CLASSES } from '../../services/dataService';
import { SearchInput, FilterPill } from '../common/SearchInput';
import { Button } from '../common/Button';
import { AdminMemberFormModal } from './AdminMemberFormModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { MemberProfilePopover } from '../common/MemberProfilePopover';
import { UserPlus, Download, Edit2, Trash2, Shield, X } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

const getBirthYear = (dateStr?: string) => {
  if (!dateStr || !dateStr.trim()) return '—';
  const year = dateStr.split('-')[0];
  if (year && year.length === 4 && !isNaN(Number(year))) {
    return year;
  }
  const parts = dateStr.split('/');
  if (parts.length === 3 && parts[2].length === 4) {
    return parts[2];
  }
  return '—';
};

export const AdminMemberManager: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(() => dataService.getMembers());
  const [search, setSearch] = useState('');
  const [dutyFilter, setDutyFilter] = useState<string>('all');
  const [catechismFilter, setCatechismFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  // ANCHORED PROFILE POPOVER STATE
  const [popoverMember, setPopoverMember] = useState<Member | null>(null);
  const [popoverTrigger, setPopoverTrigger] = useState<HTMLElement | null>(null);

  useEffect(() => {
    dataService.fetchMembers();
    const unsub = dataService.subscribe(() => setMembers(dataService.getMembers()));
    return () => unsub();
  }, []);

  const reloadData = () => setMembers(dataService.getMembers());

  const handleSaveMember = async (data: Omit<Member, 'id'> & { id?: string }) => {
    await dataService.saveMember(data);
    reloadData();
    setIsFormOpen(false);
    setEditingMember(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingMemberId) return;
    await dataService.deleteMember(deletingMemberId);
    setSelectedIds(selectedIds.filter(i => i !== deletingMemberId));
    setDeletingMemberId(null);
    reloadData();
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === filteredMembers.length ? [] : filteredMembers.map(m => m.id));
  };

  const handleExportCSV = () => {
    const csvHeader = "ID,Tên Thánh,Họ và Tên,Năm Sinh,Lớp Giáo Lý,Số Điện Thoại,Bổn Phận\n";
    const csvRows = members.map(m =>
      `"${m.id}","${m.holy_name}","${m.full_name}","${getBirthYear(m.birth_date)}","${m.catechism_class || 'Chưa cập nhật'}","${m.phone}","${m.duty}"`
    ).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `danh_sach_ca_vien_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMembers = members
    .filter(m => {
      const query = search.toLowerCase();
      const matchSearch =
        (m.full_name || '').toLowerCase().includes(query) ||
        (m.holy_name || '').toLowerCase().includes(query) ||
        (m.phone || '').includes(query) ||
        (m.catechism_class || '').toLowerCase().includes(query) ||
        (m.duty || '').toLowerCase().includes(query);

      const matchDuty = dutyFilter === 'all' || m.duty === dutyFilter;
      const matchCatechism = catechismFilter === 'all' || m.catechism_class === catechismFilter;

      return matchSearch && matchDuty && matchCatechism;
    })
    .sort((a, b) => {
      const nameA = (a.full_name || '').trim();
      const nameB = (b.full_name || '').trim();
      const cmp = nameA.localeCompare(nameB, 'vi', { sensitivity: 'base' });
      if (cmp !== 0) return cmp;

      const holyA = (a.holy_name || '').trim();
      const holyB = (b.holy_name || '').trim();
      const holyCmp = holyA.localeCompare(holyB, 'vi', { sensitivity: 'base' });
      if (holyCmp !== 0) return holyCmp;

      return (a.id || '').localeCompare(b.id || '');
    });

  const deletingMember = members.find(m => m.id === deletingMemberId) || null;

  const openEdit = (m: Member) => {
    setEditingMember(m);
    setIsFormOpen(true);
    setDeletingMemberId(null);
  };

  const openDelete = (id: string) => {
    setDeletingMemberId(id);
    setIsFormOpen(false);
    setEditingMember(null);
  };

  const openProfilePopover = (m: Member, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (popoverMember?.id === m.id) {
      setPopoverMember(null);
      setPopoverTrigger(null);
    } else {
      setPopoverMember(m);
      setPopoverTrigger(e.currentTarget);
    }
  };

  return (
    <div className="space-y-4">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Ca viên</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Danh sách và thông tin ca viên Ca Đoàn Thiên Thần — Giáo Xứ Bắc Hòa (Bấm vào Tên/Ảnh ca viên để xem Popover)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />} onClick={handleExportCSV}>
            Xuất CSV
          </Button>
          <Button
            variant="yellow"
            size="sm"
            icon={isFormOpen && !editingMember ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            onClick={() => {
              if (isFormOpen) {
                setIsFormOpen(false);
                setEditingMember(null);
              } else {
                setEditingMember(null);
                setIsFormOpen(true);
                setDeletingMemberId(null);
              }
            }}
          >
            {isFormOpen && !editingMember ? 'Đóng form' : 'Thêm ca viên'}
          </Button>
        </div>
      </div>

      {/* FORM MODAL PANEL */}
      <AdminMemberFormModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingMember(null); }}
        onSave={handleSaveMember}
        initialMember={editingMember}
      />

      {/* CONFIRM DELETE PANEL */}
      {deletingMember && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeletingMemberId(null)}
          onConfirm={handleConfirmDelete}
          title="Xác nhận xóa ca viên"
          description={`Bạn có chắc chắn muốn xóa ca viên "${deletingMember.holy_name} ${deletingMember.full_name}" khỏi danh sách Ca Đoàn Thiên Thần?`}
          confirmLabel="Đồng ý xóa"
          cancelLabel="Hủy bỏ"
          variant="danger"
        />
      )}

      {/* ANCHORED CONTEXTUAL PROFILE POPOVER (No backdrop overlay, aligned to clicked element) */}
      <MemberProfilePopover
        member={popoverMember}
        triggerElement={popoverTrigger}
        onClose={() => { setPopoverMember(null); setPopoverTrigger(null); }}
        onEdit={(m) => openEdit(m)}
      />

      {/* SEARCH & FILTER CONTROL BAR */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Tìm theo Tên Thánh, Họ tên, SĐT, Lớp Giáo Lý, Bổn Phận..."
            />
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Tổng số: <span className="text-slate-900 dark:text-slate-100 font-bold">{filteredMembers.length}</span> ca viên
          </div>
        </div>

        {/* BỔN PHẬN FILTER */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
          <span className="text-slate-400 font-semibold shrink-0 mr-1">Bổn Phận:</span>
          <FilterPill label="Tất cả" isActive={dutyFilter === 'all'} onClick={() => setDutyFilter('all')} count={members.length} />
          {ALLOWED_DUTIES.map(d => (
            <FilterPill
              key={d}
              label={d}
              isActive={dutyFilter === d}
              onClick={() => setDutyFilter(d)}
              count={members.filter(m => m.duty === d).length}
            />
          ))}
        </div>

        {/* LỚP GIÁO LÝ FILTER */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-100 dark:border-slate-700/60 text-xs">
          <span className="text-slate-400 font-semibold shrink-0 mr-1">Lớp Giáo Lý:</span>
          <FilterPill label="Tất cả" isActive={catechismFilter === 'all'} onClick={() => setCatechismFilter('all')} count={members.length} />
          {ALLOWED_CATECHISM_CLASSES.map(c => (
            <FilterPill
              key={c}
              label={c}
              isActive={catechismFilter === c}
              onClick={() => setCatechismFilter(c)}
              count={members.filter(m => m.catechism_class === c).length}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP DATA TABLE */}
      <div className="hidden md:block bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-semibold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30">
                <th className="p-4 pl-6 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filteredMembers.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                  />
                </th>
                <th className="p-4">Tên Thánh</th>
                <th className="p-4">Họ và Tên</th>
                <th className="p-4">Năm sinh</th>
                <th className="p-4">Lớp Giáo Lý</th>
                <th className="p-4">Số điện thoại</th>
                <th className="p-4">Bổn phận</th>
                <th className="p-4 pr-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center">
                    <EmptyState title="Chưa có dữ liệu ca viên" description="Thêm ca viên mới hoặc tìm từ khóa khác." />
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => {
                  const isSelected = selectedIds.includes(m.id);
                  const isActiveEdit = editingMember?.id === m.id && isFormOpen;
                  const isActiveDelete = deletingMemberId === m.id;
                  const isPopoverOpen = popoverMember?.id === m.id;

                  return (
                    <tr
                      key={m.id}
                      className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-700/40 ${
                        isSelected ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''
                      } ${isActiveEdit ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''} ${isActiveDelete ? 'bg-rose-50/30 dark:bg-rose-950/10' : ''} ${isPopoverOpen ? 'bg-amber-100/40 dark:bg-amber-950/30' : ''}`}
                    >
                      <td className="p-4 pl-6">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(m.id)}
                          className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                        />
                      </td>

                      {/* TÊN THÁNH + AVATAR TRIGGER */}
                      <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">
                        <button
                          type="button"
                          onClick={(e) => openProfilePopover(m, e)}
                          className="flex items-center gap-2 hover:text-amber-600 transition-colors text-left group"
                          title="Bấm để xem Cửa sổ thông tin ca viên"
                        >
                          <div className="w-7 h-7 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-300 group-hover:scale-105 transition-transform overflow-hidden">
                            {m.avatar_url ? (
                              <img src={m.avatar_url} alt={m.full_name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{m.holy_name ? m.holy_name[0] : m.full_name[0]}</span>
                            )}
                          </div>
                          <span className="group-hover:underline">{m.holy_name}</span>
                        </button>
                      </td>

                      {/* HỌ VÀ TÊN TRIGGER */}
                      <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                        <button
                          type="button"
                          onClick={(e) => openProfilePopover(m, e)}
                          className="hover:text-amber-600 hover:underline transition-colors text-left"
                          title="Bấm để xem Cửa sổ thông tin ca viên"
                        >
                          {m.full_name}
                        </button>
                      </td>

                      {/* NĂM SINH */}
                      <td className="p-4 text-slate-700 dark:text-slate-300 font-mono">
                        {getBirthYear(m.birth_date)}
                      </td>

                      {/* LỚP GIÁO LÝ */}
                      <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">
                        {m.catechism_class || 'Chưa cập nhật'}
                      </td>

                      {/* SỐ ĐIỆN THOẠI */}
                      <td className="p-4 font-mono text-slate-700 dark:text-slate-300">{m.phone}</td>

                      {/* BỔN PHẬN */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                          {m.duty === 'Ban Điều Hành' && <Shield className="w-3.5 h-3.5 text-amber-600" />}
                          {m.duty}
                        </span>
                      </td>

                      {/* THAO TÁC */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => isActiveEdit ? (setIsFormOpen(false), setEditingMember(null)) : openEdit(m)}
                            className={`p-1.5 rounded-lg transition-colors ${isActiveEdit ? 'text-amber-700 bg-amber-100' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'}`}
                            title="Sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => isActiveDelete ? setDeletingMemberId(null) : openDelete(m.id)}
                            className={`p-1.5 rounded-lg transition-colors ${isActiveDelete ? 'text-rose-700 bg-rose-100' : 'text-rose-500 hover:bg-rose-50'}`}
                            title="Xóa ca viên này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARDS VIEW WITH POPOVER TRIGGER */}
      <div className="md:hidden space-y-3">
        {filteredMembers.map((m) => {
          const isActiveEdit = editingMember?.id === m.id && isFormOpen;
          const isActiveDelete = deletingMemberId === m.id;

          return (
            <div key={m.id} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => openProfilePopover(m, e)}
                  className="flex items-center gap-2.5 text-left group"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-300 overflow-hidden">
                    {m.avatar_url ? (
                      <img src={m.avatar_url} alt={m.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{m.holy_name ? m.holy_name[0] : m.full_name[0]}</span>
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-amber-800 dark:text-amber-300 font-semibold group-hover:underline">{m.holy_name}</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600">{m.full_name}</div>
                  </div>
                </button>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
                  {m.catechism_class || 'Chưa cập nhật'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 block">Năm sinh:</span>
                  <span className="font-mono font-semibold">{getBirthYear(m.birth_date)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">SĐT:</span>
                  <span className="font-mono font-semibold">{m.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Bổn phận:</span>
                  <span className="font-semibold truncate block">{m.duty}</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                <Button
                  size="sm"
                  variant={isActiveEdit ? 'yellow' : 'outline'}
                  icon={<Edit2 className="w-3.5 h-3.5" />}
                  onClick={() => isActiveEdit ? (setIsFormOpen(false), setEditingMember(null)) : openEdit(m)}
                >
                  {isActiveEdit ? 'Đóng' : 'Sửa'}
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={() => isActiveDelete ? setDeletingMemberId(null) : openDelete(m.id)}
                >
                  {isActiveDelete ? 'Hủy xóa' : 'Xóa'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
