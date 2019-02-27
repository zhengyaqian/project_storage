//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a").eq(1).addClass("current");
parent.$(".nav .container a").eq(1).siblings().removeClass("current");
parent.$(".footer").show();
document.cookie='page=terminalManage.html';

var grouppid=0;
var totalnum="";

// 隐藏或者显示更多分组按钮
function showOrHidemgb(){
	var mainlefth=parent.$("#iframe #mainFrame").height();
	if($(".groupsPageContainer").height()>$(".groupsPage").height()){
		$(".moreGroupsButton").show();
		$(".main .mainLeft .groupsPage").css({height:mainlefth-215});
	}else{
		$(".moreGroupsButton").hide();
		$(".main .mainLeft .groupsPage").css({height:mainlefth-184});
	}
}
// 查看更多分组按钮
$(".moreGroupsButton").click(function(){
	if($(".groupsPageContainer").height()>$(".groupsPage").height() && Math.abs($(".groupsPageContainer").position().top)<Math.abs(($(".groupsPageContainer").height()-$(".groupsPage").height()))){
		$(".groupsPageContainer").animate({top: '-=44px'},100);
		if((Math.abs(($(".groupsPageContainer").height()-$(".groupsPage").height()))-Math.abs($(".groupsPageContainer").position().top))<50){
			$(this).find("a").css('background', 'url(images/lessgroup.png)');
		}
	}else{
		$(".groupsPageContainer").animate({top: '0px'},100);
		$(this).find("a").css('background', 'url(images/moregroup.png)');
	}
})
$(".moreGroupsButton").mousedown(function(){
	$(".moreGroupsButton a").css('backgroundPosition', '-20px');
}).mouseup(function(){
	$(".moreGroupsButton a").css('backgroundPosition', '0px');
})
//悬浮分组列表出现编辑和删除按钮
$(".mainLeft").on("mouseenter",".li",function(){
	if($(this).index(".li")!==0 && $(this).index(".li")!==1){
		$(this).find(".iconGD,.iconGE").show();
		$(this).siblings(".li").find(".iconGD,.iconGE").hide();
		$(this).find(".characters b").hide();
	}	
})
$(".mainLeft").on("mouseleave",".li",function(){
	if($(this).index(".li")!==0 && $(this).index(".li")!==1){
		$(this).find(".iconGD,.iconGE").hide();
		$(this).find(".characters b").show();
	}	
})
//全盘查杀设置参数多选改变后面inpu状态
$(".overallSKCPop input[name=overallSet1],.overallSKCPop input[name=overallSet2]").change(function(){
	if($(this).is(":checked")){
		$(this).next().find("input").prop("disabled",false);
	}else{
		$(this).next().find("input").prop("disabled",true);
	}
})
//悬浮出现筛选终端
$("#selectTerminal").mouseenter(function(){
	$(this).find(".terminalSC").show();
})
$("#selectTerminal").mouseleave(function(){
	$(this).find(".terminalSC").hide();
})

$(".terminalStatus a").click(function(){
	$(this).parent().parent().prev().prev().html($(this).html());
	$(this).parent().parent().hide();
	selectterminalarr=[];
	$(".mainRight .table th .selectAll-th").prop("checked",false);
	filterTerminal();
})

//修改终端名称限制名称长度
$("body").on('keyup','.terminalNInput',function(){
	if($(this).val().length>50){
		$(this).val($(this).val().substr(0,50));
	}
})

// 终端列表选择时全选input的变化
$(".mainRight").on("click",".table .select-td",function(){
	if($(this).is(":checked")){
		selectterminalarr.push(parseInt($(this).val()));
	}else{
		selectterminalarr.splice(jQuery.inArray(parseInt($(this).val()),selectterminalarr),1);
	}
	var num=parseInt($(".mainLeft .current").attr("num"));
	var dataa = terminalFilter(0,num);
	$.ajax({
		url:'/mgr/clnt/_list',
		data:JSON.stringify(dataa),
		type:'POST',
		contentType:'text/plain',
		error:function(xhr,textStatus,errorThrown){
			if(xhr.status==401){
				parent.window.location.href='/';
			}
		},
		success:function(data){
			var list=data.data.list;
			var isinarraynum=0;
			for (var i = 0; i < list.length; i++) {
				if(isInArray(selectterminalarr,list[i].client_id)==true){
					isinarraynum+=1;
				}
			};

			if(isinarraynum==data.data.view.total){
				$(".mainRight .table th .selectAll-th").prop("checked",true);
			}else{
				$(".mainRight .table th .selectAll-th").prop("checked",false);
			}
		}
	})

})


// 已经选择的终端数组
var selectterminalarr=[];
// 全选按钮点击将当前组所有的终端加入已选终端数组或者全部移除
$(".mainRight .container").on("click",".table th .selectAll-th",function(){
	var num=parseInt($(".mainLeft .current").attr("num"));
	var dataa = terminalFilter(0,num);
	$.ajax({
		url:'/mgr/clnt/_list',
		data:JSON.stringify(dataa),
		type:'POST',
		contentType:'text/plain',
		error:function(xhr,textStatus,errorThrown){
			if(xhr.status==401){
				parent.window.location.href='/';
			}
		},
		success:function(data){
			var list=data.data.list;
			if($(".mainRight .table th .selectAll-th").is(":checked")){
				$('.select-td').prop('checked',true);
				for (var i = 0; i < list.length; i++) {
					if(isInArray(selectterminalarr,list[i].client_id)==false){
						selectterminalarr.push(list[i].client_id);	
					}
					
				};
			}else{
				$('.select-td').prop('checked',false);
				for (var i = 0; i < list.length; i++) {
					if(isInArray(selectterminalarr,list[i].client_id)==true){
						selectterminalarr.splice(jQuery.inArray(list[i].client_id,selectterminalarr),1);
					}
					
				};
			}
			
		}
	});

})

function terminalFilter(start,num){
	// 遍历当前所有终端是否在选中终端数组（控制全选按钮的状态）
	var filtername=trim($("#filter").val());
	switch ($("#TSName>font").html())
	{
		case '所有终端':
		switch (grouppid)
		{
			case 0:
			var dataa={"view": {"begin": start,"count": num},"filter":{"name":filtername}};
			break;
			default:
			var dataa={"group_id":grouppid,"view": {"begin": 0,"count": num},"filter":{"name":filtername}};
		}
		break;
		case '在线终端':
		switch (grouppid)
		{
			case 0:
			var dataa={"online":true,"view": {"begin": start,"count": num},"filter":{"name":filtername}};
			break;
			default:
			var dataa={"online":true,"group_id":grouppid,"view": {"begin": start,"count": num},"filter":{"name":filtername}};
		}
		break;
		case '离线终端':
		switch (grouppid)
		{
			case 0:
			var dataa={"online":false,"view": {"begin": start,"count": num},"filter":{"name":filtername}};
			break;
			default:
			var dataa={"online":false,"group_id":grouppid,"view": {"begin": start,"count": num},"filter":{"name":filtername}};
		}
		break;
		case '异常终端':
		switch (grouppid)
		{
			case 0:
			var dataa={"status":1,"view": {"begin": start,"count": num},"filter":{"name":filtername}};
			break;
			default:
			var dataa={"status":1,"group_id":grouppid,"view": {"begin":start,"count": num},"filter":{"name":filtername}};
		}
		break;

	}
	return dataa;
}
// 改变每页多少数据
$("body").on("blur","#numperpageinput",function(){
	if($(this).val()==""||parseInt($(this).val())<10){
		numperpage=10;
	}else if(parseInt($(this).val())>1000){
		numperpage=1000;
	}else{
		numperpage=parseInt($("#numperpageinput").val());
	}
	localStorage.setItem('numperpage',numperpage);
	filterTerminal();
})
//排序
$(document).on('click','.table th.th-ordery',function(){
	var toggleClass = $(this).attr('class');
	var _this = $(this);
    sortingFun(_this,toggleClass);
	var currentPage = $(this).parents('.container').find('.tcdPageCode span.current').text();
	var currentNum = $(this).parents('.container').find('#numperpageinput').val();
	var start = (parseInt(currentPage) - 1) * parseInt(currentNum);
	filterTerminal(start);
})
// 获取最新的终端版本和病毒库版本
var lastclientversion="";
var lastvirusversion="";
$.ajax({
	url:'/mgr/sysconf/_version',
	type:'GET',
	contentType:'text/plain',
	error:function(xhr,textStatus,errorThrown){
		if(xhr.status==401){
			parent.window.location.href='/';
		}
	},
	success:function(data){			
		lastclientversion=data.data.client_version;
		lastvirusversion=data.data.client_dbtime;
		filterTerminal();
		
	}
})

//搜索终端框离开键盘刷新终端列表
$("#filter").keyup(function(){
	selectterminalarr=[];
	$(".mainRight .table th .selectAll-th").prop("checked",false);
	filterTerminal();
})
		

//列表信息
function columnsDataListFun (){
	var columns = [
		{
			type: "client_id",title: "",name: "client_id",
			tHead:{style: {width: "4%"},class:"",customFunc: function (data, row, i) {return "<input type='checkbox' class='verticalMiddle selectAll-th'/>"}},
			tBody:{style: {width: "4%"},customFunc: function (data, row, i) {
				if(isInArray(selectterminalarr,parseInt(data))==true){checked = 'checked';}else{checked = '';}
				return "<input type='checkbox'  class='select select-td verticalMiddle' name='terminal' value='" + data + "' "+checked+" >";
			}}
	   	},
		{
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "21%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "21%"},customFunc: function (data, row, i) {
				if(row.status==1){
					return "<img src='images/unusualname.png'><span class='nameText orangefont cursor detailPopBtn' clientId='"+row.client_id+"' index='"+i+"' onclick='detailPop(this)' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span></td>";
				}else{
					if(row.online==true){
						return "<img src='images/name.png'><span class='nameText greenfont cursor detailPopBtn' clientId='"+row.client_id+"' onclick='detailPop(this)' index='"+i+"' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span></td>";
					}else{
						return "<img src='images/unname.png'><span class='nameText greyfont cursor detailPopBtn' clientId='"+row.client_id+"' onclick='detailPop(this)' index='"+i+"' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span></td>";
					}
				}
			}},
		},
		{
			type: "groupname",title: "终端分组",name: "groupname",
			tHead:{style: {width: "21%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "21%"},customFunc: function (data, row, i) {return "<span class='nameText' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>"}},
		},
		{
			type: "ip",title: "IP",name: "ip",
			tHead:{style: {width: "13%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "13%"},customFunc: function (data, row, i) {return data}},
		},
		{
			type: "mac",title: "MAC",name: "mac",
			tHead:{style: {width: "17%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "17%"},customFunc: function (data, row, i) {return data}},
		},
		{
			type: "dbver",title: "病毒库版本",name: "dbver",
			tHead:{style: {width: "17%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "17%"},customFunc: function (data, row, i) {
				if(data!==lastvirusversion){
					return "<span class='colorOrange'>"+safeStr(getLocalTime1(data))+"</span>";
				}else{
					return safeStr(getLocalTime1(data));
				}
				
			}},
		},
		{
			type: "version",title: "终端版本",name: "version",
			tHead:{style: {width: "10%"},class: "th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) {
				if(data!==lastclientversion){
					return "<span class='colorOrange'>"+safeStr(data)+"</span>";
				}else{
					return safeStr(data);
				}
			}},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.mainRight .tableContainer .table'));
	return tabstr;
}
var tabListstr =columnsDataListFun();


//终端列表
function filterTerminal(start){
	var filtername=trim($("#filter").val());
	if(start == undefined) {
		start = 0;
	}else{
		start = start;
	}
	var dataa = terminalFilter(start,numperpage);
	
	var type = $('.table th.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.table th.th-ordery.th-ordery-current').attr('class');
	dataa = sortingDataFun(dataa,type,orderClass);
	$.ajax({
		url:'/mgr/clnt/_list',
		data:JSON.stringify(dataa),
		type:'POST',
		contentType:'text/plain',
		error:function(xhr,textStatus,errorThrown){
			if(xhr.status==401){
				parent.window.location.href='/';
			}
		},
		success:function(data){
			var list=data.data.list;
			totalnum=data.data.view.total;
			var total=Math.ceil(data.data.view.total/numperpage);
			startt=0;
			
			if(list.length==0){
				$(".mainRight .table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>"); 
			}else{
				tabListstr.setData(list);
			}
			tbodyAddHeight();
			showGroup();

			$(".clearfloat").remove();
			$(".mainRight .container .tcdPageCode").remove();
			$(".mainRight .container .totalPages").remove();
			$(".mainRight .container .numperpage").remove();
			$(".mainRight .container").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+data.data.view.total+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><a style='font-size:12px;float:right;line-height:54px;padding-right:20px;color:#6a6c6e' class='numperpage'>每页<input type='text' id='numperpageinput' value="+numperpage+" style='font-size:12px;width:40px;height:24px;margin:0 4px;vertical-align:middle;padding:0 10px;'>条</a><div class='clear clearfloat'></div>");
			var current = (dataa.view.begin/dataa.view.count) + 1;
			$(".mainRight .container .tcdPageCode").createPage({
				pageCount:total,
				current:parseInt(current),
				backFn:function(pageIndex){
					start=(pageIndex-1)*numperpage;
					dataa.view.begin = start;
					$.ajax({
						url:'/mgr/clnt/_list',
						data:JSON.stringify(dataa),
						type:'POST',
						contentType:'text/plain',
						error:function(xhr,textStatus,errorThrown){
							if(xhr.status==401){
								parent.window.location.href='/';
							}else{
								
							}
							
						},
						success:function(data){
							var list=data.data.list;
							totalnum=data.data.view.total;
							var total=Math.ceil(data.data.view.total/numperpage);
							startt=0;
							tabListstr.setData(list);
							showGroup();
							tbodyAddHeight();
						}
					})

				}
			}) 
		}
	});
}

//加载分组
function showGroup(){
	$.ajax({
		url:'/mgr/group/_list',
		dataType:'json',
		data:{},
		type:'GET',
		error:function(xhr,textStatus,errorThrown){
			if(xhr.status==401){
				parent.window.location.href='/';
			}
		},
		success:function(data){
			var list=data.data.list;
			var html="";
			if(grouppid==0){
				html+="<div class='li current' num="+data.data.all.clients+">";
			}else{
				html+="<div class='li' num="+data.data.all.clients+">";
			}
			html+="<a onclick='showGroupTerminal(this)'>";
			html+="<span class='icon iconComputer'></span>";
			html+="<span class='characters'><font>全网终端</font><b>"+data.data.all.clients_online+"/"+data.data.all.clients+"</b></span>";
			html+="</a>";
			html+="<span class='iconGE' style='display:none'></span>";
			html+="<span class='iconGD' style='display:none' groupid='0'></span>";
			html+="</div>";
			if(grouppid==1){
				html+="<div class='li current' num="+data.data.ungrouped.clients+">";
			}else{
				html+="<div class='li' num="+data.data.ungrouped.clients+">";
			}
			html+="<a onclick='showGroupTerminal(this)'>";
			html+="<span class='icon iconComputer'></span>";
			html+="<span class='characters'><font>未分组终端</font><b>"+data.data.ungrouped.clients_online+"/"+data.data.ungrouped.clients+"</b></span>";
			html+="</a>";
			html+="<span class='iconGE' style='display:none'></span>";
			html+="<span class='iconGD' style='display:none' groupid="+data.data.ungrouped.group_id+"></span>";
			html+="</div>";
			for(i=0;i<list.length;i++){
				if(list[i].group_id==grouppid){
					html+="<div class='li current' num="+list[i].clients+">";

				}else{
					html+="<div class='li' num="+list[i].clients+">";
				}
				html+="<a onclick='showGroupTerminal(this)'>";
				html+="<span class='icon iconPerson'></span>";
				html+="<span class='characters'><font title="+safeStr(pathtitle(list[i].group_name))+">"+safeStr(list[i].group_name)+"</font><b>"+list[i].clients_online+"/"+list[i].clients+"</b>"+"</span>";
				html+="</a>";
				html+="<span class='iconGE' onclick='modifyGNPop(this)'></span>";
				html+="<span class='iconGD' onclick='deleteGPop(this)' groupid='"+list[i].group_id+"'></span>";
				html+="</div>";

			}

			$(".mainLeft .container .groupsPage .groupsPageContainer").html(html);
			groupsPageContainerHeight=$(".main .mainLeft .groupsPage .groupsPageContainer").height();

			// 调整更多分组按钮
			showOrHidemgb();

			
		}
	});
}

//点击分组加载终端列表
function showGroupTerminal(a){
	// $("#TSName").html("<img src='images/allname.png' class='verticalMiddle'><font>所有终端</font>");//筛选终端下拉列表置为默认所有终端
	$(".mainRight .table").prop("scrollTop","0");
	$(a).parents(".li").siblings(".li").removeClass("current");
	$(a).parents(".li").addClass("current");
	grouppid=parseInt($(a).next().next().attr("groupid"));
	selectterminalarr=[];//清空所选终端数组
	$(".mainRight .table th .selectAll-th").prop("checked",false);
	filterTerminal();
}

//确认新建分组
function submitGN(a){
	var newGNText=trim($("#newGNText").val());
	var dataa={"group_name":newGNText};
	if(newGNText.length == 0){
		$(".newGroupPop .content .unusualTxt").show();
		$(".newGroupPop .content .unusualTxt").html("分组名称不能为空<img src='images/unusual.png'>");

	}else if(newGNText.length>20){
		$(".newGroupPop .content .unusualTxt").show();
		$(".newGroupPop .content .unusualTxt").html("分组名太长,创建分组失败<img src='images/unusual.png'>");
		setTimeout(function(){$(".newGroupPop .content .unusualTxt").hide()},2000)
	}else if(newGNText=="全网终端"){
		$(".newGroupPop .content .unusualTxt").show();
		$(".newGroupPop .content .unusualTxt").html("已存在相同分组名,创建分组失败<img src='images/unusual.png'>");
				
	}else{
		$.ajax({
			url:'/mgr/group/_create',
			data:JSON.stringify(dataa),
			type:'POST',
			contentType:'text/plain',
			error:function(xhr,textStatus,errorThrown){
				if(xhr.status==401){
					parent.window.location.href='/';
				}
			},
			success:function(data){
				if(data.errno==-1 && data.errmsg.indexOf("1062")>0){
					$(".newGroupPop .content .unusualTxt").show();
					$(".newGroupPop .content .unusualTxt").html("已存在相同分组名,创建分组失败<img src='images/unusual.png'>");
					
				}else{
					showGroup();
					hideButton(a);
					delayHideS("新建成功");

				}		
				
			}
		});
	}
}
//关闭遮罩和弹窗
function hideButton(a){
	$(".shade").hide();
	parent.$(".topshade").hide();
	$(a).parents(".pop").hide();
}
function hideButtonn(a){
	$(".windowShade").hide();
	$(a).parent().parent().hide();
	$(".insertRTable tr").not(":first").attr("id","");
}


//弹出删除分组

var groupid="";
function deleteGPop(a){
	shade();
	$(".deleteGPop").show();
	groupid=parseInt($(a).attr("groupid"));
	$(".deleteGPop .describe font").html($(a).parents("div.li").find("a").find(".characters").children("font").html());
		
}

function sureDeleteButton(a){
	var dataa={"group_id":groupid};
	$.ajax({
		url:'/mgr/group/_delete',
		data:JSON.stringify(dataa),
		type:'POST',
		contentType:'text/plain',
		error:function(xhr,textStatus,errorThrown){
			if(xhr.status==401){
				parent.window.location.href='/';
			}
		},
		success:function(data){
			showGroup();
			hideButton(a);
			filterTerminal();
		}
	});
}

//弹出修改分组名称
function modifyGNPop(a){
	var groupnamebefore=$(a).prev().find("font").text();
	shade();
	$(".modifyGNPop").show();
	groupid=parseInt($(a).siblings(".iconGD").attr("groupid"));
	$(".modifyGNPop .right .unusualTxt").hide();
	$("#modifyGNText").val(groupnamebefore);
};
function sureMGNButton(a){
	var groupname=trim($("#modifyGNText").val());
	var dataa={"group_id":groupid,"group_name":groupname};
	if(groupname.length == 0){
		$(".modifyGNPop .right .unusualTxt").show();
		$(".modifyGNPop .right .unusualTxt").html("分组名称不能为空<img src='images/unusual.png'>");

	}else if(groupname.length>20){
		$(".modifyGNPop .right .unusualTxt").show();
		$(".modifyGNPop .right .unusualTxt").html("分组名太长,创建分组失败<img src='images/unusual.png'>");
		setTimeout(function(){$(".modifyGNPop .right .unusualTxt").hide()},2000)
	}else if(groupname=="全网终端"){
		$(".modifyGNPop .right .unusualTxt").show();
		$(".modifyGNPop .right .unusualTxt").html("已存在相同分组名,创建分组失败<img src='images/unusual.png'>");
					
	}else{
		$.ajax({
			url:'/mgr/group/_update',
			data:JSON.stringify(dataa),
			type:'POST',
			contentType:'text/plain',
			error:function(xhr,textStatus,errorThrown){
				if(xhr.status==401){
					parent.window.location.href='/';
				}
			},
			success:function(data){
				if(data.errno==-1 && data.errmsg.indexOf("1062")>0){
					$(".modifyGNPop .right .unusualTxt").show();
					$(".modifyGNPop .right .unusualTxt").html("已存在相同分组名,创建分组失败<img src='images/unusual.png'>");
					
				}else{
					showGroup();
					hideButton(a);
				}
				
			}
		})

	}
	
}

//弹出修改终端名称
function editTNPop(a){
	shade();
	$(".editTNPop").show();
	clientid=parseInt($(a).attr("clientid"));
	var terminalnamebefore=$(a).prev().html();
	$("#editTNText").val(terminalnamebefore);
};
function sureETNButton(a){
	var terminalname=$("#editTNText").val();
	var dataa={"client_id":clientid,"aliasname":terminalname};
	$.ajax({
		url:'/mgr/clnt/_update',
		data:JSON.stringify(dataa),
		type:'POST',
		contentType:'text/plain',
		error:function(xhr,textStatus,errorThrown){
			if(xhr.status==401){
				parent.window.location.href='/';
			}
		},
		success:function(data){
			hideButton(a);
			filterTerminal();
		}
	});
}
																																																
//弹出终端详情
var clientid="";
var grouppolicyname="";
$("input[name=tacticsSelect]").click(function(){
	if($(".tacticsSwitch input[name='tacticsSelect']:checked").val()==0){
		
		clientid=parseInt(clientid);
		var dataa={"client_id":clientid,"policy_id":0};
		$.ajax({
			url:'/mgr/clnt/_update',
			data:JSON.stringify(dataa),
			type:'POST',
			contentType:'text/plain',
			error:function(xhr,textStatus,errorThrown){
				if(xhr.status==401){
					parent.window.location.href='/';
				}
			},
			success:function(data){
				$(".tacticsSwitch select").attr("disabled",true);
			}
		});
		

	}else{
		$(".tacticsSwitch select").attr("disabled",false);
		clientid=parseInt(clientid);
		var dataa={"client_id":clientid,"policy_id":prevIPolicy};
		$.ajax({
			url:'/mgr/clnt/_update',
			data:JSON.stringify(dataa),
			type:'POST',
			contentType:'text/plain',
			error:function(xhr,textStatus,errorThrown){
				if(xhr.status==401){
					parent.window.location.href='/';
				}
			},
			success:function(data){

			}
		});
		$.ajax({
			url:'/mgr/policy/_list',
			data:{},
			type:'GET',
			contentType:'text/plain',
			error:function(xhr,textStatus,errorThrown){
				if(xhr.status==401){
					parent.window.location.href='/';
				}
			},
			success:function(data1){
				var list1=data1.data.list;
				var select="";
				for(j=0;j<list1.length;j++){
					
					if(list1[j].policy_id==prevIPolicy){
						select+="<option selected policyid="+list1[j].policy_id+">"+safeStr(list1[j].policy_name)+"</option>";//上一次选中的独立策略为选中状态    
					}else{
						select+="<option policyid="+list1[j].policy_id+">"+safeStr(list1[j].policy_name)+"</option>";
					}

				}  
				$(".tacticsSwitch select").html(select); 
				
			}
		})
	}

	filterTerminal();
})

$(".tacticsSwitch select").change(function(){
	var policyid=parseInt($(".tacticsSwitch select option:selected").attr("policyid"));
	clientid=parseInt(clientid);
	var dataa={"client_id":clientid,"policy_id":policyid};
	$.ajax({
		url:'/mgr/clnt/_update',
		data:JSON.stringify(dataa),
		type:'POST',
		contentType:'text/plain',
		error:function(xhr,textStatus,errorThrown){
			if(xhr.status==401){
				parent.window.location.href='/';
			}
		},
		success:function(data){
			prevIPolicy=policyid;//改变后记住这一次 为下一次点独立策略回来恢复
		}
	})
})

var prevIPolicy=1;
var prevTName="";
function detailPop(a){
	shade();
	$(".detailPop").show();
	clientid=$(a).attr('clientId');
	var spanIndex = $(a).attr('index');
	$.ajax({
		url:'/mgr/clnt/_info?id='+clientid+'',
		data:{},
		type:'POST',
		contentType:'text/plain',
		error:function(xhr,textStatus,errorThrown){
			if(xhr.status==401){
				parent.window.location.href='/';
			}
		},
		success:function(data){
			var data=data.data;
			var html="";
			var terpolicyid=data.policy_id;//读取终端详情时的终端独立策略id
			grouppolicyname=data.policy_name;
			prevTName=data.hostname;//读取终端详情时的终端名称
			if(data.status==1){
				$(".detailPop .detailcom").html("<img src='images/unusualter.png'>");
			}else{
				if(data.online==true){
					$(".detailPop .detailcom").html("<img src='images/onlineter.png'>");
				}else{
					$(".detailPop .detailcom").html("<img src='images/offlineter.png'>");
				}
			}

			// $(".detailPop .versionnum").html("<span style='display:inline-block;width:40px;text-align:justify; text-justify:inter-ideograph;'><font style='margin-right:12px;;'>版</font>本</span> : "+data.prod.ver);
			// $(".detailPop .dbversion").html("<span style='display:inline-block;width:40px;text-align:justify; text-justify:inter-ideograph;'>病毒库</span> : "+getLocalTime1(data.prod.dbver));

			html+="<div class='informationB informationBL'>";
			html+="<div class='heading'><img src='images/information2.png'><span>网络信息</span></div>";
			html+="<p>IP地址 : "+safeStr(data.ip)+"</p>";
			html+="<p>MAC地址 : "+safeStr(data.mac)+"</p>";
			html+="</div>";
			html+="<div class='clear'></div>";
			html+="<div class='informationB informationBD'>";
			html+="<div class='heading'><img src='images/information3.png'><span>环境信息</span></div>";
			html+="<p>操作系统 : "+safeStr(data.osinfo.name)+"    "+safeStr(data.osinfo.arch)+"   "+safeStr(data.osinfo.ver)+"</p>";
			if("cpus" in data.hwinfo){
				if(data.hwinfo.cpus){
					html+="<p><span style='width:10%;float:left;display:inline-block;'>处理器：</span><span style='display:inline-block;width:90%;float:left;'>"
					for(var i=0;i<data.hwinfo.cpus.length;i++){
						html+= "<a style='display:inline-block;'>" +data.hwinfo.cpus[i]+"</a>";
					}
					html+="</span></p>"
				}else{
					html+="<p>处理器 :</p>";
				}
				
			}else{
				html+="<p>处理器 : "+safeStr(data.hwinfo.cpu)+"</p>";
			}
			
			html+="<p>主板 : "+safeStr(data.hwinfo.board)+"</p>";
			if("physicalmemory" in data.hwinfo){
				if(data.hwinfo.physicalmemory){
					html+="<p><span style='width:7%;float:left;display:inline-block;'>内存：</span><span style='display:inline-block;width:93%;float:left;'>"
					for(var i=0;i<data.hwinfo.physicalmemory.length;i++){
						html+= "<a style='display:inline-block;'>" +data.hwinfo.physicalmemory[i]+"</a>";
					}
					html+="</span></p>"
				}else{
					html+="<p>内存 :</p>";
				}
				
			}else{
				html+="<p>内存 : "+data.hwinfo.memory+"</p>";
			}
			
			if("hdds" in data.hwinfo){
				if(data.hwinfo.hdds){
					html+="<p><span style='width:7%;float:left;display:inline-block;'>硬盘：</span><span style='display:inline-block;width:93%;float:left;'>"
					for(var i=0;i<data.hwinfo.hdds.length;i++){
						html+= "<a style='display:inline-block;'>" +data.hwinfo.hdds[i]+"</a>";
					}
					html+="</span></p>"
				}else{
					html+="<p>硬盘 :</p>";
				}
				
			}else{
				html+="<p>硬盘 :"+data.hwinfo.hdd+"</p>";
			}

			if("videos" in data.hwinfo){
				if(data.hwinfo.videos){
					html+="<p><span style='width:7%;float:left;display:inline-block;'>显卡：</span><span style='display:inline-block;width:93%;float:left;'>"
					for(var i=0;i<data.hwinfo.videos.length;i++){
						html+= "<a style='display:inline-block;'>" +data.hwinfo.videos[i]+"</a>";
					}
					html+="</span></p>"
				}else{
					html+="<p>显卡 :</p>";
				}
			}else{
				html+="<p>显卡 : "+data.hwinfo.video+"</p>";
			}
			
			html+="</div>";
			html+="<div class='informationB informationBD'>";
			html+="<div class='heading'><img src='images/information4.png'><span>其它信息</span></div>";
			html+="<p>终端版本 : "+safeStr(data.prod.ver)+"</p>";
			html+="<p>病毒库时间 : "+safeStr(getLocalTime1(data.prod.dbver))+"</p>";
			html+="<p>上次登录时间 : "+safeStr(getLocalTime1(data.lasttime))+"</p>";
			html+="</div>";
			$(".detailPop .terOverview").html(html);
			if(data.status==1){
				$(".detailPop .left .terminalstatus").html("<font style='color:#b28041;'>服务异常</font>");

			}else if(data.online==true && data.status==0){
				$(".detailPop .left .terminalstatus").html("<font style='color:#42aa76;'>在线</font>");
			}else if(data.online==false && data.status==0){
				$(".detailPop .left .terminalstatus").html("<font style='color:#6c6c6c;'>离线</font>");
			}
			$(".detailPop .left .terminalname").html("<span class='verticalMiddle' style='padding-left:18px;display: inline-block;max-width: 160px;text-overflow:ellipsis;overflow: hidden;white-space: nowrap;vertical-align: middle;' title="+safeStr(pathtitle(data.hostname))+">"+safeStr(data.hostname)+"</span><span class='editTNIcon' index='"+ parseInt(spanIndex) +"' onclick='editTN(this)'></span>");
			$(".detailPop .left .isgroup").html(safeStr(data.groupname));
			
		}
	});
};
//编辑终端名称按钮
function editTN(a){
	var spanIndex = $(a).attr('index');
	var tern=$(a).prev().text();
	$(a).prev().remove();
	$(a).before("<input type='text' style='height:20px;line-height:20px;width:140px;color:#676a6c;border:1px solid rgb(231,234,236);text-align:center;font-size:12px;'  class='terminalNInput' index='"+parseInt(spanIndex)+"' onblur='sureETN(this)'>");
	$(a).prev().focus();
	$(a).prev().val(tern);
	$(a).hide();
}
//编辑终端名称文本框失去焦点
function sureETN(a){
	var terminalname=trim($(a).val());
		var spanIndex = $(a).attr('index');
		var dataa={"client_id":parseInt(clientid),"aliasname":terminalname};
		$.ajax({
			url:'/mgr/clnt/_update',
			data:JSON.stringify(dataa),
			type:'POST',
			contentType:'text/plain',
			error:function(xhr,textStatus,errorThrown){
				if(xhr.status==401){
					parent.window.location.href='/';
				}
				
			},
			success:function(data){
				$(a).next().show();
//						$(".detailPop .left .terminalname").html("<span class='verticalMiddle' style='padding-left:18px;display: inline-block;max-width: 160px;text-overflow:ellipsis;overflow: hidden;white-space: nowrap;vertical-align: middle;'>"+safeStr(terminalname)+"</span><span class='editTNIcon' onclick='editTN(this)'></span>");
				$('.detailPopBtn').parents('tr').siblings('tr').eq(parseInt(spanIndex-1)).find('.detailPopBtn').click();
				
				filterTerminal();
			}
		});
}
//关闭弹层
$(".closeW").click(function(){
	$(".shade").hide();
	parent.$(".topshade").hide();
	$(this).parent().parent().hide();
	clearInterval(looptimeFastSK);
	clearInterval(looptimeRemoteSK);
	clearInterval(looptimeOverallSK);
	clearInterval(looptimeTerminalUp);
	clearInterval(looptimePO);
	clearInterval(looptimeRS);

});
$(".closeWW").click(function(){
	$(".shadee").hide();
	$(this).parent().parent().hide();
});



//弹出新建分组
function newGroupPop(){
	shade();
	$("#newGNText").val("");

	$(".newGroupPop").show();
	$(".newGroupPop .content .unusualTxt").hide();
	$(".newGroupPop .placeholder").show();
};
// 弹出分组管理
function groupingMPop(){
	shade();
	$(".systemSPop").show();
	// 分组插入添加规则的select
	var groupdict=[];
	$.ajax({
		url:'/mgr/group/_list',
		data:{},
		type:'get',
		contentType:'text/plain',
		error:function(xhr,textStatus,errorThrown){
			if(xhr.status==401){
				parent.window.location.href='/';
			}
		},
		success:function(data){
			var list=data.data.list;
			var grouplist="";
			for (var i = 0; i < list.length; i++) {
				grouplist+="<option value="+list[i].group_id+">"+safeStr(list[i].group_name)+"</option>";
				var group={"id":list[i].group_id,"name":list[i].group_name};
				groupdict.push(group);
			}
			$(".systemSPop .grouplist").html(grouplist);

			//接入规则获取

			$.ajax({
				url:'/mgr/group/_rule',
				data:{},
				type:'GET',
				contentType:'text/plain',
				error:function(xhr,textStatus,errorThrown){
					if(xhr.status==401){
						parent.window.location.href='/';
					}
				},
				success:function(data){
					var list=data.data.list;
					var table="";
					
					for (var i = 0; i < list.length; i++) {
						var groupid=list[i].group_id;
						var groupname="";
	
						for (var j = 0; j < groupdict.length; j++) {
							if(groupid==groupdict[j].id){
								groupname=groupdict[j].name;
							}
						}

						if(!("hostname" in list[i])){
							table+="<tr class='ipRule' change="+list[i].changetime+">";
							table+="<td width='40%'><span class='beginip'>"+safeStr(list[i].ip_range.begin)+"</span> 至 <span class='endip'>"+safeStr(list[i].ip_range.end)+"</span></td>";
							if(groupname==""){
								table+="<td width='30%'>未分组终端</td>";
							}else{
								table+="<td width='30%' groupid="+list[i].group_id+">"+safeStr(groupname)+"</td>";
							}
							
							table+="<td width='30%'><a class='blackfont underline cursor' onclick='editRPop(this)'>编辑</a>   "+"<a class='blackfont underline cursor' onclick='deleteRPop(this)'>删除</a></td></tr>";
						}else{
							table+="<tr class='terminalRule'  change="+list[i].changetime+">";
							table+="<td width='40%'>"+safeStr(list[i].hostname)+"</td>";
							table+="<td width='30%' groupid="+list[i].group_id+">"+safeStr(groupname)+"</td>";
							table+="<td width='30%'><a class='blackfont underline cursor' onclick='editRPop(this)'>编辑</a>   "+"<a class='blackfont underline cursor' onclick='deleteRPop(this)'>删除</a></td></tr>";
						}
						
					};
					$(".insertRTable table tbody").html(table);
					
					

				}
			});
		}
	});
}
// 弹出IP分组
function IPGPop(){
	$(".IPGPop").show();
	$(".windowShade").show();
	$(".IPGPop .ipad").val("");
	$(".IPGPop .terminalName").val("");
	$(".IPGPop .methodSelect input").eq(0).prop("checked",true);
	$(".IPGPop .IPGBlock").show();
	$(".IPGPop .terminalGBlock").hide();
}
// 选择分组规则方法
$(".IPGPop .methodSelect input").click(function(){
	if($(".IPGPop .methodSelect input:checked").index()==0){
		$(".IPGPop .IPGBlock").show();
		$(".IPGPop .terminalGBlock").hide();

	}else{
		$(".IPGPop .IPGBlock").hide();
		$(".IPGPop .terminalGBlock").show();
	}
})
$(".IPGEPop .methodSelect input").click(function(){
	if($(".IPGEPop .methodSelect input:checked").index()==0){
		$(".IPGEPop .IPGBlock").show();
		$(".IPGEPop .terminalGBlock").hide();

	}else{
		$(".IPGEPop .IPGBlock").hide();
		$(".IPGEPop .terminalGBlock").show();
	}
})

function sureIR(a){
	if($(".IPGPop .methodSelect input:checked").index()==0){
		var beginip=$(".IPGPop .ipad").eq(0).val();
		var endip=$(".IPGPop .ipad").eq(1).val();
		var beginipArr = [];
		var beginipstr=beginip.split(".");
		var endipstr=endip.split(".");
		var beginipnum=parseInt(beginipstr.join(""));
		var endipnum=parseInt(endipstr.join(""));

		var groups=$(".IPGPop .describe select").val();

		//判断ip格式
		if(isValidIP(beginip)==false || isValidIP(endip)==false){
			delayHide("IP格式有误");
		}else if(beginipnum >= endipnum){
			delayHide("ip范围有误");
		}else if(groups!==null){
			var groupid=$(".IPGPop .grouplist").val();
			var groupname=$(".IPGPop .grouplist option:selected").html();
			var insertrtr="";
			insertrtr+="<tr class='ipRule' change="+parseInt((new Date().getTime())/1000)+">";
			insertrtr+="<td width='40%'><span class='beginip'>"+beginip+"</span> 至 <span class='endip'>"+endip+"</span></td>";
			insertrtr+="<td width='30%' groupid="+groupid+">"+groupname+"</td>";
			insertrtr+="<td width='30%'><a class='blackfont underline cursor' onclick='editRPop(this)'>编辑</a>   "+"<a class='blackfont underline cursor' onclick='deleteRPop(this)'>删除</a></td>";
			$(".insertRTable table").append(insertrtr);
			$(a).parent().parent().hide();
			$(".windowShade").hide();
		}else if(groups==null){
			delayHide("请先添加分组");
		}	
		

	}else{
		var terminalname=safeStr(trim($(".IPGPop .terminalName").val()));
		var groups=$(".terminalGPop .describe select").val();
		var sametername=0;
		var addingtername=$(".IPGPop .terminalName").val().toLowerCase();
		$(".insertRTable .terminalRule").each(function(){
			var havetername=$(this).find("td").eq(0).html().toLowerCase();
			if(havetername==addingtername){
				sametername=sametername+1;
			}
		})

		if(terminalname==""){
			delayHide("无效的终端名称");
		}else if(groups==null){
			delayHide("请先添加分组");
		}else if(sametername>0){
			delayHide("命名规则重复");
		}else{
			var groupid=$(".IPGPop .grouplist").val();
			var groupname=$(".IPGPop .grouplist option:selected").html();
			var insertrtr="";
			insertrtr+="<tr class='terminalRule' change="+parseInt((new Date().getTime())/1000)+">";
			insertrtr+="<td width='40%'>"+terminalname+"</td>";
			insertrtr+="<td width='30%' groupid="+groupid+">"+groupname+"</td>";
			insertrtr+="<td width='30%'><a class='blackfont underline cursor' onclick='editRPop(this)'>编辑</a>   "+"<a class='blackfont underline cursor' onclick='deleteRPop(this)'>删除</a></td>";
			$(".insertRTable table tody").append(insertrtr);
			$(a).parent().parent().hide();
			$(".windowShade").hide();
		}
	}
	
	
}
//删除规则
function deleteRPop(a){
	$(".deleteRPop").show();
	$(".windowShade").show();
	$(a).parents("tr").attr("id","deleting");
	$(".deleteRPop .describe font").html($(a).parents("tr").find("td").eq(0).html());

}
function sureDeleteIR(a){
	$("#deleting").remove();
	$(a).parent().parent().hide();
	$('.windowShade').hide();

}
//编辑规则
function editRPop(a){
	
	$(".windowShade").show();
	$(".IPGEPop").show();
	$(a).parents("tr").attr("id","editing");
	var currentb=$(a).parents("tr").find(".beginip").html();
	var currente=$(a).parents("tr").find(".endip").html();
	var currentgid=parseInt($(a).parents("tr").find("td").eq(1).attr("groupid"));
	var currentterminaln=$(a).parents("tr").find("td").eq(0).text();
	if($(a).parents("tr").attr("class")=="ipRule"){
		$(".IPGEPop .methodSelect input").eq(0).prop("checked",true);
		$(".IPGEPop .IPGBlock").show();
		$(".IPGEPop .terminalGBlock").hide();
		$(".IPGEPop .ipad").eq(0).val(currentb);
		$(".IPGEPop .ipad").eq(1).val(currente);
	}else{
		$(".IPGEPop .methodSelect input").eq(1).prop("checked",true);
		$(".IPGEPop .IPGBlock").hide();
		$(".IPGEPop .terminalGBlock").show();
		$(".IPGEPop .terminalName").val(currentterminaln);
	}
	$(".systemSPop .grouplist").val(currentgid);
}
function sureEIR(a){
	if($(".IPGEPop .methodSelect input:checked").index()==0){
		var beginip=$(".IPGEPop .ipad").eq(0).val();
		var endip=$(".IPGEPop .ipad").eq(1).val();
		var beginipstr=beginip.split(".");
		var endipstr=endip.split(".");
		var beginipnum=parseInt(beginipstr.join(""));
		var endipnum=parseInt(endipstr.join(""));
		var groups=$(".IPGEPop .describe select").val();
	

		
		
		//判断ip格式
		if(isValidIP(beginip)==false || isValidIP(endip)==false){
			delayHide("IP格式有误");
		}else if(beginipnum >= endipnum){
			delayHide("ip范围有误");
		}else if(groups!==null){
			var groupname=$(".IPGEPop .grouplist option:selected").html();
			var groupid=parseInt($(".IPGEPop .grouplist").val());
			$("#editing td").eq(0).html("<span class='beginip'>"+beginip+"</span> 至 <span class='endip'>"+endip+"</span>");
			$("#editing td").eq(1).attr("groupid",groupid);
			$("#editing td").eq(1).html(groupname);
			$("#editing").attr("class","ipRule");
			$("#editing").attr("change",parseInt((new Date().getTime())/1000));
			$(a).parent().parent().hide();
			$('.windowShade').hide();
			$(".insertRTable tr").not(":first").attr("id","");
		}else if(groups==null){
			delayHide("请先添加分组");
		}	
		
	}else{
		var terminalname=safeStr(trim($(".IPGEPop .terminalName").val()));
		var groups=$(".IPGEPop .describe select").val();
		var sametername=0;
		var addingtername=$(".IPGEPop .terminalName").val().toLowerCase();
		$(".insertRTable .terminalRule").not("#editing").each(function(){
			var havetername=$(this).find("td").eq(0).html().toLowerCase();
			if(havetername==addingtername){
				sametername=sametername+1;
			}
		})
		if(terminalname==""){
			delayHide("无效的终端名称");
		}else if(groups==null){
			delayHide("请先添加分组");
		}else if(sametername>0){
			delayHide("命名规则重复");
		}else{
			var groupname=$(".IPGEPop .grouplist option:selected").html();
			var groupid=parseInt($(".IPGEPop .grouplist").val());
			$("#editing td").eq(0).html(terminalname);
			$("#editing td").eq(1).attr("groupid",groupid);
			$("#editing td").eq(1).html(groupname);
			$("#editing").attr("class","terminalRule");
			$("#editing").attr("change",parseInt((new Date().getTime())/1000));
			$(a).parent().parent().hide();
			$('.windowShade').hide();
			$(".insertRTable tr").not(":first").attr("id","");
		}
	}
	
	

}
function sureSetButton(a){
	//保存接入规则
	var dataa=[];
	$(".insertRTable tr").not(":first").each(function(){
		if($(this).attr("class")=="ipRule"){
			var begin=$(this).find(".beginip").html();
			var end=$(this).find(".endip").html();
			var groupid=parseInt($(this).find("td").eq(1).attr("groupid"));
			var change=parseInt($(this).attr("change"));
			var rule={"ip_range":{"begin":begin,"end":end},"group_id":groupid,"changetime":change};
			
		}else{
			var terminalname=$(this).find("td").eq(0).html();
			var groupid=parseInt($(this).find("td").eq(1).attr("groupid"));
			var change=parseInt($(this).attr("change"));
			var rule={"hostname":terminalname,"group_id":groupid,"changetime":change};
			
		}
		dataa.push(rule);
	})
	$.ajax({
		url:'/mgr/group/_rule',
		data:JSON.stringify(dataa),
		type:'POST',
		contentType:'text/plain',
		error:function(xhr,textStatus,errorThrown){
			if(xhr.status==401){
				parent.window.location.href='/';
			}
		},
		success:function(data){
			if(data.errno==-1){
				delayHide("ip范围交叉重叠");
			}else if(data.errno==0){
				$(a).parents(".pop").hide();
				$(".shade").hide();
				parent.$(".topshade").hide();
				filterTerminal();
			}
			
		}
	});
}
var taskAjaxHtml;
//创建任务
function createTaskFun(dataa){
	$.ajax({
		url:'/mgr/task/_create',
		data:JSON.stringify(dataa),
		type:'POST',
		async:false,
		contentType:'text/plain',
		error:function(xhr,textStatus,errorThrown){
			if(xhr.status==401){
				parent.window.location.href='/';
			}
		},
		success:function(data){
			// 下发任务成功提示
			delayHideS("操作成功");
			taskid=data.data.task_id;
			dataa={"taskid":taskid,"view":{"begin":0,"count":selectterminalarr.length}};
			taskAjaxHtml = taskAjaxFun(dataa);
			
			
		}			
	});
	return taskAjaxHtml;

}
//下发任务
function taskAjaxFun(dataa){
	var html="";
	$.ajax({
		url:'/mgr/task/_clnt',
		data:JSON.stringify(dataa),
		type:'POST',
		async:false,
		contentType:'text/plain',
		error:function(xhr,textStatus,errorThrown){
			if(xhr.status==401){
				parent.window.location.href='/';
			}
		},
		success:function(data1){
			var list=data1.data.list;
			
			for (var i = 0; i < list.length; i++) {
				html+="<tr>";
				html+="<td width='40%'><span style='width:220px;' class='filePath' title='"+safeStr(list[i].hostname)+"'>"+safeStr(list[i].hostname)+"</span></td>";
				html+="<td width='40%'>"+safeStr(list[i].groupname)+"</td>";
				if(list[i].status==0){
					html+="<td width='20%' id='unresponds'><span class='verticalMiddle'>未响应</span><img src='images/unresponds.png' class='statusIcon'</td>";
				}else if(list[i].status==1){
					html+="<td width='20%'><span class='verticalMiddle'>已接受</span><img src='images/accepts.png' class='statusIcon'</td>";
				}else if(list[i].status==2){
					html+="<td width='20%'><span class='verticalMiddle'>已拒绝</span><img src='images/refuses.png' class='statusIcon'</td>";
				}
				html+="</tr>";	
			};
			
		}		
	});
	return html;

}
//任务停止下发
function stopTask(a){
	var looptime = $(a).attr('looptime');
	$.ajax({
		url:'/mgr/task/_ctrl?id='+taskid+'&type=stop',
		data:{},
		type:'GET',
		contentType:'text/plain',
		error:function(xhr,textStatus,errorThrown){
			if(xhr.status==401){
				parent.window.location.href='/';
			}
		},
		success:function(data){
			$(a).parent('.buttons').html("<a onclick='closePop(this)' looptime='"+looptime+"'>完成</a>")
		}
	});
	clearInterval(eval(looptime));

}
function taskListPop(){
	var html = "";
	$(selectterminalarr).each(function(index,value){
		$.ajax({
			url:'/mgr/clnt/_info?id='+value+'',
			data:{},
			type:'POST',
			async:false,
			contentType:'text/plain',
			error:function(xhr,textStatus,errorThrown){
				if(xhr.status==401){
					parent.window.location.href='/';
				}
			},
			success:function(data){
				var data=data.data;
				html+="<tr>";
				html+="<td width='40%'><span style='width:220px;' class='filePath' title='"+safeStr(data.hostname)+"'>"+safeStr(data.hostname)+"</span></td>";
				html+="<td width='40%'>"+safeStr(data.groupname)+"</td>";
				html+="<td width='20%'>等待任务</td>";
				html+="</tr>";
				
			}
		});
	});
	return html;
	
}
//关闭任务弹窗
function closePop(a){	
	var looptime = $(a).attr('looptime');
	$(a).parents('.pop').hide();
	$(".shade").hide();
	parent.$(".topshade").hide();
	clearInterval(looptime);
	selectterminalarr = [];
	filterTerminal();
	$('.container .table th input[type=checkbox]').prop("checked",false);
}
//弹出快速查杀

$(".fastSKB").click(function(){
	if(selectterminalarr.length==0){
		delayHide("请选择终端!");
	}else{
		// 放开更改配置项
		$(".fastSKCPop input").prop("disabled",false);
		$(".fastSKCPop .buttons a").eq(0).show();
		$(".fastSKCPop .buttons a").eq(2).show();
		$(".fastSKPop .buttons").html("<a onclick='sureFSKButton(this)'>立即查杀</a>");
		shade();
		$(".fastSKPop").show();
		$(".fastSKPop .tableCon table tbody").html('');
		//取快速设置的默认设置参数
		$.ajax({
			url:'/mgr/task/_param?type=quick_scan',
			data:{},
			type:'GET',
			contentType:'text/plain',
			error:function(xhr,textStatus,errorThrown){
				if(xhr.status==401){
					parent.window.location.href='/';
				}
			},
			success:function(data){

				var data=data.data.data;
				var first=data['scan.maxspeed'];
				var second=data['scan.sysrepair'];
				var third=data['clean.automate'];
				var fourth=data['clean.quarantine'];
				fastskc={"scan.maxspeed":first,"scan.sysrepair":second,"clean.automate":third,"clean.quarantine":fourth};
				fastskcdefault=fastskc;//保存默认设置参数
				if(first==true){
					$(".fastSKCPop input[name=scanOp]").eq(1).prop("checked",true);
					$(".fastSKCPop input[name=scanOp]").eq(0).prop("checked",false);

				}else if(first==false){
					$(".fastSKCPop input[name=scanOp]").eq(0).prop("checked",true);
					$(".fastSKCPop input[name=scanOp]").eq(1).prop("checked",false);
				}
				if(second==true){
					$(".fastSKCPop input[name=repairSet]").prop("checked",true);
				}else{
					$(".fastSKCPop input[name=repairSet]").prop("checked",false);

				}
				if(third==true){
					$(".fastSKCPop input[name=isHandle]").eq(0).prop("checked",true);
					$(".fastSKCPop input[name=isHandle]").eq(1).prop("checked",false)
				}else if(third==false){
					$(".fastSKCPop input[name=isHandle]").eq(1).prop("checked",true);
					$(".fastSKCPop input[name=isHandle]").eq(0).prop("checked",false)
				}
				if(fourth==true){
					$(".fastSKCPop input[name=afterClear]").prop("checked",true)
				}else{
					$(".fastSKCPop input[name=afterClear]").prop("checked",false)
				}


				
				
			}
		});
		var html = taskListPop();
		$(".fastSKPop .tableCon table tbody").append(html);
	}
});
var fastskc="";//快速查杀参数设置
var fastskcdefault="";
$(".fastSKCB").click(function(){
	$(".fastSKCPop").show();
	var first=fastskc['scan.maxspeed'];
	var second=fastskc['scan.sysrepair'];
	var third=fastskc['clean.automate'];
	var fourth=fastskc['clean.quarantine'];
	if(first==true){
		$(".fastSKCPop input[name=scanOp]").eq(1).prop("checked",true);
		$(".fastSKCPop input[name=scanOp]").eq(0).prop("checked",false);

	}else if(first==false){
		$(".fastSKCPop input[name=scanOp]").eq(0).prop("checked",true);
		$(".fastSKCPop input[name=scanOp]").eq(1).prop("checked",false);
	}
	if(second==true){
		$(".fastSKCPop input[name=repairSet]").prop("checked",true);
	}else{
		$(".fastSKCPop input[name=repairSet]").prop("checked",false);

	}
	if(third==true){
		$(".fastSKCPop input[name=isHandle]").eq(0).prop("checked",true);
		$(".fastSKCPop input[name=isHandle]").eq(1).prop("checked",false)
	}else if(third==false){
		$(".fastSKCPop input[name=isHandle]").eq(1).prop("checked",true);
		$(".fastSKCPop input[name=isHandle]").eq(0).prop("checked",false)
	}
	if(fourth==true){
		$(".fastSKCPop input[name=afterClear]").prop("checked",true)
	}else{
		$(".fastSKCPop input[name=afterClear]").prop("checked",false)
	}
})
$(".fastSKCPop .recoverDefault").click(function(){
	var first=fastskcdefault['scan.maxspeed'];
	var second=fastskcdefault['scan.sysrepair'];
	var third=fastskcdefault['clean.automate'];
	var fourth=fastskcdefault['clean.quarantine'];
	if(first==true){
		$(".fastSKCPop input[name=scanOp]").eq(1).prop("checked",true);
		$(".fastSKCPop input[name=scanOp]").eq(0).prop("checked",false);

	}else if(first==false){
		$(".fastSKCPop input[name=scanOp]").eq(0).prop("checked",true);
		$(".fastSKCPop input[name=scanOp]").eq(1).prop("checked",false);
	}
	if(second==true){
		$(".fastSKCPop input[name=repairSet]").prop("checked",true);
	}else{
		$(".fastSKCPop input[name=repairSet]").prop("checked",false);

	}
	if(third==true){
		$(".fastSKCPop input[name=isHandle]").eq(0).prop("checked",true);
		$(".fastSKCPop input[name=isHandle]").eq(1).prop("checked",false)
	}else if(third==false){
		$(".fastSKCPop input[name=isHandle]").eq(1).prop("checked",true);
		$(".fastSKCPop input[name=isHandle]").eq(0).prop("checked",false)
	}
	if(fourth==true){
		$(".fastSKCPop input[name=afterClear]").prop("checked",true)
	}else{
		$(".fastSKCPop input[name=afterClear]").prop("checked",false)
	}

})
function saveFastSKC(a){
	
	if($(a).parents(".pop").find("input[name=scanOp]:checked").val()==1){
		var first=true;
	}else{
		var first=false;
	}
	if($(a).parents(".pop").find("input[name=repairSet]").prop("checked")==true){
		var second=true;
	}else{
		var second=false;
	}
	if($(a).parents(".pop").find("input[name=isHandle]:checked").val()==0){
		var third=true;
	}else{
		var third=false;
	}
	if($(a).parents(".pop").find("input[name=afterClear]").prop("checked")==true){
		var fourth=true;
	}else{
		var fourth=false;
	}

	fastskc={"scan.maxspeed":first,"scan.sysrepair":second,"clean.automate":third,"clean.quarantine":fourth};

	$(a).parents(".pop").hide();
	$(".shadee").hide();

}
var looptimeFastSK="";
var createTaskHTml = "";
function sureFSKButton(){
	$(".fastSKPop .buttons").html("<a onclick='stopTask(this)' looptime='looptimeFastSK'>停止下发</a>");
	var dataa={"type":"quick_scan","clients":selectterminalarr,"param":fastskc};  
	var createTaskHTml = createTaskFun(dataa);
	$(".fastSKPop .tableCon table tbody").html(createTaskHTml);
	looptimeFastSK=setInterval("eachFastTable()", 500);

	// 屏蔽更改配置项
	$(".fastSKCPop input").prop("disabled",true);
	$(".fastSKCPop .buttons a").eq(0).hide();
	$(".fastSKCPop .buttons a").eq(2).hide();
}
function eachFastTable(){
	if($(".fastSKPop #unresponds").length==0){
		clearInterval(looptimeFastSK);
		$(".fastSKPop .buttons").html("<a onclick='closePop(this)'>完成</a>");
	}else{
		dataa={"taskid":taskid,"view":{"begin":0,"count":selectterminalarr.length}};
		taskAjaxHtml = taskAjaxFun(dataa);
		$(".fastSKPop .tableCon table tbody").html(taskAjaxHtml);
	}
}


//弹出全盘查杀
$(".overallSKB").click(function(){
	if(selectterminalarr.length==0){
		delayHide("请选择终端!");
	}else{
		// 放开更改配置项
		$(".overallSKCPop input").prop("disabled",false);
		$(".overallSKCPop .buttons a").eq(0).show();
		$(".overallSKCPop .buttons a").eq(2).show();
		$(".overallSKPop .buttons").html("<a onclick='sureOSKButton(this)'>立即查杀</a>");
		shade();
		$(".overallSKPop").show();
		$(".overallSKPop .tableCon table tbody").html("");
		$.ajax({
			url:'/mgr/task/_param?type=full_scan',
			data:{},
			type:'GET',
			contentType:'text/plain',
			error:function(xhr,textStatus,errorThrown){
				if(xhr.status==401){
					parent.window.location.href='/';
				}
			},
			success:function(data){

				var data=data.data.data;
				var first=data['scan.maxspeed'];
				var second=data['scan.sysrepair'];
				var third=data['clean.automate'];
				var fourth=data['clean.quarantine'];
				var overallpara1=data['decompo.limit.size'].enable;
				var overallpara2=data['scan.exclusion.ext'].enable;
				var overallpara1V=data['decompo.limit.size'].value;
				var overallpara2V=data['scan.exclusion.ext'].value;
				overallskc={"scan.maxspeed":first,"scan.sysrepair":second,"clean.automate":third,"clean.quarantine":fourth,"decompo.limit.size":{"enable":overallpara1,"value":overallpara1V},"scan.exclusion.ext":{"enable":overallpara2,"value":overallpara2V}};
				overallskcdefault=overallskc;
				if(first==true){
					$(".overallSKCPop input[name=scanOp]").eq(1).prop("checked",true);
					$(".overallSKCPop input[name=scanOp]").eq(0).prop("checked",false);
				}else{
					$(".overallSKCPop input[name=scanOp]").eq(0).prop("checked",true);
					$(".overallSKCPop input[name=scanOp]").eq(1).prop("checked",false);
				}
				if(second==true){
					$(".overallSKCPop input[name=repairSet]").prop("checked",true)
				}else{
					$(".overallSKCPop input[name=repairSet]").prop("checked",false)
				}
				if(third==true){
					$(".overallSKCPop input[name=isHandle]").eq(0).prop("checked",true);
					$(".overallSKCPop input[name=isHandle]").eq(1).prop("checked",false);
				}else{
					$(".overallSKCPop input[name=isHandle]").eq(1).prop("checked",true);
					$(".overallSKCPop input[name=isHandle]").eq(0).prop("checked",false);
				}
				if(fourth==true){
					$(".overallSKCPop input[name=afterClear]").prop("checked",true)
				}else{
					$(".overallSKCPop input[name=afterClear]").prop("checked",false)
				}

				if(overallpara1==true){
					$(".overallSKCPop input[name=overallSet1]").prop("checked",true);
					$(".overallSKCPop input[name=overallPara1]").val(overallpara1V);
				}else{
					$(".overallSKCPop input[name=overallSet1]").prop("checked",false);
					$(".overallSKCPop input[name=overallPara1]").val(overallpara1V);
					$(".overallSKCPop input[name=overallPara1]").prop("d可爱萌娃isabled",true)
				}
				if(overallpara2==true){
					$(".overallSKCPop input[name=overallSet2]").prop("checked",true);
					$(".overallSKCPop input[name=overallPara2]").val(overallpara2V);
				}else{
					$(".overallSKCPop input[name=overallSet2]").prop("checked",false);
					$(".overallSKCPop input[name=overallPara2]").val(overallpara2V);
					$(".overallSKCPop input[name=overallPara2]").prop("disabled",true)
				}
				
			}
		});
		
		var html = taskListPop();
		$(".overallSKPop .tableCon table tbody").append(html);
	}
		
	
});
var overallskc={};
$(".overallSKCB").click(function(){

	$(".overallSKCPop").show();
	var first=overallskc['scan.maxspeed'];
	var second=overallskc['scan.sysrepair'];
	var third=overallskc['clean.automate'];
	var fourth=overallskc['clean.quarantine'];
	var overallpara1=overallskc['decompo.limit.size'].enable;
	var overallpara2=overallskc['scan.exclusion.ext'].enable;
	var overallpara1V=overallskc['decompo.limit.size'].value;
	var overallpara2V=overallskc['scan.exclusion.ext'].value;
	if(first==true){
		$(".overallSKCPop input[name=scanOp]").eq(1).prop("checked",true);
		$(".overallSKCPop input[name=scanOp]").eq(0).prop("checked",false);
	}else{
		$(".overallSKCPop input[name=scanOp]").eq(0).prop("checked",true);
		$(".overallSKCPop input[name=scanOp]").eq(1).prop("checked",false);
	}
	if(second==true){
		$(".overallSKCPop input[name=repairSet]").prop("checked",true)
	}else{
		$(".overallSKCPop input[name=repairSet]").prop("checked",false)
	}
	if(third==true){
		$(".overallSKCPop input[name=isHandle]").eq(0).prop("checked",true);
		$(".overallSKCPop input[name=isHandle]").eq(1).prop("checked",false);
	}else{
		$(".overallSKCPop input[name=isHandle]").eq(1).prop("checked",true);
		$(".overallSKCPop input[name=isHandle]").eq(0).prop("checked",false);
	}
	if(fourth==true){
		$(".overallSKCPop input[name=afterClear]").prop("checked",true)
	}else{
		$(".overallSKCPop input[name=afterClear]").prop("checked",false)
	}

	if(overallpara1==true){
		$(".overallSKCPop input[name=overallSet1]").prop("checked",true);
		$(".overallSKCPop input[name=overallPara1]").val(overallpara1V);
	}else{
		$(".overallSKCPop input[name=overallSet1]").prop("checked",false);
		$(".overallSKCPop input[name=overallPara1]").val(overallpara1V);
		$(".overallSKCPop input[name=overallPara1]").prop("disabled",true)
	}
	if(overallpara2==true){
		$(".overallSKCPop input[name=overallSet2]").prop("checked",true);
		$(".overallSKCPop input[name=overallPara2]").val(overallpara2V);
	}else{
		$(".overallSKCPop input[name=overallSet2]").prop("checked",false);
		$(".overallSKCPop input[name=overallPara2]").val(overallpara2V);
		$(".overallSKCPop input[name=overallPara2]").prop("disabled",true)
	}

})
$(".overallSKCPop .recoverDefault").click(function(){
	var first=overallskcdefault['scan.maxspeed'];
	var second=overallskcdefault['scan.sysrepair'];
	var third=overallskcdefault['clean.automate'];
	var fourth=overallskcdefault['clean.quarantine'];
	var overallpara1=overallskcdefault['decompo.limit.size'].enable;
	var overallpara2=overallskcdefault['scan.exclusion.ext'].enable;
	var overallpara1V=overallskcdefault['decompo.limit.size'].value;
	var overallpara2V=overallskcdefault['scan.exclusion.ext'].value;
	if(first==true){
		$(".overallSKCPop input[name=scanOp]").eq(1).prop("checked",true);
		$(".overallSKCPop input[name=scanOp]").eq(0).prop("checked",false);
	}else{
		$(".overallSKCPop input[name=scanOp]").eq(0).prop("checked",true);
		$(".overallSKCPop input[name=scanOp]").eq(1).prop("checked",false);
	}
	if(second==true){
		$(".overallSKCPop input[name=repairSet]").prop("checked",true)
	}else{
		$(".overallSKCPop input[name=repairSet]").prop("checked",false)
	}
	if(third==true){
		$(".overallSKCPop input[name=isHandle]").eq(0).prop("checked",true);
		$(".overallSKCPop input[name=isHandle]").eq(1).prop("checked",false);
	}else{
		$(".overallSKCPop input[name=isHandle]").eq(1).prop("checked",true);
		$(".overallSKCPop input[name=isHandle]").eq(0).prop("checked",false);
	}
	if(fourth==true){
		$(".overallSKCPop input[name=afterClear]").prop("checked",true)
	}else{
		$(".overallSKCPop input[name=afterClear]").prop("checked",false)
	}

	if(overallpara1==true){
		$(".overallSKCPop input[name=overallSet1]").prop("checked",true);
		$(".overallSKCPop input[name=overallPara1]").val(overallpara1V);
	}else{
		$(".overallSKCPop input[name=overallSet1]").prop("checked",false);
	}
	if(overallpara2==true){
		$(".overallSKCPop input[name=overallSet2]").prop("checked",true);
		$(".overallSKCPop input[name=overallPara2]").val(overallpara2V);
	}else{
		$(".overallSKCPop input[name=overallSet2]").prop("checked",false);
	}

})
function saveOverallSKC(a){
	
	if($(a).parents(".pop").find("input[name=scanOp]:checked").val()==1){
		var first=true;
	}else{
		var first=false;
	}
	if($(a).parents(".pop").find("input[name=repairSet]").prop("checked")==true){
		var second=true;
	}else{
		var second=false;
	}
	if($(a).parents(".pop").find("input[name=isHandle]:checked").val()==0){
		var third=true;
	}else{
		var third=false;
	}
	if($(a).parents(".pop").find("input[name=afterClear]").prop("checked")==true){
		var fourth=true;
	}else{
		var fourth=false;
	}
	var overallpara1=$("input[name=overallPara1]").val();
	var overallpara2=$("input[name=overallPara2]").val();
	if($(a).parents(".pop").find("input[name=overallSet1]").prop("checked")==true && $(a).parents(".pop").find("input[name=overallSet2]").prop("checked")==true){
		overallskc={"scan.maxspeed":first,"scan.sysrepair":second,"clean.automate":third,"clean.quarantine":fourth,"decompo.limit.size":{"enable":true,"value":overallpara1},"scan.exclusion.ext":{"enable":true,"value":overallpara2}};
	}else if($(a).parents(".pop").find("input[name=overallSet1]").prop("checked")==true && $(a).parents(".pop").find("input[name=overallSet2]").prop("checked")==false){
		overallskc={"scan.maxspeed":first,"scan.sysrepair":second,"clean.automate":third,"clean.quarantine":fourth,"decompo.limit.size":{"enable":true,"value":overallpara1},"scan.exclusion.ext":{"enable":false}};
	}else if($(a).parents(".pop").find("input[name=overallSet1]").prop("checked")==false && $(a).parents(".pop").find("input[name=overallSet2]").prop("checked")==true){
		overallskc={"scan.maxspeed":first,"scan.sysrepair":second,"clean.automate":third,"clean.quarantine":fourth,"decompo.limit.size":{"enable":false},"scan.exclusion.ext":{"enable":true,"value":overallpara2}};

	}else if($(a).parents(".pop").find("input[name=overallSet1]").prop("checked")==false && $(a).parents(".pop").find("input[name=overallSet2]").prop("checked")==false){
		overallskc={"scan.maxspeed":first,"scan.sysrepair":second,"clean.automate":third,"clean.quarantine":fourth,"decompo.limit.size":{"enable":false},"scan.exclusion.ext":{"enable":false}};

	}

	$(a).parents(".pop").hide();
	$(".shadee").hide();

}
var looptimeOverallSK="";
function sureOSKButton(a){
	$(".overallSKPop .buttons").html("<a onclick='stopTask(this)' looptime='looptimeOverallSK'>停止下发</a>");
	var dataa={"type":"full_scan","clients":selectterminalarr,"param":overallskc};  
	var createTaskHTml = createTaskFun(dataa);

	$(".overallSKPop .tableCon table tbody").html(createTaskHTml);
	looptimeOverallSK=setInterval("eachOverallTable()", 500);

	// 屏蔽配置项
	$(".overallSKCPop input").prop("disabled",true);
	$(".overallSKCPop .buttons a").eq(0).hide();
	$(".overallSKCPop .buttons a").eq(2).hide();
}
function eachOverallTable(){
	if($(".overallSKPop #unresponds").length==0){
		clearInterval(looptimeOverallSK);
		$(".overallSKPop .buttons").html("<a onclick='closePop()'>完成</a>");
	}else{
		dataa={"taskid":taskid,"view":{"begin":0,"count":selectterminalarr.length}};
		taskAjaxHtml = taskAjaxFun(dataa);
		$(".overallSKPop .tableCon table tbody").html(taskAjaxHtml);
	}
}

//弹出终端升级
$(".terminalUB").click(function(){
	if(selectterminalarr.length==0){
		delayHide("请选择终端!");
	}else{
		$(".terminalUpPop .buttons").html("<a onclick='sureTUButton(this)'>立即升级</a>");
		shade();
		$(".terminalUpPop").show();
		$(".terminalUpPop .tableCon table tbody").html('');
		$(selectterminalarr).each(function(index,value){  
			$.ajax({
				url:'/mgr/clnt/_info?id='+value+'',
				data:{},
				type:'POST',
				contentType:'text/plain',
				error:function(xhr,textStatus,errorThrown){
					if(xhr.status==401){
						parent.window.location.href='/';
					}
				},
				success:function(data){
					var data=data.data;
					var html="";
					html+="<tr>";
					html+="<td width='35%'><span style='width:220px;' class='filePath' title='"+safeStr(data.hostname)+"'>"+safeStr(data.hostname)+"</span></td>";
					html+="<td width='35%'>"+safeStr(data.groupname)+"</td>";
					html+="<td width='15%'>"+safeStr(data.prod.ver)+"</td>";
					html+="<td width='15%'>等待任务</td>";
					html+="</tr>";
					$(".terminalUpPop .tableCon table tbody").append(html);
					
				}
			});
		});
	}
		
	
});
var looptimeTerminalUp="";
function sureTUButton(a){
	$(".terminalUpPop .buttons").html("<a onclick='stopTask(this)' looptime='looptimeTerminalUp'>停止下发</a>");
	var dataa={"type":"update","clients":selectterminalarr};  
	$.ajax({
		url:'/mgr/task/_create',
		data:JSON.stringify(dataa),
		type:'POST',
		contentType:'text/plain',
		error:function(xhr,textStatus,errorThrown){
			if(xhr.status==401){
				parent.window.location.href='/';
			}
		},
		success:function(data){
			// 下发任务成功提示
			delayHideS("操作成功");
			taskid=data.data.task_id;
			dataa={"taskid":taskid,"view":{"begin":0,"count":selectterminalarr.length}};
			$.ajax({
					url:'/mgr/task/_clnt',
					data:JSON.stringify(dataa),
					type:'POST',
					async:true,
					contentType:'text/plain',
					error:function(xhr,textStatus,errorThrown){
						if(xhr.status==401){
							parent.window.location.href='/';
						}
					},
					success:function(data1){
						var list=data1.data.list;
						var html="";
						
						for (var i = 0; i < list.length; i++) {
							html+="<tr>";
							html+="<td width='35%'><span style='width:220px;' class='filePath' title='"+safeStr(list[i].hostname)+"'>"+safeStr(list[i].hostname)+"</span></td>";
							html+="<td width='35%'>"+safeStr(list[i].groupname)+"</td>";
							html+="<td width='15%'>"+safeStr(list[i].prodver)+"</td>";
							if(list[i].status==0){
								html+="<td width='15%' id='unresponds'><span class='verticalMiddle'>未响应</span><img src='images/unresponds.png' class='statusIcon'</td>";
							}else if(list[i].status==1){
								html+="<td width='15%'><span class='verticalMiddle'>已接受</span><img src='images/accepts.png' class='statusIcon'</td>";
							}else if(list[i].status==2){
								html+="<td width='15%'><span class='verticalMiddle'>已拒绝</span><img src='images/refuses.png' class='statusIcon'</td>";
							}
							html+="</tr>";	
						};
					
						$(".terminalUpPop .tableCon table tbody").html(html);

					}		
			});
			looptimeTerminalUp=setInterval("eachTerminalTable()", 500);
		}			
	});

}
function eachTerminalTable(){
	if($(".terminalUpPop #unresponds").length==0){
		clearInterval(looptimeTerminalUp);
		$(".terminalUpPop .buttons").html("<a onclick='closePop(this)' looptime='looptimeTerminalUp'>完成</a>");
	}else{
		dataa={"taskid":taskid,"view":{"begin":0,"count":selectterminalarr.length}};
		$.ajax({
			url:'/mgr/task/_clnt',
			data:JSON.stringify(dataa),
			type:'POST',
			contentType:'text/plain',
			error:function(xhr,textStatus,errorThrown){
				if(xhr.status==401){
					parent.window.location.href='/';
				}
			},
			success:function(data1){
				var list=data1.data.list;
				var html="";
				
				for (var i = 0; i < list.length; i++) {
					html+="<tr>";
					html+="<td width='35%'><span style='width:220px;' class='filePath' title='"+safeStr(list[i].hostname)+"'>"+safeStr(list[i].hostname)+"</span></td>";
					html+="<td width='35%'>"+safeStr(list[i].groupname)+"</td>";
					html+="<td width='15%'>"+safeStr(list[i].prodver)+"</td>";
					if(list[i].status==0){
						html+="<td width='15%' id='unresponds'><span class='verticalMiddle'>未响应</span><img src='images/unresponds.png' class='statusIcon'></td>";
					}else if(list[i].status==1){
						html+="<td width='15%'><span class='verticalMiddle'>已接受</span><img src='images/accepts.png' class='statusIcon'></td>";
					}else if(list[i].status==2){
						html+="<td width='15%'><span class='verticalMiddle'>已拒绝</span><img src='images/refuses.png' class='statusIcon'></td>";
					}
					html+="</tr>";	
				};
			
				$(".terminalUpPop .tableCon table tbody").html(html);
			}		
		});	
	}
}

//弹出移动分组
$(".moveGB").click(function(){
	if(selectterminalarr.length==0){
		delayHide("请选择终端!");
	}else{
		$(".moveGPop .describe span").html("当前已选择 "+selectterminalarr.length+" 台在线终端,请需要移动的目标分组:");
		shade();
		$(".moveGPop").show();
		
		var html = taskListPop();
		$(".moveGPop .tableCon table tbody").html(html);
		$.ajax({
			url:'/mgr/group/_list',
			dataType:'json',
			data:{},
			type:'GET',
			error:function(xhr,textStatus,errorThrown){
				if(xhr.status==401){
					parent.window.location.href='/';
				}
			},
			success:function(data){
				
				var list=data.data.list;
				var html="";
				if(data.data.ungrouped.group_id==grouppid){
					html+="<option groupid="+data.data.ungrouped.group_id+" selected>未分组终端</option>";
				}else{
					html+="<option groupid="+data.data.ungrouped.group_id+">未分组终端</option>";
				}
				for(i=0;i<list.length;i++){
					if(list[i].group_id==grouppid){
						html+="<option groupid='"+list[i].group_id+"' selected>"+safeStr(list[i].group_name)+"</option>";
					}else{
						html+="<option groupid='"+list[i].group_id+"'>"+safeStr(list[i].group_name)+"</option>";
					}
					
				}
				$(".moveGPop .describe .groupsSelect").html(html);
			}
		});
	}
	
});
//确认移动分组
function sureMGButton(a){
	$(selectterminalarr).each(function(index,value){
		var checkedgroupid=parseInt($(a).parents(".pop").find(".groupsSelect option:selected").attr("groupid"));
		var dataa={"client_id":value,"group_id":checkedgroupid};
		$.ajax({
			url:'/mgr/clnt/_update',
			data:JSON.stringify(dataa),
			type:'POST',
			contentType:'text/plain',
			error:function(xhr,textStatus,errorThrown){
				if(xhr.status==401){
					parent.window.location.href='/';
				}
			},
			success:function(data){
				// 下发任务成功提示
				delayHideS("操作成功");
				hideButton(a);
				selectterminalarr = [];
				filterTerminal();
				$('.container .table th input[type=checkbox]').prop("checked",false);
			}
		});
		
	});     
}

// 发送消息
$(".sendMB").click(function(){
	$(".sendMPop textarea").val("");
	$(".sendMPop textarea").next().show();
	if(selectterminalarr.length==0){
		delayHide("请选择终端!");
	}else{
		$(".sendMPop .describe").html("当前已选择 "+selectterminalarr.length+" 台终端，请输入要发送的消息内容：");
		shade();
		$(".sendMPop").show();
		$(".sendMPop .tableCon table tbody").html('');
		var html = taskListPop();
		$(".sendMPop .tableCon table tbody").append(html);
	}
	
})
//确认发送消息
function sureSMButton(a){

	var messagetext=trim($(".sendMPop .placeholderInput").val());
	if(messagetext.length==0){
		delayHide("请输入内容 !");
	}else{
		var dataa={"type":"message","clients":selectterminalarr,"param":{"text":messagetext}}; 
		$.ajax({
			url:'/mgr/task/_create',
			data:JSON.stringify(dataa),
			type:'POST',
			contentType:'text/plain',
			error:function(xhr,textStatus,errorThrown){
				if(xhr.status==401){
					parent.window.location.href='/';
				}
			},
			success:function(data){
				// 下发任务成功提示
				delayHideS("操作成功");
				hideButton(a);
				selectterminalarr = [];
				filterTerminal();
				$('.container .table th input[type=checkbox]').prop("checked",false);
			}			
		});
	}
	
}
//弹出删除终端关机重启
$(".DPSB").click(function(){
	if(selectterminalarr.length==0){
		delayHide("请选择终端!");
	}else{
		switch ($(this).index()){
			case 4:
			$(".DPSPop .buttons").html("<a onclick='sureDTButton(this)'>立即删除</a>");
			$(".DPSPop .describe").html("是否删除下列终端（在线终端无法删除）");
			$(".DPSPop .title font").html("删除终端")
			break;
			case 1:
			$(".DPSPop .buttons").html("<a onclick='surePOButton(this)'>立即关机</a>");
			$(".DPSPop .describe").html("将对下列终端发送关机任务，请确认");
			$(".DPSPop .title font").html("关机")
			break;
			case 2:
			$(".DPSPop .buttons").html("<a onclick='sureRSButton(this)'>立即重启</a>");
			$(".DPSPop .describe").html("将对下列终端发送重启任务，请确认");
			$(".DPSPop .title font").html("重启")
			break;
			case 3:
			$(".DPSPop .buttons").html("<a onclick='sureLPButton(this)'>立即扫描</a>");
			$(".DPSPop .describe").html("将对下列终端发送扫描漏洞任务，请确认");
			$(".DPSPop .title font").html("扫描漏洞")
			break;
			break;
			case 5:
			$(".DPSPop .buttons").html("<a onclick='sureBNetButton(this)'>断开网络</a><a onclick='sureONetButton(this)'>开启网络</a>");
			$(".DPSPop .describe").html("将对下列终端下发联网控制任务，请确认");
			$(".DPSPop .title font").html("联网控制")
			break;
		}
		
		shade();
		$(".DPSPop").show();
		$(".DPSPop .tableCon table tbody").html('');
		var html = taskListPop();
		$(".DPSPop .tableCon table tbody").append(html);
		
	}


})
//确认删除终端
function sureDTButton(a){
	
	var dataa=selectterminalarr;  
	$.ajax({
		url:'/mgr/clnt/_delete',
		data:JSON.stringify(dataa),
		type:'POST',
		contentType:'text/plain',
		error:function(xhr,textStatus,errorThrown){
			if(xhr.status==401){
				parent.window.location.href='/';
			}
		},
		success:function(data){
			if($(".DPSPop .tableCon tr[online=true]").length>0){
				delayHide("在线终端无法删除");
			}else{
				delayHideS("操作成功");
			}
			
			hideButton(a);
			selectterminalarr=[];
			$(".mainRight .table th .selectAll-th").prop("checked",false);
			filterTerminal();

		}			
	});
}
//确认关机
var looptimePO="";
function surePOButton(){
	$(".DPSPop .buttons").html("<a onclick='stopTask(this)' looptime='looptimePO'>停止下发</a>");

	var dataa={"type":"shutdown","clients":selectterminalarr,"param":{"tickcnt":60}};  
	var createTaskHTml = createTaskFun(dataa);
	$(".DPSPop .tableCon table tbody").html(createTaskHTml);
	looptimePO=setInterval("eachPOTable()", 500);
}
function eachPOTable(){
	if($(".DPSPop #unresponds").length==0){
		clearInterval(looptimePO);
		$(".DPSPop .buttons").html("<a onclick='closePop(this)' looptime='looptimePO'>完成</a>");
	}else{	
		dataa={"taskid":taskid,"view":{"begin":0,"count":selectterminalarr.length}};
		taskAjaxHtml = taskAjaxFun(dataa);
		$(".DPSPop .tableCon table tbody").html(taskAjaxHtml);
	}
}

//确认重启
var looptimeRS="";
function sureRSButton(){
	$(".DPSPop .buttons").html("<a onclick='stopTask(this)' looptime='looptimeRS'>停止下发</a>");
	var dataa={"type":"reboot","clients":selectterminalarr,"param":{"tickcnt":60}};  
	var createTaskHTml = createTaskFun(dataa);
	$(".DPSPop .tableCon table tbody").html(createTaskHTml);
	looptimeRS=setInterval("eachRSTable()", 500);
}
function eachRSTable(){
	if($(".DPSPop #unresponds").length==0){
		clearInterval(looptimePO);
		$(".DPSPop .buttons").html("<a onclick='closePop(this)' looptime='looptimeRS'>完成</a>");
	}else{
		dataa={"taskid":taskid,"view":{"begin":0,"count":selectterminalarr.length}};
		taskAjaxHtml = taskAjaxFun(dataa);
		$(".DPSPop .tableCon table tbody").html(taskAjaxHtml);
		
	}
}



//确认扫描漏洞
function sureLPButton(){
	$(".DPSPop .buttons").html("<a onclick='stopTask(this)' looptime='looptimeClean'>停止扫描</a>");
	var dataa = {"type": "leakrepair_scan","clients": selectterminalarr,"param": {"level": [0, 1]}}
	var createTaskHTml = createTaskFun(dataa);
	$(".DPSPop .tableCon table tbody").html(createTaskHTml);
	looptimeClean = setInterval("eachCleanTable()", 500);
}  

//扫描漏洞未响应的状态
function eachCleanTable() {
		if($(".DPSPop #unresponds").length==0){
		clearInterval(looptimeClean);
		$(".DPSPop .buttons").html("<a onclick='closePop(this)' looptime='looptimeClean'>完成</a>");
	} else {
		dataa = {"taskid": taskid,"view": {"begin": 0,"count": selectterminalarr.length}};
		taskAjaxHtml = taskAjaxFun(dataa);
		$(".DPSPop .tableCon table tbody").html(taskAjaxHtml);
		
	}
}


//远程桌面
/*弹出远程桌面* */
$('.remoteDesktop').click(function(){
	$(".remoteDeskPop .remoteItem input:radio[value='true']").prop('checked','checked');
	$(".remoteDeskPop .remoteItem").eq(0).find("input:radio[value='false']").prop('checked','checked');
	$('.remoteDeskPop textarea').val('帮助解决计算机使用过程中遇到的问题');
	
	var browser=getBrowserInfo(); 
	if(!browser){
		delayHide("浏览器版本过低无法远程!");
		return false;
	}
	if(selectterminalarr.length==0){
		delayHide("请选择终端!");
	}else if(selectterminalarr.length>1){
		delayHide("只可以选择一台终端进行远程!");
	}else if(selectterminalarr.length == 1){
		$(selectterminalarr).each(function(index,value){
			$.ajax({
				url:'/mgr/clnt/_info?id='+value+'',
				data:{},
				type:'get',
				contentType:'text/plain',
				error:function(xhr,textStatus,errorThrown){
					if(xhr.status==401){
						parent.window.location.href='/';
					}
				},
				success:function(data){
					var data=data.data;
					if(data.online == false){
						delayHide("离线终端无法进行远程!");
					}else if(data.prod.ver < '1.0.5.0'){
						delayHide("客户端版本过低无法远程!");
						return false;
					}else{
						$(".remoteDeskPop").show();
						$(".shade").show();
					}
				}
			});
		});
	}
})
/*发起远程控制任务*/
var looptimeRemoteSK='';
var setInterImgval='';

function sureRDButton(){
	var viewOnly = $('.remoteDeskPop input:radio[name=viewOnly]:checked').val();
	var askmsg = $('.remoteDeskPop textarea.askmsg').val();
	var dataa={
		"client_id":selectterminalarr[0],
		"askmsg":askmsg,
		"ask":true,
		"showtips":true,
		"viewOnly":stringToBoolean(viewOnly),
	};
		
	
	$.ajax({
		url:'/mgr/remote/_create',
		data:JSON.stringify(dataa),
		type:'POST',
		async:false,
		contentType:'text/plain',
		error:function(xhr,textStatus,errorThrown){
			if(xhr.status==401){
				parent.window.location.href='/';
			}
		},
		success:function(data){
			if(data.errno == 0){
				var task_id=data.data.task_id;
				$(".remoteDeskPop").hide();
				$(".shade").hide();
				$('.container .table th input[type=checkbox]').prop("checked",false);
				window.open('remoteStu.html?task_id=' + task_id + '&id=' + selectterminalarr[0]);
				selectterminalarr = [];
				filterTerminal();
			}else{
				delayHide(data.errmsg+"!");
			}
		}
	});
}


//导出终端信息
$(".exportTInfB").click(function(){
	// shade();
	// $(".exportTIPop").show();
	if(selectterminalarr.length==0){
		delayHide("请选择终端!");
	}else{
		$.download('/mgr/clnt/_exportinfo', 'post', selectterminalarr); 
	}
	

})
// 文件下载
jQuery.download = function(url, method, param){
	var content = '<form action="'+url+'" method="'+(method||'post')+'">';

	for(var i in param) {
		content += '<input type="hidden" name="clnts[]" value="'+param[i]+'"/>';
	}

	content +='</form>';
	
	jQuery(content).appendTo('body').submit().remove();
}
//断开网络
function sureBNetButton(a){
	alert("正在开发中...");
}
function sureONetButton(a){
	alert("正在开发中...");
}
//操作终端更多按钮
$(".moreB").mouseenter(function(){
	$(this).find(".buttonsGatherC").show();
})
$(".moreB").mouseleave(function(){
	$(this).find(".buttonsGatherC").hide();
})
//调整页面内元素高度
tbodyAddHeight();
function tbodyAddHeight(){
	var mainlefth = parent.$("#iframe #mainFrame").height();
	$(".main .mainLeft .groupsPage").css({height:mainlefth-215});
	$(".main .mainRight .table tbody").css({height:mainlefth-285});
}

setTimeout(function(){
	showOrHidemgb();
},100)
window.onresize = function(){
	tbodyAddHeight();
	showOrHidemgb();
}
