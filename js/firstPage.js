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
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
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
// headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
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
//任务列表
taskTable();
setInterval(function(){taskTable()},30000);
function taskTable(){
    $.ajax({
        url:'/mgr/task/_recent?type=',
        data:{},
        type:'GET',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
        	if(xhr.status==401){
        	    parent.window.location.href='/';
        	}else{
        		
        	}
            
        },
        success:function(data){
            var list=data.data.list;
            var html="";
            if(list.length==0){
                $(".taskMore").hide();
                $(".taskTable").html("<img src='images/notable.png' style='display:block;margin:0 auto;padding-top:118px;'><p style='text-align:center;padding-top:24px;'>暂无数据内容</p>");   
            }else{
                html+="<tr>";                              
                html+="<th width='26%'>时间</th>";
                html+="<th width='22%'>任务</th>";
                html+="<th width='21%'>执行/下发</th>";
                html+="<th width='21%'>状态</th>";
                html+="<th width='10%'>详情</th>";
                html+="</tr>";

                if(list.length<10){
                    $(".taskMore").hide();
                    for (var i = 0; i < list.length; i++) {
                        html+="<tr taskid="+list[i].task_id+">";
                        if(getLocalTime3(list[i].create_time)==GetDateStr(0)){
                            html+="<td>今天 "+safeStr(getLocalTime4(list[i].create_time))+"<span style='display:none'>"+safeStr(getLocalTime(list[i].create_time))+"</span></td>";
                        }else if(getLocalTime3(list[i].create_time)==GetDateStr(-1)){
                            html+="<td>昨天 "+safeStr(getLocalTime4(list[i].create_time))+"<span style='display:none'>"+safeStr(getLocalTime(list[i].create_time))+"</span></td>";
                        }else{
                            html+="<td>"+safeStr(getLocalTime3(list[i].create_time))+"<span style='display:none'>"+safeStr(getLocalTime(list[i].create_time))+"</span></td>";
                        } 
                        
                        if(list[i].type=="quick_scan"){
                            html+="<td>快速查杀</td>";
                        }else if(list[i].type=="full_scan"){
                            html+="<td>全盘查杀</td>";
                        }else if(list[i].type=="update"){
                            html+="<td>升级任务</td>";
                        }else if(list[i].type=="message"){
                            html+="<td>通知任务</td>";
                        }else if(list[i].type=="shutdown"){
                            html+="<td>关机</td>";
                        }else if(list[i].type=="reboot"){
                            html+="<td>重启</td>";
                        }else if(list[i].type=="msg_uninstall"){
                            html+="<td>软件卸载</td>";
                        }else if(list[i].type=="msg_distrfile"){
                            html+="<td>文件分发</td>";
                        }else if(list[i].type=="migrate"){
                            html+="<td>中心迁移</td>";
                        }else if(list[i].type=="leakrepair_repair"){
                            html+="<td>漏洞修复</td>";
                        }else if(list[i].type=="leakrepair_scan"){
                            html+="<td>漏洞扫描</td>";
                        }else if(list[i].type=="vnc_launch"){
                            html+="<td>远程桌面</td>";
                        }else if(!list[i].type){
                            html+="<td></td>";
                        }

                        html+="<td>"+list[i].client_done+"/"+list[i].client_all+"</td>";
                        if(list[i].status==0){
                            html+="<td>正在分发</td>"; 
                        }else if(list[i].status==1){
                            html+="<td>分发结束</td>";
                        }else{
                        	html+="<td></td>";
                        }
                        html+="<td><a class='blackfont underline cursor'  onclick='taskDetailPop(this)'>详情</a></td>";
                        html+="</tr>";
                    }
                }else{
                    $(".taskMore").show();
                    for (var i = 0; i < 10; i++) {
                        html+="<tr taskid="+list[i].task_id+">";
                        if(getLocalTime3(list[i].create_time)==GetDateStr(0)){
                            html+="<td>今天 "+safeStr(getLocalTime4(list[i].create_time))+"<span style='display:none'>"+safeStr(getLocalTime(list[i].create_time))+"</span></td>";
                        }else if(getLocalTime3(list[i].create_time)==GetDateStr(-1)){
                            html+="<td>昨天 "+safeStr(getLocalTime4(list[i].create_time))+"<span style='display:none'>"+safeStr(getLocalTime(list[i].create_time))+"</span></td>";
                        }else{
                            html+="<td>"+safeStr(getLocalTime3(list[i].create_time))+"<span style='display:none'>"+safeStr(getLocalTime(list[i].create_time))+"</span></td>";
                        } 
                        
                        if(list[i].type=="quick_scan"){
                            html+="<td>快速查杀</td>";
                        }else if(list[i].type=="full_scan"){
                            html+="<td>全盘查杀</td>";
                        }else if(list[i].type=="update"){
                            html+="<td>升级任务</td>";
                        }else if(list[i].type=="message"){
                            html+="<td>通知任务</td>";
                        }else if(list[i].type=="shutdown"){
                            html+="<td>关机</td>";
                        }else if(list[i].type=="reboot"){
                            html+="<td>重启</td>";
                        }else if(list[i].type=="msg_uninstall"){
                            html+="<td>软件卸载</td>";
                        }else if(list[i].type=="msg_distrfile"){
                            html+="<td>文件分发</td>";
                        }else if(list[i].type=="migrate"){
                            html+="<td>中心迁移</td>";
                        }else if(list[i].type=="leakrepair_repair"){
                            html+="<td>漏洞修复</td>";
                        }else if(list[i].type=="leakrepair_scan"){
                            html+="<td>漏洞扫描</td>";
                        }else if(list[i].type=="vnc_launch"){
                            html+="<td>远程桌面</td>";
                        }else if(!list[i].type){
                            html+="<td></td>";
                        }
                        html+="<td>"+list[i].client_done+"/"+list[i].client_all+"</td>";
                        if(list[i].status==0){
                            html+="<td>正在分发</td>"; 
                        }else if(list[i].status==1){
                            html+="<td>分发结束</td>";
                        }else{
                        	html+="<td></td>";
                        }
                        html+="<td><a class='blackfont underline cursor'  onclick='taskDetailPop(this)'>详情</a></td>";
                        html+="</tr>";
                    }

                }
                
                $(".taskTable table").html(html); 
            }
        }
    });  
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
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
        	if(xhr.status==401){
        	    parent.window.location.href='/';
        	}else{
        		
        	}
            
        },
        success:function(data){
            var list=data.data;
                            
            var html="";

            if(list.length==0){
                $(".logMore").hide();
                $(".eventTable").html("<img src='images/notable.png' style='display:block;margin:0 auto;padding-top:118px;'><p style='text-align:center;padding-top:24px;'>暂无数据内容</p>");   
            }else{
                if(list.length<10){
                    $(".logMore").hide();
                }else{
                    $(".logMore").show();
                }     
                html+="<tr>";
                                            
                html+="<th width='26%'>时间</th>";
                html+="<th width='22%'>事件</th>";
                html+="<th width='21%'>终端</th>";
                html+="<th width='21%'>状态</th>";
                html+="<th width='10%'>详情</th>";
                html+="</tr>";
                for (var i = 0; i < list.length; i++) {
                    html+="<tr>";
                    if(getLocalTime3(list[i].time)==GetDateStr(0)){
                        html+="<td>今天 "+safeStr(getLocalTime4(list[i].time))+"</td>";
                    }else if(getLocalTime3(list[i].time)==GetDateStr(-1)){
                        html+="<td>昨天 "+safeStr(getLocalTime4(list[i].time))+"</td>";
                    }else{
                        html+="<td>"+safeStr(getLocalTime3(list[i].time))+"</td>";
                    }
                    
                    switch (list[i].fname) {
                        case "filemon":
                        html+="<td>文件实时监控</td>";
                        break;
                        case "behavior":
                        html+="<td>恶意行为监控</td>";
                        break;
                        case "dlmon":
                        html+="<td>下载保护</td>";
                        break;
                        case "udiskmon":
                        html+="<td>U盘保护</td>";
                        break;
                        case "sysprot":
                        html+="<td>系统加固</td>";
                        break;
                        case "scan":
                        html+="<td>病毒查杀</td>";
                        break;
                        case "malurl":
                        html+="<td>恶意网站拦截</td>";
                        break;
                        case "instmon":
                        html+="<td>软件安装拦截</td>";
                        break;
                        case "intrusion":
                        html+="<td>黑客入侵拦截</td>";
                        break;
                        case "ipattaack":
                        html+="<td>对外攻击检测</td>";
                        break;
                        case "mail":
                        html+="<td>邮件监控</td>";
                        break;
                        case "ipblacklist":
                        html+="<td>IP黑名单</td>";
                        break;
                        case "ipproto":
                        html+="<td>IP协议控制</td>";
                        break;
                        default:
                        html+="<td></td>";
                        break;
                    }
                    
                    html+="<td><span class='nameWidth' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</td>";
                    if('result' in list[i].detail){
                        switch (list[i].detail.result) {
                            case 0:
                            html+="<td>处理失败</td>";
                            break;
                            case 1:
                            html+="<td>处理失败</td>";
                            break;
                            case 2:
                            html+="<td>已忽略</td>";
                            break;
                            case 3:
                            html+="<td>已处理</td>";
                            break;
                            case 4:
                            html+="<td>已处理</td>";
                            break;
                            case 5:
                            html+="<td>已信任</td>";
                            break;
                            case 6:
                            html+="<td>已忽略</td>";
                            break;
                            default:
	                        html+="<td></td>";
	                        break;

                        }
                    }
                    if('treatment' in list[i].detail){
                        switch (list[i].detail.treatment & 0x0FFFF) {
                            case 0:
                            html+="<td>已忽略</td>";
                            break;
                            case 1:
                            html+="<td>待处理</td>";
                            break;
                            case 2:
                            html+="<td>已处理</td>";
                            break;
                            case 3:
                            html+="<td>已阻止</td>";
                            break;
                            case 4:
                            html+="<td>已信任</td>";
                            break;
                            case 5:
                            html+="<td>已处理</td>";
                            break;
							default:
	                        html+="<td></td>";
	                        break;
                        } 
                    }
                    if('blocked' in list[i].detail){
                        switch (list[i].detail.blocked & 0x0FFFF) {
                            case 0:
                            html+="<td>已放过</td>";
                            break;
                            case 1:
                            html+="<td>已阻止</td>";
                            break;
                            default:
	                        html+="<td></td>";
	                        break;
                        } 
                    }
                    if(!('treatment' in list[i].detail) && !('result' in list[i].detail) && !('blocked' in list[i].detail)){
                        html+="<td>已阻止</td>";
                    }
            
                    html+="<td class='relative'><a class='blackfont underline cursor' onclick='seeDetailFloat(this)'>详情</a>";
                    switch (list[i].fname) {
                        case "filemon":
                        case "scan":
                        case "behavior":
                        case "udiskmon":
                        case "dlmon":
                        case "mail":
                        html+="<div class='absolute detailFloat'>";
                        html+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span><div class='clear'></div></h4>";
                        if(list[i].fname!=="behavior"){
                            html+="<p>病毒ID : "+safeStr(list[i].detail.virus_id)+"</p>";
                        }
                        
                        html+="<p>病毒名称 : "+safeStr(list[i].detail.virus_name)+"</p>";
                        switch (list[i].fname){
                            case "mail":
                            html+="<p>威胁来源 : "+safeStr(list[i].detail.mail_from.replace('<','&lt;').replace('>','&gt;'))+"</p>";
                            break;
                            default:
                            html+="<p>威胁来源 : "+safeStr(list[i].detail.file_path)+"</p>";
                            break;
                        }
                        
                        switch (list[i].fname){
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
                        if(list[i].detail.result==0){
                            html+="<p>状态 : 处理失败</p>";
                        }else if(list[i].detail.result==1){
                            html+="<p>状态 : 处理失败</p>";
                        }else if(list[i].detail.result==2){
                            html+="<p>状态 : 已忽略</p>";
                        }else if(list[i].detail.result==3){
                            html+="<p>状态 : 已处理</p>";
                        }else if(list[i].detail.result==4){
                            html+="<p>状态 : 已处理</p>";
                        }else if(list[i].detail.result==5){
                            html+="<p>状态 : 已信任</p>";
                        }else if(list[i].detail.result==6){
                            html+="<p>状态 : 已忽略</p>";
                        }else{
                        	html+="<p></p>";
                        }
                        html+="</div>";
                        break;
                        case "sysprot":
                        
                        html+="<div class='absolute detailFloat'>";
                        html+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span><div class='clear'></div></h4>";
                        html+="<p>保护项目 : "+safeStr(list[i].detail.rule_name)+"</p>";
                        html+="<p>操作者 : "+safeStr(list[i].detail.proc_name)+"</p>";
                        html+="<p>命令行 : "+safeStr(list[i].detail.cmdline)+"</p>";
                        if(list[i].detail.cls==0){
                            html+="<p>目标文件 : "+safeStr(list[i].detail.res_path)+"</p>";
                        }
                        if(list[i].detail.cls==1){
                            html+="<p>目标注册表 : "+safeStr(list[i].detail.res_path)+"</p>";
                        }
                        if(list[i].detail.cls==2){
                            html+="<p>执行文件 : "+safeStr(list[i].detail.res_path)+"</p>";
                        }
                        if(list[i].detail.cls==3){
                            html+="<p>可疑文件 : "+safeStr(list[i].detail.res_path)+"</p>";
                        }
                        if((list[i].detail.acttype&0x01)!== 0) {

                            html+="<p>操作类型 : 创建</p>";
                        }else if((list[i].detail.acttype&0x02)!= 0){

                            html+="<p>操作类型 : 读取</p>";
                        }else if((list[i].detail.acttype&0x04)!= 0){

                            html+="<p>操作类型 : 写入</p>";
                        }else if((list[i].detail.acttype&0x08)!= 0){

                            html+="<p>操作类型 : 删除</p>";
                        }else if((list[i].detail.acttype&0x10)!= 0){

                            html+="<p>操作类型 : 执行</p>";
                        }
                        if(list[i].detail.cls==1){
                            html+="<p>数据内容 : "+safeStr(list[i].detail.res_val)+"</p>";           
                        }                        
                        if((list[i].detail.treatment & 0x0FFFF)==0){
                            html+="<p>状态 : 已忽略</p>";
                        }else if((list[i].detail.treatment & 0x0FFFF)==1){
                            html+="<p>状态 : 待处理</p>";
                        }else if((list[i].detail.treatment & 0x0FFFF)==2){
                            html+="<p>状态 : 已处理</p>";
                        }else if((list[i].detail.treatment & 0x0FFFF)==3){
                            html+="<p>状态 : 已阻止</p>";
                        }else if((list[i].detail.treatment & 0x0FFFF)==4){
                            html+="<p>状态 : 已信任</p>";
                        }else if((list[i].detail.treatment & 0x0FFFF)==5){
                            html+="<p>状态 : 已处理</p>";
                        }else{
                        	html+="<p></p>";
                        };
                        html+="</div>";
                        break;
                        case "instmon":
                        html+="<div class='absolute detailFloat'>";
                        html+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span><div class='clear'></div></h4>";
                        html+="<p>软件名称 : "+safeStr(list[i].detail.display_name)+"</p>";
                        html+="<p>软件路径 : "+safeStr(list[i].detail.file_path)+"</p>";
                        html+="<p>操作者 : "+safeStr(list[i].detail.proc_path)+"</p>";
                        
                                              
                        if((list[i].detail.treatment & 0x0FFFF)==0){
                            html+="<p>状态 : 已忽略</p>";
                        }else if((list[i].detail.treatment & 0x0FFFF)==1){
                            html+="<p>状态 : 待处理</p>";
                        }else if((list[i].detail.treatment & 0x0FFFF)==2){
                            html+="<p>状态 : 已处理</p>";
                        }else if((list[i].detail.treatment & 0x0FFFF)==3){
                            html+="<p>状态 : 已阻止</p>";
                        }else if((list[i].detail.treatment & 0x0FFFF)==4){
                            html+="<p>状态 : 已信任</p>";
                        }else if((list[i].detail.treatment & 0x0FFFF)==5){
                            html+="<p>状态 : 已处理</p>";
                        }else{
                        	html+="<p></p>";
                        };
                        html+="</div>";
                        break;
                        case "intrusion":
                        html+="<div class='absolute detailFloat'>";
                        html+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span><div class='clear'></div></h4>";
                        html+="<p>入侵类型 : "+safeStr(list[i].detail.name)+"</p>";
                        html+="<p>远程地址 : "+list[i].detail.raddr+"</p>";
                        html+="<p>关联进程 : "+safeStr(list[i].detail.cmdline)+"</p>";
                        if((list[i].detail.blocked)==0){
                            html+="<p>状态 : 已放过</p>";
                        }else if((list[i].detail.blocked)==1){
                            html+="<p>状态 : 已阻止</p>";
                        }else{
                        	html+="<p></p>";
                        }
                        html+="</div>";
                        break;
                        case "ipattaack":
                        html+="<div class='absolute detailFloat'>";
                        html+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span><div class='clear'></div></h4>";
                        html+="<p>攻击类型 : "+safeStr(list[i].detail.rule_name)+"</p>";
                        html+="<p>远程地址 : "+safeStr(list[i].detail.proc_name)+"</p>";
                        html+="<p>关联进程 : "+safeStr(list[i].detail.cmdline)+"</p>";
                        html+="<p>状态:已阻止</p>";
                        html+="</div>";
                        break;
                        case "malurl":
                        html+="<div class='absolute detailFloat'>";
                        html+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span><div class='clear'></div></h4>";
                        html+="<p>拦截网址 : "+safeStr(list[i].detail.domain)+"</p>";
                        if(list[i].detail.cls=="spy"){
                            html+="<p>网址类型 : 木马，盗号</p>";  
                        }else if(list[i].detail.cls=="phising"){
                            html+="<p>网址类型 : 钓鱼，仿冒</p>";
                        }else if(list[i].detail.cls=="fraud"){
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
                       
                        html+="<p>远程IP : "+list[i].detail.raddr+"</p>";
                        html+="<p>备注 : "+safeStr(list[i].detail.name)+"</p>";
                        if(list[i].detail.blocked==1){
                        	 html+="<p>状态 : 已阻止</p>";
                        }else{
                        	 html+="<p>状态 : 已放过</p>";
                        }
                       
                        html+="</div>";
                        break;
                        case "ipproto":
                        html+="<div class='absolute detailFloat'>";
                        html+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span><div class='clear'></div></h4>";
                       
                        html+="<p>触犯规则名称 : "+safeStr(list[i].detail.name)+"</p>";
                        if(list[i].detail.outbound==1){
                        	html+="<p>触犯动作 : 联出"+safeStr(_int2ip(list[i].detail.raddr))+":"+list[i].detail.rport+"</p>";
                        }else{
                        	html+="<p>触犯动作 : 联入"+safeStr(_int2ip(list[i].detail.raddr))+":"+list[i].detail.rport+"</p>";
                        }
                        
                        if(list[i].detail.blocked==1){
                        	 html+="<p>状态 : 已阻止</p>";
                        }else{
                        	 html+="<p>状态 : 已放过</p>";
                        }
                       
                        html+="</div>";
                        break;
                        
                        

                    }
                    
                    html+="</td>";
                    html+="</tr>"; 
                }
                
                $(".eventTable table").html(html);
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
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
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
            var finsh_text = "";
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
                        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
                        error:function(xhr,textStatus,errorThrown){
				        	if(xhr.status==401){
				        	    parent.window.location.href='/';
				        	}else{
				        		
				        	}
				            
				        },
                        success:function(data){
                            var html="";
                            var finsh_text = "";
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
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
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
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
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
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
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
//默认显示病毒图
columnChart(0,'#f8ac59');
function columnChart(type,color){
    dataArrr=[];
    tername=[];
    $.ajax({
        url:'/mgr/stat/_trendtop',
        data:JSON.stringify({"type":type}),
        type:'POST',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                parent.window.location.href='/';
            }
        },
        success:function(data){
            if(data.errno==0){
                for (var i = 0; i < data.data.length; i++) {
                    dataArrr.push(data.data[i].count);
                    tername.push(data.data[i].hostname)
                }
                if(dataArrr.length==0){
                    $("#column").html("<img src='images/nochart.png' style='display:block;margin:0 auto;padding-top:60px;'><p style='text-align:center;padding-top:24px;'>暂无数据内容</p>");
    
                }else{
                    column(dataArrr,tername,color);
    
                }
            }else if(data.errno==-1){
                alert(data.errmsg);
            }
            
            
        }       
    })
}
function column(dataArrr,tername,color){
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
            categories: tername,
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
            color:color,
            data: dataArrr
        }]
    })
}


$(".virusB").click(function(){
    var color = '#f8ac59';
    $(".chartBlock .buttons a").css({background:"#ffffff"});
    $(".netB").css({color:"#a889dd"});
    $(".systemB").css({color:"#7ea0fc"});
    $(this).css({background:"#f8ac59",color:"#ffffff"});
    columnChart(0,color);  
})
$(".netB").click(function(){
    var color = '#a889dd';
    $(".chartBlock .buttons a").css({background:"#ffffff"});
    $(".virusB").css({color:"#f8ac59"});
    $(".systemB").css({color:"#7ea0fc"});
    $(this).css({background:"#a889dd",color:"#ffffff"});
    columnChart(2,color);  
})
$(".systemB").click(function(){
    var color = '#7ea0fc';
    $(".chartBlock .buttons a").css({background:"#ffffff"});
    $(".virusB").css({color:"#f8ac59"});
    $(".netB").css({color:"#a889dd"});
    $(this).css({background:"#7ea0fc",color:"#ffffff"});
    columnChart(1,color);
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
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
	    error:function(xhr,textStatus,errorThrown){
	    	if(xhr.status==401){
	    	    parent.window.location.href='/';
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
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
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
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
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
            headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
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
    
})
