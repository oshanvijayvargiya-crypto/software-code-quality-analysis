/**
 * Calculates a dynamic quality score based on issues and metrics.
 * 
 * @param {Array} issues 
 * @param {Object} metrics 
 * @returns {number} 0-100 score
 */
function calculateScore(issues, metrics) {
  let score = 100;

  // Deduplicate issues for scoring to prevent cascading penalties on the same line
  const uniqueIssues = [];
  const seen = new Set();
  for (const issue of issues) {
    const key = `${issue.line}:${issue.rule}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueIssues.push(issue);
    }
  }

  // Penalty weights
  const penalties = {
    'Critical': 15,
    'High': 10,
    'Medium': 5,
    'Low': 2,
    'Info': 0.5
  };

  uniqueIssues.forEach(issue => {
    score -= (penalties[issue.severity] || 1);
  });

  // Complexity penalties
  if (metrics && metrics.cyclomaticComplexity) {
    if (metrics.cyclomaticComplexity > 30) score -= 15;
    else if (metrics.cyclomaticComplexity > 20) score -= 10;
    else if (metrics.cyclomaticComplexity > 10) score -= 5;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

module.exports = { calculateScore };
