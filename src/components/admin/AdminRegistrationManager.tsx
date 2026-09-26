import React, { useState, useEffect } from 'react';
import { MemberRegistration, RegistrationStatus } from '../../types';
import { dataService } from '../../services/dataService';
import { RegistrationStatusBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { FilterPill } from '../common/SearchInput';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

export const AdminRegistrationManager: React.FC = () => {
  const [registrations, setRegistrations] = useState<MemberRegistration[]>(() => dataService.getRegistrations());
  const [activeTab, setActiveTab] = useState<RegistrationStatus>('pending');
  const [selectedReg, setSelectedReg] = useState<MemberRegistration | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    dataService.fetchRegistrations();
    const unsub = dataService.subscribe(() => setRegistrations(dataService.getRegistrations()));
    return () => unsub();
  }, []);

  const reloadData = () => {
    setRegistrations(dataService.getRegistrations());
  };

  const handleApprove = (id: string) => {
    dataService.updateRegistrationStatus(id, 'approved', adminNotes);
    reloadData();
    setSelectedReg(null);
  };

  const handleReject = (id: string) => {
    dataService.updateRegistrationStatus(id, 'rejected', adminNotes);
    reloadData();
    setSelectedReg(null);
  };

  const filtered = registrations.filter(r => r.status === activeTab);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Đăng ký gia nhập
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Duyệt danh sách ca viên gửi đơn đăng ký tham gia Ca Đoàn Thiên Thần
          </p>
        </div>
      </div>

      {/* DETAIL DIALOG ON CLICK (No backdrop overlay) */}
      <Modal
        isOpen={Boolean(selectedReg)}
        onClose={() => setSelectedReg(null)}
        title="Chi tiết đơn đăng ký gia nhập"
        subtitle={selectedReg ? `${selectedReg.holy_name} ${selectedReg.full_name}` : ''}
      >
        {selectedReg && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div><span className="text-slate-400 block text-[10px]">Tên Thánh & Họ Tên:</span> <strong className="text-slate-900 dark:text-slate-100">{selectedReg.holy_name} {selectedReg.full_name}</strong></div>
              <div><span className="text-slate-400 block text-[10px]">Ngày sinh:</span> <strong className="text-slate-900 dark:text-slate-100">{selectedReg.birth_date}</strong></div>
              <div><span className="text-slate-400 block text-[10px]">Số điện thoại:</span> <strong className="text-slate-900 dark:text-slate-100">{selectedReg.phone}</strong></div>
              <div><span className="text-slate-400 block text-[10px]">Thời gian gửi đơn:</span> <strong className="text-slate-900 dark:text-slate-100">{selectedReg.submitted_at}</strong></div>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] mb-1">Ghi chú nguyện vọng ca viên:</span>
              <div className="p-3 bg-amber-50/50 dark:bg-slate-900 rounded-xl border border-amber-100 text-slate-700 dark:text-slate-300 italic">
                "{selectedReg.notes || 'Không có ghi chú thêm.'}"
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Ghi chú của Ban Điều Hành:</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={2}
                placeholder="Nhập ghi chú hoặc kết quả phỏng vấn..."
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700">
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedReg(null)}>Đóng</Button>
              {selectedReg.status === 'pending' && (
                <>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<XCircle className="w-4 h-4" />}
                    onClick={() => handleReject(selectedReg.id)}
                  >
                    Từ chối đơn
                  </Button>
                  <Button
                    variant="yellow"
                    size="sm"
                    icon={<CheckCircle className="w-4 h-4" />}
                    onClick={() => handleApprove(selectedReg.id)}
                  >
                    Duyệt & Thêm Ca Viên
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* STATUS TABS */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center gap-2 overflow-x-auto">
        <FilterPill
          label="Chờ duyệt"
          isActive={activeTab === 'pending'}
          onClick={() => { setActiveTab('pending'); setSelectedReg(null); }}
          count={registrations.filter(r => r.status === 'pending').length}
        />
        <FilterPill
          label="Đã duyệt"
          isActive={activeTab === 'approved'}
          onClick={() => { setActiveTab('approved'); setSelectedReg(null); }}
          count={registrations.filter(r => r.status === 'approved').length}
        />
        <FilterPill
          label="Từ chối"
          isActive={activeTab === 'rejected'}
          onClick={() => { setActiveTab('rejected'); setSelectedReg(null); }}
          count={registrations.filter(r => r.status === 'rejected').length}
        />
      </div>

      {/* REGISTRATION CARDS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            Không có đơn đăng ký nào ở trạng thái này.
          </div>
        ) : (
          filtered.map((reg) => {
            return (
              <div key={reg.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                      {reg.holy_name}
                    </span>
                    <RegistrationStatusBadge status={reg.status} />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {reg.full_name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    SĐT: {reg.phone} | Ngày sinh: {reg.birth_date}
                  </p>

                  {reg.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl mt-3 line-clamp-2">
                      "{reg.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Gửi lúc {reg.submitted_at}</span>
                  <Button
                    size="sm"
                    variant="yellow"
                    icon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setSelectedReg(reg);
                      setAdminNotes(reg.admin_notes || '');
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
