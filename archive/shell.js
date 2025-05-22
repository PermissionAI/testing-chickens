function q(id){return document.getElementById(id);}

const scenes = [
  {name: 'Intro', lines: []},
  {name: 'Scene 1 - User Onboarding', page: 'index.html?demo=1'},
  {name: 'Scene 2 - Brand Portal', page: 'brand.html?demo=1'},
  {name: 'Scene 3 - Offer Delivered', page: 'index.html?scene=final&demo=1'},
  // The final scene displays a custom UI rather than scripted lines
  {name: 'Scene 4 - Wrap-Up', lines: []}
];

let sceneIndex = 0;
let lineIndex = 0;

const sceneName = q('sceneName');
const sceneLog = q('sceneLog');
const nextBtn = q('nextBtn');
const frame = q('demoFrame');
const wrapScene = q('wrapUpScene');
const wrapBrands = q('wrapBrands');
const totalAskEl = q('totalAsk');
const recentActivityEl = q('recentActivity');
const introScreen = q('introScreen');
let currentEl = null;

function append(text){
  const p = document.createElement('p');
  p.textContent = text;
  sceneLog.appendChild(p);
  sceneLog.scrollTop = sceneLog.scrollHeight;
}

function parseAsk(str){
  const m = /(\d+)\s*ASK/i.exec(str || '');
  return m ? parseInt(m[1], 10) : 0;
}

function updateWrapUp(){
  const brands = JSON.parse(localStorage.getItem('optedInBrands') || '[]');
  wrapBrands.innerHTML = '';
  brands.forEach(b => {
    const div = document.createElement('div');
    div.className = 'tile card';
    div.textContent = b;
    wrapBrands.appendChild(div);
  });
  const offers = JSON.parse(localStorage.getItem('offers') || '[]');
  let total = 0;
  offers.forEach(o => { total += parseAsk(o.reward); });
  totalAskEl.textContent = total;
  if(offers.length){
    const last = offers[offers.length-1];
    recentActivityEl.textContent = last.brand + ': ' + last.reward;
  } else {
    recentActivityEl.textContent = 'No recent activity';
  }
}

function fadeSwap(outEl, inEl){
  if(outEl){
    outEl.classList.add('fade');
    outEl.classList.add('fade-hidden');
    setTimeout(() => outEl.classList.add('hidden'), 500);
  }
  if(inEl){
    inEl.classList.add('fade');
    inEl.classList.remove('hidden');
    inEl.classList.add('fade-hidden');
    setTimeout(() => inEl.classList.remove('fade-hidden'), 50);
  }
}

function showScene(){
  const scene = scenes[sceneIndex];
  sceneName.textContent = scene.name;
  lineIndex = 0;
  let target;
  if(sceneIndex === 0){
    target = introScreen;
    nextBtn.textContent = 'Next';
    nextBtn.onclick = next;
  } else if(sceneIndex === scenes.length - 1){
    target = wrapScene;
    nextBtn.textContent = 'Replay Demo';
    nextBtn.onclick = () => window.location.reload();
    updateWrapUp();
  } else if(scene.page){
    frame.src = scene.page;
    target = frame;
    nextBtn.textContent = 'Next';
    nextBtn.onclick = next;
  } else {
    sceneLog.innerHTML = '';
    target = sceneLog;
    nextBtn.textContent = 'Next';
    nextBtn.onclick = next;
  }
  fadeSwap(currentEl, target);
  currentEl = target;
}

function next(){
  const scene = scenes[sceneIndex];
  if(sceneIndex === scenes.length - 1){
    // Final scene handled by showScene()
    return;
  }
  if(scene.page){
    sceneIndex++;
    if(sceneIndex < scenes.length){
      showScene();
    }
  } else if(lineIndex < scene.lines.length){
    append(scene.lines[lineIndex]);
    lineIndex++;
  } else {
    sceneIndex++;
    if(sceneIndex < scenes.length){
      showScene();
    } else {
      nextBtn.disabled = true;
    }
  }
}

nextBtn.addEventListener('click', next);

window.onload = function(){
  showScene();
};
