import React, { useState, useRef, useEffect } from 'react';
import { Search, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';

const Header = ({ user }: { user: User }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowDropdown(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.clear();
    navigate('/login',{replace:true});
    window.location.reload();
  };

  const handleSettings = () => {
    setShowDropdown(false);
    navigate(`/dashboard/${user.role}/settings`);
  };

  return (
    <header className="flex justify-between items-center mb-8 bg-white/50 backdrop-blur-sm py-4 px-1 rounded-xl">
      <div>
        <h1 className="text-2xl font-bold text-secondary">
          {user.role === 'doctor' ? `Dr. ${user.name}` : user.role === 'admin' ? 'System Administrator' : `Welcome, ${user.name}`}
        </h1>
        <p className="text-text-gray text-sm capitalize">
          {user.role === 'doctor' ? 'Chief Resident • Cardiology' : user.role === 'admin' ? 'Platform Management' : 'Patient ID: #883920'}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
          <Search size={18} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent outline-none text-sm text-secondary w-48"
          />
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
          >
            {user.name.charAt(0)}
          </div>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                <p className="text-sm font-bold text-secondary">{user.name}</p>
                <p className="text-xs text-text-gray capitalize">{user.role} Account</p>
              </div>
              
              <div className="py-1">
                <button 
                  onClick={handleSettings}
                  className="w-full text-left px-4 py-2.5 text-sm text-secondary hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <Settings size={16} className="text-gray-400" /> 
                  Account Settings
                </button>
              </div>
              
              <div className="border-t border-gray-50 py-1">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
                >
                  <LogOut size={16} /> 
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
