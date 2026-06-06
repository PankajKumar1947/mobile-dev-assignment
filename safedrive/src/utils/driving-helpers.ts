import { DetectedEvent } from "./event-detector";

export function getSafetyRating(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Fair";
  return "Poor";
}

export function formatDuration(secs: number): string {
  const mins = Math.floor(secs / 60);
  const remainingSecs = secs % 60;
  return mins > 0 ? `${mins}m ${remainingSecs}s` : `${remainingSecs}s`;
}

export function getAiFeedback(score: number, events: DetectedEvent[]): string {
  if (score === 100) {
    return "Flawless performance! Perfect speed management, steady steering, and full focus. Keep up this exemplary driving.";
  }

  const issues: string[] = [];
  const counts = {
    brake: events.filter((e) => e.type === "HARSH_BRAKING").length,
    accel: events.filter((e) => e.type === "HARSH_ACCELERATION").length,
    turn: events.filter((e) => e.type === "SHARP_TURN").length,
    phone: events.filter((e) => e.type === "PHONE_HANDLING").length,
    steer: events.filter((e) => e.type === "AGGRESSIVE_STEERING").length,
  };

  if (counts.phone > 0) {
    issues.push("Phone handling was detected. Prioritize safety by mounting your device securely before starting.");
  }
  if (counts.brake > 0) {
    issues.push("Harsh deceleration events suggest following other vehicles too closely or speeding into hazards.");
  }
  if (counts.turn > 0 || counts.steer > 0) {
    issues.push("Frequent aggressive steering or sharp turns can cause vehicle instability. Slow down and steer gradually.");
  }
  if (counts.accel > 0) {
    issues.push("Rapid acceleration bursts reduce fuel efficiency and compromise traction control.");
  }

  if (issues.length === 0) {
    return "Good overall drive. Maintain steady focus and anticipate traffic shifts to smooth out any small corrections.";
  }

  return `${issues.join(" ")} Small adjustments to these areas will greatly improve your safety score.`;
}
