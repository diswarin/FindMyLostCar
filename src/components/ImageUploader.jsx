import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';

const ImageUploader = ({ files, setFiles }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      console.log('📸 New files added:', newFiles); // Debug log
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg'],
    },
    maxFiles: 5, // Limit to 5 files
  });

  const removeFile = (fileToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
    URL.revokeObjectURL(fileToRemove.preview);
  };

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <div>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragActive ? 'border-sky-500 bg-sky-50' : 'border-gray-300 hover:border-sky-400'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
        {isDragActive ? (
          <p className="text-sky-600">วางไฟล์ที่นี่...</p>
        ) : (
          <p className="text-gray-500">ลากและวางรูปภาพรถที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
        )}
        <p className="text-xs text-gray-400 mt-1">รองรับไฟล์ PNG, JPG, JPEG (สูงสุด 5MB, อัปโหลดได้สูงสุด 5 ไฟล์)</p>
      </div>
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative aspect-square max-w-[150px]">
              <img
                src={file.preview}
                alt={`preview ${index}`}
                className="w-full h-full object-cover rounded-md"
                onLoad={() => {
                  URL.revokeObjectURL(file.preview);
                }}
              />
              <button
                type="button"
                onClick={() => removeFile(file)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;