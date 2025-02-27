// src/components/HumanBody.tsx
"use client"

import React from "react"

/**
 * Props esperadas por el componente HumanBody
 */
interface HumanBodyProps {
  /**
   * Función callback que recibe el ID del músculo clickeado.
   */
  onMuscleGroupClick: (groupId: number) => void

  /**
   * El ID del músculo actualmente seleccionado (si hay uno).
   */
  selectedMuscleGroup: number | null

  /**
   * true => vista frontal; false => vista trasera
   */
  isFrontView: boolean

  /**
   * true => modo oscuro habilitado
   */
  isDarkMode: boolean
}

/**
 * HumanBody: Renderiza el cuerpo humano en SVG con dos vistas (frontal/trasera).
 * Manejamos 12 IDs distintos para cada grupo muscular.
 *
 * FRONTAL:
 *   1 => Bíceps
 *   5 => Pecho
 *   11 => Abdominales
 *   2 => Cuádriceps
 *   7 => Gemelos
 *   10 => Hombros
 *
 * TRASERA:
 *   3 => Espalda Alta
 *   4 => Dorsales
 *   8 => Espalda Baja
 *   9 => Tríceps
 *   6 => Femorales
 *   12 => Glúteos
 */
export function HumanBody({
  onMuscleGroupClick,
  selectedMuscleGroup,
  isFrontView,
  isDarkMode,
}: HumanBodyProps) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 600 600"
      className="max-w-full h-auto"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={isDarkMode ? "#e5e7eb" : "#4b5563"}
          />
        </marker>
      </defs>

      {isFrontView ? (
        // ================= FRONT VIEW =================
        <g>
          {/* Cabeza */}
          <rect
            x="260"
            y="20"
            width="80"
            height="100"
            fill={isDarkMode ? "#374151" : "#f4f4f4"}
            stroke={isDarkMode ? "#e5e7eb" : "#000"}
            strokeWidth="2"
          />

          {/* Neck */}
          <rect
            x="280"
            y="120"
            width="40"
            height="30"
            fill={isDarkMode ? "#374151" : "#f4f4f4"}
            stroke={isDarkMode ? "#e5e7eb" : "#000"}
            strokeWidth="2"
          />

          {/* Torso */}
          <rect
            x="240"
            y="150"
            width="120"
            height="180"
            fill={isDarkMode ? "#374151" : "#f4f4f4"}
            stroke={isDarkMode ? "#e5e7eb" : "#000"}
            strokeWidth="2"
          />

          {/* Arms */}
          <rect
            x="180"
            y="150"
            width="60"
            height="180"
            fill={isDarkMode ? "#374151" : "#f4f4f4"}
            stroke={isDarkMode ? "#e5e7eb" : "#000"}
            strokeWidth="2"
          />
          <rect
            x="360"
            y="150"
            width="60"
            height="180"
            fill={isDarkMode ? "#374151" : "#f4f4f4"}
            stroke={isDarkMode ? "#e5e7eb" : "#000"}
            strokeWidth="2"
          />

          {/* Legs */}
          <rect
            x="240"
            y="330"
            width="55"
            height="250"
            fill={isDarkMode ? "#374151" : "#f4f4f4"}
            stroke={isDarkMode ? "#e5e7eb" : "#000"}
            strokeWidth="2"
          />
          <rect
            x="305"
            y="330"
            width="55"
            height="250"
            fill={isDarkMode ? "#374151" : "#f4f4f4"}
            stroke={isDarkMode ? "#e5e7eb" : "#000"}
            strokeWidth="2"
          />

          {/* *****************************
           * Muscle groups (FRONTAL)
           ***************************** */}

          {/* ID=1 => Bíceps */}
          <g onClick={() => onMuscleGroupClick(1)} style={{ cursor: "pointer" }}>
            {/* Brazos Superior */}
            <rect
              x="180"
              y="160"
              width="60"
              height="80"
              fill={
                selectedMuscleGroup === 1
                  ? "#ff9999"
                  : isDarkMode
                  ? "#4B5563"
                  : "#f4f4f4"
              }
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
            />
            <rect
              x="360"
              y="160"
              width="60"
              height="80"
              fill={
                selectedMuscleGroup === 1
                  ? "#ff9999"
                  : isDarkMode
                  ? "#4B5563"
                  : "#f4f4f4"
              }
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
            />
            {/* Label */}
            <text
              x="120"
              y="200"
              fontSize="14"
              textAnchor="end"
              fill={isDarkMode ? "#e5e7eb" : "#000"}
            >
              Bíceps
            </text>
            <line
              x1="120"
              y1="200"
              x2="180"
              y2="200"
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
              strokeWidth="1"
              markerEnd="url(#arrowhead)"
            />
          </g>

          {/* ID=5 => Pecho */}
          <g onClick={() => onMuscleGroupClick(5)} style={{ cursor: "pointer" }}>
            <rect
              x="250"
              y="160"
              width="100"
              height="60"
              fill={
                selectedMuscleGroup === 5
                  ? "#ff9999"
                  : isDarkMode
                  ? "#4B5563"
                  : "#f4f4f4"
              }
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
            />
            <text
              x="170"
              y="190"
              fontSize="14"
              textAnchor="end"
              fill={isDarkMode ? "#e5e7eb" : "#000"}
            >
              Pecho
            </text>
            <line
              x1="170"
              y1="190"
              x2="250"
              y2="190"
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
              strokeWidth="1"
              markerEnd="url(#arrowhead)"
            />
          </g>

          {/* ID=11 => Abdominales */}
          <g onClick={() => onMuscleGroupClick(11)} style={{ cursor: "pointer" }}>
            <rect
              x="270"
              y="220"
              width="60"
              height="80"
              fill={
                selectedMuscleGroup === 11
                  ? "#ff9999"
                  : isDarkMode
                  ? "#4B5563"
                  : "#f4f4f4"
              }
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
            />
            <text
              x="430"
              y="260"
              fontSize="14"
              fill={isDarkMode ? "#e5e7eb" : "#000"}
            >
              Abdominales
            </text>
            <line
              x1="430"
              y1="260"
              x2="330"
              y2="260"
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
              strokeWidth="1"
              markerEnd="url(#arrowhead)"
            />
          </g>

          {/* ID=2 => Cuádriceps */}
          <g onClick={() => onMuscleGroupClick(2)} style={{ cursor: "pointer" }}>
            <rect
              x="240"
              y="330"
              width="120"
              height="120"
              fill={
                selectedMuscleGroup === 2
                  ? "#ff9999"
                  : isDarkMode
                  ? "#4B5563"
                  : "#f4f4f4"
              }
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
            />
            <text
              x="430"
              y="390"
              fontSize="14"
              fill={isDarkMode ? "#e5e7eb" : "#000"}
            >
              Cuádriceps
            </text>
            <line
              x1="430"
              y1="390"
              x2="360"
              y2="390"
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
              strokeWidth="1"
              markerEnd="url(#arrowhead)"
            />
          </g>

          {/* ID=7 => Gemelos */}
          <g onClick={() => onMuscleGroupClick(7)} style={{ cursor: "pointer" }}>
            <rect
              x="240"
              y="500"
              width="55"
              height="80"
              fill={
                selectedMuscleGroup === 7
                  ? "#ff9999"
                  : isDarkMode
                  ? "#4B5563"
                  : "#f4f4f4"
              }
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
            />
            <rect
              x="305"
              y="500"
              width="55"
              height="80"
              fill={
                selectedMuscleGroup === 7
                  ? "#ff9999"
                  : isDarkMode
                  ? "#4B5563"
                  : "#f4f4f4"
              }
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
            />
            <text
              x="430"
              y="540"
              fontSize="14"
              fill={isDarkMode ? "#e5e7eb" : "#000"}
            >
              Gemelos
            </text>
            <line
              x1="430"
              y1="540"
              x2="360"
              y2="540"
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
              strokeWidth="1"
              markerEnd="url(#arrowhead)"
            />
          </g>

          {/* ID=10 => Hombros */}
          <g onClick={() => onMuscleGroupClick(10)} style={{ cursor: "pointer" }}>
            <rect
              x="200"
              y="150"
              width="40"
              height="30"
              fill={
                selectedMuscleGroup === 10
                  ? "#ff9999"
                  : isDarkMode
                  ? "#4B5563"
                  : "#f4f4f4"
              }
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
            />
            <rect
              x="360"
              y="150"
              width="40"
              height="30"
              fill={
                selectedMuscleGroup === 10
                  ? "#ff9999"
                  : isDarkMode
                  ? "#4B5563"
                  : "#f4f4f4"
              }
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
            />
            <text
              x="430"
              y="165"
              fontSize="14"
              fill={isDarkMode ? "#e5e7eb" : "#000"}
            >
              Hombros
            </text>
            <line
              x1="430"
              y1="165"
              x2="400"
              y2="165"
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
              strokeWidth="1"
              markerEnd="url(#arrowhead)"
            />
          </g>
        </g>
      ) : (
        // ================= BACK VIEW =================
        <g>
          {/* Cabeza */}
          <rect
            x="260"
            y="20"
            width="80"
            height="100"
            fill={isDarkMode ? "#374151" : "#f4f4f4"}
            stroke={isDarkMode ? "#e5e7eb" : "#000"}
            strokeWidth="2"
          />

          {/* Neck */}
          <rect
            x="280"
            y="120"
            width="40"
            height="30"
            fill={isDarkMode ? "#374151" : "#f4f4f4"}
            stroke={isDarkMode ? "#e5e7eb" : "#000"}
            strokeWidth="2"
          />

          {/* Torso */}
          <rect
            x="240"
            y="150"
            width="120"
            height="180"
            fill={isDarkMode ? "#374151" : "#f4f4f4"}
            stroke={isDarkMode ? "#e5e7eb" : "#000"}
            strokeWidth="2"
          />

          {/* Arms */}
          <rect
            x="180"
            y="150"
            width="60"
            height="180"
            fill={isDarkMode ? "#374151" : "#f4f4f4"}
            stroke={isDarkMode ? "#e5e7eb" : "#000"}
            strokeWidth="2"
          />
          <rect
            x="360"
            y="150"
            width="60"
            height="180"
            fill={isDarkMode ? "#374151" : "#f4f4f4"}
            stroke={isDarkMode ? "#e5e7eb" : "#000"}
            strokeWidth="2"
          />

          {/* Legs */}
          <rect
            x="240"
            y="330"
            width="55"
            height="250"
            fill={isDarkMode ? "#374151" : "#f4f4f4"}
            stroke={isDarkMode ? "#e5e7eb" : "#000"}
            strokeWidth="2"
          />
          <rect
            x="305"
            y="330"
            width="55"
            height="250"
            fill={isDarkMode ? "#374151" : "#f4f4f4"}
            stroke={isDarkMode ? "#e5e7eb" : "#000"}
            strokeWidth="2"
          />

          {/* *****************************
           * Muscle groups (TRASERA)
           ***************************** */}

          {/* ID=3 => Espalda Alta */}
          <g onClick={() => onMuscleGroupClick(3)} style={{ cursor: "pointer" }}>
            <rect
              x="250"
              y="160"
              width="100"
              height="60"
              fill={
                selectedMuscleGroup === 3
                  ? "#ff9999"
                  : isDarkMode
                  ? "#4B5563"
                  : "#f4f4f4"
              }
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
            />
            <text
              x="430"
              y="190"
              fontSize="14"
              fill={isDarkMode ? "#e5e7eb" : "#000"}
            >
              Espalda Alta
            </text>
            <line
              x1="430"
              y1="190"
              x2="350"
              y2="190"
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
              strokeWidth="1"
              markerEnd="url(#arrowhead)"
            />
          </g>

          {/* ID=4 => Dorsales */}
          <g onClick={() => onMuscleGroupClick(4)} style={{ cursor: "pointer" }}>
            <rect
              x="240"
              y="220"
              width="120"
              height="80"
              fill={
                selectedMuscleGroup === 4
                  ? "#ff9999"
                  : isDarkMode
                  ? "#4B5563"
                  : "#f4f4f4"
              }
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
            />
            <text
              x="430"
              y="260"
              fontSize="14"
              fill={isDarkMode ? "#e5e7eb" : "#000"}
            >
              Dorsales
            </text>
            <line
              x1="430"
              y1="260"
              x2="360"
              y2="260"
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
              strokeWidth="1"
              markerEnd="url(#arrowhead)"
            />
          </g>

          {/* ID=8 => Espalda Baja */}
          <g onClick={() => onMuscleGroupClick(8)} style={{ cursor: "pointer" }}>
            <rect
              x="270"
              y="280"
              width="60"
              height="50"
              fill={
                selectedMuscleGroup === 8
                  ? "#ff9999"
                  : isDarkMode
                  ? "#4B5563"
                  : "#f4f4f4"
              }
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
            />
            <text
              x="430"
              y="305"
              fontSize="14"
              fill={isDarkMode ? "#e5e7eb" : "#000"}
            >
              Espalda Baja
            </text>
            <line
              x1="430"
              y1="305"
              x2="330"
              y2="305"
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
              strokeWidth="1"
              markerEnd="url(#arrowhead)"
            />
          </g>

          {/* ID=9 => Tríceps */}
          <g onClick={() => onMuscleGroupClick(9)} style={{ cursor: "pointer" }}>
            <rect
              x="180"
              y="160"
              width="60"
              height="80"
              fill={
                selectedMuscleGroup === 9
                  ? "#ff9999"
                  : isDarkMode
                  ? "#4B5563"
                  : "#f4f4f4"
              }
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
            />
            <rect
              x="360"
              y="160"
              width="60"
              height="80"
              fill={
                selectedMuscleGroup === 9
                  ? "#ff9999"
                  : isDarkMode
                  ? "#4B5563"
                  : "#f4f4f4"
              }
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
            />
            <text
              x="120"
              y="200"
              fontSize="14"
              textAnchor="end"
              fill={isDarkMode ? "#e5e7eb" : "#000"}
            >
              Tríceps
            </text>
            <line
              x1="120"
              y1="200"
              x2="180"
              y2="200"
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
              strokeWidth="1"
              markerEnd="url(#arrowhead)"
            />
          </g>

          {/* ID=6 => Femorales */}
          <g onClick={() => onMuscleGroupClick(6)} style={{ cursor: "pointer" }}>
            <rect
              x="240"
              y="330"
              width="120"
              height="120"
              fill={
                selectedMuscleGroup === 6
                  ? "#ff9999"
                  : isDarkMode
                  ? "#4B5563"
                  : "#f4f4f4"
              }
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
            />
            <text
              x="430"
              y="390"
              fontSize="14"
              fill={isDarkMode ? "#e5e7eb" : "#000"}
            >
              Femorales
            </text>
            <line
              x1="430"
              y1="390"
              x2="360"
              y2="390"
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
              strokeWidth="1"
              markerEnd="url(#arrowhead)"
            />
          </g>

          {/* ID=12 => Glúteos */}
          <g onClick={() => onMuscleGroupClick(12)} style={{ cursor: "pointer" }}>
            <rect
              x="250"
              y="320"
              width="100"
              height="50"
              fill={
                selectedMuscleGroup === 12
                  ? "#ff9999"
                  : isDarkMode
                  ? "#4B5563"
                  : "#f4f4f4"
              }
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
            />
            <text
              x="430"
              y="345"
              fontSize="14"
              fill={isDarkMode ? "#e5e7eb" : "#000"}
            >
              Glúteos
            </text>
            <line
              x1="430"
              y1="345"
              x2="350"
              y2="345"
              stroke={isDarkMode ? "#e5e7eb" : "#000"}
              strokeWidth="1"
              markerEnd="url(#arrowhead)"
            />
          </g>

          {/* ID=10 => Hombros (opcional repetido, si deseas) */}
          {/* Si deseas también hombros en la parte trasera. 
              (No siempre se marca igual, pero puedes añadirlo si gustas).
          */}
        </g>
      )}
    </svg>
  )
}
