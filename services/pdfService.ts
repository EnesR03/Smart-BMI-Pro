
import { jsPDF } from "jspdf";
import { UserMetrics, BMIResult, AIResponse } from "../types";

export const generatePDFReport = (metrics: UserMetrics, result: BMIResult, aiData: AIResponse | null) => {
  const doc = new jsPDF();
  const margin = 20;
  let yPos = 20;

  // Title
  doc.setFontSize(22);
  doc.setTextColor(30, 64, 175); // Blue-800
  doc.setFont("helvetica", "bold");
  doc.text("Smart BMI Pro Report", margin, yPos);
  yPos += 10;

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPos);
  yPos += 15;

  // User Profile Section
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.setFont("helvetica", "bold");
  doc.text("User Profile", margin, yPos);
  yPos += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const weightUnit = metrics.unitSystem === 'METRIC' ? 'kg' : 'lbs';
  const heightUnit = metrics.unitSystem === 'METRIC' ? 'cm' : 'in';
  
  // Show name if provided
  if (metrics.name) {
    doc.setFont("helvetica", "bold");
    doc.text(`Name: ${metrics.name}`, margin, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 6;
  }

  doc.text(`Age: ${metrics.age || 'N/A'}`, margin, yPos);
  doc.text(`Gender: ${metrics.gender || 'N/A'}`, margin + 50, yPos);
  yPos += 6;
  doc.text(`Weight: ${metrics.weight} ${weightUnit}`, margin, yPos);
  doc.text(`Height: ${metrics.height} ${heightUnit}`, margin + 50, yPos);
  yPos += 15;

  // BMI Result
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("BMI Analysis", margin, yPos);
  yPos += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Body Mass Index (BMI): ${result.bmi.toFixed(1)}`, margin, yPos);
  yPos += 6;
  doc.setFont("helvetica", "bold");
  doc.text(`Category: ${result.category}`, margin, yPos);
  yPos += 15;

  // AI Wellness Summary
  if (aiData) {
    doc.setFontSize(14);
    doc.setTextColor(30, 64, 175);
    doc.text("AI Wellness Summary", margin, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85); // Slate-700
    const summaryLines = doc.splitTextToSize(aiData.summary, 170);
    doc.text(summaryLines, margin, yPos);
    yPos += (summaryLines.length * 6) + 10;

    // Tips
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text("Personalized Recommendations", margin, yPos);
    yPos += 8;

    aiData.tips.forEach((tip) => {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`${tip.category.toUpperCase()}: ${tip.title}`, margin, yPos);
      yPos += 6;
      doc.setFont("helvetica", "normal");
      const contentLines = doc.splitTextToSize(tip.content, 170);
      doc.text(contentLines, margin, yPos);
      yPos += (contentLines.length * 6) + 6;
      
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
  }

  // Footer Disclaimer
  yPos = Math.max(yPos, 270);
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // Slate-400
  const disclaimer = "Disclaimer: This report and the AI-generated tips are for informational purposes only and do not substitute professional medical advice, diagnosis, or treatment.";
  const disclaimerLines = doc.splitTextToSize(disclaimer, 170);
  doc.text(disclaimerLines, margin, yPos);

  // Save the PDF
  const fileName = metrics.name 
    ? `Health_Report_${metrics.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    : `Smart_BMI_Pro_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  
  doc.save(fileName);
};
