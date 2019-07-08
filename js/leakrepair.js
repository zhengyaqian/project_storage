//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a[name='leakrepair.html']").addClass("current");
parent.$(".nav .container a[name='leakrepair.html']").siblings().removeClass("current");
parent.$(".footer").show();
document.cookie = 'page=leakrepair.html';
//按钮样式

$(".bu").click(function() {
	$(this).siblings(".bu").removeClass("current");
	$(this).addClass("current");
});

//下拉列表
$("#selectVD").change(function() {
	leakrepairClient();
})
//终端名称搜索
function searchList() {
	leakrepairClient();
}
//关闭遮罩和弹窗
function hideButton(a) {
	$(".shade").hide();
	parent.$(".topshade").hide();
	$(a).parents(".pop").hide();
}

grouplist();

function grouplist() {
	//加载分组列表
	$.ajax({
		url: '/mgr/group/_dict',
		dataType: 'json',
		data: {},
		async: true,
		type: 'GET',
		headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
		error: function(xhr, textStatus, errorThrown) {
			if(xhr.status == 401) {
				parent.window.location.href = '/';
			} else {

			}

		},
		success: function(data) {

			var list = data.data.list;
			var html = "";
			html += "<option groupid='0'>全部分组</option>";

			for(i = 0; i < list.length; i++) {
				html += "<option groupid=" + list[i].group_id + ">" + safeStr(list[i].group_name) + "</option>";
			}
			$("#selectVD").html(html);
		}
	});
}

// 漏洞修复设置弹层
$(".functionButtonsBlock .setButton").click(function(event) {
	shade();
	$(".loopholeRSPop").show();
	$.ajax({
		url: '/mgr/sysconf/_leakrepair',
		type: 'GET',
		contentType: 'text/plain',
		headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
		success: function(data) {
			if(data.data.boot_scan.enable == true) {
				$('.loopholeRSPop input[name=loopS1]').attr('checked', 'checked');
				$('.loopholeRSPop input[name=loopS2]').removeAttr('disabled');
			}else{
				$('.loopholeRSPop input[name=loopS2]').attr('checked', false);
				$('.loopholeRSPop input[name=loopS2]').attr('disabled', 'disabled');
			}

			if(data.data.boot_scan.repair == true) {
				$('.loopholeRSPop input[name=loopS2]').attr('checked', 'checked')
			}
			if(data.data.save_patch == true) {
				$('.loopholeRSPop input[name=loopS3]').attr('checked', 'checked')
			}

			$('.loopholeRSPop #filete').val(data.data.save_dir);
			if(data.data.sysupdate_disable == true) {
				$('.loopholeRSPop input[name=loopS4]').attr('checked', 'checked')
			}

		}
	})
});
$(document).on('click','.loopholeRSPop input[name=loopS1]',function(){
	if($(this).prop('checked') == true){
		$('.loopholeRSPop input[name=loopS2]').removeAttr('disabled');
	}else{
		$('.loopholeRSPop input[name=loopS2]').attr('disabled', 'disabled');
	}
})


//更新设置弹层
function saveFastSKC(a) {
	if($('.loopholeRSPop input[name=loopS1]').prop('checked') == true) {
		var enable = true;
	} else {
		var enable = false;
	}

	if($('.loopholeRSPop input[name=loopS2]').prop('checked') == true) {
		var repair = true;
	} else {
		var repair = false;
	}

	if($('.loopholeRSPop input[name=loopS3]').prop('checked') == true) {
		var save_patch = true;
	} else {
		var save_patch = false;
	}
	var save_dir = $('.loopholeRSPop .fileop').val();
	if($('.loopholeRSPop input[name=loopS4]').prop('checked') == true) {
		var sysupdate_disable = true;
	} else {
		var sysupdate_disable = false;
	}
	var dataa = {
		"boot_scan": {
			"repair": repair,
			"enable": enable
		},
		"save_patch": save_patch,
		"save_dir": save_dir,
		"sysupdate_disable": sysupdate_disable
	}
	$.ajax({
		type: "POST",
		url: "/mgr/sysconf/_leakrepair",
		data: JSON.stringify(dataa),
		async: true,
		contentType: 'text/plain',
		headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
		error: function(xhr, textStatus, errorThrown) {
			if(xhr.status == 401) {
				parent.window.location.href = '/';
			} else {

			}
		},
		success: function(data) {
			if(data.errno == '0') {
				// 更新成功提示
				$(".delayHideS").show();
				$(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> 操作成功</span>");
				setTimeout(function() {
					$(".delayHideS").hide()
				}, 2000);
				hideButton(a);
				leakrepairClient();
			} else {
				$(".delayHideS").show();
				$(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'>操作失败</span>");
				setTimeout(function() {
					$(".delayHideS").hide()
				}, 2000);
			}
		}
	});
}
//最新任务
$(".uninstallMB").click(function() {
	shade();
	$(".recentTaskPop").show();
	recentTaskAjax();
})
// 最新任务列表ajax
function recentTaskAjax() {
	$.ajax({
		url: '/mgr/task/_recent?type=leakrepair_repair',
		data: {},
		type: 'GET',
		contentType: 'text/plain',
		headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
		success: function(data) {
			var list = data.data.list;

			var html = "";
			for(var i = 0; i < list.length; i++) {
				var createtime = list[i].create_time;
				createtime = getLocalTime(createtime);
				html += "<div class='list' taskid='" + list[i].task_id + "'>";
				html += "<span class='td cursor firsttd' style='width:200px;'>" + safeStr(createtime) + "</span>";

				html += "<span class='td cursor'>" + list[i].client_done + "/" + list[i].client_all + "</span>";
				if(list[i].status == 0) {
					html += "<span class='td cursor status' status='" + list[i].status + "'>正在分发</span>";
					html += "<span class='td cursor'><a class='cursor underline' onclick='stopTask(" + list[i].task_id + ")'>终止任务</a></span>";
				} else {
					html += "<span class='td cursor status' status='" + list[i].status + "'>分发结束</span>";
					html += "<span class='td cursor'><a class='cursor underline' style='color:#ccc;'>终止任务</a></span>";
				}
				html += "<a onclick='showTaskTer(this)' class='showTaskTerIcon verticalMiddle cursor'></a>";
				html += "</div>";
				html += "<div class='table'>";
				html += "<table>";
				html += "<tr class='th'>";
				html += "<th width='25%'>终端分组</th>";
				html += "<th width='25%'>终端名称</th>";
				html += "<th width='16%'>状态</th>";
				html += "<th width='20%'>备注</th>";
				html += "<th width='14%'>操作</th>";
				html += "</tr>";
				html += "</table>";
				html += "</div>";

			};
			$(".recentTaskPop .content .container").html(html);
			if(list.length == 0) {
				$(".recentTaskPop .content .container").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
			} else {
				$(".recentTaskPop .content .container").html(html);
			}
		}
	});
}
//终止任务
function stopTask(a) {
	var id = a;
	$.ajax({
		url: '/mgr/task/_ctrl?id=' + id + '&type=stop',
		data: {},
		type: 'get',
		contentType: 'text/plain',
		headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
		success: function(data) {
			if(data.errno == 0) {
				recentTaskAjax();
			}
		}
	})
}

//展开或关闭任务相关终端模块
function showTaskTer(a) {
	if($(a).parent().next().is(":hidden")) {
		$(a).parent().next().siblings(".table").hide();
		$(a).parent().children(".showTaskTerIcon").css({
			background: "url(images/task2.png)",
			backgroundPosition: "-18px"
		});
		$(a).parent().siblings('.list').children(".showTaskTerIcon").css({
			background: "url(images/task1.png)"
		});
		$(a).parent().next().slideDown(200);
		var taskid = parseInt($(a).parent().attr("taskid"));
		dataa = {
			"taskid": taskid,
			"view": {
				"begin": 0,
				"count": 20
			}
		};
		$.ajax({
			url: '/mgr/task/_clnt',
			data: JSON.stringify(dataa),
			type: 'POST',
			contentType: 'text/plain',
			headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
			success: function(data) {
				var html = "";
				var list = data.data.list;
				var finsh_text ="";
				html += "<table>";
				html += "<tr class='th'>";
				html += "<th width='25%'>终端分组</th>";
				html += "<th width='25%'>终端名称</th>";
				html += "<th width='16%'>状态</th>";
				html += "<th width='20%'>备注</th>";

				html += "</tr>";
				for(var i = 0; i < list.length; i++) {
					html += "<tr>";
					if(list[i].groupname == "") {
						html += "<td>(已删除终端)</td>";
					} else {
						html += "<td>" + safeStr(list[i].groupname) + "</td>";
					}
                    html+="<td><span style='width:150px;' title='"+safeStr(list[i].hostname)+"' class='filePath'>"+safeStr(list[i].hostname)+"</span></td>";
				
					if(list[i].status==0){
						html+="<td>未响应</td>";
						html+="<td>任务尚未被接受</td>";
				}else if(list[i].status==1){
						html+="<td>正在执行</td>";
						html+="<td>任务正在执行</td>";
				}else if(list[i].status==2){
					if(list[i].message == 'completed'){
							finsh_text = '任务完成'
					}else if(list[i].message == 'conflict'){
							finsh_text = '任务冲突'
					}else if(list[i].message == 'timeout'){
							finsh_text = '任务超时'
					}else if(list[i].message == 'unsupported'){
							finsh_text = '终端不支持'
					}else if(list[i].message == 'failed'){
							finsh_text = '执行失败'
					}else if(list[i].message == 'refused'){
							finsh_text = '用户拒绝'
					}else{
							finsh_text = list[i].message
					}
					html+="<td>任务完成</td>";
					html+="<td>" + finsh_text + "</td>";
				}else{
						html+="<td>终端异常</td>";
						html+="<td>终端服务异常，无法接受任务</td>";
				}
					html += "</tr>";
				};
				html += "</table>";
				// html+="<a class='seeMore'>查看更多</a>";
				$(a).parent().next().html(html);

			}
		});

	} else {
		$(a).parent().next().hide();
		$(a).parent().children(".showTaskTerIcon").css({
			background: "url(images/task1.png)",
			backgroundPosition: "-18px"
		});
	}

};
var repairIdarrPop = [];
//将选中的checkbox所对应的id传入数组
$(document).on('click', '.select-repair-pop', function() {
	if($(this).is(":checked")) {
		repairIdarrPop.push(parseInt($(this).val()));
	} else {
		repairIdarrPop.splice(jQuery.inArray(parseInt($(this).val()), repairIdarrPop), 1);
	}

	//	若列表checkbox全部勾选,则thcheckbox勾选
	if($(".pop td .select-repair-pop:checked").length == ($(".pop  td .select-repair-pop").length)) {
		$('.pop .tableth .topCheckbox').prop('checked', true);
	} else {
		$('.pop .tableth .topCheckbox').prop('checked', false);
	}
})

function selectAllpop(a) {
	var total = $(a).attr('total');
	var dataa = {};
	if($(a).attr('name') == 'detail'){
		dataa = {
			"groupby": "patch",
			"view": {
				"begin": 0,
				"count": parseInt(total)
			}
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
				var table = "";
				var list = data.data.list;
				if($(".selectAll-repair-pop").is(":checked")){
					$(".select-repair-pop").prop('checked',true);
					for (var i = 0; i < list.length; i++) {
						if(isInArray(repairIdarrPop,list[i].id)==false){
							repairIdarrPop.push(parseInt(list[i].id));	
						}
						
					};
				}else{
					$(".select-repair-pop").prop('checked',false);
					for (var i = 0; i < list.length; i++) {
						if(isInArray(repairIdarrPop,list[i].id)==true){
							repairIdarrPop.splice(jQuery.inArray(list[i].id,repairIdarrPop),1);
						}
						
					};
				}
			}
		})
	}else{
		dataa = {
			"groupby": "client",
			"view": {
				"begin": 0,
				"count": parseInt(total)
			},
			"filter": {
				"exclude": true
			}
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
			var table = "";
			var list = data.data.list;
			if($(".selectAll-repair-pop").is(":checked")){
				$(".select-repair-pop").prop('checked',true);
				for (var i = 0; i < list.length; i++) {
					if(isInArray(repairIdarrPop,list[i].client_id)==false){
						repairIdarrPop.push(parseInt(list[i].client_id));	
					}
					
				};
			}else{
				$(".select-repair-pop").prop('checked',false);
				for (var i = 0; i < list.length; i++) {
					if(isInArray(repairIdarrPop,list[i].client_id)==true){
						repairIdarrPop.splice(jQuery.inArray(list[i].client_id,repairIdarrPop),1);
					}
					
				};
			}
		}
	})
	}

}
// 弹出已忽略终端
function ignoredTPop() {
	repairIdarrPop = [];
	var detailnumperpage = 9;
	var start = 0;
	$(".ignoredTPop").show();
	shade();
	$('.ignoredTPop input[type=checkbox]').attr('checked', false);
	var dataa = {
		"groupby": "client",
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
			if(xhr.status == 401) {
				parent.window.location.href = '/';
			} else {

			}

		},
		success: function(data) {
			var html = "<table>";
			var list = data.data.list;
			var totalnum = data.data.view.total;
			var pages = Math.ceil(totalnum / detailnumperpage);

			html += "<tr id='tableAlign'>";
			html += "<td width='10%'><input type='checkbox' onclick='selectAllpop(this)'></td>";
			html += "<td width='50%'>终端名称</td>";
			html += "<td width='40%'>终端分组</td>";
			html += "</tr>";
			for(i = 0; i < list.length; i++) {
				html += "<tr taskid=" + "ssss" + ">";
				if(isInArray(repairIdarrPop,parseInt(list[i].client_id))==true){
					html+="<td><input type='checkbox'  class='select select-repair-pop verticalMiddle' value='" + list[i].client_id + "' checked ></td>";
				}else{
					html+="<td><input type='checkbox'  class='select select-repair-pop verticalMiddle' value='" + list[i].client_id + "'></td>";
				}
                html+="<td><span style='width:300px;' class='filePath' title='"+safeStr(list[i].hostname)+"'>"+safeStr(list[i].hostname)+"</span></td>";
				html += "<td><span>" + safeStr(list[i].group_name) + "</span></td>";
				html += "</tr>";
			}
			html += "</table>";
			if(list.length == 0) {
				$(".ignoredTPop .ignoredTTable").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
			} else {
				$(".ignoredTPop .ignoredTTable").html(html);
			}
			$(".ignoredTPop .tableth th input[type=checkbox]").attr('total',totalnum);
			// 分页
			$(".ignoredTPop .clearfloat").remove();
			$(".ignoredTPop .tcdPageCode").remove();
			$(".ignoredTPop .totalPages").remove();
			$(".ignoredTPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 " + totalnum + " 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
			$(".ignoredTPop .tcdPageCode").createPage({
				pageCount: pages,
				current: 1,
				backFn: function(pageIndex) {
					start = (pageIndex - 1) * detailnumperpage;
					dataa = {
						"groupby": "client",
						"view": {
							"begin": start,
							"count": detailnumperpage
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
							html += "<td width='10%'><input type='checkbox'></td>";
							html += "<td width='50%'>终端名称</td>";
							html += "<td width='40%'>终端分组</td>";
							html += "</tr>";
							for(i = 0; i < list.length; i++) {
								html += "<tr taskid=" + "ssss" + ">";
								if(isInArray(repairIdarrPop,parseInt(list[i].client_id))==true){
									html+="<td><input type='checkbox'  class='select select-repair-pop verticalMiddle' value='" + list[i].client_id + "' checked ></td>";
								}else{
									html+="<td><input type='checkbox'  class='select select-repair-pop verticalMiddle' value='" + list[i].client_id + "'></td>";
								}
                html+="<td><span style='width:300px;' class='filePath' title='"+safeStr(list[i].hostname)+"'>"+safeStr(list[i].hostname)+"</span></td>";
								html += "<td><span>" + safeStr(list[i].group_name) + "</span></td>";
								html += "</tr>";
							}
							html += "</table>";
							$(".ignoredTPop .ignoredTTable").html(html);
							
						}
					});
				}
			})

		}
	});
}
//已忽略终端弹层--取消忽略
function cancelIgnorePopFun() {
	if($(".pop  td .select-repair-pop:checked").length == 0) {
		$(".delayHide").show();
		$(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 请选择终端!");
		setTimeout(function() {
			$(".delayHide").hide()
		}, 2000);
	} else {
		var dataa = {
			"clients": repairIdarrPop,
			"exclude": false
		};
		$.ajax({
			url: '/mgr/leakrepair/_clientex',
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
					leakrepairClient();
				}
			}
		});
	}

}
var detailsIdarrPop = [];
//将选中的checkbox所对应的id传入数组
$(document).on('click', '.select-repair-pop', function() {
	if($(this).is(":checked")) {
		detailsIdarrPop.push(parseInt($(this).val()));
	} else {
		detailsIdarrPop.splice(jQuery.inArray(parseInt($(this).val()), detailsIdarrPop), 1);
	}

	//	若列表checkbox全部勾选,则thcheckbox勾选
	if($(".pop td .select-repair-pop:checked").length == ($(".pop  td .select-repair-pop").length)) {
		$('.pop .tableth .topCheckbox').prop('checked', true);
	} else {
		$('.pop .tableth .topCheckbox').prop('checked', false);
	}
})

function selectAllDetailspop(a) {
	
	detailsIdarrPop = [];
	var total = $(a).attr('total');
	var type = $('.ignoreBtn').text();
	var clientid = $('.ignoreBtn').attr('taskid');
	var level = $('.ignoreBtn').attr('level');
	var dataa = {};
	if(type == "取消忽略") {
		dataa = {
			"groupby": "patch",
			"filter": {
				"client_id": parseInt(clientid),
				"exclude": true
			},
			"view": {
				"begin": 0,
				"count": parseInt(total)
			}
		};
	} else {
		dataa = {
			"groupby": "patch",
			"filter": {
				"client_id": parseInt(clientid),
				"level": parseInt(level)
			},
			"view": {
				"begin": 0,
				"count": parseInt(total)
			}
		};
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
			var table = "";
			var list = data.data.list;
			if($(".selectAll-repair-pop").is(":checked")){
				$(".select-repair-pop").prop('checked',true);
				for (var i = 0; i < list.length; i++) {
					if(isInArray(detailsIdarrPop,list[i].id)==false){
						detailsIdarrPop.push(parseInt(list[i].id));	
					}
					
				};
			}else{
				$(".select-repair-pop").prop('checked',false);
				for (var i = 0; i < list.length; i++) {
					if(isInArray(detailsIdarrPop,list[i].id)==true){
						detailsIdarrPop.splice(jQuery.inArray(list[i].id,detailsIdarrPop),1);
					}
					
				};
			}
		}
	})
	

}

//漏洞详情排序


$(document).on('click','.taskDetailPop .tableth th.th-ordery',function(){
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
	var currentPage = $(this).parents('.taskDetailPop').find('.tcdPageCode span.current').text();
	var currentNum = 9;
	var start = (parseInt(currentPage) - 1) * 9;
	taskDetailPop(start);
})

$(document).on('click','.tableContainer .taskDetailBtn',function(){
	detailsIdarrPop = [];
	var level = $(this).attr('level');
	var exclude = $(this).attr('exclude');
	$('.taskDetailPop .tableth th.th-ordery').removeClass().addClass('th-ordery');
	var clientid = $(this).parents("tr").attr('taskid');
	var hostname = $(this).parents("td").siblings().eq(1).find('span').html();
if($(this).parent("td").index() == 3) {
		$(".taskDetailPop .describe").html("以下漏洞可能会被病毒利用，危害你的电脑<a class='charaButton floatR greenfont underline cursor ignoreBtn' onclick='ignorePopFun(this," + clientid + ")'>忽略</a>");
		$(".taskDetailPop .taskInf").html("高危漏洞 - <span class='filePath' title='"+hostname+"'>" + hostname + "</span>");
		$(".taskDetailPop .ignoreBtn").attr('index', '3');
		$(".taskDetailPop .ignoreBtn").attr('level', level);
		$(".taskDetailPop .ignoreBtn").attr('indexP', $(this).parents("tr").index());
	} else if($(this).parent("td").index() == 4) {
		$(".taskDetailPop .describe").html("以下漏洞为功能性漏洞，可以选择性修复<a class='charaButton floatR greenfont underline cursor ignoreBtn' onclick='ignorePopFun(this," + clientid + ")'>忽略</a>");
		$(".taskDetailPop .taskInf").html("功能漏洞 - <span class='filePath' title='"+hostname+"'>" + hostname + "</span>");
		$(".taskDetailPop .ignoreBtn").attr('index', '4');
		$(".taskDetailPop .ignoreBtn").attr('level', level);
		$(".taskDetailPop .ignoreBtn").attr('indexP', $(this).parents("tr").index());
	} else {
		$(".taskDetailPop .describe").html("以下补丁已被忽略，火绒将不再此终端修复这些补丁<a class='charaButton floatR greenfont underline cursor ignoreBtn' onclick='ignorePopFun(this," + clientid + ")'>取消忽略</a>");
		$(".taskDetailPop .taskInf").html("已忽略补丁 - <span class='filePath' title='"+hostname+"'>" + hostname + "</span>");
		$(".taskDetailPop .ignoreBtn").attr('index', '5');
		$(".taskDetailPop .ignoreBtn").attr('indexP', $(this).parents("tr").index());
	}

	$(".taskDetailPop").show();
	$(".taskDetailPop .ignoreBtn").attr('taskid', clientid);
	$('.taskDetailPop input[type=checkbox]').attr('checked', false);
	var index=$(".taskDetailPop .ignoreBtn").attr('index');
	$('.taskDetailPop').attr('level',level);
	$('.taskDetailPop').attr('exclude',exclude);
	shade();
	taskDetailPop(index);
})

function taskDetailPop(index) {
	var start;
	var detailnumperpage = 9;
	if(start == undefined) {
		start = 0;
	}else{
		start = start;
	}
	
	var level = $('.taskDetailPop').attr('level');
	var exclude = $('.taskDetailPop').attr('exclude');
	var clientid = $(".taskDetailPop .ignoreBtn").attr('taskid');
	
	if(index == '5') {
		dataa = {
			"groupby": "patch",
			"filter": {
				"client_id": parseInt(clientid),
				"exclude": true
			},
			"view": {
				"begin": start,
				"count": detailnumperpage
			}
		};
	} else if(index == '3'){
		dataa = {
			"groupby": "patch",
			"filter": {
				"client_id": parseInt(clientid),
				"level": 0
			},
			"view": {
				"begin": start,
				"count": detailnumperpage
			}
		};
	}else if(index == '4'){
		dataa = {
			"groupby": "patch",
			"filter": {
				"client_id": parseInt(clientid),
				"level": 1
			},
			"view": {
				"begin": start,
				"count": detailnumperpage
			}
		};
	}
	var type = $('.taskDetailPop .tableth th.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.taskDetailPop .tableth th.th-ordery.th-ordery-current').attr('class');
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
			}
		},
		success: function(data) {
			var html = "";
			var tableth = "";
			
			var list = data.data.list;
			var totalnum = data.data.view.total;
			var pages = Math.ceil(totalnum / detailnumperpage);
			html += "<tr id='tableAlign'>";
			html += "<td width='5%'><input type='checkbox'></td>";
			html += "<td width='20%'>补丁编号</td>";
			html += "<td width='40%'>补丁描述</td>";
			html += "<td width='12%'>补丁类型</td>";
			html += "<td width='20%'>发布时间</td>";
			html += "</tr>";
			for(var i = 0; i < list.length; i++) {
				html += "<tr>";
				if(isInArray(detailsIdarrPop,parseInt(list[i].id))==true){
					html+="<td><input type='checkbox'  class='select select-repair-pop verticalMiddle' value='" + list[i].id + "' level = '"+ list[i].level +"' checked ></td>";
				}else{
					html+="<td><input type='checkbox'  class='select select-repair-pop verticalMiddle' value='" + list[i].id + "' level = '"+ list[i].level +"'></td>";
				}
				html += "<td>KB" + list[i].kbid + "</td>";
				html += "<td title='" + list[i].desc + "'><span class='filePath loophtWidth' style='width:270px;'>" + list[i].desc + "</span></td>";
				if(list[i].level == 0) {
					html += "<td>高危</td>";
				} else if(list[i].level == 1) {
					html += "<td>功能</td>";
				}

				html += "<td>" + getLocalTime3(list[i].pub_time) + "</td>";
				html += "</tr>";
			};
			if(list.length == 0) {
				$(".taskDetailPop .taskDetailTable table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
			} else {
				$(".taskDetailPop .taskDetailTable table").html(html);
			}
			
			
			$(".taskDetailPop .tableth th input[type=checkbox]").attr('total',totalnum);
			// 分页
			$(".taskDetailPop .clearfloat").remove();
			$(".taskDetailPop .tcdPageCode").remove();
			$(".taskDetailPop .totalPages").remove();
			$(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 " + totalnum + " 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
			
			var current = (dataa.view.begin/dataa.view.count) + 1;
			$(".taskDetailPop .tcdPageCode").createPage({
				pageCount: pages,
				current: parseInt(current),
				backFn: function(pageIndex) {
					start = (pageIndex - 1) * detailnumperpage;
					dataa.view.begin = start;
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
							var html = "";

							var list = data.data.list;
							
							html += "<tr id='tableAlign'>";
							html += "<td width='5%'><input type='checkbox'></td>";
							html += "<td width='20%'>补丁编号</td>";
							html += "<td width='40%'>补丁描述</td>";
							html += "<td width='12%'>补丁类型</td>";
							html += "<td width='20%'>发布时间</td>";
							html += "</tr>";
							for(var i = 0; i < list.length; i++) {
								html += "<tr>";
								if(isInArray(detailsIdarrPop,parseInt(list[i].id))==true){
									html+="<td><input type='checkbox'  class='select select-repair-pop verticalMiddle' value='" + list[i].id + "' checked></td>";
								}else{
									html+="<td><input type='checkbox'  class='select select-repair-pop verticalMiddle' value='" + list[i].id + "'></td>";
								}
								html += "<td>KB" + list[i].kbid + "</td>";
								html += "<td title='" + list[i].desc + "'><span class='filePath loophtWidth' style='width:270px;'>" + list[i].desc + "</span></td>";
								if(list[i].level == 0) {
									html += "<td>高危</td>";
								} else if(list[i].level == 1) {
									html += "<td>功能</td>";
								}
								html += "<td>" + getLocalTime1(list[i].pub_time) + "</td>";
								html += "</tr>";
							};
							
							$(".taskDetailPop .taskDetailTable table").html(html);
							
						}
					});
				}
			})

		}
	});

}

//漏洞、已忽略弹层--忽略客户端补丁
function ignorePopFun(b, a) {
	if($(".pop  td .select-repair-pop:checked").length == 0) {
		$(".delayHide").show();
		$(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 请选择终端!");
		setTimeout(function() {
			$(".delayHide").hide()
		}, 2000);
	} else {
		if($(b).text() == '忽略') {
			var dataa = {
				"client_id": a,
				"patch": {
					'exclude': detailsIdarrPop
				}
			};
		} else {
			var dataa = {
				"client_id": a,
				"patch": {
					'include': detailsIdarrPop
				}
			};
		}
		$.ajax({
			url: '/mgr/leakrepair/_clientkb',
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
					var index = $(b).attr('index');
					var indexP = $(b).attr('indexP');
					$('.tableContainer .table').find('tr').eq(indexP).find('td').eq(index).find('.taskDetailBtn').click();
					leakrepairClient();
				}
			}
		});
	}

}
$(".taskDetailPop").on("click", ".fastSKCB", function() {
	$(".fastSKCPop").show();
})
$(".taskDetailPop").on("click", ".overallSKCB", function() {
	$(".overallSKCPop").show();
})
$(".closeWW").click(function() {
	$(".shadee").hide();
	$(this).parent().parent().hide();
	
});
//关闭弹层
$(".closeW").click(function() {
	$(".shade").hide();
	$(this).parent().parent().hide();
	parent.$(".topshade").hide();
	clearInterval(looptimeRepair);

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
	leakrepairClient();
})

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
//列表全选

$(document).on('click','.selectAll-repair',function(){
		var total = $(this).attr('total');
		var hostname = trim($("#searchKey").val());
		var group_id = parseInt($('#selectVD option:checked').attr('groupid'));
		var dataa = {
			"groupby": "client",
			"view": {
				"begin": 0,
				"count": parseInt(total)
			},
			filter: {
				"group_id": group_id,
				"hostname": hostname
			}
			
		};
		$.ajax({
			url: '/mgr/leakrepair/_list',
			data: JSON.stringify(dataa),
			type: 'POST',
			contentType: 'text/plain',
			headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
			success: function(data) {
				var list = data.data.list;

				if($('.selectAll-repair').prop('checked') == true) {
					$('.select-repair').prop('checked',true);
					for (var i = 0; i < list.length; i++) {
						if(isInArray(repairIdarr,list[i].client_id)==false){
							repairIdarr.push(parseInt(list[i].client_id));	
						}
						
					}
				}else{
					$('.select-repair').prop('checked',false);
					for (var i = 0; i < list.length; i++) {
						if(isInArray(repairIdarr,list[i].client_id)==true){
							repairIdarr.splice(jQuery.inArray(list[i].client_id,repairIdarr),1);
						}
						
					}
				}
			}
		})
	
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
	leakrepairClient(start);
})

//列表
leakrepairClient();
var ajaxtable = null;

function leakrepairClient(start) {
	if(ajaxtable) {
		ajaxtable.abort();
	}
	repairIdarr = [];
	if(start == undefined) {
		start = 0;
	}else{
		start = start;
	}
	var hostname = trim($("#searchKey").val());
	var group_id = parseInt($('#selectVD option:checked').attr('groupid'));

	var dataa = {
		"groupby": "client",
		"view": {
			"begin": start,
			"count": numperpage
		},
		filter: {
			"group_id": group_id,
			"hostname": hostname
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
	$(".table table #tableAlign").siblings('tr').html('');
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
				if(data.errno != 0) {
					console.log(data.errno + '...');
					return false;
				}
				if(data.data.groupby != 'client') {
					console.log(data.data.groupby + '...');
					return false;
				}

				$(".table div").remove();
				var list = data.data.list;
				var table = "";
				var pages = Math.ceil(data.data.view.total / numperpage);

				for(i = 0; i < list.length; i++) {
					table += "<tr taskid='" + list[i].client_id + "' clientid='" + list[i].client_id + "'>";
					if(isInArray(repairIdarr,parseInt(list[i].client_id))==true){
						table+="<td><input type='checkbox'  class='select select-repair verticalMiddle' value='" + list[i].client_id + "' checked ></td>";
					}else{
						table+="<td><input type='checkbox'  class='select select-repair verticalMiddle' value='" + list[i].client_id + "'></td>";
					}
					table += "<td><span class='filePath cursor detailPopBtn' onclick='detailPop(this)' index='"+i+"' style='width:180px;' title='"+safeStr(list[i].hostname)+"'>" + safeStr(list[i].hostname) + "</span></td>";
					table += "<td><span>" + safeStr(list[i].group_name) + "</span></td>";
					table += "<td><a class=' cursor underline blackfont taskDetailBtn' level = '0' >" + list[i].l0_cnt + "</a></td>";
					table += "<td><a class=' cursor underline blackfont taskDetailBtn' level = '1' >" + list[i].l1_cnt + "</a></td>";
					table += "<td><a class=' cursor underline blackfont taskDetailBtn' exclude = 'true'>" + list[i].ex_cnt + "</a></td>";
					table += "</tr>";
				}
				if(list.length == 0) {
					$(".table table").after("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
				} else {
					$(".table table #tableAlign").after(table);
				}
				$('.selectAll-repair').attr('total',data.data.view.total);
				$(".tableContainer .clearfloat").remove();
				$(".tableContainer .tcdPageCode").remove();
				$(".tableContainer .totalPages").remove();
				$(".tableContainer .numperpage").remove();
				$(".tableContainer").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 " + data.data.view.total + " 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><a style='font-size:12px;float:right;line-height:54px;padding-right:20px;color:#6a6c6e' class='numperpage'>每页<input type='text' id='numperpageinput' value=" + numperpage + " style='font-size:12px;width:40px;height:24px;margin:0 4px;vertical-align:middle;padding:0 10px;'>条</a><div class='clear clearfloat'></div>");
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
								url: '/mgr/leakrepair/_list',
								data: JSON.stringify(dataa),
								type: 'POST',
								contentType: 'text/plain',
								headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
								success: function(data) {
									var list = data.data.list;
									var tableth = "";
									var table = "";

									table += "<table>";
									table += "<tr id='tableAlign'>";
									table += "<td width='4%'><input type='checkbox' class='verticalMiddle' onclick='selectAll(this)'></td>";
									table += "<td width='18%'>终端名称</td>";

									table += "<td width='15%'>终端分组</td>";
									table += "<td width='15%'>高危漏洞</td>";
									table += "<td width='15%'>功能漏洞</td>";
									table += "<td width='15%'>已忽略</td>";
									table += "</tr>";

									for(i = 0; i < list.length; i++) {
										table += "<tr taskid=" + list[i].client_id + " clientid='" + list[i].client_id + "'>";
										if(isInArray(repairIdarr,parseInt(list[i].client_id))==true){
											table+="<td><input type='checkbox'  class='select select-repair verticalMiddle' value='" + list[i].client_id + "' checked ></td>";
										}else{
											table+="<td><input type='checkbox'  class='select select-repair verticalMiddle' value='" + list[i].client_id + "'></td>";
										}
										table += "<td><span  class='filePath cursor detailPopBtn' index='"+i+"'  onclick='detailPop(this)' style='width:180px;' title='"+safeStr(list[i].hostname)+"'>" + safeStr(list[i].hostname) + "</span></td>";
										table += "<td><span>" + safeStr(list[i].group_name) + "</span></td>";
										table += "<td><a class=' cursor underline blackfont taskDetailBtn' level = '0' onclick='taskDetailPop(this)'>" + list[i].l0_cnt + "</a></td>";
										table += "<td><a class=' cursor underline blackfont taskDetailBtn' level = '1' onclick='taskDetailPop(this)'>" + list[i].l1_cnt + "</a></td>";
										table += "<td><a class=' cursor underline blackfont taskDetailBtn' exclude = 'true' onclick='taskDetailPop(this)'>" + list[i].ex_cnt + "</a></td>";
										table += "</tr>";
									}
									table += "</table>";
									$(".tableContainer .table table").hide();
									$(".tableContainer .table").html(table);
									$(".tableContainer .table table").show();

								}
							});

					}
				})
			}
		});

}

//修复漏洞弹窗
$(document).on('click', '.repairLoop', function() {
	if($(".table td .select-repair:checked").length == 0) {
		$(".delayHide").show();
		$(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 请选择终端!");
		setTimeout(function() {
			$(".delayHide").hide()
		}, 2000);
	} else {
		shade();
		$(".repairLoopPop").show();
		$(".repairLoopPop .tableCon table").html("");
		var start = 0;
		var tableth = "";
		tableth += "<tr id='tableAlign'>";
		tableth += "<td width='40%'>终端名称</td>";
		tableth += "<td width='40%'>终端分组</td>";
		tableth += "<td width='20%'>状态</td>";
		tableth += "</tr>";
		$(".repairLoopPop .tableCon table").html(tableth);
		$(".repairLoopPop .buttons a").remove();
		$(".repairLoopPop .buttons").append('<a index="0" class="repairBtn" onclick="repairAllbugFun(this)">修复高危漏洞</a>');
		$(".repairLoopPop .buttons").append('<a index="1" class="repairBtn" onclick="repairAllbugFun(this)">修复所有漏洞</a>');

		$(repairIdarr).each(function(index, value) {
			$.ajax({
				url:'/mgr/clnt/_info?id='+value+'',
				data:{},
				type: 'get',
				contentType: 'text/plain',
				headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
				error: function(xhr, textStatus, errorThrown) {
					if(xhr.status == 401) {
						parent.window.location.href = '/';
					} else {

					}
				},
				success: function(data) {
					var data = data.data;
					var html = "";
					html += "<tr>";
                	html+="<td><span style='width:228px;' class='filePath' title='"+safeStr(data.hostname)+"'>"+safeStr(data.hostname)+"</span></td>";
					html += "<td>" + safeStr(data.groupname) + "</td>";
					html += "<td>等待任务</td>";
					html += "</tr>";
					$(".repairLoopPop .tableCon table").append(html);
				}
			});
		})
	}
})
//修复所有---高危漏洞
var looptimeRepair = "";
 function repairAllbugFun(a) {
	var index = $(a).attr('index');
	var level = [];
	if(index == 0) {
		level = [0];
		$(".repairLoopPop .buttons a").eq(1).hide();
	} else {
		level = [0, 1];
		$(".repairLoopPop .buttons a").eq(0).hide();
	}
	$(".repairLoopPop .buttons").html("<a class='stopRepairBtn' index='"+index+"'>停止修复</a>");
	var dataa = {
		"type": "leakrepair_repair",
		"clients": repairIdarr,
		"param": {
			"level": level
		}
	}
	$.ajax({
		url: '/mgr/task/_create',
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
			if(data.errno == 0) {
				$(".delayHideS").show();
        	    $(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> 操作成功</span>");
        	    setTimeout(function(){$(".delayHideS").hide()},2000);
				
				taskid = data.data.task_id;
				dataa = {
					"taskid": taskid,
					"view": {
						"begin": 0,
						"count": repairIdarr.length
					}
				};
				$.ajax({
					url: '/mgr/task/_clnt',
					data: JSON.stringify(dataa),
					type: 'POST',
					async: true,
					contentType: 'text/plain',
					headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
					error: function(xhr, textStatus, errorThrown) {
						if(xhr.status == 401) {
							parent.window.location.href = '/';
						} else {

						}

					},
					success: function(data1) {
						var list = data1.data.list;
						var html = "";
						var finsh_text ="";
						html += "<tr id='tableAlign'>";
						html += "<td width='40%'>终端名称</td>";
						html += "<td width='40%'>终端分组</td>";
						html += "<td width='20%'>状态</td>";
						html += "</tr>";
						for(var i = 0; i < list.length; i++) {
							html += "<tr>";
                			html+="<td width='40%'><span style='width:228px;' class='filePath' title='"+safeStr(list[i].hostname)+"'>"+safeStr(list[i].hostname)+"</span></td>";
							html += "<td width='40%'>" + safeStr(list[i].groupname) + "</td>";
							if(list[i].status == 0) {
								html += "<td width='20%' id='unresponds'><span class='verticalMiddle'>未响应</span><img src='images/unresponds.png' class='statusIcon'</td>";
							} else if(list[i].status == 1) {
								html += "<td width='20%'><span class='verticalMiddle'>正在执行</span><img src='images/accepts.png' class='statusIcon'</td>";
							} else if(list[i].status == 2) {
								if(list[i].message == 'completed'){
									finsh_text = '任务完成'
								}else if(list[i].message == 'conflict'){
									finsh_text = '任务冲突'
								}else if(list[i].message == 'timeout'){
									finsh_text = '任务超时'
								}else if(list[i].message == 'unsupported'){
									finsh_text = '终端不支持'
								}else if(list[i].message == 'failed'){
									finsh_text = '执行失败'
								}else if(list[i].message == 'refused'){
									finsh_text = '用户拒绝'
								}else{
									finsh_text = list[i].message
								}
								html += "<td width='20%'><span class='verticalMiddle'>" + finsh_text + "</span></td>";
							}
							html += "</tr>";
						};

						$(".repairLoopPop .tableCon table").html(html);
					}
				});
				
			}
			looptimeRepair = setInterval("eachAllRepairTable()", 500);
		}
	})
}
//扫描漏洞未响应的状态
function eachAllRepairTable() {
	if($(".repairLoopPop #unresponds").length == 0) {
		clearInterval(looptimeRepair);
		$(".repairLoopPop .buttons").html("<a onclick='repairLoopPop()'>完成</a>");
	} else {
		dataa = {
			"taskid": taskid,
			"view": {
				"begin": 0,
				"count": repairIdarr.length
			}
		};
		$.ajax({
			url: '/mgr/task/_clnt',
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
			success: function(data1) {
				var list = data1.data.list;
				var html = "";
				var finsh_text = "";
				html += "<tr id='tableAlign'>";
				html += "<td width='40%'>终端名称</td>";
				html += "<td width='40%'>终端分组</td>";
				html += "<td width='20%'>状态</td>";
				html += "</tr>";
				for(var i = 0; i < list.length; i++) {
					html += "<tr>";
                	html+="<td width='40%'><span style='width:228px;' class='filePath' title='"+safeStr(list[i].hostname)+"'>"+safeStr(list[i].hostname)+"</span></td>";
					html += "<td width='40%'>" + safeStr(list[i].groupname) + "</td>";
					if(list[i].status == 0) {
						html += "<td width='20%' id='unresponds'><span class='verticalMiddle'>未响应</span><img src='images/unresponds.png' class='statusIcon'</td>";
					} else if(list[i].status == 1) {
						html += "<td width='20%'><span class='verticalMiddle'>正在执行</span><img src='images/accepts.png' class='statusIcon'</td>";
					} else if(list[i].status == 2) {
						if(list[i].message == 'completed'){
							finsh_text = '任务完成'
						}else if(list[i].message == 'conflict'){
							finsh_text = '任务冲突'
						}else if(list[i].message == 'timeout'){
							finsh_text = '任务超时'
						}else if(list[i].message == 'unsupported'){
							finsh_text = '终端不支持'
						}else if(list[i].message == 'failed'){
							finsh_text = '执行失败'
						}else if(list[i].message == 'refused'){
							finsh_text = '用户拒绝'
						}else{
							finsh_text = list[i].message
						}
						html += "<td width='20%'><span class='verticalMiddle'>" + finsh_text + "</span></td>";
					}
					html += "</tr>";
				};

				$(".repairLoopPop .tableCon table").html(html);
			}
		});
	}
}
// 扫描漏洞任务停止下发
$(document).on('click','.stopRepairBtn',function(){
	$.ajax({
		url: '/mgr/task/_ctrl?id=' + taskid + '&type=stop',
		data: {},
		type: 'GET',
		contentType: 'text/plain',
		headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
		error: function(xhr, textStatus, errorThrown) {
			if(xhr.status == 401) {
				parent.window.location.href = '/';
			} else {

			}

		},
		success: function(data) {
			$(".repairLoopPop .buttons").html("<a onclick='repairLoopPop()'>完成</a>");
		}
	});
	clearInterval(looptimeRepair);
})

function repairLoopPop() {
	$(".repairLoopPop").hide();
	$(".shade").hide();
	parent.$(".topshade").hide();
	leakrepairClient();
	clearInterval(looptimeRepair);
}
//忽略终端
function ignoreFun() {
	if($(".table td .select-repair:checked").length == 0) {
		$(".delayHide").show();
		$(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 请选择终端!");
		setTimeout(function() {
			$(".delayHide").hide()
		}, 2000);
	} else {
		var dataa = {
			"clients": repairIdarr,
			"exclude": true
		};
		repairIdarr = [];
		$.ajax({
			url: '/mgr/leakrepair/_clientex',
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
					leakrepairClient();
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