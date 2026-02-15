
import React, { useState, useEffect, useCallback } from 'react';
import { MenuItem, OrderItem, Order, ViewState } from './types';
import { saveOrder } from './db';
import MenuGrid from './components/MenuGrid';
import OrderPanel from './components/OrderPanel';
import ManagerDashboard from './components/ManagerDashboard';
import Receipt from './components/Receipt';
import PinOverlay from './components/PinOverlay';
import CheckoutSuccess from './components/CheckoutSuccess';

const INITIAL_MENU: MenuItem[] = [
  { id: '1', name: 'Burger', price: 85, category: 'Mains' },
  { id: '2', name: 'Chicken Wings', price: 75, category: 'Mains' },
  { id: '3', name: 'Large Chips', price: 45, category: 'Sides' },
  { id: '4', name: 'Greek Salad', price: 55, category: 'Sides' },
  { id: '5', name: 'Coke 330ml', price: 22, category: 'Drinks' },
  { id: '6', name: 'Water 500ml', price: 18, category: 'Drinks' },
  { id: '7', name: 'Coffee', price: 30, category: 'Drinks' },
  { id: '8', name: 'Ice Cream', price: 40, category: 'Dessert' },
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('pos');
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('qs_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<Order | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProformaMode, setIsProformaMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('qs_menu', JSON.stringify(menu));
  }, [menu]);

  const addToOrder = useCallback((item: MenuItem) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    if (window.navigator.vibrate) window.navigator.vibrate(25);
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    setOrderItems(prev => {
      return prev.map(i => {
        if (i.id === id) {
          const newQty = Math.max(0, i.qty + delta);
          return { ...i, qty: newQty };
        }
        return i;
      }).filter(i => i.qty > 0);
    });
  }, []);

  const handleProforma = (discount: number, tip: number, splitCount: number) => {
    if (orderItems.length === 0) return;
    const subtotal = orderItems.reduce((acc, i) => acc + i.price * i.qty, 0);
    const total = Math.max(0, subtotal - discount + tip);
    
    const proforma: Order = {
      id: `PRO-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      items: [...orderItems],
      subtotal,
      discount,
      tip,
      total,
      timestamp: Date.now(),
      splitCount
    };
    setCurrentReceipt(proforma);
    setIsProformaMode(true);
    setShowSuccess(true);
  };

  const handleCheckout = async (paymentType: 'cash' | 'card', discount: number, tip: number, splitCount: number) => {
    if (orderItems.length === 0) return;

    const subtotal = orderItems.reduce((acc, i) => acc + i.price * i.qty, 0);
    const total = Math.max(0, subtotal - discount + tip);
    
    const newOrder: Order = {
      id: `${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      items: [...orderItems],
      subtotal,
      discount,
      tip,
      total,
      paymentType,
      timestamp: Date.now(),
      splitCount
    };

    try {
      await saveOrder(newOrder);
      setCurrentReceipt(newOrder);
      setIsProformaMode(false);
      setShowSuccess(true);
      setOrderItems([]);
    } catch (err) {
      console.error(err);
      alert("Offline Save Failed");
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    // Only clear the receipt if we are not in proforma mode or if we're starting a new txn
    if (!isProformaMode) {
      setCurrentReceipt(null);
    }
    // If it was proforma, currentReceipt stays populated for the print area until the next action
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-[#080808] overflow-hidden">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0A0A0A] border-b border-white/5">
           <div className="flex items-center gap-4">
             <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-black">Q</div>
             <h1 className="font-black text-xl tracking-tighter text-white">QuickServe</h1>
             <div className="h-4 w-[1px] bg-white/10 hidden sm:block"></div>
             <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest hidden sm:block">POS TERMINAL v2.5</p>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="bg-white/5 px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Local Engine</span>
              </div>
              <button 
                onClick={() => setIsPinOpen(true)} 
                className="hover:bg-white/5 p-2 rounded-xl transition-all text-slate-400 active-press"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
           {view === 'pos' ? (
             <MenuGrid menu={menu} onAdd={addToOrder} />
           ) : (
             <ManagerDashboard onBack={() => setView('pos')} menu={menu} onUpdateMenu={setMenu} />
           )}
        </div>
      </div>

      <div className="w-full md:w-[420px] bg-[#0A0A0A] flex flex-col h-[50vh] md:h-full border-t md:border-t-0 md:border-l border-white/5">
        <OrderPanel 
          items={orderItems} 
          onUpdateQty={updateQty} 
          onClear={() => setOrderItems([])} 
          onCheckout={handleCheckout}
          onProforma={handleProforma}
        />
      </div>

      {isPinOpen && <PinOverlay onSuccess={() => { setIsPinOpen(false); setView('manager'); }} onClose={() => setIsPinOpen(false)} />}
      
      {showSuccess && currentReceipt && (
        <CheckoutSuccess 
          order={currentReceipt} 
          onClose={handleCloseSuccess} 
          isProforma={isProformaMode}
        />
      )}

      {currentReceipt && (
        <div id="receipt-print-area" className="hidden print:block">
          <Receipt order={currentReceipt} />
        </div>
      )}
    </div>
  );
};

export default App;
