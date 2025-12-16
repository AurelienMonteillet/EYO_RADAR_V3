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
          // Round to nearest integer (1-5) to determine active label
          const activeIndex = Math.round(currentValue) - 1;
          
          return (
            <div key={axis.key} className="slider-block">
              <div className="slider-header">
                <span className="title">{axis.label}</span>
                <span className="value">{currentValue.toFixed(1)}</span>
              </div>

              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={currentValue}
                onChange={(e) => onChange(axis.key, parseFloat(e.target.value))}
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
                {labels.map((label, index) => (
                  <span
                    key={label}
                    className={`tick ${index === activeIndex ? 'active' : ''}`}
                  >
                    {label.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
