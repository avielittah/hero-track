import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface OpenQuestionProps {
  question: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const OpenQuestion = ({ 
  question, 
  value = '', 
  onChange, 
  disabled = false,
  placeholder = "Enter your answer here..."
}: OpenQuestionProps) => {
  return (
    <Card className="p-6">
      <Label htmlFor="open-question" className="text-base font-semibold text-foreground mb-4 block">
        {question}
      </Label>
      <Textarea
        id="open-question"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={disabled ? "Answer submitted" : placeholder}
        className="min-h-[120px] resize-none"
        maxLength={500}
      />
      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
        <span>Maximum 500 characters</span>
        <span>{value.length}/500</span>
      </div>
    </Card>
  );
};