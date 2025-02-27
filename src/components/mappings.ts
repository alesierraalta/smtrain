// src/components/mappings.ts

/**
 * Definición de regiones y etiquetas para la vista frontal.
 * La clave del objeto (ej. "Pecho") debe coincidir con la columna 'name' de la tabla 'muscle_groups'.
 */
export const frontViewMapping: Record<
  string,
  {
    rects: Array<{ x: number; y: number; width: number; height: number }>
    label: string
    labelPosition: { x: number; y: number }
    line?: { x1: number; y1: number; x2: number; y2: number }
  }
> = {
  "Pecho": {
    rects: [{ x: 250, y: 160, width: 100, height: 60 }],
    label: "Pecho",
    labelPosition: { x: 170, y: 190 },
    line: { x1: 170, y1: 190, x2: 250, y2: 190 },
  },
  "Abdominales": {
    rects: [{ x: 270, y: 220, width: 60, height: 80 }],
    label: "Abdominales",
    labelPosition: { x: 430, y: 260 },
    line: { x1: 430, y1: 260, x2: 330, y2: 260 },
  },
  "Bíceps": {
    rects: [
      { x: 180, y: 160, width: 60, height: 80 },
      { x: 360, y: 160, width: 60, height: 80 },
    ],
    label: "Bíceps",
    labelPosition: { x: 120, y: 200 },
    line: { x1: 120, y1: 200, x2: 180, y2: 200 },
  },
  // Ejemplo de otros grupos (ajusta a tu gusto):
  "Cuádriceps": {
    rects: [{ x: 240, y: 330, width: 120, height: 120 }],
    label: "Cuádriceps",
    labelPosition: { x: 430, y: 390 },
    line: { x1: 430, y1: 390, x2: 360, y2: 390 },
  },
  "Gemelos": {
    rects: [
      { x: 240, y: 500, width: 55, height: 80 },
      { x: 305, y: 500, width: 55, height: 80 },
    ],
    label: "Gemelos",
    labelPosition: { x: 430, y: 540 },
    line: { x1: 430, y1: 540, x2: 360, y2: 540 },
  },
  "Hombros": {
    rects: [
      { x: 200, y: 150, width: 40, height: 30 },
      { x: 360, y: 150, width: 40, height: 30 },
    ],
    label: "Hombros",
    labelPosition: { x: 430, y: 165 },
    line: { x1: 430, y1: 165, x2: 400, y2: 165 },
  },
}

/**
 * Definición de regiones y etiquetas para la vista trasera.
 */
export const backViewMapping: typeof frontViewMapping = {
  "Espalda Alta": {
    rects: [{ x: 250, y: 160, width: 100, height: 60 }],
    label: "Espalda Alta",
    labelPosition: { x: 430, y: 190 },
    line: { x1: 430, y1: 190, x2: 350, y2: 190 },
  },
  "Dorsales": {
    rects: [{ x: 240, y: 220, width: 120, height: 80 }],
    label: "Dorsales",
    labelPosition: { x: 430, y: 260 },
    line: { x1: 430, y1: 260, x2: 360, y2: 260 },
  },
  "Espalda Baja": {
    rects: [{ x: 270, y: 280, width: 60, height: 50 }],
    label: "Espalda Baja",
    labelPosition: { x: 430, y: 305 },
    line: { x1: 430, y1: 305, x2: 330, y2: 305 },
  },
  "Tríceps": {
    rects: [
      { x: 180, y: 160, width: 60, height: 80 },
      { x: 360, y: 160, width: 60, height: 80 },
    ],
    label: "Tríceps",
    labelPosition: { x: 120, y: 200 },
    line: { x1: 120, y1: 200, x2: 180, y2: 200 },
  },
  "Femorales": {
    rects: [{ x: 240, y: 330, width: 120, height: 120 }],
    label: "Femorales",
    labelPosition: { x: 430, y: 390 },
    line: { x1: 430, y1: 390, x2: 360, y2: 390 },
  },
  "Gemelos": {
    rects: [
      { x: 240, y: 500, width: 55, height: 80 },
      { x: 305, y: 500, width: 55, height: 80 },
    ],
    label: "Gemelos",
    labelPosition: { x: 430, y: 540 },
    line: { x1: 430, y1: 540, x2: 360, y2: 540 },
  },
  "Glúteos": {
    rects: [{ x: 250, y: 320, width: 100, height: 50 }],
    label: "Glúteos",
    labelPosition: { x: 430, y: 345 },
    line: { x1: 430, y1: 345, x2: 350, y2: 345 },
  },
  "Hombros": {
    rects: [
      { x: 200, y: 150, width: 40, height: 30 },
      { x: 360, y: 150, width: 40, height: 30 },
    ],
    label: "Hombros",
    labelPosition: { x: 430, y: 165 },
    line: { x1: 430, y1: 165, x2: 400, y2: 165 },
  },
}
