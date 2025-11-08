import { MapLocation } from "@/types/map.types";

export const learningMapData: MapLocation[] = [
  {
    id: "basics",
    title: "Getting Started",
    position: [0, 0, 0],
    status: "current",
    prerequisites: [],
    biome: "forest",
    description: "Begin your learning journey with the fundamentals",
    resources: [
      {
        type: "video",
        title: "Introduction to the Platform",
        url: "https://youtube.com/watch?v=intro"
      },
      {
        type: "article",
        title: "Quick Start Guide",
        url: "https://docs.example.com/quickstart"
      }
    ],
    children: [
      {
        id: "basics-1",
        title: "Platform Overview",
        position: [0, 0.2, 0],
        status: "available",
        prerequisites: [],
        description: "Learn about the platform features",
        resources: []
      }
    ]
  },
  {
    id: "tools",
    title: "Essential Tools",
    position: [5, 1, 2],
    status: "locked",
    prerequisites: ["basics"],
    biome: "forest",
    description: "Master the essential tools for your work",
    resources: [
      {
        type: "video",
        title: "Tool Setup Tutorial",
        url: "https://youtube.com/watch?v=tools"
      },
      {
        type: "external",
        title: "Tool Documentation",
        url: "https://tools.example.com"
      }
    ],
    children: [
      {
        id: "tools-1",
        title: "Development Environment",
        position: [5, 1.2, 2],
        status: "locked",
        prerequisites: ["basics"],
        description: "Set up your development environment",
        resources: []
      },
      {
        id: "tools-2",
        title: "Version Control",
        position: [5.5, 1.3, 2.5],
        status: "locked",
        prerequisites: ["tools-1"],
        description: "Learn Git and version control",
        resources: []
      }
    ]
  },
  {
    id: "architecture",
    title: "System Architecture",
    position: [10, 2, 1],
    status: "locked",
    prerequisites: ["tools"],
    biome: "mountain",
    description: "Understand system design and architecture patterns",
    resources: [
      {
        type: "video",
        title: "Architecture Patterns",
        url: "https://youtube.com/watch?v=arch"
      },
      {
        type: "article",
        title: "Design Principles",
        url: "https://blog.example.com/design"
      }
    ],
    children: []
  },
  {
    id: "advanced",
    title: "Advanced Concepts",
    position: [15, 3, -2],
    status: "locked",
    prerequisites: ["architecture"],
    biome: "mountain",
    description: "Dive deep into advanced topics",
    resources: [
      {
        type: "video",
        title: "Advanced Techniques",
        url: "https://youtube.com/watch?v=advanced"
      }
    ],
    children: []
  },
  {
    id: "mastery",
    title: "Mastery Level",
    position: [20, 5, 0],
    status: "locked",
    prerequisites: ["advanced"],
    biome: "snow",
    description: "Achieve mastery in your field",
    resources: [
      {
        type: "video",
        title: "Expert Techniques",
        url: "https://youtube.com/watch?v=mastery"
      },
      {
        type: "article",
        title: "Best Practices",
        url: "https://blog.example.com/mastery"
      }
    ],
    children: []
  }
];

export const updateLocationStatus = (
  locations: MapLocation[],
  completedIds: string[],
  currentId: string
): MapLocation[] => {
  const checkUnlock = (location: MapLocation): boolean => {
    return location.prerequisites.every(prereq => completedIds.includes(prereq));
  };

  return locations.map(location => ({
    ...location,
    status: completedIds.includes(location.id)
      ? 'completed'
      : location.id === currentId
      ? 'current'
      : checkUnlock(location)
      ? 'available'
      : 'locked',
    children: location.children?.map(child => ({
      ...child,
      status: completedIds.includes(child.id)
        ? 'completed'
        : child.id === currentId
        ? 'current'
        : checkUnlock(child)
        ? 'available'
        : 'locked'
    }))
  }));
};
