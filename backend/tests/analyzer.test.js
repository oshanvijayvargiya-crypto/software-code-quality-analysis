const { analyzeCode } = require('../services/analyzer/index');

describe('CodeInsight Analyzers Accuracy Improvements', () => {
  describe('JavaScript Analyzer', () => {
    it('detects unused variables and console.log', async () => {
      const code = `
function test() {
    let unused = 100;
    console.log("hello");
}
      `;
      const result = await analyzeCode(code, 'JavaScript');
      
      const unusedIssue = result.issues.find(i => i.rule === 'JS-UNUSED-VARIABLE');
      const consoleIssue = result.issues.find(i => i.rule === 'JS-CONSOLE' || i.rule === 'JS-NO-CONSOLE');
      
      expect(unusedIssue).toBeDefined();
      expect(consoleIssue).toBeDefined();
    });

    it('detects eval() and hardcoded secrets', async () => {
      const code = `
        const secret = "super_secret_key";
        eval("console.log('hello')");
      `;
      const result = await analyzeCode(code, 'JavaScript');
      
      const evalIssue = result.issues.find(i => i.rule === 'JS-EVAL' || i.rule === 'JS-NO-EVAL');
      const secretIssue = result.issues.find(i => i.rule === 'JS-HARDCODED-SECRET');
      
      expect(evalIssue).toBeDefined();
      expect(secretIssue).toBeDefined();
    });
  });

  describe('Python Analyzer', () => {
    it('detects bare except, eval, and unused variable', async () => {
      const code = `
def test():
    unused = 100
    try:
        eval(user_input)
    except:
        pass
      `;
      const result = await analyzeCode(code, 'Python');
      
      const unusedIssue = result.issues.find(i => i.rule === 'PY-UNUSED-VARIABLE');
      const evalIssue = result.issues.find(i => i.rule === 'PY-EVAL');
      const bareExceptIssue = result.issues.find(i => i.rule === 'PY-BARE-EXCEPT');
      
      expect(unusedIssue).toBeDefined();
      expect(evalIssue).toBeDefined();
      expect(bareExceptIssue).toBeDefined();
    });

    it('detects broad exception', async () => {
      const code = `
try:
    pass
except Exception:
    pass
      `;
      const result = await analyzeCode(code, 'Python');
      const broadIssue = result.issues.find(i => i.rule === 'PY-BROAD-EXCEPTION');
      expect(broadIssue).toBeDefined();
    });

    it('does not flag used variables as unused', async () => {
      const code1 = `
password = "admin123"
print(password)
      `;
      let result = await analyzeCode(code1, 'Python');
      let unusedIssue = result.issues.find(i => i.rule === 'PY-UNUSED-VARIABLE');
      expect(unusedIssue).toBeUndefined();

      const code2 = `
unused = 100
result = unused + 10
      `;
      result = await analyzeCode(code2, 'Python');
      unusedIssue = result.issues.find(i => i.rule === 'PY-UNUSED-VARIABLE' && i.message.includes("'unused'"));
      expect(unusedIssue).toBeUndefined();

      const code3 = `
password = "admin123"
username = "Oshan"
print(username)
      `;
      result = await analyzeCode(code3, 'Python');
      unusedIssue = result.issues.find(i => i.rule === 'PY-UNUSED-VARIABLE');
      expect(unusedIssue).toBeDefined();
      expect(unusedIssue.line).toBe(2);
    });
  });

  describe('Java Analyzer', () => {
    it('detects null dereference exactly on usage line and unused variables', async () => {
      const code = `
public class Test {
    public static void main(String[] args) {
        String name = null;
        int unused = 10;

        System.out.println(name.toUpperCase());
    }
}
      `;
      const result = await analyzeCode(code, 'Java');
      
      const nullDereference = result.issues.find(i => i.rule === 'JAVA-NULL-DEREFERENCE');
      const unusedVar = result.issues.find(i => i.rule === 'JAVA-UNUSED-VARIABLE');
      
      expect(unusedVar).toBeDefined();
      expect(nullDereference).toBeDefined();
      expect(nullDereference.line).toBe(7); // Line 7 is name.toUpperCase()
    });
  });
});
