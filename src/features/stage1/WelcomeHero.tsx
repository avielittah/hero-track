import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { WelcomeContent } from './content.welcome.schema';

interface WelcomeHeroProps {
  content: WelcomeContent;
}

export const WelcomeHero = ({ content }: WelcomeHeroProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="text-center mb-12"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Main Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {t('stage1:hero.title', { role: content.roleTitle })}
        </span>
      </h1>

      {/* Subtitle */}
      <motion.p
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {t('stage1:hero.subtitle')}
      </motion.p>

      {/* Hero Media */}
      {content.heroMedia && (
        <motion.div
          className="max-w-2xl mx-auto mb-8"
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {content.heroMedia.type === 'image' ? (
            <img
              src={content.heroMedia.src}
              alt={content.heroMedia.alt || t('stage1:hero.title', { role: content.roleTitle })}
              className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg"
            />
          ) : (
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src={content.heroMedia.src}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={content.heroMedia.alt || "Welcome Video"}
              />
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};