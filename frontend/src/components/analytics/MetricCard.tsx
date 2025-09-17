import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className = '',
  variant = 'default'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'border-vote-blue bg-gradient-to-br from-vote-blue-light to-white';
      case 'success':
        return 'border-analytics-success bg-gradient-to-br from-green-50 to-white';
      case 'warning':
        return 'border-analytics-warning bg-gradient-to-br from-yellow-50 to-white';
      case 'danger':
        return 'border-analytics-danger bg-gradient-to-br from-red-50 to-white';
      default:
        return 'border-border bg-card';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'primary':
        return 'text-vote-blue';
      case 'success':
        return 'text-analytics-success';
      case 'warning':
        return 'text-analytics-warning';
      case 'danger':
        return 'text-analytics-danger';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${getVariantStyles()} ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className={`h-5 w-5 ${getIconColor()}`} />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trend && (
          <div className={`text-xs mt-2 flex items-center gap-1 ${
            trend.isPositive ? 'text-analytics-success' : 'text-analytics-danger'
          }`}>
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};