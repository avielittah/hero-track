import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Top Bar
      login: 'Login',
      logout: 'Logout',
      level: 'Level',
      xp: 'XP',
      
      // Levels
      'New Explorer': 'New Explorer',
      'Team Rookie': 'Team Rookie',
      'Skilled Learner': 'Skilled Learner',
      'Problem Solver': 'Problem Solver',
      'Project Builder': 'Project Builder',
      'Pro Team Member': 'Pro Team Member',
      
      // Journey
      stage: 'Stage {{number}}',
      journeyProgress: 'Journey Progress',
      
      // Stage Content
      stageTitle: 'Welcome to Your Learning Journey',
      stageDescription: 'This is where your adventure begins. Complete activities, earn XP, and level up your skills!',
      nextButton: 'Next Stage',
      previewButton: 'Preview',
      
      // Common
      current: 'Current',
      completed: 'Completed',
      locked: 'Locked',
      
      // Profile
      'Profile': 'Profile',
      'Contact Information': 'Contact Information',
      'Learning Progress': 'Learning Progress',
      'Unlocked Skills': 'Unlocked Skills',
    }
  },
  he: {
    translation: {
      // Top Bar
      login: 'התחברות',
      logout: 'התנתקות',
      level: 'רמה',
      xp: 'נק״ח',
      
      // Levels
      'New Explorer': 'חוקר חדש',
      'Team Rookie': 'טירון צוות',
      'Skilled Learner': 'לומד מיומן',
      'Problem Solver': 'פותר בעיות',
      'Project Builder': 'בונה פרויקטים',
      'Pro Team Member': 'חבר צוות מקצועי',
      
      // Journey
      stage: 'שלב {{number}}',
      journeyProgress: 'התקדמות המסע',
      
      // Stage Content
      stageTitle: 'ברוכים הבאים למסע הלמידה שלכם',
      stageDescription: 'כאן מתחיל ההרפתקה שלכם. השלימו פעילויות, צברו נק״ח, והעלו את הכישורים שלכם לרמה הבאה!',
      nextButton: 'השלב הבא',
      previewButton: 'תצוגה מקדימה',
      
      // Common
      current: 'נוכחי',
      completed: 'הושלם',
      locked: 'נעול',
      
      // Profile
      'Profile': 'פרופיל',
      'Contact Information': 'פרטי קשר',
      'Learning Progress': 'התקדמות בלמידה',
      'Unlocked Skills': 'כישורים שנפתחו',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;