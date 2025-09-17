import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface ElectionCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: 'active' | 'upcoming' | 'completed';
  date: string;
  address: string;
}

const ElectionCard = memo(({ id, title, description, imageUrl, status, date, address }: ElectionCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getStatusStyles = (status: 'active' | 'upcoming' | 'completed') => {
    switch (status) {
      case 'active':
        return 'bg-green-500 text-white';
      case 'upcoming':
        return 'bg-blue-500 text-white';
      case 'completed':
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: 'active' | 'upcoming' | 'completed') => {
    switch (status) {
      case 'active':
        return t('dashboard.active');
      case 'upcoming':
        return t('dashboard.upcoming');
      case 'completed':
        return t('dashboard.completed');
    }
  };

  const statusStyles = getStatusStyles(status);
  const statusText = getStatusText(status);

  //redirect to election page
  const handleCardClick = () => {
    localStorage.setItem('selectedAddress', address);
    navigate(`/election/${id}?address=${address}&status=${status}`);
  };

  return (
    <Card onClick={handleCardClick} className="cursor-pointer transition-shadow hover:shadow-md overflow-hidden h-full">
      <div className="h-40 md:h-56 bg-cover bg-center relative" style={{ backgroundImage: `url(${imageUrl})` }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles}`}>{statusText}</span>
        </div>
      </div>
      <div className="p-4 md:p-5">
        <h3 className="text-base md:text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="hidden md:block text-sm text-gray-600 mb-3 truncate max-w-xs">{description}</p>
        <div className="flex justify-between items-center">
          <p className="text-xs md:text-sm text-gray-500">{date}</p>
          <button className="text-xs md:text-sm text-vote-blue font-medium hover:underline">
            {t('dashboard.viewDetails')}
          </button>
        </div>
      </div>
    </Card>
  );
});

ElectionCard.displayName = 'ElectionCard';

export default ElectionCard;
