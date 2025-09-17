import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ElectionFormData } from './types';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import ElectionRulesInput from '../../election/ElectionRulesInput';
import ElectionDescriptionInput from '../../election/ElectionDescriptionInput';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateTimePicker } from '../../election/DateTimePicker';
import {
  Calendar as CalendarIcon,
  Globe,
  Lock,
  Plus,
  Trash,
  Upload,
  User,
  Users,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

// Define Zod schema for validation
const basicInfoSchema = z
  .object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title cannot exceed 100 characters'),
    description: z
      .string()
      .min(20, 'Description must be at least 20 characters')
      .max(1000, 'Description cannot exceed 1000 characters'),
    rules: z
      .array(z.string())
      .min(1, 'At least one rule is required')
      .refine((rules) => rules.every((rule) => rule.trim().length > 0), 'Rules cannot be empty')
      .refine((rules) => rules.every((rule) => rule.length <= 200), 'Rules cannot exceed 200 characters'),
    organization: z.string().min(1, 'Organization is required'),
    startDate: z.date().refine((date) => {
      const now = new Date();
      const minStartDate = new Date(now.getTime() + 2 * 60 * 1000); // 2 minutes from now
      return date >= minStartDate;
    }, 'Start time must be at least 2 minutes ahead'),
    endDate: z.date(),
    isPublic: z.boolean(),
  })
  .refine(
    (data) => {
      return data.endDate > data.startDate;
    },
    {
      message: 'End time must be after start time',
      path: ['endDate'],
    }
  );

interface BasicInfoStepProps {
  form: ReturnType<typeof useForm<ElectionFormData>>;
  nextStep: () => void;
}

export const BasicInfoStep = ({ form, nextStep }: BasicInfoStepProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const {
    watch,
    trigger,
    formState: { errors },
  } = form;
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // Validate form before allowing next step
  const handleNext = async () => {
    const isValid = await trigger(['title', 'description', 'rules', 'organization', 'startDate', 'endDate']);

    if (isValid) {
      nextStep();
    } else {
      // Show the first error message in the toast
      const firstError = Object.values(errors)[0];
      toast({
        title: 'Validation Error',
        description: firstError?.message || 'Please fill in all required fields correctly.',
        variant: 'destructive',
      });
    }
  };

  // Validate dates when they change
  useEffect(() => {
    trigger(['startDate', 'endDate']);
  }, [startDate, endDate, trigger]);

  return (
    <div className="space-y-4">
      <Alert className="mb-4">
        <Info className="h-4 w-4" />
        <AlertTitle>{t('electionCreation.basicInfo.importantInfo.title')}</AlertTitle>
        <AlertDescription>
          <ul className="list-disc pl-4 mt-2 space-y-1">
            {t('electionCreation.basicInfo.importantInfo.requirements', { returnObjects: true }).map(
              (requirement: string, index: number) => (
                <li key={index}>{requirement}</li>
              )
            )}
          </ul>
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          rules={{
            required: t('electionCreation.basicInfo.fields.title.validation.required'),
            minLength: {
              value: 5,
              message: t('electionCreation.basicInfo.fields.title.validation.minLength'),
            },
            maxLength: {
              value: 100,
              message: t('electionCreation.basicInfo.fields.title.validation.maxLength'),
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('electionCreation.basicInfo.fields.title.label')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('electionCreation.basicInfo.fields.title.placeholder')}
                  {...field}
                  className={form.formState.errors.title ? 'border-destructive' : ''}
                />
              </FormControl>
              <FormDescription>{t('electionCreation.basicInfo.fields.title.description')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <ElectionDescriptionInput
          control={form.control}
          name="description"
          description={t('electionCreation.basicInfo.fields.description.description')}
          placeholder={t('electionCreation.basicInfo.fields.description.placeholder')}
        />

        <ElectionRulesInput
          control={form.control}
          name="rules"
          description={t('electionCreation.basicInfo.fields.rules.description')}
        />

        <FormField
          control={form.control}
          name="organization"
          rules={{ required: t('electionCreation.basicInfo.fields.organization.validation.required') }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('electionCreation.basicInfo.fields.organization.label')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className={form.formState.errors.organization ? 'border-destructive' : ''}>
                    <SelectValue placeholder={t('electionCreation.basicInfo.fields.organization.placeholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {t('electionCreation.basicInfo.fields.organization.options', { returnObjects: true }).map(
                    (option: string) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateTimePicker
            control={form.control}
            name="startDate"
            label={t('electionCreation.basicInfo.fields.dates.startDate')}
          />

          <DateTimePicker
            control={form.control}
            name="endDate"
            label={t('electionCreation.basicInfo.fields.dates.endDate')}
            disabledDates={(date) => {
              const start = new Date(form.getValues('startDate'));
              return date < new Date(start.setHours(0, 0, 0, 0));
            }}
          />
        </div>

        {(form.formState.errors.startDate || form.formState.errors.endDate) && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('electionCreation.basicInfo.validation.dateError')}</AlertTitle>
            <AlertDescription>
              {form.formState.errors.startDate?.message || form.formState.errors.endDate?.message}
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  {field.value ? (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      {t('electionCreation.basicInfo.fields.visibility.public.title')}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      {t('electionCreation.basicInfo.fields.visibility.private.title')}
                    </div>
                  )}
                </FormLabel>
                <FormDescription>
                  {field.value
                    ? t('electionCreation.basicInfo.fields.visibility.public.description')
                    : t('electionCreation.basicInfo.fields.visibility.private.description')}
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <div />
          <Button type="button" onClick={handleNext}>
            {t('electionCreation.basicInfo.buttons.next')}
          </Button>
        </div>
      </div>
    </div>
  );
};
