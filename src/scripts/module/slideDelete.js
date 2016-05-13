var getTargets = require('getTarget');

module.exports = (target = '', callback = '', direction = 'left', distance = 30) => {
    var target = getTarget(target)
    if (target) {
        var dir = '';
        switch (direction) {
            case 'up':
                dir = 'translateY(-' + distance + 'px)';
                break;
            case 'down':
                dir = 'translateY(' + distance + 'px)';
                break;
            case 'right':
                dir = 'translateX(' + distance + 'px)';
                break;
            default:
                dir = 'translateX(-' + distance + 'px)';
                break;
        }
        target.style.cssText = 'transition:.3s ease-out;z-index:-1;transform:' + dir + ';opacity:.1';
        var _remove = function() {
            target.parentNode.removeChild(target);
            typeof callback === 'function' && callback();
        }
        setTimeout(_remove, 200);
    }
}
