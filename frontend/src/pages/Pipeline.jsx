import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { pipeline as pipelineApi } from '../api/client';
import { DollarSign, Flame, Thermometer, Snowflake, GripVertical } from 'lucide-react';

const STAGES = ['New Lead','Contacted','Qualifying','Active Search','New Construction','Offer Made','Under Contract','Closed Won','Closed Lost'];
const stageColors = {
  'New Lead':'border-gray-300 bg-gray-50',
  'Contacted':'border-blue-300 bg-blue-50',
  'Qualifying':'border-indigo-300 bg-indigo-50',
  'Active Search':'border-amber-300 bg-amber-50',
  'New Construction':'border-orange-300 bg-orange-50',
  'Offer Made':'border-orange-300 bg-orange-50',
  'Under Contract':'border-purple-300 bg-purple-50',
  'Closed Won':'border-green-300 bg-green-50',
  'Closed Lost':'border-gray-200 bg-gray-50',
};
const stageHeaderColors = {
  'New Lead':'bg-gray-500','Contacted':'bg-blue-500','Qualifying':'bg-indigo-500',
  'Active Search':'bg-amber-500','New Construction':'bg-orange-400','Offer Made':'bg-orange-500',
  'Under Contract':'bg-purple-500','Closed Won':'bg-green-500','Closed Lost':'bg-gray-400',
};
const tempStyle = { Hot:'bg-red-100 text-red-700', Warm:'bg-amber-100 text-amber-700', Cold:'bg-blue-100 text-blue-700' };
const tempIcon = { Hot:<Flame size={10}/>, Warm:<Thermometer size={10}/>, Cold:<Snowflake size={10}/> };

function DealCard({ deal, onMove, onDragStart }) {
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e) => {
    setDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('dealId', deal.id);
    e.dataTransfer.setData('fromStage', deal.stage);
    onDragStart(deal);
  };

  const handleDragEnd = () => setDragging(false);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`rounded-lg border-2 p-3 mb-2 bg-white hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none
        ${stageColors[deal.stage] || ''}
        ${dragging ? 'opacity-40 scale-95 rotate-1' : 'opacity-100'}
      `}
    >
      {/* Drag handle row */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <GripVertical size={13} className="text-gray-300 flex-shrink-0 mt-0.5"/>
          <Link
            to={`/leads/${deal.lead?.id}`}
            onClick={e => e.stopPropagation()}
            className="text-sm font-semibold text-gray-900 hover:text-blue-600 leading-tight truncate"
          >
            {deal.lead?.firstName} {deal.lead?.lastName}
          </Link>
        </div>
        <span className={`badge ${tempStyle[deal.lead?.temperature] || 'bg-gray-100 text-gray-600'} gap-0.5 flex-shrink-0 ml-2`}>
          {tempIcon[deal.lead?.temperature]}{deal.lead?.temperature}
        </span>
      </div>

      {deal.propertyAddress && (
        <p className="text-xs text-gray-500 mb-2 truncate pl-5">{deal.propertyAddress}</p>
      )}

      <div className="flex items-center justify-between pl-5">
        {deal.value ? (
          <span className="text-xs font-bold text-gray-900 flex items-center gap-0.5">
            <DollarSign size={11}/>{(deal.value/1000).toFixed(0)}K
          </span>
        ) : <span/>}
        {deal.commission && (
          <span className="text-xs text-green-600 font-medium">${(deal.commission/1000).toFixed(1)}K GCI</span>
        )}
      </div>

      {deal.agent && <p className="text-[11px] text-gray-400 mt-1.5 pl-5">{deal.agent.name}</p>}
      {deal.closeDate && (
        <p className="text-[11px] text-gray-400 pl-5">
          Close: {new Date(deal.closeDate).toLocaleDateString('en-US', { month:'short', day:'numeric' })}
        </p>
      )}

      {/* Move buttons — still available as fallback */}
      <div className="flex gap-1 mt-2 pt-2 border-t border-gray-100">
        {STAGES.indexOf(deal.stage) > 0 && (
          <button
            onClick={e => { e.stopPropagation(); onMove(deal.id, STAGES[STAGES.indexOf(deal.stage) - 1]); }}
            className="flex-1 text-[10px] text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded py-1 transition-colors text-center"
          >
            ← Back
          </button>
        )}
        {STAGES.indexOf(deal.stage) < STAGES.length - 1 && (
          <button
            onClick={e => { e.stopPropagation(); onMove(deal.id, STAGES[STAGES.indexOf(deal.stage) + 1]); }}
            className="flex-1 text-[10px] text-white bg-blue-600 hover:bg-blue-700 rounded py-1 transition-colors text-center"
          >
            Advance →
          </button>
        )}
      </div>
    </div>
  );
}

function KanbanColumn({ stage, col, onMove, dragOverStage, onDragOver, onDragLeave, onDrop }) {
  const isOver = dragOverStage === stage;

  return (
    <div className="flex-shrink-0 w-56">
      {/* Column Header */}
      <div className={`rounded-lg px-3 py-2 mb-2 flex items-center justify-between ${stageHeaderColors[stage]}`}>
        <span className="text-xs font-bold text-white uppercase tracking-wide">{stage}</span>
        <span className="text-xs text-white/80 font-medium bg-black/20 px-1.5 py-0.5 rounded-full">
          {col.deals.length}
        </span>
      </div>

      {/* Stage metrics */}
      {col.deals.length > 0 && (
        <div className="text-[11px] text-gray-400 mb-2 px-1">
          ${(col.totalValue/1000).toFixed(0)}K vol · ${(col.totalCommission/1000).toFixed(0)}K GCI
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`kanban-col min-h-[80px] rounded-lg transition-all duration-150 p-1 -m-1
          ${isOver
            ? 'bg-blue-50 ring-2 ring-blue-400 ring-dashed'
            : 'bg-transparent'
          }
        `}
      >
        {col.deals.map(deal => (
          <DealCard
            key={deal.id}
            deal={deal}
            onMove={onMove}
            onDragStart={() => {}}
          />
        ))}
        {col.deals.length === 0 && (
          <div className={`border-2 border-dashed rounded-lg p-4 text-center text-xs transition-colors
            ${isOver ? 'border-blue-400 text-blue-400 bg-blue-50' : 'border-gray-200 text-gray-400'}
          `}>
            {isOver ? 'Drop here' : 'Empty'}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Pipeline() {
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [totals, setTotals]       = useState({ value: 0, commission: 0 });
  const [dragOverStage, setDragOverStage] = useState(null);
  const [draggingDeal, setDraggingDeal]   = useState(null);

  const load = () => {
    pipelineApi.get().then(d => {
      setData(d);
      let tv = 0, tc = 0;
      Object.values(d.pipeline).forEach(col => { tv += col.totalValue; tc += col.totalCommission; });
      setTotals({ value: tv, commission: tc });
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const moveStage = async (dealId, stage) => {
    await pipelineApi.moveStage(dealId, stage);
    load();
  };

  // Drag handlers
  const handleDragOver = (e, stage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const handleDragLeave = (e, stage) => {
    // Only clear if we're leaving the column entirely (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverStage(null);
    }
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    setDragOverStage(null);
    const dealId    = e.dataTransfer.getData('dealId');
    const fromStage = e.dataTransfer.getData('fromStage');
    if (!dealId || fromStage === targetStage) return;
    await moveStage(dealId, targetStage);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"/>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pipeline</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            ${(totals.value/1000).toFixed(0)}K deal volume · ${(totals.commission/1000).toFixed(0)}K estimated commission
            <span className="ml-2 text-gray-400">· Drag cards to move between stages</span>
          </p>
        </div>
        <div className="flex gap-3">
          <div className="card px-4 py-2 text-center">
            <p className="text-xs text-gray-500">Pipeline Value</p>
            <p className="text-lg font-bold text-gray-900">${(totals.value/1000).toFixed(0)}K</p>
          </div>
          <div className="card px-4 py-2 text-center">
            <p className="text-xs text-gray-500">Est. GCI</p>
            <p className="text-lg font-bold text-green-600">${(totals.commission/1000).toFixed(0)}K</p>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.map(stage => {
          const col = data.pipeline[stage] || { deals: [], totalValue: 0, totalCommission: 0 };
          return (
            <KanbanColumn
              key={stage}
              stage={stage}
              col={col}
              onMove={moveStage}
              dragOverStage={dragOverStage}
              onDragOver={e => handleDragOver(e, stage)}
              onDragLeave={e => handleDragLeave(e, stage)}
              onDrop={e => handleDrop(e, stage)}
            />
          );
        })}
      </div>
    </div>
  );
}
