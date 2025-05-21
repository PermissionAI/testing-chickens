function q(id){return document.getElementById(id);} 

const chatLog = q('chatLog');
const chatInput = q('chatInput');
const sendBtn = q('sendBtn');
const chatDiv = q('chat');
const landing = q('landing');
const dashboard = q('dashboard');
const optInBtn = q('optInBtn');

let step = 0;
const script = [
  "Hey, thanks for opting in to Diaper Brand 1! Have you ever bought from them before?",
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
      btn.textContent = 'Verify Now';
      btn.onclick = () => location.href = 'income.html';
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
    append('Hey, just got some good news —', 'ai');
    const o = offers[offers.length-1];
    append(o.brand + ' launched a new offer made for new parents like you. Includes ' + o.reward + '. Want to check it out?', 'ai');
    const btn = document.createElement('button');
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

optInBtn.onclick = () => {
  const brands = JSON.parse(localStorage.getItem('optedInBrands') || '[]');
  if(!brands.includes('Diaper Brand #1')){
    brands.push('Diaper Brand #1');
    localStorage.setItem('optedInBrands', JSON.stringify(brands));
  }
  startChat();
  updateDashboard();
};

sendBtn.onclick = handleSend;

window.onload = function(){
  updateDashboard();
  setInterval(checkOffers, 3000);
};
