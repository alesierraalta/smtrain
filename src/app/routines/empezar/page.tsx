// app/routines/empezar/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Pause,
  SkipForward,
  Check,
  Moon,
  Sun,
  ChevronRight,
  AlertTriangle,
  Activity,
  Plus,
  Minus,
  Info
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

import { TimerDisplay } from "./TimerDisplay"; // <--- importamos el named export "TimerDisplay"

// Interfaz de series con { ideal, real } & efficiency
interface SeriesValue {
  ideal: number;
  real: number;
}
interface Series {
  category: string;
  reps: number | SeriesValue;
  weight: number | SeriesValue;
  rir: number | SeriesValue;
  maxTime: number | SeriesValue;
  restTime: number | SeriesValue | number;
  efficiency?: number;
}
interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
}
interface IdealRoutine {
  exercise: Exercise;
  series: Series[];
}

export default function EmpezarRutina() {
  const router = useRouter();
  const { toast } = useToast();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [routineData, setRoutineData] = useState<IdealRoutine[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Indices
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(0);

  // Timer
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

  // Form
  const [showForm, setShowForm] = useState(false);
  const [actualData, setActualData] = useState<Series | null>(null);
  const [isSeriesComplete, setIsSeriesComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  // Dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialMode = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDarkMode(initialMode);
    document.documentElement.classList.toggle("dark", initialMode);
  }, []);

  // Lee la rutina de localStorage
  useEffect(() => {
    setIsLoading(true);
    try {
      const raw = localStorage.getItem("myCustomRoutine");
      if (raw) {
        const parsed = JSON.parse(raw) as { [exerciseId: string]: IdealRoutine };
        const arrayVersion = Object.values(parsed);
        setRoutineData(arrayVersion);

        if (arrayVersion.length > 0 && arrayVersion[0].series.length > 0) {
          setCurrentSeriesIndex(0);
          setActualData(arrayVersion[0].series[0]);
        }
      } else {
        console.log("No custom routine in localStorage");
      }
    } catch (err) {
      console.error("Error reading localStorage routine:", err);
      toast({
        title: "Error",
        description: "No se pudo cargar la rutina desde localStorage",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Calcular progreso
  useEffect(() => {
    if (!routineData || routineData.length === 0) return;
    const totalSeries = routineData.reduce(
      (acc, ex) => acc + ex.series.length,
      0
    );
    let completedSeries = 0;
    for (let i = 0; i < currentExerciseIndex; i++) {
      completedSeries += routineData[i].series.length;
    }
    completedSeries += currentSeriesIndex;
    const progressValue = Math.round((completedSeries / totalSeries) * 100);
    setProgress(progressValue);
  }, [currentExerciseIndex, currentSeriesIndex, routineData]);

  // Timer
  const handleToggleTimer = () => {
    if (isTimerRunning) {
      if (intervalId) clearInterval(intervalId);
      setIsTimerRunning(false);
    } else {
      const id = setInterval(() => setTimer((p) => p + 1), 1000);
      setIntervalId(id);
      setIsTimerRunning(true);
    }
  };

  // Al pulsar "Completar"
  const handleSeriesComplete = () => {
    setIsTimerRunning(false);
    if (intervalId) clearInterval(intervalId);
    setIsSeriesComplete(true);

    setTimeout(() => {
      setIsSeriesComplete(false);
      setShowForm(true);
    }, 600);
  };

  // Omitir => real=ideal
  const skipForm = () => {
    toast({
      title: "Se han usado valores ideales",
      description: "Omitir indica que hiciste la serie como estaba planeada",
      icon: <Info className="text-blue-600" />,
    });

    const updated = produceDataReal(true);
    updateRoutineData(updated);

    nextSeries();
  };

  // Guardar => user definió real
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = produceDataReal(false);
    updateRoutineData(updated);

    nextSeries();
  };

  // produceDataReal
  const produceDataReal = (skip: boolean) => {
    if (!routineData) return {} as Series;
    const original = routineData[currentExerciseIndex].series[currentSeriesIndex];

    // ideal
    const idealReps =
      typeof original.reps === "object" ? original.reps.ideal : original.reps;
    const idealWeight =
      typeof original.weight === "object" ? original.weight.ideal : original.weight;

    let realReps = idealReps, realWeight = idealWeight;
    if (!skip && actualData) {
      realReps =
        typeof actualData.reps === "object" ? actualData.reps.ideal : actualData.reps;
      realWeight =
        typeof actualData.weight === "object" ? actualData.weight.ideal : actualData.weight;
    }

    // Efficiency
    let ratioReps = 1, ratioWeight = 1;
    if (idealReps > 0) ratioReps = realReps / idealReps;
    if (idealWeight > 0) ratioWeight = realWeight / idealWeight;
    let eff = ((ratioReps + ratioWeight) / 2) * 100;
    eff = Math.max(0, Math.min(eff, 200));

    return {
      ...original,
      reps: { ideal: idealReps, real: realReps },
      weight: { ideal: idealWeight, real: realWeight },
      efficiency: eff
    };
  };

  // updateRoutineData => rewrite localStorage
  const updateRoutineData = (newSeries: Series) => {
    if (!routineData) return;
    const clone = [...routineData];
    clone[currentExerciseIndex] = {
      ...clone[currentExerciseIndex],
      series: clone[currentExerciseIndex].series.map((s, i) =>
        i === currentSeriesIndex ? newSeries : s
      )
    };
    setRoutineData(clone);

    const obj = Object.fromEntries(clone.map((item, i) => {
      return [`${item.exercise.id}_${i}`, item];
    }));
    localStorage.setItem("myCustomRoutine", JSON.stringify(obj));
  };

  // nextSeries
  const nextSeries = () => {
    if (!routineData || routineData.length === 0) return;
    const currEx = routineData[currentExerciseIndex];
    const nxtIndex = currentSeriesIndex + 1;

    if (nxtIndex < currEx.series.length) {
      setCurrentSeriesIndex(nxtIndex);
    } else if (currentExerciseIndex + 1 < routineData.length) {
      const nextEx = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextEx);
      setCurrentSeriesIndex(0);
    } else {
      // Fin
      toast({
        title: "¡Rutina completada!",
        description: "Redirigiendo al resumen...",
      });
      setTimeout(() => {
        router.push("/routines/resumen");
      }, 1500);
      return;
    }

    setTimer(0);
    setShowForm(false);
    setIsSeriesComplete(false);

    // En lugar de sheet, iremos a la pantalla de descanso
    toast({
      title: "¡Serie completada!",
      description: "Ahora descansa: presiona Continuar en la pantalla de descanso",
    });

    router.push(`/routines/empezar/rest?ex=${currentExerciseIndex}&se=${currentSeriesIndex}`);
  };

  // showValue => si reps/weight es {ideal,real} => .ideal
  const showValue = (val: number | { ideal: number; real: number }) => {
    if (typeof val === "object") return val.ideal;
    return val;
  };

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 w-full font-sans">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Un simple skeleton */}
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-8" />
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-8 animate-pulse" />
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
            {/* ... */}
          </div>
        </div>
      </div>
    );
  }
  // Fallback => no data
  if (!routineData || routineData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <Card className="w-full max-w-md mx-auto shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl sm:text-3xl font-bold">No se encontró rutina</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="rounded-lg p-6 bg-amber-50 dark:bg-amber-900/20 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-amber-500 dark:text-amber-400" />
              <p className="text-lg">Primero debes definir tu rutina</p>
            </div>
            <Button 
              onClick={() => router.push("/routines/definir")}
              className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300"
            >
              Ir a Definir Rutina
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // current
  const currentExercise = routineData[currentExerciseIndex];
  const currentSeries = currentExercise.series[currentSeriesIndex];

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300 w-full font-sans bg-gradient-to-b",
        isDarkMode ? "from-gray-900 to-gray-800 text-white" : "from-gray-50 to-gray-100 text-gray-900"
      )}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Titulo + switch dark */}
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 sm:gap-6 mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center">
            <Activity className="mr-3 h-8 w-8 text-blue-500 dark:text-blue-400" />
            Empezar Rutina
          </h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const newVal = !isDarkMode;
              setIsDarkMode(newVal);
              localStorage.setItem("theme", newVal ? "dark" : "light");
              document.documentElement.classList.toggle("dark", newVal);
            }}
            className="p-3 rounded-full transition-all duration-300 hover:scale-110 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </Button>
        </div>

        {/* Barra Progreso */}
        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium flex items-center">
                <Activity className="h-4 w-4 mr-1.5" />
                Progreso total
              </span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 sm:h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 sm:h-3 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Ejercicio {currentExerciseIndex + 1}/{routineData.length}</span>
              <span>Serie {currentSeriesIndex + 1}/{currentExercise.series.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card => Serie Actual */}
        <Card
          className={cn(
            "hover:shadow-xl transition-all duration-500 transform bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0",
            isSeriesComplete
              ? "scale-105 bg-green-50 dark:bg-green-900/20 shadow-green-200 dark:shadow-green-900/40"
              : "hover:scale-[1.02]"
          )}
        >
          <CardContent className="p-5 sm:p-7">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    {currentExercise.exercise.name}
                  </h2>
                  {isSeriesComplete && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 animate-pulse">
                      <Check className="mr-1 h-3.5 w-3.5" />
                      ¡Completado!
                    </span>
                  )}
                </div>
                <p className="mb-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Grupo muscular: {currentExercise.exercise.muscleGroup}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-base sm:text-lg font-medium">
                    Serie {currentSeriesIndex + 1} de {currentExercise.series.length}
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                    {currentSeries.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {/* Repeticiones */}
              <div className="bg-gray-50 dark:bg-gray-800/80 p-4 rounded-xl transition-all duration-300 hover:shadow-md flex flex-col items-center sm:items-start border border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Repeticiones
                </p>
                <p className="text-xl sm:text-2xl font-bold mb-1">
                  {showValue(currentSeries.reps)}
                </p>
                <div className="w-full h-1 bg-blue-100 dark:bg-blue-900/30 rounded-full" />
              </div>
              {/* Peso */}
              <div className="bg-gray-50 dark:bg-gray-800/80 p-4 rounded-xl transition-all duration-300 hover:shadow-md flex flex-col items-center sm:items-start border border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Peso (kg)
                </p>
                <p className="text-xl sm:text-2xl font-bold mb-1">
                  {showValue(currentSeries.weight)}
                </p>
                <div className="w-full h-1 bg-blue-100 dark:bg-blue-900/30 rounded-full" />
              </div>
              {/* RIR */}
              <div className="p-4 rounded-xl transition-all duration-300 hover:shadow-md flex flex-col items-center sm:items-start col-span-2 sm:col-span-1 border border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium opacity-80 mb-1">RIR</p>
                <p className="text-xl sm:text-2xl font-bold mb-1">
                  {typeof currentSeries.rir === "object"
                    ? currentSeries.rir.ideal
                    : currentSeries.rir}
                </p>
                <div className="w-full h-1 bg-current opacity-20 rounded-full" />
              </div>
            </div>

            {/* Timer principal */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <TimerDisplay
                time={timer}
                isRunning={isTimerRunning}
                toggleTimer={handleToggleTimer}
                className="w-full sm:w-auto"
              />

              <div className="flex flex-wrap justify-center sm:justify-end gap-3 w-full sm:w-auto">
                <Button
                  onClick={handleSeriesComplete}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-md hover:shadow-lg text-base px-6"
                >
                  <Check className="mr-2" />
                  Completar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {showForm && actualData && (
          <Card className="mt-6 sm:mt-8 hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-4px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl font-semibold flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full mr-2 inline-block"></div>
                Datos reales de la serie
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Reps */}
                <div className="bg-gray-50 dark:bg-gray-800/80 p-4 rounded-xl">
                  <Label className="text-base font-semibold mb-2 block">
                    Repeticiones realizadas
                  </Label>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => adjustValue("reps", -1)}
                      className="rounded-full"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={
                        typeof actualData.reps === "object"
                          ? actualData.reps.ideal
                          : actualData.reps
                      }
                      onChange={(e) =>
                        handleInputChange("reps", parseInt(e.target.value))
                      }
                      className="w-full text-center mx-2"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => adjustValue("reps", 1)}
                      className="rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {/* Peso */}
                <div className="bg-gray-50 dark:bg-gray-800/80 p-4 rounded-xl">
                  <Label className="text-base font-semibold mb-2 block">
                    Peso utilizado (kg)
                  </Label>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => adjustValue("weight", -2.5)}
                      className="rounded-full"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      step="2.5"
                      value={
                        typeof actualData.weight === "object"
                          ? actualData.weight.ideal
                          : actualData.weight
                      }
                      onChange={(e) =>
                        handleInputChange("weight", parseFloat(e.target.value))
                      }
                      className="w-full text-center mx-2"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => adjustValue("weight", 2.5)}
                      className="rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {/* RIR */}
                <div className="bg-gray-50 dark:bg-gray-800/80 p-4 rounded-xl">
                  <Label className="text-base font-semibold mb-2 block">
                    RIR real
                  </Label>
                  <div className="grid grid-cols-6 gap-2">
                    {[0, 1, 2, 3, 4, 5].map((value) => {
                      const isSelected =
                        (typeof actualData.rir === "number" && actualData.rir === value) ||
                        (typeof actualData.rir === "object" && actualData.rir.ideal === value);

                      const colorClass =
                        value <= 1
                          ? "bg-red-600 hover:bg-red-700"
                          : value <= 3
                          ? "bg-amber-600 hover:bg-amber-700"
                          : "bg-emerald-600 hover:bg-emerald-700";

                      return (
                        <Button
                          key={value}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          className={cn(
                            "w-full h-12 rounded-lg transition-all",
                            isSelected ? colorClass : "hover:bg-gray-200 dark:hover:bg-gray-700"
                          )}
                          onClick={() => handleInputChange("rir", value)}
                        >
                          {value}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Botones => Omitir / Guardar */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={skipForm}
                    className="transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 text-base px-5 py-3 flex items-center"
                  >
                    <SkipForward className="mr-2" size={18} />
                    Omitir
                    <Info className="ml-2 h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg text-base px-5 py-3"
                  >
                    Guardar y Continuar
                    <ChevronRight className="ml-2" size={18} />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
