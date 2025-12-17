import React from 'react';
import { RadarData, AxisKey, LADDERS } from '@/types';

interface Props {
  data: RadarData;
  onChange: (key: AxisKey, val: number) => void;
  label: string;
}

const AXIS_CONFIG: { key: AxisKey; label: string }[] = [
  { key: 'engineering', label: 'Engineering Excellence' },
  { key: 'delivery', label: 'Delivery & Impact' },
  { key: 'people', label: 'People' },
  { key: 'innovation', label: 'Innovation & Strategy' },
];

export default function SlidersPanel({ data, onChange, label }: Props) {
  return (
    <div className="bg-black-800 border border-black-600 rounded-2xl p-6 w-full max-w-2xl mt-6">
      <h2 className="text-lg font-heading font-normal text-white-900 mb-6 border-b border-black-600 pb-2">{label}</h2>
      
      <div>
        {AXIS_CONFIG.map((axis) => {
          const labels = LADDERS[axis.key];
          const currentValue = data[axis.key];
          
          // Determine which labels should be active
          // If value is a half-step (e.g., 2.5), highlight both adjacent labels
          const isHalfStep = currentValue % 1 === 0.5;
          const lowerIndex = Math.floor(currentValue) - 1;
          const upperIndex = Math.ceil(currentValue) - 1;
          
          return (
            <div key={axis.key} className="slider-block">
              <div className="slider-header">
                <span className="title">{axis.label}</span>
              </div>

              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={currentValue}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value);
                  // Validation explicite : clamp entre 1 et 5
                  const clampedValue = Math.max(1, Math.min(5, newValue));
                  if (!isNaN(clampedValue) && isFinite(clampedValue)) {
                    onChange(axis.key, clampedValue);
                  }
                }}
                className="range"
              />

              {/* Tick marks for 0.5 step increments */}
              <div className="slider-ticks">
                {Array.from({ length: 9 }, (_, i) => {
                  const isMajor = i % 2 === 0; // Major at 0, 2, 4, 6, 8 (1, 2, 3, 4, 5)
                  const tickValue = 1 + (i * 0.5);
                  const activeTickIndex = Math.round(currentValue * 2 - 2);
                  const isActive = i === activeTickIndex;
                  
                  return (
                    <span
                      key={i}
                      className={`tick ${isMajor ? 'major' : 'minor'} ${isActive ? 'active' : ''}`}
                    />
                  );
                })}
              </div>

              <div className="slider-labels">
                {labels.map((label, index) => {
                  // Determine if this label should be active
                  let isActive = false;
                  if (isHalfStep) {
                    // Between two values: highlight both adjacent labels
                    isActive = index === lowerIndex || index === upperIndex;
                  } else {
                    // Exact value: highlight only the matching label
                    isActive = index === Math.round(currentValue) - 1;
                  }
                  
                  return (
                    <span
                      key={label}
                      className={`tick ${isActive ? 'active' : ''}`}
                    >
                      {label.toUpperCase()}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

