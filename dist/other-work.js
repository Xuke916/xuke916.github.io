(() => {
 'use strict';
 const translations={};
 const pair=(zh,en)=>(translations[zh]=en,zh);
 const entries=[
  {id:'mercedes',title:pair('梅赛德斯-奔驰 Playlist','Mercedes-Benz Playlist'),date:'2024.12 — 2025.07',role:pair('美术 · 动画','Art · Animation'),platform:'Bilibili',video:'BV1Zu3szkERR',url:'https://www.bilibili.com/video/BV1Zu3szkERR/',paragraphs:[
   pair('为梅赛德斯-奔驰不同车型制作的 Playlist 系列。通过绘制 2D 汽车并制作 3D 场景，将二维车辆与三维空间结合，呈现各款车型的视觉效果。','A series of playlists for different Mercedes-Benz models. I created 2D car artwork and 3D environments, combining illustrated vehicles with three-dimensional spaces to shape the visual presentation of each model.')
  ]},
  {id:'drill',title:'Drill to Zero',date:'2026.06',role:pair('太空挖掘 · 增量游戏','Space mining · Incremental game'),platform:'YouTube',video:'TWyVBIwokUM',url:'https://youtu.be/TWyVBIwokUM',credit:pair('创作于 2026 GMTK Game Jam','Created for GMTK Game Jam 2026'),paragraphs:[
   pair('一款以浩瀚深邃的外太空为背景的挖掘增量小游戏。驾驶实验性钻探舱前往未知星球，冲破层层地质地形，收集遗留矿物与珍稀材料。','An incremental mining game set in the vast depths of outer space. Pilot an experimental drilling capsule to an unknown planet, break through geological layers, and collect mineral deposits and rare materials.'),
   pair('使用获取的资源升级钻探装置、采集系统和推进系统。每一次下潜都受氧气储量限制，计时器归零时探险终止；寻找地下埋藏的氧气补给点，可以延长续航，继续深入。','Spend collected resources to upgrade your drill, collection system and propulsion. Every descent is limited by oxygen: when the timer reaches zero, the expedition ends. Find buried oxygen supplies to extend your run and venture deeper.'),
   pair('挖掘、收集、升级、再度下潜。不断向下掘进，直至抵达这颗星球神秘的零点核心。','Dig, collect, upgrade, and descend again. Keep drilling until you reach the planet’s mysterious zero-point core.')
  ]},
  {id:'anchor',title:'Drop Dead Anchor',date:'2026.07',role:pair('Windows · 四人局域网派对对战','Windows · Four-player LAN party combat'),platform:'YouTube',video:'1f7FlY4OfQo',url:'https://youtu.be/1f7FlY4OfQo',credit:pair('2026 CIGA Game Jam · 最佳独立游戏提名','CIGA Game Jam 2026 · Best Indie Game nomination'),paragraphs:[
   pair('在海盗船“珍珠号”上，四位来自不同船只的船长，为争夺传奇海盗的名号展开死斗。只有最后活下来的强者，才能成为真正的传奇海盗。','Aboard the pirate ship Pearl, four captains from different vessels fight to claim the title of legendary pirate. Only the last survivor can earn the name.'),
   pair('玩家选择四种动物海盗中的一种，通过发射钩锁、以锚点为中心高速移动，并运用不同特性的远程武器攻击对手。比赛分为三局，每局四人混战至最后一人；三局后，总积分最高的玩家获得冠军。','Choose one of four animal pirates, fire a grapple to move rapidly around anchor points, and use ranged weapons with different properties to attack opponents. Each match has three rounds, with four players battling until one remains in each round. The highest total score after three rounds wins.'),
   pair('我们将 Anchor 理解为“锚点”，把钩锁移动作为核心玩法；又从船锚联想到海盗，确立了背景故事。团队也喜欢任天堂的派对游戏，因此将作品做成了四人对战游戏。','We interpreted “Anchor” as an anchor point and built the core around grappling movement. Its connection to a ship’s anchor led to the pirate setting. Our enthusiasm for Nintendo party games also inspired the four-player format.'),
   pair('在 Windows 下运行，支持同一局域网内四人联机。房主输入自己的 IPv4 地址创建房间；其他玩家输入房主的 IPv4 地址，点击 Join 加入。','Runs on Windows and supports four players on the same local network. The host enters their own IPv4 address to create a room. Other players enter the host’s IPv4 address and click Join.')
  ]},
  {id:'popmart',title:pair('泡泡玛特','POP MART'),date:'2025.04',role:pair('分镜师 · 美术','Storyboard artist · Art'),platform:'YouTube',video:'2VnvBmT2T3A',url:'https://youtu.be/2VnvBmT2T3A',credit:pair('泡泡玛特企业特别奖','POP MART Corporate Special Award'),paragraphs:[
   pair('为泡泡玛特产品制作的广告短片，创作于中国传媒大学动画与数字艺术学院。我在项目中担任分镜师与美术，该作品获得了泡泡玛特企业特别奖。','An advertising short for POP MART products, created at the School of Animation and Digital Arts, Communication University of China. I worked as storyboard artist and artist. The film received the POP MART Corporate Special Award.')
  ]}
 ];
 for(const [zh,en] of [['点击播放','Play video'],['在原站观看 ↗','Watch on the original site ↗'],['关于作品','About the project'],['其他作品目录','Other work contents'],['播放视频：','Play video: '],['视频播放器：','Video player: ']])translations[zh]=en;
 entries[0].drawings=[
  pair('红色安全车绘画','Red safety car illustration'),
  pair('银色安全车绘画','Silver safety car illustration'),
  pair('橙色跑车绘画','Orange sports car illustration'),
  pair('青绿色背景跑车绘画','Sports car illustration on a turquoise background'),
  pair('银色跑车侧面绘画','Silver sports car side-view illustration')
 ].map((alt,i)=>({alt,image:'assets/mercedes/car-'+String(i+1).padStart(2,'0')+'.webp',thumbnail:'assets/mercedes/car-'+String(i+1).padStart(2,'0')+'-small.webp'}));
 pair('车辆绘画','Car illustrations');pair('为本项目绘制的二维车辆作品。点击图片可放大查看。','2D car artwork I created for this project. Select an image to view it larger.');
 function artwork(p){return `<div class="ow-artwork"><header><h3>车辆绘画</h3><p>为本项目绘制的二维车辆作品。点击图片可放大查看。</p></header><div class="ow-artwork-row">${p.drawings.map((drawing,i)=>`<button class="ow-artwork-card" type="button" data-ow-art="${i}" aria-label="放大查看：${esc(drawing.alt)}"><img src="${drawing.thumbnail}" alt="${esc(drawing.alt)}" width="640" height="360" loading="lazy" decoding="async"><span class="mono" aria-hidden="true">${String(i+1).padStart(2,'0')} / 05 <b>↗</b></span></button>`).join('')}</div></div>`;}
 const paintings=[
  {caption:pair("雾中战场","Battlefield in the mist"),year:2025},
  {caption:pair("火光中的身影","A figure in firelight"),year:2024},
  {caption:pair("举拳的人物","A raised fist"),year:2024},
  {caption:pair("暖光肖像","Portrait in warm light"),year:2024},
  {caption:pair("墨镜与烟雾","Sunglasses and smoke"),year:2024},
  {caption:pair("明暗肖像","Light and shadow portrait"),year:2024},
  {caption:pair("冠饰肖像","Portrait with a crown"),year:2024},
  {caption:pair("夜行骑士","A rider at night"),year:2024},
  {caption:pair("沙漠中的披风","A cloak in the desert"),year:2024},
  {caption:pair("冷暖光肖像","Portrait in cool and warm light"),year:2024},
  {caption:pair("霓虹背影","A silhouette in neon"),year:2024},
  {caption:pair("烛光肖像","Portrait by candlelight"),year:2024},
  {caption:pair("逆光中的两人","Two figures in backlight"),year:2024},
  {caption:pair("沙发上的人物","A figure on a sofa"),year:2024},
  {caption:pair("车内与车外","Inside and outside the car"),year:2024},
  {caption:pair("暮色雪山","Snowy mountain at dusk"),year:2024},
  {caption:pair("荒漠探索","Desert exploration"),year:2024},
  {caption:pair("光束与烟雾","A beam of light and smoke"),year:2024},
  {caption:pair("舞台光下的人物","A figure in stage light"),year:2024}
 ].map((p,i)=>({...p,width:800,height:[400,335,565,335,335,335,335,335,335,800,335,335,335,335,335,559,335,800,335][i],image:'assets/speed-paintings/study-'+String(i+1).padStart(2,'0')+'.webp',thumbnail:'assets/speed-paintings/study-'+String(i+1).padStart(2,'0')+'-small.webp'}));
 entries.push({id:'speed-paintings',kind:'paintings',title:pair('我的速涂','My speed paintings'),date:'2024 — 2025',paintings});
 pair('我的','My');pair('速涂','Speed paintings');pair('一些人物、场景与光影的速涂记录。','Speed painting studies of people, environments, light and shadow.');
 function speedPaintings(p,i){return `<section class="ow-project ow-paintings" data-detail-section="other-${p.id}"><header class="ow-paintings-heading"><div><span class="mono">${String(i+1).padStart(2,'0')} / PERSONAL PAINTINGS · ${p.date}</span><h2 aria-label="我的速涂"><span>我的</span><em>速涂</em></h2></div><p>一些人物、场景与光影的速涂记录。</p></header><div class="ow-paintings-grid">${Array.from({length:4},(_,column)=>`<div class="ow-painting-column">${p.paintings.map((painting,index)=>index%4!==column?'':`<button type="button" class="ow-painting" data-ow-painting="${index}" style="--art-index:${index}" aria-label="放大查看：${esc(painting.caption)}"><span class="ow-paint-frame"><img src="${painting.thumbnail}" alt="${esc(painting.caption)}" width="${painting.width}" height="${painting.height}" loading="lazy" decoding="async"></span><span class="ow-paint-caption"><span>${esc(painting.caption)}</span><span class="ow-paint-year">${painting.year}</span><span aria-hidden="true">↗</span></span></button>`).join('')}</div>`).join('')}</div></section>`;}
 entries.filter(p=>p.video).forEach(p=>{p.poster=`assets/video-covers/${p.id}.webp`;});
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const label=(prefix,title)=>prefix+title;
 function render({pagination='',footer=''}={}){
  return `<nav class="ow-toc" aria-label="其他作品目录">${entries.map((p,i)=>`<button data-section="other-${p.id}"><span>${String(i+1).padStart(2,'0')}</span> ${esc(p.title)}</button>`).join('')}</nav><article class="detail-route project-detail other-work-case" data-route="work/other-work"><header class="ow-header"><span class="mono">FILMS, GAMES & PAINTINGS / 2024 — 2026</span><h1 class="project-detail-title" tabindex="-1">Other work</h1></header>${entries.map((p,i)=>p.kind==='paintings'?speedPaintings(p,i):`<section class="ow-project" data-detail-section="other-${p.id}"><header class="ow-project-heading"><span class="mono">${String(i+1).padStart(2,'0')} / ${esc(p.date)}</span><h2>${esc(p.title)}</h2><p>${esc(p.role)}</p></header><div class="ow-video" data-ow-video="${p.id}"><button class="ow-play" data-ow-play="${p.id}" aria-label="${esc(label('播放视频：',p.title))}"><img class="ow-poster" src="${p.poster}" alt="" width="1280" height="720" loading="lazy" decoding="async"><span class="ow-play-icon" aria-hidden="true">▶</span><span class="ow-play-title">${esc(p.title)}</span><span class="mono">点击播放</span><span class="ow-provider mono">${p.platform} / FILM ${String(i+1).padStart(2,'0')}</span></button></div><a class="ow-external" href="${p.url}" target="_blank" rel="noopener noreferrer">在原站观看 ↗</a><div class="ow-overview"><div><span class="mono">${String(i+1).padStart(2,'0')} / OVERVIEW</span><h3>关于作品</h3>${p.credit?`<p class="ow-credit">${esc(p.credit)}</p>`:''}</div><div class="ow-copy">${p.paragraphs.map(text=>`<p>${esc(text)}</p>`).join('')}</div></div>${p.drawings?artwork(p):''}</section>`).join('')}${pagination}${footer}</article>`;
 }
 function mount(root){
  const unload=()=>root.querySelectorAll('.ow-video iframe').forEach(frame=>frame.remove());
  const click=event=>{
   const painting=event.target.closest('[data-ow-painting]');if(painting){const item=paintings[Number(painting.dataset.owPainting)];if(item)window.PortfolioHome?.preview(item.image,item.caption);return;}
   const art=event.target.closest('[data-ow-art]');if(art){const drawing=entries[0].drawings[Number(art.dataset.owArt)];if(drawing)window.PortfolioHome?.preview(drawing.image,drawing.alt);return;}
   const button=event.target.closest('[data-ow-play]');if(!button)return;
   const p=entries.find(p=>p.id===button.dataset.owPlay);if(!p)return;
   // Only one provider player is active; no third-party scripts load on entry.
   root.querySelectorAll('.ow-video iframe').forEach(frame=>{const holder=frame.parentElement;frame.remove();holder.querySelector('button').hidden=false;});
   const frame=document.createElement('iframe');frame.src=p.platform==='Bilibili'?`https://player.bilibili.com/player.html?bvid=${p.video}&page=1&autoplay=1`:`https://www.youtube-nocookie.com/embed/${p.video}?autoplay=1&rel=0`;
   frame.title=label('视频播放器：',p.title);frame.allow='autoplay; encrypted-media; fullscreen; picture-in-picture';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
   button.hidden=true;button.parentElement.append(frame);window.PortfolioLanguage?.refresh(frame);
  };
  root.addEventListener('click',click);
  const onMenu=e=>{if(e.detail.open){unload();root.querySelectorAll('.ow-play').forEach(button=>button.hidden=false);}};
  document.addEventListener('portfolio:menu',onMenu);
  return()=>{root.removeEventListener('click',click);document.removeEventListener('portfolio:menu',onMenu);unload();};
 }
 // Whole dynamic labels are translated by the shared source-preserving module.
 entries.forEach(p=>{translations[label('播放视频：',p.title)]='Play video: '+(translations[p.title]||p.title);translations[label('视频播放器：',p.title)]='Video player: '+(translations[p.title]||p.title);});
 window.OtherWorkCaseStudy={render,mount,translations,entries,tocSelector:'.ow-toc',headerColor:'#f3f3eb'};
})();
