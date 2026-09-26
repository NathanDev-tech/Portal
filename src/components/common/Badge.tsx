import React from 'react';
import { MemberStatus, RegistrationStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'yellow' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full';
  
  const variants = {
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    danger: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
    info: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300',
    yellow: 'bg-yellow-200 text-yellow-900 font-semibold dark:bg-yellow-900/60 dark:text-yellow-200',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs px-3 py-1'
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export const MemberStatusBadge: React.FC<{ status: MemberStatus }> = ({ status }) => {
  switch (status) {
    case 'hoat_dong':
      return <Badge variant="success">• Hoạt động</Badge>;
    case 'tam_nghi':
      return <Badge variant="warning">• Tạm nghỉ</Badge>;
    case 'ngung_phuc_vu':
      return <Badge variant="danger">• Ngưng phục vụ</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

export const RegistrationStatusBadge: React.FC<{ status: RegistrationStatus }> = ({ status }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="warning">Chờ duyệt</Badge>;
    case 'approved':
      return <Badge variant="success">Đã duyệt</Badge>;
    case 'rejected':
      return <Badge variant="danger">Đã từ chối</Badge>;
  }
};
