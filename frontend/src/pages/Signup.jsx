import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Terminal } from 'lucide-react';

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-deep-void px-4 py-8 sm:py-12">
      <div className="w-full max-w-md bg-surface-subdued border border-surface-subdued/50 p-6 sm:p-8 shadow-2xl rounded-sm">
        <div className="flex items-center gap-2 justify-center mb-6 sm:mb-8">
          <Terminal className="text-scanner-green w-7 h-7 sm:w-8 sm:h-8" />
          <h1 className="font-mono text-xl sm:text-2xl text-white">Auth::Register</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-critical-red/50 bg-critical-red/10 text-critical-red font-mono text-xs sm:text-sm rounded-sm">
            &gt; ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-muted-steel font-mono text-xs sm:text-sm mb-2">FULL_NAME</label>
            <input
              type="text"
              required
              className="w-full bg-deep-void border border-muted-steel/30 text-white p-2.5 sm:p-3 font-mono text-sm focus:border-scanner-green focus:outline-none focus:ring-1 focus:ring-scanner-green transition-colors rounded-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-muted-steel font-mono text-xs sm:text-sm mb-2">EMAIL_ADDRESS</label>
            <input
              type="email"
              required
              className="w-full bg-deep-void border border-muted-steel/30 text-white p-2.5 sm:p-3 font-mono text-sm focus:border-scanner-green focus:outline-none focus:ring-1 focus:ring-scanner-green transition-colors rounded-sm"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-muted-steel font-mono text-xs sm:text-sm mb-2">PASSWORD</label>
            <input
              type="password"
              required
              className="w-full bg-deep-void border border-muted-steel/30 text-white p-2.5 sm:p-3 font-mono text-sm focus:border-scanner-green focus:outline-none focus:ring-1 focus:ring-scanner-green transition-colors rounded-sm"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-scanner-green text-deep-void font-mono font-bold uppercase p-3 hover:bg-emerald-400 transition-colors text-sm rounded-sm shadow-[0_0_15px_rgba(0,255,157,0.2)]"
          >
            Execute Registration
          </button>
        </form>
        <div className="mt-6 text-center text-muted-steel font-mono text-xs sm:text-sm">
          Session established? <Link to="/login" className="text-scanner-green hover:underline">Run Login</Link>
        </div>
        <div className="mt-4 text-center">
          <Link to="/" className="text-muted-steel hover:text-white font-mono text-xs transition-colors">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
