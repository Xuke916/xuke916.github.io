(() => {
  'use strict';
  const dictionary = window.PORTFOLIO_EN;
  const normalize = text => text.replace(/\s+/g, ' ').trim();
  const attributes = ['alt', 'title', 'aria-label', 'placeholder'];
  const sources = new WeakMap();
  const hasChinese = text => /[\u3400-\u9fff]/.test(text || '');
  let language = 'zh';
  try { if (localStorage.getItem('portfolio-language') === 'en') language = 'en'; } catch {}

  function translate(text) {
    const key = normalize(text);
    if (Object.hasOwn(dictionary, key)) return dictionary[key];
    for (const [prefix, replacement] of [['放大查看：','Enlarge: '], ['放大查看','Enlarge: '], ['暂停演示：','Pause demo: '], ['继续演示：','Play demo: '], ['播放演示：','Play demo: '], ['前往','Go to '], ['查看','View ']]) {
      if (key.startsWith(prefix)) return replacement + translate(key.slice(prefix.length));
    }
    for (const [suffix, replacement] of [['，向下滚动以横向浏览',', scroll down to browse sideways'],['照片分类',' photo categories'],['细节',' details'],[' / 内容待补充',' / More coming soon']]) {
      if (key.endsWith(suffix)) return translate(key.slice(0,-suffix.length)) + replacement;
    }
    const numbered = key.match(/^(.*?) · (\d+\s*\/\s*\d+)$/);
    if (numbered) return translate(numbered[1]) + ' · ' + numbered[2];
    if (/\s[·/|]\s/.test(key)) return key.split(/(\s[·/|]\s)/).map(part=>/\s[·/|]\s/.test(part)?part:translate(part)).join('');
    if (key.includes('：')) return key.split('：').map(translate).join(': ');
    return text;
  }

  function updateValue(node, key, read, write) {
    const current = read();
    if (current == null) return;
    let values = sources.get(node);
    if (!values) sources.set(node, values = new Map());
    let record = values.get(key);
    // New route content and live captions may replace a previously translated value.
    if (!record || current !== record.output) record = { source: current, output: current };
    const result = language === 'en' ? translate(record.source) : record.source;
    record.output = result;
    values.set(key, record);
    if (result !== current) write(result);
  }

  function refresh(scope = document.body) {
    if (!scope) return;
    observer.disconnect();
    const element = scope.nodeType === Node.ELEMENT_NODE ? scope : scope.parentElement;
    if (!element || element.closest('script,style,noscript,code,[data-language-label]')) { observe(); return; }
    const process = el => {
      for (const attr of attributes) if (el.hasAttribute(attr)) updateValue(el, attr, () => el.getAttribute(attr), value => el.setAttribute(attr,value));
      if (el.matches('.wp-content')) el.lang = language === 'en' ? 'en' : 'zh-CN';
    };
    process(element);
    if (scope.nodeType === Node.TEXT_NODE) updateValue(scope,'text',()=>scope.nodeValue,value=>{scope.nodeValue=value;});
    else {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (node.nodeType === Node.ELEMENT_NODE && node.matches('script,style,noscript,code,[data-language-label]')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.nodeType === Node.TEXT_NODE) updateValue(node,'text',()=>node.nodeValue,value=>{node.nodeValue=value;});
        else process(node);
      }
    }
    syncButtons();
    observe();
  }
  const observer = new MutationObserver(records => {
    // Chinese is already the source language. Never do localization work for
    // animation counters or other DOM activity while it is selected.
    if (language !== 'en') return;
    const pending = new Set();
    const add = node => {
      if (node.nodeType === Node.TEXT_NODE) { if (hasChinese(node.nodeValue)) pending.add(node); return; }
      if (node.nodeType !== Node.ELEMENT_NODE || node.closest('script,style,noscript,code,[data-language-label]')) return;
      if (hasChinese(node.textContent) || attributes.some(attr=>hasChinese(node.getAttribute(attr))) || [...node.querySelectorAll('[alt],[title],[aria-label],[placeholder]')].some(el=>attributes.some(attr=>hasChinese(el.getAttribute(attr))))) pending.add(node);
    };
    for (const record of records) {
      if (record.type === 'childList') for (const node of record.addedNodes) add(node);
      if (record.type === 'characterData') add(record.target);
      if (record.type === 'attributes' && hasChinese(record.target.getAttribute(record.attributeName))) pending.add(record.target);
    }
    for (const node of pending) if (node.isConnected) refresh(node);
    if (pending.size) updateTitle();
  });
  function observe() { observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attributes}); }
  function updateTitle() {
    const title = document.querySelector('title');
    if (title) updateValue(title,'title',()=>title.textContent,value=>{title.textContent=value;});
  }
  function syncButtons() {
    for (const button of document.querySelectorAll('[data-site-language],[data-resume-language]')) {
      const pressed=String((button.dataset.siteLanguage || button.dataset.resumeLanguage) === language);
      if (button.getAttribute('aria-pressed') !== pressed) button.setAttribute('aria-pressed',pressed);
    }
  }
  function setLanguage(next) {
    if (!['zh','en'].includes(next)) return;
    language = next;
    try { localStorage.setItem('portfolio-language', language); } catch {}
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    refresh();
    updateTitle();
    syncButtons();
    document.dispatchEvent(new CustomEvent('portfolio:languagechange',{detail:{language}}));
  }
  document.addEventListener('click', event => {
    const button = event.target.closest?.('[data-site-language],[data-resume-language]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    setLanguage(button.dataset.siteLanguage || button.dataset.resumeLanguage);
  },true);
  window.PortfolioLanguage = {setLanguage, translate, refresh, get language(){return language;}};
  setLanguage(language);
})();
