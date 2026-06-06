import { useState, useEffect, useRef } from "react";
import { Accelerometer, Gyroscope } from "expo-sensors";
import { Vector3D, lowPassFilter, estimateLinearAcceleration } from "../utils/sensor-math";
import { DetectedEvent, DrivingEventDetector, EVENT_METADATA, SafetyEventType } from "../utils/event-detector";
import { saveSession, DriveSession } from "../services/storage";
import { getSafetyRating } from "../utils/driving-helpers";

export function useDrivingTracker() {
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [score, setScore] = useState(100);
  const [events, setEvents] = useState<DetectedEvent[]>([]);
  
  // Real-time sensor state for live telemetry
  const [accelData, setAccelData] = useState<Vector3D>({ x: 0, y: 0, z: 0 });
  const [gyroData, setGyroData] = useState<Vector3D>({ x: 0, y: 0, z: 0 });

  // Refs for tracking sensor buffers and detection
  const eventDetectorRef = useRef<DrivingEventDetector | null>(null);
  const samplesRef = useRef<{ timestamp: number; accel: Vector3D; gyro: Vector3D }[]>([]);
  const gravityRef = useRef<Vector3D>({ x: 0, y: 0, z: 1 }); // initial gravity estimate
  const scoreRef = useRef(100);

  // Timer interval
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startDrive = () => {
    setIsActive(true);
    setStartTime(Date.now());
    setDuration(0);
    setScore(100);
    setEvents([]);
    scoreRef.current = 100;
    samplesRef.current = [];
    gravityRef.current = { x: 0, y: 0, z: 9.81 }; // default approx gravity in m/s^2
    eventDetectorRef.current = new DrivingEventDetector();

    Accelerometer.setUpdateInterval(100);
    Gyroscope.setUpdateInterval(100);

    // Setup sensor subscriptions
    const accelSub = Accelerometer.addListener((data) => {
      // expo-sensors returns accel in Gs. Convert to m/s^2 (1G = 9.81)
      const raw: Vector3D = {
        x: data.x * 9.81,
        y: data.y * 9.81,
        z: data.z * 9.81,
      };

      // Isolate gravity and linear acceleration
      gravityRef.current = lowPassFilter(raw, gravityRef.current, 0.1);
      const linear = estimateLinearAcceleration(raw, gravityRef.current);
      setAccelData(linear);

      // Save to sliding window
      const latestGyro = gyroData; // fallback
      const sample = {
        timestamp: Date.now(),
        accel: linear,
        gyro: latestGyro,
      };
      
      samplesRef.current.push(sample);
      if (samplesRef.current.length > 50) {
        samplesRef.current.shift();
      }

      // Detect events
      if (eventDetectorRef.current) {
        const newEvents = eventDetectorRef.current.detectEvents(samplesRef.current);
        if (newEvents.length > 0) {
          handleEventsDetected(newEvents);
        }
      }
    });

    const gyroSub = Gyroscope.addListener((data) => {
      // Gyro is in rad/s
      const gyro: Vector3D = { x: data.x, y: data.y, z: data.z };
      setGyroData(gyro);

      // Update latest sample's gyro if exists
      if (samplesRef.current.length > 0) {
        samplesRef.current[samplesRef.current.length - 1].gyro = gyro;
      }
    });

    // Start timer
    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      accelSub.remove();
      gyroSub.remove();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  };

  const handleEventsDetected = (newEvents: DetectedEvent[]) => {
    setEvents((prev) => [...prev, ...newEvents]);
    
    // Deduct points
    let pointsToDeduct = 0;
    newEvents.forEach((e) => {
      pointsToDeduct += e.scoreDeduction;
    });

    scoreRef.current = Math.max(0, scoreRef.current - pointsToDeduct);
    setScore(scoreRef.current);
  };

  const endDrive = async (): Promise<DriveSession | null> => {
    if (!isActive || !startTime) return null;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsActive(false);

    const pointsDeduct = 100 - scoreRef.current;
    const session: DriveSession = {
      id: `session_${startTime}`,
      startTime,
      endTime: Date.now(),
      duration,
      score: scoreRef.current,
      rating: getSafetyRating(scoreRef.current),
      events,
      pointsDeducted: pointsDeduct,
      distance: Number((duration * 0.012).toFixed(2)), // mock distance based on time
    };

    await saveSession(session);
    return session;
  };

  // Mock event trigger for simulator testing
  const triggerMockEvent = (type: SafetyEventType) => {
    if (!isActive) return;

    const meta = EVENT_METADATA[type];
    const mockEvent: DetectedEvent = {
      id: `mock_${type}_${Date.now()}`,
      type,
      timestamp: Date.now(),
      scoreDeduction: meta.deduction,
      severity: meta.deduction >= 10 ? "high" : meta.deduction >= 5 ? "medium" : "low",
      description: `[Mock] ${meta.description}`,
      value: type.includes("BRAKE") || type.includes("ACCEL") ? 4.5 : 1.5,
    };

    handleEventsDetected([mockEvent]);
  };

  return {
    isActive,
    duration,
    score,
    events,
    accelData,
    gyroData,
    startDrive,
    endDrive,
    triggerMockEvent,
  };
}
