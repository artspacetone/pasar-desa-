import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Filter, Eye, Trash2, 
  CheckCircle, Truck, XCircle, Clock, 
  MoreHorizontal, Calendar, User, DollarSign,
  ArrowRight, Save, X
} from 'lucide-react';
import { Order } from '../types';

// Initial Mock Data
const initialOrders: Order[] = [
  { id: '#ORD-001', customerName: 'Ratna Sari', total: 125000, status: 'Diproses', date: '2023-10-25' },
  { id: '#ORD-002', customerName: 'Budi Santoso', total: 45000, status: 'Dikirim', date: '2023-10-24' },
  { id: '#ORD-003', customerName: 'Siti Aminah', total: 210000, status: 'Selesai', date: '2023-10-22' },
  { id: '#ORD-004', customerName: 'Asep Kurnia', total: 75000, status: 'Dibatalkan', date: '2023-10-20' },
  { id: '#ORD-005', customerName: 'Dewi Lestari', total: 150000, status: 'Diproses', date: '2023-10-26' },
];

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Partial<Order>>({});

  // CRUD Logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            order.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'Semua Status' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentOrder({
      id: `#ORD-${Math.floor(Math.random() * 1000)}`,
      status: 'Diproses',
      date: new Date().toISOString().split('T')[0],
      total: 0
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (order: Order) => {
    setIsEditing(true);
    setCurrentOrder({ ...order });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  // Workflow Status Update
  const handleStatusProgress = (order: Order) => {
    let nextStatus: Order['status'] = order.status;
    
    if (order.status === 'Diproses') nextStatus = 'Dikirim';
    else if (order.status === 'Dikirim') nextStatus = 'Selesai';
    
    if (nextStatus !== order.status) {
      setOrders(orders.map(o => o.id === order.id ? { ...o, status: nextStatus } : o));
    }
  };

  const handleCancelOrder = (id: string) => {
    if (window.confirm('Batalkan pesanan ini?')) {
      setOrders(orders.map(o => o.id === id ? { ...o, status: 'Dibatalkan' } : o));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrder.customerName) return;

    if (isEditing && currentOrder.id) {
      setOrders(orders.map(o => o.id === currentOrder.id ? currentOrder as Order : o));
    } else {
      const newOrder: Order = {
        ...(currentOrder as Order),
        // Ensure ID is unique in real app
      };
      setOrders([newOrder, ...orders]);
    }
    setIsModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Diproses': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Dikirim': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Selesai': return 'bg-green-100 text-green-700 border-green-200';
      case 'Dibatalkan': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Diproses': return <Clock size={14} />;
      case 'Dikirim': return <Truck size={14} />;
      case 'Selesai': return <CheckCircle size={14} />;
      case 'Dibatalkan': return <XCircle size={14} />;
      default: return <MoreHorizontal size={14} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pesanan Masuk</h2>
          <p className="text-sm text-slate-500 mt-1">Pantau dan kelola pesanan dari warga.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 text-sm font-bold"
        >
          <Plus size={18} />
          Buat Pesanan Manual
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Perlu Diproses', count: orders.filter(o => o.status === 'Diproses').length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Sedang Dikirim', count: orders.filter(o => o.status === 'Dikirim').length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Selesai', count: orders.filter(o => o.status === 'Selesai').length, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Dibatalkan', count: orders.filter(o => o.status === 'Dibatalkan').length, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border border-slate-100 ${stat.bg} flex items-center justify-between`}>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.count}</p>
            </div>
          </div>
        ))}
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
              placeholder="Cari ID Pesanan atau Nama Pelanggan..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            />
          </div>
          <div className="relative min-w-[200px]">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer hover:border-blue-300 transition-colors"
            >
              <option>Semua Status</option>
              <option>Diproses</option>
              <option>Dikirim</option>
              <option>Selesai</option>
              <option>Dibatalkan</option>
            </select>
            <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID Pesanan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pelanggan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-medium text-slate-700">{order.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                          {order.customerName.charAt(0)}
                        </div>
                        <span className="text-sm text-slate-700 font-medium">{order.customerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-slate-700">
                        Rp {order.total.toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        {/* Status Workflow Action */}
                        {(order.status === 'Diproses' || order.status === 'Dikirim') && (
                          <button 
                            onClick={() => handleStatusProgress(order)}
                            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title={order.status === 'Diproses' ? 'Kirim Pesanan' : 'Selesaikan Pesanan'}
                          >
                            <ArrowRight size={16} />
                          </button>
                        )}

                        <button 
                          onClick={() => handleEditClick(order)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Lihat Detail / Edit"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {(order.status !== 'Selesai' && order.status !== 'Dibatalkan') && (
                          <button 
                            onClick={() => handleCancelOrder(order.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                            title="Batalkan Pesanan"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        
                        <div className="h-4 w-px bg-slate-200 mx-1"></div>

                        <button 
                          onClick={() => handleDeleteClick(order.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Hapus Riwayat"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Search size={24} />
                      </div>
                      <p className="text-base font-medium text-slate-600">Pesanan tidak ditemukan</p>
                      <p className="text-sm">Coba ubah filter status atau kata kunci pencarian.</p>
                      <button 
                        onClick={() => {setSearchQuery(''); setStatusFilter('Semua Status');}}
                        className="mt-4 text-blue-600 hover:underline text-sm font-medium"
                      >
                        Reset Filter
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                {isEditing ? <Eye size={18} className="text-blue-600" /> : <Plus size={18} className="text-blue-600" />}
                {isEditing ? 'Detail Pesanan' : 'Buat Pesanan Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Pelanggan</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={currentOrder.customerName || ''}
                      onChange={e => setCurrentOrder({...currentOrder, customerName: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Nama Pembeli"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">ID Pesanan</label>
                  <input 
                    type="text" 
                    disabled={isEditing}
                    value={currentOrder.id || ''}
                    onChange={e => setCurrentOrder({...currentOrder, id: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tanggal</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="date" 
                      required
                      value={currentOrder.date || ''}
                      onChange={e => setCurrentOrder({...currentOrder, date: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Total Harga (Rp)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">Rp</span>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={currentOrder.total || ''}
                      onChange={e => setCurrentOrder({...currentOrder, total: parseInt(e.target.value) || 0})}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Status Pesanan</label>
                  <select 
                    value={currentOrder.status || 'Diproses'}
                    onChange={e => setCurrentOrder({...currentOrder, status: e.target.value as any})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="Diproses">Diproses</option>
                    <option value="Dikirim">Dikirim</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2">
                 <p className="text-xs text-slate-500 flex items-center gap-2">
                    <Clock size={12} />
                    Status "Diproses" akan masuk antrian penjual.
                 </p>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Simpan Pesanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;