import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, 
  Eye, 
  Mail, 
  LogOut, 
  TrendingUp,
  User,
  ArrowLeft
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  loginCount: number;
}

interface Stats {
  totalUsers: number;
  totalVisitors: number;
  totalSubscribers: number;
  todayVisitors: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalVisitors: 0,
    totalSubscribers: 0,
    todayVisitors: 0
  });
  const [users, setUsers] = useState<UserData[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }
    loadStats();
  }, [user, navigate]);

  const loadStats = () => {
    // Get users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userList: UserData[] = storedUsers.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      isAdmin: u.isAdmin,
      loginCount: u.loginCount || 0
    }));
    setUsers(userList);

    // Get subscribers
    const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');

    // Get visitors (mock)
    const visitors = JSON.parse(localStorage.getItem('visitors') || '[]');

    setStats({
      totalUsers: userList.length,
      totalVisitors: visitors.length || Math.floor(Math.random() * 100) + 50,
      totalSubscribers: subscribers.length,
      todayVisitors: Math.floor(Math.random() * 20) + 5
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-spidey-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🕷️</div>
          <p className="font-comic text-white text-xl">Access Denied</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spidey-black">
      {/* Header */}
      <header className="bg-spidey-black/90 backdrop-blur-xl border-b-2 border-spidey-red/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-white/60 hover:text-spidey-red transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="font-comic text-2xl text-spidey-red">🕷️ ADMIN DASHBOARD</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-body text-white/60">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-spidey-red/20 text-spidey-red rounded-lg border border-spidey-red/50 hover:bg-spidey-red hover:text-white transition-all"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'users', label: 'Users', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-comic transition-all ${
                activeTab === tab.id
                  ? 'bg-spidey-red text-white border-2 border-white/50'
                  : 'bg-spidey-blue/20 text-white/60 border-2 border-spidey-blue/50 hover:border-spidey-red hover:text-spidey-red'
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                label="Total Users"
                value={stats.totalUsers}
                color="red"
              />
              <StatCard
                icon={Eye}
                label="Total Visitors"
                value={stats.totalVisitors}
                color="blue"
              />
              <StatCard
                icon={TrendingUp}
                label="Today's Visitors"
                value={stats.todayVisitors}
                color="green"
              />
              <StatCard
                icon={Mail}
                label="Newsletter Subscribers"
                value={stats.totalSubscribers}
                color="purple"
              />
            </div>

            {/* Quick Info */}
            <div className="bg-spidey-blue/10 backdrop-blur-sm border-2 border-spidey-blue/50 rounded-2xl p-6">
              <h2 className="font-comic text-2xl text-white mb-4">📊 Quick Insights</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="font-body text-white/70">
                    <span className="text-spidey-red font-bold">{stats.totalUsers}</span> registered users
                  </p>
                  <p className="font-body text-white/70">
                    <span className="text-spidey-blue font-bold">{stats.totalVisitors}</span> total page views
                  </p>
                  <p className="font-body text-white/70">
                    <span className="text-green-400 font-bold">{stats.todayVisitors}</span> visitors today
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="font-body text-white/70">
                    Average daily visitors: <span className="text-spidey-red font-bold">
                      {Math.round(stats.totalVisitors / 30)}
                    </span>
                  </p>
                  <p className="font-body text-white/70">
                    Newsletter conversion: <span className="text-spidey-blue font-bold">
                      {stats.totalVisitors > 0 ? Math.round((stats.totalSubscribers / stats.totalVisitors) * 100) : 0}%
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-spidey-black/50 backdrop-blur-sm border-2 border-spidey-blue/50 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-spidey-blue/30">
              <h2 className="font-comic text-2xl text-white">👥 Registered Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-spidey-blue/20">
                  <tr>
                    <th className="px-6 py-4 text-left font-comic text-white/80">User</th>
                    <th className="px-6 py-4 text-left font-comic text-white/80">Email</th>
                    <th className="px-6 py-4 text-left font-comic text-white/80">Logins</th>
                    <th className="px-6 py-4 text-left font-comic text-white/80">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-spidey-blue/20 hover:bg-spidey-blue/10">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-spidey-red/20 rounded-full flex items-center justify-center">
                            <User size={18} className="text-spidey-red" />
                          </div>
                          <span className="font-body text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-body text-white/70">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-spidey-red/20 text-spidey-red rounded-full text-sm font-comic">
                          {u.loginCount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {u.isAdmin ? (
                          <span className="px-3 py-1 bg-spidey-red text-white rounded-full text-sm font-comic">
                            Admin
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-spidey-blue/30 text-white/70 rounded-full text-sm font-comic">
                            User
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: number; 
  color: 'red' | 'blue' | 'green' | 'purple';
}) {
  const colorClasses = {
    red: 'from-spidey-red/30 to-spidey-red/10 border-spidey-red/50 text-spidey-red',
    blue: 'from-spidey-blue/30 to-spidey-blue/10 border-spidey-blue/50 text-spidey-blue-light',
    green: 'from-green-500/30 to-green-500/10 border-green-500/50 text-green-400',
    purple: 'from-purple-500/30 to-purple-500/10 border-purple-500/50 text-purple-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm border-2 rounded-2xl p-6`}>
      <div className="flex items-center justify-between mb-4">
        <Icon size={28} className={colorClasses[color].split(' ').pop()} />
        <span className="text-4xl font-comic text-white">{value.toLocaleString()}</span>
      </div>
      <p className="font-body text-white/60">{label}</p>
    </div>
  );
}
