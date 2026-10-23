const { analyzeJavaScript } = require('./javascript/analyzer');
const { analyzePython } = require('./python/analyzer');
const { analyzeJava } = require('./java/analyzer');

/**
 * Main router for analysis requests.
 * Delegates to the appropriate language analyzer based on the language argument.
 * 
 * @param {string} code 
 * @param {string} language 'JavaScript', 'Python', 'Java'
 * @returns {Promise<Object>} AnalysisResult format { metrics, issues, qualityScore }
 */
async function analyzeCode(code, language) {
  const normalizedLanguage = language.toLowerCase();
  
  switch (normalizedLanguage) {
    case 'javascript':
    case 'js':
      return await analyzeJavaScript(code);
    case 'python':
    case 'py':
      return analyzePython(code);
    case 'java':
      return analyzeJava(code);
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}

module.exports = { analyzeCode };
