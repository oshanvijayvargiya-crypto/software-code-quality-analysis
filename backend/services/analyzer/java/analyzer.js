const { createIssue } = require('../common/issue');
const { calculateScore } = require('../common/scoring');
const { calculateBasicMetrics } = require('../common/metrics');

function analyzeJava(code) {
  const issues = [];
  const metrics = calculateBasicMetrics(code);

  if (!code || typeof code !== 'string') {
    return { metrics, issues: [], qualityScore: 100 };
  }

  const lines = code.split('\n');

  const methodRegex = /(public|protected|private|static|\s) +[\w\<\>\[\]]+\s+(\w+) *\([^\)]*\) *(\{?|[^;])/;
  const classRegex = /(public|protected|private|static|\s) +(class|interface|enum) +(\w+)/;
  const ifRegex = /\b(if|else if|for|while|case|catch)\b/;
  const commentLineRegex = /^\s*\/\//;
  
  let inBlockComment = false;
  let currentFunctionLines = 0;
  let inFunction = false;
  let braceCount = 0;

  // Simple tracker for declared variables to catch unused
  const declaredVars = new Map(); // name -> line number
  const usedVars = new Set();
  const nullVars = new Set();

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();
    
    if (trimmed === '') return;

    if (trimmed.startsWith('/*')) inBlockComment = true;
    if (trimmed.endsWith('*/')) inBlockComment = false;
    if (inBlockComment || commentLineRegex.test(line)) return;

    if (classRegex.test(line) && !line.includes('=')) {
      metrics.numClasses++;
    }

    if (methodRegex.test(line) && !line.includes('=')) {
      metrics.numFunctions++;
      inFunction = true;
      currentFunctionLines = 0;
      braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      metrics.cyclomaticComplexity++;
    } else if (inFunction) {
      currentFunctionLines++;
      braceCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      
      if (braceCount <= 0) {
        inFunction = false;
        if (currentFunctionLines > 50) {
          issues.push(createIssue(
            lineNumber,
            'Medium',
            'Complexity',
            'JAVA-LONG-METHOD',
            `Method is ${currentFunctionLines} lines long.`,
            'Consider breaking this method into smaller ones.'
          ));
        }
      }
    }

    if (ifRegex.test(line)) {
      metrics.cyclomaticComplexity++;
    }

    let codeOnly = line.replace(/".*?"/g, '""').replace(/'.*?'/g, "''");

    // Variable extraction (rudimentary for demonstration)
    const varDeclMatch = codeOnly.match(/(int|String|double|float|boolean|long|Object)\s+(\w+)\s*=/);
    if (varDeclMatch) {
      declaredVars.set(varDeclMatch[2], lineNumber);
    }

    // Usage check (simple word boundary matching)
    declaredVars.forEach((decLine, v) => {
      const usageRegex = new RegExp(`\\b${v}\\b`, 'g');
      const matches = codeOnly.match(usageRegex);
      if (matches && matches.length > (varDeclMatch && varDeclMatch[2] === v ? 1 : 0)) {
        usedVars.add(v);
      }
    });

    // Rules
    if (/(password|secret|api_key|token)[\s]*=[\s]*['"][^'"]+['"]/i.test(line)) {
      issues.push(createIssue(
        lineNumber,
        'Critical',
        'Security',
        'JAVA-HARDCODED-SECRET',
        'Potential hardcoded secret or password detected.',
        'Use environment variables or secure vault for sensitive data.'
      ));
    }

    if (/System\.out\.print/.test(line)) {
      issues.push(createIssue(
        lineNumber,
        'Info',
        'Code Smell',
        'JAVA-SYSTEM-OUT',
        'Use of System.out for logging.',
        'Use a proper logging framework (e.g., SLF4J, Log4j).'
      ));
    }
    
    // Magic numbers (ignoring 0, 1, -1)
    if (/\b(?:[2-9]|\d{2,})\b/.test(line) && !line.includes('for') && !line.includes('while')) {
      issues.push(createIssue(
        lineNumber,
        'Low',
        'Code Smell',
        'JAVA-MAGIC-NUMBER',
        'Magic number detected.',
        'Extract to a named constant.'
      ));
    }

    const nullAssignMatch = line.match(/\b(\w+)\s*=\s*null;/);
    if (nullAssignMatch) {
      nullVars.add(nullAssignMatch[1]);
    }

    nullVars.forEach(v => {
      const derefRegex = new RegExp(`\\b${v}\\.\\w+`);
      if (derefRegex.test(line)) {
        issues.push(createIssue(
          lineNumber,
          'Medium',
          'Bug',
          'JAVA-NULL-DEREFERENCE',
          `Possible NullPointerException: variable '${v}' may be null when dereferenced.`,
          'Ensure the variable is not null before dereferencing.'
        ));
      }
    });

    if (/catch\s*\([^)]+\)\s*\{/.test(line)) {
      // Lookahead to next line
      const nextLine = (lines[index + 1] || '').trim();
      if (nextLine === '}' || /catch\s*\([^)]+\)\s*\{\s*\}/.test(line)) {
        issues.push(createIssue(
          lineNumber,
          'High',
          'Bug',
          'JAVA-EMPTY-CATCH',
          'Empty catch block detected.',
          'Log the exception or handle it properly.'
        ));
      }
    }
  });

  // Check for unused variables
  declaredVars.forEach((decLine, v) => {
    if (!usedVars.has(v)) {
      issues.push(createIssue(
        decLine,
        'Medium',
        'Code Smell',
        'JAVA-UNUSED-VARIABLE',
        `Unused variable '${v}' detected.`,
        'Remove unused variable.'
      ));
    }
  });

  const qualityScore = calculateScore(issues, metrics);
  return { metrics, issues, qualityScore };
}

module.exports = { analyzeJava };
