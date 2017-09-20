import Vue from 'vue';
import $ from 'jquery';

export default {
  methods:{
    onDelRole(Ids = []) {
      let def = $.Deferred();
      dialog({
        title: '删除角色',
        content: '确定要删除此角色吗？',
        ok: () => {
          fetchData({
            API: 'api/RoleMenu/RoleDelete',
            para: {
              Ids
            },
            callback: data => {
              def.resolve(data)
            }
          })
        },
        cancel() {}
      }).showModal();
      return def;
    },
    onDelUserInRole(Users = []) {
      let def = $.Deferred();
      dialog({
        title:'删除',
        content:'确定要删除此角色下的用户吗？',
        ok:()=> {
          fetchData({
            api:'api/RoleMenu/RoleUserDelete',
            para:{Users},
            callback:data=>{
              def.resolve(data)
            }
          })
        },
        cancel() {}
      }).showModal()
      return def
    }
  }
}