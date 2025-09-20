import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLearningStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Star, 
  CheckCircle, 
  Sparkles, 
  Download, 
  Eye, 
  Award,
  Zap
} from 'lucide-react';

const CONFETTI_COUNT = 50;

const ConfettiParticle = ({ delay }: { delay: number }) => {
  const colors = ['#7C3AED', '#F97316', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <motion.div
      className="absolute w-3 h-3 rounded-full"
      style={{ backgroundColor: randomColor }}
      initial={{
        opacity: 0,
        scale: 0,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 20,
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0],
        y: [window.innerHeight + 20, -100],
        x: [
          Math.random() * window.innerWidth,
          Math.random() * window.innerWidth + (Math.random() - 0.5) * 200
        ],
        rotate: [0, 360, 720],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay,
        ease: "easeOut",
      }}
    />
  );
};

interface FinalWrapUpScreenProps {
  onClose: () => void;
}

export const FinalWrapUpScreen = ({ onClose }: FinalWrapUpScreenProps) => {
  const { t } = useTranslation(['ui', 'copy']);
  const { toast } = useToast();
  const { currentXP, level, trophies, completedStages } = useLearningStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const [reflectionSummary] = useState("I've grown tremendously through this journey, mastering collaboration, project management, and building valuable skills for my career.");

  useEffect(() => {
    // Start confetti animation
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    
    // Welcome toast
    setTimeout(() => {
      toast({
        title: t('copy:congratulationsTitle'),
        description: t('copy:journeyCompleteDescription'),
        duration: 8000,
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [t, toast]);

  const handleDownloadCertificate = () => {
    toast({
      title: t('ui:certificateDownload'),
      description: t('ui:certificateComingSoon'),
      duration: 4000,
    });
  };

  const handleViewPortfolio = () => {
    toast({
      title: t('ui:portfolioView'),
      description: t('ui:portfolioComingSoon'),
      duration: 4000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
              <ConfettiParticle key={i} delay={i * 0.05} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="mx-auto w-32 h-32 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-8 shadow-2xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 10,
              delay: 0.3 
            }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 2,
                repeat: 2,
                delay: 1 
              }}
              className="text-white"
            >
              <Trophy className="h-16 w-16" />
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-7xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {t('copy:onboardingComplete')}
          </motion.h1>
          
          <motion.p
            className="text-2xl font-light text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {t('copy:congratulationsMessage')}
          </motion.p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {/* Stages Completed */}
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CheckCircle className="h-8 w-8 text-journey-complete" />
                <Badge variant="secondary" className="bg-journey-complete/10 text-journey-complete">
                  {t('ui:complete')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl font-bold text-foreground mb-1">
                8/8
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('ui:stagesCompleted')}
              </p>
            </CardContent>
            <motion.div
              className="absolute -top-2 -right-2 w-16 h-16 bg-journey-complete/10 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </Card>

          {/* Total XP and Level */}
          <Card className="relative overflow-hidden border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Zap className="h-8 w-8 text-secondary" />
                <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                  {level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl font-bold text-foreground mb-1">
                {currentXP}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('ui:totalXPEarned')}
              </p>
            </CardContent>
            <motion.div
              className="absolute -top-2 -right-2 w-16 h-16 bg-secondary/10 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </Card>

          {/* Trophies Earned */}
          <Card className="relative overflow-hidden border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-yellow-500/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Award className="h-8 w-8 text-yellow-600" />
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
                  {t('ui:earned')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl font-bold text-foreground mb-1">
                {trophies.length}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('ui:trophiesCollected')}
              </p>
            </CardContent>
            <motion.div
              className="absolute -top-2 -right-2 w-16 h-16 bg-yellow-500/10 rounded-full"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </Card>

          {/* Reflection Summary */}
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Sparkles className="h-8 w-8 text-primary" />
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {t('ui:reflection')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed">
                {reflectionSummary}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trophy Showcase */}
        {trophies.length > 0 && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center space-x-2">
              <Trophy className="h-6 w-6 text-yellow-600" />
              <span>{t('ui:yourTrophies')}</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {trophies.map((trophy, index) => (
                <motion.div
                  key={trophy.id}
                  className="flex items-center space-x-3 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 px-4 py-3 rounded-lg border border-yellow-200 dark:border-yellow-800"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Star className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                      {trophy.name}
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      {trophy.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <Button
            onClick={handleDownloadCertificate}
            size="lg"
            className="bg-primary hover:bg-primary-700 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Download className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            {t('ui:downloadCertificate')}
          </Button>
          
          <Button
            onClick={handleViewPortfolio}
            variant="outline"
            size="lg"
            className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Eye className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            {t('ui:viewPortfolio')}
          </Button>
        </motion.div>

        {/* Close Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            {t('ui:backToJourney')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};