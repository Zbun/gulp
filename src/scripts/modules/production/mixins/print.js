module.exports = {
  methods: {
    printSN(obj) {
      const t = obj.t + '';
      try {
        var LODOP = getLodop();
        if (LODOP) {
          switch (t) {
            case "1":
              {
                LODOP.PRINT_INIT("打印SN");
                LODOP.SET_PRINT_STYLE("FontSize", 8);
                LODOP.SET_PRINT_STYLE("Bold", 0);
                LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
                LODOP.SET_PRINT_PAGESIZE(1, 300, 100, '');
                LODOP.ADD_PRINT_BARCODE('0.5mm', '1mm', '30mm', '10mm', '128Auto', obj.code);
                break;
              }
            case "2":
              {
                LODOP.PRINT_INIT("打印SN");
                LODOP.SET_PRINT_STYLE("FontSize", 8);
                LODOP.SET_PRINT_STYLE("Bold", 0);
                LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
                LODOP.SET_PRINT_PAGESIZE(1, 200, 100, '');
                LODOP.ADD_PRINT_BARCODE('0.5mm', '1mm', '20mm', '10mm', '128Auto', obj.code);
                break;
              }
            case "3":
              {
                LODOP.PRINT_INITA(-1, 2, 800, 600, "套打EMS的模板");
                LODOP.ADD_PRINT_TEXT(35, 36, 65, 20, "包装日期");
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
                LODOP.ADD_PRINT_BARCODE(96, 35, 154, 52, "Code39", obj.code);
                LODOP.ADD_PRINT_TEXT(67, 35, 80, 20, obj.PackageDate);
                LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                LODOP.ADD_PRINT_TEXT(35, 132, 65, 20, "保质期至");
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
                LODOP.ADD_PRINT_TEXT(67, 132, 80, 20, obj.ExpirationDate);
                LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                LODOP.ADD_PRINT_TEXT(36, 223, 60, 20, "单价");
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
                LODOP.ADD_PRINT_TEXT(66, 224, 70, 20, obj.ProPrice);
                LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                LODOP.ADD_PRINT_TEXT(36, 311, 60, 20, "数量");
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
                LODOP.ADD_PRINT_TEXT(66, 312, 50, 20, obj.ProCount);
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
                LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                LODOP.ADD_PRINT_TEXT(95, 194, 90, 25, "总价(元)");
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
                LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                LODOP.ADD_PRINT_TEXT(121, 303, 50, 25, obj.TotalMoney);
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
                LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                LODOP.ADD_PRINT_TEXT(163, 79, 223, 36, obj.BranchName);
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
                LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
                LODOP.ADD_PRINT_TEXT(3, 147, 122, 30, obj.ProName);
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
                break;
              }
          }
          // LODOP.PRINT_INIT("打印SN");
          // LODOP.SET_PRINT_STYLE("FontSize", 8);
          // LODOP.SET_PRINT_STYLE("Bold", 0);
          // LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);
          // // if (me.dataOut.goodsInfo.TemplateType == '1') {
          // //   LODOP.SET_PRINT_PAGESIZE(1, 470, 100, '');
          // //   LODOP.ADD_PRINT_BARCODE('0', '4mm', '20mm', '10mm', '128Auto', code);
          // //   LODOP.ADD_PRINT_BARCODE('0', '26mm', '20mm', '10mm', '128Auto', code);
          // // }
          // // if (me.dataOut.goodsInfo.TemplateType == '2') {
          // LODOP.SET_PRINT_PAGESIZE(1, 300, 100, '');
          // LODOP.ADD_PRINT_BARCODE('0.5mm', '1mm', '30mm', '10mm', '128Auto', code)
          // }
          //LODOP.SET_PRINT_STYLEA(2, "FontSize", 8);
          // LODOP.PREVIEW();
          if (LODOP.CVERSION) {
            LODOP.On_Return = function (taskID, Value) {
              if (Value > 0) {} else {
                alert('放弃打印');
              }
            };
            LODOP.PREVIEW();
          } else {
            if (LODOP.PRINTA()) {
              alert('直接加入打印队列');
            } else {
              alert('直接放弃打印');
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
}