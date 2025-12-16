import React, { useState, useRef } from 'react';
import { RadarData, LADDERS, AxisKey } from '@/types';

interface Props {
  data: RadarData;
  managerData?: RadarData;
  showManager: boolean;
  id?: string;
  onDataChange?: (key: AxisKey, value: number) => void;
  onManagerDataChange?: (key: AxisKey, value: number) => void;
}

const CENTER = 600; // Centré dans le viewBox 1200x1200
// On a besoin de place pour 5 niveaux pointillés + 1 cadre solide
// Disons que le cadre solide est à 500px (plus d'espace pour les labels).
// On divise l'espace en 6 intervalles égaux pour l'harmonie visuelle.
const MAX_RADIUS = 500;
const STEPS = 6; 
const STEP_SIZE = MAX_RADIUS / STEPS; // ~83px par niveau

// On génère les 6 rayons : [83, 166, 249, 332, 415, 500]
const RADII = Array.from({ length: STEPS }, (_, i) => (i + 1) * STEP_SIZE);

// Helper : Map le score (1..5) sur les rayons (1..5)
// Score 1.0 => Rayon 1 (83px)
// Score 5.0 => Rayon 5 (415px) -> C'est la ligne "Pioneers" (dernier pointillé)
// Le Rayon 6 (500px) reste le cadre vide
const getRadius = (score: number) => {
  const clamped = Math.max(0, Math.min(score, 5));
  return clamped * STEP_SIZE;
};

// Helper : Convertir un rayon en score (1..5)
const getScoreFromRadius = (radius: number) => {
  const clamped = Math.max(0, Math.min(radius, MAX_RADIUS));
  const score = (clamped / STEP_SIZE);
  return Math.max(1, Math.min(5, Math.round(score * 10) / 10)); // Arrondir à 0.1
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

export default function RadarDiagram({ data, managerData, showManager, id, onDataChange, onManagerDataChange }: Props) {
  const [dragging, setDragging] = useState<{ type: 'self' | 'manager', axis: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Convertir les coordonnées SVG en coordonnées écran
  const getSVGPoint = (clientX: number, clientY: number): { x: number; y: number } | null => {
    if (!svgRef.current) return null;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x: svgPoint.x, y: svgPoint.y };
  };

  // Calculer la distance depuis le centre et convertir en score
  // Les points sont contraints le long de leur axe respectif
  const calculateScoreFromPosition = (x: number, y: number, axisIndex: number): number => {
    let distance: number;
    if (axisIndex === 0) { // Top (engineering) - mouvement vertical uniquement
      distance = CENTER - y;
    } else if (axisIndex === 1) { // Right (delivery) - mouvement horizontal uniquement
      distance = x - CENTER;
    } else if (axisIndex === 2) { // Bottom (people) - mouvement vertical uniquement
      distance = y - CENTER;
    } else { // Left (innovation) - mouvement horizontal uniquement
      distance = CENTER - x;
    }
    // Contrainte : distance doit être positive et dans les limites
    const clampedDistance = Math.max(0, Math.min(Math.abs(distance), MAX_RADIUS));
    return getScoreFromRadius(clampedDistance);
  };

  const handleMouseDown = (e: React.MouseEvent, type: 'self' | 'manager', axisIndex: number) => {
    e.preventDefault();
    setDragging({ type, axis: axisIndex });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !svgRef.current) return;
    
    const svgPoint = getSVGPoint(e.clientX, e.clientY);
    if (!svgPoint) return;

    const newScore = calculateScoreFromPosition(svgPoint.x, svgPoint.y, dragging.axis);
    const axisKeys: AxisKey[] = ['engineering', 'delivery', 'people', 'innovation'];
    const axisKey = axisKeys[dragging.axis];

    if (dragging.type === 'self' && onDataChange) {
      onDataChange(axisKey, newScore);
    } else if (dragging.type === 'manager' && onManagerDataChange) {
      onManagerDataChange(axisKey, newScore);
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  return (
    <div className="w-full max-w-[400px] md:max-w-[800px] lg:max-w-[1000px] aspect-square mx-auto border border-black-600 rounded-2xl overflow-hidden bg-black-800 relative shadow-[0_0_40px_rgba(0,0,0,0.3)]">
      <svg
        ref={svgRef}
        id={id}
        viewBox="0 0 1200 1200"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: dragging ? 'grabbing' : 'default' }}
      >
        <defs>
          <style>
            {`
              .radar-text { font-family: 'Roboto', sans-serif; font-size: 12px; fill: hsl(0 0% 70%); letter-spacing: 0.3px; font-weight: 300; }
              .radar-axis-label { font-family: 'Roboto', sans-serif; font-size: 22px; font-weight: 400; fill: hsl(0 0% 100%); letter-spacing: 0; }
            `}
          </style>
        </defs>

        <rect x="0" y="0" width="1200" height="1200" fill="hsl(0 0% 9%)" />

        {/* --- GRILLE FIXE --- */}

        {/* Axes principaux */}
        <line x1="600" y1="50" x2="600" y2="1150" stroke="hsl(0 0% 70%)" strokeWidth="1.5" opacity="0.3" />
        <line x1="50" y1="600" x2="1150" y2="600" stroke="hsl(0 0% 70%)" strokeWidth="1.5" opacity="0.3" />

        {/* Les Anneaux */}
        {RADII.map((r, i) => {
          // Les 5 premiers (index 0 à 4) sont pointillés. Le 6ème (index 5) est solide.
          const isOuterFrame = i === STEPS - 1; 
          return (
            <polygon
              key={r}
              points={`600,${600 - r} ${600 + r},600 600,${600 + r} ${600 - r},600`}
              fill="none"
              stroke={isOuterFrame ? "hsl(0 0% 70%)" : "hsl(0 0% 70%)"}
              strokeWidth={isOuterFrame ? "2" : "1.5"}
              strokeDasharray={isOuterFrame ? "0" : "8 6"}
              opacity={isOuterFrame ? "0.5" : "0.3"}
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
          // x = 600 - r/2, y = 600 - r/2
          const x = 600 - (r / 2);
          const y = 600 - (r / 2);
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
          const x = 600 + (r / 2);
          const y = 600 - (r / 2);
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
          const x = 600 + (r / 2);
          const y = 600 + (r / 2);
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
          const x = 600 - (r / 2);
          const y = 600 + (r / 2);
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
        <text x="600" y="30" textAnchor="middle" className="radar-axis-label">Engineering Excellence</text>
        <text x="1170" y="600" textAnchor="middle" className="radar-axis-label" transform="rotate(90, 1170, 600)">Delivery & Impact</text>
        <text x="600" y="1180" textAnchor="middle" className="radar-axis-label">People</text>
        <text x="30" y="600" textAnchor="middle" className="radar-axis-label" transform="rotate(-90, 30, 600)">Innovation & Strategy</text>

        {/* --- OVERLAYS --- */}

        {/* Self Overlay (Green) - Always visible */}
        <polygon
          points={getPolygonPoints(data)}
          fill="rgba(34, 197, 94, 0.35)"
          stroke="#22c55e"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        
        {/* Petits cercles aux sommets du polygone Self pour finition - Draggable */}
        {[data.engineering, data.delivery, data.people, data.innovation].map((val, i) => {
           // On recalcule juste les coords x,y pour les points
           let cx = CENTER, cy = CENTER;
           const r = getRadius(val);
           if (i === 0) cy -= r; // Top
           if (i === 1) cx += r; // Right
           if (i === 2) cy += r; // Bottom
           if (i === 3) cx -= r; // Left
           const isDragging = dragging?.type === 'self' && dragging.axis === i;
           return (
             <circle 
               key={`self-${i}`} 
               cx={cx} 
               cy={cy} 
               r={isDragging ? "7" : "6"} 
               fill="#22c55e" 
               stroke="#FFFFFF" 
               strokeWidth={isDragging ? "2.5" : "2"}
               style={{ cursor: 'grab' }}
               onMouseDown={(e) => handleMouseDown(e, 'self', i)}
             />
           );
        })}

        {/* Manager Overlay (Tezos Blue Light) - Only when showManager is true */}
        {showManager && managerData && (
          <>
            <polygon
              points={getPolygonPoints(managerData)}
              fill="rgba(92, 114, 250, 0.2)"
              stroke="hsl(226 95% 58%)"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeDasharray="6 4"
            />
            
            {/* Petits cercles aux sommets du polygone Manager pour finition - Draggable */}
            {[managerData.engineering, managerData.delivery, managerData.people, managerData.innovation].map((val, i) => {
               // On recalcule juste les coords x,y pour les points
               let cx = CENTER, cy = CENTER;
               const r = getRadius(val);
               if (i === 0) cy -= r; // Top
               if (i === 1) cx += r; // Right
               if (i === 2) cy += r; // Bottom
               if (i === 3) cx -= r; // Left
               const isDragging = dragging?.type === 'manager' && dragging.axis === i;
               return (
                 <circle 
                   key={`manager-${i}`} 
                   cx={cx} 
                   cy={cy} 
                   r={isDragging ? "7" : "6"} 
                   fill="hsl(226 95% 58%)" 
                   stroke="#FFFFFF" 
                   strokeWidth={isDragging ? "2.5" : "2"}
                   style={{ cursor: 'grab' }}
                   onMouseDown={(e) => handleMouseDown(e, 'manager', i)}
                 />
               );
            })}
          </>
        )}

      </svg>
    </div>
  );
}
