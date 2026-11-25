const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const dist=path.resolve(__dirname,'../dist');
const dom=new JSDOM(fs.readFileSync(path.join(dist,'index.html'),'utf8'),{runScripts:'outside-only',url:'https://portfolio.test/#work/other-work'}),w=dom.window,d=w.document;
for(const name of ['i18n-data.js','other-work.js','i18n.js'])w.eval(fs.readFileSync(path.join(dist,name),'utf8'));
w.PortfolioLanguage.setLanguage('zh');
const api=w.OtherWorkCaseStudy,host=d.createElement('main');host.innerHTML=api.render();d.body.append(host);w.PortfolioLanguage.refresh(host);
assert.equal(host.querySelectorAll('.ow-project').length,5);assert.deepEqual([...host.querySelectorAll('.ow-project')].map(el=>el.dataset.detailSection),['other-mercedes','other-drill','other-anchor','other-popmart','other-speed-paintings']);
assert.equal(host.querySelectorAll('iframe').length,0,'No provider iframe or third-party player loads before a click');
assert.equal(host.querySelectorAll('.ow-poster').length,4,'all video buttons show real preview images before playback');
for(const entry of api.entries.filter(p=>p.video)){assert.ok(fs.statSync(path.join(dist,entry.poster)).size>1000,'video cover is included locally in the deployment');}
assert.equal(host.querySelectorAll('.ow-overview').length,4);assert.equal(host.querySelectorAll('a.ow-external').length,4);
assert.equal(host.querySelectorAll('.ow-artwork').length,1);
assert.equal(host.querySelector('.ow-artwork').closest('.ow-project').dataset.detailSection,'other-mercedes');
assert.equal(host.querySelectorAll('[data-ow-art]').length,5);
for(const drawing of api.entries[0].drawings)for(const source of [drawing.image,drawing.thumbnail])assert.ok(fs.statSync(path.join(dist,source)).size>1000);
const paintings=api.entries.at(-1).paintings;
assert.equal(host.querySelector('.ow-paintings h2').getAttribute('aria-label'),'我的速涂');
assert.equal(host.querySelectorAll('[data-ow-painting]').length,19);
assert.equal(host.querySelectorAll('.ow-toc button').length,5);
for(const painting of paintings)for(const source of [painting.image,painting.thumbnail])assert.ok(fs.statSync(path.join(dist,source)).size>1000);
const original=host.textContent;
w.PortfolioLanguage.setLanguage('en');
assert.ok(!/[\u3400-\u9fff]/.test(host.textContent),'Complete English copy');
const cleanup=api.mount(host);
let preview;w.PortfolioHome={preview:(image,caption)=>{preview={image,caption};}};
for(const [i,button]of [...host.querySelectorAll('[data-ow-art]')].entries()){button.click();assert.equal(preview.image,api.entries[0].drawings[i].image);assert.equal(preview.caption,api.entries[0].drawings[i].alt);}
for(const button of host.querySelectorAll('[data-ow-painting]')){const item=paintings[Number(button.dataset.owPainting)];button.click();assert.equal(preview.image,item.image);assert.equal(preview.caption,item.caption);}
const buttons=[...host.querySelectorAll('[data-ow-play]')];
for(const [i,button]of buttons.entries()){
 button.click();assert.equal(host.querySelectorAll('iframe').length,1,'Only one video is active');const frame=host.querySelector('iframe');
 assert.ok(frame.src.includes(api.entries[i].video));assert.ok(frame.title.startsWith('Video player: '));assert.ok(frame.allowFullscreen);
 assert.equal(button.hidden,true);
}
d.dispatchEvent(new w.CustomEvent('portfolio:menu',{detail:{open:true}}));assert.equal(host.querySelectorAll('iframe').length,0);assert.ok(buttons.every(b=>!b.hidden));
w.PortfolioLanguage.setLanguage('zh');assert.equal(host.textContent,original,'Original Chinese restores');
buttons[0].click();cleanup();assert.equal(host.querySelectorAll('iframe').length,0,'Leaving page releases the player');buttons[1].click();assert.equal(host.querySelectorAll('iframe').length,0,'Click handler removed on exit');
w.close();console.log('PASS Other work: ordered bilingual projects, click-to-load players, single active video, original links and cleanup');
