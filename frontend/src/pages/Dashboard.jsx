import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { FileCode2, Trash2, ChevronRight, Search } from 'lucide-react';

export default function Dashboard() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const res = await axios.get('/analyses');
      setAnalyses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAnalysis = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) return;
    try {
      await axios.delete(`/analyses/${id}`);
      setAnalyses(analyses.filter(a => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-scanner-green';
    if (score >= 70) return 'text-warning-amber';
    return 'text-critical-red';
  };

  return (
    <Layout>
      <div className="p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-mono text-white mb-2">Analysis History</h1>
            <p className="text-muted-steel font-sans">Review past diagnostic scans of your codebase.</p>
          </div>
          <Link to="/upload" className="px-6 py-3 bg-scanner-green text-deep-void font-mono font-bold uppercase hover:bg-emerald-400 transition-colors flex items-center gap-2">
            <FileCode2 className="w-5 h-5" />
            New Scan
          </Link>
        </header>

        {loading ? (
          <div className="text-scanner-green font-mono animate-pulse">Loading data...</div>
        ) : analyses.length === 0 ? (
          <div className="border border-surface-subdued border-dashed p-12 text-center">
            <Search className="w-12 h-12 text-muted-steel mx-auto mb-4" />
            <h3 className="text-xl text-white font-mono mb-2">No scans found</h3>
            <p className="text-muted-steel mb-6">You haven't run any code analysis yet.</p>
            <Link to="/upload" className="text-scanner-green hover:underline font-mono">Initialize your first scan &gt;</Link>
          </div>
        ) : (
          <div className="bg-surface-subdued/20 border border-surface-subdued/50 rounded-sm overflow-hidden">
            <table className="w-full text-left font-sans">
              <thead className="bg-surface-subdued/50 border-b border-surface-subdued font-mono text-sm text-muted-steel">
                <tr>
                  <th className="p-4 font-normal">FILENAME</th>
                  <th className="p-4 font-normal">LANGUAGE</th>
                  <th className="p-4 font-normal">DATE</th>
                  <th className="p-4 font-normal">SCORE</th>
                  <th className="p-4 font-normal text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-subdued/30 text-gray-200">
                {analyses.map(analysis => (
                  <tr key={analysis._id} className="hover:bg-surface-subdued/30 transition-colors group">
                    <td className="p-4 font-mono">
                      <Link to={`/results/${analysis._id}`} className="hover:text-scanner-green flex items-center gap-2">
                        <FileCode2 className="w-4 h-4 text-muted-steel group-hover:text-scanner-green" />
                        {analysis.filename}
                      </Link>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-surface-subdued border border-muted-steel/20 rounded text-xs">
                        {analysis.language}
                      </span>
                    </td>
                    <td className="p-4 text-muted-steel text-sm">
                      {new Date(analysis.date).toLocaleDateString()} {new Date(analysis.date).toLocaleTimeString()}
                    </td>
                    <td className="p-4 font-mono font-bold">
                      <span className={getScoreColor(analysis.qualityScore)}>
                        {analysis.qualityScore}/100
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link to={`/results/${analysis._id}`} className="text-muted-steel hover:text-white transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                        <button onClick={() => deleteAnalysis(analysis._id)} className="text-muted-steel hover:text-critical-red transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
