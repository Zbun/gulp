module.exports={
	isFunction(obj){
		return getType(obj)==='function';
	},
	isString(obj){
		return getType(obj)==='string';
	},
	isArray(obj){
		return Array.isArray?Array.isArray(obj):getType(obj)==='array';
	},
	isObject(obj){
		return getType(obj)==='object';
	}
}