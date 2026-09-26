import React, { useState } from 'react';
import { DynamicForm, FormField, FieldType } from '../../types';
import { dataService } from '../../services/dataService';
import { Button } from '../common/Button';
import { Plus, Trash2, ArrowUp, ArrowDown, Eye, Copy, Check, Settings, Share2 } from 'lucide-react';

export const AdminFormBuilder: React.FC = () => {
  const [forms, setForms] = useState<DynamicForm[]>(() => dataService.getForms());
  const [activeFormId, setActiveFormId] = useState<string>(forms[0]?.id || '');
  const [copiedLink, setCopiedLink] = useState(false);

  const activeForm = forms.find(f => f.id === activeFormId) || forms[0];
  const [selectedFieldId, setSelectedFieldId] = useState<string>(activeForm?.fields[0]?.id || '');

  const selectedField = activeForm?.fields.find(f => f.id === selectedFieldId) || activeForm?.fields[0];

  const reloadForms = () => {
    setForms(dataService.getForms());
  };

  const handleAddField = () => {
    if (!activeForm) return;
    const newField: FormField = {
      id: `f-${Date.now()}`,
      label: 'Câu hỏi mới',
      field_type: 'text',
      placeholder: 'Nhập câu trả lời...',
      is_required: false,
      sort_order: activeForm.fields.length + 1
    };

    const updated = {
      ...activeForm,
      fields: [...activeForm.fields, newField]
    };

    dataService.saveForm(updated);
    reloadForms();
    setSelectedFieldId(newField.id);
  };

  const handleUpdateField = (updates: Partial<FormField>) => {
    if (!activeForm || !selectedField) return;
    const updatedFields = activeForm.fields.map(f => f.id === selectedField.id ? { ...f, ...updates } : f);
    const updatedForm = { ...activeForm, fields: updatedFields };
    dataService.saveForm(updatedForm);
    reloadForms();
  };

  const handleDeleteField = (fieldId: string) => {
    if (!activeForm) return;
    const updatedFields = activeForm.fields.filter(f => f.id !== fieldId);
    const updatedForm = { ...activeForm, fields: updatedFields };
    dataService.saveForm(updatedForm);
    reloadForms();
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(updatedFields[0]?.id || '');
    }
  };

  const handleMoveField = (fieldId: string, direction: 'up' | 'down') => {
    if (!activeForm) return;
    const idx = activeForm.fields.findIndex(f => f.id === fieldId);
    if (idx < 0) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === activeForm.fields.length - 1) return;

    const newFields = [...activeForm.fields];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const temp = newFields[idx];
    newFields[idx] = newFields[targetIdx];
    newFields[targetIdx] = temp;

    dataService.saveForm({ ...activeForm, fields: newFields });
    reloadForms();
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/portal/forms/${activeForm.slug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!activeForm) {
    return <div>Chưa có biểu mẫu nào.</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{activeForm.title}</h2>
            <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
              activeForm.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
            }`}>
              {activeForm.is_active ? 'Đang mở' : 'Đã đóng'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Mã chia sẻ: <code className="font-bold text-amber-700">{activeForm.share_code}</code> | Phản hồi: {activeForm.responses_count}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" icon={copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />} onClick={copyShareLink}>
            {copiedLink ? 'Đã sao chép link' : 'Sao chép link'}
          </Button>
          <Button size="sm" variant="yellow" icon={<Plus className="w-4 h-4" />} onClick={handleAddField}>
            Thêm câu hỏi
          </Button>
        </div>
      </div>

      {/* 3-COLUMN FORM BUILDER LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: STRUCTURE (3 cols) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Cấu trúc câu hỏi</h3>

          <div className="space-y-2">
            {activeForm.fields.map((f, idx) => {
              const isSelected = selectedFieldId === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => setSelectedFieldId(f.id)}
                  className={`p-3 rounded-2xl cursor-pointer border text-xs flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-amber-100/80 dark:bg-amber-950/60 border-amber-300 font-bold text-slate-900 dark:text-amber-200 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="text-slate-400 mr-1.5">#{idx + 1}</span>
                    <span>{f.label}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleMoveField(f.id, 'up'); }}
                      className="p-1 hover:bg-slate-200 rounded"
                    >
                      <ArrowUp className="w-3 h-3 text-slate-500" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleMoveField(f.id, 'down'); }}
                      className="p-1 hover:bg-slate-200 rounded"
                    >
                      <ArrowDown className="w-3 h-3 text-slate-500" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER COLUMN: LIVE PREVIEW (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> Live Preview
            </span>
            <span className="text-[10px] text-slate-400">Xem trước hiển thị giao diện</span>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/60 space-y-4">
            <div className="text-center pb-3 border-b">
              <h4 className="text-base font-bold text-[#0B192C] dark:text-slate-100">{activeForm.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{activeForm.description}</p>
            </div>

            {activeForm.fields.map((f) => (
              <div key={f.id} className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {f.label} {f.is_required && <span className="text-red-500">*</span>}
                </label>

                {f.field_type === 'textarea' ? (
                  <textarea placeholder={f.placeholder} rows={2} disabled className="w-full p-2.5 text-xs bg-white border rounded-xl" />
                ) : (
                  <input type={f.field_type} placeholder={f.placeholder} disabled className="w-full p-2.5 text-xs bg-white border rounded-xl" />
                )}
              </div>
            ))}

            <div className="pt-2">
              <Button size="sm" variant="yellow" className="w-full" disabled>
                Gửi câu trả lời (Xem trước)
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FIELD SETTINGS (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-amber-600" /> Cấu hình câu hỏi
            </h3>
            {selectedField && (
              <button
                onClick={() => handleDeleteField(selectedField.id)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                title="Xóa câu hỏi này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {selectedField ? (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Tiêu đề câu hỏi (Label)</label>
                <input
                  type="text"
                  value={selectedField.label}
                  onChange={(e) => handleUpdateField({ label: e.target.value })}
                  className="w-full p-2 text-xs bg-white dark:bg-slate-900 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Loại trường dữ liệu</label>
                <select
                  value={selectedField.field_type}
                  onChange={(e) => handleUpdateField({ field_type: e.target.value as FieldType })}
                  className="w-full p-2 text-xs bg-white dark:bg-slate-900 border rounded-xl"
                >
                  <option value="text">Chữ ngắn (Text)</option>
                  <option value="textarea">Văn bản dài (Textarea)</option>
                  <option value="date">Ngày tháng (Date)</option>
                  <option value="phone">Số điện thoại (Phone)</option>
                  <option value="number">Con số (Number)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Gợi ý nhập (Placeholder)</label>
                <input
                  type="text"
                  value={selectedField.placeholder || ''}
                  onChange={(e) => handleUpdateField({ placeholder: e.target.value })}
                  className="w-full p-2 text-xs bg-white dark:bg-slate-900 border rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                <span className="font-semibold">Bắt buộc trả lời?</span>
                <input
                  type="checkbox"
                  checked={selectedField.is_required}
                  onChange={(e) => handleUpdateField({ is_required: e.target.checked })}
                  className="rounded text-amber-500"
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Vui lòng chọn câu hỏi bên trái để cấu hình.</p>
          )}
        </div>

      </div>
    </div>
  );
};
