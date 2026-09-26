import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Link as LinkIcon, Check, Trash2, FileImage } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  helpText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = '',
  onChange,
  label = 'Ảnh Cover thông báo',
  maxWidth = 1200,
  maxHeight = 800,
  quality = 0.82,
  helpText = 'Hỗ trợ định dạng JPG, PNG, WEBP. Tự động tối ưu dung lượng.'
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [stats, setStats] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress image client-side using HTML5 Canvas API
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP, GIF).');
      return;
    }

    const origSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    setIsCompressing(true);
    setStats(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio scale
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Fill background white for transparent PNGs converted to JPEG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Export compressed JPEG base64 Data URL
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          const compressedSizeBytes = Math.round((compressedDataUrl.length * 3) / 4);
          const compSizeKB = Math.round(compressedSizeBytes / 1024);

          onChange(compressedDataUrl);
          setIsCompressing(false);
          setStats(`Đã nén tối ưu: ${origSizeMB} MB ➔ ${compSizeKB} KB (${width}x${height}px)`);
        } else {
          // Fallback if canvas context fails
          onChange(e.target?.result as string);
          setIsCompressing(false);
        }
      };

      img.onerror = () => {
        alert('Không thể đọc tập tin ảnh này.');
        setIsCompressing(false);
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processImageFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setStats('Đã áp dụng link ảnh trực tuyến');
    }
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
    setStats(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>{label}</span>
        </label>

        {/* MODE SWITCH TABS */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
              mode === 'upload'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Upload className="w-3 h-3 inline mr-1" />
            Tải ảnh
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
              mode === 'url'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <LinkIcon className="w-3 h-3 inline mr-1" />
            Link URL
          </button>
        </div>
      </div>

      {/* IMAGE PREVIEW DISPLAY (IF HAS IMAGE) */}
      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-amber-200 dark:border-slate-700 bg-slate-900/90 shadow-sm max-h-48 flex items-center justify-center">
          <img
            src={value}
            alt="Preview Cover"
            className="w-full h-44 object-cover object-center group-hover:scale-102 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="px-2 py-0.5 bg-amber-500/90 text-white font-bold rounded-full text-[10px] tracking-wide shadow-xs flex items-center gap-1">
                <Check className="w-3 h-3" /> Đã chọn ảnh
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-full transition-transform hover:scale-110 shadow-md"
                title="Xóa ảnh này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {stats && (
              <p className="text-[10px] text-amber-200 font-medium tracking-tight bg-slate-950/70 p-1.5 rounded-lg border border-white/10 backdrop-blur-xs">
                ✨ {stats}
              </p>
            )}
          </div>
        </div>
      ) : (
        /* UPLOAD / URL CONTAINER WHEN NO IMAGE SELECTED */
        <div className="space-y-2">
          {mode === 'upload' ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-950/30 scale-[1.01]'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 hover:bg-amber-50/40 dark:hover:bg-slate-800/80 hover:border-amber-400'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
              />

              {isCompressing ? (
                <div className="py-2 flex flex-col items-center gap-2 text-amber-600 dark:text-amber-400">
                  <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <span className="font-semibold text-xs">Đang tối ưu & nén dung lượng ảnh...</span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-400 flex items-center justify-center shadow-xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      Kéo & thả ảnh vào đây hoặc <span className="text-amber-800 dark:text-amber-400 underline">Chọn từ máy</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{helpText}</p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Dán đường dẫn URL ảnh (https://...)"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs pl-8"
                />
                <FileImage className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
              </div>
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-2 bg-amber-800 dark:bg-amber-700 text-white rounded-xl font-bold hover:bg-amber-900 transition-colors shrink-0 text-xs"
              >
                Áp dụng
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
