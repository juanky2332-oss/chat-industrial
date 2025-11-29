import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AnalysisResult } from '../types';

export const generateIndustrialReport = (data: AnalysisResult) => {
  const doc = new jsPDF();
  
  // Brand Colors
  const darkBlue = [15, 23, 42]; // Slate 900
  const accentPurple = [126, 34, 206]; // Purple 700
  const accentCyan = [14, 116, 144]; // Cyan 700

  // --- Header ---
  doc.setFillColor(15, 23, 42); // Background Header
  doc.rect(0, 0, 210, 40, 'F');
  
  // Logo Text
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text("Xperto", 14, 20);
  doc.setTextColor(34, 211, 238); // Cyan
  doc.text("IndustrIAL", 45, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.setFont('helvetica', 'normal');
  doc.text("INFORME TÉCNICO AVANZADO", 14, 28);
  
  // Date and ID
  doc.setFontSize(9);
  doc.text(`FECHA: ${new Date().toLocaleDateString('es-ES').toUpperCase()}`, 150, 20);
  doc.text(`ID REPORTE: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 150, 25);

  let yPos = 50;

  // --- Product Identification ---
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text("1. IDENTIFICACIÓN DE COMPONENTE", 14, yPos);
  
  // Line separator
  doc.setDrawColor(126, 34, 206);
  doc.setLineWidth(0.5);
  doc.line(14, yPos + 2, 100, yPos + 2);
  yPos += 10;

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.setFont('courier', 'bold'); // Monospace for technical data
  doc.text(`PRODUCTO: ${data.productDetails.productName}`, 14, yPos);
  yPos += 6;
  doc.text(`REFERENCIA: ${data.productDetails.referenceCode}`, 14, yPos);
  yPos += 15;

  // Technical Table
  const tableBody = data.productDetails.rawTableData.map(item => [item.specification, item.description]);

  autoTable(doc, {
    startY: yPos,
    head: [['PARÁMETRO', 'VALOR TÉCNICO']],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], font: 'courier', fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3, font: 'helvetica' },
    alternateRowStyles: { fillColor: [241, 245, 249] }
  });

  // @ts-ignore
  yPos = doc.lastAutoTable.finalY + 15;

  // --- Variants ---
  if (yPos > 240) { doc.addPage(); yPos = 20; }
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text("2. ANÁLISIS DE VARIANTES", 14, yPos);
  doc.setDrawColor(14, 116, 144); // Cyan line
  doc.line(14, yPos + 2, 100, yPos + 2);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'normal');
  
  // Clean tags
  const cleanVariants = data.variantsNarrative.replace(/<[^>]*>?/gm, '');
  const splitVariants = doc.splitTextToSize(cleanVariants, 180);
  doc.text(splitVariants, 14, yPos);
  
  yPos += (splitVariants.length * 5) + 15;

  // --- Comparison ---
  if (data.comparisonTable.length > 0) {
     if (yPos > 220) { doc.addPage(); yPos = 20; }
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text("3. MATRIZ COMPARATIVA", 14, yPos);
    doc.setDrawColor(126, 34, 206);
    doc.line(14, yPos + 2, 100, yPos + 2);
    yPos += 5;

    const compHead = ['MARCA', 'REF', 'MATERIAL', 'DIMS', 'CAPACIDAD'];
    const compBody = data.comparisonTable.map(c => [
      c.brandName, 
      c.referenceCode, 
      c.material, 
      c.dimensions, 
      c.capacity
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [compHead],
      body: compBody,
      theme: 'striped',
      headStyles: { fillColor: [60, 60, 60] },
      styles: { fontSize: 8, font: 'courier' },
    });

    // @ts-ignore
    yPos = doc.lastAutoTable.finalY + 15;
  }

  // --- Recommendations ---
  if (yPos > 220) { doc.addPage(); yPos = 20; }
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text("4. DICTAMEN DE EXPERTO", 14, yPos);
  doc.setDrawColor(14, 116, 144);
  doc.line(14, yPos + 2, 100, yPos + 2);
  yPos += 10;

  const cleanRecs = data.recommendations.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
  const splitRecs = doc.splitTextToSize(cleanRecs, 180);
  
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'italic');
  doc.text(splitRecs, 14, yPos);

  // --- Footer ---
  const pageCount = doc.internal.pages.length - 1;
  for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 285, 210, 15, 'F');
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Página ${i} de ${pageCount} // Generado por Xperto IndustrIAL System`, 105, 292, { align: 'center' });
  }

  doc.save(`Xperto_Reporte_${data.productDetails.referenceCode || 'Tecnico'}.pdf`);
};