//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a[name='leakrepairP.html']").addClass("current");
parent.$(".nav .container a[name='leakrepairP.html']").siblings().removeClass("current");
parent.$(".footer").show();

document.cookie = 'page=leakrepairP.html';
//按钮样式

$(".bu").click(function() {
	$(this).siblings(".bu").removeClass("current");
	$(this).addClass("current");
});

//下拉列表
$("#selectVD").change(function() {
	leakrepairPatch();
})
//补丁编号（名称）搜索
function searchList() {
	leakrepairPatch();
}

$(".closeWW").click(function() {
	$(".shadee").hide();
	$(this).parent().parent().hide();
});
//关闭弹层
$(".closeW").click(function() {
	$(".shade").hide();
	$(this).parent().parent().hide();
	parent.$(".topshade").hide();

});


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
	leakrepairPatch();
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
	leakrepairPatch(start);
})
//补丁列表
leakrepairPatch();
var ajaxtable = null;

function leakrepairPatch(start) {
	repairIdarr = [];
	if(ajaxtable) {
		ajaxtable.abort();
	}
	var dataa = {};
	if(start == undefined) {
		start = 0;
	}else{
		start = start;
	}
	var kbid = trim($("#searchKey").val());
	var level = parseInt($('#selectVD option:checked').val());
	var dataa = {
		"groupby": "patch",
		"view": {
			"begin": start,
			"count": numperpage
		},
		"filter": {
			"level": level,
			"kbid": kbid
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
	$('.verticalMiddle').attr('checked', false);
//	$(".table table #tableAlign").siblings('tr').html('');
	$(".table").append("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
	ajaxtable =
		$.ajax({
			url: '/mgr/leakrepair/_list',
			data: JSON.stringify(dataa),
			type: 'POST',
			contentType: 'text/plain',
			headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
			error: function(xhr, textStatus, errorThrown) {
				if(xhr.status == 401) {
					parent.window.location.href = '/';
				} else {

				}

			},
			success: function(data) {
				$(".table div").remove();
				if(data.errno == '0') {
					var list = data.data.list;
					var total = data.data.view.total;
					var pages = Math.ceil(total / numperpage);
					var table = "<table>";
					var level = "";
					table += "<tr id='tableAlign'>"
            		table += "<td width='4%'><input type='checkbox' class='verticalMiddle' onclick='selectAll(this)'></td>"
            		table += "<td width='10%'>补丁编号</td>"
            		table += "<td width='50%'>补丁描述</td>"
            		table += "<td width='10%'>补丁类型</td>"
                	table += "<td width='15%'>发布时间</td>"
                    table += "</tr>"
					for(i = 0; i < list.length; i++) {
						if(list[i].level == '0') {
							level = '高危补丁';
						} else if(list[i].level == '1') {
							level = '功能更新';
						} else {
							level = "";
						}
						table += "<tr taskid=" + list[i].id + ">";
						if(isInArray(repairIdarr,parseInt(list[i].id))==true){
							table+="<td><input type='checkbox'  class='select select-repair verticalMiddle' value='" + list[i].id + "' checked ></td>";
						}else{
							table+="<td><input type='checkbox'  class='select select-repair verticalMiddle' value='" + list[i].id + "'></td>";
						}
						table += "<td><span>KB" + list[i].kbid + "</span></td>";
						table += "<td><span class='filePath loophtWidth' style='width:550px;' title='" + list[i].desc + "'>" + list[i].desc + "</span></td>";
						table += "<td><span>" + level + "</span></td>";
						table += "<td><span>" + getLocalTime3(list[i].pub_time) + "</span></td>";
						table += "</tr>";
					}
					table += "</table>";
					if(list.length == 0) {
						$(".tableContainer .table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
					} else {
						$(".tableContainer .table").html(table);
					}
					$(".tableContainer .selectAll-repair").attr('total',total);
					$(".tableContainer .clearfloat").remove();
					$(".tableContainer .tcdPageCode").remove();
					$(".tableContainer .totalPages").remove();
					$(".tableContainer .numperpage").remove();
					$(".tableContainer").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 " + total + " 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><a style='font-size:12px;float:right;line-height:54px;padding-right:20px;color:#6a6c6e' class='numperpage'>每页<input type='text' id='numperpageinput' value=" + numperpage + " style='font-size:12px;width:40px;height:24px;margin:0 4px;vertical-align:middle;padding:0 10px;'>条</a><div class='clear clearfloat'></div>");
					createPageFun(pages, dataa);
				}
			}
		});

}

//分页

function createPageFun(pages, dataa) {
	var current = (dataa.view.begin/dataa.view.count) + 1;
	$(".tableContainer .tcdPageCode").createPage({
		pageCount: pages,
		current: parseInt(current),
		backFn: function(pageIndex) {
			dataa.view.begin = (pageIndex - 1) * numperpage;
//			$(".table table #tableAlign").siblings('tr').html('');
			$(".table").append("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
			
			$.ajax({
				url: '/mgr/leakrepair/_list',
				data: JSON.stringify(dataa),
				type: 'POST',
				contentType: 'text/plain',
				headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
				error: function(xhr, textStatus, errorThrown) {
				if(xhr.status == 401) {
					parent.window.location.href = '/';
				} else {

				}

			},
				success: function(data) {
					$(".table>div").remove();
					var list = data.data.list;
					var table = "<table>";
					table += "<tr id='tableAlign'>"
            		table += "<td width='4%'><input type='checkbox' class='verticalMiddle' onclick='selectAll(this)'></td>"
            		table += "<td width='10%'>补丁编号</td>"
            		table += "<td width='50%'>补丁描述</td>"
            		table += "<td width='10%'>补丁类型</td>"
                	table += "<td width='15%'>发布时间</td>"
                    table += "</tr>"
					for(i = 0; i < list.length; i++) {
						if(list[i].level == '0') {
							level = '高危补丁';
						} else if(list[i].level == '1') {
							level = '功能更新';
						} else {
							level = "";
						}
						table += "<tr taskid=" + list[i].id + ">";
						if(isInArray(repairIdarr,parseInt(list[i].id))==true){
							table+="<td><input type='checkbox'  class='select select-repair verticalMiddle' value='" + list[i].id + "' checked ></td>";
						}else{
							table+="<td><input type='checkbox'  class='select select-repair verticalMiddle' value='" + list[i].id + "'></td>";
						}
						table += "<td><span>KB" + list[i].kbid + "</span></td>";
						table += "<td><span class='filePath loophtWidth' style='width:550px;' title='" + list[i].desc + "'>" + list[i].desc + "</span></td>";
						table += "<td><span>" + level + "</span></td>";
						table += "<td><span>" + getLocalTime3(list[i].pub_time) + "</span></td>";
						table += "</tr>";
					}
					table += "</table>";
					$(".tableContainer .table").html(table);
					
				},
			});

		}
	})
}

var repairIdarr = [];
//将选中的checkbox所对应的id传入数组
$(document).on('change', '.select-repair', function() {
	if($(this).is(":checked")) {
		repairIdarr.push(parseInt($(this).val()));
	} else {
		repairIdarr.splice(jQuery.inArray(parseInt($(this).val()), repairIdarr), 1);
	}
	//	若列表checkbox全部勾选,则thcheckbox勾选
	if($(".table td .select-repair:checked").length == ($(".table td .select-repair").length)) {
		$('.tableth .verticalMiddle').prop('checked', true);
	} else {
		$('.tableth .verticalMiddle').prop('checked', false);
	}
})
$(document).on('click','.selectAll-repair',function(){
		var total = $(this).attr('total');
		var kbid = trim($("#searchKey").val());
		var level = parseInt($('#selectVD option:checked').val());
		var dataa = {
			"groupby": "patch",
			"filter": {
				"level": level,
				"kbid": kbid
			},
			"view": {
				"begin": 0,
				"count": parseInt(total)
			},
			"filter": {
				"level": level,
				"kbid": kbid
			}
			
		};
		
		$.ajax({
			url: '/mgr/leakrepair/_list',
			data: JSON.stringify(dataa),
			type: 'POST',
			contentType: 'text/plain',
			headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
			error: function(xhr, textStatus, errorThrown) {
				if(xhr.status == 401) {
					parent.window.location.href = '/';
				} else {

				}

			},
			success: function(data) {
				var list = data.data.list;

				if($('.selectAll-repair').prop('checked') == true) {
					$('.select-repair').prop('checked',true);
					for (var i = 0; i < list.length; i++) {
						if(isInArray(repairIdarr,parseInt(list[i].id))==false){
							repairIdarr.push(parseInt(list[i].id));	
						}
						
					}
				}else{
					$('.select-repair').prop('checked',false);
					for (var i = 0; i < list.length; i++) {
						if(isInArray(repairIdarr,parseInt(list[i].id))==true){
							repairIdarr.splice(jQuery.inArray(parseInt(list[i].id),repairIdarr),1);
						}
						
					}
				}
			}
		})
	
})
//忽略补丁操作
function ignoreFun() {
	if($(".table td .select-repair:checked").length == 0) {
		$(".delayHide").show();
		$(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 请选择补丁!");
		setTimeout(function() {
			$(".delayHide").hide()
		}, 2000);
	} else {

		var dataa = {
			"id": repairIdarr,
			"exclude": true
		};
		$.ajax({
			url: '/mgr/leakrepair/_patchex',
			data: JSON.stringify(dataa),
			type: 'post',
			contentType: 'text/plain',
			headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
			error: function(xhr, textStatus, errorThrown) {
				if(xhr.status == 401) {
					parent.window.location.href = '/';
				} else {

				}

			},
			success: function(data) {
				if(data.errno == 0) {
					$(".delayHideS").show();
					$(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> 操作成功</span>");
					setTimeout(function() {
						$(".delayHideS").hide()
					}, 2000);
					leakrepairPatch();
				}
			}
		});
	}

}
//已忽略终端排序


$(document).on('click','.ignoredTPop .tableth th.th-ordery',function(){
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
	var currentPage = $(this).parents('.ignoredTPop').find('.tcdPageCode span.current').text();
	var currentNum = 9;
	var start = (parseInt(currentPage) - 1) * 9;
	ignoredTPop(start);
})
// 弹出已忽略补丁
function ignoredTPop() {
	repairIdarrPop = [];
	var numperpage = 9;
	var start = 0;
	$(".ignoredTPop").show();
	shade();
	$('.ignoredTPop input[type=checkbox]').attr('checked', false);
	var dataa = {
		"groupby": "patch",
		"view": {
			"begin": start,
			"count": numperpage
		},
		"filter": {
			"exclude": true
		}
	};
var type = $('.ignoredTPop .tableth th.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.ignoredTPop .tableth th.th-ordery.th-ordery-current').attr('class');
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
	$.ajax({
		url: '/mgr/leakrepair/_list',
		data: JSON.stringify(dataa),
		type: 'POST',
		contentType: 'text/plain',
		headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
		error: function(xhr, textStatus, errorThrown) {
			if(xhr.status == 401) {
				parent.window.location.href = '/';
			} else {

			}

		},
		success: function(data) {
			var table = "<table>";
			var list = data.data.list;
			var totalnum = data.data.view.total;
			var pages = Math.ceil(totalnum / numperpage);

			table += "<tr id='tableAlign'>";
			table += "<td width='8%'><input type='checkbox' onclick='selectAllpop(this)'></td>";
			table += "<td width='10%'>补丁编号</td>";
			table += "<td width='35%'>补丁描述</td>";
			table += "<td width='10%'>补丁类型</td>";
			table += "<td width='20%'>发布时间</td>";
			table += "</tr>";
			for(i = 0; i < list.length; i++) {
				if(list[i].level == '0') {
					level = '高危补丁';
				} else if(list[i].level == '1') {
					level = '功能更新';
				} else {
					level = "";
				}
				table += "<tr taskid=" + list[i].id + ">";
				if(isInArray(repairIdarrPop,parseInt(list[i].id))==true){
					table+="<td><input type='checkbox'  class='select select-repair-pop verticalMiddle' value='" + list[i].id + "' checked ></td>";
				}else{
					table+="<td><input type='checkbox'  class='select select-repair-pop verticalMiddle' value='" + list[i].id + "'></td>";
				}
				table += "<td><span>KB" + list[i].kbid + "</span></td>";
				table += "<td><span class='filePath loophtWidth' title='" + list[i].desc + "'>" + list[i].desc + "</span></td>";
				table += "<td><span>" + level + "</span></td>";
				table += "<td><span>" + getLocalTime3(list[i].pub_time) + "</span></td>";
				table += "</tr>";
			}
			table += "</table>";
			if(list.length == 0) {
				$(".ignoredTPop .ignoredTTable").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
			} else {
				$(".ignoredTPop .ignoredTTable").html(table);
			}
			$(".ignoredTPop .tableth th input[type=checkbox]").attr('total',totalnum)
			
			// 分页
			$(".ignoredTPop .clearfloat").remove();
			$(".ignoredTPop .tcdPageCode").remove();
			$(".ignoredTPop .totalPages").remove();
			$(".ignoredTPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 " + totalnum + " 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
			$(".ignoredTPop .tcdPageCode").createPage({
				pageCount: pages,
				current: 1,
				backFn: function(pageIndex) {
					start = (pageIndex - 1) * numperpage;
					dataa = {
						"groupby": "patch",
						"view": {
							"begin": start,
							"count": numperpage
						},
						"filter": {
							"exclude": true
						}
					};
					$.ajax({
						url: '/mgr/leakrepair/_list',
						data: JSON.stringify(dataa),
						type: 'POST',
						contentType: 'text/plain',
						headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
						error: function(xhr, textStatus, errorThrown) {
							alert(xhr.status + "  " + textStatus + "  " + errorThrown);
						},
						success: function(data) {
							var html = "<table>";
							var list = data.data.list;
							html += "<tr id='tableAlign'>";
							html += "<td width='8%'><input type='checkbox' onclick='selectAllpop(this)'></td>";
							html += "<td width='10%'>补丁编号</td>";
							html += "<td width='35%'>补丁描述</td>";
							html += "<td width='10%'>补丁类型</td>";
							html += "<td width='20%'>发布时间</td>";
							html += "</tr>";
							for(i = 0; i < list.length; i++) {
								if(list[i].level == '0') {
									level = '高危补丁';
								} else if(list[i].level == '1') {
									level = '功能更新';
								} else {
									level = "";
								}
								html += "<tr taskid=" + list[i].id + ">";
								if(isInArray(repairIdarrPop,parseInt(list[i].id))==true){
									html+="<td><input type='checkbox'  class='select select-repair-pop verticalMiddle' value='" + list[i].id + "' checked ></td>";
								}else{
									html+="<td><input type='checkbox'  class='select select-repair-pop verticalMiddle' value='" + list[i].id + "'></td>";
								}
								html += "<td><span>KB" + list[i].kbid + "</span></td>";
								html += "<td><span class='filePath loophtWidth' title='" + list[i].desc + "'>" + list[i].desc + "</span></td>";
								html += "<td><span>" + level + "</span></td>";
								html += "<td><span>" + getLocalTime3(list[i].pub_time) + "</span></td>";
								html += "</tr>";
							}
							html += "</table>";
							$(".ignoredTPop .ignoredTTable table").html(' ');
							$(".ignoredTPop .ignoredTTable table").html(html);
						}
					});
				}
			})

		}
	});
}
var repairIdarrPop = [];
//将选中的checkbox所对应的id传入数组
$(document).on('change', '.select-repair-pop', function() {
	if($(this).is(":checked")) {
		repairIdarrPop.push(parseInt($(this).val()));
	} else {
		repairIdarrPop.splice(jQuery.inArray(parseInt($(this).val()), repairIdarrPop), 1);
	}
	//	若列表checkbox全部勾选,则thcheckbox勾选
	if($(".pop td .select-repair-pop:checked").length == ($(".pop td .select-repair-pop").length)) {
		$('.pop .tableth .topCheckbox').prop('checked', true);
	} else {
		$('.pop .tableth .topCheckbox').prop('checked', false);
	}
})

function selectAllpop(a) {
	var total = $(a).attr('total');
	var dataa = {
		"groupby": "patch",
		"view": {
			"begin": 0,
			"count": parseInt(total)
		},
		"filter": {
			"exclude": true
		}
	};

	$.ajax({
		url: '/mgr/leakrepair/_list',
		data: JSON.stringify(dataa),
		type: 'POST',
		contentType: 'text/plain',
		headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
		error: function(xhr, textStatus, errorThrown) {
			if(xhr.status == 401) {
				parent.window.location.href = '/';
			} else {

			}

		},
		success: function(data) {
			var table = "";
			var list = data.data.list;
			if($(".selectAll-repair-pop").is(":checked")){
				$(".select-repair-pop").prop('checked',true);
				for (var i = 0; i < list.length; i++) {
					if(isInArray(repairIdarrPop,parseInt(list[i].id))==false){
						repairIdarrPop.push(parseInt(list[i].id));	
					}
					
				};
			}else{
				$(".select-repair-pop").prop('checked',false);
				for (var i = 0; i < list.length; i++) {
					if(isInArray(repairIdarrPop,parseInt(list[i].id))==true){
						repairIdarrPop.splice(jQuery.inArray(parseInt(list[i].id),repairIdarrPop),1);
					}
					
				};
			}
		}
	})

}
//已忽略补丁弹窗--取消忽略
function ignorePopFun() {
	if($(".pop td .select-repair-pop:checked").length == 0) {
		$(".delayHide").show();
		$(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 请选择补丁!");
		setTimeout(function() {
			$(".delayHide").hide()
		}, 2000);
	} else {
		var dataa = {
			"id": repairIdarrPop,
			"exclude": false
		};
		$.ajax({
			url: '/mgr/leakrepair/_patchex',
			data: JSON.stringify(dataa),
			type: 'post',
			contentType: 'text/plain',
			headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
			error: function(xhr, textStatus, errorThrown) {
				if(xhr.status == 401) {
					parent.window.location.href = '/';
				} else {

				}

			},
			success: function(data) {
				if(data.errno == 0) {
					$(".delayHideS").show();
					$(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> 操作成功</span>");
					setTimeout(function() {
						$(".delayHideS").hide()
					}, 2000);
					ignoredTPop();
					leakrepairPatch();
				}
			}
		});
	}

}
//调整页面内元素高度
var mainlefth = parent.$("#iframe #mainFrame").height();

$(".main .table").css({
	height: mainlefth - 347
});

window.onresize = function() {
	var mainlefth = parent.$("#iframe #mainFrame").height();

	$(".main .table").css({
		height: mainlefth - 347
	});

}