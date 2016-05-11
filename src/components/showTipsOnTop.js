 //顶部提示框

 function showTipsOnTop(content, target, time) {
     var div = document.createElement('div'),
         tar = '';
     var cssText = 'position:absolute;left:25%;right:25%;top:0;padding:4px 30px;border:1px solid #ffd0c0;text-align:center;background:#fff6f3;color:#fb6362;line-height:2;z-index:5;';
     div.innerHTML = content || '小提示';
     div.classList.add('tips-top');
     div.style.cssText = cssText;

     tar = getTarget(target) || document.body;
     tar.insertBefore(div, tar.firstChild);

     var t = parseInt(time);
     if (t) {
         setTimeout(function() {
             tar.removeChild(div);
         }, t)
     }
 }
 module.exports = showTipsOnTop;
