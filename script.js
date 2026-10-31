/* Creative Spark v3: bilingual UI, 100 visual styles, combinatorial prompt generation. */

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
const languageToggle = document.querySelector('#language-toggle');
const moodOptions = document.querySelector('#mood-options');
const moodCount = document.querySelector('#mood-count');
const refreshStylesButton = document.querySelector('#refresh-styles-button');
const resetButton = document.querySelector('#reset-button');
const groups = {
  format: document.querySelector('[data-group="format"]'),
  mood: document.querySelector('[data-group="mood"]'),
  time: document.querySelector('[data-group="time"]')
};

let language = 'zh';
const state = {
  format: null,
  mood: null,
  time: null,
  currentPrompt: null,
  cardCount: 0,
  messageCode: null,
  copyCode: null
};
const HISTORY_STORAGE_KEY = 'creativeSparkUsedPromptKeysV3';
function loadPromptHistory() {
  try {
    const saved = sessionStorage.getItem(HISTORY_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.filter((key) => typeof key === 'string') : [];
  } catch (error) {
    return [];
  }
}
const usedPromptKeys = new Set(loadPromptHistory());
function rememberPromptKey(key) {
  usedPromptKeys.add(key);
  try {
    sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([...usedPromptKeys]));
  } catch (error) {
    // In-memory repeat prevention still works if browser storage is blocked or full.
  }
}
const STYLE_BATCH_SIZE = 8;

const i18n = {
  zh: {
    pageTitle: 'Creative Spark · 创作灵感抽卡机',
    pageDescription: 'Creative Spark 是一个帮助你快速找到创作灵感的中英双语互动工具。',
    brandAria: 'Creative Spark 首页', languageToggleAria: '切换到英文', topNote: '灵感小实验室', eyebrow: '给下一个点子添一点火花',
    heroLine1: '灵感不必等。', heroLine2: '先抽一张。', introCopy: '选好创作方向、氛围和时间。剩下的交给一点点随机性。<br class="desktop-break">从一个小任务开始，让想法真正落地。',
    workbenchAria: '创作灵感生成器', stepLabel: '01 / 设定你的方向', chooseTitle: '先选一选', stepCount: '3 个步骤',
    formatQuestion: '今天想创作什么？', required: '必选', formatVideo: '短视频', formatVideoSub: 'SHORT VIDEO', formatPhoto: '摄影', formatPhotoSub: 'PHOTOGRAPHY', formatPoster: '海报设计', formatPosterSub: 'POSTER DESIGN',
    moodQuestion: '想要哪种氛围或艺术风格？', moodCount: '100 个艺术风格关键词 · 每次展示 8 个', styleRefreshButton: '换一组风格 ↻', timeQuestion: '给自己多少时间？', minuteUnit: '分钟', drawButton: '生成我的创作任务', footnote: '没有标准答案，只有下一步。', resetButton: '清空选择，重新开始 ↺',
    resultAria: '创作任务结果', resultKicker: '02 / 你的下一项任务', cardWord: '卡片', emptyOverline: '你的灵感正在加载……', emptyTitle: '一张空白卡片，<br>等你来点亮。', emptyCopy: '完成左边三个选择，<br>这里就会出现你的专属创作挑战。', emptyTagOne: 'NO PRESSURE', emptyTagTwo: 'JUST MAKE',
    missionLabel: '你的创作提示', timeLimitLabel: '本次时间限制', challengeSideNote: '从小处开始<br>完成一个作品', copyButton: '复制任务', redrawButton: '再抽一张', copiedMessage: '已复制！把灵感带去你常用的创作工具吧。', copyUnavailable: '复制功能暂时不可用，请手动选中任务文字复制。', copyEmpty: '请先生成一张任务卡，再复制内容。',
    howKicker: '一个小循环，一个真实成果', howTitle: '三步，把灵感变成行动。', howStepOneTitle: '选定方向', howStepOneCopy: '告诉小工具你想做什么、喜欢什么氛围，以及你有多少时间。', howStepTwoTitle: '抽取任务', howStepTwoCopy: '程序把风格、主题、视觉手法和限制条件组合成一条新挑战。', howStepThreeTitle: '动手创作', howStepThreeCopy: '复制任务，开始你的限时小实验。完成比等待完美更重要。', footerCenter: '为开始之前的那个瞬间而做。', footerRight: '一个小点子，也能走很远 <span aria-hidden="true">↗</span>', resultFooterLeft: 'CREATIVITY, BY YOU.',
    missingPrefix: '还差一步：请选择', missingJoin: '、', missingSuffix: '，再来抽卡。', formatMissing: '创作形式', moodMissing: '艺术风格', timeMissing: '时间', redrawFirst: '请先完成左边的三个选择。', styleRefreshed: '风格关键词已更新，请选择一种风格。', poolRestarted: '你已探索全部组合，已开启新一轮抽卡。',
    timeTips: { 5: '快速模式：先完成一个版本，不必追求完美。', 15: '专注模式：留几分钟给构思，剩下的时间用来完成。', 30: '探索模式：可以先试两个不同方向，再选一个完成。' },
    copyPrefix: '创作形式：', copyMood: '艺术风格：', copyTime: '时间：', copyTip: '小提示：',
    formats: { video: '短视频', photo: '摄影', poster: '海报设计' },
    promptPrefix: '创作任务：', promptStyle: '视觉风格：', promptSubject: '主题：', promptApproach: '创作方向：', promptTechnique: '视觉手法：', promptConstraint: '限制条件：', promptTwist: '额外挑战：'
  },
  en: {
    pageTitle: 'Creative Spark · Creative Prompt Generator',
    pageDescription: 'Creative Spark is a bilingual interactive tool for finding your next creative idea.',
    brandAria: 'Creative Spark home', languageToggleAria: 'Switch to Chinese', topNote: 'THE LITTLE PROMPT LAB', eyebrow: 'A LITTLE SPARK FOR YOUR NEXT IDEA',
    heroLine1: 'Ideas don’t wait.', heroLine2: 'Draw one.', introCopy: 'Choose a format, a mood, and a time limit. Let a little randomness do the rest.<br class="desktop-break">Start with one small task and turn an idea into action.',
    workbenchAria: 'Creative prompt generator', stepLabel: '01 / SET YOUR INTENTION', chooseTitle: 'Make a few choices', stepCount: '3 STEPS',
    formatQuestion: 'What would you like to make?', required: 'REQUIRED', formatVideo: 'Short video', formatVideoSub: 'SHORT VIDEO', formatPhoto: 'Photography', formatPhotoSub: 'PHOTOGRAPHY', formatPoster: 'Poster design', formatPosterSub: 'POSTER DESIGN',
    moodQuestion: 'Choose a mood or art style', moodCount: '100 art-style keywords · 8 shown each time', styleRefreshButton: 'Shuffle styles ↻', timeQuestion: 'How much time do you have?', minuteUnit: 'min', drawButton: 'Generate my creative task', footnote: 'No perfect answers, just a next step.', resetButton: 'Clear choices and start again ↺',
    resultAria: 'Creative task result', resultKicker: '02 / YOUR NEXT MISSION', cardWord: 'CARD', emptyOverline: 'YOUR IDEA IS LOADING...', emptyTitle: 'A blank card,<br>ready for your spark.', emptyCopy: 'Make the three choices on the left<br>to reveal your creative challenge.', emptyTagOne: 'NO PRESSURE', emptyTagTwo: 'JUST MAKE',
    missionLabel: 'YOUR CREATIVE PROMPT', timeLimitLabel: 'YOUR TIME LIMIT', challengeSideNote: 'START SMALL<br>FINISH SOMETHING', copyButton: 'Copy task', redrawButton: 'Draw another', copiedMessage: 'Copied! Take this spark to your favourite creative tool.', copyUnavailable: 'Clipboard access is unavailable. Select and copy the task text manually.', copyEmpty: 'Generate a task card before copying it.',
    howKicker: 'A SMALL LOOP, A REAL RESULT', howTitle: 'Three steps from idea to action.', howStepOneTitle: 'Pick a direction', howStepOneCopy: 'Choose what you want to make, the mood you like, and the time you have.', howStepTwoTitle: 'Draw a task', howStepTwoCopy: 'The program combines a style, subject, visual technique, and constraint into a fresh challenge.', howStepThreeTitle: 'Make something', howStepThreeCopy: 'Copy the task and try a tiny timed experiment. Done beats perfect.', footerCenter: 'MADE FOR THE MOMENT BEFORE YOU BEGIN.', footerRight: 'A LITTLE IDEA CAN GO A LONG WAY <span aria-hidden="true">↗</span>', resultFooterLeft: 'CREATIVITY, BY YOU.',
    missingPrefix: 'One more step: choose ', missingJoin: ', ', missingSuffix: ' before drawing a card.', formatMissing: 'a format', moodMissing: 'an art style', timeMissing: 'a time limit', redrawFirst: 'Complete the three choices on the left first.', styleRefreshed: 'The style keywords have been shuffled. Choose one to continue.', poolRestarted: 'You explored every available combination. A fresh round has started.',
    timeTips: { 5: 'Quick mode: make one version first. Perfection can wait.', 15: 'Focus mode: spend a few minutes planning, then make it happen.', 30: 'Explore mode: try two directions, then finish the stronger one.' },
    copyPrefix: 'Format: ', copyMood: 'Art style: ', copyTime: 'Time: ', copyTip: 'Tip: ',
    formats: { video: 'Short video', photo: 'Photography', poster: 'Poster design' },
    promptPrefix: 'Creative task: ', promptStyle: 'Visual style: ', promptSubject: 'Subject: ', promptApproach: 'Creative direction: ', promptTechnique: 'Visual technique: ', promptConstraint: 'Constraint: ', promptTwist: 'Extra challenge: '
  }
};

const formatInfo = {
  video: { action: { zh: '把这个主题拍成一段 3–5 个镜头的短片，利用镜头顺序、节奏和声音把想法讲清楚。', en: 'Turn this idea into a 3–5 shot video. Use sequence, rhythm, and sound to bring it to life.' } },
  photo: { action: { zh: '把它拍成一组 3 张照片，用构图、光线或重复出现的细节将画面串联起来。', en: 'Make a set of 3 photos. Connect them through composition, light, or a recurring detail.' } },
  poster: { action: { zh: '把这个主题设计成一张海报，让主标题、视觉主体和留白一起传递情绪。', en: 'Turn the idea into a poster. Let the headline, central visual, and negative space work together.' } }
};

const styleKeywords = [
  {
    "id": "impressionism",
    "label": {
      "zh": "印象派",
      "en": "Impressionism"
    },
    "swatch": 0
  },
  {
    "id": "post-impressionism",
    "label": {
      "zh": "后印象派",
      "en": "Post-Impressionism"
    },
    "swatch": 1
  },
  {
    "id": "pointillism",
    "label": {
      "zh": "点彩画派",
      "en": "Pointillism"
    },
    "swatch": 2
  },
  {
    "id": "expressionism",
    "label": {
      "zh": "表现主义",
      "en": "Expressionism"
    },
    "swatch": 3
  },
  {
    "id": "abstract-expressionism",
    "label": {
      "zh": "抽象表现主义",
      "en": "Abstract Expressionism"
    },
    "swatch": 4
  },
  {
    "id": "cubism",
    "label": {
      "zh": "立体主义",
      "en": "Cubism"
    },
    "swatch": 5
  },
  {
    "id": "surrealism",
    "label": {
      "zh": "超现实主义",
      "en": "Surrealism"
    },
    "swatch": 6
  },
  {
    "id": "dadaism",
    "label": {
      "zh": "达达主义",
      "en": "Dadaism"
    },
    "swatch": 7
  },
  {
    "id": "futurism",
    "label": {
      "zh": "未来主义",
      "en": "Futurism"
    },
    "swatch": 8
  },
  {
    "id": "constructivism",
    "label": {
      "zh": "构成主义",
      "en": "Constructivism"
    },
    "swatch": 9
  },
  {
    "id": "bauhaus",
    "label": {
      "zh": "包豪斯",
      "en": "Bauhaus"
    },
    "swatch": 0
  },
  {
    "id": "art-deco",
    "label": {
      "zh": "装饰艺术",
      "en": "Art Deco"
    },
    "swatch": 1
  },
  {
    "id": "art-nouveau",
    "label": {
      "zh": "新艺术运动",
      "en": "Art Nouveau"
    },
    "swatch": 2
  },
  {
    "id": "pop-art",
    "label": {
      "zh": "波普艺术",
      "en": "Pop Art"
    },
    "swatch": 3
  },
  {
    "id": "op-art",
    "label": {
      "zh": "欧普艺术",
      "en": "Op Art"
    },
    "swatch": 4
  },
  {
    "id": "minimalism",
    "label": {
      "zh": "极简主义",
      "en": "Minimalism"
    },
    "swatch": 5
  },
  {
    "id": "maximalism",
    "label": {
      "zh": "极繁主义",
      "en": "Maximalism"
    },
    "swatch": 6
  },
  {
    "id": "brutalism",
    "label": {
      "zh": "粗野主义",
      "en": "Brutalism"
    },
    "swatch": 7
  },
  {
    "id": "swiss-style",
    "label": {
      "zh": "瑞士国际主义设计",
      "en": "Swiss International Style"
    },
    "swatch": 8
  },
  {
    "id": "memphis-design",
    "label": {
      "zh": "孟菲斯设计",
      "en": "Memphis Design"
    },
    "swatch": 9
  },
  {
    "id": "mid-century-modern",
    "label": {
      "zh": "世纪中叶现代主义",
      "en": "Mid-Century Modern"
    },
    "swatch": 0
  },
  {
    "id": "neo-noir",
    "label": {
      "zh": "新黑色电影风",
      "en": "Neo-Noir"
    },
    "swatch": 1
  },
  {
    "id": "film-noir",
    "label": {
      "zh": "黑色电影风",
      "en": "Film Noir"
    },
    "swatch": 2
  },
  {
    "id": "cinematic-realism",
    "label": {
      "zh": "电影写实风",
      "en": "Cinematic Realism"
    },
    "swatch": 3
  },
  {
    "id": "documentary-realism",
    "label": {
      "zh": "纪实写实风",
      "en": "Documentary Realism"
    },
    "swatch": 4
  },
  {
    "id": "analog-film",
    "label": {
      "zh": "复古胶片风",
      "en": "Analog Film"
    },
    "swatch": 5
  },
  {
    "id": "35mm-film",
    "label": {
      "zh": "35 毫米胶片摄影",
      "en": "35mm Film Photography"
    },
    "swatch": 6
  },
  {
    "id": "instant-film",
    "label": {
      "zh": "拍立得风格",
      "en": "Instant Film"
    },
    "swatch": 7
  },
  {
    "id": "risograph",
    "label": {
      "zh": "孔版印刷风",
      "en": "Risograph"
    },
    "swatch": 8
  },
  {
    "id": "screen-print",
    "label": {
      "zh": "丝网印刷风",
      "en": "Screen Print"
    },
    "swatch": 9
  },
  {
    "id": "linocut",
    "label": {
      "zh": "油毡版画风",
      "en": "Linocut"
    },
    "swatch": 0
  },
  {
    "id": "woodcut",
    "label": {
      "zh": "木刻版画风",
      "en": "Woodcut"
    },
    "swatch": 1
  },
  {
    "id": "etching",
    "label": {
      "zh": "蚀刻版画风",
      "en": "Etching"
    },
    "swatch": 2
  },
  {
    "id": "collage",
    "label": {
      "zh": "拼贴艺术",
      "en": "Collage"
    },
    "swatch": 3
  },
  {
    "id": "photomontage",
    "label": {
      "zh": "照片蒙太奇",
      "en": "Photomontage"
    },
    "swatch": 4
  },
  {
    "id": "paper-cut",
    "label": {
      "zh": "剪纸艺术",
      "en": "Paper Cut"
    },
    "swatch": 5
  },
  {
    "id": "paper-craft",
    "label": {
      "zh": "纸艺风",
      "en": "Paper Craft"
    },
    "swatch": 6
  },
  {
    "id": "origami",
    "label": {
      "zh": "折纸艺术",
      "en": "Origami"
    },
    "swatch": 7
  },
  {
    "id": "mixed-media",
    "label": {
      "zh": "混合媒介",
      "en": "Mixed Media"
    },
    "swatch": 8
  },
  {
    "id": "watercolor",
    "label": {
      "zh": "水彩风",
      "en": "Watercolour"
    },
    "swatch": 9
  },
  {
    "id": "gouache",
    "label": {
      "zh": "不透明水彩风",
      "en": "Gouache"
    },
    "swatch": 0
  },
  {
    "id": "oil-painting",
    "label": {
      "zh": "油画风",
      "en": "Oil Painting"
    },
    "swatch": 1
  },
  {
    "id": "acrylic-painting",
    "label": {
      "zh": "丙烯绘画风",
      "en": "Acrylic Painting"
    },
    "swatch": 2
  },
  {
    "id": "ink-wash",
    "label": {
      "zh": "水墨风",
      "en": "Ink Wash"
    },
    "swatch": 3
  },
  {
    "id": "sumi-e",
    "label": {
      "zh": "日本墨绘",
      "en": "Sumi-e Ink Painting"
    },
    "swatch": 4
  },
  {
    "id": "ukiyo-e",
    "label": {
      "zh": "浮世绘",
      "en": "Ukiyo-e"
    },
    "swatch": 5
  },
  {
    "id": "manga",
    "label": {
      "zh": "漫画风",
      "en": "Manga"
    },
    "swatch": 6
  },
  {
    "id": "anime",
    "label": {
      "zh": "动画美术风",
      "en": "Anime Art"
    },
    "swatch": 7
  },
  {
    "id": "chibi",
    "label": {
      "zh": "Q 版风格",
      "en": "Chibi"
    },
    "swatch": 8
  },
  {
    "id": "pixel-art",
    "label": {
      "zh": "像素艺术",
      "en": "Pixel Art"
    },
    "swatch": 9
  },
  {
    "id": "low-poly",
    "label": {
      "zh": "低多边形风",
      "en": "Low Poly"
    },
    "swatch": 0
  },
  {
    "id": "isometric",
    "label": {
      "zh": "等距视角插画",
      "en": "Isometric Illustration"
    },
    "swatch": 1
  },
  {
    "id": "voxel-art",
    "label": {
      "zh": "体素艺术",
      "en": "Voxel Art"
    },
    "swatch": 2
  },
  {
    "id": "vector-flat",
    "label": {
      "zh": "扁平矢量插画",
      "en": "Flat Vector Illustration"
    },
    "swatch": 3
  },
  {
    "id": "geometric-abstraction",
    "label": {
      "zh": "几何抽象",
      "en": "Geometric Abstraction"
    },
    "swatch": 4
  },
  {
    "id": "line-art",
    "label": {
      "zh": "线描风",
      "en": "Line Art"
    },
    "swatch": 5
  },
  {
    "id": "continuous-line",
    "label": {
      "zh": "连续线条画",
      "en": "Continuous Line Art"
    },
    "swatch": 6
  },
  {
    "id": "doodle",
    "label": {
      "zh": "涂鸦风",
      "en": "Doodle Art"
    },
    "swatch": 7
  },
  {
    "id": "naive-art",
    "label": {
      "zh": "稚拙艺术风",
      "en": "Naïve Art"
    },
    "swatch": 8
  },
  {
    "id": "folk-art",
    "label": {
      "zh": "民间艺术风",
      "en": "Folk Art"
    },
    "swatch": 9
  },
  {
    "id": "botanical-illustration",
    "label": {
      "zh": "植物图鉴插画",
      "en": "Botanical Illustration"
    },
    "swatch": 0
  },
  {
    "id": "scientific-illustration",
    "label": {
      "zh": "科学插画",
      "en": "Scientific Illustration"
    },
    "swatch": 1
  },
  {
    "id": "architectural-render",
    "label": {
      "zh": "建筑表现图风",
      "en": "Architectural Rendering"
    },
    "swatch": 2
  },
  {
    "id": "technical-drawing",
    "label": {
      "zh": "技术制图风",
      "en": "Technical Drawing"
    },
    "swatch": 3
  },
  {
    "id": "blueprint",
    "label": {
      "zh": "蓝图风",
      "en": "Blueprint Aesthetic"
    },
    "swatch": 4
  },
  {
    "id": "infographic",
    "label": {
      "zh": "信息图形风",
      "en": "Infographic Design"
    },
    "swatch": 5
  },
  {
    "id": "kinetic-typography",
    "label": {
      "zh": "动态字体设计",
      "en": "Kinetic Typography"
    },
    "swatch": 6
  },
  {
    "id": "experimental-typography",
    "label": {
      "zh": "实验字体设计",
      "en": "Experimental Typography"
    },
    "swatch": 7
  },
  {
    "id": "type-led-poster",
    "label": {
      "zh": "字体主导海报",
      "en": "Type-Led Poster"
    },
    "swatch": 8
  },
  {
    "id": "letterpress",
    "label": {
      "zh": "活版印刷风",
      "en": "Letterpress"
    },
    "swatch": 9
  },
  {
    "id": "vaporwave",
    "label": {
      "zh": "蒸汽波",
      "en": "Vaporwave"
    },
    "swatch": 0
  },
  {
    "id": "synthwave",
    "label": {
      "zh": "合成波",
      "en": "Synthwave"
    },
    "swatch": 1
  },
  {
    "id": "cyberpunk",
    "label": {
      "zh": "赛博朋克",
      "en": "Cyberpunk"
    },
    "swatch": 2
  },
  {
    "id": "solarpunk",
    "label": {
      "zh": "太阳朋克",
      "en": "Solarpunk"
    },
    "swatch": 3
  },
  {
    "id": "steampunk",
    "label": {
      "zh": "蒸汽朋克",
      "en": "Steampunk"
    },
    "swatch": 4
  },
  {
    "id": "dieselpunk",
    "label": {
      "zh": "柴油朋克",
      "en": "Dieselpunk"
    },
    "swatch": 5
  },
  {
    "id": "retrofuturism",
    "label": {
      "zh": "复古未来主义",
      "en": "Retrofuturism"
    },
    "swatch": 6
  },
  {
    "id": "y2k-aesthetic",
    "label": {
      "zh": "千禧年美学",
      "en": "Y2K Aesthetic"
    },
    "swatch": 7
  },
  {
    "id": "frutiger-aero",
    "label": {
      "zh": "Frutiger Aero 美学",
      "en": "Frutiger Aero"
    },
    "swatch": 8
  },
  {
    "id": "cottagecore",
    "label": {
      "zh": "田园风",
      "en": "Cottagecore"
    },
    "swatch": 9
  },
  {
    "id": "dark-academia",
    "label": {
      "zh": "暗黑学院风",
      "en": "Dark Academia"
    },
    "swatch": 0
  },
  {
    "id": "light-academia",
    "label": {
      "zh": "明亮学院风",
      "en": "Light Academia"
    },
    "swatch": 1
  },
  {
    "id": "dreamcore",
    "label": {
      "zh": "梦核",
      "en": "Dreamcore"
    },
    "swatch": 2
  },
  {
    "id": "weirdcore",
    "label": {
      "zh": "怪核",
      "en": "Weirdcore"
    },
    "swatch": 3
  },
  {
    "id": "liminal-space",
    "label": {
      "zh": "阈限空间美学",
      "en": "Liminal Space"
    },
    "swatch": 4
  },
  {
    "id": "fairytale",
    "label": {
      "zh": "童话风",
      "en": "Fairytale"
    },
    "swatch": 5
  },
  {
    "id": "mythic-fantasy",
    "label": {
      "zh": "神话幻想风",
      "en": "Mythic Fantasy"
    },
    "swatch": 6
  },
  {
    "id": "gothic",
    "label": {
      "zh": "哥特风",
      "en": "Gothic"
    },
    "swatch": 7
  },
  {
    "id": "romantic-gothic",
    "label": {
      "zh": "浪漫哥特风",
      "en": "Romantic Gothic"
    },
    "swatch": 8
  },
  {
    "id": "baroque",
    "label": {
      "zh": "巴洛克风",
      "en": "Baroque"
    },
    "swatch": 9
  },
  {
    "id": "rococo",
    "label": {
      "zh": "洛可可风",
      "en": "Rococo"
    },
    "swatch": 0
  },
  {
    "id": "neoclassical",
    "label": {
      "zh": "新古典主义",
      "en": "Neoclassicism"
    },
    "swatch": 1
  },
  {
    "id": "medieval-manuscript",
    "label": {
      "zh": "中世纪手抄本风",
      "en": "Medieval Manuscript"
    },
    "swatch": 2
  },
  {
    "id": "renaissance-inspired",
    "label": {
      "zh": "文艺复兴风",
      "en": "Renaissance-Inspired"
    },
    "swatch": 3
  },
  {
    "id": "mosaic",
    "label": {
      "zh": "马赛克艺术",
      "en": "Mosaic Art"
    },
    "swatch": 4
  },
  {
    "id": "stained-glass",
    "label": {
      "zh": "彩绘玻璃风",
      "en": "Stained Glass"
    },
    "swatch": 5
  },
  {
    "id": "neon-noir",
    "label": {
      "zh": "霓虹黑色电影风",
      "en": "Neon Noir"
    },
    "swatch": 6
  },
  {
    "id": "monochrome",
    "label": {
      "zh": "单色风",
      "en": "Monochrome"
    },
    "swatch": 7
  },
  {
    "id": "duotone",
    "label": {
      "zh": "双重色调",
      "en": "Duotone"
    },
    "swatch": 8
  },
  {
    "id": "pastel-pop",
    "label": {
      "zh": "马卡龙波普风",
      "en": "Pastel Pop"
    },
    "swatch": 9
  }
];
const subjects = [
  {
    "id": "s01",
    "zh": "雨后的公交站",
    "en": "a bus stop after rain"
  },
  {
    "id": "s02",
    "zh": "外套口袋里的一张旧票根",
    "en": "an old ticket in a coat pocket"
  },
  {
    "id": "s03",
    "zh": "杯子在纸上留下的水痕",
    "en": "a cup leaving a ring on paper"
  },
  {
    "id": "s04",
    "zh": "午夜亮着灯的窗户",
    "en": "a window glowing at midnight"
  },
  {
    "id": "s05",
    "zh": "朝台灯倾斜的植物",
    "en": "a plant leaning toward a desk lamp"
  },
  {
    "id": "s06",
    "zh": "迟迟不来的电梯",
    "en": "an elevator that takes too long"
  },
  {
    "id": "s07",
    "zh": "一双不成对的鞋",
    "en": "a pair of mismatched shoes"
  },
  {
    "id": "s08",
    "zh": "少了一个词的便条",
    "en": "a note with one missing word"
  },
  {
    "id": "s09",
    "zh": "一天中的末班车",
    "en": "the last train of the day"
  },
  {
    "id": "s10",
    "zh": "开门前的小店",
    "en": "a tiny shop before opening"
  },
  {
    "id": "s11",
    "zh": "走廊里被遗忘的雨伞",
    "en": "an umbrella forgotten in a hallway"
  },
  {
    "id": "s12",
    "zh": "便利店冰柜里的倒影",
    "en": "reflections in a convenience-store fridge"
  },
  {
    "id": "s13",
    "zh": "多出一个奇怪细节的楼梯",
    "en": "a staircase with one unusual detail"
  },
  {
    "id": "s14",
    "zh": "人离开后的公共餐桌",
    "en": "a shared table after everyone leaves"
  },
  {
    "id": "s15",
    "zh": "掠过瓷砖地板的影子",
    "en": "a shadow crossing a tiled floor"
  },
  {
    "id": "s16",
    "zh": "一把找不到对应锁孔的钥匙",
    "en": "a key that fits no lock"
  },
  {
    "id": "s17",
    "zh": "排水口旁的一只纸船",
    "en": "a paper boat beside a drain"
  },
  {
    "id": "s18",
    "zh": "一条无人点开的通知",
    "en": "a notification no one opens"
  },
  {
    "id": "s19",
    "zh": "从屋顶望出去的街区",
    "en": "a neighbourhood seen from a rooftop"
  },
  {
    "id": "s20",
    "zh": "黎明时分的自动售货机",
    "en": "a vending machine at dawn"
  },
  {
    "id": "s21",
    "zh": "装满普通物件的行李箱",
    "en": "a suitcase full of ordinary objects"
  },
  {
    "id": "s22",
    "zh": "蓝调时刻的街角",
    "en": "a street corner at blue hour"
  },
  {
    "id": "s23",
    "zh": "写满边注的借阅书",
    "en": "a borrowed book filled with marginal notes"
  },
  {
    "id": "s24",
    "zh": "只移动一件物品后变样的房间",
    "en": "a room transformed by moving one object"
  },
  {
    "id": "s25",
    "zh": "穿过水泥地生长的花",
    "en": "a flower growing through concrete"
  },
  {
    "id": "s26",
    "zh": "勺子里被扭曲的房间倒影",
    "en": "a distorted room reflected in a spoon"
  },
  {
    "id": "s27",
    "zh": "用画面表现雨声",
    "en": "the sound of rain expressed visually"
  },
  {
    "id": "s28",
    "zh": "迟到一天才送达的信息",
    "en": "a message that arrives one day late"
  },
  {
    "id": "s29",
    "zh": "没有客人的微型庆祝会",
    "en": "a tiny celebration with no guests"
  },
  {
    "id": "s30",
    "zh": "被当作博物馆藏品的日常物件",
    "en": "an everyday object treated as a museum artefact"
  },
  {
    "id": "s31",
    "zh": "窗帘上的午后阳光",
    "en": "afternoon sunlight on a curtain"
  },
  {
    "id": "s32",
    "zh": "一张空荡荡的剧院座椅",
    "en": "an empty theatre seat"
  },
  {
    "id": "s33",
    "zh": "在水面漂浮的橘子",
    "en": "an orange floating on water"
  },
  {
    "id": "s34",
    "zh": "被风吹乱的传单",
    "en": "flyers scattered by the wind"
  },
  {
    "id": "s35",
    "zh": "一扇只开了一条缝的门",
    "en": "a door left slightly ajar"
  },
  {
    "id": "s36",
    "zh": "桌面上的一小块融化冰",
    "en": "a small piece of melting ice on a desk"
  },
  {
    "id": "s37",
    "zh": "被雨水模糊的霓虹字",
    "en": "neon lettering blurred by rain"
  },
  {
    "id": "s38",
    "zh": "装着秘密的纸袋",
    "en": "a paper bag that seems to hold a secret"
  },
  {
    "id": "s39",
    "zh": "一段突然中断的楼梯",
    "en": "a staircase that seems to stop mid-way"
  },
  {
    "id": "s40",
    "zh": "阳台上晾着的白衬衫",
    "en": "a white shirt drying on a balcony"
  }
];
const approaches = [
  {
    "id": "a01",
    "zh": "把熟悉的场景变得陌生",
    "en": "Make a familiar scene feel unfamiliar"
  },
  {
    "id": "a02",
    "zh": "从物件自己的视角讲述故事",
    "en": "Tell the story from the object’s point of view"
  },
  {
    "id": "a03",
    "zh": "只呈现故事发生前的一秒",
    "en": "Show only the second before something happens"
  },
  {
    "id": "a04",
    "zh": "把一个细节放大成主角",
    "en": "Make one small detail the main character"
  },
  {
    "id": "a05",
    "zh": "让平凡事物显得庄严隆重",
    "en": "Treat an ordinary thing as something monumental"
  },
  {
    "id": "a06",
    "zh": "把情绪转译成形状与节奏",
    "en": "Translate an emotion into shapes and rhythm"
  },
  {
    "id": "a07",
    "zh": "把现实与想象叠在同一画面",
    "en": "Layer reality and imagination in one frame"
  },
  {
    "id": "a08",
    "zh": "让两个无关元素产生联系",
    "en": "Create a connection between two unrelated elements"
  },
  {
    "id": "a09",
    "zh": "把一个日常动作变成仪式",
    "en": "Turn an everyday action into a ritual"
  },
  {
    "id": "a10",
    "zh": "从结尾开始倒推故事",
    "en": "Work backwards from the ending"
  },
  {
    "id": "a11",
    "zh": "隐藏主角，只留下痕迹",
    "en": "Hide the protagonist and show only traces"
  },
  {
    "id": "a12",
    "zh": "把宏大的主题缩小到一个物件",
    "en": "Shrink a big theme down to one object"
  },
  {
    "id": "a13",
    "zh": "让静止画面暗示运动",
    "en": "Suggest movement in a still image"
  },
  {
    "id": "a14",
    "zh": "把一种声音转化成视觉线索",
    "en": "Turn a sound into a visual clue"
  },
  {
    "id": "a15",
    "zh": "把记忆表现成一件可触摸的东西",
    "en": "Make a memory feel like a tangible object"
  },
  {
    "id": "a16",
    "zh": "让时间成为画面中的角色",
    "en": "Make time a character in the composition"
  },
  {
    "id": "a17",
    "zh": "用错位关系制造轻微幽默",
    "en": "Create gentle humour through mismatched relationships"
  },
  {
    "id": "a18",
    "zh": "为不存在的产品设计视觉形象",
    "en": "Create a visual identity for an imaginary product"
  },
  {
    "id": "a19",
    "zh": "把一个矛盾同时放进画面",
    "en": "Place two opposing ideas in one frame"
  },
  {
    "id": "a20",
    "zh": "让一个微小变化改变整个故事",
    "en": "Let one tiny change transform the whole story"
  }
];
const techniques = [
  {
    "id": "v01",
    "zh": "尝试俯拍构图，让物件形成地图般的关系",
    "en": "Try a top-down composition that makes objects feel like a map"
  },
  {
    "id": "v02",
    "zh": "使用大量留白，把注意力集中在一个焦点",
    "en": "Use generous negative space to isolate one focal point"
  },
  {
    "id": "v03",
    "zh": "用强烈的前景遮挡制造层次",
    "en": "Use a bold foreground obstruction to create depth"
  },
  {
    "id": "v04",
    "zh": "让对称构图出现一个故意的偏差",
    "en": "Build a symmetrical composition with one deliberate disruption"
  },
  {
    "id": "v05",
    "zh": "只用两种主色和一种强调色",
    "en": "Use two main colours and one accent colour"
  },
  {
    "id": "v06",
    "zh": "以近景细节代替完整场景",
    "en": "Use close-up details instead of showing the whole scene"
  },
  {
    "id": "v07",
    "zh": "通过重复形状建立视觉节奏",
    "en": "Build a visual rhythm through repeated shapes"
  },
  {
    "id": "v08",
    "zh": "利用反射、玻璃或水面制造第二个画面",
    "en": "Use reflections in glass or water to create a second image"
  },
  {
    "id": "v09",
    "zh": "以斜线和倾斜角度推动视线",
    "en": "Guide the eye with diagonals and tilted angles"
  },
  {
    "id": "v10",
    "zh": "让主体靠近画面边缘而非正中央",
    "en": "Place the subject near an edge instead of the centre"
  },
  {
    "id": "v11",
    "zh": "从低视角重新观察普通物件",
    "en": "Revisit an ordinary object from a low viewpoint"
  },
  {
    "id": "v12",
    "zh": "把文字当作图形，而不只是说明",
    "en": "Treat typography as a shape, not just an explanation"
  },
  {
    "id": "v13",
    "zh": "用硬光和清晰阴影塑造情绪",
    "en": "Use hard light and crisp shadows to shape the mood"
  },
  {
    "id": "v14",
    "zh": "通过模糊与清晰的反差建立焦点",
    "en": "Create a focal point with a contrast between blur and sharpness"
  },
  {
    "id": "v15",
    "zh": "将画面拆成前景、中景和背景",
    "en": "Divide the image into foreground, middle ground, and background"
  },
  {
    "id": "v16",
    "zh": "用网格或重复边框组织信息",
    "en": "Organise information with a grid or repeated borders"
  },
  {
    "id": "v17",
    "zh": "让一个元素超出画面边界",
    "en": "Let one element spill beyond the frame"
  },
  {
    "id": "v18",
    "zh": "尝试极端近距离或极远距离",
    "en": "Try an extreme close-up or a very distant viewpoint"
  },
  {
    "id": "v19",
    "zh": "让曲线与直线形成冲突",
    "en": "Create tension between curved and straight lines"
  },
  {
    "id": "v20",
    "zh": "用留白与密集区域形成速度感",
    "en": "Create a sense of speed through empty and dense areas"
  }
];
const constraints = [
  {
    "id": "c01",
    "zh": "限制在三种颜色以内",
    "en": "Limit the palette to three colours"
  },
  {
    "id": "c02",
    "zh": "画面里不能出现人脸",
    "en": "Do not show any faces"
  },
  {
    "id": "c03",
    "zh": "只使用身边现成的物件",
    "en": "Use only objects already around you"
  },
  {
    "id": "c04",
    "zh": "不要使用任何文字",
    "en": "Use no written words"
  },
  {
    "id": "c05",
    "zh": "只能出现一个主要物件",
    "en": "Include only one main object"
  },
  {
    "id": "c06",
    "zh": "必须包含一个圆形元素",
    "en": "Include one circular element"
  },
  {
    "id": "c07",
    "zh": "不使用纯黑色",
    "en": "Avoid pure black"
  },
  {
    "id": "c08",
    "zh": "必须保留一块明显空白",
    "en": "Leave one clearly visible empty area"
  },
  {
    "id": "c09",
    "zh": "只用自然光或模拟自然光",
    "en": "Use only natural light or its visual equivalent"
  },
  {
    "id": "c10",
    "zh": "整个作品最多使用五个元素",
    "en": "Use no more than five elements"
  },
  {
    "id": "c11",
    "zh": "不允许直接展示主题本身",
    "en": "Do not show the subject directly"
  },
  {
    "id": "c12",
    "zh": "只选择一个视角完成作品",
    "en": "Use only one viewpoint"
  },
  {
    "id": "c13",
    "zh": "至少重复同一个符号三次",
    "en": "Repeat the same symbol at least three times"
  },
  {
    "id": "c14",
    "zh": "不能依靠渐变来制造层次",
    "en": "Do not rely on gradients for depth"
  },
  {
    "id": "c15",
    "zh": "让主体占据画面不到四分之一",
    "en": "Keep the main subject under a quarter of the frame"
  },
  {
    "id": "c16",
    "zh": "所有文字总共不超过七个词",
    "en": "Use no more than seven words in total"
  }
];
const twists = [
  {
    "id": "t01",
    "zh": "藏入一个只有仔细看才发现的线索",
    "en": "Hide a clue that appears only on close inspection"
  },
  {
    "id": "t02",
    "zh": "让一个元素看起来比实际大十倍",
    "en": "Make one element appear ten times larger than it is"
  },
  {
    "id": "t03",
    "zh": "加入一个与整体风格不协调的细节",
    "en": "Add one detail that clashes with the overall style"
  },
  {
    "id": "t04",
    "zh": "让结尾或视觉重点产生反转",
    "en": "Give the ending or focal point an unexpected reversal"
  },
  {
    "id": "t05",
    "zh": "重复一个符号，让它的意义逐渐改变",
    "en": "Repeat a symbol until its meaning begins to change"
  },
  {
    "id": "t06",
    "zh": "让观众可以有两种不同解读",
    "en": "Leave room for two different interpretations"
  },
  {
    "id": "t07",
    "zh": "让一个看似错误的地方成为焦点",
    "en": "Turn an apparent mistake into the focal point"
  },
  {
    "id": "t08",
    "zh": "把一个元素放在不合常理的位置",
    "en": "Place one element somewhere illogical"
  },
  {
    "id": "t09",
    "zh": "添加一个暗示“刚刚发生过什么”的痕迹",
    "en": "Add a trace that suggests something just happened"
  },
  {
    "id": "t10",
    "zh": "让画面的一部分像是来自另一段时间",
    "en": "Make one part of the image feel as if it belongs to another time"
  },
  {
    "id": "t11",
    "zh": "只改变一个细节就改变整个情绪",
    "en": "Change just one detail to shift the entire mood"
  },
  {
    "id": "t12",
    "zh": "在边缘放入一个意外的小彩蛋",
    "en": "Place an unexpected easter egg at the edge"
  },
  {
    "id": "t13",
    "zh": "让一个元素同时像两种不同的东西",
    "en": "Make one element resemble two different things"
  },
  {
    "id": "t14",
    "zh": "把某个视觉规律在最后一刻打破",
    "en": "Break one visual pattern at the last moment"
  },
  {
    "id": "t15",
    "zh": "让主体与背景交换主次",
    "en": "Swap the visual importance of subject and background"
  },
  {
    "id": "t16",
    "zh": "设计一个只有回看时才成立的关联",
    "en": "Create a connection that becomes clear only on a second look"
  }
];
const tips = [
  {
    "zh": "先完成一个清晰版本，再决定是否增加装饰。",
    "en": "Finish one clear version before adding decoration."
  },
  {
    "zh": "如果画面太复杂，先删掉一个元素。",
    "en": "If the image feels crowded, remove one element."
  },
  {
    "zh": "让每个选择都服务于同一个情绪或主题。",
    "en": "Make each choice serve the same mood or theme."
  },
  {
    "zh": "先确定视觉焦点，再安排其他信息。",
    "en": "Choose the focal point before arranging supporting details."
  },
  {
    "zh": "不要把所有线索都解释出来，留一点空间给观众。",
    "en": "Do not explain every clue; leave some room for the audience."
  },
  {
    "zh": "比较第一个版本和一个大胆版本，再选择更有力的方向。",
    "en": "Compare a first version with a bolder one, then choose the stronger direction."
  },
  {
    "zh": "用一个重复元素把不同部分联系起来。",
    "en": "Use one recurring element to connect the parts."
  },
  {
    "zh": "把限制当成创作规则，而不是障碍。",
    "en": "Treat the constraint as a creative rule, not a roadblock."
  },
  {
    "zh": "完成后问自己：别人第一眼会看哪里？",
    "en": "After finishing, ask: where will someone look first?"
  },
  {
    "zh": "如果灵感卡住，换一个距离或角度重新观察。",
    "en": "If you get stuck, change your distance or viewpoint."
  }
];
const styleById = Object.fromEntries(styleKeywords.map((style) => [style.id, style]));

const titleTemplates = {
  zh: [
    (subject, style) => `用${style.label.zh}重构「${subject.zh}」`,
    (subject, style) => `为「${subject.zh}」寻找新的视觉语言`,
    (subject, style) => `如果「${subject.zh}」进入${style.label.zh}的世界`,
    (subject, style) => `把「${subject.zh}」变成一场视觉实验`,
    (subject, style) => `重新发现「${subject.zh}」`,
    (subject, style) => `一次关于「${subject.zh}」的风格实验`,
    (subject, style) => `让「${subject.zh}」成为画面主角`
  ],
  en: [
    (subject, style) => `Reframe "${subject.en}" through ${style.label.en}`,
    (subject, style) => `Find a new visual language for "${subject.en}"`,
    (subject, style) => `What if "${subject.en}" entered the world of ${style.label.en}?`,
    (subject, style) => `A visual experiment with "${subject.en}"`,
    (subject, style) => `Rethink "${subject.en}" through ${style.label.en}`,
    (subject, style) => `Make "${subject.en}" the main character`,
    (subject, style) => `Turn "${subject.en}" into a visual puzzle`
  ]
};

function textFor(key) {
  return i18n[language][key];
}

function shuffleArray(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

let styleBag = shuffleArray(styleKeywords.map((style) => style.id));
let visibleStyleIds = nextStyleBatch();

function nextStyleBatch() {
  const batch = [];
  while (batch.length < STYLE_BATCH_SIZE) {
    if (styleBag.length === 0) {
      styleBag = shuffleArray(styleKeywords.map((style) => style.id).filter((id) => !batch.includes(id)));
    }
    const nextId = styleBag.shift();
    if (nextId && !batch.includes(nextId)) batch.push(nextId);
  }
  return batch;
}

function applyLanguage() {
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.title = textFor('pageTitle');
  document.querySelector('meta[name="description"]').content = textFor('pageDescription');
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    if (textFor(key) !== undefined) element.textContent = textFor(key);
  });
  document.querySelectorAll('[data-i18n-html]').forEach((element) => {
    const key = element.dataset.i18nHtml;
    if (textFor(key) !== undefined) element.innerHTML = textFor(key);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
    const key = element.dataset.i18nAria;
    if (textFor(key) !== undefined) element.setAttribute('aria-label', textFor(key));
  });
  languageToggle.textContent = language === 'zh' ? 'EN ↗' : '中文 ↗';
  renderMoodOptions();
  renderMessages();
  if (state.currentPrompt) renderResult();
  else resultNumber.textContent = language === 'zh' ? '卡片 —' : 'CARD —';
}

function renderMoodOptions() {
  moodOptions.innerHTML = '';
  visibleStyleIds.forEach((styleId) => {
    const style = styleById[styleId];
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mood-option';
    button.dataset.value = style.id;
    button.setAttribute('aria-pressed', String(state.mood === style.id));
    const dot = document.createElement('span');
    dot.className = `mood-dot mood-swatch-${style.swatch}`;
    dot.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.textContent = style.label[language];
    button.append(dot, label);
    button.addEventListener('click', () => selectOption('mood', style.id));
    moodOptions.appendChild(button);
  });
  moodCount.textContent = language === 'zh'
    ? `${styleKeywords.length} 个艺术风格关键词 · 当前展示 ${visibleStyleIds.length} 个`
    : `${styleKeywords.length} art-style keywords · Showing ${visibleStyleIds.length}`;
}

function selectOption(groupName, value) {
  state[groupName] = value;
  groups[groupName].querySelectorAll('button[data-value]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.value === value));
  });
  state.messageCode = null;
  state.copyCode = null;
  renderMessages();
}

refreshStylesButton.addEventListener('click', () => {
  visibleStyleIds = nextStyleBatch();
  state.mood = null;
  state.messageCode = 'styleRefreshed';
  state.copyCode = null;
  renderMoodOptions();
  renderMessages();
});

Object.entries(groups).forEach(([groupName, groupElement]) => {
  if (groupName === 'mood') return;
  groupElement.querySelectorAll('button[data-value]').forEach((button) => {
    button.addEventListener('click', () => selectOption(groupName, button.dataset.value));
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!state.format || !state.mood || !state.time) {
    state.messageCode = 'missing';
    renderMessages();
    return;
  }
  state.messageCode = null;
  drawPrompt();
});

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function createPrompt() {
  const style = styleById[state.mood];
  const subject = randomItem(subjects);
  const approach = randomItem(approaches);
  const technique = randomItem(techniques);
  const constraint = randomItem(constraints);
  const twist = randomItem(twists);
  const tip = randomItem(tips);
  const templateIndex = Math.floor(Math.random() * titleTemplates.zh.length);
  const key = [state.format, state.mood, state.time, subject.id, approach.id, technique.id, constraint.id, twist.id, templateIndex].join('|');

  const idea = {
    zh: `以${style.label.zh}的视觉语言重新表达「${subject.zh}」。${approach.zh}。${technique.zh}。限制条件：${constraint.zh}。额外挑战：${twist.zh}。`,
    en: `Reinterpret "${subject.en}" through the visual language of ${style.label.en}. ${approach.en}. ${technique.en}. Constraint: ${constraint.en}. Extra challenge: ${twist.en}.`
  };
  return {
    key,
    style: state.mood,
    subject,
    approach,
    technique,
    constraint,
    twist,
    templateIndex,
    title: {
      zh: titleTemplates.zh[templateIndex](subject, style),
      en: titleTemplates.en[templateIndex](subject, style)
    },
    idea,
    tip
  };
}

function drawPrompt() {
  const totalCombinations = styleKeywords.length * subjects.length * approaches.length * techniques.length * constraints.length * twists.length * 3 * 3 * titleTemplates.zh.length;
  let historyWasReset = false;
  if (usedPromptKeys.size >= totalCombinations) {
    usedPromptKeys.clear();
    try { sessionStorage.removeItem(HISTORY_STORAGE_KEY); } catch (error) { /* Storage may be unavailable. */ }
    historyWasReset = true;
  }

  // Keep drawing until an unused combination is found. The pool is finite, but has over 25 billion combinations.
  let task;
  while (!task) {
    const candidate = createPrompt();
    if (!usedPromptKeys.has(candidate.key)) {
      task = candidate;
      rememberPromptKey(candidate.key);
    }
  }

  state.currentPrompt = { format: state.format, mood: state.mood, time: state.time, task };
  state.cardCount += 1;
  state.copyCode = null;
  state.messageCode = historyWasReset ? 'poolRestarted' : null;
  emptyState.hidden = true;
  resultCard.hidden = false;
  renderMessages();
  renderResult();
}

function renderResult() {
  const current = state.currentPrompt;
  if (!current) return;
  const task = current.task;
  const style = styleById[current.mood];
  const format = formatInfo[current.format];
  resultNumber.textContent = `${language === 'zh' ? '卡片' : 'CARD'} ${String(state.cardCount).padStart(2, '0')}`;
  resultFormat.textContent = i18n[language].formats[current.format];
  resultMood.textContent = style.label[language];
  resultTitle.textContent = task.title[language];
  resultDescription.textContent = `${task.idea[language]} ${format.action[language]}`;
  resultTime.textContent = language === 'zh' ? `${current.time} 分钟` : `${current.time} min`;
  const timeTip = i18n[language].timeTips[current.time];
  resultTip.textContent = `${timeTip} ${task.tip[language]}`;
}

redrawButton.addEventListener('click', () => {
  if (!state.format || !state.mood || !state.time) {
    state.messageCode = 'redrawFirst';
    renderMessages();
    return;
  }
  state.messageCode = null;
  drawPrompt();
});

function renderMessages() {
  if (state.messageCode === 'missing') {
    const missing = [];
    if (!state.format) missing.push(textFor('formatMissing'));
    if (!state.mood) missing.push(textFor('moodMissing'));
    if (!state.time) missing.push(textFor('timeMissing'));
    formMessage.textContent = `${textFor('missingPrefix')}${missing.join(textFor('missingJoin'))}${textFor('missingSuffix')}`;
  } else if (state.messageCode === 'redrawFirst') {
    formMessage.textContent = textFor('redrawFirst');
  } else if (state.messageCode === 'styleRefreshed') {
    formMessage.textContent = textFor('styleRefreshed');
  } else if (state.messageCode === 'poolRestarted') {
    formMessage.textContent = textFor('poolRestarted');
  } else {
    formMessage.textContent = '';
  }

  const copyMessages = {
    copied: textFor('copiedMessage'),
    unavailable: textFor('copyUnavailable'),
    empty: textFor('copyEmpty')
  };
  copyMessage.textContent = state.copyCode ? copyMessages[state.copyCode] : '';
  copyMessage.classList.toggle('error', state.copyCode === 'unavailable' || state.copyCode === 'empty');
}

copyButton.addEventListener('click', async () => {
  if (!state.currentPrompt) {
    state.copyCode = 'empty';
    renderMessages();
    return;
  }
  const { format, mood, time, task } = state.currentPrompt;
  const style = styleById[mood];
  const copyText = [
    `${textFor('promptPrefix')}${task.title[language]}`,
    `${textFor('copyPrefix')}${i18n[language].formats[format]}`,
    `${textFor('promptStyle')}${style.label[language]}`,
    `${textFor('copyTime')}${language === 'zh' ? `${time} 分钟` : `${time} min`}`,
    '',
    task.idea[language],
    formatInfo[format].action[language],
    `${textFor('copyTip')}${i18n[language].timeTips[time]} ${task.tip[language]}`
  ].join('\n');

  try {
    await copyTextToClipboard(copyText);
    state.copyCode = 'copied';
  } catch (error) {
    state.copyCode = 'unavailable';
  }
  renderMessages();
});

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
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

function resetExperience() {
  Object.keys(groups).forEach((groupName) => {
    state[groupName] = null;
    groups[groupName].querySelectorAll('button[data-value]').forEach((button) => {
      button.setAttribute('aria-pressed', 'false');
    });
  });
  state.currentPrompt = null;
  state.cardCount = 0;
  state.messageCode = null;
  state.copyCode = null;
  visibleStyleIds = nextStyleBatch();
  resultCard.hidden = true;
  emptyState.hidden = false;
  resultNumber.textContent = language === 'zh' ? '卡片 —' : 'CARD —';
  renderMoodOptions();
  renderMessages();
}

resetButton.addEventListener('click', resetExperience);
languageToggle.addEventListener('click', () => {
  language = language === 'zh' ? 'en' : 'zh';
  applyLanguage();
});

applyLanguage();
