import React from 'react';
import { 
  Store, Package, ShoppingBag, Coins, ArrowRight, 
  Eye, FileText, Users, Activity, Clock, 
  CheckCircle, AlertCircle, TrendingUp, ChevronRight,
  ShieldAlert, Info, MapPin
} from 'lucide-react';
import SalesChart from './SalesChart';
import { Order, User } from '../types';

interface DashboardProps {
  currentUser: User | null;
  isGuest: boolean;
}

// Mock Data
const recentLetters = [
  { id: 'SRT-001', type: 'Surat Keterangan Domisili', applicant: 'Siti Aminah', date: 'Hari ini, 09:00', status: 'Menunggu' },
  { id: 'SRT-002', type: 'Pengantar SKCK', applicant: 'Budi Santoso', date: 'Kemarin, 14:30', status: 'Disetujui' },
  { id: 'SRT-003', type: 'Surat Keterangan Usaha', applicant: 'Ratna Sari', date: 'Kemarin, 10:15', status: 'Menunggu' },
];

const myOrders = [
  { id: '#ORD-003', item: 'Kopi Bubuk Robusta', total: 25000, status: 'Dikirim', date: '20 Feb 2026' },
  { id: '#ORD-001', item: 'Keripik Pisang', total: 15000, status: 'Selesai', date: '18 Feb 2026' },
];

const Dashboard: React.FC<DashboardProps> = ({ currentUser, isGuest }) => {
  const role = isGuest ? 'Guest' : currentUser?.role || 'Guest';

  const recentOrders: Order[] = [
    { id: '#P001', customerName: 'Ratna Sari', total: 125000, status: 'Diproses', date: '19 Feb 2026' },
    { id: '#P002', customerName: 'Asep Kurnia', total: 75000, status: 'Selesai', date: '19 Feb 2026' },
    { id: '#P003', customerName: 'Dewi Lestari', total: 210000, status: 'Dikirim', date: '18 Feb 2026' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Diproses': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Selesai': return 'bg-green-100 text-green-800 border-green-200';
      case 'Dikirim': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getLetterStatusColor = (status: string) => {
    switch (status) {
      case 'Menunggu': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Disetujui': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  // --- VIEW FOR GUEST ---
  if (role === 'Guest') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-xl text-center">
          <h1 className="text-3xl font-bold mb-3">Selamat Datang di Portal Desa Curug Badak</h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg">
            Pusat informasi layanan administrasi desa dan pasar digital UMKM lokal. 
            Silakan login untuk menikmati fitur lengkap.
          </p>
          <div className="mt-8 flex justify-center gap-4">
             <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                <Store size={32} className="mx-auto mb-2 text-yellow-300" />
                <div className="font-bold text-xl">50+</div>
                <div className="text-xs opacity-80">Produk UMKM</div>
             </div>
             <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                <Users size={32} className="mx-auto mb-2 text-green-300" />
                <div className="font-bold text-xl">1.2k</div>
                <div className="text-xs opacity-80">Warga Terdaftar</div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 text-lg mb-2 flex items-center gap-2">
              <Store className="text-blue-600" /> Pasar Desa
            </h3>
            <p className="text-slate-500 text-sm mb-4">Temukan berbagai produk lokal berkualitas dari warga desa.</p>
            <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100">
               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                 <div>
                   <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
                   <div className="h-3 w-20 bg-slate-200 rounded"></div>
                 </div>
               </div>
            </div>
            <p className="text-xs text-slate-400 italic text-center">Login untuk mulai belanja</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 text-lg mb-2 flex items-center gap-2">
              <FileText className="text-green-600" /> Layanan Desa
            </h3>
            <p className="text-slate-500 text-sm mb-4">Pengurusan surat pengantar, KTP, dan administrasi lainnya secara online.</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Surat Domisili</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Surat Usaha</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Pengantar SKCK</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW FOR PEMBELI (BUYER) ---
  if (role === 'Pembeli') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Halo, {currentUser?.name} 👋</h1>
            <p className="text-slate-500 mt-1">Siap berbelanja produk lokal hari ini?</p>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium">
              <MapPin size={16} />
              Warga Terverifikasi
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Orders */}
          <div className="md:col-span-2 space-y-4">
             <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
               <ShoppingBag size={20} className="text-blue-600" /> Pesanan Saya
             </h3>
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {myOrders.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                    {myOrders.map(order => (
                      <div key={order.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-slate-800">{order.item}</span>
                              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">{order.id}</span>
                            </div>
                            <p className="text-sm text-slate-500">Total: Rp {order.total.toLocaleString('id-ID')}</p>
                         </div>
                         <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <p className="text-xs text-slate-400 mt-1">{order.date}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <ShoppingBag size={32} className="mx-auto mb-2 opacity-50" />
                    <p>Belum ada pesanan aktif</p>
                  </div>
                )}
             </div>
          </div>

          {/* Service Status */}
          <div>
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-4">
               <FileText size={20} className="text-green-600" /> Status Surat
             </h3>
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
               <div className="flex items-start gap-3 mb-4">
                 <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 shrink-0">
                   <Clock size={20} />
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-800 text-sm">Surat Keterangan Domisili</h4>
                   <p className="text-xs text-slate-500 mt-1">Diajukan: Hari ini, 09:00</p>
                   <span className="inline-block mt-2 px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold rounded border border-orange-100">
                     Sedang Diproses
                   </span>
                 </div>
               </div>
               <button className="w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-colors">
                 Lihat Semua Layanan
               </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW FOR UMKM (SELLER) ---
  if (role === 'UMKM') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl">
           <div className="flex justify-between items-center">
             <div>
                <h1 className="text-2xl font-bold mb-1">Dapur Asep</h1>
                <p className="text-slate-300 text-sm">Dashboard Penjual • Status: <span className="text-green-400 font-bold">Buka</span></p>
             </div>
             <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                <p className="text-xs text-slate-400">Saldo Dompet</p>
                <p className="font-bold text-xl">Rp 1.450.000</p>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <StatsCard label="Pesanan Baru" value="4" subValue="Perlu dikirim segera" icon={Package} color="bg-blue-50 text-blue-600" urgent />
           <StatsCard label="Pendapatan Hari Ini" value="Rp 245rb" subValue="+12% dari kemarin" icon={Coins} color="bg-green-50 text-green-600" trend="up" />
           <StatsCard label="Total Produk" value="12" subValue="2 Stok menipis" icon={Store} color="bg-orange-50 text-orange-600" />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                 <TrendingUp size={20} className="text-emerald-600" />
                 Grafik Penjualan Toko
              </h3>
              <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-xl px-3 py-1.5 outline-none">
                <option>7 Hari Terakhir</option>
              </select>
            </div>
            <SalesChart />
        </div>
      </div>
    );
  }

  // --- VIEW FOR ADMIN (DEFAULT) ---
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard Terpadu</h1>
          <p className="text-slate-300 text-sm opacity-90">
            Selamat datang, Admin. Berikut ringkasan aktivitas Desa & Pasar hari ini.
          </p>
        </div>
        <div className="flex gap-3">
           <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
              <Clock size={16} className="text-green-400" />
              <span className="text-sm font-medium">Layanan Buka</span>
           </div>
        </div>
      </div>

      {/* Unified Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Layanan Desa Stats */}
        <StatsCard 
          label="Penduduk Terdaftar" 
          value="1,240" 
          subValue="+12 bulan ini"
          icon={Users} 
          color="bg-indigo-50 text-indigo-600"
          trend="up"
        />
        <StatsCard 
          label="Permohonan Surat" 
          value="8" 
          subValue="3 Perlu Verifikasi"
          icon={FileText} 
          color="bg-purple-50 text-purple-600"
          urgent={true}
        />
        
        {/* Pasar Desa Stats */}
        <StatsCard 
          label="Omset Bulan Ini" 
          value="Rp 28,5 jt" 
          subValue="+15% dari bulan lalu"
          icon={Coins} 
          color="bg-emerald-50 text-emerald-600"
          trend="up"
        />
        <StatsCard 
          label="Pesanan Aktif" 
          value="12" 
          subValue="4 Siap Dikirim"
          icon={ShoppingBag} 
          color="bg-blue-50 text-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Layanan Desa (Administration) */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText size={18} className="text-purple-600" />
                Layanan Desa
              </h3>
              <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded-md">
                3 Pending
              </span>
            </div>
            
            <div className="divide-y divide-slate-50">
              {recentLetters.map((letter) => (
                <div key={letter.id} className="p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-slate-700 text-sm">{letter.type}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getLetterStatusColor(letter.status)}`}>
                      {letter.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                    <div className="flex items-center gap-1.5">
                      <Users size={12} />
                      {letter.applicant}
                    </div>
                    <span>{letter.date}</span>
                  </div>
                  {letter.status === 'Menunggu' && (
                     <div className="mt-3 flex gap-2">
                        <button className="flex-1 bg-purple-600 text-white text-xs py-1.5 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                          Verifikasi
                        </button>
                        <button className="px-3 bg-slate-100 text-slate-600 text-xs py-1.5 rounded-lg font-medium hover:bg-slate-200 transition-colors">
                          Detail
                        </button>
                     </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50/30">
              <button className="w-full text-purple-600 text-sm font-medium hover:underline flex items-center justify-center gap-1">
                Lihat Semua Permohonan <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Pasar Desa (Marketplace) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <div>
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                   <TrendingUp size={20} className="text-emerald-600" />
                   Statistik Penjualan
                </h3>
                <p className="text-sm text-slate-500">Tren transaksi pasar desa minggu ini</p>
              </div>
              <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500">
                <option>7 Hari Terakhir</option>
                <option>Bulan Ini</option>
                <option>Tahun Ini</option>
              </select>
            </div>
            <SalesChart />
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <ShoppingBag size={18} className="text-blue-600" />
                Pesanan Terbaru
              </h3>
              <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                Kelola Pesanan <ArrowRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Pembeli</th>
                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-blue-50/30 transition-colors">
                      <td className="px-5 py-3.5 text-sm font-medium text-slate-700">{order.id}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{order.customerName}</td>
                      <td className="px-5 py-3.5 text-sm font-bold text-slate-700">Rp {order.total.toLocaleString('id-ID')}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  label: string;
  value: string;
  subValue: string;
  icon: React.ElementType;
  color: string;
  urgent?: boolean;
  trend?: 'up' | 'down';
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, subValue, icon: Icon, color, urgent, trend }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 relative overflow-hidden group">
    {urgent && (
      <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
    )}
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          <TrendingUp size={12} className={trend === 'down' ? 'rotate-180' : ''} />
          {trend === 'up' ? '+' : '-'}2.4%
        </span>
      )}
    </div>
    
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <h4 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h4>
      <p className="text-xs text-slate-400 mt-1 font-medium">{subValue}</p>
    </div>
  </div>
);

export default Dashboard;