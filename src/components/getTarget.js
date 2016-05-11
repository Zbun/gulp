module.exports = (target) => {
    if (target) {
        if (typeof target == 'string') {
            return document.querySelector(target);
        } else if (target.nodeName) {
            return target;
        } else {
            return target[0]
        }
    }
    else{
    	return '';
    }
}
