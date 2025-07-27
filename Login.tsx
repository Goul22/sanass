import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/ui/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError('Identifiants invalides. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 mb-4">
            <img 
              src="/senasem-logo.png" 
              alt="SENASEM Logo" 
              className="w-full h-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">SENASEM</h1>
          <p className="text-gray-500 mt-1">Service National de Semences</p>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Connexion Administrateur</h2>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="admin@senasem.cd"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full mt-6"
          >
            Se connecter
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Comptes de démonstration:
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <p className="font-semibold">Admin National</p>
              <p>admin@senasem.cd</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="font-semibold">Admin Provincial</p>
              <p>kinshasa@senasem.cd</p>
            </div>
          </div>
          <p className="mt-2">Mot de passe: password</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;