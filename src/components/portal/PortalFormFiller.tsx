import React, { useState } from 'react';
import { DynamicForm } from '../../types';
import { dataService } from '../../services/dataService';
import { Button } from '../common/Button';
import { CheckCircle2, ArrowLeft, FileText } from 'lucide-react';

interface PortalFormFillerProps {
  form: DynamicForm;
  onBack: () => void;
}

export const PortalFormFiller: React.FC<PortalFormFillerProps> = ({ form, onBack }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      dataService.submitFormResponse(form.id, form.title, answers);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Đã gửi thông tin thành công</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Cảm ơn bạn đã gửi phản hồi cho biểu mẫu "{form.title}". Ban Điều Hành Ca Đoàn Thiên Thần sẽ ghi nhận và phản hồi sớm nhất.
        </p>
        <Button variant="yellow" onClick={onBack}>
          Quay lại trang chủ
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <Button size="sm" variant="outline" icon={<ArrowLeft className="w-4 h-4" />} onClick={onBack}>
        Quay lại
      </Button>

      <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-amber-100 dark:border-slate-800 shadow-md space-y-6">
        <div className="text-center pb-6 border-b border-slate-100 dark:border-slate-800 space-y-2">
          <div className="w-12 h-12 rounded-full border border-amber-300/80 bg-amber-50 dark:bg-slate-800 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
            <FileText className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-amber-800 dark:text-amber-400">Ca Đoàn Thiên Thần — Giáo Xứ Bắc Hòa</span>
          <h1 className="text-2xl font-extrabold text-slate-900">{form.title}</h1>
          {form.description && <p className="text-xs text-slate-500">{form.description}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {form.fields.map((f) => (
            <div key={f.id} className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-800">
                {f.label} {f.is_required && <span className="text-red-500">*</span>}
              </label>

              {f.field_type === 'textarea' ? (
                <textarea
                  required={f.is_required}
                  value={answers[f.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [f.id]: e.target.value })}
                  placeholder={f.placeholder}
                  rows={3}
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-300 focus:outline-none"
                />
              ) : (
                <input
                  type={f.field_type === 'phone' ? 'tel' : f.field_type}
                  required={f.is_required}
                  value={answers[f.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [f.id]: e.target.value })}
                  placeholder={f.placeholder}
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-300 focus:outline-none"
                />
              )}
            </div>
          ))}

          <div className="pt-4">
            <Button
              type="submit"
              variant="yellow"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
            >
              Gửi phản hồi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
