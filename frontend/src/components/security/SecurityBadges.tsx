import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { getSeverityLevel } from '@/utils/securityUtils';

/**
 * Status badge for audit logs (secure/breach)
 */
export const SecurityStatusBadge = ({ hasDiscrepancy }) => {
  if (hasDiscrepancy) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle size={12} />
        Breach Detected
      </Badge>
    );
  }

  return (
    <Badge variant="success" className="flex items-center gap-1 bg-green-100 text-green-800">
      <CheckCircle size={12} />
      Secure
    </Badge>
  );
};

/**
 * Severity badge for breach types
 */
export const SeverityBadge = ({ issueType }) => {
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
      label: 'Critical',
      className: '',
    },
    high: {
      variant: 'warning',
      label: 'High',
      className: 'bg-yellow-100 text-yellow-800',
    },
    medium: {
      variant: 'secondary',
      label: 'Medium',
      className: '',
    },
    low: {
      variant: 'outline',
      label: 'Low',
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
  if (resolved) {
    return (
      <Badge variant="success" className="bg-green-100 text-green-800">
        <CheckCircle size={12} className="mr-1" />
        Resolved
      </Badge>
    );
  }

  return (
    <Badge variant="destructive">
      <AlertCircle size={12} className="mr-1" />
      Active
    </Badge>
  );
};

/**
 * System health badge
 */
export const SystemHealthBadge = ({ healthPercentage }) => {
  if (healthPercentage >= 90) {
    return (
      <Badge variant="success" className="bg-green-100 text-green-800">
        Excellent
      </Badge>
    );
  } else if (healthPercentage >= 70) {
    return (
      <Badge variant="warning" className="bg-yellow-100 text-yellow-800">
        Good
      </Badge>
    );
  } else if (healthPercentage >= 50) {
    return (
      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
        Fair
      </Badge>
    );
  } else {
    return <Badge variant="destructive">Poor</Badge>;
  }
};

/**
 * Monitoring status badge
 */
export const MonitoringStatusBadge = ({ isActive, lastCheck }) => {
  if (isActive) {
    return (
      <Badge variant="success" className="bg-green-100 text-green-800">
        Active
      </Badge>
    );
  }

  return (
    <Badge variant="destructive">
      <XCircle size={12} className="mr-1" />
      Inactive
    </Badge>
  );
};
