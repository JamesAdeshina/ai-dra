"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  HandLandmarker,
  NormalizedLandmark,
} from "@mediapipe/tasks-vision";

export type TrackedHand = {
  landmarks: NormalizedLandmark[];
  handedness: "Left" | "Right" | "Unknown";
  closureRatio: number;
  pinchRatio: number;
  wristX: number;
  wristY: number;
};

export function useHandTracker(videoRef: RefObject<HTMLVideoElement | null>) {
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateRef = useRef(0);

  const [hands, setHands] = useState<TrackedHand[]>([]);

  // Kept for backward compatibility with existing exercises
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[]>([]);
  const [closureRatio, setClosureRatio] = useState(0);
  const [pinchRatio, setPinchRatio] = useState(1);
  const [isTracking, setIsTracking] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function setupHandLandmarker() {
      try {
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

          // Changed from 1 to 2
          numHands: 2,
        });

        if (!isMounted) {
          handLandmarker.close();
          return;
        }

        handLandmarkerRef.current = handLandmarker;
        setIsModelReady(true);
      } catch (error) {
        console.error("Failed to initialise Hand Landmarker:", error);
      }
    }

    setupHandLandmarker();

    return () => {
      isMounted = false;

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      handLandmarkerRef.current?.close();
      handLandmarkerRef.current = null;
    };
  }, []);

  useEffect(() => {
    function detectHand() {
      const video = videoRef.current;
      const handLandmarker = handLandmarkerRef.current;

      if (
        video &&
        handLandmarker &&
        video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
        video.videoWidth > 0 &&
        video.videoHeight > 0
      ) {
        const now = performance.now();
        const result = handLandmarker.detectForVideo(video, now);

        const detectedHands: TrackedHand[] = (result.landmarks ?? []).map(
          (handLandmarks, index) => {
            const handednessCategory =
              result.handedness?.[index]?.[0]?.categoryName;

            const handedness =
              handednessCategory === "Left" || handednessCategory === "Right"
                ? handednessCategory
                : "Unknown";

            return {
              landmarks: handLandmarks,
              handedness,
              closureRatio: calculateClosureRatio(handLandmarks),
              pinchRatio: calculatePinchRatio(handLandmarks),
              wristX: handLandmarks[0]?.x ?? 0,
              wristY: handLandmarks[0]?.y ?? 0,
            };
          }
        );

        if (detectedHands.length === 0) {
          if (now - lastUpdateRef.current >= 120) {
            setHands([]);
            setLandmarks([]);
            setClosureRatio(0);
            setPinchRatio(1);
            setIsTracking(false);
            lastUpdateRef.current = now;
          }
        } else if (now - lastUpdateRef.current >= 80) {
          const primaryHand = selectPrimaryHand(detectedHands);

          setHands(detectedHands);

          // Existing exercises continue to use the primary hand
          setLandmarks(primaryHand.landmarks);
          setClosureRatio(primaryHand.closureRatio);
          setPinchRatio(primaryHand.pinchRatio);
          setIsTracking(true);

          lastUpdateRef.current = now;
        }
      }

      animationFrameRef.current = requestAnimationFrame(detectHand);
    }

    if (isModelReady) {
      detectHand();
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isModelReady, videoRef]);

  return {
    // New two-hand output
    hands,

    // Existing output preserved
    landmarks,
    closureRatio,
    pinchRatio,
    isTracking,
  };
}

function selectPrimaryHand(hands: TrackedHand[]): TrackedHand {
  if (hands.length === 1) {
    return hands[0];
  }

  // Prefer the hand showing the strongest pinch.
  // This keeps Button Fastening focused on the active hand.
  return [...hands].sort((a, b) => a.pinchRatio - b.pinchRatio)[0];
}

function calculateClosureRatio(
  landmarks: NormalizedLandmark[]
): number {
  const wrist = landmarks[0];
  const middleMCP = landmarks[9];

  if (!wrist || !middleMCP) return 0;

  const handSize = distance(wrist, middleMCP);
  if (handSize <= 0) return 0;

  const fingers = [
    { tip: landmarks[8], mcp: landmarks[5] },
    { tip: landmarks[12], mcp: landmarks[9] },
    { tip: landmarks[16], mcp: landmarks[13] },
    { tip: landmarks[20], mcp: landmarks[17] },
  ];

  const closures = fingers.map(({ tip, mcp }) => {
    if (!tip || !mcp) return 0;

    const tipToMCP = distance(tip, mcp);

    return clamp(1 - tipToMCP / handSize, 0, 1);
  });

  const average =
    closures.reduce((total, value) => total + value, 0) /
    closures.length;

  return Number(average.toFixed(3));
}

function calculatePinchRatio(
  landmarks: NormalizedLandmark[]
): number {
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const wrist = landmarks[0];
  const middleMCP = landmarks[9];

  if (!thumbTip || !indexTip || !wrist || !middleMCP) {
    return 1;
  }

  const handSize = distance(wrist, middleMCP);
  if (handSize <= 0) return 1;

  const pinchDistance = distance(thumbTip, indexTip);

  return Number((pinchDistance / handSize).toFixed(3));
}

function distance(
  a: NormalizedLandmark,
  b: NormalizedLandmark
): number {
  return Math.sqrt(
    (a.x - b.x) ** 2 +
      (a.y - b.y) ** 2 +
      ((a.z ?? 0) - (b.z ?? 0)) ** 2
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}