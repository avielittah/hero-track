import { WelcomeContent } from '@/features/stage1/content.welcome.schema';
import { defaultWelcomeContent } from '@/features/stage1/content.welcome.defaults';

export const roleWelcomeContent: Record<string, WelcomeContent> = {
  'communication-systems-engineer': defaultWelcomeContent,
  // Add future roles here with the same structure
  // 'software-developer': { ... },
  // 'project-manager': { ... },
  // 'data-analyst': { ... },
};

// Helper function to get welcome content by role key
export const getWelcomeContentByRole = (roleKey: string): WelcomeContent => {
  return roleWelcomeContent[roleKey] || defaultWelcomeContent;
};

// Current default role - could be configurable via env or user preference
export const DEFAULT_ROLE_KEY = 'communication-systems-engineer';