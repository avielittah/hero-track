import { motion } from 'framer-motion';
import { welcomeContent } from './welcome.content';

export const WelcomeHero = () => {

  return (
    <motion.div
      className="text-center mb-12"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Main Title - קטן יותר כדי לתת מקום לטקסט מתחתיו */}
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
        {welcomeContent.hero.title}
      </h1>

      {/* Subtitle */}
      <motion.p
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {welcomeContent.hero.subtitle}
      </motion.p>

      {/* Hero Media */}
      {welcomeContent.heroMedia && (
        <motion.div
          className="max-w-2xl mx-auto mb-8"
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {welcomeContent.heroMedia.type === 'image' ? (
            <img
              src={welcomeContent.heroMedia.src}
              alt={welcomeContent.heroMedia.alt}
              className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg"
            />
          ) : (
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src={welcomeContent.heroMedia.src}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={welcomeContent.heroMedia.alt || "Welcome Video"}
              />
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};