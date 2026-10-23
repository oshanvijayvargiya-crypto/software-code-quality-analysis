import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen bg-deep-void flex items-center justify-center text-scanner-green font-mono">Loading module...</div>;

  return token ? children : <Navigate to="/login" />;
}
