import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Plus, Edit, Trash2, Save, X, 
  Tag, Layers, LayoutGrid, MoreHorizontal, Loader2 
} from 'lucide-react';
import { Category } from '../types';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
      setCategories(cats);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory.name) return;

    try {
      if (isEditing && currentCategory.id) {
        await updateDoc(doc(db, "categories", currentCategory.id), currentCategory);
      } else {
        await addDoc(collection(db, "categories"), {
          name: currentCategory.name,
          description: currentCategory.description || '',
          productCount: 0
        });
      }
      setIsModalOpen(false);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus kategori ini?')) {
      await deleteDoc(doc(db, "categories", id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kategori Produk</h2>
        <button onClick={() => { setIsEditing(false); setCurrentCategory({}); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Plus size={18} /> Tambah</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {loading ? <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div> : (
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-bold uppercase text-slate-500">
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Deskripsi</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td className="px-6 py-4 font-bold">{cat.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{cat.description}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => { setIsEditing(true); setCurrentCategory(cat); setIsModalOpen(true); }} className="p-2 text-blue-600"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">{isEditing ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Nama Kategori" value={currentCategory.name || ''} onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})} className="w-full p-2.5 border rounded-xl" />
              <textarea placeholder="Deskripsi" value={currentCategory.description || ''} onChange={e => setCurrentCategory({...currentCategory, description: e.target.value})} className="w-full p-2.5 border rounded-xl" />
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-2.5 border rounded-xl">Batal</button>
                <button type="submit" className="flex-1 p-2.5 bg-blue-600 text-white rounded-xl">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;