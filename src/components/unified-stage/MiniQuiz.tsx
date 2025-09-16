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
    const percentage = score / questions.length * 100;
    if (percentage === 100) return "Perfect! You're a master! 🏆";
    if (percentage >= 75) return "Great job! Well done! 🌟";
    if (percentage >= 50) return "Good effort! Keep learning! 💪";
    return "Nice try! Practice makes perfect! 🚀";
  };
  if (isCompleted) {
    return <motion.div initial={{
      opacity: 0,
      scale: 0.95
    }} animate={{
      opacity: 1,
      scale: 1
    }} className={className}>
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
      </motion.div>;
  }
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className={className}>
      
    </motion.div>;
}