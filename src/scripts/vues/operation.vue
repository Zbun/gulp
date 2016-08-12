<template>
  <div class="item on">
    <table class="table text-center table-hover">
      <thead>
        <tr>
          <th width="40%" class="text-left">
            <span class="ml5">任务名称</span>
          </th>
          <th>
            开始时间
          </th>
          <th>
            结束时间
          </th>
          <th>
            操作
          </th>
          <th width="8%">
            备注
          </th>
          <th width="8%">
            标签
          </th>
          <th width="8%">
            数据统计
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of list" v-cloak>
          <td>
            <p class="text-ellipsis text-left pl10" :title="item.name">{{item.name}}</p>
          </td>
          <td>
            <p class="text-nowrap">{{item.startDate}}</p>
          </td>
          <td>
            <p class="text-nowrap">{{item.endDate}}</p>
          </td>
          <td>
            <div class="action-field">
              <a class="item" href="/operation/sponsor.html?activityId={{item.id}}">查看流程</a>
              <a class="item" href="javascript:;" @click="end(item.id)">结束任务</a>
            </div>
          </td>
          <td>
            <i class="yqy-tanhao icon on remark" data-class="remark" :data-id="item.id" @click="remark($event,item.id)"></i>
          </td>
          <td>
            <i class="yqy-huiyuanbiaoqian icon on tag" data-class="tag" :data-id="item.id" @click="tag($event,item.id)"></i>
          </td>
          <td>
            <i class="yqy-shangzhuang icon on statistic" data-class="statistic" :data-id="item.id" @click="analysis($event,item.id)"></i>
          </td>
        </tr>
        <tr v-if="isEmpty" v-cloak class="data-empty">
          <td colspan=7 class="item">
            <p>暂无任务，快添加一个吧</p>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination1 text-center" v-if="!isEmpty">
    </div>
  </div>
  <div class="item ">
    <table class="table text-center table-hover">
      <thead>
        <tr>
          <th width="40%" class="text-left">
            <span class="ml5">任务名称</span>
          </th>
          <th>
            开始时间
          </th>
          <th>
            结束时间
          </th>
          <th>
            操作
          </th>
          <th width="8%">
            备注
          </th>
          <th width="8%">
            标签
          </th>
          <th width="8%">
            数据统计
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of listEnd" v-cloak>
          <td>
            <p class="text-ellipsis text-left pl10">{{item.name}}</p>
          </td>
          <td>
            <p class="text-nowrap">{{item.startDate}}</p>
          </td>
          <td>
            <p class="text-nowrap">{{item.endDate}}</p>
          </td>
          <td>
            <div class="action-field">
              <a class="item" href="/operation/sponsor.html?activityId={{item.id}}">查看流程</a>
            </div>
          </td>
          <td>
            <i class="yqy-tanhao icon on remark" data-class="remark" @click="remark($event,item.id,'read')"></i>
          </td>
          <td>
            <i class="yqy-huiyuanbiaoqian icon on tag" data-class="tag" @click="tag($event,item.id,'read')"></i>
          </td>
          <td>
            <i class="yqy-shangzhuang icon on statistic" data-class="statistic" @click="analysis($event,item.id,'read')"></i>
          </td>
        </tr>
        <tr v-if="isEmptyEnd" style="display:none;" v-cloak>
          <td colspan=7 class="data-empty">
            <p class="item">暂无任务，快添加一个吧</p>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination2 text-center" v-if="!isEmptyEnd">
    </div>
  </div>
</template>
<script>
var op = require('src/config.js').operation;
import 'pagination';
import waiting from 'waiting';
import showTips from 'showTipsState';
export default {
  data() {
      return {
        list: [],
        isEmpty: false,
        listEnd: [],
        isEmptyEnd: false,
        isEditing: 0,
        tipsEdit: '有内容正在编辑哦，请点击确认按钮'
      }
    },
    methods: {
      getData(index) {
        var vm = this;
        var gd = function(index) {
          $.post(op.API.get, {
              index: index || 1,
              size: op.pagination.size
            },
            function(data) {
              vm.list = data.data.dataList;
              vm.isEmpty = data.data.dataList.length == 0;
              if (!vm.isEmpty && !index) {
                $('.pagination1').twbsPagination({
                  totalPages: data.data.page,
                  visiblePages: op.pagination.visiblePages,
                  goVal: '',
                  initiateStartPageClick: false,
                  onPageClick: function(event, page) {
                    gd(page)
                  }
                });
              }
            }, 'JSON');
        }
        var gde = function(index) {
          $.post(op.API.get, {
              index: index || 1,
              size: op.pagination.size,
              status: 'complete'
            },
            function(data) {
              vm.listEnd = data.data.dataList;
              vm.isEmptyEnd = data.data.dataList.length == 0;
              if (!vm.isEmptyEnd && !index) {
                $('.pagination2').twbsPagination({
                  totalPages: data.data.page,
                  visiblePages: op.pagination.visiblePages,
                  goVal: '',
                  initiateStartPageClick: false,
                  onPageClick: function(event, page) {
                    gde(page)
                  }
                });
              }
            }, 'JSON')
        }
        gd();
        gde();
      },
      end(id) {
        var vm = this;
        dialog({
          width: 300,
          skin: 'mini',
          content: '<div>结束后，此活动将移入已完成列表并不可再编辑。<p style="margin-top:10px;"><label><input type=checkbox checked>将任务推荐到运营方法</label></div>',
          ok: function() {
            waiting.show();
            $.ajax({
              url: op.API.activity.set,
              dataType: 'JSON',
              data: {
                id: id
              },
              success: function(data) {
                waiting.hide();
                vm.getData();
                showTips(data.message);
              },
              error: function() {
                showTips('网络有点问题，请稍候再操作哦', 'error');
              }
            })
          },
          cancel: function() {}
        }).showModal();
      },
      qiu(t) {
        if (this.isEditing) {
          showTips(this.tipsEdit, 'error');
          return true;
        }
        var $t = $(t),
          $p = $t.parent(),
          $pp = $p.parent(),
          curClass = $t.data('class');
        if ($pp.next().hasClass(curClass)) {
          return true;
        }
        $pp.parent().find('>.info').remove();
        $pp.parent().find('td.on').removeClass('on');
        $p.addClass('on');
      },
      tag(event, id, read) {
        var $pp = $(event.target).closest('tr');
        if (this.qiu(event.target)) {
          return;
        }
        var $str = $('<tr class="info tag"><td colspan="7"><div class="content"><span class="title item">任务标签：</span><div class="text"><section class="tags"></section></div></div></td></tr>');
        if (!read) {
          $str.find('.tags').before('<button class="btn btn-o fr btn-edit">编辑</button>');
          $str.find('.text').after(`<div class="edit tags tags-action tags-o"><button class="btn btn-o fr btn-save" data-id="${id}">确认</button><span class="tags-area"></span><span class="ipt-with-plus-o"><input type="text" class="ipt-o" maxlength=8><i class="icon btn-tag-add">+</i></span></div>`)
        }
        $pp.after($str);
        $.get(op.API.tag.get, {
          id: id
        }, function(data) {
          var arrTag = data.data.tags;
          var htmlTag = '';
          arrTag.forEach(function(el) {
            htmlTag += `<span>${el}</span>`;
          });
          $str.find('.text .tags').html(htmlTag || '暂无标签');

          if (!read) {
            var htmlTagA = '';
            arrTag.forEach(function(el) {
              htmlTagA += `<span class="tag">${el}<i class="icon tag-del"></i></span>`;
            })
            $str.find('.tags-area').html(htmlTagA);
          }
        }, 'JSON');
      },
      remark(event, id, read) {
        var $pp = $(event.target).closest('tr');
        if (this.qiu(event.target)) {
          return;
        }
        var $str = $('<tr class="info remark"><td colspan="7"><div class="content"><span class="title item">任务备注：</span><div class="text"><section class="text"></section></div><div class="edit"></div></div></td></tr>');
        if (!read) {
          $str.find('section.text').before('<button class="btn btn-o fr btn-edit">编辑</button>');
          $str.find('.edit').html('<button class="btn btn-o fr btn-save">确定</button><input type="text" class="ipt-o" maxlength=500 placeholder="输入备注">')
        }
        $pp.after($str);
        $.get(op.API.remark.get, {
          id: id
        }, function(data) {
          var d = data.data;
          $str.find('section.text').text(d.remark || '暂无备注');
          $str.find('.edit').find('input').val(d.remark);
          $str.find('.btn-save').data('id', d.id);
        }, 'JSON')
      },
      analysis(event, id, read) {
        var $pp = $(event.target).closest('tr');
        if (this.qiu(event.target)) {
          return;
        }
        var $str = $('<tr class="info op statistic" tabindex=50><td colspan="7"><div class="content"><span class="title item">数据统计：</span></div></td></tr>');
        $pp.after($str);
        $.get(op.API.analysis.get, {
          id: id
        }, function(data) {
          var d = data.data;
          var str = '暂无相关数据';
          if (!d.empty) {
            str = (d.showPv ? `<span>浏览量：<b class="num">${d.pv}</b></span>` : '') +
              (d.showUv ? `<span>参与人数：<b class="num">${d.uv}</b></span>` : '') +
              (d.showShare ? `<span>游戏分享量：<b class="num">${d.share}</b></span>` : '') +
              (d.showOrder ? `<span>下单数：<b class="num">${d.order}</b></span>` : '') +
              (d.showWin ? `<span>游戏获奖数：<b class="num">${d.win}</b></span>` : '');
          }
          $str.find('.title').after(str);
        }, 'JSON')
      }
    },
    ready: function() {

      var vm = this;
      this.getData();

      //这就是那种失去焦点隐藏的标签、备注那几个框的鸟方法。
      $('body').on('click', function(e) {
        var $t = $(e.target);
        if ($t.hasClass('statistic') || $t.hasClass('remark') || $t.hasClass('tag') || $t.closest('.info').length > 0) {
          return;
        } else {
          if (vm.isEditing) {
            showTips(vm.tipsEdit, 'error');
            return;
          }
          $('.operation').find('.table').find('.info').remove().end().find('td.on').removeClass('on');
        }
      })


      var slideDel = require('slideDelete.js');

      $('.operation').on('click', '.table .btn-edit', function() {
        vm.isEditing = 1;
        $(this).parent().hide().next().show();
        var $tags = $(this).parent().next();
        if ($tags.find('.tags-area').children().length > 9) {
          $tags.find('.ipt-with-plus-o').hide();
        }
      }).on('click', '.table .info.remark .btn-save', function() {
        //编辑标签
        var $t = $(this),
          remark = $t.siblings('input').val();
        $.post(op.API.remark.set, {
          id: $t.data('id'),
          remark: remark
        }, function(data) {
          if (data.success) {
            vm.isEditing = 0;
            $t.parent().hide().prev().show().find('.text').text(remark || '暂无备注');
          }
        }, 'JSON');
      }).on('click', '.table .info.tag .btn-save', function() {
        var $t = $(this);
        var arrTag = $t.next().find('.tag').map(function() {
          return $(this).text();
        }).get();
        $.post(op.API.tag.set, {
          id: $t.data('id'),
          tag: arrTag
        }, function(data) {
          if (data.success) {
            vm.isEditing = 0;
            var htmlTag = '';
            arrTag.forEach(function(el) {
              htmlTag += `<span>${el}</span>`;
            })
            $t.parent().hide().prev().show().find('.tags').html(htmlTag || '暂无备注');
          }
        }, 'JSON')

      }).on('click', '.table .info.tag .btn-tag-add', function() {
        var $t = $(this),
          $p = $t.parent(),
          $ipt = $p.find('input'),
          text = $ipt.val();
        if (!/^\s*$/.test(text)) {
          $p.prev().append(`<span class="tag">${text}<i class="icon tag-del"></i></span>`);
          $ipt.val('');
        }
        if ($p.prev().children().length >= 10) {
          $p.hide();
        }
      }).on('click', '.table .info.tag .tag-del', function() {
        $(this).closest('.tags').find('.ipt-with-plus-o').show();
        slideDel($(this).parent(), '', '', 0);
        return false;
      })

    }
}
</script>
