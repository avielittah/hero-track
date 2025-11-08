import { MapLocation } from "@/types/map.types";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Map } from "lucide-react";

interface ProgressOverlayProps {
  locations: MapLocation[];
  currentLocation: MapLocation | null;
}

export const ProgressOverlay = ({ locations, currentLocation }: ProgressOverlayProps) => {
  const allLocations = locations.flatMap(loc => [loc, ...(loc.children || [])]);
  const completed = allLocations.filter(loc => loc.status === "completed").length;
  const total = allLocations.length;
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="absolute top-4 left-4 space-y-3 pointer-events-auto">
      {/* Progress Card */}
      <div className="bg-background/95 backdrop-blur-sm rounded-lg shadow-lg border p-4 w-64">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Progress</h3>
          </div>
          <span className="text-2xl font-bold text-primary">{percentage}%</span>
        </div>
        <Progress value={percentage} className="h-2 mb-2" />
        <p className="text-sm text-muted-foreground">
          {completed} of {total} topics completed
        </p>
      </div>

      {/* Current Quest Card */}
      {currentLocation && (
        <div className="bg-background/95 backdrop-blur-sm rounded-lg shadow-lg border p-4 w-64">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold">Current Quest</h3>
          </div>
          <p className="text-sm font-medium">{currentLocation.title}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {currentLocation.description.slice(0, 60)}...
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="bg-background/95 backdrop-blur-sm rounded-lg shadow-lg border p-4 w-64">
        <div className="flex items-center gap-2 mb-3">
          <Map className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Legend</h3>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span>Current Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gray-500 opacity-50" />
            <span>Locked</span>
          </div>
        </div>
      </div>
    </div>
  );
};
