//loading执行
grouplist();
$("#txtBeginDate").calendar();
$("#txtEndDate").calendar();
$("#txtBeginDate").val(GetDateStr(-6));
$("#txtEndDate").val(GetDateStr(0));

//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a[name='virusDefense.html']").addClass("current");
parent.$(".nav .container a[name='virusDefense.html']").siblings().removeClass("current");
parent.$(".footer").show();

document.cookie='page=bugRepair.html';
//按钮样式

$(".tabButton").change(function(){
    $('.table').html('');
    if($(".filterBlock .tabButton option:checked").val()==0){
        tabListstr =columnsDataDetailListFun();
    }else if($(".filterBlock .tabButton option:checked").val()==1){
        tabListstr =columnsDataTerListFun();
    }
});



//下拉列表
$("#groupSelect").change(function(){
    accEvent();
})

$("#specialLevel").change(function(){
    accEvent();
})
//选项卡选择
$(".filterBlock .tabButton").change(function(){
    accEvent();
})

//选择时间
$("#specialTime select").change(function(){
    var optionVal = $(this).find("option:selected").val();
    var begintime = 0;
    switch(parseInt(optionVal)){
        case 0:
            begintime = -6;
            break;
        case 1:
            begintime = -29;
            break;
        case 2:
            begintime = -89;
            break;
        case 3:
            begintime = -364;
            break;
        default:
            $(".filterBlock .middle").show(200);
            break;
    }
    if(optionVal != 4){
        if(begintime != 0){
            $("#txtBeginDate").val(GetDateStr(begintime));
        }
        $("#txtEndDate").val(GetDateStr(0));
        $(".filterBlock .middle").hide(200);
    }
    accEvent();
})
function grouplist(){
    //加载分组列表
    $.ajax({
        url:'/mgr/group/_dict',
        dataType:'json',
        data:{},
        async:true,
        type:'GET',
        error:function(xhr,textStatus,errorThrown){
        	if(xhr.status==401){
        	    parent.window.location.href='/';
        	}
        },
        success:function(data){
            
            var list=data.data.list;
            var html="";
            html+="<option groupid=''>全部分组</option>";
            for(i=0;i<list.length;i++){
                html+="<option groupid="+list[i].group_id+">"+safeStr(list[i].group_name)+"</option>";
            }
            $("#groupSelect").html(html);
        }
    });
}
//导出
$(document).on('click','.exportLog',function(){
 	var dataa = accEvnetParam();
	$.download('/mgr/leakrepair/_export', 'post', dataa); 

})

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
    accEvent();
})
//排序


$(document).on('click','.tableContainer .table th',function(){
	var toggleClass = $(this).attr('class');
	var _this = $(this);
    sortingFun(_this,toggleClass);
	var currentPage = $(this).parents('.tableContainer').find('.tcdPageCode span.current').text();
	var currentNum = $(this).parents('.tableContainer').find('#numperpageinput').val();
	var start = (parseInt(currentPage) - 1) * parseInt(currentNum);
	accEvent(start);
})
//请求参数
function accEvnetParam(start){
	var begintime=getBeginTimes($("#txtBeginDate").val());
    var endtime=getEndTimes($("#txtEndDate").val());

    var dataa="";
    var groupby="";
    if(start == undefined) {
		start = 0;
	}else{
		start = start;
	}
    
    var hostname="";
    
    var hostname=$("#searchKey").val();
	var level=$("#specialLevel option:selected").val();
    var groupid=parseInt($("#groupSelect option:selected").attr("groupid"));
    if($(".filterBlock .tabButton option:checked").val()==1){
        groupby="client";
    }else{
        groupby="detail";
    }
    dataa={"date":{"begin":begintime,"end":endtime},"groupby":groupby,"view":{"begin":start,"count":numperpage},"filter":{"hostname":hostname}}
    if(level !== ''){
    	dataa.filter['level']=parseInt(level);
    }
    if(groupid){
    	dataa.filter['group_id']=groupid;
    }
    
    var type = $('.table th.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.table th.th-ordery.th-ordery-current').attr('class');
	dataa = sortingDataFun(dataa,type,orderClass);
	return dataa;
}
//按详情列表详情
function columnsDataDetailListFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "12%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "12%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "10%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) {return "<span style='width:90px;' class='underline cursor blackfont filePath ctrlPopBtn' client="+row.client_id+" title='"+safeStr(data)+"'>"+safeStr(data)+"</span>";}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "10%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) {if(data==""){return "(已删除终端)";}else{return safeStr(data);} }},
		},{
			type: "kbid",title: "补丁编号",name: "kbid",
			tHead:{style: {width: "10%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) {return "<span class='underline cursor blackfont  ctrlPopBtn' kbid="+data+">KB"+data+"</span>";}},
		},{
			type: "desc",title: "补丁描述",name: "desc",
			tHead:{style: {width: "28%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "28%"},customFunc: function (data, row, i) {return "<span class='filePath loophtWidth' style='width:280px;' title='"+data+"'>"+data+"</span>";}},
		},{
			type: "level",title: "补丁类型",name: "level",
			tHead:{style: {width: "10%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) {
                if(data== 0){return "高危补丁";
                }else if(data == 1){ return "功能更新";}
            }},
		},{
			type: "state",title: "状态",name: "state",
			tHead:{style: {width: "8%"},customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
            tBody:{style: {width: "8%"},customFunc: function (data, row, i) {
                return patchStateField(data);
            }}
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
var tabListstr = columnsDataDetailListFun();
//按终端不同block名称列表详情
function columnsDataTerListFun (){
	var columns = [
	    {
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {return "<a class='filePath' style='width:400px;' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</a>"}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {if(data==""){return "(已删除终端)";}else{return safeStr(data);} }},
		},{
			type: "count",title: "漏洞数量",name: "count",
			tHead:{style: {width: "20%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {return "<span class='underline cursor blackfont  ctrlPopBtn' client="+row.client_id+">"+data+"</span>";}},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
accEvent();
var ajaxtable=null;
function accEvent(start){
    if(ajaxtable){
        ajaxtable.abort();
    }
    var dataa = accEvnetParam(start);
    $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
    ajaxtable=
    $.ajax({
        url:'/mgr/leakrepair/_history',
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
            var total=Math.ceil(data.data.view.total/numperpage);
            if(list==null || list.length == 0){
                $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
            }else{
                tabListstr.setData(list);
            }
            tbodyAddHeight();
            
           
            $(".tableContainer .clearfloat").remove();
            $(".tableContainer .tcdPageCode").remove();
            $(".tableContainer .totalPages").remove();
            $(".numperpage").remove();
            $(".tableContainer").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+data.data.view.total+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><a style='font-size:12px;float:right;line-height:54px;padding-right:20px;color:#6a6c6e' class='numperpage'>每页<input type='text' id='numperpageinput' value="+numperpage+" style='font-size:12px;width:40px;height:24px;margin:0 4px;vertical-align:middle;padding:0 10px;'>条</a><div class='clear clearfloat'></div>");
            var current = (dataa.view.begin/dataa.view.count) + 1;
            $(".tableContainer .tcdPageCode").createPage({
                pageCount:total,
                current:parseInt(current),
                backFn:function(pageIndex){
                    if(ajaxtable){
                        ajaxtable.abort();
                    }
                    start=(pageIndex-1)*numperpage;
                    dataa.view.begin = start;
                    $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
                    ajaxtable=
                    $.ajax({
                        url:'/mgr/leakrepair/_history',
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
                            tabListstr.setData(list);
                            tbodyAddHeight();
                        }
                    })
                }
            }) 

        }
    });	
}
//详情排序


$(document).on('click','.taskDetailPop .taskDetailTable th.th-ordery',function(){
    var toggleClass = $(this).attr('class');
	var _this = $(this);
    sortingFun(_this,toggleClass);
	var currentPage = $(this).parents('.taskDetailPop').find('.tcdPageCode span.current').text();
	var currentNum = 9;
	var start = (parseInt(currentPage) - 1) * 9;
	seeDetailPop(start);
})
//按详情--终端名称--弹窗列表详情
function columnsDataDetail_NamePopFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "kbid",title: "补丁编号",name: "kbid",
			tHead:{style: {width: "26%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "26%"},customFunc: function (data, row, i) {return "KB"+data;}},
		},{
			type: "level",title: "补丁类型",name: "level",
			tHead:{style: {width: "20%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {
                if(data== 0){return "高危补丁";
                }else if(data == 1){ return "功能更新";}
            }},
		},{
			type: "state",title: "状态",name: "state",
			tHead:{style: {width: "10%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
            tBody:{style: {width: "10%"},customFunc: function (data, row, i) {
                return patchStateField(data);
            }}
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.taskDetailTable'));
	return tabstr;
}
//按详情--补丁编号--弹窗列表详情
function columnsDataDetail_kbidPopFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "26%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "26%"},customFunc: function (data, row, i) {return "<span style='width:150px;' title='"+safeStr(data)+"' class='filePath'>"+safeStr(data)+"</span>";}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "20%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {
                if(data == ""){return "(已删除终端)";
                }else{return data;}
            }},
		},{
			type: "state",title: "状态",name: "state",
			tHead:{style: {width: "10%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
            tBody:{style: {width: "10%"},customFunc: function (data, row, i) {
                return patchStateField(data);
            }}
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.taskDetailTable'));
	return tabstr;
}
//漏洞修复弹窗
var tabListPopstr;
var ajaxdetailtable=null;
$(document).on('click','.tableContainer .ctrlPopBtn',function(){
    var pageIndex=$('.filterBlock .tabButton option:checked').val();
    var trIndex = $(this).parents('tr').index();
    var tdIndex = $(this).parent('td').index();
    $(".taskDetailPop").attr('trIndex',trIndex);
    $(".taskDetailPop").attr('tdIndex',tdIndex);
    $('.taskDetailTable').html('');
    if(tdIndex == 1 && pageIndex == 0){
        tabListPopstr = columnsDataDetail_NamePopFun();
    }else if(tdIndex == 3 && pageIndex == 0){
        tabListPopstr = columnsDataDetail_kbidPopFun();
    }else if(tdIndex == 2 && pageIndex == 1){
        tabListPopstr = columnsDataDetail_NamePopFun();
    }
    $(".taskDetailPop").show();
    shade();
    seeDetailPop();
	
})
function seeDetailPop(start){
	if(ajaxdetailtable){
        ajaxdetailtable.abort();
    }
    if(start == undefined) {
		start = 0;
	}else{
		start = start;
    }
    var pageIndex=$('.filterBlock .tabButton option:checked').val();
    var trIndex = $(".taskDetailPop").attr('trIndex');
    var tdIndex = $(".taskDetailPop").attr('tdIndex');
	var begintime=getBeginTimes($("#txtBeginDate").val());
    var endtime=getEndTimes($("#txtEndDate").val());
    var td = $('.tableContainer .table tbody tr').eq(trIndex).children("td");
    var describeHtml = '';
    $(".taskDetailPop tbody").append("<div style='text-align:center;color:#6a6c6e;padding-top:201px;' class='detailLoading'><img src='images/loading.gif'></div>");
	if(tdIndex == 1 && pageIndex == 0){
		var hostname = td.eq(1).find('span').text();
		var groupname = td.eq(2).text();
		var clientid = td.eq(1).find('span').attr('client');
		describeHtml = "终端名称 : <a class='filePath popHostname' title='"+safeStr(hostname)+"'>"+safeStr(hostname)+" ,</a> 终端分组 : "+groupname;
        
	}else if(tdIndex == 3 && pageIndex == 0){
		var level = td.eq(5).text();
		var kbid = td.eq(3).text();
		describeHtml = "补丁编号 : "+kbid+" , 补丁类型 : "+level;
	
	}else if(tdIndex == 2 && pageIndex == 1){
		var hostname = td.eq(0).find('a').text();
		var groupname = td.eq(1).text();
		var clientid = td.eq(0).find('a').attr('client');
        describeHtml = "终端名称 :<a class='filePath popHostname' title='"+safeStr(hostname)+"'>"+safeStr(hostname)+" ,</a>终端分组 : "+safeStr(groupname);

    }
    $(".taskDetailPop .describe").html(describeHtml);
    var dataa={"date":{"begin":begintime,"end":endtime},"groupby":"detail","client_id":clientid,"view":{"begin":start,"count":9}};
    var type = $('.taskDetailPop .taskDetailTable th.th-ordery.th-ordery-current').attr('type');
    var orderClass = $('.taskDetailPop .taskDetailTable th.th-ordery.th-ordery-current').attr('class');
    dataa = sortingDataFun(dataa,type,orderClass);
    ajaxdetailtable=
    $.ajax({
        url:'/mgr/leakrepair/_history',
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
            var total=Math.ceil(totalnum/9);
            
            if(list==null){
                $(".taskDetailTable tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
            }else{
                tabListPopstr.setData(list);
            }

            // 分页
            $(".taskDetailPop .clearfloat").remove();
            $(".taskDetailPop .tcdPageCode").remove();
            $(".taskDetailPop .totalPages").remove();
            $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
            var current = (dataa.view.begin/dataa.view.count) + 1;
            $(".taskDetailPop .tcdPageCode").createPage({
                pageCount:total,
                current:parseInt(current),
                backFn:function(pageIndex){
                    start=(pageIndex-1)*9;
                    dataa.view.begin = start;

                    ajaxdetailtable=
                    $.ajax({
                        url:'/mgr/leakrepair/_history',
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
                            tabListPopstr.setData(list);
                        }
                            
                    })
                }
            })
        }
    });
}



//关闭弹层
$(document).on('click','.closeW',function(){
    $(".shade").hide();
    parent.$(".topshade").hide();
    $(this).parent().parent().hide();
    $(".taskDetailPop .taskDetailTable").prop("scrollTop","0");
});

tbodyAddHeight();
//调整页面内元素高度
function tbodyAddHeight(){
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .table tbody").css({height:mainlefth-347});
}
window.onresize = function(){
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .table tbody").css({height:mainlefth-347});

}

