import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { leads as leadsApi, agents as agentsApi } from '../api/client';
import { Search, Filter, Plus, ChevronRight, Flame, Thermometer, Snowflake, Phone, Mail, Clock, X, User, DollarSign, MapPin, Tag } from 'lucide-react';

const tempIcon  = { Hot:<Flame size={12}/>, Warm:<Thermometer size={12}/>, Cold:<Snowflake size={12}/> };
const tempStyle = { Hot:'bg-red-100 text-red-700', Warm:'bg-amber-100 text-amber-700', Cold:'bg-blue-100 text-blue-700' };
const statusStyle = { New:'bg-gray-100 text-gray-700', Contacted:'bg-blue-100 text-blue-700', Nurturing:'bg-amber-100 text-amber-700', Hot:'bg-red-100 text-red-700', 'Under Contract':'bg-purple-100 text-purple-700', Closed:'bg-green-100 text-green-700', Lost:'bg-gray-200 text-gray-500' };
const sources  = ['Google PPC','Facebook','Upnest','Homelight','FastExpert','Referral','Sphere','Zillow','Realtor.com'];
const statuses = ['New','Contacted','Nurturing','Hot','Under Contract','Closed','Lost'];

function ScoreBadge({ score }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-gray-400';
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width:`${score}%` }} />
      </div>
      <span className="text-xs text-gray-600 font-medium">{score}</span>
    </div>
  );
}

function timeAgo(date) {
  if (!date) return 'Never';
  const d = new Date(date), now = new Date();
  const diff = Math.floor((now - d) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return '1 day ago';
  return `${diff} days ago`;
}

function AddLeadModal({ onClose, onSaved, agents }) {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', source:'Google PPC', status:'New', temperature:'Warm', budget:'', city:'', notes:'' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName) { setError('First and last name required'); return; }
    setSaving(true);
    try {
      await leadsApi.create({ ...form, budget: form.budget ? Number(form.budget) : null });
      onSaved();
      onClose();
    } catch(err) {
      setError(typeof err === 'string' ? err : 'Failed to create lead');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Add New Lead</h2>
            <p className="text-xs text-gray-400 mt-0.5">Enter lead information below</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">First Name *</label>
              <div className="relative"><User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input value={form.firstName} onChange={e => set('firstName', e.target.value)} className="input pl-9" placeholder="Jane" required/>
              </div>
            </div>
            <div>
              <label className="label">Last Name *</label>
              <input value={form.lastName} onChange={e => set('lastName', e.target.value)} className="input" placeholder="Smith" required/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Email</label>
              <div className="relative"><Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="input pl-9" placeholder="jane@email.com"/>
              </div>
            </div>
            <div>
              <label className="label">Phone</label>
              <div className="relative"><Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input value={form.phone} onChange={e => set('phone', e.target.value)} className="input pl-9" placeholder="+1 (555) 000-0000"/>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Lead Source</label>
              <div className="relative"><Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <select value={form.source} onChange={e => set('source', e.target.value)} className="input pl-9">
                  {sources.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Budget</label>
              <div className="relative"><DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="number" value={form.budget} onChange={e => set('budget', e.target.value)} className="input pl-9" placeholder="650000"/>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className="input">
                {statuses.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Temperature</label>
              <select value={form.temperature} onChange={e => set('temperature', e.target.value)} className="input">
                <option>Hot</option><option>Warm</option><option>Cold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">City / Area of Interest</label>
            <div className="relative"><MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input value={form.city} onChange={e => set('city', e.target.value)} className="input pl-9" placeholder="Bethesda, MD"/>
            </div>
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} className="input resize-none" rows={3} placeholder="Initial notes about this lead..."/>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving...</> : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Leads() {
  const [data, setData]         = useState({ leads: [], total: 0, page: 1, pages: 1 });
  const [agentList, setAgentList] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filters, setFilters]   = useState({ search:'', status:'', source:'', temperature:'' });
  const [page, setPage]         = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  const load = useCallback(() => {
    setLoading(true);
    leadsApi.list({ ...filters, page, limit: 25 })
      .then(setData)
      .finally(() => setLoading(false));
  }, [filters, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { agentsApi.list().then(setAgentList); }, []);

  const setFilter = (k, v) => { setFilters(f => ({ ...f, [k]: v })); setPage(1); };

  return (
    <div className="p-6">
      {showAddModal && (
        <AddLeadModal
          agents={agentList}
          onClose={() => setShowAddModal(false)}
          onSaved={load}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data.total.toLocaleString()} total leads in database</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16}/>Add Lead
        </button>
      </div>

      {/* Search + Filters */}
      <div className="card p-4 mb-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-9" placeholder="Search by name, email, phone..." value={filters.search}
              onChange={e => setFilter('search', e.target.value)} />
          </div>
          <button onClick={() => setShowFilters(f => !f)} className={`btn-secondary flex items-center gap-2 ${(filters.status || filters.source || filters.temperature) ? 'border-blue-400 text-blue-600' : ''}`}>
            <Filter size={15}/>Filters {(filters.status || filters.source || filters.temperature) ? '●' : ''}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-100">
            <div>
              <label className="label">Status</label>
              <select className="input" value={filters.status} onChange={e => setFilter('status', e.target.value)}>
                <option value="">All Statuses</option>
                {statuses.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Source</label>
              <select className="input" value={filters.source} onChange={e => setFilter('source', e.target.value)}>
                <option value="">All Sources</option>
                {sources.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Temperature</label>
              <select className="input" value={filters.temperature} onChange={e => setFilter('temperature', e.target.value)}>
                <option value="">All</option>
                <option>Hot</option><option>Warm</option><option>Cold</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Lead</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Source</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Score</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Agent</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Last Contact</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Budget</th>
              <th className="px-2 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"/>
              </td></tr>
            ) : data.leads.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No leads found</td></tr>
            ) : data.leads.map(lead => (
              <tr key={lead.id}
                onClick={() => navigate(`/leads/${lead.id}`)}
                className="hover:bg-blue-50/40 transition-colors cursor-pointer group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {lead.firstName[0]}{lead.lastName[0]}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-700">{lead.firstName} {lead.lastName}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-2">
                        {lead.email && <span className="flex items-center gap-0.5"><Mail size={10}/>{lead.email}</span>}
                        {lead.phone && <span className="flex items-center gap-0.5"><Phone size={10}/>{lead.phone}</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="badge bg-gray-100 text-gray-700">{lead.source}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`badge ${statusStyle[lead.status] || 'bg-gray-100 text-gray-700'}`}>{lead.status}</span>
                    <span className={`badge ${tempStyle[lead.temperature]}`}>{tempIcon[lead.temperature]}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><ScoreBadge score={lead.score}/></td>
                <td className="px-4 py-3">
                  {lead.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                        {lead.assignedTo.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <span className="text-xs text-gray-700">{lead.assignedTo.name.split(' ')[0]}</span>
                    </div>
                  ) : <span className="text-xs text-gray-400">Unassigned</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1 text-xs ${!lead.lastContact ? 'text-red-500' : 'text-gray-500'}`}>
                    <Clock size={11}/>{timeAgo(lead.lastContact)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {lead.budget ? `$${(lead.budget/1000).toFixed(0)}K` : '—'}
                </td>
                <td className="px-2 py-3">
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors"/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Page {data.page} of {data.pages} · {data.total} total</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="btn-secondary text-xs px-3 py-1.5">Previous</button>
              <button onClick={() => setPage(p => Math.min(data.pages, p+1))} disabled={page === data.pages} className="btn-secondary text-xs px-3 py-1.5">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
