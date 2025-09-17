import React from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, Users, Settings, ShieldAlert, Plus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { AdminSecurity } from '@/components/admin/AdminSecurity';
import { BackNavigation } from '@/components/navigation/BackNavigation';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 overflow-auto">
          <DashboardHeader />

          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                  <div>
                    <div className="flex items-center">
                      <BackNavigation to="/dashboard" className="mr-4" />
                      <h1 className="text-3xl font-bold text-gray-800">{t('adminDashboard.title')}</h1>
                    </div>
                    <p className="text-gray-600 mt-2">{t('adminDashboard.subtitle')}</p>
                  </div>

                  <div className="mt-4 sm:mt-0">
                    <Button asChild className="flex items-center gap-2">
                      <Link to="/admin/elections/create">
                        <Plus size={18} />
                        <span>{t('adminDashboard.createElection')}</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <InfoIcon className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">{t('adminDashboard.welcomeMessage')}</AlertDescription>
              </Alert>

              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-white border shadow-sm">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <FileText size={18} />
                    <span>{t('adminDashboard.tabs.overview')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <Users size={18} />
                    <span>{t('adminDashboard.tabs.userManagement')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings size={18} />
                    <span>{t('adminDashboard.tabs.systemSettings')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <ShieldAlert size={18} />
                    <span>{t('adminDashboard.tabs.securityMonitor')}</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="animate-fade-in">
                  <AdminOverview />
                </TabsContent>

                <TabsContent value="users" className="animate-fade-in">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('adminDashboard.tabs.userManagement')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500">{t('adminDashboard.comingSoon')}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="animate-fade-in">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('adminDashboard.tabs.systemSettings')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500">{t('adminDashboard.comingSoon')}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="animate-fade-in">
                  <AdminSecurity />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
