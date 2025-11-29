import React from 'react';
import { Cpu, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-950/80 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute -inset-1 bg-purple-600 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-200"></div>
            <div className="relative bg-slate-900 border border-slate-700 p-2 rounded-lg">
               <Cpu size={28} className="text-purple-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
              Xperto <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">IndustrIAL</span>
            </h1>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-[10px] text-cyan-500/80 font-mono uppercase tracking-[0.2em]">Sistema Neural Activo</p>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <Zap size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-mono text-purple-200">Modo: Experto</span>
          </div>
        </div>
      </div>
    </header>
  );
};