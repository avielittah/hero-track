import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Star
} from 'lucide-react';
import Confetti from 'react-confetti';

// Survey form schema - simplified for new spec
const surveySchema = z.object({
  // Required Likert questions (1-5)
  q1: z.number().min(1).max(5), // Keeping up with goals
  q2: z.number().min(1).max(5), // Prepared for real work
  q3: z.number().min(1).max(5), // Materials clear
  q4: z.number().min(1).max(5), // Motivated and engaged
  q5: z.number().min(1).max(5), // Overall experience positive
  
  // Required sentiment emoji
  sentiment: z.string().min(1), // Emoji sentiment
  
  // Optional open-ended questions
  q6: z.string().optional(), // What helped most
  q7: z.string().optional(), // Challenges/blockers
  q8: z.string().optional(), // What to see more/less
});

type SurveyFormData = z.infer<typeof surveySchema>;

export function MidJourneySurvey() {
  const { t } = useTranslation();
  const { addXP } = useLearningStore();
  const { completeCurrentStage, viewMode } = useJourneyMachine();
  const { toast } = useToast();
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  const form = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {},
  });

  const { watch, formState: { errors } } = form;
  const watchedValues = watch();

  // Calculate progress - required fields are q1-q5 and sentiment
  const requiredFields = ['q1', 'q2', 'q3', 'q4', 'q5', 'sentiment'];
  const completedRequired = requiredFields.filter(field => {
    const value = watchedValues[field as keyof SurveyFormData];
    return value !== undefined && value !== '' && value !== null;
  }).length;
  
  const progressPercentage = (completedRequired / requiredFields.length) * 100;
  const isFormReady = completedRequired === requiredFields.length;
  
  // Check if all optional fields are completed for bonus XP
  const optionalFields = ['q6', 'q7', 'q8'];
  const completedOptional = optionalFields.filter(field => {
    const value = watchedValues[field as keyof SurveyFormData];
    return value !== undefined && value !== '' && (typeof value === 'string' ? value.trim() !== '' : true);
  }).length;
  const allOptionalCompleted = completedOptional === optionalFields.length;

  // Handle form submission
  const onSubmit = async (data: SurveyFormData) => {
    try {
      // Calculate XP rewards
      const baseXP = 10;
      const bonusXP = allOptionalCompleted ? 5 : 0;
      const totalXP = baseXP + bonusXP;
      
      // Award XP
      await addXP(totalXP);
      setEarnedXP(totalXP);

      // Mark as submitted
      setIsSubmitted(true);
      setShowConfetti(true);
      
      // Show success toast
      toast({
        title: t('stage5:xpReward', { xp: baseXP }),
        description: bonusXP > 0 ? t('stage5:bonusXP', { bonus: bonusXP }) : undefined,
        duration: 5000,
      });

      // Complete stage after short delay
      setTimeout(() => {
        completeCurrentStage();
      }, 3000);

      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 6000);

      // Emit survey data (for manager dashboard)
      console.log('Midway Survey submitted:', {
        survey_mid_v1: {
          completion_perception: data.q1,
          ttp_self_assessment: data.q2,
          clarity_score: data.q3,
          engagement_self_score: data.q4,
          pulse_score: data.q5,
          pulse_sentiment: data.sentiment,
          verbatim_keep: data.q6 || '',
          verbatim_blockers: data.q7 || '',
          verbatim_improve: data.q8 || '',
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      toast({
        title: "Error submitting survey",
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
                <span>{t('stage5:scales.likert.1')}</span>
                <span>{t('stage5:scales.likert.3')}</span>
                <span>{t('stage5:scales.likert.5')}</span>
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
            {t('stage5:questions.sentiment')}
            <span className="text-destructive ml-1">*</span>
          </FormLabel>
          <FormControl>
            <div className="flex justify-center space-x-6">
              {['excited', 'happy', 'neutral', 'concerned', 'frustrated'].map((emotion) => (
                <button
                  key={emotion}
                  type="button"
                  onClick={() => field.onChange(emotion)}
                  className={`text-5xl p-3 rounded-2xl transition-all duration-200 ${
                    field.value === emotion 
                      ? 'bg-primary/10 scale-110 shadow-lg' 
                      : 'hover:bg-muted/50 hover:scale-105'
                  }`}
                  disabled={isSubmitted}
                >
                  {t(`stage5:scales.sentiment.${emotion}`)}
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
            numberOfPieces={200}
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
                {t('stage5:submittedBanner')}
              </AlertDescription>
            </Alert>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 shadow-lg">
              <Award className="h-16 w-16 text-green-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-green-800 mb-4">
                Survey Complete! 
              </h2>
              <p className="text-green-700 text-lg mb-6">
                Thank you for your valuable feedback. +{earnedXP} XP earned!
              </p>
              <div className="text-sm text-green-600">
                Moving to next stage...
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
        
        {/* Header / Intro */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-xl">
              <Star className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                {t('stage5:title')}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t('stage5:progressBar')}
              </p>
            </div>
          </div>
          
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none shadow-lg">
            <CardContent className="p-8">
              <p className="text-foreground text-lg mb-3">{t('stage5:intro')}</p>
              <p className="text-muted-foreground">{t('stage5:subtitle')}</p>
            </CardContent>
          </Card>
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Quantitative Ratings (Likert 1-5) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Rating Questions</CardTitle>
                  <p className="text-muted-foreground">Please rate your agreement with each statement</p>
                </CardHeader>
                <CardContent className="space-y-8">
                  <LikertScale
                    field="q1"
                    question={t('stage5:questions.q1')}
                    required
                  />
                  <Separator />
                  <LikertScale
                    field="q2"
                    question={t('stage5:questions.q2')}
                    required
                  />
                  <Separator />
                  <LikertScale
                    field="q3"
                    question={t('stage5:questions.q3')}
                    required
                  />
                  <Separator />
                  <LikertScale
                    field="q4"
                    question={t('stage5:questions.q4')}
                    required
                  />
                  <Separator />
                  <LikertScale
                    field="q5"
                    question={t('stage5:questions.q5')}
                    required
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Sentiment Check */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">How are you feeling?</CardTitle>
                  <p className="text-muted-foreground">Select the emoji that best represents your current sentiment</p>
                </CardHeader>
                <CardContent>
                  <EmojiSentiment />
                </CardContent>
              </Card>
            </motion.div>

            {/* Open-Ended Questions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Your Thoughts</CardTitle>
                  <p className="text-muted-foreground">Help us understand your experience better (optional)</p>
                </CardHeader>
                <CardContent className="space-y-8">
                  <FormField
                    control={form.control}
                    name="q6"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">{t('stage5:questions.q6')}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={t('stage5:questions.q6_placeholder')}
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
                        <FormLabel className="text-base">{t('stage5:questions.q7')}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={t('stage5:questions.q7_placeholder')}
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
                        <FormLabel className="text-base">{t('stage5:questions.q8')}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={t('stage5:questions.q8_placeholder')}
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

            {/* Buddy Tip Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                    <p className="text-purple-800 font-medium">
                      {t('stage5:buddyTip')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              <div className="flex items-center justify-between p-6 bg-muted/50 rounded-2xl">
                <div className="space-y-1">
                  <p className="font-medium">
                    {isFormReady ? 'Ready to submit!' : 'Complete required fields to continue'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {completedRequired}/{requiredFields.length} required fields completed
                    {allOptionalCompleted && ' • All optional questions completed for bonus XP!'}
                  </p>
                </div>
                
                <Button
                  type="submit"
                  disabled={!isFormReady || isSubmitted}
                  size="lg"
                  className="min-w-44"
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Submitted
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      {isFormReady ? t('stage5:submitButton') : t('stage5:submitButtonDisabled')}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>

          </form>
        </Form>
      </div>
    </div>
  );
}