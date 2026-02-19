import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Edit, EyeOff, Filter, 
  Trash2, Eye, Save, X, Package, 
  Store, Tag, AlertCircle, CheckCircle 
} from 'lucide-react';
import { Product } from '../types';

// Initial Mock Data
const initialProducts: Product[] = [
  { id: '1', name: 'Keripik Pisang Manis', shopName: 'Ratna Snack', price: 15000, stock: 48, status: 'Aktif', category: 'Makanan' },
  { id: '2', name: 'Abon Sapi Original', shopName: 'Dapur Asep', price: 35000, stock: 12, status: 'Aktif', category: 'Makanan' },
  { id: '3', name: 'Kopi Bubuk Robusta', shopName: 'Kopi Curug', price: 25000, stock: 0, status: 'Habis', category: 'Minuman' },
  { id: '4', name: 'Sayur Bayam Segar', shopName: 'Kebun Dewi', price: 5000, stock: 20, status: 'Aktif', category: 'Sayuran' },
  { id: '5', name: 'Sambal Terasi Botol', shopName: 'Dapur Asep', price: 12000, stock: 30, status: 'Disembunyikan', category: 'Makanan' },
  { id: '6', name: 'Kaos Sablon Desa', shopName: 'Konveksi Maju', price: 75000, stock: 50, status: 'Aktif', category: 'Pakaian' },
];

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua Kategori');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

  // CRUD Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.shopName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'Semua Kategori' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  // Handlers
  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentProduct({
      status: 'Aktif',
      category: 'Makanan',
      stock: 0,
      price: 0
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setIsEditing(true);
    setCurrentProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleToggleStatus = (product: Product) => {
    const newStatus = product.status === 'Disembunyikan' ? 'Aktif' : 'Disembunyikan';
    // If stock is 0, keep/force it as 'Habis' unless user is hiding it
    const finalStatus = (product.stock === 0 && newStatus === 'Aktif') ? 'Habis' : newStatus;
    
    setProducts(products.map(p => p.id === product.id ? { ...p, status: finalStatus } : p));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.name || !currentProduct.shopName) return;

    // Logic to determine status based on stock if currently Active
    let finalStatus = currentProduct.status;
    if (currentProduct.stock === 0 && currentProduct.status === 'Aktif') {
      finalStatus = 'Habis';
    } else if (currentProduct.stock && currentProduct.stock > 0 && currentProduct.status === 'Habis') {
      finalStatus = 'Aktif';
    }

    if (isEditing && currentProduct.id) {
      setProducts(products.map(p => p.id === currentProduct.id ? { ...currentProduct, status: finalStatus } as Product : p));
    } else {
      const newProduct: Product = {
        ...(currentProduct as Product),
        id: Date.now().toString(),
        status: finalStatus as any
      };
      setProducts([...products, newProduct]);
    }
    setIsModalOpen(false);
  };

  // Get unique categories for filter
  const categories = ['Semua Kategori', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daftar Produk</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola inventaris produk UMKM desa.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 text-sm font-bold"
        >
          <Plus size={18} />
          Tambah Produk
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
              placeholder="Cari nama produk atau toko..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            />
          </div>
          <div className="relative min-w-[200px]">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer hover:border-blue-300 transition-colors"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Info Produk</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Toko / UMKM</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stok & Kategori</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{product.name}</p>
                          <p className="text-xs text-slate-500">ID: #{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Store size={14} className="text-slate-400" />
                        <span className="text-sm font-medium">{product.shopName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-blue-600">
                        Rp {product.price.toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`text-xs font-medium ${product.stock < 10 ? 'text-red-500' : 'text-slate-600'}`}>
                          {product.stock} unit
                        </span>
                        <span className="inline-flex w-fit items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                          <Tag size={10} />
                          {product.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                        product.status === 'Aktif' ? 'bg-green-100 text-green-700' :
                        product.status === 'Habis' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {product.status === 'Aktif' && <CheckCircle size={12} />}
                        {product.status === 'Habis' && <AlertCircle size={12} />}
                        {product.status === 'Disembunyikan' && <EyeOff size={12} />}
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleToggleStatus(product)}
                          className={`p-2 rounded-lg transition-colors ${
                            product.status === 'Disembunyikan' 
                              ? 'text-slate-400 hover:text-green-600 hover:bg-green-50' 
                              : 'text-slate-400 hover:text-orange-600 hover:bg-orange-50'
                          }`}
                          title={product.status === 'Disembunyikan' ? 'Tampilkan Produk' : 'Sembunyikan Produk'}
                        >
                          {product.status === 'Disembunyikan' ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        
                        <button 
                          onClick={() => handleEditClick(product)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Edit Produk"
                        >
                          <Edit size={16} />
                        </button>

                        <div className="h-4 w-px bg-slate-200 mx-1"></div>

                        <button 
                          onClick={() => handleDeleteClick(product.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Hapus Produk"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Package size={24} />
                      </div>
                      <p className="text-base font-medium text-slate-600">Produk tidak ditemukan</p>
                      <p className="text-sm">Coba kata kunci lain atau ubah filter kategori.</p>
                      <button 
                        onClick={() => {setSearchQuery(''); setCategoryFilter('Semua Kategori');}}
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
                {isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Produk</label>
                  <input 
                    type="text" 
                    required
                    value={currentProduct.name || ''}
                    onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Contoh: Keripik Pisang"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Toko / UMKM</label>
                  <div className="relative">
                    <Store size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={currentProduct.shopName || ''}
                      onChange={e => setCurrentProduct({...currentProduct, shopName: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Nama UMKM Pemilik"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Harga (Rp)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={currentProduct.price || ''}
                    onChange={e => setCurrentProduct({...currentProduct, price: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Stok</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={currentProduct.stock !== undefined ? currentProduct.stock : ''}
                    onChange={e => setCurrentProduct({...currentProduct, stock: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori</label>
                  <select 
                    value={currentProduct.category || 'Makanan'}
                    onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Sayuran">Sayuran</option>
                    <option value="Pakaian">Pakaian</option>
                    <option value="Peralatan">Peralatan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                  <select 
                    value={currentProduct.status || 'Aktif'}
                    onChange={e => setCurrentProduct({...currentProduct, status: e.target.value as any})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Habis">Habis</option>
                    <option value="Disembunyikan">Disembunyikan</option>
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
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;