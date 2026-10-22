'use strict';
// A back/forward cache visit restores a document instead of loading a new one.
// Replay on that visit too, while respecting the visitor's motion preference.
window.addEventListener('pageshow',event=>{
 if(!event.persisted||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 document.querySelectorAll('.header .logo-pen').forEach(path=>{
  path.getAnimations().forEach(animation=>{animation.cancel();animation.play();});
 });
});
