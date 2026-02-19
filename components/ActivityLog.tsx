import React, { useState, useMemo } from 'react';
import { 
  Search, Trash2, Download, Filter, 
  History, User, Settings, ShoppingCart, 
  Package, FileText, AlertCircle, CheckCircle, X
} from 'lucide-react';
import { Log } from '../types';

// Mock Data
const initialLogs: Log[] = [
  { id: 1, time: '2023-10-26 08:30:15', user: 'Admin BUMDes', action: 'Login', details: 'Berhasil masuk ke sistem' },
  { id: 2, time: '2023-10-26 09:15:00', user: 'Ratna Sari', action: 'Update Produk', details: 'Mengubah stok "Keripik Pisang" (40 -> 48)' },
  { id: 3, time: '2023-10-26 09:45:22', user: 'Siti Aminah', action: 'Buat Pesanan', details: 'Pesanan baru #ORD-005 senilai Rp 150.000' },
  { id: 4, time: '2023-10-26 10:00:05', user: 'Admin BUMDes', action: 'Verifikasi User', details: 'Memverifikasi akun UMKM "Dapur Asep"' },
  { id: 5, time: '2023-10-26 11:20:10', user: 'Budi Santoso', action: 'Hapus Pesanan', details: 'Membatalkan pesanan #ORD-004' },
  { id: 6, time: '2023-10-26 13:05:45', user: 'Admin BUMDes', action: 'Update Pengaturan', details: 'Mengubah biaya layanan pasar (2.0% -> 2.5%)' },
  { id: 7, time: '2023-10-26 14:10:00', user: 'Warga (Guest)', action: 'Layanan Desa', details: 'Mengajukan Surat Keterangan Domisili' },
  { id: 8, time: '2023-10-26 15:30:33', user: 'System', action: 'Backup', details: 'Pencadangan data otomatis berhasil' },
];

const ActivityLog: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('Semua');

  // Filter Logic
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
        log.details.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = actionFilter === 'Semua' || 
        (actionFilter === 'Login' && log.action === 'Login') ||
        (actionFilter === 'Transaksi' && (log.action.includes('Pesanan') || log.action.includes('Produk'))) ||
        (actionFilter === 'System' && (log.action === 'System' || log.action === 'Backup' || log.action.includes('Pengaturan')));

      return matchesSearch && matchesFilter;
    });
  }, [logs, searchQuery, actionFilter]);

  const handleDelete = (id: number) => {
    if (window.confirm('Hapus log aktivitas ini?')) {
      setLogs(logs.filter(log => log.id !== id));
    }
  };

  const handleClearAll = () => {
    if (window.confirm('PERINGATAN: Apakah Anda yakin ingin menghapus SEMUA riwayat aktivitas?')) {
      setLogs([]);
    }
  };

  const handleExport = () => {
    // Simulation of export
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Waktu,User,Aksi,Detail\n"
      + logs.map(e => `${e.id},"${e.time}","${e.user}","${e.action}","${e.details}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "activity_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Login')) return <User size={14} className="text-blue-500" />;
    if (action.includes('Produk')) return <Package size={14} className="text-orange-500" />;
    if (action.includes('Pesanan')) return <ShoppingCart size={14} className="text-green-500" />;
    if (action.includes('Pengaturan') || action.includes('System')) return <Settings size={14} className="text-slate-500" />;
    if (action.includes('Layanan')) return <FileText size={14} className="text-purple-500" />;
    if (action.includes('Hapus') || action.includes('Batal')) return <AlertCircle size={14} className="text-red-500" />;
    return <History size={14} className="text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Log Aktivitas</h2>
          <p className="text-sm text-slate-500 mt-1">Riwayat tindakan pengguna dan sistem.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button 
            onClick={handleClearAll}
            className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-red-100 transition-colors text-sm font-medium"
          >
            <Trash2 size={18} />
            Bersihkan Log
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari user atau detail aktivitas..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            />
          </div>
          <div className="relative min-w-[200px]">
            <select 
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer hover:border-blue-300 transition-colors"
            >
              <option value="Semua">Semua Aktivitas</option>
              <option value="Login">Login & Akses</option>
              <option value="Transaksi">Transaksi (Pasar)</option>
              <option value="System">System & Settings</option>
            </select>
            <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Waktu</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Detail</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Hapus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-slate-500">{log.time}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                          {log.user.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-slate-200 bg-white w-fit">
                        {getActionIcon(log.action)}
                        <span className="text-xs font-bold text-slate-700">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{log.details}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => handleDelete(log.id)}
                        className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus baris ini"
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <History size={24} />
                      </div>
                      <p className="text-base font-medium text-slate-600">Tidak ada log aktivitas</p>
                      <p className="text-sm">Belum ada aktivitas terekam sesuai filter ini.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
          <span>Menampilkan {filteredLogs.length} dari {logs.length} total baris</span>
          <span>Log disimpan selama 30 hari</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;