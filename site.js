/* Spark English Center — interior pages: tabs (works alongside spark.js + blog.js) */
(function(){
  'use strict';
  document.querySelectorAll('.tabs').forEach(function(tabs){
    var buttons=Array.prototype.slice.call(tabs.querySelectorAll('.tab-list button'));
    var wrap=tabs.querySelector('.tab-panels')||tabs;
    var panels=Array.prototype.slice.call(wrap.querySelectorAll('.tab-panel'));
    buttons.forEach(function(btn,i){
      btn.addEventListener('click',function(){
        buttons.forEach(function(b){b.classList.remove('active');});
        panels.forEach(function(p){p.classList.remove('active');});
        btn.classList.add('active');
        var key=btn.getAttribute('data-tab');
        var target=key?wrap.querySelector('[data-tab-panel="'+key+'"]'):panels[i];
        if(target)target.classList.add('active');
      });
    });
  });
})();
