import React from 'react';
import { RadarData, LADDERS } from '@/types';

interface Props {
  data: RadarData;
  managerData?: RadarData;
  showManager: boolean;
  id?: string;
}

const CENTER = 500;
// On a besoin de place pour 5 niveaux pointillés + 1 cadre solide
// Disons que le cadre solide est à 420px.
// On divise l'espace en 6 intervalles égaux pour l'harmonie visuelle.
const MAX_RADIUS = 420;
const STEPS = 6; 
const STEP_SIZE = MAX_RADIUS / STEPS; // 70px par niveau

// On génère les 6 rayons : [70, 140, 210, 280, 350, 420]
const RADII = Array.from({ length: STEPS }, (_, i) => (i + 1) * STEP_SIZE);

// Helper : Map le score (1..5) sur les rayons (1..5)
// Score 1.0 => Rayon 1 (70px)
// Score 5.0 => Rayon 5 (350px) -> C'est la ligne "Pioneers" (dernier pointillé)
// Le Rayon 6 (420px) reste le cadre vide
const getRadius = (score: number) => {
  const clamped = Math.max(0, Math.min(score, 5));
  return clamped * STEP_SIZE;
};

const getPolygonPoints = (d: RadarData) => {
  const rTop = getRadius(d.engineering);
  const rRight = getRadius(d.delivery);
  const rBottom = getRadius(d.people);
  const rLeft = getRadius(d.innovation);

  return `
    ${CENTER},${CENTER - rTop} 
    ${CENTER + rRight},${CENTER} 
    ${CENTER},${CENTER + rBottom} 
    ${CENTER - rLeft},${CENTER}
  `.trim();
};

export default function RadarDiagram({ data, managerData, showManager, id }: Props) {
  return (
    <div className="w-full max-w-[600px] aspect-square mx-auto border border-gray-800 rounded-lg overflow-hidden bg-black relative">
      <svg
        id={id}
        viewBox="0 0 1000 1000"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>
            {`
              .radar-text { font-family: sans-serif; font-size: 13px; fill: #9ca3af; letter-spacing: 0.5px; }
              .radar-axis-label { font-family: sans-serif; font-size: 22px; font-weight: 600; fill: #e5e7eb; }
            `}
          </style>
        </defs>

        <rect x="0" y="0" width="1000" height="1000" fill="#000000" />

        {/* --- GRILLE FIXE --- */}

        {/* Axes principaux */}
        <line x1="500" y1="40" x2="500" y2="960" stroke="#333" strokeWidth="2" />
        <line x1="40" y1="500" x2="960" y2="500" stroke="#333" strokeWidth="2" />

        {/* Les Anneaux */}
        {RADII.map((r, i) => {
          // Les 5 premiers (index 0 à 4) sont pointillés. Le 6ème (index 5) est solide.
          const isOuterFrame = i === STEPS - 1; 
          return (
            <polygon
              key={r}
              points={`500,${500 - r} ${500 + r},500 500,${500 + r} ${500 - r},500`}
              fill="none"
              stroke={isOuterFrame ? "#666" : "#333"}
              strokeWidth={isOuterFrame ? "2" : "1.5"}
              strokeDasharray={isOuterFrame ? "0" : "8 6"}
            />
          );
        })}

        {/* --- TEXTES LADDERS --- */}
        {/*
           Logique de placement :
           Le texte doit "courir" sur la ligne du diamant.
           Top-Left quadrant : La ligne descend vers la gauche. Rotation -45°.
           Top-Right quadrant : La ligne descend vers la droite. Rotation 45°.
           Bottom-Right quadrant : La ligne monte vers la droite (mais texte orienté pour lecture). Rotation -45°.
           Bottom-Left quadrant : La ligne monte vers la gauche. Rotation 45°.
        */}

        {/* 1. Engineering (Top-Left diagonal) */}
        {LADDERS.engineering.map((label, i) => {
          const r = RADII[i];
          // Coordonnées : Milieu du segment haut-gauche
          // x = 500 - r/2, y = 500 - r/2
          const x = 500 - (r / 2);
          const y = 500 - (r / 2);
          return (
            <text 
              key={`eng-${i}`} 
              x={x} y={y} 
              className="radar-text" 
              textAnchor="middle" 
              transform={`rotate(-45, ${x}, ${y}) translate(0, -6)`}
            >
              {label}
            </text>
          );
        })}

        {/* 2. Delivery (Top-Right diagonal) */}
        {LADDERS.delivery.map((label, i) => {
          const r = RADII[i];
          const x = 500 + (r / 2);
          const y = 500 - (r / 2);
          return (
            <text 
              key={`del-${i}`} 
              x={x} y={y} 
              className="radar-text" 
              textAnchor="middle" 
              transform={`rotate(45, ${x}, ${y}) translate(0, -6)`}
            >
              {label}
            </text>
          );
        })}

        {/* 3. People (Bottom-Right diagonal) */}
        {LADDERS.people.map((label, i) => {
          const r = RADII[i];
          const x = 500 + (r / 2);
          const y = 500 + (r / 2);
          // Pour le bas, on met le texte "au dessus" de la ligne (intérieur du diamant) pour lisibilité
          // ou "en dessous". Sur le screenshot, c'est au-dessus (intérieur).
          return (
            <text 
              key={`peo-${i}`} 
              x={x} y={y} 
              className="radar-text" 
              textAnchor="middle" 
              transform={`rotate(-45, ${x}, ${y}) translate(0, 15)`}
            >
              {label}
            </text>
          );
        })}

        {/* 4. Innovation (Bottom-Left diagonal) */}
        {LADDERS.innovation.map((label, i) => {
          const r = RADII[i];
          const x = 500 - (r / 2);
          const y = 500 + (r / 2);
          return (
            <text 
              key={`inn-${i}`} 
              x={x} y={y} 
              className="radar-text" 
              textAnchor="middle" 
              transform={`rotate(45, ${x}, ${y}) translate(0, 15)`}
            >
              {label}
            </text>
          );
        })}

        {/* --- TITRES AXES --- */}
        <text x="500" y="35" textAnchor="middle" className="radar-axis-label">Engineering Excellence</text>
        <text x="965" y="500" textAnchor="middle" className="radar-axis-label" transform="rotate(90, 965, 500)">Delivery & Impact</text>
        <text x="500" y="985" textAnchor="middle" className="radar-axis-label">People</text>
        <text x="35" y="500" textAnchor="middle" className="radar-axis-label" transform="rotate(-90, 35, 500)">Innovation & Strategy</text>

        {/* --- OVERLAYS --- */}

        {/* Manager Overlay */}
        {showManager && managerData && (
          <polygon
            points={getPolygonPoints(managerData)}
            fill="rgba(255, 255, 255, 0.1)"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
        )}

        {/* Self Overlay */}
        <polygon
          points={getPolygonPoints(data)}
          fill="rgba(34, 197, 94, 0.45)"
          stroke="#22c55e"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        
        {/* Petits cercles aux sommets du polygone Self pour finition */}
        {[data.engineering, data.delivery, data.people, data.innovation].map((val, i) => {
           // On recalcule juste les coords x,y pour les points
           let cx = 500, cy = 500;
           const r = getRadius(val);
           if (i === 0) cy -= r; // Top
           if (i === 1) cx += r; // Right
           if (i === 2) cy += r; // Bottom
           if (i === 3) cx -= r; // Left
           return <circle key={i} cx={cx} cy={cy} r="4" fill="#22c55e" stroke="black" strokeWidth="1" />;
        })}

      </svg>
    </div>
  );
}
