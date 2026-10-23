import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, LayoutDashboard, FileCode2, User, LogOut } from 'lucide-react';

export default function Layout({ children }) {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-deep-void flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-surface-subdued/50 bg-surface-subdued/20 flex flex-col">
        <div className="p-6 border-b border-surface-subdued/50 flex items-center gap-2">
          <Activity className="text-scanner-green w-6 h-6" />
          <span className="font-mono font-bold text-xl text-gray-100">CodeInsight</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-muted-steel hover:text-white hover:bg-surface-subdued/50 transition-colors rounded-sm">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-mono text-sm">Dashboard</span>
          </Link>
          <Link to="/upload" className="flex items-center gap-3 px-4 py-3 text-muted-steel hover:text-white hover:bg-surface-subdued/50 transition-colors rounded-sm">
            <FileCode2 className="w-5 h-5" />
            <span className="font-mono text-sm">New Analysis</span>
          </Link>
          <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-muted-steel hover:text-white hover:bg-surface-subdued/50 transition-colors rounded-sm">
            <User className="w-5 h-5" />
            <span className="font-mono text-sm">Profile</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-surface-subdued/50">
          <div className="mb-4 px-4 font-mono text-sm text-gray-400">
            &gt; user: {user?.name}
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-critical-red hover:bg-critical-red/10 transition-colors rounded-sm">
            <LogOut className="w-5 h-5" />
            <span className="font-mono text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
