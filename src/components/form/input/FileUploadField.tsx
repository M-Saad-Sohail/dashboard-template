import React from 'react';

interface FileUploadFieldProps {
  label: string;
  name: string;
  accept?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  name,
  accept,
  onChange,
  error,
  helperText,
  required,
}) => {
  return (
    <div className="mb-4.5">
      <label htmlFor={name} className="mb-2.5 block text-sm font-medium text-black dark:text-white">
        {label}
        {required && <span className="text-meta-1">*</span>}
      </label>
      <div className="relative">
        <input
          type="file"
          id={name}
          name={name}
          accept={accept}
          onChange={onChange}
          className={`w-full rounded border-[1.5px] ${
            error 
              ? 'border-meta-1 focus:border-meta-1' 
              : 'border-stroke bg-transparent focus:border-primary'
          } py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white`}
        />
        
        {helperText && !error && (
          <span className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </span>
        )}
        
        {error && (
          <span className="mt-1.5 text-sm text-meta-1">{error}</span>
        )}
      </div>
    </div>
  );
};

export default FileUploadField;
