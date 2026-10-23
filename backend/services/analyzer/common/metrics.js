/**
 * Utility to calculate basic metrics shared across languages.
 */

function calculateBasicMetrics(code) {
  const lines = code.split('\n');
  const loc = lines.length;
  let blankLines = 0;
  let commentLines = 0;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed === '') {
      blankLines++;
    } else if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      commentLines++;
    }
  });

  const commentRatio = loc > 0 ? (commentLines / loc) * 100 : 0;

  return {
    loc,
    blankLines,
    commentLines,
    commentRatio,
    cyclomaticComplexity: 1, // Default, to be overridden by AST analyzers
    numFunctions: 0,
    numClasses: 0,
  };
}

module.exports = { calculateBasicMetrics };
