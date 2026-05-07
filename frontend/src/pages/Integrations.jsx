import React, { useEffect, useState } from 'react';
import { integrations as intApi } from '../api/client';
import { CheckCircle, XCircle, AlertCircle, Search, Phone, FileText, BarChart2, Zap, ExternalLink } from 'lucide-react';

const icons = { mls:<Search size={22}/>, twilio:<Phone size={22}/>, docusign:<FileText size={22}/>, google_ads:<BarChart2 size={22}/> };
const iconColors = { mls:'text-blue-600 bg-blue-50', twilio:'text-red-600 bg-red-50', docusign:'text-yellow-600 bg-yellow-50', google_ads:'text-green-600 bg-green-50' };
const docs = {
  mls:        { url:'https://www.realtna.com/docs', label:'RealTNA API Docs', envKey:'MLS_API_KEY', guide:'Get API key from RealTNA or Real Savvy dashboard → Integrations → API Access' },
  twilio:     { url:'https://console.twilio.com', label:'Twilio Console', envKey:'TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN', guide:'Create free Twilio account → get Account SID and Auth Token → buy a phone number' },
  docusign:   { url:'https://developers.docusign.com', label:'DocuSign Developer', envKey:'DOCUSIGN_INTEGRATION_KEY', guide:'Create DocuSign developer account → Apps & Keys → Add App → copy Integration Key' },
  google_ads: { url:'https://ads.google.com/aw/apicenter', label:'Google Ads API', envKey:'GOOGLE_ADS_CUSTOMER_ID', guide:'Enable Google Ads API → create developer token → link to your Ads account' },
};

const capabilities = {
  mls:        ['Live MLS property search','Property detail pages per lead','Automated e-alert delivery','New listing notifications','Behavioral tracking (property views)'],
  twilio:     ['Click-to-call from lead profile','Outbound SMS campaigns','Inbound SMS routing','Call recording & transcription','AI Nurture text sequences'],
  docusign:   ['Send purchase agreements','Buyer representation agreements','Listing agreements','E-sign status tracking in CRM','Audit trail per transaction'],
  google_ads: ['Lead source attribution','Cost-per-lead tracking','Campaign ROI by source','Auto-tag lead records from PPC','Conversion reporting'],
};

function MlsSearch() {
  const [params, setParams] = useState({ city:'Bethesda', minPrice:'500000', maxPrice:'750000', minBeds:'3' });
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const search = async () => {
    setSearching(true);
    const data = await intApi.mlsSearch(params);
    setResults(data.listings || []);
    setSearching(false);
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Test MLS Search</p>
      <div className="grid grid-cols-4 gap-2 mb-3">
        <input className="input text-sm" placeholder="City" value={params.city} onChange={e => setParams(p=>({...p,city:e.target.value}))}/>
        <input className="input text-sm" placeholder="Min Price" value={params.minPrice} onChange={e => setParams(p=>({...p,minPrice:e.target.value}))}/>
        <input className="input text-sm" placeholder="Max Price" value={params.maxPrice} onChange={e => setParams(p=>({...p,maxPrice:e.target.value}))}/>
        <input className="input text-sm" placeholder="Min Beds" value={params.minBeds} onChange={e => setParams(p=>({...p,minBeds:e.target.value}))}/>
      </div>
      <button onClick={search} disabled={searching} className="btn-primary flex items-center gap-2 mb-3">
        <Search size={14}/>{searching ? 'Searching...' : 'Search MLS (Sample Data)'}
      </button>
      {results.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {results.map(l => (
            <div key={l.mlsId} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs">
              <p className="font-bold text-gray-900 text-sm">{l.address}</p>
              <p className="text-gray-500">{l.city}, {l.state} {l.zip}</p>
              <div className="flex gap-2 mt-1 text-gray-700">
                <span className="font-bold text-blue-700">${l.price?.toLocaleString()}</span>·
                <span>{l.beds}bd</span>·<span>{l.baths}ba</span>·<span>{l.sqft?.toLocaleString()} sqft</span>
              </div>
              <p className="text-gray-400 mt-1">MLS# {l.mlsId} · {l.daysOnMarket} DOM</p>
              <span className="badge bg-green-100 text-green-700 mt-1">{l.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Integrations() {
  const [intList, setIntList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [toggling, setToggling] = useState(null);

  useEffect(() => { intApi.list().then(setIntList).finally(() => setLoading(false)); }, []);

  const toggle = async (name, currentStatus) => {
    setToggling(name);
    const newStatus = currentStatus === 'connected' ? 'disconnected' : 'connected';
    const updated = await intApi.setStatus(name, newStatus);
    setIntList(l => l.map(i => i.name === name ? updated : i));
    setToggling(null);
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"/></div>;

  const connected = intList.filter(i => i.status === 'connected').length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Integrations</h1>
          <p className="text-sm text-gray-500">{connected} of {intList.length} connected</p>
        </div>
        <div className={`badge text-sm px-3 py-1.5 ${connected === intList.length ? 'bg-green-100 text-green-700' : connected > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
          <Zap size={14} className="mr-1"/>
          {connected === intList.length ? 'All Connected' : `${connected}/${intList.length} Active`}
        </div>
      </div>

      {/* Architecture note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
        <p className="font-semibold mb-1">🔌 Integration Architecture</p>
        <p>All integrations are API-first and production-ready. Add your API keys to <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs font-mono">backend/.env</code> to activate. No third-party middleware required — all calls go directly from RealCRM to the provider API.</p>
      </div>

      <div className="space-y-4">
        {intList.map(int => {
          const isExp = expanded === int.name;
          const doc = docs[int.name];
          return (
            <div key={int.id} className="card overflow-hidden">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColors[int.name] || 'bg-gray-50 text-gray-600'}`}>
                    {icons[int.name] || <Zap size={22}/>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-base font-bold text-gray-900">{int.label}</h2>
                      <span className={`badge gap-1 ${int.status === 'connected' ? 'bg-green-100 text-green-700' : int.status === 'error' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                        {int.status === 'connected' ? <CheckCircle size={11}/> : int.status === 'error' ? <AlertCircle size={11}/> : <XCircle size={11}/>}
                        {int.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(capabilities[int.name] || []).slice(0,3).map(cap => (
                        <span key={cap} className="badge bg-gray-100 text-gray-600 text-[11px]">{cap}</span>
                      ))}
                      {(capabilities[int.name] || []).length > 3 && (
                        <span className="badge bg-gray-100 text-gray-500 text-[11px]">+{(capabilities[int.name] || []).length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {doc && (
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center gap-1 text-xs py-1.5">
                        <ExternalLink size={11}/>Docs
                      </a>
                    )}
                    <button onClick={() => setExpanded(isExp ? null : int.name)} className="btn-secondary text-xs py-1.5">
                      {isExp ? 'Collapse' : 'Details'}
                    </button>
                    <button onClick={() => toggle(int.name, int.status)} disabled={toggling === int.name}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${int.status === 'connected' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                      {toggling === int.name ? '...' : int.status === 'connected' ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>

                {isExp && (
                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">All Capabilities</p>
                      <ul className="space-y-1.5">
                        {(capabilities[int.name] || []).map(cap => (
                          <li key={cap} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle size={13} className="text-green-500 flex-shrink-0"/>
                            {cap}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Setup Instructions</p>
                      <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-700">
                        <p className="font-medium mb-1">ENV Key: <code className="font-mono bg-gray-200 px-1 rounded">{doc?.envKey}</code></p>
                        <p className="text-gray-600">{doc?.guide}</p>
                      </div>

                      {int.lastSync && (
                        <p className="text-xs text-gray-400 mt-2">Last sync: {new Date(int.lastSync).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* MLS Test Panel */}
                {isExp && int.name === 'mls' && <MlsSearch/>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
