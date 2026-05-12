import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
  ArrowLeft, Bed, Bath, Square, MapPin, Heart, Share2, Printer,
  Phone, Mail, Calendar, DollarSign, Hammer, Clock, CheckCircle,
  Home, ExternalLink, Bell, BellOff, User, ChevronRight, Calculator
} from 'lucide-react';
import { leads as leadsApi } from '../api/client';

// Fix Leaflet default icon path issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Shared listing data (single source of truth) ──────────────────────────
export const LISTINGS = [
  {
    mlsId:'BRIGHT-2001234', address:'412 Elm Street', city:'Hollywood', state:'MD', zip:'20636',
    price:489000, beds:4, baths:2.5, sqft:2840, lotSqft:12200, yearBuilt:2001, garage:2,
    status:'Active', daysOnMarket:12,
    img:'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    type:'Single Family',
    description:'Stunning colonial on a quiet cul-de-sac in Hollywood. Completely updated kitchen with quartz countertops, stainless appliances, and a large island. Gleaming hardwood floors throughout main level. Master suite with spa bath and walk-in closet. Large fenced rear yard perfect for entertaining.',
    features:['Updated Kitchen','Hardwood Floors','Fenced Yard','2-Car Garage','Master Suite','Deck','Central A/C','Gas Fireplace'],
    agent:{ name:'Jennifer Walsh', phone:'(301) 555-0142', email:'j.walsh@brightrealty.com', office:'Bright Realty Partners', license:'MD-108432' },
    coords:[38.3573, -76.5874],
    hoa:null, taxes:5820,
  },
  {
    mlsId:'BRIGHT-2001305', address:'22801 Three Notch Rd', city:'California', state:'MD', zip:'20619',
    price:425000, beds:4, baths:3, sqft:3100, lotSqft:18500, yearBuilt:1998, garage:2,
    status:'Active', daysOnMarket:5,
    img:'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
    type:'Single Family',
    description:'Move-in ready colonial with a finished basement. Large rear yard with privacy fence. 2-car garage with extra storage. Located near NAS Pax River — VA loan friendly. Excellent school district.',
    features:['Finished Basement','Privacy Fence','Large Yard','2-Car Garage','VA Loan Friendly','Updated Baths'],
    agent:{ name:'Carlos Rivera', phone:'(301) 555-0187', email:'c.rivera@sunsetrealty.com', office:'Sunset Realty Group', license:'MD-109871' },
    coords:[38.2965, -76.5072],
    hoa:null, taxes:4680,
  },
  {
    mlsId:'BRIGHT-2001756', address:'7 Mill Pond Ct', city:'Chaptico', state:'MD', zip:'20621',
    price:365000, beds:3, baths:2, sqft:1480, lotSqft:3200, yearBuilt:2005, garage:1,
    status:'Active', daysOnMarket:18,
    img:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    type:'Townhouse',
    description:'Charming end-unit townhouse in the heart of Chaptico. Updated kitchen, private rear patio, and 1-car garage. Community pool and tot lot. Low HOA. Perfect for first-time buyers or investors.',
    features:['End Unit','Updated Kitchen','Private Patio','Community Pool','1-Car Garage','Low HOA'],
    agent:{ name:'Sandra Williams', phone:'(301) 555-0299', email:'s.williams@mdhometeam.com', office:'MD Home Team', license:'MD-112230' },
    coords:[38.3726, -76.7579],
    hoa:195, taxes:3940,
  },
  {
    mlsId:'BRIGHT-2002011', address:'45 Bay Custom Way', city:'Lexington Park', state:'MD', zip:'20653',
    price:589000, beds:4, baths:3.5, sqft:3350, lotSqft:9000, yearBuilt:2026, garage:2,
    status:'Coming Soon', daysOnMarket:0,
    img:'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
    type:'New Construction', newConstruction:true,
    description:'Bay Custom Homes — brand new build in Lexington Park. Open floor plan with 10-ft ceilings on main level. Chef kitchen with quartz counters, gas range, and walk-in pantry. Smart home technology pre-wired. Master suite with tray ceiling, spa bath, and 2 walk-in closets. Est. delivery Sept 2026.',
    features:['New Construction','Smart Home','Quartz Counters','Gas Range','10ft Ceilings','Spa Master Bath','2 Walk-in Closets','Energy Star Certified'],
    agent:{ name:'Billy Rabbitt', phone:'(301) 555-0100', email:'billy@exploremdhomes.com', office:'The Southside Group', license:'MD-98741' },
    coords:[38.2679, -76.4500],
    hoa:150, taxes:0,
  },
  {
    mlsId:'BRIGHT-2002178', address:'310 Leisure Shores Dr', city:'Lusby', state:'MD', zip:'20657',
    price:415000, beds:3, baths:2, sqft:1650, lotSqft:14000, yearBuilt:1990, garage:1,
    status:'Active', daysOnMarket:22,
    img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    type:'Single Family',
    description:'Waterfront community home with stunning bay views. Private community boat ramp and pier access. Recent roof (2023) and HVAC (2022). Screened rear porch. Perfect for water lovers — kayak, fish, and crab right from the community pier.',
    features:['Water Views','Community Boat Ramp','Screened Porch','New Roof 2023','New HVAC 2022','Community Amenities'],
    agent:{ name:'Marcus Lee', phone:'(301) 555-0173', email:'m.lee@bayarearealty.com', office:'Bay Area Realty MD', license:'MD-107654' },
    coords:[38.4137, -76.4537],
    hoa:285, taxes:4210,
  },
  {
    mlsId:'BRIGHT-2002344', address:'9821 Crain Highway', city:'La Plata', state:'MD', zip:'20646',
    price:525000, beds:5, baths:4, sqft:4200, lotSqft:87120, yearBuilt:2003, garage:3,
    status:'Active', daysOnMarket:7,
    img:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    type:'Single Family',
    description:'Luxury home on 2 private acres in La Plata. In-ground pool with pool house, 3-car garage, and dedicated guest suite. Gourmet kitchen with dual ovens. Backs to mature woods for ultimate privacy. 10 minutes to Route 301.',
    features:['In-Ground Pool','Pool House','3-Car Garage','Guest Suite','2 Acres','Gourmet Kitchen','Dual Ovens','Private Woods'],
    agent:{ name:'Diana Chen', phone:'(301) 555-0251', email:'d.chen@charlescomd.com', office:'Charles County Realty', license:'MD-115002' },
    coords:[38.5290, -76.9751],
    hoa:null, taxes:6890,
  },
  {
    mlsId:'BRIGHT-2002501', address:'1820 Smallwood Dr W #302', city:'Waldorf', state:'MD', zip:'20603',
    price:289000, beds:2, baths:2, sqft:1100, lotSqft:0, yearBuilt:2008, garage:0,
    status:'Active', daysOnMarket:31,
    img:'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    type:'Condo',
    description:'Modern 3rd floor condo near Waldorf shopping, dining, and commuter rail. Balcony with western views, in-unit laundry, assigned parking. HOA includes water, trash, and exterior maintenance. Great investment or primary residence.',
    features:['Balcony','In-Unit Laundry','Assigned Parking','HOA Includes Water','Near Commuter Rail','Storage Unit'],
    agent:{ name:'Robert Martinez', phone:'(301) 555-0334', email:'r.martinez@waldorfrealty.com', office:'Waldorf Realty LLC', license:'MD-110456' },
    coords:[38.6273, -76.8617],
    hoa:385, taxes:2840,
  },
  {
    mlsId:'BRIGHT-2002677', address:'100 Prince Frederick Blvd', city:'Prince Frederick', state:'MD', zip:'20678',
    price:479000, beds:4, baths:3, sqft:2600, lotSqft:10890, yearBuilt:1997, garage:3,
    status:'Coming Soon', daysOnMarket:0,
    img:'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&q=80',
    type:'Single Family',
    description:'Coming soon to Calvert County. Beautifully maintained colonial with gourmet kitchen and oversized 3-car garage. Gleaming hardwood floors. Sunroom addition overlooking rear yard. Close to shopping, dining, and Route 4.',
    features:['Gourmet Kitchen','3-Car Garage','Hardwood Floors','Sunroom','Rear Deck','Calvert County Schools'],
    agent:{ name:'Emily Davis', phone:'(301) 555-0412', email:'e.davis@calvertrealty.com', office:'Calvert County Realty', license:'MD-116709' },
    coords:[38.5404, -76.5858],
    hoa:null, taxes:5310,
  },
  {
    mlsId:'BRIGHT-2002800', address:'55 Harbor View Ln', city:'Chesapeake Beach', state:'MD', zip:'20732',
    price:649000, beds:4, baths:3.5, sqft:3100, lotSqft:8276, yearBuilt:2012, garage:2,
    status:'Active', daysOnMarket:4,
    img:'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    type:'Single Family',
    description:'Stunning Chesapeake Bay views from every level. Private dock access through the community. Open concept main level with floor-to-ceiling windows. Master suite with private balcony and spa bath. Just steps to the beach and Chesapeake Beach Resort.',
    features:['Bay Views','Dock Access','Private Balcony','Floor-to-Ceiling Windows','Spa Bath','Open Concept','2-Car Garage','Near Beach'],
    agent:{ name:'Nancy Davis', phone:'(301) 555-0521', email:'n.davis@bayviewhomes.com', office:'Bay View Homes', license:'MD-108900' },
    coords:[38.6904, -76.5358],
    hoa:420, taxes:7240,
  },
  {
    mlsId:'BRIGHT-2002900', address:'12 Bay Custom Circle', city:'Hollywood', state:'MD', zip:'20636',
    price:619000, beds:5, baths:4, sqft:3800, lotSqft:9500, yearBuilt:2026, garage:2,
    status:'Coming Soon', daysOnMarket:0,
    img:'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80',
    type:'New Construction', newConstruction:true,
    description:'Bay Custom Homes flagship model in Hollywood. 5 bedrooms, 4 full baths, and a massive open-concept great room. Quartz countertops throughout, LVP flooring on main level, and a dedicated home office. 2-car garage with EV charging pre-wire. Est. delivery Oct 2026.',
    features:['New Construction','5 Bedrooms','Open Concept','Quartz Counters','LVP Flooring','Home Office','EV Charging','Energy Star'],
    agent:{ name:'Billy Rabbitt', phone:'(301) 555-0100', email:'billy@exploremdhomes.com', office:'The Southside Group', license:'MD-98741' },
    coords:[38.3600, -76.5910],
    hoa:150, taxes:0,
  },
];

function formatPrice(p) {
  if (p >= 1000000) return `$${(p/1000000).toFixed(2)}M`;
  return `$${(p/1000).toFixed(0)}K`;
}

function MortgageCalc({ listPrice }) {
  const [homePrice, setHomePrice]     = useState(listPrice);
  const [downPct, setDownPct]         = useState(10);
  const [rate, setRate]               = useState(6.75);
  const [term, setTerm]               = useState(30);

  const principal = homePrice * (1 - downPct / 100);
  const monthlyRate = rate / 100 / 12;
  const n = term * 12;
  const monthly = monthlyRate === 0 ? principal / n :
    (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
        <Calculator size={16} className="text-blue-600"/> Mortgage Calculator
      </h3>
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-xs text-gray-500 font-medium mb-1 block">Home Price</label>
          <input type="number" value={homePrice} onChange={e => setHomePrice(Number(e.target.value))}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block">Down Payment %</label>
            <input type="number" value={downPct} onChange={e => setDownPct(Number(e.target.value))} min={0} max={100}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block">Interest Rate %</label>
            <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} step={0.05}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium mb-1 block">Loan Term (years)</label>
          <div className="flex gap-2">
            {[10,15,20,30].map(t => (
              <button key={t} onClick={() => setTerm(t)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${term===t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {t}yr
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
        <p className="text-xs text-blue-600 font-medium mb-1">Estimated Monthly Payment</p>
        <p className="text-3xl font-bold text-blue-700">${Math.round(monthly).toLocaleString()}</p>
        <p className="text-xs text-blue-500 mt-1">/month · {downPct}% down · {rate}% rate</p>
      </div>
      <p className="text-[10px] text-gray-400 mt-2 text-center">Principal & interest only. Does not include taxes, insurance, or HOA.</p>
    </div>
  );
}

function AssignModal({ listing, onClose }) {
  const [allLeads, setAllLeads] = useState([]);
  const [query, setQuery]       = useState('');
  const [assigned, setAssigned] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { leadsApi.list({ limit: 50 }).then(d => setAllLeads(d.leads || [])); }, []);
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
            <h2 className="text-base font-bold text-gray-900">Assign to Lead</h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{listing.address}, {listing.city}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg">✕</button>
        </div>
        {assigned ? (
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle size={40} className="text-green-500 mb-3"/>
            <p className="font-semibold text-gray-900">Assigned to {assigned.firstName}!</p>
            <p className="text-xs text-gray-400 mt-1">Navigating to lead profile...</p>
          </div>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-gray-100">
              <input value={query} onChange={e => setQuery(e.target.value)} autoFocus
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search leads by name or email..."/>
            </div>
            <div className="overflow-y-auto flex-1">
              {filtered.map(lead => (
                <button key={lead.id} onClick={() => handleAssign(lead)}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-blue-50 text-left group border-b border-gray-50">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {lead.firstName[0]}{lead.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">{lead.firstName} {lead.lastName}</p>
                    <p className="text-xs text-gray-400">{lead.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PropertyPage() {
  const { mlsId }  = useParams();
  const navigate   = useNavigate();
  const listing    = LISTINGS.find(l => l.mlsId === mlsId);

  const [saved, setSaved]             = useState(false);
  const [watching, setWatching]       = useState(false);
  const [showAssign, setShowAssign]   = useState(false);
  const [copied, setCopied]           = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  if (!listing) return (
    <div className="p-8 text-center">
      <p className="text-gray-500 mb-4">Property not found in MLS</p>
      <Link to="/mls" className="text-blue-600 hover:underline">← Back to MLS Search</Link>
    </div>
  );

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const photos = [listing.img, listing.img.replace('w=800', 'w=801'), listing.img.replace('q=80', 'q=81')];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {showAssign && <AssignModal listing={listing} onClose={() => setShowAssign(false)} />}

      {/* Back + breadcrumb */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate('/mls')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
          <ArrowLeft size={15}/> MLS Search
        </button>
        <ChevronRight size={14} className="text-gray-300"/>
        <span className="text-sm text-gray-500">{listing.city}, MD</span>
        <ChevronRight size={14} className="text-gray-300"/>
        <span className="text-sm font-medium text-gray-900 truncate">{listing.address}</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── LEFT: Main content ── */}
        <div className="xl:col-span-2 space-y-5">

          {/* Photo hero */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="relative h-72 bg-gray-100">
              <img src={listing.img} alt={listing.address} className="w-full h-full object-cover"/>

              {/* Status badge */}
              <div className="absolute top-4 left-4">
                {listing.newConstruction ? (
                  <span className="flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    <Hammer size={12}/>New Construction
                  </span>
                ) : listing.status === 'Coming Soon' ? (
                  <span className="flex items-center gap-1 bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    <Clock size={12}/>Coming Soon
                  </span>
                ) : (
                  <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    <CheckCircle size={12}/>Active
                  </span>
                )}
              </div>

              {/* Top-right actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => setSaved(s => !s)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur transition-colors ${saved ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:text-red-500'}`}>
                  <Heart size={16} fill={saved ? 'currentColor' : 'none'}/>
                </button>
                <button onClick={copyLink}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/90 rounded-full text-xs font-semibold text-gray-700 hover:bg-white transition-colors backdrop-blur">
                  <Share2 size={13}/>{copied ? 'Copied!' : 'Share'}
                </button>
                <button onClick={() => setWatching(w => !w)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold backdrop-blur transition-colors ${watching ? 'bg-blue-600 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'}`}>
                  {watching ? <Bell size={13}/> : <BellOff size={13}/>}
                  {watching ? 'Watching' : 'Watch'}
                </button>
              </div>

              {listing.status === 'Active' && (
                <div className="absolute bottom-4 left-4">
                  <span className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur">
                    {listing.daysOnMarket} days on market
                  </span>
                </div>
              )}
            </div>

            {/* Price + address block */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{formatPrice(listing.price)}</p>
                  {listing.status === 'Coming Soon' && (
                    <p className="text-xs text-purple-600 font-medium">Pre-market — contact agent to preview</p>
                  )}
                </div>
                <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full">{listing.type}</span>
              </div>
              <p className="text-lg font-semibold text-gray-800">{listing.address}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                <MapPin size={13}/>{listing.city}, {listing.state} {listing.zip}
              </p>

              {/* Key stats row */}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{listing.beds}</p>
                  <p className="text-xs text-gray-500">Beds</p>
                </div>
                <div className="w-px h-8 bg-gray-200"/>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{listing.baths}</p>
                  <p className="text-xs text-gray-500">Baths</p>
                </div>
                <div className="w-px h-8 bg-gray-200"/>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{listing.sqft.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Sq Ft</p>
                </div>
                {listing.lotSqft > 0 && <>
                  <div className="w-px h-8 bg-gray-200"/>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{listing.lotSqft > 43560 ? `${(listing.lotSqft/43560).toFixed(1)} ac` : `${(listing.lotSqft/1000).toFixed(1)}K`}</p>
                    <p className="text-xs text-gray-500">Lot</p>
                  </div>
                </>}
                <div className="w-px h-8 bg-gray-200"/>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{listing.yearBuilt}</p>
                  <p className="text-xs text-gray-500">Built</p>
                </div>
                {listing.garage > 0 && <>
                  <div className="w-px h-8 bg-gray-200"/>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{listing.garage}</p>
                    <p className="text-xs text-gray-500">Garage</p>
                  </div>
                </>}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">About This Home</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{listing.description}</p>

            {/* Features */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Key Features</p>
              <div className="flex flex-wrap gap-2">
                {listing.features.map(f => (
                  <span key={f} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                    <CheckCircle size={11}/>{f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Property Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label:'MLS Number',    value: listing.mlsId },
                { label:'Property Type', value: listing.type },
                { label:'Year Built',    value: listing.yearBuilt },
                { label:'Sq Footage',    value: `${listing.sqft.toLocaleString()} sqft` },
                { label:'Lot Size',      value: listing.lotSqft > 0 ? `${listing.lotSqft.toLocaleString()} sqft` : 'N/A' },
                { label:'Garage',        value: listing.garage ? `${listing.garage}-car` : 'None' },
                { label:'HOA',           value: listing.hoa ? `$${listing.hoa}/mo` : 'None' },
                { label:'Annual Taxes',  value: listing.taxes ? `$${listing.taxes.toLocaleString()}` : 'TBD' },
                { label:'Status',        value: listing.status },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <MapPin size={15} className="text-blue-600"/> Location
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{listing.address}, {listing.city}, {listing.state} {listing.zip}</p>
            </div>
            <div style={{ height: 240 }}>
              <MapContainer center={listing.coords} zoom={14} style={{ height:'100%', width:'100%' }} scrollWheelZoom={false}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
                />
                <Marker position={listing.coords}>
                  <Popup>
                    <b>{listing.address}</b><br/>
                    {formatPrice(listing.price)} · {listing.beds}bd {listing.baths}ba
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Sidebar ── */}
        <div className="space-y-4">

          {/* CTA panel */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <button onClick={() => setShowAssign(true)}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-3">
              <User size={16}/> Assign to Lead
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
                <Phone size={13}/> Call Agent
              </button>
              <button className="py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
                <Calendar size={13}/> Schedule
              </button>
            </div>
            <button onClick={() => setWatching(w => !w)}
              className={`w-full mt-2 py-2 text-sm font-medium rounded-xl border transition-colors flex items-center justify-center gap-1.5 ${
                watching ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {watching ? <Bell size={13}/> : <BellOff size={13}/>}
              {watching ? '✓ Watching for Status Changes' : 'Watch for Status Changes'}
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              {watching ? 'You\'ll be notified when this listing\'s status changes' : 'Get notified when this listing changes status'}
            </p>
          </div>

          {/* Listing Agent */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Listing Agent</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {listing.agent.name.split(' ').map(n=>n[0]).join('')}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{listing.agent.name}</p>
                <p className="text-xs text-gray-500">{listing.agent.office}</p>
                <p className="text-[10px] text-gray-400">License #{listing.agent.license}</p>
              </div>
            </div>
            <div className="space-y-2">
              <a href={`tel:${listing.agent.phone}`}
                className="flex items-center gap-2 w-full py-2 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors">
                <Phone size={13}/>{listing.agent.phone}
              </a>
              <a href={`mailto:${listing.agent.email}`}
                className="flex items-center gap-2 w-full py-2 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors">
                <Mail size={13}/>{listing.agent.email}
              </a>
            </div>
          </div>

          {/* Mortgage Calculator */}
          <MortgageCalc listPrice={listing.price} />

          {/* MLS footer */}
          <div className="text-center">
            <p className="text-[10px] text-gray-400">MLS# {listing.mlsId} · Bright MLS</p>
            <p className="text-[10px] text-gray-400">Data deemed reliable but not guaranteed</p>
            <p className="text-[10px] text-gray-400">Updated {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
