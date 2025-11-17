const SECRET_PIN = '1234';
const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 20;


const pinOverlay = document.getElementById('pinOverlay');
const pinInput = document.getElementById('pinInput');
const unlockBtn = document.getElementById('unlockBtn');
const cancelBtn = document.getElementById('cancelBtn');
const errorEl = document.getElementById('error');
const interior = document.getElementById('interior');


const UNLOCKED_KEY = 'birthday_unlocked_v1';
const ATTEMPTS_KEY = 'birthday_attempts_v1';
const LOCKED_UNTIL_KEY = 'birthday_locked_until_v1';


function nowSec(){return Math.floor(Date.now()/1000);}
function setError(msg){ errorEl.textContent = msg || ''; }
function showInterior(){ pinOverlay.setAttribute('aria-hidden','true'); pinOverlay.classList.add('hidden'); interior.classList.remove('hidden'); startConfetti(); }
function lockoutRemaining(){ const until = Number(localStorage.getItem(LOCKED_UNTIL_KEY) || 0); return Math.max(0, until - nowSec()); }


function checkUnlockedOnLoad(){ const unlocked = sessionStorage.getItem(UNLOCKED_KEY); if(unlocked === '1') return showInterior(); const remaining = lockoutRemaining(); if(remaining>0){ setError('Too many attempts. Try again in ' + remaining + 's.'); unlockBtn.disabled = true; pinInput.disabled = true; setTimeout(()=>location.reload(), (remaining+1)*1000); }}


unlockBtn.addEventListener('click', ()=>{
const entered = (pinInput.value || '').trim();
if(!entered){ setError('Please enter the PIN.'); return }
const remaining = lockoutRemaining();
if(remaining>0){ setError('Locked. Try again in ' + remaining + 's.'); return }
if(entered === SECRET_PIN){ sessionStorage.setItem(UNLOCKED_KEY,'1'); localStorage.removeItem(ATTEMPTS_KEY); localStorage.removeItem(LOCKED_UNTIL_KEY); setError(''); showInterior(); }
else { const attempts = Number(localStorage.getItem(ATTEMPTS_KEY) || 0) + 1; localStorage.setItem(ATTEMPTS_KEY,attempts); if(attempts>=MAX_ATTEMPTS){ const until=nowSec()+LOCKOUT_SECONDS; localStorage.setItem(LOCKED_UNTIL_KEY,String(until)); setError('Too many wrong attempts. Locked for ' + LOCKOUT_SECONDS + 's.'); unlockBtn.disabled=true; pinInput.disabled=true; setTimeout(()=>location.reload(),(LOCKOUT_SECONDS+1)*1000);} else{ const left=MAX_ATTEMPTS-attempts; setError('Wrong PIN. '+left+' attempt(s) left.'); pinInput.value=''; pinInput.focus(); } }
});


cancelBtn.addEventListener('click',()=>{ pinInput.value=''; setError(''); });
pinInput.addEventListener('keydown',(e)=>{ if(e.key==='Enter') unlockBtn.click(); });
checkUnlockedOnLoad();
pinInput.focus();


function startConfetti(){ const canvas=document.getElementById('confettiCanvas'); const ctx=canvas.getContext('2d'); canvas.width=window.innerWidth; canvas.height=window.innerHeight; const confetti=[]; for(let i=0;i<150;i++){ confetti.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*6+2,d:Math.random()*50+10,color:`hsl(${Math.random()*360},100%,50%)`,tilt:Math.random()*10-10,tiltAngleIncrement:Math.random()*0.07+0.05,tiltAngle:0}); } function draw(){ ctx.clearRect(0,0,canvas.width,canvas.height); for(let i=0;i<confetti.length;i++){ let c=confetti[i]; c.tiltAngle+=c.tiltAngleIncrement; c.y+=(Math.cos(c.d)+3+c.r/2)/2; c.tilt=Math.sin(c.tiltAngle)*15; ctx.beginPath(); ctx.lineWidth=c.r; ctx.strokeStyle=c.color; ctx.moveTo(c.x+c.tilt+c.r/2,c.y); ctx.lineTo(c.x+c.tilt,c.y+c.tilt+c.r/2); ctx.stroke(); } requestAnimationFrame(draw); } draw(); }


const guestBtn=document.getElementById('guestBtn');
const guestInput=document.getElementById('guestInput');
const guestMessages=document.getElementById('guestMessages');
let messages=[];
guessBtn.addEventListener('click',()=>{ const val=guestInput.value.trim(); if(val){ messages.push(val); guestInput.value=''; renderMessages(); }});
function renderMessages(){ guestMessages.innerHTML=''; messages.forEach(m=>{ const p=document.createElement('p'); p.textContent=m; guestMessages.appendChild(p); }); }
