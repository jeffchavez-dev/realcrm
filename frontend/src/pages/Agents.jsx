import React, { useEffect, useState } from 'react';
import { agents as agentsApi } from '../api/client';
import { Users, Briefcase, Activity, DollarSign, CheckSquare } from 'lucide-react';

const roleColors = { Manager:'bg-purple-100 text-purple-700', Agent:'bg-blue-100 text-blue-700', ISA:'bg-green-100 text-green-700', Admin:'bg-gray-100 text-gray-700' };

function CapBar({ current, limit }) {
  const pct = Math.min(100, Math.round((current / limit) * 100));
  const color = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-blue-500' : 'bg-gray-300';
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>CAP Progress</span>
        <span>${(current/1000).toFixed(1)}K / ${(limit/1000).toFixed(0)}K ({pct}%)</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width:`${pct}%` }}/>
      </div>
    </div>
  );
}

export default function Agents() {
  const [agentList, setAgentList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { agentsApi.list().then(setAgentList).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"/></div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agents</h1>
          <p className="text-sm text-gray-500">{agentList.length} team members</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Users size={15}/>Add Agent</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{agentList.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Agents</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{agentList.reduce((a,b) => a + b._count.leads, 0)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Leads Assigned</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{agentList.reduce((a,b) => a + b._count.deals, 0)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Active Deals</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">${(agentList.reduce((a,b) => a + b.capCurrent, 0)/1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-500 mt-0.5">Total CAP Collected</p>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-2 gap-4">
        {agentList.map(agent => (
          <div key={agent.id} className="card p-5">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                {agent.name.split(' ').map(n=>n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-900">{agent.name}</h2>
                  <span className={`badge ${roleColors[agent.role] || 'bg-gray-100 text-gray-700'}`}>{agent.role}</span>
                </div>
                <p className="text-sm text-gray-500">{agent.email}</p>
                {agent.phone && <p className="text-xs text-gray-400">{agent.phone}</p>}
              </div>
              <span className={`badge ${agent.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {agent.status}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center bg-gray-50 rounded-lg py-2">
                <p className="text-lg font-bold text-gray-900">{agent._count.leads}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Leads</p>
              </div>
              <div className="text-center bg-gray-50 rounded-lg py-2">
                <p className="text-lg font-bold text-gray-900">{agent._count.deals}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Deals</p>
              </div>
              <div className="text-center bg-gray-50 rounded-lg py-2">
                <p className="text-lg font-bold text-gray-900">{agent._count.activities}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Activities</p>
              </div>
            </div>

            {/* CAP */}
            <CapBar current={agent.capCurrent} limit={agent.capLimit} />
          </div>
        ))}
      </div>
    </div>
  );
}
