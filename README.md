# 📌 Q&A Chat Project

ChatGPT benzeri soru-cevap uygulaması.  
Kullanıcıların yazdığı sorular OpenAI API üzerinden işlenir ve yanıtlar sohbet ekranında gösterilir.  
Sohbet geçmişi saklanabilir, yeni sohbet açılabilir, konuşmalar yeniden adlandırılabilir veya silinebilir.  

---

## 🚀 Kullanılan Teknolojiler
- **Next.js 15** (React framework)
- **TypeScript**
- **TailwindCSS** – modern ve responsive stil
- **shadcn/ui** – hazır UI bileşenleri
- **next-themes** – dark/light tema desteği
- **react-markdown** + **rehype-highlight** – Markdown ve kod blokları için
- **OpenAI Chat Completions API**

---

## ⚙️ Kurulum ve Çalıştırma

1. **Repoyu klonla**
   ```bash
   git clone https://github.com/<kullanici-adi>/qna-chat-project.git
   cd qna-chat-project


2. **Bağımlıkları yükle**

npm install
veya
yarn install

3. **Ortam değişkenlerini ayarla**
Proje köküne .env.local dosyası ekle ve içine kendi OpenAI API anahtarını yaz:
OPENAI_API_KEY=your-api-key-here


4. **Geliştirme sunucusunu başlat**
npm run dev
Tarayıcıda http://localhost:3000
 açarak uygulamayı kullanabilirsiniz.

 ---

 
**📖 Özellikler**
-Kullanıcı ve asistan mesajları farklı baloncuklarda gösterilir.
-Enter tuşu ile mesaj gönderme, Shift+Enter ile yeni satır açma.
-Yeni sohbet başlatma.
-Sohbetleri yeniden adlandırma ve silme.
-Sohbet geçmişi localStorage’da saklanır.
