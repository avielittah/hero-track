import { WelcomeContent } from './content.welcome.schema';

export const defaultWelcomeContent: WelcomeContent = {
  roleTitle: "Communication Systems Engineer",
  whatIsThis: 
    "This onboarding will introduce you to our culture, tools, and hands-on practices so you can contribute with confidence.",
  howItWorks: 
    "The journey has 8 stages with short micro-units, friendly tasks, and quick feedback. You'll see one screen at a time.",
  howLong: 
    "About ~3 weeks overall, 1–2 hours per day at your own pace. You can pause and resume anytime.",
  whyWeDo: 
    "We want to reduce stress, cut shadowing time, and help you reach productivity faster in a supportive way.",
  buddyNote: 
    "You're not alone—Buddy, our smart mentor, will guide you step by step. Ask questions anytime, Buddy will help.",
  heroMedia: { 
    type: "image", 
    src: "/placeholder.svg", 
    alt: "Welcome to TaleAI Communication Systems Engineer Journey" 
  },
  ctaLabel: "Let's Start Orientation →",
  xpAwardOnContinue: 20,
  badgeOnContinue: "First Steps"
};