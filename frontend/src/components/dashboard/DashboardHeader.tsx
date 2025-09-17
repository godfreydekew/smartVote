import React from 'react';
import { Bell, Search, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DashboardSidebar } from './DashboardSidebar';
import { Link } from 'react-router-dom';
import { LanguageSwitcher } from '../LanguageSwitcher';

export const DashboardHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center">
            <span className="text-2xl font-bold text-vote-blue">
              Smart<span className="text-vote-teal">Vote</span>
            </span>
            <span className="bg-vote-blue text-white text-xs px-2 py-1 rounded-full ml-2">Beta</span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                  <UserRound className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="p-0">
                <DashboardSidebar />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
