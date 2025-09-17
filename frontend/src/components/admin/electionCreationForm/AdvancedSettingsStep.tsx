import { useForm } from 'react-hook-form';
import { ElectionFormData } from './types';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, Image as ImageIcon, Settings2 } from 'lucide-react';
import ImageUploader from '../../ImageUploader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdvancedSettingsStepProps {
  form: ReturnType<typeof useForm<ElectionFormData>>;
  prevStep: () => void;
  bannerImageUrl: string;
  setBannerImageUrl: (url: string) => void;
}

export const AdvancedSettingsStep = ({
  form,
  prevStep,
  bannerImageUrl,
  setBannerImageUrl,
}: AdvancedSettingsStepProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Advanced Settings</h2>
        <p className="text-muted-foreground">Customize the appearance and behavior of your election.</p>
      </div>

      <Card className="border-2 hover:border-primary/50 transition-colors duration-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Settings2 className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Customizable Voting UI</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <FormLabel className="flex items-center text-sm font-medium text-muted-foreground">
                <ImageIcon className="h-4 w-4 mr-2" />
                Banner Image
              </FormLabel>
              <FormDescription className="text-sm text-muted-foreground">
                Upload a banner image to customize the election page header. Recommended size: 1200x400 pixels.
              </FormDescription>
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200">
              {bannerImageUrl ? (
                <div className="space-y-4">
                  <div className="relative w-full h-64 overflow-hidden rounded-lg shadow-md">
                    <img src={bannerImageUrl} alt="Banner Image" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/5 hover:bg-black/10 transition-colors duration-200" />
                  </div>
                  <div className="flex justify-center">
                    <ImageUploader
                      onUpload={setBannerImageUrl}
                      buttonText="Change Banner"
                      className="w-full sm:w-auto"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="p-4 rounded-full bg-gray-100">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium text-gray-900">No banner image uploaded</p>
                    <p className="text-sm text-gray-500">Upload a banner image to customize your election page</p>
                  </div>
                  <ImageUploader onUpload={setBannerImageUrl} buttonText="Upload Banner" className="w-full sm:w-auto" />
                </div>
              )}
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-gray-700">
                The banner image will be displayed at the top of your election page. Choose an image that represents
                your election well.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-4 pt-4 sm:flex-row sm:justify-between">
        <Button type="button" variant="outline" onClick={prevStep} className="w-full sm:w-auto">
          Back to Candidates
        </Button>

        <Button type="submit" className="w-full sm:w-auto">
          Create Election
        </Button>
      </div>
    </div>
  );
};
