/**
 * 合并对象，非深度
 * @author Zhao Liubin
 * @date   2016-05-19
 * @param  {Object}
 * @param  {object,object}
 * @return {[type]}
 */
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