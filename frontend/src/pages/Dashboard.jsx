import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboard } from '../api/client';
import { Users, Flame, DollarSign, GitBranch, CheckSquare, AlertCircle, TrendingUp, Activity, Phone, Mail, MessageSquare, FileText, Eye } from 'lucide-react';

const activityIcon = { call:<Phone size={13}/>, sms:<MessageSquare size={13}/>, email:<Mail size={13}/>, note:<FileText size={13}/>, property_view:<Eye size={13}/>, docusign:<FileText size={13}/>, status_change:<Activity size={13}/> };
const activityColor = { call:'bg-blue-100 text-blue-600', sms:'bg-green-100 text-green-600', email:'bg-purple-100 text-purple-600', note:'bg-yellow-100 text-yellow-600', property_view:'bg-indigo-100 text-indigo-600', docusign:'bg-orange-100 text-orange-600', status_change:'bg-gray-100 text-gray-600' };

function StatCard({ icon: Icon, label, value, sub, color = 'blue', trend }) {
  const colors = { blue:'bg-blue-50 text-blue-600', green:'bg-green-50 text-green-600', red:'bg-red-50 text-red-600', amber:'bg-amber-50 text-amber-600', purple:'bg-purple-50 text-purple-600' };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      {trend && <div className="flex items-center gap-1 mt-3 text-xs text-green-600 font-medium"><TrendingUp size={12}/>{trend}</div>}
    </div>
  );
}

const sourceColors = ['bg-blue-500','bg-green-500','bg-purple-500','bg-amber-500','bg-red-500','bg-indigo-500','bg-pink-500'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboard.get().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"/></div>;
  if (!data) return <div className="p-8 text-red-500">Failed to load dashboard</div>;

  const { stats, charts, recentActivities, topAgents } = data;
  const totalLeadsBySource = charts.leadsBySource.reduce((a, b) => a + b.count, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back, Sarah. Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}       label="Total Leads"       value={stats.totalLeads.toLocaleString()} sub={`+${stats.newLeadsThisMonth} this month`} color="blue" trend="+12% vs last month" />
        <StatCard icon={Flame}       label="Hot Leads"         value={stats.hotLeads}    sub="Need immediate follow-up" color="red" />
        <StatCard icon={GitBranch}   label="Active Pipeline"   value={stats.activePipeline} sub={`${stats.underContract} under contract`} color="purple" />
        <StatCard icon={DollarSign}  label="Pipeline Value"    value={`$${Math.round(stats.pipelineValue/1000)}K`} sub="Est. commission" color="green" trend="Commission potential" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={CheckSquare} label="Tasks Due Today"   value={stats.tasksDueToday} sub="Open items" color="amber" />
        <StatCard icon={AlertCircle} label="Overdue Tasks"     value={stats.overdueTasksCount} sub="Require attention" color="red" />
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-3 gap-6">
        {/* Lead Sources */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Lead Sources</h2>
          <div className="space-y-3">
            {charts.leadsBySource.map((s, i) => {
              const pct = Math.round((s.count / totalLeadsBySource) * 100);
              return (
                <div key={s.source}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className="font-medium">{s.source}</span>
                    <span>{s.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${sourceColors[i % sourceColors.length]} rounded-full`} style={{ width:`${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Status */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Lead Status Breakdown</h2>
          <div className="space-y-2">
            {charts.leadsByStatus.map(s => {
              const statusColors = { Hot:'text-red-600 bg-red-50', New:'text-gray-600 bg-gray-50', Contacted:'text-blue-600 bg-blue-50', Nurturing:'text-amber-600 bg-amber-50', 'Under Contract':'text-purple-600 bg-purple-50', Closed:'text-green-600 bg-green-50', Lost:'text-gray-400 bg-gray-50' };
              return (
                <div key={s.status} className="flex items-center justify-between">
                  <span className={`badge ${statusColors[s.status] || 'text-gray-600 bg-gray-50'}`}>{s.status}</span>
                  <span className="text-sm font-semibold text-gray-900">{s.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Agents */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Top Agents</h2>
          <div className="space-y-3">
            {topAgents.map((agent, i) => (
              <div key={agent.id} className="flex items-center gap-3">
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {agent.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{agent.name}</div>
                  <div className="text-xs text-gray-500">{agent._count.leads} leads · {agent._count.deals} deals</div>
                </div>
                <div className="text-xs font-medium text-blue-600 flex-shrink-0">
                  ${Math.round(agent.capCurrent / 1000)}K CAP
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
          <span className="text-xs text-gray-400">Live feed</span>
        </div>
        <div className="space-y-3">
          {recentActivities.map(act => (
            <div key={act.id} className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${activityColor[act.type] || 'bg-gray-100 text-gray-600'}`}>
                {activityIcon[act.type] || <Activity size={13}/>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">
                  <Link to={`/leads/${act.lead?.id}`} className="font-medium text-blue-600 hover:underline">
                    {act.lead?.firstName} {act.lead?.lastName}
                  </Link>
                  {' — '}{act.description}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {act.agent?.name} · {new Date(act.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                </p>
              </div>
              {act.outcome && <span className="badge bg-gray-100 text-gray-600 flex-shrink-0">{act.outcome}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
