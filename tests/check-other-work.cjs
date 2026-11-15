const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const dist=path.resolve(__dirname,'../dist');
const dom=new JSDOM(fs.readFileSync(path.join(dist,'index.html'),'utf8'),{runScripts:'outside-only',url:'https://portfolio.test/#work/other-work'}),w=dom.window,d=w.document;
for(const name of ['i18n-data.js','other-work.js','i18n.js'])w.eval(fs.readFileSync(path.join(dist,name),'utf8'));
w.PortfolioLanguage.setLanguage('zh');
const api=w.OtherWorkCaseStudy,host=d.createElement('main');host.innerHTML=api.render();d.body.append(host);w.PortfolioLanguage.refresh(host);
assert.equal(host.querySelectorAll('.ow-project').length,4);assert.deepEqual([...host.querySelectorAll('.ow-project')].map(el=>el.dataset.detailSection),['other-mercedes','other-drill','other-anchor','other-popmart']);
assert.equal(host.querySelectorAll('iframe').length,0,'No provider iframe or third-party player loads before a click');
assert.equal(host.querySelectorAll('.ow-overview').length,4);assert.equal(host.querySelectorAll('a.ow-external').length,4);
const original=host.textContent;
w.PortfolioLanguage.setLanguage('en');
assert.ok(!/[\u3400-\u9fff]/.test(host.textContent),'Complete English copy');
const cleanup=api.mount(host);
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
