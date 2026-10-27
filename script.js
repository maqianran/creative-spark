/* Creative Spark: the interaction logic lives here. */

const form = document.querySelector('#prompt-form');
const formMessage = document.querySelector('#form-message');
const emptyState = document.querySelector('#empty-state');
const resultCard = document.querySelector('#result-card');
const resultNumber = document.querySelector('#result-number');
const resultFormat = document.querySelector('#result-format');
const resultMood = document.querySelector('#result-mood');
const resultTitle = document.querySelector('#result-title');
const resultDescription = document.querySelector('#result-description');
const resultTime = document.querySelector('#result-time');
const resultTip = document.querySelector('#result-tip').querySelector('span:last-child');
const copyMessage = document.querySelector('#copy-message');
const copyButton = document.querySelector('#copy-button');
const redrawButton = document.querySelector('#redraw-button');
const groups = {
  format: document.querySelector('[data-group="format"]'),
  mood: document.querySelector('[data-group="mood"]'),
  time: document.querySelector('[data-group="time"]')
};

const labels = {
  format: { video: '短视频', photo: '摄影', poster: '海报设计' },
  mood: { retro: '复古感', soft: '治愈系', mystery: '悬疑感' }
};

const prompts = {
  video: {
    retro: [
      { title: '给平凡的一天加一层旧滤镜。', description: '用 3 个镜头记录一个普通瞬间。尝试暖色光线、轻微颗粒感和有年代感的构图，让今天看起来像一段旧录像。', tip: '试试固定机位，让光线和细节来讲故事。' },
      { title: '拍一支来自旧时代的广告。', description: '从桌上的任意一件小物品出发，为它拍一支复古广告。让产品、字幕和转场都有一点老电影气质。', tip: '限制自己只用一种字体和两种主色。' },
      { title: '把一首老歌变成视觉日记。', description: '选一段你喜欢的音乐，用 3 个生活片段回应它的情绪。画面不必复杂，节奏和细节才是主角。', tip: '先选音乐片段，再按照节拍决定镜头长度。' }
    ],
    soft: [
      { title: '收集三个今天的小确幸。', description: '拍下三个平时容易忽略的温柔瞬间，比如阳光落在桌面、热饮冒出的白雾，或一扇半开的窗。把它们剪成一段轻柔短片。', tip: '留一点环境声，让画面更有生活气息。' },
      { title: '让一件小事慢下来。', description: '选择一个日常动作，用慢节奏镜头重新观察它。关注手部动作、光影和声音，让简单的事情也值得被看见。', tip: '每个镜头开始前，先停留一秒再行动。' },
      { title: '拍一封没有文字的感谢信。', description: '用 3 个画面表达对某个人或某件事的感谢，不出现直接的文字说明，让观众从细节里感受到温度。', tip: '用重复出现的颜色或物件串联三个镜头。' }
    ],
    mystery: [
      { title: '拍一个不该出现在那里的东西。', description: '选择一个熟悉的空间，把一件小物品放在不寻常的位置。用镜头顺序、留白和声音，让观众慢慢发现异常。', tip: '先给环境一个平静的镜头，再揭示线索。' },
      { title: '让影子成为主角。', description: '不直接拍摄人物，只用影子、局部和遮挡讲述一个小故事。结尾留下一条线索，让观众自行猜测发生了什么。', tip: '避免一次解释所有信息，留一个未解之谜。' },
      { title: '同一个场景，两个答案。', description: '拍摄同一个地方的两个版本：第一个看起来很普通，第二个通过一个细节让它变得可疑。', tip: '两个版本尽量保持相同构图，突出细节变化。' }
    ]
  },
  photo: {
    retro: [
      { title: '拍一张未来的旧照片。', description: '在身边寻找一个有年代感的角落，利用自然光、暖色调和细节构图，拍出仿佛来自旧相册的一张照片。', tip: '降低画面里的颜色数量，让重点更鲜明。' },
      { title: '给一件旧物拍肖像。', description: '挑选一件有使用痕迹的小物件，把它当成肖像主角。让磨损、折痕和材质成为画面里的故事。', tip: '尝试侧光，它能让物体表面更有层次。' },
      { title: '找出日常里的复古色卡。', description: '拍摄 3 张照片，每张聚焦一种复古色彩。最后把它们排成一组小型视觉色卡。', tip: '拍摄前先观察背景，避免颜色互相抢戏。' }
    ],
    soft: [
      { title: '把安静拍成一张照片。', description: '寻找一个让你感到平静的角落。通过柔和的光线、简单的构图和适当留白，让照片保留那一刻的呼吸感。', tip: '试着把主体放在画面边缘，给空间留点余地。' },
      { title: '拍下光线经过的地方。', description: '用照片记录光落在墙面、桌子或织物上的样子。连续拍 3 张，观察同一道光如何改变空间。', tip: '不必追求完美，先观察光的形状和方向。' },
      { title: '拍一组微小的温柔。', description: '寻找 3 个温柔的生活细节，例如一杯水、一本翻开的书或一片植物的叶子，组成一组照片。', tip: '保持相似的色调，让三张照片像同一篇日记。' }
    ],
    mystery: [
      { title: '让熟悉的地方变得陌生。', description: '拍摄一个每天都会经过的地方，但只保留局部、反射或遮挡。让观众无法立刻判断地点。', tip: '换一个比平时更低或更高的视角。' },
      { title: '拍摄一条视觉线索。', description: '选一个普通物件，把它拍得像故事中的关键证据。用背景、阴影和取景范围营造悬念。', tip: '让背景保持简单，给线索足够的视觉重量。' },
      { title: '一张照片，两种解读。', description: '构图时放入两个看似无关的元素，让它们之间形成一种模糊关系。照片不解释答案，只引导观众猜测。', tip: '按下快门前，检查画面里的每个元素是否都有作用。' }
    ]
  },
  poster: {
    retro: [
      { title: '为一家不存在的唱片店做海报。', description: '给虚构唱片店设计一张宣传海报。尝试粗体标题、复古配色和有限的图形元素，让作品带有旧印刷品的气质。', tip: '先确定一个主标题，再围绕它安排其他信息。' },
      { title: '重做一张旧电影海报。', description: '为一部虚构的老电影制作海报。只使用一个视觉主体、一个标题和一行辅助文字，练习信息层级。', tip: '让标题和主图争取注意力，但不要让它们互相打架。' },
      { title: '用三种颜色讲故事。', description: '为一个虚构的周末市集设计海报，只允许使用三种主色。通过形状、字体和留白表达复古氛围。', tip: '先用黑白布局检查信息层级，再加入颜色。' }
    ],
    soft: [
      { title: '设计一张给普通日子的明信片。', description: '把一个简单的生活瞬间变成海报，使用柔和颜色、轻量文字和充足留白，传达一点温柔。', tip: '试着只突出一个短句，让画面慢下来。' },
      { title: '给一杯热饮做一张小海报。', description: '为虚构饮品设计一张视觉海报。画面需要表达温暖，但不能只依赖杯子的照片，可以尝试抽象形状和字体。', tip: '用形状、曲线或字距表现温度和气氛。' },
      { title: '把一句鼓励变成视觉作品。', description: '选一句自己愿意相信的短句，为它设计一张海报。用构图和字重表现语气，不要堆叠太多装饰。', tip: '先把文字当作图形来排布，再补充装饰。' }
    ],
    mystery: [
      { title: '设计一张没有完整答案的海报。', description: '为一个虚构的悬疑短片设计海报。只透露一个关键线索，让观众想知道画面之外发生了什么。', tip: '隐藏一部分主体，比放入更多元素更有效。' },
      { title: '用留白制造一个疑问。', description: '制作一张由一个物件、一句短标题和大片留白组成的海报。让画面提出问题，而不是直接给出解释。', tip: '把标题放在不太寻常的位置，测试视觉张力。' },
      { title: '让排版藏着一条线索。', description: '设计一张活动海报，并在字距、对齐或文字遮挡里藏入一个小线索，让观众第二眼才发现。', tip: '确保重要信息仍然清晰可读，线索是惊喜而不是障碍。' }
    ]
  }
};

const timeTips = {
  5: '快速模式：先完成一个版本，不必追求完美。',
  15: '专注模式：留几分钟给构思，剩下的时间用来完成。',
  30: '探索模式：可以先试两个不同方向，再选一个完成。'
};

const state = { format: null, mood: null, time: null, lastPromptKey: null, currentPrompt: null, cardCount: 0 };

// Each choice button stores its value in state and receives a visible selected style.
Object.entries(groups).forEach(([groupName, groupElement]) => {
  groupElement.querySelectorAll('button[data-value]').forEach((button) => {
    button.addEventListener('click', () => {
      state[groupName] = button.dataset.value;
      groupElement.querySelectorAll('button[data-value]').forEach((otherButton) => {
        otherButton.setAttribute('aria-pressed', String(otherButton === button));
      });
      formMessage.textContent = '';
      copyMessage.textContent = '';
      copyMessage.classList.remove('error');
    });
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!state.format || !state.mood || !state.time) {
    const missing = [];
    if (!state.format) missing.push('创作形式');
    if (!state.mood) missing.push('氛围');
    if (!state.time) missing.push('时间');
    formMessage.textContent = `还差一步：请选择${missing.join('、')}，再来抽卡。`;
    return;
  }
  formMessage.textContent = '';
  drawPrompt();
});

function drawPrompt() {
  const choices = prompts[state.format][state.mood];
  const available = choices.filter((prompt) => prompt.title !== state.lastPromptKey);
  const pool = available.length > 0 ? available : choices;
  const prompt = pool[Math.floor(Math.random() * pool.length)];
  state.lastPromptKey = prompt.title;
  state.currentPrompt = prompt;
  state.cardCount += 1;

  resultNumber.textContent = `CARD ${String(state.cardCount).padStart(2, '0')}`;
  resultFormat.textContent = labels.format[state.format];
  resultMood.textContent = labels.mood[state.mood];
  resultTitle.textContent = prompt.title;
  resultDescription.textContent = prompt.description;
  resultTime.textContent = `${state.time} 分钟`;
  resultTip.textContent = `${timeTips[state.time]} ${prompt.tip}`;

  emptyState.hidden = true;
  resultCard.hidden = false;
  copyMessage.textContent = '';
  copyMessage.classList.remove('error');
}

redrawButton.addEventListener('click', () => {
  if (!state.format || !state.mood || !state.time) {
    formMessage.textContent = '请先完成左边的三个选择。';
    return;
  }
  drawPrompt();
});

copyButton.addEventListener('click', async () => {
  if (!state.currentPrompt) {
    copyMessage.textContent = '请先生成一张任务卡，再复制内容。';
    copyMessage.classList.add('error');
    return;
  }

  const copyText = [
    `Creative Spark｜${state.currentPrompt.title}`,
    `创作形式：${labels.format[state.format]}`,
    `氛围：${labels.mood[state.mood]}`,
    `时间：${state.time} 分钟`,
    '',
    state.currentPrompt.description,
    `小提示：${timeTips[state.time]} ${state.currentPrompt.tip}`
  ].join('\n');

  try {
    await copyTextToClipboard(copyText);
    copyMessage.textContent = '已复制！把灵感带去你常用的创作工具吧。';
    copyMessage.classList.remove('error');
  } catch (error) {
    copyMessage.textContent = '复制功能暂时不可用，请手动选中任务文字复制。';
    copyMessage.classList.add('error');
  }
});

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for local previews where the Clipboard API may be unavailable.
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('Clipboard copy was rejected');
}

// Reset the form and the result so users can start a clean new round.
const resetButton = document.createElement('button');
resetButton.type = 'button';
resetButton.className = 'reset-link';
resetButton.textContent = '清空选择，重新开始 ↺';
resetButton.addEventListener('click', resetExperience);
form.appendChild(resetButton);

function resetExperience() {
  Object.keys(groups).forEach((groupName) => {
    state[groupName] = null;
    groups[groupName].querySelectorAll('button[data-value]').forEach((button) => {
      button.setAttribute('aria-pressed', 'false');
    });
  });
  state.lastPromptKey = null;
  state.currentPrompt = null;
  state.cardCount = 0;
  formMessage.textContent = '';
  copyMessage.textContent = '';
  copyMessage.classList.remove('error');
  resultNumber.textContent = 'CARD —';
  resultCard.hidden = true;
  emptyState.hidden = false;
}
