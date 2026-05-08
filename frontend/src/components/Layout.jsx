import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, GitBranch, UserCheck, Plug, Bell, Search, Home, LogOut, ChevronDown, MapPin, FileSignature } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to:'/dashboard',    icon: LayoutDashboard, label:'Dashboard' },
  { to:'/leads',        icon: Users,           label:'Leads' },
  { to:'/pipeline',     icon: GitBranch,       label:'Pipeline' },
  { to:'/mls',          icon: MapPin,          label:'MLS / IDX' },
  { to:'/backoffice',   icon: FileSignature,   label:'Back Office' },
  { to:'/agents',       icon: UserCheck,       label:'Agents' },
  { to:'/integrations', icon: Plug,            label:'Integrations' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'U';
  const roleLabel = { admin:'Administrator', manager:'Manager', agent:'Agent', isa:'ISA' }[user?.role] || user?.role;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1e3a5f] text-white flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-blue-800/50">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Home size={16} className="text-white" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight">RealCRM</div>
            <div className="text-[10px] text-blue-300 uppercase tracking-widest">Real Estate Platform</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`
            }>
              <Icon size={17} />{label}
            </NavLink>
          ))}
        </nav>

        {/* User menu */}
        <div className="px-3 py-3 border-t border-blue-800/50 relative">
          <button onClick={() => setShowUserMenu(m => !m)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm font-medium text-white truncate">{user?.name}</div>
              <div className="text-xs text-blue-300">{roleLabel}</div>
            </div>
            <ChevronDown size={14} className={`text-blue-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="absolute bottom-full left-3 right-3 mb-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <LogOut size={15}/> Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 flex-shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input placeholder="Search leads, agents..." className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="text-sm text-gray-600">
              Hi, <span className="font-semibold text-gray-900">{user?.name?.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
