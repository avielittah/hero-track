import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    ui: {
      // Top Bar
      login: 'Login',
      logout: 'Logout',
      level: 'Level',
      xp: 'XP',
      support: 'Support',
      
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
      of: 'of',
      
      // Common
      current: 'Current',
      completed: 'Completed',
      locked: 'Locked',
      next: 'Next',
      cancel: 'Cancel',
      submit: 'Submit',
      close: 'Close',
      
      // Profile
      profile: 'Profile',
      contactInformation: 'Contact Information',
      learningProgress: 'Learning Progress',
      unlockedSkills: 'Unlocked Skills',
      
      // Buddy Button
      askBuddy: 'Ask Buddy',
      help: 'Help',
      questionsAskBuddy: 'Questions? Tap Ask Buddy anytime!',
      buddyDescription: 'I\'m here to help with your learning journey 😊',
      needHelp: 'Need help? Just ask!',
      closeNudge: 'Close nudge',
      
      // Support & Issues
      reportIssue: 'Report Issue',
      reportAnIssue: 'Report an Issue',
      helpCenter: 'Help Center',
      describeIssue: 'Describe the issue',
      required: '*',
      optional: 'optional',
      screenshots: 'Screenshots',
      max: 'max',
      dropImages: 'Drop images here or click to browse',
      imageFormats: 'JPEG, PNG, GIF, WebP • Max 10MB each',
      slotsRemaining: 'slots remaining',
      minimumCharacters: 'Minimum 10 characters',
      submitReport: 'Submit Report',
      submitting: 'Submitting...',
      attached: 'attached',
      
      // Stage Complete Modal
      continueYourJourney: 'Continue Your Journey',
      whatYouAccomplished: 'What You Accomplished',
      xpEarned: 'XP Earned',
      newTrophy: 'New Trophy!',
      
      // Progress indicators
      toNextLevel: 'to next level',
      preview: 'Preview',
      
      // Final Wrap-Up Screen
      downloadCertificate: 'Download Certificate',
      viewPortfolio: 'View Portfolio',
      backToJourney: 'Back to Journey',
      complete: 'Complete',
      stagesCompleted: 'Stages Completed',
      totalXPEarned: 'Total XP Earned',
      earned: 'Earned',
      trophiesCollected: 'Trophies Collected',
      reflection: 'Reflection',
      yourTrophies: 'Your Trophies',
      certificateDownload: 'Certificate Download',
      certificateComingSoon: 'Certificate download will be available soon!',
      portfolioView: 'Portfolio View',
      portfolioComingSoon: 'Portfolio viewing will be available soon!',
      
      footer: {
        brand: 'TaleAI',
        rights: '© {{year}} TaleAI. All rights reserved.',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
        cookies: 'Cookies',
        cookieNotice: 'We use cookies to improve your experience.',
        gotIt: 'Got it',
      },
      // Admin
      admin: {
        open: "Admin",
        title: "Enter admin passcode",
        unlock: "Unlock",
        cancel: "Cancel",
        error: "Incorrect passcode",
        enabled: "Admin mode enabled",
        disabled: "Admin mode disabled",
        on: "Admin ON",
        stage: "Stage",
        unit: "Unit"
      },
    },
    copy: {
      // Stage Content & Descriptions
      stageTitle: 'Welcome to Your Learning Journey',
      stageDescription: 'This is where your adventure begins. Complete activities, earn XP, and level up your skills!',
      
      // Stage Headers
      stageHeader1Title: 'Welcome to Team Collaboration! 👋',
      stageHeader1Subtitle: 'Let\'s start building your teamwork superpowers',
      stageHeader1Description: 'Ready to dive in? We\'ll explore how great teams communicate, share ideas, and work together like pros!',
      
      stageHeader2Title: 'Project Planning Mastery 📋',
      stageHeader2Subtitle: 'Time to become a planning wizard',
      stageHeader2Description: 'You\'ll learn how to break down big projects into bite-sized pieces and keep everything on track!',
      
      stageHeader3Title: 'Communication Tools Workshop 💬',
      stageHeader3Subtitle: 'Master the art of digital teamwork',
      stageHeader3Description: 'Get hands-on with the tools that make remote collaboration feel like you\'re all in the same room!',
      
      stageHeader4Title: 'Portfolio Showcase Time 📁',
      stageHeader4Subtitle: 'Show off your amazing work',
      stageHeader4Description: 'Put together a portfolio that tells your story and highlights all the awesome skills you\'ve developed!',
      
      stageHeader5Title: 'Advanced Problem Solving 🧩',
      stageHeader5Subtitle: 'Level up your thinking skills',
      stageHeader5Description: 'Tackle complex challenges with confidence and creativity – you\'ve got this!',
      
      stageHeader6Title: 'Leadership & Mentoring 👑',
      stageHeader6Subtitle: 'Guide others on their journey',
      stageHeader6Description: 'Share your knowledge and help others grow – that\'s what true leaders do!',
      
      stageHeader7Title: 'Innovation Workshop 💡',
      stageHeader7Subtitle: 'Create solutions that matter',
      stageHeader7Description: 'Think outside the box and develop ideas that could change the world (seriously!).',
      
      stageHeader8Title: 'Journey Completion Celebration! 🎉',
      stageHeader8Subtitle: 'You\'ve made it to the finish line',
      stageHeader8Description: 'Time to celebrate everything you\'ve accomplished and plan your next adventure!',
      
      // Stage Achievements
      stageAchievement1Title: 'Team Foundation Built! 🎯',
      stageAchievement1Description: 'You\'ve mastered the basics of collaboration and communication!',
      
      stageAchievement2Title: 'Planning Pro! 📋',
      stageAchievement2Description: 'Project planning and task management are now in your toolkit!',
      
      stageAchievement3Title: 'Communication Champion! 💬',
      stageAchievement3Description: 'You\'re ready to lead discussions and facilitate great teamwork!',
      
      stageAchievement4Title: 'Portfolio Powerhouse! 📁',
      stageAchievement4Description: 'Your project showcase skills are looking absolutely stellar!',
      
      stageAchievement5Title: 'Advanced Achiever! 🚀',
      stageAchievement5Description: 'You\'re tackling complex challenges like a true professional!',
      
      stageAchievement6Title: 'Leadership Legend! 👑',
      stageAchievement6Description: 'Your mentoring and guidance skills are inspiring others!',
      
      stageAchievement7Title: 'Innovation Expert! 💡',
      stageAchievement7Description: 'You\'re creating solutions that make a real difference!',
      
      stageAchievement8Title: 'Journey Master! 🎉',
      stageAchievement8Description: 'Congratulations! You\'ve completed the entire learning adventure!',
      
      // Final Wrap-Up Screen
      onboardingComplete: 'Onboarding Complete!',
      congratulationsTitle: 'Congratulations! 🎉',
      congratulationsMessage: 'You have successfully completed your entire learning journey and earned your place as a skilled team member.',
      journeyCompleteDescription: 'Your dedication and hard work have paid off. Welcome to the team!',
      
      // Toast Messages
      toastAmazingWork: '🎉 Amazing work!',
      toastStageCompleteDescription: 'Questions? Tap Ask Buddy anytime for help on your journey!',
      toastIssueReported: 'Issue reported successfully! 🎯',
      toastIssueReportedDescription: 'Your report has been submitted. Reference ID: {{id}}',
      
      // Support Form Messages
      supportDescriptionPlaceholder: 'Please describe what went wrong, what you expected to happen, and any steps to reproduce the issue...',
      
      // Validation Messages
      validationDescriptionRequired: 'Description is required',
      validationMinimumLength: 'Description must be at least 10 characters long',
      validationMaximumLength: 'Description must be less than 500 characters',
      validationFailed: 'Validation failed',
      validationTooManyImages: 'Too many images',
      validationMaxImagesMessage: 'Only {{remaining}} more images can be added (max {{max}})',
      
      // Error Messages
      errorImageUploadFailed: 'Image upload failed',
      errorImageProcessFailed: 'Failed to process image',
      errorSubmitReportFailed: 'Failed to submit report',
      errorTryAgainMessage: 'Please try again or contact support directly.',
    }
  },
  he: {
    ui: {
      // Top Bar
      login: 'התחברות',
      logout: 'התנתקות',
      level: 'רמה',
      xp: 'נק״ח',
      support: 'תמיכה',
      
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
      of: 'מתוך',
      
      // Common
      current: 'נוכחי',
      completed: 'הושלם',
      locked: 'נעול',
      next: 'הבא',
      cancel: 'ביטול',
      submit: 'שלח',
      close: 'סגור',
      
      // Profile
      profile: 'פרופיל',
      contactInformation: 'פרטי קשר',
      learningProgress: 'התקדמות בלמידה',
      unlockedSkills: 'כישורים שנפתחו',
      
      // Buddy Button
      askBuddy: 'שאל חבר',
      help: 'עזרה',
      questionsAskBuddy: 'יש שאלות? לחץ על \'שאל חבר\' בכל זמן!',
      buddyDescription: 'אני כאן לעזור לך במסע הלמידה שלך 😊',
      needHelp: 'צריך עזרה? פשוט שאל!',
      closeNudge: 'סגור הודעה',
      
      // Support & Issues
      reportIssue: 'דווח על בעיה',
      reportAnIssue: 'דווח על בעיה',
      helpCenter: 'מרכז עזרה',
      describeIssue: 'תאר את הבעיה',
      required: '*',
      optional: 'אופציונלי',
      screenshots: 'צילומי מסך',
      max: 'מקסימום',
      dropImages: 'גרור תמונות לכאן או לחץ לחיפוש',
      imageFormats: 'JPEG, PNG, GIF, WebP • מקסימום 10MB כל אחת',
      slotsRemaining: 'מקומות נותרו',
      minimumCharacters: 'מינימום 10 תווים',
      submitReport: 'שלח דוח',
      submitting: 'שולח...',
      attached: 'מצורף',
      
      // Stage Complete Modal
      continueYourJourney: 'המשך במסע שלך',
      whatYouAccomplished: 'מה השגת',
      xpEarned: 'נק״ח שנצברו',
      newTrophy: 'גביע חדש!',
      
      // Progress indicators
      toNextLevel: 'לרמה הבאה',
      preview: 'תצוגה מקדימה',
      
      // Final Wrap-Up Screen
      downloadCertificate: 'הורד תעודה',
      viewPortfolio: 'צפה בתיק עבודות',
      backToJourney: 'חזור למסע',
      complete: 'הושלם',
      stagesCompleted: 'שלבים שהושלמו',
      totalXPEarned: 'סה"כ נקודות ניסיון',
      earned: 'נצבר',
      trophiesCollected: 'גביעים שנאספו',
      reflection: 'השתקפות',
      yourTrophies: 'הגביעים שלך',
      certificateDownload: 'הורדת תעודה',
      certificateComingSoon: 'הורדת התעודה תהיה זמינה בקרוב!',
      portfolioView: 'צפייה בתיק עבודות',
      portfolioComingSoon: 'צפייה בתיק העבודות תהיה זמינה בקרוב!',
      
      footer: {
        brand: 'TaleAI',
        rights: '© {{year}} TaleAI. כל הזכויות שמורות.',
        terms: 'תנאי שימוש',
        privacy: 'מדיניות פרטיות',
        cookies: 'עוגיות',
        cookieNotice: 'אנחנו משתמשים בעוגיות לשיפור החוויה.',
        gotIt: 'הבנתי',
      },
      // Admin
      admin: {
        open: "אדמין",
        title: "הכנס סיסמת אדמין",
        unlock: "פתח",
        cancel: "בטל",
        error: "סיסמה שגויה",
        enabled: "מצב אדמין הופעל",
        disabled: "מצב אדמין בוטל",
        on: "אדמין פעיל",
        stage: "שלב",
        unit: "יחידה"
      },
    },
    copy: {
      // Stage Content & Descriptions
      stageTitle: 'ברוכים הבאים למסע הלמידה שלכם',
      stageDescription: 'כאן מתחיל ההרפתקה שלכם. השלימו פעילויות, צברו נק״ח, והעלו את הכישורים שלכם לרמה הבאה!',
      
      // Stage Headers
      stageHeader1Title: 'ברוכים הבאים לשיתוף פעולה צוותי! 👋',
      stageHeader1Subtitle: 'בואו נתחיל לבנות את כוחות העל של עבודת הצוות שלכם',
      stageHeader1Description: 'מוכנים לצלול פנימה? נחקור איך צוותים מעולים מתקשרים, חולקים רעיונות ועובדים יחד כמו מקצוענים!',
      
      stageHeader2Title: 'שליטה בתכנון פרויקטים 📋',
      stageHeader2Subtitle: 'הזמן להפוך לקוסם תכנון',
      stageHeader2Description: 'תלמדו איך לפרק פרויקטים גדולים לחתיכות קטנות ולשמור על הכל במסלול!',
      
      stageHeader3Title: 'סדנת כלי תקשורת 💬',
      stageHeader3Subtitle: 'שלטו באמנות עבודת הצוות הדיגיטלית',
      stageHeader3Description: 'התנסו במעשה עם הכלים שגורמים לשיתוף פעולה מרחוק להרגיש כאילו כולכם באותו חדר!',
      
      stageHeader4Title: 'זמן הצגת תיק עבודות 📁',
      stageHeader4Subtitle: 'הציגו את העבודה המדהימה שלכם',
      stageHeader4Description: 'הרכיבו תיק עבודות שמספר את הסיפור שלכם ומדגיש את כל הכישורים הנהדרים שפיתחתם!',
      
      stageHeader5Title: 'פתרון בעיות מתקדם 🧩',
      stageHeader5Subtitle: 'העלו את כישורי החשיבה שלכם לרמה הבאה',
      stageHeader5Description: 'התמודדו עם אתגרים מורכבים בביטחון ויצירתיות - אתם יכולים לעשות את זה!',
      
      stageHeader6Title: 'מנהיגות והדרכה 👑',
      stageHeader6Subtitle: 'הדריכו אחרים במסע שלהם',
      stageHeader6Description: 'שתפו את הידע שלכם ועזרו לאחרים לצמוח - זה מה שמנהיגים אמיתיים עושים!',
      
      stageHeader7Title: 'סדנת חדשנות 💡',
      stageHeader7Subtitle: 'צרו פתרונות שחשובים',
      stageHeader7Description: 'חשבו מחוץ לקופסה ופתחו רעיונות שיכולים לשנות את העולם (ברצינות!).',
      
      stageHeader8Title: 'חגיגת השלמת המסע! 🎉',
      stageHeader8Subtitle: 'הגעתם לקו הסיום',
      stageHeader8Description: 'זמן לחגוג את כל מה שהשגתם ולתכנן את ההרפתקה הבאה שלכם!',
      
      // Stage Achievements
      stageAchievement1Title: 'נבנה יסוד הצוות! 🎯',
      stageAchievement1Description: 'שלטתם ביסודות של שיתוף פעולה ותקשורת!',
      
      stageAchievement2Title: 'מקצוען תכנון! 📋',
      stageAchievement2Description: 'תכנון פרויקטים וניהול משימות נמצאים עכשיו בארגז הכלים שלכם!',
      
      stageAchievement3Title: 'אלוף תקשורת! 💬',
      stageAchievement3Description: 'אתם מוכנים להוביל דיונים ולהנחות עבודת צוות מעולה!',
      
      stageAchievement4Title: 'כוח תיק עבודות! 📁',
      stageAchievement4Description: 'כישורי הצגת הפרויקטים שלכם נראים מעולים לחלוטין!',
      
      stageAchievement5Title: 'משיג מתקדם! 🚀',
      stageAchievement5Description: 'אתם מתמודדים עם אתגרים מורכבים כמו מקצוענים אמיתיים!',
      
      stageAchievement6Title: 'אגדת מנהיגות! 👑',
      stageAchievement6Description: 'כישורי ההדרכה וההנחיה שלכם מעוררים השראה באחרים!',
      
      stageAchievement7Title: 'מומחה חדשנות! 💡',
      stageAchievement7Description: 'אתם יוצרים פתרונות שעושים הבדל אמיתי!',
      
      stageAchievement8Title: 'מאסטר המסע! 🎉',
      stageAchievement8Description: 'מזל טוב! השלמתם את כל הרפתקת הלמידה!',
      
      // Final Wrap-Up Screen
      onboardingComplete: 'החניכה הושלמה!',
      congratulationsTitle: 'ברכות! 🎉',
      congratulationsMessage: 'השלמתם בהצלחה את כל מסע הלמידה שלכם וזכיתם במקומכם כחברי צוות מיומנים.',
      journeyCompleteDescription: 'המסירות והעבודה הקשה שלכם השתלמו. ברוכים הבאים לצוות!',
      
      // Toast Messages
      toastAmazingWork: '🎉 עבודה מדהימה!',
      toastStageCompleteDescription: 'יש שאלות? לחצו על \'שאל חבר\' בכל זמן לעזרה במסע שלכם!',
      toastIssueReported: 'הבעיה דווחה בהצלחה! 🎯',
      toastIssueReportedDescription: 'הדוח שלכם נשלח. מספר הפניה: {{id}}',
      
      // Support Form Messages
      supportDescriptionPlaceholder: 'אנא תארו מה השתבש, מה ציפיתם שיקרה, וכל שלבים לשחזור הבעיה...',
      
      // Validation Messages
      validationDescriptionRequired: 'תיאור נדרש',
      validationMinimumLength: 'התיאור חייב להיות באורך של לפחות 10 תווים',
      validationMaximumLength: 'התיאור חייב להיות פחות מ-500 תווים',
      validationFailed: 'אימות נכשל',
      validationTooManyImages: 'יותר מדי תמונות',
      validationMaxImagesMessage: 'ניתן להוסיף רק {{remaining}} תמונות נוספות (מקסימום {{max}})',
      
      // Error Messages
      errorImageUploadFailed: 'העלאת תמונה נכשלה',
      errorImageProcessFailed: 'עיבוד תמונה נכשל',
      errorSubmitReportFailed: 'שליחת דוח נכשלה',
      errorTryAgainMessage: 'אנא נסו שוב או צרו קשר עם התמיכה ישירות.',
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
    defaultNS: 'ui',
    ns: ['ui', 'copy'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;