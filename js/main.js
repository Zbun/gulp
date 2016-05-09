require([ctxStatic+'/modules/member/js/config.js?ewin_ver='+ewin_ver], function () {
    require(['avalon','laypage','scriptS','domReady!'], function (avalon,laypage,scriptS){

        var vm = avalon.define({
            $id: 'test',
            //菜单名称
            dataNav:['会员概况','商城订单','预约订单','积分明细','充值明细','互动明细','卡券明细'],//,'微信消息'
            dataNav1:[{
            	"ename":"score",
            	"name":'积分明细'
            }],
            //卡券订单选项
            orderC:[{
            	"val":"",
            	"text":"全部"
            },{
            	"val":"CODE_CAN_USE",
            	"text":"未使用"
            },{
            	"val":"CODE_USED",
            	"text":"已使用"
            },{
            	"val":"CARD_PASS_TIME",
            	"text":"已过期"
            }],
			//预约相关
			appointment:{
				filter:'orderstatus',
				orderStatus:'',
				orderNo:'',
				serviceNameSearch:'',
				pageSize:10,
				startCreateDate:'',
				endCreateDate:'',
			},
			API:{
				appointment:'/shop/order/getBookingOrderList.html?memberId='+$('#uId').val(),
			},
            //订单选项
            orderO:[{
            	"val":"",
            	"text":"全部"
            },{
            	"val":"WaitPay",
            	"text":"待付款"
            },{
            	"val":"ReadyPay",
            	"text":"已付款"
            },{
            	"val":"WaitGoods",
            	"text":"待发货"
            },{
            	"val":"ReadyGoods",
            	"text":"已发货"
            },{
            	"val":"Cancel",
            	"text":"交易取消"
            },{
            	"val":"WaitAffirmAndExpress",
            	"text":"等待商家确认"
            },{
				"val":"ReadyAffirmAndExpress",
				"text":"商家已确认"
			},{
				"val":"Complete",
				"text":"交易完成"
			}],
            //error
            errorMsg:"",
            //是否有数据
            dataLength:0,
            //订单表单tit
            tabTit:[],
            object:[],
            obj:"",
            lists:[],
            curIndex:0,
            show:0,
            mTit:"",
            mText:"",
            miNum:0,
            mUnit:"",
            //加减，0为+，1为-
            mathNum:0,
            errorP:"",
            errorB:"",
            bMoney:0,
            //删除微信消息按钮
            delNum:-1,
            //判断标签是否存在
            isCon:function(arr, val){ 
        		for(var i=0; i<arr.length; i++){ 
        			if(arr[i] == val) 
        				return true; 
        			} 
        			return false;
        	},
			detail:function(){

			},
            //新增标签
            addTabs:function(){
            	var  aVal=$(".mbinp").val();
        		var arrTab=[];
        		var regu = "^[ ]+$";
        		var re = new RegExp(regu);
        		$(".tabspan").each(function(){
        			arrTab.push($(this).text());
        		})       		
        		if(aVal==""){
        			showPoint("标签名不能为空");
        			return;
        		}else if(re.test(aVal)){
        			showPoint("标签名不能为空字符");
        			return;
        		}else if(aVal.length>10){
        			showPoint("标签字数不能大于10");
        			return;
        		}else if(vm.isCon(arrTab,$(".mbinp").val())){
        			showPoint("标签已存在");
        			return;
        		}
            	$.ajax({
            		url:'/member/memberGroup/add.html',
            		type:'post',
            		data:{
            			name:aVal
            		},
            		dataType:'json',
            		success:function(res){
            			$(".mbinp").val("");
            			$(".group-span").append('<span class="tabspan"  data-groupid='+res.data.id+' title='+res.data.name+'>'+res.data.name+'</span>');
            			$(".ui-dialog-content").find(".tabspan").unbind("click");
            			$(".ui-dialog-content").find(".tabspan").on("click",function(){
		                    if($(this).hasClass("currt")){
		                        $(this).removeClass("currt")
		                    }else {
		                        $(this).addClass("currt")
		                    }
		                })
            		}
            	});
            },
            //增加修改标签
            addGroup:function(mid){
            	$(".mbinp").val('');
            	var da = $('.groupEdit'),
                _th = $(this),
                daBtn = da.find('.d_btn_ok');
		        var _grn = da.find(".group-span");
		        if(_grn.html()!=null){
		            _grn.children().remove();
		        }
		        //查询本会员所在分组
		        $.ajax({
		            url:'/member/memberGroup/getAllGroups.html',
		            type:'post',
		            data:{memberId:mid},
		            dataType:'json',
		            success:function(data){
		                var groups = eval(data);
		                $(groups).each(function(i){
		                    var _grn = da.find(".group-span");
		                    if(groups[i].capacity==1){
		                        _grn.append('<span class="currt tabspan"  data-groupid='+groups[i].id+'>'+groups[i].name+'</span>');
		                    }else{
		                        _grn.append('<span class="tabspan"  data-groupid='+groups[i].id+'>'+groups[i].name+'</span>');
		                    }
		                });
		                //选择分组
		                $(".ui-dialog-content").find(".tabspan").unbind("click");
		                $(".ui-dialog-content").find(".tabspan").click(function(){
		                    if($(this).hasClass("currt")){
		                        $(this).removeClass("currt")
		                    }else {
		                        $(this).addClass("currt")
		                    }
		                })
		            }
		        });
		        var arr=new Array();
		        $(".mBox").show();
		        vm.sizeI();
		        da.show();
            },
            //选择分组
            selectTabs:function(){
            },
            //确认分组
            okGroup:function(mid){
            	var arr=new Array();
            	var da = $('.groupEdit'),
            	daBtn = da.find('.d_btn_ok');
                var t = $(".ui-dialog-content").find("span");
                t.each(function(i){
                    if($(this).hasClass("currt")){
                        var groupid = $(this).attr("data-groupid");
                        arr.push(groupid);
                    }
                });
                var groups = arr.toString();
                $.ajax({
                    url:'/member/memberGroupRel/modifyMemberGroupRel.html',
                    type:'post',
                    dataType:'json',
                    data:{"memberId":mid,"groups":groups},
                    success:function(data){
                        var dad = eval(data);
                        if(dad.success==true){
                        	var uId=document.getElementById("uId").value;
                    		var hr=$(".d-esc").attr("data-listsrc");
                    		window.location.href="/member/memberGroup/overview.html?flag=member&userId="+uId+"&list="+hr;                      	
                        	/*vm.curIndex=0;*/
                        	da.hide();
                        	$(".mBox").hide();
                        }else{
                            da.hide();
                            $(".mBox").hide();
                        }
                    }
                });
            },

			//获取预约数据
			getAppointment:function(query,curr){
				var query= query||{};
				var url=vm.API.appointment;
				var currentpage=curr||1;
				avalon.mix(query,{
					orderStatus:vm.appointment.orderStatus,
					serviceNameSearch:vm.appointment.filter=='orderServiceName'?vm.appointment.serviceNameSearch:'',
					orderNo:vm.appointment.filter=='orderNo'?vm.appointment.orderNo:'',
					startCreateDate:vm.appointment.filter==='sendtime'?vm.appointment.startCreateDate:'',
					endCreateDate:vm.appointment.filter==='sendtime'?vm.appointment.endCreateDate:''
				});

				$.getJSON(url,query,function (data) {
					var data=JSON.parse(data.data);
					if (data.dataList.length > 0) {
						vm.object = data.dataList;
						vm.show = 0;

					}
					else{
						vm.object='';
						vm.show=1;
					}
					laypage({
						cont: $('#pDemo'+2),
						pages: data.totalPages,//data.pages,
						curr: currentpage || 1, //当前页
						skip: true, //是否开启跳页
						skin: '#AF0000',
						groups: 5, //连续显示分页数
						jump: function(obj,first){
							if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
								vm.getAppointment({pageNo:obj.curr},obj.curr);
							}
						}
					});
				});
			},

			//预约详情
			checkAppointment:function(){
				var $this=$(this);
				dialog({
					width:300,
					minHeight:300,
					title:'详情',
					content:$('<table/>').html($this.find('table').html())
				}).showModal();
			},
            //图片放大
            imgBig:function(_url){           	            	
            	$(".bImg").attr("src",_url);
            	vm.sizeIbig();
            	$(".bigImg").show();
            	$(".mBox").show();
            },
            //单选
            radioCh:function(i){
            	if($(this).hasClass("yesCh")){
            		$(this).removeClass("yesCh");
            		$(this).children(".faCheck").hide();
            	}else{
            		$(this).addClass("yesCh");
            		$(this).children(".faCheck").show();
            	}
            },
			//全选
			checkAll:function(){
				if($(this).hasClass("cAll")){
					$(this).text("全选");
					$(this).removeClass("cAll");
					$(".noCh").removeClass("yesCh");
					$(".faCheck").hide();
					$(".check").removeClass("chs");
				}else{
					$(this).text("全不选");
					$(this).addClass("cAll");
					$(".noCh").addClass("yesCh");
					$(".faCheck").show();
					$(".check").addClass("chs");
				}
			},
			//删除操作标志
			mflag:"",
            //展示隐藏值
            showMsgnum:-1,
            showMn:-1,
            //oldDate
            oldDate:0,
            //长轮询
            checkNewMsg:function(mId,wkeyA,meId){
            	var checkUsedUrl = "/message/weixin/getNewMessage.html?wkeyAccount="+wkeyA+"&&openId="+mId+"&&messageId="+meId;
            	var requestCount = 0;
                var timeInterval = window.setInterval(function(){
                    $.post(checkUsedUrl, function(data){
                    	requestCount++;
                        if (data.status) {
							//状态为true后可以执行verifyLogin
							$(".newMsg").show();
                            window.clearInterval(timeInterval);
						}else{
                        	
                        }
                        if(requestCount>=20){
                            window.clearInterval(timeInterval);
                        }
                    },'JSON');
                }, 180000);//
            },
            //批量删除,清空消息,删除消息自定义变量
            delmId:"",
            delwkeyA:"",
            delmsgId:"",
            delmType:"",
            //批量删除,清空消息,删除消息弹窗            
            bDelMsgbox:function(mId,wkeyA){
            	if($(".yesCh").length<=0){
            		vm.sizeI();
    		        vm.errorMsg="请选择要删除的信息";
    		        $(".errorBox").show();
    		        $(".mBox").show();
    		        var t=setTimeout(vm.btnNo,1000);
            	}else{
            		vm.delmId=mId;
                	vm.delwkeyA=wkeyA;
                	vm.delNum=0;
                	vm.sizeI();
    		        vm.errorMsg="确定批量删除选中的消息？";
    		        $(".confirmBox").show();
    		        $(".mBox").show();
            	}            	
            },
            aDelMsgbox:function(mId,wkeyA){
            	vm.delmId=mId;
            	vm.delwkeyA=wkeyA;
            	vm.delNum=1;
            	vm.sizeI();
            	vm.errorMsg="确定清空这些消息？";
		        $(".confirmBox").show();
		        $(".mBox").show();
            },
            delMsgbox:function(mId,wkeyA,msgId,mType){
            	vm.delmId=mId;
            	vm.delwkeyA=wkeyA;
            	vm.delmsgId=msgId;
                vm.delmType=mType;
                vm.delNum=2;
            	vm.sizeI();
            	vm.errorMsg="确定删除这条消息？";
		        $(".confirmBox").show();
		        $(".mBox").show();
            },
            //批量删除消息
            batchDelMsg:function(mId,wkeyA){
            	vm.mfalg="batch";
				var rMeArr=new Array;
				var sMeArr=new Array;
				$(".yesCh").each(function(){
					var d=$(this).attr("datavalue");
					var s=$(this).attr("datatype");
					if(s==null){
						sMeArr.push(d);
					}else{
						rMeArr.push(d);
					}
				});
				$.ajax({
					url:'/message/weixin/delete.html',
					type:'post',
					dataType:'json',
					data:{
						wkeyAccount:wkeyA,
						openId:mId,
						flag:vm.mfalg,
						rMessageIds:rMeArr.toString(),
						sMessagerIds:sMeArr.toString()
					},
					success:function(data){
						if(data.status){
							$(".confirmBox").hide();
		        		    $(".mBox").hide();
							var _url='/message/weixin/list.html';
	        		        var curr;
	        		        vm.ajaxFun(curr,_url,6);
							vm.sizeI();
	        		        vm.errorMsg="删除成功";
	        		        $(".errorBox").show();
	        		        $(".mBox").show();
	        		        var t=setTimeout(vm.btnNo,500);
						}						
					}
				})
            },
            //清空消息
            allDelMsg:function(mId,wkeyA){
            	vm.mfalg="all";
            	$.ajax({
					url:'/message/weixin/delete.html',
					type:'post',
					dataType:'json',
					data:{
						wkeyAccount:wkeyA,
						openId:mId,
						flag:vm.mfalg,
					},
					success:function(data){
						if(data.status){
							$(".confirmBox").hide();
		        		    $(".mBox").hide();
							var _url='/message/weixin/list.html';
	        		        var curr;
	        		        vm.ajaxFun(curr,_url,6);
							vm.sizeI();
	        		        vm.errorMsg="清除成功";
	        		        $(".errorBox").show();
	        		        $(".mBox").show();
	        		        var t=setTimeout(vm.btnNo,500);
						}    
					}
				})
            },
			//删除消息
			delMsg:function(mId,wkeyA,msgId,mType){
				vm.mfalg="single";//single：删除单条消息；batch：批量删除消息；all：清空消息
				var fNum;//收发消息标志（0：回复消息，对应send表；！=0：接收消息，对应receive表）
				if(mType==null){
					fNum=0;
				}else{
					fNum=1;
				}
				$.ajax({
					url:'/message/weixin/delete.html',
					type:'post',
					dataType:'json',
					data:{
						wkeyAccount:wkeyA,
						openId:mId,
						flag:vm.mfalg,
						messageId:msgId,
						messageFlag:fNum
					},
					success:function(data){
						if(data.status){
							$(".confirmBox").hide();
		        		    $(".mBox").hide();
							var _url='/message/weixin/list.html';
	        		        var curr;
	        		        vm.ajaxFun(curr,_url,6);
							vm.sizeI();
	        		        vm.errorMsg="删除成功";
	        		        $(".errorBox").show();
	        		        $(".mBox").show();
	        		        var t=setTimeout(vm.btnNo,500);
						}    
					}
				})
			},
			//收起回复框
			msgClose:function(){
				$(this).parents(".reBox").find(".edit_area").text("");
				vm.showMsgnum=-1;
				vm.showMn=-1;
				$(".edit_area").text("");
			},
            //展示回复框
            showMsg:function(i){
            	/*vm.showMsgnum=i;*/
            	var d=Date.parse(new Date());
            	var dx=d-$(this).attr("datatime");
            	if(dx<=172800000){
            		if(vm.showMn==i){
                		vm.showMsgnum=-1;
                		vm.showMn=-1;
                		$(".edit_area").text("");
                	}else{
                		vm.showMsgnum=i;
                		vm.showMn=i;
                	}
            	}else{
            		vm.sizeI();
            		vm.errorMsg="超过48小时不能回复";
     		        $(".errorBox").show();
     		        $(".mBox").show();
     		        var t=setTimeout(vm.btnNo,500);
            	}
            },
            //回复
            msgSend:function(mId,wkeyA){
            	var _th=$(this);
            	var mcon=$(this).parents(".reBox").find(".edit_area").text();
            	_th.attr("disabled",true);
            	setTimeout(function(){
            		_th.attr("disabled",false);
            	},1000);
            	if(mcon.length<=0){
            		vm.sizeI();
    		        vm.errorMsg="字数不能小于1";
    		        $(".errorBox").show();
    		        $(".mBox").show();
    		        var t=setTimeout(vm.btnNo,500);
            		return;
            	}else if(mcon.length>=500){
            		vm.sizeI();
    		        vm.errorMsg="字数不能大于500";
    		        $(".errorBox").show();
    		        $(".mBox").show();
    		        var t=setTimeout(vm.btnNo,500);
            		return;
            	}
            	$.ajax({
            		url:'/message/weixin/reply48.html',
            		type:'post',
            		data:{
            			openid:mId,
            			wkeyAccount:wkeyA,
            			content:mcon
            		},
            		dataType:'json',
            		success:function(data){
            			if(data.status){
	            			vm.showMsgnum=-1;
	        				vm.showMn=-1;
	        				$(".edit_area").text("");
	                		var _url='/message/weixin/list.html';
	        		        var curr;
	        		        vm.ajaxFun(curr,_url,6);
	        		        vm.sizeI();
	        		        vm.errorMsg="发送成功";
	        		        $(".errorBox").show();
	        		        $(".mBox").show();
	        		        var t=setTimeout(vm.btnNo,500);
            			}    
            		}
            	});
            },
            //视频播放
            videoPlay:function(e){
            	e.preventDefault();
            	var _a=$(this).attr("dataValue");
            	var video=document.getElementById("video2");
            	var vv=document.getElementById("vv")
            	video.src=_a;
            	vv.src=_a;
            	$(".videoPlay").show();
            	$(".mBox").show();
            	vm.sizeI();
            	video.autoplay="autoplay";
            },
            //音频播放
            //点击播放，暂停
            clicks:function(i) {
            	var audio=document.getElementById("audio"+i);
            	audio.loop = true;
                if ($("#control"+i).hasClass("play")) {
                    $("#control"+i).addClass("pause").removeClass("play");
                    audio.play();//开始播放
                    $("#control"+i).html("<i class='fa fa-microphone-slash'></i>暂停播放");
                } else {
                    $("#control"+i).addClass("play").removeClass("pause");
                    $("#control"+i).html("<i class='fa fa-microphone'></i>播放声音");
                    audio.pause();
                }
            },
            //播放事件监听
            lisLoad:function(i){
           	 $("#control"+i).addClass("play").removeClass("color_gray");
                $("#control"+i).html("<i class='fa fa-microphone'></i>播放声音");
                var allTime = this.duration;
                setInterval(function() {
                    var currentTime = this.currentTime;
                }, 1000);
           },
           lisPause:function(i){
        	   $("#control"+i).addClass("play").removeClass("pause");
               $("#control"+i).html("<i class='fa fa-microphone'></i>播放声音");
               if (this.currentTime == this.duration) {
                   this.stop();
                   this.currentTime = 0;
               }
           },
           lisPlay:function(i){
        	   $("#control"+i).addClass("pause").removeClass("play");
               $("#control"+i).html("<i class='fa fa-microphone-slash'></i>暂停播放");
           },
           lisEnd:function(i){

           },
            //查询
            search:function(){
            },
            //导出订单
            expOrder:function(){            	
            },
            onAfterR:function(){
            	var flag=avalon(this).data('value');
            	if(flag=='score'){
            		vm.curIndex=3;
            		vm.onafterShow(3);
            	}else if(flag=='member'){
            		vm.curIndex=0;
            		vm.onafterShow(0);
            	}else if(flag=='money'){
            		vm.curIndex=4;
            		vm.onafterShow(4);
            	}
            },
            onafterShow:function(index){
            },
            toggle:function(index){
            	vm.curIndex=index;
            	vm.onafterShow(index);
            	if(index===0){
            		var uId=document.getElementById("uId").value;
            		var hr=$(".d-esc").attr("data-listsrc");
            		window.location.href="/member/memberGroup/overview.html?flag=member&userId="+uId+"&list="+hr;
            	}
            },
            //改变减少或增加
            mFun:function(mNum){
            	vm.mathNum=mNum;
            },
            //积分充值验证
            verJ:function(){
            	var j = parseInt($(".mPrice").val());
            	var jp;
            	if(vm.curIndex==3){
            		if(vm.obj.score==""||vm.obj.score==null||vm.obj.score==undefined){
            			jp=0;
            		}else{
            			jp=vm.obj.score;
            		}            		
            	}else if(vm.curIndex==4){
            		if(vm.obj.money==""||vm.obj.money==null||vm.obj.money==undefined){
            			jp=0;
            		}else{
            			jp=vm.obj.money/100;
            		}            		
            	}  
                var exg = /^\d{0,8}$/g;
                if (j === "") {
                    vm.errorP="*必填项";
                    return false;
                } else if (j == 0) {
                	vm.errorP="*不能为0";
                    return false;
                } else if (!exg.test(j)) {
                	vm.errorP="*必须为八位数之内的整数";
                    return false;
                } else if(vm.mathNum==1&&j>jp){
                	vm.errorP="*不能大于当前值";
                	return false;
                } else{
                	vm.errorP="";
                    return true
                }
            },
            verT:function(){
            	var k = $(".tdText").val().length;
                if (k > 100) {
                	vm.errorB="*字数必须小于100字";
                    return false;
                } else {
                	vm.errorB="";
                    return true;
                }
            },
            //errT隐藏errT值
            nullErr:function(){
            	vm.errorP=""
            },
            //确认积分或充值设置
            pbtnOk:function(){
            	if(vm.mTit=="积分管理"){
            		var _url="/score/history/add.html";
            		var ty='get';
            		var pri= parseInt($(".mPrice").val());
            		var _data={memberId: $("#uId").val(),changeType: vm.mathNum,scoreChange:pri,remark:$(".tdText").val()};
            	}else{
            		var _url='/member/money/addMoneyHis.html';
            		var ty='post';
            		var pri=parseInt($(".mPrice").val())*100;
            		var _data={memberId:$("#uId").val(),comeFrom: vm.mathNum,moneyChange:pri,remark:$(".tdText").val()};            		
            	}
            	var r=vm.verJ();
            	var b=vm.verT();
            	if(r&&b){
            		$(".mCbox").hide();
                	$(".DialogDiv").show();
	            	$.ajax({
	        	        url: _url,
	        	        type: ty,
	        	        dataType: "json",
	        	        data:_data,
	        	        success: function (data) {
	        	            if (data.status) {
	        	            	$(".DialogDiv").hide();
	        	            	$(".mBox").hide();
	        	            	if(vm.mTit=="积分管理"){
	        	            		var _urls='/score/history/index.html';
	        	            		var i=3;
	        	            	}else{
	        	            		var _urls='/member/money/moneyHis.html';
	        	            		var i=4;
	        	            	}	        	            	
	        	            	var curr;
	        	            	vm.ajaxFun(curr,_urls,i);
	        	            } else {
	        	            	$(".DialogDiv").hide();
	        	            	$(".mBox").hide();
	        	            }
	        	        }
	            	})
            	}
            },
            btnNo:function(){
            	$(".mBox").hide();
            	$(".mCon").hide();
            	$(".mCon2").hide();
            	vm.errorP="";
            },
            //积分充值设置弹窗
            adjust:function(){

            },
            //让提示框居中
            sizeI:function(){
            	var _widht = document.documentElement.clientWidth; //屏幕宽
                var _height = document.documentElement.clientHeight; //屏幕高
            	var boxWidth = $(".mCon").width();
                var boxHeight = $(".mCon").height();
            	$(".mCon").css({
            		top: (_height - boxHeight) / 2 + "px", left: (_widht - boxWidth) / 2 + "px"
            	});
            },
            sizeIbig:function(){
            	var _widht = document.documentElement.clientWidth; //屏幕宽
                var _height = document.documentElement.clientHeight; //屏幕高
            	var boxWidth = $(".mCon2").width();
                var boxHeight = $(".mCon2").height();
            	$(".mCon2").css({
            		top: (_height - boxHeight) / 2 + "px", left: (_widht - boxWidth) / 2 + "px"
            	});
            },
            //退出界面
            esc:function(){
            	var hr=decodeURIComponent($(this).attr("data-listsrc"));
            	window.location.href=hr;
            },
            //删除标签
            removeTab:function(tid,mid){
            	var _this=$(this);
            	$.ajax({
            		url:"/member/memberGroupRel/deleteTag.html",
            		type:"post",
            		dataType:"json",
            		data:{
            			tagId:tid,
            			memberId:mid
            		},
            		success:function(data){            			
            			if(data.success){
            				_this.parent("a").remove();
            			}
            		}
            	})
            },
            //日期选择
            timeCheck:function(i){
			    var start = {
				    elem: '#startCreateDate'+i,
				    /*format: 'YYYY/MM/DD hh:mm:ss',*/
				    max: '2099-06-16 23:59:59', //最大日期
				    istime: false,
				    istoday: false,
				    choose: function(datas){
				    	/*if(i==1){
				    		//将时间转换
					    	var d=datas.replace(/-/g,"/");
					    	var _date = (new Date(d)).getTime()+86400000;
					    	var newDate=new Date(_date);
					    	var _year = newDate.getFullYear();  
					    	var _month = parseInt(newDate.getMonth())+1;  
					    	var _day = newDate.getDate();
					    	var _fdate =  _year +"-"+_month+"-"+_day; 

					        end.min = _fdate; //开始日选好后，重置结束日的最小日期
					        end.start = _fdate; //将结束日的初始值设定为开始日
				    	}else if(i==4){*/
				    		end.min = datas; //开始日选好后，重置结束日的最小日期
					        end.start = datas; //将结束日的初始值设定为开始日
				    	/*}	*/			    	
				    }
				};
				var end = {
				    elem: '#endCreateDate'+i,
				    /*format: 'YYYY/MM/DD hh:mm:ss',*/
				    max: '2099-06-16 23:59:59',
				    istime: false,
				    istoday: false,
				    choose: function(datas){
				    	/*if(i==1){
				    		//将时间转换
					    	var d=datas.replace(/-/g,"/");
					    	var _date = (new Date(d)).getTime()-86400000;
					    	var newDate=new Date(_date);
					    	var _year = newDate.getFullYear();  
					    	var _month = parseInt(newDate.getMonth())+1;  
					    	var _day = newDate.getDate();
					    	var _fdate =  _year +"-"+_month+"-"+_day;
					    	
					        start.max = _fdate; //结束日选好后，重置开始日的最大日期
				    	}else if(i==4){*/
				    		start.max = datas;
				    	/*}*/				    	
				    }
				};
				laydate(start);
				laydate(end);
            },
            //导出订单
            expFun:function(_url,_order,startD,endD){            	
            	var uId=document.getElementById("uId").value;           	
	            window.location.href =_url+"?memberId="+uId+"&orderState="+_order+"&beginDate="+startD+"&endDate="+endD;            	
	            $(".DialogDiv").hide();
	        	$(".mBox").hide();
            },
            ajaxFun:function(curr,_url,i,_order,startD,endD){
            	var uId=document.getElementById("uId").value;
            	if(_order!=undefined&&startD==undefined&&endD==undefined){
            		data={pageNo:curr||1,memberId:uId,codeStatus:_order};
            	}else if(_order!=undefined&&startD!=undefined&&endD!=undefined){
            		data={pageNo:curr||1,memberId:uId,orderState:_order,beginDate:startD,endDate:endD};
            	}else if(startD!=undefined&&endD!=undefined){
            		data={pageNo:curr||1,memberId:uId,startTime:startD,endTime:endD};
            	}else{
            		data={pageNo:curr||1,memberId:uId}
            	}
            	var ty;
            	if(i==1){
            		ty='post';
            	}else{
            		ty='get';
            	}
            	$.ajax({
	            	url:_url,
	            	type:ty,
	            	dataType:'json',
	            	data:data,
	            	success:function(data){
	            		if(data.status==true){
	            			vm.show=0;
		            		vm.object=data.result.list;			            		
		            		vm.obj=data;
		            		vm.dataLength=vm.object.length;
	            			if(i==6){
	            		        vm.checkNewMsg(data.openId,data.wkeyAccount,data.maxId);
	            			}
		            		laypage({
		                        cont: $('#pDemo'+i),
		                        pages: data.result.totalPage,//data.pages,
		                        curr: curr || 1, //当前页
		                        skip: true, //是否开启跳页
		                        skin: '#AF0000',
		                        groups: 3, //连续显示分页数
		                        jump: function(obj,first){
		                        	if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
		                        		vm.ajaxFun(obj.curr,_url,i,_order,startD,endD);
		                        	}
		                        }
		                    })
	            		}else{
	            			vm.show=1;
	            		}
	            	}
		        })
            },
            ajaxSearch:function(curr,_url,i,uid){

            }
        });
        vm.onafterShow=function(index){
        	if(index===1){
        		//订单页面
        		require(['layDate'], function () {
        			//加载时间插件
		            //更改表格标题
		            vm.tabTit=['订单号','总价','商品数量','订单时间','状态','支付方式','支付时间','来源','操作'];
		            //加载第一页数据
		            var _url='/shop/order/getOrderList.html';
		            var curr;
		            var i=index;
		            vm.ajaxFun(curr,_url,i);
		            setTimeout(function(){vm.timeCheck(i);});
				})
        	}else if(index===2){
				vm.getAppointment();
				require(['layDate'],function(){
					setTimeout(function(){vm.timeCheck(index);});

				})
			}
			else if(index===3){
        		var i=index;
        		vm.tabTit=['积分变化','来源','时间','备注'];
        		var _url='/score/history/index.html';
		        var curr;
		        vm.ajaxFun(curr,_url,i);
        	}else if(index===4){
        		var i=index;
        		vm.tabTit=['金额','来源','时间','类型','备注'];
        		var _url='/member/money/moneyHis.html';
		        var curr;
		        vm.ajaxFun(curr,_url,i);
        	}else if(index===5){
        		require(['layDate'], function () {
        			//加载时间插件        			
		            var i=index;
	        		vm.tabTit=['序号','活动类型','活动名称','参与时间','备注'];
	        		var _url='/interactive/log/list.html';
			        var curr;
			        vm.ajaxFun(curr,_url,i);
			        setTimeout(function(){vm.timeCheck(i);});
        		})
        	}else if(index===6){
        		var i=index;
        		vm.tabTit=['序号','卡券名称','卡券种类','领取时间','状态','商家名称'];
        		var _url='/card/statistics/wxCardSingleDetail.html';
		        var curr;
		        vm.ajaxFun(curr,_url,i);
        	}else if(index===7){
        		var i=index;
        		var _url='/message/weixin/list.html';
		        var curr;
		        vm.ajaxFun(curr,_url,i);
		        $(".newMsg").hide();
        	}
        }
		//订单详情暂时跳转，有新处理方案时删除此不合理方法
		vm.detail=function(no){
			$.post("/shop/order/getNetOrderUrl.html",'',function(data){
				var  url=JSON.parse(data).result;
				window.open(url+no);
				}
			)
		};
        vm.search=function(){
        	var _index=vm.curIndex;
        	if(_index===5){
        		var _order=$('.floc option:selected').val();
        		var i=_index;
        		var _url='/card/statistics/wxCardSingleDetail.html';
		        var curr;
        		vm.ajaxFun(curr,_url,i,_order);
        	}else if(_index===1){
        		var _order=$('.flob option:selected').val();
        		var _sD=$('#startCreateDate1').val();
        		var _eD=$('#endCreateDate1').val();
        		_sD=$('#startCreateDate1').val()+" 00:00:00";
        		_eD=$('#endCreateDate1').val()+" 23:59:59";       		
        		var i=_index;
        		var _url='/shop/order/getOrderList.html';
		        var curr; 
		        vm.ajaxFun(curr,_url,i,_order,_sD,_eD);		       
        	}else if(_index===4){
        		var _sD=$('#startCreateDate4').val();
        		var _eD=$('#endCreateDate4').val();
        		var i=_index;
        		var _url='/interactive/log/list.html';
		        var curr;
		        //if(_sD==""||_eD==""){
		        //	vm.errorMsg="开始时间和结束时间都不能为空";
		        //	vm.sizeI();
		        //	$(".mBox").show();
		        //	$(".errorBox").show();
		        //	var t=setTimeout(vm.btnNo,3000);
		        //}else{
		        	vm.ajaxFun(curr,_url,i,_order,_sD,_eD);
		        //}
        	}
        }
        //积分充值调整
        vm.adjust=function(){
        	vm.mathNum=0;
        	var _index=vm.curIndex;
        	if(_index==3){
        		vm.mTit="积分管理";
        		vm.mText="积分";
        		vm.mUnit="分";
        		vm.miNum=1;
        	}else if(_index==4){
        		vm.mTit="充值管理";
        		vm.mText="金额";
        		vm.mUnit="元";
        		vm.miNum=2;
        	}
        	//展示
        	$(".mBox").show();
        	$(".mCbox").show();
        	//置空
        	$(".tdR input").val("");
        	$(".tdText").val("");
        	vm.errorB="";
        	vm.errorT="";
        	//让窗口居中
        	vm.sizeI();
        }
        //导出订单
        vm.expOrder=function(){
        	var _order=$('.flob option:selected').val();
    		var _sD=$('#startCreateDate1').val();
    		var _eD=$('#endCreateDate1').val();
    		var _url='/shop/order/export.html';
    		vm.expFun(_url,_order,_sD,_eD);
        }
        window.onresize = function () {
        	vm.sizeI();
        	vm.sizeIbig();
    	}
        avalon.scan();
    });
})
