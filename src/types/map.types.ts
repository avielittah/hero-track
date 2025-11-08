export interface Resource {
  type: 'video' | 'article' | 'external';
  title: string;
  url: string;
}

export interface MapLocation {
  id: string;
  title: string;
  position: [x: number, y: number, z: number];
  status: 'locked' | 'available' | 'current' | 'completed';
  prerequisites: string[];
  children?: MapLocation[];
  description: string;
  resources: Resource[];
  biome?: 'forest' | 'mountain' | 'snow';
}

export interface PlayerState {
  currentLocation: string;
  completedLocations: string[];
  position: [x: number, y: number, z: number];
}
