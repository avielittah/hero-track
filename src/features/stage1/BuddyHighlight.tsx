import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MessageCircle, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WelcomeContent } from './content.welcome.schema';

interface BuddyHighlightProps {
  content: WelcomeContent;
}

export const BuddyHighlight = ({ content }: BuddyHighlightProps) => {
  const { t } = useTranslation();

  const handleMeetBuddy = () => {
    // Open external Buddy Agent URL - this would come from env or config
    const buddyUrl = process.env.VITE_BUDDY_URL || 'https://buddy.taleai.com';
    window.open(buddyUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      className="relative mb-12"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.0 }}
    >
      <div className="
        relative p-8 rounded-2xl 
        bg-gradient-to-br from-primary/5 to-secondary/5
        border border-primary/20 backdrop-blur-sm
        overflow-hidden group
      ">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-32 h-32 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-secondary rounded-full blur-2xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start space-x-6">
            {/* Buddy Avatar/Icon */}
            <motion.div
              className="
                flex-shrink-0 p-4 rounded-2xl 
                bg-gradient-to-br from-primary to-secondary
                text-white shadow-lg
              "
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="relative">
                <MessageCircle className="h-8 w-8" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300" />
              </div>
            </motion.div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-3 flex items-center">
                {t('stage1:buddy.title')}
                <motion.div
                  className="ml-2 text-secondary"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 3 
                  }}
                >
                  👋
                </motion.div>
              </h3>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {content.buddyNote}
              </p>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button
                  onClick={handleMeetBuddy}
                  variant="outline"
                  className="
                    group border-primary/30 text-primary hover:bg-primary hover:text-white
                    transition-all duration-200
                  "
                >
                  <MessageCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  {t('stage1:buddy.cta')}
                  <ExternalLink className="h-3 w-3 ml-2 opacity-60" />
                </Button>

                <p className="text-sm text-muted-foreground italic">
                  {t('stage1:buddy.nudge')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle glow effect */}
        <div className="
          absolute inset-0 rounded-2xl 
          bg-gradient-to-br from-primary/5 to-secondary/5 
          opacity-0 group-hover:opacity-100 
          transition-opacity duration-500
        " />
      </div>
    </motion.div>
  );
};