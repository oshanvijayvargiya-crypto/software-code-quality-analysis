const { ESLint } = require('eslint');
const escomplex = require('typhonjs-escomplex');
const { createIssue } = require('../common/issue');
const { calculateScore } = require('../common/scoring');
const { calculateBasicMetrics } = require('../common/metrics');

async function analyzeJavaScript(code) {
  const issues = [];
  const metrics = calculateBasicMetrics(code);

  if (!code || typeof code !== 'string') {
    return { metrics, issues: [], qualityScore: 100 };
  }

  const lines = code.split('\n');

  // 1. Linting with ESLint
  try {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: [{
        languageOptions: {
          ecmaVersion: 2021,
          sourceType: 'module'
        },
        rules: {
          'max-lines-per-function': ['warn', 50],
          'max-params': ['warn', 4],
          'max-depth': ['warn', 4],
          'no-eval': 'error',
          'no-implied-eval': 'error',
          'no-unused-vars': 'warn',
          'no-var': 'warn',
          'eqeqeq': ['warn', 'always'],
          'no-console': 'warn',
          'no-debugger': 'error',
          'no-unreachable': 'error',
          'no-empty': ['warn', { 'allowEmptyCatch': false }]
        }
      }]
    });

    const results = await eslint.lintText(code);
    if (results && results.length > 0 && results[0].messages) {
      results[0].messages.forEach(msg => {
        let severity = 'Info';
        let category = 'Code Smell';

        if (msg.severity === 2) severity = 'High';
        else if (msg.severity === 1) severity = 'Medium';

        // Categorize based on ruleId
        if (['no-eval', 'no-implied-eval', 'no-debugger'].includes(msg.ruleId)) {
          category = 'Security';
          severity = 'Critical';
        } else if (['no-unreachable', 'no-empty'].includes(msg.ruleId)) {
          category = 'Bug';
          severity = 'High';
        } else if (['max-lines-per-function', 'max-params', 'max-depth'].includes(msg.ruleId)) {
          category = 'Complexity';
        }

        let ruleId = `JS-${(msg.ruleId || 'LINT').toUpperCase()}`;
        if (msg.ruleId === 'no-unused-vars') {
          ruleId = 'JS-UNUSED-VARIABLE';
        }

        issues.push(createIssue(
          msg.line || 1,
          severity,
          category,
          ruleId,
          msg.message || 'Linter issue detected.',
          `Review ESLint rule: ${msg.ruleId || 'syntax'}`
        ));
      });
    }
  } catch (err) {
    console.error("ESLint execution warning:", err.message);
  }

  // 2. Fallback / Extra JS Rules via Regex Heuristics
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // Check for hardcoded secrets
    if (/(password|secret|api_key|token)[\s]*=[\s]*['"][^'"]+['"]/i.test(line)) {
      issues.push(createIssue(
        lineNumber,
        'Critical',
        'Security',
        'JS-HARDCODED-SECRET',
        'Potential hardcoded secret or password detected.',
        'Use environment variables for sensitive data.'
      ));
    }
    
    // innerHTML security risk
    if (/\.innerHTML\s*=/.test(line)) {
      issues.push(createIssue(
        lineNumber,
        'High',
        'Security',
        'JS-INNERHTML',
        'Assignment to innerHTML can lead to XSS vulnerabilities.',
        'Use textContent or securely sanitize input before injecting HTML.'
      ));
    }

    // fallback eval detection if eslint fails
    if (/\beval\s*\(/.test(line) && !issues.find(i => i.line === lineNumber && i.rule === 'JS-NO-EVAL')) {
      issues.push(createIssue(
        lineNumber,
        'Critical',
        'Security',
        'JS-EVAL',
        'eval() is forbidden as it can execute arbitrary strings as code.',
        'Avoid using eval() or use JSON.parse() instead.'
      ));
    }

    if (/\bconsole\.log\s*\(/.test(line) && !issues.find(i => i.line === lineNumber && i.rule === 'JS-NO-CONSOLE')) {
      issues.push(createIssue(
        lineNumber,
        'Low',
        'Code Smell',
        'JS-CONSOLE',
        'Use of console.log detected.',
        'Remove debugging statements before production.'
      ));
    }

    if (/\bvar\s+\w+/.test(line) && !issues.find(i => i.line === lineNumber && i.rule === 'JS-NO-VAR')) {
      issues.push(createIssue(
        lineNumber,
        'Medium',
        'Code Smell',
        'JS-VAR-USAGE',
        'Use of var is deprecated.',
        'Use let or const instead.'
      ));
    }

    // Loose equality fallback
    if (/([^=!])==([^=])/.test(line) && !issues.find(i => i.line === lineNumber && i.rule === 'JS-EQEQEQ')) {
      issues.push(createIssue(
        lineNumber,
        'Medium',
        'Bug',
        'JS-LOOSE-EQUALITY',
        'Loose equality (==) detected.',
        'Use strict equality (===) instead.'
      ));
    }
  });

  // 3. Complexity Metrics with typhonjs-escomplex
  try {
    const complexityResult = escomplex.analyzeModule(code);
    if (complexityResult && complexityResult.aggregate) {
      metrics.cyclomaticComplexity = complexityResult.aggregate.cyclomatic || 1;
      
      if (complexityResult.methods && complexityResult.methods.length > 0) {
        metrics.numFunctions = Math.max(metrics.numFunctions, complexityResult.methods.length);
        complexityResult.methods.forEach(method => {
          if (method.cyclomatic > 10) {
            const severity = method.cyclomatic > 20 ? 'High' : 'Medium';
            issues.push(createIssue(
              method.lineStart || method.line || 1,
              severity,
              'Complexity',
              'JS-HIGH-COMPLEXITY',
              `Function '${method.name || 'anonymous'}' has high cyclomatic complexity (${method.cyclomatic}).`,
              'Refactor to split this function into smaller, more manageable pieces.'
            ));
          }
        });
      }
      if (complexityResult.classes) {
        metrics.numClasses = Math.max(metrics.numClasses, complexityResult.classes.length);
      }
    }
  } catch (err) {
    console.error("escomplex warning:", err.message);
  }

  // Final Quality Score
  const qualityScore = calculateScore(issues, metrics);

  return { metrics, issues, qualityScore };
}

module.exports = { analyzeJavaScript };
