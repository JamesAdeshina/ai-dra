"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Video } from "lucide-react";
import { HandOverlay } from "@/features/pose/components/hand-overlay";
import { PoseOverlay } from "@/features/pose/components/pose-overlay";
import { useHandTracker } from "@/features/pose/hooks/use-hand-tracker";
import { usePoseTracker } from "@/features/pose/hooks/use-pose-tracker";

type CameraPlaceholderProps = {
  isPaused?: boolean;
  onAngleChange?: (angle: number) => void;
  onReachChange?: (reachValue: number) => void;
  onWristHeightChange?: (wristHeight: number) => void;
  onWristXChange?: (wristX: number) => void;
  onClosureChange?: (closureRatio: number) => void;
  onPinchChange?: (pinchRatio: number) => void;
  fullScreenControls?: ReactNode;
};

export function CameraPlaceholder({
  isPaused = false,
  onAngleChange,
  onReachChange,
  onWristHeightChange,
  onWristXChange,
  onClosureChange,
  onPinchChange,
  fullScreenControls,
}: CameraPlaceholderProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const callbacksRef = useRef({
    onAngleChange,
    onReachChange,
    onWristHeightChange,
    onWristXChange,
    onClosureChange,
    onPinchChange,
  });

  useEffect(() => {
    callbacksRef.current = {
      onAngleChange,
      onReachChange,
      onWristHeightChange,
      onWristXChange,
      onClosureChange,
      onPinchChange,
    };
  }, [
    onAngleChange,
    onReachChange,
    onWristHeightChange,
    onWristXChange,
    onClosureChange,
    onPinchChange,
  ]);

  const pose = usePoseTracker(videoRef);
  const hand = useHandTracker(videoRef);

  const isTracking = pose.isTracking || hand.isTracking;

  useEffect(() => {
    if (isPaused) return;

    callbacksRef.current.onAngleChange?.(pose.isTracking ? pose.angle : 0);

    callbacksRef.current.onReachChange?.(
      pose.isTracking ? pose.reachValue : 0
    );

    callbacksRef.current.onWristHeightChange?.(
      pose.isTracking ? pose.wristHeight : 0
    );

    callbacksRef.current.onWristXChange?.(pose.isTracking ? pose.wristX : 0);

    callbacksRef.current.onClosureChange?.(
      hand.isTracking ? hand.closureRatio : 0
    );

    callbacksRef.current.onPinchChange?.(
      hand.isTracking ? hand.pinchRatio : 1
    );
  }, [
    pose.angle,
    pose.reachValue,
    pose.wristHeight,
    pose.wristX,
    pose.isTracking,
    hand.closureRatio,
    hand.pinchRatio,
    hand.isTracking,
    isPaused,
  ]);

  useEffect(() => {
    let retryTimer: NodeJS.Timeout | null = null;

    const stopCamera = () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setHasCamera(false);
    };

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamera(true);
          setCameraError("");
        }

        const videoTrack = stream.getVideoTracks()[0];

        if (videoTrack) {
          videoTrack.onended = () => {
            setHasCamera(false);
            setCameraError("Camera stopped. Reconnecting...");
          };

          videoTrack.onmute = () => {
            setHasCamera(false);
            setCameraError("Camera paused. Waiting for camera...");
          };

          videoTrack.onunmute = () => {
            setHasCamera(true);
            setCameraError("");
          };
        }
      } catch (error) {
        console.error(error);
        setHasCamera(false);
        setCameraError(
          "Camera access is blocked. Please allow camera permission to start the session."
        );
      }
    };

    startCamera();

    retryTimer = setInterval(() => {
      const stream = streamRef.current;
      const track = stream?.getVideoTracks()[0];

      if (!track || track.readyState === "ended") {
        startCamera();
      }
    }, 3000);

    return () => {
      if (retryTimer) clearInterval(retryTimer);
      stopCamera();
    };
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const handleFullScreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const statusLabel = !hasCamera
    ? "Camera Off"
    : isPaused
      ? "Paused"
      : isTracking
        ? "Live"
        : "No Body / Hand Detected";

  const statusColor =
    hasCamera && !isPaused && isTracking ? "bg-[#54D060]" : "bg-[#FF4D4F]";

  const displayAngle = isPaused ? pose.angle : pose.isTracking ? pose.angle : 0;
  const displayReach = pose.isTracking ? pose.reachValue : 0;
  const displayWristHeight = pose.isTracking ? pose.wristHeight : 0;
  const displayWristX = pose.isTracking ? pose.wristX : 0;
  const displayClosure = hand.isTracking ? hand.closureRatio : 0;
  const displayPinch = hand.isTracking ? hand.pinchRatio : 1;

  return (
    <div
      ref={containerRef}
      className="relative h-[689px] overflow-hidden bg-[#1E1E1E]"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="h-full w-full object-cover"
      />

      {pose.landmarks.length > 0 && <PoseOverlay landmarks={pose.landmarks} />}
      {hand.landmarks.length > 0 && <HandOverlay landmarks={hand.landmarks} />}

      {isPaused && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 backdrop-blur-[2px]">
          <div className="rounded-3xl bg-white px-8 py-6 text-center shadow-lg">
            <p className="text-[24px] font-semibold text-[#1E1E1E]">
              Session Paused
            </p>
            <p className="mt-2 text-[16px] text-[#757575]">
              Tap Resume to continue
            </p>
          </div>
        </div>
      )}

      {!hasCamera && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1E1E1E]/80 px-6 text-center">
          <p className="max-w-[420px] text-[18px] font-medium leading-[150%] text-white">
            {cameraError || "Waiting for camera..."}
          </p>
        </div>
      )}

      <div className="absolute left-5 top-4 z-30 flex items-center gap-2 rounded-full bg-black/40 px-4 py-3">
        <span className={`h-[18px] w-[18px] rounded-full ${statusColor}`} />
        <span className="text-[16px] font-semibold text-white">
          {statusLabel}
        </span>
      </div>

      <div className="absolute right-5 top-4 z-30 rounded-full bg-black/40 px-4 py-3 text-white">
        <span className="text-[16px] font-semibold">
          Angle: {displayAngle}° | Reach: {Number(displayReach).toFixed(3)} |
          Height: {Number(displayWristHeight).toFixed(3)} | X:{" "}
          {Number(displayWristX).toFixed(3)} | Grip:{" "}
          {Number(displayClosure).toFixed(3)} | Pinch:{" "}
          {Number(displayPinch).toFixed(3)}
        </span>
      </div>

      <div className="absolute bottom-4 left-4 z-30 flex items-start gap-2 rounded-[24px] bg-black/40 px-4 py-3">
        <Video size={18} className="text-white" />
        <div>
          <p className="text-[16px] font-semibold text-white">Camera</p>
          <p className="text-[13px] font-medium text-[#7875FB]">Front View</p>
        </div>
      </div>

      {isFullScreen && fullScreenControls && (
        <div className="absolute bottom-6 left-1/2 z-30 w-[960px] -translate-x-1/2 rounded-full bg-white/95 p-2 shadow-lg backdrop-blur-md">
          {fullScreenControls}
        </div>
      )}

      <button
        type="button"
        onClick={handleFullScreen}
        className="absolute bottom-6 right-6 z-40 flex items-center gap-2 rounded-[24px] bg-black/40 px-4 py-3 text-white"
      >
        <span className="text-[16px] font-semibold">
          {isFullScreen ? "Exit Full Screen" : "Full Screen"}
        </span>

        {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
      </button>
    </div>
  );
}