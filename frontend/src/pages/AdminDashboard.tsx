import React from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Users, Settings, ShieldAlert, Plus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { BackNavigation } from '@/components/navigation/BackNavigation';

const AdminDashboard = () => {
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
                      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    </div>
                    <p className="text-gray-600 mt-2">
                      Manage your platform's elections and settings
                    </p>
                  </div>
                  
                  <div className="mt-4 sm:mt-0">
                    <Button asChild className="flex items-center gap-2">
                      <Link to="/admin/elections/create">
                        <Plus size={18} />
                        <span>Create Election</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <InfoIcon className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Welcome to the admin dashboard. Here you can manage elections and monitor platform activity.
                </AlertDescription>
              </Alert>
              
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-white border shadow-sm">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <FileText size={18} />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <Users size={18} />
                    <span>User Management</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings size={18} />
                    <span>System Settings</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="animate-fade-in">
                  <AdminOverview />
                </TabsContent>
                               
                <TabsContent value="users" className="animate-fade-in">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500">This feature is coming soon. Stay tuned!</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings" className="animate-fade-in">
                  <Card>
                    <CardHeader>
                      <CardTitle>System Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500">This feature is coming soon. Stay tuned!</p>
                    </CardContent>
                  </Card>
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
