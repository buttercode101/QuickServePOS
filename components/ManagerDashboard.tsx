
import React, { useState, useEffect } from 'react';
import { Order, MenuItem } from '../types';
import { getTodayOrders, clearAllData } from '../db';

interface ManagerDashboardProps {
  onBack: () => void;
  menu: MenuItem[];
  onUpdateMenu: (menu: MenuItem[]) => void;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ onBack, menu, onUpdateMenu }) => {
  const [stats, setStats] = useState({ revenue: 0, count: 0, cash: 0, card: 0 });
  const [activeTab, setActiveTab] = useState<'reports' | 'menu'>('reports');

  useEffect(() => {
    getTodayOrders().then(orders => {
      const revenue = orders.reduce((s, o) => s + o.total, 0);
      const cash = orders.filter(o => o.paymentType === 'cash').reduce((s, o) => s + o.total, 0);
      const card = orders.filter(o => o.paymentType === 'card').reduce((s, o) => s + o.total, 0);
      setStats({ revenue, count: orders.length, cash, card });
    });
  }, []);

  const handlePriceChange = (id: string, newPrice: string) => {
    const val = parseFloat(newPrice) || 0;
    onUpdateMenu(menu.map(item => item.id === id ? { ...item, price: val } : item));
  };

  const handleReset = async () => {
    if (confirm("Confirm complete data wipe? This action is irreversible.")) {
      await clearAllData();
      location.reload();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#080808]">
      <div className="px-8 py-6 bg-[#0A0A0A] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all active-press">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <h2 className="text-3xl font-black text-white tracking-tighter">Command Center</h2>
        </div>
        <div className="flex bg-white/5 rounded-[1.5rem] p-1.5 border border-white/5">
           <button 
             onClick={() => setActiveTab('reports')}
             className={`px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/10' : 'text-slate-500 hover:text-white'}`}
           >
             Performance
           </button>
           <button 
             onClick={() => setActiveTab('menu')}
             className={`px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'menu' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/10' : 'text-slate-500 hover:text-white'}`}
           >
             Catalog Edit
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
        {activeTab === 'reports' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { label: 'Total Gross', val: `R${stats.revenue.toFixed(2)}`, accent: 'text-white' },
                 { label: 'Transactions', val: stats.count, accent: 'text-white' },
                 { label: 'Cash Intake', val: `R${stats.cash.toFixed(2)}`, accent: 'text-emerald-400' },
                 { label: 'Card Intake', val: `R${stats.card.toFixed(2)}`, accent: 'text-blue-400' }
               ].map((card, idx) => (
                 <div key={idx} className="bg-[#0E0E0E] border border-white/5 p-8 rounded-[2.5rem] shadow-sm">
                    <p className="text-slate-600 font-black text-[9px] uppercase tracking-[0.3em] mb-2">{card.label}</p>
                    <p className={`text-3xl font-black font-mono tracking-tighter ${card.accent}`}>{card.val}</p>
                 </div>
               ))}
            </div>

            <div className="bg-[#0E0E0E] border border-white/5 rounded-[2.5rem] overflow-hidden">
               <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-black/20">
                 <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Ledger Snapshots</h3>
                 <button onClick={handleReset} className="text-[9px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/5 px-4 py-2 rounded-full border border-rose-500/20 active-press">Flush Store</button>
               </div>
               <div className="p-20 flex flex-col gap-6 text-slate-800 items-center justify-center opacity-40">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  <p className="text-[11px] font-black uppercase tracking-[0.3em]">Full Audit Module via Cloud Hub v3.0</p>
               </div>
            </div>
          </>
        ) : (
          <div className="max-w-5xl space-y-8">
             <div className="bg-[#0E0E0E] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-black/40 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
                    <tr>
                      <th className="px-8 py-5">Product SKU</th>
                      <th className="px-8 py-5">Category</th>
                      <th className="px-8 py-5">Unit Cost (R)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {menu.map(item => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-5 font-bold text-white uppercase text-sm">{item.name}</td>
                        <td className="px-8 py-5 text-slate-500 font-medium text-xs uppercase tracking-widest">{item.category}</td>
                        <td className="px-8 py-5">
                           <input 
                             type="number"
                             value={item.price}
                             onChange={(e) => handlePriceChange(item.id, e.target.value)}
                             className="bg-black border border-white/10 rounded-xl px-4 py-2.5 w-32 text-white font-black font-mono focus:border-emerald-500/50 outline-none transition-all"
                           />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
             <p className="text-slate-600 text-[10px] font-medium uppercase tracking-[0.2em] italic px-2">Local memory automatically synced.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
