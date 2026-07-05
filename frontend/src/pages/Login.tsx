import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Stethoscope, Shield, Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'doctor' | 'patient' | 'admin'>('doctor');
  const [isLoading, setIsLoading] = useState(false);

  const [id, setId] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        id,
        password,
        role
      })
    });

    const data = await res.json();

    setIsLoading(false);

    console.log({id, password})
    console.log(res.status)
    console.log(data)

    if (data.success) {
      if (data.role === "admin") {
        navigate("/dashboard/admin");
      } else if (data.role === "doctor") {
        navigate("/dashboard/doctor");
      } else {
        navigate("/dashboard/patient");
      }
    } else {
      alert("Invalid credentials");
    }

  } catch (err) {
    setIsLoading(false);
    console.error(err);
    alert("Something went wrong");
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/4"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col z-10 border border-gray-100"
      >
        <div className="p-8 bg-primary text-white text-center relative">
          <div className="absolute top-4 left-4 cursor-pointer" onClick={() => navigate('/')}>
             <div className="font-bold text-lg opacity-80 hover:opacity-100 transition-opacity">Nidaan</div>
          </div>
          <h2 className="text-3xl font-bold mb-2 mt-4">Welcome Back</h2>
          <p className="opacity-80">Secure Portal Access</p>
        </div>

        <div className="p-8">
          <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
            <button 
              type="button"
              onClick={() => setRole('doctor')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${role === 'doctor' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Stethoscope size={16} />
              Doctor
            </button>
            <button 
              type="button"
              onClick={() => setRole('patient')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${role === 'patient' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <User size={16} />
              Patient
            </button>
            <button 
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${role === 'admin' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Shield size={16} />
              Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">
                {role === 'doctor' ? 'Medical ID / Email' : role === 'admin' ? 'Admin Email' : 'Phone Number'}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type={role === 'patient' ? 'tel' : 'email'}
                  value = {id}
                  onChange = { (e)=> {setId(e.target.value)}} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-secondary focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  placeholder={role === 'doctor' ? 'dr.name@hospital.com' : role === 'admin' ? 'admin@nidaan.com' : '+1 (555) 000-0000'}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-secondary focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              New to Nidaan?{' '}
              <button 
                onClick={() => navigate('/register')}
                className="text-primary font-bold hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Protected by HIPAA compliant encryption.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
