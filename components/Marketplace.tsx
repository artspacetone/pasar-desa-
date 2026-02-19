import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, Bell, ShoppingCart, MapPin, ChevronRight, 
  Utensils, Coffee, Leaf, Shirt, Wrench, 
  Image as ImageIcon, Store, Minus, Plus, Star, Heart,
  X, Filter, Tag, MessageCircle, CreditCard, Banknote, CheckCircle, Copy,
  ScanLine, Camera, ArrowLeft, RefreshCw, Bot
} from 'lucide-react';
import StoreAIAssistant from './StoreAIAssistant';

// Mock Data
const categories = [
  { id: 'all', name: 'Semua', icon: Store },
  { id: 'makanan', name: 'Makanan', icon: Utensils },
  { id: 'minuman', name: 'Minuman', icon: Coffee },
  { id: 'sayur', name: 'Sayuran', icon: Leaf },
  { id: 'pakaian', name: 'Pakaian', icon: Shirt },
  { id: 'peralatan', name: 'Peralatan', icon: Wrench },
];

const marketProducts = [
  { id: 1, name: 'Keripik Pisang Manis', store: 'Ratna Snack', phone: '6281234567890', bank: 'BRI 1234-5678-90', price: 15000, stock: 48, category: 'makanan', rating: 4.8, sold: 120, image: null, description: 'Keripik pisang kepok pilihan dengan balutan gula aren asli. Renyah, manis, dan tanpa pengawet.' },
  { id: 2, name: 'Abon Sapi Original', store: 'Dapur Asep', phone: '6281234567891', bank: 'BCA 0987-6543-21', price: 35000, stock: 12, category: 'makanan', rating: 4.9, sold: 85, image: null, description: 'Abon sapi asli kualitas premium. Cocok untuk lauk pauk praktis keluarga.' },
  { id: 3, name: 'Kopi Bubuk Robusta', store: 'Kopi Curug', phone: '6281234567892', bank: 'MANDIRI 1111-2222-33', price: 25000, stock: 20, category: 'minuman', rating: 4.7, sold: 200, image: null, description: 'Biji kopi robusta pilihan dari perkebunan lokal Curug Badak. Diroasting dengan tingkat kematangan pas.' },
  { id: 4, name: 'Bayam Segar Ikat', store: 'Kebun Dewi', phone: '6281234567893', bank: 'COD ONLY', price: 5000, stock: 20, category: 'sayur', rating: 4.9, sold: 50, image: null, description: 'Sayur bayam organik segar, dipetik langsung saat ada pesanan.' },
  { id: 5, name: 'Kaos Sablon Desa', store: 'Konveksi Maju', phone: '6281234567894', bank: 'BRI 5555-6666-77', price: 75000, stock: 50, category: 'pakaian', rating: 4.5, sold: 30, image: null, description: 'Kaos katun combed 30s dengan desain sablon khas desa wisata Curug Badak.' },
  { id: 6, name: 'Cangkul Baja', store: 'Pandai Besi Jaya', phone: '6281234567895', bank: 'BCA 8888-9999-00', price: 120000, stock: 5, category: 'peralatan', rating: 5.0, sold: 10, image: null, description: 'Cangkul baja tempa tangan, kuat dan tajam. Cocok untuk pertanian berat.' },
  { id: 7, name: 'Gula Aren Asli', store: 'Ratna Snack', phone: '6281234567890', bank: 'BRI 1234-5678-90', price: 18000, stock: 30, category: 'makanan', rating: 4.8, sold: 150, image: null, description: 'Gula aren murni tanpa campuran, wangi dan legit.' },
  { id: 8, name: 'Jahe Merah Instan', store: 'Kopi Curug', phone: '6281234567892', bank: 'MANDIRI 1111-2222-33', price: 20000, stock: 15, category: 'minuman', rating: 4.6, sold: 60, image: null, description: 'Minuman serbuk jahe merah instan, tinggal seduh. Hangat dan menyehatkan.' },
];

const Marketplace: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [qty, setQty] = useState(1);
  const [cartCount, setCartCount] = useState(2);
  const [isLiked, setIsLiked] = useState(false);
  
  // Store View State
  const [activeStore, setActiveStore] = useState<string | null>(null);
  const [isStoreAIOpen, setIsStoreAIOpen] = useState(false);

  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  
  // Checkout States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'success'>('form');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'transfer'>('cod');
  const [buyerDetails, setBuyerDetails] = useState({ name: 'Siti Aminah', address: 'RT 03 RW 05, Desa Curug Badak', note: '' });
  const [generatedOrderId, setGeneratedOrderId] = useState('');

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return marketProducts.filter(product => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.store.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStore = activeStore ? product.store === activeStore : true;
      
      return matchesCategory && matchesSearch && matchesStore;
    });
  }, [activeCategory, searchQuery, activeStore]);

  // Retrieve current store info (phone, etc) from the first product found
  const activeStoreInfo = useMemo(() => {
    if (!activeStore) return null;
    return marketProducts.find(p => p.store === activeStore);
  }, [activeStore]);

  // --- CAMERA LOGIC ---
  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraOpen(false);
    setIsScanning(false);
  };

  const handleScan = () => {
    setIsScanning(true);
    // Simulation: Wait 2 seconds then find a random product
    setTimeout(() => {
      const randomProduct = marketProducts[Math.floor(Math.random() * marketProducts.length)];
      stopCamera();
      setSelectedProduct(randomProduct);
      setQty(1);
      // alert(`Produk ditemukan: ${randomProduct.name}`);
    }, 1500);
  };

  // --- MODAL LOGIC ---
  const openModal = (product: any) => {
    setSelectedProduct(product);
    setQty(1);
    setIsLiked(false);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsCheckoutOpen(false);
    setCheckoutStep('form');
  };

  const handleVisitShop = (storeName: string) => {
    setActiveStore(storeName);
    setActiveCategory('all');
    setSearchQuery('');
    closeModal(); // Close product modal if open
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToMarket = () => {
    setActiveStore(null);
    setActiveCategory('all');
    setIsStoreAIOpen(false);
  };

  const handleAddToCart = () => {
    setCartCount(prev => prev + qty);
    closeModal();
  };

  // 1. Chat Seller (Stock Check)
  const handleChatStock = () => {
    if (!selectedProduct) return;
    const message = `Halo ${selectedProduct.store}, saya ingin tanya stok untuk produk "${selectedProduct.name}". Apakah masih tersedia?`;
    window.open(`https://wa.me/${selectedProduct.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleChatStoreWA = () => {
    if (!activeStoreInfo) return;
    const message = `Halo ${activeStoreInfo.store}, saya ingin bertanya tentang produk Anda di Marketplace Desa.`;
    window.open(`https://wa.me/${activeStoreInfo.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // 2. Open Checkout Form
  const handleBuyNow = () => {
    setIsCheckoutOpen(true);
  };

  // 3. Process Order (Internal)
  const handleProcessOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedOrderId(newOrderId);
    setCheckoutStep('success');
  };

  // 4. Final Confirmation (Send to WA)
  const handleConfirmToWA = () => {
    if (!selectedProduct) return;
    
    const total = selectedProduct.price * qty;
    let message = '';

    if (paymentMethod === 'transfer') {
      message = `*KONFIRMASI PEMBAYARAN*\n\n` +
        `Halo ${selectedProduct.store}, saya sudah membuat pesanan di aplikasi.\n` +
        `No Pesanan: *${generatedOrderId}*\n` +
        `Barang: ${selectedProduct.name} (${qty}x)\n` +
        `Total: Rp${total.toLocaleString('id-ID')}\n\n` +
        `Saya sudah transfer ke rekening ${selectedProduct.bank}. Mohon dicek dan diproses.`;
    } else {
      message = `*PESANAN BARU (COD)*\n\n` +
        `Halo ${selectedProduct.store}, saya pesan via aplikasi.\n` +
        `No Pesanan: *${generatedOrderId}*\n` +
        `Barang: ${selectedProduct.name} (${qty}x)\n` +
        `Total: Rp${total.toLocaleString('id-ID')}\n` +
        `Alamat: ${buyerDetails.address}\n\n` +
        `Mohon dikirim, saya bayar tunai di lokasi.`;
    }

    window.open(`https://wa.me/${selectedProduct.phone}?text=${encodeURIComponent(message)}`, '_blank');
    closeModal(); 
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-10 font-sans relative">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-b-3xl shadow-lg sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2.5">
            {activeStore ? (
              <button 
                onClick={handleBackToMarket}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-colors"
              >
                <ArrowLeft size={20} className="text-white" />
              </button>
            ) : (
              <div className="p-2 bg-green-500/20 rounded-xl backdrop-blur-sm border border-green-500/30">
                <Store className="text-green-400" size={20} />
              </div>
            )}
            
            <div>
              <h1 className="text-xl font-bold leading-none">{activeStore ? activeStore : 'Pasar Desa'}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{activeStore ? 'Lapak Resmi UMKM' : 'Produk Lokal Berkualitas'}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-slate-900 font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar with Camera Button */}
        {!activeStore && (
          <div className="bg-white rounded-2xl flex items-center px-4 py-3 mb-4 shadow-xl shadow-black/5">
            <Search size={18} className="text-slate-400 mr-3" />
            <input 
              type="text" 
              placeholder="Cari produk..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-sm text-slate-800 placeholder:text-slate-400"
            />
            {searchQuery ? (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            ) : (
              <button onClick={startCamera} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors" title="Scan Produk">
                <ScanLine size={20} />
              </button>
            )}
          </div>
        )}

        {/* Location / Store Info */}
        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-1.5 text-slate-300">
            <MapPin size={12} className="text-green-400" />
            <span>Lokasi: <strong className="text-white">Curug Badak, Maja</strong></span>
          </div>
          {!activeStore && (
            <div className="flex items-center gap-1.5 text-slate-300">
              <Filter size={12} />
              <span>Urutkan: <strong className="text-white">Terlaris</strong></span>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 max-w-5xl mx-auto space-y-8 mt-6">
        
        {/* Store Header Banner (Only when inside a store) */}
        {activeStore && (
          <div className="relative overflow-hidden bg-white rounded-3xl p-6 shadow-md border border-slate-100">
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {activeStore.charAt(0)}
                </div>
                <div className="flex-1">
                   <h2 className="text-2xl font-bold text-slate-800">{activeStore}</h2>
                   <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><Star size={14} className="text-orange-400 fill-orange-400" /> 4.8 Rating</span>
                      <span>•</span>
                      <span>{filteredProducts.length} Produk</span>
                   </div>
                   <div className="flex flex-wrap gap-2 mt-3">
                      {/* Tombol AI Agent */}
                      <button 
                        onClick={() => setIsStoreAIOpen(true)}
                        className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 hover:scale-105 transition-transform"
                      >
                         <Bot size={14} />
                         Tanya AI Toko
                      </button>

                      {/* Tombol WA Penjual */}
                      <button 
                        onClick={handleChatStoreWA}
                        className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg font-bold border border-green-200 flex items-center gap-1.5 hover:bg-green-100 transition-colors"
                      >
                         <MessageCircle size={14} />
                         Chat Penjual
                      </button>
                   </div>
                </div>
             </div>
             {/* Decor */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
          </div>
        )}

        {/* Categories (Hide if searching or in store view to keep it clean, optional) */}
        {!searchQuery && (
          <section>
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="font-bold text-slate-800 text-lg">Kategori</h3>
            </div>
            <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide -mx-4 px-4">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button 
                    key={cat.id} 
                    onClick={() => setActiveCategory(cat.id)}
                    className={`
                      flex flex-col items-center gap-2 min-w-[72px] p-3 rounded-2xl transition-all border
                      ${isActive 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 border-blue-600 scale-105' 
                        : 'bg-white text-slate-500 shadow-sm border-slate-100 hover:bg-slate-50'}
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center mb-1
                      ${isActive ? 'bg-white/20' : 'bg-slate-100'}
                    `}>
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-bold">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Promo Banner (Only on Main Market) */}
        {!searchQuery && !activeStore && activeCategory === 'all' && (
          <section className="relative overflow-hidden bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl p-6 shadow-lg shadow-orange-500/20 text-white">
            <div className="relative z-10 flex flex-col items-start">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold border border-white/20 mb-3">
                PROMO SPESIAL
              </span>
              <h4 className="text-2xl font-black leading-tight mb-2">Gratis Ongkir<br/>Se-Kecamatan!</h4>
              <p className="text-sm font-medium opacity-90 mb-4">Min. belanja Rp20.000 untuk produk UMKM.</p>
              <div className="bg-white text-orange-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2">
                <Tag size={14} />
                Kode: DESAKU
              </div>
            </div>
            
            {/* Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 right-10 w-24 h-24 bg-yellow-400/30 rounded-full blur-xl"></div>
          </section>
        )}

        {/* Products Grid */}
        <section>
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="font-bold text-slate-800 text-lg">
              {searchQuery ? `Hasil pencarian "${searchQuery}"` : activeStore ? 'Etalase Toko' : 'Rekomendasi Produk'}
            </h3>
            {!searchQuery && !activeStore && (
              <button className="text-blue-600 text-sm font-medium hover:underline">Lihat semua</button>
            )}
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => openModal(product)}
                  className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full flex flex-col"
                >
                  {/* Image Placeholder */}
                  <div className="aspect-square bg-slate-50 rounded-xl mb-3 relative overflow-hidden group-hover:bg-slate-100 transition-colors">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                      <ImageIcon size={32} />
                    </div>
                    {/* Badge */}
                    <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-700 shadow-sm flex items-center gap-1">
                      <Star size={8} className="text-orange-400 fill-orange-400" />
                      {product.rating}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <h4 className="font-bold text-slate-800 text-sm mb-1 leading-snug line-clamp-2">{product.name}</h4>
                    
                    {!activeStore && (
                      <div className="flex items-center gap-1 mb-2">
                        <Store size={10} className="text-green-500" />
                        <span className="text-[10px] text-slate-500 truncate">{product.store}</span>
                      </div>
                    )}
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="text-blue-600 font-bold text-base">
                        Rp{product.price.toLocaleString('id-ID')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {product.sold} terjual
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search size={32} />
              </div>
              <h3 className="text-slate-800 font-bold mb-1">Produk tidak ditemukan</h3>
              <p className="text-slate-500 text-sm">Coba kata kunci lain atau kategori berbeda.</p>
              <button 
                onClick={() => {setSearchQuery(''); setActiveCategory('all');}}
                className="mt-4 text-blue-600 font-medium text-sm hover:underline"
              >
                Reset Filter
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Product Modal */}
      {selectedProduct && !isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white w-full max-w-md sm:rounded-3xl rounded-t-3xl p-0 shadow-2xl flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative h-48 sm:h-56 bg-slate-100 sm:rounded-t-3xl rounded-t-3xl flex items-center justify-center shrink-0">
              <ImageIcon size={64} className="text-slate-300" />
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white backdrop-blur-md rounded-full text-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1">{selectedProduct.name}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-blue-600 text-lg">Rp{selectedProduct.price.toLocaleString('id-ID')}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 text-xs">Stok: {selectedProduct.stock}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-pink-50 text-pink-500' : 'bg-slate-50 text-slate-400'}`}
                >
                  <Heart size={20} className={isLiked ? 'fill-pink-500' : ''} />
                </button>
              </div>

              {/* Store Info Row */}
              <div className="flex items-center gap-3 py-3 border-y border-slate-100 my-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                  {selectedProduct.store.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm">{selectedProduct.store}</h4>
                  <p className="text-[10px] text-slate-500">UMKM Terverifikasi • Curug Badak</p>
                </div>
                
                {/* Tombol Kunjungi Toko vs Chat (Conditional) */}
                {activeStore !== selectedProduct.store ? (
                  <button 
                    onClick={() => handleVisitShop(selectedProduct.store)}
                    className="text-xs font-bold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-50 flex items-center gap-1"
                  >
                    <Store size={14} />
                    Kunjungi Toko
                  </button>
                ) : (
                  <button 
                    onClick={handleChatStock}
                    className="text-xs font-bold text-green-600 border border-green-200 px-3 py-1.5 rounded-full hover:bg-green-50 flex items-center gap-1"
                  >
                    <MessageCircle size={14} />
                    Chat Penjual
                  </button>
                )}
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-slate-800 text-sm mb-2">Deskripsi Produk</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedProduct.description || 'Produk asli berkualitas dari UMKM Desa Curug Badak. Dibuat dengan bahan pilihan dan proses yang higienis.'}
                </p>
              </div>
            </div>

            {/* Footer Actions - Split Actions */}
            <div className="p-4 border-t border-slate-100 bg-white sm:rounded-b-3xl pb-8 sm:pb-4">
              <div className="flex gap-4">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 h-12">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-200 rounded-l-xl transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-8 text-center font-bold text-slate-800">{qty}</span>
                  <button 
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-200 rounded-r-xl transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="px-4 bg-white border border-slate-200 text-slate-600 h-12 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center"
                  title="Tambah ke Keranjang"
                >
                  <ShoppingCart size={18} />
                </button>

                {/* Tombol Beli Langsung -> Memicu Checkout Internal */}
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 bg-blue-600 text-white h-12 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors"
                >
                  Beli Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Internal Modal */}
      {isCheckoutOpen && selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div 
            className="bg-white w-full max-w-md sm:rounded-3xl rounded-t-3xl p-0 shadow-2xl flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Checkout Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 sm:rounded-t-3xl rounded-t-3xl">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                {checkoutStep === 'form' ? 'Checkout Pesanan' : 'Pesanan Berhasil Dibuat'}
              </h3>
              <button 
                onClick={closeModal}
                className="p-1 hover:bg-slate-200 rounded-full text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {checkoutStep === 'form' ? (
                <form id="checkout-form" onSubmit={handleProcessOrder} className="space-y-5">
                   {/* Summary Item */}
                   <div className="flex gap-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-slate-300 border border-slate-100">
                        <ImageIcon size={24} />
                      </div>
                      <div className="flex-1">
                         <h4 className="font-bold text-slate-800 text-sm">{selectedProduct.name}</h4>
                         <p className="text-xs text-slate-500 mb-1">{selectedProduct.store}</p>
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">{qty} x Rp{selectedProduct.price.toLocaleString('id-ID')}</span>
                            <span className="font-bold text-blue-600">Rp{(qty * selectedProduct.price).toLocaleString('id-ID')}</span>
                         </div>
                      </div>
                   </div>

                   {/* Form Details */}
                   <div className="space-y-3">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <MapPin size={16} /> Alamat Pengiriman
                      </h4>
                      <input 
                        type="text" 
                        required
                        value={buyerDetails.name}
                        onChange={e => setBuyerDetails({...buyerDetails, name: e.target.value})}
                        placeholder="Nama Penerima"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <textarea 
                        required
                        value={buyerDetails.address}
                        onChange={e => setBuyerDetails({...buyerDetails, address: e.target.value})}
                        placeholder="Alamat Lengkap (RT/RW, Patokan)"
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                      />
                   </div>

                   {/* Payment Method */}
                   <div className="space-y-3">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <CreditCard size={16} /> Metode Pembayaran
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                         <label className={`
                            border rounded-xl p-3 cursor-pointer transition-all flex flex-col items-center gap-2 text-center relative
                            ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50'}
                         `}>
                            <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="sr-only" />
                            <Banknote size={24} className={paymentMethod === 'cod' ? 'text-blue-500' : 'text-slate-400'} />
                            <span className="text-xs font-bold">Bayar di Tempat (COD)</span>
                            {paymentMethod === 'cod' && <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>}
                         </label>
                         
                         <label className={`
                            border rounded-xl p-3 cursor-pointer transition-all flex flex-col items-center gap-2 text-center relative
                            ${paymentMethod === 'transfer' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50'}
                         `}>
                            <input type="radio" name="payment" value="transfer" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} className="sr-only" />
                            <CreditCard size={24} className={paymentMethod === 'transfer' ? 'text-blue-500' : 'text-slate-400'} />
                            <span className="text-xs font-bold">Transfer Bank Langsung</span>
                            {paymentMethod === 'transfer' && <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>}
                         </label>
                      </div>
                      
                      {/* Secure Info */}
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-50 p-2 rounded-lg">
                         <CheckCircle size={12} className="text-green-500" />
                         <span>Pembayaran aman. Konfirmasi dilakukan langsung ke penjual setelah pesanan dibuat.</span>
                      </div>
                   </div>
                </form>
              ) : (
                <div className="text-center space-y-6">
                   <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-300">
                      <CheckCircle size={40} className="text-green-600" />
                   </div>
                   
                   <div>
                      <h4 className="text-xl font-bold text-slate-800">Pesanan Diterima!</h4>
                      <p className="text-sm text-slate-500 mt-1">ID Pesanan: <span className="font-mono font-bold text-slate-700">{generatedOrderId}</span></p>
                   </div>

                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-3">
                      <h5 className="font-bold text-slate-800 text-sm">Instruksi Pembayaran:</h5>
                      
                      {paymentMethod === 'transfer' ? (
                        <>
                          <div className="bg-white p-3 rounded-xl border border-slate-200">
                             <p className="text-xs text-slate-500 mb-1">Silakan transfer ke rekening penjual:</p>
                             <div className="flex justify-between items-center">
                                <span className="font-mono font-bold text-slate-800 text-sm">{selectedProduct.bank}</span>
                                <button className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Copy size={14} /></button>
                             </div>
                             <p className="text-[10px] text-slate-400 mt-1">a.n {selectedProduct.store}</p>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Setelah transfer, silakan kirim bukti pembayaran ke WhatsApp penjual untuk mempercepat proses pengiriman.
                          </p>
                        </>
                      ) : (
                        <div className="bg-white p-3 rounded-xl border border-slate-200 flex gap-3 items-center">
                           <Banknote className="text-green-600" size={24} />
                           <div>
                              <p className="font-bold text-slate-800 text-sm">Siapkan Uang Tunai</p>
                              <p className="text-xs text-slate-500">Sebesar <strong>Rp{(qty * selectedProduct.price).toLocaleString('id-ID')}</strong> saat kurir tiba.</p>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-slate-100 bg-white sm:rounded-b-3xl">
              {checkoutStep === 'form' ? (
                <button 
                  type="submit"
                  form="checkout-form"
                  className="w-full bg-blue-600 text-white h-12 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors"
                >
                  Buat Pesanan
                </button>
              ) : (
                <button 
                  onClick={handleConfirmToWA}
                  className="w-full bg-green-600 text-white h-12 rounded-xl font-bold shadow-lg shadow-green-600/30 hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  Konfirmasi ke WA Penjual
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Camera Fullscreen Overlay */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Scanning Animation Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border-2 border-white/50 rounded-2xl relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 -mt-1 -ml-1"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 -mt-1 -mr-1"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 -mb-1 -ml-1"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 -mb-1 -mr-1"></div>
              
              <div className="absolute inset-x-0 h-0.5 bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          </div>

          <div className="absolute top-6 left-6 z-10">
            <button onClick={stopCamera} className="p-2 bg-black/40 rounded-full text-white backdrop-blur-md">
              <X size={24} />
            </button>
          </div>

          <div className="absolute bottom-10 w-full flex justify-center items-center gap-6">
            <button className="p-3 rounded-full bg-white/10 text-white backdrop-blur-md">
              <ImageIcon size={24} />
            </button>
            <button 
              onClick={handleScan}
              disabled={isScanning}
              className="w-16 h-16 rounded-full bg-white border-4 border-slate-300 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              {isScanning ? (
                 <RefreshCw size={24} className="text-slate-600 animate-spin" />
              ) : (
                <div className="w-12 h-12 bg-slate-100 rounded-full"></div>
              )}
            </button>
            <div className="w-12"></div> {/* Spacer for balance */}
          </div>
          
          <div className="absolute bottom-32 text-white/80 text-sm font-medium bg-black/40 px-4 py-1 rounded-full backdrop-blur-md">
             Arahkan kamera ke produk
          </div>
        </div>
      )}

      {/* Store AI Chat Overlay */}
      {activeStore && (
        <StoreAIAssistant 
          isOpen={isStoreAIOpen}
          onClose={() => setIsStoreAIOpen(false)}
          storeName={activeStore}
          products={filteredProducts}
        />
      )}
      
      {/* CSS for Scan Animation */}
      <style>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Marketplace;