
import React, { useState, useEffect } from 'react';
import { X, Coins, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Player } from '../types';

interface RoundEntryProps {
  dealer: Player;
  players: Player[];
  onClose: () => void;
  onSubmit: (scores: Record<string, number>) => void;
}

const RoundEntry: React.FC<RoundEntryProps> = ({ dealer, players, onClose, onSubmit }) => {
  const [playerScores, setPlayerScores] = useState<Record<string, string>>(
    players.reduce((acc, p) => ({ ...acc, [p.id]: '' }), {})
  );

  const handleScoreChange = (id: string, val: string) => {
    // Only allow numbers and minus sign
    if (val !== '' && !/^-?\d*$/.test(val)) return;
    setPlayerScores(prev => ({ ...prev, [id]: val }));
  };

  // Explicitly casting Object.values to string[] and typing the reduce parameters to resolve 'unknown' type errors
  const calculateDealerScore = () => {
    const totalPlayersSum = (Object.values(playerScores) as string[]).reduce((sum: number, val: string) => {
      return sum + (parseInt(val) || 0);
    }, 0);
    return -totalPlayersSum;
  };

  const handleSubmit = () => {
    const finalScores: Record<string, number> = {};
    
    // Convert strings to numbers
    players.forEach(p => {
      finalScores[p.id] = parseInt(playerScores[p.id]) || 0;
    });

    // Dealer score is the negative sum of all player scores
    finalScores[dealer.id] = calculateDealerScore();

    onSubmit(finalScores);
  };

  const dealerResult = calculateDealerScore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <Coins className="text-emerald-500" size={20} />
            <h3 className="font-bold text-slate-800">Nhập Kết Quả Vòng</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* Dealer Status */}
          <div className="bg-slate-100 rounded-2xl p-5 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-lg shadow-lg">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nhà Cái</p>
                <p className="font-bold text-xl text-slate-800">{dealer.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lợi nhuận vòng</p>
              <p className={`text-2xl font-black ${dealerResult >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {dealerResult > 0 ? '+' : ''}{dealerResult.toLocaleString()}
              </p>
            </div>
          </div>

          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 px-1">Kết quả người chơi</p>
          <div className="space-y-4">
            {players.map(player => (
              <div key={player.id} className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{player.name}</p>
                </div>
                <div className="w-32 relative">
                  <input 
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={playerScores[player.id]}
                    onChange={(e) => handleScoreChange(player.id, e.target.value)}
                    className="w-full bg-white border border-slate-300 px-4 py-2 rounded-lg text-right font-bold tabular-nums outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-[2] py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={20} />
            Lưu Kết Quả
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoundEntry;
