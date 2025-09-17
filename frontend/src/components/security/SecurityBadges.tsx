import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { getSeverityLevel } from '@/utils/securityUtils';
import { useTranslation } from 'react-i18next';

/**
 * Status badge for audit logs (secure/breach)
 */
export const SecurityStatusBadge = ({ hasDiscrepancy }) => {
  const { t } = useTranslation();

  if (hasDiscrepancy) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle size={12} />
        {t('adminSecurity.badges.breachDetected')}
      </Badge>
    );
  }

  return (
    <Badge variant="success" className="flex items-center gap-1 bg-green-100 text-green-800">
      <CheckCircle size={12} />
      {t('adminSecurity.badges.secure')}
    </Badge>
  );
};

/**
 * Severity badge for breach types
 */
export const SeverityBadge = ({ issueType }) => {
  const { t } = useTranslation();
  const severity = getSeverityLevel(issueType);

  const severityConfig: Record<
    string,
    {
      variant: 'destructive' | 'warning' | 'secondary' | 'outline' | 'default' | 'success' | 'info';
      label: string;
      className: string;
    }
  > = {
    critical: {
      variant: 'destructive',
      label: t('adminSecurity.badges.critical'),
      className: '',
    },
    high: {
      variant: 'warning',
      label: t('adminSecurity.badges.high'),
      className: 'bg-yellow-100 text-yellow-800',
    },
    medium: {
      variant: 'secondary',
      label: t('adminSecurity.badges.medium'),
      className: '',
    },
    low: {
      variant: 'outline',
      label: t('adminSecurity.badges.low'),
      className: '',
    },
  };

  const config = severityConfig[severity];

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

/**
 * Resolution status badge for breaches
 */
export const ResolutionStatusBadge = ({ resolved, resolvedAt }) => {
  const { t } = useTranslation();

  if (resolved) {
    return (
      <Badge variant="success" className="bg-green-100 text-green-800">
        <CheckCircle size={12} className="mr-1" />
        {t('adminSecurity.badges.resolved')}
      </Badge>
    );
  }

  return (
    <Badge variant="destructive">
      <AlertCircle size={12} className="mr-1" />
      {t('adminSecurity.badges.active')}
    </Badge>
  );
};

/**
 * System health badge
 */
export const SystemHealthBadge = ({ healthPercentage }) => {
  const { t } = useTranslation();

  if (healthPercentage >= 90) {
    return (
      <Badge variant="success" className="bg-green-100 text-green-800">
        {t('adminSecurity.badges.excellent')}
      </Badge>
    );
  } else if (healthPercentage >= 70) {
    return (
      <Badge variant="warning" className="bg-yellow-100 text-yellow-800">
        {t('adminSecurity.badges.good')}
      </Badge>
    );
  } else if (healthPercentage >= 50) {
    return (
      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
        {t('adminSecurity.badges.fair')}
      </Badge>
    );
  } else {
    return <Badge variant="destructive">{t('adminSecurity.badges.poor')}</Badge>;
  }
};

/**
 * Monitoring status badge
 */
export const MonitoringStatusBadge = ({ isActive, lastCheck }) => {
  const { t } = useTranslation();

  if (isActive) {
    return (
      <Badge variant="success" className="bg-green-100 text-green-800">
        {t('adminSecurity.badges.active')}
      </Badge>
    );
  }

  return (
    <Badge variant="destructive">
      <XCircle size={12} className="mr-1" />
      {t('adminSecurity.badges.inactive')}
    </Badge>
  );
};
