
//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a[name='softwareStatistics.html']").addClass("current");
parent.$(".nav .container a[name='softwareStatistics.html']").siblings().removeClass("current");
parent.$(".footer").show();

document.cookie='page=softwareStatistics.html';
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
// 搜索按钮触发
function searchList(){
	accEvent();
}

$(".uninstallSPop .terminallist").on("click",".td input[type=checkbox]",function(){
    if($(".td input[type=checkbox]:checked").length==($(".td input[type=checkbox]").length)){
        $(".uninstallSPop .terminallist .th-ordery input[type=checkbox]").prop("checked",true)
    }else{
        $(".uninstallSPop .terminallist .th-ordery input[type=checkbox]").prop("checked",false)
    }
})

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
	terminalidarr = [];
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
    
    uninstallswid=parseInt($(a).attr("swid"));
    uninstallshostnum=parseInt($(a).attr('installed'));
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
	var _this = $(this);
    sortingFun(_this,toggleClass);
	uninstallSTAjax();
})
// 卸载软件相关终端列表ajax
function uninstallSTAjax(){
    var filter=trim($(".uninstallSPop #searchKeyT").val());
    var group_id = parseInt($('.grouplist .td.current').attr('groupid'));

    var dataa={"groupby":"hostname","swid":uninstallswid,"group_id":group_id,"filter":{"hostname":filter},"view":{"begin":0,"count":uninstallshostnum}};
    var type = $('.terminallist p.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.terminallist p.th-ordery.th-ordery-current').attr('class');
    dataa = sortingDataFun(dataa,type,orderClass);
    $.ajax({
        url:'/mgr/swinfo/_search',
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
            var th="";
            var table="";
            if(list != null){
	            var checkednum=0;
				for (var i = 0; i < list.length; i++) {
	                if(isInArray(terminalidarr,list[i].client_id)==true){
	                    checkednum++;
	                    table+="<a class='td block'><input type='checkbox' class='verticalMiddle select' clientid="+list[i].client_id+" checked> <span class='verticalMiddle filePath' style='width:310px;' title='"+safeStr(list[i].hostname)+"'> "+safeStr(list[i].hostname)+"</span></a>"; 
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
       delayHide("请选择终端");
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
                delayHideS("操作成功");
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
                html+="<div class='table'>";
                html+="<table>";
                html+="<tr class='th'>";
                html+="<th width='120'>终端分组</th>";
                html+="<th width='100'>终端名称</th>";
                html+="<th width='120'>IP地址</th>";
                html+="<th width='120'>任务状态</th>";
                html+="<th width='200'>备注</th>";
                html+="</tr>";
                html+="</table>";
                html+="</div>";
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
                error:function(xhr,textStatus,errorThrown){
		        	if(xhr.status==401){
		        	    parent.window.location.href='/';
		        	}else{
		        		
		        	}
		            
		        },
                success:function(data){
                    var html="";
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

$(document).on('click','.tableContainer .table th.th-ordery',function(){
	var toggleClass = $(this).attr('class');
	var _this = $(this);
    sortingFun(_this,toggleClass);
	var currentPage = $(this).parents('.tableContainer').find('.tcdPageCode span.current').text();
	var currentNum = $(this).parents('.tableContainer').find('#numperpageinput').val();
	var start = (parseInt(currentPage) - 1) * parseInt(currentNum);
	accEvent(start);
})
//软件列表信息
function columnsDataSoftListFun (){
	var columns = [
		{
			type: "name",title: "软件名称",name: "name",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {
				return "<span class='filePath' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";
			}},
		},
		{
			type: "publisher",title: "发布者",name: "publisher",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {return "<span class='filePath' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";}},
		},
		{
			type: "version",title: "版本号",name: "version",
			tHead:{style: {width: "16%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "16%"},customFunc: function (data, row, i) {return safeStr(data)}},
		},
		{
			type: "installed",title: "已安装",name: "installed",
			tHead:{style: {width: "8%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "8%"},customFunc: function (data, row, i) {return "<a  class='underline cursor blackfont seeDetail' swid='"+row.swid+"'>"+data+"</a>"}},
		},
		{
			type: "rate",title: "安装率",name: "rate",
			tHead:{style: {width: "8%"},class: "th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "8%"},customFunc: function (data, row, i) {return data + "%"}},
		},
		{
            type: "",title: "操作",name: "",
            tHead:{},
			tBody:{style: {width: "8%"},customFunc: function (data, row, i) {return "<a class='blackfont underline cursor' onclick='uninstallSPop(this)' swid='"+row.swid+"' installed='"+row.installed+"'>卸载</a>"}},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.softwareSTable'));
	return tabstr;
}
var tabListstr = columnsDataSoftListFun();

//终端列表信息
function columnsDataTerminalListFun (){
	var columns = [
		{
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {
				return "<span style='width:400px;' title='"+safeStr(data)+"' class='filePath'>"+safeStr(data)+"</span>";
			}},
		},
		{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {return safeStr(data);}},
		},
		{
			type: "count",title: "软件安装总数",name: "count",
			tHead:{style: {width: "20%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {return "<a  class='underline cursor blackfont seeDetail' client='"+row.client_id+"'>"+data+"</a>"}},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.softwareSTable'));
	return tabstr;
}

accEvent();
var ajaxtable=null;
//判断加载哪个列表
$(document).on('click','#functionBlock .bu',function(){
    $(this).siblings(".bu").removeClass("current");
	$(this).addClass("current");
    $('.softwareSTable').html('');
    if($("#functionBlock .current").index()==1){
        tabListstr = columnsDataSoftListFun();
    }else if($("#functionBlock .current").index()==2){
        tabListstr = columnsDataTerminalListFun();
    }
    accEvent();
})
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
    var type = $('.table th.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.table th.th-ordery.th-ordery-current').attr('class');
	
    dataa = sortingDataFun(dataa,type,orderClass);
    $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div></div>");
    ajaxtable=
    $.ajax({
        url:'/mgr/swinfo/_search',
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
            tbodyAddHeight();
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
                    start=(pageIndex-1)*numperpage;
					dataa.view.begin = start;
                    $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
                    ajaxtable=
                    $.ajax({
                        url:'/mgr/swinfo/_search',
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
            });
        }
        
    });
    
	
}

//软件终端详情排序
$(document).on('click','.softSDetailPop .taskDetailTableSS th.th-ordery',function(){
    var toggleClass = $(this).attr('class');
    var _this = $(this);
    sortingFun(_this,toggleClass);

    var currentPage = $(this).parents('.taskDetailPop').find('.tcdPageCode span.current').text();
	var start = (parseInt(currentPage) - 1) * 7;
	seeDetailPop(start);
})
//软件已安装列表详情
function columnsDataSoftPopFun (){
	var columns = [
		{
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "50%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "50%"},customFunc: function (data, row, i) {
				return "<span class='filePath' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";
			}},
		},
		{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "50%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "50%"},customFunc: function (data, row, i) {return "<span class='filePath' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";}},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.taskDetailTableSS'));
	return tabstr;
}
//终端安装总数列表详情
function columnsDataTerminalPopFun (){
	var columns = [
		{
			type: "name",title: "软件名称",name: "name",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {
				return "<span class='filePath' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";
			}},
		},
		{
			type: "publisher",title: "发布者",name: "publisher",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {return "<span class='filePath' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";}},
		},
		{
			type: "version",title: "版本号",name: "version",
			tHead:{style: {width: "20%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {return "<span class='filePath' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";}},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.taskDetailTableSS'));
	return tabstr;
}
//弹出详情
var tabListPopstr;
$(document).on('click','.tableContainer .seeDetail',function(){
	$('.taskDetailPop .table th.th-ordery').removeClass().addClass('th-ordery');
    $(".taskDetailPop").attr('trIndex',$(this).parents('tr').index());
    $(".taskDetailPop").attr('tdIndex',$(this).parent('td').index());
    $(".taskDetailPop").attr('swid',$(this).attr('swid'));
    $(".taskDetailPop").attr('client',$(this).attr('client'));
    $(".taskDetailPop").show();
    $('.taskDetailTableSS').html('');
    if($("#functionBlock .current").index()==1){
        tabListPopstr = columnsDataSoftPopFun();
    }else if($("#functionBlock .current").index()==2){
        tabListPopstr = columnsDataTerminalPopFun();
    }
    shade();
    seeDetailPop();
})

function seeDetailPop(start){
    var totalnum="";
    var ajaxdetailtable=null;
    var dataa="";
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
    if($("#functionBlock .current").index()==1){
        var softname=$('.tableContainer table tbody tr').eq(trIndex).children("td").eq(0).find("span").html();
        $(".taskDetailPop .describe").html("软件名称 : "+softname);
        $(".taskDetailPop .title font").html("软件终端详情");

    	var swid=parseInt($('.taskDetailPop').attr("swid"));
        dataa={"groupby":"hostname","swid":swid,"view":{"begin":start,"count":7}};
       
    }else if($("#functionBlock .current").index()==2){
    	var hostname=$('.tableContainer table tbody tr').eq(trIndex).children("td").eq(0).find('span').html();
        var groupname=$('.tableContainer table tbody tr').eq(trIndex).children("td").eq(1).html();
        $(".taskDetailPop .title font").html("终端软件详情");
        $(".taskDetailPop .describe").html("终端名称 : <a style='max-width:110px;width:auto;' title='"+safeStr(hostname)+"' class='filePath'>"+safeStr(hostname)+",</a>  终端分组 : "+groupname);
        
        var client=parseInt($('.taskDetailPop').attr("client"));
        dataa={"groupby":"software","client_id":client,"view":{"begin":start,"count":7}};
    }
    var type = $('.taskDetailPop table .th-ordery-current').attr('type');
    var orderClass = $('.taskDetailPop table .th-ordery-current').attr('class');
    dataa = sortingDataFun(dataa,type,orderClass);

    $(".taskDetailPop table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");

    ajaxdetailtable=
        $.ajax({
            url:'/mgr/swinfo/_search',
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
                var total=Math.ceil(totalnum/7);
                tabListPopstr.setData(list);
                
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
                            error:function(xhr,textStatus,errorThrown){
					        	if(xhr.status==401){
					        	    parent.window.location.href='/';
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
