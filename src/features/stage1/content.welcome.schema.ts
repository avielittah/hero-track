import { z } from 'zod';

export const WelcomeContentSchema = z.object({
  roleTitle: z.string().min(1, 'Role title is required'),
  whatIsThis: z.string().min(1, 'What is this description is required'),
  howItWorks: z.string().min(1, 'How it works description is required'),
  howLong: z.string().min(1, 'Duration description is required'),
  whyWeDo: z.string().min(1, 'Why we do this description is required'),
  buddyNote: z.string().min(1, 'Buddy note is required'),
  heroMedia: z.object({
    type: z.enum(['image', 'video']),
    src: z.string().url('Media source must be a valid URL'),
    alt: z.string().optional(),
  }).optional(),
  ctaLabel: z.string().min(1, 'CTA label is required'),
  xpAwardOnContinue: z.number().min(1).max(100),
  badgeOnContinue: z.string().optional(),
});

export type WelcomeContent = z.infer<typeof WelcomeContentSchema>;