import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from '@/components/ui/form';
import { useLearningStore } from '@/lib/store';
import { useJourneyMachine } from '@/features/journey/journeyMachine';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle2, 
  Send, 
  Award, 
  Lightbulb,
  Users,
  BookOpen,
  Trophy,
  Star
} from 'lucide-react';
import Confetti from 'react-confetti';

// Survey form schema
const orientationSchema = z.object({
  // Required Likert questions (1-5)
  q1: z.number().min(1).max(5), // Ready to contribute effectively
  q2: z.number().min(1).max(5), // Confidence in abilities
  q3: z.number().min(1).max(5), // Training quality and completeness
  q4: z.number().min(1).max(5), // Excited about starting work
  q5: z.number().min(1).max(5), // Overall training experience
  
  // Required sentiment emoji
  sentiment: z.string().min(1), // Emoji sentiment about starting work
  
  // Optional open-ended questions
  q6: z.string().optional(), // Most valuable part of training
  q7: z.string().optional(), // What could be improved
  q8: z.string().optional(), // Manager support needs
});

type OrientationFormData = z.infer<typeof orientationSchema>;

export function FinalOrientationSurvey() {
  const { addXP } = useLearningStore();
  const { completeCurrentStage, viewMode } = useJourneyMachine();
  const { toast } = useToast();
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  const form = useForm<OrientationFormData>({
    resolver: zodResolver(orientationSchema),
    defaultValues: {},
  });

  const { watch } = form;
  const watchedValues = watch();

  // Calculate progress - required fields
  const requiredFields = ['q1', 'q2', 'q3', 'q4', 'q5', 'sentiment'];
  const completedRequired = requiredFields.filter(field => {
    const value = watchedValues[field as keyof OrientationFormData];
    return value !== undefined && value !== '' && value !== null;
  }).length;
  
  const progressPercentage = (completedRequired / requiredFields.length) * 100;
  const isFormReady = completedRequired === requiredFields.length;
  
  // Check if all optional fields are completed for bonus XP
  const optionalFields = ['q6', 'q7', 'q8'];
  const completedOptional = optionalFields.filter(field => {
    const value = watchedValues[field as keyof OrientationFormData];
    return value !== undefined && value !== '' && (typeof value === 'string' ? value.trim() !== '' : true);
  }).length;
  const allOptionalCompleted = completedOptional === optionalFields.length;

  // Handle form submission
  const onSubmit = async (data: OrientationFormData) => {
    try {
      // Calculate XP rewards
      const baseXP = 15;
      const bonusXP = allOptionalCompleted ? 10 : 0;
      const totalXP = baseXP + bonusXP;
      
      // Award XP
      await addXP(totalXP);
      setEarnedXP(totalXP);

      // Mark as submitted
      setIsSubmitted(true);
      setShowConfetti(true);
      
      // Show success toast
      toast({
        title: `Training Complete! +${baseXP} XP`,
        description: bonusXP > 0 ? `Bonus +${bonusXP} XP for detailed feedback!` : undefined,
        duration: 5000,
      });

      // Complete stage after short delay
      setTimeout(() => {
        completeCurrentStage();
      }, 3000);

      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 6000);

      // Emit orientation data (for manager dashboard)
      console.log('Final Orientation Survey submitted:', {
        final_orientation_v1: {
          readiness_self_assessment: data.q1,
          confidence_level: data.q2,
          training_quality_rating: data.q3,
          work_excitement_level: data.q4,
          overall_experience_rating: data.q5,
          work_readiness_sentiment: data.sentiment,
          verbatim_most_valuable: data.q6 || '',
          verbatim_improvement_areas: data.q7 || '',
          verbatim_manager_support_needs: data.q8 || '',
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      toast({
        title: "Error submitting orientation",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Likert Scale Component
  const LikertScale = ({ field, question, required = false }: any) => (
    <FormField
      control={form.control}
      name={field}
      render={({ field: formField }) => (
        <FormItem className="space-y-4">
          <FormLabel className={`text-base ${required ? 'font-semibold' : ''}`}>
            {question}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <div className="space-y-3">
              <RadioGroup
                onValueChange={(value) => formField.onChange(parseInt(value))}
                value={formField.value?.toString()}
                className="flex justify-between items-center"
                disabled={isSubmitted}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex flex-col items-center space-y-2">
                    <RadioGroupItem 
                      value={value.toString()} 
                      id={`${field}-${value}`}
                      className="w-8 h-8"
                    />
                    <Label 
                      htmlFor={`${field}-${value}`} 
                      className="text-xs text-center cursor-pointer max-w-16"
                    >
                      {value}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {/* Scale anchors */}
              <div className="flex justify-between text-xs text-muted-foreground px-2">
                <span>Strongly Disagree</span>
                <span>Neutral</span>
                <span>Strongly Agree</span>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  // Emoji Sentiment Component
  const EmojiSentiment = () => (
    <FormField
      control={form.control}
      name="sentiment"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-base font-semibold">
            How do you feel about starting your actual work responsibilities?
            <span className="text-destructive ml-1">*</span>
          </FormLabel>
          <FormControl>
            <div className="flex justify-center space-x-6">
              {[
                { key: 'excited', emoji: '🚀' },
                { key: 'confident', emoji: '💪' },
                { key: 'ready', emoji: '✨' },
                { key: 'nervous', emoji: '😰' },
                { key: 'uncertain', emoji: '🤔' }
              ].map(({ key, emoji }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => field.onChange(key)}
                  className={`text-5xl p-3 rounded-2xl transition-all duration-200 ${
                    field.value === key 
                      ? 'bg-primary/10 scale-110 shadow-lg' 
                      : 'hover:bg-muted/50 hover:scale-105'
                  }`}
                  disabled={isSubmitted}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  if (isSubmitted && viewMode !== 'preview-back') {
    return (
      <div className="min-h-screen bg-background pb-24">
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={300}
            gravity={0.1}
          />
        )}
        
        <div className="max-w-4xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Alert className="mb-8 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Orientation Complete • Preview Mode
              </AlertDescription>
            </Alert>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 shadow-lg">
              <Trophy className="h-16 w-16 text-green-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-green-800 mb-4">
                🎯 Training Journey Complete!
              </h2>
              <p className="text-green-700 text-lg mb-6">
                Congratulations! You've successfully completed your onboarding. +{earnedXP} XP earned!
              </p>
              <div className="text-sm text-green-600">
                Welcome to the team! Your manager will be notified of your completion.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Header / Intro (Hero Block) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4 rounded-xl">
              <div className="flex items-center space-x-2">
                <Trophy className="h-8 w-8 text-white" />
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Final Orientation Survey
              </h1>
              <div className="flex items-center space-x-3 mt-2">
                <Progress value={100} className="w-32 h-2" />
                <span className="text-muted-foreground text-lg">Final Stage - Complete!</span>
              </div>
            </div>
          </div>
          
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-none shadow-lg">
            <CardContent className="p-8">
              <p className="text-foreground text-lg mb-3">
                🎉 Congratulations! You've reached the end of your onboarding journey. This final orientation will help us understand how prepared you feel and provide insights to your manager for ongoing support.
              </p>
              <p className="text-muted-foreground text-base">
                Your honest feedback helps us improve the program and ensures you get the support you need as you begin your role.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* A) Work Readiness Assessment (Likert 1-5) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Your Work Readiness Assessment</CardTitle>
                  <p className="text-muted-foreground">Please rate your agreement with each statement as you prepare to start your role</p>
                </CardHeader>
                <CardContent className="space-y-8">
                  <LikertScale
                    field="q1"
                    question="I feel fully prepared to contribute effectively in my new role."
                    required
                  />
                  <Separator />
                  <LikertScale
                    field="q2"
                    question="I am confident in my abilities to handle the responsibilities of my position."
                    required
                  />
                  <Separator />
                  <LikertScale
                    field="q3"
                    question="The training program was comprehensive and equipped me with the necessary skills."
                    required
                  />
                  <Separator />
                  <LikertScale
                    field="q4"
                    question="I am excited and motivated to begin my work responsibilities."
                    required
                  />
                  <Separator />
                  <LikertScale
                    field="q5"
                    question="Overall, my entire onboarding experience has exceeded my expectations."
                    required
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* B) Readiness Sentiment (Emoji Scale) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Your Current Mindset</CardTitle>
                  <p className="text-muted-foreground">Select the emoji that best represents how you feel about starting work</p>
                </CardHeader>
                <CardContent>
                  <EmojiSentiment />
                </CardContent>
              </Card>
            </motion.div>

            {/* C) Manager Insights Questions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Insights for Your Manager</CardTitle>
                  <p className="text-muted-foreground">Help your manager understand your experience and support needs (optional but valuable)</p>
                </CardHeader>
                <CardContent className="space-y-8">
                  <FormField
                    control={form.control}
                    name="q6"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">What was the most valuable part of your training? What should we definitely keep?</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Share what helped you learn and grow the most..."
                            className="min-h-24 resize-none"
                            disabled={isSubmitted}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="q7"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">What could be improved in the training program for future new hires?</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Share your suggestions for making the program even better..."
                            className="min-h-24 resize-none"
                            disabled={isSubmitted}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="q8"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">What ongoing support would be most helpful from your manager as you start your role?</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Let your manager know how they can best support you going forward..."
                            className="min-h-24 resize-none"
                            disabled={isSubmitted}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Manager Tip / Did You Know Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-blue-800 font-medium mb-2">
                        💡 <strong>For Your Manager:</strong>
                      </p>
                      <p className="text-blue-700">
                        Your responses will help your manager understand your confidence level, training experience, and support needs. This creates a foundation for productive check-ins and ensures you get the right guidance as you transition into your role. Be honest – it's all about setting you up for success!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Progress and Submit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Progress: {completedRequired}/{requiredFields.length} required questions complete
                      </p>
                      <Progress value={progressPercentage} className="w-64" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {allOptionalCompleted ? '✨ Bonus XP for complete feedback!' : 'Optional questions: Extra XP available'}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={!isFormReady || isSubmitted}
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    {isSubmitted ? 'Submitted Successfully!' : 'Complete Training Journey'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

          </form>
        </Form>
      </div>
    </div>
  );
}