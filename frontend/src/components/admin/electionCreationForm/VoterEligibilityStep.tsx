import { useForm } from 'react-hook-form';
import { ElectionFormData } from './types';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface VoterEligibilityStepProps {
  form: ReturnType<typeof useForm<ElectionFormData>>;
  prevStep: () => void;
  nextStep: () => void;
  csvFile: File | null;
  csvPreview: string[];
  csvErrors: string[];
  handleCsvUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const VoterEligibilityStep = ({
  form,
  prevStep,
  nextStep,
  csvFile,
  csvPreview,
  csvErrors,
  handleCsvUpload,
}: VoterEligibilityStepProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="accessControl"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Access Control</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="csv" />
                  </FormControl>
                  <FormLabel className="font-normal">Upload CSV with voter emails (max 10MB)</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="manual" />
                  </FormControl>
                  <FormLabel className="font-normal">Manual entry (tag input field)</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="invite" />
                  </FormControl>
                  <FormLabel className="font-normal">Invite-only (generates shareable links)</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="public" />
                  </FormControl>
                  <FormLabel className="font-normal">Public with restrictions</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch('accessControl') === 'csv' && (
        <div className="border rounded-md p-4 space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="csv-upload"
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer 
              ${csvFile ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'}`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload CSV</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">CSV with email addresses (MAX. 10MB)</p>
                {csvFile && (
                  <Badge variant="outline" className="mt-2 bg-green-50">
                    {csvFile.name}
                  </Badge>
                )}
              </div>
              <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
            </label>
          </div>

          {csvPreview.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Email Preview</h4>
              <div className="max-h-32 overflow-y-auto bg-gray-50 rounded p-2 text-sm">
                {csvPreview.map((email, i) => (
                  <div key={i} className={`mb-1 ${csvErrors.includes(email) ? 'text-red-500' : ''}`}>
                    {email} {csvErrors.includes(email) && '(Invalid)'}
                  </div>
                ))}
              </div>

              {csvErrors.length > 0 && (
                <div className="mt-2 text-red-500 text-sm flex items-center">
                  <span className="font-medium">{csvErrors.length} invalid emails found.</span>
                  <Button variant="link" size="sm" className="text-red-500 h-auto p-0 ml-1">
                    Fix or exclude?
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {form.watch('accessControl') === 'public' && (
        <div className="border rounded-md p-4 space-y-4">
          <FormField
            control={form.control}
            name="ageRestriction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Age Requirements</FormLabel>
                <FormControl>
                  <div className="pt-6 pb-2">
                    <Slider
                      defaultValue={field.value}
                      max={120}
                      min={18}
                      step={1}
                      onValueChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <div className="text-right text-sm text-gray-500">{field.value} years or older</div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="regions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Eligible Regions</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const current = field.value || [];
                    if (!current.includes(value)) {
                      field.onChange([...current, value]);
                    }
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Add regions" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                  </SelectContent>
                </Select>
                {field.value && field.value.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((region) => (
                      <Badge key={region} variant="secondary">
                        {region === 'us'
                          ? 'United States'
                          : region === 'ca'
                            ? 'Canada'
                            : region === 'uk'
                              ? 'United Kingdom'
                              : 'Australia'}
                        <button
                          type="button"
                          className="ml-1 hover:text-destructive"
                          onClick={() => {
                            field.onChange(field.value!.filter((r) => r !== region));
                          }}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <FormDescription>Leave empty to allow all regions</FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="useCaptcha"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Enable CAPTCHA</FormLabel>
                  <FormDescription>Helps prevent automated voting</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button type="button" onClick={nextStep}>
          Next: Candidates
        </Button>
      </div>
    </div>
  );
};