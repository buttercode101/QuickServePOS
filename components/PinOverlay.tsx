
import React, { useState } from 'react';

interface PinOverlayProps {
  onSuccess: () => void;
  onClose: () => void;
}

const PinOverlay: React.FC<PinOverlayProps> = ({ onSuccess, onClose }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeypad = (num: string) => {
    setError(false);
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === '0000') {
          onSuccess();
        } else {
          setError(true);
          if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center space-y-3">
            <h2 className="text-4xl font-black text-white tracking-tighter">Security Gate</h2>
            <p className="text-slate-600 font-black uppercase text-[10px] tracking-[0.4em]">Manager Authentication Required</p>
        </div>

        <div className="flex justify-center gap-5">
            {[...Array(4)].map((_, i) => (
                <div 
                    key={i} 
                    className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                        pin.length > i ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-white/10'
                    } ${error ? 'bg-rose-500 border-rose-500 animate-shake' : ''}`}
                />
            ))}
        </div>

        <div className="grid grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button 
                    key={num}
                    onClick={() => handleKeypad(num.toString())}
                    className="h-24 bg-white/5 hover:bg-white/10 border border-white/5 rounded-[2rem] text-3xl font-black text-white active-press transition-all"
                >
                    {num}
                </button>
            ))}
            <button 
                onClick={onClose}
                className="h-24 text-slate-500 font-black uppercase text-[10px] tracking-widest active-press"
            >
                Esc
            </button>
            <button 
                onClick={() => handleKeypad('0')}
                className="h-24 bg-white/5 hover:bg-white/10 border border-white/5 rounded-[2rem] text-3xl font-black text-white active-press transition-all"
            >
                0
            </button>
            <button 
                onClick={() => setPin('')}
                className="h-24 text-rose-500 font-black uppercase text-[10px] tracking-widest active-press"
            >
                Clear
            </button>
        </div>

        <p className="text-center text-slate-800 text-[10px] font-black uppercase tracking-widest">Master: 0000</p>
      </div>
    </div>
  );
};

export default PinOverlay;
