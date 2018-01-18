module.exports = {
  CUSTOMER: {
    DROPDOWNLIST: '/API/Customer/AccountList', //不分页，下拉时用
  },
  SUPPLIER: {
    LIST: '/Api/Supplier/LIST', //供应商列表
    PREVIEW: '/Api/Supplier/PREVIEW', //供应商修改预览
    BANK: { //银行相关
      INSERT: '/Api/Supplier/BankInsert',
      UPDATE: '/Api/Supplier/BankUpdate',
      LIST: '/Api/Supplier/BankList',
      PREVIEW: '/Api/Supplier/BankPreview',
      DELETE: '/Api/Supplier/BankDelete',
    }
  },
  BORROW: { //借机
    LIST: 'Api/Borrow/list',
    PREVIEW: 'Api/Borrow/PREVIEW',
  },
  STATEMENT: { //报表
    LIBRARYERP: 'API/Report/InventoryInAndOut', //仓库进销存
  },
  FINACE: {
    BANK: {
      LIST: '/Api/Misc/CompanyBankList' //公司银行账户
    },
  }
};