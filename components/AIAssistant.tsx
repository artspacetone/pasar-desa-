import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Trash2, Minimize2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  id: number;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'model',
      text: 'Halo! 👋 Saya Asisten Virtual Desa Curug Badak. Ada yang bisa saya bantu terkait Pasar Desa atau Layanan Surat hari ini?',
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleClearChat = () => {
    setMessages([{
      id: 1,
      role: 'model',
      text: 'Riwayat percakapan telah dihapus. Ada yang bisa saya bantu lagi?',
      timestamp: new Date()
    }]);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Initialize Gemini Client
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Context for the AI about the application
      const systemInstruction = `
        Anda adalah Asisten Virtual Cerdas untuk "Marketplace & Layanan Desa Curug Badak". 
        Anda bekerja 24/7 melayani warga dan pengguna aplikasi.
        
        Konteks Aplikasi:
        1. **Pasar Desa**: Warga bisa membeli produk UMKM lokal (Makanan, Kerajinan, Sayur). Pembayaran bisa COD atau Transfer. Ada fitur Chat Penjual untuk cek stok.
        2. **Layanan Desa**: Warga bisa mengajukan surat (KTP, KK, Domisili, SKCK) secara online tanpa antri.
        3. **Dashboard**: Admin dan UMKM bisa memantau pesanan dan statistik desa.
        
        Tugas Anda:
        - Menjawab pertanyaan seputar cara belanja, cara mengajukan surat, dan info desa.
        - Memberikan rekomendasi produk jika diminta (misal: "Apa makanan khas di sini?").
        - Bersikap ramah, sopan, membantu, dan menggunakan Bahasa Indonesia yang baik dan mudah dimengerti warga desa.
        - Jika user bertanya hal teknis error, sarankan refresh halaman atau hubungi admin desa.
        
        Jawablah dengan ringkas dan to the point.
      `;

      // Create Chat Session
      // Note: In a real app, you might want to persist history object for context window
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: systemInstruction,
        },
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })).slice(-10) // Keep last 10 messages for context context
      });

      const result = await chat.sendMessage({ message: userMessage.text });
      const responseText = result.text;

      const botMessage: Message = {
        id: Date.now() + 1,
        role: 'model',
        text: responseText || 'Maaf, saya sedang mengalami gangguan. Mohon coba lagi.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'model',
        text: 'Maaf, koneksi ke sistem kecerdasan sedang gangguan. Pastikan Anda terhubung ke internet.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center group"
          title="Tanya Asisten Desa"
        >
          <Bot size={28} className="group-hover:animate-bounce" />
          <span className="absolute right-full mr-3 bg-white text-slate-700 px-3 py-1 rounded-lg text-sm font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Butuh Bantuan?
          </span>
          {/* Notification dot */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm border border-white/20">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Asisten Desa</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-[10px] text-blue-100 font-medium">Online 24/7</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleClearChat} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="Hapus Chat">
                <Trash2 size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                <Minimize2 size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 bg-slate-50 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm relative ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}
                >
                  {msg.role === 'model' && (
                    <Sparkles size={12} className="absolute -top-2 -left-2 text-yellow-500 fill-yellow-500 bg-white rounded-full" />
                  )}
                  {msg.text}
                  <p className={`text-[9px] mt-1 text-right ${msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start w-full">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-2 py-1 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanya sesuatu..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 py-2 text-slate-700 placeholder:text-slate-400"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isLoading}
                className={`p-2 rounded-lg transition-all ${
                  inputText.trim() && !isLoading
                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              Didukung oleh Gemini AI • Asisten Pintar Desa
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;