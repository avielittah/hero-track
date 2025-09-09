import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BookOpen, Target, Sparkles } from 'lucide-react';
import { useJourneyMachine } from './journeyMachine';

export const StageHeader = () => {
  const { t } = useTranslation();
  const { currentStage, viewingStage, viewMode } = useJourneyMachine();

  const getStageContent = (stage: number) => {
    const stages = {
      1: {
        title: "Welcome to Team Collaboration! 👋",
        subtitle: "Let's start building your teamwork superpowers",
        description: "Ready to dive in? We'll explore how great teams communicate, share ideas, and work together like pros!"
      },
      2: {
        title: "Project Planning Mastery 📋",
        subtitle: "Time to become a planning wizard",
        description: "You'll learn how to break down big projects into bite-sized pieces and keep everything on track!"
      },
      3: {
        title: "Communication Tools Workshop 💬",
        subtitle: "Master the art of digital teamwork",
        description: "Get hands-on with the tools that make remote collaboration feel like you're all in the same room!"
      },
      4: {
        title: "Portfolio Showcase Time 📁",
        subtitle: "Show off your amazing work",
        description: "Put together a portfolio that tells your story and highlights all the awesome skills you've developed!"
      },
      5: {
        title: "Advanced Problem Solving 🧩",
        subtitle: "Level up your thinking skills",
        description: "Tackle complex challenges with confidence and creativity – you've got this!"
      },
      6: {
        title: "Leadership & Mentoring 👑",
        subtitle: "Guide others on their journey",
        description: "Share your knowledge and help others grow – that's what true leaders do!"
      },
      7: {
        title: "Innovation Workshop 💡",
        subtitle: "Create solutions that matter",
        description: "Think outside the box and develop ideas that could change the world (seriously!)."
      },
      8: {
        title: "Journey Completion Celebration! 🎉",
        subtitle: "You've made it to the finish line",
        description: "Time to celebrate everything you've accomplished and plan your next adventure!"
      }
    };
    
    return stages[stage as keyof typeof stages] || stages[1];
  };

  const stageContent = getStageContent(viewingStage);
  const isPreviewMode = viewMode === 'preview-back';
  const isPeekMode = viewMode === 'peek-forward';

  return (
    <motion.div
      className="text-center py-12"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Stage Badge */}
      <motion.div
        className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <BookOpen className="h-5 w-5 text-primary" />
        <span className="text-primary font-semibold">
          Stage {viewingStage} of 8
        </span>
        {isPreviewMode && (
          <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
            Completed ✓
          </span>
        )}
        {isPeekMode && (
          <span className="text-xs bg-secondary/20 px-2 py-1 rounded text-secondary">
            Preview
          </span>
        )}
      </motion.div>

      {/* Main Title */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {stageContent.title}
      </motion.h1>

      {/* Subtitle */}
      <motion.h2
        className="text-xl md:text-2xl text-primary font-medium mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {stageContent.subtitle}
      </motion.h2>

      {/* Description */}
      <motion.p
        className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {stageContent.description}
      </motion.p>

      {/* Decorative elements */}
      <motion.div
        className="flex justify-center space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary/40 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};