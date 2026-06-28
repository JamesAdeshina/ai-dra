"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import type { TrackedHand } from "@/features/pose/hooks/use-hand-tracker";

import {
  MovementSpeedTracker,
  type MovementSpeedMetrics,
} from "@/features/pose/utils/movement-speed-tracker";

import {
  HandSideTracker,
  type StableHandSide,
} from "@/features/pose/utils/hand-side-tracker";

import {
  createExerciseSession,
  saveExerciseAttempt,
  updateExerciseSession,
  type ExerciseSide,
  type HandSide,
  type SaveExerciseAttemptInput,
} from "@/features/sessions/services/session-service";

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

type LatestMetrics = {
  angle: number;
  reachValue: number;
  wristHeight: number;
  wristX: number;
  closureRatio: number;
  pinchRatio: number;
};

type HandTrackerSummary = ReturnType<
  HandSideTracker["getSummary"]
>;

type HandTrackingSnapshot = {
  activeSummary: HandTrackerSummary;
  supportSummary: HandTrackerSummary;
  bilateralFrames: number;
  totalHandFrames: number;
};

type CompletedAttemptSnapshot = {
  attemptNumber: number;
  completedRepNumber: number;
  startedAtMs: number;
  completedAtMs: number;
  durationMs: number;
  speedMetrics: MovementSpeedMetrics;
  handTracking: HandTrackingSnapshot;
};

export function SessionView({ exercise }: SessionViewProps) {
  const rule = useMemo(
    () =>
      exerciseRules[exercise.slug] ??
      exerciseRules["target-touch"],
    [exercise.slug]
  );

  const initialRepState: RepState =
    rule.primaryMetric === "hand-closure"
      ? "OPEN"
      : "RESTING";

  const [angle, setAngle] = useState(0);
  const [repCount, setRepCount] = useState(0);
  const [feedback, setFeedback] = useState(
    rule.feedback.start
  );
  const [holdProgress, setHoldProgress] = useState(0);

  const [isPaused, setIsPaused] = useState(false);
  const [showEndModal, setShowEndModal] =
    useState(false);
  const [showDemoModal, setShowDemoModal] =
    useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);
  const [
    showEndConfirmModal,
    setShowEndConfirmModal,
  ] = useState(false);

  const repStateRef =
    useRef<RepState>(initialRepState);

  const liftPlaceStateRef =
    useRef<LiftPlaceState>("RESTING");

  const handFunctionStateRef =
    useRef<HandFunctionState>("OPEN");

  const buttonFasteningStateRef =
    useRef<ButtonFasteningState>("RESTING");

  const liftPlaceStartXRef =
    useRef<number | null>(null);

  const holdStartTimeRef =
    useRef<number | null>(null);

  const buttonHoldStartTimeRef =
    useRef<number | null>(null);

  const repCountRef = useRef(0);
  const attemptNumberRef = useRef(0);
  const attemptStartedAtRef = useRef(Date.now());

  const latestHandsRef = useRef<TrackedHand[]>([]);

  const sessionIdRef =
    useRef<string | null>(null);

  const sessionCreationExerciseRef =
    useRef<string | null>(null);

  const sessionFinalizedRef = useRef(false);
  const sessionUpdateInProgressRef = useRef(false);

  const saveQueueRef = useRef<Promise<void>>(
    Promise.resolve()
  );

  const elapsedSecondsRef = useRef(0);

  const speedTrackerRef =
    useRef<MovementSpeedTracker | null>(null);

  if (!speedTrackerRef.current) {
    speedTrackerRef.current =
      new MovementSpeedTracker({
        minimumMovementDelta: 0.002,
        maximumSampleGapMs: 500,
      });
  }

  const attemptActiveHandTrackerRef =
    useRef<HandSideTracker | null>(null);

  const attemptSupportHandTrackerRef =
    useRef<HandSideTracker | null>(null);

  const sessionActiveHandTrackerRef =
    useRef<HandSideTracker | null>(null);

  const sessionSupportHandTrackerRef =
    useRef<HandSideTracker | null>(null);

  if (!attemptActiveHandTrackerRef.current) {
    attemptActiveHandTrackerRef.current =
      new HandSideTracker();
  }

  if (!attemptSupportHandTrackerRef.current) {
    attemptSupportHandTrackerRef.current =
      new HandSideTracker();
  }

  if (!sessionActiveHandTrackerRef.current) {
    sessionActiveHandTrackerRef.current =
      new HandSideTracker({
        minimumDetections: 5,
        dominanceRatio: 0.6,
      });
  }

  if (!sessionSupportHandTrackerRef.current) {
    sessionSupportHandTrackerRef.current =
      new HandSideTracker({
        minimumDetections: 5,
        dominanceRatio: 0.6,
      });
  }

  const attemptBilateralFramesRef = useRef(0);
  const attemptTotalHandFramesRef = useRef(0);
  const sessionBilateralFramesRef = useRef(0);
  const sessionTotalHandFramesRef = useRef(0);

  const completedSpeedMetricsRef = useRef<
    MovementSpeedMetrics[]
  >([]);

  const latestMetricsRef = useRef<LatestMetrics>({
    angle: 0,
    reachValue: 0,
    wristHeight: 0,
    wristX: 0,
    closureRatio: 0,
    pinchRatio: 1,
  });

  useEffect(() => {
    elapsedSecondsRef.current = elapsedSeconds;
  }, [elapsedSeconds]);

  const addSpeedSample = useCallback(
    (value: number) => {
      if (
        isPaused ||
        sessionFinalizedRef.current ||
        !Number.isFinite(value)
      ) {
        return;
      }

      speedTrackerRef.current?.addSample(
        value,
        performance.now()
      );
    },
    [isPaused]
  );

  const getSessionSpeedSummary =
    useCallback(() => {
      const metrics =
        completedSpeedMetricsRef.current;

      if (metrics.length === 0) {
        return {
          completedSpeedSamples: 0,
          averageRepDurationMs: null,
          fastestRepDurationMs: null,
          slowestRepDurationMs: null,
          averageActiveMovementDurationMs: null,
          averageVelocity: null,
          peakVelocity: null,
          totalMovementDistance: null,
        };
      }

      const validAverageVelocities = metrics
        .map((item) => item.averageVelocity)
        .filter(
          (value): value is number =>
            value !== null
        );

      const validPeakVelocities = metrics
        .map((item) => item.peakVelocity)
        .filter(
          (value): value is number =>
            value !== null
        );

      const totalDurations = metrics.map(
        (item) => item.totalDurationMs
      );

      const activeDurations = metrics.map(
        (item) => item.activeMovementDurationMs
      );

      const totalDistance = metrics.reduce(
        (sum, item) =>
          sum + item.totalDistance,
        0
      );

      return {
        completedSpeedSamples: metrics.length,

        averageRepDurationMs: roundMetric(
          average(totalDurations)
        ),

        fastestRepDurationMs: Math.min(
          ...totalDurations
        ),

        slowestRepDurationMs: Math.max(
          ...totalDurations
        ),

        averageActiveMovementDurationMs:
          roundMetric(
            average(activeDurations)
          ),

        averageVelocity:
          validAverageVelocities.length > 0
            ? roundMetric(
                average(validAverageVelocities)
              )
            : null,

        peakVelocity:
          validPeakVelocities.length > 0
            ? roundMetric(
                Math.max(
                  ...validPeakVelocities
                )
              )
            : null,

        totalMovementDistance:
          roundMetric(totalDistance),
      };
    }, []);

  const getDetectedHandDetails =
    useCallback(() => {
      const activeSummary =
        sessionActiveHandTrackerRef.current?.getSummary() ??
        createEmptyHandSummary();

      const supportSummary =
        sessionSupportHandTrackerRef.current?.getSummary() ??
        createEmptyHandSummary();

      return resolveHandDetails({
        activeSummary,
        supportSummary,
        bilateralFrames:
          sessionBilateralFramesRef.current,
        totalHandFrames:
          sessionTotalHandFramesRef.current,
      });
    }, []);

  const waitForSessionId =
    useCallback(async () => {
      const timeoutAt = Date.now() + 8000;

      while (
        !sessionIdRef.current &&
        Date.now() < timeoutAt
      ) {
        await new Promise((resolve) =>
          window.setTimeout(resolve, 100)
        );
      }

      return sessionIdRef.current;
    }, []);

  const completeDatabaseSession =
    useCallback(
      async (completedReps: number) => {
        if (sessionFinalizedRef.current) {
          return;
        }

        const sessionId =
          await waitForSessionId();

        if (!sessionId) {
          console.error(
            "Cannot complete session because no session ID exists."
          );
          return;
        }

        sessionFinalizedRef.current = true;

        const handDetails =
          getDetectedHandDetails();

        const speedSummary =
          getSessionSpeedSummary();

        try {
          await updateExerciseSession({
            sessionId,
            action: "COMPLETE",
            completedReps,
            durationSeconds:
              elapsedSecondsRef.current,
            performedSide:
              handDetails.performedSide,

            sessionSummary: {
              exerciseSlug: exercise.slug,
              completedReps,
              targetReps: rule.targetReps,

              durationSeconds:
                elapsedSecondsRef.current,

              trackerType: rule.tracker,
              primaryMetric:
                rule.primaryMetric,

              lastAngle:
                latestMetricsRef.current.angle,

              lastReachValue:
                latestMetricsRef.current
                  .reachValue,

              lastWristHeight:
                latestMetricsRef.current
                  .wristHeight,

              lastClosureRatio:
                latestMetricsRef.current
                  .closureRatio,

              lastPinchRatio:
                latestMetricsRef.current
                  .pinchRatio,

              completedSpeedSamples:
                speedSummary.completedSpeedSamples,

              averageRepDurationMs:
                speedSummary.averageRepDurationMs,

              fastestRepDurationMs:
                speedSummary.fastestRepDurationMs,

              slowestRepDurationMs:
                speedSummary.slowestRepDurationMs,

              averageActiveMovementDurationMs:
                speedSummary.averageActiveMovementDurationMs,

              averageVelocity:
                speedSummary.averageVelocity,

              peakVelocity:
                speedSummary.peakVelocity,

              totalMovementDistance:
                speedSummary.totalMovementDistance,
            },
          });
        } catch (error) {
          sessionFinalizedRef.current = false;

          console.error(
            "Failed to complete database session:",
            error
          );
        }
      },
      [
        exercise.slug,
        getDetectedHandDetails,
        getSessionSpeedSummary,
        rule.primaryMetric,
        rule.targetReps,
        rule.tracker,
        waitForSessionId,
      ]
    );

  const persistCompletedAttempt =
    useCallback(
      async (
        snapshot: CompletedAttemptSnapshot
      ) => {
        const sessionId =
          await waitForSessionId();

        if (!sessionId) {
          console.error(
            "Cannot save attempt because no session ID exists."
          );
          return;
        }

        const handDetails =
          resolveHandDetails(
            snapshot.handTracking
          );

        const hands =
          latestHandsRef.current;

        const metrics =
          latestMetricsRef.current;

        const request: SaveExerciseAttemptInput = {
          sessionId,

          attemptNumber:
            snapshot.attemptNumber,

          completedRepNumber:
            snapshot.completedRepNumber,

          result: "COMPLETED",

          durationMs:
            snapshot.durationMs,

          startedAt: new Date(
            snapshot.startedAtMs
          ).toISOString(),

          completedAt: new Date(
            snapshot.completedAtMs
          ).toISOString(),

          stateReached: "REP_COMPLETED",
          failureReason: null,

          activeHand:
            handDetails.activeHand,

          supportHand:
            handDetails.supportHand,

          isBilateral:
            handDetails.isBilateral,

          movementMetrics: {
            angle: metrics.angle,
            reachValue:
              metrics.reachValue,
            wristHeight:
              metrics.wristHeight,
            wristX: metrics.wristX,
            closureRatio:
              metrics.closureRatio,
            pinchRatio:
              metrics.pinchRatio,
          },

          speedMetrics: {
            totalDurationMs:
              snapshot.speedMetrics
                .totalDurationMs,

            attemptDurationMs:
              snapshot.durationMs,

            activeMovementDurationMs:
              snapshot.speedMetrics
                .activeMovementDurationMs,

            totalDistance:
              snapshot.speedMetrics
                .totalDistance,

            averageVelocity:
              snapshot.speedMetrics
                .averageVelocity,

            peakVelocity:
              snapshot.speedMetrics
                .peakVelocity,

            sampleCount:
              snapshot.speedMetrics
                .sampleCount,

            unit:
              "normalised-units-per-second",

            speedClassification: null,
          },

          trackingContext: {
            exerciseSlug:
              exercise.slug,

            trackerType:
              rule.tracker,

            primaryMetric:
              rule.primaryMetric,

            handsDetected:
              hands.length,

            isBilateral:
              handDetails.isBilateral,

            dominantActiveHand:
              snapshot.handTracking
                .activeSummary.dominantSide,

            activeHandLeftDetections:
              snapshot.handTracking
                .activeSummary.leftDetections,

            activeHandRightDetections:
              snapshot.handTracking
                .activeSummary.rightDetections,

            activeHandUnknownDetections:
              snapshot.handTracking
                .activeSummary.unknownDetections,

            activeHandLeftRatio:
              snapshot.handTracking
                .activeSummary.leftRatio,

            activeHandRightRatio:
              snapshot.handTracking
                .activeSummary.rightRatio,

            dominantSupportHand:
              snapshot.handTracking
                .supportSummary.dominantSide,

            supportHandLeftDetections:
              snapshot.handTracking
                .supportSummary.leftDetections,

            supportHandRightDetections:
              snapshot.handTracking
                .supportSummary.rightDetections,

            supportHandUnknownDetections:
              snapshot.handTracking
                .supportSummary.unknownDetections,

            bilateralFrames:
              snapshot.handTracking
                .bilateralFrames,

            totalHandFrames:
              snapshot.handTracking
                .totalHandFrames,
          },

          accuracyScore: null,
          movementScore: null,
        };

        try {
          await saveExerciseAttempt(request);

          completedSpeedMetricsRef.current.push(
            snapshot.speedMetrics
          );
        } catch (error) {
          console.error(
            "Failed to save completed attempt:",
            error
          );

          throw error;
        }
      },
      [
        exercise.slug,
        getDetectedHandDetails,
        rule.primaryMetric,
        rule.tracker,
        waitForSessionId,
      ]
    );

  const updateRepCount = useCallback(
    (reps: number) => {
      const previousReps =
        repCountRef.current;

      if (reps === previousReps) {
        return;
      }

      repCountRef.current = reps;
      setRepCount(reps);

      if (reps <= previousReps) {
        return;
      }

      const completedAtMs = Date.now();
      const startedAtMs =
        attemptStartedAtRef.current;

      const durationMs = Math.max(
        0,
        completedAtMs - startedAtMs
      );

      attemptNumberRef.current += 1;

      const speedMetrics =
        speedTrackerRef.current?.getMetrics() ??
        createEmptySpeedMetrics();

      const handTracking: HandTrackingSnapshot = {
        activeSummary:
          attemptActiveHandTrackerRef.current?.getSummary() ??
          createEmptyHandSummary(),

        supportSummary:
          attemptSupportHandTrackerRef.current?.getSummary() ??
          createEmptyHandSummary(),

        bilateralFrames:
          attemptBilateralFramesRef.current,

        totalHandFrames:
          attemptTotalHandFramesRef.current,
      };

      const snapshot: CompletedAttemptSnapshot = {
        attemptNumber:
          attemptNumberRef.current,

        completedRepNumber: reps,

        startedAtMs,
        completedAtMs,
        durationMs,
        speedMetrics,
        handTracking,
      };

      speedTrackerRef.current?.reset();
      attemptActiveHandTrackerRef.current?.reset();
      attemptSupportHandTrackerRef.current?.reset();
      attemptBilateralFramesRef.current = 0;
      attemptTotalHandFramesRef.current = 0;

      attemptStartedAtRef.current =
        completedAtMs;

      saveQueueRef.current =
        saveQueueRef.current
          .then(async () => {
            await persistCompletedAttempt(
              snapshot
            );

            if (
              reps >= rule.targetReps
            ) {
              await completeDatabaseSession(
                reps
              );

              setIsPaused(true);
              setShowEndModal(true);
            }
          })
          .catch((error) => {
            console.error(
              "Attempt persistence queue failed:",
              error
            );
          });
    },
    [
      completeDatabaseSession,
      persistCompletedAttempt,
      rule.targetReps,
    ]
  );

  const updateLiftPlaceRepCounter =
    useCallback(() => {
      if (
        isPaused ||
        rule.primaryMetric !==
          "wrist-height"
      ) {
        return;
      }

      const result =
        updateLiftPlaceCounter({
          wristHeight:
            latestMetricsRef.current
              .wristHeight,

          wristX:
            latestMetricsRef.current
              .wristX,

          gripValue:
            latestMetricsRef.current
              .closureRatio,

          currentState:
            liftPlaceStateRef.current,

          repCount:
            repCountRef.current,

          startX:
            liftPlaceStartXRef.current,
        });

      liftPlaceStateRef.current =
        result.state;

      liftPlaceStartXRef.current =
        result.startX;

      updateRepCount(result.reps);

      setFeedback((previous) =>
        previous === result.feedback
          ? previous
          : result.feedback
      );
    }, [
      isPaused,
      rule.primaryMetric,
      updateRepCount,
    ]);

  const handlePauseToggle =
    useCallback(async () => {
      if (
        sessionUpdateInProgressRef.current
      ) {
        return;
      }

      const sessionId =
        sessionIdRef.current;

      if (!sessionId) {
        setIsPaused(
          (current) => !current
        );

        speedTrackerRef.current?.reset();
        attemptStartedAtRef.current =
          Date.now();

        return;
      }

      sessionUpdateInProgressRef.current =
        true;

      try {
        if (isPaused) {
          await updateExerciseSession({
            sessionId,
            action: "RESUME",
            completedReps:
              repCountRef.current,
            durationSeconds:
              elapsedSecondsRef.current,
          });

          speedTrackerRef.current?.reset();
          attemptActiveHandTrackerRef.current?.reset();
          attemptSupportHandTrackerRef.current?.reset();
          attemptBilateralFramesRef.current = 0;
          attemptTotalHandFramesRef.current = 0;

          attemptStartedAtRef.current =
            Date.now();

          setIsPaused(false);
        } else {
          const handDetails =
            getDetectedHandDetails();

          await updateExerciseSession({
            sessionId,
            action: "PAUSE",

            completedReps:
              repCountRef.current,

            durationSeconds:
              elapsedSecondsRef.current,

            performedSide:
              handDetails.performedSide,

            sessionSummary: {
              lastAngle:
                latestMetricsRef.current
                  .angle,

              lastReachValue:
                latestMetricsRef.current
                  .reachValue,

              lastWristHeight:
                latestMetricsRef.current
                  .wristHeight,

              lastClosureRatio:
                latestMetricsRef.current
                  .closureRatio,

              lastPinchRatio:
                latestMetricsRef.current
                  .pinchRatio,
            },
          });

          speedTrackerRef.current?.reset();
          attemptActiveHandTrackerRef.current?.reset();
          attemptSupportHandTrackerRef.current?.reset();
          attemptBilateralFramesRef.current = 0;
          attemptTotalHandFramesRef.current = 0;

          setIsPaused(true);
        }
      } catch (error) {
        console.error(
          "Failed to change session pause state:",
          error
        );
      } finally {
        sessionUpdateInProgressRef.current =
          false;
      }
    }, [
      getDetectedHandDetails,
      isPaused,
    ]);

  const handleAngleChange =
    useCallback((newAngle: number) => {
      latestMetricsRef.current.angle =
        newAngle;

      setAngle((previous) =>
        previous === newAngle
          ? previous
          : newAngle
      );
    }, []);

  const handleReachChange =
    useCallback(
      (newReachValue: number) => {
        if (
          isPaused ||
          rule.primaryMetric !==
            "wrist-reach"
        ) {
          return;
        }

        if (newReachValue <= 0) {
          return;
        }

        latestMetricsRef.current.reachValue =
          newReachValue;

        addSpeedSample(newReachValue);

        const result =
          updatePoseRepCounter({
            value: newReachValue,

            currentState:
              repStateRef.current,

            repCount:
              repCountRef.current,

            rule,
          });

        repStateRef.current =
          result.state;

        updateRepCount(result.reps);

        setFeedback((previous) =>
          previous === result.feedback
            ? previous
            : result.feedback
        );
      },
      [
        addSpeedSample,
        isPaused,
        rule,
        updateRepCount,
      ]
    );

  const handleWristHeightChange =
    useCallback(
      (newWristHeight: number) => {
        if (isPaused) {
          return;
        }

        latestMetricsRef.current.wristHeight =
          newWristHeight;

        if (
          rule.primaryMetric ===
          "wrist-height"
        ) {
          addSpeedSample(newWristHeight);
        }

        updateLiftPlaceRepCounter();
      },
      [
        addSpeedSample,
        isPaused,
        rule.primaryMetric,
        updateLiftPlaceRepCounter,
      ]
    );

  const handleWristXChange =
    useCallback(
      (newWristX: number) => {
        if (isPaused) {
          return;
        }

        latestMetricsRef.current.wristX =
          newWristX;

        updateLiftPlaceRepCounter();
      },
      [
        isPaused,
        updateLiftPlaceRepCounter,
      ]
    );

  const handleHandsChange =
    useCallback(
      (hands: TrackedHand[]) => {
        if (isPaused) {
          return;
        }

        latestHandsRef.current = hands;

        if (hands.length === 0) {
          return;
        }

        attemptTotalHandFramesRef.current += 1;
        sessionTotalHandFramesRef.current += 1;

        if (hands.length === 1) {
          const handedness = hands[0].handedness;

          attemptActiveHandTrackerRef.current?.addDetection(
            handedness
          );

          sessionActiveHandTrackerRef.current?.addDetection(
            handedness
          );

          return;
        }

        const sortedHands = [...hands].sort(
          (first, second) =>
            first.pinchRatio -
            second.pinchRatio
        );

        const activeHand = sortedHands[0];
        const supportHand = sortedHands[1];

        attemptActiveHandTrackerRef.current?.addDetection(
          activeHand.handedness
        );

        attemptSupportHandTrackerRef.current?.addDetection(
          supportHand.handedness
        );

        sessionActiveHandTrackerRef.current?.addDetection(
          activeHand.handedness
        );

        sessionSupportHandTrackerRef.current?.addDetection(
          supportHand.handedness
        );

        attemptBilateralFramesRef.current += 1;
        sessionBilateralFramesRef.current += 1;
      },
      [isPaused]
    );

  const handlePinchChange =
    useCallback(
      (newPinchRatio: number) => {
        if (isPaused) {
          return;
        }

        latestMetricsRef.current.pinchRatio =
          newPinchRatio;

        if (
          rule.primaryMetric !==
          "pinch-zone"
        ) {
          return;
        }

        addSpeedSample(newPinchRatio);

        const result =
          updateButtonFasteningCounter({
            pinchRatio: newPinchRatio,

            currentState:
              buttonFasteningStateRef
                .current,

            repCount:
              repCountRef.current,

            holdStartTime:
              buttonHoldStartTimeRef
                .current,
          });

        buttonFasteningStateRef.current =
          result.state;

        buttonHoldStartTimeRef.current =
          result.holdStartTime;

        updateRepCount(result.reps);

        setFeedback((previous) =>
          previous === result.feedback
            ? previous
            : result.feedback
        );

        setHoldProgress((previous) =>
          previous ===
          result.holdProgress
            ? previous
            : result.holdProgress
        );
      },
      [
        addSpeedSample,
        isPaused,
        rule.primaryMetric,
        updateRepCount,
      ]
    );

  const handleClosureChange =
    useCallback(
      (newClosureRatio: number) => {
        if (isPaused) {
          return;
        }

        latestMetricsRef.current.closureRatio =
          newClosureRatio;

        if (
          rule.primaryMetric ===
          "wrist-height"
        ) {
          updateLiftPlaceRepCounter();
          return;
        }

        if (
          rule.primaryMetric ===
          "hand-open-close"
        ) {
          addSpeedSample(
            newClosureRatio
          );

          const result =
            updateHandFunctionCounter({
              closureRatio:
                newClosureRatio,

              currentState:
                handFunctionStateRef
                  .current,

              repCount:
                repCountRef.current,
            });

          handFunctionStateRef.current =
            result.state;

          updateRepCount(result.reps);

          setFeedback((previous) =>
            previous === result.feedback
              ? previous
              : result.feedback
          );

          return;
        }

        if (
          rule.primaryMetric !==
          "hand-closure"
        ) {
          return;
        }

        if (newClosureRatio <= 0) {
          return;
        }

        addSpeedSample(newClosureRatio);

        const result =
          updateHandClosureRepCounter({
            value: newClosureRatio,

            currentState:
              repStateRef.current,

            repCount:
              repCountRef.current,

            rule,

            holdStartTime:
              holdStartTimeRef.current,
          });

        repStateRef.current =
          result.state;

        holdStartTimeRef.current =
          result.holdStartTime ?? null;

        updateRepCount(result.reps);

        setFeedback((previous) =>
          previous === result.feedback
            ? previous
            : result.feedback
        );

        setHoldProgress((previous) =>
          previous ===
          (result.holdProgress ?? 0)
            ? previous
            : result.holdProgress ?? 0
        );
      },
      [
        addSpeedSample,
        isPaused,
        rule,
        updateLiftPlaceRepCounter,
        updateRepCount,
      ]
    );

  const exitFullscreenIfNeeded =
    async () => {
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

  const handleConfirmEndSession =
    async () => {
      await exitFullscreenIfNeeded();

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      const sessionId =
        sessionIdRef.current;

      if (
        sessionId &&
        !sessionFinalizedRef.current
      ) {
        const handDetails =
          getDetectedHandDetails();

        try {
          sessionFinalizedRef.current =
            true;

          await saveQueueRef.current;

          const speedSummary =
            getSessionSpeedSummary();

          await updateExerciseSession({
            sessionId,
            action: "END_EARLY",

            completedReps:
              repCountRef.current,

            durationSeconds:
              elapsedSecondsRef.current,

            performedSide:
              handDetails.performedSide,

            endedReason:
              "Session ended by the survivor before completion.",

            sessionSummary: {
              exerciseSlug:
                exercise.slug,

              completedReps:
                repCountRef.current,

              targetReps:
                rule.targetReps,

              durationSeconds:
                elapsedSecondsRef.current,

              trackerType:
                rule.tracker,

              primaryMetric:
                rule.primaryMetric,

              completedSpeedSamples:
                speedSummary.completedSpeedSamples,

              averageRepDurationMs:
                speedSummary.averageRepDurationMs,

              fastestRepDurationMs:
                speedSummary.fastestRepDurationMs,

              slowestRepDurationMs:
                speedSummary.slowestRepDurationMs,

              averageVelocity:
                speedSummary.averageVelocity,

              peakVelocity:
                speedSummary.peakVelocity,

              totalMovementDistance:
                speedSummary.totalMovementDistance,
            },
          });
        } catch (error) {
          sessionFinalizedRef.current =
            false;

          console.error(
            "Failed to end database session:",
            error
          );
        }
      }

      speedTrackerRef.current?.reset();

      setIsSpeaking(false);
      setIsPaused(true);
      setShowEndConfirmModal(false);
      setShowEndModal(true);
    };

  const handleVoiceInstruction = () => {
    if (
      !("speechSynthesis" in window)
    ) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance =
      new SpeechSynthesisUtterance(
        feedback ||
          exercise.instruction
      );

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () =>
      setIsSpeaking(true);

    utterance.onend = () =>
      setIsSpeaking(false);

    utterance.onerror = () =>
      setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(
      utterance
    );
  };

  useEffect(() => {
    repStateRef.current =
      initialRepState;

    liftPlaceStateRef.current =
      "RESTING";

    handFunctionStateRef.current =
      "OPEN";

    buttonFasteningStateRef.current =
      "RESTING";

    liftPlaceStartXRef.current = null;
    holdStartTimeRef.current = null;
    buttonHoldStartTimeRef.current =
      null;

    repCountRef.current = 0;
    attemptNumberRef.current = 0;
    attemptStartedAtRef.current =
      Date.now();

    latestHandsRef.current = [];

    sessionIdRef.current = null;

    sessionFinalizedRef.current = false;

    sessionUpdateInProgressRef.current =
      false;

    saveQueueRef.current =
      Promise.resolve();

    speedTrackerRef.current?.reset();

    attemptActiveHandTrackerRef.current?.reset();
    attemptSupportHandTrackerRef.current?.reset();
    sessionActiveHandTrackerRef.current?.reset();
    sessionSupportHandTrackerRef.current?.reset();

    attemptBilateralFramesRef.current = 0;
    attemptTotalHandFramesRef.current = 0;
    sessionBilateralFramesRef.current = 0;
    sessionTotalHandFramesRef.current = 0;

    completedSpeedMetricsRef.current =
      [];

    latestMetricsRef.current = {
      angle: 0,
      reachValue: 0,
      wristHeight: 0,
      wristX: 0,
      closureRatio: 0,
      pinchRatio: 1,
    };

    elapsedSecondsRef.current = 0;

    setRepCount(0);
    setFeedback(rule.feedback.start);
    setAngle(0);
    setHoldProgress(0);
    setElapsedSeconds(0);
    setIsPaused(false);
    setShowEndModal(false);
    setShowEndConfirmModal(false);
  }, [
    exercise.slug,
    initialRepState,
    rule.feedback.start,
  ]);

  useEffect(() => {
    if (
      sessionCreationExerciseRef.current ===
      exercise.slug
    ) {
      return;
    }

    sessionCreationExerciseRef.current =
      exercise.slug;

    const requestedExerciseSlug =
      exercise.slug;

    createExerciseSession({
      exerciseSlug:
        requestedExerciseSlug,

      targetReps: rule.targetReps,
    })
      .then((session) => {
        if (
          sessionCreationExerciseRef.current !==
          requestedExerciseSlug
        ) {
          return;
        }

        sessionIdRef.current =
          session.id;

        attemptStartedAtRef.current =
          Date.now();

        speedTrackerRef.current?.reset();
        attemptActiveHandTrackerRef.current?.reset();
        attemptSupportHandTrackerRef.current?.reset();
        attemptBilateralFramesRef.current = 0;
        attemptTotalHandFramesRef.current = 0;

        console.info(
          "Exercise session created:",
          session.id
        );
      })
      .catch((error: unknown) => {
        console.error(
          "Failed to create exercise session:",
          error
        );

        if (
          sessionCreationExerciseRef.current ===
          requestedExerciseSlug
        ) {
          sessionCreationExerciseRef.current =
            null;
        }
      });
  }, [
    exercise.slug,
    rule.targetReps,
  ]);

  useEffect(() => {
    if (
      isPaused ||
      showEndModal ||
      showEndConfirmModal ||
      showDemoModal
    ) {
      return;
    }

    const timer = window.setInterval(
      () => {
        setElapsedSeconds(
          (seconds) => seconds + 1
        );
      },
      1000
    );

    return () =>
      window.clearInterval(timer);
  }, [
    isPaused,
    showEndModal,
    showEndConfirmModal,
    showDemoModal,
  ]);

  useEffect(() => {
    if (
      sessionFinalizedRef.current
    ) {
      return;
    }

    const checkpointTimer =
      window.setInterval(() => {
        const sessionId =
          sessionIdRef.current;

        if (
          !sessionId ||
          sessionFinalizedRef.current
        ) {
          return;
        }

        const handDetails =
          getDetectedHandDetails();

        const speedSummary =
          getSessionSpeedSummary();

        updateExerciseSession({
          sessionId,
          action: "CHECKPOINT",

          completedReps:
            repCountRef.current,

          durationSeconds:
            elapsedSecondsRef.current,

          performedSide:
            handDetails.performedSide,

          sessionSummary: {
            exerciseSlug:
              exercise.slug,

            trackerType:
              rule.tracker,

            primaryMetric:
              rule.primaryMetric,

            completedReps:
              repCountRef.current,

            durationSeconds:
              elapsedSecondsRef.current,

            lastAngle:
              latestMetricsRef.current
                .angle,

            lastReachValue:
              latestMetricsRef.current
                .reachValue,

            lastWristHeight:
              latestMetricsRef.current
                .wristHeight,

            lastClosureRatio:
              latestMetricsRef.current
                .closureRatio,

            lastPinchRatio:
              latestMetricsRef.current
                .pinchRatio,

            handsDetected:
              latestHandsRef.current
                .length,

            completedSpeedSamples:
              speedSummary.completedSpeedSamples,

            averageRepDurationMs:
              speedSummary.averageRepDurationMs,

            averageVelocity:
              speedSummary.averageVelocity,

            peakVelocity:
              speedSummary.peakVelocity,

            totalMovementDistance:
              speedSummary.totalMovementDistance,
          },
        }).catch((error) => {
          console.error(
            "Session checkpoint failed:",
            error
          );
        });
      }, 15_000);

    return () =>
      window.clearInterval(
        checkpointTimer
      );
  }, [
    exercise.slug,
    getDetectedHandDetails,
    getSessionSpeedSummary,
    rule.primaryMetric,
    rule.tracker,
  ]);

  const formatTime = (
    seconds: number
  ) => {
    const mins = Math.floor(
      seconds / 60
    );

    const secs = seconds % 60;

    return `${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const sessionDuration =
    formatTime(elapsedSeconds);

  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_446px] gap-[26px]">
        <div className="overflow-hidden rounded-2xl bg-white">
          <div className="flex items-center justify-between px-[30px] py-4">
            <div className="flex items-center gap-[13px]">
              <div className="flex h-[91px] w-[91px] items-center justify-center rounded-xl bg-[#F7F4F2] p-2">
                <Image
                  src={
                    exercise.images.thumbnail
                  }
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
                  {feedback ||
                    exercise.instruction}
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
                    isPaused
                      ? "bg-[#F59E0B]"
                      : "bg-[#40C057]"
                  }`}
                >
                  {isPaused
                    ? "Paused"
                    : "Ready"}
                </div>
              </div>
            </div>
          </div>

          {holdProgress > 0 &&
            holdProgress < 1 && (
              <div className="px-[30px] pb-4">
                <div className="h-3 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                  <div
                    className="h-full rounded-full bg-[#592EBD] transition-all duration-100"
                    style={{
                      width: `${Math.round(
                        holdProgress * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

          <CameraPlaceholder
            isPaused={isPaused}
            onAngleChange={
              handleAngleChange
            }
            onReachChange={
              handleReachChange
            }
            onWristHeightChange={
              handleWristHeightChange
            }
            onWristXChange={
              handleWristXChange
            }
            onClosureChange={
              handleClosureChange
            }
            onPinchChange={
              handlePinchChange
            }
            onHandsChange={
              handleHandsChange
            }
            fullScreenControls={
              <SessionControls
                isPaused={isPaused}
                isSpeaking={isSpeaking}
                onPauseToggle={
                  handlePauseToggle
                }
                onWatchDemo={
                  handleWatchDemo
                }
                onVoiceInstruction={
                  handleVoiceInstruction
                }
                onEndSession={
                  handleEndSession
                }
              />
            }
          />

          <div className="px-[30px] py-6">
            <SessionControls
              isPaused={isPaused}
              isSpeaking={isSpeaking}
              onPauseToggle={
                handlePauseToggle
              }
              onWatchDemo={
                handleWatchDemo
              }
              onVoiceInstruction={
                handleVoiceInstruction
              }
              onEndSession={
                handleEndSession
              }
            />
          </div>
        </div>

        <div className="space-y-[26px]">
          <LiveFeedbackCard />

          <RepProgressCard
            currentRep={repCount}
            totalReps={
              rule.targetReps
            }
          />

          <RangeOfMotionCard
            angle={angle}
          />
        </div>
      </div>

      {showEndConfirmModal && (
        <EndSessionModal
          onCancel={() =>
            setShowEndConfirmModal(
              false
            )
          }
          onConfirm={
            handleConfirmEndSession
          }
        />
      )}

      {showEndModal && (
        <SessionCompleteModal
          exerciseTitle={
            exercise.title
          }
          repsCompleted={repCount}
          totalReps={
            rule.targetReps
          }
          averageScore={0}
          duration={sessionDuration}
          onClose={() =>
            setShowEndModal(false)
          }
        />
      )}

      {showDemoModal && (
        <ExerciseDemoModal
          exercise={exercise}
          onClose={() =>
            setShowDemoModal(false)
          }
        />
      )}
    </>
  );
}

function resolveHandDetails(
  snapshot: HandTrackingSnapshot
): {
  activeHand: HandSide;
  supportHand: HandSide | null;
  isBilateral: boolean;
  performedSide: ExerciseSide;
} {
  const bilateralRatio =
    snapshot.totalHandFrames > 0
      ? snapshot.bilateralFrames /
        snapshot.totalHandFrames
      : 0;

  const isBilateral =
    snapshot.bilateralFrames >= 3 &&
    bilateralRatio >= 0.5;

  const activeHand =
    toHandSide(
      snapshot.activeSummary.dominantSide
    );

  const resolvedSupportHand =
    toHandSide(
      snapshot.supportSummary.dominantSide
    );

  const supportHand =
    isBilateral &&
    resolvedSupportHand !== "UNKNOWN" &&
    resolvedSupportHand !== activeHand
      ? resolvedSupportHand
      : null;

  const performedSide: ExerciseSide =
    isBilateral
      ? "BILATERAL"
      : activeHand;

  return {
    activeHand,
    supportHand,
    isBilateral,
    performedSide,
  };
}

function toHandSide(
  side: StableHandSide
): HandSide {
  if (side === "LEFT") {
    return "LEFT";
  }

  if (side === "RIGHT") {
    return "RIGHT";
  }

  return "UNKNOWN";
}

function createEmptyHandSummary(): HandTrackerSummary {
  return {
    dominantSide: "UNKNOWN",
    leftDetections: 0,
    rightDetections: 0,
    unknownDetections: 0,
    knownDetections: 0,
    totalDetections: 0,
    leftRatio: 0,
    rightRatio: 0,
  };
}

function createEmptySpeedMetrics(): MovementSpeedMetrics {
  return {
    totalDurationMs: 0,
    activeMovementDurationMs: 0,
    totalDistance: 0,
    averageVelocity: null,
    peakVelocity: null,
    sampleCount: 0,
  };
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return (
    values.reduce(
      (sum, value) => sum + value,
      0
    ) / values.length
  );
}

function roundMetric(value: number): number {
  return Number(value.toFixed(6));
}