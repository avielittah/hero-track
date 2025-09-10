import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';
import { welcomeContent } from './welcome.content';

export const CoreValues = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-card rounded-2xl p-8 shadow-sm border"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Star className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-primary">
          {welcomeContent.values.title}
        </h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {welcomeContent.values.items.map((value, index) => (
          <motion.div
            key={value}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            className="flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
            <span className="text-foreground font-medium">{value}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};