/**
 * 操作等待旋转提示，非全屏，可加参数
 * 使用说明：require或webpack,单独使用时显示：waiting.show('可先容器字符串')，去除：waiting.hide();
 * 若修改源码时去掉className :local，变为全屏遮罩
 * @author Zhao Liubin
 */

class Waiting {
  waitingContainer: any;
  waitingBox: any;
  constructor(container: any) {
    container = document.querySelector(container) || document.body;
    // var box = container.querySelector('.PCwaiting');
    // if (!box) {
    var box = document.createElement('div');
    box.className = 'PCwaiting local';
    if (!container) {
      box.style.position = 'fixed';
    }
    box.innerHTML = `
      <div class="circle-box outer">
      <svg class="svg" width="60" height="60">
      <circle class="circle" cx="30" cy="30" r="26" stroke-width="5" stroke="#23A8F5" fill="none" stroke-dasharray="122 164"></circle>
        </svg></div>
      <div class="circle-box inner">
      <svg class="svg" width="42" height="42">
      <circle class="circle"  cx="21" cy="21" r="16" stroke-width="3" stroke="#23A8F5" fill="none" stroke-dasharray="75 101"></circle>
        </svg>
      </div>`;

    this.waitingContainer = container;
    if (container.tagName === 'BODY') {
      box.style.position = 'fixed';
    }
    this.waitingBox = box;
  }

  show() {
    this.waitingContainer.appendChild(this.waitingBox);
    return this;
  }

  hide() {
    this.waitingBox.parentNode == this.waitingContainer && this.remove();
    return this;
  }
  remove(): void {
    this.waitingContainer.removeChild(this.waitingBox);
  }
}

var exportObj = {
  entity: '',
  select: function (container: any) {
    return new Waiting(container);
  },
  show: function (container: any) {
    return this.entity = new Waiting(container).show();
  },
  hide: function () {
    this.entity && this.entity.hide();
  }
};

export =exportObj;