/* ============================================================
   player.js — İnteraktif Video Oynatıcı
   HTML5 video + özel kontroller + video-içi sorular
   ============================================================ */

class VideoPlayer {
  constructor({ videoEl, lesson, onVideoEnd }) {
    this.video     = videoEl;
    this.lesson    = lesson;
    this.onVideoEnd = onVideoEnd;

    // Video içi sorular (zamanla sıralı)
    this.ivQuestions = [...(lesson.inVideoQuestions || [])].sort((a, b) => a.time - b.time);
    this.answeredTimes = new Set();
    this.isAnswering = false;

    // DOM referansları
    this.container      = document.getElementById('videoContainer');
    this.overlay        = document.getElementById('videoOverlay');
    this.ivqBox         = document.getElementById('inVideoQuestion');
    this.playBtn        = document.getElementById('playBtn');
    this.muteBtn        = document.getElementById('muteBtn');
    this.progressBar    = document.getElementById('progressBar');
    this.progressBgBar  = document.getElementById('progressBarContainer');
    this.progressMarkers= document.getElementById('progressMarkers');
    this.timeDisplay    = document.getElementById('timeDisplay');
    this.volumeSlider   = document.getElementById('volumeSlider');
    this.fullscreenBtn  = document.getElementById('fullscreenBtn');
    this.startQuizBar   = document.getElementById('startQuizBar');
    this.startQuizBtn   = document.getElementById('startQuizBtn');

    this._init();
  }

  _init() {
    const video = this.video;

    // Video olayları
    video.addEventListener('timeupdate',  () => this._onTimeUpdate());
    video.addEventListener('loadedmetadata', () => this._onMetadata());
    video.addEventListener('play',        () => { this.playBtn.textContent = '⏸'; });
    video.addEventListener('pause',       () => { this.playBtn.textContent = '▶'; });
    video.addEventListener('ended',       () => this._onEnded());
    video.addEventListener('volumechange',() => this._updateMuteBtn());

    // Kontrol butonları
    this.playBtn.addEventListener('click', () => this._togglePlay());
    this.muteBtn.addEventListener('click', () => { video.muted = !video.muted; });
    this.volumeSlider.addEventListener('input', e => { video.volume = e.target.value; });
    this.fullscreenBtn.addEventListener('click', () => this._toggleFullscreen());

    // İlerleme çubuğuna tıklama ve sürükleme (Hassas Seek)
    let isSeeking = false;
    const executeSeek = (clientX) => {
      if (this.isAnswering) return;
      const rect = this.progressBgBar.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const targetTime = pct * (this.video.duration || 0);
      if (!isNaN(targetTime)) {
        this.video.currentTime = targetTime;
        this.progressBar.style.width = (pct * 100) + '%';
        this.timeDisplay.textContent = `${this._fmt(targetTime)} / ${this._fmt(this.video.duration || 0)}`;
      }
    };

    this.progressBgBar.addEventListener('pointerdown', (e) => {
      isSeeking = true;
      try { this.progressBgBar.setPointerCapture(e.pointerId); } catch (_) {}
      executeSeek(e.clientX);
    });

    this.progressBgBar.addEventListener('pointermove', (e) => {
      if (isSeeking) {
        executeSeek(e.clientX);
      }
    });

    const stopSeeking = (e) => {
      if (isSeeking) {
        isSeeking = false;
        try { this.progressBgBar.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    };

    this.progressBgBar.addEventListener('pointerup', stopSeeking);
    this.progressBgBar.addEventListener('pointercancel', stopSeeking);

    // Quiz başlat butonu
    if (this.startQuizBtn) {
      this.startQuizBtn.addEventListener('click', () => {
        if (typeof this.onVideoEnd === 'function') this.onVideoEnd();
      });
    }

    // Video içi soru işaretlerini çiz
    this._drawMarkers();

    // Video yoksa sessizce bekle
    video.addEventListener('error', () => {
      console.warn('Video yüklenemedi. Demo modu açılıyor.');
    });
  }

  _onMetadata() {
    this._drawMarkers(); // Süre bilinince yeniden çiz
  }

  _onTimeUpdate() {
    if (this.isAnswering) return;

    const video = this.video;
    const cur   = video.currentTime;
    const dur   = video.duration || 1;

    // İlerleme çubuğu
    const pct = (cur / dur) * 100;
    this.progressBar.style.width = pct + '%';

    // Süre göstergesi
    this.timeDisplay.textContent = `${this._fmt(cur)} / ${this._fmt(dur)}`;

    // Video içi soru tetikleyici
    const triggered = this.ivQuestions.find(q =>
      Math.floor(cur) >= q.time && !this.answeredTimes.has(q.time)
    );

    if (triggered) {
      video.pause();
      this.isAnswering = true;
      this.answeredTimes.add(triggered.time);
      this._showInVideoQuestion(triggered);
    }
  }

  _onEnded() {
    this.playBtn.textContent = '▶';
    // Quiz başlat çubuğunu göster
    if (this.startQuizBar) this.startQuizBar.classList.remove('hidden');
    this.video.currentTime = this.video.duration;
  }

  _togglePlay() {
    if (this.isAnswering) return;
    if (this.video.paused) {
      this.video.play().catch(() => {});
    } else {
      this.video.pause();
    }
  }

  _seek(e) {
    if (this.isAnswering) return;
    const rect = this.progressBgBar.getBoundingClientRect();
    const clickX = e.clientX;
    const pct  = Math.max(0, Math.min(1, (clickX - rect.left) / rect.width));
    const targetTime = pct * (this.video.duration || 0);
    this.video.currentTime = targetTime;
    this.progressBar.style.width = (pct * 100) + '%';
  }

  _toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.container.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  _updateMuteBtn() {
    this.muteBtn.textContent = this.video.muted ? '🔇' : '🔊';
  }

  _drawMarkers() {
    if (!this.progressMarkers) return;
    this.progressMarkers.innerHTML = '';
    const dur = this.video.duration;
    if (!dur || isNaN(dur)) return;

    this.ivQuestions.forEach(q => {
      const pct = (q.time / dur) * 100;
      const marker = document.createElement('div');
      marker.className = 'progress-marker';
      marker.style.left = pct + '%';
      marker.title = `Soru: ${q.question.slice(0, 40)}...`;
      this.progressMarkers.appendChild(marker);
    });
  }

  _fmt(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // ── Video İçi Soru ────────────────────────────────────────
  _showInVideoQuestion(q) {
    this.overlay.classList.remove('hidden');
    const box = this.ivqBox;

    // Öğretmen soruyu seslendirsin
    if (this.currentFeedbackAudio) {
      this.currentFeedbackAudio.pause();
      this.currentFeedbackAudio = null;
    }
    if (q.askAudio) {
      this.currentFeedbackAudio = new Audio(q.askAudio);
      this.currentFeedbackAudio.play().catch(e => console.log('Audio error:', e));
    }

    if (q.type === 'truefalse') {
      box.innerHTML = `
        <div class="ivq-badge">🤔 Emir, Sıra Sende!</div>
        <div class="ivq-question">${q.question}</div>
        <div class="ivq-tf-buttons">
          <button class="ivq-tf-btn true-btn"  data-val="true">✅ Doğru</button>
          <button class="ivq-tf-btn false-btn" data-val="false">❌ Yanlış</button>
        </div>
      `;
      box.querySelectorAll('.ivq-tf-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const chosen  = btn.dataset.val === 'true';
          const correct = q.correct === true;
          this._resolveIVQ(box, btn, chosen === correct, q,
            box.querySelectorAll('.ivq-tf-btn'), chosen ? 'true' : 'false', q.correct ? 'true' : 'false');
        });
      });
    } else {
      const letters = ['A', 'B', 'C', 'D'];
      box.innerHTML = `
        <div class="ivq-badge">🤔 Emir, Sıra Sende!</div>
        <div class="ivq-question">${q.question}</div>
        <div class="ivq-options">
          ${q.options.map((opt, i) => `
            <button class="ivq-option" data-idx="${i}">
              <strong>${letters[i]}.</strong> ${opt}
            </button>
          `).join('')}
        </div>
      `;
      box.querySelectorAll('.ivq-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx     = parseInt(btn.dataset.idx);
          const correct = idx === q.correct;
          const allBtns = box.querySelectorAll('.ivq-option');
          allBtns.forEach(b => b.disabled = true);
          btn.classList.add(correct ? 'correct' : 'wrong');
          allBtns[q.correct].classList.add('correct');
          this._showIVQFeedback(box, correct, q);
        });
      });
    }
  }

  _resolveIVQ(box, clickedBtn, correct, q, allBtns, chosenVal, correctVal) {
    allBtns.forEach(b => b.disabled = true);
    clickedBtn.classList.add(correct ? 'correct' : 'wrong');
    if (!correct) {
      // Doğru cevabı da yeşil olarak göster
      allBtns.forEach(b => {
        if (b.dataset.val === correctVal) b.classList.add('correct');
      });
    }
    this._showIVQFeedback(box, correct, q);
  }

  _showIVQFeedback(box, correct, q) {
    playSound(correct ? 'correct' : 'wrong');

    // Önceki ses varsa durdur
    if (this.currentFeedbackAudio) {
      this.currentFeedbackAudio.pause();
      this.currentFeedbackAudio = null;
    }

    // Öğretmenin sesli yanıtı: Doğruysa tebrik, yanlışsa açıklama/çözüm
    const audioPath = correct ? q.correctAudio : q.wrongAudio;
    let feedbackAudio = null;
    if (audioPath) {
      feedbackAudio = new Audio(audioPath);
      this.currentFeedbackAudio = feedbackAudio;
      feedbackAudio.play().catch(e => console.log('Audio error:', e));
    }

    const fb = document.createElement('div');
    fb.className = `ivq-feedback ${correct ? 'correct' : 'wrong'}`;
    fb.innerHTML = `
      <span>${correct ? '🎉' : '💡'}</span>
      <div>
        <strong style="font-size: 1.15rem; color: ${correct ? '#22c55e' : '#ef4444'};">
          ${correct ? '🌟 Harika! Doğru Bildin Emir!' : '🔍 Çözümü Dinleyelim!'}
        </strong><br/>
        <small style="font-size: 0.95rem; line-height: 1.4; display: block; margin-top: 4px;">${q.explanation}</small>
      </div>
    `;
    box.appendChild(fb);

    const continueBtn = document.createElement('button');
    continueBtn.className = 'ivq-continue-btn';
    continueBtn.textContent = '▶ Dersimize Devam Et';

    const resumeVideo = () => {
      if (this.currentFeedbackAudio) {
        this.currentFeedbackAudio.pause();
        this.currentFeedbackAudio = null;
      }
      this.overlay.classList.add('hidden');
      this.ivqBox.innerHTML = '';
      this.isAnswering = false;
      this.video.play().catch(() => {});
    };

    continueBtn.addEventListener('click', resumeVideo);
    box.appendChild(continueBtn);

    // Doğru cevap verildiğinde öğretmen tebrik edip ses bitince video otomatik devam etsin
    if (correct && feedbackAudio) {
      feedbackAudio.addEventListener('ended', () => {
        setTimeout(resumeVideo, 800);
      }, { once: true });
    }
  }

  // Dışarıdan çağrılabilir: Demo modda simüle et
  simulateEnd() {
    if (this.startQuizBar) this.startQuizBar.classList.remove('hidden');
  }
}

// ── Web Audio API ile Basit Ses Efektleri ─────────────────
function playSound(type) {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);       // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'wrong') {
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.15);
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'complete') {
      const notes = [523, 587, 659, 698, 784, 880, 988];
      notes.forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);
        o.start(ctx.currentTime + i * 0.08);
        o.stop(ctx.currentTime + i * 0.08 + 0.3);
      });
    }
  } catch (_) {
    // Ses API desteklenmiyorsa sessiz geç
  }
}

// Konfeti efekti
function launchConfetti(count = 30) {
  const emojis = ['🎉', '⭐', '🌟', '🎊', '✨', '🎈', '🏆'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left   = Math.random() * 100 + 'vw';
      el.style.top    = '-40px';
      el.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
      el.style.animationDuration = (1.5 + Math.random() * 2) + 's';
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, i * 60);
  }
}
