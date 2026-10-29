import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, LayoutDashboard, FileCode2, User, LogOut, Menu, X } from 'lucide-react';

export default function Layout({ children }) {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/upload', label: 'New Analysis', icon: FileCode2 },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-deep-void flex flex-col md:flex-row text-gray-200">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-surface-subdued/90 backdrop-blur-md border-b border-surface-subdued/50 sticky top-0 z-30">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Activity className="text-scanner-green w-5 h-5" />
          <span className="font-mono font-bold text-lg text-white">CodeInsight</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-muted-steel hover:text-white hover:bg-surface-subdued/50 rounded-sm transition-colors"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-scanner-green" />}
        </button>
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-over Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] bg-[#070b0f] border-r border-surface-subdued/70 z-50 flex flex-col md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-surface-subdued/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="text-scanner-green w-6 h-6" />
            <span className="font-mono font-bold text-lg text-white">CodeInsight</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 text-muted-steel hover:text-white rounded-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm font-mono text-sm transition-colors ${
                  isActive
                    ? 'bg-scanner-green/10 text-scanner-green border border-scanner-green/30 font-semibold'
                    : 'text-muted-steel hover:text-white hover:bg-surface-subdued/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-scanner-green' : ''}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface-subdued/50 bg-[#05070a]">
          <div className="mb-3 px-3 py-2 bg-surface-subdued/40 border border-surface-subdued/60 rounded-sm font-mono text-xs text-gray-400 truncate">
            &gt; user: <span className="text-white font-semibold">{user?.name || 'Developer'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-critical-red hover:bg-critical-red/10 border border-critical-red/20 transition-colors rounded-sm font-mono text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-surface-subdued/50 bg-surface-subdued/20 flex-col shrink-0 min-h-screen sticky top-0 h-screen">
        <div className="p-6 border-b border-surface-subdued/50 flex items-center gap-2">
          <Activity className="text-scanner-green w-6 h-6" />
          <span className="font-mono font-bold text-xl text-gray-100">CodeInsight</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 font-mono text-sm transition-colors rounded-sm ${
                  isActive
                    ? 'bg-scanner-green/10 text-scanner-green border border-scanner-green/30 font-semibold'
                    : 'text-muted-steel hover:text-white hover:bg-surface-subdued/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-scanner-green' : ''}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface-subdued/50">
          <div className="mb-4 px-4 font-mono text-sm text-gray-400 truncate">
            &gt; user: <span className="text-white">{user?.name || 'Developer'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-critical-red hover:bg-critical-red/10 transition-colors rounded-sm font-mono text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
