const app = document.querySelector('#app');
const screens = [...document.querySelectorAll('.screen')];
const navDots = [...document.querySelectorAll('.progress-nav button')];
const nextButtons = [...document.querySelectorAll('[data-next]')];
const emotionGrid = document.querySelector('#emotionGrid');
const emotionGarden = document.querySelector('#emotionGarden');
const recordTip = document.querySelector('#recordTip');
const scentChoices = document.querySelector('#scentChoices');
const scentScene = document.querySelector('#scentScene');
const dropZone = document.querySelector('#dropZone');
const mixHint = document.querySelector('#mixHint');
const ingredientTray = document.querySelector('#ingredientTray');
const finishMixBtn = document.querySelector('#finishMixBtn');
const copyShareBtn = document.querySelector('#copyShareBtn');
const restartBtn = document.querySelector('#restartBtn');
const copyTip = document.querySelector('#copyTip');

const personaNodes = {
  name: document.querySelector('#personaName'),
  desc: document.querySelector('#personaDesc'),
  scent: document.querySelector('#personaScent'),
  tag: document.querySelector('#personaTag'),
  product: document.querySelector('#personaProduct'),
  bloom: document.querySelector('#personaBloom'),
  posterName: document.querySelector('#posterName'),
  posterCopy: document.querySelector('#posterCopy'),
  posterMood: document.querySelector('#posterMood'),
  posterNotes: document.querySelector('#posterNotes'),
};

const state = {
  screen: 0,
  unlocked: 0,
  emotion: null,
  scent: null,
  notes: [],
  persona: null,
};

const emotions = {
  anxious: { label: '焦虑之花', className: 'mood-anxious', text: '你的情绪正在被记录：焦虑之花收拢光线，等待被温柔舒展。' },
  friction: { label: '内耗之藤', className: 'mood-friction', text: '你的情绪正在被记录：内耗之藤停止缠绕，开始向光松开。' },
  pressure: { label: '压力之叶', className: 'mood-pressure', text: '你的情绪正在被记录：压力之叶落入土壤，转化为新的养分。' },
  lonely: { label: '孤独之花', className: 'mood-lonely', text: '你的情绪正在被记录：孤独之花亮起微光，正在等待回应。' },
  healing: { label: '治愈之芽', className: 'mood-healing', text: '你的情绪正在被记录：治愈之芽轻轻舒展，准备重新生长。' },
};

const scents = {
  rain: { label: '雨后花园', color: '#73a889', copy: '潮湿花瓣与绿叶清气，像把心事交给一场雨。' },
  shirt: { label: '阳光白衬衫', color: '#d7b462', copy: '晒过棉布的清透皂感，适合重新拥抱日常。' },
  wood: { label: '深夜木质香', color: '#9a7456', copy: '安定、低语、余温悠长，把疲惫安放下来。' },
  morning: { label: '清晨花园', color: '#65ad7c', copy: '露珠、嫩芽与第一束光，给生活一个轻盈重启。' },
  hug: { label: '被拥抱后的温度', color: '#d79aa1', copy: '柔软织物里的安心感，让情绪被稳稳接住。' },
};

const noteLabels = {
  iris: '白鸢尾',
  magnolia: '白兰',
  tuberose: '晚香玉',
  woody: '木质香调',
};

const personas = {
  anxious: { name: '雾光舒展者', tag: '焦虑松绑 / 轻雾呼吸', product: '超能植愈香氛洗衣液 · 清新植萃香', color: '#c9859a' },
  friction: { name: '藤蔓松弛者', tag: '内耗暂停 / 低压自洽', product: '超能植愈香氛洗衣液 · 亲肤柔护香', color: '#687d55' },
  pressure: { name: '绿叶复原者', tag: '压力释放 / 干净重启', product: '超能植愈香氛洗衣液 · 长效留香香', color: '#5e7f91' },
  lonely: { name: '月光拥抱者', tag: '孤独安放 / 温柔陪伴', product: '超能植愈香氛洗衣液 · 温暖治愈香', color: '#7b6f9f' },
  healing: { name: '晨露新生者', tag: '自我疗愈 / 植物新生', product: '超能植愈香氛洗衣液 · 天然净护香', color: '#61a976' },
};

function goToScreen(index) {
  const safeIndex = Math.max(0, Math.min(index, screens.length - 1));
  state.screen = safeIndex;
  state.unlocked = Math.max(state.unlocked, safeIndex);
  screens.forEach((screen, screenIndex) => screen.classList.toggle('is-active', screenIndex === safeIndex));
  navDots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === safeIndex));
}

function moveNext() {
  goToScreen(state.screen + 1);
}

function setMood(emotionKey) {
  Object.values(emotions).forEach((emotion) => app.classList.remove(emotion.className));
  app.classList.add(emotions[emotionKey].className);
}

function chooseEmotion(button) {
  const emotionKey = button.dataset.emotion;
  state.emotion = emotionKey;
  setMood(emotionKey);
  [...emotionGrid.children].forEach((card) => card.classList.toggle('is-selected', card === button));
  emotionGarden.classList.add('has-emotion');
  recordTip.textContent = emotions[emotionKey].text;

  window.setTimeout(() => {
    recordTip.textContent = '花瓣正在聚集，植物世界已经感知你的状态。';
  }, 420);
  window.setTimeout(moveNext, 1050);
}

function chooseScent(button) {
  const scentKey = button.dataset.scent;
  const scent = scents[scentKey];
  state.scent = scentKey;
  [...scentChoices.children].forEach((choice) => choice.classList.toggle('is-selected', choice === button));
  scentScene.style.setProperty('--mood', scent.color);
  button.querySelector('span').textContent = scent.copy;
  window.setTimeout(moveNext, 850);
}

function addNote(noteKey) {
  if (state.notes.includes(noteKey)) return;
  state.notes.push(noteKey);
  const ingredient = ingredientTray.querySelector(`[data-note="${noteKey}"]`);
  ingredient?.classList.add('is-added');
  dropZone.classList.add('has-mix');

  const labels = state.notes.map((note) => noteLabels[note]).join(' / ');
  mixHint.textContent = state.notes.length < 2 ? `已加入 ${labels}，再加入一种植物香调` : `已融合：${labels}`;
  finishMixBtn.disabled = state.notes.length < 2;
  finishMixBtn.classList.toggle('is-disabled', state.notes.length < 2);
}

function buildPersona() {
  const emotion = state.emotion || 'healing';
  const scent = state.scent || 'morning';
  const noteNames = state.notes.length ? state.notes.map((note) => noteLabels[note]) : ['白鸢尾', '白兰'];
  const base = personas[emotion];
  const scentName = scents[scent].label;
  const primaryNote = noteNames[0];

  state.persona = {
    ...base,
    scentText: `${scentName} × ${noteNames.join(' / ')}`,
    desc: `你适合把${emotions[emotion].label.replace('之', '')}交给${scentName}，让${primaryNote}把生活重新洗回柔软。`,
    posterCopy: `我的植愈香氛人格是「${base.name}」：${scents[scent].copy}`,
  };

  personaNodes.name.textContent = state.persona.name;
  personaNodes.desc.textContent = state.persona.desc;
  personaNodes.scent.textContent = state.persona.scentText;
  personaNodes.tag.textContent = state.persona.tag;
  personaNodes.product.textContent = state.persona.product;
  personaNodes.posterName.textContent = state.persona.name;
  personaNodes.posterCopy.textContent = state.persona.posterCopy;
  personaNodes.posterMood.textContent = `情绪植物：${emotions[emotion].label}`;
  personaNodes.posterNotes.textContent = `专属香调：${noteNames.join(' / ')}`;
  personaNodes.bloom.style.setProperty('--mood', state.persona.color);
  app.style.setProperty('--mood', state.persona.color);
}

function resetExperience() {
  state.screen = 0;
  state.unlocked = 0;
  state.emotion = null;
  state.scent = null;
  state.notes = [];
  state.persona = null;
  Object.values(emotions).forEach((emotion) => app.classList.remove(emotion.className));
  app.style.removeProperty('--mood');
  [...emotionGrid.children].forEach((card) => card.classList.remove('is-selected'));
  [...scentChoices.children].forEach((choice) => choice.classList.remove('is-selected'));
  [...ingredientTray.children].forEach((ingredient) => ingredient.classList.remove('is-added'));
  dropZone.classList.remove('has-mix');
  mixHint.textContent = '至少加入 2 种植物香调';
  finishMixBtn.disabled = true;
  finishMixBtn.classList.add('is-disabled');
  recordTip.textContent = '选择后，植物花园会记录你的情绪。';
  copyTip.textContent = '长按海报保存，分享你的植物疗愈人格。';
  goToScreen(0);
}

nextButtons.forEach((button) => button.addEventListener('click', moveNext));

emotionGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-emotion]');
  if (button) chooseEmotion(button);
});

scentChoices.addEventListener('click', (event) => {
  const button = event.target.closest('[data-scent]');
  if (button) chooseScent(button);
});

ingredientTray.addEventListener('click', (event) => {
  const ingredient = event.target.closest('[data-note]');
  if (ingredient) addNote(ingredient.dataset.note);
});

ingredientTray.addEventListener('dragstart', (event) => {
  const ingredient = event.target.closest('[data-note]');
  if (ingredient) event.dataTransfer.setData('text/plain', ingredient.dataset.note);
});

dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropZone.classList.add('is-over');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('is-over'));

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropZone.classList.remove('is-over');
  addNote(event.dataTransfer.getData('text/plain'));
});

finishMixBtn.addEventListener('click', () => {
  buildPersona();
  moveNext();
});

copyShareBtn.addEventListener('click', () => {
  const text = state.persona?.posterCopy || '我的植愈香氛疗愈海报已生成，快来开启天然香气疗愈之旅。';
  copyTip.textContent = `分享文案：${text}`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => {
        copyTip.textContent = `已复制分享文案：${text}`;
      })
      .catch(() => {
        copyTip.textContent = `分享文案：${text}`;
      });
  }
});

restartBtn.addEventListener('click', resetExperience);

navDots.forEach((dot) => {
  dot.addEventListener('click', () => {
    const target = Number(dot.dataset.goto);
    if (target <= state.unlocked) goToScreen(target);
  });
});
