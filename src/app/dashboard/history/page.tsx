// src/app/dashboard/history/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { History, ArrowLeft, ChevronDown, ChevronUp, Moon, Sun, Calendar, Activity, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Progress } from "@/components/ui/Progress";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Calendar as CalendarUI } from "@/components/ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { cn } from "@/lib/utils";

interface Exercise {
  name: string;
  series: Array<{
    category: string;
    reps: { ideal: number; real: number };
    weight: { ideal: number; real: number };
    rir: { ideal: number; real: number };
    intensity: { ideal: number; real: number };
    maxTime: { ideal: number; real: number };
    restTime: { ideal: number; real: number };
    volume: { ideal: number; real: number };
    tonnage: { ideal: number; real: number };
    efficiency: number;
  }>;
}

interface Workout {
  id: number;
  date: string;
  exercises: Exercise[];
}

// Replace this with your real data fetching
const mockWorkouts: Workout[] = [
  // ... (mock data as provided)
];

function MetricCard({ title, ideal, real }: { title: string; ideal: number | string; real: number | string; }) {
  const percentage = (Number(real) / Number(ideal)) * 100;
  const color =
    percentage >= 100 ? "text-green-500" : percentage >= 80 ? "text-yellow-500" : "text-red-500";
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold">{real}</p>
            <p className="text-xs text-muted-foreground">Objetivo: {ideal}</p>
          </div>
          <p className={`text-xl font-semibold ${color}`}>{percentage.toFixed(0)}%</p>
        </div>
        <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
        </div>
      </CardContent>
    </Card>
  );
}

function WorkoutSummary({ workout }: { workout: Workout }) {
  const totalVolume = workout.exercises.reduce(
    (sum, exercise) => sum + exercise.series.reduce((exSum, series) => exSum + series.volume.real, 0),
    0
  );
  const totalEfficiency =
    workout.exercises.reduce(
      (sum, exercise) => sum + exercise.series.reduce((exSum, series) => exSum + series.efficiency, 0),
      0
    ) / workout.exercises.reduce((sum, exercise) => sum + exercise.series.length, 0);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fecha</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{format(new Date(workout.date), "dd MMM yyyy")}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Volumen Total</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVolume}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Eficiencia Media</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEfficiency.toFixed(2)}%</div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExerciseDetails({ exercise }: { exercise: Exercise }) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Resumen</TabsTrigger>
        <TabsTrigger value="series">Series</TabsTrigger>
        <TabsTrigger value="charts">Gráficos</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>{exercise.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                title="Volumen Total"
                ideal={exercise.series.reduce((sum, s) => sum + s.volume.ideal, 0)}
                real={exercise.series.reduce((sum, s) => sum + s.volume.real, 0)}
              />
              <MetricCard
                title="Eficiencia Media"
                ideal={100}
                real={exercise.series.reduce((sum, s) => sum + s.efficiency, 0) / exercise.series.length}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="series">
        <div className="space-y-4">
          {exercise.series.map((series, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">
                  Serie {index + 1}: {series.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <MetricCard title="Repeticiones" ideal={series.reps.ideal} real={series.reps.real} />
                  <MetricCard title="Peso (kg)" ideal={series.weight.ideal} real={series.weight.real} />
                  <MetricCard title="RIR" ideal={series.rir.ideal} real={series.rir.real} />
                  <MetricCard title="Intensidad" ideal={series.intensity.ideal} real={series.intensity.real} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="charts">
        <Card>
          <CardHeader>
            <CardTitle>Progreso de Volumen</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={exercise.series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="volume.real" stroke="#8884d8" name="Volumen Real" />
                <Line type="monotone" dataKey="volume.ideal" stroke="#82ca9d" name="Volumen Ideal" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default function HistorialEntrenamientos() {
  const [workouts, setWorkouts] = useState<Workout[]>(mockWorkouts);
  const [expandedWorkout, setExpandedWorkout] = useState<number | null>(null);
  const { theme, setTheme } = useTheme();

  const toggleWorkoutDetails = (workoutId: number) => {
    setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="sticky top-0 z-10 w-full bg-background border-b border-border p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <History className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Historial de Entrenamientos</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver
              </Button>
            </Link>
          </nav>
        </header>

        <main className="flex-grow p-4 md:p-6 space-y-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {workouts.map((workout) => (
              <motion.div key={workout.id} layout>
                <Card className="w-full overflow-hidden">
                  <CardHeader
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleWorkoutDetails(workout.id)}
                  >
                    <CardTitle className="flex justify-between items-center">
                      <span>Entrenamiento del {format(new Date(workout.date), "dd MMM yyyy")}</span>
                      {expandedWorkout === workout.id ? (
                        <ChevronUp className="h-6 w-6" />
                      ) : (
                        <ChevronDown className="h-6 w-6" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <AnimatePresence>
                    {expandedWorkout === workout.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-4 space-y-6">
                          <WorkoutSummary workout={workout} />
                          <Tabs defaultValue={workout.exercises[0].name} className="w-full">
                            <TabsList className="w-full justify-start overflow-x-auto">
                              {workout.exercises.map((exercise) => (
                                <TabsTrigger key={exercise.name} value={exercise.name}>
                                  {exercise.name}
                                </TabsTrigger>
                              ))}
                            </TabsList>
                            {workout.exercises.map((exercise) => (
                              <TabsContent key={exercise.name} value={exercise.name}>
                                <ExerciseDetails exercise={exercise} />
                              </TabsContent>
                            ))}
                          </Tabs>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>
        </main>

        <footer className="w-full bg-background border-t border-border p-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Mi App de Fitness. Todos los derechos reservados.</p>
        </footer>
      </div>
    </TooltipProvider>
  );
}
