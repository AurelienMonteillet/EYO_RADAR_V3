'use client';

import React, { useState } from 'react';
import RadarDiagram from '@/components/RadarDiagram';
import SlidersPanel from '@/components/SlidersPanel';
import { downloadPNG, downloadSVG } from '@/lib/export';
import { RadarData, AxisKey } from '@/types';

// Default initial state
const INITIAL_DATA: RadarData = {
  engineering: 1.0,
  delivery: 1.0,
  people: 1.0,
  innovation: 1.0,
};

// Example manager data
const MANAGER_DATA: RadarData = {
  engineering: 3.5,
  delivery: 4.0,
  people: 2.5,
  innovation: 3.0,
};

export default function Home() {
  const [data, setData] = useState<RadarData>(INITIAL_DATA);
  const [showManager, setShowManager] = useState(false);

  const handleSliderChange = (key: AxisKey, val: number) => {
    setData((prev) => ({ ...prev, [key]: val }));
  };

  const handleReset = () => setData(INITIAL_DATA);

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans flex flex-col items-center">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">EOY Radar V3</h1>
        <p className="text-gray-500">Self-Evaluation Framework</p>
      </div>

      {/* Diagram Section */}
      <div className="w-full flex justify-center mb-8">
        <RadarDiagram 
          id="eoy-radar" 
          data={data} 
          managerData={MANAGER_DATA}
          showManager={showManager}
        />
      </div>

      {/* Controls & Legend */}
      <div className="flex flex-wrap gap-4 items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500/40 border border-green-500 rounded"></div>
          <span className="text-sm text-gray-300">Self</span>
        </div>
        
        <label className="flex items-center gap-2 cursor-pointer select-none">
           <input 
             type="checkbox" 
             checked={showManager} 
             onChange={(e) => setShowManager(e.target.checked)}
             className="w-4 h-4 accent-gray-500"
           />
           <div className="w-4 h-4 border border-dashed border-gray-400 bg-white/10 rounded"></div>
           <span className="text-sm text-gray-300">Manager Benchmark</span>
        </label>
      </div>

      {/* Input Section */}
      <SlidersPanel 
        data={data} 
        onChange={handleSliderChange} 
        label="Votre Auto-évaluation" 
      />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-8 justify-center w-full max-w-2xl">
        <button 
          onClick={handleReset}
          className="px-6 py-2 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors"
        >
          Reset
        </button>
        <div className="flex-grow"></div>
        <button 
          onClick={() => downloadSVG('eoy-radar', 'eoy-radar-v3.svg')}
          className="px-6 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors font-medium border border-gray-700"
        >
          Export SVG
        </button>
        <button 
          onClick={() => downloadPNG('eoy-radar', 'eoy-radar-v3.png')}
          className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-colors font-medium shadow-lg shadow-green-900/20"
        >
          Export PNG
        </button>
      </div>

      <footer className="mt-16 text-gray-600 text-xs">
        EOY Radar Tool - V3 Framework
      </footer>
    </main>
  );
}
