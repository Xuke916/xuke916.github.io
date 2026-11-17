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
  const content=window.PORTFOLIO_CONTENT;
  return '<header class="wp-opening"><h1 class="detail-hero-title wp-display" tabindex="-1" aria-label="ON DESIGN"><span class="wp-on" data-language-label="true"><span class="wp-sr">ON </span><svg viewBox="0 0 320 260" aria-hidden="true"><path pathLength="1" d="M130 45C80 8 27 84 19 160S77 230 123 155 169 31 130 45M144 216 202 45C204 104 207 166 224 199L300 14"/></svg></span><strong data-language-label="true">DESIGN</strong></h1><figure class="wp-opening-portrait"><img src="'+esc(content.heroHelmetImage)+'" srcset="'+esc(content.heroHelmetImageSmall)+' 640w, '+esc(content.heroHelmetImage)+' 1448w" sizes="(max-width:700px) 120vw, 74vw" width="1448" height="1086" alt="XU KE 的棒球头盔侧影" fetchpriority="high" decoding="async"></figure><div class="wp-opening-content"><div class="wp-opening-meta"><span class="wp-entry" style="--entry-delay:100ms">XU KE</span><span class="wp-entry" style="--entry-delay:170ms">GAME DESIGN</span><span class="wp-entry" style="--entry-delay:240ms">CONCEPT ART</span></div><div class="wp-opening-intro"><span class="wp-kicker wp-entry" style="--entry-delay:300ms">XU KE / PORTFOLIO</span><p class="wp-intro-line" data-language-label="true" style="--line-index:0"><span>游戏制作、战斗设计与概念美术。</span></p><p class="wp-intro-line" data-language-label="true" style="--line-index:1"><span>为工作室原创动作游戏 Rewinder 获得投资，推进项目制作。</span></p></div><div class="wp-opening-facts"><div class="wp-entry" style="--entry-delay:650ms"><span class="wp-date">学习</span><strong>中国传媒大学</strong><span>动画 · 游戏美术</span></div><div class="wp-entry" style="--entry-delay:730ms"><span class="wp-date">创作</span><strong>Rewinder</strong><span>制作人</span></div><div class="wp-entry" style="--entry-delay:810ms"><span class="wp-date">设计与工具</span><strong>Unreal Engine 5</strong><span>战斗机制 · 场景概念设计</span></div></div><button class="detail-scroll wp-entry" style="--entry-delay:900ms" data-section="projects">SCROLL TO EXPLORE <span>↓</span></button></div></header>';
 }
 function render(){return opening()+'<div class="wp-layout"><aside class="wp-identity"><img src="assets/work/xu-ke-avatar.webp" width="640" height="640" alt="XU KE 的头像：红底像素绵羊" loading="lazy" decoding="async"><p>XU KE</p><span>GAME DESIGN<br>CONCEPT ART</span></aside><div class="wp-content" lang="'+(language==='en'?'en':'zh-CN')+'">'+body()+'</div></div>';}
 function mount(root,{reduced=false}={}){
  const opening=root.querySelector('.wp-opening'),reading=root.querySelector('.wp-layout'),paragraphs=[...opening.querySelectorAll('.wp-intro-line')],copy=paragraphs.map(p=>p.textContent);let observer,frame=0,copyWidth=0;
  function wrapCopy(){
   const width=opening.querySelector('.wp-opening-content').offsetWidth;copyWidth=width;let lineIndex=0;
   paragraphs.forEach((p,i)=>{
    const text=window.PortfolioLanguage?.language==='en'?window.PortfolioLanguage.translate(copy[i]):copy[i];
    const tokens=/[\u3400-\u9fff]/.test(text)?Array.from(text):text.match(/\S+\s*/g)||[text];
    const spans=tokens.map(token=>{const span=document.createElement('span');span.style.cssText='display:inline-block;white-space:pre';span.textContent=token;return span;});p.replaceChildren(...spans);
    const rows=[];let top=-1;for(const span of spans){if(span.offsetTop!==top){top=span.offsetTop;rows.push('');}rows[rows.length-1]+=span.textContent;}
    p.replaceChildren(...rows.map(text=>{const row=document.createElement('span'),label=document.createElement('span');row.className='wp-wipe-line';row.style.setProperty('--line-index',lineIndex++);label.textContent=text;row.append(label);if(opening.classList.contains('is-entered')){row.classList.add('wp-copy-static');}return row;}));
   });
  }
  wrapCopy();const languageChanged=()=>wrapCopy();document.addEventListener('portfolio:languagechange',languageChanged);
  const copyResize=typeof ResizeObserver==='undefined'?null:new ResizeObserver(()=>{if(opening.querySelector('.wp-opening-content').offsetWidth!==copyWidth)wrapCopy();});copyResize?.observe(opening.querySelector('.wp-opening-content'));
  const reveal=()=>{const targets=reading.querySelectorAll('.wp-identity,.wp-heading,.wp-content h2,.wp-content ol li,.wp-notes,.wp-projects-link');for(const el of targets){el.classList.add('wp-reading-entry');if(reduced||typeof IntersectionObserver==='undefined')el.classList.add('is-revealed');else observer.observe(el);}};
  if(!reduced&&typeof IntersectionObserver!=='undefined')observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('is-revealed');observer.unobserve(e.target);}},{rootMargin:'0px 0px -8% 0px',threshold:.08});
  reveal();const mutations=new MutationObserver(()=>reveal());mutations.observe(reading.querySelector('.wp-content'),{childList:true});
  opening.classList.add('wp-motion');
  const cleanup=()=>{cancelAnimationFrame(frame);observer?.disconnect();mutations.disconnect();copyResize?.disconnect();document.removeEventListener('portfolio:languagechange',languageChanged);};
  cleanup.enter=()=>{if(frame||opening.classList.contains('is-entered'))return;frame=requestAnimationFrame(()=>{frame=0;opening.classList.add('is-entered');});};
  return cleanup;
 }
 function apply(root,lang){if(!['zh','en'].includes(lang))return;language=lang;const content=root.querySelector('.wp-content');content.lang=lang==='en'?'en':'zh-CN';content.innerHTML=body();content.querySelector(`[data-resume-language="${lang}"]`).focus({preventScroll:true});}
 window.WorkProfile={render,apply,mount};
})();
