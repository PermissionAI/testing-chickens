function q(id){return document.getElementById(id);}

const params = new URLSearchParams(window.location.search);
const demo = params.get('demo');
const scene = params.get('scene');

const chatLog = q('chatLog');
const chatDiv = q('chat');
const landing = q('landing');
const dashboard = q('dashboard');
const optInBtn = q('optInBtn');
const featuredBrandEl = q('featuredBrand');
const nextBtn = q('nextBtn');
const minChatBtn = q('minChatBtn');
const openChatBtn = q('openChatBtn');
const incomeModal = q('incomeModal');
const verifyCompleteBtn = q('verifyCompleteBtn');
const sceneNextBtn = q('sceneNextBtn');
const wrapScene = q('wrapUpScene');
const wrapBrands = q('wrapBrands');
const totalAskEl = q('totalAsk');
const recentActivityEl = q('recentActivity');
const restartBtn = q('restartBtn');
const dashNextBtn = q('dashboardNextBtn');
let actionBtn = null;

function hideNext(){ nextBtn.classList.add('hidden'); }
function showNext(){ nextBtn.classList.remove('hidden'); }

const featuredBrand = 'Diaper Brand #1';

let pair = 0;
let expecting = 'user';
const conversation = [
  {
    ai: `Hey, thanks for opting in to ${featuredBrand}! Have you ever bought from them before?`,
    user: "Not yet — just found out I’m expecting our first. Trying to get ahead of things but... kinda overwhelmed."
  },
  {
    ai: "Omg, congrats 🎉 That’s amazing. Totally get it — it’s a lot all at once. Anything in particular you’re feeling nervous about?",
    user: "Honestly? Just... everything. Budget’s tight. I’m just trying to get our ducks in a row."
  },
  {
    ai: "Makes total sense. If it helps — a lot of brands here offer extra support for growing families. You can verify your household income to unlock personalized offers. Want to give it a shot?",
    user: null
  }
];

function append(msg, cls){
  const p = document.createElement('p');
  p.textContent = msg;
  if(cls) p.className = cls;
  chatLog.appendChild(p);
  chatLog.scrollTop = chatLog.scrollHeight;
  return p;
}

function displaySequence(msgs, done){
  let i = 0;
  function next(){
    if(i < msgs.length){
      const el = append(msgs[i], 'ai');
      i++;
      el.onclick = () => {
        el.onclick = null;
        next();
      };
    } else if(done){
      done();
    }
  }
  next();
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

function showWrapUp(){
  chatDiv.classList.add('hidden');
  if(openChatBtn) openChatBtn.classList.add('hidden');
  if(wrapScene){
    updateWrapUp();
    wrapScene.classList.remove('hidden');
  }
}

function showChat(){
  landing.classList.add('hidden');
  chatDiv.classList.remove('hidden');
  chatDiv.style.display = '';
  if(openChatBtn) openChatBtn.classList.add('hidden');
}

function startChat(){
  showChat();
  pair = 0;
  expecting = 'user';
  showNext();
  append(conversation[0].ai, 'ai');
}

function showVerify(){
  hideNext();
  if(actionBtn) actionBtn.remove();
  const btn = document.createElement('button');
  btn.className = 'button';
  btn.textContent = 'Verify Now';
  btn.onclick = () => {
    incomeModal.classList.remove('hidden');
  };
  chatLog.appendChild(btn);
  actionBtn = btn;
}

function handleNext(){
  if(pair >= conversation.length){
    hideNext();
    return;
  }
  const curr = conversation[pair];
  if(expecting === 'user'){
    if(curr.user){
      append(curr.user, 'user');
      pair++;
      expecting = 'ai';
    } else {
      showVerify();
      pair++;
    }
  } else {
    append(curr.ai, 'ai');
    expecting = 'user';
  }
}

verifyCompleteBtn.onclick = () => {
  incomeModal.classList.add('hidden');
  append('Income verified! You earned', 'ai');
  const badge = document.createElement('span');
  badge.className = 'reward-badge';
  badge.textContent = 'ASK';
  chatLog.appendChild(badge);
  chatLog.appendChild(document.createElement('br'));
  if(actionBtn){
    actionBtn.remove();
    actionBtn = null;
  }
  hideNext();
  sceneNextBtn.classList.remove('hidden');
};

sceneNextBtn.onclick = () => {
  window.location.href = 'brand.html';
};

function updateDashboard(){
  const brandsDiv = q('brands');
  const offersDiv = q('offers');
  brandsDiv.innerHTML = '<h3>Opted-In Brands</h3>';
  offersDiv.innerHTML = '<h3>Current Offers</h3>';
  const brands = JSON.parse(localStorage.getItem('optedInBrands') || '[]');
  brands.forEach(b => {
    const p = document.createElement('p');
    p.textContent = b;
    brandsDiv.appendChild(p);
  });
  const offers = JSON.parse(localStorage.getItem('offers') || '[]');
  offers.forEach(o => {
    const p = document.createElement('p');
    p.textContent = o.brand + ': ' + o.reward;
    offersDiv.appendChild(p);
  });
}

function checkOffers(){
  const notified = sessionStorage.getItem('notified');
  const offers = JSON.parse(localStorage.getItem('offers') || '[]');
  if(!notified && offers.length){
    const o = offers[offers.length-1];
    const msgs = [
      'Hey, just got some good news —',
      'Diaper Brand 2 launched a new offer made for new parents like you.',
      "You've unlocked a special bonus from them — " + o.reward +
      ' — because you seem like a perfect match. Want to join?'
    ];
    sessionStorage.setItem('notified', '1');
    displaySequence(msgs, () => {
      const btn = document.createElement('button');
      btn.className = 'button';
      btn.textContent = 'Join Offer';
      btn.onclick = () => {
        const brands = JSON.parse(localStorage.getItem('optedInBrands') || '[]');
        if(!brands.includes(o.brand)) brands.push(o.brand);
        localStorage.setItem('optedInBrands', JSON.stringify(brands));
        updateDashboard();
        displaySequence([
          "Nice. You're all set.",
          "Oh btw — have you looked into baby food subscriptions yet? Happy to help you find one if you're interested."
        ], () => {
          const next = q('nextBtn');
          if(next){
            next.onclick = showWrapUp;
            next.classList.remove('hidden');
          }
        });
      };
      chatLog.appendChild(btn);
    });
  }
}

function autoDemo(){
  optInBtn.click();
  function sendNext(){
    if(pair < conversation.length){
      nextBtn.click();
      setTimeout(sendNext, 500);
    } else {
      const btn = chatLog.querySelector('button');
      if(btn) btn.click();
    }
  }
  setTimeout(sendNext, 500);
}

function guidedDemo(){
  nextBtn.addEventListener('click', () => {
    if(pair < conversation.length){
      // prefill is implicit; just advance
      setTimeout(() => {}, 0);
    }
  });
}

optInBtn.onclick = () => {
  const brands = JSON.parse(localStorage.getItem('optedInBrands') || '[]');
  if(!brands.includes(featuredBrand)){
    brands.push(featuredBrand);
    localStorage.setItem('optedInBrands', JSON.stringify(brands));
  }
  startChat();
  updateDashboard();
};

nextBtn.onclick = handleNext;

if(minChatBtn){
  minChatBtn.onclick = () => {
    chatDiv.classList.add('hidden');
    chatDiv.style.display = 'none';
    if(openChatBtn) openChatBtn.classList.remove('hidden');
  };
}

if(openChatBtn){
  openChatBtn.onclick = showChat;
}

if(restartBtn){
  restartBtn.onclick = () => window.location.href = 'demo.html';
}

if(dashNextBtn){
  dashNextBtn.onclick = showWrapUp;
}

window.onload = function(){
  if(featuredBrandEl) featuredBrandEl.textContent = featuredBrand;
  updateDashboard();
  setInterval(checkOffers, 3000);
  if(scene === 'final'){
    showChat();
    document.body.classList.add('scene-final');
  }
  if(demo && scene !== 'final'){
    setTimeout(guidedDemo, 500);
  }
};
