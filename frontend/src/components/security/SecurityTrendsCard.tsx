import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const SecurityTrendsCard = ({ securityStats }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp size={18} />
          {t('adminSecurity.trendsCard.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t('adminSecurity.trendsCard.systemHealth')}</span>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.max(0, 100 - securityStats.activeBreaches * 20)}%`,
                  }}
                />
              </div>
              <span className="text-sm font-medium">{Math.max(0, 100 - securityStats.activeBreaches * 20)}%</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t('adminSecurity.trendsCard.dataIntegrity')}</span>
            <Badge variant={securityStats.activeBreaches === 0 ? 'success' : 'destructive'}>
              {securityStats.activeBreaches === 0
                ? t('adminSecurity.trendsCard.intact')
                : t('adminSecurity.trendsCard.compromised')}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t('adminSecurity.trendsCard.monitoringStatus')}</span>
            <Badge variant="success" className="bg-green-100 text-green-800">
              {t('adminSecurity.trendsCard.active')}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
