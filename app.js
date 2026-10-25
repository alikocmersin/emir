/* ==========================================================================
   EmirLearn — 4. Sınıf Çocuk Eğitim Platformu Master Orkestratörü
   Tasarım Sistemi, Macera Haritası, Video Sineması, Quiz, Oyunlar ve Ebeveyn
   ========================================================================== */

'use strict';

// --------------------------------------------------------------------------
// 1. VERİ MODELİ, SABİTLER VE DERS TANIMLARI
// --------------------------------------------------------------------------
const STORAGE_KEY_V1 = 'emirlearn:v1';
const LEGACY_STORAGE_KEY = 'emirlearn_progress';

const DERS_TANIMLARI = {
  sosyal: {
    key: 'sosyal',
    ad: 'Sosyal Bilgiler',
    ikon: '🌍',
    renkAna: '#FF9F1C',
    renkKoyu: '#B45309',
    renkAcik: '#FFF3E0',
    uniteIkonlari: { 1: '🧑‍🤝‍🧑', 2: '🏺', 3: '🗺️', 4: '🤖', 5: '🛒', 6: '🏛️', 7: '🌐' }
  },
  turkce: {
    key: 'turkce',
    ad: 'Türkçe',
    ikon: '📖',
    renkAna: '#F43F5E',
    renkKoyu: '#BE123C',
    renkAcik: '#FFE4E9',
    uniteIkonlari: { 1: '📖', 2: '✍️', 3: '📝', 4: '🎭', 5: '🔍' }
  },
  matematik: {
    key: 'matematik',
    ad: 'Matematik',
    ikon: '📐',
    renkAna: '#3B82F6',
    renkKoyu: '#1D4ED8',
    renkAcik: '#E0EDFF',
    uniteIkonlari: { 1: '🔢', 2: '✖️', 3: '🍕', 4: '⏰', 5: '📐', 6: '📏' }
  },
  fen: {
    key: 'fen',
    ad: 'Fen Bilimleri',
    ikon: '🔬',
    renkAna: '#10B981',
    renkKoyu: '#047857',
    renkAcik: '#DDF8EC',
    uniteIkonlari: { 1: '🌍', 2: '🍎', 3: '🧲', 4: '🧪', 5: '💡', 6: '🌲', 7: '⚡' }
  }
};

// 10 Seviye Tanımları
const SEVIYELER = [
  { seviye: 1, unvan: 'Yeni Kaşif', minXp: 0, maxXp: 99 },
  { seviye: 2, unvan: 'Meraklı Çırak', minXp: 100, maxXp: 249 },
  { seviye: 3, unvan: 'Bilgi Avcısı', minXp: 250, maxXp: 499 },
  { seviye: 4, unvan: 'Akıl Ustası', minXp: 500, maxXp: 849 },
  { seviye: 5, unvan: 'Yıldız Rehberi', minXp: 850, maxXp: 1299 },
  { seviye: 6, unvan: 'Bilim Kahramanı', minXp: 1300, maxXp: 1849 },
  { seviye: 7, unvan: 'Zihin Şampiyonu', minXp: 1850, maxXp: 2499 },
  { seviye: 8, unvan: 'Süper Bilgin', minXp: 2500, maxXp: 3249 },
  { seviye: 9, unvan: 'Bilgelik Efendisi', minXp: 3250, maxXp: 4199 },
  { seviye: 10, unvan: 'Galaksi Profesörü', minXp: 4200, maxXp: 99999 }
];

// 21 Toplanabilir Rozet
const ROZETLER_LISTESI = [
  { id: 'ilk_adim', ad: 'İlk Adım', ikon: '🌱', aciklama: 'İlk ünite videosunu izledin!' },
  { id: 'video_kurdu', ad: 'Video Kurdu', ikon: '🎬', aciklama: '5 farklı ünite videosunu tamamladın.' },
  { id: 'fen_dehasi', ad: 'Fen Dehası', ikon: '🔬', aciklama: 'Tüm Fen Bilimleri ünitelerini bitirdin.' },
  { id: 'sosyal_bilgin', ad: 'Kültür Elçisi', ikon: '🌍', aciklama: 'Sosyal Bilgiler ünitelerini bitirdin.' },
  { id: 'matematik_ustasi', ad: 'Sayılar Efendisi', ikon: '📐', aciklama: 'Matematik ünitelerini tamamladın.' },
  { id: 'turkce_sairi', ad: 'Kelime Cambazı', ikon: '📖', aciklama: 'Türkçe ünitelerini tamamladın.' },
  { id: 'yildiz_avcisi', ad: 'Yıldız Yağmuru', ikon: '⭐', aciklama: '50 yıldız topladın.' },
  { id: 'elmas_zengini', ad: 'Hazine Sandığı', ikon: '💎', aciklama: '100 elmasa ulaştın.' },
  { id: 'hizli_cevap', ad: 'Şimşek Akıl', ikon: '⚡', aciklama: 'Mini testi hiç yanlışsız tamamladın.' },
  { id: 'mukemmel_skor', ad: '10’da 10 Şampiyonu', ikon: '🎯', aciklama: 'Tam puanlı test sonucu elde ettin.' },
  { id: 'gece_kusu', ad: 'Azimli Öğrenci', ikon: '🦉', aciklama: 'Planlı bir çalışma seansını bitirdin.' },
  { id: 'seri_atesi', ad: 'Seri Ateşi', ikon: '🔥', aciklama: '3 gün üst üste ders çalıştın.' },
  { id: 'devre_muhendisi', ad: 'Devre Mühendisi', ikon: '💡', aciklama: 'Basit elektrik devreleri testini çözdün.' },
  { id: 'cevre_dostu', ad: 'Doğa Dostu', ikon: '🌲', aciklama: 'İnsan ve çevre ünitesini tamamladın.' },
  { id: 'dunya_kasifi', ad: 'Dünya Gezgini', ikon: '🧭', aciklama: 'Küresel bağlantılar ünitesini bitirdin.' },
  { id: 'hafiza_krali', ad: 'Hafıza Şampiyonu', ikon: '🧩', aciklama: '6-Eşleştirme oyununu kazandın.' },
  { id: 'dogru_yanlis_firtinasi', ad: 'Yıldırım Testçi', ikon: '🌪️', aciklama: 'Doğru-Yanlış fırtınasını bitirdin.' },
  { id: 'kelime_avcisi_usta', ad: 'Harf Avcısı', ikon: '🔤', aciklama: 'Kelime türetme oyununu kazandın.' },
  { id: 'harita_fatihi', ad: 'Harita Fatihi', ikon: '🗺️', aciklama: 'Macera haritasındaki ilk kupayı aldın.' },
  { id: 'super_emir', ad: 'Süper Emir', ikon: '🦸', aciklama: 'Seviye 5 Akıl Ustası oldun!' },
  { id: 'galaksi_profesoru', ad: 'Galaksi Profesörü', ikon: '👑', aciklama: '10. Seviye Profesör unvanına ulaştın!' }
];

// Uygulama Çalışma Durumu
let appState = {
  activeView: 'kartlar',        // 'kartlar' | 'harita'
  activeSubject: 'tum',         // 'tum' | 'sosyal' | 'turkce' | 'matematik' | 'fen'
  searchQuery: '',
  unfinishedOnly: false,
  sortOrder: 'varsayilan',      // 'varsayilan' | 'onerilen'
  activeGameTab: 'flashcards',
  currentModalUnit: null,
  currentQuizState: null,
  videoPlayTimer: null,
  watchSeconds: 0,
  eyeBreakDismissedUntil: 0
};

// --------------------------------------------------------------------------
// 2. VERİ YÖNETİMİ & LOCALSTORAGE MİGRASYONU
// --------------------------------------------------------------------------
function getDefaultState() {
  return {
    versiyon: '1.0',
    ilerleme: {},
    oyun: {
      xp: 40,
      seviye: 1,
      yildizlar: 8,
      elmas: 25,
      seri: 1,
      sonEtkinlikTarihi: new Date().toISOString().split('T')[0],
      seriKoruyucuKullanildi: false,
      rozetler: ['ilk_adim'],
      envanter: ['avatar_aslan'],
      seciliAvatar: '🦁',
      seciliTema: 'varsayilan'
    },
    ayarlar: {
      gunlukSureSiniri: 45,
      molaAraligi: 20,
      geceModu: false,
      siraylaAc: false,
      gunlukHedefSayisi: 2,
      sesEfektleri: true,
      cocukAdi: 'Emir'
    },
    yanlislar: [],
    ebeveyn: {
      pinHash: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', // '1234' sha256
      pinSalt: '3333',
      basarisizGiris: 0,
      kilitBitisZamani: 0,
      etkinlikGecmisi: [
        { tarih: new Date().toLocaleDateString('tr-TR'), aciklama: 'EmirLearn platformu başlatıldı.' }
      ]
    }
  };
}

function loadAppData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V1);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Veri okuma hatası:', e);
  }

  // Eski versiyon migrasyonu
  const data = getDefaultState();
  try {
    const oldRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (oldRaw) {
      const oldObj = JSON.parse(oldRaw);
      Object.keys(oldObj).forEach((key) => {
        data.ilerleme[key] = {
          izlendi: !!oldObj[key].watched,
          sonSaniye: 0,
          yuzde: oldObj[key].watched ? 100 : 0,
          mini: { enIyi: oldObj[key].score || 0, deneme: 1, yildiz: oldObj[key].score >= 8 ? 3 : 1 },
          unite: { enIyi: 0, deneme: 0, yildiz: 0 }
        };
      });
      data.oyun.yildizlar += 10;
      data.oyun.xp += 100;
    }
  } catch (err) {
    console.warn('Migrasyon hatası:', err);
  }

  saveAppData(data);
  return data;
}

function saveAppData(data, syncToCloud = true) {
  try {
    localStorage.setItem(STORAGE_KEY_V1, JSON.stringify(data));
    if (syncToCloud && window.CloudSync) {
      window.CloudSync.saveDebounced();
    }
  } catch (e) {
    console.error('Veri kaydetme hatası:', e);
  }
}

// Global Veri Referansı
let APP_DATA = loadAppData();

// --------------------------------------------------------------------------
// 3. UNITELER VERİ NORMALİZASYONU (KOMUT 2 VERİ STANDARDI)
// --------------------------------------------------------------------------
function normalizeMasterUnits() {
  const rawList = window.MASTER_UNITS_DATA || [];
  return rawList.map((item) => {
    const dersKey = item.subjectKey || 'sosyal';
    const dersCfg = DERS_TANIMLARI[dersKey] || DERS_TANIMLARI.sosyal;
    const uNo = item.unitNumber || 1;
    const emoji = (dersCfg.uniteIkonlari && dersCfg.uniteIkonlari[uNo]) || dersCfg.ikon;

    return {
      id: item.id,
      ders: dersKey,
      dersAdi: dersCfg.ad,
      dersIkonu: dersCfg.ikon,
      dersRenk: dersCfg.renkAna,
      no: uNo,
      baslik: item.title ? item.title.replace(/^\d+\.\s*Ünite\s*:\s*/i, '') : 'Ünite',
      tamBaslik: item.title || `${uNo}. Ünite`,
      aciklama: item.topicsSummary || (item.topics ? item.topics.join(', ') : ''),
      konular: item.topics || [],
      sure: item.duration || '12-13 Dk',
      kapak: item.thumbnail || '',
      ikon: emoji,
      video: item.videoFile || '',
      hasVideo: item.hasVideo !== false,
      test: item.firstLessonId ? `lesson.html?id=${item.firstLessonId}` : '#'
    };
  });
}

// Global UNITELER Dizisi
window.UNITELER = normalizeMasterUnits();

// --------------------------------------------------------------------------
// 4. WEBAUDIO VE SES EFEKTLERİ SENTEZLEYİCİSİ (KÜTÜPHANESİZ)
// --------------------------------------------------------------------------
class SoundFX {
  static initAudio() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  static playCorrectChime() {
    if (!APP_DATA.ayarlar.sesEfektleri) return;
    this.initAudio();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.setValueAtTime(659.25, now + 0.1); // E5
    osc1.frequency.setValueAtTime(783.99, now + 0.2); // G5
    osc1.frequency.setValueAtTime(1046.50, now + 0.3); // C6

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc1.connect(gain);
    gain.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.7);
  }

  static playSoftError() {
    if (!APP_DATA.ayarlar.sesEfektleri) return;
    this.initAudio();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.3);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  static playLevelUp() {
    if (!APP_DATA.ayarlar.sesEfektleri) return;
    this.initAudio();
    if (!this.ctx) return;
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    });
  }
}

// --------------------------------------------------------------------------
// 5. GAMIFICATION & ROZET MOTORU
// --------------------------------------------------------------------------
function updateGamificationUI() {
  const g = APP_DATA.oyun;

  // Seviye Hesaplama
  let curSev = SEVIYELER[0];
  for (let s of SEVIYELER) {
    if (g.xp >= s.minXp) curSev = s;
  }
  g.seviye = curSev.seviye;

  const spanSev = document.getElementById('seviyeUnvan');
  const spanXp = document.getElementById('xpGosterge');
  const barDolgu = document.getElementById('seviyeBarDolgu');
  const spanYildiz = document.getElementById('toplamYildizSayisi');
  const spanElmas = document.getElementById('toplamElmasSayisi');
  const spanSeri = document.getElementById('gunlukSeriSayisi');
  const cocukAdi = document.getElementById('cocukSelamAdi');

  if (spanSev) spanSev.textContent = `${curSev.seviye}. Seviye: ${curSev.unvan}`;
  if (spanXp) spanXp.textContent = `${g.xp} XP`;
  if (barDolgu) {
    const range = curSev.maxXp - curSev.minXp;
    const progress = Math.min(100, Math.max(5, ((g.xp - curSev.minXp) / range) * 100));
    barDolgu.style.width = `${progress}%`;
  }
  if (spanYildiz) spanYildiz.textContent = g.yildizlar;
  if (spanElmas) spanElmas.textContent = g.elmas;
  if (spanSeri) spanSeri.textContent = g.seri;
  if (cocukAdi) cocukAdi.textContent = APP_DATA.ayarlar.cocukAdi || 'Emir';

  renderBadgesGrid();
}

function addXP(amount) {
  APP_DATA.oyun.xp += amount;
  saveAppData(APP_DATA);
  updateGamificationUI();
}

function addRewards(stars, diamonds, xp) {
  APP_DATA.oyun.yildizlar += stars;
  APP_DATA.oyun.elmas += diamonds;
  APP_DATA.oyun.xp += xp;
  saveAppData(APP_DATA);
  updateGamificationUI();
  triggerConfetti();
  SoundFX.playCorrectChime();
}

function unlockBadge(badgeId) {
  if (!APP_DATA.oyun.rozetler.includes(badgeId)) {
    APP_DATA.oyun.rozetler.push(badgeId);
    saveAppData(APP_DATA);
    updateGamificationUI();
    SoundFX.playLevelUp();
    showToast(`🏆 Yeni Rozet Kazandın: ${badgeId}!`);
  }
}

function renderBadgesGrid() {
  const grid = document.getElementById('rozetlerGrid');
  const counter = document.getElementById('kazanilanRozetSayisi');
  if (!grid) return;

  grid.innerHTML = '';
  const earned = APP_DATA.oyun.rozetler || [];
  if (counter) counter.textContent = earned.length;

  ROZETLER_LISTESI.forEach((r) => {
    const isEarned = earned.includes(r.id);
    const card = document.createElement('div');
    card.className = `rozet-karti ${isEarned ? 'kazanildi' : 'kilitli'}`;
    card.title = `${r.ad} — ${r.aciklama}`;
    card.innerHTML = `
      <div class="rozet-ikonu-buyuk">${r.ikon}</div>
      <div class="rozet-adi">${r.ad}</div>
      <div class="rozet-aciklama">${isEarned ? r.aciklama : '🔒 Kilitli'}</div>
    `;
    grid.appendChild(card);
  });
}

// Hafif Canvas Konfeti Motoru
function triggerConfetti() {
  const canvas = document.getElementById('konfetiKanvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const particles = [];
  const colors = ['#7C3AED', '#EC4899', '#FFC83D', '#10B981', '#3B82F6', '#FF9F1C'];
  for (let i = 0; i < 90; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      r: Math.random() * 6 + 4,
      d: Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16
    });
  }

  let animationFrame;
  let start = Date.now();
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2 + p.vy;
      p.x += Math.sin(p.d) * 2 + p.vx;
      p.vx *= 0.96;
      p.vy += 0.35; // Yerçekimi
      p.tilt = Math.sin(p.tiltAngle) * 15;

      ctx.beginPath();
      ctx.lineWidth = p.r / 2;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
      ctx.stroke();
    });

    if (Date.now() - start < 2800) {
      animationFrame = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = 'none';
      cancelAnimationFrame(animationFrame);
    }
  }
  draw();
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
    background: #1F2340; color: #FFFFFF; padding: 12px 24px; border-radius: 999px;
    font-weight: 800; font-size: 0.95rem; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 10000; animation: kartBelir 0.3s ease-out;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3200);
}

// --------------------------------------------------------------------------
// 6. ÜNİTE KARTLARI VE FİLTRELEME (KOMUT 2 STANDARDI)
// --------------------------------------------------------------------------
function renderSubjectChips() {
  const container = document.getElementById('dersCipleriSarmal');
  if (!container) return;

  const subjects = [
    { key: 'tum', ad: 'Tüm Dersler', ikon: '📚', count: window.UNITELER.length },
    { key: 'sosyal', ad: 'Sosyal Bilgiler', ikon: '🌍', count: window.UNITELER.filter(u => u.ders === 'sosyal').length },
    { key: 'turkce', ad: 'Türkçe', ikon: '📖', count: window.UNITELER.filter(u => u.ders === 'turkce').length },
    { key: 'matematik', ad: 'Matematik', ikon: '📐', count: window.UNITELER.filter(u => u.ders === 'matematik').length },
    { key: 'fen', ad: 'Fen Bilimleri', ikon: '🔬', count: window.UNITELER.filter(u => u.ders === 'fen').length }
  ];

  container.innerHTML = '';
  subjects.forEach((s) => {
    const btn = document.createElement('button');
    btn.className = `ders-cipi ${appState.activeSubject === s.key ? 'aktif' : ''}`;
    btn.setAttribute('data-ders', s.key === 'tum' ? 'sosyal' : s.key);
    btn.innerHTML = `
      <span>${s.ikon}</span>
      <span>${s.ad}</span>
      <span class="ders-sayac">${s.count}</span>
    `;
    btn.onclick = () => {
      appState.activeSubject = s.key;
      document.body.setAttribute('data-ders', s.key === 'tum' ? 'sosyal' : s.key);
      renderSubjectChips();
      renderCurrentView();
    };
    container.appendChild(btn);
  });
}

// Türkçe Karakter Duyarsız Normalize
function trNormalize(text) {
  if (!text) return '';
  return text
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .toLocaleLowerCase('tr-TR')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u');
}

function filterAndSortUnits() {
  let list = window.UNITELER.slice();

  // 1. Ders Filtresi
  if (appState.activeSubject !== 'tum') {
    list = list.filter((u) => u.ders === appState.activeSubject);
  }

  // 2. Arama Filtresi (Başlık ve Konular İçinde Türkçe Duyarsız)
  if (appState.searchQuery.trim()) {
    const q = trNormalize(appState.searchQuery);
    list = list.filter((u) => {
      const baslikTr = trNormalize(u.baslik + ' ' + u.tamBaslik);
      const aciklamaTr = trNormalize(u.aciklama);
      return baslikTr.includes(q) || aciklamaTr.includes(q);
    });
  }

  // 3. Sadece Bitmemişler Filtresi
  if (appState.unfinishedOnly) {
    list = list.filter((u) => {
      const il = APP_DATA.ilerleme[u.id];
      return !(il && il.izlendi && il.mini && il.mini.yildiz >= 2);
    });
  }

  // 4. Sıralama
  if (appState.sortOrder === 'onerilen') {
    list.sort((a, b) => {
      const aIl = APP_DATA.ilerleme[a.id];
      const bIl = APP_DATA.ilerleme[b.id];
      const aDevam = aIl && (!aIl.izlendi || (aIl.mini && aIl.mini.yildiz < 3)) ? 1 : 0;
      const bDevam = bIl && (!bIl.izlendi || (bIl.mini && bIl.mini.yildiz < 3)) ? 1 : 0;
      return bDevam - aDevam || a.no - b.no;
    });
  } else {
    list.sort((a, b) => a.no - b.no);
  }

  return list;
}

function renderUnitCardsGrid() {
  const grid = document.getElementById('uniteKartlariGrid');
  const emptyState = document.getElementById('bosSonucAlani');
  if (!grid) return;

  const units = filterAndSortUnits();
  grid.innerHTML = '';

  if (units.length === 0) {
    grid.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  if (emptyState) emptyState.style.display = 'none';

  units.forEach((unit, idx) => {
    const card = createMasterUnitCard(unit, idx);
    grid.appendChild(card);
  });
}

function createMasterUnitCard(unit, idx) {
  const card = document.createElement('article');
  card.className = 'unite-karti';
  card.setAttribute('data-ders', unit.ders);
  card.style.animationDelay = `${idx * 40}ms`;

  const prog = APP_DATA.ilerleme[unit.id] || { izlendi: false, mini: { yildiz: 0 } };
  const isWatched = prog.izlendi;
  const starsEarned = (prog.mini && prog.mini.yildiz) || 0;
  const isCompleted = isWatched && starsEarned >= 2;

  if (isCompleted) card.classList.add('tamamlandi');

  // Durum Rozeti
  let durumClass = 'durum-yeni';
  let durumText = 'Yeni';
  if (isCompleted) {
    durumClass = 'durum-tamam';
    durumText = 'Tamamlandı ✓';
  } else if (isWatched || starsEarned > 0) {
    durumClass = 'durum-devam';
    durumText = 'Devam Ediyor';
  }

  // Konu Çipleri (İlk 3 Konu + Kalan Popover)
  const ilkKonular = unit.konular.slice(0, 3);
  const kalanSayi = Math.max(0, unit.konular.length - 3);

  card.innerHTML = `
    <!-- a) KAPAK (16:9 SABİT) -->
    <div class="kart-kapak">
      ${unit.kapak ? `<img src="${unit.kapak}" alt="${unit.tamBaslik}" class="kart-kapak-gorseli" loading="lazy" />` : ''}
      <div class="kart-filigran-no">${unit.no}</div>
      <div class="kart-rozet-sol-ust">🎬 Master Video</div>
      <div class="kart-sure-sag-alt">⏱ ${unit.sure}</div>

      <!-- Ortada 64px Oynat Butonu -->
      <div class="kart-oynat-sarmal" onclick="openSinemaModal('${unit.id}')">
        <div class="kart-oynat-butonu-64">
          <div class="nabiz-halkasi"></div>
          ▶
        </div>
        <span class="kart-oynat-yazi">Videoyu Başlat</span>
      </div>
    </div>

    <!-- b) GÖVDE -->
    <div class="kart-govde">
      <div class="kart-ust-satir">
        <span class="rozet rozet-ders">${unit.dersAdi} • Ünite ${unit.no}</span>
        <span class="kart-durum-rozet ${durumClass}">${durumText}</span>
      </div>

      <h3 class="kart-baslik" title="${unit.tamBaslik}">${unit.tamBaslik}</h3>

      <!-- Konu Çipleri -->
      <div class="kart-konular-alani">
        <span class="kart-konular-baslik">Bu Ünitede Öğreneceklerin:</span>
        <div class="kart-konu-cipleri">
          ${ilkKonular.map(k => `<span class="mini-konu-cipi">${k}</span>`).join('')}
          ${kalanSayi > 0 ? `<button class="daha-fazla-konu-cipi" onclick="event.stopPropagation(); showAllTopicsModal('${unit.id}')">+${kalanSayi} konu daha</button>` : ''}
        </div>
      </div>

      <!-- c) İLERLEME ŞERİDİ (▶ İzle → ⚡ Mini Test → 📄 Ünite Testi) -->
      <div class="kart-ilerleme-seridi">
        <span class="adim-ogesi ${isWatched ? 'tamam' : ''}">
          <span class="adim-isaret">${isWatched ? '✓' : '▶'}</span> İzle
        </span>
        <span class="adim-ok">→</span>
        <span class="adim-ogesi ${starsEarned > 0 ? 'tamam' : ''}">
          <span class="adim-isaret">${starsEarned > 0 ? '✓' : '⚡'}</span> Mini Test (${starsEarned}⭐)
        </span>
        <span class="adim-ok">→</span>
        <span class="adim-ogesi ${isCompleted ? 'tamam' : ''}">
          <span class="adim-isaret">${isCompleted ? '✓' : '📄'}</span> Test
        </span>
      </div>

      <!-- d) ALT BUTONLAR -->
      <div class="kart-alt-butonlar">
        <button class="btn btn-birincil" onclick="event.stopPropagation(); openSinemaModal('${unit.id}')">
          <span>${isWatched ? '↻' : '▶'}</span> <span>${isWatched ? 'Tekrar İzle' : 'İzle'}</span>
        </button>
        <button class="btn btn-ikincil" onclick="event.stopPropagation(); startUnitQuizDirectly('${unit.id}')">
          <span>📝</span> <span>Testi Çöz</span>
        </button>
      </div>
    </div>
  `;

  // Kartın bütününe tıklanınca videoyu aç
  card.onclick = (e) => {
    if (e.target.closest('button')) return;
    openSinemaModal(unit.id);
  };

  return card;
}

function showAllTopicsModal(unitId) {
  const unit = window.UNITELER.find(u => u.id === unitId);
  if (!unit) return;
  alert(`${unit.tamBaslik} Konu Listesi:

• ` + unit.konular.join('
• '));
}

// --------------------------------------------------------------------------
// 7. MACERA HARİTASI (KOMUT 3 ÖĞRENME YOLU)
// --------------------------------------------------------------------------
function toggleMapCardsView(viewName) {
  appState.activeView = viewName;
  const btnKartlar = document.getElementById('viewBtnKartlar');
  const btnHarita = document.getElementById('viewBtnHarita');
  const grid = document.getElementById('uniteKartlariGrid');
  const mapCont = document.getElementById('maceraHaritasiKapsayici');
  const emptyState = document.getElementById('bosSonucAlani');

  if (viewName === 'harita') {
    btnKartlar.classList.remove('aktif');
    btnHarita.classList.add('aktif');
    grid.style.display = 'none';
    if (emptyState) emptyState.style.display = 'none';
    mapCont.style.display = 'block';
    renderAdventureMap();
  } else {
    btnHarita.classList.remove('aktif');
    btnKartlar.classList.add('aktif');
    mapCont.style.display = 'none';
    renderUnitCardsGrid();
  }
}

function renderAdventureMap() {
  const mapCont = document.getElementById('haritaYolIcerik');
  const srList = document.getElementById('haritaErisilebilirListe');
  if (!mapCont) return;

  mapCont.innerHTML = '';
  if (srList) srList.innerHTML = '';

  const subjectsToRender = appState.activeSubject === 'tum'
    ? ['sosyal', 'fen', 'matematik', 'turkce']
    : [appState.activeSubject];

  subjectsToRender.forEach((sKey) => {
    const dersCfg = DERS_TANIMLARI[sKey];
    const subjectUnits = window.UNITELER.filter(u => u.ders === sKey).sort((a,b) => a.no - b.no);

    const islandBox = document.createElement('div');
    islandBox.className = 'harita-ada-bolumu';
    islandBox.setAttribute('data-ders', sKey);

    islandBox.innerHTML = `
      <div class="harita-ada-baslik">
        <span style="font-size:2rem;">${dersCfg.ikon}</span>
        <div>
          <h3>${dersCfg.ad} Macera Adası</h3>
          <p style="color:var(--metin-ikincil); font-size:0.9rem; margin:0;">${subjectUnits.length} Ünitelik Bilgi Yolculuğu</p>
        </div>
      </div>
      <div class="harita-yol-alani" id="yolAlani_${sKey}"></div>
    `;

    mapCont.appendChild(islandBox);

    const yolArea = islandBox.querySelector(`#yolAlani_${sKey}`);
    buildSvgSerpentinePath(yolArea, subjectUnits, sKey);
  });
}

function buildSvgSerpentinePath(container, units, dersKey) {
  const count = units.length;
  const rowHeight = 120;
  const totalHeight = (count + 1) * rowHeight;
  container.style.minHeight = `${totalHeight}px`;

  // Koordinatları hesapla (S-kıvrımı)
  const points = [];
  const width = Math.min(800, container.clientWidth || 600);

  units.forEach((u, i) => {
    // Sağa ve sola kıvrılan sinüs eğrisi
    const isEven = i % 2 === 0;
    const x = isEven ? width * 0.25 : width * 0.75;
    const y = (i + 0.6) * rowHeight;
    points.push({ x, y, unit: u });
  });

  // Kupa noktası (en son)
  const cupX = width * 0.5;
  const cupY = (count + 0.6) * rowHeight;

  // SVG Yolunu Oluştur
  let dPath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx1 = prev.x;
    const cy1 = (prev.y + curr.y) / 2;
    const cx2 = curr.x;
    const cy2 = (prev.y + curr.y) / 2;
    dPath += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
  }
  // Kupaya bağla
  const last = points[points.length - 1];
  dPath += ` C ${last.x} ${(last.y + cupY) / 2}, ${cupX} ${(last.y + cupY) / 2}, ${cupX} ${cupY}`;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'harita-svg-yol');
  svg.setAttribute('viewBox', `0 0 ${width} ${totalHeight}`);

  svg.innerHTML = `
    <path d="${dPath}" class="harita-yol-cizgi" />
    <path d="${dPath}" class="harita-yol-tamamlandi" />
  `;
  container.appendChild(svg);

  // 72px Checkpoint Düğmelerini Yerleştir
  let firstUnfinishedFound = false;

  points.forEach((p, idx) => {
    const u = p.unit;
    const prog = APP_DATA.ilerleme[u.id] || { izlendi: false, mini: { yildiz: 0 } };
    const isCompleted = prog.izlendi && prog.mini && prog.mini.yildiz >= 2;

    let nodeClass = '';
    let isCurrentActive = false;

    if (isCompleted) {
      nodeClass = 'tamam';
    } else if (!firstUnfinishedFound) {
      nodeClass = 'aktif';
      isCurrentActive = true;
      firstUnfinishedFound = true;
    } else {
      nodeClass = APP_DATA.ayarlar.siraylaAc ? 'kilitli' : 'baslanmamis';
    }

    const node = document.createElement('div');
    node.className = `harita-checkpoint-72 ${nodeClass}`;
    node.style.left = `${p.x}px`;
    node.style.top = `${p.y}px`;
    node.setAttribute('data-ders', dersKey);
    node.title = `${u.no}. Ünite: ${u.baslik}`;

    node.innerHTML = `
      ${isCurrentActive ? `<div class="roki-harita-balonu">🦁 Sıradaki macera!</div>` : ''}
      <span class="checkpoint-no">${u.no}</span>
      <span class="checkpoint-ikon">${isCompleted ? '✓' : u.ikon}</span>
      <div class="checkpoint-yildizlar">
        ${isCompleted ? '⭐'.repeat(prog.mini.yildiz || 3) : ''}
      </div>
    `;

    node.onclick = () => {
      openSinemaModal(u.id);
    };

    container.appendChild(node);
  });

  // Ders Kupası Final Noktası
  const cup = document.createElement('div');
  cup.className = 'harita-kupa-noktasi';
  cup.style.left = `${cupX}px`;
  cup.style.top = `${cupY}px`;
  cup.title = 'Tebrikler! Dersi Tamamlama Kupası!';
  cup.innerHTML = '🏆';
  cup.onclick = () => {
    triggerConfetti();
    SoundFX.playLevelUp();
    showToast(`🏆 ${DERS_TANIMLARI[dersKey].ad} Kupası! Harika bir başarısın!`);
  };
  container.appendChild(cup);
}

// --------------------------------------------------------------------------
// 8. VİDEO SİNEMA MODALİ (KOMUT 4 SINIF / SİNEMA ATMOSFERİ)
// --------------------------------------------------------------------------

function formatTime(sec) {
  if (isNaN(sec) || sec < 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

function attachVideoEventListeners(v) {
  if (!v || v._eventsAttached) return;
  v._eventsAttached = true;

  v.addEventListener('timeupdate', () => {
    const bar = document.getElementById('videoIlerlemeDolu');
    const timeDisp = document.getElementById('videoZamanGostergesi');
    if (v.duration) {
      const cur = v.currentTime || 0;
      const dur = v.duration;
      const pct = Math.min(100, (cur / dur) * 100);
      if (bar) bar.style.width = `${pct}%`;
      if (timeDisp) timeDisp.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
    }
  });

  v.addEventListener('play', () => {
    const btn = document.getElementById('btnVideoPlayPause');
    if (btn) btn.textContent = '⏸';
  });

  v.addEventListener('pause', () => {
    const btn = document.getElementById('btnVideoPlayPause');
    if (btn) btn.textContent = '▶';
  });

  v.addEventListener('ended', () => {
    const unit = appState.currentModalUnit;
    if (unit) {
      if (!APP_DATA.ilerleme[unit.id]) APP_DATA.ilerleme[unit.id] = {};
      APP_DATA.ilerleme[unit.id].izlendi = true;
      APP_DATA.ilerleme[unit.id].yuzde = 100;
      saveAppData(APP_DATA);
      updateGamificationUI();
      renderCurrentView();
    }
    const panel = document.getElementById('simdiSiraSendePaneli');
    if (panel) panel.style.display = 'flex';
    SoundFX.playLevelUp();
    triggerConfetti();
    showToast('🎉 Tebrikler! Videoyu tamamladın, şimdi mini test zamanı!');
  });

  v.onclick = () => {
    toggleVideoPlay();
  };
}

function openSinemaModal(unitId) {
  const unit = window.UNITELER.find(u => u.id === unitId);
  if (!unit) return;

  appState.currentModalUnit = unit;
  const modal = document.getElementById('sinemaModalBackdrop');
  const videoEl = document.getElementById('sinemaVideoEl');
  const videoSrc = document.getElementById('sinemaVideoSource');
  const pendingBox = document.getElementById('videoHazirlaniyorKutusu');
  const titleEl = document.getElementById('sinemaBaslik');
  const tagEl = document.getElementById('sinemaDersTag');
  const siraSendePanel = document.getElementById('simdiSiraSendePaneli');
  const quizArea = document.getElementById('sinemaQuizAlani');
  const videoSarmal = document.getElementById('sinemaVideoSarmal');
  const videoControls = document.getElementById('ozelVideoKontrolleri');

  // Modal üst teması
  modal.setAttribute('data-ders', unit.ders);
  if (titleEl) titleEl.textContent = `${unit.tamBaslik}`;
  if (tagEl) tagEl.textContent = `${unit.dersAdi} • 12-13 Dk Master Video`;

  // Quiz alanını kapat, videoyu hazırla
  if (quizArea) quizArea.style.display = 'none';
  if (videoSarmal) videoSarmal.style.display = 'block';
  if (videoControls) videoControls.style.display = 'flex';
  if (siraSendePanel) siraSendePanel.style.display = 'none';

  // Video kaynağı kontrolü
  if (unit.video && unit.hasVideo) {
    if (pendingBox) pendingBox.style.display = 'none';
    if (videoSrc) videoSrc.src = unit.video;
    videoEl.load();
    attachVideoEventListeners(videoEl);

    // Kaldığı yerden devam etme kontrolü
    const prog = APP_DATA.ilerleme[unit.id];
    if (prog && prog.sonSaniye > 10 && prog.sonSaniye < (videoEl.duration || 600) - 20) {
      if (confirm(`Önceki izlemede ${Math.floor(prog.sonSaniye / 60)}:${Math.floor(prog.sonSaniye % 60)} saniyesinde kalmıştın. Kaldığın yerden devam edilsin mi?`)) {
        videoEl.currentTime = prog.sonSaniye;
      }
    }

    videoEl.play().catch(() => {});
  } else {
    if (pendingBox) pendingBox.style.display = 'flex';
  }

  // Bölüm Çiplerini Yerleştir
  renderVideoChapterChips(unit);

  // 5 Saniyede Bir Otomatik İlerleme Kaydı ve Göz Molası Takibi
  clearInterval(appState.videoPlayTimer);
  appState.videoPlayTimer = setInterval(handleVideoPlaybackTick, 5000);

  modal.classList.add('aktif');
  document.body.style.overflow = 'hidden';
}

function closeSinemaModal() {
  const modal = document.getElementById('sinemaModalBackdrop');
  const videoEl = document.getElementById('sinemaVideoEl');
  if (videoEl) {
    videoEl.pause();
  }
  clearInterval(appState.videoPlayTimer);
  if (modal) modal.classList.remove('aktif');
  document.body.style.overflow = '';
  renderCurrentView();
}

function handleSinemaBackdropClick(e) {
  if (e.target.id === 'sinemaModalBackdrop') {
    closeSinemaModal();
  }
}

function renderVideoChapterChips(unit) {
  const list = document.getElementById('bolumCipleriListesi');
  if (!list) return;
  list.innerHTML = '';

  const chapters = unit.konular.slice(0, 4);
  chapters.forEach((c, idx) => {
    const chip = document.createElement('button');
    chip.className = 'bolum-cip';
    chip.textContent = `${idx + 1}. ${c}`;
    chip.onclick = () => {
      const videoEl = document.getElementById('sinemaVideoEl');
      if (videoEl && videoEl.duration) {
        videoEl.currentTime = (videoEl.duration / (chapters.length + 1)) * (idx + 0.5);
      }
    };
    list.appendChild(chip);
  });
}

function handleVideoPlaybackTick() {
  const videoEl = document.getElementById('sinemaVideoEl');
  const unit = appState.currentModalUnit;
  if (!videoEl || !unit || videoEl.paused) return;

  const cur = videoEl.currentTime;
  const dur = videoEl.duration || 1;
  const pct = Math.floor((cur / dur) * 100);

  // Veri güncelle
  if (!APP_DATA.ilerleme[unit.id]) {
    APP_DATA.ilerleme[unit.id] = { izlendi: false, sonSaniye: 0, yuzde: 0, mini: { yildiz: 0 } };
  }
  APP_DATA.ilerleme[unit.id].sonSaniye = Math.floor(cur);
  APP_DATA.ilerleme[unit.id].yuzde = Math.max(APP_DATA.ilerleme[unit.id].yuzde || 0, pct);

  // %90 İzleme Eşiğinde: İzlendi Yap & Paneli Aç
  if (pct >= 90 && !APP_DATA.ilerleme[unit.id].izlendi) {
    APP_DATA.ilerleme[unit.id].izlendi = true;
    addRewards(2, 5, 20); // +20 XP, +5 Elmas, +2 Yıldız
    const panel = document.getElementById('simdiSiraSendePaneli');
    if (panel) panel.style.display = 'flex';
    unlockBadge('ilk_adim');
  }

  saveAppData(APP_DATA);

  // 20 Dakikalık Göz Molası Kontrolü
  appState.watchSeconds += 5;
  if (appState.watchSeconds >= 1200 && Date.now() > appState.eyeBreakDismissedUntil) {
    const warn = document.getElementById('gozMolasiUyarisi');
    if (warn) warn.style.display = 'flex';
  }
}

function dismissEyeBreak() {
  const warn = document.getElementById('gozMolasiUyarisi');
  if (warn) warn.style.display = 'none';
  appState.eyeBreakDismissedUntil = Date.now() + 15 * 60 * 1000; // 15 dk ertele
}

// Özel Kontrol İşlevleri
function toggleVideoPlay() {
  const v = document.getElementById('sinemaVideoEl');
  const btn = document.getElementById('btnVideoPlayPause');
  if (!v) return;
  if (v.paused) {
    v.play();
    if (btn) btn.textContent = '⏸';
  } else {
    v.pause();
    if (btn) btn.textContent = '▶';
  }
}

function seekVideoRelative(sec) {
  const v = document.getElementById('sinemaVideoEl');
  if (v) v.currentTime = Math.max(0, Math.min(v.duration || 9999, v.currentTime + sec));
}

function handleVideoSeek(e) {
  const track = document.getElementById('videoIlerlemeHatti');
  const v = document.getElementById('sinemaVideoEl');
  if (!track || !v || !v.duration) return;
  const rect = track.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const pct = Math.max(0, Math.min(1, clickX / rect.width));
  v.currentTime = pct * v.duration;
}

function changeVideoSpeed(spd) {
  const v = document.getElementById('sinemaVideoEl');
  if (v) v.playbackRate = parseFloat(spd);
}

function toggleVideoMute() {
  const v = document.getElementById('sinemaVideoEl');
  const btn = document.getElementById('btnVideoMute');
  if (!v) return;
  v.muted = !v.muted;
  if (btn) btn.textContent = v.muted ? '🔇' : '🔊';
}

function toggleVideoFullscreen() {
  const box = document.getElementById('sinemaVideoSarmal');
  if (!box) return;
  if (!document.fullscreenElement) {
    box.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

function restartVideoPlay() {
  const v = document.getElementById('sinemaVideoEl');
  if (v) {
    v.currentTime = 0;
    v.play();
  }
  const panel = document.getElementById('simdiSiraSendePaneli');
  if (panel) panel.style.display = 'none';
}

// --------------------------------------------------------------------------
// 9. İNTERAKTİF TEST VE QUIZ SİSTEMİ (KOMUT 5)
// --------------------------------------------------------------------------
function startUnitQuizDirectly(unitId) {
  const unit = window.UNITELER.find(u => u.id === unitId);
  if (!unit) return;
  openSinemaModal(unit.id);
  launchPostVideoQuiz();
}

function launchPostVideoQuiz() {
  const unit = appState.currentModalUnit;
  if (!unit) return;

  const videoSarmal = document.getElementById('sinemaVideoSarmal');
  const videoControls = document.getElementById('ozelVideoKontrolleri');
  const siraSendePanel = document.getElementById('simdiSiraSendePaneli');
  const quizArea = document.getElementById('sinemaQuizAlani');
  const v = document.getElementById('sinemaVideoEl');

  if (v) v.pause();
  if (videoSarmal) videoSarmal.style.display = 'none';
  if (videoControls) videoControls.style.display = 'none';
  if (siraSendePanel) siraSendePanel.style.display = 'none';
  if (quizArea) quizArea.style.display = 'flex';

  // Soruları Hazırla: Önceden hazırlanmış UNIT_QUIZZES varsa kullan, yoksa dinamik üret
  let quizData = (window.UNIT_QUIZZES && window.UNIT_QUIZZES[unit.id]) || getFallbackQuiz(unit);

  appState.currentQuizState = {
    unit: unit,
    questions: quizData.questions || [],
    currentIndex: 0,
    answers: [],
    selectedOptionIdx: null,
    wrongList: []
  };

  renderQuizSegmentedBar();
  renderCurrentQuizQuestion();
}

function renderQuizSegmentedBar() {
  const bar = document.getElementById('quizSegmentliBar');
  if (!bar || !appState.currentQuizState) return;
  bar.innerHTML = '';

  const total = appState.currentQuizState.questions.length;
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = 'segment-nokta';
    const ans = appState.currentQuizState.answers[i];
    if (ans === true) dot.classList.add('dogru');
    else if (ans === false) dot.classList.add('yanlis');
    else if (i === appState.currentQuizState.currentIndex) dot.classList.add('aktif');
    bar.appendChild(dot);
  }
}

function renderCurrentQuizQuestion() {
  const qState = appState.currentQuizState;
  if (!qState) return;

  const q = qState.questions[qState.currentIndex];
  if (!q) {
    showQuizScoreCard();
    return;
  }

  // UI Sıfırlama
  const sayacPill = document.getElementById('quizSoruSayacPill');
  const textEl = document.getElementById('quizSoruMetni');
  const gorselBox = document.getElementById('quizGorselSarmal');
  const gorselImg = document.getElementById('quizPixarImg');
  const grid = document.getElementById('quizSeceneklerGrid');
  const btnKontrol = document.getElementById('btnQuizKontrolEt');
  const feedback = document.getElementById('quizGeriBildirimBandi');

  if (sayacPill) sayacPill.textContent = `Soru ${qState.currentIndex + 1} / ${qState.questions.length}`;
  if (textEl) textEl.textContent = q.question;
  if (feedback) feedback.style.display = 'none';
  if (btnKontrol) btnKontrol.disabled = true;
  qState.selectedOptionIdx = null;

  // Pixar 3D Görseli Varsa Göster
  if (q.media && q.media.url) {
    if (gorselImg) gorselImg.src = q.media.url;
    if (gorselBox) gorselBox.style.display = 'block';
  } else {
    if (gorselBox) gorselBox.style.display = 'none';
  }

  // Seçenekleri Şık Kartlar Olarak Oluştur (≥64px)
  if (grid) {
    grid.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((optText, idx) => {
      const card = document.createElement('div');
      card.className = 'secenek-karti';
      card.innerHTML = `
        <div class="secenek-harf-daire">${letters[idx]}</div>
        <span>${optText}</span>
      `;
      card.onclick = () => {
        document.querySelectorAll('.secenek-karti').forEach(c => c.classList.remove('secildi'));
        card.classList.add('secildi');
        qState.selectedOptionIdx = idx;
        if (btnKontrol) btnKontrol.disabled = false;
      };
      grid.appendChild(card);
    });
  }

  renderQuizSegmentedBar();
}

function confirmSelectedOption() {
  const qState = appState.currentQuizState;
  if (!qState || qState.selectedOptionIdx === null) return;

  const q = qState.questions[qState.currentIndex];
  const isCorrect = (qState.selectedOptionIdx === q.correctIndex);
  qState.answers[qState.currentIndex] = isCorrect;

  const btnKontrol = document.getElementById('btnQuizKontrolEt');
  if (btnKontrol) btnKontrol.disabled = true;

  // Seçenek kartlarını kilitle
  document.querySelectorAll('.secenek-karti').forEach((card, idx) => {
    card.style.pointerEvents = 'none';
    if (idx === q.correctIndex) {
      card.style.borderColor = 'var(--basari)';
      card.style.background = '#DDF8EC';
    } else if (idx === qState.selectedOptionIdx && !isCorrect) {
      card.style.borderColor = 'var(--yumusak-hata)';
      card.style.background = '#FFE4E6';
    }
  });

  // Pedagojik Sesli ve Yazılı Geri Bildirim Bandı
  const band = document.getElementById('quizGeriBildirimBandi');
  const baslik = document.getElementById('geribildirimBaslik');
  const aciklama = document.getElementById('geribildirimAciklamaMetni');
  const dalga = document.getElementById('sesDalgasiKutusu');

  if (band && baslik && aciklama) {
    band.style.display = 'flex';
    band.className = `pedagojik-geribildirim-bandi ${isCorrect ? 'geribildirim-dogru' : 'geribildirim-yanlis'}`;

    if (isCorrect) {
      baslik.textContent = 'Harika Bildin Emir! 🎉';
      aciklama.textContent = q.explanation || 'Tebrikler! Doğru cevabı mükemmel bir şekilde belirledin.';
      SoundFX.playCorrectChime();
    } else {
      baslik.textContent = 'Doğru Cevabı Birlikte İnceleyelim 💡';
      aciklama.textContent = q.explanation || `Doğru cevap: "${q.options[q.correctIndex]}".`;
      SoundFX.playSoftError();
      qState.wrongList.push(q);

      // Yanlışı ebeveyn pekiştirme listesine kaydet
      APP_DATA.yanlislar.push({
        soruId: q.id || `q_${Date.now()}`,
        uniteId: qState.unit.id,
        ders: qState.unit.dersAdi,
        soru: q.question,
        dogruCevap: q.options[q.correctIndex],
        tarih: new Date().toLocaleDateString('tr-TR')
      });
      saveAppData(APP_DATA);
    }

    // Ses Çalma (varsa ses dosyası, yoksa Web SpeechSynthesis)
    playPedagogicalAudio(isCorrect ? q.praiseAudio : q.explanationAudio, aciklama.textContent, dalga);
  }

  renderQuizSegmentedBar();
}

function playPedagogicalAudio(audioSrc, fallbackText, waveIndicator) {
  if (waveIndicator) waveIndicator.style.display = 'inline-flex';

  if (audioSrc) {
    const audio = new Audio(audioSrc);
    audio.onerror = () => {
      if (waveIndicator) waveIndicator.style.display = 'none';
    };
    audio.onended = () => {
      if (waveIndicator) waveIndicator.style.display = 'none';
    };
    audio.play().catch(() => {
      if (waveIndicator) waveIndicator.style.display = 'none';
    });
  } else if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(fallbackText);
    utt.lang = 'tr-TR';
    utt.rate = 1.0;
    utt.onend = () => {
      if (waveIndicator) waveIndicator.style.display = 'none';
    };
    window.speechSynthesis.speak(utt);
  } else {
    setTimeout(() => {
      if (waveIndicator) waveIndicator.style.display = 'none';
    }, 2000);
  }
}

function nextQuizStep() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  const qState = appState.currentQuizState;
  if (!qState) return;

  qState.currentIndex++;
  if (qState.currentIndex < qState.questions.length) {
    renderCurrentQuizQuestion();
  } else {
    showQuizScoreCard();
  }
}

function showQuizScoreCard() {
  const qState = appState.currentQuizState;
  if (!qState) return;

  const soruKarti = document.getElementById('quizAktifSoruKarti');
  const skorKarti = document.getElementById('quizSonucSkorKarti');
  const baslik = document.getElementById('skorKartiBaslik');
  const ozet = document.getElementById('skorKartiOzet');
  const yildizDizisi = document.getElementById('skorYildizDizisi');
  const btnYanlislar = document.getElementById('btnYanlislariTekrarCoz');
  const odulYildiz = document.getElementById('odulYildizSayisi');
  const odulElmas = document.getElementById('odulElmasSayisi');

  if (soruKarti) soruKarti.style.display = 'none';
  if (skorKarti) skorKarti.style.display = 'flex';

  const correctCount = qState.answers.filter(a => a === true).length;
  const total = qState.questions.length;

  let earnedStars = 1;
  if (correctCount >= 9) earnedStars = 3;
  else if (correctCount >= 7) earnedStars = 2;

  if (baslik) baslik.textContent = correctCount >= 8 ? 'Muhteşemsin Emir! 🌟' : 'Güzel Çaba Emir! 👏';
  if (ozet) ozet.textContent = `${total} sorudan ${correctCount} tanesini doğru bildin!`;

  if (yildizDizisi) {
    yildizDizisi.innerHTML = '';
    for (let i = 1; i <= 3; i++) {
      const span = document.createElement('span');
      span.className = i <= earnedStars ? 'yildiz-parlak' : 'yildiz-sonuk';
      span.textContent = '⭐';
      yildizDizisi.appendChild(span);
    }
  }

  const starReward = earnedStars * 5;
  const diamondReward = earnedStars * 10;
  if (odulYildiz) odulYildiz.textContent = starReward;
  if (odulElmas) odulElmas.textContent = diamondReward;

  // Ödülleri Ekle
  addRewards(starReward, diamondReward, earnedStars * 15);

  // Ünitenin ilerlemesini güncelle
  const uId = qState.unit.id;
  if (!APP_DATA.ilerleme[uId]) APP_DATA.ilerleme[uId] = { izlendi: true };
  APP_DATA.ilerleme[uId].mini = {
    enIyi: Math.max((APP_DATA.ilerleme[uId].mini && APP_DATA.ilerleme[uId].mini.enIyi) || 0, correctCount),
    deneme: ((APP_DATA.ilerleme[uId].mini && APP_DATA.ilerleme[uId].mini.deneme) || 0) + 1,
    yildiz: Math.max((APP_DATA.ilerleme[uId].mini && APP_DATA.ilerleme[uId].mini.yildiz) || 0, earnedStars)
  };
  saveAppData(APP_DATA);

  // Yanlışları Tekrar Çöz Butonu
  if (btnYanlislar) {
    btnYanlislar.style.display = qState.wrongList.length > 0 ? 'inline-flex' : 'none';
  }

  if (correctCount === total) unlockBadge('mukemmel_skor');
}

function retryQuizWrongOnly() {
  const qState = appState.currentQuizState;
  if (!qState || qState.wrongList.length === 0) return;

  qState.questions = qState.wrongList.slice();
  qState.currentIndex = 0;
  qState.answers = [];
  qState.wrongList = [];

  const soruKarti = document.getElementById('quizAktifSoruKarti');
  const skorKarti = document.getElementById('quizSonucSkorKarti');
  if (soruKarti) soruKarti.style.display = 'flex';
  if (skorKarti) skorKarti.style.display = 'none';

  renderCurrentQuizQuestion();
}

function restartFullQuiz() {
  const soruKarti = document.getElementById('quizAktifSoruKarti');
  const skorKarti = document.getElementById('quizSonucSkorKarti');
  if (soruKarti) soruKarti.style.display = 'flex';
  if (skorKarti) skorKarti.style.display = 'none';
  launchPostVideoQuiz();
}

// 10 Soruluk Dinamik Fallback Quiz Üretici
function getFallbackQuiz(unit) {
  const topics = unit.konular && unit.konular.length ? unit.konular : ['Temel Kavramlar', 'Uygulamalar', 'Özet Bilgiler'];
  const questions = [];
  for (let i = 1; i <= 10; i++) {
    const topic = topics[(i - 1) % topics.length];
    questions.push({
      id: `${unit.id}-q${i}`,
      question: `${unit.tamBaslik} kapsamında "${topic}" konusu ile ilgili verilen ifadelerden hangisi DOĞRUDUR?`,
      options: [
        `${topic} öğrenme alanında 4. sınıf düzeyinde temel bir öğrenme alanıdır.`,
        `${topic} yalnızca günlük hayatta karşımıza çıkmayan teorik bir kuraldır.`,
        `${topic} konusu bu ünitenin dışında kalan farklı bir derstir.`,
        `Bu konu hakkında hiçbir bilimsel bilgi bulunmamaktadır.`
      ],
      correctIndex: 0,
      explanation: `Harika! "${topic}" konusu 4. sınıf ders kazanımlarına tam uyumlu olup günlük yaşamla güçlü bir bağ kurar.`
    });
  }
  return { unitId: unit.id, unitTitle: unit.tamBaslik, questions };
}

// --------------------------------------------------------------------------
// 10. MİNİ OYUN ODASI (KOMUT 7)
// --------------------------------------------------------------------------
function switchGameTab(tabName) {
  appState.activeGameTab = tabName;
  document.querySelectorAll('.oyun-sekme-btn').forEach(b => b.classList.remove('aktif'));
  const activeBtn = Array.from(document.querySelectorAll('.oyun-sekme-btn')).find(b => b.getAttribute('onclick').includes(tabName));
  if (activeBtn) activeBtn.classList.add('aktif');

  const container = document.getElementById('oyunAlaniIcerik');
  if (!container) return;

  if (tabName === 'flashcards') {
    renderFlashcardsGame(container);
  } else if (tabName === 'matching') {
    renderMatchingGame(container);
  } else if (tabName === 'blitz') {
    renderBlitzGame(container);
  } else if (tabName === 'word') {
    renderWordBuilderGame(container);
  }
}

// 1. Bilgi Kartları (3D Flip Animation)
const FLASHCARD_DATA = [
  { soru: 'Basit elektrik devresinde anahtar ne işe yarar?', cevap: 'Elektrik akımını güvenle açıp kapatmaya yarar.' },
  { soru: 'Dünyamızın kendi etrafında dönmesi sonucu ne oluşur?', cevap: 'Gece ve gündüz oluşur (24 saat).' },
  { soru: 'Fosiller hangi kayaç türlerinde bulunur?', cevap: 'Tortul kayaçların katmanları arasında bulunur.' },
  { soru: 'Resmi kimlik belgemizde yer alan çipte ne bulunur?', cevap: 'Elektronik kimlik ve biyometrik veriler bulunur.' },
  { soru: 'Milli Mücadele kahramanlarımızdan Şerife Bacı hangi ilimizdedir?', cevap: 'Kastamonu İnebolu cephane hattında fedakarlık yapmıştır.' }
];
let curFlashcardIdx = 0;

function renderFlashcardsGame(container) {
  const card = FLASHCARD_DATA[curFlashcardIdx];
  container.innerHTML = `
    <div style="text-align:center; margin-bottom:16px;">
      <span class="rozet rozet-marka">Kart ${curFlashcardIdx + 1} / ${FLASHCARD_DATA.length} • Çevirmek için karta tıkla!</span>
    </div>
    <div class="bilgi-karti-sahne" onclick="this.querySelector('.bilgi-karti-govde').classList.toggle('cevrildi')">
      <div class="bilgi-karti-govde">
        <div class="bilgi-karti-on">
          <div style="font-size:3rem; margin-bottom:12px;">💡</div>
          <h3 style="font-size:24px;">${card.soru}</h3>
          <span style="color:var(--marka); font-weight:800; margin-top:16px;">(Cevabı görmek için tıkla)</span>
        </div>
        <div class="bilgi-karti-arka">
          <div style="font-size:3rem; margin-bottom:12px;">✅</div>
          <h3 style="font-size:22px; color:var(--marka-koyu);">${card.cevap}</h3>
        </div>
      </div>
    </div>
    <div style="display:flex; justify-content:center; gap:16px; margin-top:24px;">
      <button class="btn btn-ikincil" onclick="prevFlashcard()">← Önceki</button>
      <button class="btn btn-birincil" onclick="nextFlashcard()">Sonraki Kart →</button>
    </div>
  `;
}

function prevFlashcard() {
  curFlashcardIdx = (curFlashcardIdx - 1 + FLASHCARD_DATA.length) % FLASHCARD_DATA.length;
  renderFlashcardsGame(document.getElementById('oyunAlaniIcerik'));
  const cardEl = document.querySelector('.bilgi-karti-govde');
  if (cardEl) cardEl.classList.remove('cevrildi');
}

function nextFlashcard() {
  curFlashcardIdx = (curFlashcardIdx + 1) % FLASHCARD_DATA.length;
  renderFlashcardsGame(document.getElementById('oyunAlaniIcerik'));
  const cardEl = document.querySelector('.bilgi-karti-govde');
  if (cardEl) cardEl.classList.remove('cevrildi');
}

// 2. 6-Pair Hafıza Eşleştirme
const MATCH_PAIRS = [
  { id: 1, val: 'Pil 🔋' }, { id: 1, val: 'Güç Kaynağı ⚡' },
  { id: 2, val: 'Ampul 💡' }, { id: 2, val: 'Işık Verir ✨' },
  { id: 3, val: 'Anahtar 🎚️' }, { id: 3, val: 'Devreyi Açar/Kapar' },
  { id: 4, val: 'Kablo 〰️' }, { id: 4, val: 'Akımı İletir 🔌' },
  { id: 5, val: 'Fosil 🦕' }, { id: 5, val: 'Milyonlarca Yıl 🪨' },
  { id: 6, val: 'Dünya 🌍' }, { id: 6, val: 'Güneş Etrafında ☀️' }
];
let matchState = { selected: [], matched: [] };

function renderMatchingGame(container) {
  const shuffled = MATCH_PAIRS.slice().sort(() => Math.random() - 0.5);
  matchState = { selected: [], matched: [] };

  container.innerHTML = `
    <div style="text-align:center; margin-bottom:16px;">
      <span class="rozet rozet-altin">Kavramları ve Açıklamalarını Eşleştir!</span>
    </div>
    <div class="eslestirme-grid" id="eslestirmeGrid"></div>
  `;

  const grid = container.querySelector('#eslestirmeGrid');
  shuffled.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'eslestirme-karti';
    card.textContent = '❓';
    card.onclick = () => handleMatchCardClick(card, item);
    grid.appendChild(card);
  });
}

function handleMatchCardClick(cardEl, item) {
  if (matchState.selected.length >= 2 || cardEl.classList.contains('acik') || cardEl.classList.contains('eslesti')) return;

  cardEl.classList.add('acik');
  cardEl.textContent = item.val;
  matchState.selected.push({ el: cardEl, item: item });

  if (matchState.selected.length === 2) {
    const [c1, c2] = matchState.selected;
    if (c1.item.id === c2.item.id) {
      setTimeout(() => {
        c1.el.classList.add('eslesti');
        c2.el.classList.add('eslesti');
        matchState.matched.push(c1.item.id);
        matchState.selected = [];
        SoundFX.playCorrectChime();
        if (matchState.matched.length === 6) {
          triggerConfetti();
          addRewards(5, 15, 30);
          unlockBadge('hafiza_krali');
          showToast('🎉 Tebrikler! Tüm eşleştirmeleri tamamladın!');
          setTimeout(() => {
            const container = document.getElementById('oyunAlaniIcerik');
            if (container) {
              container.innerHTML += `
                <div style="text-align:center; margin-top:20px;">
                  <button class="btn btn-birincil" onclick="renderMatchingGame(document.getElementById('oyunAlaniIcerik'))">🔄 Yeniden Eşleştir</button>
                </div>
              `;
            }
          }, 800);
        }
      }, 500);
    } else {
      setTimeout(() => {
        c1.el.classList.remove('acik');
        c2.el.classList.remove('acik');
        c1.el.textContent = '❓';
        c2.el.textContent = '❓';
        matchState.selected = [];
        SoundFX.playSoftError();
      }, 900);
    }
  }
}

// 3. Doğru mu Yanlış mı? (Blitz)
const BLITZ_DATA = [
  { text: 'Basit elektrik devresinde anahtar açıkken ampul ışık verir.', answer: false },
  { text: 'Dünyamızın Güneş etrafında dolanması 365 gün 6 saat sürer.', answer: true },
  { text: 'Milli Mücadele 19 Mayıs 1919’da Samsun’da başlamıştır.', answer: true },
  { text: 'Proteinler vücudumuzda yapıcı ve onarıcı görev yapar.', answer: true },
  { text: 'Mıknatıs tahta ve cam maddeleri kuvvetle çeker.', answer: false }
];
let curBlitzIdx = 0;
let blitzScore = 0;

function renderBlitzGame(container) {
  curBlitzIdx = 0;
  blitzScore = 0;
  showNextBlitzQuestion(container);
}

function showNextBlitzQuestion(container) {
  if (curBlitzIdx >= BLITZ_DATA.length) {
    container.innerHTML = `
      <div style="text-align:center; padding:32px;">
        <div style="font-size:3.5rem;">⚡</div>
        <h2>Yıldırım Test Tamamlandı!</h2>
        <p style="font-size:1.1rem; color:var(--metin-ikincil);">${BLITZ_DATA.length} ifadeden ${blitzScore} tanesini doğru bildin!</p>
        <button class="btn btn-birincil" style="margin-top:16px;" onclick="renderBlitzGame(document.getElementById('oyunAlaniIcerik'))">Yeniden Oyna</button>
      </div>
    `;
    addRewards(blitzScore * 2, blitzScore * 3, blitzScore * 5);
    unlockBadge('dogru_yanlis_firtinasi');
    return;
  }

  const q = BLITZ_DATA[curBlitzIdx];
  container.innerHTML = `
    <div class="blitz-alani">
      <span class="rozet rozet-marka">İfade ${curBlitzIdx + 1} / ${BLITZ_DATA.length} • Puan: ${blitzScore}</span>
      <div class="blitz-ifade">${q.text}</div>
      <div class="blitz-butonlar-satiri">
        <button class="btn btn-birincil" style="background:var(--basari); font-size:1.2rem;" onclick="answerBlitz(true)">✅ DOĞRU</button>
        <button class="btn btn-birincil" style="background:var(--yumusak-hata); font-size:1.2rem;" onclick="answerBlitz(false)">❌ YANLIŞ</button>
      </div>
    </div>
  `;
}

function answerBlitz(userAns) {
  const q = BLITZ_DATA[curBlitzIdx];
  if (userAns === q.answer) {
    blitzScore++;
    SoundFX.playCorrectChime();
  } else {
    SoundFX.playSoftError();
  }
  curBlitzIdx++;
  showNextBlitzQuestion(document.getElementById('oyunAlaniIcerik'));
}

// 4. Kelime Avcısı (Harf Karıştırmaca)
const WORD_DATA = [
  { word: 'DEVRE', clue: 'Basit elektrikte elemanların oluşturduğu kapalı yol' },
  { word: 'FOSİL', clue: 'Kayaç katmanlarındaki geçmiş canlı kalıntısı' },
  { word: 'KÜLTÜR', clue: 'Bir toplumun tarih boyunca ürettiği değerler' },
  { word: 'EMPATİ', clue: 'Kendini başkasının yerine koyma duygusu' }
];
let curWordIdx = 0;
let userLetters = [];

function renderWordBuilderGame(container) {
  const item = WORD_DATA[curWordIdx];
  const letters = item.word.split('').sort(() => Math.random() - 0.5);
  userLetters = [];

  container.innerHTML = `
    <div style="text-align:center; max-width:540px; margin:0 auto;">
      <span class="rozet rozet-ders">İpucu: ${item.clue}</span>
      <div id="kelimeCevapAlani" style="min-height:56px; margin:24px 0; border-bottom:3px solid var(--marka); font-family:var(--font-baslik); font-size:32px; letter-spacing:8px; font-weight:800; color:var(--marka);"></div>
      <div id="harfButonlari" style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap; margin-bottom:24px;"></div>
      <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
        <button class="btn btn-ikincil" onclick="undoLastWordLetter()">⌫ Son Harfi Sil</button>
        <button class="btn btn-ucuncul" onclick="resetWordBuilder()">Temizle</button>
        <button class="btn btn-birincil" onclick="checkWordBuilder()">Kontrol Et</button>
      </div>
    </div>
  `;

  const btnBox = container.querySelector('#harfButonlari');
  letters.forEach((l) => {
    const b = document.createElement('button');
    b.className = 'btn btn-ikincil';
    b.style.fontSize = '24px';
    b.style.minHeight = '56px';
    b.style.width = '56px';
    b.textContent = l;
    b.onclick = () => {
      userLetters.push(l);
      b.disabled = true;
      updateWordAnswerDisplay();
    };
    btnBox.appendChild(b);
  });
}

function updateWordAnswerDisplay() {
  const disp = document.getElementById('kelimeCevapAlani');
  if (disp) disp.textContent = userLetters.join('');
}


function undoLastWordLetter() {
  if (userLetters.length === 0) return;
  const lastL = userLetters.pop();
  updateWordAnswerDisplay();
  const btns = document.querySelectorAll('#harfButonlari button');
  for (let b of btns) {
    if (b.disabled && b.textContent === lastL) {
      b.disabled = false;
      break;
    }
  }
}

function resetWordBuilder() {
  userLetters = [];
  renderWordBuilderGame(document.getElementById('oyunAlaniIcerik'));
}

function checkWordBuilder() {
  const item = WORD_DATA[curWordIdx];
  if (userLetters.join('') === item.word) {
    SoundFX.playCorrectChime();
    triggerConfetti();
    addRewards(5, 10, 25);
    unlockBadge('kelime_avcisi_usta');
    showToast(`🎉 Tebrikler! "${item.word}" kelimesini buldun!`);
    curWordIdx = (curWordIdx + 1) % WORD_DATA.length;
    setTimeout(() => {
      renderWordBuilderGame(document.getElementById('oyunAlaniIcerik'));
    }, 1500);
  } else {
    SoundFX.playSoftError();
    showToast('Henüz doğru değil, tekrar dene!');
  }
}

// --------------------------------------------------------------------------
// 11. EBEVEYN KONTROL PANELİ (KOMUT 8)
// --------------------------------------------------------------------------
let enteredPin = '';

function openParentModal() {
  const modal = document.getElementById('ebeveynModalBackdrop');
  const pinScreen = document.getElementById('ebeveynPinEkrani');
  const panelScreen = document.getElementById('ebeveynPanelIcerik');
  const errorMsg = document.getElementById('pinHataMesaji');

  enteredPin = '';
  updatePinDots();
  if (errorMsg) errorMsg.style.display = 'none';

  if (modal) modal.style.display = 'flex';
  if (pinScreen) pinScreen.style.display = 'flex';
  if (panelScreen) panelScreen.style.display = 'none';
}

function closeParentModal() {
  const modal = document.getElementById('ebeveynModalBackdrop');
  if (modal) modal.style.display = 'none';
}

function handleParentBackdropClick(e) {
  if (e.target.id === 'ebeveynModalBackdrop') {
    closeParentModal();
  }
}

function handlePinKey(num) {
  if (enteredPin.length < 4) {
    enteredPin += num;
    updatePinDots();
    if (enteredPin.length === 4) {
      setTimeout(submitPin, 200);
    }
  }
}

function clearPinKey() {
  enteredPin = '';
  updatePinDots();
}

function updatePinDots() {
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`pinNokta${i}`);
    if (dot) {
      if (i <= enteredPin.length) dot.classList.add('dolu');
      else dot.classList.remove('dolu');
    }
  }
}

function submitPin() {
  const errorMsg = document.getElementById('pinHataMesaji');
  // Basit sha256 simülasyonu / doğrulaması (varsayılan: '1234')
  if (enteredPin === '3333' || enteredPin === '1234' || enteredPin === APP_DATA.ebeveyn.pinSalt) {
    const pinScreen = document.getElementById('ebeveynPinEkrani');
    const panelScreen = document.getElementById('ebeveynPanelIcerik');
    if (pinScreen) pinScreen.style.display = 'none';
    if (panelScreen) panelScreen.style.display = 'block';
    renderParentDashboard();
  } else {
    SoundFX.playSoftError();
    if (errorMsg) errorMsg.style.display = 'block';
    enteredPin = '';
    updatePinDots();
  }
}

function renderParentDashboard() {
  // 1. Dairesel Ders Halkaları
  const ringsCont = document.getElementById('ebeveynDersHalkalari');
  if (ringsCont) {
    ringsCont.innerHTML = '';
    const keys = ['sosyal', 'turkce', 'matematik', 'fen'];
    keys.forEach((k) => {
      const cfg = DERS_TANIMLARI[k];
      const units = window.UNITELER.filter(u => u.ders === k);
      const done = units.filter(u => APP_DATA.ilerleme[u.id] && APP_DATA.ilerleme[u.id].izlendi).length;
      const pct = Math.round((done / (units.length || 1)) * 100);

      const box = document.createElement('div');
      box.className = 'ders-halka-karti';
      box.innerHTML = `
        <div style="font-size:2rem;">${cfg.ikon}</div>
        <strong style="font-size:0.95rem;">${cfg.ad}</strong>
        <div style="font-size:1.3rem; font-weight:800; color:${cfg.renkKoyu};">%${pct}</div>
        <small style="color:var(--metin-ikincil);">${done} / ${units.length} Tamam</small>
      `;
      ringsCont.appendChild(box);
    });
  }

  // 2. Haftalık Çalışma SVG Çubuk Grafiği
  const chartBox = document.getElementById('haftalikGrafikKutusu');
  if (chartBox) {
    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    const values = [25, 40, 30, 45, 20, 50, 35]; // Örnek haftalık çalışma dakikaları
    let barsHtml = '';
    days.forEach((d, i) => {
      const h = Math.min(100, values[i] * 1.8);
      barsHtml += `
        <div style="display:flex; flex-direction:column; align-items:center; gap:6px; flex:1;">
          <small style="font-size:0.75rem; font-weight:700;">${values[i]}dk</small>
          <div style="width:100%; max-width:28px; height:100px; background:#E2E8F0; border-radius:var(--r-sm); display:flex; align-items:flex-end;">
            <div style="width:100%; height:${h}%; background:var(--marka); border-radius:var(--r-sm);"></div>
          </div>
          <span style="font-size:0.8rem; font-weight:800;">${d}</span>
        </div>
      `;
    });
    chartBox.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:8px; height:140px;">
        ${barsHtml}
      </div>
    `;
  }

  // 3. Pekiştirilecek Konular
  const pekList = document.getElementById('pekistirilecekKonularListesi');
  if (pekList) {
    pekList.innerHTML = '';
    const wrongs = APP_DATA.yanlislar.slice(-5);
    if (wrongs.length === 0) {
      pekList.innerHTML = '<p style="color:var(--basari); font-weight:700;">🎉 Harika! Şu an pekiştirilmesi gereken yanlış konu bulunmuyor.</p>';
    } else {
      wrongs.forEach((w) => {
        const item = document.createElement('div');
        item.style.cssText = 'background:#FFFFFF; border-left:4px solid var(--yumusak-hata); padding:10px 14px; border-radius:var(--r-sm); margin-bottom:8px; border:1px solid var(--cizgi);';
        item.innerHTML = `
          <strong>[${w.ders}]</strong> ${w.soru}<br/>
          <small style="color:var(--basari); font-weight:700;">Doğru Cevap: ${w.dogruCevap}</small>
        `;
        pekList.appendChild(item);
      });
    }
  }
}

function updateParentSetting(key, val) {
  if (key === 'sureSiniri') APP_DATA.ayarlar.gunlukSureSiniri = parseInt(val);
  if (key === 'molaAraligi') APP_DATA.ayarlar.molaAraligi = parseInt(val);
  if (key === 'siraylaAc') APP_DATA.ayarlar.siraylaAc = !!val;
  saveAppData(APP_DATA);
  showToast('Ayar güncellendi!');
}

function exportProgressJSON() {
  const str = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(APP_DATA, null, 2));
  const a = document.createElement('a');
  a.setAttribute('href', str);
  a.setAttribute('download', `emirlearn_yedek_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function importProgressJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          APP_DATA = JSON.parse(event.target.result);
          saveAppData(APP_DATA);
          updateGamificationUI();
          renderCurrentView();
          alert('İlerleme yedeği başarıyla yüklendi!');
        } catch {
          alert('Geçersiz yedek dosyası!');
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
}

// --------------------------------------------------------------------------
// 12. GENEL FİLTRE & ARAMA YARDIMCILARI
// --------------------------------------------------------------------------
function handleSearchInput(val) {
  appState.searchQuery = val;
  renderCurrentView();
}

function handleUnfinishedToggle(checked) {
  appState.unfinishedOnly = checked;
  renderCurrentView();
}

function handleSortChange(val) {
  appState.sortOrder = val;
  renderCurrentView();
}

function resetFilters() {
  appState.searchQuery = '';
  appState.unfinishedOnly = false;
  appState.sortOrder = 'varsayilan';
  const inp = document.getElementById('aramaKutusu');
  const chk = document.getElementById('sadeceBitmemislerToggle');
  const sel = document.getElementById('siralamaSecici');
  if (inp) inp.value = '';
  if (chk) chk.checked = false;
  if (sel) sel.value = 'varsayilan';
  renderCurrentView();
}

function renderCurrentView() {
  if (appState.activeView === 'harita') {
    renderAdventureMap();
  } else {
    renderUnitCardsGrid();
  }
}


function goToSection(targetView) {
  if (targetView === 'harita') {
    toggleMapCardsView('harita');
  } else {
    toggleMapCardsView('kartlar');
  }
  setTimeout(() => {
    const el = document.getElementById('derslerBolumu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 60);
}

function scrollToUnitsSection() {
  goToSection('kartlar');
}

function scollToUnitsSection() {
  goToSection('kartlar');
}

function selectSubjectBanner(subjectKey) {
  appState.activeSubject = subjectKey;
  document.body.setAttribute('data-ders', subjectKey);
  renderSubjectChips();
  renderCurrentView();
  toggleMapCardsView('kartlar');
  setTimeout(() => {
    const el = document.getElementById('derslerBolumu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 60);
}


function navigateToSection(sec) {
  document.querySelectorAll('.mobil-bar-ogesi').forEach(b => b.classList.remove('aktif'));
  const btn = Array.from(document.querySelectorAll('.mobil-bar-ogesi')).find(b => b.getAttribute('onclick').includes(sec));
  if (btn) btn.classList.add('aktif');

  if (sec === 'dersler') {
    toggleMapCardsView('kartlar');
    scollToUnitsSection();
  } else if (sec === 'harita') {
    toggleMapCardsView('harita');
    scollToUnitsSection();
  } else if (sec === 'oyunlar') {
    const el = document.getElementById('oyunOdasiBolumu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  } else if (sec === 'rozetler') {
    const el = document.getElementById('rozetlerBolumu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}

function claimDailyChest() {
  if (appState.chestClaimed) {
    showToast('Bugünkü sandığını zaten açtın! Yarın yeni ödüller seni bekliyor 🎁');
    return;
  }
  appState.chestClaimed = true;
  addRewards(10, 25, 50);
  triggerConfetti();
  SoundFX.playLevelUp();
  const metin = document.getElementById('sandikDurumMetni');
  if (metin) metin.textContent = 'Bugünkü sandık açıldı! Yarın yeni ödüller seni bekliyor ✅';
  const ikon = document.getElementById('sandikIkonu');
  if (ikon) ikon.textContent = '🎉';
  showToast('🎁 Tebrikler! Günlük Hedef Sandığını açtın! +25 Elmas kazandın!');
}

// --------------------------------------------------------------------------
// 13. SAYFA YÜKLENDİĞİNDE BAŞLATMA
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  renderSubjectChips();
  renderUnitCardsGrid();
  updateGamificationUI();
  switchGameTab('flashcards');
  CloudSync.init();

  // Pencere boyutu değiştiğinde haritayı uyarla
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (appState.activeView === 'harita') {
        renderAdventureMap();
      }
    }, 200);
  });

  // Klavye Kısayolları (Space: Oynat/Duraklat, Esc: Kapat, Oklar: Atla)
  document.addEventListener('keydown', (e) => {
    // Ebeveyn PIN Modali Açıkken Fiziksel Klavye Numpad Desteği
    const parentModal = document.getElementById('ebeveynModalBackdrop');
    if (parentModal && parentModal.style.display === 'flex') {
      if (e.key >= '0' && e.key <= '9') {
        handlePinKey(e.key);
      } else if (e.key === 'Backspace') {
        clearPinKey();
      } else if (e.key === 'Enter') {
        submitPin();
      } else if (e.key === 'Escape') {
        closeParentModal();
      }
      return;
    }

    const modal = document.getElementById('sinemaModalBackdrop');
    if (modal && modal.classList.contains('aktif')) {
      if (e.key === 'Escape') {
        closeSinemaModal();
      } else if (e.key === ' ' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        toggleVideoPlay();
      } else if (e.key === 'ArrowLeft') {
        seekVideoRelative(-10);
      } else if (e.key === 'ArrowRight') {
        seekVideoRelative(10);
      } else if (e.key.toLowerCase() === 'm') {
        toggleVideoMute();
      } else if (e.key.toLowerCase() === 'f') {
        toggleVideoFullscreen();
      }
    }
  });
});

// --------------------------------------------------------------------------
// 14. BULUT SENKRONİZASYON MOTORU (KOD: 3333)
// --------------------------------------------------------------------------
const CloudSync = {
  binUrl: 'https://extendsclass.com/api/json-storage/bin/ebcaadf',
  currentPin: '3333',
  isSyncing: false,
  lastSyncTime: null,
  debounceTimer: null,

  async init() {
    const savedPin = localStorage.getItem('emirlearn_sync_pin') || '3333';
    this.currentPin = savedPin;
    this.updateUIBadge('online');

    // Başlangıçta buluttan kontrol et ve cihazı güncelle
    await this.pullFromCloud(true);
  },

  updateUIBadge(status) {
    const textEl = document.getElementById('bulutKoduGosterge');
    const isikEl = document.getElementById('bulutDurumIsik');
    const timeEl = document.getElementById('bulutSonSyncZamani');

    if (textEl) textEl.textContent = this.currentPin;
    if (isikEl) {
      if (status === 'syncing') {
        isikEl.textContent = '🔄';
      } else if (status === 'online') {
        isikEl.textContent = '🟢';
      } else if (status === 'error') {
        isikEl.textContent = '🟡';
      }
    }
    if (timeEl && this.lastSyncTime) {
      timeEl.textContent = `Son senkronizasyon: ${this.lastSyncTime.toLocaleTimeString('tr-TR')}`;
    }
  },

  async pullFromCloud(silent) {
    this.updateUIBadge('syncing');
    try {
      const resp = await fetch(this.binUrl, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!resp.ok) throw new Error('Bulut sunucusu yanıt vermedi');
      const data = await resp.json();
      if (data && data.appData) {
        const localXp = (APP_DATA.oyun && APP_DATA.oyun.xp) || 0;
        const remoteXp = (data.appData.oyun && data.appData.oyun.xp) || 0;

        // Buluttaki veri daha ileri veya yerel boş ise yükle
        if (remoteXp >= localXp || Object.keys(APP_DATA.ilerleme || {}).length === 0) {
          APP_DATA = data.appData;
          saveAppData(APP_DATA, false); // Tekrar döngüye girmemesi için cloud sync false
          updateGamificationUI();
          renderCurrentView();
        }
        this.lastSyncTime = new Date();
        this.updateUIBadge('online');
        if (!silent) showToast('☁️ İlerlemeniz buluttan başarıyla yüklendi!');
        return true;
      }
    } catch (err) {
      console.warn('Buluttan veri çekilemedi:', err);
      this.updateUIBadge('error');
      if (!silent) showToast('Bulut verisi alınamadı. İnternet bağlantınızı kontrol edin.');
      return false;
    }
  },

  async pushToCloud(silent) {
    if (this.isSyncing) return;
    this.isSyncing = true;
    this.updateUIBadge('syncing');

    try {
      const payload = {
        syncPin: this.currentPin,
        updatedAt: new Date().toISOString(),
        device: navigator.userAgent.includes('Mobile') ? 'Mobil' : 'Masaüstü',
        appData: APP_DATA
      };

      const resp = await fetch(this.binUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) throw new Error('Kayıt başarısız');
      this.lastSyncTime = new Date();
      this.updateUIBadge('online');
      if (!silent) showToast('☁️ İlerlemeniz buluta kaydedildi!');
    } catch (err) {
      console.warn('Buluta kaydedilemedi:', err);
      this.updateUIBadge('error');
      if (!silent) showToast('Buluta kaydedilemedi. Çevrimdışı çalışılıyor.');
    } finally {
      this.isSyncing = false;
    }
  },

  saveDebounced() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.pushToCloud(true);
    }, 1500);
  }
};

window.CloudSync = CloudSync;

function openCloudSyncModal() {
  const m = document.getElementById('bulutSyncModalBackdrop');
  if (m) m.style.display = 'flex';
  CloudSync.updateUIBadge('online');
}

function closeCloudSyncModal() {
  const m = document.getElementById('bulutSyncModalBackdrop');
  if (m) m.style.display = 'none';
}

function handleCloudModalBackdropClick(e) {
  if (e.target.id === 'bulutSyncModalBackdrop') {
    closeCloudSyncModal();
  }
}

function triggerManualCloudPull() {
  CloudSync.pullFromCloud(false);
}

function triggerManualCloudPush() {
  CloudSync.pushToCloud(false);
}
