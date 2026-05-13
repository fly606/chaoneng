const screens = [...document.querySelectorAll('.screen')];
const dots = [...document.querySelectorAll('.dots button')];
const startBtn = document.querySelector('#startBtn');
const backBtn = document.querySelector('#backBtn');
const optionsWrap = document.querySelector('#options');
const questionIndex = document.querySelector('#questionIndex');
const questionKicker = document.querySelector('#questionKicker');
const questionTitle = document.querySelector('#questionTitle');
const quizProgress = document.querySelector('#quizProgress');
const restartBtn = document.querySelector('#restartBtn');
const shareBtn = document.querySelector('#shareBtn');
const shareCopy = document.querySelector('#shareCopy');
const poster = document.querySelector('#poster');

const resultNodes = {
  personaName: document.querySelector('#personaName'),
  healingCopy: document.querySelector('#healingCopy'),
  scentProfile: document.querySelector('#scentProfile'),
  animationName: document.querySelector('#animationName'),
  productRecommendation: document.querySelector('#productRecommendation'),
};

const questions = [
  {
    kicker: 'RECENT MOOD',
    title: '最近的你，更像哪一种天气？',
    options: [
      { icon: '🌫️', title: '有点雾，但想慢慢放晴', desc: '需要被温柔地接住', type: 'dew' },
      { icon: '☀️', title: '阳光很好，只是有点累', desc: '想找回干净明亮的自己', type: 'tea' },
      { icon: '🌧️', title: '下过一场雨，心里更安静', desc: '喜欢被花香轻轻包围', type: 'lily' },
      { icon: '🌙', title: '夜色很深，想要一点安全感', desc: '偏爱沉稳温暖的气息', type: 'wood' },
    ],
  },
  {
    kicker: 'DRESSING HABIT',
    title: '你的衣柜，最常出现哪种状态？',
    options: [
      { icon: '👔', title: '通勤衬衫和基础款很多', desc: '想让日常闻起来更清爽', type: 'dew' },
      { icon: '🤍', title: '贴身衣物要柔软安心', desc: '干净感比浓香更重要', type: 'tea' },
      { icon: '👗', title: '喜欢有氛围感的裙装/床品', desc: '衣物也要有浪漫记忆点', type: 'lily' },
      { icon: '🧥', title: '外套、毛巾、家居服都要耐闻', desc: '希望香气有层次、有余温', type: 'wood' },
    ],
  },
  {
    kicker: 'IDEAL LIFE',
    title: '你最想把生活洗成什么样？',
    options: [
      { icon: '🌿', title: '像清晨植物园，轻盈醒来', desc: '把忙乱变成微风', type: 'dew' },
      { icon: '🍵', title: '像一杯白茶，清透自洽', desc: '少一点负担，多一点松弛', type: 'tea' },
      { icon: '🌸', title: '像花径散步，被美好包围', desc: '给自己一点仪式感', type: 'lily' },
      { icon: '🪵', title: '像木屋暖阳，稳定而温柔', desc: '把疲惫安放下来', type: 'wood' },
    ],
  },
  {
    kicker: 'SCENT SCENE',
    title: '哪一个气味场景最像你的理想周末？',
    options: [
      { icon: '💧', title: '露水打湿叶尖的花园清晨', desc: '干净、鲜活、重新开始', type: 'dew' },
      { icon: '🫖', title: '窗边白茶和晒过的棉布', desc: '柔和、亲肤、没有压迫感', type: 'tea' },
      { icon: '💐', title: '开满铃兰的午后小径', desc: '明亮、浪漫、轻盈扩散', type: 'lily' },
      { icon: '🕯️', title: '木质香气里的夜读时刻', desc: '安定、温暖、余香悠长', type: 'wood' },
    ],
  },
];

const personas = {
  dew: {
    name: '晨露松弛派',
    copy: '愿你把忙乱洗成清晨，把疲惫晾成微风。',
    scent: '晨露绿叶调',
    animation: '露珠扩散 · 绿叶舒展',
    product: '超能植愈香氛洗衣液 · 清新植萃香',
    color: '#72b98a',
  },
  tea: {
    name: '白茶自洽派',
    copy: '愿你把焦虑洗淡一点，让柔软重新贴近生活。',
    scent: '白茶柔雾调',
    animation: '白雾轻绕 · 棉感呼吸',
    product: '超能植愈香氛洗衣液 · 亲肤柔护香',
    color: '#c9b06b',
  },
  lily: {
    name: '铃兰浪漫派',
    copy: '愿你的衣角藏着花径，把平凡日子洗出微光。',
    scent: '铃兰花径调',
    animation: '花瓣盛放 · 香气流动',
    product: '超能植愈香氛洗衣液 · 长效留香香',
    color: '#e7a7b4',
  },
  wood: {
    name: '木质安定派',
    copy: '愿你把疲惫交给晚风，把自己抱回温暖里。',
    scent: '木质暖阳调',
    animation: '暖光浮现 · 木纹回旋',
    product: '超能植愈香氛洗衣液 · 温暖治愈香',
    color: '#9f7a55',
  },
};

let activeScreen = 0;
let activeQuestion = 0;
const answers = [];

function goToScreen(index) {
  activeScreen = index;
  screens.forEach((screen, screenIndex) => screen.classList.toggle('is-active', screenIndex === index));
  dots.forEach((dot) => dot.classList.toggle('is-active', Number(dot.dataset.goto) === index));
}

function renderQuestion() {
  const question = questions[activeQuestion];
  questionIndex.textContent = String(activeQuestion + 1).padStart(2, '0');
  questionKicker.textContent = question.kicker;
  questionTitle.textContent = question.title;
  quizProgress.style.width = `${((activeQuestion + 1) / questions.length) * 100}%`;
  backBtn.hidden = activeQuestion === 0;
  optionsWrap.innerHTML = question.options.map((option) => `
    <button class="option" type="button" data-type="${option.type}">
      <i>${option.icon}</i>
      <span><strong>${option.title}</strong>${option.desc}</span>
    </button>
  `).join('');
}

function chooseOption(type) {
  answers[activeQuestion] = type;

  if (activeQuestion < questions.length - 1) {
    activeQuestion += 1;
    renderQuestion();
    return;
  }

  goToScreen(2);
  window.setTimeout(showResult, 1400);
}

function getPersona() {
  const tally = answers.reduce((result, type) => {
    result[type] = (result[type] || 0) + 1;
    return result;
  }, {});

  return Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] || 'dew';
}

function showResult() {
  const persona = personas[getPersona()];
  resultNodes.personaName.textContent = persona.name;
  resultNodes.healingCopy.textContent = persona.copy;
  resultNodes.scentProfile.textContent = persona.scent;
  resultNodes.animationName.textContent = persona.animation;
  resultNodes.productRecommendation.textContent = persona.product;
  poster.style.setProperty('--persona-color', persona.color);
  shareCopy.textContent = '';
  goToScreen(3);
}

function restart() {
  activeQuestion = 0;
  answers.length = 0;
  renderQuestion();
  goToScreen(0);
}

startBtn.addEventListener('click', () => {
  renderQuestion();
  goToScreen(1);
});

optionsWrap.addEventListener('click', (event) => {
  const option = event.target.closest('.option');
  if (option) chooseOption(option.dataset.type);
});

backBtn.addEventListener('click', () => {
  activeQuestion = Math.max(0, activeQuestion - 1);
  renderQuestion();
});

restartBtn.addEventListener('click', restart);

shareBtn.addEventListener('click', async () => {
  const text = `我的气味人格是「${resultNodes.personaName.textContent}」：${resultNodes.healingCopy.textContent}`;
  shareCopy.textContent = `分享文案：${text}`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => {
        shareCopy.textContent = `已复制分享文案：${text}`;
      })
      .catch(() => {
        shareCopy.textContent = `分享文案：${text}`;
      });
  }
});

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    const target = Number(dot.dataset.goto);
    if (target === 1 && optionsWrap.children.length === 0) renderQuestion();
    if (target === 3 && answers.length < questions.length) return;
    goToScreen(target);
  });
});

renderQuestion();
