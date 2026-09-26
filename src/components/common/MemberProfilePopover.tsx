import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Member } from '../../types';
import { MemberStatusBadge } from './Badge';
import { Button } from './Button';
import { X, Phone, Calendar, Shield, Edit2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MemberProfilePopoverProps {
  member: Member | null;
  triggerElement: HTMLElement | null;
  onClose: () => void;
  onEdit?: (member: Member) => void;
}

export const MemberProfilePopover: React.FC<MemberProfilePopoverProps> = ({
  member,
  triggerElement,
  onClose,
  onEdit
}) => {
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!member || !triggerElement) return;

    const updatePosition = () => {
      const rect = triggerElement.getBoundingClientRect();
      const popoverWidth = 340;
      const popoverHeight = 360;
      const padding = 12;

      let top = rect.top;
      let left = rect.right + padding;

      // If overflowing right screen boundary, flip to left or bottom
      if (left + popoverWidth > window.innerWidth - padding) {
        if (rect.left - popoverWidth - padding > padding) {
          left = rect.left - popoverWidth - padding;
        } else {
          left = Math.max(padding, Math.min(rect.left, window.innerWidth - popoverWidth - padding));
          top = rect.bottom + padding;
        }
      }

      // Check bottom boundary overflow
      if (top + popoverHeight > window.innerHeight - padding) {
        top = Math.max(padding, window.innerHeight - popoverHeight - padding);
      }

      top = Math.max(padding, top);
      left = Math.max(padding, left);

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [member, triggerElement]);

  useEffect(() => {
    if (!member) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerElement &&
        !triggerElement.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [member, triggerElement, onClose]);

  if (!member || !triggerElement) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        ref={popoverRef}
        initial={{ opacity: 0, scale: 0.94, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: -4 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: '340px',
          zIndex: 60
        }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-amber-300 dark:border-amber-600/80 overflow-hidden flex flex-col text-xs text-slate-800 dark:text-slate-200"
      >
        {/* CARD HEADER */}
        <div className="relative bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white p-4 pb-5">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full bg-black/20 hover:bg-black/40 text-amber-100 hover:text-white transition-colors"
            title="Đóng (Escape)"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 pr-6">
            <div className="w-12 h-12 rounded-full border-2 border-amber-300 bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-base shadow-sm overflow-hidden">
              {member.avatar_url ? (
                <img src={member.avatar_url} alt={member.full_name} className="w-full h-full object-cover" />
              ) : (
                <span>{member.holy_name ? member.holy_name[0] : member.full_name[0]}</span>
              )}
            </div>

            <div className="space-y-0.5 truncate">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                {member.holy_name}
              </span>
              <h3 className="text-base font-extrabold text-white truncate">
                {member.full_name}
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-200/90 font-medium">
                {member.duty === 'Ban Điều Hành' && <Shield className="w-3.5 h-3.5 text-amber-300" />}
                <span>{member.duty}</span>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS VIEW ONLY */}
        <div className="p-4 space-y-3 bg-white dark:bg-slate-900">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-slate-400 font-medium w-24">Năm sinh:</span>
              <span className="font-semibold">
                {(() => {
                  if (!member.birth_date || !member.birth_date.trim()) return '—';
                  const year = member.birth_date.split('-')[0];
                  return year && year.length === 4 ? year : '—';
                })()}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-slate-400 font-medium w-24">Số điện thoại:</span>
              <a href={`tel:${member.phone}`} className="font-mono font-bold text-slate-900 dark:text-slate-100 hover:text-amber-600 underline">
                {member.phone}
              </a>
            </div>

            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-slate-400 font-medium w-24">Lớp Giáo Lý:</span>
              <span className="font-semibold text-amber-800 dark:text-amber-300">
                {member.catechism_class || 'Chưa cập nhật'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-slate-400 font-medium w-24">Bổn phận:</span>
              <span className="font-semibold">{member.duty}</span>
            </div>

            {member.notes && (
              <div className="pt-1">
                <span className="text-slate-400 font-medium text-[10px] block mb-1">Ghi chú sinh hoạt:</span>
                <p className="p-2.5 bg-amber-50/60 dark:bg-slate-800/80 rounded-xl border border-amber-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 italic text-[11px]">
                  "{member.notes}"
                </p>
              </div>
            )}
          </div>

          {/* EDIT BUTTON ACTION */}
          {onEdit && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                size="sm"
                variant="yellow"
                className="w-full"
                icon={<Edit2 className="w-3.5 h-3.5" />}
                onClick={() => {
                  onEdit(member);
                  onClose();
                }}
              >
                Chỉnh sửa
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
