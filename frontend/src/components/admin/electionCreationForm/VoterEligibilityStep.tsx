import { useForm } from 'react-hook-form';
import { ElectionFormData } from './types';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const electionType = form.watch('type');
  const invitedEmails = form.watch('invitedEmails');
  const [isInvitedEmailsOpen, setIsInvitedEmailsOpen] = useState(electionType === 'invite-only' || (invitedEmails && invitedEmails.length > 0));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Voter Eligibility</h2>
      <p className="text-muted-foreground">
        Define who is eligible to vote in this election.
      </p>

      <div className="border rounded-md p-4 space-y-4">
        <h3 className="text-lg font-semibold mb-2">General Eligibility Criteria</h3>
        <p className="text-sm text-muted-foreground mb-4">These criteria apply to all voters, regardless of election type.</p>

        <FormField
          control={form.control}
          name="kycRequired"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Require KYC Verification</FormLabel>
                <FormDescription>Only voters with verified KYC can participate.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ageRestriction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age Restriction</FormLabel>
              <FormControl>
                <div className="pt-6 pb-2">
                  <Slider
                    min={18}
                    max={120}
                    step={1}
                    value={field.value || [18, 120]}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={[18, 120]} // Explicitly set defaultValue as an array
                  />
                </div>
              </FormControl>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Min: {field.value ? field.value[0] : 18}</span>
                <span>Max: {field.value ? field.value[1] : 120}</span>
              </div>
              <FormDescription>Leave default for no age restriction.</FormDescription>
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
                  <SelectItem value="Türkiye">Türkiye</SelectItem>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                </SelectContent>
              </Select>
              {field.value && field.value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((region) => (
                    <Badge key={region} variant="secondary">
                      {region}
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
              <FormDescription>Leave empty to allow all regions.</FormDescription>
            </FormItem>
          )}
        />
      </div>

      <Collapsible open={isInvitedEmailsOpen} onOpenChange={setIsInvitedEmailsOpen} className="space-y-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>Invite List Management {electionType === 'invite-only' && '(Required)'}</span>
            {isInvitedEmailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="border rounded-md p-4 space-y-4">
          <p className="text-sm text-muted-foreground mb-4">Only users on this invite list can participate. They must also meet the general eligibility criteria above.</p>

          <FormField
            control={form.control}
            name="invitedEmails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invited Emails</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter invited emails, one per line, or upload a CSV"
                    className="min-h-[120px]"
                    value={field.value ? field.value.join('\n') : ''}
                    onChange={(e) => field.onChange(e.target.value.split('\n').map(email => email.trim()))}
                  />
                </FormControl>
                <FormDescription>List email addresses, one per line.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    {email}{csvErrors.includes(email) && '(Invalid)'}
                  </div>
                ))}
              </div>

              {csvErrors.length > 0 && (
                <div className="mt-2 text-red-500 text-sm flex items-center">
                  <span className="font-medium">{csvErrors.length} invalid emails found and execluded.</span>
                </div>
              )}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

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