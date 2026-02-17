
import React from 'react';
import { PlayerStats } from '../types';
import { UserCircle2, ShieldCheck, ArrowRightLeft } from 'lucide-react';

interface SummaryBoardProps {
  stats: PlayerStats[];
  onSwitchDealer: (id: string) => void;
}

const SummaryBoard: React.FC<SummaryBoardProps> = ({ stats, onSwitchDealer }) => {
  if (stats.length === 0) return null;

  // Sorting: Dealer first, then by score descending
  const sortedStats = [...stats].sort((a, b) => {
    if (a.isDealer) return -1;
    if (b.isDealer) return 1;
    return b.total - a.total;
  });

  return (
    <div className="divide-y divide-slate-100">
      {sortedStats.map((player) => (
        <div 
          key={player.id} 
          className={`flex items-center justify-between p-4 transition-colors ${
            player.isDealer ? 'bg-emerald-50/50' : 'hover:bg-slate-50/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl transition-all shadow-sm ${
              player.isDealer 
                ? 'bg-emerald-600 text-white' 
                : 'bg-white border border-slate-200 text-slate-400'
            }`}>
              {player.isDealer ? <ShieldCheck size={22} /> : <UserCircle2 size={22} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-slate-900">{player.name}</p>
                {player.isDealer && (
                  <span className="text-[10px] font-black uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full tracking-wider shadow-sm">
                    Nhà Cái
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                {player.isDealer ? 'Đang cầm cái' : 'Người chơi'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className={`text-xl font-black tabular-nums tracking-tight ${
              player.total > 0 ? 'text-emerald-600' : player.total < 0 ? 'text-rose-600' : 'text-slate-400'
            }`}>
              {player.total > 0 ? '+' : ''}{player.total.toLocaleString()}
            </div>
            
            {!player.isDealer && (
              <button 
                onClick={() => onSwitchDealer(player.id)}
                className="group flex flex-col items-center justify-center p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100"
                title="Đổi làm Nhà Cái"
              >
                <ArrowRightLeft size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-[8px] font-bold mt-0.5 opacity-0 group-hover:opacity-100 uppercase">Làm Cái</span>
              </button>
            )}
            {player.isDealer && (
              <div className="w-[34px]" /> // Spacer to maintain alignment
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryBoard;
