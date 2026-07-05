"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { audioService } from "@/features/audio";

type SessionCountdownProps = {
  isOpen: boolean;
  onComplete: () => void;
  audioEnabled: boolean;
};

type CountdownStep = {
  value: "3" | "2" | "1" | "GO";
  message: string;
};

const COUNTDOWN_STEPS: CountdownStep[] = [
  {
    value: "3",
    message: "Get into position",
  },
  {
    value: "2",
    message: "Check your posture",
  },
  {
    value: "1",
    message: "Get ready",
  },
  {
    value: "GO",
    message: "Begin your exercise",
  },
];

const STEP_DURATION_MS = 1000;

export function SessionCountdown({
  isOpen,
  onComplete,
  audioEnabled,
}: SessionCountdownProps) {
  const [stepIndex, setStepIndex] =
    useState(0);

  const completionCalledRef =
    useRef(false);

  const step =
    COUNTDOWN_STEPS[stepIndex];

  const particles = useMemo(
    () =>
      Array.from(
        {
          length:
            step?.value === "GO"
              ? 24
              : 16,
        },
        (_, index) => {
          const count =
            step?.value === "GO"
              ? 24
              : 16;

          const angle =
            (360 / count) * index;

          const distance =
            step?.value === "GO"
              ? 170 +
                ((index * 29) % 90)
              : 110 +
                ((index * 23) % 70);

          const delay =
            (index * 17) % 70;

          return {
            angle,
            distance,
            delay,
          };
        }
      ),
    [step?.value]
  );

  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0);
      completionCalledRef.current = false;
      return;
    }

    setStepIndex(0);
    completionCalledRef.current = false;

    const timers: number[] = [];

    COUNTDOWN_STEPS.forEach(
      (_, index) => {
        const timer =
          window.setTimeout(() => {
            setStepIndex(index);

            if (audioEnabled) {
              void audioService.playEffect(
                "countdownBeep"
              );
            }
          }, index * STEP_DURATION_MS);

        timers.push(timer);
      }
    );

    const completionTimer =
      window.setTimeout(() => {
        if (
          completionCalledRef.current
        ) {
          return;
        }

        completionCalledRef.current = true;
        onComplete();
      }, COUNTDOWN_STEPS.length * STEP_DURATION_MS);

    timers.push(completionTimer);

    return () => {
      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, [
    audioEnabled,
    isOpen,
    onComplete,
  ]);

  if (!isOpen || !step) {
    return null;
  }

  const isGo = step.value === "GO";

  return (
    <div
      className="absolute inset-0 z-50 grid place-items-center overflow-hidden rounded-[inherit] bg-[radial-gradient(circle_at_center,rgba(117,78,215,0.96)_0%,rgba(34,16,72,0.98)_46%,rgba(7,3,17,0.99)_100%)] text-white"
      aria-live="assertive"
      aria-atomic="true"
      role="status"
    >
      <div className="pointer-events-none absolute -left-28 -top-32 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl motion-safe:animate-pulse" />

      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-blue-400/15 blur-3xl motion-safe:animate-pulse" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-white/70 sm:text-sm">
          Session starting
        </p>

        <div className="relative grid aspect-square w-[min(72vw,360px)] place-items-center">
          <svg
            className="absolute inset-0 h-full w-full -rotate-90 drop-shadow-[0_0_18px_rgba(196,181,253,0.45)]"
            viewBox="0 0 260 260"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="session-countdown-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="#ffffff"
                />

                <stop
                  offset="45%"
                  stopColor="#c4b5fd"
                />

                <stop
                  offset="100%"
                  stopColor="#8b5cf6"
                />
              </linearGradient>
            </defs>

            <circle
              cx="130"
              cy="130"
              r="120"
              fill="none"
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="6"
            />

            <circle
              key={`ring-${stepIndex}`}
              cx="130"
              cy="130"
              r="120"
              fill="none"
              stroke="url(#session-countdown-gradient)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="754"
              strokeDashoffset="754"
              className="countdown-ring"
            />
          </svg>

          <span
            key={`pulse-${stepIndex}`}
            className="countdown-pulse absolute h-[44%] w-[44%] rounded-full border-4 border-white/70"
            aria-hidden="true"
          />

          {particles.map(
            (
              particle,
              index
            ) => (
              <span
                key={`${stepIndex}-${index}`}
                className="countdown-particle absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-white shadow-[0_0_14px_white]"
                style={
                  {
                    "--particle-angle": `${particle.angle}deg`,
                    "--particle-distance": `${particle.distance}px`,
                    "--particle-delay": `${particle.delay}ms`,
                  } as React.CSSProperties
                }
                aria-hidden="true"
              />
            )
          )}

          <span
            key={`value-${stepIndex}`}
            className={[
              "countdown-number relative z-10 font-black leading-none",
              "text-[clamp(7rem,26vw,15rem)]",
              isGo
                ? "countdown-go text-[clamp(5.5rem,22vw,11rem)]"
                : "",
            ].join(" ")}
          >
            {step.value}
          </span>
        </div>

        <p
          key={`message-${stepIndex}`}
          className="countdown-message mt-5 min-h-8 text-base font-semibold text-white/85 sm:text-xl"
        >
          {step.message}
        </p>
      </div>

      <style jsx>{`
        .countdown-ring {
          animation: ring-progress
            ${STEP_DURATION_MS - 100}ms linear
            forwards;
        }

        .countdown-number {
          opacity: 0;
          text-shadow:
            0 0 12px
              rgba(255, 255, 255, 0.7),
            0 0 35px
              rgba(167, 139, 250, 0.95),
            0 0 80px
              rgba(124, 58, 237, 0.75);
          animation: number-burst
            ${STEP_DURATION_MS - 100}ms
            cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }

        .countdown-go {
          color: transparent;
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            #ddd6fe 42%,
            #a78bfa 100%
          );
          background-clip: text;
          -webkit-background-clip: text;
          animation-name: go-burst;
        }

        .countdown-pulse {
          opacity: 0;
          animation: pulse-explosion
            850ms ease-out forwards;
        }

        .countdown-particle {
          opacity: 0;
          animation: particle-burst
            750ms ease-out forwards;
          animation-delay: var(
            --particle-delay
          );
        }

        .countdown-message {
          opacity: 0;
          transform: translateY(10px);
          animation: message-reveal
            420ms ease forwards;
        }

        @keyframes ring-progress {
          from {
            stroke-dashoffset: 754;
          }

          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes number-burst {
          0% {
            opacity: 0;
            transform: scale(0.25)
              rotate(-8deg);
            filter: blur(14px);
          }

          28% {
            opacity: 1;
            transform: scale(1.15)
              rotate(2deg);
            filter: blur(0);
          }

          58% {
            transform: scale(0.96)
              rotate(0);
          }

          78% {
            opacity: 1;
            transform: scale(1);
          }

          100% {
            opacity: 0;
            transform: scale(1.55);
            filter: blur(8px);
          }
        }

        @keyframes go-burst {
          0% {
            opacity: 0;
            transform: scale(0.2);
            filter: blur(16px);
          }

          32% {
            opacity: 1;
            transform: scale(1.18);
            filter: blur(0);
          }

          55% {
            transform: scale(0.94);
          }

          75% {
            opacity: 1;
            transform: scale(1);
          }

          100% {
            opacity: 0;
            transform: scale(1.9);
            filter: blur(10px);
          }
        }

        @keyframes pulse-explosion {
          0% {
            opacity: 0.8;
            transform: scale(0.6);
          }

          100% {
            opacity: 0;
            transform: scale(2.3);
          }
        }

        @keyframes particle-burst {
          0% {
            opacity: 1;
            transform:
              translate(-50%, -50%)
              rotate(
                var(--particle-angle)
              )
              translateX(20px)
              scale(1);
          }

          100% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              rotate(
                var(--particle-angle)
              )
              translateX(
                var(--particle-distance)
              )
              scale(0);
          }
        }

        @keyframes message-reveal {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (
          prefers-reduced-motion: reduce
        ) {
          .countdown-ring,
          .countdown-number,
          .countdown-pulse,
          .countdown-particle,
          .countdown-message {
            animation-duration: 1ms;
            animation-iteration-count: 1;
          }
        }
      `}</style>
    </div>
  );
}