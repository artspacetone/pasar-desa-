import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import UserManagement from './components/UserManagement';
import ProductManagement from './components/ProductManagement';
import OrderManagement from './components/OrderManagement';
import CategoryManagement from './components/CategoryManagement';
import IntegrationStatus from './components/IntegrationStatus';
import ActivityLog from './components/ActivityLog';
import Settings from './components/Settings';
import AIAssistant from './components/AIAssistant';
import { TabView, User, UserRole } from './types';
import { History, ShoppingCart, Tags, LogIn, Shield, Store, User as UserIcon, HelpCircle } from 'lucide-react';

// Mock Login Users
const MOCK_USERS: Record<string, User> = {
  admin: { id: 'u1', name: 'Admin Desa', nik: '3601000001', role: 'Admin', status: 'Terverifikasi', joinedDate: '2023-01-01' },
  umkm: { id: 'u2', name: 'Warung Bu Ratna', nik: '3601000002', role: 'UMKM', status: 'Terverifikasi', joinedDate: '2023-02-15' },
  pembeli: { id: 'u3', name: 'Siti Aminah', nik: '3601000003', role: 'Pembeli', status: 'Terverifikasi', joinedDate: '2023-03-10' },
  tamu: { id: 'guest', name: 'Pengunjung', nik: '', role: 'Pembeli', status: 'Menunggu', joinedDate: '2023-01-01' }, // Tamu treated as limited buyer
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  // Reset tab when user changes
  useEffect(() => {
    setActiveTab('dashboard');
  }, [currentUser]);

  const handleLogin = (role: string) => {
    if (role === 'Guest') {
      setCurrentUser(MOCK_USERS.tamu);
      setIsGuest(true);
    } else {
      setIsGuest(false);
      if (role === 'Admin') setCurrentUser(MOCK_USERS.admin);
      else if (role === 'UMKM') setCurrentUser(MOCK_USERS.umkm);
      else if (role === 'Pembeli') setCurrentUser(MOCK_USERS.pembeli);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsGuest(false);
  };

  const getTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'marketplace': return 'Pasar Desa';
      case 'users': return 'Manajemen Pengguna';
      case 'products': return 'Kelola Produk';
      case 'orders': return currentUser?.role === 'Pembeli' ? 'Riwayat Belanja' : 'Pesanan Masuk';
      case 'categories': return 'Kategori Produk';
      case 'integration': return 'Layanan Desa';
      case 'logs': return 'Log Aktivitas';
      case 'settings': return 'Pengaturan';
      default: return 'Marketplace Desa';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard currentUser={currentUser} isGuest={isGuest} />;
      case 'marketplace': return <Marketplace />;
      case 'users': return <UserManagement />;
      case 'products': return <ProductManagement />;
      case 'orders': return <OrderManagement />;
      case 'categories': return <CategoryManagement />;
      case 'integration': return <IntegrationStatus />;
      case 'logs': return <ActivityLog />;
      case 'settings': return <Settings />;
      default: return <Dashboard currentUser={currentUser} isGuest={isGuest} />;
    }
  };

  // Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side: Illustration/Brand */}
          <div className="md:w-1/2 bg-blue-600 p-8 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
                  <Store size={32} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold">Pasar Desa<br/>Curug Badak</h1>
              </div>
              <p className="opacity-90 leading-relaxed">
                Satu platform untuk ekonomi desa yang lebih maju dan pelayanan administrasi yang lebih cepat.
              </p>
            </div>
            <div className="text-xs opacity-60 mt-8">© 2026 BUMDes Curug Badak Digital</div>
            
            {/* Background Pattern */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          </div>

          {/* Right Side: Login Options */}
          <div className="md:w-1/2 p-8 md:p-12 bg-slate-50">
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Pilih Mode Akses</h2>
            
            <div className="space-y-3">
              <button 
                onClick={() => handleLogin('Admin')}
                className="w-full bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-4 group text-left"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Admin Desa / BUMDes</h3>
                  <p className="text-xs text-slate-500">Akses penuh pengelolaan sistem</p>
                </div>
              </button>

              <button 
                onClick={() => handleLogin('UMKM')}
                className="w-full bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-4 group text-left"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                  <Store size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Penjual / UMKM</h3>
                  <p className="text-xs text-slate-500">Kelola produk dan pesanan toko</p>
                </div>
              </button>

              <button 
                onClick={() => handleLogin('Pembeli')}
                className="w-full bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-4 group text-left"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Warga / Pembeli</h3>
                  <p className="text-xs text-slate-500">Belanja dan layanan surat desa</p>
                </div>
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-50 text-slate-400">atau</span>
                </div>
              </div>

              <button 
                onClick={() => handleLogin('Guest')}
                className="w-full bg-slate-200 p-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
              >
                <HelpCircle size={18} />
                Masuk sebagai Tamu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main App Layout
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        userRole={isGuest ? 'Guest' : currentUser.role}
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <TopNav 
          title={getTitle()} 
          onMenuClick={() => setIsSidebarOpen(true)}
          user={currentUser}
          isGuest={isGuest}
          onLogout={handleLogout}
        />
        
        <main className={`flex-1 overflow-y-auto scroll-smooth pb-20 ${activeTab === 'marketplace' || activeTab === 'integration' ? 'bg-slate-50' : 'p-4 lg:p-8'}`}>
          <div className={activeTab === 'marketplace' || activeTab === 'integration' ? 'w-full' : 'max-w-7xl mx-auto'}>
            {renderContent()}
          </div>
        </main>
        
        {/* AI Assistant Floating Widget */}
        <AIAssistant />
      </div>
    </div>
  );
};

export default App;