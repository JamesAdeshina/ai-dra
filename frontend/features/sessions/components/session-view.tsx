"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { Play, Timer } from "lucide-react";

import {
  READY_PROMPT_SAFE_DELAY_MS,
  TRACKING_LOST_DELAY_MS,
  audioService,
  useAudioPreferences,
  useBackgroundMusic,
} from "@/features/audio";

import {
  AttemptMetricTracker,
  calculateAccuracyScore,
  calculateMovementScore,
  type AttemptMetricSummary,
} from "@/features/sessions/scoring";

import { CameraPlaceholder } from "./camera-placeholder";
import { AudioPreferencesModal } from "./audio-preferences-modal";
import { SessionCountdown } from "./session-countdown";
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

import { SupportModal } from "./support-modal";

import type {
  SupportReason,
} from "@/features/support/nhs-resource-config";

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
  metricSummary: AttemptMetricSummary;
};

export function SessionView({ exercise }: SessionViewProps) {
  const rule = useMemo(
    () =>
      exerciseRules[exercise.slug] ??
      exerciseRules["target-touch"],
    [exercise.slug]
  );

  const [
    showSupportModal,
    setShowSupportModal,
  ] = useState(false);

  const [
    supportReason,
    setSupportReason,
  ] = useState<SupportReason>(
    "GENERAL_DIFFICULTY"
  );

  const initialRepState: RepState =
    rule.primaryMetric === "hand-closure"
      ? "OPEN"
      : "RESTING";

  const {
    preferences,
    isLoaded: areAudioPreferencesLoaded,
    hasConfiguredAudio,
    updatePreference: updateAudioPreference,
    savePreferences,
    continueWithoutAudio,
  } = useAudioPreferences();

  const {
    fadeIn: fadeInSessionMusic,
    pause: pauseSessionMusic,
    resume: resumeSessionMusic,
    fadeOut: fadeOutSessionMusic,
  } = useBackgroundMusic({
    enabled:
      preferences.backgroundMusicEnabled,
    musicKey: "sessionBackground",
  });

  const [angle, setAngle] = useState(0);
  const [repCount, setRepCount] = useState(0);
  const [feedback, setFeedback] = useState(
    rule.feedback.start
  );
  const [holdProgress, setHoldProgress] = useState(0);

  const [isCameraReady, setIsCameraReady] =
    useState(false);
  const [isTrackingReady, setIsTrackingReady] =
    useState(false);
  const [hasStartInteraction, setHasStartInteraction] =
    useState(false);
  const [showCountdown, setShowCountdown] =
    useState(false);
  const [hasSessionStarted, setHasSessionStarted] =
    useState(false);
  const [isRepCountingEnabled, setIsRepCountingEnabled] =
    useState(false);

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

  const repCountingEnabledRef = useRef(false);
  const halfwayPlayedRef = useRef(false);
  const holdCompleteArmedRef = useRef(true);
  const trackingLossEventActiveRef = useRef(false);
  const trackingLossTimerRef =
    useRef<number | null>(null);
  const sessionCompletePlayedRef =
    useRef(false);
  const countdownStartedRef = useRef(false);
  const readyDelayTimerRef =
    useRef<number | null>(null);

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

  const [
  latestAccuracyScore,
  setLatestAccuracyScore,
  ] = useState<number | null>(null);

  const [
    latestMovementScore,
    setLatestMovementScore,
  ] = useState<number | null>(null);

  const [
    latestSpeedScore,
    setLatestSpeedScore,
  ] = useState<number | null>(null);

  const [
    latestSpeedClassification,
    setLatestSpeedClassification,
  ] = useState<
    | "SLOW"
    | "CONTROLLED"
    | "FAST"
    | "NOT_ASSESSED"
  >("NOT_ASSESSED");

  const consecutiveDifficultyAttemptsRef =
    useRef(0);

  const supportShownRef =
    useRef(false);

  const elapsedSecondsRef = useRef(0);

  const attemptMetricTrackerRef =
    useRef<AttemptMetricTracker | null>(
      null
    );

  if (!attemptMetricTrackerRef.current) {
    attemptMetricTrackerRef.current =
      new AttemptMetricTracker();
  }

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

  useEffect(() => {
    repCountingEnabledRef.current =
      isRepCountingEnabled;
  }, [isRepCountingEnabled]);

  const addSpeedSample = useCallback(
    (value: number) => {
      if (
        isPaused ||
        !repCountingEnabledRef.current ||
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

  const recordAttemptMetricSample =
    useCallback(() => {
      if (
        isPaused ||
        !repCountingEnabledRef.current ||
        sessionFinalizedRef.current
      ) {
        return;
      }

      const metrics =
        latestMetricsRef.current;

      attemptMetricTrackerRef.current?.addSample({
        angle: metrics.angle,
        reachValue: metrics.reachValue,
        wristHeight: metrics.wristHeight,
        wristX: metrics.wristX,
        closureRatio: metrics.closureRatio,
        pinchRatio: metrics.pinchRatio,
        holdProgress,
        isTracking: isTrackingReady,
      });
    }, [
      holdProgress,
      isPaused,
      isTrackingReady,
    ]);

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
    }, [recordAttemptMetricSample]);

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

        const scoringInput = {
          exerciseSlug: exercise.slug,
          rule,
          metrics:
            snapshot.metricSummary,
          speedMetrics:
            snapshot.speedMetrics,
          completed: true,
          activeSide:
            handDetails.activeHand,
          prescribedSide: null,
        } as const;

        const accuracy =
          calculateAccuracyScore(
            scoringInput
          );

        const movement =
          calculateMovementScore({
            input: scoringInput,
            accuracy,
          });

        setLatestAccuracyScore(
          accuracy.score
        );

        setLatestMovementScore(
          movement.score
        );

        setLatestSpeedScore(
          movement.breakdown.speed
        );

        setLatestSpeedClassification(
          movement.speedClassification
        );

        const trackingRatio =
          snapshot.metricSummary.trackingFrames > 0
            ? snapshot.metricSummary.trackedFrames /
              snapshot.metricSummary.trackingFrames
            : 0;

        const rangeOfMotionScore =
          accuracy.components.find(
            (component) =>
              component.key === "rangeOfMotion" &&
              component.available
          )?.score ?? null;

        let detectedSupportReason:
          | SupportReason
          | null = null;

        if (trackingRatio < 0.7) {
          detectedSupportReason =
            "TRACKING_DIFFICULTY";
        } else if (
          rangeOfMotionScore !== null &&
          rangeOfMotionScore < 60
        ) {
          detectedSupportReason =
            "LOW_RANGE_OF_MOTION";
        } else if (accuracy.score < 70) {
          detectedSupportReason =
            "LOW_ACCURACY";
        } else if (movement.score < 70) {
          detectedSupportReason =
            "LOW_MOVEMENT_SCORE";
        } else if (
          movement.speedClassification === "FAST" &&
          movement.breakdown.speed < 60
        ) {
          detectedSupportReason =
            "FAST_MOVEMENT";
        } else if (
          movement.speedClassification === "SLOW" &&
          movement.breakdown.speed < 60
        ) {
          detectedSupportReason =
            "SLOW_MOVEMENT";
        }

        if (detectedSupportReason) {
          consecutiveDifficultyAttemptsRef.current += 1;
        } else {
          consecutiveDifficultyAttemptsRef.current = 0;
        }

        const shouldShowAutomaticSupport =
          consecutiveDifficultyAttemptsRef.current >= 2 &&
          !supportShownRef.current &&
          snapshot.completedRepNumber < rule.targetReps;

        if (detectedSupportReason !== null && shouldShowAutomaticSupport) {
          supportShownRef.current = true;
          setSupportReason(detectedSupportReason); // now narrowed to SupportReason
          setShowSupportModal(true);
        }

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

            angleStart:
              snapshot.metricSummary
                .angle.start,
            angleEnd:
              snapshot.metricSummary
                .angle.end,
            angleMinimum:
              snapshot.metricSummary
                .angle.minimum,
            angleMaximum:
              snapshot.metricSummary
                .angle.maximum,

            reachMinimum:
              snapshot.metricSummary
                .reachValue.minimum,
            reachMaximum:
              snapshot.metricSummary
                .reachValue.maximum,

            wristHeightMinimum:
              snapshot.metricSummary
                .wristHeight.minimum,
            wristHeightMaximum:
              snapshot.metricSummary
                .wristHeight.maximum,

            closureMinimum:
              snapshot.metricSummary
                .closureRatio.minimum,
            closureMaximum:
              snapshot.metricSummary
                .closureRatio.maximum,

            pinchMinimum:
              snapshot.metricSummary
                .pinchRatio.minimum,
            pinchMaximum:
              snapshot.metricSummary
                .pinchRatio.maximum,

            holdProgress:
              snapshot.metricSummary
                .holdProgress,

            sequenceCompleted:
              snapshot.metricSummary
                .sequenceCompleted,

            returnedToStart:
              snapshot.metricSummary
                .returnedToStart,

            trackingFrames:
              snapshot.metricSummary
                .trackingFrames,

            trackedFrames:
              snapshot.metricSummary
                .trackedFrames,

            scoringVersion:
              "prototype-v1",

            thresholdsAreProvisional:
              true,
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

            speedClassification:
              movement.speedClassification,
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

          accuracyScore:
            accuracy.score,
          movementScore:
            movement.score,
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
        rule,
        waitForSessionId,
      ]
    );

  const handleHoldProgressChange =
    useCallback(
      (nextProgress: number) => {
        const safeProgress = Math.min(
          1,
          Math.max(0, nextProgress)
        );

        setHoldProgress((previous) =>
          previous === safeProgress
            ? previous
            : safeProgress
        );

        if (
          safeProgress >= 1 &&
          holdCompleteArmedRef.current
        ) {
          holdCompleteArmedRef.current = false;

          if (
            preferences.soundEffectsEnabled
          ) {
            void audioService.playEffect(
              "holdComplete"
            );
          }
        }

        if (safeProgress < 0.2) {
          holdCompleteArmedRef.current = true;
        }
      },
      [preferences.soundEffectsEnabled]
    );

  const playSessionCompleteSequence =
    useCallback(async () => {
      if (sessionCompletePlayedRef.current) {
        return;
      }

      sessionCompletePlayedRef.current = true;
      repCountingEnabledRef.current = false;
      setIsRepCountingEnabled(false);

      await fadeOutSessionMusic();

      if (preferences.soundEffectsEnabled) {
        await audioService.playEffect(
          "sessionComplete"
        );
      }

      if (preferences.voicePromptsEnabled) {
        await audioService.playVoice(
          "sessionComplete",
          {
            priority: 4,
            interruptLowerPriority: true,
          }
        );
      }
    }, [
      fadeOutSessionMusic,
      preferences.soundEffectsEnabled,
      preferences.voicePromptsEnabled,
    ]);

  const updateRepCount = useCallback(
    (reps: number) => {
      if (
        !repCountingEnabledRef.current ||
        sessionCompletePlayedRef.current
      ) {
        return;
      }

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

      const isFinalRep =
        reps >= rule.targetReps;

      if (isFinalRep) {
        repCountingEnabledRef.current = false;
        setIsRepCountingEnabled(false);
      } else if (
        preferences.soundEffectsEnabled
      ) {
        void audioService.playEffect(
          "repComplete"
        );
      }

      const halfwayTarget = Math.ceil(
        rule.targetReps / 2
      );

      if (
        !isFinalRep &&
        !halfwayPlayedRef.current &&
        reps >= halfwayTarget
      ) {
        halfwayPlayedRef.current = true;

        if (
          preferences.voicePromptsEnabled
        ) {
          void audioService.playVoice(
            "halfwayThere",
            {
              priority: 1,
              interruptLowerPriority: false,
            }
          );
        }
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

      attemptMetricTrackerRef.current?.markSequenceCompleted();
      attemptMetricTrackerRef.current?.markReturnedToStart();

      const metricSummary =
        attemptMetricTrackerRef.current?.getSummary() ??
        createEmptyAttemptMetricSummary();

      const snapshot: CompletedAttemptSnapshot = {
        attemptNumber:
          attemptNumberRef.current,

        completedRepNumber: reps,

        startedAtMs,
        completedAtMs,
        durationMs,
        speedMetrics,
        handTracking,
        metricSummary,
      };

      speedTrackerRef.current?.reset();
      attemptMetricTrackerRef.current?.reset();
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

              await playSessionCompleteSequence();

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
      playSessionCompleteSequence,
      preferences.soundEffectsEnabled,
      preferences.voicePromptsEnabled,
      rule.targetReps,
    ]
  );

  const updateLiftPlaceRepCounter =
    useCallback(() => {
      if (
        isPaused ||
        !repCountingEnabledRef.current ||
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
        const nextPausedState = !isPaused;

        setIsPaused(nextPausedState);

        if (nextPausedState) {
          if (
            preferences.soundEffectsEnabled
          ) {
            void audioService.playEffect(
              "pause"
            );
          }

          pauseSessionMusic();
        } else if (
          preferences.backgroundMusicEnabled
        ) {
          void resumeSessionMusic();
        }

        speedTrackerRef.current?.reset();
        attemptMetricTrackerRef.current?.reset();
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
          attemptMetricTrackerRef.current?.reset();
          attemptActiveHandTrackerRef.current?.reset();
          attemptSupportHandTrackerRef.current?.reset();
          attemptBilateralFramesRef.current = 0;
          attemptTotalHandFramesRef.current = 0;

          attemptStartedAtRef.current =
            Date.now();

          setIsPaused(false);

          if (
            preferences.backgroundMusicEnabled
          ) {
            void resumeSessionMusic();
          }
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
          attemptMetricTrackerRef.current?.reset();
          attemptActiveHandTrackerRef.current?.reset();
          attemptSupportHandTrackerRef.current?.reset();
          attemptBilateralFramesRef.current = 0;
          attemptTotalHandFramesRef.current = 0;

          setIsPaused(true);

          if (
            preferences.soundEffectsEnabled
          ) {
            void audioService.playEffect(
              "pause"
            );
          }

          pauseSessionMusic();
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
      pauseSessionMusic,
      preferences.backgroundMusicEnabled,
      preferences.soundEffectsEnabled,
      resumeSessionMusic,
    ]);

  const handleAngleChange =
    useCallback((newAngle: number) => {
      latestMetricsRef.current.angle =
        newAngle;

      recordAttemptMetricSample();

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
          !repCountingEnabledRef.current ||
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

        recordAttemptMetricSample();
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
        recordAttemptMetricSample,
        rule,
        updateRepCount,
      ]
    );

  const handleWristHeightChange =
    useCallback(
      (newWristHeight: number) => {
        if (
          isPaused ||
          !repCountingEnabledRef.current
        ) {
          return;
        }

        latestMetricsRef.current.wristHeight =
          newWristHeight;

        recordAttemptMetricSample();

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
        recordAttemptMetricSample,
        rule.primaryMetric,
        updateLiftPlaceRepCounter,
      ]
    );

  const handleWristXChange =
    useCallback(
      (newWristX: number) => {
        if (
          isPaused ||
          !repCountingEnabledRef.current
        ) {
          return;
        }

        latestMetricsRef.current.wristX =
          newWristX;

        recordAttemptMetricSample();
        updateLiftPlaceRepCounter();
      },
      [
        isPaused,
        recordAttemptMetricSample,
        updateLiftPlaceRepCounter,
      ]
    );

  const handleHandsChange =
    useCallback(
      (hands: TrackedHand[]) => {
        if (
          isPaused ||
          !repCountingEnabledRef.current
        ) {
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
        if (
          isPaused ||
          !repCountingEnabledRef.current
        ) {
          return;
        }

        latestMetricsRef.current.pinchRatio =
          newPinchRatio;

        recordAttemptMetricSample();

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

        handleHoldProgressChange(
          result.holdProgress
        );
      },
      [
        addSpeedSample,
        isPaused,
        recordAttemptMetricSample,
        rule.primaryMetric,
        updateRepCount,
        handleHoldProgressChange,
      ]
    );

  const handleClosureChange =
    useCallback(
      (newClosureRatio: number) => {
        if (
          isPaused ||
          !repCountingEnabledRef.current
        ) {
          return;
        }

        latestMetricsRef.current.closureRatio =
          newClosureRatio;

        recordAttemptMetricSample();

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

        handleHoldProgressChange(
          result.holdProgress ?? 0
        );
      },
      [
        addSpeedSample,
        isPaused,
        recordAttemptMetricSample,
        rule,
        updateLiftPlaceRepCounter,
        updateRepCount,
        handleHoldProgressChange,
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

      repCountingEnabledRef.current = false;
      setIsRepCountingEnabled(false);
      audioService.stopAllAudio();

      setIsSpeaking(false);
      setIsPaused(true);
      setShowEndConfirmModal(false);
      setShowEndModal(true);
    };

  const handleVoiceInstruction = () => {
    if (
      !preferences.voicePromptsEnabled ||
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
    utterance.volume =
      preferences.voiceVolume;

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

    repCountingEnabledRef.current = false;
    halfwayPlayedRef.current = false;
    holdCompleteArmedRef.current = true;
    trackingLossEventActiveRef.current = false;
    sessionCompletePlayedRef.current = false;
    countdownStartedRef.current = false;

    if (trackingLossTimerRef.current) {
      window.clearTimeout(
        trackingLossTimerRef.current
      );
      trackingLossTimerRef.current = null;
    }

    if (readyDelayTimerRef.current) {
      window.clearTimeout(
        readyDelayTimerRef.current
      );
      readyDelayTimerRef.current = null;
    }

    latestHandsRef.current = [];

    sessionIdRef.current = null;

    sessionFinalizedRef.current = false;

    sessionUpdateInProgressRef.current =
      false;

    saveQueueRef.current =
      Promise.resolve();

    speedTrackerRef.current?.reset();
    attemptMetricTrackerRef.current?.reset();

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
    setIsCameraReady(false);
    setIsTrackingReady(false);
    setHasStartInteraction(false);
    setShowCountdown(false);
    setHasSessionStarted(false);
    setIsRepCountingEnabled(false);
    setIsPaused(false);
    setShowEndModal(false);
    setShowEndConfirmModal(false);
    setShowSupportModal(false);
    setSupportReason(
      "GENERAL_DIFFICULTY"
    );

    setLatestAccuracyScore(null);
    setLatestMovementScore(null);
    setLatestSpeedScore(null);
    setLatestSpeedClassification(
      "NOT_ASSESSED"
    );

    consecutiveDifficultyAttemptsRef.current =
      0;
    supportShownRef.current = false;
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
        attemptMetricTrackerRef.current?.reset();
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
      !hasSessionStarted ||
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
    hasSessionStarted,
    isPaused,
    showEndModal,
    showEndConfirmModal,
    showDemoModal,
  ]);

  useEffect(() => {
    if (
      !hasSessionStarted ||
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
    hasSessionStarted,
    getSessionSpeedSummary,
    rule.primaryMetric,
    rule.tracker,
  ]);

  useEffect(() => {
    if (
      !hasStartInteraction ||
      !isCameraReady ||
      !isTrackingReady ||
      hasSessionStarted ||
      showCountdown ||
      countdownStartedRef.current
    ) {
      return;
    }

    countdownStartedRef.current = true;
    setShowCountdown(true);
  }, [
    hasSessionStarted,
    hasStartInteraction,
    isCameraReady,
    isTrackingReady,
    showCountdown,
  ]);

  useEffect(() => {
    if (
      !hasSessionStarted ||
      isPaused ||
      isTrackingReady
    ) {
      if (trackingLossTimerRef.current) {
        window.clearTimeout(
          trackingLossTimerRef.current
        );
        trackingLossTimerRef.current = null;
      }

      if (isTrackingReady) {
        trackingLossEventActiveRef.current =
          false;
      }

      return;
    }

    if (
      trackingLossEventActiveRef.current ||
      trackingLossTimerRef.current
    ) {
      return;
    }

    trackingLossTimerRef.current =
      window.setTimeout(() => {
        trackingLossTimerRef.current = null;

        if (
          trackingLossEventActiveRef.current
        ) {
          return;
        }

        trackingLossEventActiveRef.current =
          true;

        void (async () => {
          if (
            preferences.soundEffectsEnabled
          ) {
            await audioService.playEffect(
              "trackingLost"
            );
          }

          if (
            preferences.voicePromptsEnabled
          ) {
            await audioService.playVoice(
              "trackingLost",
              {
                priority: 3,
                interruptLowerPriority: true,
              }
            );
          }
        })();
      }, TRACKING_LOST_DELAY_MS);

    return () => {
      if (trackingLossTimerRef.current) {
        window.clearTimeout(
          trackingLossTimerRef.current
        );
        trackingLossTimerRef.current = null;
      }
    };
  }, [
    hasSessionStarted,
    isPaused,
    isTrackingReady,
    preferences.soundEffectsEnabled,
    preferences.voicePromptsEnabled,
  ]);

  useEffect(() => {
    return () => {
      if (trackingLossTimerRef.current) {
        window.clearTimeout(
          trackingLossTimerRef.current
        );
      }

      if (readyDelayTimerRef.current) {
        window.clearTimeout(
          readyDelayTimerRef.current
        );
      }

      audioService.stopAllAudio();

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleStartInteraction =
    useCallback(async () => {
      await audioService.unlockAudio();
      audioService.preloadAudio();
      setHasStartInteraction(true);
    }, []);

  const handleAudioPreferencesContinue =
    useCallback(async () => {
      savePreferences();
      await handleStartInteraction();
    }, [
      handleStartInteraction,
      savePreferences,
    ]);

  const handleContinueWithoutAudio =
    useCallback(async () => {
      continueWithoutAudio();
      await handleStartInteraction();
    }, [
      continueWithoutAudio,
      handleStartInteraction,
    ]);

  const handleCountdownComplete =
    useCallback(async () => {
      setShowCountdown(false);
      setHasSessionStarted(true);

      if (
        preferences.backgroundMusicEnabled
      ) {
        void fadeInSessionMusic();
      }

      if (
        preferences.voicePromptsEnabled
      ) {
        await audioService.playVoice(
          "readyWhenYouAre",
          {
            priority: 2,
            interruptLowerPriority: true,
          }
        );
      }

      readyDelayTimerRef.current =
        window.setTimeout(() => {
          repCountingEnabledRef.current =
            true;
          setIsRepCountingEnabled(true);
          attemptStartedAtRef.current =
            Date.now();
          speedTrackerRef.current?.reset();
          attemptMetricTrackerRef.current?.reset();
        }, READY_PROMPT_SAFE_DELAY_MS);
    }, [
      fadeInSessionMusic,
      preferences.backgroundMusicEnabled,
      preferences.voicePromptsEnabled,
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

  const isAudioPreferencesModalOpen =
    areAudioPreferencesLoaded &&
    !hasConfiguredAudio &&
    !hasStartInteraction;

  const shouldShowStartOverlay =
    areAudioPreferencesLoaded &&
    hasConfiguredAudio &&
    !hasStartInteraction;

  const sessionStatusLabel = !hasSessionStarted
    ? "Preparing"
    : isPaused
      ? "Paused"
      : isRepCountingEnabled
        ? "Active"
        : "Ready";

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
                  {sessionStatusLabel}
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
            onCameraReadyChange={
              setIsCameraReady
            }
            onTrackingChange={
              setIsTrackingReady
            }
            overlayContent={
              <>
                {shouldShowStartOverlay && (
                  <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/55 px-6 backdrop-blur-[2px]">
                    <div className="max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl">
                      <h2 className="text-2xl font-semibold text-[#1E1E1E]">
                        Ready to begin?
                      </h2>

                      <p className="mt-3 text-base leading-7 text-[#757575]">
                        Start when you are in a
                        comfortable position. The
                        countdown will begin once the
                        camera can see you.
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          void handleStartInteraction();
                        }}
                        className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#592EBD] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#4B24A8] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#592EBD]/30"
                      >
                        <Play
                          className="h-5 w-5"
                          fill="currentColor"
                          aria-hidden="true"
                        />
                        Start Session
                      </button>
                    </div>
                  </div>
                )}

                {hasStartInteraction &&
                  !hasSessionStarted &&
                  !showCountdown &&
                  (!isCameraReady ||
                    !isTrackingReady) && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/45 px-6 backdrop-blur-[2px]">
                      <div className="max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl">
                        <h2 className="text-2xl font-semibold text-[#1E1E1E]">
                          Preparing your session
                        </h2>

                        <p className="mt-3 text-base leading-7 text-[#757575]">
                          {!isCameraReady
                            ? "Waiting for camera access..."
                            : "Move into view so AI-DRA can detect your body or hand."}
                        </p>
                      </div>
                    </div>
                  )}

                <SessionCountdown
                  isOpen={showCountdown}
                  onComplete={
                    handleCountdownComplete
                  }
                  audioEnabled={
                    preferences.soundEffectsEnabled
                  }
                />
              </>
            }
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
              hasSessionStarted ? (
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
              ) : null
            }
          />

          {hasSessionStarted && (
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
          )}
        </div>

        <div className="space-y-[26px]">
          <LiveFeedbackCard
            movementScore={
              latestMovementScore
            }
            accuracyScore={
              latestAccuracyScore
            }
            speedScore={
              latestSpeedScore
            }
            speedClassification={
              latestSpeedClassification
            }
            isTracking={
              isTrackingReady
            }
            feedback={feedback}
            isProvisional
          />

          <button
            type="button"
            onClick={() => {
              setSupportReason(
                "GENERAL_DIFFICULTY"
              );
              setShowSupportModal(true);
            }}
            className="w-full rounded-2xl border border-[#D8D0EF] bg-[#F8F6FD] px-5 py-4 text-left transition hover:border-[#B9AAE8] hover:bg-[#F3EFFC] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#592EBD]/20"
          >
            <span className="block text-[16px] font-semibold text-[#592EBD]">
              Need extra support?
            </span>

            <span className="mt-1 block text-[13px] leading-[145%] text-[#666666]">
              View exercise-specific NHS guidance and safe next steps.
            </span>
          </button>

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

      <AudioPreferencesModal
        isOpen={
          isAudioPreferencesModalOpen
        }
        preferences={preferences}
        onPreferenceChange={
          updateAudioPreference
        }
        onContinue={() => {
          void handleAudioPreferencesContinue();
        }}
        onContinueWithoutAudio={() => {
          void handleContinueWithoutAudio();
        }}
      />

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
          exerciseSlug={exercise.slug}
          exerciseTitle={exercise.title}
          repsCompleted={repCount}
          totalReps={rule.targetReps}
          averageAccuracy={
            latestAccuracyScore
          }
          averageMovementScore={
            latestMovementScore
          }
          speedClassification={
            latestSpeedClassification
          }
          duration={sessionDuration}
          difficultyFlag={false}
          recommendation={null}
          onRepeatExercise={() => {
            window.location.reload();
          }}
        />
      )}

      {showSupportModal && (
        <SupportModal
          exerciseSlug={exercise.slug}
          exerciseTitle={exercise.title}
          reason={supportReason}
          onClose={() =>
            setShowSupportModal(false)
          }
          onTryAgain={() => {
            setShowSupportModal(false);
            setShowDemoModal(true);
          }}
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

function createEmptyAttemptMetricSummary(): AttemptMetricSummary {
  const createEmptyRange = () => ({
    start: null,
    end: null,
    minimum: null,
    maximum: null,
    sampleCount: 0,
  });

  return {
    angle: createEmptyRange(),
    reachValue: createEmptyRange(),
    wristHeight: createEmptyRange(),
    wristX: createEmptyRange(),
    closureRatio: createEmptyRange(),
    pinchRatio: createEmptyRange(),
    holdProgress: 0,
    sequenceCompleted: false,
    returnedToStart: false,
    trackingFrames: 0,
    trackedFrames: 0,
  };
}

