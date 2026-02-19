import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Plus, Filter, Edit, Ban, CheckCircle, 
  Trash2, X, Save, User as UserIcon, Shield,
  MoreHorizontal, RefreshCw, Lock, Eye, EyeOff, Loader2
} from 'lucide-react';
import { User, UserRole, UserStatus } from '../types';
import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('Semua Role');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. READ DATA (Real-time)
  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("joinedDate", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // CRUD Logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const name = user.name || '';
      const nik = user.nik || '';
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            nik.includes(searchQuery);
      const matchesRole = roleFilter === 'Semua Role' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentUser({
      role: 'Pembeli',
      status: 'Menunggu',
      joinedDate: new Date().toISOString().split('T')[0],
      password: 'password123'
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleEditClick = (user: User) => {
    setIsEditing(true);
    setCurrentUser({ ...user });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini? Data tidak dapat dikembalikan.')) {
      try {
        await deleteDoc(doc(db, "users", id));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: UserStatus) => {
    try {
      await updateDoc(doc(db, "users", id), { status: newStatus });
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser.name || !currentUser.nik) return;
    setIsSaving(true);

    try {
      if (isEditing && currentUser.id) {
        const { id, ...dataToUpdate } = currentUser;
        await updateDoc(doc(db, "users", currentUser.id), dataToUpdate);
      } else {
        await addDoc(collection(db, "users"), {
          ...currentUser,
          joinedDate: new Date().toISOString()
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Gagal menyimpan data pengguna.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Pengguna</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola akses, verifikasi, dan data warga.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 text-sm font-bold"
        >
          <Plus size={18} />
          Tambah Pengguna
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau NIK..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            />
          </div>
          <div className="flex gap-3">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              <option>Semua Role</option>
              <option>Admin</option>
              <option>UMKM</option>
              <option>Pembeli</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center items-center text-slate-400 gap-2">
              <Loader2 size={24} className="animate-spin" />
              <span>Memuat data warga...</span>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">User Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">NIK & Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            user.role === 'Admin' ? 'bg-purple-100 text-purple-600' : 
                            user.role === 'UMKM' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {user.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{user.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-xs text-slate-500">{user.nik}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{user.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          user.status === 'Terverifikasi' ? 'bg-green-100 text-green-700' :
                          user.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEditClick(user)} className="p-2 text-slate-400 hover:text-blue-600"><Edit size={16} /></button>
                          <button onClick={() => handleDeleteClick(user.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="p-12 text-center text-slate-400">Data tidak ditemukan</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">{isEditing ? 'Edit Pengguna' : 'Tambah Pengguna'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                <input required type="text" value={currentUser.name || ''} onChange={e => setCurrentUser({...currentUser, name: e.target.value})} className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">NIK</label>
                <input required type="text" maxLength={16} value={currentUser.nik || ''} onChange={e => setCurrentUser({...currentUser, nik: e.target.value})} className="w-full p-2.5 border rounded-xl font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select value={currentUser.role || 'Pembeli'} onChange={e => setCurrentUser({...currentUser, role: e.target.value as any})} className="w-full p-2.5 border rounded-xl">
                    <option value="Admin">Admin</option>
                    <option value="UMKM">UMKM</option>
                    <option value="Pembeli">Pembeli</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select value={currentUser.status || 'Menunggu'} onChange={e => setCurrentUser({...currentUser, status: e.target.value as any})} className="w-full p-2.5 border rounded-xl">
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Menunggu">Menunggu</option>
                    <option value="Diblokir">Diblokir</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-2.5 border rounded-xl">Batal</button>
                <button type="submit" disabled={isSaving} className="flex-1 p-2.5 bg-blue-600 text-white rounded-xl font-bold">
                  {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;