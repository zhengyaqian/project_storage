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


$(document).on('click','.tableContainer .tableth th.th-ordery',function(){
	var toggleClass = $(this).attr('class');
	$(this).siblings('th.th-ordery').removeClass().addClass('th-ordery');
	$(this).siblings('th.th-ordery').find('img').attr('src','images/th-ordery.png');
	if(toggleClass == 'th-ordery'){
		$(this).find('img').attr('src','images/th-ordery-up.png');
		$(this).addClass('th-ordery-current th-ordery-up');
	}else if(toggleClass == 'th-ordery th-ordery-current th-ordery-up'){
		$(this).find('img').attr('src','images/th-ordery-down.png');
		$(this).addClass('th-ordery-current th-ordery-down');
		
	}else if(toggleClass == 'th-ordery th-ordery-current th-ordery-up th-ordery-down'){
		$(this).find('img').attr('src','images/th-ordery.png');
		$(this).removeClass('th-ordery-current th-ordery-down th-ordery-up');
	}
	
	var currentPage = $(this).parents('.tableContainer').find('.tcdPageCode span.current').text();
	var currentNum = $(this).parents('.tableContainer').find('#numperpageinput').val();
	var start = (parseInt(currentPage) - 1) * parseInt(currentNum);
	nodesListFun(start);
})
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
	var type = $('.tableContainer .tableth th.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.tableContainer .tableth th.th-ordery.th-ordery-current').attr('class');
	var ordery;
	var order = {};
	dataa.order = [];
	if(orderClass == 'th-ordery th-ordery-current th-ordery-up th-ordery-down'){
		ordery = 'desc';
	}else if(orderClass == 'th-ordery th-ordery-current th-ordery-up'){
		ordery = 'asc';
	}
	if(type){
		order[type] = ordery;
		dataa.order.push(order);
	}
	$(".table table #tableAlign").siblings('tr').html('');
	$(".table table").append("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
	ajaxtable =
		$.ajax({
			url: '/mgr/nodes/_list',
			type: 'POST',
			data:JSON.stringify(dataa),
			contentType: 'text/plain',
			headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
			error: function(xhr, textStatus, errorThrown) {
				if(xhr.status == 401) {
					parent.window.location.href = '/';
				} else {

				}
			},
			success: function(data) {
				if(data.errno == 0){
					var list = data.data.list;
				var pages = Math.ceil(data.data.view.total / numperpage);
					
					var tableth = "";
						tableth += "<tr id='tableAlign'>"
	            		tableth += "<td width='15%'>中心名称</td>"
	            		tableth += "<td width='10%'>IP</td>"
	            		tableth += "<td width='7%'>终端部署</td>"
	            		tableth += "<td width='7%'>在线终端</td>"
	                	tableth += "<td width='7%'>病毒防护</td>"
	                	tableth += "<td width='7%'>系统防护</td>"
	                	tableth += "<td width='7%'>网络防护</td>"
	            		tableth += "<td width='13%'>最近通讯时间</td>"
	            		tableth += "<td width='8%'>分配授权</td>"
	            		tableth += "<td width='8%'>状态</td>"
	            		tableth += "<td width='10%'>操作</td>"
	                	
	                    tableth += "</tr>"
						$(".table table").html(tableth);
						for(i = 0; i < list.length; i++) {
							var table = "";
							table += "<tr taskid='" + list[i].server_id + "'>";
							table += "<td class='hostnameTd'><span>" +safeStr(list[i].hostname)+ "<i class='fa fa-pencil'></i></span></td>";
							table += "<td><span>" + safeStr(list[i].ip) + "</span></td>";
							if(list[i].client_count > 99999999){
								table += "<td><span>" + list[i].client_count.toString().slice(0,1) + "亿+</span></td>";
							}else{
								table += "<td><span>" + list[i].client_count + "</span></td>";
							}
							if(list[i].online_count > 99999999){
								table += "<td><span>" + list[i].online_count.toString().slice(0,1) + "亿+</span></td>";
							}else{
								table += "<td><span>" + list[i].online_count + "</span></td>";
							}
							if(list[i].virus_count > 99999999){
								table += "<td><span>" + list[i].virus_count.toString().slice(0,1) + "亿+</span></td>";
							}else{
								table += "<td><span>" + list[i].virus_count + "</span></td>";
							}
							if(list[i].sysprot_count > 99999999){
								table += "<td><span>" + list[i].sysprot_count.toString().slice(0,1) + "亿+</span></td>";
							}else{
								table += "<td><span>" + list[i].sysprot_count + "</span></td>";
							}
							if(list[i].netprot_count > 99999999){
								table += "<td><span>" + list[i].netprot_count.toString().slice(0,1) + "亿+</span></td>";
							}else{
								table += "<td><span>" + list[i].netprot_count + "</span></td>";
							}
							
							
							table += "<td><span>" + safeStr(getLocalTime(list[i].heartbeat)) + "</span></td>";
	
							if(list[i].lic_quota_type == 0){
								table += "<td>独立授权</td>";
							}else if(list[i].lic_quota_type == 1){
								table += "<td>动态分配</td>";
							}else if(list[i].lic_quota_type == 2){
								table += "<td>自定义分配</td>";
							}else{
								table += "<td></td>";
							}
							
							if(list[i].status == 0){
								table += "<td>正常</td>";
							}else if(list[i].status == 1){
								table += "<td class='orange'>未授权</td>";
							}else if(list[i].status == 2){
								table += "<td class='orange'>授权已满</td>";
							}else if(list[i].status == 3){
								table += "<td class='orange'>授权到期</td>";
							}else if(list[i].status == 4){
								table += "<td class='orange'>需要升级</td>";
							}else{
								table += "<td></td>";
							}
		
							table += "<td><a class='cursor underline blackfont '  href='/mgr/nodes/_connect?id="+list[i].server_id+"' target='_blank'>登录</a><a class=' cursor underline blackfont editQuota' quota_type='"+ list[i].lic_quota_type +"' quota_alloc='"+ list[i].lic_quota_alloc +"' >编辑授权</a></td>";
							
							table += "</tr>";
							
		
							$(".table table").append(table);
							$("tr[taskid="+list[i].server_id+"] select option[type="+list[i].lic_quota_type+"]").attr("selected",true);
							
						}
						if(list.length == 0) {
							$(".table table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
						}
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
							$(".table table").html("");
	
							start = (pageIndex - 1) * numperpage;
							dataa.view.begin = start;
							$(".table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
							ajaxtable =
								$.ajax({
									url: '/mgr/nodes/_list',
									data: JSON.stringify(dataa),
									type: 'POST',
									contentType: 'text/plain',
									headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
									success: function(data) {
										var list = data.data.list;
										for(i = 0; i < list.length; i++) {
											var table = "";
											table += "<tr taskid='" + list[i].server_id + "'>";
											table += "<td class='hostnameTd'><span>" +safeStr(list[i].hostname)+ "<i class='fa fa-pencil'></i></span></td>";
											table += "<td><span>" + safeStr(list[i].ip) + "</span></td>";
											if(list[i].client_count > 99999999){
												table += "<td><span>" + list[i].client_count.toString().slice(0,1) + "亿+</span></td>";
											}else{
												table += "<td><span>" + list[i].client_count + "</span></td>";
											}
											if(list[i].online_count > 99999999){
												table += "<td><span>" + list[i].online_count.toString().slice(0,1) + "亿+</span></td>";
											}else{
												table += "<td><span>" + list[i].online_count + "</span></td>";
											}
											if(list[i].virus_count > 99999999){
												table += "<td><span>" + list[i].virus_count.toString().slice(0,1) + "亿+</span></td>";
											}else{
												table += "<td><span>" + list[i].virus_count + "</span></td>";
											}
											if(list[i].sysprot_count > 99999999){
												table += "<td><span>" + list[i].sysprot_count.toString().slice(0,1) + "亿+</span></td>";
											}else{
												table += "<td><span>" + list[i].sysprot_count + "</span></td>";
											}
											if(list[i].netprot_count > 99999999){
												table += "<td><span>" + list[i].netprot_count.toString().slice(0,1) + "亿+</span></td>";
											}else{
												table += "<td><span>" + list[i].netprot_count + "</span></td>";
											}
											
											
											table += "<td><span>" + safeStr(getLocalTime(list[i].heartbeat)) + "</span></td>";
											if(list[i].lic_quota_type == 0){
												table += "<td>独立授权</td>";
											}else if(list[i].lic_quota_type == 1){
												table += "<td>动态分配</td>";
											}else if(list[i].lic_quota_type == 2){
												table += "<td>自定义分配</td>";
											}else{
												table += "<td></td>";
											}
					
											
											if(list[i].status == 0){
												table += "<td>正常</td>";
											}else if(list[i].status == 1){
												table += "<td class='orange'>未授权</td>";
											}else if(list[i].status == 2){
												table += "<td class='orange'>授权已满</td>";
											}else if(list[i].status == 3){
												table += "<td class='orange'>授权到期</td>";
											}else if(list[i].status == 4){
												table += "<td class='orange'>需要升级</td>";
											}else{
												table += "<td></td>";
											}
						
											table += "<td><a class='cursor underline blackfont'  href='/mgr/nodes/_connect?id="+list[i].server_id+"' target='_blank'>登录</a><a class=' cursor underline blackfont editQuota' quota_type='"+ list[i].lic_quota_type +"' quota_alloc='"+ list[i].lic_quota_alloc +"' >编辑授权</a></td>";
											
											table += "</tr>";
											
						
											$(".table table").append(table);
											$("tr[taskid="+list[i].server_id+"] select option[type="+list[i].lic_quota_type+"]").attr("selected",true);
											
										}
	
									}
								});
	
						}
					})
						
				}else{	
					$(".delayHideS").show();
					$(".delayHideS .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'>获取失败</span>");
					setTimeout(function() {
						$(".delayHideS").hide()
					}, 2000);
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
			headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
			error: function(xhr, textStatus, errorThrown) {
				if(xhr.status == 401) {
					parent.window.location.href = '/';
				} else {

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
	$(this).parents('.hostnameTd').html("<input type='text' value='"+safeStr(spanText)+"' class='hostnameInp' defaultValue = '"+safeStr(spanText)+"' maxlength='20'/>");
	$('.table tr').eq(parseInt(thisIndex)).find('.hostnameInp').focus();
})

//中心名称修改
$(document).on('blur','.hostnameInp',function(){
	var defaultValue = $(this).attr('defaultValue');
	var aliasname = $(this).val();
	var id = $(this).parents('tr').attr('taskid');
	if(aliasname != defaultValue){
		
		licTypeUpdate('', id, '', '', aliasname);
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

function licTypeUpdate(type, id, w_alloc, l_alloc, aliasname){	
	
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
			headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
			error: function(xhr, textStatus, errorThrown) {
				if(xhr.status == 401) {
					parent.window.location.href = '/';
				} else {

				}
			},
			success: function(data) {
				if(data.errno == 0){
					$(".delayHideS").show();
					$(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> 操作成功</span>");
					setTimeout(function() {
						$(".delayHideS").hide()
					}, 2000);
				}else{
					$(".delayHide").show();
					$(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'>操作失败</span>");
					setTimeout(function() {
						$(".delayHide").hide()
					}, 2000);
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
			headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
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
					$(".delayHide").show();
					$(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'>操作失败</span>");
					setTimeout(function() {
						$(".delayHide").hide()
					}, 2000);
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
		$(".delayHide").show();
		$(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'>请输入上级控制中心地址</span>");
		setTimeout(function() {
			$(".delayHide").hide()
		}, 2000);
		
		return false;
	}
	if(addr.substring(0,4) != 'http' && addr.substring(0,5) != 'https' && enabled == true){
		$(".delayHide").show();
		$(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'>中心地址格式输入不正确</span>");
		setTimeout(function() {
			$(".delayHide").hide()
		}, 2000);
		
		return false;
	}
	if(!token && enabled == true){
		$(".delayHide").show();
		$(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'>请输入上级控制中心秘钥</span>");
		setTimeout(function() {
			$(".delayHide").hide()
		}, 2000);
		
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
			headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
			error: function(xhr, textStatus, errorThrown) {
				if(xhr.status == 401) {
					parent.window.location.href = '/';
				} else {

				}
			},
			success: function(data) {
				if(data.errno == 0){
					$(".delayHideS").show();
					$(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> 操作成功</span>");
					setTimeout(function() {
						$(".delayHideS").hide()
					}, 2000);
					$('.nodesPop').hide();
					$('.shade').hide();
				}else{
					$(".delayHide").show();
					$(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'>操作失败</span>");
					setTimeout(function() {
						$(".delayHide").hide()
					}, 2000);
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

//编辑授权弹窗
$(document).on('click', '.editQuota', function(){
	$('.quotaPop').show().attr('taskid',$(this).attr('taskid'));
	shade();
	$('.quotaPop input').val('');

	var quota_type = $(this).attr('quota_type');
	if(quota_type == '2'){
		$('.quotaPop .custom_distr').removeClass('custom_distr_style');
		$('.quotaPop .custom_distr input').attr('disabled', false);
	}else{
		$('.quotaPop .custom_distr').addClass('custom_distr_style');
		$('.quotaPop .custom_distr input').attr('disabled', true);
	}

	$('.quotaPop .author_type').val(quota_type);
})

// 编辑授权--改变授权
$(document).on('change', '.quotaPop .author_type', function(){
	var val = $(this).val();
	if(val == '2'){
		$('.quotaPop .custom_distr').removeClass('custom_distr_style');
		$('.quotaPop .custom_distr input').attr('disabled', false);
	}else{
		$('.quotaPop .custom_distr').addClass('custom_distr_style');
		$('.quotaPop .custom_distr input').attr('disabled', true);
	}
})

function sureAuthorButton(){
	var w_alloc, l_alloc, 
		type = $('.author_type').val(),
		id = $('.quotaPop').attr('taskid');
	
	if(type == '2'){
		w_alloc = $('input[name=windows]').val();
		l_alloc = $('input[name=linux]').val();
	}else{
		w_alloc = '';
		l_alloc = '';
	}
	licTypeUpdate(type,id,w_alloc,l_alloc,'');
}
//调整页面内元素高度
var mainlefth = parent.$("#iframe #mainFrame").height();

$(".main .table").css({
	height: mainlefth - 230
});

window.onresize = function() {
	var mainlefth = parent.$("#iframe #mainFrame").height();

	$(".main .table").css({
		height: mainlefth - 230
	});

}