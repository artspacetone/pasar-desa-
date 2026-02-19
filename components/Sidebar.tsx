import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Tags, 
  Link as LinkIcon, 
  History, 
  Settings, 
  Store,
  LogOut
} from 'lucide-react';
import { TabView, UserRole } from '../types';

interface SidebarProps {
  activeTab: TabView;
  setActiveTab: (tab: TabView) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userRole: UserRole | 'Guest';
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen, userRole }) => {
  
  // Define all possible menu items
  const allMenuItems: { id: TabView; label: string; icon: React.ElementType; roles: string[] }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'UMKM', 'Pembeli', 'Guest'] },
    { id: 'marketplace', label: 'Pasar Desa', icon: Store, roles: ['Admin', 'Pembeli', 'Guest'] }, // UMKM usually manages products, but can view market too
    { id: 'integration', label: 'Layanan Desa', icon: LinkIcon, roles: ['Admin', 'Pembeli', 'Guest'] },
    { id: 'products', label: 'Produk Saya', icon: Package, roles: ['Admin', 'UMKM'] },
    { id: 'orders', label: userRole === 'UMKM' ? 'Pesanan Masuk' : 'Pesanan Saya', icon: ShoppingCart, roles: ['Admin', 'UMKM', 'Pembeli'] },
    { id: 'users', label: 'Pengguna', icon: Users, roles: ['Admin'] },
    { id: 'categories', label: 'Kategori', icon: Tags, roles: ['Admin'] },
    { id: 'logs', label: 'Log Sistem', icon: History, roles: ['Admin'] },
    { id: 'settings', label: userRole === 'UMKM' ? 'Pengaturan Toko' : 'Pengaturan', icon: Settings, roles: ['Admin', 'UMKM'] },
  ];

  const visibleMenuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-72 bg-slate-900 text-slate-100 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900">
          <Store className="w-6 h-6 text-green-500 mr-3" />
          <div>
            <h1 className="font-bold text-lg leading-none">Marketplace Desa</h1>
            <p className="text-xs text-slate-400 mt-1">Curug Badak Digital</p>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Info based on Role */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="bg-slate-800 rounded-xl p-3">
             <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Akses Sebagai</p>
             <p className={`text-sm font-bold flex items-center gap-2
               ${userRole === 'Admin' ? 'text-purple-400' : 
                 userRole === 'UMKM' ? 'text-orange-400' : 
                 userRole === 'Guest' ? 'text-slate-400' : 'text-green-400'}
             `}>
               {userRole === 'Guest' ? 'Tamu (Guest)' : userRole}
             </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;