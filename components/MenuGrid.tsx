
import React, { useState } from 'react';
import { MenuItem } from '../types';

interface MenuGridProps {
  menu: MenuItem[];
  onAdd: (item: MenuItem) => void;
}

const MenuGrid: React.FC<MenuGridProps> = ({ menu, onAdd }) => {
  const categories = Array.from(new Set(menu.map(i => i.category)));
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const filteredMenu = selectedCat 
    ? menu.filter(i => i.category === selectedCat)
    : menu;

  return (
    <div className="p-6 md:p-8">
      {/* Category Pill Navigation */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-8 sticky top-0 bg-[#080808]/90 backdrop-blur-md z-10 -mx-8 px-8">
        <button 
          onClick={() => setSelectedCat(null)}
          className={`px-7 py-3 rounded-2xl whitespace-nowrap text-[11px] font-black uppercase tracking-[0.2em] transition-all border ${
            selectedCat === null 
            ? 'bg-emerald-500 text-black border-emerald-500 shadow-xl shadow-emerald-500/10' 
            : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10 hover:text-white'
          }`}
        >
          All Menu
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-7 py-3 rounded-2xl whitespace-nowrap text-[11px] font-black uppercase tracking-[0.2em] transition-all border ${
              selectedCat === cat 
              ? 'bg-emerald-500 text-black border-emerald-500 shadow-xl shadow-emerald-500/10' 
              : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* High-Fidelity Items Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredMenu.map(item => (
          <button
            key={item.id}
            onClick={() => onAdd(item)}
            className="group relative flex flex-col justify-between p-6 bg-[#0E0E0E] border border-white/5 rounded-3xl text-left transition-all active-press hover:bg-[#121212] hover:border-white/10 shadow-sm"
          >
            <div>
              <div className="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em] mb-2">{item.category}</div>
              <div className="font-bold text-lg text-white leading-tight mb-4 group-hover:text-emerald-400 transition-colors">{item.name}</div>
            </div>
            
            <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Price</span>
                <span className="text-2xl font-black text-white font-mono mt-1">R{item.price}</span>
              </div>
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuGrid;
