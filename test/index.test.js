const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const vm = require('node:vm');
const { makeDOM, makeStorage } = require('./fake-dom');

function runScript(file, env) {
  const code = fs.readFileSync(file, 'utf8');
  vm.runInContext(code, env);
  if (env.window.onload) env.window.onload();
}

test('user page flow progresses to verification', () => {
  const ids = ['chatLog','chat','landing','dashboard','optInBtn','featuredBrand','nextBtn','minChatBtn','openChatBtn','incomeModal','verifyCompleteBtn','sceneNextBtn','brands','offers'];
  const { document, window } = makeDOM(ids);
  const context = vm.createContext({
    window,
    document,
    localStorage: makeStorage(),
    sessionStorage: makeStorage(),
    URLSearchParams,
    setInterval: () => {},
    setTimeout: (fn) => fn(),
    console
  });
  runScript('script.js', context);

  document.getElementById('optInBtn').onclick();
  const nextBtn = document.getElementById('nextBtn');
  for (let i = 0; i < 5; i++) nextBtn.onclick();
  document.getElementById('verifyCompleteBtn').onclick();

  assert(!document.getElementById('sceneNextBtn').classList.contains('hidden'));
});

test('brand portal flow reaches go live', () => {
  const ids = [
    'chatLog','nextBtn','wizard','step1','step1Next','step2','step2Next',
    'step3','step3Next','step4','launchBtn','audienceInput','adHeadline','adCopy',
    'previewHeadline','previewBody','previewImg','creativeImg','summary','minChatBtn','openChatBtn'
  ];
  const { document, window } = makeDOM(ids);
  const context = vm.createContext({
    window,
    document,
    localStorage: makeStorage(),
    URLSearchParams,
    setTimeout: (fn) => fn(),
    console
  });
  const html = fs.readFileSync('brand.html','utf8');
  const match = /<script>([\s\S]*?)<\/script>/m.exec(html);
  vm.runInContext(match[1], context);
  if (window.onload) window.onload();

  const nextBtn = document.getElementById('nextBtn');
  nextBtn.onclick();
  nextBtn.onclick();
  const openBuilder = document.getElementById('chatLog').querySelector('button');
  openBuilder.onclick();
  nextBtn.onclick();
  document.getElementById('step1Next').onclick();
  document.getElementById('step2Next').onclick();
  document.getElementById('step3Next').onclick();
  document.getElementById('launchBtn').onclick();
  const goBtn = document.getElementById('summary').children[0];
  goBtn.onclick();
  const nextSummary = document.getElementById('summary').children[0];
  nextSummary.onclick();

  const offers = JSON.parse(context.localStorage.getItem('offers'));
  assert(offers && offers.length === 1);
  assert(window.location.href.includes('scene=final'));
});

test('shell scene progression', () => {
  const ids = ['sceneName','sceneLog','nextBtn','demoFrame','wrapUpScene','wrapBrands','totalAsk','recentActivity','introScreen'];
  const { document, window } = makeDOM(ids);
  const context = vm.createContext({
    window,
    document,
    localStorage: makeStorage(),
    URLSearchParams,
    setTimeout: (fn) => fn(),
    console
  });
  runScript('shell.js', context);

  const nextBtn = document.getElementById('nextBtn');
  for (let i = 0; i < 4; i++) nextBtn.click();

  assert.strictEqual(document.getElementById('sceneName').textContent, 'Scene 4 - Wrap-Up');
});
