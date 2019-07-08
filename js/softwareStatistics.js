
//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a[name='softwareStatistics.html']").addClass("current");
parent.$(".nav .container a[name='softwareStatistics.html']").siblings().removeClass("current");
parent.$(".footer").show();

document.cookie='page=softwareStatistics.html';
//调整页面内元素高度
var mainlefth=parent.$("#iframe #mainFrame").height();

$(".main .table").css({height:mainlefth-347});

window.onresize = function(){
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .table").css({height:mainlefth-347});

}
//卸载全选终端
function selectAllT(checkbox) {
    $('.selectT').prop('checked', $(checkbox).prop('checked'));
}
$(".uninstallSPop .terminallist").on("click",".td input[type=checkbox]",function(){
    if($(".td input[type=checkbox]:checked").length==($(".td input[type=checkbox]").length)){
        $(".uninstallSPop .terminallist .th-ordery input[type=checkbox]").prop("checked",true)
    }else{
        $(".uninstallSPop .terminallist .th-ordery input[type=checkbox]").prop("checked",false)
    }
})
//按钮样式

$(".bu").click(function(){
	$(this).siblings(".bu").removeClass("current");
	$(this).addClass("current");
	
	$('.tableth th.th-ordery').removeClass().addClass('th-ordery');
	$('.main .tableth').removeAttr('index');
	$('.main .tableth').removeAttr('indexCls');
//	$('.main .tableth th.th-ordery.th-ordery-current').removeAttr('type');
	accEvent();
});
//卸载软件弹层
var uninstallSN="";
var uninstallSP="";
var uninstallSV="";
var uninstallswid="";
var uninstallshostnum="";
var terminalidarr=[];
$(".uninstallSPop .terminallist .container").on("change","input[type=checkbox]",function(){
    var terminalid=parseInt($(this).attr("clientid"));
    if($(this).is(":checked")){
        
        terminalidarr.push(terminalid);    
    }else{
        terminalidarr.splice(jQuery.inArray(terminalid,terminalidarr),1);
    }
})
$(".uninstallSPop .terminallist .th").on("change","input[type=checkbox]",function(){
    if($(this).is(":checked")){
       $(".uninstallSPop .terminallist .container .td input[type=checkbox]").each(function(){
            var terminalid=parseInt($(this).attr("clientid"));
            if(isInArray(terminalidarr,terminalid)==false){
                terminalidarr.push(terminalid);
            }
       }) 
    }else{
        $(".uninstallSPop .terminallist .container .td input[type=checkbox]").each(function(){
            var terminalid=parseInt($(this).attr("clientid"));
            if(isInArray(terminalidarr,terminalid)==true){
                terminalidarr.splice(jQuery.inArray(terminalid,terminalidarr),1);
            }
        }) 
    }
})
function uninstallSPop(a){
	$('.terminallist p.th-ordery').removeClass().addClass('th-ordery');
	$('.terminallist p.th-ordery').find('i').attr('class','fa fa-sort');
    $(".uninstallSPop textarea").next().hide();
    uninstallSN=$(a).parents("tr").find("td").eq(0).find("span").html();
    uninstallSP=$(a).parents("tr").find("td").eq(1).find("span").html();
    uninstallSV=$(a).parents("tr").find("td").eq(2).html();
    $(".uninstallSPop .searchTerminal font").html(uninstallSN);
	$(".uninstallSPop").show();
    $(".uninstallSPop .textarea textarea").val("你的电脑存在不符合公司安全规范的软件，请尽快卸载");
	shade();
    
    uninstallswid=parseInt($(a).parents("tr").attr("swid"));
    uninstallshostnum=parseInt($(a).parents("tr").find("td").eq(3).find("a").html());
    $.ajax({
            url:'/mgr/group/_list',
            dataType:'json',
            data:{},
            type:'GET',
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
                html+="<a class='td block cursor current' clientnum="+data.data.all.clients+">所有分组</a>";
                html+="<a class='td block cursor' groupid="+data.data.ungrouped.group_id+" clientnum="+data.data.ungrouped.clients+">未分组终端</a>";
                for (var i = 0; i < list.length; i++) {
                    html+="<a class='td block cursor' groupid="+list[i].group_id+" clientnum="+list[i].clients+">"+safeStr(list[i].group_name)+"</a>";
                };
                $(".uninstallSPop .grouplist .container").html(html);

                 uninstallSTAjax();
			}
    })
   
}


//卸载软件排序


$(document).on('click','.terminallist p.th-ordery a .fa',function(){

	var toggleClass = $(this).parents('p').attr('class');
	if(toggleClass == 'th-ordery'){
		$(this).parents('p').addClass('th-ordery-current th-ordery-up');
		$(this).attr('class','fa fa-sort-asc');
	}else if(toggleClass == 'th-ordery th-ordery-current th-ordery-up'){
		$(this).parents('p').addClass('th-ordery-current th-ordery-down');
		$(this).attr('class','fa fa-sort-desc');
	}else if(toggleClass == 'th-ordery th-ordery-current th-ordery-up th-ordery-down'){
		$(this).parents('p').removeClass('th-ordery-current th-ordery-down th-ordery-up');
		$(this).attr('class','fa fa-sort');
	}
	uninstallSTAjax();
})
// 卸载软件相关终端列表ajax
function uninstallSTAjax(){
    var filter=trim($(".uninstallSPop #searchKeyT").val());
    var group_id = parseInt($('.grouplist .td.current').attr('groupid'));
    
    var dataa={"groupby":"hostname","swid":uninstallswid,"group_id":group_id,"filter":{"hostname":filter},"view":{"begin":0,"count":uninstallshostnum}};
    var type = $('.terminallist p.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.terminallist p.th-ordery.th-ordery-current').attr('class');
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
        url:'/mgr/swinfo/_search',
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
            var list=data.data.list;
            var th="";
            var table="";
            if(list != null){
	            var checkednum=0;
				for (var i = 0; i < list.length; i++) {
	                if(isInArray(terminalidarr,list[i].client_id)==true){
	                    checkednum++;
	                    table+="<a class='td block' ><input type='checkbox' class='verticalMiddle select' clientid="+list[i].client_id+" checked> <span class='verticalMiddle filePath' style='width:310px;' title='"+safeStr(list[i].hostname)+"'> "+safeStr(list[i].hostname)+"</span></a>"; 
	                }else{
	                    table+="<a class='td block'><input type='checkbox' class='verticalMiddle select' clientid="+list[i].client_id+"> <span class='verticalMiddle filePath' style='width:310px;'  title='"+safeStr(list[i].hostname)+"'> "+safeStr(list[i].hostname)+"</span></a>";
	                }
					
				};
				if(checkednum==list.length && list.length>0){
	                $(".uninstallSPop .terminallist .th input[type=checkbox]").prop("checked",true); 
	            }else{
	                $(".uninstallSPop .terminallist .th input[type=checkbox]").prop("checked",false);
	            }
	            
	            $(".uninstallSPop .terminallist .container").html(table);
           }else{
           		$(".uninstallSPop .terminallist .container").html('');
           }
            
            
        }
    })
}
// 搜索卸载软件相关终端
$(".uninstallSPop #searchKeyT").keyup(function(){
    uninstallSTAjax();
})

$(".uninstallSPop").on("click",".grouplist .td",function(){
	$(this).siblings(".td").removeClass('current');
	$(this).addClass("current");
	uninstallSTAjax();
})
function sureUSButton(a){
    if($(".uninstallSPop .terminallist .container .select:checked").length==0){
        $(".delayHide").show();
        $(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'> 请选择终端</span>");
        setTimeout(function(){$(".delayHide").hide()},2000);
    }else{
        var terminalarr=[];
        $(".uninstallSPop .terminallist .container .select:checked").each(function(){
            terminalarr.push(parseInt($(this).attr("clientid")));
        })
        var text=$(".uninstallSPop .textarea textarea").val();
        var dataa={"type":"msg_uninstall","clients":terminalarr,"param":{"text":text,"software":{"name":uninstallSN,"publisher":uninstallSP,"version":uninstallSV}}};
        $.ajax({
            url:'/mgr/swinfo/_uninst',
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
                $(a).parents(".pop").hide();
                $(".shade").hide();
                parent.$(".topshade").hide();
                $(".delayHideS").show();
                $(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> 操作成功</span>");
                setTimeout(function(){$(".delayHideS").hide()},2000);
            }
        }) 
    }
    
}

//关闭弹层
$(".closeW").click(function(){
	$(".shade").hide();
	parent.$(".topshade").hide();
    $(this).parent().parent().hide();
});
function hideButton(a){
    $(a).parents(".pop").hide();
    parent.$(".topshade").hide();
    $(".shade").hide();
}

// 搜索框离开键盘触发搜索
$("#searchKey").keyup(function(){
	accEvent();
})
//卸载管理弹层
$(".uninstallMB").click(function(){
	shade();
	$(".recentTaskPop").show();
    recentTaskAjax();
})

//近期任务弹层列表悬浮效果
$(".recentTaskPop .content .container").on("mouseenter",".list",function(){
    $(this).find(".showTaskTerIcon").css({backgroundPosition:"-18px"})
})
$(".recentTaskPop .content .container").on("mouseleave",".list",function(){
    $(this).find(".showTaskTerIcon").css({backgroundPosition:"0px"})
})
// 近期任务列表ajax
function recentTaskAjax(){
    $.ajax({
        url:'/mgr/task/_recent?type=msg_uninstall',
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
            for (var i = 0; i < list.length; i++) {
                var createtime=list[i].create_time;
                createtime=getLocalTime(createtime);
                html+="<div class='list' taskid='"+list[i].task_id+"'>";
                html+="<span class='td cursor firsttd' onclick='showTaskTer(this)'>"+safeStr(createtime)+"</span>";
                html+="<span class='td cursor' onclick='showTaskTer(this)'>"+list[i].client_done+"/"+list[i].client_all+"</span>";
                if(list[i].status==0){
                    html+="<span class='td cursor' onclick='showTaskTer(this)'>正在分发</span>";
                }else{
                    html+="<span class='td cursor' onclick='showTaskTer(this)'>分发结束</span>";
                }
                html+="<a onclick='showTaskTer(this)' class='showTaskTerIcon verticalMiddle cursor'></a>";
                html+="</div>";
                html+="<div class='table'></div>";
            };
            if(list.length==0){
                $(".recentTaskPop .content .container").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>"); 
            }else{
                $(".recentTaskPop .content .container").html(html);
            }
            

        }
    });
}
//展开或关闭任务相关终端模块
function showTaskTer(a){
    if($(a).parent().next().is(":hidden")){
        $(a).parent().next().siblings(".table").hide();
        $(a).parent().children(".showTaskTerIcon").css({background:"url(images/task2.png)",backgroundPosition:"-18px"});
        $(a).parent().next().slideDown(200);
        var taskid=parseInt($(a).parent().attr("taskid"));
        dataa={"taskid":taskid,"view":{"begin":0,"count":20}};
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
                    html+="<table>";
                    html+="<tr>";
                    html+="<td width='50%'>卸载软件 : <span class='filePath' title="+safeStr(pathtitle(data.data.param.software.name)+"&nbsp;&nbsp;"+safeStr(data.data.param.software.version))+">"+safeStr(data.data.param.software.name)+"&nbsp;&nbsp;"+safeStr(data.data.param.software.version)+"</span></td>";
                    html+="<td width='50%'>软件发布者 : <span class='filePath' title="+safeStr(pathtitle(data.data.param.software.publisher))+">"+safeStr(data.data.param.software.publisher)+"</span></td>";
                    html+="</tr>";
                    html+="</table>";
                    html+="<table>";
                    html+="<tr class='th'>";
                    html+="<th width='28%'>终端分组</th>";
                    html+="<th width='28%'>终端名称</th>";
                    html+="<th width='16%'>状态</th>";
                    html+="<th width='28%'>备注</th>";
                    html+="</tr>";
                    for (var i = 0; i < list.length; i++) {
                        html+="<tr>";
                        if(list[i].groupname==""){
                            html+="<td>(已删除终端)</td>";
                        }else{
                            html+="<td>"+safeStr(list[i].groupname)+"</td>";
                        }
                        
                        html+="<td>"+safeStr(list[i].hostname)+"</td>";
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
                    html+="</table>";
                    // html+="<a class='seeMore'>查看更多</a>";
                    $(a).parent().next().html(html);

                }       
        });

    }else{
        $(a).parent().next().hide();
        $(a).parent().children(".showTaskTerIcon").css({background:"url(images/task1.png)",backgroundPosition:"-18px"});
    }

};

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

$(document).on('click','.tableContainer .tableth th.th-ordery',function(){
	var toggleClass = $(this).attr('class');
	$(this).siblings('th.th-ordery').removeClass().addClass('th-ordery');
	$(this).siblings('th.th-ordery').find('img').attr('src','images/th-ordery.png');
	if(toggleClass == 'th-ordery'){
		$(this).find('img').attr('src','images/th-ordery-up.png');
		$(this).addClass('th-ordery-current th-ordery-up');
		$(this).parents('.tableth').attr('indexCls','th-ordery th-ordery-current th-ordery-up');
		$(this).parents('.tableth').attr('index',$(this).index());
		
	}else if(toggleClass == 'th-ordery th-ordery-current th-ordery-up'){
		$(this).find('img').attr('src','images/th-ordery-down.png');
		$(this).addClass('th-ordery-current th-ordery-down');
		$(this).parents('.tableth').attr('indexCls','th-ordery th-ordery-current th-ordery-up th-ordery-down');
		$(this).parents('.tableth').attr('index',$(this).index());
		
	}else if(toggleClass == 'th-ordery th-ordery-current th-ordery-up th-ordery-down'){
		$(this).find('img').attr('src','images/th-ordery.png');
		$(this).removeClass('th-ordery-current th-ordery-down th-ordery-up');
		$(this).parents('.tableth').attr('indexCls','th-ordery');
		$(this).parents('.tableth').attr('index',$(this).index());
	}
	var currentPage = $(this).parents('.tableContainer').find('.tcdPageCode span.current').text();
	var currentNum = $(this).parents('.tableContainer').find('#numperpageinput').val();
	var start = (parseInt(currentPage) - 1) * parseInt(currentNum);
	accEvent(start);
})
accEvent();
var ajaxtable=null;
function accEvent(start){
    if(ajaxtable){
    ajaxtable.abort();  
    }

    var sta="";
    var dataa="";
    var groupby="";
    var filter="";
    if(start == undefined) {
		start = 0;
	}else{
		start = start;
	}
    if($("#functionBlock .current").index()==1){
        groupby="software";
        filter=trim($("#searchKey").val());
        dataa={"groupby":groupby,filter:{"software":filter},"view":{"begin":start,"count":numperpage}};

    }else if($("#functionBlock .current").index()==2){
        groupby="hostname";
        filter=trim($("#searchKey").val());
        dataa={"groupby":groupby,filter:{"hostname":filter},"view":{"begin":start,"count":numperpage}};
    }
 	var type = $('.tableth th.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.tableth th.th-ordery.th-ordery-current').attr('class');
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
    $(".table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
    ajaxtable=
    $.ajax({
        url:'/mgr/swinfo/_search',
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
            var list=data.data.list;
            var tableth="";
            var table="";
            var total=Math.ceil(data.data.view.total/numperpage);
            
            table+="<table>";
            if($("#functionBlock .current").index()==1 && list!==null){
                tableth+="<tr>";
                tableth+="<th width='30%' class='th-ordery' type='name'>软件名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='30%' class='th-ordery' type='publisher'>发布者<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='16%' class='th-ordery' type='version'>版本号<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='8%' class='th-ordery' type='installed'>已安装<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='8%' class='th-ordery' type='rate'>安装率<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='8%'>操作</th>";
                tableth+="</tr>";
                table+="<tr id='tableAlign'>";
                table+="<td width='30%'>软件名称</td>";
                table+="<td width='30%'>发布者</td>";
                table+="<td width='16%'>版本号</td>";
                table+="<td width='8%'>已安装</td>";
                table+="<td width='8%'>安装率</td>";
                table+="<td width='8%'>操作</td>";
                table+="</tr>";
                for(i=0;i<list.length;i++){
                    table+="<tr swid="+list[i].swid+">";
                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].name))+">"+safeStr(list[i].name)+"</span></td>";
                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].publisher))+">"+safeStr(list[i].publisher)+"</span></td>";
                    table+="<td>"+safeStr(list[i].version)+"</td>";
                    table+="<td><a  class='underline cursor blackfont seeDetail'>"+list[i].installed+"</a></td>";
                    table+="<td>"+list[i].rate+"%</td>";
                    table+="<td><a class='blackfont underline cursor' onclick='uninstallSPop(this)'>卸载</a></td>";
                    table+="</tr>";
                }

            }else if($("#functionBlock .current").index()==1 && list==null){
                tableth+="<tr>";
               tableth+="<th width='30%' class='th-ordery' type='name'>软件名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='30%' class='th-ordery' type='publisher'>发布者<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='16%' class='th-ordery' type='version'>版本号<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='8%' class='th-ordery' type='installed'>已安装<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='8%' class='th-ordery' type='rate'>安装率<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='8%' >操作</th>";
                tableth+="</tr>";
                

            }else if($("#functionBlock .current").index()==2 && list!==null){
                tableth+="<tr>";
                tableth+="<th width='40%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='40%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='count'>软件安装总数<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";
                table+="<tr id='tableAlign'>";
                table+="<td width='40%'>终端名称</td>";
                table+="<td width='40%'>终端分组</td>";
                table+="<td width='20%'>软件安装总数</td>";
                table+="</tr>";
                for(i=0;i<list.length;i++){
                    table+="<tr client="+list[i].client_id+">";
                    table+="<td><span style='width:400px;' title='"+safeStr(list[i].hostname)+"' class='filePath'>"+safeStr(list[i].hostname)+"</span></td>";
                    table+="<td>"+safeStr(list[i].group_name)+"</td>";
                    table+="<td><a  class='underline cursor blackfont seeDetail'>"+list[i].count+"</a></td>";  
                    table+="</tr>";
                }

            }else if($("#functionBlock .current").index()==2 && list==null){
                tableth+="<tr>";
               	tableth+="<th width='40%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='40%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='count'>软件安装总数<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";

            }
            
            table+="</table>";
            $(".table table").hide();
            $(".main .tableth table").html(tableth);
            $(".table").html(table);
            $(".table table").show();
         
			var thIndex=$('.main .tableth').attr('index');
			var thCls=$('.main .tableth').attr('indexCls');
			$('.main .tableth th').eq(thIndex).addClass(thCls);
			
			imgOrderyFun(thIndex,thCls);
            $(".clearfloat").remove();
            $(".tcdPageCode").remove();
            $(".totalPages").remove();
            $(".numperpage").remove();
            $(".tableContainer").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left' class='totalPages'>共 "+data.data.view.total+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><a style='font-size:12px;float:right;line-height:54px;padding-right:20px;color:#6a6c6e' class='numperpage'>每页<input type='text' id='numperpageinput' value="+numperpage+" style='font-size:12px;width:40px;height:24px;margin:0 4px;vertical-align:middle;padding:0 10px;'>条</a><div class='clear clearfloat'></div>");
           var current = (dataa.view.begin/dataa.view.count) + 1;
           $(".tableContainer .tcdPageCode").createPage({
                pageCount:total,
                current:parseInt(current),
                backFn:function(pageIndex){
                    $(".table table").html("");
                    start=(pageIndex-1)*numperpage;

					dataa.view.begin = start;
                    $(".table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
                    ajaxtable=
                    $.ajax({
                        url:'/mgr/swinfo/_search',
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
                            var list=data.data.list;
                            var table="";
                            table+="<table>";
                            if($("#functionBlock .current").index()==1){
                                
                                table+="<tr id='tableAlign'>";
				                table+="<td width='30%'>软件名称</td>";
				                table+="<td width='30%'>发布者</td>";
				                table+="<td width='16%'>版本号</td>";
				                table+="<td width='8%'>已安装</td>";
				                table+="<td width='8%'>安装率</td>";
				                table+="<td width='8%'>操作</td>";
				                table+="</tr>";
				                for(i=0;i<list.length;i++){
				                    table+="<tr swid="+list[i].swid+">";
				                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].name))+">"+safeStr(list[i].name)+"</span></td>";
				                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].publisher))+">"+safeStr(list[i].publisher)+"</span></td>";
				                    table+="<td>"+safeStr(list[i].version)+"</td>";
				                    table+="<td><a class='underline cursor blackfont seeDetail'>"+list[i].installed+"</a></td>";
				                    table+="<td>"+list[i].rate+"%</td>";
				                    table+="<td><a class='blackfont underline cursor' onclick='uninstallSPop(this)'>卸载</a></td>";
				                    table+="</tr>";
				                }

                            }else if($("#functionBlock .current").index()==2){
                                tableth+="<tr>";
			                	tableth+="<th width='40%' class='th-ordery' type='hostname'>终端名称</th>";
				                tableth+="<th width='40%' class='th-ordery' type='group_name'>终端分组</th>";
				                tableth+="<th width='20%' class='th-ordery' type='count'>软件安装总数</th>";
				                tableth+="</tr>";
				                table+="<tr id='tableAlign'>";
				                table+="<td width='40%'>终端名称</td>";
				                table+="<td width='40%'>终端分组</td>";
				                table+="<td width='20%'>软件安装总数</td>";
				                table+="</tr>";
				                for(i=0;i<list.length;i++){
				                    table+="<tr client="+list[i].client_id+">";
				                    table+="<td><span style='width:400px;' title='"+safeStr(list[i].hostname)+"' class='filePath'>"+safeStr(list[i].hostname)+"</span></td>";
				                    table+="<td>"+safeStr(list[i].group_name)+"</td>";
				                    table+="<td><a  class='underline cursor blackfont seeDetail'>"+list[i].count+"</a></td>";  
				                    table+="</tr>";
				                }

                            }

                            table+="</table>";
                            $(".table table").hide();
                            $(".table").html(table);
                            $(".table table").show();
                          


                        }
                    })

                }
            })
        }
    });

	
}
// 搜索按钮触发
function searchList(){
	accEvent();
}
//软件终端详情排序
$(document).on('click','.softSDetailPop .tableth th.th-ordery',function(){
	var toggleClass = $(this).attr('class');
	$(this).siblings('th.th-ordery').removeClass().addClass('th-ordery');
	$(this).siblings('th.th-ordery').find('img').attr('src','images/th-ordery.png');
	
	if(toggleClass == 'th-ordery'){
		$(this).addClass('th-ordery-current th-ordery-up');
		$(this).parents('.tableth').attr('indexCls','th-ordery th-ordery-current th-ordery-up');
		$(this).parents('.tableth').attr('index',$(this).index());
		
	}else if(toggleClass == 'th-ordery th-ordery-current th-ordery-up'){
		$(this).addClass('th-ordery-current th-ordery-down');
		$(this).parents('.tableth').attr('indexCls','th-ordery th-ordery-current th-ordery-up th-ordery-down');
		$(this).parents('.tableth').attr('index',$(this).index());
		
	}else if(toggleClass == 'th-ordery th-ordery-current th-ordery-up th-ordery-down'){
		$(this).removeClass('th-ordery-current th-ordery-down th-ordery-up');
		$(this).parents('.tableth').attr('indexCls','th-ordery');
		$(this).parents('.tableth').attr('index',$(this).index());
	}
	var currentPage = $(this).parents('.taskDetailPop').find('.tcdPageCode span.current').text();
	var start = (parseInt(currentPage) - 1) * 7;
	seeDetailPop(start);
})
//弹出详情
$(document).on('click','.tableContainer .seeDetail',function(){
	$('.taskDetailPop .tableth th.th-ordery').removeClass().addClass('th-ordery');
	$('.taskDetailPop .tableth').removeAttr('indexCls');
    $(".taskDetailPop").attr('trIndex',$(this).parents('tr').index());
    $(".taskDetailPop").attr('tdIndex',$(this).parent('td').index());
    $(".taskDetailPop").show();
    shade();
    seeDetailPop();
})
var swid="";
var totalnum="";
var ajaxdetailtable=null;
var client="";
function seeDetailPop(start){

	var trIndex = $(".taskDetailPop").attr('trIndex');
    var tdIndex=$(".taskDetailPop").attr('tdIndex');
    if(ajaxdetailtable){
        ajaxdetailtable.abort();
    }

    if(start == undefined) {
		start = 0;
	}else{
		start = start;
	}
    $(".taskDetailPop").children(":not(:first)").hide();
    $(".taskDetailPop").append("<div style='text-align:center;color:#6a6c6e;padding-top:201px;' class='detailLoading'><img src='images/loading.gif'></div>");
    if($("#functionBlock .current").index()==1){
    	swid=parseInt($('.tableContainer .table tr').eq(trIndex).attr("swid"));
        var softname=$('.tableContainer .table tr').eq(trIndex).children("td").eq(0).find("span").html();
        var installnum=$('.tableContainer .table tr').eq(trIndex).children("td").eq(3).find("a").html();
        var dataa={"groupby":"hostname","swid":swid,"view":{"begin":start,"count":7}};
        
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
        $(".taskDetailPop .title font").html("软件终端详情");
        ajaxdetailtable=
        $.ajax({
            url:'/mgr/swinfo/_search',
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
                var list=data.data.list;
                var th="";
                var table="";
                totalnum=data.data.view.total;
                var total=Math.ceil(totalnum/7);
                
                $(".taskDetailPop .describe").html("软件名称 : "+softname);
                th+="<tr>"
                th+="<th width='50%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                th+="<th width='50%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                th+="</tr>"

                $(".taskDetailPop .tableth table").html(th);
                
                table+="<tr id='tableAlign'>";
                table+="<td width='50%'>终端名称</td>";
                table+="<td width='50%'>终端分组</td>";
                table+="</tr>";
                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td><span style='width:270px;' title='"+safeStr(list[i].hostname)+"' class='filePath'>"+safeStr(list[i].hostname)+"</span></td>";
                    table+="<td>"+safeStr(list[i].group_name)+"</td>";
                    table+="</tr>";
                };
                $(".taskDetailTable table").html(table);
                $(".taskDetailPop").children().show();
                
                var thIndex=$('.taskDetailPop .tableth').attr('index');
				var thCls=$('.taskDetailPop .tableth').attr('indexCls');
				$('.taskDetailPop .tableth th').eq(thIndex).addClass(thCls);
				imgOrderyFun1(thIndex,thCls);
                
                $(".taskDetailPop").children(".detailLoading").remove();
                // 分页
                $(".taskDetailPop .clearfloat").remove();
                $(".taskDetailPop .tcdPageCode").remove();
                $(".taskDetailPop .totalPages").remove();
                $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
               var current = (dataa.view.begin/dataa.view.count) + 1;
                $(".taskDetailPop .tcdPageCode").createPage({
                    pageCount:total,
                    current:parseInt(current),
                    backFn:function(pageIndex){
                        start=(pageIndex-1)*7;
                        dataa.view.begin = start;
                        ajaxdetailtable=
                        $.ajax({
                            url:'/mgr/swinfo/_search',
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
                                var list=data.data.list;
                                var table="";
                                
                                table+="<tr id='tableAlign'>";
                                table+="<td width='50%'>终端名称</td>";
                                table+="<td width='50%'>终端分组</td>";
                                table+="</tr>";
                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    table+="<td><span style='width:270px;' title='"+safeStr(list[i].hostname)+"' class='filePath'>"+safeStr(list[i].hostname)+"</span></td>";
                                    table+="<td>"+safeStr(list[i].group_name)+"</td>";
                                    table+="</tr>";
                                };
                                $(".taskDetailTable table").html(table);
                                $(".taskDetailPop").children().show();
                                $(".taskDetailPop").children(".detailLoading").remove();
                            }
                        })

                    }
                })


            }
        })
    }else if($("#functionBlock .current").index()==2){
    	var hostname=$('.tableContainer .table tr').eq(trIndex).children("td").eq(0).find('span').html();
    	var groupname=$('.tableContainer .table tr').eq(trIndex).children("td").eq(1).html();
    	var softnum=$('.tableContainer .table tr').eq(trIndex).children("td").eq(2).find("a").html();
        client=parseInt($('.tableContainer .table tr').eq(trIndex).attr("client"));
        var classandname=$('.tableContainer .table tr').eq(trIndex).children("td").eq(tdIndex).find('a').html();
        var dataa={"groupby":"software","client_id":client,"view":{"begin":start,"count":7}};
        
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
        
        $(".taskDetailPop .title font").html("终端软件详情");
        ajaxdetailtable=
        $.ajax({
            url:'/mgr/swinfo/_search',
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
                var list=data.data.list;
                var th="";
                var table="";
                totalnum=data.data.view.total;
                var total=Math.ceil(totalnum/7);
                
                $(".taskDetailPop .describe").html("终端名称 : <a style='max-width:110px;width:auto;' title='"+safeStr(hostname)+"' class='filePath'>"+safeStr(hostname)+",</a>  终端分组 : "+groupname);
                th+="<tr>"
                th+="<th width='40%' class='th-ordery' type='name'>软件名称<img src='images/th-ordery.png'/></th>";
                th+="<th width='40%' class='th-ordery' type='publisher'>发布者<img src='images/th-ordery.png'/></th>";
                th+="<th width='20%' class='th-ordery' type='version'>版本号<img src='images/th-ordery.png'/></th>";
                th+="</tr>"
                $(".taskDetailPop .tableth table").html(th);

                table+="<tr id='tableAlign'>";
                table+="<td width='40%'>软件名称</td>";
                table+="<td width='40%'>发布者</td>";
                table+="<td width='20%'>版本号</td>";
                table+="</tr>";
                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td><span class='filePath'>"+safeStr(list[i].name)+"</span></td>";
                    table+="<td><span class='filePath'>"+safeStr(list[i].publisher)+"</span></td>";
                    table+="<td>"+safeStr(list[i].version)+"</td>";
                    table+="</tr>";
                };
                $(".taskDetailTable table").html(table);
                $(".taskDetailPop").children().show();
                
                var thIndex=$('.taskDetailPop .tableth').attr('index');
				var thCls=$('.taskDetailPop .tableth').attr('indexCls');
				$('.taskDetailPop .tableth th').eq(thIndex).addClass(thCls);
                imgOrderyFun1(thIndex,thCls);
                $(".taskDetailPop").children(".detailLoading").remove();
                // 分页
                $(".taskDetailPop .clearfloat").remove();
                $(".taskDetailPop .tcdPageCode").remove();
                $(".taskDetailPop .totalPages").remove();
                $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
               var current = (dataa.view.begin/dataa.view.count) + 1;
               $(".taskDetailPop .tcdPageCode").createPage({
                    pageCount:total,
                    current:parseInt(current),
                    backFn:function(pageIndex){
                        dataa.view.begin = (pageIndex - 1) * 7;
                        ajaxdetailtable=
                        $.ajax({
                            url:'/mgr/swinfo/_search',
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
                                var list=data.data.list;
                                var table="";

                                table+="<tr id='tableAlign'>";
                                table+="<td width='40%'>软件名称</td>";
                                table+="<td width='40%'>发布者</td>";
                                table+="<td width='20%'>版本号</td>";
                                table+="</tr>";
                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    table+="<td><span class='filePath'>"+safeStr(list[i].name)+"</span></td>";
                                    table+="<td><span class='filePath'>"+safeStr(list[i].publisher)+"</span></td>";
                                    table+="<td>"+safeStr(list[i].version)+"</td>";
                                    table+="</tr>";
                                };
                                $(".taskDetailTable table").html(table);
                                $(".taskDetailPop").children().show();
                                $(".taskDetailPop").children(".detailLoading").remove();
                            }
                        })
                    }
                })
            }
        })
    }

}
