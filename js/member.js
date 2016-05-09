(function($) {
	$.fn.Hover3 = function(options) {
		var defaults = {
			children: 'div',
			timeout: 100,
			closetimer: 0,
			ddmenuitem: 0
		};
		var options = $.extend(defaults, options);
		$(this).hover(function() {
			if (options.closetimer) {
				window.clearTimeout(options.closetimer);
				options.closetimer = null;
			}
			if (options.ddmenuitem) {
				options.ddmenuitem.hide();
			}
			options.ddmenuitem = $(this).children(options.children).show();

		}, function() {
			options.closetimer = window.setTimeout(function() {
				if (options.ddmenuitem) {
					options.ddmenuitem.hide();
				}
			}, options.timeout);
		});
	};
})(jQuery);
var codes;
function getImportFail(){
	//var code = $("#error-import").attr('data');

	//var stringify = JSON.stringify(code);
	//var regExp = new RegExp("[\"]", "g");
	//var replace = stringify.replace(regExp, "'");
	var inputs = '<input type="hidden" name="csvString" value="' + codes + '" />';
	// request发送请求
	jQuery('<form action="' + ctx +'/member/memberUser/importFail.html" method="post" id="import_fail">' + inputs+ '</form>').appendTo('body').submit().remove();
};
$(function() {
	$('.spa2 div').each(function(index,item){
		if($(item).html().trim()==''){
			$(item).parents('.spa2').siblings('.spa5').find('div').html('暂无操作');
			$(item).parents('.spa2').find('.s_div2').attr('title','');
		}
	});
	
	//公用下拉框
	$("body").on('click', '.age_select:has(ul)', function() {
		var _th = $(this),
			ul = _th.find('ul');
		$('.age_select').find('ul').hide();
		if (_th.hasClass('hover')) {
			$('.age_select').removeClass('hover');
			ul.hide();
			return false;
		} else {
			$('.age_select').removeClass('hover');
			_th.addClass('hover');
			ul.show();
			return false;
		}
	});
	$("body").on('click', '.age_select li', function() {
		var _th = $(this),
			tty = _th.text(),
			ul = _th.parent('ul');
		_th.removeClass('hover');
		_th.parents("ul").hide();
		_th.parents(".age_select").find("span").text(tty).end().find("input").val(tty);
		_th.parents(".age_select").find("span").text(tty).end().find("input").attr("dd", $(this).attr("data-id"));
	});
	$("body").click(function() {
		$('.age_select').removeClass('hover').find('ul').hide();
	});
	if ($('.data-wrap').length > 0) {
		$.datepicker.setDefaults({
			changeYear: true,
			changeMonth: true,
			showMonthAfterYear: true,
			monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			dateFormat: "yy-mm-dd"
		});
		/**
		 * 起止时间
		 * ZenCoding: .datepickerWrap>input:text[datepicker=from]+input:text[datepicker=to]
		 */
		$('.data-wrap').each(function() {
			var oFrom = $("[datepicker=from]", this);
			var oTo = $("[datepicker=to]", this);
			oFrom.datepicker({
				onClose: function(selectedDate) {
					oTo.datepicker("option", "minDate", selectedDate);
				}
			});
			oTo.datepicker({
				onClose: function(selectedDate) {
					oFrom.datepicker("option", "maxDate", selectedDate);
				}
			});
		});
	}

	/*用户*/
	//选择框
	$('.member-lim').on('click', '.J_check', function() {
//		$(".totalPersonNum > span").show();
//		$(".totalPersonNum > span").text("是否勾选全部")
//		$(".totalPersonNum > em").text("");
		var _th = $(this),
			c = _th.find('input');
		if (_th.hasClass('checked')) {
			_th.removeClass('checked');
			c[0].checked = false;
		} else {
			_th.addClass('checked');
			c[0].checked = true;
		}
		$('.J_sel_num').html($('.u-list .clab.checked').length);
		$(".totalPersonNum > i").html($('.u-list .clab.checked').length);
	});


	//全选
	var globalSelect = false;
	$('.J_check_all').on('click', function(e) {

		
		var _th = $(this),
			c = _th.find('input')[0],
			items = $('dl.u-list :checkbox[name=chitems]');
		items.each(function(i) {
			items[i].checked = c.checked
		});
		
		if (_th.hasClass('checked')) {
			$(".totalPersonNum").hide();
			_th.removeClass('checked');
			c.checked = false;
			items.parents('.clab').removeClass('checked');
			//发起营销的选择
			globalSelect = false;
			$(".d_bd .count").css("display", "");
			$(".d_bd .countall").css("display", "none");
			$(".d_bd .count").html(0);
		} else {
			$(".totalPersonNum").show();
			if ($(".totalPersonNum > span").text() == "是否勾选全部") {
				$(".totalPersonNum > span").click(function() {
					globalSelect = true;
					$(this).next("em").show();
					$(this).hide();
					$(".totalPersonNum > i").text($(".totalPersonNum > strong").text());
					$(this).next("em").text("取消勾选全部");
				});
			}
			if ($(".totalPersonNum > em").text() == "取消勾选全部") {
				$(".totalPersonNum > span").show();
				$(".totalPersonNum > em").hide();
				$(".totalPersonNum > em").click(function() {
					globalSelect = false;
					$(".totalPersonNum").hide();
					$(".totalPersonNum > span").text("是否勾选全部");
					$(".totalPersonNum em").hide();
					$(".totalPersonNum > span").show()
				});
			}
			_th.addClass('checked');
			c.checked = true;
			items.parents('.clab').addClass('checked');
		}
		$('.J_sel_num').html($('.u-list .clab.checked').length);
		$(".totalPersonNum > i").html($('.u-list .clab.checked').length)
	});

	/*会员列表*/
	$('.u-list .J_mb_img').Hover3();
	/*会员详细信息 */
//	var global_groupid;
	$('.u-list .J_mb_img img').hover(function() {
		var $this=$(this);
		var _th = $(this).parent(".J_mb_img"),
			pare = _th.parents('dd'),
			id = pare.attr('data-id'),
			w = _th.find('.warp-info'),
			con = w.find('.od_bd'),
			da = _th.find('.dialog'),
			html = '';
		$(this).css({
			border: "#3c9209 2px solid"
		});
		da.show();
		var id = $(this).attr("id");
		if (!_th.hasClass('J_only_ajax')) {
			$.ajax({
				url: '/scrm/fans/userdetail',
				type: 'post',
				dataType: "json",
				data: 'id=' + id,
				success: function(data) {
					var fans = data.result.fans;
					var tags = data.result.tags;
					var caccount = data.result.caccount;

					var groups = data.result.groups;

					html = '<table class="user-con"><tr><td class="tit">备注名:</td><td><input type="text" data-id="' + fans.id + '"  class="noBorder" value="' + fans.noteName + '" ></input></td></tr><tr><td class="tit">地&nbsp;&nbsp;&nbsp;&nbsp;域:</td><td>' + fans.country + ' ' + fans.province + ' ' + fans.city + '</td></tr><tr><td class="tit">标&nbsp;&nbsp;&nbsp;&nbsp;签:</td><td class="pr"><div class="tag-tip clearfix">';
					for (var i = 0; i < tags.length; i++) {
						html += '<a class="label label-success" style="padding:.3em .5em;color:white;word-break: break-all" href="#">' + tags[i].name + '</a>';
					}
					html+='<a class="label label-success J_da_tag" style="border:1px solid #858585;background:white;font-size:22px;padding:.12em .16em;color:#858585" href="###" >＋</a>';
					html+='<tr><td class="tit">来&nbsp;&nbsp;&nbsp;&nbsp;源:</td><td class="pr">'+caccount.configName+'</td></tr>';
					html += '</div></td></tr><tr><td class="tit">分&nbsp;&nbsp;&nbsp;&nbsp;组:</td><td class="pr">';

					html+="<select class='form-control c_group' style='width:97px;border-color:#858585;'><option value='未分组'>未分组</option>";
					for (var i = 0; i < groups.length; i++) {
						html+="<option data-id="+groups[i].id+" value="+groups[i].name;
						if(groups[i].id == fans.groupId) {
							html+= " selected"
						}
						html+= ">"+groups[i].name+"</option>";
					}
					html +="</select>";
					html += '</td></tr><tr><td class="tit">手机号:</td><td class="">' + fans.phone + '</td></tr><tr><td class="tit">QQ&nbsp;&nbsp;号:</td><td>' + fans.qq + '</td></tr><tr><td class="tit">微信号:</td><td>' + fans.weiId + '</td></tr><tr><td class="tit">邮&nbsp;&nbsp;&nbsp;&nbsp;箱:</td><td>' + fans.email + '</td></tr></table>';
					if (w.find('.user-con').length == 0) {
						con.html(html);
						_th.addClass('J_only_ajax');
					}
					var oInput = da.find('input[data-id]').eq(0);
					var oldvalue = oInput.val();

					oInput.bind('blur keypress',function(e){
						var code = e.keyCode || e.which;
						var type = e.type;
						var value = $(this).val();
						var id = $(this).attr("data-id");
						$(this).removeClass("editInput").addClass("noBorder");
						if (type==='blur'&& oldvalue != value) {
							doeditNotename(value, id);
							oldvalue = value;
						}else if (code=='13' && type==="keypress"&& oldvalue != value) {
							doeditNotename(value, id);
							oldvalue = value;
						}
						
					});
					setUserDetailHeight($this, da);
					
					//改变分组
					$('select.c_group').bind('change', function() {
						var groupname = $(this).val();
						var groupid = $(this).find('option[value='+groupname+']').attr('data-id');
						var fans = [];
						fans.push(id);
						$.ajax({
							//url: '/scrm/fans/addfansgroups',
							type: 'post',
							dataType: 'json',
							data: {
								groupid: groupid,
								fans: fans
							},
							error: function(data) {
								showPoint(data);
							},
							success: function(data) {
								if (data.success) {
									showSuccPoint(data.message);
								} else {
									showPoint(data.message);
								}
							}
						});
					});
				}
			});
		}
	}, function(e) {
//		$(this).find('.dialog').hide();
		$(this).css({
			border: "none"
		});
		$(this).children("img").css({
			border: "none",
			borderRadius: "0"
		});
	});
	
	


	function doeditNotename(value, id) {
		if (value.length > 50) {
			showPoint("备注名长度不能超过50字符");
			return;
		}
		$.ajax({
			url: '/scrm/fans/editNoteName.html',
			type: 'post',
			dataType: 'json',
			data: {
				id: id,
				notename: value
			},
			success: function(data) {
				if (data.success) {
					showSuccPoint(data.message);
				} else {
					showPoint(data.message);
				}
			}
		});
	}


	function setUserDetailHeight($img, $da) {
		var imges=$('.warp-info').prev('img');
		var position=$img.position();
		var imgWidth=$img.width();
		var width=$da.width();
		var height=$da.height();
		var windowHeight=$('body').height();
		var top=(position.top-$img.height()-10);
		
		imges.each(function(index,img){
			$(img).attr('imgIndex',index);
		});
		if($img.eq(0).attr('imgIndex')>9){
			top=top-280;
		}
		
		$da.css({
			top:top+'px',
			left:position.left+imgWidth+'px'
		});
		
	}


	$('.dialog .d_hd').on('click', '.close', function() {
		$('.warp-info').hide();
	});

	/*高级搜索*/
	$('.J_gj_search').on('click', function() {
		var s = $('.gj-search');
		s.hasClass('hid') ? s.removeClass('hid') : s.addClass('hid');
	});
	//点击选中
	$('.gj-search .tag-cur a').click(function() {
		var _th = $(this);
		//_th.hasClass('cur')?_th.removeClass('cur'):_th.addClass('cur');
		_th.hasClass('cur') ? (_th.removeClass('cur'), _th.find('input').remove(),_th.next('input').remove()) : (_th.addClass('cur'), _th.append('<input type="hidden" name="tags" value="' + _th.attr("data-id") + '" />'));

		//var p = $("#dynamic_tag");
		//var html = p.html();
		//p.html(html+'<input type="hidden" name="tags" value="'+_th.attr("data-id")+'" />');

	});
	//搜索确认表单按钮
//	$('#search_form .J_sub').click(function() {
//		var form = $('#search_form'),
//			val = $.trim(form.find('.keyword').val());
//		       if(val == ''){
//		            showPoint('请输入关键词！');
//		            return false;
//		       }else{
//		    	   form.submit();
//		       }
//	});

	$('.sortType').click(function() {
		var form = $('#search_form');
		var sortvalue = $(this).attr("sortValue");
		$("#sorttype").val(sortvalue);
		form.submit();
	});

	//高级搜索确认表单按钮
	$('#gj_search_form .J_sub').click(function() {
		var gj_form = $('#gj_search_form'),
		val = $.trim(gj_form.find('.keyword').val());
		gj_form.submit();
	});

	function formsubmit() {
		var gj_form = $('#gj_search_form'),
			val = $.trim(gj_form.find('.keyword').val());
		if (val == '') {
			showPoint('请输入关键词！');
			/* $('#fixedPoint .txt').html('请输入关键词！');
            $('#fixedPoint').fadeIn(300,function(){
                setTimeout(function(){$('#fixedPoint').fadeOut(300)},2000);
            });*/
			return false;
		} else {
			gj_form.submit();
		}
	}

	//高级搜索取消表单按钮
	$('#gj_search_form .J_qx').click(function() {
		var form = $('#gj_search_form');
		form.find('.keyword').val('');
		form.find('.datatime').val('');
		form.find('.tag-cur a').removeClass('cur');
		form.find('.tag-cur').find("input").remove();
		form.find(':radio').removeAttr('checked');
		form.find('.wkeyAccount option').remove();
		setup();
		$('.J_gj_search').click();
		form.submit();
	});



	//发起营销
	$('.J_fqyx').on('click', function() {
		
		var check_limt = $(".member-lim .J_check").find("input:checked").length;
		var u_list = $('.u-list'),
		checklen = u_list.find('.clab.checked'),
		acc=parseInt($("#die-model").attr("data-authWXAccountNum"));
		console.log(acc);
		if (!$(".J_check ").hasClass("checked") && check_limt == 0) {
			showPoint("请选择会员！");
			return;
		}else if(acc<=0){
			showPoint("未绑定认证微信公众账号，不能发起营销");
			return;
		}else if($(".totalPersonNum").css("display")=="none"&&check_limt <2) {
			showPoint("请至少选择两名会员！");
			return;
		}else if($(".totalPersonNum").css("display")=="block"&&parseInt($(".totalPersonNum").find("i").text())<2){
			showPoint("请至少选择两名会员！");
			return;
		}else {
			var uid_arr = [];
			var a=0;var b;
			$(checklen).each(function() {
				var op=$(this).children("input:first").attr("data-openId");
				if(op!="uid_arr"){
					uid_arr.push($(this).children("input:first").attr("data-openId"));
					a++;
				}else{
					b++;
				}			    			    
			});
			
			if(!globalSelect&&a<=1){
				showPoint("你选择的会员无法发起营销");
				return;
			}
		} 		
		$("input.selectedTitle").val("请选择");
		$(".z_5 > span").text("请选择");

		$('#add_auto_key').dialog();
		$(".fqwbItemName > li").remove();
		$(".sel-tip > a").eq(0).addClass('cur').siblings().removeClass('cur');

		getMaterial("0");

		if (!globalSelect) {
			$(".d_bd .count").css("display", "");
			$(".d_bd .countall").css("display", "none");
			$(".d_bd .count").html($('.u-list .clab.checked').length);
		} else {
			$(".d_bd .count").css("display", "none");
			$(".d_bd .countall").css("display", "");
		}


		//当前项
		$('.sel-tip > a').off('click');
		$('.sel-tip > a').on('click', function() {
			$("input.selectedTitle").val("请选择");
			$(".z_5 > span").text("请选择");
			$(this).addClass('cur').siblings().removeClass('cur');
			var this_ = $(this);
			//清空li
			$(".fqwbItemName > li").remove();
			getMaterial(this_.attr('data-id'));

		});

		function getMaterial(type) {
			$.ajax({
				url: ctx+'/material/material/findMaterialList.html',
				type: 'post',
				dataType: "json",
				data: {
					type: type
				},
				success: function(data) {
					if (data.success) {
						var materials = data.materials;
						for (var i = 0; i < materials.length; i++) {
							$(".fqwbItemName").append("<li data-id='" + materials[i].id + "'>" + materials[i].name + "</li>");
						}
					} else {
						$('.e-tip').html(data.message);
					}
				}
			});
		}
	});

	$("#add_auto_key div.d_btn > .d_btn_cancel").on("click", function() {
		//$("input.selectedTitle").val("");
		$("input.selectedTitle").val("请选择");
		$(".z_5 > span").text("请选择");

	})


	//
	$("#add_auto_key div.d_btn > .d_btn_ok").on("click", function() {
		var u_list = $('.u-list'),
			checklen = u_list.find('.clab.checked'),
			uid_arr = [];
		if (checklen.length == 0) {
			showPoint("请选择要添加的会员");
			return;
		}else {
			var uid_arr = [];
			var a=0;var b;
			$(checklen).each(function() {
				var op=$(this).children("input:first").attr("data-openId");
				if(op!="uid_arr"){
					uid_arr.push($(this).children("input:first").attr("data-openId"));
					a++;
				}else{
					b++;
				}			    			    
			});
			
			if(!globalSelect&&a<=0){
				showPoint("你选择的会员无法发起营销");
				return;
			}
		} 		
		var materialId = $(".z_5 > input").attr("dd");
		if (!materialId || materialId == '') {
			showPoint("请选择需要发送的素材");
			return;
		}
		//$("#materialId").attr("value",materialId);
		var fromdata;
		if (!globalSelect) {
			fromdata = $("#all_form").serialize();
		} else {
			fromdata = $("#all_no_form").serialize();
		}
		$(".loadIco").show();
		$("button.d_btn_ok").attr("disabled", "true");
		$("button.d_btn_cancel").attr("disabled", "true");
		var uid_str=uid_arr.join(",");
		$.ajax({
			url: ctx+'/member/marketing/launch.html',
			type: 'post',
			dataType: "json",
			data: {
				//queryModel:fromdata,
				materialId: materialId,
				openIds: uid_str,
				all: globalSelect
			},
			//data: fromdata+"&materialId="+materialId+"&" +$.param(uid_arr)+"&globalSelect="+globalSelect,

			success: function(data) {
				if (data.success) {
					//判断是否发送成功
					var o=data;
					var suc="";
					var fail="";
					for(var key in data.marketingResult){
						if(!data.marketingResult[key]&&data.marketingResult[key]!=""){
							var _fail="账号:"+key+"发送失败<br/>";
							fail+=_fail;
						}else{
							var _suc="账号:"+key+"发送成功<br/>";
							suc+=_suc;
						}
					}
					$("#fqyx_suc_count").html(suc);
					$("#fqyx_fail_count").html(fail);
					$("button.d_btn_ok").removeAttr("disabled");
					$("button.d_btn_cancel").removeAttr("disabled");

					$(".loadIco").hide();
					$('#add_auto_key').hide();
					$('#fqyx_suc').dialog();

				}else {
					$("button.d_btn_ok").removeAttr("disabled");
					$("button.d_btn_cancel").removeAttr("disabled");
					$(".loadIco").hide();
					$('#add_auto_key').hide();
					$('#fqyx_fail').dialog();
					$('.e-tip').html(data.message);
				}
				$(".z_5 > input").attr("dd", "");
			}
		});
	});

	//
	$('#fqyx_suc div.d_btn > .d_btn_ok').on('click', function() {
		$('#fqyx_suc').hide();
		$('#dialogBackground').fadeOut();
	});
	$('#fqyx_fail div.d_btn > .d_btn_ok').on('click', function() {
		$('#fqyx_fail').hide();
		$('#dialogBackground').fadeOut();
	});
	//导入会员
	function getUploadName(obj) {
	    var pos = obj.val().lastIndexOf('\\');
	    return obj.val().substring(pos + 1);
	}
	function objAfterErr(obj, msg) {
	    if (obj.siblings('.error').length) {
		obj.siblings('.error').text(msg);
	    } else {
		obj.after('<p class="error">' + msg + '</p>')
	    }
	}
	function clearAfterErr(obj) {
	    if (obj.siblings('.error').length) {
		obj.siblings('.error').remove();
	    }
	}
	$('#importFile').on('change', function () {
	    var filename = getUploadName($(this));
	    $('.filename').text(filename);
	
	    var regx = /(.xls)$/;
	    if (!regx.test(filename)) {
		objAfterErr($(this).parents('.chgfile'), '请上传xls文件。')
		return false;
	    } else {
		clearAfterErr($(this).parents('.chgfile'));
	    }
	    //alert(getUploadSize($(this)))
	    if ($(this)[0].files[0]) {
		var fileSize = $(this)[0].files[0].size;
		var chksize = 3 * 1024 * 1024;
		if (fileSize > chksize) {
		    objAfterErr($(this).parents('.chgfile'), '请上传小于3M的文件')
		} else {
		    clearAfterErr($(this).parents('.chgfile'));
		}
	    }
	});
	var importmember;
	$('#inport_member').on('click', function () {
	    $('.chgfile').find('.filename').text('');
	    $('.chgfile').find('input').val('');
	    importmember = dialog({
		title: '导入会员',
		content: $('.imortbox'),
		width: '400px',
		onclose: function () {
		    $('.imortbox').find('.error').remove();
		}
	    });
	    importmember.showModal();
	});  
	$('#export_member').on('click', function () {
		var isSelectAll = false;
		var cancelSelectAll = $('#cancelSelectAll').css('display');
		var chk_value =[];

		if(cancelSelectAll == 'inline'){
			isSelectAll = true;
		}

		$('input[name="chitems"]:checked').each(function(){
			chk_value.push($(this).data('id'));
		});

		if(!isSelectAll && chk_value.length == 0){
			alert('请选择会员');
			return;
		}

		var inputs = '<input type="hidden" name="ids" value="' + chk_value.join(',') + '" />';
		inputs = inputs + '<input type="hidden" name="isSelectAll" value="' + isSelectAll + '" />';
		// request发送请求
		jQuery('<form action="' + ctx +'/member/expert/csv.html' + window.location.search + '" method="post" target="_blank">' + inputs+ '</form>').appendTo('body').submit().remove();
	   /* zjs.cmd({
		cmd: "/",
		callback: function (data) { 
		    $("#export_member_href").text("点击下载").attr("href", data.path);
		    window.open(data.path);
		}
	    });*/
	}); 
	$('#import_true').on('click', function () {
	    if (!$('#importFile').val()) {
        objAfterErr($('.chgfile'), '请上传csv文件.')
	    }
	    if ($('.imortbox').find('.error').length) {
        return false;
	    } else {
	    	$(this).addClass('disabled');
	    	$("#form_importFile").submit();
	    }
	}); 
	$("#iframe_importFile").load(function () {
		$("#import_true").removeClass('disabled');
	    var ress = $("#iframe_importFile").contents().find("body").text();
	    if (ress) {
		ress =eval("("+ress+")");
		if (ress.ResponseID == 8010) {
		    errNote = dialog({
			title: '信息提醒',
			content: ress.Message,
			width: '360px',
			okValue: '确定'
		    }).showModal();
		    setTimeout(function () {
			errNote.close().remove()
		    }, 1500)
		} else if (ress.total != undefined) {
		    /*var msg = [];
		    msg.push("成功 " + ress.total + " 条");
		    msg.push("失败 " + ress.failureTotal + " 条");
		    msg.push("失败记录:  ");
		    for (var ie in ress.invalidNumber) {
			msg.push(ie);
		    }*/
		    importmember.close();
		    $('#suc-num').text(ress.total);
		    if (ress.failureTotal == 0) {
			$('#def-note').hide();
			$('#failure').hide();
			
		    } else {
			$('#def-note').show();
			$('#failure').show();
			$('#def-num').text(ress.failureTotal);
				var object = eval(ress.invalidNumber);
				var stringify = JSON.stringify(object);
				codes = encodeURI(stringify);
			var strs='<a href="javascript:getImportFail();" id="error-import" data="'+1+'">查看错误信息</a>';
			//for (var i = 0; i < ress.invalidNumber.length; i++) {
			//    strs += '<li>' + ress.invalidNumber[i] + '</li>';
			//}
			$('#failure ul').html(strs);
		    }
		    importnote = dialog({
			title: '信息提醒',
			content: $('#import-note'),
			width: '360px',
			okValue: '确定',
			ok: function () {
			  window.location.href='/member/memberGroup/groupSearch.html';
			}
		    }).showModal();
		   
		}
	    }
	});


	$('#import_false').on('click', function () {
	    $('.chgfile .filename').text('');
	    importmember.close();
	})
	//重置密码
    $('.resetPassword').on('click', function () {
        var itemId = $(this).data("id");
        
        dialog({
            id: 'confirm',
            title: '提醒',
            content: '确定重置密码？',
            zIndex: 89,
            width: '480px',
            okValue:'确定',
            ok: function () {
                $.ajax({
                    url: ctx+'/member/memberUser/resetPassWord.html',
                    type: 'POST',
                    data: 'id=' + itemId,
                    dataType: 'JSON',
                    success: function (msg) {
                        dialog({
                            id: 'iframe',
                            title: '提醒',
                            zIndex: 89,
                            content: msg.message,
                            width: '400px',
                            ok: true,
                            okValue: '确定',
                        }).showModal();
                    }
                });
            },
            cancel: true,
            cancelValue:'取消'
        }).showModal();
        
    });
	
	/* 会员分组 删除 会员分组*/
	$('.mb-group').on('click', '.close', function() {
		var _th = $(this),
			pare = _th.parents('li'),
			id = pare.attr('data-id'),
			da = $('#dialog'),
			groupid = _th.parents('li').attr('groupid'),
			conHtml = da.find('.cont_txt'),
			daBtn = da.find('.d_btn_ok');
		conHtml.html('确定要删除此标签？');
		da.dialog();
		da.unbind('click');
		da.on('click', '#' + daBtn.attr('id'), function() {
			console.log("1111111");
			$.ajax({
				url: '/member/memberGroup/delete.html',
				type: 'post',
				data: {id:groupid},
				dataType:'JSON',
				success: function(data) {
					if (data.success) {
						window.location.reload();
					}
				}
			});
		});
	});
	//添加
	$('.fs_add_group').on('click', function() {
		var da = $('#dialog_tag_ed'),
			_th = $(this),
			daBtn = da.find('.d_btn_ok'),
			tit = da.find('.title'),
			inp = da.find('input');
		inp.val("");
		$('.e-tip').html("");
		tit.html('<strong>添加标签</strong>');
		daBtn.attr('id', 'group_add').html('添加');
		da.find('.name').empty();
		da.find('.tag').text('标签名称：');
		da.dialog();
		da.off('click');
		da.on('click', '#' + daBtn.attr('id'), function() {
			var value = $.trim(inp.val());
			if (value.length > 10) {
				$('.e-tip').html("标签名称不要超过10字");
				return;
			} else if (value.length == 0) {
				$('.e-tip').html("标签名称不能为空");
				return;
			} else if (!(value.match(/^[a-zA-Z0-9\u4e00-\u9fa5]*$/))) {
				$('.e-tip').html("标签名称为中文、英文或者数字");
				return;
			}
			$.ajax({
				url: '/member/memberGroup/add.html',
				type: 'post',
				data: {
					name: inp.val()
				},
				dataType:'JSON',
				success: function(data) {
					if (data.success) {
						window.location.reload();
					} else {
						$('.e-tip').html(data.message);
					}
				}
			});
		});
	});
	//修改
	$('.mb-group').on('click', '.title2', function() {
		var da = $('#dialog_tag_ed'),
			_th = $(this),
			id = _th.parents('li').attr('groupid'),
			daBtn = da.find('.d_btn_ok'),
			tit = da.find('.title'),
			inp = da.find('input'),
				$old_name=da.find('.name');
		if (id == 0) return;
		tit.html('<strong>修改标签</strong>');
		$('.e-tip').html("");
		daBtn.attr('id', 'group_mod').html('修改');
		inp = da.find('input').val(_th.find('.ellipsis').attr("allhtml"));
		$old_name.text('标签名：'+_th.data('tagName'));
		da.find('.tag').text('修改为：')
		da.dialog();
		da.off('click');
		da.on('click', '#' + daBtn.attr('id'), function() {
			var value = $.trim(inp.val());
			if (value.length > 10) {
				$('.e-tip').html("标签名称不要超过10字");
				return;
			} else if (value.length == 0) {
				$('.e-tip').html("标签名称不能为空");
				return;
			} else if (!(value.match(/^[a-zA-Z0-9\u4e00-\u9fa5]*$/))) {
				$('.e-tip').html("标签名称为中文、英文或者数字");
				return;
			}
			$.ajax({
				url: '/member/memberGroup/modifyGroupName.html',
				type: 'post',
				data: {
					id: id,
					name: inp.val()
				},
				dataType:'JSON',
				success: function(data) {
					if (data.success) {
						window.location.reload();
					} else {
						$('.e-tip').html(data.message);
					}
				}
			});
		});
	});
	/* 会员分组 end*/
/*	//会员分组筛选
		$("#select1").on("click","dd",function () {
			$(this).addClass("selecteds").siblings().removeClass("selecteds");
			if ($(this).hasClass("selects-all")) {
				$("#selectA").remove();
			} else {
				var copyThisA = $(this).clone();
				if ($("#selectA").length > 0) {
					$("#selectA").html($(this).html());
				} else {
					$(".selects-result dl").append(copyThisA.attr("id", "selectA"));
				}
			}
		});
		
		$("#select2").on("click","dd",function () {
			$(this).addClass("selecteds").siblings().removeClass("selecteds");
			if ($(this).hasClass("selects-all")) {
				$("#selectB").remove();
			} else {
				var copyThisB = $(this).clone();
				if ($("#selectB").length > 0) {
					//为#selectB更换a标签
					$("#selectB").html($(this).html());
				} else {
					$(".selects-result dl").append(copyThisB.attr("id", "selectB"));
				}
			}
		});
			
		$(".selects-result").on("click", "#selectA",function () {
			var _a=$("#selectA").length;
			var _b=$("#selectB").length;
			$(this).remove();
			if(_a<=1&&_b<=0){$(".selects-no").show();}
			$("#select1 .selects-all").hide().siblings().removeClass("selecteds");
			search();
		});
		
		$(".selects-result").on("click", '#selectB' ,function () {
		var _a=$("#selectA").length;
			var _b=$("#selectB").length;
			$("#selectB").remove();
			if(_a<=0&&_b<=1){$(".selects-no").show();}
			$("#select2 .selects-all").hide().siblings().removeClass("selecteds");
			search();
		});
		$(".selects").on("click","dd",function () {
			if ($(".selects-result dd").length > 1) {
				$(".selects-no").hide();
			} else {
				$(".selects-no").show();
			}
		});
		*/
		
//		//积分对话框
//		//打开积分窗口
//    	$(".j-sec").click(function(){
//    		var jf=parent.document.getElementById("j-i");
//    		var df=parent.document.getElementById("die-model");
//    		var vf=parent.document.getElementsByClassName("v-page");
//    		console.log(vf);
//    		jf.style.display="none";
//    		df.style.display="block";
//    		for(var i=0; i<vf.length; i++) {
//    			vf[i].style.display="block";
//    		}
//        })
//        //添加
//        $('.iadd').on('click', function () {
//            var da = $('#jf-dialog'),
//                    _th = $(this),
//                    daBtn = da.find('.d_btn_ok');
//            da.dialog();
//        });
//        //积分输入框改变
//        $('.J-integral,.info').click(function () {
//            $("#Score").prev(".info").html("");
//        })
//        $('.J-integral').blur(function () {
//            var j = $(this).val();
//            var exg = /^\d{0,8}$/g;
//            console.log(j);
//            if (j == "") {
//                $("#Score").prev(".info").html("*必填项");
//            } else if (j == 0) {
//                $("#Score").prev(".info").html("*不能为0");
//            } else if (!exg.test(j)) {
//                $("#Score").prev(".info").html("*必须为八位数之内的整数");
//            } else {
//                $("#Score").prev(".info").html("");
//            }
//
//        });
//        //备注框
//        $('#Remark,.info').click(function () {
//            $("#Remark").prev(".info").html("");
//        })
//        $('#Remark').blur(function () {
//            verT();
//        });
//        //点击增加减少积分选择框
//        $(".cselectorInput").click(function () {
//            $(".cselectorUL").show();
//        });
//        $(".cselectorUL a").click(function () {
//            $(".cselectorUL").hide();
//            $("#ChangeType").val($(this).attr("value"));
//            $(".cselectorInput").html($(this).text());
//        });
//        $('#open_dyh').click(function () {
//            var changeType = $('#ChangeType').val();
//            var score = $('#Score').val();
//            var remark = $('#Remark').val();
//            if (verJ() && verT()) {
//                $.ajax({
//                    url: '/score/history/add.html',
//                    type: 'post',
//                    dataType: "json",
//                    data: {
//                        memberId: $('#num').html(),
//                        changeType: changeType,
//                        scoreChange: score,
//                        remark: remark
//                    },
//                    success: function (data) {
//                        if (data.success) {
//                            window.location.reload();
//                        } else {
//                            alert(data.message);
//                        }
//                    }
//                });
//            }
//        })

});

/*//积分验证
function verJ() {
    var j = $(".J-integral").val();
    var jp= parseInt($(".integ-p").text());
    console.log($(".cselectorInput").text()+"j:"+j+"jp"+jp);
    var exg = /^\d{0,8}$/g;
    if (j == "") {
        $("#Score").prev(".info").html("*必填项");
        return false;
    } else if (j == 0) {
        $("#Score").prev(".info").html("*不能为0");
        return false;
    } else if (!exg.test(j)) {
        $("#Score").prev(".info").html("*必须为八位数之内的整数");
        return false;
    } else if($(".cselectorInput").text()=="扣减"&&j>jp){
    	$("#Score").prev(".info").html("*不能大于当前积分");
    	return false;
    } else{
        $("#Score").prev(".info").html("");
        return true
    }
}
function verT() {
    var k = $("#Remark").val().length;
    if (k > 500) {
        $("#Remark").prev(".info").html("*字数必须小于500字");
        return false;
    } else {
        $("#Remark").prev(".info").html("");
        return true;
    }
}*/