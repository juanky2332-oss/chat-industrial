import React from 'react';
import { AnalysisResult } from '../types';
import { FileDown, CheckCircle, AlertTriangle, Layers, BarChart2, BookOpen, Cpu } from 'lucide-react';
import { generateIndustrialReport } from '../utils/pdfGenerator';

interface ResultsViewProps {
  data: AnalysisResult;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ data }) => {
  
  const handleDownloadPDF = () => {
    generateIndustrialReport(data);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header Section */}
      <div className="relative overflow-hidden bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-cyan-500"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 font-mono">
            {data.productDetails.productName}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-2 py-0.5 bg-slate-800 text-cyan-400 text-xs rounded border border-cyan-900/50 font-mono tracking-wider">
               REF: {data.productDetails.referenceCode}
            </span>
            <span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded border border-green-900/50 flex items-center gap-1 font-mono uppercase">
               <CheckCircle size={10} /> Identificación Positiva
            </span>
            <span className="px-2 py-0.5 bg-purple-900/30 text-purple-400 text-xs rounded border border-purple-900/50 font-mono">
              Confianza: {data.confidence}%
            </span>
          </div>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="relative z-10 flex items-center gap-2 bg-slate-950 text-white px-6 py-3 rounded-lg font-mono text-sm border border-slate-700 hover:border-cyan-500 hover:text-cyan-400 transition-all shadow-lg hover:shadow-cyan-900/20 group-hover:translate-x-1 duration-300"
        >
          <FileDown size={16} />
          EXPORTAR INFORME.PDF
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Technical Specs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Technical Table */}
          <section className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="bg-slate-950/50 border-b border-slate-800 px-6 py-4 flex items-center gap-2">
              <Layers size={18} className="text-cyan-500" />
              <h3 className="font-bold text-slate-200 font-mono tracking-wide text-sm">ESPECIFICACIONES TÉCNICAS</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-950 text-slate-500 font-mono text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 border-b border-slate-800 w-1/3">Parámetro</th>
                    <th className="px-6 py-4 border-b border-slate-800">Valor / Descripción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 font-mono">
                  {data.productDetails.rawTableData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-4 text-slate-400 bg-slate-900/50 border-r border-slate-800/50 group-hover:text-cyan-400 transition-colors">{row.specification}</td>
                      <td className="px-6 py-4 text-slate-200">{row.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Variants Section */}
          <section className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
             <div className="bg-slate-950/50 border-b border-slate-800 px-6 py-4 flex items-center gap-2">
              <BookOpen size={18} className="text-purple-500" />
              <h3 className="font-bold text-slate-200 font-mono tracking-wide text-sm">VARIANTES DE SISTEMA</h3>
            </div>
            <div className="p-6 text-slate-300 text-sm leading-relaxed">
              <div dangerouslySetInnerHTML={{ 
                __html: data.variantsNarrative
                  .replace(/\n/g, '<br/>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-mono text-purple-300">$1</strong>')
               }} />
            </div>
          </section>

          {/* Comparison Table */}
           {data.comparisonTable.length > 0 && (
            <section className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
              <div className="bg-slate-950/50 border-b border-slate-800 px-6 py-4 flex items-center gap-2">
                <BarChart2 size={18} className="text-emerald-500" />
                <h3 className="font-bold text-slate-200 font-mono tracking-wide text-sm">MATRIZ COMPARATIVA</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left font-mono">
                  <thead className="bg-slate-950 text-slate-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-4 border-b border-slate-800">Propiedad</th>
                      {data.comparisonTable.map((brand, i) => (
                        <th key={i} className="px-4 py-4 border-b border-slate-800 min-w-[140px] text-emerald-400/80">{brand.brandName}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {[
                      { label: 'REF', key: 'referenceCode' },
                      { label: 'MATERIAL', key: 'material' },
                      { label: 'DIMS', key: 'dimensions' },
                      { label: 'CAPACIDAD', key: 'capacity' },
                    ].map((rowSpec, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-800/20'}>
                        <td className="px-4 py-3 text-slate-500 border-r border-slate-800">{rowSpec.label}</td>
                        {data.comparisonTable.map((brand, i) => (
                          // @ts-ignore
                          <td key={i} className="px-4 py-3 text-slate-300">{brand[rowSpec.key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
           )}

        </div>

        {/* Right Column: Recommendations */}
        <div className="lg:col-span-1">
           <section className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)] overflow-hidden sticky top-6">
             <div className="bg-purple-900/20 border-b border-purple-500/20 px-6 py-4 flex items-center justify-between backdrop-blur-sm">
                <h3 className="font-bold text-purple-100 flex items-center gap-2 font-mono text-sm tracking-wider">
                  <Cpu size={18} className="text-purple-400 animate-pulse" />
                  ANÁLISIS EXPERTO
                </h3>
             </div>
             <div className="p-6 space-y-4 text-sm leading-relaxed text-slate-300">
                <div dangerouslySetInnerHTML={{ 
                  __html: data.recommendations
                    .replace(/\n/g, '<br/>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-300 font-mono">$1</strong>')
                    .replace(/^- (.*)/gm, '<div class="flex gap-3 mb-3 pl-2 border-l-2 border-purple-500/50"><span class="text-slate-200">$1</span></div>')
                }} />
             </div>
             <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-600 font-mono text-center">
               ANÁLISIS GENERADO POR IA :: VERIFICAR DATOS CRÍTICOS EN DATASHEET OFICIAL
             </div>
           </section>
        </div>

      </div>
    </div>
  );
};