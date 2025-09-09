export type WelcomeContent = {
  roleTitle: string;             // e.g., "Communication Systems Engineer"
  whatIsThis: string;            // short paragraph
  howItWorks: string;            // short paragraph
  howLong: string;               // e.g., "~3 weeks, 1–2h/day"
  whyWeDo: string;               // business value, calm expectations
  buddyNote: string;             // Buddy guidance text
  heroMedia?: { type: 'image'|'video'; src: string; alt?: string };
  ctaLabel: string;              // "Let's Start Orientation"
  xpAwardOnContinue: number;     // default 20
  badgeOnContinue?: string;      // "First Steps"
};

export type Role = 'communication-systems-engineer' | 'software-developer' | 'project-manager' | 'data-analyst';