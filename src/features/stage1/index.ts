// Main component export
export { WelcomeStage } from './WelcomeStage';

// Individual component exports
export { WelcomeHero } from './WelcomeHero';
export { WelcomeInfoCards } from './WelcomeInfoCards';
export { BuddyHighlight } from './BuddyHighlight';
export { StartCTA } from './StartCTA';

// Content and schema exports
export { WelcomeContentSchema } from './content.welcome.schema';
export type { WelcomeContent } from './content.welcome.schema';
export { defaultWelcomeContent } from './content.welcome.defaults';

// Config exports
export { getWelcomeContentByRole, DEFAULT_ROLE_KEY } from '@/config/journey/roles.config';