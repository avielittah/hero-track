export const orientation1Content = {
  title: "Your First Steps — Orientation Checklist",
  intro:
    "Before we dive into the technical learning, let's make sure you're set up and ready. Complete these quick steps to start strong.",
  estTime: "Estimated time: ~1 day (within your first working day).",
  tasks: [
    {
      id: "verify-device",
      label: "Verify your computer access (OS login, VPN, company Wi-Fi).",
      help: "If something doesn't work, open a support ticket from the footer.",
      required: true,
      xp: 5
    },
    {
      id: "email-calendar",
      label: "Access your company email and calendar.",
      help: "Sign in, set your signature, and check the onboarding events already scheduled.",
      required: true,
      xp: 5
    },
    {
      id: "task-tool",
      label: "Join the team's task management tool (e.g., Jira / Monday) and view your onboarding board.",
      help: "You'll receive read access; tasks for Week 1 are already prepared.",
      required: true,
      xp: 5
    },
    {
      id: "hr-session",
      label: "Attend the HR orientation session.",
      help: "Review benefits, policies, and security guidelines.",
      required: true,
      xp: 5
    },
    {
      id: "campus-tour",
      label: "Take an office/campus tour (if applicable) and locate your team's area.",
      help: "Say hi to your team members and meet your manager.",
      required: false,
      xp: 3
    },
    {
      id: "meet-buddy",
      label: "Meet your TL and say hello to Buddy (our AI mentor).",
      help: "You can ask Buddy anything during the journey.",
      required: true,
      xp: 2
    }
  ],
  buddyNudge:
    "Need help? Tap \"Ask Buddy\" — your smart mentor is here for you anytime.",
  ctaComplete: "All set — Move to Technical Orientation →",
  toastDone: "Nice! Orientation checklist completed. +{{xp}} XP"
} as const;