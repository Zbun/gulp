<template>
  <div class="main">
    <h2 class="content-title">公司信息</h2>
    <div class="content-field mt10">
      <div class="content-large w60p mt20 shadow-box">
        <div class="m20 set">
          <dl class="item">
            <dt class="title">
              公司名称：
            </dt>
            <dd class="content">
              {{datalist.Name}}
            </dd>
          </dl>
          <dl class="item">
            <dt class="title">
              联系人：
            </dt>
            <dd class="content">
              {{datalist.Contact}}
            </dd>
          </dl>
          <dl class="item">
            <dt class="title">
              电话：
            </dt>
            <dd class="content">
              {{datalist.Phone}}
            </dd>
          </dl>
          <dl class="item">
            <dt class="title">
              邮箱：
            </dt>
            <dd class="content">
              {{datalist.Email}}
            </dd>
          </dl>
          <dl class="item">
            <dt class="title">
              区域：
            </dt>
            <dd class="content">
              <span class="area">
              {{datalist.Area}}
            </span>
            </dd>
          </dl>
          <dl class="item">
            <dt class="title">
              地址：
            </dt>
            <dd class="content">
              {{datalist.Address}}
            </dd>
          </dl>
          <dl class="item">
            <dt class="title">
              邮编：
            </dt>
            <dd class="content">
              {{datalist.Zip}}
            </dd>
          </dl>
        </div>
      </div>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
      return {
        API: {
          list: '/Api/Misc/CompanyPreview'
        },
        inited: false,
        datalist: {},
      }
    },
    computed: {},
    components: {},
    methods: {
      initPageData() {
        var me = this;
        fetchData({
          API: this.API.list,
          callback(data) {
            // console.log(data);
            me.inited = true;
            me.datalist = data;
            setTimeout(me.initAreaSelector, 10);
          }
        })
      },
      initAreaSelector() {
        areaSelector(this.$el.querySelector('.area'));
      },
    },
    ready() {
      this.initPageData();
    },
}
</script>
