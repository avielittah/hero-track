import { useState } from 'react';
import { motion } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface MultipleChoiceProps {
  question: string;
  options: string[];
  allowMultiple?: boolean;
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  disabled?: boolean;
}

export const MultipleChoice = ({ 
  question, 
  options, 
  allowMultiple = false, 
  value, 
  onChange, 
  disabled = false 
}: MultipleChoiceProps) => {
  if (allowMultiple) {
    const selectedValues = Array.isArray(value) ? value : [];
    
    const handleCheckboxChange = (option: string, checked: boolean) => {
      if (checked) {
        onChange([...selectedValues, option]);
      } else {
        onChange(selectedValues.filter(v => v !== option));
      }
    };

    return (
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">{question}</h3>
        <p className="text-sm text-muted-foreground mb-4">Select all that apply:</p>
        <div className="space-y-3">
          {options.map((option, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Checkbox
                id={`option-${index}`}
                checked={selectedValues.includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange(option, !!checked)}
                disabled={disabled}
              />
              <Label 
                htmlFor={`option-${index}`} 
                className={`text-sm ${disabled ? 'text-muted-foreground' : 'cursor-pointer'}`}
              >
                {option}
              </Label>
            </motion.div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-foreground mb-4">{question}</h3>
      <RadioGroup 
        value={typeof value === 'string' ? value : ''} 
        onValueChange={onChange}
        disabled={disabled}
      >
        <div className="space-y-3">
          {options.map((option, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RadioGroupItem value={option} id={`radio-${index}`} />
              <Label 
                htmlFor={`radio-${index}`} 
                className={`text-sm ${disabled ? 'text-muted-foreground' : 'cursor-pointer'}`}
              >
                {option}
              </Label>
            </motion.div>
          ))}
        </div>
      </RadioGroup>
    </Card>
  );
};