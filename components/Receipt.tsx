
import React from 'react';
import { Order } from '../types';

interface ReceiptProps {
  order: Order;
}

const Receipt: React.FC<ReceiptProps> = ({ order }) => {
  return (
    <div className="receipt-content bg-white text-black p-8 font-mono max-w-[80mm] mx-auto leading-tight selection:bg-none">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1">QUICKSERVE</h1>
        <p className="text-[9px] font-bold tracking-[0.4em] uppercase opacity-60">Gastronomy Terminal</p>
        <div className="mt-8 space-y-1.5 text-[9px] uppercase font-bold">
          <p>123 Gourmet Street, Waterfront</p>
          <p>Cape Town, ZA 8001</p>
          <p>Tel: +27 21 555 0123</p>
          <p className="pt-3 border-t border-black/10 mt-3 font-black">VAT REG: 4560123987</p>
        </div>
      </div>

      <div className="border-t border-b border-black py-3 mb-8">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
          <span>{order.paymentType ? `TXN: #${order.id}` : 'PRO-FORMA BILL'}</span>
          <span>
            {new Date(order.timestamp).toLocaleDateString('en-ZA')} {new Date(order.timestamp).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <table className="w-full text-[10px] mb-8 border-collapse">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="text-left py-2 font-black uppercase tracking-tighter">Description</th>
            <th className="text-center py-2 font-black uppercase w-8">Qty</th>
            <th className="text-right py-2 font-black uppercase w-20">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {order.items.map(item => (
            <tr key={item.id}>
              <td className="py-3 pr-2 font-bold uppercase text-[9px] leading-tight">{item.name}</td>
              <td className="text-center py-3">{item.qty}</td>
              <td className="text-right py-3 font-bold tabular-nums">R{(item.qty * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t-2 border-black pt-5 space-y-2 text-[11px] font-bold">
        <div className="flex justify-between items-center opacity-60">
          <span className="uppercase tracking-tight">Original Subtotal</span>
          <span className="tabular-nums">R{order.subtotal.toFixed(2)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between items-center italic text-gray-500">
            <span className="uppercase tracking-tight">Discounts Applied</span>
            <span className="tabular-nums">-R{order.discount.toFixed(2)}</span>
          </div>
        )}
        {order.tip > 0 && (
          <div className="flex justify-between items-center">
            <span className="uppercase tracking-tight">Service Gratuity</span>
            <span className="tabular-nums">R{order.tip.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between items-center font-black text-sm border-t-2 border-black mt-4 pt-4">
          <span className="uppercase tracking-tighter text-base">Amount Payable</span>
          <span className="text-2xl tabular-nums tracking-tighter">R{order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-10 space-y-2 text-[9px] border-t border-black/5 pt-5">
        <div className="flex justify-between font-bold">
          <span className="uppercase tracking-[0.2em] opacity-50">Settlement:</span>
          <span className="uppercase tracking-[0.2em]">{order.paymentType || 'UNPAID'}</span>
        </div>
        {order.splitCount > 1 && (
          <div className="bg-gray-100 p-3 text-center border border-gray-200 rounded-sm">
            <p className="font-black italic text-[8px] uppercase tracking-[0.3em]">
              Suggested Split ({order.splitCount}): R{(order.total / order.splitCount).toFixed(2)} Each
            </p>
          </div>
        )}
      </div>

      <div className="mt-16 text-center space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Pleasure Serving You</p>
        <div className="flex items-center justify-center gap-4 pt-8 border-t border-gray-100 grayscale opacity-20">
          <div className="h-[0.5px] bg-black flex-1"></div>
          <span className="text-[7px] font-black uppercase tracking-[0.5em] whitespace-nowrap">
            QuickServe POS System
          </span>
          <div className="h-[0.5px] bg-black flex-1"></div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
