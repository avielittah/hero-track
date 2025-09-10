import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileUpload } from '@/features/units/Inputs/FileUpload';
import { MultipleChoice } from '@/features/units/Inputs/MultipleChoice';
import { OpenQuestion } from '@/features/units/Inputs/OpenQuestion';
import { QuickFeedback } from '@/features/units/Inputs/QuickFeedback';
import { useLearningStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { stage3Content } from '../stage3.content';
import { CheckCircle2, Clock, Target, BookOpen } from 'lucide-react';

interface VLCUnitProps {
  isSubmitted: boolean;
  onSubmit: () => void;
}

export function VLCUnit({ isSubmitted, onSubmit }: VLCUnitProps) {
  const { addXP } = useLearningStore();
  const { toast } = useToast();
  const unitData = stage3Content.units.vlc;

  const [mcqAnswers, setMcqAnswers] = useState<(number | null)[]>([null, null]);
  const [openAnswer, setOpenAnswer] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' });
  const [isDraft, setIsDraft] = useState(false);

  const isValid = mcqAnswers.every(answer => answer !== null) && 
                  openAnswer.trim().length > 0 && 
                  uploadedFile !== null;

  const handleMCQChange = (questionIndex: number, answerIndex: number) => {
    if (!isSubmitted) {
      const newAnswers = [...mcqAnswers];
      newAnswers[questionIndex] = answerIndex;
      setMcqAnswers(newAnswers);
    }
  };

  const handleSaveDraft = () => {
    setIsDraft(true);
    toast({
      title: "Draft saved",
      description: "Your progress has been saved automatically.",
    });
  };

  const handleSubmit = () => {
    if (!isValid) return;

    addXP(unitData.xpOnSubmit);
    onSubmit();
    
    toast({
      title: "Unit submitted!",
      description: `Excellent! You've earned +${unitData.xpOnSubmit} XP`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Unit Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Learning Objective</h3>
        </div>
        <p className="text-muted-foreground">{unitData.objective}</p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {unitData.estimatedTime}
          </div>
          <Badge variant="secondary">+{unitData.xpOnSubmit} XP</Badge>
        </div>
      </div>

      <Separator />

      {/* Background & Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Background
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{unitData.background}</p>
          
          <div className="space-y-2">
            <h4 className="font-medium">What you'll learn:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {unitData.contentBullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Your tasks:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {unitData.tasks.map((task, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  {task}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Section */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Check</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {unitData.quiz.mcq.map((question, index) => (
            <MultipleChoice
              key={index}
              question={question.q}
              options={[...question.options]}
              value={mcqAnswers[index] !== null ? question.options[mcqAnswers[index]!] : ''}
               onChange={(value) => {
                const options = [...question.options] as string[];
                const answerIndex = options.indexOf(value as string);
                handleMCQChange(index, answerIndex);
              }}
              disabled={isSubmitted}
            />
          ))}

          <OpenQuestion
            question={unitData.quiz.open}
            value={openAnswer}
            onChange={setOpenAnswer}
            disabled={isSubmitted}
            placeholder="Describe your use-case..."
          />
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Work</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            question="Upload your VLC screenshot (PNG/JPG format)"
            value={uploadedFile}
            onChange={setUploadedFile}
            disabled={isSubmitted}
          />
        </CardContent>
      </Card>

      {/* Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <QuickFeedback
            value={feedback}
            onChange={setFeedback}
            disabled={isSubmitted}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {!isSubmitted && (
        <motion.div 
          className="flex gap-3 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            className="flex-1"
          >
            Save Draft
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="flex-1"
          >
            Submit Unit
          </Button>
        </motion.div>
      )}

      {isSubmitted && (
        <motion.div 
          className="flex items-center justify-center gap-2 p-4 bg-emerald-50 rounded-lg border border-emerald-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span className="text-emerald-800 font-medium">Unit completed! Excellent work.</span>
        </motion.div>
      )}
    </div>
  );
}