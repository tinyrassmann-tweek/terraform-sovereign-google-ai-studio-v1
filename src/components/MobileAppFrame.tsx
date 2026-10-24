import React from "react";
import { Smartphone, Monitor, ShieldCheck, Wifi, Battery } from "lucide-react";

interface MobileAppFrameProps {
  children: React.ReactNode;
  isMobileMode: boolean;
  setIsMobileMode: (val: boolean) => void;
  isOffline: boolean;
}

export function MobileAppFrame({ children, isMobileMode, setIsMobileMode, isOffline }: MobileAppFrameProps) {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Viewport controls top bar */}
      <div className="w-full max-w-7xl px-4 py-2 mb-4 bg-tt-ivory rounded-xl border border-tt-gold/30 flex flex-wrap justify-between items-center gap-2 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-tt-navy tracking-tight font-mono">PLATFORM VIEWPORT MODE:</span>
          <div className="bg-tt-cream/80 p-0.5 rounded-lg flex items-center border border-tt-gold/20">
            <button
              onClick={() => setIsMobileMode(false)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                !isMobileMode
                  ? "bg-tt-navy text-tt-gold shadow-sm"
                  : "text-tt-navy/60 hover:text-tt-navy"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop Portal
            </button>
            <button
              onClick={() => setIsMobileMode(true)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                isMobileMode
                  ? "bg-tt-navy text-tt-gold shadow-sm"
                  : "text-tt-navy/60 hover:text-tt-navy"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile App Previews
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isOffline && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-tt-amber bg-tt-navy border border-tt-gold/30 px-2.5 py-0.5 rounded-full animate-pulse">
              <Wifi className="w-3 h-3 text-tt-gold line-through" /> Offline Engine Active
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-tt-navy font-bold font-sans">
            <ShieldCheck className="w-4 h-4 text-tt-gold" />
            Vetting: Verified Professional Liability Covered
          </span>
        </div>
      </div>

      {isMobileMode ? (
        /* Real Virtual Phone Shell Frame */
        <div className="relative mx-auto my-4 w-[385px] h-[812px] bg-slate-950 rounded-[55px] p-3 shadow-2xl border-[10px] border-tt-navy flex flex-col overflow-hidden transition-all duration-300">
          {/* Speaker earphone & camera notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-40 flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-800 rounded-full mb-1"></div>
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full ml-2 mb-1 border border-slate-800"></div>
          </div>

          {/* Simulated Mobile Status Bar */}
          <div className="w-full flex justify-between items-center px-6 pt-3 pb-1.5 bg-white text-slate-950 font-mono text-xs select-none z-30 shrink-0 border-b border-slate-100">
            <span>14:05</span>
            <div className="flex items-center gap-1.5">
              {isOffline ? (
                <Wifi className="w-3 h-3 text-amber-500 line-through" />
              ) : (
                <Wifi className="w-3 h-3 text-slate-700" />
              )}
              <span className="text-[9px] font-bold">5G</span>
              <Battery className="w-4 h-4 text-slate-700" />
            </div>
          </div>

          {/* Actual Application Screen viewport inside phone */}
          <div className="w-full h-full bg-tt-cream overflow-y-auto flex flex-col rounded-[32px] overflow-hidden relative">
            {children}
          </div>

          {/* Simulated iOS home bar indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-700 rounded-full z-40"></div>
        </div>
      ) : (
        /* Standard desktop view rendering children straight out */
        <div className="w-full bg-white rounded-2xl border border-tt-gold/30 shadow-md p-6 min-h-[700px] transition-all">
          {children}
        </div>
      )}
    </div>
  );
}
