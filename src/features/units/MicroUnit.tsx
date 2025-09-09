import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Target, 
  BookOpen, 
  Save, 
  Send, 
  Eye,
  CheckCircle,
  AlertCircle,
  Play,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useJourneyMachine } from '../journey/journeyMachine';

import { MultipleChoice } from './Inputs/MultipleChoice';
import { OpenQuestion } from './Inputs/OpenQuestion';
import { CheckboxInput } from './Inputs/CheckboxInput';
import { FileUpload } from './Inputs/FileUpload';
import { QuickFeedback } from './Inputs/QuickFeedback';

import { UnitData, persistAdapter } from '@/lib/persist';

interface MicroUnitProps {
  unitId: string;
  unitData: Partial<UnitData>;
}

export const MicroUnit = ({ unitId, unitData: initialData }: MicroUnitProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isStageEditable, viewingStage } = useJourneyMachine();
  
  const [unitData, setUnitData] = useState<UnitData>(() => {
    const stored = persistAdapter.getUnit(unitId);
    return stored || {
      id: unitId,
      title: initialData.title || 'Learning Unit',
      objective: initialData.objective || 'Complete the learning objectives',
      background: initialData.background,
      estimatedTime: initialData.estimatedTime || 15,
      content: initialData.content || { type: 'text', data: 'Content will be loaded here...' },
      task: initialData.task || {
        type: 'multiple-choice',
        question: 'What did you learn from this unit?',
        options: ['Key concept 1', 'Key concept 2', 'Key concept 3'],
        allowMultiple: false,
      },
      status: 'draft',
    };
  });

  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [showMissingItems, setShowMissingItems] = useState(false);
  
  const isSubmitted = unitData.status === 'submitted';
  const isEditable = isStageEditable(viewingStage) && !isSubmitted;

  useEffect(() => {
    // Auto-save drafts every 30 seconds
    if (isEditable && unitData.status === 'draft') {
      const autoSaveInterval = setInterval(() => {
        handleSaveDraft(true); // silent save
      }, 30000);

      return () => clearInterval(autoSaveInterval);
    }
  }, [unitData, isEditable]);

  const handleTaskResponse = (answer: any) => {
    setUnitData(prev => ({
      ...prev,
      response: {
        ...prev.response,
        answer,
        feedback: prev.response?.feedback || { rating: 0, comment: '' }
      }
    }));
  };

  const handleFeedbackChange = (feedback: { rating: number; comment: string }) => {
    setUnitData(prev => ({
      ...prev,
      response: {
        ...prev.response,
        answer: prev.response?.answer,
        feedback
      }
    }));
  };

  const handleSaveDraft = (silent = false) => {
    try {
      persistAdapter.saveDraft(unitData);
      setLastSaved(new Date().toLocaleTimeString());
      
      if (!silent) {
        toast({
          title: "Draft saved",
          description: "Your progress has been saved locally",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Unable to save your progress",
      });
    }
  };

  const getMissingRequirements = (): string[] => {
    const missing: string[] = [];
    
    if (!unitData.response?.answer) {
      missing.push('Complete the task/quiz');
    }
    
    if (!unitData.response?.feedback?.rating) {
      missing.push('Provide a rating (1-5 stars)');
    }

    // Check specific task requirements
    if (unitData.task.type === 'checkbox' && unitData.task.required) {
      const answer = unitData.response?.answer;
      if (Array.isArray(answer) && answer.length === 0) {
        missing.push('Select at least one checkbox option');
      }
    }

    return missing;
  };

  const handleSubmitUnit = () => {
    const missingItems = getMissingRequirements();
    
    if (missingItems.length > 0) {
      setShowMissingItems(true);
      toast({
        variant: "destructive",
        title: "Cannot submit unit",
        description: `Please complete: ${missingItems.join(', ')}`,
      });
      return;
    }

    try {
      persistAdapter.submitUnit(unitData);
      setUnitData(prev => ({ ...prev, status: 'submitted', submittedAt: new Date().toISOString() }));
      setShowMissingItems(false);
      
      toast({
        title: "Unit submitted!",
        description: "Your responses have been saved and locked",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submit failed",
        description: "Unable to submit your unit",
      });
    }
  };

  const renderContent = () => {
    const { content } = unitData;
    
    switch (content.type) {
      case 'video':
        return (
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <iframe
              src={content.data}
              className="w-full h-full"
              allowFullScreen
              title="Learning Video"
            />
          </div>
        );
      
      case 'link':
        return (
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center space-x-3">
              <ExternalLink className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">External Resource</p>
                <a 
                  href={content.data} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  {content.data}
                </a>
              </div>
            </div>
          </Card>
        );
      
      default:
        return (
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              {content.data}
            </p>
          </div>
        );
    }
  };

  const renderTaskInput = () => {
    const { task } = unitData;
    const answer = unitData.response?.answer;

    switch (task.type) {
      case 'multiple-choice':
        return (
          <MultipleChoice
            question={task.question}
            options={task.options || []}
            allowMultiple={task.allowMultiple}
            value={answer}
            onChange={handleTaskResponse}
            disabled={!isEditable}
          />
        );

      case 'open-question':
        return (
          <OpenQuestion
            question={task.question}
            value={answer || ''}
            onChange={handleTaskResponse}
            disabled={!isEditable}
          />
        );

      case 'checkbox':
        return (
          <CheckboxInput
            question={task.question}
            options={task.options}
            value={answer}
            onChange={handleTaskResponse}
            disabled={!isEditable}
            requireAtLeastOne={task.required}
          />
        );

      case 'file-upload':
        return (
          <FileUpload
            question={task.question}
            value={answer}
            onChange={handleTaskResponse}
            disabled={!isEditable}
          />
        );

      default:
        return <div>Unknown task type</div>;
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-foreground">{unitData.title}</h1>
                {isSubmitted && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Submitted • Preview
                  </Badge>
                )}
                {lastSaved && !isSubmitted && (
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    <Save className="h-3 w-3 mr-1" />
                    Draft saved {lastSaved}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{unitData.estimatedTime} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="h-4 w-4" />
                  <span>Learning Unit</span>
                </div>
                {unitData.content.type === 'video' && (
                  <div className="flex items-center space-x-1">
                    <Play className="h-4 w-4" />
                    <span>Video Content</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center space-x-2">
                <Target className="h-4 w-4 text-primary" />
                <span>Learning Objective</span>
              </h3>
              <p className="text-muted-foreground">{unitData.objective}</p>
            </div>

            {unitData.background && (
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>Background</span>
                </h3>
                <p className="text-muted-foreground">{unitData.background}</p>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Content</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderContent()}
        </CardContent>
      </Card>

      {/* Task */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Task / Quiz</h2>
        {renderTaskInput()}
      </div>

      {/* Feedback */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Your Feedback</h2>
        <QuickFeedback
          value={unitData.response?.feedback}
          onChange={handleFeedbackChange}
          disabled={!isEditable}
        />
      </div>

      {/* Missing Requirements Alert */}
      <AnimatePresence>
        {showMissingItems && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="border-destructive bg-destructive/5">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-destructive">Missing Requirements</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Complete the following to submit this unit:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                      {getMissingRequirements().map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      {isEditable && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {isSubmitted ? 
                  `Submitted on ${new Date(unitData.submittedAt!).toLocaleString()}` :
                  'Save your progress or submit when complete'
                }
              </div>
              
              <div className="flex items-center space-x-3">
                {!isSubmitted && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleSaveDraft()}
                      className="flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Draft</span>
                    </Button>
                    
                    <Button
                      onClick={handleSubmitUnit}
                      className="flex items-center space-x-2 bg-primary hover:bg-primary-700"
                    >
                      <Send className="h-4 w-4" />
                      <span>Submit Unit</span>
                    </Button>
                  </>
                )}
                
                {isSubmitted && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Unit Completed</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};