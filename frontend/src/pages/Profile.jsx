import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import { User, Activity, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ total: 0, avgScore: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/analyses');
        const analyses = res.data;
        if (analyses.length > 0) {
          const totalScore = analyses.reduce((acc, curr) => acc + curr.qualityScore, 0);
          setStats({
            total: analyses.length,
            avgScore: Math.round(totalScore / analyses.length)
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto">
        <header className="mb-8 flex items-center gap-4">
          <div className="w-16 h-16 bg-surface-subdued rounded-full flex items-center justify-center border border-muted-steel/30">
            <User className="w-8 h-8 text-scanner-green" />
          </div>
          <div>
            <h1 className="text-3xl font-mono text-white mb-1">{user?.name}</h1>
            <p className="text-muted-steel font-sans">{user?.email}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border border-surface-subdued bg-surface-subdued/20 p-6 flex flex-col items-center justify-center">
            <Activity className="w-8 h-8 text-scanner-green mb-4" />
            <div className="text-4xl font-mono text-white mb-2">{stats.total}</div>
            <div className="text-muted-steel font-mono text-sm uppercase tracking-widest">Total Scans</div>
          </div>
          
          <div className="border border-surface-subdued bg-surface-subdued/20 p-6 flex flex-col items-center justify-center">
            <CheckCircle2 className={`w-8 h-8 mb-4 ${stats.avgScore >= 80 ? 'text-scanner-green' : stats.avgScore >= 60 ? 'text-warning-amber' : 'text-critical-red'}`} />
            <div className={`text-4xl font-mono mb-2 ${stats.avgScore >= 80 ? 'text-scanner-green' : stats.avgScore >= 60 ? 'text-warning-amber' : 'text-critical-red'}`}>
              {stats.avgScore || '-'}
            </div>
            <div className="text-muted-steel font-mono text-sm uppercase tracking-widest">Avg Quality Score</div>
          </div>
        </div>

        <div className="border border-surface-subdued bg-surface-subdued/20 p-6">
          <h3 className="font-mono text-lg text-white mb-4 border-b border-surface-subdued/50 pb-2">Account Settings</h3>
          <p className="text-muted-steel text-sm mb-4">
            This is a demo application. Account details modifications are currently locked by the administrator.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-muted-steel font-mono text-xs mb-1">USER_ID</label>
              <input type="text" disabled value={user?.id} className="w-full bg-deep-void border border-surface-subdued text-muted-steel p-2 font-mono text-sm" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
