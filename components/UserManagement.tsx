import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Filter, Edit, Ban, CheckCircle, 
  Trash2, X, Save, User as UserIcon, Shield,
  MoreHorizontal, RefreshCw, Lock, Eye, EyeOff
} from 'lucide-react';
import { User, UserRole, UserStatus } from '../types';

// Initial Mock Data
const initialUsers: User[] = [
  { id: '1', name: 'M. Wahyu H.', nik: '3604123456789012', role: 'Admin', status: 'Terverifikasi', joinedDate: '2023-01-10', password: 'password123' },
  { id: '2', name: 'Ratna Sari', nik: '3604123456789013', role: 'UMKM', status: 'Terverifikasi', joinedDate: '2023-02-15', password: 'password123' },
  { id: '3', name: 'Asep Kurnia', nik: '3604123456789014', role: 'Pembeli', status: 'Terverifikasi', joinedDate: '2023-03-20', password: 'password123' },
  { id: '4', name: 'Dewi Lestari', nik: '3604123456789015', role: 'UMKM', status: 'Menunggu', joinedDate: '2023-04-05', password: 'password123' },
  { id: '5', name: 'Budi Santoso', nik: '3604123456789016', role: 'Pembeli', status: 'Diblokir', joinedDate: '2023-01-20', password: 'password123' },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('Semua Role');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});
  const [showPassword, setShowPassword] = useState(false);

  // CRUD Logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            user.nik.includes(searchQuery);
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
      password: ''
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

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini? Data tidak dapat dikembalikan.')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleStatusChange = (id: string, newStatus: UserStatus) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser.name || !currentUser.nik) return;

    if (isEditing && currentUser.id) {
      setUsers(users.map(u => u.id === currentUser.id ? currentUser as User : u));
    } else {
      const newUser: User = {
        ...(currentUser as User),
        id: Date.now().toString(),
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
        {/* Filters */}
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
            <div className="relative">
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer hover:border-blue-300 transition-colors"
              >
                <option>Semua Role</option>
                <option>Admin</option>
                <option>UMKM</option>
                <option>Pembeli</option>
              </select>
              <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <button className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 bg-white transition-colors" title="Refresh Data">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User Info</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">NIK & Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Gabung</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                          ${user.role === 'Admin' ? 'bg-purple-100 text-purple-600' : 
                            user.role === 'UMKM' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}
                        `}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-500">ID: #{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-xs text-slate-500">{user.nik}</span>
                        <span className={`inline-flex w-fit px-2 py-0.5 rounded text-[10px] font-bold border ${
                          user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                          user.role === 'UMKM' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                          'bg-slate-50 text-slate-600 border-slate-100'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(user.joinedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {user.status === 'Terverifikasi' && <CheckCircle size={14} className="text-green-500" />}
                        {user.status === 'Diblokir' && <Ban size={14} className="text-red-500" />}
                        {user.status === 'Menunggu' && <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>}
                        <span className={`text-sm font-medium ${
                          user.status === 'Terverifikasi' ? 'text-green-600' :
                          user.status === 'Menunggu' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEditClick(user)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Edit Data"
                        >
                          <Edit size={16} />
                        </button>
                        
                        {user.status !== 'Terverifikasi' ? (
                          <button 
                            onClick={() => handleStatusChange(user.id, 'Terverifikasi')}
                            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                            title="Verifikasi User"
                          >
                            <CheckCircle size={16} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleStatusChange(user.id, 'Diblokir')}
                            className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" 
                            title="Blokir Akses"
                          >
                            <Ban size={16} />
                          </button>
                        )}

                        <div className="h-4 w-px bg-slate-200 mx-1"></div>

                        <button 
                          onClick={() => handleDeleteClick(user.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Hapus Permanen"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Search size={24} />
                      </div>
                      <p className="text-base font-medium text-slate-600">User tidak ditemukan</p>
                      <p className="text-sm">Coba kata kunci lain atau reset filter.</p>
                      <button 
                        onClick={() => {setSearchQuery(''); setRoleFilter('Semua Role');}}
                        className="mt-4 text-blue-600 hover:underline text-sm font-medium"
                      >
                        Reset Pencarian
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
                {isEditing ? <Edit size={18} className="text-blue-600" /> : <Plus size={18} className="text-blue-600" />}
                {isEditing ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
                  <div className="relative">
                    <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={currentUser.name || ''}
                      onChange={e => setCurrentUser({...currentUser, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Contoh: Budi Santoso"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nomor Induk Kependudukan (NIK)</label>
                  <div className="relative">
                    <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={currentUser.nik || ''}
                      onChange={e => setCurrentUser({...currentUser, nik: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                      placeholder="16 digit NIK"
                      maxLength={16}
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={currentUser.password || ''}
                      onChange={e => setCurrentUser({...currentUser, password: e.target.value})}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder={isEditing ? "Kosongkan jika tidak ingin mengubah" : "Masukkan password"}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {isEditing && (
                    <p className="text-[10px] text-slate-400 mt-1 ml-1">*Kosongkan jika tidak ingin mengubah password.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Role Akses</label>
                  <select 
                    value={currentUser.role || 'Pembeli'}
                    onChange={e => setCurrentUser({...currentUser, role: e.target.value as UserRole})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="Pembeli">Pembeli</option>
                    <option value="UMKM">UMKM</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Status Akun</label>
                  <select 
                    value={currentUser.status || 'Menunggu'}
                    onChange={e => setCurrentUser({...currentUser, status: e.target.value as UserStatus})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="Menunggu">Menunggu</option>
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Diblokir">Diblokir</option>
                  </select>
                </div>
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
                  Simpan Data
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