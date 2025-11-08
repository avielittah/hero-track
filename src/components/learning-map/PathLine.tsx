import { Line } from "@react-three/drei";
import { MapLocation } from "@/types/map.types";

interface PathLineProps {
  from: MapLocation;
  to: MapLocation;
}

export const PathLine = ({ from, to }: PathLineProps) => {
  const isCompleted = from.status === "completed" && to.status === "completed";
  const isActive = from.status === "completed" && to.status !== "locked";
  const isLocked = to.status === "locked";

  const getColor = () => {
    if (isCompleted) return "#22c55e";
    if (isActive) return "#3b82f6";
    return "#6b7280";
  };

  const getOpacity = () => {
    if (isLocked) return 0.2;
    if (isActive) return 0.6;
    return 0.8;
  };

  // Create a curved path
  const midPoint: [number, number, number] = [
    (from.position[0] + to.position[0]) / 2,
    Math.max(from.position[1], to.position[1]) + 0.5,
    (from.position[2] + to.position[2]) / 2
  ];

  return (
    <Line
      points={[from.position, midPoint, to.position]}
      color={getColor()}
      lineWidth={isActive ? 3 : 2}
      transparent
      opacity={getOpacity()}
      dashed={isLocked}
      dashScale={10}
      dashSize={0.5}
      gapSize={0.3}
    />
  );
};
