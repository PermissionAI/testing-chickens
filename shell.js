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
  {name: 'Scene 4', lines: [
    'Almost done! This is scene four.',
    'Wrap up any remaining details.'
  ]},
  {name: 'End', lines: [
    'Thanks for watching the demo.',
    'Feel free to restart if you would like to see it again.'
  ]}
];

let sceneIndex = 0;
let lineIndex = 0;

const sceneName = q('sceneName');
const sceneLog = q('sceneLog');
const nextBtn = q('nextBtn');

function append(text){
  const p = document.createElement('p');
  p.textContent = text;
  sceneLog.appendChild(p);
  sceneLog.scrollTop = sceneLog.scrollHeight;
}

function showScene(){
  sceneName.textContent = scenes[sceneIndex].name;
  sceneLog.innerHTML = '';
  lineIndex = 0;
}

function next(){
  const scene = scenes[sceneIndex];
  if(lineIndex < scene.lines.length){
    append(scene.lines[lineIndex]);
    lineIndex++;
    if(sceneIndex === scenes.length - 1 && lineIndex === scene.lines.length){
      nextBtn.textContent = 'Done';
    }
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
