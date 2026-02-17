
import React from 'react';
import { PlayerStats } from '../types';
import { UserCircle2, ShieldCheck, ArrowRightLeft, Crown, TrendingDown } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Biểu đồ cột tổng quan lời/lỗ */}
      <div className="px-4 pt-4">
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Biểu đồ lời / lỗ
          </p>
          {stats.length > 0 && (
            <>
              {(() => {
                const maxAbsTotal = Math.max(
                  ...stats.map((p) => Math.abs(p.total)),
                  1
                );

                const best = [...stats].sort((a, b) => b.total - a.total)[0];
                const worst = [...stats].sort((a, b) => a.total - b.total)[0];

                const bestExists = best && best.total > 0;
                const worstExists = worst && worst.total < 0;

                return (
                  <>
                    {/* 2 thẻ lớn: lãi nhất / lỗ nhất */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 flex items-center justify-center">
                        <div className="text-center">
                          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20">
                            <Crown size={22} />
                          </div>
                          <p className="mt-3 text-xs font-black uppercase tracking-widest text-emerald-700">
                            Lãi nhiều nhất
                          </p>
                          <p className="mt-1 text-lg font-black text-slate-900">
                            {bestExists ? best.name : 'Chưa có'}
                          </p>
                          <p className="mt-0.5 text-emerald-600 font-black tabular-nums">
                            {bestExists ? `+${best.total.toLocaleString()}` : '—'}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 flex items-center justify-center">
                        <div className="text-center">
                          <div className="mx-auto w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/20">
                            <TrendingDown size={22} />
                          </div>
                          <p className="mt-3 text-xs font-black uppercase tracking-widest text-rose-700">
                            Lỗ nhiều nhất
                          </p>
                          <p className="mt-1 text-lg font-black text-slate-900">
                            {worstExists ? worst.name : 'Chưa có'}
                          </p>
                          <p className="mt-0.5 text-rose-600 font-black tabular-nums">
                            {worstExists ? `${worst.total.toLocaleString()}` : '—'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Thanh tỉ lệ lời/lỗ theo từng người */}
                    <div className="space-y-4">
                      {stats.map((player) => {
                        const ratio = Math.min(Math.abs(player.total) / maxAbsTotal, 1);
                        const halfWidthPct = `${Math.round(ratio * 50 * 1000) / 1000}%`; // half bar (0..50%)

                        const valueClass =
                          player.total > 0
                            ? 'text-emerald-600'
                            : player.total < 0
                            ? 'text-rose-600'
                            : 'text-slate-400';

                        return (
                          <div key={player.id} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-black uppercase tracking-wider text-slate-600">
                                {player.name}
                              </p>
                              <p className={`text-xs font-black tabular-nums ${valueClass}`}>
                                {player.total > 0 ? '+' : ''}{player.total.toLocaleString()}
                              </p>
                            </div>

                            <div className="relative h-3 rounded-full bg-slate-200/70 overflow-hidden">
                              <div className="absolute inset-y-0 left-1/2 w-px bg-slate-300/70" />
                              {player.total !== 0 && (
                                <div
                                  className={`absolute inset-y-0 rounded-full ${
                                    player.total > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                                  }`}
                                  style={
                                    player.total > 0
                                      ? { left: '50%', width: halfWidthPct }
                                      : { right: '50%', width: halfWidthPct }
                                  }
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}

                      <p className="pt-2 text-center text-[11px] italic text-slate-400">
                        Thanh biểu đồ hiển thị tỉ lệ thắng/thua so với người cao nhất
                      </p>
                    </div>
                  </>
                );
              })()}
            </>
          )}
        </div>
      </div>

      {/* Bảng chi tiết từng người chơi */}
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
                      Điều phối viên
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                  {player.isDealer ? 'Đang điều phối' : 'Người chơi'}
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
                  title="Đổi người điều phối"
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
    </div>
  );
};

export default SummaryBoard;
