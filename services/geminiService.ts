import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// PROMPT REFORZADO PARA ACTUAR COMO EL EXPERTO INDUSTRIAL DEFINITIVO
// Se han incorporado las directrices de precisión del asst_6W913pHxT9dEtMos3pl2oLwH
const SYSTEM_INSTRUCTION = `
# **ROL: EXPERTO TÉCNICO INDUSTRIAL SENIOR (NIVEL INGENIERÍA)**

Estás operando como un sistema de IA de clase "Experto Industrial". Tu única misión es proporcionar análisis técnicos de productos con una precisión absoluta, lenguaje profesional y un formato impecable.

## **PROTOCOLOS DE OPERACIÓN (PRIORIDAD ABSOLUTA):**

1.  **PRECISIÓN QUIRÚRGICA:**
    *   Extrae hasta el último detalle de las imágenes o PDFs: tolerancias, normas ISO/DIN/ANSI, materiales específicos (ej. AISI 316L, no solo "acero"), códigos de IP, ATEX, voltajes, etc.
    *   Si el input es vago, utiliza tu base de conocimiento para identificar el componente más probable en un entorno industrial profesional.

2.  **LENGUAJE Y TONO:**
    *   Idioma: **ESPAÑOL (España/Neutro Profesional).**
    *   Tono: Ingeniero Senior a Ingeniero Senior. Directo, técnico, sin relleno de marketing.
    *   Usa terminología técnica correcta (ej. "Par de apriete" en lugar de "fuerza de giro").

3.  **GESTIÓN DE DATOS FALTANTES:**
    *   Si falta un dato en el archivo, BÚSCALO internamente en tu conocimiento de catálogos oficiales (Siemens, Bosch, SKF, SMC, Festo, Schneider, etc.).
    *   Nunca digas "no se encuentra". Proporciona el dato estándar del mercado para esa referencia y márcalo como "Estándar de serie".

4.  **ESTRUCTURA DE SALIDA (JSON ESTRICTO):**
    *   **VariantsNarrative:** No hagas una lista simple. Crea un texto técnico que explique *por qué* existen las variantes (ej. "La variante 'V' con juntas Viton es crítica para entornos con agresividad química, mientras que la estándar NBR se limita a...").
    *   **Recommendations:** Deben ser consejos de valor incalculable. Habla de mantenimiento predictivo, ciclos de vida, compatibilidad y advertencias de seguridad.

5.  **PERSONALIDAD:**
    *   Eres el consultor que cobra $500/hora. Tu respuesta vale ese dinero.

## **REGLAS DE FORMATO:**
*   Toda la salida debe ser JSON válido según el esquema.
*   Las descripciones deben ser ricas y detalladas.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    productDetails: {
      type: Type.OBJECT,
      properties: {
        productName: { type: Type.STRING, description: "Nombre técnico completo en Español" },
        referenceCode: { type: Type.STRING, description: "Código SKU/Ref del fabricante" },
        dimensions: { type: Type.STRING, description: "Dimensiones exactas (mm/pulgadas)" },
        material: { type: Type.STRING, description: "Aleación o polímero específico" },
        weight: { type: Type.STRING },
        capacityOrPerformance: { type: Type.STRING, description: "Datos clave: Carga, Caudal, Voltaje, Presión" },
        temperatureRange: { type: Type.STRING },
        standards: { type: Type.STRING, description: "Normativas ISO, DIN, ANSI, NEMA" },
        variantsAvailable: { type: Type.STRING, description: "Resumen corto de variantes" },
        rawTableData: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              specification: { type: Type.STRING, description: "Parámetro técnico (Español)" },
              description: { type: Type.STRING, description: "Valor técnico preciso (Español)" },
            }
          }
        }
      },
      required: ["productName", "rawTableData", "referenceCode"]
    },
    variantsNarrative: { type: Type.STRING, description: "Análisis profundo de variantes en HTML/Markdown" },
    comparisonTable: {
      type: Type.ARRAY,
      description: "Comparativa con 2-3 competidores directos de primer nivel (SMC vs Festo, SKF vs FAG, etc)",
      items: {
        type: Type.OBJECT,
        properties: {
          brandName: { type: Type.STRING },
          referenceCode: { type: Type.STRING },
          material: { type: Type.STRING },
          dimensions: { type: Type.STRING },
          weight: { type: Type.STRING },
          capacity: { type: Type.STRING },
          standards: { type: Type.STRING },
          options: { type: Type.STRING },
        }
      }
    },
    recommendations: { type: Type.STRING, description: "Consejos de ingeniería aplicada en HTML/Markdown" },
    confidence: { type: Type.NUMBER, description: "Nivel de certeza 0-100" }
  },
  required: ["productDetails", "variantsNarrative", "comparisonTable", "recommendations", "confidence"]
};

export const analyzeIndustrialProduct = async (
  textInput: string,
  files: { base64: string; mimeType: string }[] = []
): Promise<AnalysisResult> => {
  
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  // Use Gemini 2.5 Flash for speed + intelligence, or Pro if specifically complex reasoning is needed.
  // Flash is generally sufficient for extraction and faster.
  const modelName = 'gemini-2.5-flash';

  const parts: any[] = [];
  
  // Add text input with high context
  if (textInput) {
    parts.push({ text: `CONSULTA DEL USUARIO: ${textInput}` });
  } else {
    parts.push({ text: "ANALIZAR DOCUMENTO/IMAGEN ADJUNTA Y GENERAR INFORME TÉCNICO COMPLETO." });
  }

  // Add files
  files.forEach(file => {
    // Remove header if present
    const cleanBase64 = file.base64.split(',')[1] || file.base64;
    parts.push({
      inlineData: {
        mimeType: file.mimeType,
        data: cleanBase64
      }
    });
  });

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1, // Muy baja temperatura para máxima precisión factual
      }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("Respuesta vacía de la IA");

    return JSON.parse(responseText) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};