export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export function getMagnitude(v: Vector3D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

export function lowPassFilter(current: Vector3D, previous: Vector3D, alpha: number): Vector3D {
  return {
    x: previous.x + alpha * (current.x - previous.x),
    y: previous.y + alpha * (current.y - previous.y),
    z: previous.z + alpha * (current.z - previous.z),
  };
}

export function estimateLinearAcceleration(rawAccel: Vector3D, gravity: Vector3D): Vector3D {
  return {
    x: rawAccel.x - gravity.x,
    y: rawAccel.y - gravity.y,
    z: rawAccel.z - gravity.z,
  };
}
