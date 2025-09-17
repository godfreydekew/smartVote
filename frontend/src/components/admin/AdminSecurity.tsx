import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { securityService } from '@/api';
import { calculateSecurityStats } from '@/utils/securityUtils';
import { SecurityAuditLogsTable } from '../security/SecurityAuditLogsTable';
import { SecurityBreachesTable } from '../security/SecurityBreachesTable';
import { SecurityOverviewCards } from '../security/SecurityOverviewCards';
import { SecurityAlertBanner } from '../security/SecurityAlertBanner';
import { SecuritySearchHeader } from '../security/SecuritySearchHeader';
import { SecurityRecentActivity } from '../security/SecurityRecentActivity';
import { SecurityTrendsCard } from '../security/SecurityTrendsCard';
import { useTranslation } from 'react-i18next';

export const AdminSecurity = () => {
  const { t } = useTranslation();
  const [auditLogs, setAuditLogs] = useState([]);
  const [breaches, setBreaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedElection, setSelectedElection] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('24h');
  const [activeTab, setActiveTab] = useState('overview');

  // Modal state for viewing details
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Security statistics
  const [securityStats, setSecurityStats] = useState({
    totalAudits: 0,
    activeBreaches: 0,
    resolvedBreaches: 0,
    recentAudits: 0,
    criticalBreaches: 0,
    lastAuditTime: null,
  });

  // Fetch security data
  const fetchSecurityData = async () => {
    setLoading(true);
    try {
      // Fetch audit logs
      const auditLogs = await securityService.getAuditLogs();
      setAuditLogs(auditLogs || []);

      // Fetch breaches
      const breaches = await securityService.getBreaches();
      setBreaches(breaches || []);

      // Calculate statistics
      const stats = calculateSecurityStats(auditLogs || [], breaches || []);
      setSecurityStats(stats);
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark breach as resolved
  const markBreachResolved = async (breachId) => {
    try {
      await securityService.resolveBreach(breachId, true);
      fetchSecurityData(); // Refresh data
    } catch (error) {
      console.error('Error updating breach:', error);
    }
  };

  // Handle viewing details
  const handleViewAuditDetails = (auditLog) => {
    setSelectedItem({
      type: 'audit',
      data: auditLog,
    });
    setDetailsModalOpen(true);
  };

  const handleViewBreachDetails = (breach) => {
    setSelectedItem({
      type: 'breach',
      data: breach,
    });
    setDetailsModalOpen(true);
  };

  // Close details modal
  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedItem(null);
  };

  // Filter functions
  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesSearch =
      searchTerm === '' ||
      log.election_id?.toString().includes(searchTerm) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesElection = selectedElection === '' || log.election_id?.toString() === selectedElection;

    return matchesSearch && matchesElection;
  });

  const filteredBreaches = breaches.filter((breach) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !breach.resolved) ||
      (statusFilter === 'resolved' && breach.resolved);

    const matchesSearch =
      searchTerm === '' ||
      breach.election_id?.toString().includes(searchTerm) ||
      breach.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  useEffect(() => {
    fetchSecurityData();
  }, []);

  // Parse audit details JSON safely
  const parseAuditDetails = (detailsString) => {
    try {
      return JSON.parse(detailsString);
    } catch (error) {
      console.error('Failed to parse audit details:', error);
      return null;
    }
  };

  // Render details modal content
  const renderDetailsContent = () => {
    if (!selectedItem) return null;

    if (selectedItem.type === 'audit') {
      const log = selectedItem.data;
      const parsedDetails = log.details ? parseAuditDetails(log.details) : null;

      return (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-700">{t('adminSecurity.electionId')}</h4>
              <p className="text-lg font-medium">Election {log.election_id}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-700">{t('adminSecurity.checkTime')}</h4>
              <p>{new Date(log.check_time).toLocaleString()}</p>
            </div>
          </div>

          {/* Vote Counts - only show if data exists */}
          {(log.db_total_votes !== null || log.chain_total_votes !== null) && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-700">{t('adminSecurity.databaseVotes')}</h4>
                <p className="text-xl font-medium">{log.db_total_votes ?? 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700">{t('adminSecurity.blockchainVotes')}</h4>
                <p
                  className={`text-xl font-medium ${log.db_total_votes !== log.chain_total_votes ? 'text-red-600' : ''}`}
                >
                  {log.chain_total_votes ?? 'N/A'}
                </p>
              </div>
            </div>
          )}

          {/* Status - only show if data exists */}
          {(log.db_status || log.chain_status) && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-700">{t('adminSecurity.databaseStatus')}</h4>
                <Badge variant="secondary">{log.db_status || 'N/A'}</Badge>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700">{t('adminSecurity.blockchainStatus')}</h4>
                <Badge variant={log.db_status !== log.chain_status ? 'destructive' : 'secondary'}>
                  {log.chain_status || 'N/A'}
                </Badge>
              </div>
            </div>
          )}

          {/* Discrepancy Alert */}
          {log.discrepancy_found && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 flex items-center gap-2">
                {t('adminSecurity.securityIssuesDetected')}
              </h4>
              <p className="text-red-700 text-sm mt-1">
                {t('adminSecurity.securityIssuesDescription', {
                  count: parsedDetails?.summary?.failedChecks || 'multiple',
                })}
              </p>
            </div>
          )}

          {/* Audit Summary */}
          {parsedDetails?.summary && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">{t('adminSecurity.auditSummary')}</h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">{t('adminSecurity.totalChecks')}</span>
                  <p className="font-medium">{parsedDetails.summary.totalChecks}</p>
                </div>
                <div>
                  <span className="text-gray-600">{t('adminSecurity.passed')}</span>
                  <p className="font-medium text-green-600">{parsedDetails.summary.passedChecks}</p>
                </div>
                <div>
                  <span className="text-gray-600">{t('adminSecurity.failed')}</span>
                  <p className="font-medium text-red-600">{parsedDetails.summary.failedChecks}</p>
                </div>
                <div>
                  <span className="text-gray-600">{t('adminSecurity.passRate')}</span>
                  <p className="font-medium">{Math.round(parsedDetails.summary.passRate)}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Security Violations */}
          {parsedDetails?.violations && parsedDetails.violations.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">{t('adminSecurity.securityViolations')}</h4>
              <div className="space-y-3">
                {parsedDetails.violations.map((violation, index) => (
                  <div key={index} className="border border-red-200 rounded-lg p-3 bg-red-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="destructive" className="text-xs">
                        {violation.type.replace(/_/g, ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-red-800 mb-2">{violation.message}</p>
                    {violation.details?.error && (
                      <div className="text-xs text-red-600 bg-red-100 p-2 rounded font-mono">
                        {violation.details.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Details Fallback */}
          {log.details && !parsedDetails && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700">{t('adminSecurity.rawDetails')}</h4>
              <div className="text-xs text-gray-600 bg-gray-100 p-3 rounded font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                {log.details}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (selectedItem.type === 'breach') {
      const breach = selectedItem.data;
      const issueTypes = breach.issue_type ? breach.issue_type.split(',').map((type) => type.trim()) : [];

      return (
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-700">{t('adminSecurity.electionId')}</h4>
              <p className="text-lg font-medium">Election {breach.election_id}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-700">{t('adminSecurity.detectedAt')}</h4>
              <p>{new Date(breach.detected_at).toLocaleString()}</p>
            </div>
          </div>

          {/* Issue Types */}
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2">{t('adminSecurity.issueTypes')}</h4>
            <div className="flex flex-wrap gap-2">
              {issueTypes.map((type, index) => (
                <Badge key={index} variant="destructive" className="text-xs">
                  {type.replace(/_/g, ' ').toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h4 className="font-semibold text-sm text-gray-700">{t('adminSecurity.status')}</h4>
            <Badge variant={breach.resolved ? 'default' : 'destructive'} className="mt-1">
              {breach.resolved ? t('adminSecurity.resolved') : t('adminSecurity.active')}
            </Badge>
            {breach.resolved && breach.resolved_at && (
              <p className="text-sm text-gray-600 mt-1">
                {t('adminSecurity.resolvedAt', { date: new Date(breach.resolved_at).toLocaleString() })}
              </p>
            )}
          </div>

          {/* Description - Parse individual issues */}
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2">{t('adminSecurity.issueDetails')}</h4>
            <div className="space-y-3">
              {breach.description.split('; ').map((issue, index) => {
                const [issueType, ...messageParts] = issue.split(': ');
                const message = messageParts.join(': ');

                return (
                  <div key={index} className="border border-red-200 rounded p-3 bg-red-50">
                    <h5 className="font-medium text-red-800 text-sm mb-1">
                      {issueType.replace(/_/g, ' ').toUpperCase()}
                    </h5>
                    <p className="text-sm text-red-700">{message}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Security Overview Cards */}
      <SecurityOverviewCards securityStats={securityStats} />

      {/* Active Breaches Alert */}
      <SecurityAlertBanner activeBreaches={securityStats.activeBreaches} />

      {/* Main Security Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <SecuritySearchHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          loading={loading}
          onRefresh={fetchSecurityData}
          activeBreaches={securityStats.activeBreaches}
        />

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SecurityRecentActivity auditLogs={auditLogs} />
            <SecurityTrendsCard securityStats={securityStats} />
          </div>
        </TabsContent>

        {/* Security Breaches Tab */}
        <TabsContent value="breaches">
          <SecurityBreachesTable
            breaches={breaches}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchTerm={searchTerm}
            onMarkResolved={markBreachResolved}
            onViewDetails={handleViewBreachDetails}
          />
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit-logs">
          <SecurityAuditLogsTable
            auditLogs={filteredAuditLogs}
            searchTerm={searchTerm}
            selectedElection={selectedElection}
            onViewDetails={handleViewAuditDetails}
          />
        </TabsContent>
      </Tabs>

      {/* Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.type === 'audit'
                ? t('adminSecurity.auditLogDetails')
                : t('adminSecurity.securityBreachDetails')}
            </DialogTitle>
          </DialogHeader>
          {renderDetailsContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSecurity;
