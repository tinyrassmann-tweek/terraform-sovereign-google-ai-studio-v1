import React, { useState } from "react";

interface CostAllocationChartProps {
  labor: number;
  materials: number;
  permits: number;
}

export function CostAllocationChart({ labor, materials, permits }: CostAllocationChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = [
    { name: "Labor", value: labor, color: "#D4AF37", hoverColor: "#F5D061" },
    { name: "Materials", value: materials, color: "#F5F0E8", hoverColor: "#FBF7F0" },
    { name: "Permits", value: permits, color: "#FFBF00", hoverColor: "#FFD043" }
  ];

  const total = labor + materials + permits || 1;
  const radius = 36;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius; // ~226.19

  let accumulatedPercent = 0;

  return (
    <div className="bg-tt-navy p-3 rounded-xl border border-tt-gold/30 space-y-2 relative overflow-hidden">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_40px,rgba(212,175,55,0.015)_40px,rgba(212,175,55,0.015)_41px)] pointer-events-none"></div>
      <span className="text-[9px] uppercase font-bold text-tt-gold tracking-wider block font-mono relative z-10">
        Cost Allocation Chart
      </span>
      <div className="h-[140px] w-full relative flex items-center justify-center z-10">
        <svg width="120" height="120" className="transform -rotate-90">
          {data.map((slice, index) => {
            const percent = slice.value / total;
            const sliceLength = percent * circumference;
            // Introduce a small gap between slices if multiple slices exist
            const gap = percent > 0 && percent < 1 ? 1.5 : 0;
            const adjustedLength = Math.max(0, sliceLength - gap);
            const dashArray = `${adjustedLength} ${circumference - adjustedLength}`;
            const dashOffset = -accumulatedPercent * circumference;
            accumulatedPercent += percent;

            const isHovered = hoveredIndex === index;

            if (slice.value === 0) return null;

            return (
              <circle
                key={slice.name}
                id={`cost-allocation-slice-${slice.name.toLowerCase()}`}
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke={isHovered ? slice.hoverColor : slice.color}
                strokeWidth={isHovered ? strokeWidth + 2.5 : strokeWidth}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer origin-center"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center Label Context */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center select-none">
          {hoveredIndex !== null ? (
            <>
              <span className="text-[8px] text-tt-ivory/70 uppercase font-mono font-bold tracking-wider">
                {data[hoveredIndex].name}
              </span>
              <span className="text-[11px] font-bold text-tt-cream">
                ${data[hoveredIndex].value.toLocaleString()}
              </span>
              <span className="text-[8px] text-tt-gold font-mono font-semibold">
                {Math.round((data[hoveredIndex].value / total) * 100)}%
              </span>
            </>
          ) : (
            <>
              <span className="text-[7px] text-tt-ivory/60 uppercase font-mono tracking-wider">Total</span>
              <span className="text-[11px] font-bold text-tt-cream">
                ${(labor + materials + permits).toLocaleString()}
              </span>
              <span className="text-[7px] text-tt-gold font-mono">Breakdown</span>
            </>
          )}
        </div>
      </div>
      
      {/* Compact custom legend with percentages */}
      <div className="grid grid-cols-3 gap-1 text-[8px] text-tt-ivory font-mono text-center relative z-10">
        {(() => {
          const laborPct = Math.round((labor / total) * 100);
          const materialsPct = Math.round((materials / total) * 100);
          const permitsPct = 100 - laborPct - materialsPct; // Ensure it adds up exactly to 100%
          return (
            <>
              <button 
                id="legend-btn-labor"
                className={`flex flex-col items-center justify-center bg-tt-midnight/40 p-1.5 rounded border transition-all cursor-pointer ${
                  hoveredIndex === 0 ? "border-tt-gold bg-tt-gold/10 scale-[1.02]" : "border-tt-gold/10"
                }`}
                onMouseEnter={() => setHoveredIndex(0)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span className="font-bold text-tt-cream">{laborPct}%</span>
                </div>
                <span className="text-[7px] text-tt-ivory/60 mt-0.5">Labor</span>
              </button>
              <button 
                id="legend-btn-materials"
                className={`flex flex-col items-center justify-center bg-tt-midnight/40 p-1.5 rounded border transition-all cursor-pointer ${
                  hoveredIndex === 1 ? "border-tt-gold bg-tt-gold/10 scale-[1.02]" : "border-tt-gold/10"
                }`}
                onMouseEnter={() => setHoveredIndex(1)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5F0E8]" />
                  <span className="font-bold text-tt-cream">{materialsPct}%</span>
                </div>
                <span className="text-[7px] text-tt-ivory/60 mt-0.5">Materials</span>
              </button>
              <button 
                id="legend-btn-permits"
                className={`flex flex-col items-center justify-center bg-tt-midnight/40 p-1.5 rounded border transition-all cursor-pointer ${
                  hoveredIndex === 2 ? "border-tt-gold bg-tt-gold/10 scale-[1.02]" : "border-tt-gold/10"
                }`}
                onMouseEnter={() => setHoveredIndex(2)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFBF00]" />
                  <span className="font-bold text-tt-cream">{permitsPct}%</span>
                </div>
                <span className="text-[7px] text-tt-ivory/60 mt-0.5">Permits</span>
              </button>
            </>
          );
        })()}
      </div>
    </div>
  );
}
