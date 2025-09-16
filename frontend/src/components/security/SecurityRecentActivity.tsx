import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { SecurityStatusBadge } from '../security/SecurityBadges';
import { getTimeAgo } from '@/utils/securityUtils';

export const SecurityRecentActivity = ({ auditLogs }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity size={18} />
          Recent Security Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {log.discrepancy_found ? (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                <div>
                  <p className="text-sm font-medium">Election {log.election_id}</p>
                  <p className="text-xs text-gray-500">{getTimeAgo(log.check_time)}</p>
                </div>
              </div>
              {SecurityStatusBadge(log.discrepancy_found)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
