import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ElectionHeaderProps {
  title: string;
  description: string;
  imageUrl: string;
  status: string;
  timeRemaining?: string | null;
}

const ElectionHeader: React.FC<ElectionHeaderProps> = ({ title, description, imageUrl, status, timeRemaining }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isActive = status === 'active';
  const isUpcoming = status === 'upcoming';
  const isCompleted = status === 'completed';

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          bg: 'bg-green-500/10',
          text: 'text-green-600',
          border: 'border-green-500/20',
          icon: Clock,
          label: t('electionDetails.header.status.active'),
        };
      case 'upcoming':
        return {
          bg: 'bg-blue-500/10',
          text: 'text-blue-600',
          border: 'border-blue-500/20',
          icon: Calendar,
          label: t('electionDetails.header.status.upcoming'),
        };
      case 'completed':
        return {
          bg: 'bg-gray-500/10',
          text: 'text-gray-600',
          border: 'border-gray-500/20',
          icon: CheckCircle2,
          label: t('electionDetails.header.status.completed'),
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="relative">
      {/* Background Image with Gradient Overlay */}
      <div
        className="relative h-48 sm:h-64 md:h-80 bg-cover bg-center transition-transform duration-300"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

        {/* Back Button */}
        <Button
          variant="ghost"
          className="absolute top-4 left-4 text-white hover:bg-white/20 transition-colors duration-200 z-10"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span className="hidden sm:inline">{t('electionDetails.header.backToDashboard')}</span>
          <span className="sm:hidden">{t('electionDetails.header.back')}</span>
        </Button>

        {/* Content Container */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-end h-full pb-6 sm:pb-8 md:pb-12">
            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 items-center mb-4">
              <Badge
                className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} px-3 py-1.5 font-medium flex items-center gap-1.5`}
              >
                <StatusIcon className="h-4 w-4" />
                <span>{statusConfig.label}</span>
              </Badge>

              {isActive && timeRemaining && (
                <Badge
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 flex items-center gap-1.5 px-3 py-1.5"
                >
                  <Timer className="h-4 w-4" />
                  <span>{timeRemaining}</span>
                </Badge>
              )}
            </div>

            {/* Title and Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight">
                {title}
              </h1>
              <p className="text-white/90 mt-2 text-sm sm:text-base md:text-lg max-w-3xl line-clamp-2 sm:line-clamp-none">
                {description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionHeader;
