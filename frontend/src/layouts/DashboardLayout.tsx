import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { UserRole } from '../types';

interface Props {
  role: UserRole;
}

const DashboardLayout = ({ role }: Props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: '1',
    name: role === 'admin' ? 'System Admin' : role === 'doctor' ? 'Doctor' : 'Patient',
    role: role,
    phone: ''
  });
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      if (role === 'admin') {
        setLoading(false);
        return;
      }

      try {
        const endpoint = role === 'patient'
          ? 'http://localhost:5000/dashboard/patient'
          : 'http://localhost:5000/dashboard/doctor';

        const res = await fetch(endpoint, { credentials: 'include' });

        if (res.status === 403) {
          navigate('/login');
          return;
        }

        if (res.ok) {
          const data = await res.json();
          if (!isMounted) return;

          if (role === 'patient') {
            setUser({
              id: data.id ? String(data.id) : '1',
              name: data.name || 'Patient',
              role: 'patient',
              phone: ''
            });
            setDashboardData(data);
          } else if (role === 'doctor' && data.doctor) {
            setUser({
              id: data.doctor._id || '1',
              name: data.doctor.name || 'Doctor',
              role: 'doctor',
              phone: data.doctor.phone || ''
            });
            setDashboardData(data);
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard user data:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [role, navigate]);

  if (loading && role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Sidebar role={role} />
      <main className="flex-1 md:ml-64 p-8">
        <Header user={user} />
        <Outlet context={{ user, dashboardData }} />
      </main>
    </div>
  );
};

export default DashboardLayout;
