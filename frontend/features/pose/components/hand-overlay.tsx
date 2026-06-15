"use client";

import { useEffect, useRef } from "react";
import { NormalizedLandmark } from "@mediapipe/tasks-vision";

type HandOverlayProps = {
  landmarks: NormalizedLandmark[];
};

const connections = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [0, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [0, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],
];

export function HandOverlay({ landmarks }: HandOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!landmarks.length) return;

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#7C3AED";
    ctx.fillStyle = "#FFFFFF";

    connections.forEach(([start, end]) => {
      const a = landmarks[start];
      const b = landmarks[end];

      if (!a || !b) return;

      ctx.beginPath();
      ctx.moveTo(a.x * canvas.width, a.y * canvas.height);
      ctx.lineTo(b.x * canvas.width, b.y * canvas.height);
      ctx.stroke();
    });

    landmarks.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x * canvas.width, point.y * canvas.height, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [landmarks]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}