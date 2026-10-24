'use strict';
const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#navigation');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');navigation.classList.remove('is-open');navigation.querySelectorAll('details').forEach(d=>d.open=false);}
menuButton.addEventListener('click',()=>{const expanded=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!expanded));navigation.classList.toggle('is-open',!expanded);});
navigation.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus();}});
const dialog=document.querySelector('#prototype');
let dialogReturnFocus=null;
document.addEventListener('click',event=>{const link=event.target.closest('[data-destination]');if(!link)return;event.preventDefault();dialogReturnFocus=link.closest('#navigation')?(getComputedStyle(menuButton).display!=='none'?menuButton:link.closest('details')?.querySelector('summary')||link):link;if(link.closest('#navigation'))closeMenu();document.querySelector('#dialog-message').textContent=link.dataset.message||'Deze bestemming wordt in een volgende stap uitgewerkt. Je blijft in de lokale preview.';document.querySelector('.destination').textContent=link.dataset.destination;dialog.showModal();},true);
dialog.addEventListener('close',()=>dialogReturnFocus?.focus());
document.querySelectorAll('.dialog-close,.dialog-back').forEach(button=>button.addEventListener('click',()=>dialog.close()));
const moments=[...document.querySelectorAll('.moment')];
function setMoment(panel,open){panel.classList.toggle('is-active',open);panel.querySelector('.moment-toggle').setAttribute('aria-expanded',String(open));panel.querySelector('.moment-detail').hidden=!open;panel.querySelector('.moment-indicator').textContent=open?'−':'+';}
moments.forEach(panel=>panel.querySelector('.moment-toggle').addEventListener('click',()=>{const opening=!panel.classList.contains('is-active');moments.forEach(other=>setMoment(other,other===panel&&opening));}));
window.matchMedia('(min-width:1151px)').addEventListener('change',closeMenu);
const form=document.querySelector('#contact-form');
const fields=form?[...form.querySelectorAll('input,textarea')]:[];
const status=document.querySelector('#form-status');
function validate(field){let error='';if(field.required&&!field.value.trim())error=({name:'Vul je naam in.',company:'Vul je bedrijfsnaam in.',email:'Vul je e-mailadres in.',message:'Vertel kort wat er speelt.'})[field.id];else if(field.type==='email'&&field.validity.typeMismatch)error='Vul een geldig e-mailadres in, bijvoorbeeld naam@bedrijf.nl.';field.setAttribute('aria-invalid',String(Boolean(error)));document.getElementById(field.id+'-error').textContent=error;return !error;}
fields.forEach(field=>field.addEventListener('input',()=>{if(field.getAttribute('aria-invalid')==='true')validate(field);status.hidden=true;}));
form?.addEventListener('submit',async event=>{
  event.preventDefault(); if(form.dataset.sending==='true')return;
  status.hidden=true;let firstInvalid;
  fields.forEach(field=>{if(!validate(field)&&!firstInvalid)firstInvalid=field;});
  if(firstInvalid){firstInvalid.focus();return;}
  const button=form.querySelector('[type="submit"]');form.dataset.sending='true';button.disabled=true;
  status.textContent='Je bericht wordt verzonden…';status.hidden=false;
  try {
    const data=new FormData(form);data.set('_subject','Kennismaking via Studio Van der Horst');
    const response=await fetch(form.action,{method:'POST',body:data,headers:{Accept:'application/json'}});
    if(!response.ok)throw new Error('Verzenden mislukt');
    status.textContent='Bedankt voor je bericht. Ik neem binnen 48 uur contact met je op.';form.reset();
  } catch(error) {
    status.textContent='Je bericht kon niet worden verzonden. Probeer opnieuw of mail naar fred@studiovanderhorst.nl. Je ingevulde gegevens zijn bewaard in dit formulier.';
  } finally {form.dataset.sending='false';button.disabled=false;status.focus();}
});
const adviceMenu=document.querySelector('.advice-menu');
adviceMenu.addEventListener('keydown',event=>{if(event.key==='Escape'&&adviceMenu.open){event.stopPropagation();adviceMenu.open=false;adviceMenu.querySelector('summary').focus();}});
document.addEventListener('click',event=>{if(!adviceMenu.contains(event.target))adviceMenu.open=false;});

const routeButtons=[...document.querySelectorAll('.route-choice')];
routeButtons.forEach(button=>button.addEventListener('click',()=>{
  const opening=button.getAttribute('aria-expanded')!=='true';
  routeButtons.forEach(other=>{const selected=other===button&&opening;other.setAttribute('aria-expanded',String(selected));other.querySelector('.route-sign').textContent=selected?'−':'+';document.getElementById(other.getAttribute('aria-controls')).hidden=!selected;});
  document.querySelector('#route-status').textContent=opening?'Voorbeeldroute geopend: '+button.children[1].textContent+'. De algemene werkmomenten blijven hieronder beschikbaar.':'Algemene werkmomenten getoond. Er is geen route geselecteerd.';
}));

// Projectfotografie: handmatig bladeren, native dialog en focus terug naar de foto.
const viewer=document.querySelector('.photo-viewer');
if(viewer){
 const photos=[...document.querySelectorAll('.gallery-open')];let current=0,opener=null,touchStart=null;
 const picture=viewer.querySelector('.viewer-image');
 function showPhoto(index){current=(index+photos.length)%photos.length;const link=photos[current];picture.src=link.href;picture.alt=link.querySelector('img').alt;viewer.querySelector('.viewer-caption').textContent=link.dataset.caption;viewer.querySelector('.viewer-count').textContent=`Foto ${current+1} van ${photos.length}`;}
 photos.forEach((link,index)=>link.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();opener=link;showPhoto(index);viewer.showModal();document.documentElement.classList.add('viewer-is-open');}));
 viewer.querySelector('.viewer-close').addEventListener('click',()=>viewer.close());
 viewer.querySelector('.viewer-prev').addEventListener('click',()=>showPhoto(current-1));viewer.querySelector('.viewer-next').addEventListener('click',()=>showPhoto(current+1));
 viewer.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();showPhoto(current+(event.key==='ArrowRight'?1:-1));}});
 viewer.addEventListener('close',()=>{document.documentElement.classList.remove('viewer-is-open');opener?.focus({preventScroll:true});});
 picture.addEventListener('touchstart',event=>{if(event.touches.length===1)touchStart={x:event.touches[0].clientX,y:event.touches[0].clientY};},{passive:true});
 picture.addEventListener('touchend',event=>{if(!touchStart)return;const dx=event.changedTouches[0].clientX-touchStart.x,dy=event.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)showPhoto(current+(dx<0?1:-1));touchStart=null;},{passive:true});
 picture.addEventListener('touchcancel',()=>touchStart=null);
}

// Rustige hero: geen automatische beweging bij reduced motion of buiten beeld.
const heroShow=document.querySelector('.hero-slideshow');
if(heroShow){
 const slides=[...heroShow.querySelectorAll('.hero-slide')],buttons=[...heroShow.querySelectorAll('[data-hero-slide]')],pause=heroShow.querySelector('.hero-pause'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 let index=0,paused=motion.matches,timer=null,inView=true;
 function render(){slides.forEach((s,i)=>{s.classList.toggle('is-current',i===index);s.setAttribute('aria-hidden',String(i!==index));buttons[i]?.setAttribute('aria-pressed',String(i===index));});heroShow.querySelector('#hero-project-name').textContent=['MACS','Van Breda Risk & Benefits'][index];}
 function schedule(){clearInterval(timer);pause.textContent=paused?'Afspelen':'Pauzeren';pause.setAttribute('aria-label',paused?'Start fotowisseling':'Pauzeer fotowisseling');if(!paused&&!document.hidden&&inView)timer=setInterval(()=>{index=(index+1)%slides.length;render();},7000);}
 buttons.forEach((b,i)=>b.addEventListener('click',()=>{index=i;paused=true;render();schedule();}));pause.addEventListener('click',()=>{paused=!paused;schedule();});heroShow.addEventListener('focusin',event=>{if(event.target!==pause){paused=true;schedule();}});motion.addEventListener('change',()=>{paused=motion.matches;schedule();});document.addEventListener('visibilitychange',schedule);new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;schedule();}).observe(heroShow);schedule();
}

// Houd ankerlinks en het mobiele menu vrij van de vaste bovenbalk, ook bij tekstvergroting.
const stickyHeader = document.querySelector('.header');
if (stickyHeader) {
  const updateHeaderHeight = () => document.documentElement.style.setProperty('--site-header-height', `${Math.ceil(stickyHeader.getBoundingClientRect().height)}px`);
  updateHeaderHeight();
  if ('ResizeObserver' in window) new ResizeObserver(updateHeaderHeight).observe(stickyHeader);
  document.querySelectorAll('a[href="#top"]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({top:0, behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }));
}
