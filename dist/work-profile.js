(() => {
 'use strict';
 let language='zh';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const english={
  background:[
   {date:'Sep 2023 — Sep 2027 (expected)',title:'Communication University of China',text:'B.A. candidate in Animation, specializing in Game Art.'},
   {date:'Jun 2025 — Present',title:'Absolutely Games · Producer',text:'Secured investment for Rewinder, the studio’s original action game, and oversee its production.'},
   {date:'Dec 2025 — Apr 2026',title:'NetEase ThunderFire · Zhurong Studio',text:'Combat designer responsible for a two-branch finishing ability for the Hongmao Lantu Qixia Zhuan crossover, from mechanics and balancing to implementation and presentation. Collaborated with artists and programmers to ship the feature, and refined combat feedback for knockback and seasonal accessories.'},
   {date:'On the field',title:'Vice-Captain · University Baseball Team',text:'Capital Baseball Tournament: runner-up in 2024; third place in 2025 and 2026.'}
  ],
  recognition:'Best Game Jam nominations at indiePlay (2025, 2026); Outstanding Work Award at TapTap Spotlight (2025); POP MART Corporate Special Award at the National College Student Advertising Art Competition (2025).',
  skills:['Combat mechanics','Ability design','Game balancing','Environment concept design']
 };
 function body(){
  const en=!window.PortfolioLanguage&&language==='en',p=window.PORTFOLIO_CONTENT.pages.life.profile,c=en?english:p;
  const entries=items=>items.map(x=>`<li><span class="wp-date">${esc(x.date)}</span><h3>${x.route?`<a href="#${esc(x.route)}" data-project-route="${esc(x.route)}">${esc(x.title)} <span aria-hidden="true">↗</span></a>`:esc(x.title)}</h3><p>${esc(x.text)}</p></li>`).join('');
  return `<div class="wp-heading"><div><span class="wp-kicker">XU KE / PORTFOLIO</span><h2 class="wp-resume-title">${en?'About XuKe':'关于 XuKe'}</h2><p>${en?'Game production, combat design and concept art.':'游戏制作、战斗设计与概念美术。'}</p></div><div class="wp-language" role="group" aria-label="${en?'Résumé language':'简历语言'}"><button type="button" data-resume-language="zh" aria-pressed="${!en}" lang="zh-CN">中文</button><button type="button" data-resume-language="en" aria-pressed="${en}" lang="en">EN</button></div></div>
  <div class="wp-columns"><section class="wp-experience"><h2>${en?'Education & experience':'学习与经历'}</h2><ol>${entries(c.background)}</ol></section><section class="wp-awards"><h2>${en?'Awards & recognition':'获奖经历'}</h2><ol>${c.recognition.split(en?';':'；').map(x=>`<li><p>${esc(x.trim())}</p></li>`).join('')}</ol></section></div>
  <div class="wp-notes"><section><h2>${en?'Design & tools':'设计与工具'}</h2><p>${c.skills.map(esc).join(' · ')}</p><ul>${p.tools.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section></div><button class="wp-projects-link" data-section="projects">${en?'Explore the projects':'浏览个人项目'} <span aria-hidden="true">↓</span></button>`;
 }
 function opening(){
  return '<header class="wp-opening"><h1 class="detail-hero-title wp-display" tabindex="-1" aria-label="ON DESIGN"><span class="wp-on" data-language-label="true"><span class="wp-sr">ON </span><svg viewBox="0 0 320 260" aria-hidden="true"><path pathLength="1" d="M130 45C80 8 27 84 19 160S77 230 123 155 169 31 130 45M144 216 202 45C204 104 207 166 224 199L300 14"/></svg></span><strong data-language-label="true">DESIGN</strong></h1></header>';
 }
 function render(){return opening()+'<div class="wp-layout"><aside class="wp-identity"><img src="assets/work/xu-ke-avatar.webp" width="640" height="640" alt="XU KE 的头像：红底像素绵羊" loading="lazy" decoding="async"><p>XU KE</p><span>GAME DESIGN<br>CONCEPT ART</span></aside><div class="wp-content" lang="'+(language==='en'?'en':'zh-CN')+'">'+body()+'</div></div>';}
 function mount(root,{reduced=false}={}){
  const opening=root.querySelector('.wp-opening'),reading=root.querySelector('.wp-layout'),targets=new Set(),visible=new Set();let observer,edgeObserver,frame=0,ready=false;
  const selector='.wp-identity>p,.wp-identity>span,.wp-kicker,.wp-resume-title,.wp-heading p,.wp-language button,.wp-content h2,.wp-content h3,.wp-date,.wp-content li>p,.wp-notes p,.wp-notes li,.wp-projects-link,.work-project-list .projects-heading>.mono,.work-project-list .projects-heading h2,.work-project-list .project-dots button,.project-panel-title>.mono,.project-panel-title h3,.project-summary,.project-tags li,.projects-disclosure>span,.projects-disclosure>p,.work-project-list .projects-controls>.mono,.footer-pages>.mono,.footer-socials>.mono,.footer-brand,.footer-legal';
  function reveal(el){
   if(el.classList.contains('wp-wipe-shown'))return;
   if(!reduced){
    const box=el.getBoundingClientRect(),rows=[],walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node;
    while(node=walker.nextNode()){
     if(!node.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(node);
     const rects=typeof range.getClientRects==='function'?[...range.getClientRects()]:[];
     for(const rect of rects){if(!rect.width||!rect.height)continue;let row=rows.find(r=>Math.abs(r.top-rect.top)<rect.height*.4);if(row){row.left=Math.min(row.left,rect.left);row.right=Math.max(row.right,rect.right);row.bottom=Math.max(row.bottom,rect.bottom);}else rows.push({top:rect.top,left:rect.left,right:rect.right,bottom:rect.bottom});}
    }
    const layer=document.createElement('span');layer.className='wp-wipe-layer';layer.setAttribute('aria-hidden','true');
    rows.sort((a,b)=>a.top-b.top).forEach((r,i)=>{const cover=document.createElement('i');cover.style.cssText='left:'+(r.left-box.left)+'px;top:'+(r.top-box.top)+'px;width:'+(r.right-r.left)+'px;height:'+(r.bottom-r.top)+'px;--line-index:'+i;layer.append(cover);});el.append(layer);
   }
   el.classList.add('is-revealed','wp-wipe-shown');observer?.unobserve(el);edgeObserver?.unobserve(el);
  }
  const scan=()=>{for(const el of root.querySelectorAll(selector)){if(targets.has(el))continue;targets.add(el);el.classList.add('wp-text-wipe');if(getComputedStyle(el).position==='static')el.classList.add('wp-wipe-relative');if(reduced||typeof IntersectionObserver==='undefined')reveal(el);else (el.matches('.footer-brand,.footer-legal')?edgeObserver:observer).observe(el);}};
  if(!reduced&&typeof IntersectionObserver!=='undefined'){
   const onEntries=entries=>{for(const e of entries){if(e.isIntersecting){if(ready)reveal(e.target);else visible.add(e.target);}else visible.delete(e.target);}};
   observer=new IntersectionObserver(onEntries,{rootMargin:'0px 0px -8% 0px',threshold:.08});
   edgeObserver=new IntersectionObserver(onEntries,{threshold:.08});
  }
  scan();const mutations=new MutationObserver(()=>{for(const el of targets)if(!root.contains(el)){observer?.unobserve(el);targets.delete(el);}scan();});mutations.observe(reading.querySelector('.wp-content'),{childList:true});
  const clearCovers=()=>{for(const el of targets)el.querySelector(':scope>.wp-wipe-layer')?.remove();};
  document.addEventListener('portfolio:languagechange',clearCovers);addEventListener('resize',clearCovers,{passive:true});
  opening.classList.add('wp-motion');
  const cleanup=()=>{cancelAnimationFrame(frame);observer?.disconnect();edgeObserver?.disconnect();mutations.disconnect();document.removeEventListener('portfolio:languagechange',clearCovers);removeEventListener('resize',clearCovers);};
  cleanup.enter=()=>{if(frame||opening.classList.contains('is-entered'))return;frame=requestAnimationFrame(()=>{frame=0;opening.classList.add('is-entered');ready=true;for(const el of visible)reveal(el);visible.clear();});};
  return cleanup;
 }
 function apply(root,lang){if(!['zh','en'].includes(lang))return;language=lang;const content=root.querySelector('.wp-content');content.lang=lang==='en'?'en':'zh-CN';content.innerHTML=body();content.querySelector(`[data-resume-language="${lang}"]`).focus({preventScroll:true});}
 window.WorkProfile={render,apply,mount};
})();
