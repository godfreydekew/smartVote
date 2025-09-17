import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, RefreshCw, Activity, ShieldAlert, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const SecuritySearchHeader = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  loading,
  onRefresh,
  activeBreaches,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <TabsList className="bg-white border shadow-sm">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <Activity size={16} />
          {t('adminSecurity.searchHeader.overview')}
        </TabsTrigger>
        <TabsTrigger value="breaches" className="flex items-center gap-2">
          <ShieldAlert size={16} />
          {t('adminSecurity.searchHeader.securityBreaches')}
          {activeBreaches > 0 && (
            <Badge variant="destructive" className="ml-1 px-1 text-xs">
              {activeBreaches}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="audit-logs" className="flex items-center gap-2">
          <FileText size={16} />
          {t('adminSecurity.searchHeader.auditLogs')}
        </TabsTrigger>
      </TabsList>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t('adminSecurity.searchHeader.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading} className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {t('adminSecurity.searchHeader.refresh')}
        </Button>
      </div>
    </div>
  );
};
