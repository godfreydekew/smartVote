import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface BackNavigationProps {
  to?: string;
  label?: string;
  className?: string;
  fixed?: boolean;
}

const getContextLabel = (pathname: string): string => {
  // Extract page context for dynamic labels
  if (pathname.includes('/election/')) {
    return 'Elections';
  } else if (pathname.includes('/admin/')) {
    return 'Admin Dashboard';
  } else if (pathname === '/profile') {
    return 'Dashboard';
  } else {
    return 'Dashboard';
  }
};

export function BackNavigation({ 
  to, 
  label, 
  className,
  fixed = false
}: BackNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };
  
  // Use ESC key to navigate back
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBack();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const contextLabel = getContextLabel(location.pathname);
  const displayLabel = label || ``;
  
  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className={cn(
        "group flex items-center gap-1 hover:underline hover:bg-transparent px-0", 
        fixed && "fixed top-24 left-6 z-40",
        isMobile && fixed && "bottom-6 left-6 top-auto rounded-full w-12 h-12 p-0 shadow-md bg-white hover:bg-gray-50",
        className
      )}
    >
      <ChevronLeft 
        className={cn(
          "mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1",
          isMobile && fixed && "m-0 h-5 w-5"
        )} 
      />
      {(!isMobile || !fixed) && <span>{displayLabel}</span>}
    </Button>
  );
}
