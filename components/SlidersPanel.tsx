import React from 'react';
import { RadarData, AxisKey } from '@/types';

interface Props {
  data: RadarData;
  onChange: (key: AxisKey, val: number) => void;
  label: string;
}

const AXIS_CONFIG: { key: AxisKey; label: string; minLabel: string; maxLabel: string }[] = [
  { key: 'engineering', label: 'Engineering Excellence', minLabel: 'Learns', maxLabel: 'Pioneers' },
  { key: 'delivery', label: 'Delivery & Impact', minLabel: 'Tasks', maxLabel: 'Strategy' },
  { key: 'people', label: 'People', minLabel: 'Absorbs', maxLabel: 'Elevates' },
  { key: 'innovation', label: 'Innovation & Strategy', minLabel: 'Follows', maxLabel: 'Envisions' },
];

export default function SlidersPanel({ data, onChange, label }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-2xl mt-6">
      <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-2">{label}</h2>
      
      <div className="space-y-8">
        {AXIS_CONFIG.map((axis) => (
          <div key={axis.key} className="space-y-2">
            <div className="flex justify-between items-center text-sm font-medium text-gray-400">
              <span>{axis.label}</span>
              <span className="text-green-400 font-mono text-base">{data[axis.key].toFixed(1)}</span>
            </div>

            <div className="relative h-12 flex items-center">
              {/* Range Input */}
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={data[axis.key]}
                onChange={(e) => onChange(axis.key, parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500 z-10 relative"
              />
              
              {/* Tick Marks Visuals (Background) */}
              <div className="absolute w-full flex justify-between px-1 top-8 pointer-events-none">
                {[1, 2, 3, 4, 5].map((tick) => (
                  <div key={tick} className="flex flex-col items-center">
                    <div className="w-0.5 h-2 bg-gray-600 mb-1"></div>
                    <span className="text-[10px] text-gray-500">{tick}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-500 uppercase tracking-wider font-semibold">
              <span>{axis.minLabel}</span>
              <span>{axis.maxLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
