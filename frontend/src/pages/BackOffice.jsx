import React, { useState } from 'react';
import { FileText, Send, CheckCircle, Clock, AlertCircle, PenTool, Download, Eye, User } from 'lucide-react';

const TEMPLATES = [
  { id: 'purchase',   name: 'Purchase Agreement',        pages: 12, category: 'Transaction', description: 'Standard residential purchase and sale agreement with contingencies.' },
  { id: 'listing',    name: 'Listing Agreement',          pages: 8,  category: 'Listing',     description: 'Exclusive right-to-sell listing agreement with commission terms.' },
  { id: 'buyer-rep',  name: 'Buyer Representation',       pages: 5,  category: 'Buyer',       description: 'Buyer agency agreement establishing representation terms.' },
  { id: 'disclosure', name: 'Seller Disclosure',          pages: 6,  category: 'Disclosure',  description: 'Maryland/Virginia residential property disclosure form.' },
  { id: 'addendum',   name: 'Contract Addendum',          pages: 3,  category: 'Transaction', description: 'General addendum for modifying contract terms.' },
  { id: 'lease',      name: 'Lease Agreement (1 Year)',   pages: 14, category: 'Rental',      description: 'Residential lease agreement with standard clauses.' },
];

const CATEGORY_COLORS = {
  Transaction: 'bg-blue-50 text-blue-700',
  Listing:     'bg-purple-50 text-purple-700',
  Buyer:       'bg-green-50 text-green-700',
  Disclosure:  'bg-orange-50 text-orange-700',
  Rental:      'bg-teal-50 text-teal-700',
};

const STATUS_CONFIG = {
  sent:      { label: 'Awaiting Signature', icon: Clock,       color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  signed:    { label: 'Completed',          icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200' },
  declined:  { label: 'Declined',           icon: AlertCircle, color: 'text-red-600 bg-red-50 border-red-200' },
  draft:     { label: 'Draft',              icon: FileText,    color: 'text-gray-600 bg-gray-50 border-gray-200' },
};

const DEMO_ACTIVITY = [
  { id:1, doc:'Purchase Agreement', recipient:'Marcus Thompson', email:'m.thompson@email.com', status:'signed',   sent:'2026-05-06', completed:'2026-05-07', envelope:'ENV-2026-0412' },
  { id:2, doc:'Listing Agreement',  recipient:'Sandra Williams', email:'s.williams@email.com', status:'sent',     sent:'2026-05-07', completed:null,          envelope:'ENV-2026-0413' },
  { id:3, doc:'Buyer Representation',recipient:'James & Carol Lee',email:'jclee@email.com',   status:'signed',   sent:'2026-05-05', completed:'2026-05-05', envelope:'ENV-2026-0410' },
  { id:4, doc:'Seller Disclosure',  recipient:'Robert Martinez',  email:'r.martinez@email.com',status:'sent',     sent:'2026-05-08', completed:null,          envelope:'ENV-2026-0414' },
  { id:5, doc:'Contract Addendum',  recipient:'Emily Davis',      email:'e.davis@email.com',   status:'signed',   sent:'2026-05-04', completed:'2026-05-04', envelope:'ENV-2026-0408' },
];

export default function BackOffice() {
  const [selected, setSelected] = useState(null);
  const [recipient, setRecipient] = useState({ name:'', email:'' });
  const [sending, setSending]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [activity, setActivity] = useState(DEMO_ACTIVITY);
  const [activeTab, setActiveTab] = useState('templates');

  const handleSend = async () => {
    if (!selected || !recipient.name || !recipient.email) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1800));
    const newEnv = {
      id: activity.length + 1,
      doc: TEMPLATES.find(t => t.id === selected)?.name,
      recipient: recipient.name,
      email: recipient.email,
      status: 'sent',
      sent: new Date().toISOString().split('T')[0],
      completed: null,
      envelope: 'ENV-2026-0' + (415 + activity.length),
    };
    setActivity(a => [newEnv, ...a]);
    setSending(false);
    setSent(true);
    setTimeout(() => { setSent(false); setSelected(null); setRecipient({ name:'', email:'' }); }, 3000);
  };

  const stats = {
    total:   activity.length,
    signed:  activity.filter(a => a.status === 'sent').length,
    completed: activity.filter(a => a.status === 'signed').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Back Office · E-Sign</h1>
            <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"/>
              DocuSign Ready
            </span>
          </div>
          <p className="text-sm text-gray-500">Send, track and manage real estate documents for e-signature</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
          <PenTool size={16} className="text-yellow-500"/>
          <div>
            <p className="text-xs font-bold text-gray-800">DocuSign</p>
            <p className="text-[10px] text-gray-400">E-Signature Platform</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Total Sent', value: stats.total, icon: Send, color:'blue' },
          { label:'Awaiting Signature', value: stats.signed, icon: Clock, color:'yellow' },
          { label:'Completed', value: stats.completed, icon: CheckCircle, color:'green' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${color}-50`}>
              <Icon size={18} className={`text-${color}-600`}/>
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[['templates','Document Templates'],['activity','Activity Log']].map(([k,l]) => (
          <button key={k} onClick={() => setActiveTab(k)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab===k ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {l}
          </button>
        ))}
      </div>

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template List */}
          <div className="lg:col-span-2 space-y-3">
            {TEMPLATES.map(t => (
              <div key={t.id} onClick={() => { setSelected(t.id); setSent(false); }}
                className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-sm ${selected===t.id ? 'border-blue-500 shadow-sm' : 'border-gray-200'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${selected===t.id ? 'bg-blue-600' : 'bg-gray-100'}`}>
                    <FileText size={18} className={selected===t.id ? 'text-white' : 'text-gray-500'}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[t.category]}`}>{t.category}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{t.description}</p>
                    <p className="text-xs text-gray-400">{t.pages} pages · PDF</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Preview">
                      <Eye size={14}/>
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Download">
                      <Download size={14}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Send Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Send size={16} className="text-blue-600"/> Send for Signature
              </h3>

              {!selected ? (
                <div className="text-center py-8 text-gray-400">
                  <FileText size={32} className="mx-auto mb-2 opacity-40"/>
                  <p className="text-sm">Select a document template to send</p>
                </div>
              ) : sent ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle size={28} className="text-green-600"/>
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">Envelope Sent!</p>
                  <p className="text-xs text-gray-500">{recipient.name} will receive a DocuSign email shortly</p>
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 rounded-xl p-3 mb-4">
                    <p className="text-xs font-semibold text-blue-700 mb-0.5">Selected Document</p>
                    <p className="text-sm font-medium text-blue-900">{TEMPLATES.find(t=>t.id===selected)?.name}</p>
                    <p className="text-xs text-blue-600">{TEMPLATES.find(t=>t.id===selected)?.pages} pages</p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Recipient Name</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input value={recipient.name} onChange={e => setRecipient(r=>({...r,name:e.target.value}))}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Client full name"/>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Email Address</label>
                      <div className="relative">
                        <Send size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input type="email" value={recipient.email} onChange={e => setRecipient(r=>({...r,email:e.target.value}))}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="client@email.com"/>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleSend} disabled={sending || !recipient.name || !recipient.email}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {sending ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Sending via DocuSign...</>
                    ) : (
                      <><PenTool size={15}/> Send for E-Signature</>
                    )}
                  </button>

                  <p className="text-[10px] text-gray-400 text-center mt-3">
                    Powered by DocuSign · Legally binding e-signature
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Document','Recipient','Status','Date Sent','Envelope ID'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activity.map(a => {
                const cfg = STATUS_CONFIG[a.status];
                const Icon = cfg.icon;
                return (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-gray-400"/>
                        <span className="text-sm font-medium text-gray-900">{a.doc}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-900">{a.recipient}</p>
                      <p className="text-xs text-gray-400">{a.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                        <Icon size={11}/> {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{a.sent}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{a.envelope}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
