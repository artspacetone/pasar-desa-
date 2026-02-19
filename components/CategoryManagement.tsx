import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Edit, Trash2, Save, X, 
  Tag, Layers, LayoutGrid, MoreHorizontal 
} from 'lucide-react';
import { Category } from '../types';

// Initial Mock Data
const initialCategories: Category[] = [
  { id: '1', name: 'Makanan', productCount: 45, description: 'Aneka jajanan, makanan ringan, dan lauk pauk.' },
  { id: '2', name: 'Minuman', productCount: 20, description: 'Kopi, jus, dan minuman herbal tradisional.' },
  { id: '3', name: 'Sayuran', productCount: 32, description: 'Hasil panen segar dari kebun warga desa.' },
  { id: '4', name: 'Pakaian', productCount: 15, description: 'Kaos sablon, batik, dan kerajinan tekstil.' },
  { id: '5', name: 'Peralatan', productCount: 8, description: 'Alat pertanian dan pertukangan.' },
  { id: '6', name: 'Kerajinan', productCount: 12, description: 'Souvenir dan anyaman bambu khas desa.' },
];

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});

  // CRUD Logic
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [categories, searchQuery]);

  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentCategory({
      name: '',
      description: '',
      productCount: 0
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setIsEditing(true);
    setCurrentCategory({ ...category });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    // In a real app, you might check if products are using this category first
    if (window.confirm('Hapus kategori ini? Pastikan tidak ada produk yang menggunakan kategori ini.')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory.name) return;

    if (isEditing && currentCategory.id) {
      setCategories(categories.map(c => c.id === currentCategory.id ? currentCategory as Category : c));
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: currentCategory.name,
        description: currentCategory.description || '',
        productCount: 0, // Default 0 for new categories
      };
      setCategories([...categories, newCategory]);
    }
    setIsModalOpen(false);
  };

  // Generate random gradient for category icon background
  const getIconColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-orange-100 text-orange-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
      'bg-cyan-100 text-cyan-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Kategori Produk</h2>
          <p className="text-sm text-slate-500 mt-1">Atur pengelompokan produk di pasar desa.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 text-sm font-bold"
        >
          <Plus size={18} />
          Tambah Kategori
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama kategori..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Kategori</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Jumlah Produk</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <tr key={category.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getIconColor(index)}`}>
                          <Tag size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{category.name}</p>
                          <p className="text-xs text-slate-500">ID: {category.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 line-clamp-1">{category.description || '-'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {category.productCount} Produk
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEditClick(category)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Edit Kategori"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <div className="h-4 w-px bg-slate-200 mx-1"></div>

                        <button 
                          onClick={() => handleDeleteClick(category.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Hapus Kategori"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Layers size={24} />
                      </div>
                      <p className="text-base font-medium text-slate-600">Kategori tidak ditemukan</p>
                      <p className="text-sm">Silakan tambah kategori baru.</p>
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
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                {isEditing ? <Edit size={18} className="text-blue-600" /> : <Plus size={18} className="text-blue-600" />}
                {isEditing ? 'Edit Kategori' : 'Tambah Kategori'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Kategori</label>
                <div className="relative">
                  <LayoutGrid size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    value={currentCategory.name || ''}
                    onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Contoh: Makanan Ringan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Deskripsi Singkat</label>
                <textarea 
                  rows={3}
                  value={currentCategory.description || ''}
                  onChange={e => setCurrentCategory({...currentCategory, description: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  placeholder="Deskripsi kategori ini..."
                />
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
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;