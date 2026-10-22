// Presentation/accessibility only. Questions, scoring and submission stay in the supplied script.
document.querySelectorAll('.scan-shell .form-group').forEach(group=>{
  const label=group.querySelector('label'),input=group.querySelector('input');
  if(label&&input)label.htmlFor=input.id;
});
function enhanceOptions(){document.querySelectorAll('.scan-shell .opt').forEach(el=>{
  el.setAttribute('role','button');el.tabIndex=0;
  el.setAttribute('aria-pressed',String(el.classList.contains('selected')));
  el.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();el.click();}};
});}
const scanQuestions=document.getElementById('q-wrap');
if(scanQuestions)new MutationObserver(enhanceOptions).observe(scanQuestions,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
const scanStatus=document.getElementById('rapport-status');
if(scanStatus)scanStatus.setAttribute('aria-live','polite');
enhanceOptions();
