//加载等待提示，pcWaiting.show()、waiting.remove(),电脑端等待，没有提示文字,arg=global：全遮罩
// function Waiting(container) {
//     this.init(container);
//     return this;
// };

// Waiting.prototype.init = function(container) {
//     var container = getTarget(container) || document.body;
//     var box = container.querySelector('.PCwaiting');
//     if (!box) {
//         var div = document.createElement('div');
//         div.className = 'PCwaiting local';
//         box = div;
//         if (!container) {
//             div.style.position = 'fixed';
//         }
//         var style = document.createElement('style');
//         style.innerHTML = ".PCwaiting{position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.5);z-index:8888}.PCwaiting.local{left:50%;top:36%;width:50px;height:48px;margin-left:-25px;border-radius:3px;}.PCwaiting:after {content: ''; position: absolute; top: 50%; left: 50%; width: 3px; height: 3px; margin-top: -2px; margin-left: -2px; text-align: center; -webkit-border-radius: 100%; border-radius: 100%; box-shadow:0 0 3px; -webkit-transition: all, 0.3s, linear; transition: all, 0.3s, linear; -webkit-animation: am-wait 1.2s linear infinite; animation: am-wait 1.2s linear infinite;box-shadow:0 -10px 0 1px #eee, 10px 0px #eee, 0 10px #eee, -10px 0 #eee, -7px -7px 0 0.5px #eee, 7px -7px 0 0.5px #eee, 7px 7px #eee, -7px 7px #eee }@-webkit-keyframes am-wait {100% {-webkit-transform: rotate(1turn);transform: rotate(1turn);}}@keyframes am-wait {100% {-webkit-transform: rotate(1turn);transform: rotate(1turn);}";
//         box.appendChild(style);
//         // container.appendChild(w);
//     }
//     this.waitingContainer = container;
//     this.waitingBox = box;
// }
// Waiting.prototype.show = function() {
//     this.waitingContainer.appendChild(this.waitingBox);
//     return this;
// }
// Waiting.prototype.hide = function() {
//     this.waitingBox.style.display = 'none';
//     return this;
// }
// Waiting.prototype.remove = function() {
//     this.waitingContainer.removeChild(this.waitingBox);
// }

/**
 * 操作等待旋转提示，非全屏，可加参数，修改下方法，去掉className :local
 * @author Zhao Liubin
 */
class Waiting {
    constructor(container) {
        var container = getTarget(container) || document.body;
        var box = container.querySelector('.PCwaiting');
        if (!box) {
            var div = document.createElement('div');
            div.className = 'PCwaiting local';
            box = div;
            if (!container) {
                div.style.position = 'fixed';
            }
            var style = document.createElement('style');
            style.innerHTML = ".PCwaiting{position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.5);z-index:8888}.PCwaiting.local{left:50%;top:36%;width:50px;height:48px;margin-left:-25px;border-radius:3px;}.PCwaiting:after {content: ''; position: absolute; top: 50%; left: 50%; width: 3px; height: 3px; margin-top: -2px; margin-left: -2px; text-align: center; -webkit-border-radius: 100%; border-radius: 100%; box-shadow:0 0 3px; -webkit-transition: all, 0.3s, linear; transition: all, 0.3s, linear; -webkit-animation: am-wait 1.2s linear infinite; animation: am-wait 1.2s linear infinite;box-shadow:0 -10px 0 1px #eee, 10px 0px #eee, 0 10px #eee, -10px 0 #eee, -7px -7px 0 0.5px #eee, 7px -7px 0 0.5px #eee, 7px 7px #eee, -7px 7px #eee }@-webkit-keyframes am-wait {100% {-webkit-transform: rotate(1turn);transform: rotate(1turn);}}@keyframes am-wait {100% {-webkit-transform: rotate(1turn);transform: rotate(1turn);}";
            box.appendChild(style);
            // container.appendChild(w);
        }
        this.waitingContainer = container;
        this.waitingBox = box;
    }

    show() {
        this.waitingContainer.appendChild(this.waitingBox);
        return this;
    }

    hide() {
        this.waitingBox.style.display = 'none';
        return this;
    }
    remove() {
        this.waitingContainer.removeChild(this.waitingBox);
    }
}

module.exports = {
    show(container) {
        return new Waiting(container).show();
    },
    hide() {
        return new Waiting().hide();
    }
};
