const PDFDocument = require('pdfkit');

exports.generatePDF = (res, analysis, chartImage) => {
  const doc = new PDFDocument({ margin: 50 });
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Analysis_${analysis.filename}.pdf`);
  
  doc.pipe(res);

  // Title
  doc.fontSize(24).fillColor('#0A0E17').text('CodeInsight Analysis Report', { align: 'center' });
  doc.moveDown();

  // Basic Info
  doc.fontSize(12).fillColor('#333333');
  doc.text(`File: ${analysis.filename}`);
  doc.text(`Language: ${analysis.language}`);
  doc.text(`Date: ${new Date(analysis.date).toLocaleString()}`);
  doc.text(`Quality Score: ${analysis.qualityScore}/100`);
  doc.moveDown();

  // Metrics
  doc.fontSize(16).fillColor('#0A0E17').text('Metrics');
  doc.fontSize(12).fillColor('#333333');
  doc.text(`Lines of Code: ${analysis.metrics.loc}`);
  doc.text(`Cyclomatic Complexity: ${analysis.metrics.cyclomaticComplexity || 0}`);
  doc.text(`Comment Lines: ${analysis.metrics.commentLines || 0}`);
  doc.text(`Functions: ${analysis.metrics.numFunctions || 0}`);
  doc.text(`Classes: ${analysis.metrics.numClasses || 0}`);
  doc.moveDown();

  // Charts (if provided from frontend)
  if (chartImage) {
    try {
      const imgBuffer = Buffer.from(chartImage.split(',')[1], 'base64');
      doc.addPage();
      doc.fontSize(16).fillColor('#0A0E17').text('Visualizations');
      doc.moveDown();
      doc.image(imgBuffer, { width: 500 });
      doc.moveDown();
    } catch (e) {
      console.error('Error attaching chart to PDF:', e);
    }
  }

  // Issues Table
  doc.addPage();
  doc.fontSize(16).fillColor('#0A0E17').text('Detected Issues');
  doc.moveDown();

  if (analysis.issues.length === 0) {
    doc.fontSize(12).text('No issues detected.');
  } else {
    analysis.issues.forEach((issue, idx) => {
      doc.fontSize(12).fillColor('#FF3B30').text(`[${(issue.severity || 'INFO').toUpperCase()}] Line ${issue.line}: ${issue.category || 'Issue'} - ${issue.rule || issue.type}`);
      doc.fontSize(10).fillColor('#333333').text(`Message: ${issue.message}`);
      if (issue.suggestion) {
        doc.text(`Suggestion: ${issue.suggestion}`);
      }
      doc.moveDown();
    });
  }

  doc.end();
};
