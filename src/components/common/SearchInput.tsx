import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  className = ''
}) => {
  return (
    <div className={`relative flex items-center min-w-[240px] ${className}`}>
      <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all placeholder:text-slate-400"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

interface FilterPillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}

export const FilterPill: React.FC<FilterPillProps> = ({
  label,
  isActive,
  onClick,
  count
}) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
        isActive
          ? 'bg-[#FEF08A] text-[#0B192C] font-semibold shadow-xs ring-1 ring-amber-300 dark:bg-amber-500/30 dark:text-amber-200 dark:ring-amber-500/50'
          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800'
      }`}
    >
      <span>{label}</span>
      {typeof count === 'number' && (
        <span
          className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            isActive ? 'bg-amber-300 text-slate-900 font-bold' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
