import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Trash2, Download, Filter, 
  History, User, Settings, ShoppingCart, 
  Package, FileText, AlertCircle, CheckCircle, X, Loader2
} from 'lucide-react';
import { Log } from '../types';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, limit, deleteDoc, doc, addDoc } from 'firebase/firestore';

const ActivityLog: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const q = query(collection(db, "activity_logs"), orderBy("time", "desc"), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logsData = snapshot.docs.map(doc => ({
        id: parseInt(doc.id) || Date.now(),
        docId: doc.id,
        ...doc.data()
      })) as any[];
      setLogs(logsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (docId: string) => {
    if (window.confirm('Hapus log ini?')) {
      await deleteDoc(doc(db, "activity_logs", docId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Log Aktivitas</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {loading ? <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div> : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Aksi</th>
                <th className="px-6 py-4">Detail</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map(log => (
                <tr key={log.docId} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-slate-400">{new Date(log.time).toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 font-bold">{log.user}</td>
                  <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-0.5 rounded-full text-[10px]">{log.action}</span></td>
                  <td className="px-6 py-4 text-slate-500">{log.details}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(log.docId)} className="text-slate-300 hover:text-red-600"><X size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;