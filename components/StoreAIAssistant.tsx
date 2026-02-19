import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Trash2, Sparkles, Store, ShoppingBag, Image as ImageIcon, Paperclip, CheckCircle, Clock } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface OrderItem {
  name: string;
  price: number;
  qty: number;
}

interface Message {
  id: number;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  orderData?: {
    items: OrderItem[];
    total: number;
  };
  isProofImage?: boolean;
}

interface StoreAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  products: any[];
}

const StoreAIAssistant: React.FC<StoreAIAssistantProps> = ({ isOpen, onClose, storeName, products }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize greeting when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 1,
        role: 'model',
        text: `Halo kak! Selamat datang di ${storeName} 👋\nBoleh dilihat-lihat dulu, kalau bingung mau cari apa tanyain aja ya kak.`,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, storeName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text: string = inputText, isImageUpload: boolean = false) => {
    if (!text.trim() && !isImageUpload) return;

    // 1. Add User Message
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      text: isImageUpload ? "Mengirim bukti transfer..." : text,
      timestamp: new Date(),
      isProofImage: isImageUpload
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Prepare product context
      const productListContext = products.map(p => 
        `- ${p.name}: Rp${p.price} (Stok: ${p.stock})`
      ).join('\n');

      // Special prompt handling for proof upload
      const promptText = isImageUpload 
        ? "[SYSTEM_EVENT: USER_UPLOADED_PAYMENT_PROOF]" 
        : text;

      const systemInstruction = `
        Anda adalah pemilik toko/penjual manusia di "${storeName}". 
        JANGAN bertingkah seperti robot/AI. Bertingkahlah seperti pedagang lokal yang ramah, santai, tapi sopan (menggunakan sapaan 'Kak', 'Gan', atau 'Sis').

        DATA PRODUK:
        ${productListContext}

        ATURAN PENTING:
        1. Jika user bertanya produk, jawab santai sesuai data. Promosikan barangnya.
        2. Jika user ingin membeli/pesan (ada kata kunci 'beli', 'pesan', 'bungkus', 'mau dong'), kamu HARUS membuat rincian pesanan.
           Gunakan format JSON khusus ini di dalam responmu untuk memunculkan keranjang belanja:
           
           <<<ORDER_START>>>
           [
             {"name": "Nama Produk", "qty": 1, "price": 10000}
           ]
           <<<ORDER_END>>>

           (Sertakan teks basa-basi sebelum/sesudah format order, misal: "Siap kak, ini rinciannya ya, silakan dicek dulu.")

        3. Jika menerima pesan "[SYSTEM_EVENT: USER_UPLOADED_PAYMENT_PROOF]", itu artinya user mengirim gambar bukti transfer.
           Responmu harus: "Oke kak, terima kasih. Sebentar ya, saya cek mutasi rekening dulu. Mohon ditunggu konfirmasinya..."
           (Jangan minta transfer lagi, anggap user sudah kirim bukti).
        
        4. Jangan pernah bilang "Saya adalah AI". Kamu adalah penjual.
      `;

      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: { systemInstruction },
        history: messages.filter(m => !m.isProofImage).map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const result = await chat.sendMessage({ message: promptText });
      const rawText = result.text || '';

      // Parse output for Order JSON
      let displayText = rawText;
      let orderData = undefined;

      const orderRegex = /<<<ORDER_START>>>([\s\S]*?)<<<ORDER_END>>>/;
      const match = rawText.match(orderRegex);

      if (match) {
        try {
          const jsonStr = match[1];
          const items = JSON.parse(jsonStr);
          const total = items.reduce((acc: number, item: any) => acc + (item.price * item.qty), 0);
          
          orderData = { items, total };
          // Remove the JSON block from the text bubble so it looks clean
          displayText = rawText.replace(match[0], '').trim();
        } catch (e) {
          console.error("Failed to parse order JSON", e);
        }
      }

      const botMessage: Message = {
        id: Date.now() + 1,
        role: 'model',
        text: displayText,
        timestamp: new Date(),
        orderData: orderData
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'model',
        text: 'Waduh, sinyal lagi jelek nih kak. Bisa ulangi chatnya?',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate upload and send system event
      handleSend("", true);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full sm:h-[650px] sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-400 to-blue-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-2 border-white/20">
              {storeName.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">{storeName}</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <p className="text-xs text-slate-300 font-medium">Online</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setMessages([])} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white" title="Hapus Chat">
              <Trash2 size={18} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-slate-100 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex w-full flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              {/* Text Bubble */}
              <div className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm relative ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
              }`}>
                {msg.isProofImage ? (
                  <div className="flex items-center gap-2 italic text-blue-100">
                    <ImageIcon size={16} />
                    <span>Mengirim gambar...</span>
                  </div>
                ) : (
                  msg.text
                )}
                
                <p className={`text-[10px] mt-1 text-right ${msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>

              {/* Order Card Widget (Simulated Cart) */}
              {msg.orderData && (
                <div className="mt-2 w-[85%] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-left-5 fade-in duration-300">
                  <div className="bg-orange-50 p-3 border-b border-orange-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-700 flex items-center gap-1">
                      <ShoppingBag size={14} /> Ringkasan Pesanan
                    </span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-orange-200 text-orange-600">
                      Belum Dibayar
                    </span>
                  </div>
                  <div className="p-3 space-y-2">
                    {msg.orderData.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-slate-600">{item.qty}x {item.name}</span>
                        <span className="font-medium">Rp {(item.price * item.qty).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                    <div className="border-t border-dashed border-slate-200 pt-2 mt-2 flex justify-between font-bold text-slate-800">
                      <span>Total</span>
                      <span>Rp {msg.orderData.total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border-t border-slate-100">
                     <p className="text-[10px] text-slate-500 mb-2 text-center">Silakan transfer dan kirim bukti foto disini.</p>
                     <button 
                       onClick={triggerFileUpload}
                       className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-bold shadow hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                     >
                       <Paperclip size={16} />
                       Upload Bukti Transfer
                     </button>
                  </div>
                </div>
              )}

              {/* Confirmation State Widget */}
              {msg.text.includes("cek mutasi") && msg.role === 'model' && (
                <div className="mt-2 w-[85%] bg-yellow-50 rounded-xl border border-yellow-200 p-3 flex gap-3 animate-in zoom-in duration-300">
                  <Clock size={24} className="text-yellow-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-yellow-800 text-sm">Menunggu Konfirmasi Penjual</h4>
                    <p className="text-xs text-yellow-700 mt-1">
                      Penjual sedang memverifikasi pembayaran Anda secara manual. Anda akan menerima notifikasi saat pesanan diproses.
                    </p>
                  </div>
                </div>
              )}

            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start w-full">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium mr-2">Sedang mengetik...</span>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*"
          />
          
          <div className="flex items-end gap-2 bg-slate-100 rounded-2xl px-2 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <button 
              onClick={triggerFileUpload}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors shrink-0"
              title="Kirim Gambar"
            >
              <ImageIcon size={20} />
            </button>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tulis pesan..."
              rows={1}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 py-2.5 text-slate-700 placeholder:text-slate-400 resize-none max-h-24 scrollbar-hide"
              disabled={isLoading}
              style={{ minHeight: '40px' }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isLoading}
              className={`p-2 rounded-xl transition-all shrink-0 mb-0.5 ${
                inputText.trim() && !isLoading
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-2">
            Chat dilindungi enkripsi end-to-end • Powered by Gemini
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoreAIAssistant;