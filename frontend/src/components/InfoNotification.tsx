import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';
import { Button } from './ui/button';

interface InfoNotificationProps {
  message: string;
  title?: string;
  storageKey: string;
  onClose?: () => void;
}

const InfoNotification = ({ message, title, storageKey, onClose }: InfoNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the notification has been shown before
    const hasSeenNotification = localStorage.getItem(storageKey);
    if (!hasSeenNotification) {
      setIsVisible(true);
    }
  }, [storageKey]);

  const handleClose = () => {
    setIsVisible(false);
    // Store in localStorage that the user has seen this notification
    localStorage.setItem(storageKey, 'true');
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
        >
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={handleClose} />
          <div className="relative bg-white rounded-xl shadow-xl border-2 border-vote-blue/20 p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-vote-blue/10 flex items-center justify-center">
                  <Info className="h-5 w-5 text-vote-blue" />
                </div>
              </div>
              <div className="flex-1">
                {title && (
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {title}
                  </h3>
                )}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {message}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="absolute top-2 right-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoNotification; 