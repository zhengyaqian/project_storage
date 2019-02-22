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

$(document).on('click','.tableContainer .table th.th-ordery',function(){
	var toggleClass = $(this).attr('class');
	var _this = $(this);
    sortingFun(_this,toggleClass);
	var currentPage = $(this).parents('.tableContainer').find('.tcdPageCode span.current').text();
	var currentNum = $(this).parents('.tableContainer').find('#numperpageinput').val();
	var start = (parseInt(currentPage) - 1) * parseInt(currentNum);
	leakrepairPatch(start);
})
//列表信息
function columnsDataListFun (){
	var columns = [
		{
			type: "id",title: "",name: "id",
			tHead:{style: {width: "4%"},class:"",customFunc: function (data, row, i) {return "<input type='checkbox' class='verticalMiddle selectAll-repair'/>"}},
			tBody:{style: {width: "4%"},customFunc: function (data, row, i) {
				var checked;
				if(isInArray(repairIdarr,parseInt(data))==true){
					checked = 'checked';
				}else{
					checked = '';
				}
				return "<input type='checkbox'  class='select select-repair verticalMiddle' value='" + data + "' "+checked+" >";
			}}
	   	},
		{
			type: "kbid",title: "补丁编号",name: "kbid",
			tHead:{style: {width: "10%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) {
				return "<span>KB" + data + "</span>";
			}},
		},
		{
			type: "desc",title: "补丁描述",name: "desc",
			tHead:{style: {width: "50%"},customFunc: function (data, row, i) {return ""}},
			tBody:{style: {width: "50%"},customFunc: function (data, row, i) {
				return "<span class='filePath loophtWidth' style='width:550px;' title='" + data + "'>" + data + "</span>"}},
		},
		{
			type: "level",title: "补丁类型",name: "level",
			tHead:{style: {width: "10%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) {
				return fieldHandle(pathLevelField,data);
			}},
		},
		{
			type: "pub_time",title: "发布时间",name: "pub_time",
			tHead:{style: {width: "15%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "15%"},customFunc: function (data, row, i) {return "<span>" + getLocalTime3(data) + "</span>"}},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
var tabListstr =columnsDataListFun();
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
	var type = $('.tableContainer .table th.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.tableContainer .table th.th-ordery.th-ordery-current').attr('class');
	dataa = sortingDataFun(dataa,type,orderClass);
	$('.verticalMiddle').attr('checked', false);
	$(".table tbody").append("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
	ajaxtable =
		$.ajax({
			url: '/mgr/leakrepair/_list',
			data: JSON.stringify(dataa),
			type: 'POST',
			contentType: 'text/plain',
			error: function(xhr, textStatus, errorThrown) {
				if(xhr.status == 401) {
					parent.window.location.href = '/';
				} 
			},
			success: function(data) {
				$(".table div").remove();
				if(data.errno == '0') {
					var list = data.data.list;
					var total = data.data.view.total;
					var pages = Math.ceil(total / numperpage);
			
					if(list.length == 0) {
						$(".tableContainer .table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
					} else {
						tabListstr.setData(list);
					}
					tbodyAddHeight();
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
			$(".table tbody").append("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
			
			$.ajax({
				url: '/mgr/leakrepair/_list',
				data: JSON.stringify(dataa),
				type: 'POST',
				contentType: 'text/plain',
				error: function(xhr, textStatus, errorThrown) {
				if(xhr.status == 401) {
					parent.window.location.href = '/';
				}
			},
				success: function(data) {
					var list = data.data.list;
					tabListstr.setData(list);
					tbodyAddHeight();
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
		$('.table th .verticalMiddle').prop('checked', true);
	} else {
		$('.table th .verticalMiddle').prop('checked', false);
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
		delayHide("请选择补丁!");
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
			error: function(xhr, textStatus, errorThrown) {
				if(xhr.status == 401) {
					parent.window.location.href = '/';
				} else {

				}

			},
			success: function(data) {
				if(data.errno == 0) {
					delayHideS("操作成功");
					
					leakrepairPatch();
				}
			}
		});
	}

}
//已忽略终端排序


$(document).on('click','.ignoredTPop .ignoredTTable th.th-ordery',function(){
	var toggleClass = $(this).attr('class');
	var _this = $(this);
    sortingFun(_this,toggleClass);
	var currentPage = $(this).parents('.ignoredTPop').find('.tcdPageCode span.current').text();
	var currentNum = 9;
	var start = (parseInt(currentPage) - 1) * 9;
	ignoredTPop(start);
})
function columnsIgnoredFun (){
	var columns = [
		{
			type: "id",title: "",name: "id",
			tHead:{style: {width: "5%"},class:"",customFunc: function (data, row, i) {return "<input type='checkbox' class='verticalMiddle selectAll-repair-pop'/>"}},
			tBody:{style: {width: "5%"},customFunc: function (data, row, i) {
				var checked;
				if(isInArray(repairIdarrPop,parseInt(data))==true){
					checked = 'checked';
				}else{
					checked = '';
				}
				return "<input type='checkbox'  class='select select-repair-pop verticalMiddle' value='" + data + "' "+checked+">";
			}}
	   	},
		{
			type: "kbid",title: "补丁编号",name: "kbid",
			tHead:{style: {width: "10%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) {
				return "<span>KB" + data + "</span>";
			}},
		},
		{
			type: "",title: "补丁描述",name: "desc",
			tHead:{style: {width: "35%"},customFunc: function (data, row, i) {return ""}},
			tBody:{style: {width: "35%"},customFunc: function (data, row, i) {
				return "<span class='filePath loophtWidth' title='" + data + "'>" + data + "</span>"}},
		},
		{
			type: "level",title: "补丁类型",name: "level",
			tHead:{style: {width: "12%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "12%"},customFunc: function (data, row, i) {
				return fieldHandle(pathLevelField,data);
			}},
		},
		{
			type: "pub_time",title: "发布时间",name: "pub_time",
			tHead:{style: {width: "20%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {return "<span>" + getLocalTime3(data) + "</span>"}},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.ignoredTPop .ignoredTTable'));
	return tabstr;
}
var tabIgnoredstr = columnsIgnoredFun();
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
	var type = $('.ignoredTPop .ignoredTTable th.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.ignoredTPop .ignoredTTable th.th-ordery.th-ordery-current').attr('class');
	dataa = sortingDataFun(dataa,type,orderClass);
	$.ajax({
		url: '/mgr/leakrepair/_list',
		data: JSON.stringify(dataa),
		type: 'POST',
		contentType: 'text/plain',
		error: function(xhr, textStatus, errorThrown) {
			if(xhr.status == 401) {
				parent.window.location.href = '/';
			}
		},
		success: function(data) {
			var list = data.data.list;
			var totalnum = data.data.view.total;
			var pages = Math.ceil(totalnum / numperpage);

			if(list.length == 0) {
				$(".ignoredTPop .ignoredTTable tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
			} else {
				tabIgnoredstr.setData(list);
			}
			$(".ignoredTPop .ignoredTTable th input[type=checkbox]").attr('total',totalnum);
			
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
					dataa.view.begin = start;
					$.ajax({
						url: '/mgr/leakrepair/_list',
						data: JSON.stringify(dataa),
						type: 'POST',
						contentType: 'text/plain',
						error: function(xhr, textStatus, errorThrown) {
							alert(xhr.status + "  " + textStatus + "  " + errorThrown);
						},
						success: function(data) {
							var list = data.data.list;
							tabIgnoredstr.setData(list);
						}
					});
				}
			})

		}
	});
}
var repairIdarrPop = [];
//将选中的checkbox所对应的id传入数组
$(document).on('click', '.select-repair-pop', function() {
	if($(this).is(":checked")) {
		repairIdarrPop.push(parseInt($(this).val()));
	} else {
		repairIdarrPop.splice(jQuery.inArray(parseInt($(this).val()), repairIdarrPop), 1);
	}
	//	若列表checkbox全部勾选,则thcheckbox勾选
	if($(".pop td .select-repair-pop:checked").length == ($(".pop td .select-repair-pop").length)) {
		$('.pop .ignoredTTable th .selectAll-repair-pop').prop('checked', true);
	} else {
		$('.pop .ignoredTTable th .selectAll-repair-pop').prop('checked', false);
	}
})
$(document).on('click', '.selectAll-repair-pop', function() {
	var total = $(this).attr('total');
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
		error: function(xhr, textStatus, errorThrown) {
			if(xhr.status == 401) {
				parent.window.location.href = '/';
			}

		},
		success: function(data) {
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

})
//已忽略补丁弹窗--取消忽略
function ignorePopFun() {
	if($(".pop td .select-repair-pop:checked").length == 0) {
		delayHide("请选择补丁!");
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
			error: function(xhr, textStatus, errorThrown) {
				if(xhr.status == 401) {
					parent.window.location.href = '/';
				} else {

				}

			},
			success: function(data) {
				if(data.errno == 0) {
					delayHideS("操作成功");
					ignoredTPop();
					leakrepairPatch();
				}
			}
		});
	}

}
//调整页面内元素高度
function tbodyAddHeight(){
	var mainlefth = parent.$("#iframe #mainFrame").height();

	$(".main .table tbody").css({
		height: mainlefth - 347
	});
}



window.onresize = function() {
	tbodyAddHeight();
}