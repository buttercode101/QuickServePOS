
import React, { useState } from 'react';
import { OrderItem } from '../types';

interface OrderPanelProps {
  items: OrderItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onClear: () => void;
  onCheckout: (type: 'cash' | 'card', discount: number, tip: number, split: number) => void;
  onProforma: (discount: number, tip: number, split: number) => void;
}

type CheckoutStep = 'order' | 'review' | 'payment';

const OrderPanel: React.FC<OrderPanelProps> = ({ items, onUpdateQty, onClear, onCheckout, onProforma }) => {
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('order');
  const [discount, setDiscount] = useState(0);
  const [tip, setTip] = useState(0);
  const [split, setSplit] = useState(1);

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const totalAfterDiscount = Math.max(0, subtotal - discount);
  const finalTotal = Math.max(0, totalAfterDiscount + tip);

  const handleQuickDiscount = (val: number) => setDiscount(prev => (prev === val ? 0 : val));
  
  const handleQuickTip = (percentage: number) => {
    const calculated = Math.round(totalAfterDiscount * (percentage / 100));
    setTip(prev => (prev === calculated ? 0 : calculated));
  };

  const resetLocalState = () => {
    setCheckoutStep('order');
    setDiscount(0);
    setTip(0);
    setSplit(1);
  };

  if (checkoutStep === 'order') {
    return (
      <div className="flex flex-col h-full bg-[#0A0A0A]">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Order Bucket</h2>
          <button 
            onClick={onClear} 
            className="text-[9px] font-black text-rose-500 uppercase tracking-widest px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 active-press transition-all"
          >
            Clear
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-[#0A0A0A]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-800 opacity-60">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
               <p className="text-[11px] font-black uppercase tracking-[0.2em]">Bag is empty</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 group active-press transition-all">
                <div className="flex-1 mr-4">
                  <div className="font-bold text-white text-sm uppercase leading-tight">{item.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5 tracking-tight">R{item.price.toFixed(2)} ea</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-black/50 rounded-xl p-1 border border-white/5">
                    <button onClick={() => onUpdateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-slate-400 font-black">-</button>
                    <span className="w-8 text-center text-xs font-black text-white font-mono">{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-slate-400 font-black">+</button>
                  </div>
                  <span className="w-20 text-right font-mono font-black text-emerald-400">R{(item.price * item.qty).toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 bg-[#080808] border-t border-white/5 space-y-6">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Subtotal</span>
            <span className="text-5xl font-black text-white font-mono tracking-tighter">R{subtotal.toFixed(2)}</span>
          </div>

          <button 
            disabled={items.length === 0}
            onClick={() => setCheckoutStep('review')}
            className="w-full py-6 bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-[2rem] font-black text-xl text-black active-press transition-all flex items-center justify-center gap-4 border-b-4 border-emerald-700 shadow-xl shadow-emerald-500/10"
          >
            REVIEW & ADJUST
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    );
  }

  if (checkoutStep === 'review') {
    return (
      <div className="flex flex-col h-full bg-[#0A0A0A] p-8">
        <div className="flex items-center gap-5 mb-8">
            <button onClick={() => setCheckoutStep('order')} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all active-press">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Bill Review</h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar pb-6">
            <div className="bg-black/40 rounded-3xl border border-white/5 p-6 space-y-3 font-mono text-[11px] shadow-sm">
                <p className="text-center font-black text-slate-600 border-b border-white/5 pb-4 mb-4 uppercase tracking-[0.3em] text-[10px]">Transaction Summary</p>
                {items.map(i => (
                  <div key={i.id} className="flex justify-between items-center py-0.5">
                    <span className="uppercase text-slate-400 truncate pr-4">{i.qty}x {i.name}</span>
                    <span className="font-bold text-white">R{(i.qty * i.price).toFixed(2)}</span>
                  </div>
                ))}
            </div>

            <div className="space-y-8">
               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-1">Discounting</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[5, 10, 20].map(val => (
                      <button 
                        key={val}
                        onClick={() => handleQuickDiscount(val)}
                        className={`py-4 rounded-2xl text-xs font-black border transition-all ${
                          discount === val ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'
                        }`}
                      >
                        -R{val}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between pl-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Gratuity (Tip)</p>
                    <span className="text-[10px] font-black text-emerald-500">+ R{tip.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {[5, 10, 15, 20].map(val => {
                      const calculated = Math.round(totalAfterDiscount * (val / 100));
                      return (
                        <button 
                          key={val}
                          onClick={() => handleQuickTip(val)}
                          className={`py-4 rounded-2xl text-[10px] font-black border transition-all ${
                            tip === calculated ? 'bg-emerald-500 border-emerald-500 text-black shadow-lg' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'
                          }`}
                        >
                          {val}%
                        </button>
                      );
                    })}
                  </div>
               </div>
               
               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-1">Split Check</p>
                  <div className="grid grid-cols-4 gap-2.5">
                    {[1, 2, 3, 4].map(val => (
                      <button 
                        key={val}
                        onClick={() => setSplit(val)}
                        className={`py-4 rounded-2xl text-xs font-black border transition-all ${
                          split === val ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => onProforma(discount, tip, split)}
                    className="flex-1 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active-press flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                    Print Bill
                </button>
                <button 
                    onClick={() => onProforma(discount, tip, split)}
                    className="flex-1 py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl font-black text-[10px] uppercase tracking-widest active-press flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    Send Bill
                </button>
            </div>
        </div>

        <div className="pt-8 space-y-6">
            <div className="flex justify-between items-end bg-white/5 p-6 rounded-3xl border border-white/5 shadow-inner">
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Savings: -R{discount.toFixed(2)}</p>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Gratuity: +R{tip.toFixed(2)}</p>
                </div>
                <div className="text-right">
                    <p className="text-4xl font-black text-white font-mono tracking-tighter leading-none">R{finalTotal.toFixed(2)}</p>
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">Total Verified</p>
                </div>
            </div>
            <button 
                onClick={() => setCheckoutStep('payment')}
                className="w-full py-6 bg-white text-black rounded-[2rem] font-black text-xl active-press flex items-center justify-center gap-4 shadow-2xl transition-all"
            >
                COLLECT PAYMENT
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-8 bg-[#0A0A0A]">
      <div className="flex items-center gap-5 mb-10">
          <button onClick={() => setCheckoutStep('review')} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl text-slate-400 hover:text-white active-press transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Finalize</h2>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar pb-6">
          <div className="bg-[#0E0E0E] p-10 rounded-[3rem] border border-white/5 flex flex-col items-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Total Amount Collected</p>
              <h3 className="text-7xl font-black text-white font-mono tracking-tighter">R{finalTotal.toFixed(2)}</h3>
              {split > 1 && (
                  <p className="mt-6 px-6 py-2 bg-indigo-500/10 text-indigo-400 font-black rounded-full text-[10px] border border-indigo-500/20 uppercase tracking-widest">
                    R{(finalTotal/split).toFixed(2)} each — {split} guests
                  </p>
              )}
          </div>

          <div className="space-y-6 pt-10">
              <p className="text-slate-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4 text-center opacity-60">Settlement Method</p>
              <button 
                  onClick={() => { onCheckout('cash', discount, tip, split); resetLocalState(); }}
                  className="w-full py-8 bg-emerald-500 rounded-[2.5rem] font-black text-2xl text-black active-press shadow-2xl shadow-emerald-500/10 flex items-center justify-center gap-6 border-b-8 border-emerald-700 transition-all"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                  CASH PAYMENT
              </button>
              <button 
                  onClick={() => { onCheckout('card', discount, tip, split); resetLocalState(); }}
                  className="w-full py-8 bg-blue-600 rounded-[2.5rem] font-black text-2xl text-white active-press shadow-2xl shadow-blue-900/10 flex items-center justify-center gap-6 border-b-8 border-blue-800 transition-all"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  CARD PAYMENT
              </button>
          </div>
      </div>
    </div>
  );
};

export default OrderPanel;
