import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Plus, Filter, Eye, Trash2, 
  CheckCircle, Truck, XCircle, Clock, 
  MoreHorizontal, Calendar, User, DollarSign,
  ArrowRight, Save, X, Loader2
} from 'lucide-react';
import { Order } from '../types';
import { db } from '../lib/firebase';
import { collection, onSnapshot, updateDoc, deleteDoc, doc, query, orderBy, addDoc } from 'firebase/firestore';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Partial<Order>>({});

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = (order.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                            order.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'Semua Status' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleStatusProgress = async (order: Order) => {
    let nextStatus: Order['status'] = order.status;
    if (order.status === 'Diproses') nextStatus = 'Dikirim';
    else if (order.status === 'Dikirim') nextStatus = 'Selesai';
    
    if (nextStatus !== order.status) {
      await updateDoc(doc(db, "orders", order.id), { status: nextStatus });
    }
  };

  const handleCancelOrder = async (id: string) => {
    if (window.confirm('Batalkan pesanan ini?')) {
      await updateDoc(doc(db, "orders", id), { status: 'Dibatalkan' });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus riwayat pesanan?')) {
      await deleteDoc(doc(db, "orders", id));
    }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Pesanan Masuk</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 flex gap-4 bg-slate-50/50">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID Pesanan atau Nama Pelanggan..." 
            className="flex-1 p-2.5 border rounded-xl"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2.5 border rounded-xl">
            <option>Semua Status</option>
            <option>Diproses</option>
            <option>Dikirim</option>
            <option>Selesai</option>
            <option>Dibatalkan</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr className="text-xs font-bold text-slate-500 uppercase">
                  <th className="px-6 py-4">ID / Pelanggan</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{order.customerName}</p>
                      <p className="text-[10px] font-mono text-slate-400">{order.id}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
                    <td className="px-6 py-4 font-bold">Rp {order.total?.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      {(order.status === 'Diproses' || order.status === 'Dikirim') && (
                        <button onClick={() => handleStatusProgress(order)} className="p-2 text-blue-600 bg-blue-50 rounded-lg"><ArrowRight size={16} /></button>
                      )}
                      <button onClick={() => handleDelete(order.id)} className="p-2 text-red-600 bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;