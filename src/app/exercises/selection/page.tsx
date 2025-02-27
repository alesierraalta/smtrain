"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  ArrowLeft,
  RotateCcw,
  PlusCircle,
  Moon,
  Sun,
  Dumbbell,
  X,
  CheckCircle2,
  Loader2
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/Toaster";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { motion, AnimatePresence } from "framer-motion";
import { HumanBody } from "@/components/HumanBody";

interface MuscleGroup {
  id: number;
  name: string;
  description: string | null;
  user_id: string | null;
  created_at: string; // timestamp
  updated_at: string; // timestamp
}

interface Exercise {
  id: number;
  name: string;
  description: string | null;
  muscle_group_id: number | null;
  user_id: string | null;
  instructions: string | null;
  video_url: string | null;
  is_custom: boolean | null;
  created_at: string; // timestamp
  updated_at: string; // timestamp
}

const darkModeColors = {
  background: "#121212",
  cardBackground: "#1E1E1E",
  textPrimary: "#FFFFFF",
  textSecondary: "#B0B0B0",
  inputBackground: "#2A2A2A",
  borderColor: "#3A3A3A",
  buttonBackground: "#3B82F6",
  buttonHover: "#2563EB",
  accentColor: "#3B82F6",
  shadow: "0 4px 6px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(255, 255, 255, 0.06)",
};

const lightModeColors = {
  background: "#F9FAFB",
  cardBackground: "#FFFFFF",
  textPrimary: "#111827",
  textSecondary: "#4B5563",
  inputBackground: "#F3F4F6",
  borderColor: "#D1D5DB",
  buttonBackground: "#3B82F6",
  buttonHover: "#2563EB",
  accentColor: "#3B82F6",
  shadow: "0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03)",
  buttonText: "#FFFFFF",
};

export default function ExerciseSelection() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<number | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseDescription, setNewExerciseDescription] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isFrontView, setIsFrontView] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Example workout ID in a real scenario you might create a record in 'workouts'
  const [workoutId] = useState<number>(123);

  useEffect(() => {
    const init = async () => {
      // Theme initialization
      const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const savedTheme = localStorage.getItem("theme");
      const initialDarkMode = savedTheme === "dark" || (!savedTheme && darkModeMediaQuery.matches);
      setIsDarkMode(initialDarkMode);
      document.documentElement.classList.toggle("dark", initialDarkMode);

      const handleChange = (e: MediaQueryListEvent) => {
        if (!savedTheme) {
          setIsDarkMode(e.matches);
          document.documentElement.classList.toggle("dark", e.matches);
        }
      };
      darkModeMediaQuery.addEventListener("change", handleChange);

      const isConnected = await checkSupabaseConnection();
      if (isConnected) {
        await fetchMuscleGroups();
        await fetchExercises();
      }

      return () => darkModeMediaQuery.removeEventListener("change", handleChange);
    };
    init();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const checkSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from("muscle_groups").select("count");
      if (error) throw error;
      console.log("Supabase connection successful, row count:", data);
      return true;
    } catch (error) {
      console.error("Supabase connection error:", error);
      toast({
        title: "Connection Error",
        description: "Could not connect to DB",
        variant: "destructive",
      });
      return false;
    }
  };

  const fetchMuscleGroups = async () => {
    setIsLoading(true);
    try {
      console.log("Starting fetchMuscleGroups...");
      const { data, error } = await supabase.from("muscle_groups").select("*");

      if (error) {
        console.error("Detailed error:", error);
        toast({
          title: "Error",
          description: `Could not load muscle groups: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      if (!data || data.length === 0) {
        toast({
          title: "Warning",
          description: "No muscle groups found",
          variant: "warning",
        });
        return;
      }

      console.log("Loaded muscle groups:", data);
      setMuscleGroups(data);
    } catch (error) {
      console.error("Unexpected fetchMuscleGroups error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase.from("exercises").select("*");
      if (error) {
        console.error("Error fetching exercises:", error);
        toast({
          title: "Error",
          description: "Could not load exercises",
          variant: "destructive",
        });
      } else if (data) {
        setExercises(data);
      }
    } catch (error) {
      console.error("Unexpected error while fetching exercises:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  const handleMuscleGroupClick = (groupId: number) => {
    setSelectedMuscleGroup(groupId);
    setIsSheetOpen(true);
  };

  const handleExerciseToggle = (exerciseId: number) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleAddNewExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newExerciseName.trim() && selectedMuscleGroup) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error("No active session");

        const { data: groupCheck } = await supabase
          .from("muscle_groups")
          .select("id")
          .eq("id", selectedMuscleGroup)
          .single();

        if (!groupCheck) {
          throw new Error("Selected muscle group does not exist");
        }

        console.log("Inserting new exercise:", {
          name: newExerciseName.trim(),
          description: newExerciseDescription.trim(),
          muscle_group_id: selectedMuscleGroup,
          user_id: session.user.id,
        });

        const { data, error } = await supabase
          .from("exercises")
          .insert({
            name: newExerciseName.trim(),
            description: newExerciseDescription.trim(),
            muscle_group_id: selectedMuscleGroup,
            user_id: session.user.id,
          })
          .select()
          .single();

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        if (!data) {
          throw new Error("No data returned after insertion");
        }

        setExercises((prev) => [...prev, data]);
        setSelectedExercises((prev) => [...prev, data.id]);
        setNewExerciseName("");
        setNewExerciseDescription("");
        setIsAddingNew(false);

        toast({
          title: "Exercise Added",
          description: "A new exercise has been successfully added.",
          variant: "default",
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        });
      } catch (error) {
        console.error("Error adding exercise:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Unknown error creating exercise",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Select a muscle group and enter an exercise name",
        variant: "destructive",
      });
    }
  };

  const toggleView = () => {
    setIsFrontView(!isFrontView);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleConfirmExercises = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");

      if (selectedExercises.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one exercise",
          variant: "destructive",
        });
        return;
      }

      console.log("Inserting into workout_exercises with workout_id =", workoutId);
      const { error } = await supabase.from("workout_exercises").insert(
        selectedExercises.map((exerciseId) => ({
          workout_id: workoutId,
          exercise_id: exerciseId,
          sets: null,
          reps: null,
          weight: null,
          notes: null,
          order_index: 0,
        }))
      );

      if (error) {
        console.error("Supabase error inserting workout_exercises:", error);
        throw error;
      }

      // Build a comma-separated list of chosen exercise names
      const selectedNames = selectedExercises.map((id) => {
        const ex = exercises.find((e) => e.id === id);
        return ex ? ex.name : "Unknown";
      });
      const joinedNames = selectedNames.join(",");

      // Now navigate to /routines/definir with ?ejercicios=...
      router.push(`/routines/definir?ejercicios=${encodeURIComponent(joinedNames)}`);

      toast({
        title: "Exercises Saved",
        description: "Your selected exercises have been saved.",
        variant: "default",
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      });
    } catch (error) {
      console.error("Error confirming exercises:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not save selection",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 w-full font-sans ${
        isDarkMode
          ? "bg-[var(--dark-background)] text-[var(--dark-textPrimary)]"
          : "bg-[var(--light-background)] text-[var(--light-textPrimary)]"
      }`}
      style={
        {
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
        } as React.CSSProperties
      }
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center">
            <Dumbbell className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-4 text-[var(--dark-accentColor)]" />
            Exercise Selection
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="p-2 sm:p-3 rounded-full transition-colors duration-200 bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-[var(--dark-accentColor)]"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>

        <Card
          className={`mb-6 sm:mb-10 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] ${
            isDarkMode
              ? "bg-[var(--dark-cardBackground)] text-[var(--dark-textPrimary)] shadow-[var(--dark-shadow)]"
              : "bg-[var(--light-cardBackground)] text-[var(--light-textPrimary)] shadow-[var(--light-shadow)]"
          }`}
        >
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-3">
              Select Your Exercises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <div className="w-full max-w-[300px] sm:max-w-none">
                  <HumanBody
                    onMuscleGroupClick={handleMuscleGroupClick}
                    selectedMuscleGroup={selectedMuscleGroup}
                    isFrontView={isFrontView}
                    isDarkMode={isDarkMode}
                  />
                </div>
                <Button onClick={toggleView} className="w-full mt-4">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {isFrontView ? "View from Back" : "View from Front"}
                </Button>
              </div>
              <div className="hidden sm:block">
                <h3 className="text-xl font-semibold mb-4">
                  {selectedMuscleGroup
                    ? muscleGroups.find((g) => g.id === selectedMuscleGroup)?.name
                    : "Select a Muscle Group"}
                </h3>
                {selectedMuscleGroup && (
                  <>
                    <div className="space-y-2 mb-4">
                      {exercises
                        .filter((e) => e.muscle_group_id === selectedMuscleGroup)
                        .map((exercise) => (
                          <div key={exercise.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`exercise-${exercise.id}`}
                              checked={selectedExercises.includes(exercise.id)}
                              onCheckedChange={() => handleExerciseToggle(exercise.id)}
                            />
                            <Label htmlFor={`exercise-${exercise.id}`}>{exercise.name}</Label>
                          </div>
                        ))}
                    </div>
                    {!isAddingNew ? (
                      <Button onClick={() => setIsAddingNew(true)} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Exercise
                      </Button>
                    ) : (
                      <form onSubmit={handleAddNewExercise} className="space-y-4">
                        <div>
                          <Label htmlFor="newExerciseName">Exercise Name</Label>
                          <Input
                            id="newExerciseName"
                            value={newExerciseName}
                            onChange={(e) => setNewExerciseName(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="newExerciseDescription">Description (optional)</Label>
                          <Textarea
                            id="newExerciseDescription"
                            value={newExerciseDescription}
                            onChange={(e) => setNewExerciseDescription(e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button type="submit" className="flex-1">
                            Add
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddingNew(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="bottom" className="h-[80vh] sm:h-auto">
            <SheetHeader>
              <SheetTitle>
                {selectedMuscleGroup
                  ? muscleGroups.find((g) => g.id === selectedMuscleGroup)?.name
                  : "Select a Muscle Group"}
              </SheetTitle>
            </SheetHeader>
            {selectedMuscleGroup && (
              <div className="mt-4">
                <div className="space-y-2 mb-4">
                  {exercises
                    .filter((e) => e.muscle_group_id === selectedMuscleGroup)
                    .map((exercise) => (
                      <div key={exercise.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-exercise-${exercise.id}`}
                          checked={selectedExercises.includes(exercise.id)}
                          onCheckedChange={() => handleExerciseToggle(exercise.id)}
                        />
                        <Label htmlFor={`mobile-exercise-${exercise.id}`}>{exercise.name}</Label>
                      </div>
                    ))}
                </div>
                {!isAddingNew ? (
                  <Button onClick={() => setIsAddingNew(true)} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Exercise
                  </Button>
                ) : (
                  <form onSubmit={handleAddNewExercise} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobileNewExerciseName">Exercise Name</Label>
                      <Input
                        id="mobileNewExerciseName"
                        value={newExerciseName}
                        onChange={(e) => setNewExerciseName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobileNewExerciseDescription">Description (optional)</Label>
                      <Textarea
                        id="mobileNewExerciseDescription"
                        value={newExerciseDescription}
                        onChange={(e) => setNewExerciseDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1">
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddingNew(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </SheetContent>
        </Sheet>

        <Card
          className={`mb-6 ${
            isDarkMode
              ? "bg-[var(--dark-cardBackground)] text-[var(--dark-textPrimary)] shadow-[var(--dark-shadow)]"
              : "bg-[var(--light-cardBackground)] text-[var(--light-textPrimary)] shadow-[var(--light-shadow)]"
          }`}
        >
          <CardHeader>
            <CardTitle>Selected Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedExercises.length > 0 ? (
              <ul className="space-y-2 mb-4">
                {selectedExercises.map((exerciseId) => {
                  const exercise = exercises.find((e) => e.id === exerciseId);
                  return exercise ? (
                    <li
                      key={exercise.id}
                      className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                      <span>{exercise.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleExerciseToggle(exercise.id)}>
                        <X size={16} />
                      </Button>
                    </li>
                  ) : null;
                })}
              </ul>
            ) : (
              <p className="text-muted-foreground mb-4">You haven't selected any exercises yet.</p>
            )}
            <Button onClick={handleConfirmExercises} className="w-full" disabled={selectedExercises.length === 0}>
              Confirm Exercises Selection
            </Button>
          </CardContent>
        </Card>

        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href="/seleccion-grupo-muscular">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Muscle Group Selection
          </Link>
        </Button>
      </div>
      <Toaster />
    </div>
  );
}
