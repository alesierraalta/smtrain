// src/app/exercises/variant/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Dumbbell, PlusCircle, Loader2 } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface MuscleGroup {
  id: number;
  name: string;
  description: string;
}

interface Variant {
  id: number;
  name: string;
  muscle_group_id: number;
  user_id: string;
  created_at?: string;
}

export default function SeleccionVariante() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [newVariantName, setNewVariantName] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const grupoMuscular = searchParams.get("grupoMuscular");
      if (!grupoMuscular) return;

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          toast({
            title: "Error",
            description: "Debes iniciar sesión para ver las variantes",
            variant: "destructive",
          });
          return;
        }

        const { data: muscleGroup, error: muscleGroupError } = await supabase
          .from("muscle_groups")
          .select("*")
          .eq("id", Number.parseInt(grupoMuscular, 10))
          .single();

        if (muscleGroupError) throw muscleGroupError;
        if (muscleGroup) {
          setSelectedGroup(muscleGroup as MuscleGroup);
        }

        const { data: variantsData, error: variantsError } = await supabase
          .from("variants")
          .select("*")
          .eq("muscle_group_id", Number.parseInt(grupoMuscular, 10))
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: true });

        if (variantsError) throw variantsError;
        if (variantsData) {
          if (variantsData.length === 0 && muscleGroup) {
            const defaultVariants = [
              { name: `${muscleGroup.name} y Tríceps`, muscle_group_id: muscleGroup.id, user_id: session.user.id },
              { name: `${muscleGroup.name} y Espalda`, muscle_group_id: muscleGroup.id, user_id: session.user.id },
              { name: "Al Fallo", muscle_group_id: muscleGroup.id, user_id: session.user.id },
              { name: "Fuerza", muscle_group_id: muscleGroup.id, user_id: session.user.id },
            ];
            const { data: insertedVariants, error: insertError } = await supabase
              .from("variants")
              .insert(defaultVariants)
              .select();
            if (insertError) throw insertError;
            if (insertedVariants) {
              setVariants(insertedVariants as Variant[]);
            }
          } else {
            setVariants(variantsData as Variant[]);
          }
        }
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las variantes",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [searchParams, supabase, toast]);

  const handleAddNewVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("No hay sesión activa");

      const { data: newVariant, error } = await supabase
        .from("variants")
        .insert({
          name: newVariantName.trim(),
          muscle_group_id: selectedGroup.id,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      if (newVariant) {
        setVariants([...variants, newVariant as Variant]);
        setNewVariantName("");
        setIsAddingNew(false);
        toast({
          title: "Éxito",
          description: "Variante creada correctamente",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la variante",
        variant: "destructive",
      });
    }
  };

  const handleSelectVariant = async (variantId: number) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("No hay sesión activa");

      await supabase.from("user_selections").insert({
        user_id: session.user.id,
        muscle_group_id: selectedGroup?.id,
        variant_id: variantId,
      });

      router.push("/exercises/selection");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la selección",
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

  if (!selectedGroup) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Grupo muscular no encontrado</p>
            <Button asChild className="mt-4 w-full">
              <Link href="/exercises/selection">Volver</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Selección de Variante</h1>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/exercises/selection" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Dumbbell className="h-6 w-6" />
              Variantes para {selectedGroup.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {variants.map((variant, index) => (
                <motion.div
                  key={variant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="mb-4">
                    <CardContent className="flex items-center justify-between p-4">
                      <span className="font-medium">{variant.name}</span>
                      <Button onClick={() => handleSelectVariant(variant.id)}>Seleccionar</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {!isAddingNew ? (
              <Button variant="outline" className="w-full mt-6" onClick={() => setIsAddingNew(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir nueva variante
              </Button>
            ) : (
              <form onSubmit={handleAddNewVariant} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="variantName">Nombre de la nueva variante</Label>
                  <Input
                    id="variantName"
                    value={newVariantName}
                    onChange={(e) => setNewVariantName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddingNew(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Añadir Variante</Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
