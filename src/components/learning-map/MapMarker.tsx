import { useRef, useState } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { MapLocation } from "@/types/map.types";

interface MapMarkerProps {
  location: MapLocation;
  onClick: () => void;
  isPlayerHere?: boolean;
}

export const MapMarker = ({ location, onClick, isPlayerHere }: MapMarkerProps) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation for available/current markers
      if (location.status === "available" || location.status === "current") {
        meshRef.current.position.y = location.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
      
      // Scale animation on hover
      const targetScale = hovered ? 1.3 : 1;
      meshRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale } as any, 0.1);
    }
  });

  const getColor = () => {
    switch (location.status) {
      case "completed": return "#22c55e";
      case "current": return "#f59e0b";
      case "available": return "#3b82f6";
      case "locked": return "#6b7280";
      default: return "#6b7280";
    }
  };

  const getEmissiveIntensity = () => {
    if (location.status === "current") return 0.5;
    if (location.status === "available") return 0.3;
    return 0;
  };

  return (
    <group position={location.position}>
      {/* Main marker sphere */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={getEmissiveIntensity()}
          roughness={0.3}
          metalness={0.7}
          opacity={location.status === "locked" ? 0.4 : 1}
          transparent={location.status === "locked"}
        />
      </mesh>

      {/* Glow ring for current location */}
      {location.status === "current" && (
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.8, 32]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Player indicator */}
      {isPlayerHere && (
        <mesh position={[0, 1.5, 0]}>
          <coneGeometry args={[0.2, 0.4, 4]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      )}

      {/* Label */}
      <Text
        position={[0, 1, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {location.title}
      </Text>

      {/* Status icon */}
      {location.status === "completed" && (
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.4}
          color="#22c55e"
          anchorX="center"
          anchorY="middle"
        >
          ✓
        </Text>
      )}

      {location.status === "locked" && (
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.4}
          color="#6b7280"
          anchorX="center"
          anchorY="middle"
        >
          🔒
        </Text>
      )}
    </group>
  );
};
