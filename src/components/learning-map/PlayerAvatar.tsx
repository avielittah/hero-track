import { useRef, useEffect } from "react";
import { Mesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

interface PlayerAvatarProps {
  position: [x: number, y: number, z: number];
}

export const PlayerAvatar = ({ position }: PlayerAvatarProps) => {
  const meshRef = useRef<Mesh>(null);
  const targetPosition = useRef(new Vector3(...position));

  useEffect(() => {
    targetPosition.current.set(...position);
  }, [position]);

  useFrame(() => {
    if (meshRef.current) {
      // Smooth movement towards target
      meshRef.current.position.lerp(targetPosition.current, 0.05);
      
      // Bobbing animation
      meshRef.current.position.y = position[1] + 1.5 + Math.sin(Date.now() * 0.003) * 0.1;
    }
  });

  return (
    <group>
      {/* Main avatar body */}
      <mesh ref={meshRef} castShadow>
        <capsuleGeometry args={[0.3, 0.6, 16, 32]} />
        <meshStandardMaterial 
          color="#ef4444" 
          emissive="#ef4444"
          emissiveIntensity={0.3}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Shadow circle */}
      <mesh position={[position[0], 0.01, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};
