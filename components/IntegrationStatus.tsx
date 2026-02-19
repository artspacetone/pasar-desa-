import React, { useState } from 'react';
import {
  User, MapPin, CreditCard, FileSignature, Megaphone,
  Activity, HandCoins, ChevronRight, Users, Baby,
  FileX, Truck, Home, Info, Download, CheckCircle,
  FileText, X, AlertCircle
} from 'lucide-react';

// Types for local state
type ModalType = 'service' | 'kendedes' | null;
type ServiceType = 'ktp' | 'kk' | 'akta-lahir' | 'akta-mati' | 'pindah' | 'kia' | 'surat' | 'pengaduan' | 'kesehatan' | 'pajak' | null;

const IntegrationStatus: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const openServiceModal = (type: ServiceType) => {
    setSelectedService(type);
    setActiveModal('service');
  };

  const openKendedesModal = () => {
    setActiveModal('kendedes');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedService(null);
    setShowSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      closeModal();
      // In a real app, use a toast notification here
      console.log('Pengajuan berhasil');
    }, 1500);
  };

  const getModalTitle = () => {
    switch (selectedService) {
      case 'ktp': return 'Ajukan e-KTP';
      case 'kk': return 'Ajukan Perubahan KK';
      case 'akta-lahir': return 'Ajukan Akta Kelahiran';
      case 'akta-mati': return 'Lapor Akta Kematian';
      case 'kia': return 'Ajukan KIA';
      case 'pindah': return 'Ajukan Surat Pindah';
      case 'surat': return 'Ajukan Surat Keterangan';
      case 'pengaduan': return 'Sampaikan Pengaduan';
      case 'kesehatan': return 'Layanan Kesehatan';
      case 'pajak': return 'Info Pajak';
      default: return 'Layanan Desa';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-10 font-sans relative max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-b-3xl shadow-lg mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-4 border-green-500 shadow-md">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Selamat Datang, Siti Aminah</h2>
            <p className="text-slate-300 text-sm flex items-center gap-1.5 mt-1">
              <MapPin size={12} className="text-green-400" />
              RT 03 / RW 05, Curug Badak
            </p>
            <div className="mt-2 inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs backdrop-blur-sm border border-white/10">
              <CreditCard size={12} />
              <span className="font-mono">NIK: 3604123456789012</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Surat Aktif', value: '3', color: 'text-green-400' },
            { label: 'Pengaduan', value: '2', color: 'text-yellow-400' },
            { label: 'Tagihan', value: 'Rp 0', color: 'text-white' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center border border-white/10">
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] uppercase tracking-wider opacity-70 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Layanan Cepat */}
        <section>
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="font-semibold text-slate-800 text-lg">Layanan Cepat</h3>
            <button className="text-blue-600 text-sm flex items-center gap-1 hover:underline">
              Semua <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { id: 'surat', label: 'Surat Online', icon: FileSignature },
              { id: 'pengaduan', label: 'Pengaduan', icon: Megaphone },
              { id: 'kesehatan', label: 'Kesehatan', icon: Activity },
              { id: 'pajak', label: 'Pajak', icon: HandCoins },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => openServiceModal(item.id as ServiceType)}
                className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2 hover:shadow-md transition-all active:scale-95"
              >
                <div className="text-blue-600">
                  <item.icon size={26} />
                </div>
                <span className="text-xs font-medium text-slate-600 leading-tight">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Banner KENDEDES */}
        <section 
          className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-3xl p-5 shadow-lg shadow-amber-500/20 text-slate-900 flex justify-between items-center cursor-pointer hover:brightness-105 transition-all"
          onClick={openKendedesModal}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CreditCard size={18} className="text-slate-900" />
              <h4 className="text-lg font-bold">Layanan KENDEDES</h4>
            </div>
            <p className="text-sm font-medium opacity-90">Urus KTP, KK, Akta langsung di desa • Gratis!</p>
          </div>
          <button className="bg-white/90 text-amber-600 px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-white">
            Ajukan
          </button>
        </section>

        {/* Layanan Administrasi List */}
        <section>
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="font-semibold text-slate-800 text-lg">Layanan Administrasi</h3>
            <button className="text-blue-600 text-sm hover:underline">Riwayat</button>
          </div>
          <div className="space-y-3">
            {[
              { id: 'ktp', title: 'e-KTP', desc: 'Pengajuan baru / perpanjangan', icon: CreditCard, status: 'Tersedia' },
              { id: 'kk', title: 'Kartu Keluarga (KK)', desc: 'Perubahan data / cetak ulang', icon: Users, status: 'Tersedia' },
              { id: 'akta-lahir', title: 'Akta Kelahiran', desc: 'Untuk anak usia 0-60 hari', icon: Baby, status: 'Tersedia' },
              { id: 'akta-mati', title: 'Akta Kematian', desc: 'Laporan kematian warga', icon: FileX, status: 'Tersedia' },
              { id: 'pindah', title: 'Surat Pindah', desc: 'Pindah datang / pindah keluar', icon: Truck, status: 'Tersedia' },
              { id: 'kia', title: 'Kartu Identitas Anak', desc: 'Untuk anak di bawah 17 tahun', icon: Baby, status: 'Tersedia' },
              { id: 'domisili', title: 'Surat Domisili', desc: 'Untuk keperluan administrasi', icon: Home, status: 'Dalam Proses' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                  <item.icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-800 text-sm truncate">{item.title}</h4>
                  <p className="text-xs text-slate-500 truncate">{item.desc}</p>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === 'Tersedia' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <button 
                  onClick={() => item.status === 'Tersedia' && openServiceModal(item.id as ServiceType)}
                  disabled={item.status !== 'Tersedia'}
                  className={`px-4 py-2 rounded-full text-xs font-semibold ${
                    item.status === 'Tersedia' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {item.status === 'Tersedia' ? 'Ajukan' : 'Proses'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Pengumuman */}
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
            <Megaphone className="text-amber-500" size={20} />
            <h4 className="font-bold text-slate-800">Pengumuman & Agenda</h4>
          </div>
          <div className="space-y-4">
            {[
              { tag: 'IMUNISASI', title: 'Posyandu Balita - Jumat, 25 Februari', time: '2 hari lagi' },
              { tag: 'SOSIALISASI', title: 'Penyuluhan Stunting di Balai Desa', time: '1 minggu' },
              { tag: 'PEMBAYARAN', title: 'PBB-P2 jatuh tempo 31 Maret', time: '14 hari' },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-start group">
                <div>
                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold mb-1">
                    {item.tag}
                  </span>
                  <p className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{item.title}</p>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Transparansi Anggaran */}
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-800">📊 Realisasi APBDes 2026</h4>
            <Download size={16} className="text-blue-600" />
          </div>
          
          <div className="space-y-4">
            {[
              { label: 'Pendapatan Desa', val: 'Rp 1,26 M / Rp 2,40 M', pct: 52 },
              { label: 'Belanja Desa', val: 'Rp 1,06 M / Rp 2,36 M', pct: 44 },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-600">{item.label}</span>
                  <span className="text-slate-500">{item.val}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <div className="text-right text-[10px] text-slate-400 mt-1">{item.pct}% Terealisasi</div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 text-xs text-blue-600 font-medium flex items-center justify-center gap-1 hover:bg-blue-50 py-2 rounded-xl transition-colors">
            <Info size={14} /> Lihat Detail Transparansi
          </button>
        </section>
      </div>

      {/* Service Modal */}
      {activeModal === 'service' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">{getModalTitle()}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
                <input type="text" value="Siti Aminah" readOnly className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-sm focus:outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">NIK</label>
                <div className="relative">
                  <input type="text" value="3604123456789012" readOnly className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-sm focus:outline-none" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-md">
                    <CheckCircle size={12} />
                    Valid
                  </div>
                </div>
              </div>

              {selectedService === 'surat' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Jenis Surat</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                    <option>Surat Keterangan Domisili</option>
                    <option>Surat Pengantar SKCK</option>
                    <option>Surat Keterangan Tidak Mampu</option>
                    <option>Surat Keterangan Usaha</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Keperluan</label>
                <textarea 
                  rows={3} 
                  placeholder="Contoh: Untuk melamar pekerjaan..." 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Upload Berkas (Opsional)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="mx-auto w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-2">
                    <Download size={20} className="rotate-180" />
                  </div>
                  <p className="text-xs text-slate-500">Klik untuk upload PDF/JPG (Maks 2MB)</p>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={showSuccess}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {showSuccess ? (
                  <>
                    <CheckCircle size={20} />
                    Terkirim!
                  </>
                ) : (
                  'Kirim Permohonan'
                )}
              </button>
            </form>

            <p className="text-xs text-center text-slate-400 mt-4">
              Status pengajuan dapat dicek di menu Riwayat. Surat jadi dapat diambil di kantor desa atau dikirim via Pos.
            </p>
          </div>
        </div>
      )}

      {/* Kendedes Modal */}
      {activeModal === 'kendedes' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Layanan Kependudukan</h3>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                <X size={24} />
              </button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl flex gap-3 mb-6">
              <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-blue-800">
                Layanan ini bekerja sama dengan Disdukcapil. Data diverifikasi otomatis via SIAK. Dokumen fisik diambil di kantor desa.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { label: 'e-KTP (Baru/Perpanjangan)', icon: CreditCard },
                { label: 'Kartu Keluarga', icon: Users },
                { label: 'Akta Kelahiran', icon: Baby },
                { label: 'Kartu Identitas Anak (KIA)', icon: User }
              ].map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => alert('Fitur ini akan terhubung langsung dengan sistem Disdukcapil.')}
                  className="w-full flex items-center p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group text-left"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm mr-4 group-hover:scale-110 transition-transform">
                    <item.icon size={20} />
                  </div>
                  <span className="font-medium text-slate-700 group-hover:text-blue-700 flex-1">{item.label}</span>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationStatus;