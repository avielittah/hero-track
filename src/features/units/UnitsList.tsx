import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  Play, 
  Star, 
  FileText,
  HelpCircle,
  Upload,
  ChevronRight,
  Target
} from 'lucide-react';
import { UnitData, persistAdapter } from '@/lib/persist';
import { useJourneyMachine } from '../journey/journeyMachine';

interface UnitsListProps {
  units: Partial<UnitData>[];
  stageId: number;
}

export const UnitsList = ({ units, stageId }: UnitsListProps) => {
  const { isStageEditable, viewingStage } = useJourneyMachine();
  const [expandedUnit, setExpandedUnit] = useState<number | null>(null);

  const getUnitIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return <HelpCircle className="h-4 w-4" />;
      case 'open-question':
        return <FileText className="h-4 w-4" />;
      case 'checkbox':
        return <CheckCircle className="h-4 w-4" />;
      case 'file-upload':
        return <Upload className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getUnitStatus = (unitId: string) => {
    const stored = persistAdapter.getUnit(unitId);
    if (!stored) return 'not-started';
    if (stored.status === 'submitted') return 'completed';
    return 'in-progress';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Complete
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="outline" className="border-orange-200 text-orange-700">
            <Play className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-gray-200 text-gray-600">
            <Star className="h-3 w-3 mr-1" />
            Not Started
          </Badge>
        );
    }
  };

  const getUnitTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return 'Quiz';
      case 'open-question':
        return 'Reflection';
      case 'checkbox':
        return 'Checklist';
      case 'file-upload':
        return 'Assignment';
      default:
        return 'Activity';
    }
  };

  const isEditable = isStageEditable(viewingStage);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-foreground tracking-tight">Learning Units</h3>
        <div className="text-sm text-muted-foreground">
          {units.filter((_, index) => 
            getUnitStatus(`stage-${stageId}-unit-${index}`) === 'completed'
          ).length} of {units.length} completed
        </div>
      </div>

      <div className="grid gap-4">
        {units.map((unit, index) => {
          const unitId = `stage-${stageId}-unit-${index}`;
          const status = getUnitStatus(unitId);
          const isExpanded = expandedUnit === index;

          return (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`
                transition-all duration-200 hover:shadow-md cursor-pointer
                ${status === 'completed' ? 'bg-green-50 border-green-200' : ''}
                ${status === 'in-progress' ? 'bg-orange-50 border-orange-200' : ''}
                ${!isEditable ? 'opacity-60' : ''}
              `}>
                <CardContent className="p-4">
                  <div 
                    className="flex items-start justify-between"
                    onClick={() => setExpandedUnit(isExpanded ? null : index)}
                  >
                    <div className="flex-1 space-y-2">
                      {/* Unit Header */}
                      <div className="flex items-start space-x-3">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center
                          ${status === 'completed' ? 'bg-green-500 text-white' : ''}
                          ${status === 'in-progress' ? 'bg-orange-500 text-white' : ''}
                          ${status === 'not-started' ? 'bg-muted text-muted-foreground' : ''}
                        `}>
                          {status === 'completed' ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span className="text-xs font-bold">{index + 1}</span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{unit.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {unit.objective}
                          </p>
                        </div>
                      </div>

                      {/* Unit Meta */}
                      <div className="flex items-center space-x-4 ml-11">
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{unit.estimatedTime || 15} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getUnitIcon(unit.task?.type || '')}
                            <span>{getUnitTypeLabel(unit.task?.type || '')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="h-3 w-3" />
                            <span>+{unit.xpReward || 10} XP</span>
                          </div>
                        </div>
                        
                        {getStatusBadge(status)}
                      </div>
                    </div>

                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="ml-2"
                    >
                      <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </Button>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 ml-11 space-y-3"
                    >
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <h5 className="text-sm font-medium text-foreground mb-1">Learning Objective</h5>
                        <p className="text-sm text-muted-foreground">{unit.objective}</p>
                        
                        {unit.background && (
                          <>
                            <h5 className="text-sm font-medium text-foreground mb-1 mt-3">Background</h5>
                            <p className="text-sm text-muted-foreground">{unit.background}</p>
                          </>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-primary hover:bg-primary-700"
                          disabled={!isEditable}
                        >
                          {status === 'completed' ? 'Review Unit' : 
                           status === 'in-progress' ? 'Continue Unit' : 'Start Unit'}
                        </Button>
                        
                        {status === 'completed' && (
                          <span className="text-xs text-green-600 font-medium">
                            ✓ Submitted & Locked
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};