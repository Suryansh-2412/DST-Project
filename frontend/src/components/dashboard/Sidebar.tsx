import React from 'react';
import { Users, Activity, Settings, LogOut, MessageSquare, Home, ClipboardList, Thermometer, ShieldCheck, Cpu, Lock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserRole } from '../../types';

interface SidebarProps {
  role: UserRole;
  subscribed?: boolean;
}

const Sidebar = ({ role, subscribed = true }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === `/dashboard/${role}` && location.pathname === `/dashboard/${role}`) return true;
    if (path !== `/dashboard/${role}` && location.pathname.startsWith(path)) return true;
    return false;
  };

  const menuItems = role === 'admin' ? [
    { icon: Home, label: 'Overview', path: '/dashboard/admin' },
    { icon: ShieldCheck, label: 'Verify Doctors', path: '/dashboard/admin/verify' },
    { icon: Cpu, label: 'AI Models', path: '/dashboard/admin/models' },
  ] : role === 'doctor' ? [
    { icon: Home, label: 'Overview', path: '/dashboard/doctor' },
    { icon: Users, label: 'Patients', path: '/dashboard/doctor/patients' },
    { icon: Activity, label: 'Monitoring', path: '/dashboard/doctor/monitoring' },
  ] : [
    { icon: Home, label: 'Home', path: '/dashboard/patient' },
    { icon: ClipboardList, label: 'My Records', path: '/dashboard/patient/records' },
    { icon: Thermometer, label: 'Check-in', path: '/dashboard/patient/checkin' },
    { icon: MessageSquare, label: 'Assistant', path: '/dashboard/patient/chat', locked: role === 'patient' && !subscribed },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed h-full hidden md:flex flex-col z-20">
      <div className="p-6 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
         <div className="text-primary font-bold text-2xl">Nidaan</div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="px-4 mb-4 text-xs font-semibold text-text-gray uppercase tracking-wider">
          {role === 'admin' ? 'Admin Console' : role === 'doctor' ? 'Clinical Workspace' : 'Patient Portal'}
        </div>
        
        {menuItems.map((item) => (
          <div 
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium cursor-pointer transition-colors ${
              isActive(item.path) 
                ? 'bg-primary/10 text-primary' 
                : 'text-secondary hover:bg-gray-50'
            }`}
          >
            <item.icon size={20} />
            <span className="flex-1">{item.label}</span>
            {'locked' in item && item.locked && <Lock size={14} className="text-text-gray" />}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div 
          onClick={() => navigate(`/dashboard/${role}/settings`)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium cursor-pointer transition-colors ${
            isActive(`/dashboard/${role}/settings`) 
              ? 'bg-primary/10 text-primary' 
              : 'text-secondary hover:bg-gray-50'
          }`}
        >
          <Settings size={20} />
          Settings
        </div>
        <div 
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userRole");
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            localStorage.removeItem("userId");
            localStorage.clear();
            navigate('/login',{replace:true});
            window.location.reload();
          }}
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium cursor-pointer mt-1 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
