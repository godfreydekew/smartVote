import React from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ElectionCreationForm } from '@/components/admin/electionCreationForm/ElectionCreationForm';
import { BackNavigation } from '@/components/navigation/BackNavigation';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

const ElectionCreationPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 overflow-auto">
          <DashboardHeader />
          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                {/* <Breadcrumbs className="mb-2" /> */}
                <div className="flex items-center">
                  <BackNavigation to="/dashboard" className="mr-4" />
                  <h3 className="text-2xl font-bold text-gray-800">Create New Election</h3>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <ElectionCreationForm />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ElectionCreationPage;
