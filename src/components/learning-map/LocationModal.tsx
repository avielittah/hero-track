import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapLocation } from "@/types/map.types";
import { ExternalLink, Video, FileText, CheckCircle2 } from "lucide-react";

interface LocationModalProps {
  location: MapLocation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export const LocationModal = ({ location, open, onOpenChange, onComplete }: LocationModalProps) => {
  if (!location) return null;

  const getStatusBadge = () => {
    switch (location.status) {
      case "completed":
        return <Badge className="bg-green-500">Completed ✓</Badge>;
      case "current":
        return <Badge className="bg-amber-500">Current</Badge>;
      case "available":
        return <Badge className="bg-blue-500">Available</Badge>;
      case "locked":
        return <Badge variant="secondary">Locked 🔒</Badge>;
    }
  };

  const getBiomeEmoji = () => {
    switch (location.biome) {
      case "forest": return "🌲";
      case "mountain": return "⛰️";
      case "snow": return "🏔️";
      default: return "📍";
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "article": return <FileText className="h-4 w-4" />;
      case "external": return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{getBiomeEmoji()}</span>
            <DialogTitle className="text-2xl">{location.title}</DialogTitle>
            {getStatusBadge()}
          </div>
          <DialogDescription className="text-base mt-4">
            {location.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Prerequisites */}
          {location.prerequisites.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Prerequisites
              </h3>
              <div className="flex flex-wrap gap-2">
                {location.prerequisites.map((prereq) => (
                  <Badge key={prereq} variant="outline">
                    {prereq}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {location.resources.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Learning Resources</h3>
              <div className="space-y-2">
                {location.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors group"
                  >
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                      {getResourceIcon(resource.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {resource.title}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {resource.type}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Sub-topics */}
          {location.children && location.children.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Topics to Cover</h3>
              <div className="space-y-2">
                {location.children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                  >
                    {child.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                    )}
                    <span className={child.status === "completed" ? "line-through text-muted-foreground" : ""}>
                      {child.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {location.status !== "completed" && location.status !== "locked" && (
            <Button onClick={onComplete} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Mark as Complete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
