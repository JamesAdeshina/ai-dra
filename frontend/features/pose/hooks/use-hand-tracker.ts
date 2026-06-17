"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  HandLandmarker,
  NormalizedLandmark,
} from "@mediapipe/tasks-vision";

export function useHandTracker(videoRef: RefObject<HTMLVideoElement | null>) {
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateRef = useRef(0);

  const [landmarks, setLandmarks] = useState<NormalizedLandmark[]>([]);
  const [closureRatio, setClosureRatio] = useState(0);
  const [pinchRatio, setPinchRatio] = useState(1);
  const [isTracking, setIsTracking] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function setupHandLandmarker() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
      });

      if (!isMounted) return;

      handLandmarkerRef.current = handLandmarker;
      setIsModelReady(true);
    }

    setupHandLandmarker();

    return () => {
      isMounted = false;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      handLandmarkerRef.current?.close();
    };
  }, []);

  useEffect(() => {
    function detectHand() {
      const video = videoRef.current;
      const handLandmarker = handLandmarkerRef.current;

      if (
        video &&
        handLandmarker &&
        video.readyState >= 2 &&
        video.videoWidth > 0
      ) {
        const result = handLandmarker.detectForVideo(video, performance.now());
        const hand = result.landmarks?.[0] ?? [];
        const now = performance.now();

        if (hand.length === 0) {
          if (now - lastUpdateRef.current > 120) {
            setLandmarks([]);
            setClosureRatio(0);
            setPinchRatio(1);
            setIsTracking(false);
            lastUpdateRef.current = now;
          }
        } else {
          const newClosureRatio = calculateClosureRatio(hand);
          const newPinchRatio = calculatePinchRatio(hand);

          if (now - lastUpdateRef.current > 80) {
            setLandmarks(hand);
            setClosureRatio(newClosureRatio);
            setPinchRatio(newPinchRatio);
            setIsTracking(true);
            lastUpdateRef.current = now;
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(detectHand);
    }

    if (isModelReady) {
      detectHand();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isModelReady, videoRef]);

  return {
    landmarks,
    closureRatio,
    pinchRatio,
    isTracking,
  };
}

function calculateClosureRatio(landmarks: NormalizedLandmark[]): number {
  const wrist = landmarks[0];
  const middleMCP = landmarks[9];

  if (!wrist || !middleMCP) return 0;

  const handSize = distance(wrist, middleMCP);
  if (handSize === 0) return 0;

  const fingers = [
    { tip: landmarks[8], mcp: landmarks[5] },
    { tip: landmarks[12], mcp: landmarks[9] },
    { tip: landmarks[16], mcp: landmarks[13] },
    { tip: landmarks[20], mcp: landmarks[17] },
  ];

  const closures = fingers.map(({ tip, mcp }) => {
    if (!tip || !mcp) return 0;

    const tipToMCP = distance(tip, mcp);
    return Math.max(0, Math.min(1, 1 - tipToMCP / handSize));
  });

  const average =
    closures.reduce((total, value) => total + value, 0) / closures.length;

  return Number(average.toFixed(3));
}

function calculatePinchRatio(landmarks: NormalizedLandmark[]): number {
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const wrist = landmarks[0];
  const middleMCP = landmarks[9];

  if (!thumbTip || !indexTip || !wrist || !middleMCP) return 1;

  const handSize = distance(wrist, middleMCP);
  if (handSize === 0) return 1;

  const pinchDistance = distance(thumbTip, indexTip);

  return Number((pinchDistance / handSize).toFixed(3));
}

function distance(a: NormalizedLandmark, b: NormalizedLandmark) {
  return Math.sqrt(
    (a.x - b.x) ** 2 +
      (a.y - b.y) ** 2 +
      ((a.z ?? 0) - (b.z ?? 0)) ** 2
  );
}