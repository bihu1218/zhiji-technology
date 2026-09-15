(() => {
 'use strict';
 const $ = selector => document.querySelector(selector);
 const contact = $('#contact'), film = $('#film'), video = film.querySelector('video');
 let trigger = null, playRequest = 0;
 const menu = $('.menu-toggle'), nav = $('#navigation');
 function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','打开导航菜单');nav.classList.remove('open');}
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'关闭导航菜单':'打开导航菜单');nav.classList.toggle('open',open);});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
 document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
 function show(dialog,button){closeMenu();trigger=button;dialog.showModal();document.body.classList.add('modal-open');dialog.querySelector('[data-close]').focus({preventScroll:true});}
 document.querySelectorAll('[data-contact]').forEach(button=>button.addEventListener('click',()=>{
  $('#contact-topic').textContent=button.dataset.service?`咨询${button.dataset.service}：微信扫码，联系知几智创。`:'微信扫码，联系知几智创业务咨询。';show(contact,button);
 }));
 document.querySelectorAll('[data-play]').forEach(button=>button.addEventListener('click',()=>{
  const seek=Number(button.dataset.seek||0),request=++playRequest;$('#video-status').textContent='';show(film,button);
  const start=()=>{if(!film.open||request!==playRequest)return;video.currentTime=seek;video.play().catch(()=>{$('#video-status').textContent='请点击视频中的播放按钮开始观看。';});};
  if(video.readyState>=1)start();else{video.addEventListener('loadedmetadata',start,{once:true});video.load();}
 }));
 video.addEventListener('error',()=>{$('#video-status').textContent='视频加载失败，请刷新页面重试。';});
 document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
  dialog.addEventListener('keydown',e=>{
   if(e.key!=='Tab')return;
   const items=[...dialog.querySelectorAll('button,a[href],video[controls]')].filter(el=>!el.disabled);
   const first=items[0],last=items.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
  dialog.addEventListener('close',()=>{if(dialog===film){playRequest++;video.pause();}document.body.classList.remove('modal-open');trigger?.focus({preventScroll:true});});
 });
 const scenarios={
  knowledge:{source:'企业产品资料',detail:'产品介绍、内部制度、常见问题',core:'检索与整理',coreDetail:'按权限查找相关资料',title:'回答有依据。',result:'整理与问题相关的信息，保留来源；资料不足时，提示人工补充。',tags:['来源可查','人工复核'],question:'适合讨论的问题：企业资料很多，团队查找答案仍然费时。'},
  sales:{source:'销售沟通资料',detail:'产品说明、客户问题、沟通记录',core:'梳理与归纳',coreDetail:'围绕客户问题组织信息',title:'沟通有准备。',result:'整理相关产品资料与答复草稿，由业务人员核对后用于沟通。',tags:['草稿辅助','人工确认'],question:'适合讨论的问题：每次客户咨询，都要重新查资料、准备介绍。'},
  workflow:{source:'业务任务与表格',detail:'任务清单、状态记录、业务规则',core:'连接与流转',coreDetail:'根据确认的规则组织处理',title:'流程可追踪。',result:'连接具备接口条件的工具，记录处理状态，在关键节点保留人工确认。',tags:['状态留痕','人工节点'],question:'适合讨论的问题：同一项工作，需要在多个工具之间反复搬运。'}
 };
 const tabs=[...document.querySelectorAll('[data-scene]')];
 function select(tab){
  tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});
  const s=scenarios[tab.dataset.scene];
  Object.entries({'source-title':s.source,'source-detail':s.detail,'core-title':s.core,'core-detail':s.coreDetail,'result-title':s.title,'result-detail':s.result,'scenario-question':s.question}).forEach(([id,text])=>document.getElementById(id).textContent=text);
  const tags=$('#result-tags');tags.replaceChildren(...s.tags.map(text=>{const span=document.createElement('span');span.textContent=text;return span;}));
  $('#scenario-panel').setAttribute('aria-labelledby',tab.id);
 }
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(tab));tab.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=tabs[(i+1)%tabs.length];if(e.key==='ArrowLeft')n=tabs[(i+tabs.length-1)%tabs.length];if(e.key==='Home')n=tabs[0];if(e.key==='End')n=tabs.at(-1);if(n){e.preventDefault();select(n);n.focus();}});});
 const builds={workspace:['团队工作界面','任务与协作流程','数据与接口','把分散的任务、资料与处理状态，组织在适合团队的工作界面里。'],connect:['现有工具入口','数据交换与流转','已有系统接口','根据现有系统的接口与权限条件，讨论资料和状态怎样在工具间流转。'],product:['专项业务界面','专属处理逻辑','业务数据结构','围绕一个具体业务，讨论需要的功能、使用角色和验证方式。']};
 document.querySelectorAll('[data-build]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-build]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  ['layer-ui','layer-flow','layer-data','build-detail'].forEach((id,i)=>document.getElementById(id).textContent=builds[button.dataset.build][i]);
  $('.architecture').classList.remove('switching');requestAnimationFrame(()=>$('.architecture').classList.add('switching'));
 }));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(!reduced.matches&&'IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');observer.unobserve(e.target);}}),{threshold:.1});
  document.documentElement.classList.add('motion-enabled');
  document.querySelectorAll('.section-intro,.service-link,.creative-copy,.film-feature,.scenario,.custom-copy,.architecture,.steps,.faq,.closing-layout').forEach(el=>{el.classList.add('enter');observer.observe(el);});
  reduced.addEventListener('change',e=>{if(e.matches){document.documentElement.classList.remove('motion-enabled');observer.disconnect();}});
 }
})();

(()=>{const stage=document.querySelector('.ribbon-stage'),reduce=matchMedia('(prefers-reduced-motion: reduce)');function reset(){stage.style.setProperty('--rx','0deg');stage.style.setProperty('--ry','0deg')}stage.addEventListener('pointermove',e=>{if(reduce.matches||e.pointerType==='touch')return;const r=stage.getBoundingClientRect();stage.style.setProperty('--rx',((.5-(e.clientY-r.top)/r.height)*7)+'deg');stage.style.setProperty('--ry',(((e.clientX-r.left)/r.width-.5)*10)+'deg')});stage.addEventListener('pointerleave',reset);stage.addEventListener('blur',reset);stage.addEventListener('keydown',e=>{if(reduce.matches)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();stage.style.setProperty('--ry',e.key==='ArrowLeft'?'-5deg':'5deg')}if(e.key==='Escape')reset()});reduce.addEventListener('change',reset)})();
