import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

interface Props {
  onUpload: (url: string) => void;
  buttonText?: string;
  className?: string;
}

const ImageUploader = ({ onUpload, buttonText = 'Upload', className = '' }: Props) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'smartvote');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dki1hiyny/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      onUpload(data.secure_url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <button
        type="button"
        onClick={triggerFileInput}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        disabled={uploading}
      >
        <Upload className="w-4 h-4" />
        {uploading ? 'Uploading...' : buttonText}
      </button>
    </div>
  );
};

export default ImageUploader;