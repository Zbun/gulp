//合并对象
module.exports=(objTo={},objFrom)=>{
	objTo=typeOf.isObject(objTo)?objTo:{};
	if(!typeOf.isObject(objFrom)){
		return objTo;
	}
	Object.keys(objFrom).forEach(function(item){
		objTo[item]=objFrom[item]
	});
	return objTo;
}