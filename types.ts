export interface TechnicalSpec {
  specification: string;
  description: string;
}

export interface ProductData {
  productName: string;
  referenceCode: string;
  dimensions: string;
  material: string;
  weight: string;
  capacityOrPerformance: string;
  temperatureRange: string;
  standards: string;
  variantsAvailable: string;
  rawTableData: TechnicalSpec[];
}

export interface ComparisonBrand {
  brandName: string;
  referenceCode: string;
  material: string;
  dimensions: string;
  weight: string;
  capacity: string;
  standards: string;
  options: string;
}

export interface AnalysisResult {
  productDetails: ProductData;
  variantsNarrative: string; // Markdown
  comparisonTable: ComparisonBrand[];
  recommendations: string; // Markdown
  confidence: number;
}

export enum InputMode {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT'
}

export interface FileUpload {
  base64: string;
  mimeType: string;
  name: string;
}