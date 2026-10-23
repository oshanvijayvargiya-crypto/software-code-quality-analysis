/**
 * Factory for creating standard issue objects.
 * 
 * @param {number} line 
 * @param {string} severity 'Critical', 'High', 'Medium', 'Low', 'Info'
 * @param {string} category 'Security', 'Bug', 'Performance', 'Code Smell', 'Complexity'
 * @param {string} rule e.g. 'JS-HARDCODED-SECRET'
 * @param {string} message 
 * @param {string} suggestion 
 * @returns 
 */
function createIssue(line, severity, category, rule, message, suggestion) {
  return {
    line: line || 1,
    severity: severity || 'Info',
    category: category || 'Code Smell',
    rule: rule || 'UNKNOWN',
    message: message || 'Unknown issue detected.',
    suggestion: suggestion || ''
  };
}

module.exports = { createIssue };
