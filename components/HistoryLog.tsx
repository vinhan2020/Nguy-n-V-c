
import React from 'react';
import { Round, Player } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface HistoryLogProps {
  rounds: Round[];
  players: Player[];
}

const HistoryLog: React.FC<HistoryLogProps> = ({ rounds, players }) => {
  if (rounds.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-slate-400">
        <p className="text-sm italic">Chưa có lịch sử vòng chơi</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="py-3 px-4 font-bold text-slate-600 w-16">Vòng</th>
            <th className="py-3 px-4 font-bold text-slate-600">Người điều phối</th>
            <th className="py-3 px-4 font-bold text-slate-600 text-right">Tổng Thu/Chi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {[...rounds].reverse().map((round) => {
            const dealer = players.find(p => p.id === round.dealerId);
            const dealerScore = round.scores[round.dealerId] || 0;
            
            return (
              <React.Fragment key={round.id}>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 font-medium text-slate-500">#{round.id}</td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-slate-800">{dealer?.name || 'Unknown'}</span>
                  </td>
                  <td className={`py-4 px-4 text-right font-bold tabular-nums ${dealerScore > 0 ? 'text-emerald-600' : dealerScore < 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                    {dealerScore > 0 ? '+' : ''}{dealerScore.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-4 pb-4 pt-0">
                    <div className="bg-slate-50 rounded-lg p-3 text-xs flex flex-wrap gap-x-4 gap-y-2">
                       {/* Explicitly casting Object.entries to [string, number][] to fix 'unknown' type evaluation on score */}
                       {(Object.entries(round.scores) as [string, number][]).map(([pid, score]) => {
                         if (pid === round.dealerId) return null;
                         const pName = players.find(p => p.id === pid)?.name || '...';
                         return (
                           <div key={pid} className="flex gap-2">
                             <span className="text-slate-500">{pName}:</span>
                             <span className={`font-bold ${score > 0 ? 'text-emerald-600' : score < 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                               {score > 0 ? '+' : ''}{score.toLocaleString()}
                             </span>
                           </div>
                         );
                       })}
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryLog;
