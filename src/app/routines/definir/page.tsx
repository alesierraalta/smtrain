"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  PlusCircle,
  Minus,
  Save,
  Moon,
  Sun,
  Copy,
  ChevronLeft,
  Dumbbell,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const darkModeColors = {
  background: "#121212",
  cardBackground: "#1E1E1E",
  textPrimary: "#FFFFFF",
  textSecondary: "#B0B0B0",
  inputBackground: "#2A2A2A",
  borderColor: "#3A3A3A",
  buttonBackground: "#000000",
  buttonHover: "#333333",
  accentColor: "#F59E0B",
  shadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
};

const lightModeColors = {
  background: "#F9FAFB",
  cardBackground: "#FFFFFF",
  textPrimary: "#111827",
  textSecondary: "#4B5563",
  inputBackground: "#F3F4F6",
  borderColor: "#D1D5DB",
  buttonBackground: "#000000",
  buttonHover: "#333333",
  accentColor: "#F59E0B",
  shadow: "0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03)",
  buttonText: "#FFFFFF",
};

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
}

interface Series {
  category: "hipertrofia" | "aproximacion" | "calentamiento" | "fuerza" | "tecnica";
  reps: number;
  weight: number;
  rpe: number;
  rir: number;
  maxTime: number;
  restTime: number;
}

interface IdealRoutine {
  series: Series[];
  exercise: Exercise;
}

const muscleGroups = [
  {
    id: "chest",
    name: "Pecho",
    exercises: ["Press de banca", "Aperturas con mancuernas", "Fondos"],
  },
  {
    id: "upperback",
    name: "Espalda Alta",
    exercises: ["Remo con barra", "Remo con mancuerna", "Face pull"],
  },
  {
    id: "lats",
    name: "Dorsales",
    exercises: ["Dominadas", "Pull-downs", "Remo en T"],
  },
  {
    id: "lowerback",
    name: "Espalda Baja",
    exercises: ["Hiperextensiones", "Buenos días", "Superman"],
  },
  {
    id: "quadriceps",
    name: "Cuádriceps",
    exercises: ["Sentadillas", "Prensa de piernas", "Extensiones de pierna"],
  },
  {
    id: "hamstrings",
    name: "Femorales",
    exercises: ["Peso muerto", "Curl de piernas", "Buenos días"],
  },
  {
    id: "calves",
    name: "Gemelos",
    exercises: ["Elevaciones de talón de pie", "Elevaciones de talón sentado"],
  },
  {
    id: "biceps",
    name: "Bíceps",
    exercises: ["Curl con barra", "Curl con mancuernas", "Curl de martillo"],
  },
  {
    id: "triceps",
    name: "Tríceps",
    exercises: ["Extensiones de tríceps", "Press francés", "Fondos en paralelas"],
  },
  {
    id: "shoulders",
    name: "Hombros",
    exercises: ["Press militar", "Elevaciones laterales", "Pájaros"],
  },
  {
    id: "abs",
    name: "Abdominales",
    exercises: ["Crunches", "Plancha", "Rueda abdominal"],
  },
  {
    id: "glutes",
    name: "Glúteos",
    exercises: ["Hip thrust", "Peso muerto", "Sentadillas"],
  },
];

const initialSeries: Series = {
  category: "hipertrofia",
  reps: 10,
  weight: 20,
  rpe: 7,
  rir: 3,
  maxTime: 45,
  restTime: 90,
};

const seriesCategories = [
  "hipertrofia",
  "aproximacion",
  "calentamiento",
  "fuerza",
  "tecnica",
];

const infoTexts = {
  category:
    "La categoría determina el enfoque principal de la serie. 'hipertrofia' => crecimiento muscular, 'fuerza' => levantar más peso, etc.",
  reps: "Repeticiones: el número de veces que se realiza un ejercicio en una serie.",
  weight:
    "Peso: la cantidad de resistencia utilizada. Se ajusta a tu objetivo y capacidad.",
  rir: "RIR (Repeticiones en Reserva): cuántas repes podrías hacer antes del fallo.",
  rpe: "RPE (Rate of Perceived Exertion): Escala 1-10 de esfuerzo percibido.",
  maxTime:
    "Tiempo Máximo: la duración límite para realizar la serie.",
  restTime:
    "Tiempo de Descanso: periodo de recuperación entre series.",
};

export default function DefinirRutina() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [routines, setRoutines] = useState<{ [key: string]: IdealRoutine }>({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [intensityMethod, setIntensityMethod] = useState<"rpe" | "rir">("rir");

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const savedTheme = localStorage.getItem("theme");
    const initialDarkMode =
      savedTheme === "dark" || (!savedTheme && darkModeMediaQuery.matches);
    setIsDarkMode(initialDarkMode);
    document.documentElement.classList.toggle("dark", initialDarkMode);

    const handleChange = (e: MediaQueryListEvent) => {
      if (!savedTheme) {
        setIsDarkMode(e.matches);
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };
    darkModeMediaQuery.addEventListener("change", handleChange);
    return () => darkModeMediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const ejercicios = searchParams.get("ejercicios");
    if (ejercicios) {
      const exerciseNames = ejercicios.split(",");
      const selected: Exercise[] = exerciseNames.map((name) => {
        const foundGroup = muscleGroups.find((g) => g.exercises.includes(name));
        return {
          id: name.toLowerCase().replace(/\s+/g, "-"),
          name,
          muscleGroup: foundGroup ? foundGroup.name : "Otro",
        };
      });

      setSelectedExercises(selected);

      const initial: { [key: string]: IdealRoutine } = {};
      selected.forEach((ex) => {
        initial[ex.id] = {
          series: [{ ...initialSeries }],
          exercise: ex,
        };
      });
      setRoutines(initial);
    }
  }, [searchParams]);

  const handleSeriesChange = useCallback(
    (
      exerciseId: string,
      seriesIndex: number,
      field: keyof Series | "rpe" | "rir",
      value: any
    ) => {
      setRoutines((prev) => ({
        ...prev,
        [exerciseId]: {
          ...prev[exerciseId],
          series: prev[exerciseId].series.map((s, idx) =>
            idx === seriesIndex ? { ...s, [field]: value } : s
          ),
        },
      }));
    },
    []
  );

  const addSeries = useCallback((exerciseId: string) => {
    setRoutines((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        series: [...prev[exerciseId].series, { ...initialSeries }],
      },
    }));
  }, []);

  const removeSeries = useCallback((exerciseId: string, seriesIndex: number) => {
    if (window.confirm("¿Estás seguro de eliminar esta serie?")) {
      setRoutines((prev) => ({
        ...prev,
        [exerciseId]: {
          ...prev[exerciseId],
          series: prev[exerciseId].series.filter((_, i) => i !== seriesIndex),
        },
      }));
    }
  }, []);

  const copySeries = useCallback((exerciseId: string, seriesIndex: number) => {
    setRoutines((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        series: [
          ...prev[exerciseId].series,
          { ...prev[exerciseId].series[seriesIndex] },
        ],
      },
    }));
  }, []);

  /**
   * Here we store the entire user-defined routine in localStorage
   * and then navigate to '/routines/empezar'.
   */
  const handleSubmit = () => {
    console.log("Routines saved:", routines);
    toast({
      title: "Rutina guardada",
      description: "Tu rutina ha sido guardada exitosamente.",
      duration: 3000,
      className: "bg-green-500 text-white",
    });

    // Store in localStorage
    localStorage.setItem("myCustomRoutine", JSON.stringify(routines));

    // Then go to /routines/empezar
    router.push("/routines/empezar");
  };

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  return (
    <>
      <div
        className={`min-h-screen transition-colors duration-300 w-full font-sans ${
          isDarkMode
            ? "bg-[var(--dark-background)] text-[var(--dark-textPrimary)]"
            : "bg-[var(--light-background)] text-[var(--light-textPrimary)]"
        }`}
        style={{
          "--dark-background": darkModeColors.background,
          "--dark-cardBackground": darkModeColors.cardBackground,
          "--dark-textPrimary": darkModeColors.textPrimary,
          "--dark-textSecondary": darkModeColors.textSecondary,
          "--dark-inputBackground": darkModeColors.inputBackground,
          "--dark-borderColor": darkModeColors.borderColor,
          "--dark-buttonBackground": darkModeColors.buttonBackground,
          "--dark-buttonHover": darkModeColors.buttonHover,
          "--dark-accentColor": darkModeColors.accentColor,
          "--dark-shadow": darkModeColors.shadow,
          "--light-background": lightModeColors.background,
          "--light-cardBackground": lightModeColors.cardBackground,
          "--light-textPrimary": lightModeColors.textPrimary,
          "--light-textSecondary": lightModeColors.textSecondary,
          "--light-inputBackground": lightModeColors.inputBackground,
          "--light-borderColor": lightModeColors.borderColor,
          "--light-buttonBackground": lightModeColors.buttonBackground,
          "--light-buttonHover": lightModeColors.buttonHover,
          "--light-accentColor": lightModeColors.accentColor,
          "--light-shadow": lightModeColors.shadow,
          "--light-buttonText": lightModeColors.buttonText,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-6 mb-10">
            <h1 className="text-4xl font-bold tracking-tight flex items-center">
              <Dumbbell className="w-10 h-10 mr-4 text-[var(--dark-accentColor)]" />
              Definir Rutina Ideal
            </h1>
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-full transition-colors duration-200 bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-[var(--dark-accentColor)]"
              aria-label={isDarkMode ? "Activar modo claro" : "Activar modo oscuro"}
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>

          {selectedExercises.length === 0 ? (
            <div className="text-center mt-16">
              <p className="text-xl mb-6">
                No se encontraron ejercicios seleccionados. Regresa para
                añadirlos.
              </p>
              <Button variant="outline" asChild className="text-lg px-6 py-3">
                <Link href="/exercises/selection">
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Volver a Selección
                </Link>
              </Button>
            </div>
          ) : (
            selectedExercises.map((exercise) => (
              <Card
                key={exercise.id}
                className={`mb-10 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] ${
                  isDarkMode
                    ? "bg-[var(--dark-cardBackground)] text-[var(--dark-textPrimary)] shadow-[var(--dark-shadow)]"
                    : "bg-[var(--light-cardBackground)] text-[var(--light-textPrimary)] shadow-[var(--light-shadow)]"
                }`}
              >
                <CardContent className="p-6">
                  <h2 className="text-3xl font-semibold mb-3 flex items-center">
                    <span className="mr-3">{exercise.name}</span>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        isDarkMode
                          ? "bg-[var(--dark-accentColor)] text-[var(--dark-textPrimary)]"
                          : "bg-[var(--light-accentColor)] text-[var(--light-buttonText)]"
                      }`}
                    >
                      {exercise.muscleGroup}
                    </span>
                  </h2>

                  {routines[exercise.id]?.series.map((series, seriesIndex) => (
                    <div
                      key={seriesIndex}
                      className={`mb-8 p-6 rounded-lg border transition-colors ${
                        isDarkMode
                          ? "bg-[var(--dark-inputBackground)] border-[var(--dark-borderColor)] text-[var(--dark-textPrimary)]"
                          : "bg-[var(--light-inputBackground)] border-[var(--light-borderColor)] text-[var(--light-textPrimary)]"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-medium">
                          Serie {seriesIndex + 1}
                        </h3>
                        <div className="flex gap-3">
                          {seriesIndex > 0 && (
                            <Button
                              variant="outline"
                              onClick={() => removeSeries(exercise.id, seriesIndex)}
                              className={`transition-colors duration-200 ${
                                isDarkMode
                                  ? "bg-[var(--dark-buttonBackground)] text-white hover:bg-[var(--dark-buttonHover)]"
                                  : "bg-[var(--light-buttonBackground)] text-white hover:bg-[var(--light-buttonHover)]"
                              }`}
                            >
                              <Minus className="w-5 h-5 mr-2" />
                              Eliminar Serie
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => copySeries(exercise.id, seriesIndex)}
                            className={`transition-colors duration-200 ${
                              isDarkMode
                                ? "bg-[var(--dark-buttonBackground)] text-white hover:bg-[var(--dark-buttonHover)]"
                                : "bg-[var(--light-buttonBackground)] text-white hover:bg-[var(--light-buttonHover)]"
                            }`}
                          >
                            <Copy className="w-5 h-5 mr-2" />
                            Copiar Serie
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {/* CATEGORÍA */}
                        <div className="flex flex-col">
                          <div className="flex items-center mb-2">
                            <Label className="text-base font-semibold mr-2">
                              Categoría
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-8 h-8 p-0">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <p>{infoTexts.category}</p>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <Select
                            value={series.category}
                            onValueChange={(value) =>
                              handleSeriesChange(exercise.id, seriesIndex, "category", value)
                            }
                          >
                            <SelectTrigger
                              className={`transition-colors duration-200 ${
                                isDarkMode
                                  ? "bg-[var(--dark-inputBackground)] text-[var(--dark-textPrimary)]"
                                  : "bg-[var(--light-inputBackground)] text-[var(--light-textPrimary)]"
                              }`}
                            >
                              <SelectValue placeholder="Categoría" />
                            </SelectTrigger>
                            <SelectContent
                              className={cn(
                                isDarkMode
                                  ? "bg-[var(--dark-cardBackground)] border-[var(--dark-borderColor)]"
                                  : "bg-white border-[var(--light-borderColor)]",
                                "border rounded-md shadow-md"
                              )}
                            >
                              {seriesCategories.map((cat) => (
                                <SelectItem
                                  key={cat}
                                  value={cat}
                                  className={
                                    isDarkMode
                                      ? "text-[var(--dark-textPrimary)] hover:bg-[var(--dark-inputBackground)]"
                                      : "text-[var(--light-textPrimary)] hover:bg-[var(--light-inputBackground)]"
                                  }
                                >
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* REPETICIONES */}
                        <div className="flex flex-col">
                          <div className="flex items-center mb-2">
                            <Label className="text-base font-semibold mr-2">
                              Repeticiones
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-8 h-8 p-0">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <p>{infoTexts.reps}</p>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <Input
                            type="number"
                            value={series.reps}
                            onChange={(e) =>
                              handleSeriesChange(
                                exercise.id,
                                seriesIndex,
                                "reps",
                                Math.max(
                                  1,
                                  Math.min(100, Number.parseInt(e.target.value) || 0)
                                )
                              )
                            }
                            min={1}
                            max={100}
                            className={`transition-colors duration-200 ${
                              isDarkMode
                                ? "bg-[var(--dark-inputBackground)] text-[var(--dark-textPrimary)]"
                                : "bg-[var(--light-inputBackground)] text-[var(--light-textPrimary)]"
                            }`}
                          />
                        </div>

                        {/* PESO */}
                        <div className="flex flex-col">
                          <div className="flex items-center mb-2">
                            <Label className="text-base font-semibold mr-2">
                              Peso (kg)
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-8 h-8 p-0">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <p>{infoTexts.weight}</p>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <Input
                            type="number"
                            value={series.weight}
                            onChange={(e) =>
                              handleSeriesChange(
                                exercise.id,
                                seriesIndex,
                                "weight",
                                Math.max(
                                  0,
                                  Math.min(1000, Number.parseInt(e.target.value) || 0)
                                )
                              )
                            }
                            className={`transition-colors duration-200 ${
                              isDarkMode
                                ? "bg-[var(--dark-inputBackground)] text-[var(--dark-textPrimary)]"
                                : "bg-[var(--light-inputBackground)] text-[var(--light-textPrimary)]"
                            }`}
                            min={0}
                            max={1000}
                          />
                        </div>

                        {/* MÉTODO DE INTENSIDAD: RPE O RIR */}
                        <div className="flex flex-col">
                          <div className="flex items-center mb-2">
                            <Label className="text-base font-semibold mr-2">
                              Método de Intensidad
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-8 h-8 p-0">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <p>Elige entre RPE o RIR para medir la intensidad.</p>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <Select
                            value={intensityMethod}
                            onValueChange={(value) =>
                              setIntensityMethod(value as "rpe" | "rir")
                            }
                          >
                            <SelectTrigger
                              className={`transition-colors duration-200 ${
                                isDarkMode
                                  ? "bg-[var(--dark-inputBackground)] text-[var(--dark-textPrimary)] border-[var(--dark-borderColor)]"
                                  : "bg-[var(--light-inputBackground)] text-[var(--light-textPrimary)] border-[var(--light-borderColor)]"
                              }`}
                            >
                              <SelectValue placeholder="Método de Intensidad" />
                            </SelectTrigger>
                            <SelectContent
                              className={cn(
                                isDarkMode
                                  ? "bg-[var(--dark-cardBackground)] border-[var(--dark-borderColor)]"
                                  : "bg-white border-[var(--light-borderColor)]",
                                "border rounded-md shadow-md"
                              )}
                            >
                              <SelectItem
                                value="rpe"
                                className={
                                  isDarkMode
                                    ? "text-[var(--dark-textPrimary)] hover:bg-[var(--dark-inputBackground)]"
                                    : "text-[var(--light-textPrimary)] hover:bg-[var(--light-inputBackground)]"
                                }
                              >
                                RPE
                              </SelectItem>
                              <SelectItem
                                value="rir"
                                className={
                                  isDarkMode
                                    ? "text-[var(--dark-textPrimary)] hover:bg-[var(--dark-inputBackground)]"
                                    : "text-[var(--light-textPrimary)] hover:bg-[var(--light-inputBackground)]"
                                }
                              >
                                RIR
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* RPE/RIR => SLIDER 0-10 */}
                        <div className="sm:col-span-2 md:col-span-3">
                          <div className="flex items-center mb-2">
                            <Label className="text-base font-semibold mr-2">
                              {intensityMethod === "rpe" ? "RPE (1-10)" : "RIR (0-10)"}
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-8 h-8 p-0">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <p>
                                  {intensityMethod === "rpe"
                                    ? infoTexts.rpe
                                    : infoTexts.rir}
                                </p>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="relative pt-8 pb-4">
                            <Slider
                              min={intensityMethod === "rpe" ? 1 : 0}
                              max={10}
                              step={1}
                              value={[
                                intensityMethod === "rpe"
                                  ? series.rpe
                                  : series.rir,
                              ]}
                              onValueChange={(value) =>
                                handleSeriesChange(
                                  exercise.id,
                                  seriesIndex,
                                  intensityMethod,
                                  value[0]
                                )
                              }
                              className={`${isDarkMode ? "dark-slider" : "light-slider"}`}
                            />
                            <div
                              className={`absolute top-0 left-0 w-full flex justify-between text-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {(intensityMethod === "rpe"
                                ? [1, 3, 5, 7, 9, 10]
                                : [0, 2, 4, 6, 8, 10]
                              ).map((val) => (
                                <span key={val}>{val}</span>
                              ))}
                            </div>
                            <div
                              className={`absolute -top-6 transition-all duration-200 text-lg font-semibold ${
                                isDarkMode ? "text-white" : "text-black"
                              }`}
                              style={{
                                left: `calc(${
                                  ((intensityMethod === "rpe"
                                    ? series.rpe - 1
                                    : series.rir) /
                                    10) *
                                  100
                                }% - 12px)`,
                              }}
                            >
                              {intensityMethod === "rpe"
                                ? series.rpe
                                : series.rir}
                            </div>
                          </div>
                        </div>

                        {/* TIEMPO MAXIMO (seg) */}
                        <div className="flex flex-col">
                          <div className="flex items-center mb-2">
                            <Label className="text-base font-semibold mr-2">
                              Tiempo Máximo (seg)
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-8 h-8 p-0">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <p>{infoTexts.maxTime}</p>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <Input
                            type="number"
                            value={series.maxTime}
                            onChange={(e) =>
                              handleSeriesChange(
                                exercise.id,
                                seriesIndex,
                                "maxTime",
                                Math.max(
                                  1,
                                  Math.min(
                                    3600,
                                    Number.parseInt(e.target.value) || 0
                                  )
                                )
                              )
                            }
                            min={1}
                            max={3600}
                            className={`transition-colors duration-200 ${
                              isDarkMode
                                ? "bg-[var(--dark-inputBackground)] text-[var(--dark-textPrimary)]"
                                : "bg-[var(--light-inputBackground)] text-[var(--light-textPrimary)]"
                            }`}
                          />
                        </div>

                        {/* TIEMPO DE DESCANSO (seg) */}
                        <div className="flex flex-col">
                          <div className="flex items-center mb-2">
                            <Label className="text-base font-semibold mr-2">
                              Tiempo de Descanso (seg)
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-8 h-8 p-0">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <p>{infoTexts.restTime}</p>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <Input
                            type="number"
                            value={series.restTime}
                            onChange={(e) =>
                              handleSeriesChange(
                                exercise.id,
                                seriesIndex,
                                "restTime",
                                Math.max(
                                  0,
                                  Math.min(
                                    3600,
                                    Number.parseInt(e.target.value) || 0
                                  )
                                )
                              )
                            }
                            min={0}
                            max={3600}
                            className={`transition-colors duration-200 ${
                              isDarkMode
                                ? "bg-[var(--dark-inputBackground)] text-[var(--dark-textPrimary)]"
                                : "bg-[var(--light-inputBackground)] text-[var(--light-textPrimary)]"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={() => addSeries(exercise.id)}
                    className={`mt-6 transition-colors duration-200 ${
                      isDarkMode
                        ? "bg-[var(--dark-buttonBackground)] text-white hover:bg-[var(--dark-buttonHover)]"
                        : "bg-[var(--light-buttonBackground)] text-white hover:bg-[var(--light-buttonHover)]"
                    }`}
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Añadir Serie
                  </Button>
                </CardContent>
              </Card>
            ))
          )}

          <div className="flex flex-col sm:flex-row justify-between mt-10 gap-4">
            <Button
              variant="outline"
              asChild
              className={`transition-colors duration-200 text-lg px-6 py-3 ${
                isDarkMode
                  ? "bg-[var(--dark-buttonBackground)] text-white hover:bg-[var(--dark-buttonHover)]"
                  : "bg-[var(--light-buttonBackground)] text-white hover:bg-[var(--light-buttonHover)]"
              }`}
            >
              <Link href="/exercises/selection">
                <ChevronLeft className="w-5 h-5 mr-2" />
                Volver
              </Link>
            </Button>
            <Button
              onClick={handleSubmit}
              className={`transition-colors duration-200 text-lg px-6 py-3 ${
                isDarkMode
                  ? "bg-[var(--dark-buttonBackground)] text-white hover:bg-[var(--dark-buttonHover)]"
                  : "bg-[var(--light-buttonBackground)] text-white hover:bg-[var(--light-buttonHover)]"
              }`}
            >
              <Save className="w-5 h-5 mr-2" />
              Guardar y Continuar
            </Button>
          </div>
        </div>
        <Toaster
          toastOptions={{
            className: cn(
              "bg-white text-black dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700",
              "shadow-lg rounded-md p-4",
              "flex items-center justify-between"
            ),
          }}
        />
      </div>

      <style jsx global>{`
        .dark-slider .slider-thumb {
          background-color: var(--dark-accentColor);
          width: 24px;
          height: 24px;
          border: 2px solid white;
        }
        .dark-slider .slider-track {
          background-color: var(--dark-borderColor);
          height: 4px;
        }
        .light-slider .slider-thumb {
          background-color: var(--light-accentColor);
          width: 24px;
          height: 24px;
          border: 2px solid white;
        }
        .light-slider .slider-track {
          background-color: var(--light-borderColor);
          height: 4px;
        }
        .slider-thumb:hover {
          box-shadow: 0 0 0 8px rgba(245, 158, 11, 0.2);
        }
      `}</style>
    </>
  );
}
