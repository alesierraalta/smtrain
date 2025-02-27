"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dumbbell, Home, Sun, Moon, ArrowUpCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

/**
 * Estructuras simplificadas según los cambios:
 * - Eliminamos "intensity", "volume", "tonelaje".
 * - 'maxTime' -> 'duracion'.
 * - Se muestra "descanso" solo si no es la primera serie.
 * - Se adapta a rpe o rir (mostramos lo que exista).
 */

// Definimos la forma final de cada "SeriesMetrics".
interface SeriesMetrics {
  category: string;
  // Reps y Weight con ideal vs real
  reps: { ideal: number; real: number };
  weight: { ideal: number; real: number };
  // El usuario puede haber usado RPE o RIR. Uno de los dos.
  rpe?: { ideal: number; real: number };
  rir?: { ideal: number; real: number };
  duracion: { ideal: number; real: number };
  restTime: { ideal: number; real: number };
  efficiency: number; // Para pintar color y mostrar
}

// Cada ejercicio
interface ExerciseData {
  name: string;
  series: SeriesMetrics[];
}

export default function ResumenEntrenamiento() {
  const router = useRouter();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [routineData, setRoutineData] = useState<ExerciseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Cargamos el tema
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialMode = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDarkMode(initialMode);
    document.documentElement.classList.toggle("dark", initialMode);
  }, []);

  // Control del botón de scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Leemos la rutina final guardada en localStorage
  useEffect(() => {
    setIsLoading(true);
    try {
      const raw = localStorage.getItem("myCustomRoutine");
      if (raw) {
        const parsed = JSON.parse(raw);
        const arrayVersion = convertDataToSummaryFormat(parsed);
        setRoutineData(arrayVersion);
      } else {
        console.log("No se encontró rutina final en localStorage.");
      }
    } catch (err) {
      console.error("Error al leer rutina final:", err);
    } finally {
      setTimeout(() => setIsLoading(false), 800); // Simular carga para mejor UX
    }
  }, []);

  const toggleTheme = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    localStorage.setItem("theme", newVal ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newVal);
  };

  // Helper para formatear tiempo: mm:ss
  const formatTime = (segundos: number) => {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  // Color para la eficiencia
  const getEfficiencyColor = (eff: number) => {
    if (eff >= 90) return "bg-green-600 dark:bg-green-500 text-white";
    if (eff >= 70) return "bg-yellow-600 dark:bg-yellow-500 text-white";
    return "bg-red-600 dark:bg-red-500 text-white";
  };

  // Texto para la eficiencia (accesibilidad)
  const getEfficiencyText = (eff: number) => {
    if (eff >= 90) return "Excelente";
    if (eff >= 70) return "Buena";
    return "Baja";
  };

  // Calcula la eficiencia global de un ejercicio
  const computeOverallEfficiency = (exercise: ExerciseData) => {
    if (!exercise.series.length) return 0;
    const sum = exercise.series.reduce((acc, s) => acc + s.efficiency, 0);
    return (sum / exercise.series.length).toFixed(2);
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300 w-full font-sans",
        isDarkMode ? "bg-neutral-900 text-white" : "bg-neutral-50 text-neutral-900"
      )}
    >
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Migas de pan" className="text-sm mb-6">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">Inicio</a></li>
            <li className="flex items-center space-x-2">
              <span>/</span>
              <span>Resumen de Entrenamiento</span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-6 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center">
            <Dumbbell className="w-8 h-8 mr-3" aria-hidden="true" />
            <span>Resumen del Entrenamiento</span>
          </h1>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.push("/")}
              className="flex items-center gap-2"
              title="Volver a la página de inicio"
            >
              <Home className="h-5 w-5" aria-hidden="true" />
              <span className="hidden sm:inline">Inicio</span>
            </Button>

            <Button 
              variant="outline" 
              onClick={toggleTheme}
              aria-pressed={isDarkMode}
              aria-label={`Cambiar a tema ${isDarkMode ? "claro" : "oscuro"}`}
              title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {isDarkMode ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
              <span className="sr-only">{isDarkMode ? "Modo claro" : "Modo oscuro"}</span>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="mb-6">
                <CardHeader>
                  <div className="h-8 w-1/3 bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2].map(j => (
                      <div key={j} className="space-y-2">
                        <div className="h-6 w-1/4 bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded"></div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {[1, 2, 3, 4].map(k => (
                            <div key={k} className="h-24 bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded"></div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : routineData.length === 0 ? (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>No se encontraron datos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base mb-4">No se encontró información del entrenamiento. Posibles causas:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>No has completado ningún entrenamiento aún</li>
                <li>Los datos del entrenamiento fueron eliminados</li>
                <li>Hay un problema con el almacenamiento de la aplicación</li>
              </ul>
              <Button 
                className="mt-6" 
                onClick={() => router.push("/crear-rutina")}
              >
                Crear nueva rutina
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <StatCard 
                title="Total de ejercicios" 
                value={routineData.length} 
                icon={<Dumbbell className="h-5 w-5" />} 
              />
              <StatCard 
                title="Total de series" 
                value={routineData.reduce((acc, ex) => acc + ex.series.length, 0)} 
                icon={<ArrowUpCircle className="h-5 w-5" />} 
              />
              <StatCard 
                title="Eficiencia promedio" 
                value={`${(routineData.reduce((acc, ex) => {
                  const eff = parseFloat(computeOverallEfficiency(ex));
                  return acc + eff;
                }, 0) / routineData.length).toFixed(2)}%`} 
                icon={<Info className="h-5 w-5" />} 
              />
            </div>
            
            {/* Exercises */}
            {routineData.map((exercise, exIndex) => {
              const overallEff = parseFloat(computeOverallEfficiency(exercise));
              return (
                <Card
                  key={exIndex}
                  className={cn(
                    "mb-10 transition-all duration-300 transform hover:shadow-lg border-l-4",
                    overallEff >= 90 ? "border-l-green-500" : 
                    overallEff >= 70 ? "border-l-yellow-500" : "border-l-red-500"
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <CardTitle className="text-xl sm:text-2xl">
                        {exercise.name}
                      </CardTitle>
                      <div 
                        className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium",
                          getEfficiencyColor(overallEff)
                        )}
                        title={`${getEfficiencyText(overallEff)} eficiencia`}
                      >
                        Eficiencia: {computeOverallEfficiency(exercise)}%
                        <span className="sr-only">({getEfficiencyText(overallEff)})</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {exercise.series.length} series en total
                    </p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-6">
                      {exercise.series.map((series, sIdx) => (
                        <Card key={sIdx} className="border-l-4" style={{
                          borderLeftColor: `hsl(${100 + (series.efficiency / 100) * 120}, 70%, 45%)`
                        }}>
                          <CardHeader className="py-3 px-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                              <CardTitle className="font-medium text-lg">
                                Serie {sIdx + 1}
                                <span className="ml-2 px-2 py-0.5 text-sm rounded-full border border-gray-300 dark:border-gray-600">
                                  {series.category}
                                </span>
                              </CardTitle>
                              <div 
                                className={cn(
                                  "px-3 py-1 rounded-full text-sm font-medium",
                                  getEfficiencyColor(series.efficiency)
                                )}
                                title={`${getEfficiencyText(series.efficiency)} eficiencia`}
                              >
                                {series.efficiency.toFixed(2)}%
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
                              {/* Metrica Reps */}
                              <MetricCard
                                title="Repeticiones"
                                ideal={series.reps.ideal}
                                real={series.reps.real}
                                difference={series.reps.real - series.reps.ideal}
                              />
                              {/* Metrica Peso */}
                              <MetricCard
                                title="Peso (kg)"
                                ideal={series.weight.ideal}
                                real={series.weight.real}
                                difference={series.weight.real - series.weight.ideal}
                                showDiff
                              />
                              {/* Metrica RPE o RIR */}
                              {series.rpe ? (
                                <MetricCard
                                  title="RPE"
                                  ideal={series.rpe.ideal}
                                  real={series.rpe.real}
                                  difference={series.rpe.real - series.rpe.ideal}
                                  showDiff
                                  lowerIsBetter={false}
                                />
                              ) : (
                                <MetricCard
                                  title="RIR"
                                  ideal={series.rir ? series.rir.ideal : 0}
                                  real={series.rir ? series.rir.real : 0}
                                  difference={(series.rir ? series.rir.real : 0) - (series.rir ? series.rir.ideal : 0)}
                                  showDiff
                                  lowerIsBetter={true}
                                />
                              )}
                              {/* Metrica Duración */}
                              <MetricCard
                                title="Duración"
                                ideal={formatTime(series.duracion.ideal)}
                                real={formatTime(series.duracion.real)}
                                rawIdeal={series.duracion.ideal}
                                rawReal={series.duracion.real}
                                difference={series.duracion.real - series.duracion.ideal}
                                showDiff
                                suffix="seg"
                              />
                              {/* Metrica Descanso => solo si sIdx > 0 */}
                              {sIdx > 0 && (
                                <MetricCard
                                  title="Descanso"
                                  ideal={formatTime(series.restTime.ideal)}
                                  real={formatTime(series.restTime.real)}
                                  rawIdeal={series.restTime.ideal}
                                  rawReal={series.restTime.real}
                                  difference={series.restTime.real - series.restTime.ideal}
                                  showDiff
                                  suffix="seg"
                                />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {showScrollButton && (
          <Button
            variant="secondary"
            size="icon"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-10 shadow-md"
            aria-label="Volver arriba"
          >
            <ArrowUpCircle className="h-5 w-5" aria-hidden="true" />
          </Button>
        )}
      </div>
      <Toaster />
    </div>
  );
}

/**
 * Componente para tarjeta de estadísticas
 */
function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Componente mejorado para mostrar una métrica con 'ideal' y 'real'.
 */
function MetricCard({
  title,
  ideal,
  real,
  rawIdeal,
  rawReal,
  difference,
  showDiff = false,
  lowerIsBetter = false,
  suffix = ""
}: {
  title: string;
  ideal: number | string;
  real: number | string;
  rawIdeal?: number;
  rawReal?: number;
  difference?: number;
  showDiff?: boolean;
  lowerIsBetter?: boolean;
  suffix?: string;
}) {
  // Determina si la diferencia es positiva o negativa
  const getDiffClass = () => {
    if (!difference) return "";
    
    // Si values menores son mejores (como en RIR)
    if (lowerIsBetter) {
      return difference <= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
    }
    
    // Caso normal (valores mayores son mejores)
    return difference >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
  };

  // Muestra el signo + para diferencias positivas
  const formatDiff = () => {
    if (!difference) return "";
    return difference > 0 ? `+${difference}` : `${difference}`;
  };

  // Para valores como tiempo, mostrar la diferencia en formato mm:ss
  const getFormattedDiff = () => {
    if (rawIdeal === undefined || rawReal === undefined) {
      return formatDiff();
    }
    
    const diff = rawReal - rawIdeal;
    const sign = diff > 0 ? "+" : "";
    const m = Math.floor(Math.abs(diff) / 60);
    const s = Math.abs(diff) % 60;
    
    return `${sign}${diff < 0 ? "-" : ""}${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
      <h4 className="text-sm font-semibold mb-2 flex items-center justify-between">
        {title}
        {showDiff && difference !== undefined && (
          <span className={`text-xs px-2 py-1 rounded-full ${getDiffClass()} bg-opacity-20 dark:bg-opacity-20`}>
            {typeof rawIdeal === 'number' && typeof rawReal === 'number' 
              ? getFormattedDiff() 
              : formatDiff()
            }
            {suffix && ` ${suffix}`}
          </span>
        )}
      </h4>
      <div className="flex justify-between items-center text-sm mt-3">
        <div className="flex flex-col items-center justify-center p-2 bg-white dark:bg-neutral-700 rounded w-1/2 mr-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ideal</p>
          <p className="text-blue-600 dark:text-blue-300 font-medium">{ideal}</p>
        </div>
        <div className="flex flex-col items-center justify-center p-2 bg-white dark:bg-neutral-700 rounded w-1/2 ml-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Real</p>
          <p className="text-green-600 dark:text-green-300 font-medium">{real}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Función para convertir la estructura guardada en localStorage.
 */
function convertDataToSummaryFormat(parsedObj: any): ExerciseData[] {
  if (!parsedObj || typeof parsedObj !== "object") return [];

  const results: ExerciseData[] = [];

  for (const exKey of Object.keys(parsedObj)) {
    const exRoutine = parsedObj[exKey];
    if (!exRoutine.exercise || !Array.isArray(exRoutine.series)) continue;

    results.push({
      name: exRoutine.exercise.name,
      series: exRoutine.series.map((s: any) => ({
        category: s.category || "",
        reps: s.reps || { ideal: 0, real: 0 },
        weight: s.weight || { ideal: 0, real: 0 },
        rpe: s.rpe, 
        rir: s.rir,
        duracion: s.duracion || { ideal: 0, real: 0 },
        restTime: s.restTime || { ideal: 0, real: 0 },
        efficiency: s.efficiency || 0
      }))
    });
  }

  return results;
}