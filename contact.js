(function(){
'use strict';
var f=document.getElementById('f');if(!f)return;
f.addEventListener('submit',async function(ev){
ev.preventDefault();if(f.dataset.sending==='true'||!f.reportValidity())return;
var b=f.querySelector('button[type=submit]'),label=b.textContent;
var m=document.getElementById('ferr');if(!m){m=document.createElement('p');m.id='ferr';m.setAttribute('role','status');f.appendChild(m);}m.textContent='';
f.dataset.sending='true';b.disabled=true;b.textContent='Enviando…';
try{
var body=new URLSearchParams(new FormData(f));body.set('privacy_v','2026-09-12');
await window.submitConfirmed(f.action,body);
if(window.siteConsent&&window.siteConsent.analyticsAllowed())window.gtag('event','generate_lead',{form_id:'demo',page_location:location.origin+location.pathname});
if(window.siteConsent&&window.siteConsent.adsAllowed()&&window.fbq)window.fbq('track','Lead');
try{sessionStorage.setItem('rt_submission_confirmed',String(Date.now()));}catch(_){}
location.assign('/gracias.html');
}catch(_){m.textContent='No hemos podido confirmar la recepción. Tus datos siguen en el formulario. Antes de repetir el envío, escríbenos a hola@rotulito.com para comprobarlo.';}
finally{f.dataset.sending='false';b.disabled=false;b.textContent=label;}
});
})();
 
