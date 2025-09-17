import React, { memo } from 'react';
import ElectionCard from './ElectionCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface Election {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: 'active' | 'upcoming' | 'completed';
  date: string;
  address: string;
}

interface ElectionsGridProps {
  elections: Election[];
  status: 'active' | 'upcoming' | 'completed';
}

const EmptyState = ({ status }: { status: string }) => {
  const { t } = useTranslation();

  const getIcon = () => {
    switch (status) {
      case 'active':
        return <Clock className="h-12 w-12 text-vote-blue mb-4" />;
      case 'upcoming':
        return <Calendar className="h-12 w-12 text-vote-blue mb-4" />;
      default:
        return <AlertCircle className="h-12 w-12 text-vote-blue mb-4" />;
    }
  };

  const getMessage = () => {
    switch (status) {
      case 'active':
        return {
          title: t('dashboard.noActiveElectionsTitle'),
          description: t('dashboard.noActiveElectionsDescription'),
        };
      case 'upcoming':
        return {
          title: t('dashboard.noUpcomingElectionsTitle'),
          description: t('dashboard.noUpcomingElectionsDescription'),
        };
      default:
        return {
          title: t('dashboard.noCompletedElectionsTitle'),
          description: t('dashboard.noCompletedElectionsDescription'),
        };
    }
  };

  const message = getMessage();

  return (
    <Card className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="text-center">
        {getIcon()}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{message.title}</h3>
        <p className="text-gray-600 max-w-sm mx-auto">{message.description}</p>
      </div>
    </Card>
  );
};

const ElectionsGrid = memo(({ elections, status }: ElectionsGridProps) => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (elections.length === 0) {
    return <EmptyState status={elections[0]?.status || status} />;
  }

  // Show skeletons while loading
  if (isLoading) {
    return (
      <div
        className={
          isMobile ? 'flex gap-4 overflow-x-auto pb-4 px-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        }
      >
        {Array.from({ length: Math.min(6, elections.length) }).map((_, index) => (
          <div key={index} className={isMobile ? 'w-80 flex-shrink-0' : ''}>
            <Card className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="grid grid-cols-2 gap-4 px-4">
        {elections.map((election) => (
          <ElectionCard key={election.id} {...election} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
      {elections.map((election) => (
        <ElectionCard key={election.id} {...election} />
      ))}
    </div>
  );
});

ElectionsGrid.displayName = 'ElectionsGrid';

export default ElectionsGrid;
