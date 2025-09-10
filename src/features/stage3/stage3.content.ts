export const stage3Content = {
  title: "Technical Orientation — Tools You'll Use",
  intro:
    "Before we go hands-on, let's make sure you're comfortable with two core tools you'll use during onboarding: Draw.io for system diagrams, and VLC for media/stream analysis.",
  estTime: "Estimated time: ~40–60 minutes total.",
  buddyNudge:
    "If you get stuck, tap \"Ask Buddy\". Your smart mentor will guide you step by step.",
  ctaComplete: "Done — Move to Hands-On →",
  toastDone: "Great! Technical orientation completed. +{{xp}} XP",
  xpTotalTarget: 30,
  trophyOnComplete: "Tool Master",

  units: {
    drawio: {
      title: "Visualizing Systems with Draw.io",
      objective:
        "Create clear system diagrams to communicate architecture and data flows.",
      background:
        "As a Communication Systems Engineer, you'll often align with peers using diagrams. Draw.io is a lightweight, intuitive tool for that.",
      estimatedTime: "~20–30 min",
      contentBullets: [
        "Open draw.io and choose a blank canvas or a template.",
        "Add nodes (client/server/database) and connect them with arrows.",
        "Use labels and colors to clarify flows and protocols.",
        "Export your diagram and share with your team."
      ],
      tasks: [
        "Create a simple client-server-database diagram for a login flow.",
        "Export to PNG and upload the file."
      ],
      videoTitle: "Draw.io Basics",
      videoUrl: "https://www.youtube.com/watch?v=2J3Z2jzO20g",
      toolLink: "https://app.diagrams.net/",
      quiz: {
        mcq: [
          {
            q: "What's the best way to show data direction?",
            options: ["Use colored boxes", "Use arrows with labels", "Use bigger fonts", "Avoid connectors"],
            correctIndex: 1
          },
          {
            q: "Which export format is suitable for sharing in chat?",
            options: ["PNG", "RAW", "BIN", "EXE"],
            correctIndex: 0
          }
        ],
        open: "In one sentence, when would you prefer a template over a blank canvas?"
      },
      xpOnSubmit: 15
    },

    vlc: {
      title: "Media & Stream Basics with VLC",
      objective:
        "Open, inspect, and capture media/stream information for quick analysis.",
      background:
        "VLC is more than a player—it helps engineers test streams, inspect codecs, and capture screenshots/logs quickly.",
      estimatedTime: "~20–30 min",
      contentBullets: [
        "Install VLC and open a local media file.",
        "Use 'Open Network Stream' to test a sample URL.",
        "View Codec/Statistics panels to inspect stream details.",
        "Take a screenshot and save it for documentation."
      ],
      tasks: [
        "Open a sample network stream in VLC.",
        "Capture a screenshot of the player and upload it."
      ],
      videoTitle: "VLC Basics",
      videoUrl: "https://www.youtube.com/watch?v=ZaBfb89Yddg",
      toolLink: "https://www.videolan.org/vlc/",
      quiz: {
        mcq: [
          {
            q: "Where do you open a network stream in VLC?",
            options: ["Media → Open Network Stream", "Tools → Effects", "View → Playlist", "Help → Check for Updates"],
            correctIndex: 0
          },
          {
            q: "Which panel helps you inspect codecs?",
            options: ["Preferences", "Codec/Statistics", "Bookmarks", "Messages only"],
            correctIndex: 1
          }
        ],
        open: "Describe one use-case for VLC in your daily role."
      },
      xpOnSubmit: 15
    }
  }
} as const;