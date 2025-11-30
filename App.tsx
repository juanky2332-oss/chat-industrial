// @ts-nocheck
import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { ResultsView } from './components/ResultsView';
import { AnalysisResult, FileUpload } from './types';
import { AlertTriangle, Terminal } from 'lucide-react';

// --- CONFIGURACIÓN DEL CEREBRO (n8n) ---
const N8N_WEBHOOK_URL = 'https://personal-n8n.t9gkry.easypanel.host/webhook/chatbot-transformaconia'; 
// ---------------------------------------

const App: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (text: string, files: FileUpload[]) => {
    if (!text && files.length === 0) return;

    setIsAnalyzing(true);
    setError(null);
    setData(null);

    try {
      // 1. Preparar el mensaje para n8n
      const payload = {
        question: text || "Analiza este producto (consulta sin texto)",
        thread_id: 'web_client_' + Math.random().toString(36).substr(2, 9)
      };

      // 2. Llamar a n8n
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error de conexión con el Experto (Status: ${response.status})`);
      }

      const responseData = await response.json();
      
      // 3. Procesar respuesta de n8n
      const rawText = responseData.response || responseData.output || JSON.stringify(responseData);
      
      let parsedResult: AnalysisResult;

      // Intentamos detectar si el experto devolvió JSON válido
      try {
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
              parsedResult = JSON.parse(jsonMatch[0]);
          } else {
              throw new Error("No es JSON");
          }
      } catch (e) {
          // Si no es JSON, construimos un resultado manual para mostrar el texto
          parsedResult = {
              productDetails: {
                  productName: "Consulta General",
                  referenceCode: "GEN-001",
                  rawTableData: [{ specification: "Respuesta", description: rawText }]
              },
              variantsNarrative: rawText,
              comparisonTable: [],
              recommendations: "Consulta procesada por el Asistente Transformaconia."
          };
      }

      setData(parsedResult);

    } catch (err) {
      setError("Error de comunicación con el servidor. Asegúrate de que n8n permite CORS (*).");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-900/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-12 max-w-6xl">
          
          {/* Intro Banner */}
          <div className="mb-12 text-center space-y-4">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-800 text-xs font-mono text-slate-400">
                <Terminal size={12} />
                <span>v2.1 :: N8N_CONNECTED</span>
             </div>
             <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
               Identificación Industrial <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Inteligente</span>
             </h2>
             <p className="text-slate-400 max-w-2xl mx-auto text-lg">
               Sube fichas, esquemas o imágenes. El sistema decodifica especificaciones, compara referencias cruzadas y genera documentación técnica experta.
             </p>
          </div>

          {/* Input Section */}
          <div className="mb-16">
            <InputArea onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} />
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-950/20 border border-red-500/30 p-4 mb-8 rounded-lg flex items-start gap-3 backdrop-blur-sm animate-shake">
              <AlertTriangle className="text-red-500 mt-0.5" size={20} />
              <div>
                <h3 className="font-bold text-red-400 font-mono">ERROR DE CONEXIÓN</h3>
                <p className="text-red-300/80 text-sm font-mono mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {data && <ResultsView data={data} />}
          
        </main>
      </div>
    </div>
  );
};

export default App;
