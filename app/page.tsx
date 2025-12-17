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
const INITIAL_MANAGER_DATA: RadarData = {
  engineering: 3.5,
  delivery: 4.0,
  people: 2.5,
  innovation: 3.0,
};

export default function Home() {
  const [data, setData] = useState<RadarData>(INITIAL_DATA);
  const [managerData, setManagerData] = useState<RadarData>(INITIAL_MANAGER_DATA);
  const [showManager, setShowManager] = useState(false);
  const [lightBackground, setLightBackground] = useState(false);

  const handleSliderChange = (key: AxisKey, val: number) => {
    setData((prev) => ({ ...prev, [key]: val }));
  };

  const handleManagerSliderChange = (key: AxisKey, val: number) => {
    setManagerData((prev) => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    setData(INITIAL_DATA);
    setManagerData(INITIAL_MANAGER_DATA);
  };

  return (
    <main className="relative min-h-screen bg-black-900 text-white-900 p-4 md:p-8 font-sans flex flex-col items-center">
      {/* Gradient de fond radial */}
      <div className="absolute inset-0 bg-gradient-dark-radial pointer-events-none"></div>
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Light Background Toggle - Top Right */}
        <div className="absolute top-0 right-0 z-20">
          <button
            onClick={() => setLightBackground(!lightBackground)}
            className="inline-flex h-10 items-center justify-center rounded-full border border-white-600 bg-transparent text-white-900 px-4 font-heading font-normal text-sm leading-6 transition-all hover:bg-white-900/10 cursor-pointer focus-visible:ring-[3px] focus-visible:ring-[#8aabff]"
            aria-label={lightBackground ? "Switch to dark background" : "Switch to light background"}
          >
            {lightBackground ? (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Dark
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Light
              </span>
            )}
          </button>
        </div>
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-normal tracking-tight mb-2 text-white-900">EOY Radar V3</h1>
          <p className="text-white-600 text-base font-light">Self-Evaluation Framework</p>
        </div>

        {/* Diagram Section - Single graph with both overlays */}
        <div className="w-full flex justify-center mb-10">
          <RadarDiagram 
            id="eoy-radar" 
            data={data} 
            managerData={showManager ? managerData : undefined}
            showManager={showManager}
            lightBackground={lightBackground}
            onDataChange={handleSliderChange}
            onManagerDataChange={handleManagerSliderChange}
          />
        </div>

        {/* Controls & Legend */}
        <div className="flex flex-wrap gap-6 items-center justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 bg-green-500/40 border border-green-500 rounded"></div>
            <span className="text-sm text-white-600 font-light">Self</span>
          </div>
          
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
             <input 
               type="checkbox" 
               checked={showManager} 
               onChange={(e) => setShowManager(e.target.checked)}
               className="w-4 h-4 accent-brand-blue-600 cursor-pointer"
             />
             <div className="w-4 h-4 border border-brand-blue-600/50 bg-brand-blue-600/10 rounded"></div>
             <span className="text-sm text-white-600 font-light">Manager View</span>
          </label>
        </div>

        {/* Input Sections */}
        {showManager ? (
          // Two slider panels side by side when manager mode is enabled
          <div className="w-full max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SlidersPanel 
                data={data} 
                onChange={handleSliderChange} 
                label="Your Self-Assessment" 
              />
              <SlidersPanel 
                data={managerData} 
                onChange={handleManagerSliderChange} 
                label="Manager Assessment" 
              />
            </div>
          </div>
        ) : (
          // Single slider panel when manager mode is disabled
          <SlidersPanel 
            data={data} 
            onChange={handleSliderChange} 
            label="Your Self-Assessment" 
          />
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8 justify-center w-full max-w-2xl">
          <button 
            onClick={handleReset}
            className="inline-flex h-10 items-center justify-center rounded-full border border-white-600 bg-transparent text-white-900 px-4 font-heading font-normal text-sm leading-6 transition-all hover:bg-white-900/10 cursor-pointer focus-visible:ring-[3px] focus-visible:ring-[#8aabff]"
          >
            Reset
          </button>
          <div className="flex-grow"></div>
          <button 
            onClick={() => downloadSVG('eoy-radar', 'eoy-radar-v3.svg')}
            className="inline-flex h-12 items-center justify-center rounded-full bg-white-700 text-black-900 px-5 font-heading font-normal text-lg leading-7 transition-all hover:bg-white-900 cursor-pointer focus-visible:ring-[3px] focus-visible:ring-[#8aabff]"
          >
            Export SVG
          </button>
          <button 
            onClick={() => downloadPNG('eoy-radar', 'eoy-radar-v3.png')}
            className="inline-flex h-12 items-center justify-center rounded-full bg-white-700 text-black-900 px-5 font-heading font-normal text-lg leading-7 transition-all hover:bg-white-900 cursor-pointer focus-visible:ring-[3px] focus-visible:ring-[#8aabff]"
          >
            Export PNG
          </button>
        </div>

        <footer className="mt-16 text-white-600 text-xs font-light text-center">
          <div>EOY Radar Tool - V3 Framework</div>
          <div className="mt-2">Framework by Pierre Mary</div>
          <div className="mt-1">Tool by Aurelien Monteillet</div>
        </footer>
      </div>
    </main>
  );
}
