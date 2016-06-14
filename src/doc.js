//对话框
// var dialog = require('dialog');

// dialog({
//     skin:'mini',
//     content:"你好",
//     ok:function(){}
// }).showModal();

//请求等待动画，show的参数为容器，此时作为构造方法
var waiting = require('waiting');

waiting.show();

setTimeout(function() {
  waiting.hide();
}, 2500);


import cutString from 'cutstring';

console.log(cutString('df夺夺dfd', 16));

// var w2= waiting.show('.wrapper');
// setTimeout(function(){
//     w2.hide();
// },6000)

//各类校验
var validator = require('validator');

console.log(validator.isEmpty(3, '3434afdf', '    '));
//手机端弹窗
// var popup=require('popupMobile');
// popup({
//  title:'提示',
//  content:'你好啊',
//  ok:function(){
//      alert('ok')
//  }

// })

//标签切换
require('tabSwitcher.js');

//全选功能
require('checkAll.js');

// import al from 'alert.js';
// al(3)

//小标签选择弹窗
// $('[data-dialog-content]').on('click', function() {
//     var $t = $(this),
//         dialog_content = $t.data('dialogContent'),
//         dialog_title = $t.data('dialogTitle');
//     var d = dialog({
//         title: dialog_title,
//         onshow: function() {
//             //分页，后台来时删除库及本段代码
//             $('.user-selected-pagination').twbsPagination({
//                 totalPages: 15,
//                 visiblePages: 5,
//                 prev: '<',
//                 next: '>',
//                 onPageClick: function(event, page) {
//                     $('#page-content').text('Page ' + page);
//                 }
//             });
//         },
//         cancel: function() {
//             // alert('h')
//         },
//         cancelDisplay: false
//     });
//     d.content($('.popup-html').find('.' + dialog_content).html()).showModal();
// });

//顶部提示的，目前只有红色框
var showTipsOnTop = require('showTipsOnTop.js');

showTipsOnTop('未授权，请重试', '.wrapper');

//加载数据的操作小菊花
var spin = require('spinZ.js');

var s1 = spin($('.wrapper'));
setTimeout(function() {
  s1.stop()
}, 2000);

//操作提示，第二个参数为成功与失败，可传'error','false','warning'
var showTips = require('showTipsState');

// showTips('操作成功',function(){
// 	alert('OK');
// })

showTips('网络错误', 'error');

//侧滑删除、arg1=对象,arg2=回调,arg3=方向(right,up,down),arg4=偏移距离
var slideDel = require('slideDelete');

$('.js-slide-del').on('click', function() {
  var dir = $(this).data('delDirection');
  slideDel(this, function() {
    console.log('del')
  }, dir);
  return false;
});

//合并对象，未深度操作
var obj1 = {
    'name': 'JOBS',
    'job': 'CEO'
  },
  obj2 = {
    'name': 'Bill',
    sex: 'Man'
  },
  obj3 = {
    'age': 60,
    'eyeColor': 'Blue'
  }

// console.log(merge(obj1, obj2, 'sss', obj3));

//分页
require('pagination');
$('#pagination').twbsPagination({
  totalPages: 15,
  visiblePages: 7
});


//加载数据时右上角提示，可在show中加回调方法
loading.show();
setTimeout(function() {
  loading.hide()
}, 3000);

const tmpl = addrs => `
<ul>
${addrs.map(addr=>`<li><span>${addr.first} 
	${addr.last}</span></li>`).join('')}`

const a1=[{
	first:'Jone',
	last:'Smith'
},{
	first:'Zoe',
	last:'Cook'
}]

//上传文件等操作
var regExpFilter=/image\/(?:(?:jpe?g)|(?:gif)|(?:png))$/;

var upload=document.querySelector('#upload');
document.querySelector('.btn-upload').addEventListener('click', function(){
	upload.click();
},false);
upload.addEventListener('change', function(){
	var files=this.files;
	if(files.length<1){
		return;
	}
	var imgList='';
	Array.from(files).forEach(function(el,index){
			if(!regExpFilter.test(el.type)){
				console.warn(`${el.name}的格式不对，请重新上传`);
				return;
		}
	var oFReader=new FileReader();
	oFReader.onload=function(oFREvent){
		// document.querySelector('.preview').src=oFREvent.target.result;
		imgList+=`<img src="${oFREvent.target.result}">`;
		document.querySelector('#output').innerHTML=imgList;
	}
	oFReader.readAsDataURL(el);
	});

},false);

function handleFileSelect(evt){
	evt.stopPropagation();
	evt.preventDefault();
	var files=evt.dataTransfer.files;
	var output=[];
	for(var i=0,f;f=files[i];i++){
		output.push(`<div>${f.name}.${f.type}-${f.size}</div>`)
	}
	document.querySelector('#output').innerHTML=output.join('');
}
function handleDragOver(evt){
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect='copy';
}
var dropZone=document.querySelector('#dragZone');
dropZone.addEventListener('dragover', handleDragOver,false);
dropZone.addEventListener('drop', handleFileSelect,false);

document.querySelector('#iptSelect').addEventListener('select', function(e){
	console.log(e)
})


//拖动部分事件处理写法
var colsDrag=document.querySelector('#drag').querySelectorAll('.item');
var dragSrcEl='';
var Drag={
	evtList:['dragstart','dragover','dragleave','dragenter','dragend','dragexit','drop'],
	handle:{
		dragstart(e){
		this.style.opacity=0.5;
		dragSrcEl=this;
		e.dataTransfer.effectAllowed='move';
		e.dataTransfer.setData('text/html',this.innerHTML);
	},
	dragenter(e){
		this.classList.add('over');
	},
	dragleave(e){
		this.classList.remove('over');
	},
	dragover(e){
		if(e.preventDefault){
			e.preventDefault();
		}
		e.dataTransfer.dropEffect='move';
		return false;
	},
	dragend(e){
		this.style.opacity=1;
		[].forEach.call(colsDrag,function(el){
			el.classList.remove('over');
		});
	},
	drop(e){
		if(e.stopPropagation){
			e.stopPropagation();
		}
		if(dragSrcEl!=this){
			dragSrcEl.innerHTML=this.innerHTML;
			this.innerHTML=e.dataTransfer.getData('text/html');
		}
		return false;
	}
	}
};

[].forEach.call(colsDrag,function(el,index){
	Drag.evtList.forEach(function(evt,index){
		el.addEventListener(evt, Drag.handle[evt],false);
	})
})
