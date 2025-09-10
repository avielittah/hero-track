import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { orientation1Content } from './orientation1.content';

export const ChecklistHero = () => {
  return (
    <motion.div
      className="text-center mb-8"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold text-foreground mb-4">
        {orientation1Content.title}
      </h1>
      
      <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
        {orientation1Content.intro}
      </p>

      <Badge variant="secondary" className="px-4 py-2 text-sm">
        {orientation1Content.estTime}
      </Badge>
    </motion.div>
  );
};