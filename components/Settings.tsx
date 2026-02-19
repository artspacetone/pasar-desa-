import React, { useState } from 'react';
import { 
  Save, Store, Building2, Globe, Bell, 
  ShieldCheck, Smartphone, Truck, CreditCard,
  Clock, MapPin
} from 'lucide-react';

type SettingsTab = 'general' | 'marketplace' | 'services';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [isSaving, setIsSaving] = useState(false);

  // Form States (Simulated)
  const [config, setConfig] = useState({
    // General
    appName: 'Marketplace Desa Curug Badak',
    mode: 'live',
    address: 'Jl. Raya Curug Badak No. 12',
    phone: '+62 812-3456-7890',
    
    // Marketplace
    serviceFee: 2.5,
    baseShipping: 1500,
    maxRadius: 5,
    minOrder: 10000,
    
    // Services
    autoApproveLetters: false,
    serviceStart: '08:00',
    serviceEnd: '15:00',
    adminEmail: 'admin@desacurugbadak.id'
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert('Pengaturan berhasil disimpan!');
    }, 1000);
  };

  const handleChange = (field: string, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pengaturan Sistem</h2>
          <p className="text-sm text-slate-500 mt-1">Konfigurasi platform Pasar Desa & Layanan Desa.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'general' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Globe size={16} /> Umum
        </button>
        <button 
          onClick={() => setActiveTab('marketplace')}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'marketplace' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Store size={16} /> Pasar Desa
        </button>
        <button 
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'services' ? 'bg-green-600 text-white' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Building2 size={16} /> Layanan Desa
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Globe size={20} className="text-slate-500" /> Identitas Platform
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nama Aplikasi</label>
                  <input 
                    type="text" 
                    value={config.appName}
                    onChange={(e) => handleChange('appName', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Status Sistem</label>
                    <select 
                      value={config.mode}
                      onChange={(e) => handleChange('mode', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="live">Aktif (Live)</option>
                      <option value="maintenance">Mode Pemeliharaan</option>
                      <option value="readonly">Hanya Lihat (Read-Only)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nomor Kontak (WhatsApp)</label>
                    <div className="relative">
                      <Smartphone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        value={config.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Alamat Kantor Desa</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                    <textarea 
                      rows={3}
                      value={config.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MARKETPLACE TAB */}
          {activeTab === 'marketplace' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Store size={20} className="text-blue-600" /> Konfigurasi Pasar
              </h3>
              
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
                  <CreditCard className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-blue-900 text-sm">Keuangan & Pajak</h4>
                    <p className="text-xs text-blue-700 mt-1">Mengatur potongan otomatis untuk setiap transaksi yang berhasil.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Biaya Layanan / Admin (%)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={config.serviceFee}
                      onChange={(e) => handleChange('serviceFee', parseFloat(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                    <p className="text-xs text-slate-400 mt-1">Potongan per transaksi untuk kas BUMDes.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Minimal Belanja (Rp)</label>
                    <input 
                      type="number" 
                      value={config.minOrder}
                      onChange={(e) => handleChange('minOrder', parseInt(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                   <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                      <Truck size={16} /> Pengiriman Kurir Lokal
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Ongkir Dasar (per km)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">Rp</span>
                        <input 
                          type="number" 
                          value={config.baseShipping}
                          onChange={(e) => handleChange('baseShipping', parseInt(e.target.value))}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Maksimal Radius (km)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={config.maxRadius}
                          onChange={(e) => handleChange('maxRadius', parseInt(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">km</span>
                      </div>
                    </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* SERVICES TAB */}
          {activeTab === 'services' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Building2 size={20} className="text-green-600" /> Administrasi Desa
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Notifikasi Admin</label>
                    <div className="relative">
                      <Bell size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="email" 
                        value={config.adminEmail}
                        onChange={(e) => handleChange('adminEmail', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 outline-none" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Jam Operasional Layanan</label>
                    <div className="flex items-center gap-2">
                       <input 
                        type="time" 
                        value={config.serviceStart}
                        onChange={(e) => handleChange('serviceStart', e.target.value)}
                        className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 outline-none" 
                      />
                      <span className="text-slate-400">-</span>
                      <input 
                        type="time" 
                        value={config.serviceEnd}
                        onChange={(e) => handleChange('serviceEnd', e.target.value)}
                        className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 outline-none" 
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Persetujuan Otomatis (Surat Keterangan)</h4>
                      <p className="text-xs text-slate-500 mt-1">Jika aktif, surat keterangan sederhana akan langsung disetujui sistem.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={config.autoApproveLetters}
                        onChange={(e) => handleChange('autoApproveLetters', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Side Panel Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-lg">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-green-400" /> Keamanan & Sistem
            </h4>
            <div className="space-y-4 text-sm opacity-90">
              <div className="flex justify-between py-2 border-b border-white/10">
                <span>Versi Aplikasi</span>
                <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-xs">v1.2.4</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span>Status Server</span>
                <span className="text-green-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span>Database</span>
                <span>PostgreSQL</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Terakhir Backup</span>
                <span>10 Menit lalu</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-white/10 hover:bg-white/20 py-2 rounded-xl text-sm font-medium transition-colors border border-white/10">
              Cek Log Sistem
            </button>
          </div>

          <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-100 text-yellow-800 text-sm">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Clock size={16} /> Perhatian
            </h4>
            <p className="opacity-90 leading-relaxed">
              Perubahan pada <strong>Biaya Layanan</strong> dan <strong>Ongkir</strong> akan berlaku untuk transaksi baru saja. Transaksi yang sedang berjalan tetap menggunakan tarif lama.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;