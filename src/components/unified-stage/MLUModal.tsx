import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Target, BookOpen, CheckCircle2, Star, Play, ExternalLink, Trophy, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { MultipleChoice } from '@/features/units/Inputs/MultipleChoice';
import { OpenQuestion } from '@/features/units/Inputs/OpenQuestion';
import { FileUpload } from '@/features/units/Inputs/FileUpload';
import { QuickFeedback } from '@/features/units/Inputs/QuickFeedback';
import { DidYouKnowBox } from './DidYouKnowBox';
import { MiniQuiz } from './MiniQuiz';
import { useLearningStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { LevelUpModal } from '@/components/LevelUpModal';

interface MLUData {
  id: string;
  title: string;
  subtitle?: string;
  estimatedTime: string;
  objective: string;
  background: string;
  icon?: React.ReactNode;
  visual?: {
    type: 'image' | 'diagram' | 'placeholder';
    src?: string;
    alt?: string;
    caption?: string;
  };
  video?: {
    type: 'youtube' | 'link' | 'placeholder';
    url?: string;
    title?: string;
  };
  tasks: Array<{
    type: 'text' | 'numbered-list' | 'bullet-list';
    content: string | string[];
  }>;
  quiz: {
    questions: Array<{
      type: 'multiple-choice' | 'open-question' | 'file-upload';
      question: string;
      options?: string[];
      correctIndex?: number;
    }>;
    xpReward: number;
  };
  didYouKnow: {
    title: string;
    content: string;
    xpReward: number;
  };
  baseXP: number;
  totalXP: number;
}

interface MLUModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitData: MLUData;
  stageXP: { earned: number; total: number };
  onComplete: (earnedXP: number) => void;
  isCompleted?: boolean;
}

export function MLUModal({ 
  isOpen, 
  onClose, 
  unitData, 
  stageXP, 
  onComplete, 
  isCompleted = false 
}: MLUModalProps) {
  const { addXP, level: currentLevel, currentXP } = useLearningStore();
  const { toast } = useToast();
  
  // State management
  const [quizAnswers, setQuizAnswers] = useState<any[]>([]);
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' });
  const [didYouKnowClaimed, setDidYouKnowClaimed] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpData, setLevelUpData] = useState<any>(null);
  const [earnedXP, setEarnedXP] = useState(0);

  // Validation
  const isQuizValid = unitData.quiz.questions.every((_, index) => {
    const answer = quizAnswers[index];
    return answer !== undefined && answer !== null && answer !== '';
  });
  
  const isFeedbackValid = feedback.rating > 0;
  const canComplete = isQuizValid && isFeedbackValid && !isCompleted;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && !isCompleted) {
      setQuizAnswers([]);
      setFeedback({ rating: 0, comment: '' });
      setDidYouKnowClaimed(false);
      setQuizCompleted(false);
      setEarnedXP(0);
    }
  }, [isOpen, isCompleted]);

  const handleQuizAnswer = (questionIndex: number, answer: any) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answer;
    setQuizAnswers(newAnswers);
  };

  const handleQuizComplete = () => {
    if (!quizCompleted) {
      setQuizCompleted(true);
      const xp = unitData.quiz.xpReward;
      setEarnedXP(prev => prev + xp);
      toast({
        title: "Quiz Complete! 🧠",
        description: `+${xp} XP earned for learning!`,
      });
    }
  };

  const handleDidYouKnowClaim = () => {
    if (!didYouKnowClaimed) {
      setDidYouKnowClaimed(true);
      const xp = unitData.didYouKnow.xpReward;
      setEarnedXP(prev => prev + xp);
      toast({
        title: "Curiosity Rewarded! 💡",
        description: `+${xp} XP for exploring!`,
      });
    }
  };

  const handleFinishUnit = async () => {
    if (!canComplete) return;

    const totalEarnedXP = unitData.baseXP + earnedXP;
    
    try {
      // Award XP and check for level up
      const result = await addXP(totalEarnedXP);
      
      // Show level up modal if leveled up
      if (result.leveledUp && result.newLevel && result.previousLevel) {
        setLevelUpData({
          newLevel: result.newLevel,
          previousLevel: result.previousLevel,
        });
        setShowLevelUpModal(true);
      }

      // Show completion toast with confetti effect
      toast({
        title: "Unit Completed! 🎉",
        description: `Amazing work! You earned ${totalEarnedXP} XP total!`,
      });

      // Complete the unit
      onComplete(totalEarnedXP);
      
      // Small delay then close
      setTimeout(() => {
        onClose();
      }, 1000);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Completion failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const renderVisual = () => {
    if (!unitData.visual) return null;

    switch (unitData.visual.type) {
      case 'image':
        return (
          <div className="space-y-2">
            <img 
              src={unitData.visual.src} 
              alt={unitData.visual.alt} 
              className="w-full rounded-lg border"
            />
            {unitData.visual.caption && (
              <p className="text-sm text-muted-foreground text-center">
                {unitData.visual.caption}
              </p>
            )}
          </div>
        );
      
      case 'diagram':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-blue-300 dark:border-blue-700 text-center">
              <p className="text-sm text-muted-foreground mb-2">📊 {unitData.visual.caption || 'Interactive Diagram'}</p>
              <div className="w-full h-32 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded flex items-center justify-center">
                <span className="text-xs text-muted-foreground">{unitData.visual.alt}</span>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-muted rounded-lg p-8 text-center">
            <div className="text-4xl mb-2">🖼️</div>
            <p className="text-sm text-muted-foreground">Visual content placeholder</p>
          </div>
        );
    }
  };

  const renderVideo = () => {
    if (!unitData.video) return null;

    switch (unitData.video.type) {
      case 'youtube':
        return (
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                src={unitData.video.url}
                className="w-full h-full"
                allowFullScreen
                title={unitData.video.title || 'Learning Video'}
              />
            </div>
          </div>
        );
      
      case 'link':
        return (
          <Button
            variant="outline"
            asChild
            className="w-full h-20 flex-col gap-2"
          >
            <a href={unitData.video.url} target="_blank" rel="noopener noreferrer">
              <Play className="h-6 w-6" />
              <span>{unitData.video.title || 'Watch Video'}</span>
            </a>
          </Button>
        );
      
      default:
        return (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-xl p-6 border border-red-200 dark:border-red-800">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-red-300 dark:border-red-700">
              <div className="aspect-video bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 rounded flex items-center justify-center mb-3">
                <div className="text-center">
                  <div className="text-4xl mb-2">▶️</div>
                  <p className="text-sm font-medium">{unitData.video.title || 'Video Tutorial'}</p>
                  <p className="text-xs text-muted-foreground">Tutorial content coming soon</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderTasks = () => {
    return (
      <div className="space-y-4">
        {unitData.tasks.map((task, index) => (
          <div key={index}>
            {task.type === 'text' && (
              <p className="text-muted-foreground">{task.content as string}</p>
            )}
            {task.type === 'numbered-list' && (
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                {(task.content as string[]).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            )}
            {task.type === 'bullet-list' && (
              <ul className="space-y-2 text-muted-foreground">
                {(task.content as string[]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderQuizQuestions = () => {
    return (
      <div className="space-y-6">
        {unitData.quiz.questions.map((question, index) => (
          <div key={index}>
            {question.type === 'multiple-choice' && (
              <MultipleChoice
                question={question.question}
                options={question.options || []}
                value={quizAnswers[index] || ''}
                onChange={(value) => handleQuizAnswer(index, value)}
                disabled={isCompleted}
              />
            )}
            {question.type === 'open-question' && (
              <OpenQuestion
                question={question.question}
                value={quizAnswers[index] || ''}
                onChange={(value) => handleQuizAnswer(index, value)}
                disabled={isCompleted}
              />
            )}
            {question.type === 'file-upload' && (
              <FileUpload
                question={question.question}
                value={quizAnswers[index]}
                onChange={(value) => handleQuizAnswer(index, value)}
                disabled={isCompleted}
              />
            )}
          </div>
        ))}
        
        {isQuizValid && !quizCompleted && !isCompleted && (
          <Button
            onClick={handleQuizComplete}
            className="w-full"
            variant="outline"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Complete Quiz (+{unitData.quiz.xpReward} XP)
          </Button>
        )}
      </div>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[96vw] max-w-6xl h-[92vh] max-h-[92vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b sticky top-0 z-10 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">{unitData.title}</h2>
                {unitData.subtitle && (
                  <p className="text-sm text-muted-foreground">{unitData.subtitle}</p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Stage XP Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Stage Progress</span>
                <span>{stageXP.earned} / {stageXP.total} XP</span>
              </div>
              <Progress value={(stageXP.earned / stageXP.total) * 100} className="h-2" />
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
            {/* 1. Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {unitData.icon && (
                      <div className="p-3 bg-gradient-to-br from-primary to-primary-700 text-white rounded-xl">
                        {unitData.icon}
                      </div>
                    )}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {unitData.estimatedTime}
                        </Badge>
                        <Badge variant="outline">+{unitData.totalXP} XP possible</Badge>
                        {isCompleted && (
                          <Badge className="bg-journey-complete text-white">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">Learning Objective</h3>
                      </div>
                      <p className="text-muted-foreground">{unitData.objective}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            {/* 2. Background */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Why This Matters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{unitData.background}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* 3. Learning Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Visual */}
              {unitData.visual && (
                <Card>
                  <CardHeader>
                    <CardTitle>Visual Guide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderVisual()}
                  </CardContent>
                </Card>
              )}

              {/* Video */}
              {unitData.video && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      Video Tutorial
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderVideo()}
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* 4. Guided Task */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Your Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderTasks()}
                </CardContent>
              </Card>
            </motion.div>

            {/* 5. Mini-Quiz */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Check</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderQuizQuestions()}
                </CardContent>
              </Card>
            </motion.div>

            {/* 6. Did You Know? */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <DidYouKnowBox
                title={unitData.didYouKnow.title}
                content={unitData.didYouKnow.content}
                xpReward={unitData.didYouKnow.xpReward}
                onRewardClaim={handleDidYouKnowClaim}
                disabled={didYouKnowClaimed || isCompleted}
              />
            </motion.div>

            {/* 7. Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>How Was This Unit?</CardTitle>
                </CardHeader>
                <CardContent>
                  <QuickFeedback
                    value={feedback}
                    onChange={setFeedback}
                    disabled={isCompleted}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* 8. Completion CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              {!isCompleted && (
                <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary-700/5">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Ready to Complete?</h3>
                        <p className="text-sm text-muted-foreground">
                          You'll earn <strong>{unitData.baseXP + earnedXP} XP</strong> total for completing this unit!
                        </p>
                      </div>
                      
                      {!canComplete && (
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Still needed:</p>
                          <ul className="text-xs space-y-1">
                            {!isQuizValid && <li>• Complete the quiz questions</li>}
                            {!isFeedbackValid && <li>• Provide a rating (1-5 stars)</li>}
                          </ul>
                        </div>
                      )}
                      
                      <Button
                        onClick={handleFinishUnit}
                        disabled={!canComplete}
                        size="lg"
                        className="w-full bg-gradient-to-r from-primary to-primary-700 hover:from-primary-700 hover:to-primary shadow-lg"
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        Finish Unit & Earn XP 🎉
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isCompleted && (
                <Card className="border-journey-complete/30 bg-gradient-to-r from-journey-complete/10 to-journey-complete/5">
                  <CardContent className="p-6 text-center">
                    <div className="space-y-2">
                      <CheckCircle2 className="h-8 w-8 text-journey-complete mx-auto" />
                      <h3 className="font-semibold text-lg">Unit Completed! 🎉</h3>
                      <p className="text-sm text-muted-foreground">
                        Great work! You've mastered this learning unit.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Back to Stage
                </Button>
              </div>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Level Up Modal */}
      {showLevelUpModal && levelUpData && (
        <LevelUpModal
          isOpen={showLevelUpModal}
          onClose={() => setShowLevelUpModal(false)}
          newLevel={levelUpData.newLevel}
          previousLevel={levelUpData.previousLevel}
          currentXP={currentXP}
        />
      )}
    </>
  );
}