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
            <div className="flex gap-1.5 mb-3 flex-wrap">
              {[
                { key:'activity', label:'Activity' },
                { key:'tasks',    label:'Tasks' },
                { key:'deals',    label:'Pipeline' },
                { key:'buyer',    label:'🏠 Buyer Journey' },
                { key:'seller',   label:'📋 Seller Journey' },
                { key:'ealerts',  label:'🔔 E-Alerts' },
              ].map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab===t.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  {t.label}
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

          {/* Buyer Journey Tab */}
          {activeTab === 'buyer' && <WorkflowTab type="buyer" leadName={`${lead.firstName} ${lead.lastName}`} />}

          {/* Seller Journey Tab */}
          {activeTab === 'seller' && <WorkflowTab type="seller" leadName={`${lead.firstName} ${lead.lastName}`} />}

          {/* E-Alerts Tab */}
          {activeTab === 'ealerts' && <EAlertsTab lead={lead} />}
        </div>
      </div>
    </div>
  );
}

const BUYER_STEPS = [
  { step:1,  title:'Initial Consultation',            desc:'Discuss goals, timeline, must-haves vs. nice-to-haves. Set search criteria.',        tag:'Intake' },
  { step:2,  title:'Pre-Approval',                    desc:'Connect with preferred lender. Obtain pre-approval letter before viewing homes.',     tag:'Finance' },
  { step:3,  title:'Set Up MLS E-Alerts',             desc:'Configure automated property alerts matching buyer criteria. Daily or instant.',       tag:'Search' },
  { step:4,  title:'Property Showings',               desc:'Schedule and conduct property tours. Log feedback per showing.',                       tag:'Search' },
  { step:5,  title:'Home Selection',                  desc:'Buyer selects target property. Pull comps, review disclosures, assess condition.',     tag:'Search' },
  { step:6,  title:'Offer Strategy & Submission',     desc:'Prepare competitive offer with terms, contingencies, and escalation clauses.',         tag:'Offer' },
  { step:7,  title:'Offer Accepted / Negotiation',    desc:'Negotiate terms, counter-offers, and finalize contract price and conditions.',         tag:'Offer' },
  { step:8,  title:'Home Inspection',                 desc:'Schedule inspection within contract window. Review report with buyer.',                tag:'Contract' },
  { step:9,  title:'Appraisal & Financing',           desc:'Lender orders appraisal. Monitor financing contingency deadline.',                    tag:'Contract' },
  { step:10, title:'Final Walk-Through',              desc:'Confirm property condition matches contract terms before closing.',                    tag:'Closing' },
  { step:11, title:'Closing Day',                     desc:'Sign documents, transfer funds, hand over keys. Log activity and update pipeline.',    tag:'Closing' },
  { step:12, title:'Post-Close Follow-Up',            desc:'Check in at 30/60/90 days. Request review. Add to referral nurture campaign.',        tag:'Retention' },
];

const SELLER_STEPS = [
  { step:1,  title:'Listing Consultation',            desc:'Tour home, discuss seller goals, review market conditions and comparable sales.',      tag:'Intake' },
  { step:2,  title:'CMA & Pricing Strategy',          desc:'Prepare Comparative Market Analysis. Present pricing recommendation.',                 tag:'Pricing' },
  { step:3,  title:'Listing Agreement Signed',        desc:'Execute listing agreement via DocuSign. Set commission, terms, and duration.',         tag:'Legal' },
  { step:4,  title:'Pre-Listing Prep',                desc:'Staging consult, repairs, professional photography, floor plan, video tour.',          tag:'Prep' },
  { step:5,  title:'MLS Active — Go Live',            desc:'List on Bright MLS. Syndicate to Zillow, Realtor.com, Homesnap. Launch social ads.',  tag:'Marketing' },
  { step:6,  title:'Showings & Open Houses',          desc:'Coordinate showings via ShowingTime. Host open houses. Collect buyer feedback.',       tag:'Marketing' },
  { step:7,  title:'Offer Review',                    desc:'Review all offers. Advise on price, contingencies, lender strength, closing date.',    tag:'Offer' },
  { step:8,  title:'Under Contract',                  desc:'Execute ratified contract. Notify all parties. Open title order.',                    tag:'Contract' },
  { step:9,  title:'Inspections & Appraisal',         desc:'Manage buyer inspection requests. Monitor appraisal. Handle repair negotiations.',     tag:'Contract' },
  { step:10, title:'Clear to Close',                  desc:'All contingencies removed. Final lender approval received. Coordinate closing.',       tag:'Closing' },
  { step:11, title:'Closing Day',                     desc:'Attend closing. Collect proceeds. Hand over keys. Update pipeline to Closed Won.',     tag:'Closing' },
  { step:12, title:'Post-Sale Nurture',               desc:'Thank you gift, request review, add to past-client nurture campaign.',                 tag:'Retention' },
];

const tagColors = {
  Intake:'bg-gray-100 text-gray-600', Finance:'bg-blue-100 text-blue-700', Search:'bg-indigo-100 text-indigo-700',
  Offer:'bg-amber-100 text-amber-700', Contract:'bg-purple-100 text-purple-700', Closing:'bg-green-100 text-green-700',
  Retention:'bg-pink-100 text-pink-700', Pricing:'bg-cyan-100 text-cyan-700', Legal:'bg-orange-100 text-orange-700',
  Prep:'bg-teal-100 text-teal-700', Marketing:'bg-violet-100 text-violet-700',
};

function WorkflowTab({ type, leadName }) {
  const steps = type === 'buyer' ? BUYER_STEPS : SELLER_STEPS;
  const [completed, setCompleted] = useState(new Set());

  const toggle = (n) => setCompleted(s => {
    const next = new Set(s);
    next.has(n) ? next.delete(n) : next.add(n);
    return next;
  });

  const pct = Math.round((completed.size / steps.length) * 100);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900">
            {type === 'buyer' ? '🏠 Buyer Journey' : '📋 Seller Journey'} — {leadName}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{completed.size} of {steps.length} steps complete</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width:`${pct}%` }}/>
          </div>
          <span className="text-xs font-semibold text-blue-600">{pct}%</span>
        </div>
      </div>

      <div className="space-y-2">
        {steps.map(s => {
          const done = completed.has(s.step);
          return (
            <button key={s.step} onClick={() => toggle(s.step)}
              className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${done ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30'}`}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${done ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                {done && <svg viewBox="0 0 12 12" className="w-3 h-3"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" fill="none"/></svg>}
                {!done && <span className="text-[9px] font-bold text-gray-400">{s.step}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={`text-sm font-semibold ${done ? 'line-through text-gray-400' : 'text-gray-900'}`}>{s.title}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${tagColors[s.tag] || 'bg-gray-100 text-gray-600'}`}>{s.tag}</span>
                </div>
                <p className={`text-xs leading-relaxed ${done ? 'text-gray-400' : 'text-gray-500'}`}>{s.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── E-Alerts Tab ──────────────────────────────────────────────────────────────

const MD_AREAS = ['Hollywood','Lexington Park','California MD','Chaptico','Leonardtown','Prince Frederick','Lusby','Chesapeake Beach','Waldorf','La Plata'];

const SEND_FROM_OPTIONS = [
  { value:'company', label:'Company Email (info@brokerage.com)' },
  { value:'agent',   label:'Assigned Agent Name' },
  { value:'billy',   label:'William Rabbitt (Broker)' },
];

const BLANK_ALERT = { name:'', areas:[], minPrice:'', maxPrice:'', minBeds:'', type:'', frequency:'Daily', sendFrom:'agent', active:true };

function EAlertsTab({ lead }) {
  const seedAlerts = lead.alerts?.length > 0 ? lead.alerts.map((a,i) => ({
    id: i+1, name: a.name || 'Property Search', areas: a.city ? [a.city] : ['Hollywood'],
    minPrice: a.minPrice || 350000, maxPrice: a.maxPrice || 650000,
    minBeds: a.minBeds || 3, type: '', frequency: a.frequency || 'Daily',
    sendFrom: 'agent', active: a.active !== false,
  })) : [
    { id:1, name:'Buyer Search — Primary', areas:['Hollywood','Lexington Park'], minPrice:400000, maxPrice:600000, minBeds:3, type:'Single Family', frequency:'Instant', sendFrom:'agent', active:true },
  ];

  const [alerts, setAlerts]     = useState(seedAlerts);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(BLANK_ALERT);
  const [saved, setSaved]       = useState(false);

  const setField   = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleArea = (area) => setForm(f => ({
    ...f, areas: f.areas.includes(area) ? f.areas.filter(a => a !== area) : [...f.areas, area],
  }));

  const saveAlert = () => {
    if (!form.name || form.areas.length === 0) return;
    setAlerts(a => [...a, { ...form, id: Date.now() }]);
    setForm(BLANK_ALERT);
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleActive = (id) => setAlerts(a => a.map(x => x.id === id ? { ...x, active: !x.active } : x));
  const deleteAlert  = (id) => setAlerts(a => a.filter(x => x.id !== id));

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-900">🔔 E-Alert Subscriptions</h2>
          <p className="text-xs text-gray-400 mt-0.5">Auto-send matching listings to {lead.firstName} via email or SMS</p>
        </div>
        <button onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors">
          + New E-Alert
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-2.5 text-sm">
          <CheckSquare size={15}/> E-Alert activated — {lead.firstName} will receive matching listings.
        </div>
      )}

      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-4">
          <p className="text-sm font-bold text-blue-900">Configure New E-Alert</p>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Alert Name</label>
            <input value={form.name} onChange={e => setField('name', e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Primary Home Search"/>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Target Areas</label>
            <div className="flex flex-wrap gap-2">
              {MD_AREAS.map(area => (
                <button key={area} type="button" onClick={() => toggleArea(area)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${form.areas.includes(area) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                  {area}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Min Price</label>
              <select value={form.minPrice} onChange={e => setField('minPrice', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">No Min</option>
                {[250000,300000,350000,400000,450000,500000,600000].map(p => (
                  <option key={p} value={p}>${(p/1000).toFixed(0)}K</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Max Price</label>
              <select value={form.maxPrice} onChange={e => setField('maxPrice', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">No Max</option>
                {[400000,500000,600000,700000,800000,1000000].map(p => (
                  <option key={p} value={p}>${(p/1000).toFixed(0)}K</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Min Beds</label>
              <select value={form.minBeds} onChange={e => setField('minBeds', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Any</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Type</label>
              <select value={form.type} onChange={e => setField('type', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All</option>
                {['Single Family','Condo','Townhouse','New Construction'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Frequency</label>
              <div className="flex gap-2">
                {['Instant','Daily','Weekly'].map(f => (
                  <button key={f} type="button" onClick={() => setField('frequency', f)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${form.frequency===f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Send From</label>
              <select value={form.sendFrom} onChange={e => setField('sendFrom', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {SEND_FROM_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={saveAlert} disabled={!form.name || form.areas.length === 0}
              className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              ✓ Activate E-Alert
            </button>
            <button onClick={() => { setShowForm(false); setForm(BLANK_ALERT); }}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {alerts.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Bell size={32} className="mx-auto mb-2 opacity-30"/>
            <p className="text-sm">No e-alerts yet. Click "+ New E-Alert" to get started.</p>
          </div>
        )}
        {alerts.map(a => (
          <div key={a.id} className={`rounded-xl border p-4 ${a.active ? 'border-blue-200 bg-blue-50/40' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${a.active ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <Bell size={14} className="text-white"/>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{a.name}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {a.areas.slice(0,3).map(area => (
                      <span key={area} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{area}</span>
                    ))}
                    {a.areas.length > 3 && <span className="text-[10px] text-gray-400">+{a.areas.length-3} more</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    {a.minPrice ? `$${(a.minPrice/1000).toFixed(0)}K` : 'No min'} – {a.maxPrice ? `$${(a.maxPrice/1000).toFixed(0)}K` : 'No max'}
                    {a.minBeds ? ` · ${a.minBeds}+ beds` : ''}
                    {a.type ? ` · ${a.type}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${a.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {a.active ? '● Active' : '○ Paused'}
                </span>
                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{a.frequency}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-100">
              <p className="text-[10px] text-gray-400">
                From: {SEND_FROM_OPTIONS.find(o => o.value === a.sendFrom)?.label}
              </p>
              <div className="flex gap-3">
                <button onClick={() => toggleActive(a.id)} className="text-xs text-blue-600 hover:underline font-medium">
                  {a.active ? 'Pause' : 'Activate'}
                </button>
                <button onClick={() => deleteAlert(a.id)} className="text-xs text-red-500 hover:underline font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
