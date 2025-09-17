import React from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { ElectionTabs } from '@/components/dashboard/ElectionTabs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, FileText, Plus, Vote } from 'lucide-react';
import { useAuth } from '@/auth/AuthProvider';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const isAdmin = user?.user_role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex h-screen overflow-hidden">
          <div className="flex-1 overflow-auto">
            <DashboardHeader />
            <DashboardHero />
            <main className="p-6">
              <div className="max-w-7xl mx-auto">
                <Breadcrumbs className="mb-4" />
                <ElectionTabs />
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 overflow-auto">
          <DashboardHeader />
          <main className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vote-blue to-vote-teal">
                    {t('dashboard.adminDashboard')}
                  </h1>
                  <p className="text-gray-600 mt-2">{t('dashboard.adminDescription')}</p>
                </div>
                <Button
                  asChild
                  className="flex items-center gap-2 bg-gradient-to-r from-vote-blue to-vote-teal hover:opacity-90 transition-opacity"
                >
                  <Link to="/admin/elections/create">
                    <Plus size={18} />
                    <span>{t('dashboard.createElection')}</span>
                  </Link>
                </Button>
              </div>

              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-white border shadow-sm p-1 rounded-lg">
                  <TabsTrigger
                    value="overview"
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-vote-blue data-[state=active]:to-vote-teal data-[state=active]:text-white rounded-md transition-all duration-200"
                  >
                    <FileText size={18} />
                    <span>{t('dashboard.overview')}</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="my-elections"
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-vote-blue data-[state=active]:to-vote-teal data-[state=active]:text-white rounded-md transition-all duration-200"
                  >
                    <Activity size={18} />
                    <span>{t('dashboard.myElections')}</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="animate-fade-in">
                  <AdminOverview />
                </TabsContent>

                <TabsContent value="my-elections" className="animate-fade-in">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <ElectionTabs />
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
