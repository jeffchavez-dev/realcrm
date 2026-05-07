import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { leads as leadsApi, integrations as intApi } from '../api/client';
import { ArrowLeft, Phone, Mail, MessageSquare, FileText, Eye, Activity, CheckSquare, Home, Bell, Flame, Thermometer, Snowflake, DollarSign, Calendar, Tag, Edit3 } from 'lucide-react';

const typeIcon = { call:<Phone size={13}/>, sms:<MessageSquare size={13}/>, email:<Mail size={13}/>, note:<FileText size={13}/>, property_view:<Eye size={13}/>, docusign:<FileText size={13}/>, status_change:<Activity size={13}/> };
const typeStyle = { call:'bg-blue-100 text-blue-600', sms:'bg-green-100 text-green-600', email:'bg-purple-100 text-purple-600', note:'bg-yellow-100 text-yellow-600', property_view:'bg-indigo-100 text-indigo-600', docusign:'bg-orange-100 text-orange-600', status_change:'bg-gray-100 text-gray-600' };
const tempStyle = { Hot:'bg-red-100 text-red-700', Warm:'bg-amber-100 text-amber-700', Cold:'bg-blue-100 text-blue-700' };
const tempIcon = { Hot:<Flame size={11}/>, Warm:<Thermometer size={11}/>, Cold:<Snowflake size={11}/> };

function timeAgo(date) {
  if (!date) return 'Never contacted';
  const diff = Math.floor((new Date() - new Date(date)) / 86400000);
  if (diff === 0) return 'Contacted today';
  if (diff === 1) return '1 day ago';
  return `${diff} days ago`;
}

export default function LeadProfile() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activity');
  const [smsText, setSmsText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [sending, setSending] = useState(false);

  const reload = () => leadsApi.get(id).then(setLead).finally(() => setLoading(false));
  useEffect(() => { reload(); }, [id]);

  const sendSMS = async () => {
    if (!smsText.trim()) return;
    setSending(true);
    await intApi.sendSMS({ to: lead.phone, message: smsText, leadId: id, agentId: lead.agentId });
    setSmsText('');
    await reload();
    setSending(false);
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    setSending(true);
    await leadsApi.logActivity(id, { type: 'note', description: noteText, agentId: lead.agentId });
    setNoteText('');
    await reload();
    setSending(false);
  };

  const sendDocSign = async () => {
    setSending(true);
    await intApi.sendDocSign({ leadId: id, agentId: lead.agentId, documentType: 'Purchase Agreement', recipientEmail: lead.email, recipientName: `${lead.firstName} ${lead.lastName}` });
    await reload();
    setSending(false);
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"/></div>;
  if (!lead) return <div className="p-8 text-red-500">Lead not found</div>;

  const score = lead.score;
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-gray-500';

  return (
    <div className="p-6">
      {/* Back */}
      <Link to="/leads" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-5 w-fit">
        <ArrowLeft size={15}/>Back to Leads
      </Link>

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT: Profile */}
        <div className="space-y-4">
          {/* Identity card */}
          <div className="card p-5">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {lead.firstName[0]}{lead.lastName[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-gray-900">{lead.firstName} {lead.lastName}</h1>
                  <span className={`badge ${tempStyle[lead.temperature]} gap-1`}>{tempIcon[lead.temperature]}{lead.temperature}</span>
                </div>
                <p className="text-sm text-gray-500">{lead.source}</p>
                <div className={`text-2xl font-bold mt-1 ${scoreColor}`}>{score}<span className="text-sm font-normal text-gray-400">/100</span></div>
                <p className="text-xs text-gray-400">AI Lead Score</p>
              </div>
            </div>

            <div className="space-y-2.5 text-sm">
              {lead.phone && <div className="flex items-center gap-2 text-gray-700"><Phone size={14} className="text-gray-400"/>{lead.phone}</div>}
              {lead.email && <div className="flex items-center gap-2 text-gray-700"><Mail size={14} className="text-gray-400"/>{lead.email}</div>}
              <div className="flex items-center gap-2 text-gray-700"><Calendar size={14} className="text-gray-400"/>{timeAgo(lead.lastContact)}</div>
              {lead.budget && <div className="flex items-center gap-2 text-gray-700"><DollarSign size={14} className="text-gray-400"/>Budget: ${lead.budget.toLocaleString()}</div>}
              {lead.timeline && <div className="flex items-center gap-2 text-gray-700"><Calendar size={14} className="text-gray-400"/>Timeline: {lead.timeline}</div>}
              {lead.preApproved && <div className="flex items-center gap-2"><span className="badge bg-green-100 text-green-700">✓ Pre-Approved</span></div>}
            </div>

            {lead.tags && (
              <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-100">
                <Tag size={12} className="text-gray-400 mt-0.5"/>
                {lead.tags.split(',').map(t => (
                  <span key={t} className="badge bg-gray-100 text-gray-600 text-[11px]">{t.trim()}</span>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Assigned Agent</p>
              {lead.assignedTo ? (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {lead.assignedTo.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{lead.assignedTo.name}</p>
                    <p className="text-xs text-gray-500">{lead.assignedTo.role}</p>
                  </div>
                </div>
              ) : <p className="text-sm text-gray-400">Unassigned</p>}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-primary flex items-center justify-center gap-1.5 text-xs py-2"><Phone size={13}/>Call</button>
              <button className="btn-secondary flex items-center justify-center gap-1.5 text-xs py-2"><Mail size={13}/>Email</button>
              <button onClick={sendDocSign} disabled={sending} className="btn-secondary flex items-center justify-center gap-1.5 text-xs py-2 col-span-2">
                <FileText size={13}/>Send DocuSign
              </button>
            </div>
          </div>

          {/* E-Alerts */}
          {lead.alerts?.length > 0 && (
            <div className="card p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Bell size={12}/>E-Alerts ({lead.alerts.length} active)
              </p>
              {lead.alerts.map(a => (
                <div key={a.id} className="text-xs text-gray-700 bg-blue-50 rounded-lg p-2.5 mb-2">
                  <p className="font-medium text-blue-800">{a.name}</p>
                  <p className="text-blue-600 mt-0.5">{a.city} · {a.minPrice ? `$${(a.minPrice/1000).toFixed(0)}K` : ''}–{a.maxPrice ? `$${(a.maxPrice/1000).toFixed(0)}K` : ''} · {a.minBeds}+ BR</p>
                  <p className="text-blue-500 mt-0.5">{a.frequency} · {a.active ? '✓ Active' : '✗ Paused'}</p>
                </div>
              ))}
            </div>
          )}

          {/* Saved Properties */}
          {lead.properties?.length > 0 && (
            <div className="card p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Home size={12}/>Saved Properties
              </p>
              {lead.properties.map(p => (
                <div key={p.id} className="border border-gray-100 rounded-lg p-3 mb-2 text-xs">
                  <p className="font-medium text-gray-900">{p.address}</p>
                  <p className="text-gray-500">{p.city}, {p.state} {p.zip}</p>
                  <div className="flex items-center gap-2 mt-1 text-gray-600">
                    <span>${p.price?.toLocaleString()}</span>·
                    <span>{p.beds}bd</span>·
                    <span>{p.baths}ba</span>·
                    <span>{p.sqft?.toLocaleString()} sqft</span>
                  </div>
                  <span className={`badge mt-1 ${p.status==='Active'?'bg-green-100 text-green-700':p.status==='Pending'?'bg-amber-100 text-amber-700':'bg-gray-100 text-gray-600'}`}>{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Activity + Tabs */}
        <div className="col-span-2 space-y-4">
          {/* Quick compose */}
          <div className="card p-4">
            <div className="flex gap-2 mb-3">
              {['activity','tasks','deals'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize ${activeTab===t ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  {t}
                </button>
              ))}
            </div>

            {/* SMS Compose */}
            <div className="flex gap-2 mb-2">
              <input value={smsText} onChange={e => setSmsText(e.target.value)} placeholder="Send SMS..." className="input flex-1 text-sm"/>
              <button onClick={sendSMS} disabled={sending || !smsText} className="btn-primary flex items-center gap-1.5"><MessageSquare size={14}/>Send</button>
            </div>
            <div className="flex gap-2">
              <input value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add a note..." className="input flex-1 text-sm"/>
              <button onClick={addNote} disabled={sending || !noteText} className="btn-secondary flex items-center gap-1.5"><FileText size={14}/>Note</button>
            </div>
          </div>

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Activity Timeline</h2>
              <div className="relative">
                <div className="absolute left-[18px] top-0 bottom-0 w-px bg-gray-200"/>
                <div className="space-y-4">
                  {lead.activities?.map(act => (
                    <div key={act.id} className="flex gap-4 relative">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${typeStyle[act.type] || 'bg-gray-100 text-gray-600'}`}>
                        {typeIcon[act.type] || <Activity size={13}/>}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-3 -mt-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm text-gray-800">{act.description}</p>
                            {act.outcome && <span className="badge bg-white border border-gray-200 text-gray-600 mt-1">{act.outcome}</span>}
                            {act.duration && <span className="badge bg-white border border-gray-200 text-gray-600 mt-1 ml-1">{Math.floor(act.duration/60)}m {act.duration%60}s</span>}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">{new Date(act.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' })}</p>
                      </div>
                    </div>
                  ))}
                  {(!lead.activities || lead.activities.length === 0) && <p className="text-sm text-gray-400 pl-12">No activities yet</p>}
                </div>
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Tasks</h2>
              {lead.tasks?.length === 0 ? <p className="text-sm text-gray-400">No tasks</p> : lead.tasks?.map(task => (
                <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border mb-2 ${task.completed ? 'border-gray-100 bg-gray-50' : 'border-gray-200 bg-white'}`}>
                  <div className={`w-4 h-4 rounded border mt-0.5 flex-shrink-0 ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                    {task.completed && <svg viewBox="0 0 12 12" fill="white"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" fill="none"/></svg>}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>{task.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month:'short', day:'numeric' }) : 'No due date'} · {task.agent?.name}</p>
                  </div>
                  <span className={`badge text-xs ${task.priority==='Urgent'?'bg-red-100 text-red-700':task.priority==='High'?'bg-amber-100 text-amber-700':'bg-gray-100 text-gray-600'}`}>{task.priority}</span>
                </div>
              ))}
            </div>
          )}

          {/* Deals Tab */}
          {activeTab === 'deals' && (
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Pipeline Deals</h2>
              {lead.deals?.length === 0 ? <p className="text-sm text-gray-400">No deals in pipeline</p> : lead.deals?.map(deal => (
                <div key={deal.id} className="border border-gray-200 rounded-xl p-4 mb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="badge bg-purple-100 text-purple-700 mb-2">{deal.stage}</span>
                      {deal.propertyAddress && <p className="text-sm font-medium text-gray-900">{deal.propertyAddress}</p>}
                      {deal.mlsId && <p className="text-xs text-gray-400">MLS# {deal.mlsId}</p>}
                    </div>
                    <div className="text-right">
                      {deal.value && <p className="text-base font-bold text-gray-900">${deal.value.toLocaleString()}</p>}
                      {deal.commission && <p className="text-xs text-green-600">${deal.commission.toLocaleString()} commission</p>}
                    </div>
                  </div>
                  {deal.closeDate && <p className="text-xs text-gray-400 mt-2">Target close: {new Date(deal.closeDate).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
