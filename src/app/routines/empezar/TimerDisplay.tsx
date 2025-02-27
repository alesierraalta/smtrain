// app/routines/empezar/TimerDisplay.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  /** Cantidad de segundos a mostrar en el temporizador */
  time: number;
  /** Si el timer está corriendo */
  isRunning: boolean;
  /** Función para toggle (pausar/iniciar) */
  toggleTimer: () => void;
  /** Clases CSS opcionales */
  className?: string;
}

/**
 * TimerDisplay: Componente de UI para mostrar un temporizador circular
 * con un `time`, un `isRunning` y un botón para pausar o reanudar.
 */
export function TimerDisplay({
  time,
  isRunning,
  toggleTimer,
  className
}: TimerDisplayProps) {
  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const circleLength = 283; // ~2π*45
  // offset según 'time % 60' (si quisieras un “tiempo por minuto,” p.ej.)
  const circleOffset = circleLength * Math.max(0, 1 - (time % 60) / 60);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full bg-slate-100 dark:bg-slate-800 shadow-inner overflow-hidden transition-all duration-300 hover:shadow-md">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-slate-200 dark:text-slate-700 stroke-current"
            cx="50"
            cy="50"
            r="45"
            strokeWidth="6"
            fill="none"
          />
          <circle
            className={cn(
              "text-blue-500 dark:text-blue-400 stroke-current transition-all duration-300",
              isRunning ? "opacity-100" : "opacity-60"
            )}
            cx="50"
            cy="50"
            r="45"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circleLength}
            strokeDashoffset={circleOffset}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div
          className={cn(
            "text-2xl md:text-3xl font-bold z-10 transition-all duration-300",
            isRunning ? "scale-110 text-blue-600 dark:text-blue-400" : ""
          )}
        >
          {formatTime(time)}
        </div>
      </div>
      <Button
        onClick={toggleTimer}
        variant="outline"
        size="sm"
        className="mt-2 transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
        {isRunning ? "Pausar" : "Iniciar"}
      </Button>
    </div>
  );
}
