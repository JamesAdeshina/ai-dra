"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Timer } from "lucide-react";
import { CameraPlaceholder } from "./camera-placeholder";
import { LiveFeedbackCard } from "./live-feedback-card";
import { RangeOfMotionCard } from "./range-of-motion-card";
import { RepProgressCard } from "./rep-progress-card";
import { SessionControls } from "./session-controls";
import { SessionCompleteModal } from "./session-complete-modal";
import { ExerciseDemoModal } from "./exercise-demo-modal";
import { EndSessionModal } from "./end-session-modal";
import { exerciseRules } from "@/features/pose/utils/exercise-rules";
import {
  RepState,
  updateHandClosureRepCounter,
  updatePoseRepCounter,
} from "@/features/pose/utils/rep-counter";
import {
  LiftPlaceState,
  updateLiftPlaceCounter,
} from "@/features/pose/utils/lift-place-counter";
import {
  HandFunctionState,
  updateHandFunctionCounter,
} from "@/features/pose/utils/hand-function-counter";
import {
  ButtonFasteningState,
  updateButtonFasteningCounter,
} from "@/features/pose/utils/button-fastening-counter";

type SessionViewProps = {
  exercise: {
    slug: string;
    title: string;
    instruction: string;
    demoVideo?: string;
    images: {
      thumbnail: string;
      states: {
        start: string;
        active: string;
      };
    };
  };
};

export function SessionView({ exercise }: SessionViewProps) {
  const rule = useMemo(
    () => exerciseRules[exercise.slug] ?? exerciseRules["target-touch"],
    [exercise.slug]
  );

  const initialRepState: RepState =
    rule.primaryMetric === "hand-closure" ? "OPEN" : "RESTING";

  const [angle, setAngle] = useState(0);
  const [repCount, setRepCount] = useState(0);
  const [feedback, setFeedback] = useState(rule.feedback.start);
  const [holdProgress, setHoldProgress] = useState(0);

  const [isPaused, setIsPaused] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showEndConfirmModal, setShowEndConfirmModal] = useState(false);

  const repStateRef = useRef<RepState>(initialRepState);
  const liftPlaceStateRef = useRef<LiftPlaceState>("RESTING");
  const handFunctionStateRef = useRef<HandFunctionState>("OPEN");
  const buttonFasteningStateRef =
    useRef<ButtonFasteningState>("RESTING");

  const liftPlaceStartXRef = useRef<number | null>(null);
  const holdStartTimeRef = useRef<number | null>(null);
  const buttonHoldStartTimeRef = useRef<number | null>(null);
  const repCountRef = useRef(0);

  const latestMetricsRef = useRef({
    wristHeight: 0,
    wristX: 0,
    closureRatio: 0,
    pinchRatio: 1,
  });

  const completeSessionIfNeeded = useCallback(
    (reps: number) => {
      if (reps >= rule.targetReps) {
        setShowEndModal(true);
        setIsPaused(true);
      }
    },
    [rule.targetReps]
  );

  const updateRepCount = useCallback((reps: number) => {
    repCountRef.current = reps;
    setRepCount((previous) => (previous === reps ? previous : reps));
  }, []);

  const updateLiftPlaceRepCounter = useCallback(() => {
    if (isPaused || rule.primaryMetric !== "wrist-height") return;

    const result = updateLiftPlaceCounter({
      wristHeight: latestMetricsRef.current.wristHeight,
      wristX: latestMetricsRef.current.wristX,
      gripValue: latestMetricsRef.current.closureRatio,
      currentState: liftPlaceStateRef.current,
      repCount: repCountRef.current,
      startX: liftPlaceStartXRef.current,
    });

    liftPlaceStateRef.current = result.state;
    liftPlaceStartXRef.current = result.startX;

    updateRepCount(result.reps);
    setFeedback((previous) =>
      previous === result.feedback ? previous : result.feedback
    );

    completeSessionIfNeeded(result.reps);
  }, [completeSessionIfNeeded, isPaused, rule.primaryMetric, updateRepCount]);

  const handlePauseToggle = () => {
    setIsPaused((current) => !current);
  };

  const handleAngleChange = useCallback((newAngle: number) => {
    setAngle((previous) => (previous === newAngle ? previous : newAngle));
  }, []);

  const handleReachChange = useCallback(
    (newReachValue: number) => {
      if (isPaused || rule.primaryMetric !== "wrist-reach") return;
      if (newReachValue <= 0) return;

      const result = updatePoseRepCounter({
        value: newReachValue,
        currentState: repStateRef.current,
        repCount: repCountRef.current,
        rule,
      });

      repStateRef.current = result.state;

      updateRepCount(result.reps);
      setFeedback((previous) =>
        previous === result.feedback ? previous : result.feedback
      );

      completeSessionIfNeeded(result.reps);
    },
    [completeSessionIfNeeded, isPaused, rule, updateRepCount]
  );

  const handleWristHeightChange = useCallback(
    (newWristHeight: number) => {
      if (isPaused) return;

      latestMetricsRef.current.wristHeight = newWristHeight;
      updateLiftPlaceRepCounter();
    },
    [isPaused, updateLiftPlaceRepCounter]
  );

  const handleWristXChange = useCallback(
    (newWristX: number) => {
      if (isPaused) return;

      latestMetricsRef.current.wristX = newWristX;
      updateLiftPlaceRepCounter();
    },
    [isPaused, updateLiftPlaceRepCounter]
  );

  const handlePinchChange = useCallback(
    (newPinchRatio: number) => {
      if (isPaused) return;

      latestMetricsRef.current.pinchRatio = newPinchRatio;

      if (rule.primaryMetric !== "pinch-zone") return;

      const result = updateButtonFasteningCounter({
        pinchRatio: newPinchRatio,
        currentState: buttonFasteningStateRef.current,
        repCount: repCountRef.current,
        holdStartTime: buttonHoldStartTimeRef.current,
      });

      buttonFasteningStateRef.current = result.state;
      buttonHoldStartTimeRef.current = result.holdStartTime;

      updateRepCount(result.reps);

      setFeedback((previous) =>
        previous === result.feedback ? previous : result.feedback
      );

      setHoldProgress((previous) =>
        previous === result.holdProgress ? previous : result.holdProgress
      );

      completeSessionIfNeeded(result.reps);
    },
    [completeSessionIfNeeded, isPaused, rule.primaryMetric, updateRepCount]
  );

  const handleClosureChange = useCallback(
    (newClosureRatio: number) => {
      if (isPaused) return;

      latestMetricsRef.current.closureRatio = newClosureRatio;

      if (rule.primaryMetric === "wrist-height") {
        updateLiftPlaceRepCounter();
        return;
      }

      if (rule.primaryMetric === "hand-open-close") {
        const result = updateHandFunctionCounter({
          closureRatio: newClosureRatio,
          currentState: handFunctionStateRef.current,
          repCount: repCountRef.current,
        });

        handFunctionStateRef.current = result.state;

        updateRepCount(result.reps);
        setFeedback((previous) =>
          previous === result.feedback ? previous : result.feedback
        );

        completeSessionIfNeeded(result.reps);
        return;
      }

      if (rule.primaryMetric !== "hand-closure") return;
      if (newClosureRatio <= 0) return;

      const result = updateHandClosureRepCounter({
        value: newClosureRatio,
        currentState: repStateRef.current,
        repCount: repCountRef.current,
        rule,
        holdStartTime: holdStartTimeRef.current,
      });

      repStateRef.current = result.state;
      holdStartTimeRef.current = result.holdStartTime ?? null;

      updateRepCount(result.reps);
      setFeedback((previous) =>
        previous === result.feedback ? previous : result.feedback
      );

      setHoldProgress((previous) =>
        previous === (result.holdProgress ?? 0)
          ? previous
          : result.holdProgress ?? 0
      );

      completeSessionIfNeeded(result.reps);
    },
    [
      completeSessionIfNeeded,
      isPaused,
      rule,
      updateLiftPlaceRepCounter,
      updateRepCount,
    ]
  );

  const exitFullscreenIfNeeded = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  const handleWatchDemo = async () => {
    await exitFullscreenIfNeeded();
    setShowDemoModal(true);
  };

  const handleEndSession = async () => {
    await exitFullscreenIfNeeded();
    setShowEndConfirmModal(true);
  };

  const handleConfirmEndSession = async () => {
    await exitFullscreenIfNeeded();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
    setIsPaused(true);
    setShowEndConfirmModal(false);
    setShowEndModal(true);
  };

  const handleVoiceInstruction = () => {
    if (!("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      feedback || exercise.instruction
    );

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isPaused || showEndModal || showEndConfirmModal || showDemoModal) return;

    const timer = setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, showEndModal, showEndConfirmModal, showDemoModal]);

  useEffect(() => {
    repStateRef.current = initialRepState;
    liftPlaceStateRef.current = "RESTING";
    handFunctionStateRef.current = "OPEN";
    buttonFasteningStateRef.current = "RESTING";
    liftPlaceStartXRef.current = null;
    holdStartTimeRef.current = null;
    buttonHoldStartTimeRef.current = null;
    repCountRef.current = 0;

    latestMetricsRef.current = {
      wristHeight: 0,
      wristX: 0,
      closureRatio: 0,
      pinchRatio: 1,
    };

    setRepCount(0);
    setFeedback(rule.feedback.start);
    setAngle(0);
    setHoldProgress(0);
  }, [exercise.slug, initialRepState, rule.feedback.start]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const sessionDuration = formatTime(elapsedSeconds);

  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_446px] gap-[26px]">
        <div className="overflow-hidden rounded-2xl bg-white">
          <div className="flex items-center justify-between px-[30px] py-4">
            <div className="flex items-center gap-[13px]">
              <div className="flex h-[91px] w-[91px] items-center justify-center rounded-xl bg-[#F7F4F2] p-2">
                <Image
                  src={exercise.images.thumbnail}
                  alt={exercise.title}
                  width={180}
                  height={180}
                  quality={100}
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <h1 className="text-[28px] font-semibold text-[#1E1E1E]">
                  {exercise.title}
                </h1>
                <p className="text-[20px] text-[#888888]">
                  {feedback || exercise.instruction}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-[72px] min-w-[148px] items-center justify-center rounded-[24px] bg-[#F5F5F5] px-3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-[#757575]">
                    <Timer
                      className="h-5 w-5 text-[#1E1E1E]"
                      strokeWidth={2.5}
                    />
                    <span className="text-[14px] font-medium">
                      Session Time
                    </span>
                  </div>

                  <p className="mt-1 text-[20px] font-semibold leading-none text-[#010E0E]">
                    {sessionDuration}
                  </p>
                </div>
              </div>

              <div className="rounded-[30px] bg-black/10 p-2 backdrop-blur-md">
                <div
                  className={`rounded-[24px] px-6 py-4 text-[18px] font-semibold text-white ${
                    isPaused ? "bg-[#F59E0B]" : "bg-[#40C057]"
                  }`}
                >
                  {isPaused ? "Paused" : "Ready"}
                </div>
              </div>
            </div>
          </div>

          {holdProgress > 0 && holdProgress < 1 && (
            <div className="px-[30px] pb-4">
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                <div
                  className="h-full rounded-full bg-[#592EBD] transition-all duration-100"
                  style={{ width: `${Math.round(holdProgress * 100)}%` }}
                />
              </div>
            </div>
          )}

          <CameraPlaceholder
            isPaused={isPaused}
            onAngleChange={handleAngleChange}
            onReachChange={handleReachChange}
            onWristHeightChange={handleWristHeightChange}
            onWristXChange={handleWristXChange}
            onClosureChange={handleClosureChange}
            onPinchChange={handlePinchChange}
            fullScreenControls={
              <SessionControls
                isPaused={isPaused}
                isSpeaking={isSpeaking}
                onPauseToggle={handlePauseToggle}
                onWatchDemo={handleWatchDemo}
                onVoiceInstruction={handleVoiceInstruction}
                onEndSession={handleEndSession}
              />
            }
          />

          <div className="px-[30px] py-6">
            <SessionControls
              isPaused={isPaused}
              isSpeaking={isSpeaking}
              onPauseToggle={handlePauseToggle}
              onWatchDemo={handleWatchDemo}
              onVoiceInstruction={handleVoiceInstruction}
              onEndSession={handleEndSession}
            />
          </div>
        </div>

        <div className="space-y-[26px]">
          <LiveFeedbackCard />

          <RepProgressCard
            currentRep={repCount}
            totalReps={rule.targetReps}
          />

          <RangeOfMotionCard angle={angle} />
        </div>
      </div>

      {showEndConfirmModal && (
        <EndSessionModal
          onCancel={() => setShowEndConfirmModal(false)}
          onConfirm={handleConfirmEndSession}
        />
      )}

      {showEndModal && (
        <SessionCompleteModal
          exerciseTitle={exercise.title}
          repsCompleted={repCount}
          totalReps={rule.targetReps}
          averageScore={0}
          duration={sessionDuration}
          onClose={() => setShowEndModal(false)}
        />
      )}

      {showDemoModal && (
        <ExerciseDemoModal
          exercise={exercise}
          onClose={() => setShowDemoModal(false)}
        />
      )}
    </>
  );
}