import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, ShieldAlert, Code2, AlertTriangle, Download, ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function Results() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    try {
      const res = await axios.get(`/analyses/${id}`);
      setResult(res.data);
    } catch (err) {
      setError('Failed to load analysis results.');
    } finally {
      setLoading(false);
    }
  };

  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const element = document.getElementById('report-content');
      const canvas = await html2canvas(element, { scale: 1 });
      const chartImage = canvas.toDataURL('image/png');

      const response = await axios.post(`/analyses/${id}/pdf`, { chartImage }, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Analysis_${result.filename}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to generate PDF.');
    } finally {
      setExporting(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#00FF9D'; // scanner-green
    if (score >= 70) return '#FFCC00'; // warning-amber
    return '#FF3B30'; // critical-red
  };

  if (loading) return <Layout><div className="p-8 text-scanner-green font-mono animate-pulse">Loading diagnostics...</div></Layout>;
  if (error) return <Layout><div className="p-8 text-critical-red font-mono">{error}</div></Layout>;
  if (!result) return <Layout><div className="p-8 text-white font-mono">No data</div></Layout>;

  // Prepare Chart Data
  const severityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0, Info: 0 };
  const categoryCounts = {};

  result.issues.forEach(issue => {
    if (severityCounts[issue.severity] !== undefined) {
      severityCounts[issue.severity]++;
    } else {
      severityCounts[issue.severity] = 1;
    }
    
    const cat = issue.category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const severityData = [
    { name: 'Critical', value: severityCounts.Critical, color: '#FF3B30' },
    { name: 'High', value: severityCounts.High, color: '#FF9500' },
    { name: 'Medium', value: severityCounts.Medium, color: '#FFCC00' },
    { name: 'Low', value: severityCounts.Low, color: '#34C759' },
    { name: 'Info', value: severityCounts.Info, color: '#00FF9D' },
  ].filter(item => item.value > 0);

  const categoryData = Object.keys(categoryCounts).map(key => ({
    name: key,
    value: categoryCounts[key]
  }));

  const COLORS = ['#00FF9D', '#FFCC00', '#FF3B30', '#3b82f6', '#a855f7', '#ec4899'];

  return (
    <Layout>
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto pb-24" id="report-content">
        <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link to="/dashboard" className="text-muted-steel hover:text-white flex items-center gap-2 mb-3 font-mono text-xs sm:text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-mono text-white mb-1 break-all sm:break-normal">{result.filename}</h1>
            <p className="text-muted-steel font-sans text-xs sm:text-sm">
              Analyzed on {new Date(result.date).toLocaleString()} • <span className="text-gray-200">{result.language}</span>
            </p>
          </div>
          <button 
            onClick={handleExportPDF}
            disabled={exporting}
            className="w-full sm:w-auto px-4 py-2.5 bg-surface-subdued text-white font-mono text-xs sm:text-sm border border-muted-steel/30 hover:bg-surface-subdued/50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 rounded-sm"
          >
            <Download className="w-4 h-4" /> {exporting ? 'Generating...' : 'Export PDF'}
          </button>
        </header>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="col-span-1 border border-surface-subdued bg-surface-subdued/20 p-6 flex flex-col items-center justify-center relative overflow-hidden group rounded-sm">
            <h3 className="font-mono text-xs sm:text-sm text-muted-steel mb-4 uppercase tracking-widest">Quality Score</h3>
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center rounded-full border-4" style={{ borderColor: getScoreColor(result.qualityScore) }}>
              <span className="font-mono text-3xl sm:text-4xl font-bold" style={{ color: getScoreColor(result.qualityScore) }}>{result.qualityScore}</span>
            </div>
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-3xl opacity-20 pointer-events-none transition-opacity duration-1000 group-hover:opacity-40" style={{ backgroundColor: getScoreColor(result.qualityScore) }}></div>
          </div>

          <div className="col-span-1 md:col-span-3 border border-surface-subdued bg-surface-subdued/20 p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 rounded-sm">
            <div className="p-3 sm:p-4 border border-surface-subdued/50 bg-deep-void/50 rounded-sm">
              <div className="text-muted-steel font-mono text-[10px] sm:text-xs mb-1 uppercase">Total Issues</div>
              <div className="text-2xl sm:text-3xl font-mono text-white">{result.issues.length}</div>
            </div>
            <div className="p-3 sm:p-4 border border-surface-subdued/50 bg-deep-void/50 rounded-sm">
              <div className="text-muted-steel font-mono text-[10px] sm:text-xs mb-1 uppercase">Complexity</div>
              <div className="text-2xl sm:text-3xl font-mono text-white">{result.metrics.cyclomaticComplexity || 0}</div>
            </div>
            <div className="p-3 sm:p-4 border border-surface-subdued/50 bg-deep-void/50 rounded-sm">
              <div className="text-muted-steel font-mono text-[10px] sm:text-xs mb-1 uppercase">Lines of Code</div>
              <div className="text-2xl sm:text-3xl font-mono text-white">{result.metrics.loc}</div>
            </div>
             <div className="p-3 sm:p-4 border border-surface-subdued/50 bg-deep-void/50 rounded-sm">
              <div className="text-muted-steel font-mono text-[10px] sm:text-xs mb-1 uppercase">Classes / Funcs</div>
              <div className="text-lg sm:text-xl font-mono text-white">{result.metrics.numClasses || 0} / {result.metrics.numFunctions || 0}</div>
            </div>
             <div className="p-3 sm:p-4 border border-surface-subdued/50 bg-deep-void/50 rounded-sm">
              <div className="text-muted-steel font-mono text-[10px] sm:text-xs mb-1 uppercase">Comment Lines</div>
              <div className="text-2xl sm:text-3xl font-mono text-white">{result.metrics.commentLines || 0}</div>
            </div>
            <div className="p-3 sm:p-4 border border-surface-subdued/50 bg-deep-void/50 rounded-sm">
              <div className="text-muted-steel font-mono text-[10px] sm:text-xs mb-1 uppercase">Comment Ratio</div>
              <div className="text-2xl sm:text-3xl font-mono text-white">{Math.round(result.metrics.commentRatio || 0)}%</div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="border border-surface-subdued bg-surface-subdued/20 p-4 sm:p-6 rounded-sm">
            <h3 className="font-mono text-xs sm:text-sm text-muted-steel mb-4 sm:mb-6 uppercase tracking-widest">Issues by Severity</h3>
            <div className="h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData}>
                  <XAxis dataKey="name" stroke="#8B949E" tick={{ fontFamily: 'monospace', fontSize: 11 }} />
                  <Tooltip cursor={{ fill: '#151C28' }} contentStyle={{ backgroundColor: '#0A0E17', borderColor: '#151C28', color: '#fff', fontFamily: 'monospace', fontSize: 12 }} />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border border-surface-subdued bg-surface-subdued/20 p-4 sm:p-6 rounded-sm">
            <h3 className="font-mono text-xs sm:text-sm text-muted-steel mb-4 sm:mb-6 uppercase tracking-widest">Issue Breakdown</h3>
            <div className="h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0A0E17', borderColor: '#151C28', color: '#fff', fontFamily: 'monospace', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Issues List & Table */}
        <div className="border border-surface-subdued bg-surface-subdued/20 rounded-sm overflow-hidden">
          <div className="p-4 border-b border-surface-subdued/50 flex items-center justify-between">
             <h3 className="font-mono text-xs sm:text-sm text-muted-steel uppercase tracking-widest">Detected Anomalies</h3>
             <span className="font-mono text-xs text-scanner-green">{result.issues.length} {result.issues.length === 1 ? 'issue' : 'issues'}</span>
          </div>

          {result.issues.length === 0 ? (
            <div className="p-8 text-center text-scanner-green font-mono text-sm">
              Scan completed. 0 anomalies detected. System operating nominally.
            </div>
          ) : (
            <>
              {/* Mobile View: Issue Cards (< md) */}
              <div className="md:hidden divide-y divide-surface-subdued/40">
                {result.issues.map((issue, idx) => (
                  <div key={idx} className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs px-2 py-0.5 bg-deep-void border border-surface-subdued text-muted-steel rounded">
                        Line {issue.line}
                      </span>
                      <span className={`px-2 py-0.5 border rounded text-xs flex items-center w-fit gap-1 ${
                        issue.severity === 'Critical' ? 'border-critical-red/30 text-critical-red bg-critical-red/10' :
                        issue.severity === 'High' ? 'border-orange-500/30 text-orange-500 bg-orange-500/10' :
                        issue.severity === 'Medium' ? 'border-warning-amber/30 text-warning-amber bg-warning-amber/10' :
                        issue.severity === 'Low' ? 'border-green-500/30 text-green-500 bg-green-500/10' :
                        'border-scanner-green/30 text-scanner-green bg-scanner-green/10'
                      }`}>
                        {(issue.severity === 'Critical' || issue.severity === 'High') && <ShieldAlert className="w-3 h-3" />}
                        {(issue.severity === 'Medium' || issue.severity === 'Low') && <AlertTriangle className="w-3 h-3" />}
                        {issue.severity === 'Info' && <Activity className="w-3 h-3" />}
                        {issue.severity}
                      </span>
                    </div>

                    <div className="font-mono text-xs">
                      <span className="text-white font-semibold">{issue.category || 'Code Smell'}</span>
                      <span className="text-muted-steel ml-2">({issue.rule || issue.type})</span>
                    </div>

                    <div className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      {issue.message}
                    </div>

                    {issue.suggestion && (
                      <div className="text-xs text-muted-steel bg-deep-void/60 p-2.5 rounded-sm border border-surface-subdued font-mono break-words">
                        &gt; Fix: <span className="text-gray-200">{issue.suggestion}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop View: Full Issues Table (>= md) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left font-sans">
                  <thead className="bg-surface-subdued/30 border-b border-surface-subdued font-mono text-sm text-muted-steel">
                    <tr>
                      <th className="p-4 font-normal">LINE</th>
                      <th className="p-4 font-normal">SEVERITY</th>
                      <th className="p-4 font-normal">CATEGORY & RULE</th>
                      <th className="p-4 font-normal">DETAILS & FIX</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-subdued/30 text-gray-200">
                    {result.issues.map((issue, idx) => (
                      <tr key={idx} className="hover:bg-surface-subdued/10 transition-colors">
                        <td className="p-4 font-mono text-muted-steel whitespace-nowrap">{issue.line}</td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`px-2 py-1 border rounded text-xs flex items-center w-fit gap-1 ${
                            issue.severity === 'Critical' ? 'border-critical-red/30 text-critical-red bg-critical-red/10' :
                            issue.severity === 'High' ? 'border-orange-500/30 text-orange-500 bg-orange-500/10' :
                            issue.severity === 'Medium' ? 'border-warning-amber/30 text-warning-amber bg-warning-amber/10' :
                            issue.severity === 'Low' ? 'border-green-500/30 text-green-500 bg-green-500/10' :
                            'border-scanner-green/30 text-scanner-green bg-scanner-green/10'
                          }`}>
                            {(issue.severity === 'Critical' || issue.severity === 'High') && <ShieldAlert className="w-3 h-3" />}
                            {(issue.severity === 'Medium' || issue.severity === 'Low') && <AlertTriangle className="w-3 h-3" />}
                            {issue.severity === 'Info' && <Activity className="w-3 h-3" />}
                            {issue.severity}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-sm">
                          <div className="text-white">{issue.category || 'Code Smell'}</div>
                          <div className="text-xs text-muted-steel mt-1">{issue.rule || issue.type}</div>
                        </td>
                        <td className="p-4">
                          <div className="mb-1 text-sm">{issue.message}</div>
                          {issue.suggestion && (
                            <div className="text-xs text-muted-steel bg-deep-void/50 p-2 rounded-sm border border-surface-subdued mt-2 font-mono">
                              &gt; Fix: {issue.suggestion}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
