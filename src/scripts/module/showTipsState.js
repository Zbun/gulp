/**
 * 操作提示，需要进一步封装为成功或失败方法
 * @author  Zhao Liubin
 * @type {[type]}
 */
var typeOf=require('typeOf');

module.exports=(content='操作成功',state='ok',callback='',time=3000)=>{
	var box=document.createElement('div');
	var styleBox= 'position: fixed;top: 36%;left: 50%;min-width:150px;padding: 1em 2em;border: 1px solid;line-height: 1;text-align: center;color: #1fb5ac;background: #fff;-webkit-border-radius: 3px;-moz-border-radius: 3px;border-radius: 3px;z-index: 10;-webkit-transform: translate(-50%,-50%);transform: translate(-50%,-50%);'
	box.style.cssText=styleBox;
	box.classList.add('tips-state');

	var icon=document.createElement('i');
	var styleIcon='display: inline-block;width: 28px;margin-top: 4px;margin-bottom: 10px;border: 1px solid;font-size: 24px;line-height: 26px;-webkit-border-radius: 100%;border-radius: 100%;'
	icon.innerHTML='&#x2713';
	icon.style.cssText=styleIcon;
	if(state==='false'||state==='cancel'||state==='error'){
		box.style.color='#fb6363';
		icon.innerHTML='!';
	}
	box.appendChild(icon);
	var contentWrapper=document.createElement('p');
	contentWrapper.innerHTML=content;
	box.appendChild(contentWrapper);

	document.body.appendChild(box);

	var _close=function(){
		document.body.removeChild(box);
	};

	setTimeout(function(){
		_close();
		typeOf.isFunction(callback) && callback();
	},time)
	
}