import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Compass, X } from "lucide-react";
import { LearningMap3D } from "./learning-map/LearningMap3D";

export const GuidedLearningPanel = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="fixed right-0 top-1/2 -translate-y-1/2 rounded-r-none rounded-l-lg shadow-lg z-40 px-3 py-6 writing-mode-vertical bg-gradient-to-b from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          style={{ writingMode: 'vertical-rl' }}
        >
          <Compass className="w-5 h-5 mb-2 rotate-90" />
          <span className="font-bold text-sm tracking-wider">GUIDED LEARNING</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full w-screen h-screen p-0 m-0 [&>button]:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={() => setOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        <LearningMap3D />
      </DialogContent>
    </Dialog>
  );
};
