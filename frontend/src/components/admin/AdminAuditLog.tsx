
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AuditEvent {
  id: string;
  eventType: 'login' | 'pause' | 'resume' | 'export' | 'edit' | 'publish' | 'delete';
  timestamp: Date;
  adminUser: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

const auditEvents: AuditEvent[] = [
  {
    id: '1',
    eventType: 'pause',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    adminUser: 'admin@example.com',
    description: 'Paused "City Council Election" due to technical issues',
    severity: 'critical'
  },
  {
    id: '2',
    eventType: 'resume',
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    adminUser: 'admin@example.com',
    description: 'Resumed "City Council Election" after resolving issues',
    severity: 'info'
  },
  {
    id: '3',
    eventType: 'export',
    timestamp: new Date(Date.now() - 120 * 60 * 1000), // 2 hours ago
    adminUser: 'manager@example.com',
    description: 'Exported voter list for "Board Member Election"',
    severity: 'warning'
  },
  {
    id: '4',
    eventType: 'edit',
    timestamp: new Date(Date.now() - 240 * 60 * 1000), // 4 hours ago
    adminUser: 'admin@example.com',
    description: 'Modified candidate information for "Budget Approval Vote"',
    severity: 'info'
  },
  {
    id: '5',
    eventType: 'publish',
    timestamp: new Date(Date.now() - 1440 * 60 * 1000), // 1 day ago
    adminUser: 'admin@example.com',
    description: 'Published "Team Lead Selection" election',
    severity: 'info'
  }
];

export const AdminAuditLog = () => {
  const renderSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Info className="h-4 w-4 text-amber-500" />;
      case 'info':
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const renderEventTypeBadge = (eventType: string) => {
    let color = "bg-gray-100 text-gray-800";
    
    switch (eventType) {
      case 'pause':
        color = "bg-red-100 text-red-800";
        break;
      case 'resume':
        color = "bg-green-100 text-green-800";
        break;
      case 'export':
        color = "bg-amber-100 text-amber-800";
        break;
      case 'publish':
        color = "bg-blue-100 text-blue-800";
        break;
      case 'delete':
        color = "bg-red-100 text-red-800";
        break;
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
        {eventType.charAt(0).toUpperCase() + eventType.slice(1)}
      </span>
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Admin Audit Log</CardTitle>
          <Badge variant="outline">Last 24 hours</Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {auditEvents.map((event) => (
            <div 
              key={event.id} 
              className="flex items-start p-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="mt-0.5 mr-2">
                {renderSeverityIcon(event.severity)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{event.adminUser}</span>
                  {renderEventTypeBadge(event.eventType)}
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{event.description}</p>
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap">
                {event.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:underline">
            View complete audit history
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
