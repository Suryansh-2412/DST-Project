import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Stethoscope, Shield, Loader2, Phone, Mail, Calendar, Droplets } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'doctor' | 'patient'>('patient');
  const [isLoading, setIsLoading] = useState(false);

  // Common fields
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  // Doctor specific fields
  const [email, setEmail] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [specialty, setSpecialty] = useState('General surgeon');
  const [address, setAddress] = useState('');
  const [fee, setFee] = useState(500);

  // Patient specific fields
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const url = role === 'doctor' 
      ? "http://localhost:5000/register/doctor" 
      : "http://localhost:5000/register/patient";

    const body = role === 'doctor' 
      ? { name, email, password, license_no: licenseNo, specialty, address, fee }
      : { name, phone, password, dob, bloodGroup, gender };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
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
        className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col z-10 border border-gray-100 my-8"
      >
        <div className="p-8 bg-primary text-white text-center relative">
          <div className="absolute top-4 left-4 cursor-pointer" onClick={() => navigate('/')}>
             <div className="font-bold text-lg opacity-80 hover:opacity-100 transition-opacity">Nidaan</div>
          </div>
          <h2 className="text-3xl font-bold mb-2 mt-4">Create Account</h2>
          <p className="opacity-80">Join our healthcare network</p>
        </div>

        <div className="p-8">
          <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
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
              onClick={() => setRole('doctor')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${role === 'doctor' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Stethoscope size={16} />
              Doctor
            </button>
          </div>

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-secondary focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {role === 'doctor' ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-secondary focus:outline-none focus:border-primary focus:bg-white transition-colors"
                      placeholder="dr.name@hospital.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Medical ID / License No</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text"
                      value={licenseNo}
                      onChange={(e) => setLicenseNo(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-secondary focus:outline-none focus:border-primary focus:bg-white transition-colors"
                      placeholder="LIC-XXXXXX"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Specialty</label>
                  <input 
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-secondary focus:outline-none focus:border-primary focus:bg-white transition-colors"
                    placeholder="General Surgeon"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Consultation Fee</label>
                  <input 
                    type="number"
                    value={fee}
                    onChange={(e) => setFee(parseInt(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-secondary focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Clinic Address</label>
                  <input 
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-secondary focus:outline-none focus:border-primary focus:bg-white transition-colors"
                    placeholder="123 Medical St, Health City"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-secondary focus:outline-none focus:border-primary focus:bg-white transition-colors"
                      placeholder="9876543210"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-secondary focus:outline-none focus:border-primary focus:bg-white transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Blood Group</label>
                  <div className="relative">
                    <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-secondary focus:outline-none focus:border-primary focus:bg-white transition-colors appearance-none"
                      required
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Gender</label>
                  <select 
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-secondary focus:outline-none focus:border-primary focus:bg-white transition-colors appearance-none"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Create Password</label>
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
              className="md:col-span-2 w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-primary font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
