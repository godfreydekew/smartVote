import { useEffect, useRef } from 'react';

type CloudinaryUploadProps = {
  onUploadSuccess: (imageUrl: string) => void;
};

declare global {
  interface Window {
    cloudinary: any;
  }
}

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({ onUploadSuccess }) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    const loadCloudinaryWidgetScript = () => {
      if (!window.cloudinary) {
        const script = document.createElement('script');
        script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
        script.async = true;
        script.onload = initializeWidget;
        document.body.appendChild(script);
      } else {
        initializeWidget();
      }
    };

    const initializeWidget = () => {
      if (!buttonRef.current || widgetRef.current) return;

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: 'dki1hiyny',
          uploadPreset: 'smartvote',
          multiple: false,
          folder: 'my_custom_folder',
          tags: ['profile'],
          clientAllowedFormats: ['jpg', 'png'],
          maxFileSize: 2000000,
          theme: 'minimal',
          styles: {
            palette: {
              window: '#FFFFFF',
              sourceBg: '#F4F4F5',
              windowBorder: '#90A0B3',
              tabIcon: '#0078FF',
              inactiveTabIcon: '#69778A',
              menuIcons: '#5A616A',
              link: '#0078FF',
              action: '#FF620C',
              inProgress: '#0078FF',
              complete: '#20B832',
              error: '#E92323',
              textDark: '#000000',
              textLight: '#FFFFFF',
            },
          },
        },
        (error: any, result: any) => {
          if (!error && result?.event === 'success') {
            const imageUrl = result.info.secure_url;
            onUploadSuccess(imageUrl);
          }
        }
      );

      buttonRef.current.addEventListener('click', () => {
        widgetRef.current.open();
      });
    };

    loadCloudinaryWidgetScript();

    return () => {
      if (buttonRef.current) {
        buttonRef.current.removeEventListener('click', () => {});
      }
    };
  }, [onUploadSuccess]);

  return (
    <button ref={buttonRef} className="cloudinary-button">
      Upload Image
    </button>
  );
};

export default CloudinaryUpload;
