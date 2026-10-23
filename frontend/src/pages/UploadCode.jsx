import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Editor from '@monaco-editor/react';
import { UploadCloud, Code, FileCode2, Activity } from 'lucide-react';

export default function UploadCode() {
  const [activeTab, setActiveTab] = useState('paste'); // 'paste' or 'upload'
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    if (selectedFile.size > 2 * 1024 * 1024) {
      setError('File size must be under 2MB.');
      return;
    }
    
    const ext = selectedFile.name.split('.').pop();
    if (!['js', 'py', 'java'].includes(ext)) {
      setError('Only .js, .py, and .java files are supported.');
      return;
    }
    
    setFile(selectedFile);
    setError('');

    if (ext === 'js') setLanguage('JavaScript');
    else if (ext === 'py') setLanguage('Python');
    else if (ext === 'java') setLanguage('Java');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError('');

    try {
      const formData = new FormData();
      if (activeTab === 'upload') {
        if (!file) throw new Error('Please select a file.');
        formData.append('file', file);
      } else {
        if (!code.trim()) throw new Error('Please enter some code.');
        formData.append('code', code);
        formData.append('language', language);
        formData.append('filename', `pasted_code.${language === 'Python' ? 'py' : language === 'Java' ? 'java' : 'js'}`);
      }

      const res = await axios.post('/analyze', formData, {
        headers: {
          'Content-Type': activeTab === 'upload' ? 'multipart/form-data' : 'application/json'
        }
      });

      // Artificial delay to show off the scanning animation
      setTimeout(() => {
        navigate(`/results/${res.data._id}`);
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Analysis failed');
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className="p-8 max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-mono text-white mb-2">New Scan</h1>
          <p className="text-muted-steel font-sans">Input source code or upload a file for diagnostic analysis.</p>
        </header>

        {error && (
          <div className="mb-6 p-4 border border-critical-red/50 bg-critical-red/10 text-critical-red font-mono text-sm">
            &gt; ERROR: {error}
          </div>
        )}

        <div className="bg-surface-subdued/20 border border-surface-subdued/50 p-1 mb-6 flex gap-1 rounded-sm w-fit">
          <button 
            onClick={() => setActiveTab('paste')}
            className={`px-4 py-2 font-mono text-sm transition-colors flex items-center gap-2 ${activeTab === 'paste' ? 'bg-surface-subdued text-white' : 'text-muted-steel hover:text-white'}`}
          >
            <Code className="w-4 h-4" /> Raw Code
          </button>
          <button 
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 font-mono text-sm transition-colors flex items-center gap-2 ${activeTab === 'upload' ? 'bg-surface-subdued text-white' : 'text-muted-steel hover:text-white'}`}
          >
            <UploadCloud className="w-4 h-4" /> File Upload
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`relative ${isAnalyzing ? 'opacity-80' : ''}`}>
            {isAnalyzing && (
              <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-center items-center bg-deep-void/40 backdrop-blur-sm">
                <div className="scanner-line"></div>
                <Activity className="w-12 h-12 text-scanner-green animate-pulse mb-4" />
                <span className="text-scanner-green font-mono font-bold tracking-widest uppercase">Executing Scan...</span>
              </div>
            )}

            {activeTab === 'paste' ? (
              <div className="border border-surface-subdued/50">
                <div className="bg-surface-subdued p-3 border-b border-surface-subdued/50 flex justify-between items-center">
                  <span className="font-mono text-xs text-muted-steel">EDITOR</span>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-deep-void border border-muted-steel/30 text-white font-mono text-xs px-2 py-1 outline-none"
                    disabled={isAnalyzing}
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                  </select>
                </div>
                <Editor
                  height="500px"
                  language={language.toLowerCase()}
                  theme="vs-dark"
                  value={code}
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: '"JetBrains Mono", monospace',
                    readOnly: isAnalyzing
                  }}
                  onMount={(editor) => { editorRef.current = editor; }}
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-surface-subdued/50 p-12 text-center hover:bg-surface-subdued/10 transition-colors">
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".js,.py,.java"
                  disabled={isAnalyzing}
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <FileCode2 className={`w-12 h-12 mb-4 ${file ? 'text-scanner-green' : 'text-muted-steel'}`} />
                  <span className="font-mono text-lg text-white mb-2">
                    {file ? file.name : 'Select a file to scan'}
                  </span>
                  <span className="text-muted-steel text-sm">Supported: .js, .py, .java (Max 2MB)</span>
                </label>
              </div>
            )}
          </div>

          <div className="flex justify-end">
             <button
              type="submit"
              disabled={isAnalyzing}
              className="px-8 py-3 bg-scanner-green text-deep-void font-mono font-bold uppercase hover:bg-emerald-400 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Activity className="w-5 h-5" />
              {isAnalyzing ? 'Scanning...' : 'Analyze Code'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
