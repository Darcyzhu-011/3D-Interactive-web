import * as THREE from 'three';

// Palette
export const COLORS = {
  EMERALD_DEEP: "#002409",
  EMERALD_LIGHT: "#006B3C",
  GOLD_METALLIC: "#D4AF37",
  GOLD_HIGHLIGHT: "#F9E076",
  RED_LUXURY: "#800020", // Burgundy accent
  WHITE_WARM: "#FFFDD0",
};

// Configuration
export const CONFIG = {
  FOLIAGE_COUNT: 4500,
  ORNAMENT_SPHERE_COUNT: 250,
  ORNAMENT_BOX_COUNT: 100,
  TREE_HEIGHT: 12,
  TREE_RADIUS_BASE: 5,
  SCATTER_RADIUS: 25,
  ANIMATION_SPEED: 2.5, // Lerp speed
};

// Shared Materials
export const GOLD_MATERIAL = new THREE.MeshStandardMaterial({
  color: new THREE.Color(COLORS.GOLD_METALLIC),
  roughness: 0.1,
  metalness: 1.0,
  emissive: new THREE.Color(COLORS.GOLD_HIGHLIGHT),
  emissiveIntensity: 0.6, // Increased for higher glow
});

export const RED_MATERIAL = new THREE.MeshStandardMaterial({
  color: new THREE.Color(COLORS.RED_LUXURY),
  roughness: 0.2,
  metalness: 0.6,
});