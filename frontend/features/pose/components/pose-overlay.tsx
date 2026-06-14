"use client";

import { useEffect, useRef } from "react";
import { NormalizedLandmark } from "@mediapipe/tasks-vision";

type PoseOverlayProps = {
  landmarks: NormalizedLandmark[];
};

const connections = [
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
  [11, 12],
  [11, 23],
  [12, 24],
  [23, 24],
];

export function PoseOverlay({ landmarks }: PoseOverlayProps) {
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

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#06FA0A";
    ctx.fillStyle = "#D9D9D9";

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
      ctx.arc(point.x * canvas.width, point.y * canvas.height, 7, 0, Math.PI * 2);
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