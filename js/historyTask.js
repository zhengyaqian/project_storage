//loading执行

$("#txtBeginDate").calendar();
$("#txtEndDate").calendar();
$("#txtBeginDate").val(GetDateStr(-6));
$("#txtEndDate").val(GetDateStr(0));
//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a[name='virusDefense.html']").addClass("current");
parent.$(".nav .container a[name='virusDefense.html']").siblings().removeClass("current");
parent.$(".footer").hide();

document.cookie='page=historyTask.html';
//按钮样式

$(".bu").click(function(){
	$(this).siblings(".bu").removeClass("current");
	$(this).addClass("current");
});


//下拉列表
$("#status").change(function(){
    accEvent();
})
//类型选择
$("#functionBlock .bu").click(function(){
    accEvent();
    $('.table th.th-ordery').removeClass().addClass('th-ordery');
	$('.main .table th').removeAttr('index indexCls');
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

//任务详情排序


$(document).on('click','.taskDetailPop .taskDetailTable th.th-ordery',function(){
	var toggleClass = $(this).attr('class');
	var _this = $(this);
    sortingFun(_this,toggleClass);
	var currentPage = $(this).parents('.taskDetailPop').find('.tcdPageCode span.current').text();
	var currentNum = 9;
	var start = (parseInt(currentPage) - 1) * 9;
	taskDetailPop(start);
})
var tabListPopstr;
//弹出任务详情
$(document).on('click','.tableContainer .seeDetail',function(){
	// 判断任务类型控制详情弹窗每页多少行
    $(".taskDetailPop").attr('trIndex',$(this).parents('tr').index());
    $(".taskDetailPop").attr('taskid',$(this).attr('taskid'));

    $(".taskDetailPop").show();
    $(".taskDetailPop .taskDetailTable").html('');
    tabListPopstr = columnsDataDetailPopFun();
    shade();
    taskDetailPop();
})
function columnsDataDetailPopFun (){
	var columns = [
      {
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "25%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "25%"},customFunc: function (data, row, i) {return "<span style='width:150px;' class='filePath' title="+safeStr(data)+">"+safeStr(data)+"</span>"}},
		},{
			type: "groupname",title: "终端分组",name: "groupname",
			tHead:{style: {width: "25%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "25%"},customFunc: function (data, row, i) {if(data==""){return "(已删除终端)";}else{return safeStr(data);} }}
		},{
			type: "status",title: "任务状态",name: "status",
			tHead:{style: {width: "25%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>" }},
			tBody:{style: {width: "25%"},customFunc: function (data, row, i) { 
                var html = fieldHandle(taskStatusField,data);
                if(html=="--"){
                    return "终端异常</td>";
                }else{
                    return fieldHandle(taskStatusField,data);
                }
            }},
		},{
			type: "",title: "备注",name: "status",
			tHead:{style: {width: "25%"},customFunc: function (data, row, i) {return ""}},
			tBody:{style: {width: "25%"},customFunc: function (data, row, i) {
                var html = fieldHandle(taskStatusField,data);
                if(html=="--"){
                    return "终端服务异常，无法接受任务</td>";
                }else{
                    return fieldHandle(taskStatusField,data);
                }
            }}
		},
	]
	
	var tabstr = new createTable(columns,[] ,$('.taskDetailTable'));
	return tabstr;
}


//弹窗详情配置信息
function taskConfigFun(data,timetext){
    switch(data.data.type){
        case "quick_scan":
        case "full_scan":
        case "update":
        case "shutdown":
        case "reboot":
        case "leakrepair_repair":
        case "leakrepair_scan":
        case "vnc_launch":
            $(".taskDetailPop .describe").removeClass("describebg");
            $(".taskDetailPop .softInf").hide();
            $(".taskDetailPop .taskDetailTable tbody").height("315px");
            $(".taskDetailPop .messageTxt").hide();
        break;

        case "msg_uninstall":
        case "msg_distrfile":
        case "message":
        case "migrate":
            $(".taskDetailPop .describe").addClass("describebg");
            $(".taskDetailPop .softInf").show();
            $(".taskDetailPop .messageTxt").hide();
            $(".taskDetailPop .taskDetailTable tbody").height("245px");
            if(data.data.type == "message"){
                $(".taskDetailPop .softInf").hide();
                $(".taskDetailPop .messageTxt").show();
            }
        break;

    }

    if(data.data.type=="quick_scan"){
        var configB="<span class='fastSKCB'></span>";
        var param = data.data.param;
        scanType(param);
        $(".taskDetailPop .describe").html("快速查杀时间 : "+timetext+configB);
        $(".fastSKCPop input").prop("disabled",true);

    }else if(data.data.type=="full_scan"){
        var configB="<span class='overallSKCB'></span>";
        $(".taskDetailPop .describe").html("全盘查杀时间 : "+timetext+configB);

        var param = data.data.param;
        scanType(param);

        if(data.data.param['decompo.limit.size']){
            var overallpara1=data.data.param['decompo.limit.size'].enable;
            var overallpara1V=data.data.param['decompo.limit.size'].value;
        }
        if(data.data.param['scan.exclusion.ext']){
            var overallpara2=data.data.param['scan.exclusion.ext'].enable;
            var overallpara2V=data.data.param['scan.exclusion.ext'].value;
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
        $(".overallSKCPop input").prop("disabled",true);

    }else if(data.data.type=="msg_uninstall"){
        $(".taskDetailPop .describe").html("软件卸载时间 : "+timetext);
        var softinf="<span>卸载软件 : "+safeStr(data.data.param.software.name)+"    "+safeStr(data.data.param.software.version)+"</span><br/><span>软件发布者 : "+safeStr(data.data.param.software.publisher)+"</span>";
        $(".taskDetailPop .softInf").html(softinf);
    }else if(data.data.type=="msg_distrfile"){
        $(".taskDetailPop .describe").html("文件分发时间 : "+timetext);
        var softinf="<span class='distrfName'>分发文件 : "+safeStr(data.data.param.name)+"</span><br/><p>通知 : "+safeStr(data.data.param.text)+"</p>";
        $(".taskDetailPop .softInf").html(softinf);
    }else if(data.data.type=="message"){
        $(".taskDetailPop .describe").html("通知时间 : "+safeStr(timetext)); 
        var messagetxt="<p>"+"通知内容 : "+safeStr(data.data.param.text)+"</p>";
        $(".taskDetailPop .messageTxt").html(messagetxt);
    }else if(data.data.type=="update"){
        $(".taskDetailPop .describe").html("升级时间  : "+timetext);  
    }else if(data.data.type=="shutdown"){
        $(".taskDetailPop .describe").html("关机时间  : "+timetext);  
    }else if(data.data.type=="reboot"){
        $(".taskDetailPop .describe").html("重启时间  : "+timetext);  
    }else if(data.data.type=="migrate"){
        $(".taskDetailPop .describe").html("迁移时间  : "+timetext); 
        if(data.data.param.group_name==""){
            var softinf="<span class='distrfName'>迁移分组 : 全网终端</span><br/><p>迁移地址 : "+data.data.param.addr+"</p>";
        }else{
            var softinf="<span class='distrfName'>迁移分组 : "+data.data.param.group_name+"</span><br/><p>迁移地址 : "+data.data.param.addr+"</p>";
        }
        
        $(".taskDetailPop .softInf").html(softinf);
    }else if(data.data.type=="leakrepair_repair"){
        $(".taskDetailPop .describe").html("漏洞修复时间  : "+timetext);  
    }else if(data.data.type=="leakrepair_scan"){
        $(".taskDetailPop .describe").html("漏洞扫描时间  : "+timetext);  
    }else if(data.data.type=="vnc_launch"){
        $(".taskDetailPop .describe").html("远程时间  : "+timetext);  
    }
}
function scanType(param){
    var first=param['scan.maxspeed'];
    var second=param['scan.sysrepair'];
    var third=param['clean.automate'];
    var fourth=param['clean.quarantine'];
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
var totalnum="";
var taskid="";
function taskDetailPop(start){
    if(start == undefined) {
		start = 0;
	}else{
		start = start;
	}
    var detailnumperpage=0;
    var trIndex=$(".taskDetailPop").attr('trIndex');
    
    var taskid=parseInt($('.taskDetailPop').attr('taskid'));
    var tasktypetxt=$('.tableContainer .table tbody tr').eq(trIndex).find('td').eq(1).html();
    if(tasktypetxt=="通知任务"||tasktypetxt=="软件卸载"||tasktypetxt=="文件分发"){
        detailnumperpage=7;
    }else{
        detailnumperpage=9;
    }
    dataa={"taskid":taskid,"view":{"begin":start,"count":detailnumperpage}};

    var type = $('.taskDetailPop table th.th-ordery.th-ordery-current').attr('type');
    var orderClass = $('.taskDetailPop table th.th-ordery.th-ordery-current').attr('class');
    dataa = sortingDataFun(dataa,type,orderClass);
    
    var timetext=$('.tableContainer .table tbody tr').eq(trIndex).find('td').eq(0).html();
    var totaltext=$('.tableContainer .table tbody tr').eq(trIndex).find('td').eq(2).html();
    var executetext=$('.tableContainer .table tbody tr').eq(trIndex).find('td').eq(3).html();
    
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
        success:function(data){
            var list=data.data.list;
            totalnum=data.data.view.total;
            var total=Math.ceil(totalnum/detailnumperpage);

            tabListPopstr.setData(list);
            taskConfigFun(data,timetext);
            var tbodyHeight = $('.taskDetailPop tbody').height();
            
            // 分页
            $(".taskDetailPop .clearfloat").remove();
            $(".taskDetailPop .tcdPageCode").remove();
            $(".taskDetailPop .totalPages").remove();
            $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>执行/下发   : "+executetext+"/"+totaltext+"</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
            var current = (dataa.view.begin/dataa.view.count) + 1;
            $(".taskDetailPop .tcdPageCode").createPage({
                pageCount:total,
                current:parseInt(current),
                backFn:function(pageIndex){
                    start=(pageIndex-1)*9;
                    dataa.view.begin = start;
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
                        success:function(data){
                            var list=data.data.list;
                            tabListPopstr.setData(list);
                            $('.taskDetailPop tbody').height(tbodyHeight);
                        }       
                    });
                }
            })

        }       
    });


}
$(".taskDetailPop").on("click",".fastSKCB",function(){
    $(".fastSKCPop").show();
})
$(".taskDetailPop").on("click",".overallSKCB",function(){
    $(".overallSKCPop").show();
})
$(".closeWW").click(function(){
    $(".shadee").hide();
    $(this).parent().parent().hide();
});
//关闭弹层
$(".closeW").click(function(){
    $(".shade").hide();
    $(this).parent().parent().hide();
    parent.$(".topshade").hide();

});
//导出
$(document).on('click','.exportLog',function(){
 	var dataa = accEvnetParam();
	$.download('/mgr/task/_export', 'post', dataa); 

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

$(document).on('click','.tableContainer .table th.th-ordery',function(){
	var toggleClass = $(this).attr('class');
    var _this = $(this);
    sortingFun(_this,toggleClass);
	var currentPage = $(this).parents('.tableContainer').find('.tcdPageCode span.current').text();
	var currentNum = $(this).parents('.tableContainer').find('#numperpageinput').val();
	var start = (parseInt(currentPage) - 1) * parseInt(currentNum);
	accEvent(start);
})
//列表信息
function columnsDataListFun (){
	var columns = [
		{
			type: "create_time",title: "时间",name: "create_time",
			tHead:{style: {width: "24%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "24%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "type",title: "任务类型",name: "type",
			tHead:{style: {width: "17%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "17%"},customFunc: function (data, row, i) {
                return fieldHandle(taskTypeField,data);
            }}
		},{
			type: "client_all",title: "下发台数",name: "client_all",
			tHead:{style: {width: "15%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "15%"},customFunc: function (data, row, i) {return data; }},
		},{
			type: "client_done",title: "执行台数",name: "client_done",
			tHead:{style: {width: "15%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
            tBody:{style: {width: "15%"},customFunc: function (data, row, i) {return data;}},
		},{
            type: "status",title: "状态",name: "status",
            tHead:{style: {width: "17%"},class: "th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "17%"},customFunc: function (data, row, i) {
                return fieldHandle(distrStatusField,data);
            }}
		},{
			type: "",title: "详情",name: "",
			tHead:{style: {width: "8%"},customFunc: function (data, row, i) {return ""}},
			tBody:{style: {width: "8%"},customFunc: function (data, row, i) {return "<a class='seeDetail cursor blackfont' taskid='"+row.task_id+"'>详情</a>"; }}
		}]
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
var tabListstr = columnsDataListFun();
function accEvnetParam(start){
	var begintime=getBeginTimes($("#txtBeginDate").val());
    var endtime=getEndTimes($("#txtEndDate").val());

    var sta="";
    var type="";
    var dataa="";
    if(start == undefined) {
		start = 0;
	}else{
		start = start;
    }
    var currentIndex = $("#functionBlock .current").index();
    var taskType = ["quick_scan","full_scan","update","message","shutdown","reboot","msg_uninstall","msg_distrfile","migrate","leakrepair_repair"];
    for(var i=2;i<taskType.length;i++){
        if(i == currentIndex){
            type = taskType[i-2];
        }
    }
    dataa={"create_time":{"begin":begintime,"end":endtime},"view":{"begin":start,"count":numperpage}};
    if(type){
    	dataa.type = type;
    }
	
	if($("#status option:selected").val()==1){
    	dataa.status = 1;
    }else if($("#status option:selected").val()==2){
    	dataa.status = 0;
    }


    var type1 = $('.table th.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.table th.th-ordery.th-ordery-current').attr('class');
	dataa = sortingDataFun(dataa,type1,orderClass);
	return dataa;
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
        url:'/mgr/task/_list',
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
      
            if(list.length==0){
                $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
            }else{
                tabListstr.setData(list);
            }
            tbodyAddHeight();
            $(".clearfloat").remove();
            $(".tcdPageCode").remove();
            $(".totalPages").remove();
            $(".numperpage").remove();
            $(".tableContainer").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+data.data.view.total+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><a style='font-size:12px;float:right;line-height:54px;padding-right:20px;color:#6a6c6e' class='numperpage'>每页<input type='text' id='numperpageinput' value="+numperpage+" style='font-size:12px;width:40px;height:24px;margin:0 4px;vertical-align:middle;padding:0 10px;'>条</a><div class='clear clearfloat'></div>");
	        var current = (dataa.view.begin/dataa.view.count) + 1;
            
            $(".tcdPageCode").createPage({
                pageCount:total,
                current:parseInt(current),
                backFn:function(pageIndex){
                    start=(pageIndex-1)*numperpage;
					dataa.view.begin = start;
                    $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
                    ajaxtable=
                    $.ajax({
                        url:'/mgr/task/_list',
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
                    });

                }
            })  
            }
    });

}
tbodyAddHeight();
//调整页面内元素高度
function tbodyAddHeight(){
    var mainlefth=parent.$("#iframe #mainFrame").height();
    $(".main .table tbody").css({height:mainlefth-298});
}


window.onresize = function(){
    tbodyAddHeight();
}

