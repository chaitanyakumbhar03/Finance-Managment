import React from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { IndianRupee, Mail, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const [isRegister, setIsRegister] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (email && password) {
      // Simple frontend-only auth
      dispatch(login({ email }));
      toast.success(isRegister ? 'Account created successfully!' : 'Welcome back!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-xl border border-border overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-primary/10 text-primary rounded-xl">
              <IndianRupee size={32} />
            </div>
            <h1 className="text-2xl font-bold text-text">Die Makes MS</h1>
            <p className="text-text-muted">
              {isRegister ? 'Create an account to get started' : 'Sign in to manage your business'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-text">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary text-text transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  required
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary text-text transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary/90 text-background font-semibold rounded-lg transition-colors shadow-lg shadow-primary/20"
            >
              <LogIn size={18} className="mr-2" />
              {isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-primary hover:underline"
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
