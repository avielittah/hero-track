import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface CheckboxProps {
  question: string;
  options?: string[];
  value?: boolean | string[];
  onChange: (value: boolean | string[]) => void;
  disabled?: boolean;
  requireAtLeastOne?: boolean;
}

export const CheckboxInput = ({ 
  question, 
  options, 
  value, 
  onChange, 
  disabled = false,
  requireAtLeastOne = false
}: CheckboxProps) => {
  // Simple yes/no checkbox
  if (!options || options.length === 0) {
    const isChecked = typeof value === 'boolean' ? value : false;
    
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-3">
          <ShadcnCheckbox
            id="yes-no-checkbox"
            checked={isChecked}
            onCheckedChange={(checked) => onChange(!!checked)}
            disabled={disabled}
          />
          <Label 
            htmlFor="yes-no-checkbox" 
            className={`text-base font-semibold ${disabled ? 'text-muted-foreground' : 'cursor-pointer'}`}
          >
            {question}
          </Label>
        </div>
      </Card>
    );
  }

  // Multiple options checkbox
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
      {requireAtLeastOne && (
        <p className="text-sm text-muted-foreground mb-4">Select at least one option:</p>
      )}
      <div className="space-y-3">
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <ShadcnCheckbox
              id={`checkbox-${index}`}
              checked={selectedValues.includes(option)}
              onCheckedChange={(checked) => handleCheckboxChange(option, !!checked)}
              disabled={disabled}
            />
            <Label 
              htmlFor={`checkbox-${index}`} 
              className={`text-sm ${disabled ? 'text-muted-foreground' : 'cursor-pointer'}`}
            >
              {option}
            </Label>
          </div>
        ))}
      </div>
      {requireAtLeastOne && selectedValues.length === 0 && !disabled && (
        <p className="text-sm text-destructive mt-2">Please select at least one option</p>
      )}
    </Card>
  );
};