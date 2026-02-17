
import React, { useState } from 'react';
import { X, UserPlus, Trash2, ShieldCheck, ArrowRightLeft } from 'lucide-react';
import { Player } from '../types';

interface PlayerManagerProps {
  players: Player[];
  onClose: () => void;
  onAdd: (name: string) => void;
  onDelete: (id: string) => void;
  onChangeDealer: (id: string) => void;
}

const PlayerManager: React.FC<PlayerManagerProps> = ({ players, onClose, onAdd, onDelete, onChangeDealer }) => {
  const [newName, setNewName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAdd(newName);
      setNewName('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <UserPlus size={18} />
            Danh Sách Người Chơi
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-2">
              <input 
                autoFocus
                type="text"
                placeholder="Nhập tên người chơi..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
              <button 
                type="submit"
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center gap-1"
              >
                <UserPlus size={18} />
                Thêm
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {players.length === 0 ? (
              <p className="text-center py-10 text-slate-400 text-sm">Chưa có người chơi nào.</p>
            ) : (
              players.map(player => (
                <div key={player.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 group">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-700">{player.name}</span>
                    {player.isDealer && (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <ShieldCheck size={10} />
                        ĐIỀU PHỐI
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!player.isDealer && (
                      <button 
                        onClick={() => onChangeDealer(player.id)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Đổi người điều phối"
                      >
                        <ArrowRightLeft size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => onDelete(player.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Xóa người chơi"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <button 
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-900 transition-colors"
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerManager;
