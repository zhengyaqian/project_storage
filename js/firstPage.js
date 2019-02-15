//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a").eq(0).addClass("current");
parent.$(".nav .container a").eq(0).siblings().removeClass("current");
parent.$(".footer").hide();

document.cookie='page=firstPage.html';
//关闭弹层
$(".closeW").click(function(){
    $(".shade").hide();
    $(this).parent().parent().hide();
    parent.$(".topshade").hide();

});
safeOverview();

//每十秒刷新
setInterval(function(){safeOverview()},30000);
//获取安全概览
function safeOverview(){
    $.ajax({
        url:'/mgr/stat/_summary',
        data:{},
        type:'GET',
        contentType:'text/plain',
        error:function(xhr,textStatus,errorThrown){
        	if(xhr.status==401){
        	    parent.window.location.href='/';
        	}else{
        		console.log(xhr.status+"  "+textStatus+"  "+errorThrown);
        	}
            
        },
        success:function(data){
        	$(".overviewBlock").eq(0).find(".number").html(data.data.online_count+"/"+data.data.client_count);
            $(".overviewBlock").eq(1).find(".number").html(data.data.virus_count+"次");
            $(".overviewBlock").eq(2).find(".number").html(data.data.sysprot_count+"次");
            $(".overviewBlock").eq(3).find(".number").html(data.data.netprot_count+"次");
            if(data.data.client_count==0){
                //没有终端的时候
                $(".safeOverview .up .floatL").html("<span class='text'>安全概览</span><span>您还没有部署任何一台终端，请<a class='colorGreen ArrangeImmB'>立即前去部署</a></span>");
                $(".safeOverview .up .floatR").hide();
                // $(".overviewBlock .text").each(function(){
                //     $(this).find("p").eq(1).remove();
                //     $(this).append("<p class='number'>0</p>");
                // });

            }else{
                $(".safeOverview .up .floatL").html("<span class='text'>安全概览</span><span>累计保护&nbsp;<a class='colorGreen cursor' id='addUpDays'></a>&nbsp;天</span>");
                $(".safeOverview .up .floatR").show();
                $("#addUpDays").html(data.data.protect_days);
            }
        }       
    })  
}

//如果没有终端时威胁数量趋势图为无数据状态
// $.ajax({
//     url:'/mgr/stat/_summary',
//     data:{},
//     type:'GET',
//     contentType:'text/plain',
//     error:function(xhr,textStatus,errorThrown){
//     	if(xhr.status==401){
//     	    parent.window.location.href='/';
//     	}else{
    		
//     	}
        
//     },
//     success:function(data){
//         if(data.data.client_count==0){
//             //没有终端的时候
//             $("#threatchart").html("<img src='images/nochart.png' style='display:block;margin:0 auto;padding-top:130px;'><p style='text-align:center;padding-top:24px;'>暂无数据内容</p>");
//             $(".chartBlock a").hide();
//         }else{
            
//         }
//     }       
// })
threattrend();
$(".taskMore").click(function(){
    parent.$("#mainFrame").attr("src","historyTask.html");
})
$(".logMore").click(function(){
    parent.$("#mainFrame").attr("src","virusDefense.html");
})
$(".terminalHtmlB").click(function(){
    parent.$("#mainFrame").attr("src","terminalManage.html");
})
$(".virusHtmlB").click(function(){
    parent.$("#mainFrame").attr("src","virusDefense.html");
})
$(".systemHtmlB").click(function(){
    parent.$("#mainFrame").attr("src","systemDefense.html");
})
$(".netHtmlB").click(function(){
    parent.$("#mainFrame").attr("src","netDefense.html");
})

$(".terminalAB").click(function(){
    parent.$("#mainFrame").attr("src","terminalArrange.html");
})
// $(".safeOverview").on("click",".ArrangeImmB",function(){
//     parent.$("#mainFrame").attr("src","terminalArrange.html");
//     parent.$(".nav .container a").eq(5).attr("id","firstPage");
// })

function columnsDataTaskListFun (){
	var columns = [
		{
			type: "",title: "时间",name: "create_time",
			tHead:{style: {width: "25%"},customFunc: function (data, row, i) {return ""}},
			tBody:{style: {width: "25%"},customFunc: function (data, row, i) {
                if(getLocalTime3(data)==GetDateStr(0)){
                    return "今天 "+safeStr(getLocalTime4(data))+"<span style='display:none'>"+safeStr(getLocalTime(data))+"</span>";
                }else if(getLocalTime3(data)==GetDateStr(-1)){
                    return "昨天 "+safeStr(getLocalTime4(data))+"<span style='display:none'>"+safeStr(getLocalTime(data))+"</span>";
                }else{
                    return safeStr(getLocalTime3(data))+"<span style='display:none'>"+safeStr(getLocalTime(data))+"</span>";
                }
			}},
		},{
			type: "",title: "任务",name: "type",
			tHead:{style: {width: "20%"},customFunc: function (data, row, i) {return ""}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {
                if(data=="quick_scan"){ return "快速查杀";
                }else if(data=="full_scan"){ return "全盘查杀";
                }else if(data=="update"){return "升级任务";
                }else if(data=="message"){return "通知任务";
                }else if(data=="shutdown"){ return "关机";
                }else if(data=="reboot"){return "重启";
                }else if(data=="msg_uninstall"){return "软件卸载";
                }else if(data=="msg_distrfile"){return "文件分发";
                }else if(data=="migrate"){return "中心迁移";
                }else if(data=="leakrepair_repair"){return "漏洞修复";
                }else if(data=="leakrepair_scan"){return "漏洞扫描";
                }else if(data=="vnc_launch"){return "远程桌面";
                }else if(!data){return "--";}
			}}
	   	},{
			type: "",title: "执行/下发",name: "client_done",
			tHead:{style: {width: "20%"},customFunc: function (data, row, i) {return ""}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {return data+"/"+row.client_all;}},
		},{
			type: "",title: "状态",name: "status",
			tHead:{style: {width: "20%"},customFunc: function (data, row, i) {return ""}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {
                if(data==0){return "正在分发"; 
                }else if(data==1){return "分发结束";
                }else{return "--";}
            }},
		},{
			type: "",title: "详情",name: "",
			tHead:{style: {width: "15%"},customFunc: function (data, row, i) {return ""}},
			tBody:{style: {width: "15%"},customFunc: function (data, row, i) {return "<a class='blackfont underline cursor'  onclick='taskDetailPop(this)'>详情</a>";}},
		}
	]
	var tabstr = new createTable(columns,[] ,$('.taskTable'));
	return tabstr;
	
}
var tabstrList = columnsDataTaskListFun();
//任务列表
taskTable();
setInterval(function(){taskTable()},30000);
function taskTable(){
    $.ajax({
        url:'/mgr/task/_recent?type=',
        data:{},
        type:'GET',
        contentType:'text/plain',
        error:function(xhr,textStatus,errorThrown){
        	if(xhr.status==401){
        	    parent.window.location.href='/';
        	}else{
        		
        	}
            
        },
        success:function(data){
            var list=data.data.list;
            if(list.length==0){
                $(".taskMore").hide();
                $(".taskTable tbody").html("<img src='images/notable.png' style='display:block;margin:0 auto;padding-top:118px;'><p style='text-align:center;padding-top:24px;'>暂无数据内容</p>");   
            }else{
                if(list.length<10){
                    $(".taskMore").hide();
                }else{
                    $(".taskMore").show();
                }
                tabstrList.setData(list);
            }
        }
    });  
}

function columnsDataEventListFun (){
	var columns = [
		{
			type: "",title: "时间",name: "time",
			tHead:{style: {width: "26%"},customFunc: function (data, row, i) {return ""}},
			tBody:{style: {width: "26%"},customFunc: function (data, row, i) {
                if(getLocalTime3(data)==GetDateStr(0)){
                    return "今天 "+safeStr(getLocalTime4(data));
                }else if(getLocalTime3(data)==GetDateStr(-1)){
                    return "昨天 "+safeStr(getLocalTime4(data));
                }else{
                    return safeStr(getLocalTime3(data));
                }
			}},
		},{
			type: "",title: "事件",name: "fname",
			tHead:{style: {width: "26%"},customFunc: function (data, row, i) {return ""}},
			tBody:{style: {width: "26%"},customFunc: function (data, row, i) {
                if(data=="filemon"){ return "文件实时监控";
                }else if(data=="behavior"){ return "恶意行为监控";
                }else if(data=="dlmon"){return "下载保护";
                }else if(data=="udiskmon"){return "U盘保护";
                }else if(data=="sysprot"){ return "系统加固";
                }else if(data=="scan"){return "病毒查杀";
                }else if(data=="malurl"){return "恶意网站拦截";
                }else if(data=="instmon"){return "软件安装拦截";
                }else if(data=="intrusion"){return "黑客入侵拦截";
                }else if(data=="ipattaack"){return "对外攻击检测";
                }else if(data=="mail"){return "邮件监控";
                }else if(data=="ipblacklist"){return "IP黑名单";
                }else if(data=="ipproto"){return "IP协议控制";
                }else if(!data){return "--";}
			}}
	   	},{
			type: "",title: "终端",name: "hostname",
			tHead:{style: {width: "21%"},customFunc: function (data, row, i) {return ""}},
			tBody:{style: {width: "21%"},customFunc: function (data, row, i) {return "<span class='nameWidth' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";}},
		},{
			type: "",title: "状态",name: "",
			tHead:{style: {width: "21%"},customFunc: function (data, row, i) {return ""}},
			tBody:{style: {width: "21%"},customFunc: function (data, row, i) {
                var data =row.detail;
                if('result' in data){
                    if(data.result==0 || data.result==1){return "处理失败"; 
                    }else if(data.result==2 || data.result==6){return "已忽略";
                    }else if(data.result==3 || data.result==4){return "已处理";
                    }else if(data.result==5){return "已信任";
                    }else{return "--";}
                }
                if('treatment' in data){
                    if(data.treatment & 0x0FFFF){
                        if(data.treatment==1){return "待处理"; 
                        }else if(data.treatment==0){return "已忽略";
                        }else if(data.treatment==2 || data.treatment==5){return "已处理";
                        }else if(data.treatment==3){return "已阻止";
                        }else if(data.treatment==4){return "已信任";
                        }else{return "--";}
                    }
                }
                if('blocked' in data){
                    if(data.blocked & 0x0FFFF){
                        if(data.blocked==0){return "已放过"; 
                        }else if(data.blocked==1){return "已阻止";
                        }else{return "--";}
                    }
                }
              
            }},
		},{
			type: "",title: "详情",name: "",
			tHead:{style: {width: "10%"},customFunc: function (data, row, i) {return ""}},
			tBody:{style: {width: "10%"},class:"relative",customFunc: function (data, row, i) {
                var detail_Div=detailDiv(row);
                return "<a class='blackfont underline cursor' onclick='seeDetailFloat(this)'>详情</a>"+detail_Div;
            }},
		}
	]
	var tabstr = new createTable(columns,[] ,$('.eventTable'));
	return tabstr;
	
}
var tabstrEventList = columnsDataEventListFun();
function detailDiv(row){
    var html="";
    switch (row.fname) {
        case "filemon":
        case "scan":
        case "behavior":
        case "udiskmon":
        case "dlmon":
        case "mail":
        html+="<div class='absolute detailFloat'>";
        html+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span><div class='clear'></div></h4>";
        if(row.fname!=="behavior"){
            html+="<p>病毒ID : "+safeStr(row.detail.virus_id)+"</p>";
        }
        
        html+="<p>病毒名称 : "+safeStr(row.detail.virus_name)+"</p>";
        switch (row.fname){
            case "mail":
            html+="<p>威胁来源 : "+safeStr(row.detail.mail_from.replace('<','&lt;').replace('>','&gt;'))+"</p>";
            break;
            default:
            html+="<p>威胁来源 : "+safeStr(row.detail.file_path)+"</p>";
            break;
        }
        
        switch (row.fname){
            case "filemon":
            html+="<p>检出方式 : 文件实时监控</p>";
            break;
            case "scan":
            html+="<p>检出方式 : 病毒查杀</p>";
            break;
            case "behavior":
            html+="<p>检出方式 : 恶意行为监控</p>";
            break;
            case "udiskmon":
            html+="<p>检出方式 : U盘保护</p>";
            break;
            case "dlmon":
            html+="<p>检出方式 : 下载保护</p>";
            break;
            case "mail":
            html+="<p>检出方式 :  邮件监控</p>";
            break;
            html+="<td></td>";
            break;

        }
        if(row.detail.result==0){
            html+="<p>状态 : 处理失败</p>";
        }else if(row.detail.result==1){
            html+="<p>状态 : 处理失败</p>";
        }else if(row.detail.result==2){
            html+="<p>状态 : 已忽略</p>";
        }else if(row.detail.result==3){
            html+="<p>状态 : 已处理</p>";
        }else if(row.detail.result==4){
            html+="<p>状态 : 已处理</p>";
        }else if(row.detail.result==5){
            html+="<p>状态 : 已信任</p>";
        }else if(row.detail.result==6){
            html+="<p>状态 : 已忽略</p>";
        }else{
            html+="<p></p>";
        }
        html+="</div>";
        break;
        case "sysprot":
        
        html+="<div class='absolute detailFloat'>";
        html+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span><div class='clear'></div></h4>";
        html+="<p>保护项目 : "+safeStr(row.detail.rule_name)+"</p>";
        html+="<p>操作者 : "+safeStr(row.detail.proc_name)+"</p>";
        html+="<p>命令行 : "+safeStr(row.detail.cmdline)+"</p>";
        if(row.detail.cls==0){
            html+="<p>目标文件 : "+safeStr(row.detail.res_path)+"</p>";
        }
        if(row.detail.cls==1){
            html+="<p>目标注册表 : "+safeStr(row.detail.res_path)+"</p>";
        }
        if(row.detail.cls==2){
            html+="<p>执行文件 : "+safeStr(row.detail.res_path)+"</p>";
        }
        if(row.detail.cls==3){
            html+="<p>可疑文件 : "+safeStr(row.detail.res_path)+"</p>";
        }
        if((row.detail.acttype&0x01)!== 0) {

            html+="<p>操作类型 : 创建</p>";
        }else if((row.detail.acttype&0x02)!= 0){

            html+="<p>操作类型 : 读取</p>";
        }else if((row.detail.acttype&0x04)!= 0){

            html+="<p>操作类型 : 写入</p>";
        }else if((row.detail.acttype&0x08)!= 0){

            html+="<p>操作类型 : 删除</p>";
        }else if((row.detail.acttype&0x10)!= 0){

            html+="<p>操作类型 : 执行</p>";
        }
        if(row.detail.cls==1){
            html+="<p>数据内容 : "+safeStr(row.detail.res_val)+"</p>";           
        }                        
        if((row.detail.treatment & 0x0FFFF)==0){
            html+="<p>状态 : 已忽略</p>";
        }else if((row.detail.treatment & 0x0FFFF)==1){
            html+="<p>状态 : 待处理</p>";
        }else if((row.detail.treatment & 0x0FFFF)==2){
            html+="<p>状态 : 已处理</p>";
        }else if((row.detail.treatment & 0x0FFFF)==3){
            html+="<p>状态 : 已阻止</p>";
        }else if((row.detail.treatment & 0x0FFFF)==4){
            html+="<p>状态 : 已信任</p>";
        }else if((row.detail.treatment & 0x0FFFF)==5){
            html+="<p>状态 : 已处理</p>";
        }else{
            html+="<p></p>";
        };
        html+="</div>";
        break;
        case "instmon":
        html+="<div class='absolute detailFloat'>";
        html+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span><div class='clear'></div></h4>";
        html+="<p>软件名称 : "+safeStr(row.detail.display_name)+"</p>";
        html+="<p>软件路径 : "+safeStr(row.detail.file_path)+"</p>";
        html+="<p>操作者 : "+safeStr(row.detail.proc_path)+"</p>";
        
                              
        if((row.detail.treatment & 0x0FFFF)==0){
            html+="<p>状态 : 已忽略</p>";
        }else if((row.detail.treatment & 0x0FFFF)==1){
            html+="<p>状态 : 待处理</p>";
        }else if((row.detail.treatment & 0x0FFFF)==2){
            html+="<p>状态 : 已处理</p>";
        }else if((row.detail.treatment & 0x0FFFF)==3){
            html+="<p>状态 : 已阻止</p>";
        }else if((row.detail.treatment & 0x0FFFF)==4){
            html+="<p>状态 : 已信任</p>";
        }else if((row.detail.treatment & 0x0FFFF)==5){
            html+="<p>状态 : 已处理</p>";
        }else{
            html+="<p></p>";
        };
        html+="</div>";
        break;
        case "intrusion":
        html+="<div class='absolute detailFloat'>";
        html+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span><div class='clear'></div></h4>";
        html+="<p>入侵类型 : "+safeStr(row.detail.name)+"</p>";
        html+="<p>远程地址 : "+row.detail.raddr+"</p>";
        html+="<p>关联进程 : "+safeStr(row.detail.cmdline)+"</p>";
        if((row.detail.blocked)==0){
            html+="<p>状态 : 已放过</p>";
        }else if((row.detail.blocked)==1){
            html+="<p>状态 : 已阻止</p>";
        }else{
            html+="<p></p>";
        }
        html+="</div>";
        break;
        case "ipattaack":
        html+="<div class='absolute detailFloat'>";
        html+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span><div class='clear'></div></h4>";
        html+="<p>攻击类型 : "+safeStr(row.detail.rule_name)+"</p>";
        html+="<p>远程地址 : "+safeStr(row.detail.proc_name)+"</p>";
        html+="<p>关联进程 : "+safeStr(row.detail.cmdline)+"</p>";
        html+="<p>状态:已阻止</p>";
        html+="</div>";
        break;
        case "malurl":
        html+="<div class='absolute detailFloat'>";
        html+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span><div class='clear'></div></h4>";
        html+="<p>拦截网址 : "+safeStr(row.detail.domain)+"</p>";
        if(row.detail.cls=="spy"){
            html+="<p>网址类型 : 木马，盗号</p>";  
        }else if(row.detail.cls=="phising"){
            html+="<p>网址类型 : 钓鱼，仿冒</p>";
        }else if(row.detail.cls=="fraud"){
            html+="<p>网址类型 : 虚假，欺诈</p>";
        }else{
            html+="<p></p>";
        }
        

        html+="<p>状态:已阻止</p>";
        
        html+="</div>";
        break;
        case "ipblacklist":
        html+="<div class='absolute detailFloat'>";
        html+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span><div class='clear'></div></h4>";
       
        html+="<p>远程IP : "+row.detail.raddr+"</p>";
        html+="<p>备注 : "+safeStr(row.detail.name)+"</p>";
        if(row.detail.blocked==1){
             html+="<p>状态 : 已阻止</p>";
        }else{
             html+="<p>状态 : 已放过</p>";
        }
       
        html+="</div>";
        break;
        case "ipproto":
        html+="<div class='absolute detailFloat'>";
        html+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span><div class='clear'></div></h4>";
       
        html+="<p>触犯规则名称 : "+safeStr(row.detail.name)+"</p>";
        if(row.detail.outbound==1){
            html+="<p>触犯动作 : 联出"+safeStr(_int2ip(row.detail.raddr))+":"+row.detail.rport+"</p>";
        }else{
            html+="<p>触犯动作 : 联入"+safeStr(_int2ip(row.detail.raddr))+":"+row.detail.rport+"</p>";
        }
        
        if(row.detail.blocked==1){
             html+="<p>状态 : 已阻止</p>";
        }else{
             html+="<p>状态 : 已放过</p>";
        }
       
        html+="</div>";
        break;
    }
    return html;
}

//事件列表
eventTable();
//每10秒刷新
setInterval(function(){eventTable()},30000);
function eventTable(){
    $.ajax({
        url:'/mgr/log/_recent',
        data:{},
        type:'POST',
        contentType:'text/plain',
        error:function(xhr,textStatus,errorThrown){
        	if(xhr.status==401){
        	    parent.window.location.href='/';
        	}else{
        		
        	}
            
        },
        success:function(data){
            var list=data.data;
            if(list.length==0){
                $(".logMore").hide();
                $(".eventTable tbody").html("<img src='images/notable.png' style='display:block;margin:0 auto;padding-top:118px;'><p style='text-align:center;padding-top:24px;'>暂无数据内容</p>");   
            }else{
                if(list.length<10){
                    $(".logMore").hide();
                }else{
                    $(".logMore").show();
                }     
                tabstrEventList.setData(list);
            }                        
        }
    });   
}

//按详情查看日志详情
function seeDetailFloat(a){
    $(".detailFloat").hide();
    $(a).next().show();
    if($(a).parents("tr").index()>4){
        $(a).next(".detailFloat").css({
            bottom: '12px',
            top: 'auto'
        });
    }else{
        $(a).next(".detailFloat").css({
            top: '12px',
            bottom: 'auto'
        });
    }
}
function closeDetailFloat(a){
    $(a).parents(".detailFloat").hide();
}
//弹出任务详情
var totalnum="";
var taskid="";
function taskDetailPop(a){
    // 判断任务类型控制详情弹窗每页多少行
    var detailnumperpage=0;
    var tasktypetxt=$(a).parents("tr").find("td").eq(1).html();
    if(tasktypetxt=="通知任务"||tasktypetxt=="软件卸载"||tasktypetxt=="文件分发"){
        detailnumperpage=6;
    }else{
        detailnumperpage=8;
    }

    var start=0;
    $(".taskDetailPop").show();
    shade();
    taskid=parseInt($(a).parents("tr").attr("taskid"));
    var dataa={"taskid":taskid,"view":{"begin":start,"count":detailnumperpage}};
    var typetext=$(a).parents("tr").find("td").eq(1).html();
    var timetext=$(a).parents("tr").find("td").eq(0).find("span").html();
    var numtext=$(a).parents("tr").find("td").eq(2).html();
    
    $.ajax({
        url:'/mgr/task/_clnt',
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
            var html="";
            var list=data.data.list;
            totalnum=data.data.view.total;
            var total=Math.ceil(totalnum/detailnumperpage);

            if(data.data.type=="quick_scan"){
                var configB="<span class='fastSKCB'></span>";
                $(".taskDetailPop .describe").removeClass("describebg");
                $(".taskDetailPop .describe").html("快速查杀时间 : "+timetext+configB);
                $(".taskDetailPop .softInf").hide();
                $(".taskDetailPop .taskDetailTable").height("313px");
                $(".taskDetailPop .messageTxt").hide();

                var first=data.data.param['scan.maxspeed'];
                var second=data.data.param['scan.sysrepair'];
                var third=data.data.param['clean.automate'];
                var fourth=data.data.param['clean.quarantine'];
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
                $(".fastSKCPop input").prop("disabled",true);
            }else if(data.data.type=="full_scan"){
                var configB="<span class='overallSKCB'></span>";
                $(".taskDetailPop .describe").removeClass("describebg");
                $(".taskDetailPop .describe").html("全盘查杀时间 : "+timetext+configB);
                $(".taskDetailPop .softInf").hide();
                $(".taskDetailPop .taskDetailTable").height("313px");
                $(".taskDetailPop .messageTxt").hide();

                var first=data.data.param['scan.maxspeed'];
                var second=data.data.param['scan.sysrepair'];
                var third=data.data.param['clean.automate'];
                var fourth=data.data.param['clean.quarantine'];
                var overallpara1=data.data.param['decompo.limit.size'].enable;
                var overallpara2=data.data.param['scan.exclusion.ext'].enable;
                var overallpara1V=data.data.param['decompo.limit.size'].value;
                var overallpara2V=data.data.param['scan.exclusion.ext'].value;
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
                $(".overallSKCPop input").prop("disabled",true);

            }else if(data.data.type=="msg_uninstall"){
                $(".taskDetailPop .describe").addClass("describebg");
                $(".taskDetailPop .describe").html("软件卸载时间 : "+timetext);
                var softinf="<span>卸载软件 : "+safeStr(data.data.param.software.name)+"    "+safeStr(data.data.param.software.version)+"</span><br/><span>软件发布者 : "+safeStr(data.data.param.software.publisher)+"</span>";
                $(".taskDetailPop .softInf").html(softinf);
                $(".taskDetailPop .softInf").show();
                $(".taskDetailPop .messageTxt").hide();
                $(".taskDetailPop .taskDetailTable").height("240px");
            }else if(data.data.type=="msg_distrfile"){
                $(".taskDetailPop .describe").addClass("describebg");
                $(".taskDetailPop .describe").html("文件分发时间 : "+timetext);
                var softinf="<span class='distrfName'>分发文件 : "+safeStr(data.data.param.name)+"</span><br/><p>通知 : "+safeStr(data.data.param.text)+"</p>";
                $(".taskDetailPop .softInf").html(softinf);
                $(".taskDetailPop .softInf").show();
                $(".taskDetailPop .messageTxt").hide();
                $(".taskDetailPop .taskDetailTable").height("240px");
            }else if(data.data.type=="message"){
                $(".taskDetailPop .describe").addClass("describebg");
                $(".taskDetailPop .describe").html("通知时间 : "+safeStr(timetext)); 
                var messagetxt="<p>"+"通知内容 : "+safeStr(data.data.param.text)+"</p>";
                $(".taskDetailPop .messageTxt").html(messagetxt);
                $(".taskDetailPop .softInf").hide();
                $(".taskDetailPop .messageTxt").show();
                $(".taskDetailPop .taskDetailTable").height("240px");
            }else if(data.data.type=="update"){
                $(".taskDetailPop .describe").removeClass("describebg");
                $(".taskDetailPop .describe").html("升级时间  : "+timetext);  
                $(".taskDetailPop .softInf").hide();
                $(".taskDetailPop .messageTxt").hide();
                $(".taskDetailPop .taskDetailTable").height("313px");
            }else if(data.data.type=="shutdown"){
                $(".taskDetailPop .describe").removeClass("describebg");
                $(".taskDetailPop .describe").html("关机时间  : "+timetext);  
                $(".taskDetailPop .softInf").hide();
                $(".taskDetailPop .messageTxt").hide();
                $(".taskDetailPop .taskDetailTable").height("313px");
            }else if(data.data.type=="reboot"){
                $(".taskDetailPop .describe").removeClass("describebg");
                $(".taskDetailPop .describe").html("重启时间  : "+timetext);  
                $(".taskDetailPop .softInf").hide();
                $(".taskDetailPop .messageTxt").hide();
                $(".taskDetailPop .taskDetailTable").height("313px");
            }else if(data.data.type=="migrate"){
                $(".taskDetailPop .describe").addClass("describebg");
                $(".taskDetailPop .describe").html("迁移时间  : "+timetext); 
                if(data.data.param.group_name==""){
                    var softinf="<span class='distrfName'>迁移分组 : 全网终端</span><br/><p>迁移地址 : "+data.data.param.addr+"</p>";
                }else{
                    var softinf="<span class='distrfName'>迁移分组 : "+data.data.param.group_name+"</span><br/><p>迁移地址 : "+data.data.param.addr+"</p>";
                }
                
                $(".taskDetailPop .softInf").html(softinf);
                $(".taskDetailPop .softInf").show();
                $(".taskDetailPop .messageTxt").hide();
                $(".taskDetailPop .taskDetailTable").height("240px");
            }else if(data.data.type=="leakrepair_repair"){
                $(".taskDetailPop .describe").removeClass("describebg");
                $(".taskDetailPop .describe").html("漏洞修复时间  : "+timetext);  
                $(".taskDetailPop .softInf").hide();
                $(".taskDetailPop .messageTxt").hide();
                $(".taskDetailPop .taskDetailTable").height("313px");
            }else if(data.data.type=="leakrepair_scan"){
                $(".taskDetailPop .describe").removeClass("describebg");
                $(".taskDetailPop .describe").html("漏洞扫描时间  : "+timetext);  
                $(".taskDetailPop .softInf").hide();
                $(".taskDetailPop .messageTxt").hide();
                $(".taskDetailPop .taskDetailTable").height("313px");
            }else if(data.data.type=="vnc_launch"){
                $(".taskDetailPop .describe").removeClass("describebg");
                $(".taskDetailPop .describe").html("远程时间  : "+timetext);  
                $(".taskDetailPop .softInf").hide();
                $(".taskDetailPop .messageTxt").hide();
                $(".taskDetailPop .taskDetailTable").height("313px");
            }
            html+="<tr id='tableAlign'>";
            html+="<td width='25%'>终端分组</td>";
            html+="<td width='25%'>终端名称</td>";
            html+="<td width='25%'>任务状态</td>";
            html+="<td width='25%'>备注</td>";
            html+="</tr>";
            for (var i = 0; i < list.length; i++) {
                html+="<tr>";
                if(list[i].groupname==""){
                    html+="<td><span class='nameWidth'>(已删除终端)</span></td>";  
                }else{
                    html+="<td><span class='nameWidth' title="+safeStr(pathtitle(list[i].groupname))+">"+safeStr(list[i].groupname)+"</span></td>";
                }
                
                html+="<td><span class='nameWidth' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</span></td>";
                if(list[i].status==0){
                    html+="<td>未响应</td>";
                    html+="<td>任务尚未被接受</td>";
                }else if(list[i].status==1){
                    html+="<td>已接受</td>";
                    html+="<td>任务已经接受</td>";
                }else if(list[i].status==2){
                    html+="<td>已拒绝</td>";
                    html+="<td>终端任务繁忙</td>";
                }else{
                    html+="<td>终端异常</td>";
                    html+="<td>终端服务异常，无法接受任务</td>";
                }
                html+="</tr>";
            };
            $(".taskDetailPop .taskDetailTable table").html(html);
            // 分页
            $(".taskDetailPop .clearfloat").remove();
            $(".taskDetailPop .tcdPageCode").remove();
            $(".taskDetailPop .totalPages").remove();
            $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>执行/下发   : "+numtext+"</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
            $(".taskDetailPop .tcdPageCode").createPage({
                pageCount:total,
                current:1,
                backFn:function(pageIndex){
                    start=(pageIndex-1)*detailnumperpage;
                    var dataa={"taskid":taskid,"view":{"begin":start,"count":detailnumperpage}};
                    
                    $.ajax({
                        url:'/mgr/task/_clnt',
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
                            var html="";
                            var list=data.data.list;
                            html+="<tr id='tableAlign'>";
                            html+="<td width='25%'>终端分组</td>";
                            html+="<td width='25%'>终端名称</td>";
                            html+="<td width='25%'>任务状态</td>";
                            html+="<td width='25%'>备注</td>";
                            html+="</tr>";
                            for (var i = 0; i < list.length; i++) {
                                html+="<tr>";
                                if(list[i].groupname==""){
                                    html+="<td><span class='nameWidth'>(已删除终端)</span></td>";  
                                }else{
                                    html+="<td><span class='nameWidth' title="+safeStr(pathtitle(list[i].groupname))+">"+safeStr(list[i].groupname)+"</span></td>";
                                }
                                html+="<td><span class='nameWidth' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</span></td>";
                                if(list[i].status==0){
                                    html+="<td>未响应</td>";
                                    html+="<td>任务尚未被接受</td>";
                                }else if(list[i].status==1){
                                    html+="<td>已接受</td>";
                                    html+="<td>任务已经接受</td>";
                                }else if(list[i].status==2){
                                    html+="<td>已拒绝</td>";
                                    html+="<td>终端任务繁忙</td>";
                                }else{
                                    html+="<td>终端异常</td>";
                                    html+="<td>终端服务异常，无法接受任务</td>";
                                }
                                html+="</tr>";
                            };
                            $(".taskDetailPop .taskDetailTable table").html(html);
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


//获取威胁数量趋势
var vdataArr=new Array();
var sdataArr=new Array();
var ndataArr=new Array();
var date=new Array();

function threattrend(){
    
    $.ajax({
        url:'/mgr/stat/_trend',
        data:JSON.stringify({"type":0}),
        type:'POST',
        contentType:'text/plain',
        error:function(xhr,textStatus,errorThrown){
        	if(xhr.status==401){
        	    parent.window.location.href='/';
        	}else{
        		
        	}
            
        },
        success:function(data){
            for (var i = 0; i < data.data.length; i++) {
                vdataArr.push(data.data[i].count);
                date.push(getLocalTime5(data.data[i].date))
            }
            
            threatchart();
                
           

        }       
    })

    $.ajax({
        url:'/mgr/stat/_trend',
        data:JSON.stringify({"type":1}),
        type:'POST',
        contentType:'text/plain',
        error:function(xhr,textStatus,errorThrown){
        	if(xhr.status==401){
        	    parent.window.location.href='/';
        	}else{
        		
        	}
            
        },
        success:function(data){
            for (var i = 0; i < data.data.length; i++) {
                sdataArr.push(data.data[i].count)
            }

            if(vdataArr.length==0 && sdataArr.length==0 && ndataArr.length==0){
                $("#threatchart").html("<img src='images/nochart.png' style='display:block;margin:0 auto;padding-top:130px;'><p style='text-align:center;padding-top:24px;'>暂无数据内容</p>");
            }else{
                threatchart();
                
            }

        }       
    })
    $.ajax({
        url:'/mgr/stat/_trend',
        data:JSON.stringify({"type":2}),
        type:'POST',
        contentType:'text/plain',
        error:function(xhr,textStatus,errorThrown){
        	if(xhr.status==401){
        	    parent.window.location.href='/';
        	}else{
        		
        	}
            
        },
        success:function(data){
            for (var i = 0; i < data.data.length; i++) {
                ndataArr.push(data.data[i].count)
            }
            
            if(vdataArr.length==0 && sdataArr.length==0 && ndataArr.length==0){
                $("#threatchart").html("<img src='images/nochart.png' style='display:block;margin:0 auto;padding-top:130px;'><p style='text-align:center;padding-top:24px;'>暂无数据内容</p>");
            }else{
                threatchart();
                
            }
        }       
    })  
}


function threatchart(){
    $("#threatchart").highcharts({
        chart:{
            type:'spline'   
        },
        title: {
            text: '',
            x: -20
        },
        xAxis: {
            categories: date
        },
        yAxis: {
            title: {
                text: '数量(个)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            allowDecimals: false
        },
        tooltip: {
            valueSuffix: '个',
            shared: true
        },
        legend: {
            layout: 'horizontal',
            align: 'right',
            verticalAlign: 'top',
            borderWidth: 0,
            lineHeight:16,
            itemMarginTop:2,
            itemMarginBottom:20,
            x:8
        },
        series: [{
            name: '病毒',
            color:'#f8ac59',
            data:  vdataArr
        }, {
            name: '系统',
            color:'#7ea0fc',
            data: sdataArr
        }, {
            name: '网络',
            color:'#a889dd',
            data: ndataArr
        }]
    }) 
}

var vdataArrr=new Array();
var sdataArrr=new Array();
var ndataArrr=new Array();
var ternamev=new Array();
var ternames=new Array();
var ternamen=new Array();
$.ajax({
    url:'/mgr/stat/_trendtop',
    data:JSON.stringify({"type":0}),
    type:'POST',
    contentType:'text/plain',
    error:function(xhr,textStatus,errorThrown){
    	if(xhr.status==401){
    	    parent.window.location.href='/';
    	}else{
    		
    	}
        
    },
    success:function(data){
        if(data.errno==0){
            for (var i = 0; i < data.data.length; i++) {
                vdataArrr.push(data.data[i].count);
                ternamev.push(data.data[i].hostname)
            }
            if(vdataArrr.length==0){
                $("#column").html("<img src='images/nochart.png' style='display:block;margin:0 auto;padding-top:60px;'><p style='text-align:center;padding-top:24px;'>暂无数据内容</p>");

            }else{
                column();

            }
        }else if(data.errno==-1){
            alert(data.errmsg);
        }
        
        
    }       
})

function column(){
    $('#column').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        legend: {
            enabled: false
        },
        xAxis: {
            categories: ternamev,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: '数量(个)'
            },
            allowDecimals: false
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:1f} 个</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: '数量',
            color:'#f8ac59',
            data: vdataArrr
        }]
    })
}



//柱状图图例按钮悬浮效果
// $(".chartBlock .buttons .virusB").hover(function(){
//     $(this).css({background:'#63c380',color:'#ffffff'})
// })
// $(".chartBlock .buttons .systemB").hover(function(){
//     $(this).css({background:'#7ea0fc',color:'#ffffff'})
// })
// $(".chartBlock .buttons .netB").hover(function(){
//     $(this).css({background:'#a889dd',color:'#ffffff'})
// })

$(".virusB").click(function(){
    $(".chartBlock .buttons a").css({background:"#ffffff"});
    $(".netB").css({color:"#a889dd"});
    $(".systemB").css({color:"#7ea0fc"});
    $(this).css({background:"#f8ac59",color:"#ffffff"});
    
    vdataArrr=[];
    ternamev=[];
    $.ajax({
        url:'/mgr/stat/_trendtop',
        data:JSON.stringify({"type":0}),
        type:'POST',
        contentType:'text/plain',
        error:function(xhr,textStatus,errorThrown){
        	if(xhr.status==401){
        	    parent.window.location.href='/';
        	}else{
        		
        	}
            
        },
        success:function(data){
            for (var i = 0; i < data.data.length; i++) {
                vdataArrr.push(data.data[i].count);
                ternamev.push(data.data[i].hostname)
            }
            if(vdataArrr.length==0){
                $("#column").html("<img src='images/nochart.png' style='display:block;margin:0 auto;padding-top:60px;'><p style='text-align:center;padding-top:24px;'>暂无数据内容</p>");
            }else{
                column();
                
            }
        }       
    })
})
$(".netB").click(function(){
    $(".chartBlock .buttons a").css({background:"#ffffff"});
    $(".virusB").css({color:"#f8ac59"});
    $(".systemB").css({color:"#7ea0fc"});
    $(this).css({background:"#a889dd",color:"#ffffff"});

    ndataArrr=[];
    ternamen=[];
    $.ajax({
        url:'/mgr/stat/_trendtop',
        data:JSON.stringify({"type":2}),
        type:'POST',
        contentType:'text/plain',
        error:function(xhr,textStatus,errorThrown){
        	if(xhr.status==401){
        	    parent.window.location.href='/';
        	}else{
        		
        	}
            
        },
        success:function(data){
            for (var i = 0; i < data.data.length; i++) {
                ndataArrr.push(data.data[i].count);
                ternamen.push(data.data[i].hostname)
            }

            if(ndataArrr.length==0){
                $("#column").html("<img src='images/nochart.png' style='display:block;margin:0 auto;padding-top:60px;'><p style='text-align:center;padding-top:24px;'>暂无数据内容</p>");
            }else{
                $('#column').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: ''
                    },
                    legend: {
                        enabled: false
                    },
                    xAxis: {
                        categories: ternamen,
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '数量(个)'
                        },
                        allowDecimals: false
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:1f} 个</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: '数量',
                        color:'#a889dd',
                        data: ndataArrr
                    }]
                });  
            }

        }       
    })   
})
$(".systemB").click(function(){
    $(".chartBlock .buttons a").css({background:"#ffffff"});
    $(".virusB").css({color:"#f8ac59"});
    $(".netB").css({color:"#a889dd"});
    $(this).css({background:"#7ea0fc",color:"#ffffff"});
    sdataArrr=[];
    ternames=[];
    $.ajax({
        url:'/mgr/stat/_trendtop',
        data:JSON.stringify({"type":1}),
        type:'POST',
        contentType:'text/plain',
        error:function(xhr,textStatus,errorThrown){
        	if(xhr.status==401){
        	    parent.window.location.href='/';
        	}else{
        		
        	}
            
        },
        success:function(data){
            for (var i = 0; i < data.data.length; i++) {
                sdataArrr.push(data.data[i].count);
                ternames.push(data.data[i].hostname)
            }
            if(sdataArrr.length==0){
                $("#column").html("<img src='images/nochart.png' style='display:block;margin:0 auto;padding-top:60px;'><p style='text-align:center;padding-top:24px;'>暂无数据内容</p>");
            }else{
                $('#column').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: ''
                    },
                    legend: {
                        enabled: false
                    },
                    xAxis: {
                        categories: ternames,
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '数量(个)'
                        },
                        allowDecimals: false
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:1f} 个</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: '数量',
                        color:'#7ea0fc',
                        data: sdataArrr
                    }]
                });     
            } 
            
        }       
    })
     
})
//一键查杀分组选择改变时全选input的变化
$("body").on("change","input[name=groupN]",function(){

    if($("input[name=groupN]:checked").length==($(".onekeySKPop ul li").length-1)){
        $(".onekeySKPop .selectAll").prop("checked",true);
        
    }else{
        $(".onekeySKPop .selectAll").prop("checked",false);
    }
})
//弹出一键查杀
var fastskcdefault="";
var overallskcdefault="";
$(".onekeySKB").click(function(){

    $("input[name=groupN]").prop('checked',true);
    shade();
    $(".onekeySKPop").show();
    $.ajax({
	    url:'/mgr/group/_list',
	    dataType:'json',
	    data:{},
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
	        html+="<ul class='relative'>";
	        html+="<li class='relative' style='background:#ffffff;border:0px;border-bottom:2px solid rgb(243,243,244);'><input type='checkbox' onclick='selectAll(this)' class='selectAll' checked><span>所有分组</span><span class='number absolute'> ( 共"+(list.length+1)+"组 ) </span></li>";
	        html+="<li  class='relative' groupid="+data.data.ungrouped.group_id+"><input type='checkbox' name='groupN' class='select' checked><span>"+safeStr(data.data.ungrouped.group_name)+"</span><span class='number absolute'>"+data.data.ungrouped.clients_online+"/"+data.data.ungrouped.clients+"</span></li>";
	        for(i=0;i<list.length;i++){
	            html+="<li  class='relative' groupid='"+list[i].group_id+"'><input type='checkbox' name='groupN' class='select' checked><span>"+safeStr(list[i].group_name)+"</span><span class='number absolute'>"+list[i].clients_online+"/"+list[i].clients+"</span></li>";
	        }
	        html+="</ul>";
	        $(".onekeySKPop .ul").html(html);
	    }
    });

    //取快速设置的默认设置参数
    $.ajax({
        url:'/mgr/task/_param?type=quick_scan',
        data:{},
        type:'GET',
        contentType:'text/plain',
        error:function(xhr,textStatus,errorThrown){
        	if(xhr.status==401){
        	    parent.window.location.href='/';
        	}else{
        		
        	}
            
        },
        success:function(data){

            var data=data.data.data;
            var first=data['scan.maxspeed'];
            var second=data['scan.sysrepair'];
            var third=data['clean.automate'];
            var fourth=data['clean.quarantine'];
            fastskcdefault={"scan.maxspeed":first,"scan.sysrepair":second,"clean.automate":third,"clean.quarantine":fourth};
        
        }
    });
    $.ajax({
        url:'/mgr/task/_param?type=full_scan',
        data:{},
        type:'GET',
        contentType:'text/plain',
        error:function(xhr,textStatus,errorThrown){
        	if(xhr.status==401){
        	    parent.window.location.href='/';
        	}else{
        		
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
            overallskcdefault={"scan.maxspeed":first,"scan.sysrepair":second,"clean.automate":third,"clean.quarantine":fourth,"decompo.limit.size":{"enable":overallpara1,"value":overallpara1V},"scan.exclusion.ext":{"enable":overallpara2,"value":overallpara2V}};
    
        }
    });

    
});
// 确认一键查杀
$(".sureSKButton").click(function(){
    var groupsArr=new Array();
    $("input[name=groupN]:checked").each(function(){
        groupsArr.push(parseInt($(this).parent().attr("groupid")));
    })
    if($(this).index()==0){
        var dataa={"type":"full_scan","groups":groupsArr,"param":overallskcdefault};  
    }else{
        var dataa={"type":"quick_scan","groups":groupsArr,"param":fastskcdefault};  
    }
    if($("input[name=groupN]:checked").length==0){
        $(".delayHide").show();
        $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'><span class='verticalMiddle'> 请选择分组!</span>");
        setTimeout(function(){$(".delayHide").hide()},2000); 
    }else{
        $.ajax({
            url:'/mgr/task/_create',
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
                $(".shade").hide();
                $(".onekeySKPop").hide();
                parent.$(".topshade").hide();
                $(".delayHideS").show();
                $(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> 操作成功!</span>");
                setTimeout(function(){$(".delayHideS").hide()},2000);
            }           
        });
    }
    
});
