import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ElectionCreationForm } from '@/components/admin/electionCreationForm/ElectionCreationForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Rocket, Save, Eye } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const ElectionEditPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || '';
  const { toast } = useToast();
  const [isPreview, setIsPreview] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [unsavedChangesCount, setUnsavedChangesCount] = useState(0);
  const [publishDate, setPublishDate] = useState<Date | undefined>(undefined);
  const [showPublishDate, setShowPublishDate] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Mock function to simulate auto-saving
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasUnsavedChanges) {
        saveChanges();
      }
    }, 60000); // Auto-save every 60 seconds

    return () => clearInterval(interval);
  }, [hasUnsavedChanges]);

  // Simulate a change in the form
  const handleFormChange = () => {
    setHasUnsavedChanges(true);
    setUnsavedChangesCount((prev) => prev + 1);
  };

  const saveChanges = () => {
    // In a real app, we would save the changes to the database here
    toast({
      title: t('electionCreation.buttons.saveDraft'),
      description: t('electionCreation.loading.creating'),
    });
    setHasUnsavedChanges(false);
    setUnsavedChangesCount(0);
  };

  const handlePublish = (scheduled: boolean = false) => {
    if (scheduled && !publishDate) {
      setShowPublishDate(true);
      return;
    }

    // In a real app, we would publish the election here
    const message = scheduled
      ? `${t('electionCreation.loading.publishing')} ${format(publishDate!, 'PP')}`
      : t('electionCreation.loading.ready');

    toast({
      title: scheduled ? t('electionCreation.loading.publishing') : t('electionCreation.loading.ready'),
      description: message,
    });

    // Redirect to the admin dashboard
    navigate('/admin');
  };

  const handleExit = () => {
    if (hasUnsavedChanges) {
      setShowExitDialog(true);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 overflow-auto">
          <DashboardHeader />

          {/* Sticky preview bar */}
          <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Tabs value={isPreview ? 'preview' : 'edit'} onValueChange={(v) => setIsPreview(v === 'preview')}>
                    <TabsList>
                      <TabsTrigger value="edit">{t('electionCreation.steps.basicInfo')}</TabsTrigger>
                      <TabsTrigger value="preview">{t('electionCreation.steps.candidates')}</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="hidden sm:block">
                    <Badge variant="outline" className="bg-gray-100">
                      {t('electionCreation.loading.creating')}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {unsavedChangesCount > 0 && (
                    <div className="text-xs text-gray-500 flex items-center">
                      <span className="font-medium">
                        {unsavedChangesCount} {t('electionCreation.loading.creating')}
                      </span>
                      <Progress value={100} className="w-16 h-1 ml-2" />
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={saveChanges}
                    disabled={!hasUnsavedChanges}
                    className="text-xs"
                  >
                    <Save className="mr-1 h-3 w-3" /> {t('electionCreation.buttons.saveDraft')}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                  <Button variant="ghost" size="sm" className="mb-2" onClick={handleExit}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('electionCreation.buttons.cancel')}
                  </Button>

                  <h1 className="text-3xl font-bold text-gray-800">{t('electionCreation.title')}</h1>
                  <p className="text-gray-600 mt-2">{t('electionCreation.subtitle')}</p>
                </div>

                <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
                  <Popover open={showPublishDate} onOpenChange={setShowPublishDate}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {t('electionCreation.loading.publishing')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <div className="p-4 border-b">
                        <h3 className="font-medium">{t('electionCreation.loading.publishing')}</h3>
                        <p className="text-sm text-gray-500">{t('electionCreation.loading.creating')}</p>
                      </div>
                      <CalendarComponent
                        mode="single"
                        selected={publishDate}
                        onSelect={setPublishDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                      <div className="p-4 border-t flex justify-end">
                        <Button disabled={!publishDate} onClick={() => handlePublish(true)}>
                          {t('electionCreation.buttons.createElection')}
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Button onClick={() => handlePublish(false)} className="flex items-center gap-2">
                    <Rocket className="h-4 w-4" />
                    {t('electionCreation.buttons.createElection')}
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                {isPreview ? (
                  <div className="p-6">
                    <div className="flex justify-center items-center bg-gray-100 rounded-lg p-12 mb-6">
                      <div className="text-center">
                        <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">{t('electionCreation.steps.candidates')}</h3>
                        <p className="mt-1 text-sm text-gray-500">{t('electionCreation.loading.creating')}</p>
                        <Button onClick={() => setIsPreview(false)} className="mt-4" variant="outline">
                          {t('electionCreation.buttons.previous')}
                        </Button>
                      </div>
                    </div>

                    <div className="border-l-4 border-blue-400 pl-4 py-2 bg-blue-50">
                      <p className="text-sm text-blue-700">{t('electionCreation.loading.creating')}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <ElectionCreationForm onChange={handleFormChange} />
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Exit confirmation dialog */}
      {showExitDialog && (
        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('electionCreation.errors.title')}</AlertDialogTitle>
              <AlertDialogDescription>{t('electionCreation.errors.description')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('electionCreation.buttons.cancel')}</AlertDialogCancel>
              <Button variant="outline" onClick={() => navigate('/admin')} className="border-red-200 hover:bg-red-50">
                {t('electionCreation.buttons.cancel')}
              </Button>
              <Button
                onClick={() => {
                  saveChanges();
                  navigate('/admin');
                }}
              >
                {t('electionCreation.buttons.saveDraft')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default ElectionEditPage;
