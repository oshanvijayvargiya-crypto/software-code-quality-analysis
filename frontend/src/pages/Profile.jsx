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
      <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
        <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-surface-subdued rounded-full flex items-center justify-center border border-muted-steel/30 shrink-0">
            <User className="w-7 h-7 sm:w-8 sm:h-8 text-scanner-green" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-mono text-white mb-1 break-words">{user?.name}</h1>
            <p className="text-muted-steel font-sans text-xs sm:text-sm break-all">{user?.email}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="border border-surface-subdued bg-surface-subdued/20 p-5 sm:p-6 flex flex-col items-center justify-center rounded-sm">
            <Activity className="w-7 h-7 sm:w-8 sm:h-8 text-scanner-green mb-3 sm:mb-4" />
            <div className="text-3xl sm:text-4xl font-mono text-white mb-1 sm:mb-2">{stats.total}</div>
            <div className="text-muted-steel font-mono text-xs sm:text-sm uppercase tracking-widest">Total Scans</div>
          </div>
          
          <div className="border border-surface-subdued bg-surface-subdued/20 p-5 sm:p-6 flex flex-col items-center justify-center rounded-sm">
            <CheckCircle2 className={`w-7 h-7 sm:w-8 sm:h-8 mb-3 sm:mb-4 ${stats.avgScore >= 80 ? 'text-scanner-green' : stats.avgScore >= 60 ? 'text-warning-amber' : 'text-critical-red'}`} />
            <div className={`text-3xl sm:text-4xl font-mono mb-1 sm:mb-2 ${stats.avgScore >= 80 ? 'text-scanner-green' : stats.avgScore >= 60 ? 'text-warning-amber' : 'text-critical-red'}`}>
              {stats.avgScore || '-'}
            </div>
            <div className="text-muted-steel font-mono text-xs sm:text-sm uppercase tracking-widest">Avg Quality Score</div>
          </div>
        </div>

        <div className="border border-surface-subdued bg-surface-subdued/20 p-4 sm:p-6 rounded-sm">
          <h3 className="font-mono text-base sm:text-lg text-white mb-3 sm:mb-4 border-b border-surface-subdued/50 pb-2">Account Settings</h3>
          <p className="text-muted-steel text-xs sm:text-sm mb-4 leading-relaxed">
            This is a demo application. Account details modifications are currently locked by the administrator.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-muted-steel font-mono text-xs mb-1">USER_ID</label>
              <input type="text" disabled value={user?.id || ''} className="w-full bg-deep-void border border-surface-subdued text-muted-steel p-2 font-mono text-xs sm:text-sm break-all rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
