import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, setHours, setMinutes } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface DateTimePickerProps {
  control: any;
  name: string;
  label: string;
  disabledDates?: (date: Date) => boolean;
  className?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  control,
  name,
  label,
  disabledDates,
  className = ''
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`flex flex-col ${className}`}>
          <FormLabel>{label}</FormLabel>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant={'outline'} className="w-full pl-3 text-left font-normal">
                    {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  disabled={disabledDates}
                />
              </PopoverContent>
            </Popover>
            <div className="flex gap-2">
              <Select
                onValueChange={(hour) => {
                  const newDate = setHours(field.value || new Date(), parseInt(hour));
                  field.onChange(newDate);
                }}
                defaultValue={field.value ? format(field.value, 'HH') : '00'}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(minute) => {
                  const newDate = setMinutes(field.value || new Date(), parseInt(minute));
                  field.onChange(newDate);
                }}
                defaultValue={field.value ? format(field.value, 'mm') : '00'}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 60 }, (_, i) => (
                    <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};