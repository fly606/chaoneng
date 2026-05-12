const panels = [...document.querySelectorAll('.panel')];
const dots = [...document.querySelectorAll('.dot')];
const startBtn = document.querySelector('#startBtn');
const replayBtn = document.querySelector('#replayBtn');
const leafCards = [...document.querySelectorAll('.plant-card')];
const energyBar = document.querySelector('#energyBar');
const energyText = document.querySelector('#energyText');
const scentRange = document.querySelector('#scentRange');
const scentName = document.querySelector('#scentName');
const scentDesc = document.querySelector('#scentDesc');
const resultCopy = document.querySelector('#resultCopy');
const scoreValue = document.querySelector('#scoreValue');

const scents = [
  { name: '晨露绿意', desc: '适合通勤衬衫，像清晨花园一样清透。', score: 92 },
  { name: '白茶柔雾', desc: '适合贴身衣物，轻柔干净，带来被拥抱的安心感。', score: 95 },
  { name: '铃兰花径', desc: '适合连衣裙与床品，洗后留下温柔花香。', score: 96 },
  { name: '木质暖阳', desc: '适合外套与毛巾，干爽温暖，香气更有层次。', score: 94 },
];

let currentPanel = 0;
let touchStartY = 0;

function goToPanel(index) {
  currentPanel = Math.max(0, Math.min(index, panels.length - 1));
  panels.forEach((panel, panelIndex) => panel.classList.toggle('is-active', panelIndex === currentPanel));
  dots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === currentPanel));
}

function updateEnergy() {
  const collected = document.querySelectorAll('.plant-card.is-collected').length;
  energyBar.style.width = `${(collected / leafCards.length) * 100}%`;
  energyText.textContent = `${collected}/${leafCards.length}`;

  if (collected === leafCards.length) {
    window.setTimeout(() => goToPanel(2), 500);
  }
}

function updateScent(index) {
  const scent = scents[index];
  scentName.textContent = scent.name;
  scentDesc.textContent = scent.desc;
  scoreValue.textContent = scent.score;
  resultCopy.textContent = `洁净力、柔护力与留香力已被唤醒，今天的衣物适合“${scent.name}”。`;
}

startBtn.addEventListener('click', () => goToPanel(1));
replayBtn.addEventListener('click', () => {
  leafCards.forEach((card) => card.classList.remove('is-collected'));
  scentRange.value = 0;
  updateEnergy();
  updateScent(0);
  goToPanel(0);
});

dots.forEach((dot) => {
  dot.addEventListener('click', () => goToPanel(Number(dot.dataset.target)));
});

leafCards.forEach((card) => {
  card.addEventListener('click', () => {
    card.classList.add('is-collected');
    card.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.04)' },
        { transform: 'scale(1)' },
      ],
      { duration: 320, easing: 'ease-out' },
    );
    updateEnergy();
  });
});

scentRange.addEventListener('input', (event) => updateScent(Number(event.target.value)));
scentRange.addEventListener('change', () => window.setTimeout(() => goToPanel(3), 360));

document.addEventListener('touchstart', (event) => {
  touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchend', (event) => {
  const touchEndY = event.changedTouches[0].clientY;
  if (touchStartY - touchEndY > 48) goToPanel(currentPanel + 1);
  if (touchEndY - touchStartY > 48) goToPanel(currentPanel - 1);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown' || event.key === 'PageDown') goToPanel(currentPanel + 1);
  if (event.key === 'ArrowUp' || event.key === 'PageUp') goToPanel(currentPanel - 1);
});

updateScent(0);
updateEnergy();
