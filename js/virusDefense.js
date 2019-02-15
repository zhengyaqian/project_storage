//loading执行
grouplist();
$("#txtBeginDate").calendar();
$("#txtEndDate").calendar();
$("#txtBeginDate").val(GetDateStr(-6));
$("#txtEndDate").val(GetDateStr(0));
parent.$(".footer").hide();

//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a").removeClass("current");
parent.$(".nav .container a[name='virusDefense.html']").addClass("current");



document.cookie='page=virusDefense.html';
//按钮样式

$(".bu").click(function(){
	$(this).siblings(".bu").removeClass("current");
	$(this).addClass("current");
});
//下拉列表
$("#groupSelect").change(function(){
    accEvent();
})
//类型选择
$("#functionBlock .bu").click(function(){
	$('.table th.th-ordery').removeClass().addClass('th-ordery');
	$('.main .table th').removeAttr('index indexCls');
    accEvent();
    
})
// 搜索类型选择
$("#selectVD,#selectVT").change(function(){
    accEvent();
})

//选项卡选择

$(".filterBlock  .tabButton").change(function(){
    if($(this).val()==0){
        $("#selectVD").show();
        $("#selectVT").hide();
    }else{
        $("#selectVD").hide();
        $("#selectVT").show();
    }
    accEvent();
})

//选择时间
$("#specialTime select").change(function(){

    if($(this).find("option:selected").val()==0){
        $("#txtBeginDate").val(GetDateStr(-6));
        $("#txtEndDate").val(GetDateStr(0));
        $(".filterBlock .middle").hide(200);
        accEvent();
    }else if($(this).find("option:selected").val()==1){
        $("#txtBeginDate").val(GetDateStr(-29));
        $("#txtEndDate").val(GetDateStr(0));
        $(".filterBlock .middle").hide(200);
        accEvent();
    }else if($(this).find("option:selected").val()==2){
        $("#txtBeginDate").val(GetDateStr(-89));
        $("#txtEndDate").val(GetDateStr(0));
        $(".filterBlock .middle").hide(200);
        accEvent();
    }else if($(this).find("option:selected").val()==3){
        $("#txtBeginDate").val(GetDateStr(-364));
        $("#txtEndDate").val(GetDateStr(0));
        $(".filterBlock .middle").hide(200);
        accEvent();
    }else if($(this).find("option:selected").val()==4){
        $(".filterBlock .middle").show(200);
    }
    
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
        	}else{
        		
        	}
            
        },
        success:function(data){
            
            var list=data.data.list;
            var html="";
            html+="<option groupid='0'>全部分组</option>";

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
	$.download('/mgr/log/_export', 'post', dataa); 

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
function accEvnetParam(start){
	var begintime=getBeginTimes($("#txtBeginDate").val());
    var endtime=getEndTimes($("#txtEndDate").val());

    var sta="";
    var type="";
    var dataa="";
    var groupby="";
    if(start == undefined) {
		start = 0;
	}else{
		start = start;
	}
    var threatname="";
    var hostname="";

    if($(".filterBlock .tabButton option:checked").val()==0){
        if($("#selectVD").val()=="0"){
            hostname=$("#searchKey").val();
        }else{
            threatname=$("#searchKey").val();
        }
    }else{
        hostname=$("#searchKey").val();
    }
    var groupid=parseInt($("#groupSelect option:selected").attr("groupid"));
    if($(".filterBlock .tabButton option:checked").val()==0){
        groupby="detail";
    }else if($(".filterBlock .tabButton option:checked").val()==1){
        groupby="client";
    }
    
    dataa={"fname":"","date":{"begin":begintime,"end":endtime},"groupby":groupby,"view":{"begin":start,"count":numperpage},"filter":{"threat_name":threatname,"hostname":hostname}}

    if($("#functionBlock .current").index()==1){dataa.fname = "antivirus";
    }else if($("#functionBlock .current").index()==2){dataa.fname = "scan";
    }else if($("#functionBlock .current").index()==3 ){dataa.fname = "filemon";
    }else if($("#functionBlock .current").index()==4){dataa.fname = "behavior";
    }else if($("#functionBlock .current").index()==5 ){dataa.fname = "udiskmon";
    }else if($("#functionBlock .current").index()==6){dataa.fname = "dlmon";
    }else if($("#functionBlock .current").index()==7){dataa.fname = "mail";}

	if(parseInt($("#groupSelect option:selected").attr("groupid"))!==0 && groupid){
    		dataa.group_id = groupid;
    }
    var type = $('.table th.th-ordery.th-ordery-current').attr('type');
    var orderClass = $('.table th.th-ordery.th-ordery-current').attr('class');
    dataa = sortingDataFun(dataa,type,orderClass);
	
	return dataa;
}
accEvent();
//排序

$(document).on('click','.tableContainer .table th.th-ordery',function(){
	var toggleClass = $(this).attr('class');
	var _this = $(this);
    sortingFun(_this,toggleClass);

	var currentPage = $(this).parents('.tableContainer').find('.tcdPageCode span.current').text();
	var currentNum = $(this).parents('.tableContainer').find('#numperpageinput').val();
	var start = (parseInt(currentPage) - 1) * parseInt(currentNum);
	accEvent(start);
})
//按终端列表信息
function columnsDataTerListFun (){
	var columns = [
        {
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {
				return "<span style='width:400px;' title='"+safeStr(data)+"' class='filePath'>"+safeStr(data)+"</span>";
			}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {
                if(data==""){
                    return "(已删除终端)"; 
               }else{
                    return safeStr(data);
               }
            }},
		},{
			type: "count",title: "威胁数量",name: "count",
			tHead:{style: {width: "20%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {return "<a class='underline cursor blackfont seeDetail'>"+data+"</a>"}},
		}]
	
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
//按详情列表信息
function columnsDataDetialListFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "14%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "14%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "17%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "17%"},customFunc: function (data, row, i) {return "<a class='underline cursor filePath blackfont seeDetail' client='"+row.client_id+"' title="+safeStr(pathtitle(data))+" >"+safeStr(data)+"</a>";}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "17%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "17%"},customFunc: function (data, row, i) {
                if(data==""){
                    return "<span class='filePath' title='(已删除终端)'>(已删除终端)</span>";
                }else{
                    return "<span class='filePath' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";
                }
            }},
		},{
			type: "virus_name",title: "病毒名",name: "virus_name",
			tHead:{style: {width: "17%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "17%"},customFunc: function (data, row, i) {return "<a class='underline cursor filePath blackfont seeDetail' virus_id='"+row.virus_id+"' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</a>"}},
		},{
			type: "file_name",title: "威胁来源",name: "file_name",
			tHead:{style: {width: "17%"},class: "th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "17%"},customFunc: function (data, row, i) {
                if(data=="mail"){
                    return "<span class='filePath' title="+safeStr(pathtitle(data.replace('<','&lt;').replace('>','&gt;').replace('"','')))+">"+safeStr(data.replace('<','&lt;').replace('>','&gt;'))+"</span>";
                }else{
                    return "<span class='filePath' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";
                }
            }},
		},{
			type: "fname",title: "检出方式",name: "fname",
			tHead:{style: {width: "10%"},class: "th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) {
                if(data=="scan"){ return "病毒查杀"; 
                }else if(data=="filemon"){ return "文件实时监控"; 
                }else if(data=="behavior"){return "恶意行为监控"; 
                }else if(data=="dlmon"){ return "下载保护";  
                }else if(data=="udiskmon"){ return "U盘保护";
                }else if(data=="mail"){return "邮件监控"; }
            }},
		},{
            type: "result",title: "状态",name: "result",
            tHead:{style: {width: "8%"},class: "th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "8%"},customFunc: function (data, row, i) {
                if(data==0){return "处理失败";
                }else if(data==1){ return "处理失败";
                }else if(data==2){return "已阻止";
                }else if(data==3){return "已删除";
                }else if(data==4){return "已清除";
                }else if(data==5){ return "已信任";
                }else if(data==6){return "已忽略";}
            }},
		}]
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
var tabListstr = columnsDataDetialListFun();
$(document).on('change','.filterBlock .tabButton',function(){
    $('.tableContainer .table').html('');
    if($(this).find("option:checked").val()==1){
        tabListstr = columnsDataTerListFun();
    }else if($(this).find("option:checked").val()==0){
        tabListstr = columnsDataDetialListFun();
    }
})
var ajaxtable=null;
function accEvent(start){
    if(ajaxtable){
    ajaxtable.abort();  
    }
   
    var dataa = accEvnetParam(start);
    $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
    ajaxtable=
    $.ajax({
        url:'/mgr/log/_search',
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
            tabListstr.setData(list);
            if(list.length==0){
                $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
            }
            tbodyAddHeight();
			
            $(".clearfloat").remove();
            $(".tcdPageCode").remove();
            $(".totalPages").remove();
            $(".numperpage").remove();
            $(".tableContainer").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left' class='totalPages'>共 "+data.data.view.total+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><a style='font-size:12px;float:right;line-height:54px;padding-right:20px;color:#6a6c6e' class='numperpage'>每页<input type='text' id='numperpageinput' value="+numperpage+" style='font-size:12px;width:40px;height:24px;margin:0 4px;vertical-align:middle;padding:0 10px;'>条</a><div class='clear clearfloat'></div>");
            var current = (dataa.view.begin/dataa.view.count) + 1;
            $(".tcdPageCode").createPage({
                pageCount:total,
                current:parseInt(current),
                backFn:function(pageIndex){
                    start=(pageIndex-1)*numperpage;

					var dataa = accEvnetParam(start);
                    $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
                    ajaxtable=
                    $.ajax({
                        url:'/mgr/log/_search',
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
                            tabListstr.setData(list);
                            tbodyAddHeight();
                        }
                    })

                }
            })
        }
    });

	
}

function searchList(){
    accEvent();
}

//按详情查看日志详情
function seeDetailFloat(a){
    $(a).next().show();
}
function closeDetailFloat(a){
    $(a).parents(".detailFloat").hide();
}
//关闭弹层
$(".closeW").click(function(){
    $(".shade").hide();
    parent.$(".topshade").hide();
    $(this).parent().parent().hide();
    $(".taskDetailPop .taskDetailTable").prop("scrollTop","0");

});
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
var threatnamee="";
var clientid="";
var totalnum="";
var clientorvirus="";
var virusid="";
var ajaxdetailtable=null;
var isbehavior="";
//按详情终端名称列表详情
function columnsDataDetailNamePopFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "file_path",title: "威胁来源",name: "file_path",
			tHead:{style: {width: "26%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "26%"},customFunc: function (data, row, i) {return "<span class='filePath' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";}},
		},{
			type: "virus_name",title: "病毒",name: "virus_name",
			tHead:{style: {width: "34%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "34"},customFunc: function (data, row, i) {
                var trIndex=$(".taskDetailPop").attr('trIndex');
                var tdIndex=$(".taskDetailPop").attr('tdIndex');
                isbehavior=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).find("td").eq(5).html();
                if(isbehavior!=="恶意行为监控"){
                    return "<span class='filePath' title='"+safeStr(pathtitle(data))+"("+safeStr(pathtitle(row.virus_id))+")'>"+safeStr(data)+"</span>";
                }else{
                    return "<span class='filePath' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";
                }
            }},
		},{
			type: "result",title: "状态",name: "result",
			tHead:{style: {width: "10%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) {
                if(data==0 || data==1){return "处理失败";
                }else if(data==2){return "已阻止";
                }else if(data==3){return "已删除";
                }else if(data==4){return "已清除";
                }else if(data==5){return "已信任";
                }else if(data){return "已忽略";}
            }}
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.taskDetailTable'));
	return tabstr;
}
//按详情病毒名称列表详情
function columnsDataVirusNamePopFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "28%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "28%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "28%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "28%"},customFunc: function (data, row, i) {return "<span class='filePath' style='width:150px;' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "28%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "28"},customFunc: function (data, row, i) {if(data==""){return "(已删除终端";}else{return safeStr(data);} }},
		},{
			type: "result",title: "状态",name: "result",
			tHead:{style: {width: "16%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "16%"},customFunc: function (data, row, i) {
                if(data==0 || data==1){return "处理失败";
                }else if(data==2){return "已阻止";
                }else if(data==3){return "已删除";
                }else if(data==4){return "已清除";
                }else if(data==5){return "已信任";
                }else if(data){return "已忽略";}
            }}
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.taskDetailTable'));
	return tabstr;
}
var tabListPopstr = "";
//弹出详情
$(document).on('click','.tableContainer .seeDetail',function(){
    var trIndex = $(this).parents('tr').index();
    var tdIndex = $(this).parent('td').index();
    $(".taskDetailPop").attr('trIndex',trIndex);
    $(".taskDetailPop").attr('tdIndex',tdIndex);
    $(".taskDetailPop").attr('client',$(this).attr('client'));
    $(".taskDetailPop").attr('virus_id',$(this).attr('virus_id'));
    $('.taskDetailTable').html('');
    var opChecked = $(".filterBlock .tabButton option:checked").val();
    if(opChecked == 0 && parseInt(tdIndex) == 1 || opChecked == 1){
        tabListPopstr = columnsDataDetailNamePopFun();
    }else if(opChecked == 0 && parseInt(tdIndex) == 3){
        tabListPopstr = columnsDataVirusNamePopFun();
    }else if(opChecked == 1){
        tabListPopstr = columnsDataDetailNamePopFun();
    }
    $(".taskDetailPop").show();
    shade();
    seeDetailPop();
})
//详情参数
function seeDetailParam(start){
    var trIndex=$(".taskDetailPop").attr('trIndex');
    var tdIndex=$(".taskDetailPop").attr('tdIndex');
    var begintime=getBeginTimes($("#txtBeginDate").val());
    var endtime=getEndTimes($("#txtEndDate").val());
    virusid=$('.taskDetailPop').attr('virus_id');
    
    if(start == undefined) {
		start = 0;
	}else{
		start = start;
    }
    clientid=parseInt($('.taskDetailPop').attr('client'));
    
    if($(".filterBlock .tabButton option:checked").val()==0 && parseInt(tdIndex)==1){
        var groupname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(2).find("span").html();
        var hostname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(1).find("a").html();
        var dataa={"fname":"antivirus","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
       
        $(".taskDetailPop .title font").html($('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(5).html());
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a> 终端分组 : "+groupname);
    }else if($(".filterBlock .tabButton option:checked").val()==0 && parseInt(tdIndex)==3){
        threatnamee=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(3).find("a").html();
        var dataa={"fname":"antivirus","date":{"begin":begintime,"end":endtime},"groupby":"event","filter":{"threat_name":threatnamee},"view":{"begin":start,"count":9}};
        if(isbehavior!=="恶意行为监控"){
            $(".taskDetailPop .title font").html($('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(5).html());
            $(".taskDetailPop .describe").html("病毒ID : "+virusid+" , "+"病毒名称 : "+threatnamee);
        }else{
            $(".taskDetailPop .title font").html($('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(5).html());
            $(".taskDetailPop .describe").html("病毒名称 : "+threatnamee);
        }
       
    }else if($(".filterBlock .tabButton option:checked").val()==1){
        var groupname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(1).html();
        var hostname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(0).find('span').html();
        var dataa={"fname":"antivirus","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
       
        if($("#functionBlock .current").index()==1){
            $(".taskDetailPop .title font").html("病毒防御");
        }else if($("#functionBlock .current").index()==2){
            $(".taskDetailPop .title font").html("病毒查杀");
        }else if($("#functionBlock .current").index()==3){
            $(".taskDetailPop .title font").html("文件实时监控");
        }else if($("#functionBlock .current").index()==4){
            $(".taskDetailPop .title font").html("恶意行为监控");
        }else if($("#functionBlock .current").index()==5){
            $(".taskDetailPop .title font").html("U盘保护");
        }else if($("#functionBlock .current").index()==6){
            $(".taskDetailPop .title font").html("下载保护");
        }else if($("#functionBlock .current").index()==7){
            $(".taskDetailPop .title font").html("邮件监控");
        }
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a> 终端分组 : "+groupname);
    }
    var type = $('.taskDetailPop .taskDetailTable th.th-ordery.th-ordery-current').attr('type');
    var orderClass = $('.taskDetailPop .taskDetailTable th.th-ordery.th-ordery-current').attr('class');
    dataa = sortingDataFun(dataa,type,orderClass);

    return dataa;
}
function seeDetailPop(start){
    if(ajaxdetailtable){
        ajaxdetailtable.abort();
    }
    shade();
    var dataa = seeDetailParam(start);
    $(".taskDetailPop tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:201px;' class='detailLoading'><img src='images/loading.gif'></div>");

    ajaxdetailtable=
    $.ajax({
        url:'/mgr/log/_detail',
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
            tabListPopstr.setData(list);

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
                        url:'/mgr/log/_detail',
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
    })
}

//调整页面内元素高度
tbodyAddHeight();
function tbodyAddHeight(){
    var mainlefth=parent.$("#iframe #mainFrame").height();
    $(".main .table tbody").css({height:mainlefth-347});
}


window.onresize = function(){
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .table tbody").css({height:mainlefth-347});

}
