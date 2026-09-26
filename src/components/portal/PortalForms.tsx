import React, { useState, useEffect } from 'react';
import { DynamicForm } from '../../types';
import { dataService } from '../../services/dataService';
import { PortalFormFiller } from './PortalFormFiller';
import { Button } from '../common/Button';
import { ClipboardList, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PortalFormsProps {
  initialForm?: DynamicForm | null;
  onBackHome?: () => void;
}

export const PortalForms: React.FC<PortalFormsProps> = ({ initialForm, onBackHome }) => {
  const [selectedForm, setSelectedForm] = useState<DynamicForm | null>(initialForm || null);
  const [forms, setForms] = useState<DynamicForm[]>(() => dataService.getForms().filter(f => f.is_active));

  useEffect(() => {
    // Synchronize forms from dataService in real-time
    const unsub = dataService.subscribe(() => {
      const activeForms = dataService.getForms().filter(f => f.is_active);
      setForms(activeForms);
      if (selectedForm) {
        const updated = activeForms.find(f => f.id === selectedForm.id);
        if (updated) setSelectedForm(updated);
      }
    });
    return () => unsub();
  }, [selectedForm]);

  // If a form is chosen, render the filler
  if (selectedForm) {
    return (
      <PortalFormFiller
        form={selectedForm}
        onBack={() => setSelectedForm(null)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* HEADER BANNER */}
      <div className="p-8 bg-gradient-to-r from-amber-900 to-amber-950 text-white rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 border border-amber-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-800/60 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Biểu Mẫu & Khảo Sát Ca Đoàn</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-100">
            Biểu Mẫu Trực Tuyến
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/90 max-w-2xl leading-relaxed">
            Danh sách các mẫu khảo sát, đăng ký tham gia hoạt động, đóng góp ý kiến hoặc phản hồi dành cho ca viên và giáo dân.
          </p>
        </div>
      </div>

      {/* FORMS GRID */}
      {forms.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Hiện chưa có biểu mẫu nào đang mở</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Khi Ban Điều Hành đăng các biểu mẫu khảo sát hoặc đăng ký, các thông tin sẽ xuất hiện tại đây.
          </p>
          {onBackHome && (
            <div className="pt-2">
              <Button size="sm" variant="outline" onClick={onBackHome}>
                Quay lại Trang Chủ
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div
              key={form.id}
              className="p-6 bg-white rounded-3xl border border-amber-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Đang tiếp nhận
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {form.fields.length} câu hỏi
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {form.title}
                </h3>

                {form.description && (
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {form.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-amber-800 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Miễn phí & Trực tuyến
                </span>
                <Button
                  variant="yellow"
                  size="sm"
                  icon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => setSelectedForm(form)}
                >
                  Điền ngay
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
