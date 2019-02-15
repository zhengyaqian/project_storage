
//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a[name='loopholeRepT.html']").addClass("current");
parent.$(".nav .container a[name='loopholeRepT.html']").siblings().removeClass("current");
parent.$(".footer").show();

document.cookie='page=loopholeRepT.html';
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
})
// 漏洞修复设置弹层
$(".functionButtonsBlock .setButton").click(function(event) {
	shade();
	$(".loopholeRSPop").show();
	
});
//最新任务
$(".uninstallMB").click(function(){
	shade();
	$(".recentTaskPop").show();
    recentTaskAjax();
})
// 最新任务列表ajax
function recentTaskAjax(){
    $.ajax({
        url:'/mgr/task/_recent?type=msg_uninstall',
        data:{},
        type:'GET',
        contentType:'text/plain',
        success:function(data){
            var list=data.data.list;
            
            var html="";
            for (var i = 0; i < list.length; i++) {
                var createtime=list[i].create_time;
                createtime=getLocalTime(createtime);
                html+="<div class='list' taskid='"+list[i].task_id+"'>";
                html+="<span class='td cursor firsttd' onclick='showTaskTer(this)'>"+safeStr(createtime)+"</span>";
                html+="<span class='td cursor' onclick='showTaskTer(this)'>"+"修复漏洞"+"</span>";
                html+="<span class='td cursor' onclick='showTaskTer(this)'>"+list[i].client_done+"/"+list[i].client_all+"</span>";
                if(list[i].status==0){
                    html+="<span class='td cursor' onclick='showTaskTer(this)'>正在分发</span>";
                }else{
                    html+="<span class='td cursor' onclick='showTaskTer(this)'>分发结束</span>";
                }
                html+="<span class='td cursor' onclick='showTaskTer(this)'><a class='cursor underline'>终止任务</a></span>";
                html+="<a onclick='showTaskTer(this)' class='showTaskTerIcon verticalMiddle cursor'></a>";
                html+="</div>";
                html+="<div class='table'>";
                html+="<table>";
                html+="<tr class='th'>";
                html+="<th width='25%'>终端分组</th>";
                html+="<th width='25%'>终端名称</th>";
                html+="<th width='16%'>状态</th>";
                html+="<th width='20%'>备注</th>";
                html+="<th width='14%'>操作</th>";
                html+="</tr>";
                html+="</table>";
                html+="</div>";

                
            };
            $(".recentTaskPop .content .container").html(html);

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
                success:function(data){
                    var html="";
                    var list=data.data.list;
                    
                    html+="<table>";
                    html+="<tr class='th'>";
                    html+="<th width='25%'>终端分组</th>";
                    html+="<th width='25%'>终端名称</th>";
                    html+="<th width='16%'>状态</th>";
                    html+="<th width='20%'>备注</th>";
                    html+="<th width='14%'>操作</th>";
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
                        html+="<td>"+"<a class='cursor underline'>终止任务</a>"+"</td>";
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
// 弹出已忽略终端
function ignoredTPop(){
	var detailnumperpage=9;
    var start=0;
    $(".ignoredTPop").show();
    shade();
    dataa={};
    
    $.ajax({
        url:'/mgr/group/_list',
        data:JSON.stringify(dataa),
        type:'POST',
        contentType:'text/plain',
        error:function(xhr,textStatus,errorThrown){
            alert(xhr.status+"  "+textStatus+"  "+errorThrown);
        },
        success:function(data){
            var html="";
            // var list=data.data.list;
            var totalnum=100;
            var total=Math.ceil(totalnum/detailnumperpage);

            html+="<tr id='tableAlign'>";
            html+="<td width='10%'><input type='checkbox'></td>";
            html+="<td width='30%'>终端名称</td>";
            html+="<td width='30%'>终端分组</td>";
            html+="<td width='10%'>高危漏洞</td>";
            html+="<td width='10%'>功能漏洞</td>";
            html+="<td width='10%'>已忽略</td>";
            html+="</tr>";
            for (var i = 0; i < detailnumperpage; i++) {
                html+="<tr taskid="+"ssss"+">";
                html+="<td>"+"<input type='checkbox' class='select verticalMiddle'>"+"</td>";
                html+="<td><span class='filePath'>"+"王森的终端物理速度哈吉马拉有物理速度哈吉马拉有"+"</span></td>";
                html+="<td><span class='filePath'>"+"王森的部门物理速度哈吉马拉有物理速度哈吉马拉有"+"</span></td>";
                html+="<td><a class='seeDetail cursor blackfont' onclick='taskDetailPop(this)'>10000</a></td>";
                html+="<td><a class='seeDetail cursor blackfont' onclick='taskDetailPop(this)'>10000</a></td>";
                html+="<td><a class='seeDetail cursor blackfont' onclick='taskDetailPop(this)'>10000</a></td>";
                html+="</tr>";
            };
            $(".ignoredTPop .ignoredTTable table").html(html);
            // 分页
            $(".taskDetailPop .clearfloat").remove();
            $(".taskDetailPop .tcdPageCode").remove();
            $(".taskDetailPop .totalPages").remove();
            $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
            $(".taskDetailPop .tcdPageCode").createPage({
                pageCount:total,
                current:1,
                backFn:function(pageIndex){
                    start=(pageIndex-1)*detailnumperpage;
                    dataa={"taskid":taskid,"view":{"begin":start,"count":detailnumperpage}};
                    $.ajax({
                        url:'/mgr/task/_clnt',
                        data:JSON.stringify(dataa),
                        type:'POST',
                        contentType:'text/plain',
                        error:function(xhr,textStatus,errorThrown){
                            alert(xhr.status+"  "+textStatus+"  "+errorThrown);
                        },
                        success:function(data){
                            var html="";
                            // var list=data.data.list;

                            html+="<tr id='tableAlign'>";
				            html+="<td width='10%'><input type='checkbox'></td>";
				            html+="<td width='30%'>补丁编号</td>";
				            html+="<td width='30%'>补丁描述</td>";
				            html+="<td width='10%'>补丁类型</td>";
				            html+="<td width='10%'>发布时间</td>";
				            html+="</tr>";
                            for (var i = 0; i < detailnumperpage; i++) {
                                html+="<tr taskid="+"ssss"+">";
				                html+="<td>"+"<input type='checkbox' class='select verticalMiddle'>"+"</td>";
				                html+="<td><span class='filePath'>"+"王森的终端物理速度哈吉马拉有物理速度哈吉马拉有"+"</span></td>";
				                html+="<td><span class='filePath'>"+"王森的部门物理速度哈吉马拉有物理速度哈吉马拉有"+"</span></td>";
				                html+="<td><a class='seeDetail cursor blackfont' onclick='taskDetailPop(this)'>10000</a></td>";
				                html+="<td><a class='seeDetail cursor blackfont' onclick='taskDetailPop(this)'>10000</a></td>";
				                html+="<td><a class='seeDetail cursor blackfont' onclick='taskDetailPop(this)'>10000</a></td>";
				                html+="</tr>";
                            };
                            $(".ignoredTPop .ignoredTTable table").html(html);
                        }       
                    });
                }
            })

        }       
    });
}
//弹出漏洞详情
function taskDetailPop(a){
	if($(a).parents("td").index()==3){
		$(".taskDetailPop .describe").html("以下漏洞可能会被病毒利用，危害你的电脑<a class='charaButton floatR greenfont underline cursor'>忽略</a>");
		$(".taskDetailPop .taskInf").html("高危漏洞 - "+$(a).parents("td").siblings().eq(1).find('span').html());
	}else if($(a).parents("td").index()==4){
		$(".taskDetailPop .describe").html("以下漏洞为功能性漏洞，可以选择性修复<a class='charaButton floatR greenfont underline cursor'>忽略</a>");
		$(".taskDetailPop .taskInf").html("功能漏洞 - "+$(a).parents("td").siblings().eq(1).find('span').html());
	}else{
		$(".taskDetailPop .describe").html("以下补丁已被忽略，火绒将不再此终端修复这些补丁<a class='charaButton floatR greenfont underline cursor'>取消忽略</a>");
		$(".taskDetailPop .taskInf").html("已忽略补丁 - "+$(a).parents("td").siblings().eq(1).find('span').html());
	}
    var detailnumperpage=9;
    var start=0;
    $(".taskDetailPop").show();
    shade();
    dataa={};
    
    $.ajax({
        url:'/mgr/group/_list',
        data:JSON.stringify(dataa),
        type:'POST',
        contentType:'text/plain',
        error:function(xhr,textStatus,errorThrown){
            alert(xhr.status+"  "+textStatus+"  "+errorThrown);
        },
        success:function(data){
            var html="";
            // var list=data.data.list;
            var totalnum=100;
            var total=Math.ceil(totalnum/detailnumperpage);

            html+="<tr id='tableAlign'>";
            html+="<td width='5%'><input type='checkbox'></td>";
            html+="<td width='15%'>补丁编号</td>";
            html+="<td width='50%'>补丁描述</td>";
            html+="<td width='10%'>补丁类型</td>";
            html+="<td width='20%'>发布时间</td>";
            html+="</tr>";
            for (var i = 0; i < detailnumperpage; i++) {
                html+="<tr>";
                
                html+="<td><input type='checkbox'></td>";
                
                
                html+="<td>"+"KB2479947"+"</td>";
                
                html+="<td>"+"现已确认Microsoft软件产品存在可能影响您的系统安全"+"</td>";
                html+="<td>"+"高危"+"</td>";
                html+="<td>"+"2018-01-12 05:21:11"+"</td>";
                html+="</tr>";
            };
            $(".taskDetailPop .taskDetailTable table").html(html);
            // 分页
            $(".taskDetailPop .clearfloat").remove();
            $(".taskDetailPop .tcdPageCode").remove();
            $(".taskDetailPop .totalPages").remove();
            $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
            $(".taskDetailPop .tcdPageCode").createPage({
                pageCount:total,
                current:1,
                backFn:function(pageIndex){
                    start=(pageIndex-1)*detailnumperpage;
                    dataa={"taskid":taskid,"view":{"begin":start,"count":detailnumperpage}};
                    $.ajax({
                        url:'/mgr/task/_clnt',
                        data:JSON.stringify(dataa),
                        type:'POST',
                        contentType:'text/plain',
                        error:function(xhr,textStatus,errorThrown){
                            alert(xhr.status+"  "+textStatus+"  "+errorThrown);
                        },
                        success:function(data){
                            var html="";
                            // var list=data.data.list;

                            html+="<tr id='tableAlign'>";
				            html+="<td width='5%'><input type='checkbox'></td>";
				            html+="<td width='15%'>补丁编号</td>";
				            html+="<td width='50%'>补丁描述</td>";
				            html+="<td width='10%'>补丁类型</td>";
				            html+="<td width='20%'>发布时间</td>";
				            html+="</tr>";
                            for (var i = 0; i < detailnumperpage; i++) {
                                html+="<tr>";
                
				                html+="<td><input type='checkbox'></td>";
				                
				                
				                html+="<td>"+"KB2479947"+"</td>";
				                
				                html+="<td>"+"现已确认Microsoft软件产品存在可能影响您的系统安全"+"</td>";
				                html+="<td>"+"高危"+"</td>";
				                html+="<td>"+"2018-01-12 05:21:11"+"</td>";
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
//关闭弹层
$(".closeW").click(function(){
    $(".shade").hide();
    $(this).parent().parent().hide();
    parent.$(".topshade").hide();

});

// 每页多少数据数字限制
$("body").on("keyup","#numperpageinput",function(){
    var value=$(this).val().replace(/[^\d]/g,'');
    $(this).val(value);
})
var numperpage=15;//每页多少个数据初始值
// 改变每页多少数据
$("body").on("blur","#numperpageinput",function(){
    if($(this).val()==""||parseInt($(this).val())<10){
        numperpage=10;
    }else if(parseInt($(this).val())>1000){
        numperpage=1000;
    }else{
        numperpage=parseInt($("#numperpageinput").val());
    }
    accEvent();
})

accEvent();
var ajaxtable=null;
function accEvent(){
    if(ajaxtable){
        ajaxtable.abort();
    }

    var dataa={};
    var start=0;

    $(".table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
    ajaxtable=
    $.ajax({
        url:'/mgr/group/_list',
        data:JSON.stringify(dataa),
        type:'POST',
        contentType:'text/plain',
        success:function(data){
            var list=data.data.list;
            var tableth="";
            var table="";
            var total=Math.ceil(1000/numperpage);

            tableth+="<tr>";
            tableth+="<th width='10%'><input type='checkbox' class='verticalMiddle' onclick='selectAll(this)'></th>";
            tableth+="<th width='30%'>终端名称</th>";
            
            tableth+="<th width='30%'>终端分组</th>";
            tableth+="<th width='10%'>高危漏洞</th>";
            tableth+="<th width='10%'>功能漏洞</th>";
            tableth+="<th width='10%'>已忽略</th>";
            tableth+="</tr>";

            table+="<table>";
            table+="<tr id='tableAlign'>";
            table+="<td width='10%'><input type='checkbox' class='verticalMiddle' onclick='selectAll(this)'></td>";
            table+="<td width='30%'>终端名称</td>";
            
            table+="<td width='30%'>终端分组</td>";
            table+="<td width='10%'>高危漏洞</td>";
            table+="<td width='10%'>功能漏洞</td>";
            table+="<td width='10%'>已忽略</td>";
            table+="</tr>";
            for(i=0;i<numperpage;i++){
                table+="<tr taskid="+"ssss"+">";
                table+="<td>"+"<input type='checkbox' class='select verticalMiddle'>"+"</td>";
                table+="<td><span class='filePath loophtWidth'>"+"王森的终端物理速度哈吉马拉有物理速度哈吉马拉有"+"</span></td>";
                table+="<td><span class='filePath loophtWidth'>"+"王森的部门物理速度哈吉马拉有物理速度哈吉马拉有"+"</span></td>";
                table+="<td><a class='seeDetail cursor blackfont' onclick='taskDetailPop(this)'>10000</a></td>";
                table+="<td><a class='seeDetail cursor blackfont' onclick='taskDetailPop(this)'>10000</a></td>";
                table+="<td><a class='seeDetail cursor blackfont' onclick='taskDetailPop(this)'>10000</a></td>";
                table+="</tr>";
            }
            table+="</table>";
            $(".table table").hide();
            $(".main .tableth table").html(tableth);
            $(".table").html(table);
            $(".table table").show();
            

            $(".clearfloat").remove();
            $(".tcdPageCode").remove();
            $(".totalPages").remove();
            $(".numperpage").remove();
            $(".tableContainer").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+1000+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><a style='font-size:12px;float:right;line-height:54px;padding-right:20px;color:#6a6c6e' class='numperpage'>每页<input type='text' id='numperpageinput' value="+numperpage+" style='font-size:12px;width:40px;height:24px;margin:0 4px;vertical-align:middle;padding:0 10px;'>条</a><div class='clear clearfloat'></div>");
            $(".tcdPageCode").createPage({
                pageCount:total,
                current:1,
                backFn:function(pageIndex){
                    $(".table table").html("");

                    start=(pageIndex-1)*numperpage;

                    $(".table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
                    ajaxtable=
                    $.ajax({
                        url:'/mgr/task/_list',
                        data:JSON.stringify(dataa),
                        type:'POST',
                        contentType:'text/plain',
                        success:function(data){
                            var list=data.data.list;
                            var tableth="";
                            var table="";

                            table+="<table>";
                            table+="<tr id='tableAlign'>";
                            table+="<td width='10%'><input type='checkbox' class='verticalMiddle' onclick='selectAll(this)'></td>";
                            table+="<td width='30%'>终端名称</td>";
                            
                            table+="<td width='30%'>终端分组</td>";
                            table+="<td width='10%'>高危漏洞</td>";
                            table+="<td width='10%'>功能漏洞</td>";
                            table+="<td width='10%'>已忽略</td>";
                            table+="</tr>";

                            for(i=0;i<numperpage;i++){
                                table+="<tr taskid="+"ssss"+">";
                                table+="<td>"+"<input type='checkbox' class='select verticalMiddle'>"+"</td>";
                                table+="<td><span class='filePath loophtWidth'>"+"王森的终端"+"</span></td>";
                                table+="<td><span class='filePath loophtWidth'>"+"王森的部门"+"</span></td>";
                                table+="<td><a class='seeDetail cursor blackfont' onclick='taskDetailPop(this)'>10000</a></td>";
                                table+="<td><a class='seeDetail cursor blackfont' onclick='taskDetailPop(this)'>10000</a></td>";
                                table+="<td><a class='seeDetail cursor blackfont' onclick='taskDetailPop(this)'>10000</a></td>";
                                table+="</tr>";
                            }
                            table+="</table>";
                            $(".table table").hide();
                            $(".table").html(table);
                            $(".table table").show();
                            
                        }
                    });

                }
            })  
            }
    });

}

//调整页面内元素高度
var mainlefth=parent.$("#iframe #mainFrame").height();

$(".main .table").css({height:mainlefth-347});

window.onresize = function(){
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .table").css({height:mainlefth-347});

}

