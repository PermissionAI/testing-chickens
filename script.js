function q(id){return document.getElementById(id);}

const params = new URLSearchParams(window.location.search);
const demo = params.get('demo');
const scene = params.get('scene');

const chatLog = q('chatLog');
const nextBtn = q('nextBtn');
const chatDiv = q('chat');
const landing = q('landing');
const dashboard = q('dashboard');
const optInBtn = q('optInBtn');
const featuredBrandEl = q('featuredBrand');
const summaryDiv = q('summary');
const finalOverlay = q('finalOverlay');
const replayBtn = q('replayBtn');

const brandNames = [
  'Bambino Diapers',
  'Happy Tush',
  'SnugBug',
  'EcoBaby',
  'SoftCare'
];
const featuredBrand = brandNames[Math.floor(Math.random()*brandNames.length)];

let pair = 0;
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

function startChat(){
  landing.classList.add('hidden');
  chatDiv.classList.remove('hidden');
  pair = 0;
  append(conversation[0].ai, 'ai');
}

function showVerify(){
  const btn = document.createElement('button');
  btn.className = 'button';
  btn.textContent = 'Verify Now';
  btn.onclick = () => {
    incomeModal.classList.remove('hidden');
  };
  chatLog.appendChild(btn);
}

function handleNext(){
  const curr = conversation[pair];
  if(curr.user){
    append(curr.user, 'user');
    pair++;
    if(pair < conversation.length){
      append(conversation[pair].ai, 'ai');
    }
  } else {
    showVerify();
    pair++;
    return;
  }
  if(pair === conversation.length - 1 && conversation[pair].user === null){
    // Next click will show verify
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
    const div = document.createElement('div');
    div.className = 'tile card';
    div.textContent = b;
    brandsDiv.appendChild(div);
  });
  const offers = JSON.parse(localStorage.getItem('offers') || '[]');
  offers.forEach(o => {
    const p = document.createElement('p');
    p.textContent = o.brand + ': ' + o.reward;
    offersDiv.appendChild(p);
  });
  if(summaryDiv){
    const totalAsk = offers.reduce((sum, o) => {
      const m = o.reward.match(/(\d+)\s*ASK/);
      return m ? sum + parseInt(m[1]) : sum;
    }, 0);
    const recent = offers.slice(-3).map(o => o.brand + ': ' + o.reward).join('<br>');
    summaryDiv.innerHTML = '<h3>Summary</h3>' +
      `<p>Total ASK Earned: ${totalAsk}</p>` +
      (recent ? `<p>Recent Activity:</p><p>${recent}</p>` : '');
  }
}

function checkOffers(){
  const notified = sessionStorage.getItem('notified');
  const offers = JSON.parse(localStorage.getItem('offers') || '[]');
  if(!notified && offers.length){
    const o = offers[offers.length-1];
    const msgs = [
      'Hey, just got some good news —',
      'Diaper Brand 2 launched a new offer made for new parents like you.',
      'Includes ' + o.reward + '. Want to check it out?'
    ];
    sessionStorage.setItem('notified', '1');
    displaySequence(msgs, () => {
      const btn = document.createElement('button');
      btn.className = 'button';
      btn.textContent = 'Yes, please';
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
          if(next) next.classList.remove('hidden');
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
      handleNext();
      setTimeout(sendNext, 500);
    } else {
      const btn = chatLog.querySelector('button');
      if(btn) btn.click();
    }
  }
  setTimeout(sendNext, 500);
}

function guidedDemo(){
  optInBtn.click();
  nextBtn.addEventListener('click', () => {
    if(pair < conversation.length){
      // prefill is implicit; just advance
      setTimeout(() => {}, 0);
    }
  });
}

function showFinalOverlay(){
  if(finalOverlay) finalOverlay.classList.remove('hidden');
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

if(replayBtn){
  replayBtn.onclick = () => {
    window.location.href = 'index.html';
  };
}

window.onload = function(){
  if(featuredBrandEl) featuredBrandEl.textContent = featuredBrand;
  updateDashboard();
  setInterval(checkOffers, 3000);
  if(scene === 'final'){
    landing.classList.add('hidden');
    chatDiv.classList.add('hidden');
    dashboard.classList.remove('hidden');
    showFinalOverlay();
  } else {
    if(demo){
      setTimeout(guidedDemo, 500);
    }
  }
};
