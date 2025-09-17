import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLearningStore } from '@/lib/store';
import { useJourneyMachine } from '@/features/journey/journeyMachine';
import { defaultWelcomeContent } from '@/features/stage1/content.welcome.defaults';
import { orientation1Content } from '@/features/stage2/orientation1.content';
import { stage3Content } from '@/features/stage3/stage3.content';
import type { StageId } from '@/types/journey';

export interface BuddyMessage {
  id: string;
  text: string;
  type: 'greeting' | 'guidance' | 'encouragement' | 'tip' | 'achievement';
  stageSpecific?: boolean;
  showFor?: number; // Duration in ms
}

export interface BuddyContextData {
  currentStage: StageId;
  currentLevel: string;
  currentXP: number;
  roleTitle: string;
  stageTitle: string;
  stageProgress: number;
  contextualMessages: BuddyMessage[];
  getMessageByType: (type: BuddyMessage['type']) => BuddyMessage | null;
}

export const useBuddyContext = (): BuddyContextData => {
  const { t, i18n } = useTranslation();
  const { currentStage, currentXP, level } = useLearningStore();
  const { viewingStage, completedStages } = useJourneyMachine();

  const contextData = useMemo(() => {
    const isHebrew = i18n.language === 'he';
    const stageProgress = (completedStages.size / 8) * 100;

    // Get stage-specific content and title
    const getStageData = (stageId: StageId) => {
      switch (stageId) {
        case 1:
          return {
            title: isHebrew ? 'שלב ההכרות' : 'Welcome & Introduction',
            content: defaultWelcomeContent
          };
        case 2:
          return {
            title: isHebrew ? 'רשימת משימות אוריינטציה' : 'Orientation Checklist',
            content: orientation1Content
          };
        case 3:
          return {
            title: isHebrew ? 'למידת כלים טכניים' : 'Technical Tools Learning',
            content: stage3Content
          };
        default:
          return {
            title: isHebrew ? `שלב ${stageId}` : `Stage ${stageId}`,
            content: null
          };
      }
    };

    const stageData = getStageData(viewingStage);

    // Generate contextual messages based on current stage and progress
    const generateContextualMessages = (): BuddyMessage[] => {
      const messages: BuddyMessage[] = [];

      // Welcome messages for Stage 1
      if (currentStage === 1) {
        messages.push({
          id: 'stage1-welcome',
          text: isHebrew 
            ? 'שלום! אני Buddy, המנטור הדיגיטלי שלך. בואו נתחיל את המסע החדש שלך!'
            : 'Hello! I\'m Buddy, your digital mentor. Let\'s start your exciting new journey!',
          type: 'greeting',
          stageSpecific: true,
          showFor: 8000
        });
        
        messages.push({
          id: 'stage1-guidance',
          text: isHebrew
            ? 'התחל בהכרות עם התוכנית והצוות. אני כאן לעזור לך בכל שלב!'
            : 'Start by getting familiar with the program and team. I\'m here to help you every step!',
          type: 'guidance',
          stageSpecific: true
        });
      }

      // Orientation guidance for Stage 2
      if (currentStage === 2) {
        messages.push({
          id: 'stage2-checklist',
          text: isHebrew
            ? 'בואו נוודא שכל הכלים והגישות מוכנים. זה הבסיס לשלבים הבאים!'
            : 'Let\'s make sure all tools and access are ready. This is the foundation for next stages!',
          type: 'guidance',
          stageSpecific: true
        });
      }

      // Technical learning for Stage 3
      if (currentStage === 3) {
        messages.push({
          id: 'stage3-technical',
          text: isHebrew
            ? 'זמן ללמוד את הכלים הטכניים! Draw.io ו-VLC יהיו חשובים לעבודתך.'
            : 'Time to learn the technical tools! Draw.io and VLC will be important for your work.',
          type: 'guidance',
          stageSpecific: true
        });
      }

      // General encouragement based on progress
      if (stageProgress > 25) {
        messages.push({
          id: 'progress-25',
          text: isHebrew
            ? 'כל הכבוד! אתה עושה התקדמות מעולה. אני גאה בך!'
            : 'Well done! You\'re making excellent progress. I\'m proud of you!',
          type: 'encouragement'
        });
      }

      // XP-based encouragement
      if (currentXP > 100) {
        messages.push({
          id: 'xp-milestone',
          text: isHebrew
            ? `${currentXP} נקודות XP! אתה באמת מתקדם בצורה מרשימה!`
            : `${currentXP} XP points! You\'re truly making impressive progress!`,
          type: 'achievement'
        });
      }

      // General helpful tips
      messages.push(
        {
          id: 'general-help',
          text: isHebrew
            ? 'יש לך שאלות? פשוט לחץ עליי ואני אעזור לך מיד!'
            : 'Have questions? Just click on me and I\'ll help you right away!',
          type: 'tip'
        },
        {
          id: 'take-time',
          text: isHebrew
            ? 'לא צריך למהר - למד בקצב שלך ותהנה מהתהליך!'
            : 'No need to rush - learn at your own pace and enjoy the process!',
          type: 'tip'
        }
      );

      return messages;
    };

    const contextualMessages = generateContextualMessages();

    return {
      currentStage,
      currentLevel: level,
      currentXP,
      roleTitle: defaultWelcomeContent.roleTitle,
      stageTitle: stageData.title,
      stageProgress,
      contextualMessages,
      getMessageByType: (type: BuddyMessage['type']) => {
        return contextualMessages.find(msg => msg.type === type) || null;
      }
    };
  }, [currentStage, currentXP, level, viewingStage, completedStages.size, i18n.language, t]);

  return contextData;
};