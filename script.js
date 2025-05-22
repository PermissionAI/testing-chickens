function q(id){return document.getElementById(id);}

const params = new URLSearchParams(window.location.search);
const demo = params.get('demo');
const scene = params.get('scene');

const chatLog = q('chatLog');
const chatInput = q('chatInput');
const sendBtn = q('sendBtn');
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

let step = 0;
const script = [
  `Hey, thanks for opting in to ${featuredBrand}! Have you ever bought from them before?`,
  "Omg, congrats 🎉 That's amazing. Totally get it — it's a lot all at once. Anything in particular you're feeling nervous about?",
  "Makes total sense. If it helps — a lot of brands here offer extra support for growing families. You can verify your household income to unlock personalized offers. Want to give it a shot?"
];

function append(msg, cls){
  const p = document.createElement('p');
  p.textContent = msg;
  if(cls) p.className = cls;
  chatLog.appendChild(p);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function startChat(){
  landing.classList.add('hidden');
  chatDiv.classList.remove('hidden');
  append(script[0], 'ai');
}

function handleSend(){
  const val = chatInput.value.trim();
  if(!val) return;
  append(val, 'user');
  chatInput.value = '';
  if(step < script.length){
    if(step === script.length - 1){
      // last step, show verify option
      append(script[step], 'ai');
      const btn = document.createElement('button');
      btn.className = 'button';
      btn.textContent = 'Verify Now';
      btn.onclick = () => {
        const url = demo ? 'income.html?demo=1' : 'income.html';
        location.href = url;
      };
      chatLog.appendChild(btn);
    } else {
      append(script[++step], 'ai');
    }
    step++;
  }
}

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
    append('Hey, just got some good news —', 'ai');
    const o = offers[offers.length-1];
    append(o.brand + ' launched a new offer made for new parents like you. Includes ' + o.reward + '. Want to check it out?', 'ai');
    const btn = document.createElement('button');
    btn.className = 'button';
    btn.textContent = 'Yes, please';
    btn.onclick = () => {
      const brands = JSON.parse(localStorage.getItem('optedInBrands') || '[]');
      if(!brands.includes(o.brand)) brands.push(o.brand);
      localStorage.setItem('optedInBrands', JSON.stringify(brands));
      updateDashboard();
      append('Nice. You\'re all set. Oh btw — have you looked into baby food subscriptions yet? Happy to help you find one if you\'re interested.', 'ai');
    };
    chatLog.appendChild(btn);
    sessionStorage.setItem('notified', '1');
  }
}

function autoDemo(){
  const messages = ['No', 'Just getting started', 'Sure'];
  optInBtn.click();
  let i = 0;
  function sendNext(){
    if(i < messages.length){
      chatInput.value = messages[i];
      handleSend();
      i++;
      setTimeout(sendNext, 500);
    } else {
      setTimeout(() => {
        const btn = chatLog.querySelector('button');
        if(btn) btn.click();
      }, 500);
    }
  }
  setTimeout(sendNext, 500);
}

function guidedDemo(){
  const messages = ['No', 'Just getting started', 'Sure'];
  optInBtn.click();
  let i = 0;
  chatInput.value = messages[i];
  sendBtn.addEventListener('click', () => {
    i++;
    if(i < messages.length){
      setTimeout(() => { chatInput.value = messages[i]; }, 100);
    } else {
      setTimeout(() => {
        const btn = chatLog.querySelector('button');
        if(btn) btn.click();
      }, 500);
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

sendBtn.onclick = handleSend;

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
