// app/routines/empezar/rest/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { TimerDisplay } from "@/app/routines/empezar/TimerDisplay"; // <--- import
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RestScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const exIndex = parseInt(searchParams.get("ex") || "0");
  const seIndex = parseInt(searchParams.get("se") || "0");

  const [restTime, setRestTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (isRunning) {
      const id = setInterval(() => setRestTime((r) => r + 1), 1000);
      setIntervalId(id);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning]);

  const handleToggleRest = () => {
    if (isRunning) {
      if (intervalId) clearInterval(intervalId);
      setIsRunning(false);
    } else {
      const id = setInterval(() => setRestTime((r) => r + 1), 1000);
      setIntervalId(id);
      setIsRunning(true);
    }
  };

  // Cuando usuario está listo para continuar => volver a la principal
  const handleContinue = () => {
    router.push("/routines/empezar");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6 flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold">Descanso</h1>
          <TimerDisplay 
            time={restTime}
            isRunning={isRunning}
            toggleTimer={handleToggleRest}
          />
          <Button onClick={handleContinue} className="mt-4">
            Continuar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
