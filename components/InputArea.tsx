import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, FileText, Type, X, ScanEye, Sparkles } from 'lucide-react';
import { InputMode, FileUpload } from '../types';

interface InputAreaProps {
  onAnalyze: (text: string, files: FileUpload[]) => void;
  isAnalyzing: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onAnalyze, isAnalyzing }) => {
  const [mode, setMode] = useState<InputMode>(InputMode.TEXT);
  const [text, setText] = useState('');
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const processFiles = (fileList: FileList) => {
    Array.from(fileList).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles(prev => [...prev, {
          base64: reader.result as string,
          mimeType: file.type,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
      // Automatically switch mode logic
      if (mode === InputMode.TEXT) {
        if (e.dataTransfer.files[0].type.includes('pdf')) {
          setMode(InputMode.DOCUMENT);
        } else {
          setMode(InputMode.IMAGE);
        }
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() || files.length > 0) {
      onAnalyze(text, files);
    }
  };

  return (
    <div className="relative group rounded-xl">
      {/* Glowing background effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      
      <div className="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50">
          <button
            onClick={() => setMode(InputMode.TEXT)}
            className={`flex-1 py-4 text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all ${
              mode === InputMode.TEXT 
                ? 'text-cyan-400 bg-slate-900 border-t-2 border-cyan-500 shadow-[0_-5px_15px_rgba(34,211,238,0.1)]' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'
            }`}
          >
            <Type size={16} /> DATA / TEXTO
          </button>
          <button
            onClick={() => setMode(InputMode.IMAGE)}
            className={`flex-1 py-4 text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all ${
              mode === InputMode.IMAGE 
                ? 'text-purple-400 bg-slate-900 border-t-2 border-purple-500 shadow-[0_-5px_15px_rgba(192,132,252,0.1)]' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'
            }`}
          >
            <ImageIcon size={16} /> VISUAL / IMG
          </button>
          <button
            onClick={() => setMode(InputMode.DOCUMENT)}
            className={`flex-1 py-4 text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all ${
              mode === InputMode.DOCUMENT 
                ? 'text-emerald-400 bg-slate-900 border-t-2 border-emerald-500 shadow-[0_-5px_15px_rgba(52,211,153,0.1)]' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'
            }`}
          >
            <FileText size={16} /> FICHA / PDF
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Text Input */}
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  mode === InputMode.TEXT ? "// Ingresar código de referencia, especificaciones o consulta técnica..." :
                  mode === InputMode.IMAGE ? "// Describir anomalía visual o solicitar identificación de componente..." :
                  "// Pegar contenido del datasheet o añadir contexto al documento adjunto..."
                }
                className="w-full min-h-[140px] p-4 bg-slate-950/50 text-slate-300 border border-slate-700 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none font-mono text-sm placeholder-slate-600 shadow-inner"
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-600 font-mono">
                {text.length} CHARS
              </div>
            </div>

            {/* File Upload Area */}
            {(mode === InputMode.IMAGE || mode === InputMode.DOCUMENT || files.length > 0) && (
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept={mode === InputMode.IMAGE ? "image/*" : "application/pdf,image/*"}
                  className="hidden"
                  multiple
                />
                
                {files.length === 0 ? (
                  <div 
                    onClick={triggerFileUpload}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                      isDragging 
                        ? 'border-cyan-500 bg-cyan-950/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]' 
                        : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${isDragging ? 'bg-cyan-900/50 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                      <Upload size={20} />
                    </div>
                    <p className="text-slate-300 font-medium font-mono text-sm">
                      {isDragging ? ">> SOLTAR ARCHIVOS AQUI <<" : (mode === InputMode.IMAGE ? 'CLICK O ARRASTRAR IMAGEN' : 'CLICK O ARRASTRAR PDF/DOC')}
                    </p>
                    <p className="text-xs text-slate-500 mt-2 font-mono">SISTEMA PREPARADO PARA ANÁLISIS DE ALTA DENSIDAD</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700 rounded-lg group hover:border-purple-500/50 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="bg-slate-900 p-2 rounded text-purple-400 border border-slate-700">
                            {file.mimeType.includes('pdf') ? <FileText size={16} /> : <ImageIcon size={16} />}
                          </div>
                          <span className="text-sm text-slate-300 truncate font-mono">{file.name}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="p-1 hover:bg-red-900/30 rounded text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    
                    <div 
                       onClick={triggerFileUpload}
                       className={`border border-dashed border-slate-700 rounded-lg p-3 text-center cursor-pointer transition-colors ${isDragging ? 'bg-cyan-950/30 border-cyan-500' : 'hover:bg-slate-800 hover:border-slate-600'}`}
                    >
                       <p className="text-xs text-cyan-400 font-mono flex items-center justify-center gap-2">
                          <Upload size={14} />
                          ADJUNTAR INFORMACIÓN ADICIONAL
                       </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={isAnalyzing || (!text && files.length === 0)}
              className={`w-full py-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] font-mono tracking-wide ${
                isAnalyzing 
                ? 'bg-slate-800 cursor-not-allowed text-slate-500 border border-slate-700' 
                : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] border border-white/10'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-slate-500 border-t-purple-500 rounded-full"></div>
                  PROCESANDO DATOS...
                </>
              ) : (
                <>
                  <ScanEye size={20} />
                  INICIAR ANÁLISIS EXPERTO
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};