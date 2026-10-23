const { createIssue } = require('../common/issue');
const { calculateScore } = require('../common/scoring');
const { calculateBasicMetrics } = require('../common/metrics');

function analyzePython(code) {
  const issues = [];
  const metrics = calculateBasicMetrics(code);

  if (!code || typeof code !== 'string') {
    return { metrics, issues: [], qualityScore: 100 };
  }

  const lines = code.split('\n');

  const defRegex = /^\s*def\s+\w+\s*\(/;
  const classRegex = /^\s*class\s+\w+/;
  const ifRegex = /^\s*(if|elif|for|while|except|with)\s+/;
  
  let currentFunctionLines = 0;
  let inFunction = false;

  const declaredVars = new Map(); // name -> line
  const usedVars = new Set();

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();
    if (trimmed === '') return;

    // Remove strings and comments for usage check
    let codeOnly = line.replace(/#.*/g, '').replace(/".*?"/g, '""').replace(/'.*?'/g, "''");

    // Track variable assignments
    const varAssignMatch = codeOnly.match(/^[\s]*([a-zA-Z_]\w*)[\s]*=/);
    if (varAssignMatch) {
      declaredVars.set(varAssignMatch[1], lineNumber);
    }
    
    // Check usage of variables
    declaredVars.forEach((decLine, v) => {
      const usageRegex = new RegExp(`\\b${v}\\b`, 'g');
      const matches = codeOnly.match(usageRegex);
      if (matches) {
        // If the match is not just the assignment itself
        if (!(varAssignMatch && varAssignMatch[1] === v && matches.length === 1)) {
          usedVars.add(v);
        }
      }
    });

    if (classRegex.test(line)) {
      metrics.numClasses++;
    }

    if (defRegex.test(line)) {
      metrics.numFunctions++;
      if (inFunction && currentFunctionLines > 50) {
        issues.push(createIssue(
          lineNumber,
          'Medium',
          'Complexity',
          'PY-LONG-FUNCTION',
          `Function is ${currentFunctionLines} lines long.`,
          'Consider breaking this function into smaller ones.'
        ));
      }
      inFunction = true;
      currentFunctionLines = 0;
      metrics.cyclomaticComplexity++;
    } else if (inFunction && !trimmed.startsWith('#')) {
      currentFunctionLines++;
    }

    if (ifRegex.test(line)) {
      metrics.cyclomaticComplexity++;
    }

    // Rules
    if (/^\s*except\s*:\s*$/.test(line)) {
      issues.push(createIssue(
        lineNumber,
        'High',
        'Bug',
        'PY-BARE-EXCEPT',
        'Bare except clause detected.',
        'Catch specific exceptions rather than all exceptions.'
      ));
    } else if (/^\s*except\s+Exception\s*:\s*$/.test(line)) {
      issues.push(createIssue(
        lineNumber,
        'Medium',
        'Bug',
        'PY-BROAD-EXCEPTION',
        'Broad except Exception detected.',
        'Catch specific exceptions if possible.'
      ));
    }

    if (/(password|secret|api_key|token)[\s]*=[\s]*['"][^'"]+['"]/i.test(line)) {
      issues.push(createIssue(
        lineNumber,
        'Critical',
        'Security',
        'PY-HARDCODED-SECRET',
        'Potential hardcoded secret or password detected.',
        'Use environment variables for sensitive data.'
      ));
    }

    if (/\beval\s*\(/.test(line)) {
       issues.push(createIssue(
        lineNumber,
        'Critical',
        'Security',
        'PY-EVAL',
        'Use of eval() can lead to arbitrary code execution.',
        'Avoid using eval() with untrusted input.'
      ));
    }

    if (/\bexec\s*\(/.test(line)) {
      issues.push(createIssue(
       lineNumber,
       'Critical',
       'Security',
       'PY-EXEC',
       'Use of exec() can lead to arbitrary code execution.',
       'Avoid using exec() with untrusted input.'
     ));
    }

    if (/\bprint\s*\(/.test(line)) {
      issues.push(createIssue(
        lineNumber,
        'Low',
        'Code Smell',
        'PY-PRINT',
        'Use of print() for logging.',
        'Use the logging module for structured logs.'
      ));
    }
    
    // Mutable default arguments: def foo(bar=[]):
    if (defRegex.test(line) && /=\s*(\[\]|\{\})/.test(line)) {
      issues.push(createIssue(
        lineNumber,
        'High',
        'Bug',
        'PY-MUTABLE-DEFAULT',
        'Mutable default argument detected (e.g. list or dict).',
        'Use None as a default and initialize inside the function.'
      ));
    }
  });

  // Check for unused variables
  declaredVars.forEach((decLine, v) => {
    if (!usedVars.has(v)) {
      issues.push(createIssue(
        decLine,
        'Medium',
        'Code Smell',
        'PY-UNUSED-VARIABLE',
        `Unused variable '${v}' detected.`,
        'Remove unused variable.'
      ));
    }
  });

  const qualityScore = calculateScore(issues, metrics);
  return { metrics, issues, qualityScore };
}

module.exports = { analyzePython };
