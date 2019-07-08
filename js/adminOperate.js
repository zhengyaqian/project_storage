//loading执行

$("#txtBeginDate").calendar();
$("#txtEndDate").calendar();
$("#txtBeginDate").val(GetDateStr(-6));
$("#txtEndDate").val(GetDateStr(0));

//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a[name='virusDefense.html']").addClass("current");
parent.$(".nav .container a[name='virusDefense.html']").siblings().removeClass("current");
parent.$(".footer").show();

document.cookie='page=adminOperate.html';



//管理员类型改变
$("#types").change(function(){
    accEvent();
})
//模块选择改变
$("#modules").change(function(){
    accEvent();
})
//选择时间
$("#specialTime select").change(function(){

    if($(this).find("option:selected").val()==0){
        $("#txtBeginDate").val(GetDateStr(-6));
        $("#txtEndDate").val(GetDateStr(0));
        $(".filterBlock .middle").hide(200);
    }else if($(this).find("option:selected").val()==1){
        $("#txtBeginDate").val(GetDateStr(-29));
        $("#txtEndDate").val(GetDateStr(0));
        $(".filterBlock .middle").hide(200);
    }else if($(this).find("option:selected").val()==2){
        $("#txtBeginDate").val(GetDateStr(-89));
        $("#txtEndDate").val(GetDateStr(0));
        $(".filterBlock .middle").hide(200);
    }else if($(this).find("option:selected").val()==3){
        $("#txtBeginDate").val(GetDateStr(-364));
        $("#txtEndDate").val(GetDateStr(0));
        $(".filterBlock .middle").hide(200);
    }else if($(this).find("option:selected").val()==4){
        $(".filterBlock .middle").show(200);
    }
    accEvent();
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
	$.download('/mgr/log/_exporthis', 'post', dataa); 

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

$(document).on('click','.tableth th.th-ordery',function(){
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
    var isgroup=$("#types").val();
    var module=$("#modules").val();

    var searchkey=trim($("#searchKey").val());
    dataa={"date":{"begin":begintime,"end":endtime},"filter":{"group":isgroup,"module":module,"name":searchkey},"view":{"begin":start,"count":numperpage}};
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
	return dataa;
}

accEvent();
var ajaxtable=null;
function accEvent(start){
    if(ajaxtable){
        ajaxtable.abort();
    }
    var dataa = accEvnetParam(start);
   $(".table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
    ajaxtable=
    $.ajax({
        url:'/mgr/log/_history',
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
            var total=Math.ceil(data.data.view.total/numperpage);

            if(list!==null){
                table+="<table>";
                table+="<tr id='tableAlign'>";
                table+="<td width='16%'>管理员名称</td>";
                table+="<td width='16%'>管理员类型</td>";
                table+="<td width='16%'>时间</td>";
                table+="<td width='16%'>IP</td>";
                table+="<td width='12%'>操作模块</td>";
                table+="<td width='20%'>操作描述</td>";
                table+="</tr>";
                for(i=0;i<list.length;i++){
                    var time=list[i].time;
                    time=getLocalTime(time);
                    table+="<tr>";
                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].name))+">"+safeStr(list[i].name)+"</span></td>";
                    if(list[i].group=="root"){
                        table+="<td>超级管理员</td>"; 
                    }else if(list[i].group=="admin"){
                        table+="<td>普通管理员</td>";
                    }else{
                        table+="<td>审计员</td>";
                    }
                    table+="<td>"+safeStr(time)+"</td>";
                    table+="<td>"+safeStr(list[i].ip)+"</td>";
                    if(list[i].module=="mgr_client"){
                       table+="<td>终端管理</td>"; 
                    }else if(list[i].module=="mgr_policy"){
                        table+="<td>防护策略</td>";
                    }else if(list[i].module=="mgr_distr"){
                        table+="<td>文件管理</td>";
                    }else if(list[i].module=="mgr_log"){
                        table+="<td>事件日志</td>";
                    }else if(list[i].module=="mgr_tools"){
                        table+="<td>管理工具</td>";
                    }else if(list[i].module=="mgr_user"){
                        table+="<td>账户管理</td>";
                    }else if(list[i].module=="system_conf"){
                        table+="<td>系统设置</td>";
                    }else if(list[i].module=="system_auth"){
                        table+="<td>用户登录</td>";
                    }else if(list[i].module=="mgr_remote"){
                        table+="<td>远程桌面</td>";
                    }else{
                    	table+="<td></td>";
                    }
                    
                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].description))+">"+safeStr(list[i].description)+"</span></td>";
                    table+="</tr>";
                }
                table+="</table>";
            }
            
            
            $(".table table").hide();
            $(".table").html(table);
            $(".table table").show();
            
			var thIndex=$('.main .tableth').attr('index');
			var thCls=$('.main .tableth').attr('indexCls');
			$('.main .tableth th').eq(thIndex).addClass(thCls);
			
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
                    $(".table table").html("");

                    start=(pageIndex-1)*numperpage;
                    dataa.view.begin = start;
                    $(".table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
                    ajaxtable=
                    $.ajax({
                        url:'/mgr/log/_history',
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
                            table+="<tr id='tableAlign'>";
                            table+="<td width='16%'>管理员名称</td>";
                            table+="<td width='16%'>管理员类型</td>";
                            table+="<td width='16%'>时间</td>";
                            table+="<td width='16%'>IP</td>";
                            table+="<td width='12%'>操作模块</td>";
                            table+="<td width='20%'>操作描述</td>";
                            table+="</tr>";
                            for(i=0;i<list.length;i++){
                                var time=list[i].time;
                                time=getLocalTime(time);
                                table+="<tr>";
                                table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].name))+">"+safeStr(list[i].name)+"</span></td>";
                                if(list[i].group=="root"){
                                    table+="<td>超级管理员</td>"; 
                                }else if(list[i].group=="admin"){
                                    table+="<td>普通管理员</td>";
                                }else{
                                    table+="<td>审计员</td>";
                                }
                                
                                table+="<td>"+safeStr(time)+"</td>";
                                table+="<td>"+safeStr(list[i].ip)+"</td>";
                                if(list[i].module=="mgr_client"){
                                   table+="<td>终端管理</td>"; 
                                }else if(list[i].module=="mgr_policy"){
                                    table+="<td>防护策略</td>";
                                }else if(list[i].module=="mgr_distr"){
                                    table+="<td>文件管理</td>";
                                }else if(list[i].module=="mgr_log"){
                                    table+="<td>事件日志</td>";
                                }else if(list[i].module=="mgr_tools"){
                                    table+="<td>管理工具</td>";
                                }else if(list[i].module=="mgr_user"){
                                    table+="<td>账户管理</td>";
                                }else if(list[i].module=="system_conf"){
                                    table+="<td>系统设置</td>";
                                }else if(list[i].module=="system_auth"){
                                    table+="<td>用户登录</td>";
                                }else if(list[i].module=="mgr_remote"){
			                        table+="<td>远程桌面</td>";
			                    }else{
                                	table+="<td></td>";
                                }
                                
                                table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].description))+">"+safeStr(list[i].description)+"</span></td>";
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

