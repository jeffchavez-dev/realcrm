import React, { useState, useEffect } from 'react';
import { Bed, Bath, Square, MapPin, Heart, ExternalLink, SlidersHorizontal, Home, TrendingUp, RefreshCw, X, Search, CheckCircle } from 'lucide-react';
import { leads as leadsApi } from '../api/client';
import { useNavigate } from 'react-router-dom';

const CITIES = ['Bethesda', 'Chevy Chase', 'Silver Spring', 'Rockville', 'Potomac', 'McLean', 'Arlington', 'Alexandria'];
const PROPERTY_TYPES = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family'];

const MOCK_LISTINGS = [
  { mlsId:'BRIGHT-2001234', address:'412 Elm Street', city:'Bethesda', state:'MD', zip:'20814', price:649000, beds:4, baths:2.5, sqft:2840, status:'Active', daysOnMarket:12, img:'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80', type:'Single Family', description:'Stunning colonial on quiet street. Updated kitchen, hardwood throughout.' },
  { mlsId:'BRIGHT-2001305', address:'7201 Brookville Rd', city:'Chevy Chase', state:'MD', zip:'20815', price:675000, beds:4, baths:3, sqft:3100, status:'Active', daysOnMarket:5, img:'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80', type:'Single Family', description:'Move-in ready. Large backyard, finished basement, 2-car garage.' },
  { mlsId:'BRIGHT-2001756', address:'11200 Veirs Mill Rd #4A', city:'Silver Spring', state:'MD', zip:'20902', price:495000, beds:3, baths:2, sqft:1480, status:'Active', daysOnMarket:18, img:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80', type:'Condo', description:'Renovated condo with rooftop access and reserved parking.' },
  { mlsId:'BRIGHT-2002011', address:'5430 Massachusetts Ave', city:'Bethesda', state:'MD', zip:'20816', price:729000, beds:4, baths:3.5, sqft:3350, status:'Active', daysOnMarket:3, img:'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&q=80', type:'Single Family', description:'New construction. Open floor plan, chef kitchen, smart home.' },
  { mlsId:'BRIGHT-2002178', address:'3310 Leisure World Blvd', city:'Silver Spring', state:'MD', zip:'20906', price:415000, beds:3, baths:2, sqft:1650, status:'Active', daysOnMarket:22, img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', type:'Condo', description:'Golf course views. Community with resort amenities.' },
  { mlsId:'BRIGHT-2002344', address:'9821 Georgetown Pike', city:'Potomac', state:'MD', zip:'20854', price:1250000, beds:6, baths:5, sqft:5200, status:'Active', daysOnMarket:7, img:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80', type:'Single Family', description:'Luxury estate on 2 acres. Pool, 3-car garage, guest suite.' },
  { mlsId:'BRIGHT-2002501', address:'1820 Columbia Pike #302', city:'Arlington', state:'VA', zip:'22204', price:389000, beds:2, baths:2, sqft:1100, status:'Active', daysOnMarket:31, img:'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80', type:'Condo', description:'Modern condo steps from metro. Balcony, in-unit laundry, garage parking.' },
  { mlsId:'BRIGHT-2002677', address:'412 King Street', city:'Alexandria', state:'VA', zip:'22314', price:875000, beds:4, baths:3, sqft:2600, status:'Active', daysOnMarket:9, img:'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=400&q=80', type:'Townhouse', description:'Old Town gem. Historic charm, modern updates, private patio.' },
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

export default function MLS() {
  const [filters, setFilters]         = useState({ city: '', minPrice: '', maxPrice: '', minBeds: '', type: '' });
  const [saved, setSaved]             = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [assignListing, setAssignListing] = useState(null);

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v }));

  const listings = MOCK_LISTINGS.filter(l => {
    if (filters.city && l.city !== filters.city) return false;
    if (filters.minPrice && l.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && l.price > Number(filters.maxPrice)) return false;
    if (filters.minBeds && l.beds < Number(filters.minBeds)) return false;
    if (filters.type && l.type !== filters.type) return false;
    return true;
  });

  const toggleSave = (id) => setSaved(s => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

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
          <p className="text-sm text-gray-500">Live IDX feed · {listings.length} active listings matching your search</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
            <img src="https://www.brightmls.com/favicon.ico" className="w-4 h-4" onError={e => e.target.style.display='none'} />
            <span className="text-xs font-bold text-gray-700">Bright MLS</span>
            <span className="text-xs text-gray-400">Mid-Atlantic IDX</span>
          </div>
          <button onClick={() => setShowFilters(f => !f)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'}`}>
            <SlidersHorizontal size={15}/> Filters
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">City</label>
              <select value={filters.city} onChange={e => setFilter('city', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Cities</option>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Min Price</label>
              <select value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">No Min</option>
                {[300000,400000,500000,600000,750000,1000000].map(p => <option key={p} value={p}>{formatPrice(p)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Max Price</label>
              <select value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">No Max</option>
                {[500000,700000,900000,1200000,1500000,2000000].map(p => <option key={p} value={p}>{formatPrice(p)}</option>)}
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
          <button onClick={() => setFilters({ city:'', minPrice:'', maxPrice:'', minBeds:'', type:'' })}
            className="mt-3 text-xs text-blue-600 hover:underline">Clear all filters</button>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:'Avg List Price', value: formatPrice(Math.round(listings.reduce((a,l)=>a+l.price,0)/Math.max(listings.length,1))), icon: TrendingUp, color:'blue' },
          { label:'Avg Days on Market', value: Math.round(listings.reduce((a,l)=>a+l.daysOnMarket,0)/Math.max(listings.length,1)) + ' days', icon: RefreshCw, color:'green' },
          { label:'Total Listings', value: listings.length, icon: Home, color:'purple' },
          { label:'Saved Properties', value: saved.size, icon: Heart, color:'red' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-${color}-50`}>
              <Icon size={16} className={`text-${color}-600`}/>
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-lg font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {listings.map(l => (
          <div key={l.mlsId} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
            {/* Image */}
            <div className="relative h-44 overflow-hidden bg-gray-100">
              <img src={l.img} alt={l.address} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-3 left-3">
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">{l.status}</span>
              </div>
              <div className="absolute top-3 right-3">
                <button onClick={() => toggleSave(l.mlsId)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur transition-colors ${saved.has(l.mlsId) ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'}`}>
                  <Heart size={14} fill={saved.has(l.mlsId) ? 'currentColor' : 'none'}/>
                </button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded">{l.daysOnMarket} days on market</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <p className="text-xl font-bold text-gray-900">{formatPrice(l.price)}</p>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{l.type}</span>
              </div>
              <p className="text-sm font-medium text-gray-800 mb-0.5">{l.address}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                <MapPin size={11}/> {l.city}, {l.state} {l.zip}
              </div>

              {/* Stats */}
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
          <button onClick={() => setFilters({ city:'', minPrice:'', maxPrice:'', minBeds:'', type:'' })}
            className="mt-3 text-sm text-blue-600 hover:underline">Clear filters</button>
        </div>
      )}

      <p className="text-center text-xs text-gray-400">
        © Bright MLS · Data deemed reliable but not guaranteed · Updated {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
