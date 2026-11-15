import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {JSDOM} from 'jsdom';

const dist=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const dom=new JSDOM(fs.readFileSync(path.join(dist,'index.html'),'utf8'),{url:'https://example.github.io/',runScripts:'outside-only'});
const w=dom.window,d=w.document;
w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
for(const file of ['content.js','moneyball.js','poro.js','rewinder.js','work-profile.js','i18n-data.js','i18n.js']) w.eval(fs.readFileSync(path.join(dist,file),'utf8'));
const settle=()=>{w.PortfolioLanguage.refresh();return new Promise(resolve=>w.setTimeout(resolve,0));};
const language=w.PortfolioLanguage;
let syntheticResizes=0;w.addEventListener('resize',()=>syntheticResizes++);
const host=d.createElement('div');d.body.append(host);
const chinese=/[\u3400-\u9fff]/;
function untranslated(root){
  const missing=new Set(),walker=d.createTreeWalker(root,4);let node;
  while((node=walker.nextNode()))if(!node.parentElement.closest('script,style,noscript,[data-language-label],[data-resume-language]')&&chinese.test(node.textContent))missing.add(node.textContent.trim());
  for(const el of root.querySelectorAll('*'))for(const attr of ['alt','title','aria-label','placeholder'])if(chinese.test(el.getAttribute(attr)||''))missing.add(el.getAttribute(attr));
  return [...missing];
}
d.querySelector('[data-site-language="en"]').click();
assert.equal(syntheticResizes,0,'Language selection must not reset the animation through a synthetic browser resize');
assert.equal(d.documentElement.lang,'en');assert.equal(w.localStorage.getItem('portfolio-language'),'en');
assert.equal(d.querySelector('[data-site-language="en"]').getAttribute('aria-pressed'),'true');
assert.deepEqual(untranslated(d.body),[],'Homepage translation coverage');
for(const name of ['MoneyBallCaseStudy','PoroCaseStudy','RewinderCaseStudy','WorkProfile']){
  host.innerHTML=w[name].render({pagination:''});const original=host.textContent;
  await settle();assert.deepEqual(untranslated(host),[],name+' translation coverage');
  d.querySelector('[data-site-language="zh"]').click();assert.equal(host.textContent,original,name+' restores exact Chinese');
  d.querySelector('[data-site-language="en"]').click();
  if(name==='WorkProfile'){
    host.querySelector('[data-resume-language="zh"]').click();assert.equal(language.language,'zh');
    host.querySelector('[data-resume-language="en"]').click();assert.equal(language.language,'en');
  }
  if(name==='MoneyBallCaseStudy'){
    const cleanup=w[name].mount(host);await settle();
    for(const cover of ['1','3'])for(const pitch of ['stay','drop']){
      const pitchRadio=host.querySelector(`[name="mb-pitch"][value="${pitch}"]`);
      if(pitchRadio)pitchRadio.checked=true;
      host.querySelector(`[name="mb-cover"][value="${cover}"]`).checked=true;
      host.querySelector('[name="mb-cover"]').dispatchEvent(new w.Event('change',{bubbles:true}));
      for(const button of host.querySelectorAll('[data-mb-step]')){button.click();await settle();assert.deepEqual(untranslated(host),[],'Dynamic pitching result');}
    }
    cleanup?.();
  }
}
// Check captions and content that are rendered only on the life route.
const missingContent=[];
function walk(value){if(typeof value==='string'&&chinese.test(value)&&chinese.test(language.translate(value)))missingContent.push(value);else if(value&&typeof value==='object')Object.values(value).forEach(walk);}
walk(w.PORTFOLIO_CONTENT);assert.deepEqual(missingContent,[],'Life and project content translation coverage');
host.innerHTML='<p>打开导航</p>';await settle();assert.equal(host.textContent,'Open navigation');
host.firstChild.firstChild.nodeValue='关闭导航';await settle();assert.equal(host.textContent,'Close navigation');
host.innerHTML='<button aria-label="播放演示：强化钩锁：蓄力、出钩与反弹">播放演示</button>';await settle();assert.deepEqual(untranslated(host),[],'Dynamically paused media controls');
host.innerHTML='<p>关闭导航</p>';await settle();
d.querySelector('[data-site-language="zh"]').click();assert.equal(host.textContent,'关闭导航');
// Animation counters and SVG updates must not rewrite language controls or
// perform document-wide selector work on every frame, in either language.
for(const selected of ['zh','en']){
  language.setLanguage(selected);await settle();
  let globalQueries=0;
  const query=d.querySelectorAll.bind(d);
  d.querySelectorAll=(...args)=>{globalQueries++;return query(...args);};
  const counter=d.querySelector('#moment-counter');
  for(let frame=0;frame<20;frame++){counter.textContent=String(frame%8+1).padStart(2,'0');counter.style.transform=`translateX(${frame}px)`;await new Promise(resolve=>w.setTimeout(resolve,0));}
  d.querySelectorAll=query;
  assert.equal(globalQueries,0,selected+': unrelated animation frames must bypass language refresh');
}
// Reload with an existing preference, including a browser with unavailable storage.
for(const storage of ['en','blocked']){
  const reload=new JSDOM('<title>XU KE / Portfolio</title><body><p>日常生活</p>',{url:'https://example.github.io/',runScripts:'outside-only'});
  if(storage==='en')reload.window.localStorage.setItem('portfolio-language','en');
  else Object.defineProperty(reload.window,'localStorage',{get(){throw Error('storage disabled');}});
  for(const file of ['i18n-data.js','i18n.js'])reload.window.eval(fs.readFileSync(path.join(dist,file),'utf8'));
  assert.equal(reload.window.document.documentElement.lang,storage==='en'?'en':'zh-CN');reload.window.close();
}
dom.window.close();
console.log('PASS global language toggle, case studies, dynamic results, life copy, Chinese restoration and persistence');
