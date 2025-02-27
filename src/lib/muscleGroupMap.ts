// src/lib/muscleGroupMap.ts

/**
 * Mapeo de IDs del SVG (1,2,3,...) -> Nombre del grupo muscular.
 * Asegúrate de que coincidan con los IDs usados en HumanBody y en tu DB.
 */
export const muscleGroupMap: Record<number, string> = {
    1: "Pecho",
    2: "Espalda Alta",
    3: "Dorsales",
    4: "Espalda Baja",
    5: "Cuádriceps",
    6: "Femorales",
    7: "Gemelos",
    8: "Bíceps",
    9: "Tríceps",
    10: "Hombros",
    11: "Abdominales",
    12: "Glúteos",
    // Agrega más si tu SVG define nuevos IDs
  }
  