/* ============================================================
   lesson.js — Ders Sayfası Orkestratörü
   VideoPlayer + QuizEngine'i birbirine bağlar
   Faz geçişlerini, ilerleme kaydını ve sonuç ekranını yönetir
   ============================================================ */

const STORAGE_KEY = 'emirlearn_progress';

// ── Yardımcı: URL parametresinden konu id'si al ────────────
function getLessonId() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id'));
}

// ── LocalStorage ───────────────────────────────────────────
function getProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

function saveProgress(id, data) {
  const p = getProgress();
  p[id]   = { ...(p[id] || {}), ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

// ── Faz Geçişleri ──────────────────────────────────────────
function showPhase(phaseId) {
  ['videoPhase', 'quizPhase', 'resultPhase'].forEach(id => {
    document.getElementById(id).classList.toggle('hidden', id !== phaseId);
  });
}

function markPhase(stepId, state) {  // state: 'active' | 'done'
  const el = document.getElementById(stepId);
  if (!el) return;
  el.classList.remove('active', 'done');
  el.classList.add(state);
}

// ── Konu başlığı render ────────────────────────────────────
function renderLessonHeader(lesson) {
  const header = document.getElementById('lessonHeader');
  header.innerHTML = `
    <div class="lesson-header-icon" style="background:${lesson.color}22; color:${lesson.color}">
      ${lesson.icon}
    </div>
    <div class="lesson-header-info">
      <h1>${lesson.title}</h1>
      <span class="subject-tag" style="background:${lesson.color}">${lesson.subject}</span>
    </div>
  `;
  document.title = `EmirLearn — ${lesson.title}`;
}

// ── Sonuç Ekranı ───────────────────────────────────────────
function renderResult(lesson, result) {
  showPhase('resultPhase');
  markPhase('phaseResult', 'active');

  const { score, total, pct, answers } = result;

  // Başlık + animasyon
  const titles = {
    perfect:  { emoji: '🏆', title: 'Mükemmel!',       msg: 'Tüm soruları doğru yaptın! Sen bir dahisin! 🌟' },
    excellent:{ emoji: '🎉', title: 'Harika!',          msg: 'Çok iyi yaptın! Bir kaç tane daha ve mükemmel! 💪' },
    good:     { emoji: '😊', title: 'İyi İş!',          msg: 'Başardın! Biraz daha çalışırsan daha da iyi olacak! 📚' },
    retry:    { emoji: '💪', title: 'Tekrar Dene!',     msg: 'Videoyu bir kez daha izle, emin olacaksın! 🎬' },
  };

  let tier;
  if (pct === 100)      tier = 'perfect';
  else if (pct >= 80)   tier = 'excellent';
  else if (pct >= 60)   tier = 'good';
  else                  tier = 'retry';

  const t = titles[tier];

  document.getElementById('resultAnimation').textContent = t.emoji;
  document.getElementById('resultTitle').textContent     = t.title;
  document.getElementById('resultMessage').textContent   = t.msg;

  // Skor dairesi
  const circle = document.getElementById('scoreCircle');
  circle.textContent = `${score}/${total}`;
  circle.className = `score-circle ${tier === 'retry' ? 'retry' : tier === 'good' ? 'good' : 'excellent'}`;

  // Yıldızlar
  const stars = pct === 100 ? 3 : pct >= 60 ? 2 : 1;
  document.getElementById('starsEarned').textContent = '⭐'.repeat(stars) + '🌑'.repeat(3 - stars);

  // Rozet
  const badges = {
    perfect:  { icon: '🥇', label: 'Altın Madalya!',    desc: 'Mükemmel puan!' },
    excellent:{ icon: '🥈', label: 'Gümüş Madalya!',   desc: 'Harika performans!' },
    good:     { icon: '🥉', label: 'Bronz Madalya!',    desc: 'Geçti, tebrikler!' },
  };

  if (tier !== 'retry') {
    const b  = badges[tier];
    const be = document.getElementById('badgeEarned');
    document.getElementById('badgeIcon').textContent = b.icon;
    document.getElementById('badgeText').innerHTML  = `<strong>${b.label}</strong><span>${b.desc}</span>`;
    be.classList.remove('hidden');
  }

  // Cevap özeti
  const summaryEl = document.getElementById('answerSummary');
  answers.forEach((a, i) => {
    const div = document.createElement('div');
    div.className = `summary-item ${a.correct ? 'c' : 'w'}`;
    div.textContent = a.correct ? '✓' : '✗';
    div.title = `Soru ${i + 1}: ${a.correct ? 'Doğru' : 'Yanlış'}`;
    summaryEl.appendChild(div);
  });

  // İlerleme kaydet
  saveProgress(lesson.id, {
    completed: tier !== 'retry' || pct >= 60,
    score,
    stars,
    tier,
    completedAt: new Date().toISOString(),
  });

  // Konfeti
  if (pct >= 80) {
    playSound('complete');
    launchConfetti(pct === 100 ? 60 : 30);
  } else {
    playSound(pct >= 60 ? 'correct' : 'wrong');
  }

  // Butonlar
  document.getElementById('reWatchBtn').addEventListener('click', () => {
    window.location.reload();
  });
  document.getElementById('nextLessonBtn').addEventListener('click', () => {
    const src = new URLSearchParams(window.location.search).get('src');
    if (src === 'turkce') window.location.href = 'turkce/index.html';
    else if (src === 'matematik') window.location.href = 'matematik/index.html';
    else if (src === 'fen') window.location.href = 'fen/index.html';
    else if (src === 'sosyal') window.location.href = 'sosyal/index.html';
    else window.location.href = 'index.html';
  });
}

// ── Ana Başlatma ───────────────────────────────────────────
async function init() {
  const id  = getLessonId();
  const src = new URLSearchParams(window.location.search).get('src');
  if (!id) {
    window.location.href = 'index.html';
    return;
  }

  // Header geri butonu linkini güncelle
  const backBtn = document.querySelector('.back-btn');
  if (backBtn && src) {
    if (src === 'turkce') backBtn.href = 'turkce/index.html';
    else if (src === 'matematik') backBtn.href = 'matematik/index.html';
    else if (src === 'fen') backBtn.href = 'fen/index.html';
    else if (src === 'sosyal') backBtn.href = 'sosyal/index.html';
  }

  // Veri çek — hem turkce hem genel kaynakları tara
  let lesson;
  try {
    const candidateLists = [];
    if (window.SOSYAL_LESSONS_DATA && window.SOSYAL_LESSONS_DATA.units) {
      candidateLists.push(window.SOSYAL_LESSONS_DATA.units.flatMap(u => u.lessons));
    }
    if (window.FEN_LESSONS_DATA && window.FEN_LESSONS_DATA.units) {
      candidateLists.push(window.FEN_LESSONS_DATA.units.flatMap(u => u.lessons));
    }
    if (window.MATEMATIK_LESSONS_DATA && window.MATEMATIK_LESSONS_DATA.units) {
      candidateLists.push(window.MATEMATIK_LESSONS_DATA.units.flatMap(u => u.lessons));
    }
    if (window.TURKCE_LESSONS_DATA && window.TURKCE_LESSONS_DATA.units) {
      candidateLists.push(window.TURKCE_LESSONS_DATA.units.flatMap(u => u.lessons));
    }
    if (window.LESSONS_DATA && window.LESSONS_DATA.lessons) {
      candidateLists.push(window.LESSONS_DATA.lessons);
    }
    for (const list of candidateLists) {
      const found = list.find(l => l.id === id);
      if (found) { lesson = found; break; }
    }

    if (!lesson) {
      try {
        const resS = await fetch('data/sosyal-lessons.json');
        const dataS = await resS.json();
        lesson = dataS.units?.flatMap(u => u.lessons).find(l => l.id === id);
      } catch (_) {}
    }

    if (!lesson) {
      try {
        const resF = await fetch('data/fen-lessons.json');
        const dataF = await resF.json();
        lesson = dataF.units?.flatMap(u => u.lessons).find(l => l.id === id);
      } catch (_) {}
    }

    if (!lesson) {
      try {
        const resM = await fetch('data/matematik-lessons.json');
        const dataM = await resM.json();
        lesson = dataM.units?.flatMap(u => u.lessons).find(l => l.id === id);
      } catch (_) {}
    }

    if (!lesson) {
      try {
        const resT = await fetch('data/turkce-lessons.json');
        const dataT = await resT.json();
        lesson = dataT.units?.flatMap(u => u.lessons).find(l => l.id === id);
      } catch (_) {}
    }

    if (!lesson) {
      try {
        const resG = await fetch('data/lessons.json');
        const dataG = await resG.json();
        lesson = dataG.lessons?.find(l => l.id === id);
      } catch (_) {}
    }
  } catch {
    alert('Ders verisi yüklenemedi!');
    return;
  }

  if (!lesson) {
    alert('Konu bulunamadı!');
    window.location.href = 'index.html';
    return;
  }

  // Header
  renderLessonHeader(lesson);

  // ── Video Aşaması ─────────────────────────────────────
  showPhase('videoPhase');
  markPhase('phaseVideo', 'active');

  const videoEl = document.getElementById('mainVideo');

  function showPlaceholder() {
    document.getElementById('videoContainer').classList.add('hidden');
    document.getElementById('noVideoPlaceholder').classList.remove('hidden');
    document.getElementById('placeholderIcon').textContent  = lesson.icon || '🎬';
    document.getElementById('placeholderTitle').textContent = lesson.title + ' — Video Hazırlanıyor 🎬';
    document.getElementById('placeholderDesc').innerHTML    =
      `Bu konunun animasyon videosu yakında eklenecektir.<br>Dilersen hemen teste geçip 5 soruyu çözebilir ve şampiyonluk yıldızlarını toplayabilirsin! 🌟`;
    const demoBtn = document.getElementById('demoModeBtn');
    if (demoBtn) {
      demoBtn.textContent = '📝 Hemen Testi Çöz / Quiz\'e Başla →';
    }
  }

  // Video yüklenebilir mi kontrol et
  videoEl.addEventListener('error', (e) => {
    if (videoEl.currentSrc || videoEl.src) {
      showPlaceholder();
    }
  });

  if (!lesson.videoFile || lesson.videoFile.trim() === '') {
    showPlaceholder();
  } else {
    // Tarayıcı önbelleğini (cache) engellemek için sürüm parametresi ekle
    videoEl.preload = 'auto';
    videoEl.src = lesson.videoFile + '?v=' + Date.now();
    videoEl.load();
  }

  // Callback: video bitince quiz başlat
  function startQuiz() {
    showPhase('quizPhase');
    markPhase('phaseVideo', 'done');
    markPhase('phaseQuiz', 'active');

    const engine = new QuizEngine({
      questions:   lesson.quizQuestions,
      lessonId:    lesson.id,
      lessonTitle: lesson.title,
      lessonColor: lesson.color,
      onComplete:  (result) => {
        markPhase('phaseQuiz', 'done');
        renderResult(lesson, result);
      },
    });
    engine.start();
  }

  // VideoPlayer başlat
  const player = new VideoPlayer({
    videoEl,
    lesson,
    onVideoEnd: startQuiz,
  });

  // Konuya tıklandığında videoyu otomatik başlat
  videoEl.addEventListener('canplay', () => {
    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Tarayıcı otomatik sesli oynatmaya izin vermezse sessiz başlatıp kullanıcıya oynat
        videoEl.muted = true;
        videoEl.play().catch(e => console.log('Autoplay engellendi:', e));
      });
    }
  }, { once: true });

  // Demo modu butonu (video yoksa)
  const demoBtn = document.getElementById('demoModeBtn');
  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      // Demo: video yokken direkt quiz'e atla
      document.getElementById('noVideoPlaceholder').classList.add('hidden');

      // Demo video container'ı göster ama simüle et
      startQuiz();
    });
  }

  // Üst star sayacı
  const prog = getProgress();
  const totalStars = Object.values(prog).reduce((s, l) => s + (l.stars || 0), 0);
  const starEl = document.getElementById('starCount');
  if (starEl) starEl.textContent = totalStars;
}

init();
