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
    <div className="min-h-screen flex items-center justify-center bg-deep-void px-4">
      <div className="w-full max-w-md bg-surface-subdued border border-surface-subdued/50 p-8 shadow-2xl">
        <div className="flex items-center gap-2 justify-center mb-8">
          <Terminal className="text-scanner-green w-8 h-8" />
          <h1 className="font-mono text-2xl text-white">Auth::Register</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-critical-red/50 bg-critical-red/10 text-critical-red font-mono text-sm">
            &gt; ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-muted-steel font-mono text-sm mb-2">FULL_NAME</label>
            <input
              type="text"
              required
              className="w-full bg-deep-void border border-muted-steel/30 text-white p-3 font-mono focus:border-scanner-green focus:outline-none focus:ring-1 focus:ring-scanner-green transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-muted-steel font-mono text-sm mb-2">EMAIL_ADDRESS</label>
            <input
              type="email"
              required
              className="w-full bg-deep-void border border-muted-steel/30 text-white p-3 font-mono focus:border-scanner-green focus:outline-none focus:ring-1 focus:ring-scanner-green transition-colors"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-muted-steel font-mono text-sm mb-2">PASSWORD</label>
            <input
              type="password"
              required
              className="w-full bg-deep-void border border-muted-steel/30 text-white p-3 font-mono focus:border-scanner-green focus:outline-none focus:ring-1 focus:ring-scanner-green transition-colors"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-scanner-green text-deep-void font-mono font-bold uppercase p-3 hover:bg-emerald-400 transition-colors"
          >
            Execute Registration
          </button>
        </form>
        <div className="mt-6 text-center text-muted-steel font-mono text-sm">
          Session established? <Link to="/login" className="text-scanner-green hover:underline">Run Login</Link>
        </div>
      </div>
    </div>
  );
}
