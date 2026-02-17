
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, UserPlus, RotateCcw, UserCircle2, Swords, History, Trash2, Trophy, ArrowRightLeft } from 'lucide-react';
import { Player, Round, PlayerStats } from './types';
import PlayerManager from './components/PlayerManager';
import RoundEntry from './components/RoundEntry';
import SummaryBoard from './components/SummaryBoard';
import HistoryLog from './components/HistoryLog';

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [showRoundModal, setShowRoundModal] = useState(false);
  const [showPlayerManager, setShowPlayerManager] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('xi-dach-state');
    if (saved) {
      try {
        const { players: savedPlayers, rounds: savedRounds } = JSON.parse(saved);
        setPlayers(savedPlayers);
        setRounds(savedRounds);
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('xi-dach-state', JSON.stringify({ players, rounds }));
  }, [players, rounds]);

  const currentDealer = useMemo(() => players.find(p => p.isDealer), [players]);

  const stats: PlayerStats[] = useMemo(() => {
    return players.map(player => {
      const total = rounds.reduce((sum, round) => {
        return sum + (round.scores[player.id] || 0);
      }, 0);
      return { ...player, total };
    });
  }, [players, rounds]);

  const handleAddPlayer = (name: string) => {
    if (!name.trim()) return;
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: name.trim(),
      isDealer: players.length === 0, // First player is coordinator by default
    };
    setPlayers([...players, newPlayer]);
  };

  const handleDeletePlayer = (id: string) => {
    if (rounds.length > 0) {
      if (!confirm("Ván chơi đang diễn ra. Xóa người chơi sẽ ảnh hưởng đến lịch sử. Bạn chắc chứ?")) return;
    }
    const newPlayers = players.filter(p => p.id !== id);
    // If we deleted the dealer, pick a new one
    if (players.find(p => p.id === id)?.isDealer && newPlayers.length > 0) {
      newPlayers[0].isDealer = true;
    }
    setPlayers(newPlayers);
  };

  const handleChangeDealer = (id: string) => {
    setPlayers(players.map(p => ({
      ...p,
      isDealer: p.id === id
    })));
  };

  const handleAddRound = (scores: Record<string, number>) => {
    if (!currentDealer) return;
    
    const newRound: Round = {
      id: rounds.length + 1,
      dealerId: currentDealer.id,
      scores,
    };
    
    setRounds([...rounds, newRound]);
    setShowRoundModal(false);
  };

  const handleReset = () => {
    if (confirm("Bạn có chắc chắn muốn xóa tất cả các vòng và người chơi?")) {
      setPlayers([]);
      setRounds([]);
      localStorage.removeItem('xi-dach-state');
    }
  };

  const handleClearHistory = () => {
     if (confirm("Xóa lịch sử các vòng chơi nhưng giữ lại người chơi?")) {
      setRounds([]);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
      {/* Header */}
      <header className="bg-emerald-600 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Swords size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Score Nhóm Bạn</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleReset}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Cài lại tất cả"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Main Stats Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" />
              Bảng Tổng Sắp
            </h2>
            <div className="flex gap-2">
               <button 
                onClick={() => setShowPlayerManager(true)}
                className="text-xs font-medium px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-1.5"
              >
                <UserPlus size={14} />
                Quản lý
              </button>
            </div>
          </div>
          <SummaryBoard stats={stats} onSwitchDealer={handleChangeDealer} />
        </section>

        {/* History Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <History size={18} className="text-blue-500" />
              Lịch Sử Vòng
            </h2>
            {rounds.length > 0 && (
              <button 
                onClick={handleClearHistory}
                className="text-xs text-red-500 hover:text-red-600 font-medium"
              >
                Xóa lịch sử
              </button>
            )}
          </div>
          <HistoryLog rounds={rounds} players={players} />
        </section>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {players.length > 1 && currentDealer && (
          <button 
            onClick={() => setShowRoundModal(true)}
            className="w-16 h-16 bg-emerald-600 text-white rounded-full shadow-2xl hover:bg-emerald-700 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group"
          >
            <Plus size={36} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        )}
      </div>

      {/* Modals */}
      {showRoundModal && currentDealer && (
        <RoundEntry 
          dealer={currentDealer}
          players={players.filter(p => !p.isDealer)}
          onClose={() => setShowRoundModal(false)}
          onSubmit={handleAddRound}
        />
      )}

      {showPlayerManager && (
        <PlayerManager 
          players={players}
          onClose={() => setShowPlayerManager(false)}
          onAdd={handleAddPlayer}
          onDelete={handleDeletePlayer}
          onChangeDealer={handleChangeDealer}
        />
      )}

      {/* Empty State */}
      {players.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400">
            <UserPlus size={40} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Chưa có người chơi nào</h3>
          <p className="text-slate-500 mt-1 mb-6 max-w-xs">Thêm ít nhất 2 người để bắt đầu theo dõi điểm chơi cùng nhau.</p>
          <button 
            onClick={() => setShowPlayerManager(true)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
          >
            Thêm người chơi ngay
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
