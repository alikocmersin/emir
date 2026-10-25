/* ============================================================
   matematik-app.js — EmirLearn Matematik Orkestratörü
   "Ünite Adı ve Video" Standartı — 12-13 Dk Kapsamlı Master Videolar
   ============================================================ */

let currentUnit = null;

const READY_VIDEOS = {};

async function initMatematikPage() {
  let curriculum;

  if (window.MATEMATIK_LESSONS_DATA) {
    curriculum = window.MATEMATIK_LESSONS_DATA;
  } else {
    try {
      const res = await fetch('../data/matematik-lessons.json');
      curriculum = await res.json();
    } catch (err) {
      document.getElementById('unitsContainer').innerHTML =
        '<p style="color:#EF4444;padding:40px;text-align:center">⚠️ Matematik ders verisi yüklenemedi.</p>';
      return;
    }
  }

  updateHeaderStats(curriculum);
  renderUnits(curriculum.units);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDirectVideoModal();
  });
}

function updateHeaderStats(curriculum) {
  try {
    const progress = JSON.parse(localStorage.getItem('emirlearn_progress')) || {};
    const allLessons = curriculum.units.flatMap(u => u.lessons);
    const stars = allLessons.reduce((s, l) => s + (progress[l.id]?.stars || 0), 0);
    const starEl = document.getElementById('headerStarCount');
    if (starEl) starEl.textContent = stars;
  } catch (e) {}
}

function renderUnits(units) {
  const container = document.getElementById('unitsContainer');
  container.innerHTML = '';

  units.forEach((unit, uIdx) => {
    const unitNum = uIdx + 1;
    let cleanTitle = unit.title;
    if (cleanTitle.includes(':')) {
      const parts = cleanTitle.split(':');
      cleanTitle = `${unitNum}. Ünite : ${parts[1].trim()}`;
    } else {
      cleanTitle = `${unitNum}. Ünite : ${cleanTitle.trim()}`;
    }

    const topicsList = unit.lessons.map(l => l.title);
    const topicsSummary = topicsList.join(', ');
    const hasVideo = !!READY_VIDEOS[unitNum];
    const videoFile = READY_VIDEOS[unitNum] || '';
    const leadThumbnail = unit.lessons[0]?.thumbnail 
      ? `../${unit.lessons[0].thumbnail}` 
      : `../assets/thumbnails/matematik/topic_${unit.lessons[0]?.id || 1101}.jpg`;

    const unitCard = document.createElement('div');
    unitCard.className = 'unit-block';
    unitCard.style.cursor = 'pointer';

    unitCard.innerHTML = `
      <div class="unit-block-heading" style="margin-bottom:12px;">
        <span class="unit-number-tag">ÜNİTE ${unitNum}</span>
        <h2 class="unit-title-text">${cleanTitle}</h2>
        <span class="unit-count-text">⏱️ 12-13 Dk Kapsamlı Anlatım</span>
      </div>

      <p style="color:#94A3B8; font-size:14px; margin-bottom:16px; line-height:1.5; font-weight:600;">
        <strong>Bu videoda öğrenilecek konular:</strong> ${topicsSummary}
      </p>

      <div class="topic-card" style="width:100%; max-width:760px; margin:0 auto;" tabindex="0" role="button" title="${cleanTitle} - Videoyu İzle">
        <div class="topic-image-container" style="aspect-ratio:16/9; width:100%; border-radius:14px; overflow:hidden; position:relative;">
          <img src="${leadThumbnail}" alt="${cleanTitle}" class="topic-thumb" loading="lazy"
               style="width:100%; height:100%; object-fit:cover;"
               onerror="this.src='../assets/thumbnails/matematik/topic_1101.jpg'" />

          ${hasVideo 
            ? '<span class="video-ready-badge" style="position:absolute; top:12px; left:12px; z-index:2; background:#10B981; color:#fff; padding:4px 10px; border-radius:8px; font-weight:900; font-size:12px;">🎬 Master Video Hazır</span>' 
            : '<span class="video-ready-badge" style="position:absolute; top:12px; left:12px; z-index:2; background:rgba(15,23,42,0.85); color:#FBBF24; padding:4px 10px; border-radius:8px; font-weight:900; font-size:12px; border:1px solid rgba(251,191,36,0.4);">⏳ 12-13 Dk Hazırlanıyor</span>'}

          <div class="topic-play-overlay">
            <div class="play-circle-btn">▶</div>
            <span class="play-text-hint">${hasVideo ? 'Kapsamlı Videoyu Aç' : 'Üniteyi İncele'}</span>
          </div>

          <span class="topic-duration-pill" style="position:absolute; bottom:12px; right:12px; z-index:2;">⏱️ 12-13 Dk</span>
        </div>
      </div>
    `;

    unitCard.addEventListener('click', () => {
      openUnitVideoModal({
        unitNum,
        title: cleanTitle,
        hasVideo,
        videoFile,
        topicsSummary,
        topicCount: unit.lessons.length,
        firstLessonId: unit.lessons[0]?.id
      });
    });

    unitCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openUnitVideoModal({
          unitNum,
          title: cleanTitle,
          hasVideo,
          videoFile,
          topicsSummary,
          topicCount: unit.lessons.length,
          firstLessonId: unit.lessons[0]?.id
        });
      }
    });

    container.appendChild(unitCard);
  });
}

function openUnitVideoModal(unitInfo) {
  currentUnit = unitInfo;
  const modal = document.getElementById('directVideoModal');
  const unitTag = document.getElementById('cinemaUnitTag');
  const title = document.getElementById('cinemaLessonTitle');
  const video = document.getElementById('modalVideoElement');
  const source = document.getElementById('modalVideoSource');
  const videoBox = document.getElementById('cinemaVideoBox');
  const pendingBox = document.getElementById('cinemaPendingBox');
  const pendingText = document.getElementById('pendingText');
  const durationBadge = document.getElementById('cinemaDurationBadge');
  const descText = document.getElementById('cinemaDescText');
  const goTestBtn = document.getElementById('cinemaGoTestBtn');

  if (!modal) return;

  unitTag.textContent = `${unitInfo.unitNum}. Ünite`;
  title.textContent = unitInfo.title;
  if (durationBadge) durationBadge.textContent = '⏱️ 12-13 Dk';
  if (descText) descText.textContent = unitInfo.topicsSummary;

  if (goTestBtn && unitInfo.firstLessonId) {
    goTestBtn.style.display = 'inline-flex';
    goTestBtn.onclick = () => {
      closeDirectVideoModal();
      window.location.href = `../lesson.html?id=${unitInfo.firstLessonId}`;
    };
  }

  if (unitInfo.hasVideo && unitInfo.videoFile) {
    pendingBox.style.display = 'none';
    videoBox.style.display = 'flex';
    source.src = unitInfo.videoFile;
    video.load();
    const p = video.play();
    if (p !== undefined) p.catch(() => {});
  } else {
    video.pause();
    videoBox.style.display = 'none';
    pendingBox.style.display = 'flex';
    if (pendingText) {
      pendingText.innerHTML = `
        <strong>${unitInfo.title}</strong> için 12-13 dakikalık kapsamlı master video anlatımı hazırlanıyor.<br/>
        Bu video ünitedeki ${unitInfo.topicCount} konunun tamamını kapsayacak şekilde tek parça halinde oluşturulacaktır.
      `;
    }
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeDirectVideoModal() {
  const modal = document.getElementById('directVideoModal');
  const video = document.getElementById('modalVideoElement');
  const source = document.getElementById('modalVideoSource');

  if (!modal || modal.style.display === 'none') return;

  if (video) {
    video.pause();
    video.currentTime = 0;
  }
  if (source) source.src = '';

  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function handleModalBackdropClick(event) {
  if (event.target.id === 'directVideoModal') {
    closeDirectVideoModal();
  }
}

document.addEventListener('DOMContentLoaded', initMatematikPage);
