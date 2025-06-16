import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Plus, ScrollText } from "lucide-react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { ElectionFormData } from '../admin/electionCreationForm/types';

interface ElectionRulesInputProps {
  control: Control<ElectionFormData>;
  name: string;
  description?: string;
}

const ElectionRulesInput: React.FC<ElectionRulesInputProps> = ({ 
  control, 
  name,
  description = "Define the rules and guidelines for this election."
}) => {
  return (
    <Card>
      <div className="p-6 border-b">
        <div className="flex items-center">
          <ScrollText className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-xl font-semibold">Election Rules</h3>
        </div>
      </div>
      <CardContent className="p-6">
        <FormField
          control={control}
          name={name}
          rules={{
            required: 'At least one rule is required',
            validate: (value: string[]) => {
              if (!value || value.length === 0) {
                return 'At least one rule is required';
              }
              if (value.some(rule => !rule.trim())) {
                return 'Rules cannot be empty';
              }
              if (value.some(rule => rule.length > 200)) {
                return 'Rules cannot exceed 200 characters';
              }
              return true;
            }
          }}
          render={({ field }) => (
            <FormItem>
              <div className="space-y-3">
                {field.value.map((rule: string, index: number) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="text-blue-500">•</span>
                    <FormControl>
                      <Input
                        placeholder={`Rule ${index + 1}`}
                        value={rule}
                        onChange={(e) => {
                          const newRules = [...field.value];
                          newRules[index] = e.target.value;
                          field.onChange(newRules);
                        }}
                        className={!rule.trim() ? 'border-destructive' : ''}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newRules = field.value.filter((_, i) => i !== index);
                        field.onChange(newRules);
                      }}
                      disabled={field.value.length <= 1}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => field.onChange([...field.value, ''])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => field.onChange([
                    ...field.value,
                    'Each voter can vote only once',
                    'Voting is anonymous',
                    'Results will be published after election ends'
                  ])}
                >
                  Add Default Rules
                </Button>
              </div>
              
              <FormDescription>{description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ElectionRulesInput;