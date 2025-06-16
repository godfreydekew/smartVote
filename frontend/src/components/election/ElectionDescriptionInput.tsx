import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FileText } from "lucide-react";
import { Control, Path } from "react-hook-form";
import { ElectionFormData } from '../admin/electionCreationForm/types';

interface ElectionDescriptionInputProps {
  control: Control<ElectionFormData>;
  name: Path<ElectionFormData>;
  description?: string;
  placeholder?: string;
}

const ElectionDescriptionInput: React.FC<ElectionDescriptionInputProps> = ({ 
  control, 
  name,
  description = "Provide voters with information about this election's purpose and importance.",
  placeholder = "Enter a detailed description of the election..."
}) => {
  return (
    <Card>
      <div className="p-6 border-b">
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-xl font-semibold">Election Description</h3>
        </div>
      </div>
      <CardContent className="p-6">
        <FormField
          control={control}
          name={name}
          rules={{
            required: 'Description is required',
            minLength: {
              value: 20,
              message: 'Description must be at least 20 characters'
            },
            maxLength: {
              value: 1000,
              message: 'Description cannot exceed 1000 characters'
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder={placeholder}
                  className="min-h-[150px]"
                  value={field.value as string}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <div className="flex justify-between items-center mt-2">
                <FormDescription>
                  {description}
                </FormDescription>
                <span className={`text-sm ${(field.value as string)?.length > 1000 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {(field.value as string)?.length || 0}/1000 characters
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ElectionDescriptionInput;