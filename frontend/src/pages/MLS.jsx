import React, { useState, useEffect } from 'react';
import { Bed, Bath, Square, MapPin, Heart, ExternalLink, SlidersHorizontal, Home, TrendingUp, RefreshCw, X, Search, CheckCircle, Hammer, Clock, ChevronRight } from 'lucide-react';
import { leads as leadsApi } from '../api/client';
import { useNavigate } from 'react-router-dom';

// ── Southern Maryland + Metro DC cities (matching client market) ──────
const CITIES = [
  'Hollywood', 'Lexington Park', 'California', 'Chaptico', 'Leonardtown',
  'Prince Frederick', 'Lusby', 'Chesapeake Beach', 'Waldorf', 'La Plata',
  'Bethesda', 'Chevy Chase', 'Silver Spring', 'Rockville', 'Potomac',
];
const PROPERTY_TYPES = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'New Construction'];

// ── Neighborhood quick-filter cards ──────────────────────────────────
const NEIGHBORHOODS = [
  { name:'Hollywood', county:'St. Mary\'s Co.', slug:'Hollywood', listings:14, img:'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&q=80', avgPrice:'$485K' },
  { name:'Chaptico',  county:'St. Mary\'s Co.', slug:'Chaptico',  listings:6,  img:'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=300&q=80', avgPrice:'$390K' },
  { name:'Lexington Park', county:'St. Mary\'s Co.', slug:'Lexington Park', listings:22, img:'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&q=80', avgPrice:'$420K' },
  { name:'Prince Frederick', county:'Calvert Co.', slug:'Prince Frederick', listings:18, img:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=80', avgPrice:'$510K' },
  { name:'Lusby',     county:'Calvert Co.',     slug:'Lusby',     listings:11, img:'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&q=80', avgPrice:'$455K' },
  { name:'Waldorf',   county:'Charles Co.',     slug:'Waldorf',   listings:31, img:'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=300&q=80', avgPrice:'$375K' },
  { name:'La Plata',  county:'Charles Co.',     slug:'La Plata',  listings:9,  img:'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=300&q=80', avgPrice:'$495K' },
  { name:'California MD', county:'St. Mary\'s Co.', slug:'California', listings:27, img:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&q=80', avgPrice:'$440K' },
];

// ── Listings (Southern MD focus + Coming Soon + New Construction) ─────
const MOCK_LISTINGS = [
  { mlsId:'BRIGHT-2001234', address:'412 Elm Street', city:'Hollywood', state:'MD', zip:'20636', price:489000, beds:4, baths:2.5, sqft:2840, status:'Active', daysOnMarket:12, img:'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80', type:'Single Family', description:'Stunning colonial on quiet street. Updated kitchen, hardwood throughout. Large fenced yard.' },
  { mlsId:'BRIGHT-2001305', address:'22801 Three Notch Rd', city:'California', state:'MD', zip:'20619', price:425000, beds:4, baths:3, sqft:3100, status:'Active', daysOnMarket:5, img:'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80', type:'Single Family', description:'Move-in ready. Large backyard, finished basement, 2-car garage. Excellent schools.' },
  { mlsId:'BRIGHT-2001756', address:'7 Mill Pond Ct', city:'Chaptico', state:'MD', zip:'20621', price:365000, beds:3, baths:2, sqft:1480, status:'Active', daysOnMarket:18, img:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80', type:'Townhouse', description:'Charming townhouse in the heart of Chaptico. Updated kitchen, private patio, community pool.' },
  { mlsId:'BRIGHT-2002011', address:'45 Bay Custom Way', city:'Lexington Park', state:'MD', zip:'20653', price:589000, beds:4, baths:3.5, sqft:3350, status:'Coming Soon', daysOnMarket:0, img:'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&q=80', type:'New Construction', description:'Bay Custom Homes — brand new build. Open floor plan, chef kitchen, smart home tech. Estimated delivery Sept 2026.', newConstruction:true },
  { mlsId:'BRIGHT-2002178', address:'310 Leisure Shores Dr', city:'Lusby', state:'MD', zip:'20657', price:415000, beds:3, baths:2, sqft:1650, status:'Active', daysOnMarket:22, img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', type:'Single Family', description:'Waterfront community views. Boat ramp access, community amenities. Recent roof and HVAC.' },
  { mlsId:'BRIGHT-2002344', address:'9821 Crain Highway', city:'La Plata', state:'MD', zip:'20646', price:525000, beds:5, baths:4, sqft:4200, status:'Active', daysOnMarket:7, img:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80', type:'Single Family', description:'Luxury home on 2 acres. In-ground pool, 3-car garage, guest suite. Backs to woods.' },
  { mlsId:'BRIGHT-2002501', address:'1820 Smallwood Dr W #302', city:'Waldorf', state:'MD', zip:'20603', price:289000, beds:2, baths:2, sqft:1100, status:'Active', daysOnMarket:31, img:'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80', type:'Condo', description:'Modern condo near shopping and dining. Balcony, in-unit laundry, assigned parking.' },
  { mlsId:'BRIGHT-2002677', address:'100 Prince Frederick Blvd', city:'Prince Frederick', state:'MD', zip:'20678', price:479000, beds:4, baths:3, sqft:2600, status:'Coming Soon', daysOnMarket:0, img:'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=400&q=80', type:'Single Family', description:'Coming soon to Calvert County. Beautifully maintained colonial with gourmet kitchen and 3-car garage.' },
  { mlsId:'BRIGHT-2002800', address:'55 Harbor View Ln', city:'Chesapeake Beach', state:'MD', zip:'20732', price:649000, beds:4, baths:3.5, sqft:3100, status:'Active', daysOnMarket:4, img:'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80', type:'Single Family', description:'Chesapeake Bay views. Private dock access, open concept, master suite with spa bath.' },
  { mlsId:'BRIGHT-2002900', address:'12 Bay Custom Circle', city:'Hollywood', state:'MD', zip:'20636', price:619000, beds:5, baths:4, sqft:3800, status:'Coming Soon', daysOnMarket:0, img:'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=400&q=80', type:'New Construction', description:'Bay Custom Homes flagship model. 5BR/4BA, quartz counters, LVP flooring, 2-car garage. Est. delivery Oct 2026.', newConstruction:true },
];

function AssignModal({ listing, onClose }) {
  const [allLeads, setAllLeads] = useState([]);
  const [query, setQuery]       = useState('');
  const [assigned, setAssigned] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    leadsApi.list({ limit: 50 }).then(d => setAllLeads(d.leads || []));
  }, []);

  const filtered = allLeads.filter(l =>
    `${l.firstName} ${l.lastName} ${l.email}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleAssign = (lead) => {
    setAssigned(lead);
    setTimeout(() => { onClose(); navigate(`/leads/${lead.id}`); }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Assign Property to Lead</h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{listing.address}, {listing.city} · {formatPrice(listing.price)}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X size={16}/>
          </button>
        </div>
        {assigned ? (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircle size={28} className="text-green-600"/>
            </div>
            <p className="font-semibold text-gray-900">Property assigned!</p>
            <p className="text-sm text-gray-500 mt-1">{listing.address} → {assigned.firstName} {assigned.lastName}</p>
            <p className="text-xs text-gray-400 mt-1">Opening lead profile...</p>
          </div>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input value={query} onChange={e => setQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search leads by name or email..." autoFocus/>
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {filtered.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">No leads found</p>
              ) : filtered.map(lead => (
                <button key={lead.id} onClick={() => handleAssign(lead)}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-blue-50 transition-colors text-left group border-b border-gray-50">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {lead.firstName[0]}{lead.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">{lead.firstName} {lead.lastName}</p>
                    <p className="text-xs text-gray-400">{lead.email} {lead.budget ? `· $${(lead.budget/1000).toFixed(0)}K budget` : ''}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    lead.temperature === 'Hot' ? 'bg-red-100 text-red-700' :
                    lead.temperature === 'Warm' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>{lead.temperature}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function formatPrice(p) {
  if (p >= 1000000) return `$${(p/1000000).toFixed(2)}M`;
  return `$${(p/1000).toFixed(0)}K`;
}

function StatusBadge({ status, newConstruction }) {
  if (newConstruction || status === 'New Construction') {
    return (
      <span className="flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
        <Hammer size={10}/>New Construction
      </span>
    );
  }
  if (status === 'Coming Soon') {
    return (
      <span className="flex items-center gap-1 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
        <Clock size={10}/>Coming Soon
      </span>
    );
  }
  return <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">{status}</span>;
}

export default function MLS() {
  const [filters, setFilters]             = useState({ city: '', minPrice: '', maxPrice: '', minBeds: '', type: '' });
  const [saved, setSaved]                 = useState(new Set());
  const [showFilters, setShowFilters]     = useState(false);
  const [assignListing, setAssignListing] = useState(null);
  const [activeNeighborhood, setActiveNeighborhood] = useState(null);
  const [view, setView]                   = useState('all'); // 'all' | 'neighborhoods'

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v }));

  const listings = MOCK_LISTINGS.filter(l => {
    if (activeNeighborhood && l.city !== activeNeighborhood) return false;
    if (filters.city && l.city !== filters.city) return false;
    if (filters.minPrice && l.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && l.price > Number(filters.maxPrice)) return false;
    if (filters.minBeds && l.beds < Number(filters.minBeds)) return false;
    if (filters.type === 'New Construction' && !l.newConstruction) return false;
    else if (filters.type && filters.type !== 'New Construction' && l.type !== filters.type) return false;
    return true;
  });

  const toggleSave = (id) => setSaved(s => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const comingSoonCount   = MOCK_LISTINGS.filter(l => l.status === 'Coming Soon').length;
  const newConstructionCount = MOCK_LISTINGS.filter(l => l.newConstruction).length;

  return (
    <div className="p-6 space-y-6">
      {assignListing && <AssignModal listing={assignListing} onClose={() => setAssignListing(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">MLS Property Search</h1>
            <span className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/>
              Bright MLS Connected
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Live IDX feed · Southern MD + DC Metro ·{' '}
            {activeNeighborhood ? <><span className="font-medium text-blue-600">{activeNeighborhood}</span> · </> : ''}
            {listings.length} listings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
            <img src="https://www.brightmls.com/favicon.ico" className="w-4 h-4" onError={e => e.target.style.display='none'} />
            <span className="text-xs font-bold text-gray-700">Bright MLS</span>
            <span className="text-xs text-gray-400">Mid-Atlantic IDX</span>
          </div>
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button onClick={() => setView('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${view==='all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              All Listings
            </button>
            <button onClick={() => setView('neighborhoods')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${view==='neighborhoods' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              Neighborhoods
            </button>
          </div>
          <button onClick={() => setShowFilters(f => !f)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'}`}>
            <SlidersHorizontal size={15}/> Filters
          </button>
        </div>
      </div>

      {/* Quick-filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => { setActiveNeighborhood(null); setFilters(f => ({ ...f, type:'' })); }}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${!activeNeighborhood && !filters.type ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
          All
        </button>
        <button onClick={() => { setActiveNeighborhood(null); setFilter('type','New Construction'); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${filters.type==='New Construction' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'}`}>
          <Hammer size={11}/>New Construction ({newConstructionCount})
        </button>
        <button onClick={() => { setActiveNeighborhood(null); setFilters({ city:'', minPrice:'', maxPrice:'', minBeds:'', type:'' }); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors bg-white text-gray-600 border-gray-200 hover:border-purple-300">
          <Clock size={11}/>Coming Soon ({comingSoonCount})
        </button>
        <span className="h-4 w-px bg-gray-200"/>
        {NEIGHBORHOODS.slice(0,5).map(n => (
          <button key={n.slug} onClick={() => { setActiveNeighborhood(n.name === activeNeighborhood ? null : n.name); setFilters(f => ({...f, type:'', city:''})); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${activeNeighborhood===n.name ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
            {n.name}
          </button>
        ))}
      </div>

      {/* ── NEIGHBORHOOD VIEW ── */}
      {view === 'neighborhoods' && (
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-4">Browse by Neighborhood</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {NEIGHBORHOODS.map(n => (
              <button key={n.slug} onClick={() => { setActiveNeighborhood(n.name); setView('all'); }}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all text-left">
                <div className="relative h-28 overflow-hidden bg-gray-100">
                  <img src={n.img} alt={n.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                  <div className="absolute bottom-2 left-3">
                    <p className="text-white font-bold text-sm">{n.name}</p>
                    <p className="text-white/80 text-xs">{n.county}</p>
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{n.listings} listings</p>
                    <p className="text-xs text-gray-500">Avg {n.avgPrice}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-600 transition-colors"/>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">City / Area</label>
              <select value={filters.city} onChange={e => setFilter('city', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Areas</option>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Min Price</label>
              <select value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">No Min</option>
                {[250000,350000,450000,550000,650000,800000].map(p => <option key={p} value={p}>{formatPrice(p)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Max Price</label>
              <select value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">No Max</option>
                {[400000,550000,700000,900000,1200000,1500000].map(p => <option key={p} value={p}>{formatPrice(p)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Min Beds</label>
              <select value={filters.minBeds} onChange={e => setFilter('minBeds', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Any</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Property Type</label>
              <select value={filters.type} onChange={e => setFilter('type', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Types</option>
                {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <button onClick={() => { setFilters({ city:'', minPrice:'', maxPrice:'', minBeds:'', type:'' }); setActiveNeighborhood(null); }}
            className="mt-3 text-xs text-blue-600 hover:underline">Clear all filters</button>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:'Avg List Price', value: formatPrice(Math.round(listings.filter(l=>l.status==='Active').reduce((a,l)=>a+l.price,0)/Math.max(listings.filter(l=>l.status==='Active').length,1))), icon: TrendingUp, color:'blue' },
          { label:'Coming Soon', value: MOCK_LISTINGS.filter(l=>l.status==='Coming Soon').length, icon: Clock, color:'purple' },
          { label:'New Construction', value: MOCK_LISTINGS.filter(l=>l.newConstruction).length, icon: Hammer, color:'amber' },
          { label:'Saved Properties', value: saved.size, icon: Heart, color:'red' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              color==='blue'?'bg-blue-50':color==='purple'?'bg-purple-50':color==='amber'?'bg-amber-50':'bg-red-50'}`}>
              <Icon size={16} className={`${color==='blue'?'text-blue-600':color==='purple'?'text-purple-600':color==='amber'?'text-amber-600':'text-red-600'}`}/>
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-lg font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bay Custom Homes Banner */}
      {(filters.type === 'New Construction' || !filters.type) && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Hammer size={18} className="text-white"/>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900">Bay Custom Homes — Preferred Builder Partner</p>
            <p className="text-xs text-amber-700 mt-0.5">New construction homes in Hollywood, Lexington Park & Prince Frederick. Custom builds starting at $520K. Est. delivery Sept–Dec 2026.</p>
          </div>
          <span className="text-xs font-semibold bg-amber-500 text-white px-3 py-1.5 rounded-full flex-shrink-0">{newConstructionCount} Active Builds</span>
        </div>
      )}

      {/* Active neighborhood heading */}
      {activeNeighborhood && (
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-gray-900">Homes in {activeNeighborhood}</h2>
          <button onClick={() => setActiveNeighborhood(null)} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
            <X size={11}/>Clear
          </button>
        </div>
      )}

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {listings.map(l => (
          <div key={l.mlsId} className={`bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-shadow group ${l.newConstruction ? 'border-amber-200' : l.status==='Coming Soon' ? 'border-purple-200' : 'border-gray-200'}`}>
            {/* Image */}
            <div className="relative h-44 overflow-hidden bg-gray-100">
              <img src={l.img} alt={l.address} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${l.status==='Coming Soon' ? 'opacity-90' : ''}`} />
              <div className="absolute top-3 left-3">
                <StatusBadge status={l.status} newConstruction={l.newConstruction}/>
              </div>
              <div className="absolute top-3 right-3">
                <button onClick={() => toggleSave(l.mlsId)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur transition-colors ${saved.has(l.mlsId) ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'}`}>
                  <Heart size={14} fill={saved.has(l.mlsId) ? 'currentColor' : 'none'}/>
                </button>
              </div>
              {l.status === 'Active' && (
                <div className="absolute bottom-3 left-3">
                  <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded">{l.daysOnMarket} days on market</span>
                </div>
              )}
              {l.status === 'Coming Soon' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-purple-600/80 text-white text-sm font-bold px-4 py-2 rounded-xl backdrop-blur">Coming Soon</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <p className="text-xl font-bold text-gray-900">{formatPrice(l.price)}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${l.newConstruction ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>{l.newConstruction ? 'New Build' : l.type}</span>
              </div>
              <p className="text-sm font-medium text-gray-800 mb-0.5">{l.address}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                <MapPin size={11}/> {l.city}, {l.state} {l.zip}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 pb-3 border-b border-gray-100">
                <span className="flex items-center gap-1"><Bed size={13}/> {l.beds} bd</span>
                <span className="flex items-center gap-1"><Bath size={13}/> {l.baths} ba</span>
                <span className="flex items-center gap-1"><Square size={13}/> {l.sqft.toLocaleString()} sqft</span>
              </div>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">{l.description}</p>
              <div className="flex gap-2">
                <button onClick={() => setAssignListing(l)} className="flex-1 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Assign to Lead
                </button>
                <button className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                  <ExternalLink size={14}/>
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center">MLS# {l.mlsId} · Bright MLS</p>
            </div>
          </div>
        ))}
      </div>

      {listings.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Home size={40} className="text-gray-300 mx-auto mb-3"/>
          <p className="text-gray-500 font-medium">No listings match your filters</p>
          <button onClick={() => { setFilters({ city:'', minPrice:'', maxPrice:'', minBeds:'', type:'' }); setActiveNeighborhood(null); }}
            className="mt-3 text-sm text-blue-600 hover:underline">Clear filters</button>
        </div>
      )}

      <p className="text-center text-xs text-gray-400">
        © Bright MLS · Data deemed reliable but not guaranteed · Updated {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
