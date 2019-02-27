//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a[name='nodes.html']").addClass("current");
parent.$(".nav .container a[name='nodes.html']").siblings().removeClass("current");
parent.$(".footer").show();

document.cookie = 'page=nodes.html';
//placeholder兼容
$(document).on('click','.placeholder',function(){
	if($(this).siblings('input').prop('disabled') == true){
		$(this).show();
	}else{
		$(this).hide();
		$(this).siblings('input').focus();
	}
})

// 改变每页多少数据
$("body").on("blur", "#numperpageinput", function() {
	if($(this).val() == "" || parseInt($(this).val()) < 10) {
		numperpage = 10;
	} else if(parseInt($(this).val()) > 1000) {
		numperpage = 1000;
	} else {
		numperpage = parseInt($("#numperpageinput").val());
	}
	localStorage.setItem('numperpage',numperpage);
	nodesListFun();
})
//排序
$(document).on('click','.tableContainer .table th.th-ordery',function(){
	var toggleClass = $(this).attr('class');
	var _this = $(this);
    sortingFun(_this,toggleClass);
	var currentPage = $(this).parents('.tableContainer').find('.tcdPageCode span.current').text();
	var currentNum = $(this).parents('.tableContainer').find('#numperpageinput').val();
	var start = (parseInt(currentPage) - 1) * parseInt(currentNum);
	nodesListFun(start);
})
//列表信息
function columnsDataListFun (){
	var columns = [
		{
			type: "hostname",title: "中心名称",name: "hostname",
			tHead:{style: {width: "15%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "15%"},class:"hostnameTd",customFunc: function (data, row, i) {return "<span taskid ='"+row.server_id+"'>" +safeStr(data)+ "<i class='fa fa-pencil'></i></span>"}},
		},{
			type: "ip",title: "IP",name: "ip",
			tHead:{style: {width: "10%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) {return safeStr(data)}},
		},{
			type: "client_count",title: "终端部署",name: "client_count",
			tHead:{style: {width: "7%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png' style='right: -10px;'/>"}},
			tBody:{style: {width: "7%"},customFunc: function (data, row, i) {
				if(data > 99999999){return "><span>" + data.toString().slice(0,1) + "亿+</span>";
				}else{return "<span>" + data + "</span>";}
			}}
		},{
			type: "online_count",title: "在线终端",name: "online_count",
			tHead:{style: {width: "7%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png' style='right: -10px;'/>"}},
			tBody:{style: {width: "7%"},customFunc: function (data, row, i) {
				if(data > 99999999){return "><span>" + data.toString().slice(0,1) + "亿+</span>";
				}else{return "<span>" + data + "</span>";}
			}}
		},{
			type: "virus_count",title: "病毒防护",name: "virus_count",
			tHead:{style: {width: "7%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png' style='right: -10px;'/>"}},
			tBody:{style: {width: "7%"},customFunc: function (data, row, i) {
				if(data > 99999999){return "><span>" + data.toString().slice(0,1) + "亿+</span>";
				}else{return "<span>" + data + "</span>";}
			}},
		},{
			type: "sysprot_count",title: "系统防护",name: "sysprot_count",
			tHead:{style: {width: "7%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png' style='right: -10px;'/>"}},
			tBody:{style: {width: "7%"},customFunc: function (data, row, i) {
				if(data > 99999999){return "><span>" + data.toString().slice(0,1) + "亿+</span>";
				}else{return "<span>" + data + "</span>";}
			}},
		},{
			type: "netprot_count",title: "网络防护",name: "netprot_count",
			tHead:{style: {width: "7%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png' style='right: -10px;'/>"}},
			tBody:{style: {width: "7%"},customFunc: function (data, row, i) {
				if(data > 99999999){return "><span>" + data.toString().slice(0,1) + "亿+</span>";
				}else{return "<span>" + data + "</span>";}
			}},
		},{
			type: "heartbeat",title: "最近通讯时间",name: "heartbeat",
			tHead:{style: {width: "13%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "13%"},customFunc: function (data, row, i) {
                    return "<span>" + safeStr(getLocalTime(data)) + "</span>";
            }},
		},{
			type: "lic_quota_type",title: "分配授权",name: "lic_quota_type",
			tHead:{style: {width: "10%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%",position:"relative"},class:"lic_quota",customFunc: function (data, row, i) {
				var select = "<ul class='lic_quota_type none'><li type='0' taskid ='"+row.server_id+"'>独立授权</li><li type='1'  taskid ='"+row.server_id+"'>动态分配</li><li type='2' taskid ='"+row.server_id+"'>自定义分配</li></ul>";
				if(data == 0){
					return "<span class='lic_quota_type_span'>独立授权</span><input type='text' min='0' class='lic_quota_type_inp'/><i class='fa fa-sort-desc select-desc'></i>" + select;
				}else if(data == 1){
					return "<span class='lic_quota_type_span'>动态分配</span><input type='text' min='0' class='lic_quota_type_inp'/><i class='fa fa-sort-desc select-desc'></i>" + select;
				}else if(data == 2){
					return "<span class='lic_quota_type_span' style='display:none;'>自定义分配</span><input type='text' min='0' class='lic_quota_type_inp' value='"+row.lic_quota_alloc+"' defaultValue = '"+row.lic_quota_alloc+"' style='display:block;'/>" + select + "</td>";
				}else{
					return "--";
				}
            }},
		},{
			type: "status",title: "状态",name: "status",
			tHead:{style: {width: "10%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) {
				if(data == 0){
					return "正常";
				}else{
					return "<span class='orange'>"+fieldHandle(licenseStatusField,data)+"</span>";
				}
			}}
		},{
			type: "",title: "操作",name: "",
			tHead:{style: {width: "8%"},customFunc: function (data, row, i) {return ""}},
			tBody:{style: {width: "8%"},customFunc: function (data, row, i) {
				return "<a class='cursor underline blackfont' href='/mgr/nodes/_connect?id="+row.server_id+"' target='_blank'>登录</a>"; }}
		}]
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
var tabListstr = columnsDataListFun();
//多级中心列表
var ajaxtable = null;
nodesListFun();
function nodesListFun(start) {
	if(ajaxtable) {
		ajaxtable.abort();
	}
	if(start == undefined) {
		start = 0;
	}else{
		start = start;
	}
	var dataa = {
		"view": {
			"begin": start,
			"count": numperpage
		}
	};
	var type = $('.tableContainer .table th.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.tableContainer .table th.th-ordery.th-ordery-current').attr('class');
	dataa = sortingDataFun(dataa,type,orderClass);
	$(".table tbody").append("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
	ajaxtable =
		$.ajax({
			url: '/mgr/nodes/_list',
			type: 'POST',
			data:JSON.stringify(dataa),
			contentType: 'text/plain',
			error: function(xhr, textStatus, errorThrown) {
				if(xhr.status == 401) {
					parent.window.location.href = '/';
				}
			},
			success: function(data) {
				if(data.errno == 0){
					var list = data.data.list;
					var pages = Math.ceil(data.data.view.total / numperpage);
						if(list.length == 0) {
							$(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
						}else{
							tabListstr.setData(list);
						}
						tbodyAddHeight();
						$(".tableContainer .clearfloat").remove();
						$(".tableContainer .tcdPageCode").remove();
						$(".tableContainer .totalPages").remove();
						$(".tableContainer .numperpage").remove();
						$(".tableContainer").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 " + data.data.view.total + "  条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><a style='font-size:12px;float:right;line-height:54px;padding-right:20px;color:#6a6c6e' class='numperpage'>每页<input type='text' id='numperpageinput' value=" + numperpage + " style='font-size:12px;width:40px;height:24px;margin:0 4px;vertical-align:middle;padding:0 10px;'>条</a><div class='clear clearfloat'></div>");
						var current = (dataa.view.begin/dataa.view.count) + 1;
						$(".tableContainer .tcdPageCode").createPage({
							pageCount: pages,
							current: parseInt(current),
							backFn: function(pageIndex) {
							start = (pageIndex - 1) * numperpage;
							dataa.view.begin = start;
							$(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
							ajaxtable =
								$.ajax({
									url: '/mgr/nodes/_list',
									data: JSON.stringify(dataa),
									type: 'POST',
									contentType: 'text/plain',
									success: function(data) {
										var list = data.data.list;
					                    tabListstr.setData(list);
                            			tbodyAddHeight();
									}
								});
	
						}
					})
						
				}else{	
					delayHide("获取失败");
				}
			}
		})
};

//多级中心状态
nodesStatus();
function nodesStatus(){

		$.ajax({
			url: '/mgr/nodes/_stat',
			type: 'GET',
			data:{},
			contentType: 'text/plain',
			error: function(xhr, textStatus, errorThrown) {
				if(xhr.status == 401) {
					parent.window.location.href = '/';
				}
			},
			success: function(data) {
				if(data.errno == 0){
					if(data.data.heartbeat == 0){
						$('.topTips').html('<a>与上级中心最近通讯时间:<span>未通讯</span></a>');
					}else{
						$('.topTips').html('<a>与上级中心最近通讯时间:<span>' + getLocalTime(data.data.heartbeat) + '</span></a>');
					}

				}
			}
		})
	
}
/*JQuery 限制文本框只能输入数字*/  
$(document).on('keyup',".lic_quota_type_inp",function(){
    	var c=$(this);
		var reg = /^\+?[1-9][0-9]*$/;  /*非零正整数*/
    	if(!reg.test(c.val())){
    		var temp=c.val().replace(/[^1-9]/g,'');
    		$(this).val(temp);
    	}
})           


//分配授权控制下拉列表显示隐藏
$(document).on('click','.lic_quota_type_span,.select-desc,.lic_quota_type_inp,.select-desc',function(){
	$(this).siblings('ul').toggleClass('none');
	$(this).parents('tr').siblings('tr').find('ul').addClass('none');
})
//分配授权控制li模拟下拉列表
$(document).on('click','.lic_quota_type li',function(){
	var value = $(this).text();
	var type = $(this).attr('type');
	var id = $(this).attr('taskid');
	var _this = $(this).parent('ul.lic_quota_type').siblings('.lic_quota_type_span');
	$(this).parents('ul.lic_quota_type').siblings('.lic_quota_type_inp').removeAttr('defaultValue');
	$(this).parent('ul.lic_quota_type').siblings('.lic_quota_type_inp').val('');
	$(this).parent('ul.lic_quota_type').siblings('.lic_quota_type_inp').hide();
	if(type == 2){
		_this.hide();
		$(this).parent('ul.lic_quota_type').siblings('.select-desc').hide();
		$(this).parent('ul.lic_quota_type').siblings('.lic_quota_type_inp').attr('taskid',id);
		$(this).parent('ul.lic_quota_type').siblings('.lic_quota_type_inp').show().val('');
		$(this).parent('ul.lic_quota_type').siblings('.lic_quota_type_inp').focus();
	}else{
		
		$(this).parent('ul.lic_quota_type').siblings('.select-desc').show();
		_this.show();

		if(value != _this.text()){
			licTypeUpdate(type,id,'','');
			
		}
		_this.html(value);

	}
	
	$(this).parent('ul.lic_quota_type').addClass('none');
	
	
});
//自定义分配确定
$(document).on('click','.licBtn',function(){
	var index = $(this).attr('index');
	var _this = $('.table table tr').eq(parseInt(index)).find('.lic_quota');
	_this.find('.lic_quota_type_span').hide();
	_this.find('.lic_quota_type_inp').show();
	_this.find('.select-desc').hide();
	_this.find('.lic_quota_type_inp').focus();
	
	$(this).parents('.licQuotaTypePop').hide();
	$('.shade').hide();

})
//自定义分配修改
$(document).on('blur','.lic_quota_type_inp',function(){
	var id = $(this).attr('taskid');
	var value = $(this).val();
	var defaultValue = $(this).attr('defaultValue');
	var _this = $(this);
	
	setTimeout(function(){
	if(_this.parents('.lic_quota').find('.lic_quota_type_span').css('display') == 'inline-block'){
		return false;
	}
    //val存在，且与原始val不同，发送请求
    if(value && value != defaultValue){
		_this.attr('defaultValue',value);
		licTypeUpdate('2',id,value,'');
	}
    //val不存在，原始val不存在，展示原始独立或者动态状态
	if(!value && !defaultValue ){
		_this.parents('.lic_quota').find('.lic_quota_type_span').show();
		_this.parents('.lic_quota').find('.lic_quota_type_inp').removeAttr('defaultValue');
		_this.parents('.lic_quota').find('.select-desc').show();
		_this.hide();
	}
	//val不存在，原始val存在，val赋值为原始val（此时为input原来有值，但未被修改状态）
	if(!value && defaultValue|| value == defaultValue){
		 _this.val(defaultValue);
	}
	_this.siblings('ul.lic_quota_type').addClass('none');
	}, 300);
});
//回车事件    自定义分配修改、中心名称修改
$(document).on('keydown','.lic_quota_type_inp,.hostnameInp',function(e){
	if (!e) e = window.event;
    if ((e.keyCode || e.which) == 13) {
        $(this).blur();
    }
})
//点击i span切换input（中心名称）
$(document).on('click','.hostnameTd i',function(){
	var spanText = $(this).parent('span').text();
	var thisIndex = $(this).parents('tr').index();
	var taskid = $(this).parents('span').attr('taskid');
	$(this).parents('.hostnameTd').html("<input type='text' taskid='"+taskid+"' value='"+safeStr(spanText)+"' class='hostnameInp' defaultValue = '"+safeStr(spanText)+"' maxlength='20'/>");
	$('.table tr').eq(parseInt(thisIndex)).find('.hostnameInp').focus();
})

//中心名称修改
$(document).on('blur','.hostnameInp',function(){
	var defaultValue = $(this).attr('defaultValue');
	var aliasname = $(this).val();
	var id = $(this).attr('taskid');
	if(aliasname != defaultValue){
		licTypeUpdate('',id,'',aliasname);
	}
	$(this).parents('.hostnameTd').html("<span>" +safeStr(aliasname)+ "<i class='fa fa-pencil'></i></span>");
	

})

//点击除下拉列表的其他区域列表隐藏
$('body').click(function(e) {
    var target = $(e.target);
    // 如果#overlay或者#btn下面还有子元素，可使用
    // !target.is('#btn *') && !target.is('#over$('.table table tr').eq(parseInt(index)).find('.lic_quota_type_inp').lay *')
    if(!target.is('ul.lic_quota_type') && !target.is('ul.lic_quota_type li')&& !target.is('.lic_quota_type_span')&& !target.is('.lic_quota_type_inp')&& !target.is('.select-desc')) {
       if ( $('ul.lic_quota_type').is(':visible') ) {  
			$('ul.lic_quota_type').addClass('none');
       }
    }
    
});

//自定义分配修改

function licTypeUpdate(type,id,alloc,aliasname){	
	
	var data = {
		"server_id" : parseInt(id),
		"lic_quota_type" : parseInt(type),
		"lic_quota_alloc" : parseInt(alloc),
		"aliasname":aliasname
	}
	$.ajax({
			url: '/mgr/nodes/_update',
			type: 'POST',
			dataType : 'json',
			data: JSON.stringify(data),
			contentType: 'text/plain',
			error: function(xhr, textStatus, errorThrown) {
				if(xhr.status == 401) {
					parent.window.location.href = '/';
				}
			},
			success: function(data) {
				if(data.errno == 0){
					delayHideS("操作成功");
				}else{
					delayHide("操作失败");
				}
			}
		})
	
}
//配置上级中心

$(document).on('click','.topCenter',function(){
	$('.nodesPop').show();
	$('.shade').show();
	$('.nodesPop .lcs_check').lc_switch();
	$.ajax({
			url: '/mgr/sysconf/_nodes',
			type: 'GET',
			data:{},
			contentType: 'text/plain',
			error: function(xhr, textStatus, errorThrown) {
				if(xhr.status == 401) {
					parent.window.location.href = '/';
				} else {

				}
			},
			success: function(data) {
				if(data.errno == 0){
				   var data = data.data;
				   if(data.enabled == true) {
						$(".nodesPop input[name=nodesSwitch]").prop("checked", true);
						$(".nodesPop input[name=nodesSwitch]").next().addClass("lcs_on");
						$(".nodesPop input[name=nodesSwitch]").next().removeClass("lcs_off");
						$('.nodesPop input').removeAttr('disabled');
					}else{
						$(".nodesPop input[name=nodesSwitch]").prop("checked", false);
						$(".nodesPop input[name=nodesSwitch]").next().addClass("lcs_off");
						$(".nodesPop input[name=nodesSwitch]").next().removeClass("lcs_on");
						$('.nodesPop input').prop('disabled','disabled');
					}
					if(data.config.addr){
						$(".nodesPop input[name=addr]").val(data.config.addr);
						$(".nodesPop input[name=addr]").siblings('.placeholder').hide();
					}else{
						$(".nodesPop input[name=addr]").siblings('.placeholder').show();
					}
					if(data.config.token){
						$(".nodesPop input[name=token]").val(data.config.token);
						$(".nodesPop input[name=token]").siblings('.placeholder').hide();
					}else{
						$(".nodesPop input[name=token]").siblings('.placeholder').show();
					}
					if(data.config.admin_trust == true) {
						$(".nodesPop input[name=admin_trust]").prop("checked", true);
					}else{
						$(".nodesPop input[name=admin_trust]").prop("checked", false);
					}
					if(data.download.upgrade == true) {
						$(".nodesPop input[name=upgrade]").prop("checked", true);
					}else{
						$(".nodesPop input[name=upgrade]").prop("checked", false);
					}
					if(data.download.leakrepair == true) {
						$(".nodesPop input[name=leakrepair]").prop("checked", true);
					}else{
						$(".nodesPop input[name=leakrepair]").prop("checked", false);
					}
					
				}else{
					delayHide("操作失败");
				}

			}
		})
})
//配置上级中心 ---连接开关按钮
$(document).on('click','.lcs_switch',function(){
	var check = $(".nodesPop input[name=nodesSwitch]").prop("checked");
	if(check == true){
		$('.switchTipPop').show();
		$('.shadee').show();
		
	}else{
		$('.nodesPop input').removeAttr('disabled');
	}
})
//确认关闭
$(document).on('click','.switchTipPop .sure',function(){
	$('.nodesPop input').attr('disabled','disabled');	
	$('.switchTipPop').hide();
	$('.shadee').hide();
})

//确定配置
function saveNodes(){
	var enabled = $(".nodesPop input[name=nodesSwitch]").prop("checked");
	var addr = $(".nodesPop input[name=addr]").val();
	var token = $(".nodesPop input[name=token]").val();
	var admin_trust = $(".nodesPop input[name=admin_trust]").prop("checked");
	var upgrade = $(".nodesPop input[name=upgrade]").prop("checked");
	var leakrepair = $(".nodesPop input[name=leakrepair]").prop("checked");
	
	if(!addr && enabled == true){
		delayHide("请输入上级控制中心地址");		
		return false;
	}
	if(addr.substring(0,4) != 'http' && addr.substring(0,5) != 'https' && enabled == true){
		delayHide("中心地址格式输入不正确");
		return false;
	}
	if(!token && enabled == true){
		delayHide("请输入上级控制中心秘钥");
		return false;
	}

	var data = {
		"enabled" : enabled,
		"config" : {
			"addr" : addr,
			"token" : token,
			"admin_trust" : admin_trust
		},
		"download" : {
			"upgrade" : upgrade,
			"leakrepair":leakrepair
		}
	}
	$.ajax({
			url: '/mgr/sysconf/_nodes',
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'text/plain',
			error: function(xhr, textStatus, errorThrown) {
				if(xhr.status == 401) {
					parent.window.location.href = '/';
				} else {

				}
			},
			success: function(data) {
				if(data.errno == 0){
					delayHideS("操作成功");
					$('.nodesPop').hide();
					$('.shade').hide();
				}else{
					delayHide("操作失败");
				}

			}
		})
}
$(".closeW").click(function() {
	$(".shade").hide();
	$(this).parent().parent().hide();
	
});
$('.closePop').click(function(){
	$(".shadee").hide();
	$(this).parent().parent().hide();
	$(".nodesPop input[name=nodesSwitch]").prop("checked", true);
	$(".nodesPop input[name=nodesSwitch]").next().addClass("lcs_on");
	$(".nodesPop input[name=nodesSwitch]").next().removeClass("lcs_off");
})

//调整页面内元素高度
function tbodyAddHeight(){
	var mainlefth = parent.$("#iframe #mainFrame").height();

	$(".main .table tbody").css({height: mainlefth - 240});
}
window.onresize = function() {
	tbodyAddHeight();
}