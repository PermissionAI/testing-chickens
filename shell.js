function q(id){return document.getElementById(id);}

const scenes = [
  {name: 'Intro', lines: [
    'Welcome to the demo presentation.',
    'Use the Next button to progress through each scene.'
  ]},
  {name: 'Scene 1', lines: [
    'This is the first scene of the demo.',
    'Here you might introduce the main character.'
  ]},
  {name: 'Scene 2', lines: [
    'Now we are in scene two.',
    'Add more narrative or action here.'
  ]},
  {name: 'Scene 3', lines: [
    'Scene three continues the story.',
    'Keep the pacing steady for your audience.'
  ]},
  // The final scene displays a custom UI rather than scripted lines
  {name: 'Scene 4 - Wrap-Up', lines: []}
];

let sceneIndex = 0;
let lineIndex = 0;

const sceneName = q('sceneName');
const sceneLog = q('sceneLog');
const nextBtn = q('nextBtn');
const wrapScene = q('wrapUpScene');
const wrapBrands = q('wrapBrands');
const totalAskEl = q('totalAsk');
const recentActivityEl = q('recentActivity');

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

function showScene(){
  sceneName.textContent = scenes[sceneIndex].name;
  lineIndex = 0;
  if(sceneIndex === scenes.length - 1){
    // Final wrap-up scene
    sceneLog.classList.add('hidden');
    wrapScene.classList.remove('hidden');
    nextBtn.textContent = 'Replay Demo';
    nextBtn.onclick = () => window.location.reload();
    updateWrapUp();
  } else {
    sceneLog.classList.remove('hidden');
    wrapScene.classList.add('hidden');
    sceneLog.innerHTML = '';
    nextBtn.textContent = 'Next';
    nextBtn.onclick = next;
  }
}

function next(){
  const scene = scenes[sceneIndex];
  if(sceneIndex === scenes.length - 1){
    // Final scene handled by showScene()
    return;
  }
  if(lineIndex < scene.lines.length){
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
  next();
};
