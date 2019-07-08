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

document.cookie='page=remoteLog.html';

function grouplist(){
    //加载分组列表
    $.ajax({
        url:'/mgr/group/_dict',
        dataType:'json',
        data:{},
        async:true,
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
            html+="<option groupid='0'>全部分组</option>";
            for(i=0;i<list.length;i++){
                html+="<option groupid="+list[i].group_id+">"+safeStr(list[i].group_name)+"</option>";
            }
            $("#groupSelect").html(html);
        }
    });
}


//管理员类型改变
$("#types").change(function(){
    accEvent();
})

//分组下拉列表
$("#groupSelect").change(function(){
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
	$.download('/mgr/remote/_export', 'post', dataa); 

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
    var dataa="";
    if(start == undefined) {
		start = 0;
	}else{
		start = start;
	}
    var user_id=parseInt($("#types").val());
    var groupid=parseInt($("#groupSelect option:selected").attr("groupid"));
    dataa={"date":{"begin":begintime,"end":endtime},"filter":{"group_id":groupid,"user_id":user_id},"view":{"begin":start,"count":numperpage}};
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
        url:'/mgr/remote/_history',
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
                table+="<td width='8%'>管理员</td>";
                table+="<td width='10%'>IP</td>";
                table+="<td width='13%'>开始时间</td>";
                table+="<td width='18%'>远程终端</td>";
                table+="<td width='12%'>终端分组</td>";
                table+="<td width='8%'>远程方式</td>";
                table+="<td width='20%'>远程原因</td>";
                table+="</tr>";
                for(i=0;i<list.length;i++){
                    var time=list[i].start_time;
                    time=getLocalTime(time);
                    table+="<tr clientid='" + list[i].client_id + "'>";
                    table+="<td>"+safeStr(list[i].user_name)+"</td>"; 
                    table+="<td>"+safeStr(list[i].ip)+"</td>";
                    table+="<td>"+safeStr(time)+"</td>";
                    table+="<td><span class='filePath cursor detailPopBtn' onclick='detailPop(this)' index='"+i+"' style='width:180px' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</span></td>";
                    if(list[i].groupname==""){
                        table+="<td>(已删除终端)</td>"; 
                    }else{
                        table+="<td>"+safeStr(list[i].groupname)+"</td>";
                    }
                    
                    if(list[i].viewOnly == true){
                    	table+="<td>远程查看</td>";
                    }else if(list[i].viewOnly == false){
                    	table+="<td>远程控制</td>";
                    }else{
                    	table+="<td></td>";
                    }
                    
                    table+="<td><span class='filePath' style='width:180px' title="+safeStr(pathtitle(list[i].reason))+">"+safeStr(list[i].reason)+"</span></td>";
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
                        url:'/mgr/remote/_history',
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
                            table+="<td width='12%'>管理员</td>";
			                table+="<td width='12%'>IP</td>";
			                table+="<td width='16%'>开始时间</td>";
			                table+="<td width='12%'>远程终端</td>";
			                table+="<td width='12%'>终端分组</td>";
			                table+="<td width='12%'>远程方式</td>";
			                table+="<td width='20%'>远程原因</td>";
                            table+="</tr>";
                            for(i=0;i<list.length;i++){
                                var time=list[i].start_time;
			                    time=getLocalTime(time);
			                    table+="<tr clientid='" + list[i].client_id + "'>";
                                table+="<td>"+safeStr(list[i].user_name)+"</td>"; 
                                table+="<td>"+safeStr(list[i].ip)+"</td>";
                                table+="<td>"+safeStr(time)+"</td>";
                                table+="<td><span class='filePath cursor detailPopBtn' onclick='detailPop(this)' index='"+i+"' style='width:180px' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</span></td>";
                                if(list[i].groupname==""){
                                    table+="<td>(已删除终端)</td>"; 
                                }else{
                                    table+="<td>"+safeStr(list[i].groupname)+"</td>";
                                }
                                
                                if(list[i].viewOnly == true){
                                    table+="<td>远程查看</td>";
                                }else if(list[i].viewOnly == false){
                                    table+="<td>远程控制</td>";
                                }else{
                                    table+="<td></td>";
                                }
                                
                                table+="<td><span class='filePath' style='width:180px' title="+safeStr(pathtitle(list[i].reason))+">"+safeStr(list[i].reason)+"</span></td>";
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

$(".main .table").css({height:mainlefth-298});

window.onresize = function(){
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .table").css({height:mainlefth-298});

}
