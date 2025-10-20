import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { X, Clock, Target, CheckCircle2, Trophy, MessageCircle, Bot, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MultipleChoice } from '@/features/units/Inputs/MultipleChoice';
import { OpenQuestion } from '@/features/units/Inputs/OpenQuestion';
import { FileUpload } from '@/features/units/Inputs/FileUpload';
import { QuickFeedback } from '@/features/units/Inputs/QuickFeedback';
import { MentorChatMessage, TypingIndicator } from './MentorChatMessage';
import { TasksChecklist } from './TasksChecklist';
import { MLUProgressSidebar } from '@/components/journey/MLUProgressSidebar';
import { useLearningStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { LevelUpModal } from '@/components/LevelUpModal';
import { useJourneyMachine } from '@/features/journey/journeyMachine';

interface MLUData {
  id: string;
  title: string;
  subtitle?: string;
  estimatedTime: string;
  objective: string;
  background: string;
  icon?: React.ReactNode;
  learningContent?: Array<{
    type: 'text' | 'bullet-list' | 'numbered-list';
    content: string | string[];
  }>;
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

interface ChatMLUModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitData: MLUData;
  stageXP: { earned: number; total: number };
  onComplete: (earnedXP: number) => void;
  isCompleted?: boolean;
  currentMLUIndex?: number;
  totalMLUs?: number;
  completedMLUs?: number[];
  mluTitles?: string[];
}

type ChatMessage = {
  id: string;
  type: 'mentor' | 'user';
  section?: 'intro' | 'background' | 'learning' | 'tasks' | 'quiz' | 'didYouKnow' | 'feedback' | 'complete';
  content?: React.ReactNode | ((props: any) => React.ReactNode);
  delay?: number;
};

export function ChatMLUModal({ 
  isOpen, 
  onClose, 
  unitData, 
  stageXP, 
  onComplete, 
  isCompleted = false,
  currentMLUIndex = 0,
  totalMLUs = 1,
  completedMLUs = [],
  mluTitles = []
}: ChatMLUModalProps) {
  const { addXP, awardMLUTrophy, checkForMedals, currentXP } = useLearningStore();
  const { currentStage } = useJourneyMachine();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<any[]>([]);
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' });
  const [earnedXP, setEarnedXP] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTrophyModal, setShowTrophyModal] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpData, setLevelUpData] = useState<any>(null);

  // Build message sequence
  useEffect(() => {
    if (!isOpen || isCompleted) return;

    const messageSequence: ChatMessage[] = [
      // Welcome
      {
        id: 'welcome',
        type: 'mentor',
        section: 'intro',
        delay: 0.5,
        content: (
          <div className="space-y-3">
            <p className="text-base font-medium">
              👋 Welcome to <strong>{unitData.title}</strong>
            </p>
            <p className="text-sm opacity-90">
              I'm your mentor for this learning unit. Let's work through this together!
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {unitData.estimatedTime}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Trophy className="h-3 w-3 mr-1" />
                +{unitData.totalXP} XP
              </Badge>
            </div>
          </div>
        )
      },
      // Objective
      {
        id: 'objective',
        type: 'mentor',
        section: 'intro',
        delay: 1.5,
        content: (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Target className="h-4 w-4" />
              Learning Objective
            </div>
            <p className="text-sm">{unitData.objective}</p>
          </div>
        )
      },
      // Background
      {
        id: 'background',
        type: 'mentor',
        section: 'background',
        delay: 3,
        content: (
          <div className="space-y-2">
            <p className="text-sm font-semibold">📚 Why This Matters</p>
            <p className="text-sm leading-relaxed">{unitData.background}</p>
          </div>
        )
      }
    ];

    // Learning content
    if (unitData.learningContent) {
      unitData.learningContent.forEach((content, idx) => {
        messageSequence.push({
          id: `learning-${idx}`,
          type: 'mentor',
          section: 'learning',
          delay: 4 + idx * 1.5,
          content: (
            <div className="space-y-2">
              {idx === 0 && (
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  ✨ Core Learning Content
                </p>
              )}
              {content.type === 'text' && (
                <p className="text-sm leading-relaxed">{content.content as string}</p>
              )}
              {content.type === 'bullet-list' && (
                <ul className="space-y-1.5 ml-2">
                  {(content.content as string[]).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {content.type === 'numbered-list' && (
                <ol className="list-decimal list-inside space-y-1.5 ml-2 text-sm">
                  {(content.content as string[]).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              )}
            </div>
          )
        });
      });
    }

    setMessages(messageSequence);
  }, [isOpen, isCompleted, unitData]);

  // Show messages progressively
  const [visibleCount, setVisibleCount] = useState(0);
  
  useEffect(() => {
    if (!isOpen || messages.length === 0) return;
    
    if (visibleCount < messages.length) {
      const nextMessage = messages[visibleCount];
      const delay = nextMessage.delay ? nextMessage.delay * 1000 : 0;
      
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages, visibleCount]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleCount]);

  const handleTaskToggle = (taskIndex: number, itemIndex: number) => {
    const key = taskIndex * 1000 + itemIndex;
    setCompletedTasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isAllTasksCompleted = (): boolean => {
    let total = 0;
    let done = 0;
    unitData.tasks.forEach((task, taskIndex) => {
      if (task.type === 'numbered-list' || task.type === 'bullet-list') {
        (task.content as string[]).forEach((_, itemIndex) => {
          total += 1;
          const key = taskIndex * 1000 + itemIndex;
          if (completedTasks[key]) done += 1;
        });
      }
    });
    return total > 0 ? done === total : true;
  };

  const handleQuizAnswer = (questionIndex: number, answer: any) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answer;
    setQuizAnswers(newAnswers);
  };

  const isQuizValid = unitData.quiz.questions.every((_, index) => {
    const answer = quizAnswers[index];
    return answer !== undefined && answer !== null && answer !== '';
  });

  const handleNextSection = () => {
    const nextIdx = currentSection + 1;
    setCurrentSection(nextIdx);

    // Add new messages based on section
    if (nextIdx === 1) {
      // Tasks section
      addTasksMessages();
    } else if (nextIdx === 2) {
      // Quiz section
      addQuizMessages();
    } else if (nextIdx === 3) {
      // Did you know
      addDidYouKnowMessages();
    } else if (nextIdx === 4) {
      // Feedback
      addFeedbackMessages();
    }
  };

  const addTasksMessages = () => {
    const newMessages: ChatMessage[] = [
      {
        id: 'tasks-intro',
        type: 'mentor',
        section: 'tasks',
        content: (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
              🎯 Your Mission
            </p>
            <p className="text-sm">Let's put your learning into practice with these hands-on tasks:</p>
          </div>
        )
      },
      {
        id: 'tasks-list',
        type: 'mentor',
        section: 'tasks',
        content: (props: any) => (
          <TasksChecklist 
            tasks={unitData.tasks}
            completedTasks={props.completedTasks}
            onTaskToggle={props.onTaskToggle}
          />
        )
      }
    ];

    setMessages(prev => [...prev, ...newMessages]);
    setVisibleCount(prev => prev + newMessages.length);
  };

  const addQuizMessages = () => {
    const newMessages: ChatMessage[] = [
      {
        id: 'quiz-intro',
        type: 'mentor',
        section: 'quiz',
        content: (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
              🧠 Knowledge Check
            </p>
            <p className="text-sm">Let's see what you've learned! Answer these questions:</p>
          </div>
        )
      }
    ];

    unitData.quiz.questions.forEach((question, index) => {
      newMessages.push({
        id: `quiz-${index}`,
        type: 'mentor',
        section: 'quiz',
        content: (props: any) => (
          <div className="w-full">
            {question.type === 'multiple-choice' && (
              <MultipleChoice
                question={question.question}
                options={question.options || []}
                value={props.quizAnswers[index] || ''}
                onChange={(value) => props.handleQuizAnswer(index, value)}
                disabled={false}
              />
            )}
            {question.type === 'open-question' && (
              <OpenQuestion
                question={question.question}
                value={props.quizAnswers[index] || ''}
                onChange={(value) => props.handleQuizAnswer(index, value)}
                disabled={false}
              />
            )}
            {question.type === 'file-upload' && (
              <FileUpload
                question={question.question}
                value={props.quizAnswers[index]}
                onChange={(value) => props.handleQuizAnswer(index, value)}
                disabled={false}
              />
            )}
          </div>
        )
      });
    });

    setMessages(prev => [...prev, ...newMessages]);
    setVisibleCount(prev => prev + newMessages.length);
  };

  const addDidYouKnowMessages = () => {
    const newMessages: ChatMessage[] = [
      {
        id: 'didyouknow',
        type: 'mentor',
        section: 'didYouKnow',
        content: (props: any) => (
          <div className="space-y-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              💡 {unitData.didYouKnow.title}
            </p>
            <p className="text-sm">{unitData.didYouKnow.content}</p>
            <Button
              size="sm"
              onClick={() => {
                props.setEarnedXP((prev: number) => prev + unitData.didYouKnow.xpReward);
                props.toast({
                  title: "Curiosity Rewarded!",
                  description: `+${unitData.didYouKnow.xpReward} XP`,
                });
              }}
              className="w-full"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Claim +{unitData.didYouKnow.xpReward} XP
            </Button>
          </div>
        )
      }
    ];

    setMessages(prev => [...prev, ...newMessages]);
    setVisibleCount(prev => prev + newMessages.length);
  };

  const addFeedbackMessages = () => {
    const newMessages: ChatMessage[] = [
      {
        id: 'feedback',
        type: 'mentor',
        section: 'feedback',
        content: (props: any) => (
          <div className="space-y-3">
            <p className="text-sm font-semibold">⭐ How Was This Unit?</p>
            <p className="text-sm">Your feedback helps us improve the learning experience!</p>
            <QuickFeedback
              value={props.feedback}
              onChange={props.setFeedback}
              disabled={false}
            />
          </div>
        )
      }
    ];

    setMessages(prev => [...prev, ...newMessages]);
    setVisibleCount(prev => prev + newMessages.length);
  };

  const handleFinishUnit = async () => {
    const totalEarnedXP = unitData.baseXP + earnedXP;
    
    try {
      const result = await addXP(totalEarnedXP);
      const trophy = awardMLUTrophy(unitData.id, unitData.title, 3);
      checkForMedals();
      
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      
      setShowTrophyModal(true);
      
      if (result.leveledUp && result.newLevel && result.previousLevel) {
        setLevelUpData({
          newLevel: result.newLevel,
          previousLevel: result.previousLevel,
        });
        setTimeout(() => {
          setShowTrophyModal(false);
          setShowLevelUpModal(true);
        }, 3000);
      } else {
        setTimeout(() => {
          setShowTrophyModal(false);
          onComplete(totalEarnedXP);
          setTimeout(() => onClose(), 500);
        }, 3000);
      }

      toast({
        title: "MLU Completed!",
        description: `Amazing work! You earned ${totalEarnedXP} XP!`,
      });
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Completion failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const canProceed = () => {
    if (currentSection === 0) return true;
    if (currentSection === 1) return isAllTasksCompleted();
    if (currentSection === 2) return isQuizValid;
    if (currentSection === 3) return true;
    if (currentSection === 4) return feedback.rating > 0;
    return false;
  };

  const getProgress = () => {
    const total = 5; // intro, tasks, quiz, didyouknow, feedback
    return Math.round((currentSection / total) * 100);
  };

  return (
    <>
      {/* MLU Progress Sidebar */}
      {isOpen && (
        <MLUProgressSidebar
          currentMLUIndex={currentMLUIndex}
          totalMLUs={totalMLUs}
          completedMLUs={completedMLUs}
          currentStage={currentStage}
          totalStages={8}
          mluTitles={mluTitles}
        />
      )}

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-4xl h-[90vh] p-0 flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b bg-card/95 backdrop-blur">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  {unitData.title}
                </h2>
                {unitData.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">{unitData.subtitle}</p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-muted-foreground font-medium">{getProgress()}%</span>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-purple-200/30">
                <div 
                  className="h-full bg-gradient-to-r from-purple-700 to-purple-400 transition-all duration-500"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea ref={scrollRef} className="flex-1 px-6 py-4">
            <div className="space-y-1 pb-4">
              {messages.slice(0, visibleCount).map((msg) => (
                <MentorChatMessage key={msg.id} type={msg.type}>
                  {typeof msg.content === 'function' 
                    ? msg.content({ 
                        completedTasks, 
                        onTaskToggle: handleTaskToggle,
                        quizAnswers,
                        handleQuizAnswer,
                        feedback,
                        setFeedback,
                        setEarnedXP,
                        toast
                      }) 
                    : msg.content}
                </MentorChatMessage>
              ))}
              
              {visibleCount < messages.length && <TypingIndicator />}
            </div>
          </ScrollArea>

          {/* Action Bar */}
          <div className="px-6 py-4 border-t bg-muted/30">
            {currentSection < 4 && visibleCount >= messages.length && (
              <Button
                onClick={handleNextSection}
                disabled={!canProceed()}
                className="w-full"
                size="lg"
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            
            {currentSection === 4 && (
              <Button
                onClick={handleFinishUnit}
                disabled={!canProceed()}
                className="w-full bg-gradient-to-r from-primary to-purple-600"
                size="lg"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Finish Unit & Earn {unitData.baseXP + earnedXP} XP
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* Trophy Modal */}
      <Dialog open={showTrophyModal} onOpenChange={setShowTrophyModal}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6 space-y-4">
            <div className="text-6xl">🏆</div>
            <h3 className="text-2xl font-bold">MLU Completed!</h3>
            <p className="text-muted-foreground">
              You've earned a trophy for completing this learning unit!
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Level Up Modal */}
      {levelUpData && (
        <LevelUpModal
          isOpen={showLevelUpModal}
          onClose={() => {
            setShowLevelUpModal(false);
            onComplete(unitData.baseXP + earnedXP);
            setTimeout(() => onClose(), 500);
          }}
          newLevel={levelUpData.newLevel}
          previousLevel={levelUpData.previousLevel}
          currentXP={currentXP}
        />
      )}
    </>
  );
}
