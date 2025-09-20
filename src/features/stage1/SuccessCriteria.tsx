import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle } from 'lucide-react';
import { welcomeContent } from './welcome.content';

export const SuccessCriteria = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-card rounded-2xl p-8 shadow-sm border"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-primary tracking-tight">
          {welcomeContent.success.title}
        </h2>
      </div>
      
      <div className="space-y-4">
        {welcomeContent.success.items.map((criteria, index) => (
          <motion.div
            key={criteria}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
            className="flex items-start gap-3"
          >
            <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <span className="text-foreground font-normal leading-relaxed">{criteria}</span>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.1 }}
        className="mt-6 p-4 bg-primary/5 rounded-lg border-l-4 border-primary"
      >
        <p className="text-foreground font-semibold text-center italic text-lg leading-relaxed">
          {welcomeContent.success.emphasis}
        </p>
      </motion.div>
    </motion.div>
  );
};