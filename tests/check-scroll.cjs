const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '../dist');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
function boot(width, height, reduce = false, initialHash = '', settle = true) {
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'https://portfolio.test/' + initialHash, pretendToBeVisual: true });
  const w = dom.window, d = w.document;
  let y = 0, clock = 0, id = 0, queue = new Map();
  Object.defineProperty(w, 'innerWidth', { value: width, writable: true });
  Object.defineProperty(w, 'innerHeight', { value: height, writable: true });
  Object.defineProperty(w, 'scrollY', { get: () => y });
  Object.defineProperty(d.documentElement, 'scrollHeight', { get: () => d.body.classList.contains('detail-mode') ? Number(d.querySelector('.detail-route')?.dataset.scrollHeight || height) : height * 5.6 });
  Object.defineProperty(w.HTMLElement.prototype, 'offsetHeight', { get() { const c=this.classList;return this.id==='viewport-metric'?height:c.contains('scroll-space') ? height * 5.6 : c.contains('hero-portrait') ? height * (width<=600?.9:1.08) : c.contains('project-detail-hero')?height*1.4:c.contains('project-detail-overview')?height*.8:c.contains('project-detail-gallery')?height*1.6:c.contains('project-pagination')?height*.6:c.contains('portrait-footer')?height*1.05:100; } });
  w.matchMedia = q => ({ matches: q.includes('reduced-motion') ? reduce : true, addEventListener() {} });
  w.requestAnimationFrame = cb => { queue.set(++id, cb); return id; };
  w.cancelAnimationFrame = n => queue.delete(n);
  w.scrollTo = (x, top) => { y = typeof x === 'object' ? x.top : top; w.dispatchEvent(new w.Event('scroll')); };
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new w.Event('close')); };
  w.eval(fs.readFileSync(path.join(root, 'content.js'), 'utf8'));
  w.eval(fs.readFileSync(path.join(root, 'app.js'), 'utf8'));
  w.eval(fs.readFileSync(path.join(root, 'pages.js'), 'utf8'));
  function flush() { for (let i = 0; queue.size && i < 1500; i++) { const jobs = [...queue.values()]; queue.clear(); clock += 16.667; jobs.forEach(cb => cb(clock)); } assert.equal(queue.size, 0, 'animation converges'); }
  function scroll(t) { w.scrollTo(0, t * height / 1.5); flush(); }
  function advance(dt=16.667){const jobs=[...queue.values()];queue.clear();clock+=dt;jobs.forEach(cb=>cb(clock));}
  if(settle)flush();
  return { w, d, scroll, flush, advance };
}
{
 const {w,d,flush,advance}=boot(1600,900,false,'',false),overlay=d.querySelector('.route-transition'),cutout=d.querySelector('.route-cutout');
 assert.equal(overlay.hidden,false);assert.equal(overlay.dataset.effect,'opening');assert.equal(d.querySelector('#experience').inert,true);
 const before=cutout.getAttribute('transform');advance();advance(400);assert.notEqual(cutout.getAttribute('transform'),before,'blue X opens on the initial Home visit');flush();
 assert.equal(overlay.hidden,true);assert.equal(d.querySelector('#experience').inert,false);assert.equal(w.scrollY,0);assert.equal(d.body.style.overflow,'');
 w.PortfolioPages.open('work');assert.equal(overlay.dataset.effect,'fade','interior navigation uses a fade');flush();
 d.querySelector('.project-art-main').click();assert.equal(overlay.dataset.effect,'fade','project entry uses the fade too');flush();w.close();
 const reduced=boot(390,844,true,'',false);assert.equal(reduced.d.querySelector('.route-transition').hidden,true);reduced.w.close();
 console.log('PASS initial Home X reveal, restored input, interior/project fades and reduced-motion bypass');
}
for (const [width,height,reduce] of [[1600,900,false],[390,844,false],[1600,900,true]]) {
 const {w,d,scroll,flush,advance}=boot(width,height,reduce),q=s=>d.querySelector(s);
 assert.equal(q('.gallery-scene'),null);assert.equal(q('.gallery-card'),null);assert.equal(q('.gallery-quote'),null);
 assert.equal(d.querySelectorAll('.chapter-navigation a').length,3);
 assert.equal(q('.index-button'),null,'the removed INDEX button is absent from the shared header');assert.equal(q('.hero-coordinate'),null,'remove the selected IMAGE / 01 label');
 assert.equal(q('.water-ripples').querySelectorAll('animate[attributeName="d"]').length,9,'water rings deform rather than only translating as a flat drawing');
 const opening=q('.hero-portrait').style.transform;scroll(1.5);assert.notEqual(q('.hero-portrait').style.transform,opening);
 scroll(3.35);assert.equal(q('.message-scene').inert,false);assert.equal(q('.hero-scene').style.filter,'grayscale(1)');
 assert.equal(q('.message-signature path').style.strokeDashoffset,'0');
 assert.match(q('.message-marquee.serif').textContent,/GREAT OF ALL TIME/);
 for(const t of [4.3,4.7,5.1,5.5]){scroll(t);assert.ok(+q('.message-signature').style.opacity>0||+q('.split-scene').style.opacity>0,'signature goes straight into the entry without an empty gallery interval');}
 scroll(5.1);const fade=q('.split-scene').style.opacity;scroll(5.6);assert.ok(+q('.split-scene').style.opacity>+fade);scroll(5.1);assert.equal(q('.split-scene').style.opacity,fade,'transition reverses exactly');
 q('.menu-toggle').click();flush();assert.equal(q('.site-menu').inert,false);d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));flush();assert.equal(q('.menu-toggle').getAttribute('aria-expanded'),'false');
 q('.chapter-navigation a[href="#explore"]').click();flush();assert.equal(w.scrollY,6*height/1.5);assert.equal(q('.split-scene').inert,false);assert.equal(d.activeElement,q('.split-option'));
 assert.equal(q('.chapter-navigation .active').getAttribute('href'),'#explore');assert.equal(q('.split-scene').style.opacity,'1');
 q('.split-option').click();flush();assert.equal(d.body.dataset.page,'work');w.PortfolioPages.home('explore');flush();assert.equal(d.body.classList.contains('detail-mode'),false);
 scroll(0);assert.equal(q('.hero-scene').inert,false);assert.equal(q('.split-scene').style.visibility,'hidden');
 if(!reduce){const e=new w.WheelEvent('wheel',{deltaY:120,bubbles:true,cancelable:true});w.dispatchEvent(e);advance();assert.ok(w.scrollY>0&&w.scrollY<162);flush();assert.equal(w.scrollY,162);}
 w.close();console.log('PASS '+width+'x'+height+': gallery and INDEX removed, direct signature-to-entry transition, menu, destination focus, reversible motion and project return');
}
{
 const {w,d,scroll,flush,advance}=boot(1600,900);
 const wheel=(deltaY,extra={})=>{const event=new w.WheelEvent('wheel',{deltaY,bubbles:true,cancelable:true,...extra});w.dispatchEvent(event);return event;};
 scroll(3.8);
 wheel(120);wheel(120);advance();
 const forward=w.scrollY;
 wheel(-120);advance();
 assert.ok(w.scrollY<forward,'reverse wheel changes direction on the next frame');flush();
 const start=w.scrollY;wheel(2.5);flush();
 assert.equal(w.scrollY,start+2.5,'fine trackpad input retains pixel precision');
 const zoomStart=w.scrollY;
 assert.equal(wheel(120,{ctrlKey:true}).defaultPrevented,false,'browser zoom gestures stay native');flush();
 assert.equal(w.scrollY,zoomStart);
 assert.equal(wheel(30,{deltaX:120}).defaultPrevented,false,'horizontal gestures stay native');
 scroll(0);wheel(1200);flush();
 assert.equal(w.scrollY,1620,'fast wheel impulses are not discarded by a one-screen cap');
 scroll(3.35);
 d.querySelector('.chapter-navigation a[href="#explore"]').click();advance();advance(80);
 const duringNavigation=w.scrollY;wheel(-120);advance();
 assert.ok(w.scrollY<duringNavigation,'wheel input immediately interrupts a chapter jump');flush();
 assert.ok(w.scrollY<3600,'interrupted navigation does not resume');
 w.close();
 console.log('PASS immediate reversal, trackpad precision, zoom/horizontal gestures, fast impulses, navigation interruption');
}
const frameSamples=[];
for(const [width,height] of [[1600,900],[1200,1173],[390,844]]){
 const {w,d,scroll,flush}=boot(width,height);
 const portrait=d.querySelector('.hero-portrait'),hero=d.querySelector('.hero-scene');
 const samples=[];
 function assertCovered(){
   const clip=parseFloat(hero.style.clipPath.slice(6));
   const shift=Number(portrait.style.transform.match(/,([-+\d.e]+)px,0\)/)[1]);
   const base=height+shift,frameBottom=height*(1-clip/100);
   assert.ok(base>=frameBottom+1.9,`portrait bottom must cover frame at ${width}×${height}`);
   return portrait.style.transform;
 }
 for(let i=0;i<=60;i++){scroll(i*.07);samples.push(assertCovered());}
 for(let i=60;i>=0;i--){scroll(i*.07);assert.equal(assertCovered(),samples[i],'reverse scroll restores the same bottom alignment');}
 for(const t of [.7,1.5,2,2.6,3.35]){
   scroll(t);
   for(const [x,y] of [[0,0],[width,0],[0,height],[width,height]]){
     d.dispatchEvent(new w.MouseEvent('pointermove',{clientX:x,clientY:y,bubbles:true}));flush();assertCovered();
   }
 }
 w.close();console.log(`PASS ${width}×${height}: continuous portrait/frame bottom coverage, reverse scroll, pointer extremes`);
}
for(const [width,height,reduce] of [[1600,900,false],[390,844,false],[1600,900,true]]){
 const {w,d,scroll,flush,advance}=boot(width,height,reduce);
 scroll(6.8);d.querySelector('.split-option').click();
 if(!reduce){assert.equal(d.querySelector('.route-transition').hidden,false,'fade begins before the page changes');advance();advance(200);assert.equal(d.body.classList.contains('is-routing'),true);}
 flush();
 assert.equal(d.body.dataset.page,'work');assert.equal(w.location.hash,'#work');
 assert.equal(d.querySelector('.detail-hero-title').textContent,'专业作品');
 assert.equal(d.querySelector('.detail-collage'),null,'the removed professional visuals section leaves no markup or spacer');
 assert.deepEqual([...d.querySelectorAll('.project-panel h3')].map(el=>el.textContent),['魄罗大冒险','Rewinder','Money Ball','Other work']);
 assert.ok([...d.querySelectorAll('.work-project-list .project-panel')].every(el=>el.querySelector('.project-summary').textContent&&el.querySelectorAll('.project-tags li').length===3),'every named project has a summary and three tags');
 assert.ok([...d.querySelectorAll('.project-panel')].every(el=>el.querySelectorAll('.detail-image').length===1&&el.querySelectorAll('.project-art').length===1),'each professional project contains exactly one cover');
 assert.equal(d.querySelector('.detail-story'),null,'professional creative statement has no markup or scroll spacer');
 assert.equal(d.querySelectorAll('.detail-section-nav button').length,3,'section navigation includes the new social photographs');
 assert.equal(d.querySelector('.detail-section-nav [data-section="projects"] span').textContent,'02');
 assert.equal(d.querySelector('.detail-scroll').dataset.section,'projects','hero scroll skips the removed statement');
 assert.equal(d.querySelector('.route-transition').hidden,true);assert.equal(w.scrollY,0);
 const projectSection=d.querySelector('[data-detail-section="projects"]');
 const before=[...d.querySelectorAll('[data-detail-section]')];
 const start=before.slice(0,before.indexOf(projectSection)).reduce((sum,e)=>sum+parseFloat(e.style.height),0);
 w.scrollTo(0,start+80);flush();const first=d.querySelector('.project-track').style.transform;
 w.scrollTo(0,start+260);flush();const second=d.querySelector('.project-track').style.transform;
 assert.equal(first,second,'vertical scrolling keeps the project list in normal document flow');
 assert.equal(projectSection.hasAttribute('data-horizontal-id'),false,'ON DESIGN does not register horizontal input');
 w.scrollTo(0,start+80);flush();assert.equal(d.querySelector('.project-track').style.transform,first,'reverse scroll restores horizontal project position');
 d.querySelector('[data-project-position="2"]').click();flush();
 assert.equal(d.querySelector('.project-current').textContent,'03');
 d.querySelector('[data-project-position="3"]').click();flush();
 assert.equal(d.querySelector('.project-current').textContent,'04','the fourth cover is reachable');
 assert.equal(d.querySelector('.detail-section-nav button.active').dataset.section,'projects');
 const endX=d.querySelector('.project-track').style.transform,endY=w.scrollY;
 w.scrollTo(0,endY+height*.4);flush();
 assert.equal(d.querySelector('.project-track').style.transform,endX,'the project list has no horizontal translation');
 assert.ok(w.scrollY>endY);
 d.querySelector('.project-art-main').click();flush();assert.equal(d.querySelector('dialog').open,false);assert.equal(d.body.dataset.page,'project');assert.equal(w.location.hash,'#work/project-01');
 d.querySelector('[data-back-projects]').click();flush();assert.equal(d.body.dataset.page,'work');
 d.querySelector('.footer-pages [data-open-page="life"]').click();flush();
 assert.equal(d.body.dataset.page,'life');assert.equal(d.querySelector('.detail-hero-title').textContent,'OFFDESIGN');
 assert.equal(d.body.classList.contains('detail-light'),true,'daily life uses its light theme');
 assert.equal(d.querySelectorAll('[data-horizontal-id="projects"] .project-panel').length,12,'daily life omits the removed hero photographs');
 assert.equal(d.querySelectorAll('[data-horizontal-id="projects"] .life-group-nav button').length,5,'life photographs have five remaining category shortcuts');
 assert.equal(d.querySelectorAll('[data-horizontal-id="team"] .project-panel').length,17,'team has its own photo collection');
 assert.equal(d.querySelectorAll('.detail-collage-card').length,0,'the selected daily-record collage is removed');
 d.querySelector('.detail-back').click();flush();
 assert.equal(d.body.classList.contains('detail-mode'),false);assert.equal(w.location.hash,'#explore');
 assert.equal(d.querySelector('.split-scene').inert,false);assert.equal(d.body.style.overflow,'');
 w.close();console.log(`PASS ${width}×${height}, reduced-motion=${reduce}: both detail routes, blue transition, horizontal wheel browsing, reversal, continuation, project preview, return`);
}
{
 const {w,d,flush}=boot(1600,900,false,'#work');
 assert.equal(d.body.dataset.page,'work','direct work links open the correct page');
 const historyLength=w.history.length;w.history.replaceState({},'','#explore');w.dispatchEvent(new w.PopStateEvent('popstate'));flush();
 assert.equal(d.body.classList.contains('detail-mode'),false,'browser history returns to the home page');
 assert.equal(w.history.length,historyLength,'history navigation does not push another entry');w.close();
 console.log('PASS direct route loading and browser history');
}
for(const [width,height,reduce] of [[1600,900,false],[390,844,false],[390,844,true]]){
 const {w,d,flush,advance}=boot(width,height,reduce,'#work');
 const projects=w.PORTFOLIO_CONTENT.pages.work.projects;
 for(let i=0;i<projects.length;i++){
   const link=d.querySelectorAll('.project-art-main')[i];
   assert.equal(link.tagName,'A');assert.equal(link.getAttribute('href'),'#work/'+projects[i].slug);
   link.click();
   if(i===2&&!reduce)assert.equal(d.querySelector('.route-transition').dataset.effect,'fade','Project 03 uses the shared fade');
   flush();
   assert.equal(d.body.dataset.page,'project');assert.equal(d.body.dataset.project,projects[i].slug);
   assert.equal(d.querySelector('.project-detail-title').textContent,projects[i].title);
   assert.equal(w.location.hash,'#work/'+projects[i].slug);assert.equal(d.querySelector('dialog').open,false);
   assert.equal(d.querySelectorAll('.project-detail [data-detail-section]').length,5,'project is a full cover/overview/gallery/navigation/footer page');
   assert.equal(d.querySelectorAll('.project-detail-gallery figure').length,2);
   w.scrollTo(0,height);flush();assert.equal(w.scrollY,height,'project content scrolls vertically');
   if(!reduce){w.dispatchEvent(new w.WheelEvent('wheel',{deltaY:120,bubbles:true,cancelable:true}));advance();flush();assert.ok(w.scrollY>height,'wheel scroll remains active on a project page');}
   const next=d.querySelector('.project-pagination a:last-child');next.click();flush();
   assert.equal(d.body.dataset.project,projects[(i+1)%projects.length].slug);
   d.querySelector('.project-pagination a:first-child').click();flush();assert.equal(d.body.dataset.project,projects[i].slug);
   d.querySelector('[data-back-projects]').click();flush();
   assert.equal(d.body.dataset.page,'work');assert.equal(d.querySelector('.project-current').textContent,String(i+1).padStart(2,'0'),'return to the matching cover');
 }
 const originalY=w.scrollY;d.querySelectorAll('.project-art-main')[3].click();flush();
 w.history.replaceState({},'','#work');w.dispatchEvent(new w.PopStateEvent('popstate'));flush();assert.equal(w.scrollY,originalY,'browser back restores collection scroll');
 for(const family of ['work','life']){
   w.PortfolioPages.open(family);flush();
   assert.equal(d.querySelectorAll('.portrait-footer').length,1);
   const social=d.querySelector('.socials-section'),cards=[...social.querySelectorAll('.social-card')];
   assert.equal(social.nextElementSibling,d.querySelector('.portrait-footer'),'social photographs lead directly into the footer');
   assert.equal(cards.length,7);assert.equal(new Set(cards.map(card=>card.dataset.socialPhoto)).size,7);
   for(const card of cards)assert.ok(fs.existsSync(path.join(root,card.dataset.socialPhoto)),'each social photograph has a published asset');
   assert.equal(social.querySelector('.socials-title').textContent,"WHAT'S UPON SOCIALS");
   assert.equal(social.querySelector('.socials-follow>p').textContent,'Follow XuKe on social media');
   const socialStart=Number(d.querySelector('.detail-route').dataset.scrollHeight)-parseFloat(social.style.height)-parseFloat(d.querySelector('.portrait-footer').style.height);
   w.scrollTo(0,socialStart-height);flush();assert.equal(+social.style.getPropertyValue('--spread'),reduce?1:0);
   w.scrollTo(0,socialStart-height*.35);flush();assert.equal(+social.style.getPropertyValue('--spread'),reduce?1:0,'fan stays stacked until its own viewport position reaches the unfolding zone');
   w.scrollTo(0,socialStart+height*.3);advance();advance(200);if(!reduce)assert.ok(+social.style.getPropertyValue('--spread')<1,'opening continues after the scroll stops');flush();assert.equal(+social.style.getPropertyValue('--spread'),1);assert.equal(+social.style.getPropertyValue('--fan-lift'),1);
   cards[1].focus();flush();assert.equal(cards[1].classList.contains('is-active'),!reduce,'keyboard selection lifts the focused card unless reduced motion is requested');
   if(!reduce){assert.ok(+cards[0].style.getPropertyValue('--neighbor-x')<0&&+cards[2].style.getPropertyValue('--neighbor-x')>0,'neighboring cards make room on both sides');const before=cards[0].style.getPropertyValue('--neighbor-x');cards[5].focus();assert.equal(cards[0].style.getPropertyValue('--neighbor-x'),before,'changing selection preserves the current position without snapping');assert.equal(cards[1].classList.contains('is-active'),false);assert.equal(cards[5].classList.contains('is-active'),true);flush();}
   social.dispatchEvent(new w.Event('pointerleave'));assert.equal(social.querySelector('.is-active'),null,'leaving the fan returns the selected card');cards[1].blur();cards[5].blur();
   w.scrollTo(0,socialStart-height);flush();assert.equal(+social.style.getPropertyValue('--spread'),reduce?1:0,'scrolling back restores the initial stack');
   cards[3].click();assert.equal(d.querySelector('dialog').open,true,'social cards open the full photograph');d.querySelector('dialog').close();flush();assert.equal(w.location.hash,'#'+family);
   assert.equal(d.querySelectorAll('.footer-pages a').length,3);assert.equal(d.querySelector('.footer-portrait img').getAttribute('src'),family==='life'?w.PORTFOLIO_CONTENT.heroImage:w.PORTFOLIO_CONTENT.heroHelmetImage,'footer uses the matching cap or helmet portrait');
   assert.deepEqual([...d.querySelectorAll('.footer-title-line')].map(line=>[line.querySelector('strong').textContent,line.querySelector('em').textContent]),[['BE THE','BEST OF'],['THE','BEST']]);
   assert.deepEqual([...d.querySelectorAll('.footer-socials .footer-item')].map(item=>item.getAttribute('aria-label')),['TIKTOK','INSTAGRAM','YOUTUBE','BILIBILI']);
   assert.equal(d.querySelector('.footer-signature path').getAttribute('d'),d.querySelector('.message-signature path').getAttribute('d'),'footer uses the supplied signature');
   const footerPortrait=d.querySelector('.footer-portrait'),fixed=footerPortrait.style.transform;w.scrollTo(0,Number(d.querySelector('.detail-route').dataset.scrollHeight)-height);flush();d.dispatchEvent(new w.MouseEvent('pointermove',{clientX:width,clientY:height,bubbles:true}));flush();assert.equal(footerPortrait.style.transform,fixed,'the footer portrait stays fixed under pointer movement');
   assert.equal(d.body.classList.contains('detail-light'),family==='life');
   d.querySelector('[data-footer-home]').click();assert.equal(w.location.hash,'#intro');assert.equal(w.scrollY,0);flush();
 }
 w.close();console.log(`PASS ${width}×${height}, reduced-motion=${reduce}: four independent projects, direct links, project navigation, return position, shared footer, light life theme`);
}
for(const slug of ['project-01','project-02','project-03','other-work']){
 const {w,d,flush}=boot(1600,900,false,'#work/'+slug);
 assert.equal(d.body.dataset.project,slug,'project links load directly');
 d.querySelector('[data-back-projects]').click();flush();assert.equal(d.body.dataset.page,'work');w.close();
}
for(const [width,height,reduce] of [[1600,900,false],[390,844,false],[390,844,true]]){
 const {w,d,flush,scroll}=boot(width,height,reduce,'#work');
 const nav=d.querySelector('.menu-content nav');
 assert.deepEqual([...nav.querySelectorAll('a')].map(a=>a.textContent.replace(/[\d↗\s]/g,'')),['HOME','专业作品','日常生活']);
 const openMenu=()=>{d.querySelector('.menu-toggle').click();flush();};
 const closed=()=>assert.equal(d.querySelector('.menu-toggle').getAttribute('aria-expanded'),'false');
 openMenu();nav.querySelector('[data-menu-home]').click();
 assert.equal(d.body.classList.contains('detail-mode'),false,'HOME immediately leaves the interior');
 assert.equal(w.scrollY,0,'HOME goes straight to the opening, not the entry section');
 assert.equal(w.location.hash,'#intro');closed();flush();
 scroll(3.8);openMenu();nav.querySelector('[data-menu-home]').click();
 assert.equal(w.scrollY,0,'HOME immediately returns from a scrolled home chapter');closed();flush();
 openMenu();nav.querySelector('[data-open-page="work"]').click();flush();
 assert.equal(d.body.dataset.page,'work');closed();
 w.scrollTo(0,500);flush();openMenu();nav.querySelector('[data-open-page="work"]').click();closed();flush();
 assert.equal(w.scrollY,0,'selecting the current page closes the menu and returns to its beginning');
 openMenu();nav.querySelector('[data-open-page="life"]').click();flush();
 assert.equal(d.body.dataset.page,'life');closed();
 openMenu();nav.querySelector('[data-menu-home]').click();
 assert.equal(w.scrollY,0);assert.equal(w.location.hash,'#intro');closed();flush();
 w.close();console.log(`PASS ${width}×${height}, reduced-motion=${reduce}: three menu entries, direct HOME, both interior links, current-page menu closing`);
}
for(const route of ['', '#work', '#life', '#work/project-03'])for(const fps of [60,120]){
 const {w,advance,flush}=boot(1600,900,false,route);
 w.dispatchEvent(new w.WheelEvent('wheel',{deltaY:120,bubbles:true,cancelable:true}));
 let elapsed=0,t95=null;const samples=[];
 for(let i=0;i<fps*.6;i++){advance(1000/fps);elapsed+=1000/fps;if((i+1)%(fps/10)===0)samples.push(w.scrollY);if(t95===null&&w.scrollY>=162*.95)t95=elapsed;}
 assert.ok(t95>=400&&t95<=475,'wheel has a gentle settling tail without a long drift');
 assert.ok(samples[0]>65,'the first wheel impulse still responds promptly');
 assert.ok(samples[3]-samples[1]>15,'the picture continues gliding after input stops');
 assert.ok(samples[3]-samples[2]<samples[2]-samples[1],'the trailing movement decelerates');
 frameSamples.push(w.scrollY);
 flush();assert.equal(w.scrollY,162,'inertia preserves the requested distance and fully settles');
 console.log(`PASS ${route||'home'} ${fps}Hz: gentle tail, 95% in ${Math.round(t95)}ms, exact stop`);w.close();
}
for(let i=0;i<frameSamples.length;i+=2)assert.ok(Math.abs(frameSamples[i]-frameSamples[i+1])<.5,'high-refresh and standard displays follow the same motion curve');
for (const file of ['styles.css', 'content.js', 'app.js', 'pages.js', 'pages.css']) assert.ok(fs.statSync(path.join(root, file)).size > 0);
assert.ok(!/https?:\/\//.test(fs.readFileSync(path.join(root, 'app.js'), 'utf8')), 'no remote runtime dependency');
console.log('PASS local assets and self-contained runtime');
{
 const {w,d,scroll}=boot(1600,900);
 const title=d.querySelector('.split-heading em'),arrow=d.querySelector('.square-arrow');
 scroll(4.7);assert.ok(+title.style.opacity>+arrow.style.opacity,'Entry headings lead the button reveal');
 const before=[title.style.opacity,title.style.translate];scroll(5.4);scroll(4.7);
 assert.deepEqual([title.style.opacity,title.style.translate],before,'Layered entrance reverses without a jump');
 scroll(6);assert.equal(title.style.opacity,'1');assert.equal(arrow.style.opacity,'1');
 w.close();console.log('PASS staged entry headings/buttons, complete reveal and reversible scrolling');
}
