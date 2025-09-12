import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, X, Brain, Zap } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface MiniQuizProps {
  title: string;
  questions: QuizQuestion[];
  xpReward?: number;
  onComplete?: (score: number) => void;
  className?: string;
}

export function MiniQuiz({
  title,
  questions,
  xpReward = 10,
  onComplete,
  className = ""
}: MiniQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);
    
    if (optionIndex === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsCompleted(true);
      onComplete?.(score);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Perfect! You're a master! 🏆";
    if (percentage >= 75) return "Great job! Well done! 🌟";
    if (percentage >= 50) return "Good effort! Keep learning! 💪";
    return "Nice try! Practice makes perfect! 🚀";
  };

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={className}
      >
        <Card className="border-2 border-journey-complete bg-gradient-to-br from-journey-complete/5 to-journey-complete/10">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto p-3 rounded-full bg-journey-complete text-white w-fit mb-4">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <p className="text-lg font-semibold">
                Score: {score}/{questions.length}
              </p>
              <p className="text-muted-foreground">
                {getScoreMessage()}
              </p>
            </div>
            
            <Badge variant="outline" className="bg-primary/10 border-primary/30">
              <Zap className="h-3 w-3 mr-1" />
              +{xpReward} XP Earned!
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary text-white">
                <Brain className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <Badge variant="outline">
              {currentQuestionIndex + 1}/{questions.length}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Question */}
              <h3 className="text-lg font-medium leading-relaxed">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="grid gap-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correctIndex;
                  const showResult = isAnswered;

                  let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-300";
                  
                  if (!showResult) {
                    buttonClass += isSelected 
                      ? " border-primary bg-primary/10" 
                      : " border-border hover:border-primary/50 hover:bg-primary/5";
                  } else {
                    if (isCorrect) {
                      buttonClass += " border-journey-complete bg-journey-complete/10 text-journey-complete";
                    } else if (isSelected && !isCorrect) {
                      buttonClass += " border-destructive bg-destructive/10 text-destructive";
                    } else {
                      buttonClass += " border-border bg-muted/50 text-muted-foreground";
                    }
                  }

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={isAnswered}
                      className={buttonClass}
                      whileHover={!isAnswered ? { scale: 1.02 } : {}}
                      whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {showResult && (
                          <div className="flex-shrink-0">
                            {isCorrect ? (
                              <CheckCircle2 className="h-5 w-5 text-journey-complete" />
                            ) : isSelected ? (
                              <X className="h-5 w-5 text-destructive" />
                            ) : null}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Next Button */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-primary to-secondary"
              >
                {isLastQuestion ? "Complete Quiz" : "Next Question"}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}