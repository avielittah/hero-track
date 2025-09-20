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
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
        {orientation1Content.title}
      </h1>
      
      <p className="text-xl font-light text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
        {orientation1Content.intro}
      </p>

      <Badge variant="secondary" className="px-4 py-2 text-sm">
        {orientation1Content.estTime}
      </Badge>
    </motion.div>
  );
};