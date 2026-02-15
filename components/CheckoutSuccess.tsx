
import React from 'react';
import { Order } from '../types';
import Receipt from './Receipt';

interface CheckoutSuccessProps {
  order: Order;
  onClose: () => void;
  isProforma?: boolean;
}

const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({ order, onClose, isProforma = false }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const header = isProforma ? `*🧾 QUICKSERVE PRO-FORMA BILL*\n` : `*🧾 QUICKSERVE RECEIPT*\n`;
    const details = `*Order ID:* ${order.id}\n*Date:* ${new Date(order.timestamp).toLocaleString('en-ZA')}\n*--------------------------*\n`;
    
    const items = order.items.map(i => `• ${i.qty}x ${i.name.toUpperCase()} — R${(i.qty * i.price).toFixed(2)}`).join('\n');
    
    let adjustments = `\n*--------------------------*\n`;
    adjustments += `Subtotal: R${order.subtotal.toFixed(2)}\n`;
    if (order.discount > 0) adjustments += `Discount: -R${order.discount.toFixed(2)}\n`;
    if (order.tip > 0) adjustments += `Gratuity: R${order.tip.toFixed(2)}\n`;
    
    const total = `\n*TOTAL: R${order.total.toFixed(2)}*\n`;
    const payment = order.paymentType ? `_Paid via ${order.paymentType.toUpperCase()}_\n` : `_Status: UNSETTLED_\n`;
    const footer = `\n*--------------------------*\n_Thank you for your patronage!_`;

    const fullText = encodeURIComponent(header + details + items + adjustments + total + payment + footer);
    window.open(`https://wa.me/?text=${fullText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/98 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Receipt Preview */}
        <div className="hidden md:block scale-90 lg:scale-100 h-[70vh] overflow-y-auto no-scrollbar rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-white/5 bg-white p-2">
            <Receipt order={order} />
        </div>

        {/* Right Side: Actions */}
        <div className="flex flex-col gap-8 h-full md:justify-center">
            <div className="text-center md:text-left space-y-4">
                <div className={`w-24 h-24 ${isProforma ? 'bg-indigo-500' : 'bg-green-500'} rounded-[2.5rem] flex items-center justify-center mx-auto md:mx-0 shadow-2xl ${isProforma ? 'shadow-indigo-500/40' : 'shadow-green-500/40'} animate-bounce-short`}>
                   {isProforma ? (
                     <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                   ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                   )}
                </div>
                <div>
                  <h2 className="text-5xl font-black text-white tracking-tighter leading-none">{isProforma ? 'Bill Ready' : `Paid R${order.total.toFixed(2)}`}</h2>
                  <p className="text-slate-400 mt-3 text-lg font-medium opacity-80">
                    {isProforma ? 'Pro-forma bill generated for review.' : `Order #${order.id} is successfully finalized.`}
                  </p>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {/* Primary Action: Print */}
                <button 
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-4 w-full py-7 bg-white text-black rounded-[2.5rem] font-black text-2xl hover:bg-slate-100 transition-all active-press shadow-2xl shadow-white/5 border-b-8 border-slate-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                    PRINT BILL
                </button>
                
                {/* Secondary: Share */}
                <button 
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center gap-4 w-full py-6 bg-green-600/10 text-green-400 border-2 border-green-600/30 rounded-[2.5rem] font-black text-xl hover:bg-green-600 hover:text-white transition-all active-press shadow-xl shadow-green-950/20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    SEND VIA WHATSAPP
                </button>

                {/* Return */}
                <button 
                    onClick={onClose}
                    className="w-full py-5 bg-slate-900/50 text-slate-500 rounded-[2.5rem] font-black uppercase tracking-[0.25em] text-xs hover:text-white transition-all border border-white/5 active-press"
                >
                    {isProforma ? 'BACK TO REVIEW' : 'NEW TRANSACTION'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
