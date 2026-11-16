(() => {
 'use strict';
 // Traced against hero-helmet-v2.png, in its native 1448 × 1086 coordinates.
 const shell='M370 663C387 646 417 630 436 609C429 550 439 489 474 440C513 389 572 359 638 349C707 337 769 349 819 378C873 409 910 457 928 514C941 559 943 616 929 667C908 676 883 681 858 694C816 723 770 754 721 780C683 800 649 813 613 817C585 821 555 801 537 775C526 757 525 737 512 719L492 708L485 675C484 663 490 652 500 647L444 660C416 671 388 679 373 674Q365 670 370 663Z';
 const shield='M491 707C476 716 453 740 445 761C433 788 452 817 476 839L513 870C529 881 546 882 560 870L603 829C613 817 610 804 600 794L582 782C563 782 548 769 540 754L528 726C517 716 504 710 491 707Z';
 const details=[
  'M373 667C405 667 445 651 488 639L541 624Q549 624 552 635L555 653L522 674',
  'M378 674C414 673 456 658 487 650',
  'M447 531C458 518 474 519 502 516C573 511 652 487 718 469',
  'M449 522C459 510 475 509 502 507C574 501 646 478 706 462',
  'M735 378C777 399 803 431 818 472C834 519 835 569 820 613C805 657 776 697 744 725',
  'M751 376C787 398 813 431 826 468',
  'M615 804C662 779 716 744 764 706C816 666 860 626 919 613',
  'M624 811C673 783 730 748 777 710C823 673 869 637 926 624',
  'M461 474C460 482 464 490 471 494Q478 496 479 490L472 475Q465 467 461 474Z',
  'M477 461C476 471 482 481 489 486Q496 489 498 482L488 464Q482 456 477 461Z',
  'M498 451C497 460 505 471 512 474Q518 475 518 469L508 453Q502 446 498 451Z',
  'M559 376Q580 366 603 366L608 370Q582 373 562 380Z',
  'M638 363Q672 357 703 364L709 370Q670 366 641 370Z',
  'M738 379Q762 391 777 409L780 416Q759 399 738 387Z',
  'M565 688C579 672 610 658 644 648L655 674C664 697 652 716 633 734C613 752 587 762 573 750C555 736 552 708 565 688Z',
  'M558 681C580 662 612 647 647 636L661 667C676 697 659 727 638 744C614 764 587 775 569 760C547 741 542 708 558 681Z',
  'M509 636L541 630L545 654L514 662Z M517 643Q529 636 536 643L537 650L520 655Z',
  'M488 719C475 735 453 756 450 774C448 793 466 815 489 836L519 861C534 871 546 871 556 861L593 825Q600 817 596 809',
  'M458 748L478 758L497 791L521 815L548 825L568 806',
  'M446 782C459 812 488 840 518 862',
  'M486 724L506 729L522 756L538 776L565 789',
  'M493 748L508 753L519 774L506 769Z M578 789L596 800L603 817L590 828L577 815Z'
 ];
 function buildMesh(compact=false){
  const cols=compact?16:24,rows=compact?16:24,points=[],edges=[];
  for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
   const u=i/cols,v=j/rows;
   points.push([350+610*u+18*Math.sin(v*Math.PI)*Math.sin(u*Math.PI),335+555*v+15*Math.sin(u*Math.PI)*Math.sin(v*Math.PI*2)]);
  }
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
   const a=j*(cols+1)+i,b=a+1,c=a+cols+1,d=c+1;edges.push([a,b],[a,c],(i+j)%2?[a,d]:[b,c]);
  }
  return {points,edges};
 }
 let serial=0;
 function mount(portrait){
  const existing=portrait.querySelector('.hero-helmet-ink');if(existing)return existing.inkController;
  const id='helmet-ink-'+(++serial),svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 1448 1086');svg.setAttribute('aria-hidden','true');
  svg.classList.add('hero-helmet-ink');svg.dataset.structure='current-photo-contours';
  const compact=!!window.matchMedia?.('(max-width:600px),(pointer:coarse)').matches;
  const mesh=buildMesh(compact),meshPath=mesh.edges.map(([a,b])=>`M${mesh.points[a].map(n=>n.toFixed(1)).join(' ')}L${mesh.points[b].map(n=>n.toFixed(1)).join(' ')}`).join('');
  const ear=details[14];
  // A soft band travels beyond both ends of the drawing before restarting.
  // Geometry remains photo-aligned; only light and opacity breathe.
  svg.innerHTML=`<defs>
   <clipPath id="${id}-surface"><path d="${shell} ${ear}" clip-rule="evenodd"/><path d="${shield}"/></clipPath>
   <linearGradient id="${id}-scan" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="190">
    <stop offset="0" stop-color="#30322f" stop-opacity="0"/>
    <stop offset=".25" stop-color="#30322f" stop-opacity=".14"/>
    <stop offset=".55" stop-color="#30322f" stop-opacity=".82"/>
    <stop offset=".78" stop-color="#30322f" stop-opacity=".22"/>
    <stop offset="1" stop-color="#30322f" stop-opacity="0"/>
    <animateTransform attributeName="gradientTransform" type="translate" values="0 60;0 920;0 920" keyTimes="0;.94;1" calcMode="spline" keySplines=".32 0 .55 1;0 0 1 1" dur="3.4s" repeatCount="indefinite"/>
   </linearGradient>
   <linearGradient id="${id}-highlight" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="190">
    <stop offset="0" stop-color="#f5f7f3" stop-opacity="0"/>
    <stop offset=".3" stop-color="#f5f7f3" stop-opacity="0"/>
    <stop offset=".45" stop-color="#f5f7f3" stop-opacity=".75"/>
    <stop offset=".55" stop-color="#f5f7f3" stop-opacity="1"/>
    <stop offset=".66" stop-color="#f5f7f3" stop-opacity=".6"/>
    <stop offset=".85" stop-color="#f5f7f3" stop-opacity="0"/>
    <stop offset="1" stop-color="#f5f7f3" stop-opacity="0"/>
    <animateTransform attributeName="gradientTransform" type="translate" values="0 60;0 920;0 920" keyTimes="0;.94;1" calcMode="spline" keySplines=".32 0 .55 1;0 0 1 1" dur="3.4s" repeatCount="indefinite"/>
   </linearGradient>
   <g id="${id}-drawing" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path class="helmet-shell" d="${shell}" stroke-width="2"/>
    <path class="helmet-guard" d="${shield}" stroke-width="1.8"/>
    <g class="helmet-details" stroke-width="1.35">${details.map(d=>`<path d="${d}"/>`).join('')}</g>
    <g class="helmet-markings" stroke-width="1.2">
     <ellipse cx="727" cy="532" rx="60" ry="64" transform="rotate(-12 727 532)"/>
     <ellipse cx="727" cy="532" rx="51" ry="55" transform="rotate(-12 727 532)"/>
     <path d="M700 511L706 551L725 547M717 550L727 504L749 541M722 533L743 529" stroke-width="2.5"/>
     <path d="M435 543L453 549L463 584L441 578Z M435 588L458 594L470 608L442 602Z M879 545L900 540L914 568L890 575Z"/>
     <circle cx="507" cy="644" r="3"/><circle cx="588" cy="808" r="3"/>
    </g>
    <g fill="none" stroke-width=".7" font-family="Arial,sans-serif" font-style="italic" font-weight="700">
     <text x="531" y="605" font-size="18" transform="rotate(-13 531 605)">RAWLINGS</text>
     <text x="863" y="615" font-size="12" transform="rotate(-15 863 615)">RAWLINGS</text>
     <text x="872" y="535" font-size="45" transform="rotate(-12 872 535)">23</text>
    </g>
   </g></defs>
   <g class="helmet-breath" opacity=".55">
    <animate attributeName="opacity" values=".42;.85;.42" keyTimes="0;.5;1" calcMode="spline" keySplines=".42 0 .58 1;.42 0 .58 1" dur="4.8s" repeatCount="indefinite"/>
    <g class="helmet-scan" stroke="url(#${id}-scan)" fill="none">
     <path class="helmet-mesh" d="${meshPath}" clip-path="url(#${id}-surface)" stroke-width=".8" opacity=".52"/>
     <use href="#${id}-drawing"/>
    </g>
    <g class="helmet-highlight" stroke="url(#${id}-highlight)" fill="none" clip-path="url(#${id}-surface)" opacity=".95">
     <path class="helmet-highlight-mesh" d="${meshPath}" stroke-width="1.05" opacity=".72"/>
     <use href="#${id}-drawing"/>
    </g>
   </g>`;
  portrait.append(svg);let active=true;
  const controller={
   setActive(value){value=!!value;if(value===active)return;active=value;if(active)svg.unpauseAnimations?.();else svg.pauseAnimations?.();svg.dataset.motion=active?'scanning':'paused';},
   setThumbnail(progress){svg.style.opacity=String(Math.max(0,1-progress)**1.5);},
   remove(){svg.remove();}
  };
  svg.dataset.quality=compact?'compact':'fine';svg.dataset.segments=String(mesh.edges.length);svg.dataset.motion='scanning';svg.inkController=controller;return controller;
 }
 window.HelmetInk={mount,buildMesh,outline:{shell,shield,details}};
})();
