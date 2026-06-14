"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  NormalizedLandmark,
  PoseLandmarker,
} from "@mediapipe/tasks-vision";
import { calculateAngle } from "../utils/angle-calculator";
import { LandmarkSmoother } from "../utils/landmark-smoother";

export function usePoseTracker(
  videoRef: RefObject<HTMLVideoElement | null>,
  affectedArm: "left" | "right" = "right"
) {
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const smootherRef = useRef(new LandmarkSmoother(5));
  const lastUpdateRef = useRef(0);

  const [landmarks, setLandmarks] = useState<NormalizedLandmark[]>([]);
  const [angle, setAngle] = useState(0);
  const [reachValue, setReachValue] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function setupPoseLandmarker() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      if (!isMounted) return;

      poseLandmarkerRef.current = poseLandmarker;
      setIsModelReady(true);
    }

    setupPoseLandmarker();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      poseLandmarkerRef.current?.close();
    };
  }, []);

  useEffect(() => {
    function detectPose() {
      const video = videoRef.current;
      const poseLandmarker = poseLandmarkerRef.current;

      if (
        video &&
        poseLandmarker &&
        video.readyState >= 2 &&
        video.videoWidth > 0
      ) {
        const result = poseLandmarker.detectForVideo(video, performance.now());
        const rawPose = result.landmarks?.[0] ?? [];
        const now = performance.now();

        if (rawPose.length === 0) {
          smootherRef.current.reset();

          if (now - lastUpdateRef.current > 120) {
            setLandmarks([]);
            setAngle(0);
            setReachValue(0);
            setIsTracking(false);
            lastUpdateRef.current = now;
          }
        } else {
          const pose = smootherRef.current.smoothLandmarks(rawPose);

          // Select landmarks based on affected arm
          const shoulder = affectedArm === "right" ? pose[12] : pose[11];
          const elbow    = affectedArm === "right" ? pose[14] : pose[13];
          const wrist    = affectedArm === "right" ? pose[16] : pose[15];
          const hip      = affectedArm === "right" ? pose[24] : pose[23];

          let newAngle = 0;
          let newReachValue = 0;

          // Angle for ROM display
          if (hip && shoulder && elbow) {
            newAngle = calculateAngle(hip, shoulder, elbow);
          }

          // Reach value for rep counting
          // 3D distance from shoulder to wrist
          // Captures forward, sideways, and upward reach
          if (shoulder && wrist) {
            const dx = wrist.x - shoulder.x;
            const dy = wrist.y - shoulder.y;
            // const dz = (wrist.z ?? 0) - (shoulder.z ?? 0);
            // newReachValue = Math.sqrt(dx * dx + dy * dy + dz * dz);
            newReachValue = Math.sqrt(dx * dx + dy * dy); 
          }

          if (now - lastUpdateRef.current > 80) {
            setLandmarks(pose);
            setIsTracking(true);
            setAngle(Math.round(newAngle));
            setReachValue(Number(newReachValue.toFixed(3)));
            lastUpdateRef.current = now;
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(detectPose);
    }

    if (isModelReady) {
      detectPose();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isModelReady, videoRef, affectedArm]);

  return {
    landmarks,
    angle,
    reachValue,
    isTracking,
  };
}