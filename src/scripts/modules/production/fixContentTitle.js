/**
 * 固定内空标题、弹窗可拖动功能
 * @date   2016-09-27
 * @author zhao.liubin@zol.com.cn
 * @return {[type]}
 */
module.exports = function() {

  var resize = () => {
    let style = $('#attachStyle')[0];
    if (!style) {
      style = document.createElement('style');
      style.id = 'attachStyle';
    }
    // var menuHeight = localStorage.token && localStorage.token.length > 0 ? 50 : 0;
    style.innerHTML = '#main-box >.main{min-height:' + (document.documentElement.clientHeight - 155) + 'px}';
    document.head.appendChild(style);
  };
  //内容区撑开页面高度，使版权信息刚好在页面底部
  resize();
  //页面缩放时再调整大小
  window.onresize = resize;

  {
    let isDraging = false;
    let pHeight = 0;
    let pWidth = 0;
    let sml = 0;
    let smt = 0;
    let sel = 0;
    let set = 0;
    let $p = null;
    let pNode = null;
    let $t = [];
    $(document).on('mousedown', '.popup>.content>.title,.popup>.content>.footer', function(e) {
      isDraging = true;
      $t = $(this);
      $p = $t.parent();
      pNode = $p[0];
      pHeight = $p.outerHeight();
      pWidth = $p.width();
      var offset = $p.offset();
      sml = e.clientX,
        smt = e.clientY,
        sel = offset.left,
        set = offset.top - (document.body.scrollTop || document.documentElement.scrollTop);
      // banSelect();
      // this.setCapture && this.setCapture();
      return false;
    }).on('mouseup', function(e) {
      isDraging = false;
      // var $t = $(this);
      // var $p = $(this).parent();
      // $t.unbind();
      // openSelect();
      if (!$(e.target).closest('.intelligent-match').length) {
        $('.intelligent-match').find('.list').hide();
      }
      if (!$(e.target).closest('.show-history').length) {
        $('.show-history').find('.history-price').hide();
      }
      if ($p && $p.length) {
        let pOffset = $p.offset();
        let tOffset = $t.offset();
        ($p.is(':visible') && tOffset.top < 1) && $p.css('top', pOffset.top - tOffset.top + 10);
        // ($p.is(':visible') && pOffset.left < 1) && $p.css('left', 10);
      }
    }).on('mousemove', function(e) {
      if (!isDraging) return;
      var mdl = e.clientX - sml;
      var mdt = e.clientY - smt;
      // $p.css({
      //   left: mdl + sel,
      //   top: mdt + set,
      //   height: pHeight,
      //   bottom: 'auto',
      //   marginLeft: pWidth / 2
      // });
      pNode.style.left = mdl + sel + 'px';
      pNode.style.top = mdt + set + 'px';
      pNode.style.height = pHeight + 'px';
      pNode.style.bottom = 'auto';
      pNode.style.marginLeft = pWidth / 2 + 'px';
    }).on('keydown', function(e) {
      if (e.keyCode == 37) {
        $(this).find('.pageBox:visible').eq(0).find('[rel=prev]').click();
      } else if (e.keyCode == 39) {
        $(this).find('.pageBox:visible').eq(0).find('[rel=next]').click();
      }
    }).on('keydown', 'input,textarea', function(e) {
      if (e.keyCode == 37 || e.keyCode == 39) {
        e.stopPropagation();
      }
    }).on('focus', '.intelligent-match input', function() { //客户下拉智能感知
      $(this).closest('.intelligent-match').find('.list').show();
    }).on('click', '.show-history .action-show', function() {
      $('.show-history .history-price').hide();
      $(this).closest('.show-history').find('.history-price').show();
    }).on('click', '.gototop', function() {
      window.scrollTo(0, 0);
    });
    window.onblur = function() {
      isDraging = false;
    };
    window.onscroll = function() {
      let top = document.documentElement.scrollTop || document.body.scrollTop;
      if (top > 100) {
        $('.gototop').show();
      } else {
        $('.gototop').hide();
      }
    };
  }
};