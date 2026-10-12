(function(){
  // Puntos sobre la web: cada botón cambia la captura y mueve el punto
  document.querySelectorAll('.hs').forEach(function(hs){
    var img=hs.querySelector('.hs-screen img'),dot=hs.querySelector('.hs-dot'),btns=hs.querySelectorAll('.hs-list button');
    btns.forEach(function(b,i){
      b.addEventListener('click',function(){
        btns.forEach(function(o){o.setAttribute('aria-pressed','false')});
        b.setAttribute('aria-pressed','true');
        if(img.getAttribute('src')!==b.dataset.img){img.style.opacity=0;var n=new Image();n.onload=function(){img.src=b.dataset.img;img.alt=b.dataset.alt||'';img.style.opacity=1};n.src=b.dataset.img}
        dot.style.left=b.dataset.x+'%';dot.style.top=b.dataset.y+'%';dot.textContent=i+1;
      });
      // precarga discreta
      if(i>0){var p=new Image();p.loading='lazy';setTimeout(function(){p.src=b.dataset.img},2500)}
    });
  });
  // Índice lateral: marca la sección visible
  var toc=document.querySelector('.fx-toc');
  if(toc&&'IntersectionObserver' in window){
    var links={};toc.querySelectorAll('a[href^="#"]').forEach(function(a){links[a.getAttribute('href').slice(1)]=a});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var a=links[e.target.id];if(!a)return;
      toc.querySelectorAll('a').forEach(function(o){o.removeAttribute('aria-current')});a.setAttribute('aria-current','true');
      if(window.innerWidth<=900&&a.scrollIntoView){var ol=a.parentNode.parentNode;ol.scrollTo({left:a.offsetLeft-16,behavior:'smooth'})}}})},{rootMargin:'-40% 0px -55% 0px'});
    Object.keys(links).forEach(function(id){var s=document.getElementById(id);if(s)io.observe(s)});
  }
})();
