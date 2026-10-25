/* ============================================================
   quiz.js — Final Quiz Motoru
   5 soruluk karma test (çoktan seçmeli + doğru/yanlış)
   ============================================================ */

class QuizEngine {
  constructor({ questions, lessonId, lessonTitle, lessonColor, onComplete }) {
    this.questions   = this._shuffle([...questions]);
    this.lessonId    = lessonId;
    this.lessonTitle = lessonTitle;
    this.lessonColor = lessonColor;
    this.onComplete  = onComplete;

    this.current    = 0;
    this.score      = 0;
    this.answers    = []; // { correct: bool } sırasıyla

    // DOM
    this.progressBar    = document.getElementById('quizProgressBar');
    this.questionCounter= document.getElementById('questionCounter');
    this.liveScore      = document.getElementById('liveScore');
    this.questionCard   = document.getElementById('questionCard');
    this.questionNumber = document.getElementById('questionNumber');
    this.questionText   = document.getElementById('questionText');
    this.optionsGrid    = document.getElementById('optionsGrid');
    this.feedbackBox    = document.getElementById('feedbackBox');
    this.feedbackIcon   = document.getElementById('feedbackIcon');
    this.feedbackText   = document.getElementById('feedbackText');
    this.explanationText= document.getElementById('explanationText');
    this.nextBtn        = document.getElementById('nextBtn');

    this.nextBtn.addEventListener('click', () => this._nextQuestion());
  }

  start() {
    this._renderQuestion();
  }

  _renderQuestion() {
    const q     = this.questions[this.current];
    const total = this.questions.length;

    // Progress
    const pct = (this.current / total) * 100;
    this.progressBar.style.width = pct + '%';
    this.questionCounter.textContent = `Soru ${this.current + 1} / ${total}`;
    this.liveScore.textContent = this.score;

    // Soru numarası + metin
    this.questionNumber.textContent = this.current + 1;
    this.questionText.textContent   = q.question;

    // Feedback gizle
    this.feedbackBox.classList.add('hidden');
    this.feedbackBox.className = 'feedback-box hidden';
    this.nextBtn.classList.add('hidden');

    // Seçenekler
    this.optionsGrid.innerHTML = '';

    if (q.type === 'multiple') {
      this._renderMultiple(q);
    } else {
      this._renderTrueFalse(q);
    }

    // Kart animasyonu yenile
    this.questionCard.style.animation = 'none';
    requestAnimationFrame(() => {
      this.questionCard.style.animation = '';
    });
  }

  _renderMultiple(q) {
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `
        <span class="option-letter">${letters[i]}</span>
        <span>${opt}</span>
      `;
      btn.addEventListener('click', () => this._selectMultiple(q, i, btn));
      this.optionsGrid.appendChild(btn);
    });
  }

  _renderTrueFalse(q) {
    const grid = document.createElement('div');
    grid.className = 'tf-grid';

    const trueBtn  = document.createElement('button');
    trueBtn.className = 'tf-btn true-btn';
    trueBtn.innerHTML = `<span class="tf-icon">✅</span><span>Doğru</span>`;

    const falseBtn = document.createElement('button');
    falseBtn.className = 'tf-btn false-btn';
    falseBtn.innerHTML = `<span class="tf-icon">❌</span><span>Yanlış</span>`;

    trueBtn.addEventListener('click',  () => this._selectTF(q, true,  trueBtn,  falseBtn));
    falseBtn.addEventListener('click', () => this._selectTF(q, false, falseBtn, trueBtn));

    grid.appendChild(trueBtn);
    grid.appendChild(falseBtn);
    this.optionsGrid.appendChild(grid);
  }

  _selectMultiple(q, idx, clickedBtn) {
    const allBtns = this.optionsGrid.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);

    const isCorrect = idx === q.correct;
    clickedBtn.classList.add(isCorrect ? 'correct' : 'wrong');
    allBtns[q.correct].classList.add('correct');

    this._showFeedback(isCorrect, q.explanation);
  }

  _selectTF(q, chosen, clickedBtn, otherBtn) {
    clickedBtn.disabled = true;
    otherBtn.disabled   = true;

    const isCorrect = chosen === q.correct;
    clickedBtn.classList.add(isCorrect ? 'correct' : 'wrong');
    if (!isCorrect) otherBtn.classList.add('correct');

    this._showFeedback(isCorrect, q.explanation);
  }

  _showFeedback(isCorrect, explanation) {
    if (isCorrect) {
      this.score++;
      this.liveScore.textContent = this.score;
    }
    this.answers.push({ correct: isCorrect });

    playSound(isCorrect ? 'correct' : 'wrong');

    const messages = isCorrect
      ? ['🎉 Harika! Doğru cevap!', '🌟 Süper! Bravo!', '✅ Evet, doğru!', '🎊 Mükemmel!']
      : ['😅 Neredeyse!', '💪 Bir sonrakinde!', '🤔 Yanlış, ama öğrendik!', '❌ Bu sefer olmadı!'];

    const msg = messages[Math.floor(Math.random() * messages.length)];

    this.feedbackBox.className = `feedback-box ${isCorrect ? 'correct-fb' : 'wrong-fb'}`;
    this.feedbackBox.classList.remove('hidden');
    this.feedbackIcon.textContent    = isCorrect ? '🎉' : '😅';
    this.feedbackText.textContent    = msg;
    this.explanationText.textContent = explanation;

    this.nextBtn.classList.remove('hidden');

    const last = this.current === this.questions.length - 1;
    this.nextBtn.textContent = last ? '🏆 Sonuçları Gör!' : 'Sonraki Soru →';
  }

  _nextQuestion() {
    this.current++;
    if (this.current >= this.questions.length) {
      this._finish();
    } else {
      this._renderQuestion();
    }
  }

  _finish() {
    const total = this.questions.length;
    const pct   = (this.score / total) * 100;

    // Progress çubuğunu doldur
    this.progressBar.style.width = '100%';

    // Callback
    if (typeof this.onComplete === 'function') {
      this.onComplete({
        score:   this.score,
        total,
        pct,
        answers: this.answers,
      });
    }
  }

  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
