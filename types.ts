import * as THREE from 'three';

export type TreeState = 'SCATTERED' | 'TREE_SHAPE';

export interface DualPosition {
  treePos: THREE.Vector3;
  scatterPos: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  rotationSpeed: THREE.Vector3;
  phaseOffset: number;
}
