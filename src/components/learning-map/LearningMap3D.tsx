import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Terrain } from "./Terrain";
import { MapMarker } from "./MapMarker";
import { PlayerAvatar } from "./PlayerAvatar";
import { PathLine } from "./PathLine";
import { LocationModal } from "./LocationModal";
import { ProgressOverlay } from "./ProgressOverlay";
import { MapLocation } from "@/types/map.types";
import { useState, useEffect } from "react";
import { learningMapData, updateLocationStatus } from "@/data/learningMapData";
import { toast } from "sonner";

const STORAGE_KEY = "learning-map-progress";

export const LearningMap3D = () => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).completed : [];
  });
  const [currentId, setCurrentId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).current : "basics";
  });

  const locations = updateLocationStatus(learningMapData, completedIds, currentId);
  const allLocations = locations.flatMap(loc => [loc, ...(loc.children || [])]);
  const currentLocation = allLocations.find(loc => loc.id === currentId) || locations[0];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      completed: completedIds,
      current: currentId
    }));
  }, [completedIds, currentId]);

  const handleLocationClick = (location: MapLocation) => {
    if (location.status === "locked") {
      toast.error("This location is locked. Complete prerequisites first!");
      return;
    }
    setSelectedLocation(location);
    setModalOpen(true);
  };

  const handleComplete = () => {
    if (!selectedLocation) return;

    // Mark as completed
    const newCompleted = [...completedIds, selectedLocation.id];
    setCompletedIds(newCompleted);

    // Find next available location
    const nextLocation = allLocations.find(loc => 
      !newCompleted.includes(loc.id) && 
      loc.prerequisites.every(prereq => newCompleted.includes(prereq))
    );

    if (nextLocation) {
      setCurrentId(nextLocation.id);
      toast.success(`🎉 ${selectedLocation.title} completed! Moving to ${nextLocation.title}`);
    } else {
      toast.success(`🏆 ${selectedLocation.title} completed!`);
    }

    setModalOpen(false);
  };

  // Generate paths between connected locations
  const paths: Array<{ from: MapLocation; to: MapLocation }> = [];
  locations.forEach((location, index) => {
    if (index < locations.length - 1) {
      paths.push({ from: location, to: locations[index + 1] });
    }
    location.children?.forEach((child, childIndex) => {
      if (childIndex === 0) {
        paths.push({ from: location, to: child });
      }
      if (childIndex < (location.children?.length || 0) - 1) {
        paths.push({ from: child, to: location.children![childIndex + 1] });
      }
    });
  });

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-sky-200 to-sky-100">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[10, 8, 15]} fov={60} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2.2}
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[currentLocation.position[0], 5, currentLocation.position[2]]} intensity={0.5} color="#f59e0b" />

        {/* Scene */}
        <Terrain />
        <PlayerAvatar position={currentLocation.position} />

        {/* Paths */}
        {paths.map((path, index) => (
          <PathLine key={index} from={path.from} to={path.to} />
        ))}

        {/* Markers */}
        {allLocations.map((location) => (
          <MapMarker
            key={location.id}
            location={location}
            onClick={() => handleLocationClick(location)}
            isPlayerHere={location.id === currentId}
          />
        ))}
      </Canvas>

      {/* UI Overlays */}
      <ProgressOverlay locations={locations} currentLocation={currentLocation} />

      {/* Location Details Modal */}
      <LocationModal
        location={selectedLocation}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onComplete={handleComplete}
      />
    </div>
  );
};
