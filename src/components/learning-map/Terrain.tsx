import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

export const Terrain = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.rotation.z += 0.0001;
    }
  });

  return (
    <group>
      {/* Main terrain plane */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[10, -0.5, 0]} receiveShadow>
        <planeGeometry args={[40, 40, 32, 32]} />
        <meshStandardMaterial 
          color="#4a7c59"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Forest biome accent */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[3, 3, 0.3, 32]} />
        <meshStandardMaterial color="#3d6b4a" roughness={0.9} />
      </mesh>

      {/* Mountain biome accent */}
      <mesh position={[12, 0.5, 0]}>
        <coneGeometry args={[4, 2, 32]} />
        <meshStandardMaterial color="#8b7355" roughness={0.8} />
      </mesh>

      {/* Snow biome accent */}
      <mesh position={[20, 2, 0]}>
        <coneGeometry args={[3, 3, 32]} />
        <meshStandardMaterial color="#e8f4f8" roughness={0.6} />
      </mesh>

      {/* Ambient fog effect */}
      <fog attach="fog" args={["#87ceeb", 15, 50]} />
    </group>
  );
};
