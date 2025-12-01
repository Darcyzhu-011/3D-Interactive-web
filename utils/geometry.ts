import * as THREE from 'three';
import { CONFIG } from '../constants';

// Helper to get a random point in a sphere
export const getRandomSpherePoint = (radius: number): THREE.Vector3 => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  const sinPhi = Math.sin(phi);
  return new THREE.Vector3(
    r * sinPhi * Math.cos(theta),
    r * sinPhi * Math.sin(theta),
    r * Math.cos(phi)
  );
};

// Helper to get a point on a cone volume (The Tree)
export const getRandomConePoint = (height: number, baseRadius: number): THREE.Vector3 => {
  const y = Math.random() * height; // Height from bottom (0) to top (height)
  // Radius at height y. Linear decrease from baseRadius to 0.
  // However, we want the tree to be centered vertically around 0 for easier camera logic
  const normalizedY = y / height; // 0 to 1
  const currentRadius = baseRadius * (1 - normalizedY);
  
  const angle = Math.random() * Math.PI * 2;
  // Volume distribution: sqrt(random) pushes points outward to surface slightly, 
  // but we want a mix of inner and outer needles.
  const r = Math.sqrt(Math.random()) * currentRadius;

  const x = r * Math.cos(angle);
  const z = r * Math.sin(angle);
  
  // Center the tree vertically
  const centeredY = y - height / 2;

  return new THREE.Vector3(x, centeredY, z);
};

// Helper to generate data for instances
export const generateDualPositions = (count: number): any[] => {
  const data = [];
  for (let i = 0; i < count; i++) {
    const treePos = getRandomConePoint(CONFIG.TREE_HEIGHT, CONFIG.TREE_RADIUS_BASE);
    const scatterPos = getRandomSpherePoint(CONFIG.SCATTER_RADIUS);
    
    // Add some "spiral" bias to treePos to make it look nicer
    // Slightly tweak x/z based on y to create a subtle swirl structure if desired, 
    // but random cone is usually fine for organic look.
    
    data.push({
      treePos,
      scatterPos,
      rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
      scale: 0.5 + Math.random() * 0.8,
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      ),
      phaseOffset: Math.random() * Math.PI * 2,
    });
  }
  return data;
};
