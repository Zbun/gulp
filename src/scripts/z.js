(function(){
	$=function(ele,context){

		var curNode=context||window.document,eleList=[];
		var sPrivate='zlb HELLO';
		eleList.push(curNode.querySelector(ele));
		return eleList

	}
	$.fn=$.prototype={
	addClass:function(cn){alert(this);
		eL=this[0];
		alert(el);
		
		this.classList.add(cn);
		return this.extend;
	}

}
})()