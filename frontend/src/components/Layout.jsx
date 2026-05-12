import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, GitBranch, UserCheck, Plug, Bell, Search, Home, LogOut, ChevronDown, MapPin, FileSignature, Phone, Mail, X, CheckCheck, Clock, Flame, AlertCircle, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { leads as leadsApi } from '../api/client';

const nav = [
  { to:'/dashboard',    icon: LayoutDashboard, label:'Dashboard' },
  { to:'/leads',        icon: Users,           label:'Leads' },
  { to:'/pipeline',     icon: GitBranch,       label:'Pipeline' },
  { to:'/mls',          icon: MapPin,          label:'MLS / IDX' },
  { to:'/backoffice',   icon: FileSignature,   label:'Back Office' },
  { to:'/agents',       icon: UserCheck,       label:'Agents' },
  { to:'/blog',         icon: BookOpen,        label:'Blog / Content' },
  { to:'/integrations', icon: Plug,            label:'Integrations' },
];

const NOTIFICATIONS = [
  { id:1, type:'hot',   icon: Flame,       color:'text-red-500 bg-red-50',     title:'Hot lead needs follow-up', body:'Nancy Davis hasn\'t been contacted in 3 days',       time:'5m ago', read:false, link:'/leads/lead-nancy-davis' },
  { id:2, type:'task',  icon: Clock,       color:'text-amber-500 bg-amber-50', title:'Task due today',           body:'Send CMA to Sandra Wilson by 5:00 PM',               time:'1h ago', read:false, link:'/leads/lead-sandra-wilson' },
  { id:3, type:'sign',  icon: CheckCheck,  color:'text-green-500 bg-green-50', title:'Document signed!',         body:'Jennifer Walsh signed the Buyer Representation Agreement', time:'2h ago', read:true, link:'/leads/lead-jennifer-walsh' },
  { id:4, type:'lead',  icon: Users,       color:'text-blue-500 bg-blue-50',   title:'New lead assigned',        body:'Carlos Hernandez from Google PPC — budget $650K',    time:'3h ago', read:true,  link:'/leads/lead-carlos-hernandez' },
  { id:5, type:'alert', icon: AlertCircle, color:'text-purple-500 bg-purple-50',title:'Pipeline update',        body:'Deal moved to Under Contract: 412 Elm St, Bethesda',  time:'5h ago', read:true,  link:'/pipeline' },
];

function GlobalSearch({ onClose }) {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (!query.trim() || query.length < 2) { setResults([]); return; }
    setLoading(true);
    const timer = setTimeout(() => {
      leadsApi.list({ search: query, limit: 6 })
        .then(d => setResults(d.leads || []))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const go = (id) => { navigate(`/leads/${id}`); onClose(); setQuery(''); };

  return (
    <div className="relative w-full max-w-md">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
      <input
        ref={inputRef}
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search leads, agents..."
        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
      />
      {query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
          {loading ? (
            <div className="px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400">No results for "{query}"</div>
          ) : (
            <>
              <div className="px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                Leads ({results.length})
              </div>
              {results.map(lead => (
                <button key={lead.id} onClick={() => go(lead.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left group">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {lead.firstName[0]}{lead.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                      {lead.firstName} {lead.lastName}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-2 truncate">
                      {lead.email && <span className="flex items-center gap-0.5"><Mail size={10}/>{lead.email}</span>}
                      {lead.phone && <span className="flex items-center gap-0.5"><Phone size={10}/>{lead.phone}</span>}
                    </p>
                  </div>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex-shrink-0 group-hover:bg-blue-100 group-hover:text-blue-600">
                    {lead.status}
                  </span>
                </button>
              ))}
              <button onClick={() => { navigate(`/leads?search=${query}`); onClose(); }}
                className="w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-100 transition-colors text-left font-medium">
                View all results for "{query}" →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationBell() {
  const [open, setOpen]   = useState(false);
  const [notes, setNotes] = useState(NOTIFICATIONS);
  const ref = useRef(null);
  const unread = notes.filter(n => !n.read).length;
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markRead = (id) => setNotes(n => n.map(x => x.id === id ? { ...x, read:true } : x));
  const markAll  = ()   => setNotes(n => n.map(x => ({ ...x, read:true })));

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
        <Bell size={18}/>
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-bold text-gray-900">Notifications</p>
              {unread > 0 && <p className="text-xs text-gray-400">{unread} unread</p>}
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAll} className="text-xs text-blue-600 hover:underline">Mark all read</button>
              )}
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={14}/>
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
            {notes.map(n => {
              const Icon = n.icon;
              return (
                <button key={n.id} onClick={() => { const link = n.link; markRead(n.id); setOpen(false); setTimeout(() => navigate(link), 10); }}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/40' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${n.color}`}>
                    <Icon size={14}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{n.body}</p>
                    <p className="text-[10px] text-gray-300 mt-1">{n.time}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"/>}
                </button>
              );
            })}
          </div>

          <div className="px-4 py-2.5 border-t border-gray-100">
            <button onClick={() => setOpen(false)} className="text-xs text-blue-600 hover:underline w-full text-center">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchOpen, setSearchOpen]     = useState(false);

  const showSearch = location.pathname.startsWith('/leads') || location.pathname.startsWith('/agents');
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'U';
  const roleLabel = { admin:'Administrator', manager:'Manager', agent:'Agent', isa:'ISA' }[user?.role] || user?.role;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1e3a5f] text-white flex flex-col flex-shrink-0">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-blue-800/50">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Home size={16} className="text-white" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight">RealCRM</div>
            <div className="text-[10px] text-blue-300 uppercase tracking-widest">Real Estate Platform</div>
          </div>
        </div>

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
        <div ref={userMenuRef} className="px-3 py-3 border-t border-blue-800/50 relative">
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
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 flex-shrink-0">
          {showSearch && <GlobalSearch onClose={() => setSearchOpen(false)} />}
          <div className="flex items-center gap-3 ml-auto">
            <NotificationBell />
            <div className="text-sm text-gray-600">
              Hi, <span className="font-semibold text-gray-900">{user?.name?.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
