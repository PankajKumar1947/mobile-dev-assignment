import { Vector3D, getMagnitude } from "./sensor-math";

export interface SensorDataSample {
  timestamp: number;
  accel: Vector3D;
  gyro: Vector3D;
}

export type SafetyEventType =
  | "HARSH_BRAKING"
  | "HARSH_ACCELERATION"
  | "SHARP_TURN"
  | "AGGRESSIVE_STEERING"
  | "EXCESSIVE_MOVEMENT"
  | "PHONE_HANDLING";

export interface DetectedEvent {
  id: string;
  type: SafetyEventType;
  timestamp: number;
  scoreDeduction: number;
  severity: "low" | "medium" | "high";
  description: string;
  value: number;
}

export const DETECTOR_THRESHOLDS = {
  HARSH_ACCELERATION: 3.0,
  HARSH_BRAKING: 3.9,
  SHARP_TURN: 3.4,
  AGGRESSIVE_STEERING: 0.8,
  EXCESSIVE_MOVEMENT: 4.5,
  PHONE_HANDLING: 1.2,
};

export const EVENT_METADATA: Record<SafetyEventType, { name: string; deduction: number; description: string }> = {
  HARSH_BRAKING: {
    name: "Harsh Braking",
    deduction: 5,
    description: "Sudden deceleration detected.",
  },
  HARSH_ACCELERATION: {
    name: "Harsh Acceleration",
    deduction: 5,
    description: "Sudden rapid speed-up.",
  },
  SHARP_TURN: {
    name: "Sharp Turn",
    deduction: 3,
    description: "Hard cornering.",
  },
  AGGRESSIVE_STEERING: {
    name: "Aggressive Steering",
    deduction: 3,
    description: "Sudden steering changes.",
  },
  PHONE_HANDLING: {
    name: "Phone Handling",
    deduction: 10,
    description: "Device interaction detected.",
  },
  EXCESSIVE_MOVEMENT: {
    name: "Excessive Device Movement",
    deduction: 5,
    description: "Excessive shaking or falling of device.",
  },
};

export class DrivingEventDetector {
  private lastTriggerTimes: Record<SafetyEventType, number> = {
    HARSH_BRAKING: 0,
    HARSH_ACCELERATION: 0,
    SHARP_TURN: 0,
    AGGRESSIVE_STEERING: 0,
    EXCESSIVE_MOVEMENT: 0,
    PHONE_HANDLING: 0,
  };

  private cooldownMs: number = 3000;

  public detectEvents(window: SensorDataSample[]): DetectedEvent[] {
    if (window.length < 5) return [];

    const now = Date.now();
    const detected: DetectedEvent[] = [];
    const latestSample = window[window.length - 1];

    const accelMagnitude = getMagnitude(latestSample.accel);
    const gyroMagnitude = getMagnitude(latestSample.gyro);

    // 1. Harsh Braking & Acceleration
    if (accelMagnitude > DETECTOR_THRESHOLDS.HARSH_ACCELERATION) {
      if (accelMagnitude > DETECTOR_THRESHOLDS.HARSH_BRAKING) {
        if (now - this.lastTriggerTimes.HARSH_BRAKING > this.cooldownMs) {
          this.lastTriggerTimes.HARSH_BRAKING = now;
          detected.push({
            id: `brake_${now}`,
            type: "HARSH_BRAKING",
            timestamp: now,
            scoreDeduction: EVENT_METADATA.HARSH_BRAKING.deduction,
            severity: "high",
            description: EVENT_METADATA.HARSH_BRAKING.description,
            value: accelMagnitude,
          });
        }
      } else {
        if (now - this.lastTriggerTimes.HARSH_ACCELERATION > this.cooldownMs) {
          if (gyroMagnitude < DETECTOR_THRESHOLDS.AGGRESSIVE_STEERING) {
            this.lastTriggerTimes.HARSH_ACCELERATION = now;
            detected.push({
              id: `accel_${now}`,
              type: "HARSH_ACCELERATION",
              timestamp: now,
              scoreDeduction: EVENT_METADATA.HARSH_ACCELERATION.deduction,
              severity: "medium",
              description: EVENT_METADATA.HARSH_ACCELERATION.description,
              value: accelMagnitude,
            });
          }
        }
      }
    }

    // 2. Sharp Turns
    if (accelMagnitude > DETECTOR_THRESHOLDS.SHARP_TURN && gyroMagnitude > 0.5) {
      if (now - this.lastTriggerTimes.SHARP_TURN > this.cooldownMs) {
        this.lastTriggerTimes.SHARP_TURN = now;
        detected.push({
          id: `turn_${now}`,
          type: "SHARP_TURN",
          timestamp: now,
          scoreDeduction: EVENT_METADATA.SHARP_TURN.deduction,
          severity: "medium",
          description: EVENT_METADATA.SHARP_TURN.description,
          value: accelMagnitude,
        });
      }
    }

    // 3. Aggressive Steering
    if (gyroMagnitude > DETECTOR_THRESHOLDS.AGGRESSIVE_STEERING) {
      if (now - this.lastTriggerTimes.AGGRESSIVE_STEERING > this.cooldownMs) {
        this.lastTriggerTimes.AGGRESSIVE_STEERING = now;
        detected.push({
          id: `steer_${now}`,
          type: "AGGRESSIVE_STEERING",
          timestamp: now,
          scoreDeduction: EVENT_METADATA.AGGRESSIVE_STEERING.deduction,
          severity: "low",
          description: EVENT_METADATA.AGGRESSIVE_STEERING.description,
          value: gyroMagnitude,
        });
      }
    }

    // 4. Phone Handling
    if (gyroMagnitude > DETECTOR_THRESHOLDS.PHONE_HANDLING && accelMagnitude < 2.5) {
      if (now - this.lastTriggerTimes.PHONE_HANDLING > this.cooldownMs) {
        this.lastTriggerTimes.PHONE_HANDLING = now;
        detected.push({
          id: `phone_${now}`,
          type: "PHONE_HANDLING",
          timestamp: now,
          scoreDeduction: EVENT_METADATA.PHONE_HANDLING.deduction,
          severity: "high",
          description: EVENT_METADATA.PHONE_HANDLING.description,
          value: gyroMagnitude,
        });
      }
    }

    // 5. Excessive Device Movement
    if (accelMagnitude > DETECTOR_THRESHOLDS.EXCESSIVE_MOVEMENT && gyroMagnitude > 1.5) {
      if (now - this.lastTriggerTimes.EXCESSIVE_MOVEMENT > this.cooldownMs) {
        this.lastTriggerTimes.EXCESSIVE_MOVEMENT = now;
        detected.push({
          id: `movement_${now}`,
          type: "EXCESSIVE_MOVEMENT",
          timestamp: now,
          scoreDeduction: EVENT_METADATA.EXCESSIVE_MOVEMENT.deduction,
          severity: "low",
          description: EVENT_METADATA.EXCESSIVE_MOVEMENT.description,
          value: accelMagnitude,
        });
      }
    }

    return detected;
  }
}
