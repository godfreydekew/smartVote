import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const SecurityAlertBanner = ({ activeBreaches }) => {
  const { t } = useTranslation();

  if (activeBreaches === 0) return null;

  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <strong>{t('adminSecurity.alertBanner.securityAlert')}</strong>{' '}
        {t('adminSecurity.alertBanner.activeBreachesDetected', { count: activeBreaches })}
      </AlertDescription>
    </Alert>
  );
};
