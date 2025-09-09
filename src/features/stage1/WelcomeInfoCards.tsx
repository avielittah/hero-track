import { motion } from 'framer-motion';
import { HelpCircle, Cog, Clock, Target } from 'lucide-react';
import { welcomeContent } from './welcome.content';

export const WelcomeInfoCards = () => {
  const cards = [
    {
      key: 'what',
      icon: HelpCircle,
      title: welcomeContent.cards.whatTitle,
      content: welcomeContent.cards.whatBody,
      gradient: 'from-primary/10 to-primary/5',
      iconColor: 'text-primary',
    },
    {
      key: 'how',
      icon: Cog,
      title: welcomeContent.cards.howTitle,
      content: welcomeContent.cards.howBody,
      gradient: 'from-secondary/10 to-secondary/5',
      iconColor: 'text-secondary',
    },
    {
      key: 'time',
      icon: Clock,
      title: welcomeContent.cards.timeTitle,
      content: welcomeContent.cards.timeBody,
      gradient: 'from-journey-current/10 to-journey-current/5',
      iconColor: 'text-journey-current',
    },
    {
      key: 'why',
      icon: Target,
      title: welcomeContent.cards.whyTitle,
      content: welcomeContent.cards.whyBody,
      gradient: 'from-journey-complete/10 to-journey-complete/5',
      iconColor: 'text-journey-complete',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {cards.map((card, index) => (
        <motion.div
          key={card.key}
          className={`
            relative p-6 rounded-2xl bg-gradient-to-br ${card.gradient}
            border border-border/50 backdrop-blur-sm
            hover:shadow-lg hover:border-border transition-all duration-300
            group cursor-default
          `}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.6 + (index * 0.1),
            ease: "easeOut" 
          }}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="flex items-start space-x-4">
            <div className={`
              p-3 rounded-xl bg-card/80 ${card.iconColor}
              group-hover:scale-110 transition-transform duration-200
            `}>
              <card.icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2 text-lg">
                {card.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {card.content}
              </p>
            </div>
          </div>

          {/* Decorative accent */}
          <div className={`
            absolute top-3 right-3 w-2 h-2 rounded-full ${card.iconColor} opacity-30
          `} />
        </motion.div>
      ))}
    </div>
  );
};