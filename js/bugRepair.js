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

$(".bu").click(function(){
	$(this).siblings(".bu").removeClass("current");
	$(this).addClass("current");

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


$(document).on('click','.tableContainer .tableth th',function(){
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
        url:'/mgr/leakrepair/_history',
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
            var searchBlock="";
            var total=Math.ceil(data.data.view.total/numperpage);
//          $(".table table").html("");
            
            table+="<table>";
            if($(".filterBlock .tabButton option:checked").val()==0 && list!==null){
                tableth+="<tr>";
                tableth+="<th width='12%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='10%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='10%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='10%' class='th-ordery' type='kbid'>补丁编号<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='28%' class='th-ordery' type='desc'>补丁描述<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='10%' class='th-ordery' type='level'>补丁类型<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='8%' class='th-ordery' type='state'>状态<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";
                table+="<tr id='tableAlign'>";
                table+="<td width='12%'>时间</td>";
                table+="<td width='10%'>终端名称</td>";
                table+="<td width='10%'>终端分组</td>";
                table+="<td width='10%'>补丁编号</td>";
                table+="<td width='28%'>补丁描述</td>";
                table+="<td width='10%'>补丁类型</td>";
                table+="<td width='8%'>状态</td>";
                table+="</tr>";
                for(i=0;i<list.length;i++){
                    table+="<tr client="+list[i].client_id+" kbid="+list[i].kbid+">";
                    table+="<td>"+getLocalTime(list[i].time)+"</td>";
                    table+="<td><span style='width:90px;' class='underline cursor blackfont filePath ctrlPopBtn' title='"+safeStr(list[i].hostname)+"'>"+safeStr(list[i].hostname)+"</span></td>";
                    if(list[i].group_name==""){
                        table+="<td>(已删除终端)</td>"; 
                    }else{
                        table+="<td>"+safeStr(list[i].group_name)+"</td>";
                    }
                    table+="<td><span class='underline cursor blackfont  ctrlPopBtn'>KB"+list[i].kbid+"</span></td>";
                    table+="<td><span class='filePath loophtWidth' style='width:280px;' title='"+list[i].desc+"'>"+list[i].desc+"</span></td>";
                    if(list[i].level == 0){
                    	table+="<td>高危补丁</td>";
                    }else if(list[i].level == 1){
                    	table+="<td>功能更新</td>";
                    }
                    
                    if(list[i].state == 0){
                    	table+="<td>等待修复</td>";
                    }else if(list[i].state == 1){
                    	table+="<td>暂不修复</td>";
                    }else if(list[i].state == 2){
                    	table+="<td>下载补丁</td>";
                    }else if(list[i].state == 3){
                    	table+="<td>下载错误</td>";
                    }else if(list[i].state == 4){
                    	table+="<td>下载完成</td>";
                    }else if(list[i].state == 5){
                    	table+="<td>安装补丁</td>";
                    }else if(list[i].state == 6){
                    	table+="<td>安装错误</td>";
                    }else if(list[i].state == 7){
                    	table+="<td>安装完成</td>";
                    }else{
                    	table+="<td></td>";
                    }
                    table+="</tr>";
                }

            }else if($(".filterBlock .tabButton option:checked").val()==1 && list!==null){
                tableth+="<tr>";
                tableth+="<th width='40%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='40%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='count'>漏洞数量<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";

                table+="<tr id='tableAlign'>";
                table+="<td width='40%'>终端名称</td>";
                table+="<td width='40%'>终端分组</td>";
                table+="<td width='20%'>漏洞数量</td>";
                table+="</tr>";
                
                for(i=0;i<list.length;i++){
                    table+="<tr client="+list[i].client_id+" tc="+list[i]['class']+">";
                	table+="<td><a class='filePath' style='width:400px;' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</a></td>";
                    if(list[i].group_name==""){
                        table+="<td><span title='(已删除终端)'>(已删除终端)</span></td>";
                    }else{
                        table+="<td><span  title="+safeStr(pathtitle(list[i].group_name))+">"+safeStr(list[i].group_name)+"</span></td>";
                    }
                    
                    table+="<td><span class='underline cursor blackfont  ctrlPopBtn'>"+list[i].count+"</span></td>";

//                  table+="</div>";
//                  table+="</td>";
                    table+="</tr>";
                }

            }else if($(".filterBlock .tabButton option:checked").val()==0 && list==null){
                tableth+="<tr>";
                tableth+="<th width='12%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='12%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='10%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='10%' class='th-ordery' type='kbid'>补丁编号<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='28%' class='th-ordery' type='desc'>补丁描述<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='10%' class='th-ordery' type='level'>补丁类型<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='8%' class='th-ordery' type='state'>状态<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";

            }else if($(".filterBlock .tabButton option:checked").val()==1 && list==null){
            	tableth+="<tr>";
                tableth+="<th width='17%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='10%' class='th-ordery' type='count'>漏洞数量<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";
            }
            table+="</table>";
            
            $(".table table").hide();
            $(".main .tableth table").html(tableth);
            if(list==null){
                $(".table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
            }else{
                $(".table").html(table);
            }
            
            $(".table table").show(); 
            
            var thIndex=$('.main .tableth').attr('index');
			var thCls=$('.main .tableth').attr('indexCls');
			$('.main .tableth th').eq(thIndex).addClass(thCls);
            imgOrderyFun(thIndex,thCls);
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
                    $(".table table").html("");
                    start=(pageIndex-1)*numperpage;
                    dataa.view.begin = start;
                    $(".table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
                    ajaxtable=
                    $.ajax({
                        url:'/mgr/leakrepair/_history',
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
                            if($(".filterBlock .tabButton option:checked").val()==0 && list!==null){
				                tableth+="<tr>";
				                tableth+="<th width='12%'>时间</th>";
				                tableth+="<th width='10%'>终端名称</th>";
				                tableth+="<th width='10%'>终端分组</th>";
				                tableth+="<th width='10%'>补丁编号</th>";
				                tableth+="<th width='28%'>补丁描述</th>";
				                tableth+="<th width='10%'>补丁类型</th>";
				                tableth+="<th width='8%'>状态</th>";
				                tableth+="</tr>";
				                table+="<tr id='tableAlign'>";
				                table+="<td width='12%'>时间</td>";
				                table+="<td width='10%'>终端名称</td>";
				                table+="<td width='10%'>终端分组</td>";
				                table+="<td width='10%'>补丁编号</td>";
				                table+="<td width='28%'>补丁描述</td>";
				                table+="<td width='10%'>补丁类型</td>";
				                table+="<td width='8%'>状态</td>";
				                table+="</tr>";
				               	for(i=0;i<list.length;i++){
				                    table+="<tr client="+list[i].client_id+"  kbid="+list[i].kbid+">";
				                    table+="<td>"+getLocalTime(list[i].time)+"</td>";
				                    table+="<td><span style='width:90px;' title='"+safeStr(list[i].hostname)+"' class='underline cursor blackfont filePath ctrlPopBtn'>"+safeStr(list[i].hostname)+"</span></td>";
				                    if(list[i].group_name==""){
				                        table+="<td>(已删除终端)</td>"; 
				                    }else{
				                        table+="<td>"+safeStr(list[i].group_name)+"</td>";
				                    }
				                    table+="<td><span class='underline cursor blackfont  ctrlPopBtn'>KB"+list[i].kbid+"</span></td>";
				                    table+="<td><span class='filePath loophtWidth' style='width:280px;' title='"+list[i].desc+"'>"+list[i].desc+"</span></td>";
				                    if(list[i].level == 0){
				                    	table+="<td>高危补丁</td>";
				                    }else if(list[i].level == 1){
				                    	table+="<td>功能更新</td>";
				                    }
				                    
				                     if(list[i].state == 0){
				                    	table+="<td>等待修复</td>";
				                    }else if(list[i].state == 1){
				                    	table+="<td>暂不修复</td>";
				                    }else if(list[i].state == 2){
				                    	table+="<td>下载补丁</td>";
				                    }else if(list[i].state == 3){
				                    	table+="<td>下载错误</td>";
				                    }else if(list[i].state == 4){
				                    	table+="<td>下载完成</td>";
				                    }else if(list[i].state == 5){
				                    	table+="<td>安装补丁</td>";
				                    }else if(list[i].state == 6){
				                    	table+="<td>安装错误</td>";
				                    }else if(list[i].state == 7){
				                    	table+="<td>安装完成</td>";
				                    }else{
				                    	table+="<td></td>";
				                    }
				                    table+="</tr>";
				                }
				
				            }else if($(".filterBlock .tabButton option:checked").val()==1 && list!==null){
				                tableth+="<tr>";
				                tableth+="<th width='40%'>终端名称</th>";
				                tableth+="<th width='40%'>终端分组</th>";
				                tableth+="<th width='20%'>漏洞数量</th>";
				                tableth+="</tr>";
				
				                table+="<tr id='tableAlign'>";
				                table+="<td width='40%'>终端名称</td>";
				                table+="<td width='40%'>终端分组</td>";
				                table+="<td width='20%'>漏洞数量</td>";
				                table+="</tr>";
				                
				                for(i=0;i<list.length;i++){
				                    table+="<tr client="+list[i].client_id+" tc="+list[i]['class']+">";
                					table+="<td><a class='filePath' style='width:400px;' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</a></td>";
				                    if(list[i].group_name==""){
				                        table+="<td><span  title='(已删除终端)'>(已删除终端)</span></td>";
				                    }else{
				                        table+="<td><span title="+safeStr(pathtitle(list[i].group_name))+">"+safeStr(list[i].group_name)+"</span></td>";
				                    }
				                    
				                    table+="<td><span  class='underline cursor blackfont  ctrlPopBtn'>"+list[i].count+"</span></td>";
				
//				                    table+="</div>";
//				                    table+="</td>";
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
//详情排序


$(document).on('click','.taskDetailPop .tableth th.th-ordery',function(){
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
	var currentNum = 9;
	var start = (parseInt(currentPage) - 1) * 9;
	seeDetailPop(start);
})
//漏洞修复弹窗
var ajaxdetailtable=null;
$(document).on('click','.tableContainer .ctrlPopBtn',function(){
	$('.taskDetailPop .tableth th.th-ordery').removeClass().addClass('th-ordery');
	$('.taskDetailPop .tableth').removeAttr('indexCls');
    $(".taskDetailPop").attr('trIndex',$(this).parents('tr').index());
    $(".taskDetailPop").attr('tdIndex',$(this).parent('td').index());
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
    var trIndex = $(".taskDetailPop").attr('trIndex');
    var tdIndex=$(".taskDetailPop").attr('tdIndex');
    
	var pageIndex=$('.filterBlock .tabButton option:checked').val();
	var begintime=getBeginTimes($("#txtBeginDate").val());
    var endtime=getEndTimes($("#txtEndDate").val());
    $(".taskDetailPop").children(":not(:first)").hide();
    $(".taskDetailPop").append("<div style='text-align:center;color:#6a6c6e;padding-top:201px;' class='detailLoading'><img src='images/loading.gif'></div>");
	if(tdIndex == 1 && pageIndex == 0){
		var hostname = $('.tableContainer .table tr').eq(trIndex).children("td").eq(1).find('span').text();
		var groupname = $('.tableContainer .table tr').eq(trIndex).children("td").eq(2).text();
		var clientid=$('.tableContainer .table tr').eq(trIndex).attr('client');
		
		$(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+safeStr(hostname)+"'>"+safeStr(hostname)+" ,</a> 终端分组 : "+groupname);
		
        var dataa={"date":{"begin":begintime,"end":endtime},"groupby":"detail","client_id":clientid,"view":{"begin":start,"count":9}};
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
		ajaxdetailtable=
        $.ajax({
            url:'/mgr/leakrepair/_history',
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
                var total=Math.ceil(totalnum/9);
                th+="<th width='30%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='26%' class='th-ordery' type='kbid'>补丁编号<img src='images/th-ordery.png'/></th>";
                th+="<th width='20%' class='th-ordery' type='level'>补丁类型<img src='images/th-ordery.png'/></th>";
                th+="<th width='10%' class='th-ordery' type='state'>状态<img src='images/th-ordery.png'/></th>";
                $(".taskDetailPop .tableth table tr").html(th);
                
                table+="<tr id='tableAlign'>";
                table+="<td width='30%'>时间</td>";
                table+="<td width='26%'>补丁编号</td>";
                table+="<td width='20%'>补丁类型</td>";
                table+="<td width='10%'>状态</td>";
                table+="</tr>"
                
                 for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td>KB"+list[i].kbid+"</td>";
                    if(list[i].level == 0){
                    	table+="<td>高危补丁</td>";
                    }else if(list[i].level == 1){
                    	table+="<td>功能更新</td>";
                    }
                    if(list[i].state == 0){
                    	table+="<td>等待修复</td>";
                    }else if(list[i].state == 1){
                    	table+="<td>暂不修复</td>";
                    }else if(list[i].state == 2){
                    	table+="<td>下载补丁</td>";
                    }else if(list[i].state == 3){
                    	table+="<td>下载错误</td>";
                    }else if(list[i].state == 4){
                    	table+="<td>下载完成</td>";
                    }else if(list[i].state == 5){
                    	table+="<td>安装补丁</td>";
                    }else if(list[i].state == 6){
                    	table+="<td>安装错误</td>";
                    }else if(list[i].state == 7){
                    	table+="<td>安装完成</td>";
                    }else{
                    	table+="<td></td>";
                    }
                    table+="</tr>";
                }
                if(list==null){
	                $(".taskDetailTable table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
	            }else{
	                $(".taskDetailTable table").html(table);
	            }
	            $(".taskDetailPop .describe").show(); 
	            $(".taskDetailPop .tableth").show();
	            $(".taskDetailPop .taskDetailTable").show();
	            $(".taskDetailPop").children(".detailLoading").remove();
	            
	            var thIndex=$('.taskDetailPop .tableth').attr('index');
				var thCls=$('.taskDetailPop .tableth').attr('indexCls');
				$('.taskDetailPop .tableth th').eq(thIndex).addClass(thCls);
				imgOrderyFun1(thIndex,thCls)

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
                            headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
                            error:function(xhr,textStatus,errorThrown){
					        	if(xhr.status==401){
					        	    parent.window.location.href='/';
					        	}else{
					        		
					        	}
					            
					        },
                            success:function(data){
                                var list=data.data.list;
                                var tablePage="";
                                
                                tablePage+="<tr id='tableAlign'>";
				                tablePage+="<td width='30%'>时间</td>";
				                tablePage+="<td width='26%'>补丁编号</td>";
				                tablePage+="<td width='20%'>补丁类型</td>";
				                tablePage+="<td width='10%'>状态</td>";
				                tablePage+="</tr>"
				                
				                 for (var i = 0; i < list.length; i++) {
				                    tablePage+="<tr>";
				                    tablePage+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
				                    tablePage+="<td>KB"+list[i].kbid+"</td>";
				                    if(list[i].level == 0){
				                    	tablePage+="<td>高危补丁</td>";
				                    }else if(list[i].level == 1){
				                    	tablePage+="<td>功能更新</td>";
				                    }
				                    if(list[i].state == 0){
				                    	tablePage+="<td>等待修复</td>";
				                    }else if(list[i].state == 1){
				                    	tablePage+="<td>暂不修复</td>";
				                    }else if(list[i].state == 2){
				                    	tablePage+="<td>下载补丁</td>";
				                    }else if(list[i].state == 3){
				                    	tablePage+="<td>下载错误</td>";
				                    }else if(list[i].state == 4){
				                    	tablePage+="<td>下载完成</td>";
				                    }else if(list[i].state == 5){
				                    	tablePage+="<td>安装补丁</td>";
				                    }else if(list[i].state == 6){
				                    	tablePage+="<td>安装错误</td>";
				                    }else if(list[i].state == 7){
				                    	tablePage+="<td>安装完成</td>";
				                    }else{
				                    	tablePage+="<td></td>";
				                    }
				                    tablePage+="</tr>";
				                }
				                $(".taskDetailTable table").html(' ');
                                $(".taskDetailTable table").html(tablePage);
                            }
                                
                        })
                    }
                })
            }
        });
	}else if(tdIndex == 3 && pageIndex == 0){
		var level = $('.tableContainer .table tr').eq(trIndex).children("td").eq(5).text();
		var kbid=$('.tableContainer .table tr').eq(trIndex).attr('kbid');
		
		$(".taskDetailPop .describe").html("补丁编号 : "+kbid+" , 补丁类型 : "+level);
		
        var dataa={"date":{"begin":begintime,"end":endtime},"groupby":"detail","kbid":kbid,"view":{"begin":start,"count":9}};
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
		ajaxdetailtable=
        $.ajax({
            url:'/mgr/leakrepair/_history',
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
                var total=Math.ceil(totalnum/9);
                th+="<th width='30%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='26%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                th+="<th width='20%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                th+="<th width='10%' class='th-ordery' type='state'>状态<img src='images/th-ordery.png'/></th>";
                $(".taskDetailPop .tableth table tr").html(th);
                
                table+="<tr id='tableAlign'>";
                table+="<td width='30%'>时间</td>";
                table+="<td width='26%'>终端名称</td>";
                table+="<td width='20%'>终端分组</td>";
                table+="<td width='10%'>状态</td>";
                table+="</tr>"
                
                 for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td><span style='width:150px;' title='"+safeStr(list[i].hostname)+"' class='filePath'>"+safeStr(list[i].hostname)+"</span></td>";
                    if(list[i].group_name == ""){
                    	table+="<td>(已删除终端)</td>";
                    }else{
                    	table+="<td>"+list[i].group_name+"</td>";
                    }
                    if(list[i].state == 0){
                    	table+="<td>等待修复</td>";
                    }else if(list[i].state == 1){
                    	table+="<td>暂不修复</td>";
                    }else if(list[i].state == 2){
                    	table+="<td>下载补丁</td>";
                    }else if(list[i].state == 3){
                    	table+="<td>下载错误</td>";
                    }else if(list[i].state == 4){
                    	table+="<td>下载完成</td>";
                    }else if(list[i].state == 5){
                    	table+="<td>安装补丁</td>";
                    }else if(list[i].state == 6){
                    	table+="<td>安装错误</td>";
                    }else if(list[i].state == 7){
                    	table+="<td>安装完成</td>";
                    }else{
                    	table+="<td></td>";
                    }
                    
                    table+="</tr>";
                }
               
                 
                if(list==null){
	                $(".taskDetailTable table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
	            }else{
	                $(".taskDetailTable table").html(table);
	            }
	            $(".taskDetailPop .describe").show(); 
	            $(".taskDetailPop .tableth").show();
	            $(".taskDetailPop .taskDetailTable").show();
	            $(".taskDetailPop").children(".detailLoading").remove();
				var thIndex=$('.taskDetailPop .tableth').attr('index');
				var thCls=$('.taskDetailPop .tableth').attr('indexCls');
				$('.taskDetailPop .tableth th').eq(thIndex).addClass(thCls);
				imgOrderyFun1(thIndex,thCls)
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
                            headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
                            error:function(xhr,textStatus,errorThrown){
					        	if(xhr.status==401){
					        	    parent.window.location.href='/';
					        	}else{
					        		
					        	}
					            
					        },
                            success:function(data){
                                var list=data.data.list;
                                var tablePage="";
                                
                                tablePage+="<tr id='tableAlign'>";
				                tablePage+="<td width='30%'>时间</td>";
				                tablePage+="<td width='26%'>终端名称</td>";
				                tablePage+="<td width='20%'>终端分组</td>";
				                tablePage+="<td width='10%'>状态</td>";
				                tablePage+="</tr>"
				                
				                 for (var i = 0; i < list.length; i++) {
				                    tablePage+="<tr>";
				                    tablePage+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    				tablePage+="<td><span style='width:150px;' class='filePath'>"+safeStr(list[i].hostname)+"</span></td>";
				                    
				                    if(list[i].group_name == ""){
				                    	tablePage+="<td>(已删除终端)</td>";
				                    }else{
				                    	tablePage+="<td>"+list[i].group_name+"</td>";
				                    }
				                    
				                    if(list[i].state == 0){
				                    	tablePage+="<td>等待修复</td>";
				                    }else if(list[i].state == 1){
				                    	tablePage+="<td>暂不修复</td>";
				                    }else if(list[i].state == 2){
				                    	tablePage+="<td>下载补丁</td>";
				                    }else if(list[i].state == 3){
				                    	tablePage+="<td>下载错误</td>";
				                    }else if(list[i].state == 4){
				                    	tablePage+="<td>下载完成</td>";
				                    }else if(list[i].state == 5){
				                    	tablePage+="<td>安装补丁</td>";
				                    }else if(list[i].state == 6){
				                    	tablePage+="<td>安装错误</td>";
				                    }else if(list[i].state == 7){
				                    	tablePage+="<td>安装完成</td>";
				                    }else{
				                    	tablePage+="<td></td>";
				                    }
				                    
				                    tablePage+="</tr>";
				                }
				                $(".taskDetailTable table").html(' ');
                                $(".taskDetailTable table").html(tablePage);
                            }
                        })
                    }
                })
            }
        });
	}else if(tdIndex == 2 && pageIndex == 1){
		var hostname = $('.tableContainer .table tr').eq(trIndex).children("td").eq(0).find('a').text();
		var groupname = $('.tableContainer .table tr').eq(trIndex).children("td").eq(1).text();
		var clientid=$('.tableContainer .table tr').eq(trIndex).attr('client');
		
		$(".taskDetailPop .describe").html("终端名称 :<a class='filePath popHostname' title='"+safeStr(hostname)+"'>"+safeStr(hostname)+" ,</a>终端分组 : "+safeStr(groupname));
		
        var dataa={"date":{"begin":begintime,"end":endtime},"groupby":"detail","client_id":clientid,"view":{"begin":start,"count":9}};
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
		ajaxdetailtable=
        $.ajax({
            url:'/mgr/leakrepair/_history',
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
                var total=Math.ceil(totalnum/9);
                th+="<th width='30%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='26%' class='th-ordery' type='kbid'>补丁编号<img src='images/th-ordery.png'/></th>";
                th+="<th width='20%' class='th-ordery' type='level'>补丁类型<img src='images/th-ordery.png'/></th>";
                th+="<th width='10%' class='th-ordery' type='state'>状态<img src='images/th-ordery.png'/></th>";
                $(".taskDetailPop .tableth table tr").html(th);
                
                table+="<tr id='tableAlign'>";
                table+="<td width='30%'>时间</td>";
                table+="<td width='26%'>补丁编号</td>";
                table+="<td width='20%'>补丁类型</td>";
                table+="<td width='10%'>状态</td>";
                table+="</tr>"
                
                 for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td>KB"+list[i].kbid+"</td>";
                    if(list[i].level == 0){
                    	table+="<td>高危补丁</td>";
                    }else if(list[i].level == 1){
                    	table+="<td>功能更新</td>";
                    }
                    
                    if(list[i].state == 0){
                    	table+="<td>等待修复</td>";
                    }else if(list[i].state == 1){
                    	table+="<td>暂不修复</td>";
                    }else if(list[i].state == 2){
                    	table+="<td>下载补丁</td>";
                    }else if(list[i].state == 3){
                    	table+="<td>下载错误</td>";
                    }else if(list[i].state == 4){
                    	table+="<td>下载完成</td>";
                    }else if(list[i].state == 5){
                    	table+="<td>安装补丁</td>";
                    }else if(list[i].state == 6){
                    	table+="<td>安装错误</td>";
                    }else if(list[i].state == 7){
                    	table+="<td>安装完成</td>";
                    }else{
                    	table+="<td></td>";
                    }
				                    
                    table+="</tr>";
                }
                 
                if(list==null){
	                $(".taskDetailTable table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
	            }else{
	                $(".taskDetailTable table").html(table);
	            }
	            $(".taskDetailPop .describe").show(); 
	            $(".taskDetailPop .tableth").show();
	            $(".taskDetailPop .taskDetailTable").show();
	            $(".taskDetailPop").children(".detailLoading").remove();
var thIndex=$('.taskDetailPop .tableth').attr('index');
				var thCls=$('.taskDetailPop .tableth').attr('indexCls');
				$('.taskDetailPop .tableth th').eq(thIndex).addClass(thCls);
				imgOrderyFun1(thIndex,thCls)
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
                            headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
                            error:function(xhr,textStatus,errorThrown){
					        	if(xhr.status==401){
					        	    parent.window.location.href='/';
					        	}else{
					        		
					        	}
					            
					        },
                            success:function(data){
                                var list=data.data.list;
                                var tablePage="";
                                
                                tablePage+="<tr id='tableAlign'>";
				                tablePage+="<td width='30%'>时间</td>";
				                tablePage+="<td width='26%'>补丁编号</td>";
				                tablePage+="<td width='20%'>补丁类型</td>";
				                tablePage+="<td width='10%'>状态</td>";
				                tablePage+="</tr>"
				                
				                 for (var i = 0; i < list.length; i++) {
				                    tablePage+="<tr>";
				                    tablePage+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
				                    tablePage+="<td>KB"+list[i].kbid+"</td>";
				                    if(list[i].level == 0){
				                    	tablePage+="<td>高危补丁</td>";
				                    }else if(list[i].level == 1){
				                    	tablePage+="<td>功能更新</td>";
				                    }
				                    
				                    if(list[i].state == 0){
				                    	tablePage+="<td>等待修复</td>";
				                    }else if(list[i].state == 1){
				                    	tablePage+="<td>暂不修复</td>";
				                    }else if(list[i].state == 2){
				                    	tablePage+="<td>下载补丁</td>";
				                    }else if(list[i].state == 3){
				                    	tablePage+="<td>下载错误</td>";
				                    }else if(list[i].state == 4){
				                    	tablePage+="<td>下载完成</td>";
				                    }else if(list[i].state == 5){
				                    	tablePage+="<td>安装补丁</td>";
				                    }else if(list[i].state == 6){
				                    	tablePage+="<td>安装错误</td>";
				                    }else if(list[i].state == 7){
				                    	tablePage+="<td>安装完成</td>";
				                    }else{
				                    	tablePage+="<td></td>";
				                    }
				                    
				                    tablePage+="</tr>";
				                }
				                $(".taskDetailTable table").html(' ');
                                $(".taskDetailTable table").html(tablePage);
                            }
                        })
                    }
                })
            }
        });
	}
}



//关闭弹层
$(document).on('click','.closeW',function(){
    $(".shade").hide();
    parent.$(".topshade").hide();
    $(this).parent().parent().hide();
    $(".taskDetailPop .taskDetailTable").prop("scrollTop","0");
});


//调整页面内元素高度
var mainlefth=parent.$("#iframe #mainFrame").height();

$(".main .table").css({height:mainlefth-347});

window.onresize = function(){
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .table").css({height:mainlefth-347});

}
