import { useRef } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud } from 'lucide-react';

const UploadDropzone = ({ onUpload, uploading = false, progress = 0 }) => {
  const inputRef = useRef(null);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length || !onUpload) return;
    onUpload(files);
  };

  return (
    <motion.button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        handleFiles(event.dataTransfer.files);
      }}
      whileHover={{ scale: 1.005 }}
      className="
        group relative w-full overflow-hidden
        rounded-[20px] border-2 border-dashed border-border/70
        bg-slate-50/50 px-4 py-8 sm:py-10
        text-center transition-all duration-200
        hover:border-primary/40 hover:bg-primary/[0.03]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25
      "
    >
      <motion.span
        className="pointer-events-none absolute inset-0 rounded-[20px] border-2 border-dashed border-primary/0"
        whileHover={{ borderColor: 'rgba(37,99,235,0.35)' }}
        animate={{ opacity: [0.4, 0.85, 0.4] }}
        transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
      />
      <span className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-primary ring-1 ring-primary/10 shadow-sm">
        <UploadCloud size={22} strokeWidth={2} />
      </span>
      <p className="relative mt-3 text-[14px] font-semibold text-heading">
        Drop files here or click to upload
      </p>
      <p className="relative mt-1 text-[12.5px] text-secondaryText">
        Upload supports PDF, images, docs, sheets, and code files.
      </p>
      {uploading && (
        <div className="relative mt-4 mx-auto w-full max-w-sm rounded-full bg-slate-200 h-2 overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${Math.max(2, progress)}%` }}
          />
        </div>
      )}
      {uploading && (
        <p className="relative mt-2 text-[11.5px] font-semibold text-primary">
          Uploading... {progress}%
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
    </motion.button>
  );
};

export default UploadDropzone;
