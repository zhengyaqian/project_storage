//loading执行
grouplist();
$("#txtBeginDate").calendar();
$("#txtEndDate").calendar();
$("#txtBeginDate").val(GetDateStr(-6));
$("#txtEndDate").val(GetDateStr(0));
// parent.$(".footer").hide();

//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a").removeClass("current");
parent.$(".nav .container a[name='virusDefense.html']").addClass("current");
parent.$(".footer").show();


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
	$('.tableth th.th-ordery').removeClass().addClass('th-ordery');
	$('.main .tableth').removeAttr('index indexCls');
    accEvent();
    
})
// 搜索类型选择
$("#selectVD,#selectVT").change(function(){
    accEvent();
})
// 搜索框键盘离开时
// $("#searchKey").keyup(function(){
//     accEvent();
// })
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
// 点击今天昨天
// $("#specialTime .bu").click(function(){
//     if($("#specialTime .current").index()==1){

//         $("#txtBeginDate").val(GetDateStr(0));
//         $("#txtEndDate").val(GetDateStr(0));

//     }else if($("#specialTime .current").index()==2){
//         $("#txtBeginDate").val(GetDateStr(-1));
//         $("#txtEndDate").val(GetDateStr(-1));
//     }else if($("#specialTime .current").index()==3){
//         $("#txtBeginDate").val(GetDateStr(-2));
//         $("#txtEndDate").val(GetDateStr(0));
//     }else{
//         $("#txtBeginDate").val(GetDateStr(-6));
//         $("#txtEndDate").val(GetDateStr(0));
//     };
//     accEvent();

// })
//选择时间
$("#specialTime select").change(function(){

    if($(this).find("option:selected").val()==0){
        $("#txtBeginDate").val(GetDateStr(-6));
        $("#txtEndDate").val(GetDateStr(0));
        $(".filterBlock .middle").hide(200);
        accEvent();
        resizeTableHeight();
    }else if($(this).find("option:selected").val()==1){
        $("#txtBeginDate").val(GetDateStr(-29));
        $("#txtEndDate").val(GetDateStr(0));
        $(".filterBlock .middle").hide(200);
        accEvent();
        resizeTableHeight();
    }else if($(this).find("option:selected").val()==2){
        $("#txtBeginDate").val(GetDateStr(-89));
        $("#txtEndDate").val(GetDateStr(0));
        $(".filterBlock .middle").hide(200);
        accEvent();
        resizeTableHeight();
    }else if($(this).find("option:selected").val()==3){
        $("#txtBeginDate").val(GetDateStr(-364));
        $("#txtEndDate").val(GetDateStr(0));
        $(".filterBlock .middle").hide(200);
        accEvent();
        resizeTableHeight();
    }else if($(this).find("option:selected").val()==4){
        $(".filterBlock .middle").show(200);
        resizeTableHeight(true);
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

    if($("#functionBlock .current").index()==1){
    	dataa.fname = "antivirus";
    }else if($("#functionBlock .current").index()==2){
    	dataa.fname = "scan";
    }else if($("#functionBlock .current").index()==3 ){
    	dataa.fname = "filemon";
    }else if($("#functionBlock .current").index()==4){
    	dataa.fname = "behavior";
    }else if($("#functionBlock .current").index()==5 ){
    	dataa.fname = "udiskmon";
    }else if($("#functionBlock .current").index()==6){
    	dataa.fname = "dlmon";
    }else if($("#functionBlock .current").index()==7){
    	dataa.fname = "mail";
    }
	if(parseInt($("#groupSelect option:selected").attr("groupid"))!==0 && groupid){
    		dataa.group_id = groupid;
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
//排序

$(document).on('click','.tableContainer .tableth th.th-ordery',function(){
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
var ajaxtable=null;
function accEvent(start){
    if(ajaxtable){
    ajaxtable.abort();  
    }
    
    var dataa = accEvnetParam(start);
    $(".table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
    ajaxtable=
    $.ajax({
        url:'/mgr/log/_search',
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
            

            table+="<table>";
            if($(".filterBlock .tabButton option:checked").val()==1 && list!==null){
                tableth+="<tr>";
                tableth+="<th width='40%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='40%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='count'>威胁数量<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";
                table+="<tr id='tableAlign'>";
                table+="<td width='40%'>终端名称</td>";
                table+="<td width='40%'>终端分组</td>";
                table+="<td width='20%'>威胁数量</td>";
                table+="</tr>";
                for(i=0;i<list.length;i++){
                    table+="<tr client="+list[i].client_id+" virus="+list[i].virus_id+">";
                    table+="<td><span style='width:400px;' class='filePath' title="+safeStr(list[i].hostname)+">"+safeStr(list[i].hostname)+"</span></td>";
                    if(list[i].group_name==""){
                        table+="<td>(已删除终端)</td>"; 
                   }else{
                        table+="<td>"+safeStr(list[i].group_name)+"</td>";
                   }
                    
                    table+="<td><a class='underline cursor blackfont seeDetail'>"+list[i].count+"</a></td>";
                    table+="</tr>";
                }

            }else if($(".filterBlock .tabButton option:checked").val()==1 && list==null){
                tableth+="<tr>";
                tableth+="<th width='40%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='40%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='count'>威胁数量<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";
                

            }else if($(".filterBlock .tabButton option:checked").val()==0 && list!==null){
                tableth+="<tr>";
                tableth+="<th width='14%'  class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='virus_name'>病毒名<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='file_name'>威胁来源<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='10%' class='th-ordery' type='fname'>检出方式<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='8%' class='th-ordery' type='result'>状态<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";
                table+="<tr id='tableAlign'>";
                table+="<td width='14%'>时间</td>";
                table+="<td width='17%'>终端名称</td>";
                table+="<td width='17%'>终端分组</td>";
                table+="<td width='17%'>病毒名</td>";
                table+="<td width='17%'>威胁来源</td>";
                table+="<td width='10%'>检出方式</td>";
                table+="<td width='8%'>状态</td>";
                table+="</tr>";
                for(i=0;i<list.length;i++){
                    table+="<tr client="+list[i].client_id+" virus="+list[i].virus_id+">";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td><a class='underline cursor filePath blackfont seeDetail' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</a></td>";
                    if(list[i].group_name==""){
                        table+="<td><span class='filePath' title='(已删除终端)'>(已删除终端)</span></td>";
                    }else{
                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].group_name))+">"+safeStr(list[i].group_name)+"</span></td>";
                    }
                    
                    table+="<td><a class='underline cursor filePath blackfont seeDetail' title="+safeStr(pathtitle(list[i].virus_name))+">"+safeStr(list[i].virus_name)+"</a></td>";

                    if(list[i].fname=="mail"){
                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].file_name.replace('<','&lt;').replace('>','&gt;').replace('"','')))+">"+safeStr(list[i].file_name.replace('<','&lt;').replace('>','&gt;'))+"</span></td>";
                    }else{
                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].file_path))+">"+safeStr(list[i].file_name)+"</span></td>";
                    }
                    if(list[i].fname=="scan"){
                        table+="<td>病毒查杀</td>"; 
                    }else if(list[i].fname=="filemon"){
                        table+="<td>文件实时监控</td>"; 
                    }else if(list[i].fname=="behavior"){
                        table+="<td>恶意行为监控</td>"; 
                    }else if(list[i].fname=="dlmon"){
                        table+="<td>下载保护</td>"; 
                    }else if(list[i].fname=="udiskmon"){
                        table+="<td>U盘保护</td>"; 
                    }else if(list[i].fname=="mail"){
                        table+="<td>邮件监控</td>"; 
                    }
                    if(list[i].result==0){
                        table+="<td>处理失败</td>";
                    }else if(list[i].result==1){
                        table+="<td>处理失败</td>";
                    }else if(list[i].result==2){
                        table+="<td>已阻止</td>";
                    }else if(list[i].result==3){
                        table+="<td>已删除</td>";
                    }else if(list[i].result==4){
                        table+="<td>已清除</td>";
                    }else if(list[i].result==5){
                        table+="<td>已信任</td>";
                    }else if(list[i].result==6){
                        table+="<td>已忽略</td>";
                    }
                    
                    table+="</tr>";
                }

            }else if($(".filterBlock .tabButton option:checked").val()==0 && list==null){
                tableth+="<tr>";
                tableth+="<th width='14%'  class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='virus_name'>病毒名<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='file_name'>威胁来源<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='10%' class='th-ordery' type='fname'>检出方式<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='8%' class='th-ordery' type='result'>状态<img src='images/th-ordery.png'/></th>";
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
			imgOrderyFun(thIndex,thCls)
			
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

					var dataa = accEvnetParam(start);
                    $(".table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
                    ajaxtable=
                    $.ajax({
                        url:'/mgr/log/_search',
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
                            if($(".filterBlock .tabButton option:checked").val()==1){
                                
                                table+="</tr>";
                                table+="<tr id='tableAlign'>";
                                table+="<td width='40%'>终端名称</td>";
                                table+="<td width='40%'>终端分组</td>";
                                table+="<td width='20%'>威胁数量</td>";
                                table+="</tr>";
                                for(i=0;i<list.length;i++){
                                    table+="<tr client="+list[i].client_id+" virus="+list[i].virus_id+">";
                    				table+="<td><span style='width:400px;' class='filePath' title="+safeStr(list[i].hostname)+">"+safeStr(list[i].hostname)+"</span></td>";
                                    if(list[i].group_name==""){
                                        table+="<td>(已删除终端)</td>"; 
                                    }else{
                                        table+="<td>"+safeStr(list[i].group_name)+"</td>";
                                    }
                                    
                                    table+="<td><a class='underline cursor blackfont seeDetail'>"+list[i].count+"</a></td>";
                                    table+="</tr>";
                                }

                            }else if($(".filterBlock .tabButton option:checked").val()==0){
                                table+="<tr id='tableAlign'>";
                                table+="<td width='14%'>时间</td>";
                                table+="<td width='17%'>终端名称</td>";
                                table+="<td width='17%'>终端分组</td>";
                                table+="<td width='17%'>病毒名</td>";
                                table+="<td width='17%'>威胁来源</td>";
                                table+="<td width='10%'>检出方式</td>";
                                table+="<td width='8%'>状态</td>";
                                table+="</tr>";
                                for(i=0;i<list.length;i++){
                                    table+="<tr client="+list[i].client_id+" virus="+list[i].virus_id+">";
                                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                                    table+="<td><a class='underline cursor filePath blackfont seeDetail' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</a></td>";
                                    if(list[i].group_name==""){
                                        table+="<td><span class='filePath' title='(已删除终端)'>(已删除终端)</span></td>";
                                    }else{
                                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].group_name))+">"+safeStr(list[i].group_name)+"</span></td>";
                                    }
                                    
                                    table+="<td><a class='underline cursor filePath blackfont seeDetail' title="+safeStr(pathtitle(list[i].virus_name))+">"+safeStr(list[i].virus_name)+"</a></td>";
                                    if(list[i].fname=="mail"){
                                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].file_name))+">"+safeStr(list[i].file_name)+"</span></td>";
                                    }else{
                                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].file_path))+">"+safeStr(list[i].file_name)+"</span></td>";
                                    }
                                    
                                    if(list[i].fname=="scan"){
                                        table+="<td>病毒查杀</td>"; 
                                    }else if(list[i].fname=="filemon"){
                                        table+="<td>文件实时监控</td>"; 
                                    }else if(list[i].fname=="behavior"){
                                        table+="<td>恶意行为监控</td>"; 
                                    }else if(list[i].fname=="dlmon"){
                                        table+="<td>下载保护</td>"; 
                                    }else if(list[i].fname=="udiskmon"){
                                        table+="<td>U盘保护</td>"; 
                                    }else if(list[i].fname=="mail"){
                                        table+="<td>邮件监控</td>"; 
                                    }
                                    
                                    if(list[i].result==0){
                                        table+="<td>处理失败</td>";
                                    }else if(list[i].result==1){
                                        table+="<td>处理失败</td>";
                                    }else if(list[i].result==2){
                                        table+="<td>已阻止</td>";
                                    }else if(list[i].result==3){
                                        table+="<td>已删除</td>";
                                    }else if(list[i].result==4){
                                        table+="<td>已清除</td>";
                                    }else if(list[i].result==5){
                                        table+="<td>已信任</td>";
                                    }else if(list[i].result==6){
                                        table+="<td>已忽略</td>";
                                    }
                
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
var threatnamee="";
var clientid="";
var totalnum="";
var clientorvirus="";
var virusid="";
var ajaxdetailtable=null;
var isbehavior="";

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


function seeDetailPop(start){
    if(ajaxdetailtable){
        ajaxdetailtable.abort();
    }
    shade();
    
    var trIndex=$(".taskDetailPop").attr('trIndex');
    var tdIndex=$(".taskDetailPop").attr('tdIndex');
    
    var begintime=getBeginTimes($("#txtBeginDate").val());
    var endtime=getEndTimes($("#txtEndDate").val());
    
    
    virusid=$('.tableContainer .table tr').eq(parseInt(trIndex)).attr('virus');
    isbehavior=$('.tableContainer .table tr').eq(parseInt(trIndex)).find("td").eq(5).html();
    if(start == undefined) {
		start = 0;
	}else{
		start = start;
	}
    $(".taskDetailPop").children(":not(:first)").hide();
    $(".taskDetailPop").append("<div style='text-align:center;color:#6a6c6e;padding-top:201px;' class='detailLoading'><img src='images/loading.gif'></div>");
    if($(".filterBlock .tabButton option:checked").val()==0 && parseInt(tdIndex)==1){
        var groupname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(2).find("span").html();
        var hostname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(1).find("a").html();
        clientid=parseInt($('.tableContainer .table tr').eq(parseInt(trIndex)).attr('client'));
        var dataa={"fname":"antivirus","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        
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
        $(".taskDetailPop .title font").html($('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(5).html());
        
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a> 终端分组 : "+groupname);
        ajaxdetailtable=
        $.ajax({
            url:'/mgr/log/_detail',
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

                th+="<th width='30%' class='th-ordery' type='time' >时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='26%' class='th-ordery' type='file_path'>威胁来源<img src='images/th-ordery.png'/></th>";
                th+="<th width='34%' class='th-ordery' type='virus_name'>病毒<img src='images/th-ordery.png'/></th>";
                th+="<th width='10%' class='th-ordery' type='result'>状态<img src='images/th-ordery.png'/></th>";
                $(".taskDetailPop .tableth table tr").html(th);
                
                table+="<tr id='tableAlign'>";
                
                table+="<td width='30%'>时间</td>";
                table+="<td width='26%'>威胁来源</td>";
                table+="<td width='34%'>病毒</td>";
                table+="<td width='10%'>状态</td>";
                table+="</tr>"
                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].file_path))+">"+safeStr(path(list[i].file_path))+"</span></td>";
                    if(isbehavior!=="恶意行为监控"){
                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].virus_name))+"("+safeStr(pathtitle(virusid))+")"+">"+safeStr(list[i].virus_name)+"</span></td>";
                    }else{
                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].virus_name))+">"+safeStr(list[i].virus_name)+"</span></td>";
                    }
                    
                    if(list[i].result==0){
                        table+="<td>处理失败</td>";
                    }else if(list[i].result==1){
                        table+="<td>处理失败</td>";
                    }else if(list[i].result==2){
                        table+="<td>已阻止</td>";
                    }else if(list[i].result==3){
                        table+="<td>已删除</td>";
                    }else if(list[i].result==4){
                        table+="<td>已清除</td>";
                    }else if(list[i].result==5){
                        table+="<td>已信任</td>";
                    }else if(list[i].result==6){
                        table+="<td>已忽略</td>";
                    }
                    table+="</tr>";
                };
                $(".taskDetailTable table").html(table);
                $(".taskDetailPop").children().show();
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
                            url:'/mgr/log/_detail',
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
                                
                                table+="<td width='30%'>时间</td>";
                                table+="<td width='26%'>威胁名称</td>";
                                table+="<td width='34%'>病毒</td>";
                                table+="<td width='10%'>状态</td>";
                                table+="</tr>"
                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].file_path))+">"+safeStr(path(list[i].file_path))+"</span></td>";
                                    if(isbehavior!=="恶意行为监控"){
                                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].virus_name))+"("+safeStr(pathtitle(virusid))+")"+">"+safeStr(list[i].virus_name)+"</span></td>";
                                    }else{
                                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].virus_name))+">"+safeStr(list[i].virus_name)+"</span></td>";
                                    }
                                    
                                    if(list[i].result==0){
                                        table+="<td>处理失败</td>";
                                    }else if(list[i].result==1){
                                        table+="<td>处理失败</td>";
                                    }else if(list[i].result==2){
                                        table+="<td>已阻止</td>";
                                    }else if(list[i].result==3){
                                        table+="<td>已删除</td>";
                                    }else if(list[i].result==4){
                                        table+="<td>已清除</td>";
                                    }else if(list[i].result==5){
                                        table+="<td>已信任</td>";
                                    }else if(list[i].result==6){
                                        table+="<td>已忽略</td>";
                                    }
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
    }else if($(".filterBlock .tabButton option:checked").val()==0 && parseInt(tdIndex)==3){
    	
        threatnamee=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(3).find("a").html();
        var dataa={"fname":"antivirus","date":{"begin":begintime,"end":endtime},"groupby":"event","filter":{"threat_name":threatnamee},"view":{"begin":start,"count":9}};
        
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
        
        if(isbehavior!=="恶意行为监控"){
            $(".taskDetailPop .title font").html($('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(5).html());
            $(".taskDetailPop .describe").html("病毒ID : "+virusid+" , "+"病毒名称 : "+threatnamee);
        }else{
            $(".taskDetailPop .title font").html($('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(5).html());
            $(".taskDetailPop .describe").html("病毒名称 : "+threatnamee);
        }

        
        ajaxdetailtable=
        $.ajax({
            url:'/mgr/log/_detail',
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
                
                th+="<th width='28%' class='th-ordery' type='time' >时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='28%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                th+="<th width='28%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                th+="<th width='16%' class='th-ordery' type='result'>状态<img src='images/th-ordery.png'/></th>";
                $(".taskDetailPop .tableth table tr").html(th);

                table+="<tr id='tableAlign'>";
                table+="<td width='28%'>时间</td>";
                table+="<td width='28%'>终端名称</td>";
                table+="<td width='28%'>终端分组</td>";
                table+="<td width='16%'>状态</td>";
                table+="</tr>";
                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td><span style='width:150px;' class='filePath' title="+safeStr(list[i].hostname)+">"+safeStr(list[i].hostname)+"</span></td>";
                    
                    if(list[i].group_name==""){
                        table+="<td>(已删除终端)</td>";
                    }else{
                        table+="<td>"+safeStr(list[i].group_name)+"</td>";
                    }
                    if(list[i].result==0){
                        table+="<td>处理失败</td>";
                    }else if(list[i].result==1){
                        table+="<td>处理失败</td>";
                    }else if(list[i].result==2){
                        table+="<td>已阻止</td>";
                    }else if(list[i].result==3){
                        table+="<td>已删除</td>";
                    }else if(list[i].result==4){
                        table+="<td>已清除</td>";
                    }else if(list[i].result==5){
                        table+="<td>已信任</td>";
                    }else if(list[i].result==6){
                        table+="<td>已忽略</td>";
                    }
                    table+="</tr>";
                };
                $(".taskDetailTable table").html(table);
                $(".taskDetailPop").children().show();
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
                    current: parseInt(current),
                    backFn:function(pageIndex){
                        start=(pageIndex-1)*9;
                        dataa.view.begin = start;
                        ajaxdetailtable=
                        $.ajax({
                            url:'/mgr/log/_detail',
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
                                table+="<td width='28%'>时间</td>";
                                table+="<td width='28%'>终端名称</td>";
                                table+="<td width='28%'>终端分组</td>";
                                table+="<td width='16%'>状态</td>";
                                table+="</tr>";
                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                   					table+="<td><span style='width:150px;' class='filePath' title="+safeStr(list[i].hostname)+">"+safeStr(list[i].hostname)+"</span></td>";
                                    
                                    if(list[i].group_name==""){
                                        table+="<td>(已删除终端)</td>";
                                    }else{
                                        table+="<td>"+safeStr(list[i].group_name)+"</td>";
                                    }
                                    
                                    if(list[i].result==0){
                                        table+="<td>处理失败</td>";
                                    }else if(list[i].result==1){
                                        table+="<td>处理失败</td>";
                                    }else if(list[i].result==2){
                                        table+="<td>已阻止</td>";
                                    }else if(list[i].result==3){
                                        table+="<td>已删除</td>";
                                    }else if(list[i].result==4){
                                        table+="<td>已清除</td>";
                                    }else if(list[i].result==5){
                                        table+="<td>已信任</td>";
                                    }else if(list[i].result==6){
                                        table+="<td>已忽略</td>";
                                    }
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
    }else if($(".filterBlock .tabButton option:checked").val()==1){
        var groupname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(1).html();
        var hostname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(0).find('span').html();
        clientid=parseInt($('.tableContainer .table tr').eq(parseInt(trIndex)).attr('client'));
        var dataa={"fname":"antivirus","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        
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
        ajaxdetailtable=
        $.ajax({
            url:'/mgr/log/_detail',
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
                
                
                 th+="<th width='28%' class='th-ordery' type='time' >时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='file_path' >威胁来源<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='virus_name' >病毒<img src='images/th-ordery.png'/></th>";
                th+="<th width='10%' class='th-ordery' type='result' >状态<img src='images/th-ordery.png'/></th>";
                $(".taskDetailPop .tableth table tr").html(th);

                table+="<tr id='tableAlign'>";
                table+="<td width='28%'>时间</td>";
                table+="<td width='30%'>威胁路径</td>";
                table+="<td width='30%'>病毒</td>";
                
                table+="<td width='10%'>状态</td>";
                table+="</tr>";
                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].file_path))+">"+safeStr(path(list[i].file_path))+"</span></td>";
                    if(isbehavior!=="恶意行为监控"){
                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].virus_name))+"("+safeStr(pathtitle(list[i].virus_id))+")"+">"+safeStr(list[i].virus_name)+"</span></td>";
                    }else{
                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].virus_name))+">"+safeStr(list[i].virus_name)+"</span></td>";
                    }
                    
                    if(list[i].result==0){
                        table+="<td width='200'>处理失败</td>";
                    }else if(list[i].result==1){
                        table+="<td width='200'>处理失败</td>";
                    }else if(list[i].result==2){
                        table+="<td width='200'>已阻止</td>";
                    }else if(list[i].result==3){
                        table+="<td width='200'>已删除</td>";
                    }else if(list[i].result==4){
                        table+="<td width='200'>已清除</td>";
                    }else if(list[i].result==5){
                        table+="<td width='200'>已信任</td>";
                    }else if(list[i].result==6){
                        table+="<td width='200'>已忽略</td>";
                    }
                    table+="</tr>";
                };
                $(".taskDetailTable table").html(table);
                $(".taskDetailPop").children().show();
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
                            url:'/mgr/log/_detail',
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
                                table+="<td width='28%'>时间</td>";
                                table+="<td width='30%'>威胁来源</td>";
                                table+="<td width='30%'>病毒</td>";
                                
                                table+="<td width='10%'>状态</td>";
                                table+="</tr>";
                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].file_path))+">"+safeStr(path(list[i].file_path))+"</span></td>";
                                    if(isbehavior!=="恶意行为监控"){
                                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].virus_name))+"("+safeStr(pathtitle(list[i].virus_id))+")"+">"+safeStr(list[i].virus_name)+"</span></td>";
                                    }else{
                                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].virus_name))+">"+safeStr(list[i].virus_name)+"</span></td>";
                                    }
                                    
                                    if(list[i].result==0){
                                        table+="<td width='200'>处理失败</td>";
                                    }else if(list[i].result==1){
                                        table+="<td width='200'>处理失败</td>";
                                    }else if(list[i].result==2){
                                        table+="<td width='200'>已阻止</td>";
                                    }else if(list[i].result==3){
                                        table+="<td width='200'>已删除</td>";
                                    }else if(list[i].result==4){
                                        table+="<td width='200'>已清除</td>";
                                    }else if(list[i].result==5){
                                        table+="<td width='200'>已信任</td>";
                                    }else if(list[i].result==6){
                                        table+="<td width='200'>已忽略</td>";
                                    }
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
resizeTableHeight();
function resizeTableHeight(resize) {
    //调整页面内元素高度
    var mainlefth=parent.$("#iframe #mainFrame").height();
    if(resize){
        $(".main .table").css({height:mainlefth-387});
    }else{
        $(".main .table").css({height:mainlefth-347});
    }
}
// window.resizing=false;
// window.onresize = function(){
//     console.log(window.resizing);
//     if(!window.resizing) return false;
//     window.resizing=true;
//     resizeTableHeight();
// }
