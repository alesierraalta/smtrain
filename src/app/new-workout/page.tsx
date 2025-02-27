// src/app/new-workout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Dumbbell } from "lucide-react";

const initialMuscleGroups = [
  { id: 1, name: "Pecho", description: "Músculos pectorales" },
  { id: 2, name: "Espalda", description: "Músculos de la espalda" },
  { id: 3, name: "Piernas", description: "Músculos de las piernas" },
  { id: 4, name: "Brazos", description: "Músculos de los brazos" },
  { id: 5, name: "Hombros", description: "Músculos de los hombros" },
];

export default function NuevoEntrenamiento() {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutType, setWorkoutType] = useState("Fuerza");

  useEffect(() => {
    const groupId = localStorage.getItem("selectedGroup");
    const variantId = localStorage.getItem("selectedVariant");
    if (groupId) {
      const group = initialMuscleGroups.find((g) => g.id === parseInt(groupId, 10));
      setSelectedGroup(group);
      if (variantId) {
        const storedVariants = localStorage.getItem(`variants_${groupId}`);
        if (storedVariants) {
          const variants = JSON.parse(storedVariants);
          const variant = variants.find((v: any) => v.id === parseInt(variantId, 10));
          setSelectedVariant(variant);
        }
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Workout data:", { workoutName, selectedGroup, selectedVariant, workoutType });
    router.push("/dashboard/workout/exercises");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Dumbbell className="mr-2" />
          Nuevo Entrenamiento
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="workout-name" className="block text-sm font-medium text-gray-700">
              Nombre del entrenamiento
            </label>
            <input
              type="text"
              id="workout-name"
              name="workout-name"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Ej: Entrenamiento de piernas"
              required
            />
          </div>
          <div>
            <label htmlFor="muscle-group" className="block text-sm font-medium text-gray-700">
              Grupo muscular seleccionado
            </label>
            <input
              type="text"
              id="muscle-group"
              name="muscle-group"
              value={selectedGroup ? selectedGroup.name : ""}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="variant" className="block text-sm font-medium text-gray-700">
              Variante seleccionada
            </label>
            <input
              type="text"
              id="variant"
              name="variant"
              value={selectedVariant ? selectedVariant.name : ""}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="workout-type" className="block text-sm font-medium text-gray-700">
              Tipo de entrenamiento
            </label>
            <select
              id="workout-type"
              name="workout-type"
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option>Fuerza</option>
              <option>Hipertrofia</option>
              <option>Resistencia</option>
              <option>Mixto</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
          >
            Comenzar entrenamiento
          </button>
        </form>
      </div>
      <Link href="/exercises/variant" className="mt-4 text-blue-600 hover:text-blue-800 flex items-center transition duration-300">
        <ArrowLeft className="mr-1" size={16} />
        Volver a selección de variante
      </Link>
    </div>
  );
}
