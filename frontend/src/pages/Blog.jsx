import React, { useState } from 'react';
import { Calendar, User, Tag, ArrowRight, Search, BookOpen, TrendingUp, Home, DollarSign, MapPin } from 'lucide-react';

const CATEGORIES = ['All', 'Market Update', 'Buying a Home', 'Selling Your Home', 'Community Spotlight', 'New Construction', 'Financing & Mortgage', 'Events'];

const POSTS = [
  {
    id:1, slug:'southern-md-market-update-may-2026',
    title:'Southern Maryland Market Update — May 2026',
    category:'Market Update', author:'Billy Rabbitt', date:'May 8, 2026',
    img:'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=600&q=80',
    excerpt:'Inventory remains tight across St. Mary\'s, Calvert, and Charles counties. Median sale price up 6.2% YoY. Here\'s what buyers and sellers need to know heading into summer.',
    readTime:'4 min', featured:true,
    tags:['Market','Southern MD','2026'],
  },
  {
    id:2, slug:'bay-custom-homes-new-construction-hollywood',
    title:'Bay Custom Homes: New Construction Now Available in Hollywood, MD',
    category:'New Construction', author:'Sarah Johnson', date:'May 5, 2026',
    img:'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&q=80',
    excerpt:'Our preferred builder partner Bay Custom Homes is releasing 12 new lots in Hollywood, MD. Custom builds starting at $520K with estimated delivery Sept–Dec 2026.',
    readTime:'3 min', featured:true,
    tags:['New Construction','Bay Custom Homes','Hollywood MD'],
  },
  {
    id:3, slug:'10-steps-buying-home-southern-maryland',
    title:'10 Essential Steps to Buying a Home in Southern Maryland',
    category:'Buying a Home', author:'Marcus Lee', date:'Apr 30, 2026',
    img:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
    excerpt:'From pre-approval to closing day, here\'s the complete buyer\'s roadmap for St. Mary\'s County, Calvert County, and Charles County markets.',
    readTime:'7 min', featured:false,
    tags:['Buyers','Guide','First-Time Buyers'],
  },
  {
    id:4, slug:'chaptico-community-spotlight',
    title:'Community Spotlight: Why Families Are Moving to Chaptico',
    category:'Community Spotlight', author:'Diana Chen', date:'Apr 24, 2026',
    img:'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=600&q=80',
    excerpt:'Historic charm, affordable land, and a tight-knit community — Chaptico is one of Southern Maryland\'s best-kept secrets. Median home price: $390K.',
    readTime:'5 min', featured:false,
    tags:['Chaptico','Community','St. Mary\'s Co.'],
  },
  {
    id:5, slug:'how-to-price-home-southern-maryland',
    title:'How to Price Your Home Right in a Competitive Market',
    category:'Selling Your Home', author:'Billy Rabbitt', date:'Apr 18, 2026',
    img:'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80',
    excerpt:'Pricing too high loses buyers. Pricing too low leaves money on the table. Our CMA process ensures you hit the sweet spot from day one.',
    readTime:'6 min', featured:false,
    tags:['Sellers','Pricing','CMA'],
  },
  {
    id:6, slug:'fha-vs-conventional-southern-maryland',
    title:'FHA vs. Conventional Loans: What Southern MD Buyers Need to Know',
    category:'Financing & Mortgage', author:'Sarah Johnson', date:'Apr 11, 2026',
    img:'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    excerpt:'Down payment requirements, PMI, credit score minimums — we break down both loan types so you can make the right call for your situation.',
    readTime:'5 min', featured:false,
    tags:['Financing','FHA','Mortgage'],
  },
  {
    id:7, slug:'lexington-park-market-report',
    title:'Lexington Park Real Estate: 2026 Market Report',
    category:'Market Update', author:'Marcus Lee', date:'Apr 4, 2026',
    img:'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
    excerpt:'Lexington Park continues to see strong demand driven by NAS Pax River personnel. 22 active listings, DOM averaging 18 days. Full breakdown inside.',
    readTime:'4 min', featured:false,
    tags:['Lexington Park','Market','NAS Pax River'],
  },
  {
    id:8, slug:'spring-events-southern-maryland-2026',
    title:'Spring Events in Southern Maryland You Don\'t Want to Miss',
    category:'Events', author:'Diana Chen', date:'Mar 28, 2026',
    img:'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80',
    excerpt:'From the St. Mary\'s County Fair to the Chesapeake Wine Festival — here\'s your guide to spring 2026 events across the tri-county area.',
    readTime:'3 min', featured:false,
    tags:['Events','Southern MD','Community'],
  },
];

const categoryIcons = {
  'Market Update': TrendingUp, 'Buying a Home': Home, 'Selling Your Home': DollarSign,
  'Community Spotlight': MapPin, 'New Construction': Home, 'Financing & Mortgage': DollarSign,
  'Events': Calendar, 'All': BookOpen,
};

const categoryColors = {
  'Market Update':'bg-blue-100 text-blue-700', 'Buying a Home':'bg-green-100 text-green-700',
  'Selling Your Home':'bg-amber-100 text-amber-700', 'Community Spotlight':'bg-purple-100 text-purple-700',
  'New Construction':'bg-orange-100 text-orange-700', 'Financing & Mortgage':'bg-indigo-100 text-indigo-700',
  'Events':'bg-pink-100 text-pink-700',
};

function PostCard({ post, featured = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group ${featured ? 'md:flex' : ''}`}>
      <div className={`relative overflow-hidden bg-gray-100 ${featured ? 'md:w-72 flex-shrink-0' : 'h-44'}`}
        style={featured ? { height: '220px' } : {}}>
        <img src={post.img} alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}>
            {post.category}
          </span>
        </div>
        {featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">FEATURED</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className={`font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors ${featured ? 'text-base' : 'text-sm'}`}>
            {post.title}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><User size={11}/>{post.author}</span>
            <span className="flex items-center gap-1"><Calendar size={11}/>{post.date}</span>
            <span className="flex items-center gap-1"><BookOpen size={11}/>{post.readTime}</span>
          </div>
          <span className={`text-blue-600 text-xs font-semibold flex items-center gap-0.5 transition-transform ${hovered ? 'translate-x-1' : ''}`}>
            Read <ArrowRight size={12}/>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = POSTS.filter(p => {
    const matchCat  = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const featured = filtered.filter(p => p.featured);
  const rest     = filtered.filter(p => !p.featured);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Content & Blog</h1>
          <p className="text-sm text-gray-500 mt-0.5">Southern Maryland real estate insights · Published twice weekly</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-48"/>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
            + New Post
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:'Total Posts', value: POSTS.length, color:'blue' },
          { label:'This Month', value: POSTS.filter(p => p.date.includes('May 2026')).length, color:'green' },
          { label:'Categories', value: CATEGORIES.length - 1, color:'purple' },
          { label:'Avg Read Time', value: '4.6 min', color:'amber' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className={`text-2xl font-bold ${color==='blue'?'text-blue-600':color==='green'?'text-green-600':color==='purple'?'text-purple-600':'text-amber-600'}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map(cat => {
          const Icon = categoryIcons[cat] || BookOpen;
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${activeCategory===cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
              <Icon size={11}/>{cat}
            </button>
          );
        })}
      </div>

      {/* Featured Posts */}
      {featured.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Featured</h2>
          <div className="space-y-4">
            {featured.map(p => <PostCard key={p.id} post={p} featured={true}/>)}
          </div>
        </div>
      )}

      {/* All Other Posts */}
      {rest.length > 0 && (
        <div>
          {featured.length > 0 && <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">Recent Posts</h2>}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {rest.map(p => <PostCard key={p.id} post={p}/>)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <BookOpen size={40} className="text-gray-300 mx-auto mb-3"/>
          <p className="text-gray-500 font-medium">No posts match your search</p>
          <button onClick={() => { setSearch(''); setActiveCategory('All'); }}
            className="mt-3 text-sm text-blue-600 hover:underline">Clear filters</button>
        </div>
      )}

      {/* Content Calendar Teaser */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-blue-900">📅 Content Calendar</p>
            <p className="text-xs text-blue-700 mt-1">2 posts per week keeps your site ranking on Google. Next scheduled: <strong>May 12 — Calvert County Market Report</strong></p>
          </div>
          <div className="flex gap-2">
            <button className="text-xs font-semibold bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">Schedule Post</button>
            <button className="text-xs font-semibold border border-blue-300 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">View Calendar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
