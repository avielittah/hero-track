import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Briefcase, 
  UserCheck, 
  Calendar,
  Star,
  Trophy,
  Target,
  Zap,
  Code,
  Lightbulb,
  Users,
  Settings,
  Award,
  Crown,
  Sparkles
} from 'lucide-react';
import { useLearningStore } from '@/lib/store';
import { Level } from '@/types/journey';

interface ProfileSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

interface Skill {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlockedAt: Level;
  category: 'technical' | 'soft' | 'leadership';
}

const SKILLS: Skill[] = [
  // Level 3 Skills (Skilled Learner)
  {
    id: 'problem-solving',
    name: 'Problem Solving',
    description: 'Break down complex challenges into manageable parts',
    icon: <Lightbulb className="h-4 w-4" />,
    unlockedAt: 'Skilled Learner',
    category: 'soft'
  },
  {
    id: 'technical-communication',
    name: 'Technical Communication',
    description: 'Explain complex concepts clearly to diverse audiences',
    icon: <Code className="h-4 w-4" />,
    unlockedAt: 'Skilled Learner',
    category: 'technical'
  },
  
  // Level 5 Skills (Project Builder)
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Plan, execute, and deliver projects successfully',
    icon: <Target className="h-4 w-4" />,
    unlockedAt: 'Project Builder',
    category: 'leadership'
  },
  {
    id: 'strategic-thinking',
    name: 'Strategic Thinking',
    description: 'Analyze situations and plan long-term solutions',
    icon: <Zap className="h-4 w-4" />,
    unlockedAt: 'Project Builder',
    category: 'soft'
  },
  {
    id: 'cross-functional-collaboration',
    name: 'Cross-functional Collaboration',
    description: 'Work effectively across different teams and departments',
    icon: <Users className="h-4 w-4" />,
    unlockedAt: 'Project Builder',
    category: 'soft'
  },
  
  // Level 6 Skills (Pro Team Member)
  {
    id: 'mentorship',
    name: 'Mentorship & Coaching',
    description: 'Guide and develop other team members',
    icon: <Crown className="h-4 w-4" />,
    unlockedAt: 'Pro Team Member',
    category: 'leadership'
  },
  {
    id: 'innovation-leadership',
    name: 'Innovation Leadership',
    description: 'Drive creative solutions and inspire teams',
    icon: <Sparkles className="h-4 w-4" />,
    unlockedAt: 'Pro Team Member',
    category: 'leadership'
  },
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Use data to drive decisions and optimize processes',
    icon: <Settings className="h-4 w-4" />,
    unlockedAt: 'Pro Team Member',
    category: 'technical'
  }
];

const MOCK_PROFILE = {
  name: 'Alex Johnson',
  email: 'alex.johnson@company.com',
  role: 'Software Developer',
  manager: 'Sarah Chen',
  startDate: '2023-03-15',
  avatar: '',
};

export const ProfileSheet = ({ isOpen, onOpenChange, trigger }: ProfileSheetProps) => {
  const { t } = useTranslation();
  const { 
    username, 
    level, 
    currentXP, 
    trophies, 
    getCurrentLevelIndex,
    getXPProgressInCurrentLevel 
  } = useLearningStore();

  const profile = {
    ...MOCK_PROFILE,
    name: username || MOCK_PROFILE.name,
  };

  const xpProgress = getXPProgressInCurrentLevel();
  const levelIndex = getCurrentLevelIndex();
  
  // Get unlocked skills based on current level
  const getUnlockedSkills = () => {
    const levelOrder: Level[] = [
      'New Explorer',
      'Team Rookie', 
      'Skilled Learner',
      'Problem Solver',
      'Project Builder',
      'Pro Team Member'
    ];
    
    const currentLevelIndex = levelOrder.indexOf(level);
    return SKILLS.filter(skill => {
      const skillLevelIndex = levelOrder.indexOf(skill.unlockedAt);
      return skillLevelIndex <= currentLevelIndex;
    });
  };

  const unlockedSkills = getUnlockedSkills();
  const skillsByCategory = {
    technical: unlockedSkills.filter(s => s.category === 'technical'),
    soft: unlockedSkills.filter(s => s.category === 'soft'),
    leadership: unlockedSkills.filter(s => s.category === 'leadership'),
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return <Code className="h-4 w-4" />;
      case 'soft':
        return <Lightbulb className="h-4 w-4" />;
      case 'leadership':
        return <Crown className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'soft':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'leadership':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      
      <SheetContent 
        side="right" 
        className="w-full sm:w-[400px] overflow-y-auto bg-background/95 backdrop-blur-sm"
      >
        <SheetHeader className="space-y-4">
          <SheetTitle className="text-left">{t('Profile')}</SheetTitle>
          
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg"
          >
            <Avatar className="h-16 w-16 ring-4 ring-primary/20">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">{profile.role}</p>
              <Badge className="mt-1 bg-primary/20 text-primary border-primary/30">
                {t(level)}
              </Badge>
            </div>
          </motion.div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{profile.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{profile.role}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Manager: {profile.manager}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Started: {new Date(profile.startDate).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Progress & XP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Learning Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current XP</span>
                    <span className="font-medium">{currentXP}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Level Progress</span>
                    <span className="font-medium">{xpProgress.current}/{xpProgress.max}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-primary to-primary-700 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress.percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trophies */}
          {trophies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center space-x-2">
                    <Trophy className="h-4 w-4" />
                    <span>Trophies ({trophies.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {trophies.map((trophy, index) => (
                      <motion.div
                        key={trophy.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                        className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200"
                      >
                        <Trophy className="h-4 w-4 text-yellow-600" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-yellow-800 truncate">
                            {trophy.name}
                          </p>
                          <p className="text-xs text-yellow-600">
                            Stage {trophy.stage}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Skills */}
          {unlockedSkills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center space-x-2">
                    <Award className="h-4 w-4" />
                    <span>Unlocked Skills ({unlockedSkills.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(skillsByCategory).map(([category, skills]) => 
                    skills.length > 0 && (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(category)}
                          <h4 className="text-sm font-medium capitalize">{category} Skills</h4>
                        </div>
                        <div className="space-y-2">
                          {skills.map((skill, index) => (
                            <motion.div
                              key={skill.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                              className={`
                                p-3 rounded-lg border transition-all hover:shadow-sm
                                ${getCategoryColor(category)}
                              `}
                            >
                              <div className="flex items-start space-x-2">
                                {skill.icon}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium">{skill.name}</p>
                                  <p className="text-xs opacity-80 line-clamp-2">
                                    {skill.description}
                                  </p>
                                  <Badge 
                                    variant="outline" 
                                    className="mt-1 text-xs bg-white/50"
                                  >
                                    {t(skill.unlockedAt)}
                                  </Badge>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        {category !== 'leadership' && <Separator />}
                      </div>
                    )
                  )}
                  
                  {/* Next Skills Preview */}
                  {level !== 'Pro Team Member' && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-2">
                        🔒 More skills unlock as you level up!
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Next unlock: {SKILLS.find(s => !unlockedSkills.includes(s))?.unlockedAt}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};