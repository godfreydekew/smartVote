import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Trash, Plus, User, Hash, Briefcase, Link2, Twitter, AlertCircle } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { ElectionFormData } from './types';
import ImageUploader from '../../ImageUploader';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define Zod schema for candidate validation
const candidateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  party: z.string().min(1, 'Party/Affiliation is required'),
  position: z.string().min(1, 'Position is required'),
  bio: z.string().min(20, 'Biography must be at least 20 characters'),
  photo: z.string().nullable(),
  twitter: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

interface CandidatesStepProps {
  prevStep: () => void;
  nextStep: () => void;
}

export const CandidatesStep = ({ prevStep, nextStep }: CandidatesStepProps) => {
  const { toast } = useToast();
  const { watch, setValue, formState: { errors }, trigger, control } = useFormContext<ElectionFormData>();
  const candidates = watch('candidates');

  const handleAddCandidate = () => {
    setValue('candidates', [
      ...candidates,
      {
        id: Date.now().toString(),
        name: '',
        party: '',
        position: '',
        bio: '',
        photo: null,
        twitter: '',
        website: '',
      },
    ]);
  };

  const handleRemoveCandidate = (index: number) => {
    if (candidates.length > 1) {
      const updatedCandidates = [...candidates];
      updatedCandidates.splice(index, 1);
      setValue('candidates', updatedCandidates);
      toast({
        title: 'Candidate removed',
        description: 'The candidate has been successfully removed.',
      });
    } else {
      toast({
        title: 'Cannot Remove',
        description: 'An election must have at least one candidate.',
        variant: 'destructive',
      });
    }
  };

  const updateCandidateField = (index: number, field: keyof ElectionFormData['candidates'][0], value: string) => {
    const updatedCandidates = [...candidates];
    updatedCandidates[index][field] = value;
    setValue('candidates', updatedCandidates);
    trigger(`candidates.${index}.${field}`);
  };

  const handleNext = async () => {
    const isValid = await trigger('candidates');
    if (isValid) {
      nextStep();
    } else {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields for each candidate.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Add Candidates</h2>
        <p className="text-muted-foreground">
          Add all candidates participating in this election. Include their photos and details.
        </p>
        {candidates.length === 0 && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need to add at least one candidate to proceed.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-6">
        {candidates.map((candidate, index) => (
          <Card key={candidate.id} className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors duration-200">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="text-sm font-medium px-3 py-1">
                    Candidate {index + 1}
                  </Badge>
                  {candidate.name && (
                    <span className="text-sm text-muted-foreground">
                      {candidate.name}
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCandidate(index)}
                  disabled={candidates.length <= 1}
                  className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Left Column - Photo and Basic Info */}
                <div className="space-y-6 lg:col-span-3">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-muted-foreground">Photo</label>
                    <div className="flex flex-col items-start gap-4">
                      {candidate.photo ? (
                        <>
                          <div className="relative w-32 h-32 rounded-full border-2 border-primary/20 overflow-hidden shadow-md">
                            <img 
                              src={candidate.photo} 
                              alt="Candidate" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <ImageUploader
                            onUpload={(url) => updateCandidateField(index, 'photo', url)}
                            buttonText="Change Photo"
                            className="w-full"
                          />
                        </>
                      ) : (
                        <div className="w-full">
                          <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                            <User className="h-8 w-8 text-gray-400" />
                          </div>
                          <ImageUploader
                            onUpload={(url) => updateCandidateField(index, 'photo', url)}
                            buttonText="Upload Photo"
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <FormField
                    control={control}
                    name={`candidates.${index}.name`}
                    rules={{ required: 'Name is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-sm font-medium text-muted-foreground">
                          <User className="h-4 w-4 mr-2" />
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Full name"
                            className="bg-background"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateCandidateField(index, 'name', e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Middle Column - Party and Position */}
                <div className="space-y-6 lg:col-span-4">
                  <FormField
                    control={control}
                    name={`candidates.${index}.party`}
                    rules={{ required: 'Party/Affiliation is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-sm font-medium text-muted-foreground">
                          <Hash className="h-4 w-4 mr-2" />
                          Party/Affiliation
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Political party or affiliation"
                            className="bg-background"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateCandidateField(index, 'party', e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`candidates.${index}.position`}
                    rules={{ required: 'Position is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-sm font-medium text-muted-foreground">
                          <Briefcase className="h-4 w-4 mr-2" />
                          Position
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Position running for"
                            className="bg-background"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateCandidateField(index, 'position', e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Right Column - Bio and Social */}
                <div className="space-y-6 lg:col-span-5">
                  <FormField
                    control={control}
                    name={`candidates.${index}.bio`}
                    rules={{ 
                      required: 'Biography is required',
                      minLength: {
                        value: 20,
                        message: 'Biography must be at least 20 characters'
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-muted-foreground">
                          Biography
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Candidate's background and qualifications"
                            className="min-h-[120px] bg-background resize-none"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateCandidateField(index, 'bio', e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={control}
                      name={`candidates.${index}.twitter`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center text-sm font-medium text-muted-foreground">
                            <Twitter className="h-4 w-4 mr-2" />
                            Twitter
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="@username"
                              className="bg-background"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                updateCandidateField(index, 'twitter', e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`candidates.${index}.website`}
                      rules={{
                        pattern: {
                          value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                          message: 'Must be a valid URL'
                        }
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center text-sm font-medium text-muted-foreground">
                            <Link2 className="h-4 w-4 mr-2" />
                            Website
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com"
                              className="bg-background"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                updateCandidateField(index, 'website', e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col-reverse gap-4 pt-4 sm:flex-row sm:justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={prevStep}
          className="w-full sm:w-auto"
        >
          Back to Basic info
        </Button>
        
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddCandidate}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </Button>
          
          <Button 
            type="button" 
            onClick={handleNext}
            className="w-full sm:w-auto"
          >
            Continue to Settings
          </Button>
        </div>
      </div>
    </div>
  );
};