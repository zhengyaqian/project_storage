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

document.cookie='page=netDefense.html';
//按钮样式

$(".bu").click(function(){
	$(this).addClass("current");
	$(this).siblings(".bu").removeClass("current");

});


//下拉列表
$("#groupSelect").change(function(){
    accEvent();
})
//类型选择
$("#functionBlock .bu").click(function(){
    if($(".filterBlock .tabButton option:checked").val()==0){
        if($("#functionBlock .current").index()==1){
            $("#selectVD1").show();
            $("#selectVD1").siblings("select").hide();
        }else if($("#functionBlock .current").index()==2){
            $("#selectVD2").show();
            $("#selectVD2").siblings("select").hide();
        }else if($("#functionBlock .current").index()==3){
            $("#selectVD3").show();
            $("#selectVD3").siblings("select").hide();
        }else if($("#functionBlock .current").index()==4){
            $("#selectVD4").show();
            $("#selectVD4").siblings("select").hide();
        }else if($("#functionBlock .current").index()==5){
            $("#selectVD5").show();
            $("#selectVD5").siblings("select").hide();
        }
    }else{
        $("#selectVT").show();
        $("#selectVT").siblings("select").hide();
    }
    $('.tableth th.th-ordery').removeClass().addClass('th-ordery');
	$('.main .tableth').removeAttr('index indexCls');
    accEvent();
})
// 搜索类型选择
$("#selectVD1,#selectVT,#selectVD2,#selectVD3,#selectVD4,#selectVD5").change(function(){
    accEvent();
})
// 搜索框键盘离开时
// $("#searchKey").keyup(function(){
//     accEvent();
// })
//选项卡选择
$(".filterBlock .tabButton").change(function(){
    if($(".filterBlock .tabButton option:checked").val()==0){
        if($("#functionBlock .current").index()==1){
            $("#selectVD1").show();
            $("#selectVD1").siblings("select").hide();
        }else if($("#functionBlock .current").index()==2){
            $("#selectVD2").show();
            $("#selectVD2").siblings("select").hide();
        }else if($("#functionBlock .current").index()==3){
            $("#selectVD3").show();
            $("#selectVD3").siblings("select").hide();
        }else if($("#functionBlock .current").index()==4){
            $("#selectVD4").show();
            $("#selectVD4").siblings("select").hide();
        }else{
            $("#selectVD5").show();
            $("#selectVD5").siblings("select").hide();
        }
    }else{
        $("#selectVT").show();
        $("#selectVT").siblings("select").hide();
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
        if($("#functionBlock .current").index()==1){
            if($("#selectVD1").val()=="0"){
                hostname=$("#searchKey").val();
            }else{
                threatname=$("#searchKey").val();
            }
        }else if($("#functionBlock .current").index()==2){
            if($("#selectVD2").val()=="0"){
                hostname=$("#searchKey").val();
            }else{
                threatname=$("#searchKey").val();
            }
        }else if($("#functionBlock .current").index()==3){
            if($("#selectVD3").val()=="0"){
                hostname=$("#searchKey").val();
            }else{
                threatname=$("#searchKey").val();
            }
        }else if($("#functionBlock .current").index()==4){
            if($("#selectVD4").val()=="0"){
                hostname=$("#searchKey").val();
            }else{
                threatname=$("#searchKey").val();
            }
        }else if($("#functionBlock .current").index()==5){
            if($("#selectVD5").val()=="0"){
                hostname=$("#searchKey").val();
            }else{
                threatname=$("#searchKey").val();
            }
        }
        
    }else{
        hostname=$("#searchKey").val();
    }
    
    var groupid=parseInt($("#groupSelect option:selected").attr("groupid"));
    if($(".filterBlock .tabButton option:checked").val()==1){
        groupby="client";

    }else{
        groupby="detail";
    }
	dataa={"fname":"","date":{"begin":begintime,"end":endtime},"groupby":groupby,"view":{"begin":start,"count":numperpage},"filter":{"threat_name":threatname,"hostname":hostname}}
    
 	if($("#functionBlock .current").index()==1){
    	dataa.fname = "intrusion";
    }else if($("#functionBlock .current").index()==2){
    	dataa.fname = "ipattack";
    }else if($("#functionBlock .current").index()==3 ){
    	dataa.fname = "malsite";
    }else if($("#functionBlock .current").index()==4){
    	dataa.fname = "ipblacklist";
    }else if($("#functionBlock .current").index()==5 ){
    	dataa.fname = "ipproto";
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
            if($(".filterBlock .tabButton option:checked").val()==1 && list!==null && $("#functionBlock .current").index()==1){
                tableth+="<tr>";
                tableth+="<th width='40%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='40%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='count'>黑客入侵记录数<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";
                
                table+="<tr id='tableAlign'>";
                table+="<td width='40%'>终端名称</td>";
                table+="<td width='40%'>终端分组</td>";
                table+="<td width='20%'>黑客入侵记录数</td>";
                table+="</tr>";
                
                for(i=0;i<list.length;i++){
                    table+="<tr client="+list[i].client_id+">";
                    table+="<td><span style='width:400px;' class='filePath' title="+safeStr(list[i].hostname)+">"+safeStr(list[i].hostname)+"</span></td>";
                    if(list[i].group_name==""){
                        table+="<td>(已删除终端)</td>";
                    }else{
                        table+="<td>"+safeStr(list[i].group_name)+"</td>";
                    }
                    
                    table+="<td><a class='underline cursor blackfont seeDetail'>"+list[i].count+"</a></td>";
                    table+="</tr>";
                }

            }else if($(".filterBlock .tabButton option:checked").val()==1 && list!==null && $("#functionBlock .current").index()==2){
                tableth+="<tr>";
                tableth+="<th width='40%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='40%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='count'>对外攻击数量<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";

                table+="<tr id='tableAlign'>";
                table+="<td width='40%'>终端名称</td>";
                table+="<td width='40%'>终端分组</td>";
                table+="<td width='20%'>对外攻击数量</td>";
                table+="</tr>";
                
                for(i=0;i<list.length;i++){
                    table+="<tr client="+list[i].client_id+">";
                    table+="<td><span style='width:400px;' class='filePath' title="+safeStr(list[i].hostname)+">"+safeStr(list[i].hostname)+"</span></td>";
                    if(list[i].group_name==""){
                        table+="<td>(已删除终端)</td>";
                    }else{
                        table+="<td>"+safeStr(list[i].group_name)+"</td>";
                    }
                    
                    table+="<td><a  class='underline cursor blackfont seeDetail'>"+list[i].count+"</a></td>";
                    table+="</tr>";
                }

            }else if($(".filterBlock .tabButton option:checked").val()==1 && list!==null && $("#functionBlock .current").index()==3){
                tableth+="<tr>";
                tableth+="<th width='40%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='40%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='count'>恶意网址拦截数量<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";
                
                table+="<tr id='tableAlign'>";
                table+="<td width='40%'>终端名称</td>";
                table+="<td width='40%'>终端分组</td>";
                table+="<td width='20%'>恶意网址拦截数量</td>";
                table+="</tr>";
                for(i=0;i<list.length;i++){
                   table+="<tr client="+list[i].client_id+">";
                    table+="<td><span style='width:400px;' class='filePath' title="+safeStr(list[i].hostname)+">"+safeStr(list[i].hostname)+"</span></td>";
                    if(list[i].group_name==""){
                       table+="<td>(已删除终端)</td>"; 
                    }else{
                        table+="<td>"+safeStr(list[i].group_name)+"</td>";
                    }
                    
                    table+="<td><a  class='underline cursor blackfont seeDetail'>"+list[i].count+"</a></td>";
                    table+="</tr>";
                }

            }else if($(".filterBlock .tabButton option:checked").val()==1 && list!==null && $("#functionBlock .current").index()==4){
                tableth+="<tr>";
                tableth+="<th width='40%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='40%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='count'>IP黑名单数目<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";
                
                table+="<tr id='tableAlign'>";
                table+="<td width='40%'>终端名称</td>";
                table+="<td width='40%'>终端分组</td>";
                table+="<td width='20%'>IP黑名单数目</td>";
                table+="</tr>";
                for(i=0;i<list.length;i++){
                   table+="<tr client="+list[i].client_id+">";
                    table+="<td><span style='width:400px;' class='filePath' title="+safeStr(list[i].hostname)+">"+safeStr(list[i].hostname)+"</span></td>";
                    if(list[i].group_name==""){
                       table+="<td>(已删除终端)</td>"; 
                    }else{
                        table+="<td>"+safeStr(list[i].group_name)+"</td>";
                    }
                    
                    table+="<td><a class='underline cursor blackfont seeDetail'>"+list[i].count+"</a></td>";
                    table+="</tr>";
                }

            }else if($(".filterBlock .tabButton option:checked").val()==1 && list!==null && $("#functionBlock .current").index()==5){
                tableth+="<tr>";
                 tableth+="<th width='40%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='40%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='count'>触犯控制规则数<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";
                
                table+="<tr id='tableAlign'>";
                table+="<td width='40%'>终端名称</td>";
                table+="<td width='40%'>终端分组</td>";
                table+="<td width='20%'>触犯控制规则数</td>";
                table+="</tr>";
                for(i=0;i<list.length;i++){
                   table+="<tr client="+list[i].client_id+">";
                    table+="<td><span style='width:400px;' class='filePath' title="+safeStr(list[i].hostname)+">"+safeStr(list[i].hostname)+"</span></td>";
                    if(list[i].group_name==""){
                       table+="<td>(已删除终端)</td>"; 
                    }else{
                        table+="<td>"+safeStr(list[i].group_name)+"</td>";
                    }
                    
                    table+="<td><a class='underline cursor blackfont seeDetail'>"+list[i].count+"</a></td>";
                    table+="</tr>";
                }

            }else if($(".filterBlock .tabButton option:checked").val()==1 && list==null && $("#functionBlock .current").index()==1){
                tableth+="<tr>";
                 tableth+="<th width='40%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='40%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='count'>黑客入侵记录数<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";

            }else if($(".filterBlock .tabButton option:checked").val()==1 && list==null && $("#functionBlock .current").index()==2){
                tableth+="<tr>";
                tableth+="<th width='40%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='40%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='count'>对外攻击数量<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";

            }else if($(".filterBlock .tabButton option:checked").val()==1 && list==null && $("#functionBlock .current").index()==3){
                tableth+="<tr>";
                 tableth+="<th width='40%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='40%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='count'>恶意网址拦截数量<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";

            }else if($(".filterBlock .tabButton option:checked").val()==1 && list==null && $("#functionBlock .current").index()==4){
                tableth+="<tr>";
                tableth+="<th width='40%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='40%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='count'>IP黑名单数目<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";

            }else if($(".filterBlock .tabButton option:checked").val()==1 && list==null && $("#functionBlock .current").index()==5){
                tableth+="<tr>";
                 tableth+="<th width='40%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='40%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='count'>触犯控制规则数<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";

            }else if($(".filterBlock .tabButton option:checked").val()==0 && list!==null && $("#functionBlock .current").index()==1){
                tableth+="<tr>";
                tableth+="<th width='12%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='name'>入侵类型<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='raddr'>远程地址<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='proc_path'>关联进程<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='10.5%' class='th-ordery' type='blocked'>状态<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";
                
                table+="<tr id='tableAlign'>";
                table+="<td width='12%'>时间</td>";
                table+="<td width='15.5%'>终端名称</td>";
                table+="<td width='15.5%'>终端分组</td>";
                table+="<td width='15.5%'>入侵类型</td>";
                table+="<td width='15.5%'>远程地址</td>";
                table+="<td width='15.5%'>关联进程</td>";
                table+="<td width='10.5%'>状态</th>";
                table+="</tr>";
                for(i=0;i<list.length;i++){
                    table+="<tr client="+list[i].client_id+">";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td><a onclick='seeDetailPop(this)' class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</a></td>";
                    if(list[i].group_name==""){
                       table+="<td><span class='filePath' title='(已删除终端)'>(已删除终端)</span></td>"; 
                   }else{
                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].group_name))+">"+safeStr(list[i].group_name)+"</span></td>";
                   }
                    
                    table+="<td><a  class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].name))+">"+safeStr(list[i].name)+"</a></td>";
                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].raddr))+">"+safeStr(list[i].raddr)+"</span></td>";
                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].proc_path))+">"+safeStr(path(list[i].proc_path))+"</span></td>";
                    if(list[i].blocked==true){
                        table+="<td>已阻止</td>"; 
                    }else{
                        table+="<td>已放过</td>";
                    }
                    
                    table+="</tr>";
                }

            }else if($(".filterBlock .tabButton option:checked").val()==0 && list!==null && $("#functionBlock .current").index()==2){
                tableth+="<tr>";
                tableth+="<th width='12%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='name'>入侵类型<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='raddr'>远程地址<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='proc_path'>关联进程<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='10.5%' class='th-ordery' type='blocked'>状态<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";
                
                table+="<tr id='tableAlign'>";
                table+="<td width='15%'>时间</td>";
                table+="<td width='17%'>终端名称</td>";
                table+="<td width='17%'>终端分组</td>";
                table+="<td width='17%'>远程地址</td>";
                table+="<td width='17%'>攻击类型</td>";
                table+="<td width='17%'>关联进程</td>";
                table+="<td width='17%'>状态</td>";
                table+="</tr>";
                
                for(i=0;i<list.length;i++){
                    table+="<tr client="+list[i].client_id+">";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td><a onclick='seeDetailPop(this)' class='underline cursor blackfont filePath' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</a></td>";
                    if(list[i].group_name=="已删除终端"){
                        table+="<td><span class='filePath' title='(已删除终端)'>(已删除终端)</span></td>";
                    }else{
                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].group_name))+">"+safeStr(list[i].group_name)+"</span></td>";
                    }
                    
                    switch (list[i].flood_type) {
                        case 0 : 
                        table+="<td><a class='underline cursor blackfont filePath seeDetail' title='SYN'>SYN</a></td>";
                        break
                        case 1 :
                        table+="<td><a class='underline cursor blackfont filePath seeDetail' title='UDP'>UDP</a></td>";
                        break
                        case 2 :
                        table+="<td><a class='underline cursor blackfont filePath seeDetail' title='ICMP'>ICMP</a></td>";
                        break
                    }
                    
                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].raddr))+">"+safeStr(list[i].raddr)+"</span></td>";
                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].proc_path))+">"+safeStr(path(list[i].proc_path))+"</span></td>";
                    table+="</tr>";
                }

            }else if($(".filterBlock .tabButton option:checked").val()==0 && list!==null && $("#functionBlock .current").index()==3){
                tableth+="<tr>";
                tableth+="<th width='12%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='22%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='22%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='22%' class='th-ordery' type='domain'>拦截网址<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='22%' class='th-ordery' type='class'>网址类型<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";
                
                table+="<tr id='tableAlign'>";
                table+="<td width='12%'>时间</td>";
                table+="<td width='22%'>终端名称</td>";
                table+="<td width='22%'>终端分组</td>";
                table+="<td width='22%'>拦截网址</td>";
                table+="<td width='22%'>网址类型</td>";
                table+="</tr>";
                for(i=0;i<list.length;i++){
                    table+="<tr client="+list[i].client_id+">";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td><a  class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</a></td>";
                    if(list[i].group_name==""){
                        table+="<td><span class='filePath' title='(已删除终端)'>(已删除终端)</span></td>";
                    }else{
                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].group_name))+">"+safeStr(list[i].group_name)+"</span></td>";
                    }
                    
                    table+="<td><a class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].domain))+">"+safeStr(list[i].domain)+"</a></td>";
                    if(list[i]['class']=="spy"){
                        table+="<td><span class='filePath' title='木马，盗号' site='spy'>木马，盗号</span></td>";
                    }else if(list[i]['class']=="phising"){
                        table+="<td><span class='filePath' title='钓鱼，仿冒' site='phising'>钓鱼，仿冒</span></td>";
                    }else if(list[i]['class']=="fraud"){
                        table+="<td><span class='filePath' title='虚假，欺诈' site='fraud'>虚假，欺诈</span></td>";
                    }
                    
                    table+="</tr>";
                }

            }else if($(".filterBlock .tabButton option:checked").val()==0 && list!==null && $("#functionBlock .current").index()==4){
                tableth+="<tr>";
                tableth+="<th width='12%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='raddr'>远程IP<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='memo'>备注<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='8%' class='th-ordery' type='blocked'>状态<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";
                
                table+="<tr id='tableAlign'>";
                table+="<td width='10%'>时间</td>";
                table+="<td width='20%'>终端名称</td>";
                table+="<td width='20%'>终端分组</td>";
                table+="<td width='20%'>远程IP</td>";
                table+="<td width='20%'>备注</td>";
                table+="<td width='8%'>状态</td>";
                table+="</tr>";
                for(i=0;i<list.length;i++){
                    table+="<tr client="+list[i].client_id+">";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td><a  class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</a></td>";
                    if(list[i].group_name==""){
                        table+="<td><span class='filePath' title='(已删除终端)'>(已删除终端)</span></td>";
                    }else{
                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].group_name))+">"+safeStr(list[i].group_name)+"</span></td>";
                    }
                    
                    table+="<td><a class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].raddr))+">"+safeStr(list[i].raddr)+"</a></td>";
                    if(list[i].memo==""){
                    	table+="<td><span class='filePath' title='-'>-</span></td>";
                    }else{
                    	table+="<td><span class='filePath' title="+list[i].memo+">"+list[i].memo+"</span></td>";
                    }
                    
                    if(list[i].blocked==true){
                    	table+="<td>已阻止</td>";
                    }else{
                    	table+="<td>已放过</td>";
                    }
                    
                    
                    table+="</tr>";
                }

            }else if($(".filterBlock .tabButton option:checked").val()==0 && list!==null && $("#functionBlock .current").index()==5){
                tableth+="<tr>";
                tableth+="<th width='12%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='name'>触犯规则名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='raddr'>触犯动作<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='8%' class='th-ordery' type='blocked'>状态<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";
                
                table+="<tr id='tableAlign'>";
                table+="<td width='12%'>时间</td>";
                table+="<td width='20%'>终端名称</td>";
                table+="<td width='20%'>终端分组</td>";
                table+="<td width='20%'>触犯规则名称</td>";
                table+="<td width='20%'>触犯动作</td>";
                table+="<td width='8%'>状态</td>";
                table+="</tr>";
                for(i=0;i<list.length;i++){
                    table+="<tr client="+list[i].client_id+">";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td><a  class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</a></td>";
                    if(list[i].group_name==""){
                        table+="<td><span class='filePath' title='(已删除终端)'>(已删除终端)</span></td>";
                    }else{
                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].group_name))+">"+safeStr(list[i].group_name)+"</span></td>";
                    }
                    
                    table+="<td><a class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].name))+">"+safeStr(list[i].name)+"</a></td>";
                    if(list[i].outbound==true){
                    	table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].raddr))+">联出"+safeStr(list[i].raddr)+"</span></td>";
                    }else{
                    	table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].raddr))+">联入"+safeStr(list[i].raddr)+"</span></td>";
                    }
                    
                    if(list[i].blocked==true){
                    	table+="<td>已阻止</td>";
                    }else{
                    	table+="<td>已放过</td>";
                    }
                    table+="</tr>";
                }

            }else if($(".filterBlock .tabButton option:checked").val()==0 && list==null && $("#functionBlock .current").index()==1){
                tableth+="<tr>";
                tableth+="<th width='12%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='name'>入侵类型<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='raddr'>远程地址<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='proc_path'>关联进程<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='10.5%' class='th-ordery' type='blocked'>状态<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";

            }else if($(".filterBlock .tabButton option:checked").val()==0 && list==null && $("#functionBlock .current").index()==2){
                tableth+="<tr>";
               tableth+="<th width='12%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='name'>入侵类型<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='raddr'>远程地址<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='15.5%' class='th-ordery' type='proc_path'>关联进程<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='10.5%' class='th-ordery' type='blocked'>状态<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";

            }else if($(".filterBlock .tabButton option:checked").val()==0 && list==null && $("#functionBlock .current").index()==3){
                tableth+="<tr>";
                 tableth+="<th width='12%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='22%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='22%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='22%' class='th-ordery' type='domain'>拦截网址<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='22%' class='th-ordery' type='class'>网址类型<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";

            }else if($(".filterBlock .tabButton option:checked").val()==0 && list==null && $("#functionBlock .current").index()==4){
                tableth+="<tr>";
               tableth+="<th width='12%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='raddr'>远程IP<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='memo'>备注<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='8%' class='th-ordery' type='blocked'>状态<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";

            }else if($(".filterBlock .tabButton option:checked").val()==0 && list==null && $("#functionBlock .current").index()==5){
                tableth+="<tr>";
                tableth+="<th width='12%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='name'>触犯规则名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='raddr'>触犯动作<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='8%' class='th-ordery' type='blocked'>状态<img src='images/th-ordery.png'/></th>";
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
			
            $(".clearfloat").remove();
            $(".tcdPageCode").remove();
            $(".totalPages").remove();
            $(".numperpage").remove();
            $(".main .tableContainer").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+data.data.view.total+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><a style='font-size:12px;float:right;line-height:54px;padding-right:20px;color:#6a6c6e' class='numperpage'>每页<input type='text' id='numperpageinput' value="+numperpage+" style='font-size:12px;width:40px;height:24px;margin:0 4px;vertical-align:middle;padding:0 10px;'>条</a><div class='clear clearfloat'></div>");
            var current = (dataa.view.begin/dataa.view.count) + 1;
            $(".tcdPageCode").createPage({
                pageCount:total,
                current:parseInt(current),
                backFn:function(pageIndex){
                    $(".table table").html("");

                    if($("#functionBlock .current").index()==1 && parseInt($("#groupSelect option:selected").attr("groupid"))==0){
                        dataa.fname = "intrusion";
                    }else if($("#functionBlock .current").index()==2 && parseInt($("#groupSelect option:selected").attr("groupid"))==0){
                       dataa.fname = "ipattack";
                    }else if($("#functionBlock .current").index()==3 && parseInt($("#groupSelect option:selected").attr("groupid"))==0){
                        dataa.fname = "malsite";
                    }else if($("#functionBlock .current").index()==4 && parseInt($("#groupSelect option:selected").attr("groupid"))==0){
                        dataa.fname = "ipblacklist";
                    }else if($("#functionBlock .current").index()==5 && parseInt($("#groupSelect option:selected").attr("groupid"))==0){
                        dataa.fname = "ipproto";
                    }

                    if($("#functionBlock .current").index()==1 && parseInt($("#groupSelect option:selected").attr("groupid"))!==0){
                   		dataa.fname = "intrusion";
                    }else if($("#functionBlock .current").index()==2 && parseInt($("#groupSelect option:selected").attr("groupid"))!==0){
                       dataa.fname = "ipattack";
                    }else if($("#functionBlock .current").index()==3 && parseInt($("#groupSelect option:selected").attr("groupid"))!==0){
                        dataa.fname = "malsite";
                    }else if($("#functionBlock .current").index()==4 && parseInt($("#groupSelect option:selected").attr("groupid"))!==0){
                        dataa.fname = "ipblacklist";
                    }else if($("#functionBlock .current").index()==5 && parseInt($("#groupSelect option:selected").attr("groupid"))!==0){
                        dataa.fname = "ipproto";
                    }
                    dataa.view.begin = (pageIndex - 1) * numperpage;
                    
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
                            var tableth="";
                            var table="";
                            var list=data.data.list;
                            table+="<table>";
                            if($(".filterBlock .tabButton option:checked").val()==1 && list!==null && $("#functionBlock .current").index()==1){
                                
                                table+="<tr id='tableAlign'>";
                                table+="<td width='40%'>终端名称</td>";
                                table+="<td width='40%'>终端分组</td>";
                                table+="<td width='20%'>黑客入侵记录数</td>";
                                table+="</tr>";
                                for(i=0;i<list.length;i++){
                                    table+="<tr client="+list[i].client_id+">";
                    				table+="<td><span style='width:400px;' class='filePath' title="+safeStr(list[i].hostname)+">"+safeStr(list[i].hostname)+"</span></td>";
                                    if(list[i].group_name==""){
                                        table+="<td>(已删除终端)</td>";
                                    }else{
                                        table+="<td>"+safeStr(list[i].group_name)+"</td>";
                                    }
                                    
                                    table+="<td><a  class='underline cursor blackfont seeDetail'>"+list[i].count+"</a></td>";
                                    table+="</tr>";
                                }

                            }else if($(".filterBlock .tabButton option:checked").val()==1 && list!==null && $("#functionBlock .current").index()==2){
                                table+="<tr id='tableAlign'>";
                                table+="<td width='40%'>终端名称</td>";
                                table+="<td width='40%'>终端分组</td>";
                                table+="<td width='20%'>对外攻击数量</td>";
                                table+="</tr>";
                                
                                for(i=0;i<list.length;i++){
                                    table+="<tr client="+list[i].client_id+">";
                    				table+="<td><span style='width:400px;' class='filePath' title="+safeStr(list[i].hostname)+">"+safeStr(list[i].hostname)+"</span></td>";
                                    if(list[i].group_name==""){
                                        table+="<td>(已删除终端)</td>";
                                    }else{
                                        table+="<td>"+safeStr(list[i].group_name)+"</td>";
                                    }
                                    
                                    table+="<td><a  class='underline cursor blackfont seeDetail'>"+list[i].count+"</a></td>";
                                    table+="</tr>";
                                }

                            }else if($(".filterBlock .tabButton option:checked").val()==1 && list!==null && $("#functionBlock .current").index()==3){
                                table+="<tr id='tableAlign'>";
                                table+="<td width='40%'>终端名称</td>";
                                table+="<td width='40%'>终端分组</td>";
                                table+="<td width='20%'>恶意网址拦截数量</td>";
                                table+="</tr>";
                                
                                for(i=0;i<list.length;i++){
                                    table+="<tr client="+list[i].client_id+">";
                    table+="<td><span style='width:400px;' class='filePath' title="+safeStr(list[i].hostname)+">"+safeStr(list[i].hostname)+"</span></td>";
                                    if(list[i].group_name==""){
                                       table+="<td>(已删除终端)</td>"; 
                                   }else{
                                    table+="<td>"+safeStr(list[i].group_name)+"</td>";
                                   }
                                    
                                    table+="<td><a  class='underline cursor blackfont seeDetail'>"+list[i].count+"</a></td>";
                                    table+="</tr>";
                                }

                            }else if($(".filterBlock .tabButton option:checked").val()==1 && list!==null && $("#functionBlock .current").index()==4){
                                table+="<tr id='tableAlign'>";
                                table+="<td width='40%'>终端名称</td>";
                                table+="<td width='40%'>终端分组</td>";
                                table+="<td width='20%'>IP黑名单数目</td>";
                                table+="</tr>";
                                
                                for(i=0;i<list.length;i++){
                                    table+="<tr client="+list[i].client_id+">";
                    table+="<td><span style='width:400px;' class='filePath' title="+safeStr(list[i].hostname)+">"+safeStr(list[i].hostname)+"</span></td>";
                                    if(list[i].group_name==""){
                                       table+="<td>(已删除终端)</td>"; 
                                   }else{
                                    table+="<td>"+safeStr(list[i].group_name)+"</td>";
                                   }
                                    
                                    table+="<td><a  class='underline cursor blackfont seeDetail'>"+list[i].count+"</a></td>";
                                    table+="</tr>";
                                }

                            }else if($(".filterBlock .tabButton option:checked").val()==1 && list!==null && $("#functionBlock .current").index()==5){
                                table+="<tr id='tableAlign'>";
                                table+="<td width='40%'>终端名称</td>";
                                table+="<td width='40%'>终端分组</td>";
                                table+="<td width='20%'>触犯控制规则数</td>";
                                table+="</tr>";
                                
                                for(i=0;i<list.length;i++){
                                    table+="<tr client="+list[i].client_id+">";
                    table+="<td><span style='width:400px;' class='filePath' title="+safeStr(list[i].hostname)+">"+safeStr(list[i].hostname)+"</span></td>";
                                    if(list[i].group_name==""){
                                       table+="<td>(已删除终端)</td>"; 
                                   }else{
                                    table+="<td>"+safeStr(list[i].group_name)+"</td>";
                                   }
                                    
                                    table+="<td><a  class='underline cursor blackfont seeDetail'>"+list[i].count+"</a></td>";
                                    table+="</tr>";
                                }

                            }else if($(".filterBlock .tabButton option:checked").val()==0 && list!==null && $("#functionBlock .current").index()==1){
                                
                                table+="<tr id='tableAlign'>";
                                table+="<td width='12%'>时间</td>";
                                table+="<td width='15.5%'>终端名称</td>";
                                table+="<td width='15.5%'>终端分组</td>";
                                table+="<td width='15.5%'>入侵类型</td>";
                                table+="<td width='15.5%'>远程地址</td>";
                                table+="<td width='15.5%'>关联进程</td>";
                                table+="<td width='10.5%'>状态</th>";
                                table+="</tr>";
                                for(i=0;i<list.length;i++){
                                    table+="<tr client="+list[i].client_id+">";
                                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                                    table+="<td><a class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</a></td>";
                                    if(list[i].group_name==""){
                                        table+="<td><span class='filePath' title='(已删除终端)'>(已删除终端)</span></td>";
                                    }else{
                                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].group_name))+">"+safeStr(list[i].group_name)+"</span></td>";
                                    }
                                    
                                    table+="<td><a  class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].name))+">"+safeStr(list[i].name)+"</a></td>";
                                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].raddr))+">"+safeStr(list[i].raddr)+"</span></td>";
                                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].proc_path))+">"+safeStr(path(list[i].proc_path))+"</span></td>";
                                    if(list[i].blocked==true){
                                        table+="<td>已阻止</td>"; 
                                    }else{
                                        table+="<td>已放过</td>";
                                    }
                                    
                                    table+="</tr>";
                                }

                            }else if($(".filterBlock .tabButton option:checked").val()==0 && list!==null && $("#functionBlock .current").index()==2){
                                
                                table+="<tr id='tableAlign'>";
                                table+="<td width='15%'>时间</td>";
                                table+="<td width='17%'>终端名称</td>";
                                table+="<td width='17%'>终端分组</td>";
                                table+="<td width='17%'>远程地址</td>";
                                table+="<td width='17%'>攻击类型</td>";
                                table+="<td width='17%'>关联进程</td>";
                                table+="</tr>";
                                
                                for(i=0;i<list.length;i++){
                                    table+="<tr client="+list[i].client_id+">";
                                    table+="<td>"+getLocalTime(list[i].time)+"</td>";
                                    table+="<td><a class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</a></td>";
                                    if(list[i].group_name==""){
                                        table+="<td><span class='filePath' title='(已删除终端)'>(已删除终端)</span></td>"; 
                                   }else{
                                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].group_name))+">"+safeStr(list[i].group_name)+"</span></td>";
                                   }
                                    
                                    switch (list[i].flood_type) {
                                        case 0 : 
                                        table+="<td><a class='underline cursor blackfont filePath seeDetail' title='SYN'>SYN</a></td>";
                                        break
                                        case 1 :
                                        table+="<td><a class='underline cursor blackfont filePath seeDetail' title='UDP'>UDP</a></td>";
                                        break
                                        case 2 :
                                        table+="<td><a class='underline cursor blackfont filePath seeDetail' title='ICMP'>ICMP</a></td>";
                                        break
                                    }
                                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].raddr))+">"+safeStr(list[i].raddr)+"</span></td>";
                                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].proc_path))+">"+safeStr(path(list[i].proc_path))+"</span></td>";
                                    table+="</tr>";
                                }

                            }else if($(".filterBlock .tabButton option:checked").val()==0 && list!==null && $("#functionBlock .current").index()==3){
                                table+="<tr id='tableAlign'>";
                                table+="<td width='12%'>时间</td>";
                                table+="<td width='22%'>终端名称</td>";
                                table+="<td width='22%'>终端分组</td>";
                                table+="<td width='22%'>拦截网址</td>";
                                table+="<td width='22%'>网址类型</td>";
                                table+="</tr>";
                                for(i=0;i<list.length;i++){
                                    table+="<tr client="+list[i].client_id+">";
                                    table+="<td>"+getLocalTime(list[i].time)+"</td>";
                                    table+="<td><a  class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</a></td>";
                                    if(list[i].group_name==""){
                                        table+="<td><span class='filePath' title='(已删除终端)'>(已删除终端)</span></td>";
                                    }else{
                                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].group_name))+">"+safeStr(list[i].group_name)+"</span></td>";
                                    }
                                    
                                    table+="<td><a class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].domain))+">"+safeStr(list[i].domain)+"</a></td>";
                                    if(list[i]['class']=="spy"){
                                        table+="<td><span class='filePath' title='木马，盗号' site='spy'>木马，盗号</span></td>";
                                    }else if(list[i]['class']=="phising"){
                                        table+="<td><span class='filePath' title='钓鱼，仿冒' site='phising'>钓鱼，仿冒</span></td>";
                                    }else if(list[i]['class']=="fraud"){
                                        table+="<td><span class='filePath' title='虚假，欺诈' site='fraud'>虚假，欺诈</span></td>";
                                    }
                                    table+="</tr>";
                                }

                            }else if($(".filterBlock .tabButton option:checked").val()==0 && list!==null && $("#functionBlock .current").index()==4){
                                table+="<tr id='tableAlign'>";
                                table+="<td width='12%'>时间</td>";
                                table+="<td width='20%'>终端名称</td>";
                                table+="<td width='20%'>终端分组</td>";
                                table+="<td width='20%'>远程IP</td>";
                                table+="<td width='20%'>备注</td>";
                                table+="<td width='8'>状态</td>";
                                table+="</tr>";
                                for(i=0;i<list.length;i++){
                                    table+="<tr client="+list[i].client_id+">";
				                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
				                    table+="<td><a class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</a></td>";
				                    if(list[i].group_name==""){
				                        table+="<td><span class='filePath' title='(已删除终端)'>(已删除终端)</span></td>";
				                    }else{
				                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].group_name))+">"+safeStr(list[i].group_name)+"</span></td>";
				                    }
				                    
				                    table+="<td><a  class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].raddr))+">"+safeStr(list[i].raddr)+"</a></td>";
				                    if(list[i].memo==""){
				                    	table+="<td><span class='filePath' title='-'>-</span></td>";
				                    }else{
				                    	table+="<td><span class='filePath' title="+list[i].memo+">"+list[i].memo+"</span></td>";
				                    }
				                    
				                    if(list[i].blocked==true){
				                    	table+="<td>已阻止</td>";
				                    }else{
				                    	table+="<td>已放过</td>";
				                    }
				                    
				                    
				                    table+="</tr>";
                                }

                            }else if($(".filterBlock .tabButton option:checked").val()==0 && list!==null && $("#functionBlock .current").index()==5){
                                table+="<tr id='tableAlign'>";
                                table+="<td width='12%'>时间</td>";
                                table+="<td width='20%'>终端名称</td>";
                                table+="<td width='20%'>终端分组</td>";
                                table+="<td width='20%'>触犯规则名称</td>";
                                table+="<td width='20%'>触犯动作</td>";
                                table+="<td width='8%'>状态</td>";
                                table+="</tr>";
                                for(i=0;i<list.length;i++){
				                    table+="<tr client="+list[i].client_id+">";
				                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
				                    table+="<td><a class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</a></td>";
				                    if(list[i].group_name==""){
				                        table+="<td><span class='filePath' title='(已删除终端)'>(已删除终端)</span></td>";
				                    }else{
				                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].group_name))+">"+safeStr(list[i].group_name)+"</span></td>";
				                    }
				                    
				                    table+="<td><a  class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].name))+">"+safeStr(list[i].name)+"</a></td>";
				                    if(list[i].outbound==true){
				                    	table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].raddr))+">联出"+safeStr(list[i].raddr)+"</span></td>";
				                    }else{
				                    	table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].raddr))+">联入"+safeStr(list[i].raddr)+"</span></td>";
				                    }
				                    
				                    if(list[i].blocked==true){
				                    	table+="<td>已阻止</td>";
				                    }else{
				                    	table+="<td>已放过</td>";
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
var clientid="";
var totalnum="";
var name="";
var threatnamee="";
var threatclass="";
var clientorname="";
var ajaxdetailtable=null;
function seeDetailPop(start){
    if(ajaxdetailtable){
        ajaxdetailtable.abort();
    }
 
    var begintime=getBeginTimes($("#txtBeginDate").val());
    var endtime=getEndTimes($("#txtEndDate").val());
    if(start == undefined) {
		start = 0;
	}else{
		start = start;
	}
    var trIndex = $(".taskDetailPop").attr('trIndex');
    var tdIndex=$(".taskDetailPop").attr('tdIndex');
    $(".taskDetailPop").children(":not(:first)").hide();
    $(".taskDetailPop").append("<div style='text-align:center;color:#6a6c6e;padding-top:201px;' class='detailLoading'><img src='images/loading.gif'></div>");
    if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==1 && parseInt(tdIndex)==1){
        clientorname=1;
        clientid=parseInt($('.tableContainer .table tr').eq(trIndex).attr("client"));
        var groupname=$('.tableContainer .table tr').eq(trIndex).children("td").eq(2).find("span").html();
        var hostname=$('.tableContainer .table tr').eq(trIndex).children("td").eq(1).find("a").html();
        var dataa={"fname":"intrusion","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        
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
        
        $(".taskDetailPop .title font").html("黑客入侵拦截");
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  终端分组 : "+groupname);
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
                th+="<th width='21%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='21%' class='th-ordery' type='raddr'>远程地址<img src='images/th-ordery.png'/></th>";
                th+="<th width='21%' class='th-ordery' type='proc_path'>关联进程<img src='images/th-ordery.png'/></th>";
                th+="<th width='21%' class='th-ordery' type='name'>入侵类型<img src='images/th-ordery.png'/></th>";
                th+="<th width='16%' class='th-ordery' type='blocked'>状态<img src='images/th-ordery.png'/></th>";
                $(".taskDetailPop .tableth table tr").html(th);

                table+="<tr id='tableAlign'>";
                table+="<td width='21%'>时间</td>";
                table+="<td width='21%'>远程地址</td>";
                table+="<td width='21%'>关联进程</td>";
                table+="<td width='21%'>入侵类型</td>";
                table+="<td width='16%'>状态</td>";
                table+="</tr>";
                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td>"+safeStr(list[i].raddr)+"</td>";
                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].proc_path))+">"+safeStr(path(list[i].proc_path))+"</span></td>";
                    table+="<td><span class='filePath'>"+safeStr(list[i].name)+"</span></td>";
                    if(list[i].blocked==true){
                        table+="<td>已阻止</td>";  
                    }else{
                        table+="<td>已放过</td>";
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
                $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
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
                                table+="<td width='21%'>时间</td>";
                                table+="<td width='21%'>远程地址</td>";
                                table+="<td width='21%'>关联进程</td>";
                                table+="<td width='21%'>入侵类型</td>";
                                table+="<td width='16%'>状态</td>";
                                table+="</tr>";
                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                                    table+="<td>"+safeStr(list[i].raddr)+"</td>";
                                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].proc_path))+">"+safeStr(path(list[i].proc_path))+"</span></td>";
                                    table+="<td><span class='filePath'>"+safeStr(list[i].name)+"</span></td>";
                                    if(list[i].blocked==true){
                                        table+="<td>已阻止</td>";  
                                    }else{
                                        table+="<td>已放过</td>";
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
    }else if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==1 && parseInt(tdIndex)==3){
        clientorname=3;
        name=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(parseInt(tdIndex)).find('a').html();
        var dataa={"fname":"intrusion","date":{"begin":begintime,"end":endtime},"groupby":"event","filter":{"threat_name":name},"view":{"begin":start,"count":9}};
         
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
        
        $(".taskDetailPop .title font").html("黑客入侵拦截");
        $(".taskDetailPop .describe").html("入侵类型 : "+name);
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
                
                th+="<th width='30%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                $(".taskDetailPop .tableth table tr").html(th);

                table+="<tr id='tableAlign'>";
                table+="<td width='30%'>时间</td>";
                table+="<td width='30%'>终端名称</td>";
                table+="<td width='30%'>终端分组</td>";
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
                $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
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
                                table+="<td width='30%'>终端名称</td>";
                                table+="<td width='30%'>终端分组</td>";
                                table+="</tr>";

                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                                    table+="<td>"+safeStr(list[i].hostname)+"</td>";
                                    if(list[i].group_name==""){
                                        table+="<td>(已删除终端)</td>";
                                    }else{
                                        table+="<td>"+safeStr(list[i].group_name)+"</td>";
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
    }else if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==2 && parseInt(tdIndex)==1){
        clientorname=1;
        clientid=parseInt($('.tableContainer .table tr').eq(parseInt(trIndex)).attr("client"));
        var groupname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(2).find("span").html();
        var hostname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(1).find("a").html();
        var dataa={"fname":"ipattack","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        
        
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
        
        
        $(".taskDetailPop .title font").html("对外攻击");
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
                th+="<th width='21%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='21%' class='th-ordery' type='raddr'>远程地址<img src='images/th-ordery.png'/></th>";
                th+="<th width='21%' class='th-ordery' type='proc_path'>关联进程<img src='images/th-ordery.png'/></th>";
                th+="<th width='21%' class='th-ordery' type='name'>入侵类型<img src='images/th-ordery.png'/></th>";
                th+="<th width='16%' class='th-ordery' type='blocked'>状态<img src='images/th-ordery.png'/></th>";
                $(".taskDetailPop .tableth table tr").html(th);

                table+="<tr id='tableAlign'>";
                table+="<td width='21%'>时间</td>";
                table+="<td width='21%'>远程地址</td>";
                table+="<td width='21%'>关联进程</td>";
                table+="<td width='21%'>入侵类型</td>";
                table+="<td width='16%'>状态</td>";
                table+="</tr>";
                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td>"+safeStr(list[i].raddr)+"</td>";
                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].proc_path))+">"+safeStr(path(list[i].proc_path))+"</span></td>";
                    switch (list[i].flood_type) {
                        case 0 : 
                        table+="<td>SYN</td>";
                        break
                        case 1 :
                        table+="<td>UDP</td>";
                        break
                        case 2 :
                        table+="<td>ICMP</td>";
                        break
                    }
                    if(list[i].blocked==true){
                        table+="<td>已阻止</td>";  
                    }else{
                        table+="<td>已放过</td>";
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
                $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
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
                                table+="<td width='21%'>时间</td>";
                                table+="<td width='21%'>远程地址</td>";
                                table+="<td width='21%'>关联进程</td>";
                                table+="<td width='21%'>入侵类型</td>";
                                table+="<td width='16%'>状态</td>";
                                table+="</tr>";
                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                                    table+="<td>"+safeStr(list[i].raddr)+"</td>";
                                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].proc_path))+">"+safeStr(path(list[i].proc_path))+"</span></td>";
                                    switch (list[i].flood_type) {
                                        case 0 : 
                                        table+="<td>SYN</td>";
                                        break
                                        case 1 :
                                        table+="<td>UDP</td>";
                                        break
                                        case 2 :
                                        table+="<td>ICMP</td>";
                                        break
                                    }
                                    if(list[i].blocked==true){
                                        table+="<td>已阻止</td>";  
                                    }else{
                                        table+="<td>已放过</td>";
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
    }else if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==2 && parseInt(tdIndex)==3){
        clientorname=3;

        threatclassn=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(parseInt(tdIndex)).find('a').html();
        switch (threatclassn) {
            case 'SYN' : 
            threatclass=0;
            break
            case 'UDP' :
            threatclass=1;
            break
            case 'ICMP' :
            threatclass=2;
            break
        }
        var dataa={"fname":"ipattack","date":{"begin":begintime,"end":endtime},"groupby":"event","filter":{"threat_class":threatclass},"view":{"begin":start,"count":9}};
       
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
        
       $(".taskDetailPop .title font").html("对外攻击 - "+threatclassn);
        $(".taskDetailPop .describe").html("攻击类型 : "+threatclassn);
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
                th+="<th width='30%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                $(".taskDetailPop .tableth table tr").html(th);

                table+="<tr id='tableAlign'>";
                table+="<td width='30%'>时间</td>";
                table+="<td width='30%'>终端名称</td>";
                table+="<td width='30%'>终端分组</td>";
                table+="</tr>";
                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td><span class='filePath' title='"+safeStr(list[i].hostname)+"'>"+safeStr(list[i].hostname)+"</span></td>";
                    if(list[i].group_name==""){
                        table+="<td><span class='filePath'>(已删除终端)</span></td>";
                    }else{
                        table+="<td><span class='filePath'>"+safeStr(list[i].group_name)+"</span></td>";
                    }
                    table+="</tr>";
                }
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
                $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
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
                                table+="<td width='30%'>终端名称</td>";
                                table+="<td width='30%'>终端分组</td>";
                                table+="</tr>";
                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td><span class='filePath' title='"+safeStr(list[i].hostname)+"'>"+safeStr(list[i].hostname)+"</span></td>";
                                    if(list[i].group_name==""){
                                        table+="<td><span class='filePath'>(已删除终端)</span></td>";
                                    }else{
                                        table+="<td><span class='filePath'>"+safeStr(list[i].group_name)+"</span></td>";
                                    }
                                    table+="</tr>";
                                }
                                $(".taskDetailTable table").html(table);
                                $(".taskDetailPop").children().show();
                                $(".taskDetailPop").children(".detailLoading").remove();
                            }
                        })
                    }
                })
            }
        })
    }else if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==3 && parseInt(tdIndex)==1){
        clientorname=1;
        clientid=parseInt($('.tableContainer .table tr').eq(parseInt(trIndex)).attr("client"));
        var groupname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(2).find("span").html();
        var hostname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(1).find("a").html();
        var dataa={"fname":"malsite","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};

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
        $(".taskDetailPop .title font").html("恶意网站拦截");
        $(".taskDetailPop .describe").html("终端名称 :<a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  终端分组 : "+groupname);
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
                
                th+="<th width='30%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='domain'>拦截网站<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='class'>网站分类<img src='images/th-ordery.png'/></th>";
                $(".taskDetailPop .tableth table tr").html(th);

                table+="<tr id='tableAlign'>";
                table+="<td width='30%'>时间</td>";
                table+="<td width='30%'>拦截网站</td>";
                table+="<td width='30%'>网站分类</td>";
                
                table+="</tr>";
                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td>"+safeStr(list[i].domain)+"</td>";
                    if(list[i]['class']=="spy"){
                        table+="<td><span class='filePath' title='木马，盗号'>木马，盗号</span></td>";
                    }else if(list[i]['class']=="phising"){
                        table+="<td><span class='filePath' title='钓鱼，仿冒'>钓鱼，仿冒</span></td>";
                    }else if(list[i]['class']=="fraud"){
                        table+="<td><span class='filePath' title='虚假，欺诈'>虚假，欺诈</span></td>";
                    }
                    
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
                $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
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
                                table+="<td width='30%'>拦截网站</td>";
                                table+="<td width='30%'>网站分类</td>";
                                
                                table+="</tr>";
                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                                    table+="<td>"+safeStr(list[i].domain)+"</td>";
                                    if(list[i]['class']=="spy"){
                                        table+="<td><span class='filePath' title='木马，盗号'>木马，盗号</span></td>";
                                    }else if(list[i]['class']=="phising"){
                                        table+="<td><span class='filePath' title='钓鱼，仿冒'>钓鱼，仿冒</span></td>";
                                    }else if(list[i]['class']=="fraud"){
                                        table+="<td><span class='filePath' title='虚假，欺诈'>虚假，欺诈</span></td>";
                                    }
                                    
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
    }else if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==3 && parseInt(tdIndex)==3){
        clientorname=3;
        threatnamee=$('.tableContainer .table tr').eq(parseInt(trIndex)).find("td").eq(parseInt(tdIndex)).find('a').html();
        threatclass=$('.tableContainer .table tr').eq(parseInt(trIndex)).find("td").eq(4).find("span").attr("site");
        var dataa={"fname":"malsite","date":{"begin":begintime,"end":endtime},"groupby":"event","filter":{"threat_name":threatnamee,"threat_class":threatclass},"view":{"begin":start,"count":9}};
       
       
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
       $(".taskDetailPop .title font").html("恶意网站拦截");
        $(".taskDetailPop .describe").html("拦截网址 : "+threatnamee);
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

                th+="<th width='30%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                
                $(".taskDetailPop .tableth table tr").html(th);

                table+="<tr id='tableAlign'>";
                table+="<td width='30%'>时间</td>";
                table+="<td width='30%'>终端名称</td>";
                table+="<td width='30%'>终端分组</td>";
                
                table+="</tr>";
                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td><span class='filePath' title='"+safeStr(list[i].hostname)+"'>"+safeStr(list[i].hostname)+"</span></td>";
                    if(list[i].group_name==""){
                        table+="<td>(已删除终端)</td>"; 
                    }else{
                        table+="<td>"+safeStr(list[i].group_name)+"</td>";
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
			var current = (dataa.view.begin/dataa.view.count) + 1;
                
                $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
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
                                table+="<td width='30%'>终端名称</td>";
                                table+="<td width='30%'>终端分组</td>";
                                
                                table+="</tr>";
                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td><span class='filePath' title='"+safeStr(list[i].hostname)+"'>"+safeStr(list[i].hostname)+"</span></td>";
                                    if(list[i].group_name==""){
                                       table+="<td>(已删除终端)</td>"; 
                                   }else{
                                    table+="<td>"+safeStr(list[i].group_name)+"</td>";
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
    }else if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==4 && parseInt(tdIndex)==1){
        clientorname=1;
        clientid=parseInt($('.tableContainer .table tr').eq(parseInt(trIndex)).attr("client"));
        var groupname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(2).find("span").html();
        var hostname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(1).find("a").html();
        var dataa={"fname":"ipblacklist","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        
        
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
        $(".taskDetailPop .title font").html("IP黑名单");
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  终端分组 : "+groupname);
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
                
                th+="<th width='30%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='raddr'>远程IP<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='memo'>备注<img src='images/th-ordery.png'/></th>";
                th+="<th width='10%' class='th-ordery' type='blocked'>状态<img src='images/th-ordery.png'/></th>";
                $(".taskDetailPop .tableth table tr").html(th);

                table+="<tr id='tableAlign'>";
                table+="<td width='30%'>时间</td>";
                table+="<td width='30%'>远程IP</td>";
                table+="<td width='30%'>备注</td>";
                table+="<td width='10%'>状态</td>";
                
                table+="</tr>";
                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td>"+safeStr(list[i].raddr)+"</td>";
                    if(list[i].memo==""){
                    	table+="<td>-</td>";
                    }else{
                    	table+="<td>"+safeStr(list[i].memo)+"</td>";
                    }
                    
                    if(list[i].blocked==true){
                    	table+="<td>已阻止</td>";
                    }else{
                    	table+="<td>已放过</td>";
                    }
                    
                    
                    
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
                $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
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
                                table+="<td width='30%'>远程IP</td>";
                                table+="<td width='30%'>备注</td>";
                                table+="<td width='10%'>状态</td>";
                                table+="</tr>";
                                for (var i = 0; i < list.length; i++) {
				                    table+="<tr>";
				                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
				                    table+="<td>"+safeStr(list[i].raddr)+"</td>";
				                    if(list[i].memo==""){
				                    	table+="<td>-</td>";
				                    }else{
				                    	table+="<td>"+safeStr(list[i].memo)+"</td>";
				                    }
				                    if(list[i].blocked==true){
				                    	table+="<td>已阻止</td>";
				                    }else{
				                    	table+="<td>已放过</td>";
				                    }
				                    
				                    
				                    
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
    }else if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==4 && parseInt(tdIndex)==3){
        clientorname=3;
        threatnamee=$('.tableContainer .table tr').eq(parseInt(trIndex)).find('td').eq(parseInt(tdIndex)).html();
        threatclass=$('.tableContainer .table tr').eq(parseInt(trIndex)).find("td").eq(4).find("span").attr("site");
        var remark=$('.tableContainer .table tr').eq(parseInt(trIndex)).find("td").eq(4).find("span").html();
        var dataa={"fname":"ipblacklist","date":{"begin":begintime,"end":endtime},"groupby":"event","filter":{"threat_name":threatnamee,"threat_class":threatclass},"view":{"begin":start,"count":9}};
        
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
        
        $(".taskDetailPop .title font").html("IP黑名单");
        $(".taskDetailPop .describe").html("远程IP : "+threatnamee+" , 备注 : "+remark);
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

                th+="<th width='30%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                th+="<th width='10%' class='th-ordery' type='blocked'>状态<img src='images/th-ordery.png'/></th>";
                $(".taskDetailPop .tableth table tr").html(th);

                table+="<tr id='tableAlign'>";
                table+="<td width='30%'>时间</td>";
                table+="<td width='30%'>终端名称</td>";
                table+="<td width='30%'>终端分组</td>";
                table+="<td width='10%'>状态</td>";
                table+="</tr>";
                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td><span class='filePath' title='"+safeStr(list[i].hostname)+"'>"+safeStr(list[i].hostname)+"</span></td>";
                    if(list[i].group_name==""){
                        table+="<td>(已删除终端)</td>"; 
                    }else{
                        table+="<td>"+safeStr(list[i].group_name)+"</td>";
                    }
                    if(list[i].blocked==true){
                        table+="<td>已阻止</td>"; 
                    }else{
                        table+="<td>已放过</td>";
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
                $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
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
                                table+="<td width='30%'>终端名称</td>";
                                table+="<td width='30%'>终端分组</td>";
                                table+="<td width='10%'>状态</td>";
                                table+="</tr>";
                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td><span class='filePath' title='"+safeStr(list[i].hostname)+"'>"+safeStr(list[i].hostname)+"</span></td>";
                                    if(list[i].group_name==""){
                                       table+="<td>(已删除终端)</td>"; 
                                   }else{
                                    table+="<td>"+safeStr(list[i].group_name)+"</td>";
                                   }
									if(list[i].blocked==true){
									    table+="<td>已阻止</td>"; 
									}else{
									    table+="<td>已放过</td>";
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
    }else if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==5 && parseInt(tdIndex)==1){
        clientorname=1;
        clientid=parseInt($('.tableContainer .table tr').eq(parseInt(trIndex)).attr("client"));
        var groupname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(2).find("span").html();
        var hostname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(1).find("a").html();
        var dataa={"fname":"ipproto","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        
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
        $(".taskDetailPop .title font").html("IP协议控制");
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>终端分组 : "+groupname);
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
                
                th+="<th width='30%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='name'>触犯规则名称<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='raddr'>触犯动作<img src='images/th-ordery.png'/></th>";
                th+="<th width='10%' class='th-ordery' type='blocked'>状态<img src='images/th-ordery.png'/></th>";
                $(".taskDetailPop .tableth table tr").html(th);

                table+="<tr id='tableAlign'>";
                table+="<td width='30%'>时间</td>";
                table+="<td width='30%'>触犯规则名称</td>";
                table+="<td width='30%'>触犯动作</td>";
                table+="<td width='10%'>状态</td>";
                
                table+="</tr>";
                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td>"+safeStr(list[i].name)+"</td>";
                    if(list[i].outbound==true){
                    	table+="<td>联出"+safeStr(list[i].raddr)+"</td>";
                    }else{
                    	table+="<td>联入"+safeStr(list[i].raddr)+"</td>";
                    }
                    
                    if(list[i].blocked==true){
                    	table+="<td>已阻止</td>";
                    }else{
                    	table+="<td>已放过</td>";
                    }
                    
                };
                $(".taskDetailTable table").html(table);
                $(".taskDetailPop").children().show();
                $(".taskDetailPop").children(".detailLoading").remove();
                // 分页
                $(".taskDetailPop .clearfloat").remove();
                $(".taskDetailPop .tcdPageCode").remove();
                $(".taskDetailPop .totalPages").remove();
                var thIndex=$('.taskDetailPop .tableth').attr('index');
				var thCls=$('.taskDetailPop .tableth').attr('indexCls');
				$('.taskDetailPop .tableth th').eq(thIndex).addClass(thCls);
				imgOrderyFun1(thIndex,thCls)
                $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
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
                                table+="<td width='30%'>触犯规则名称</td>";
                                table+="<td width='30%'>触犯动作</td>";
                                table+="<td width='10%'>状态</td>";
                                table+="</tr>";
                                for (var i = 0; i < list.length; i++) {
				                    table+="<tr>";
				                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
				                    table+="<td>"+safeStr(list[i].name)+"</td>";
				                   if(list[i].outbound==true){
				                    	table+="<td>联出"+safeStr(list[i].raddr)+"</td>";
				                    }else{
				                    	table+="<td>联入"+safeStr(list[i].raddr)+"</td>";
				                    }
				                    if(list[i].blocked==true){
				                    	table+="<td>已阻止</td>";
				                    }else{
				                    	table+="<td>已放过</td>";
				                    }
				                    
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
    }else if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==5 && parseInt(tdIndex)==3){
        clientorname=3;
        threatnamee=$('.tableContainer .table tr').eq(parseInt(trIndex)).find('td').eq(parseInt(tdIndex)).find('a').html();
        threatclass=$('.tableContainer .table tr').eq(parseInt(trIndex)).find("td").eq(4).find("span").attr("site");
        var offendac=$('.tableContainer .table tr').eq(parseInt(trIndex)).find("td").eq(4).find("span").html();
        var dataa={"fname":"ipproto","date":{"begin":begintime,"end":endtime},"groupby":"event","filter":{"threat_name":threatnamee,"threat_class":threatclass},"view":{"begin":start,"count":9}};
        
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
        $(".taskDetailPop .title font").html("IP协议控制");
        $(".taskDetailPop .describe").html("规则名称 : "+threatnamee+" , 触犯动作 : "+offendac);
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

                th+="<th width='30%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                th+="<th width='10%' class='th-ordery' type='treatment'>状态<img src='images/th-ordery.png'/></th>";
                
                $(".taskDetailPop .tableth table tr").html(th);

                table+="<tr id='tableAlign'>";
                table+="<td width='30%'>时间</td>";
                table+="<td width='30%'>终端名称</td>";
                table+="<td width='30%'>终端分组</td>";
                table+="<td width='10%'>状态</td>";
                
                table+="</tr>";
                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td >"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td><span class='filePath' title='"+safeStr(list[i].hostname)+"'>"+safeStr(list[i].hostname)+"</span></td>";
                    if(list[i].group_name==""){
                        table+="<td>(已删除终端)</td>"; 
                    }else{
                        table+="<td>"+safeStr(list[i].group_name)+"</td>";
                    }
                    if(list[i].blocked==true){
                    	table+="<td>已阻止</td>"; 
                    }else{
                    	table+="<td>已放过</td>"; 
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
                $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
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
                                table+="<td width='30%'>终端名称</td>";
                                table+="<td width='30%'>终端分组</td>";
                                table+="<td width='10%'>状态</td>";
                                table+="</tr>";
                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td><span class='filePath' title='"+safeStr(list[i].hostname)+"'>"+safeStr(list[i].hostname)+"</span></td>";
                                    if(list[i].group_name==""){
                                       table+="<td>(已删除终端)</td>"; 
                                   }else{
                                    table+="<td>"+safeStr(list[i].group_name)+"</td>";
                                   }
                                    
                                   if(list[i].blocked==true){
				                    	table+="<td>已阻止</td>"; 
				                    }else{
				                    	table+="<td>已放过</td>"; 
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
    }else if($(".filterBlock .tabButton option:checked").val()==1 && $("#functionBlock .current").index()==1){
        var groupname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(1).html();
        var hostname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(0).find('span').html();
        clientid=parseInt($('.tableContainer .table tr').eq(parseInt(trIndex)).attr("client"));
        var dataa={"fname":"intrusion","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        
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
        $(".taskDetailPop .title font").html("黑客入侵拦截");
        $(".taskDetailPop .describe").html("终端名称 :<a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  终端分组 : "+groupname);
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
                
                
                th+="<th width='15%'  class='th-ordery' type='time'><span class='filePath'>时间</span><img src='images/th-ordery.png'/></th>";
                th+="<th width='14%'  class='th-ordery' type='raddr'><span class='filePath'>远程地址</span><img src='images/th-ordery.png'/></th>";
                th+="<th width='12%'  class='th-ordery' type='proc_path'><span class='filePath'>关联进程</span><img src='images/th-ordery.png'/></th>";
                th+="<th width='12%'  class='th-ordery' type='name'><span class='filePath'>入侵类型</span><img src='images/th-ordery.png'/></th>";
                th+="<th width='6%' class='th-ordery' type='status'>状态<img src='images/th-ordery.png'/></th>";
                $(".taskDetailPop .tableth table tr").html(th);

                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td width='15%'><span>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td width='14%'><span class='filePath' title="+safeStr(pathtitle(list[i].raddr))+">"+safeStr(list[i].raddr)+"</span></td>";
                    table+="<td width='12%'><span class='filePath' title="+safeStr(pathtitle(list[i].proc_path))+">"+safeStr(list[i].proc_path)+"</span></td>";
                    table+="<td width='12%'><span class='filePath' title="+safeStr(pathtitle(list[i].name))+">"+safeStr(list[i].name)+"</span></td>";
                    if(list[i].blocked==true){
                        table+="<td width='6%'>已阻止</td>";
                    }else{
                        table+="<td width='6%'>已放过</td>";
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
                $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
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

                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    table+="<td width='15%'><span>"+safeStr(getLocalTime(list[i].time))+"</td>";
                                    table+="<td width='14%'><span class='filePath' title="+safeStr(pathtitle(list[i].raddr))+">"+safeStr(list[i].raddr)+"</span></td>";
                                    table+="<td width='12%'><span class='filePath' title="+safeStr(pathtitle(list[i].proc_path))+">"+safeStr(list[i].proc_path)+"</span></td>";
                                    table+="<td width='12%'><span class='filePath' title="+safeStr(pathtitle(list[i].name))+">"+safeStr(list[i].name)+"</span></td>";
                                    
                                    if(list[i].blocked==true){
                                        table+="<td width='6%'>已阻止</td>";
                                    }else{
                                        table+="<td width='6%'>已放过</td>";
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
    }else if($(".filterBlock .tabButton option:checked").val()==1 && $("#functionBlock .current").index()==2){
    	
        var groupname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(1).html();
        var hostname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(0).find('span').html();
        clientid=parseInt($('.tableContainer .table tr').eq(parseInt(trIndex)).attr("client"));
        var dataa={"fname":"ipattack","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
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
        
        $(".taskDetailPop .title font").html("对外攻击检测");
        $(".taskDetailPop .describe").html("终端名称 :<a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  终端分组 : "+groupname);
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
                
                th+="<th width='300'><span class='filePath' class='th-ordery' type='time'>时间</span><img src='images/th-ordery.png'/></th>";
                th+="<th width='250'><span class='filePath' class='th-ordery' type='raddr'>远程地址</span><img src='images/th-ordery.png'/></th>";
                th+="<th width='250'><span class='filePath' class='th-ordery' type='proc_path'>关联进程</span><img src='images/th-ordery.png'/></th>";
                th+="<th width='250'><span class='filePath' class='th-ordery' type='flood_type'>攻击类型</span><img src='images/th-ordery.png'/></th>";
                $(".taskDetailPop .tableth table tr").html(th);

                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td width='380'>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td width='250'><span class='filePath'>"+safeStr(list[i].raddr)+"</span></td>";
                    table+="<td width='250'><span class='filePath'>"+safeStr(list[i].proc_path)+"</span></td>";
                    switch (list[i].flood_type) {
                        case 0 : 
                        table+="<td width='420'>SYN</td>";
                        break
                        case 1 :
                        table+="<td width='420'>UDP</td>";
                        break
                        case 2 :
                        table+="<td width='420'>ICMP</td>";
                        break
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
                $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
                var current = (dataa.view.begin/dataa.view.count) + 1;
                $(".taskDetailPop .tcdPageCode").createPage({
                    pageCount:total,
                    current:parseInt(current),
                    backFn:function(pageIndex){
                        start=(pageIndex-1)*9;
                        ataa.view.begin = start;
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

                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    table+="<td width='380'>"+safeStr(getLocalTime(list[i].time))+"</td>";
                                    table+="<td width='250'><span class='filePath'>"+safeStr(list[i].raddr)+"</span></td>";
                                    table+="<td width='250'><span class='filePath'>"+safeStr(list[i].proc_path)+"</span></td>";
                                    switch (list[i].flood_type) {
                                        case 0 : 
                                        table+="<td width='420'>SYN</td>";
                                        break
                                        case 1 :
                                        table+="<td width='420'>UDP</td>";
                                        break
                                        case 2 :
                                        table+="<td width='420'>ICMP</td>";
                                        break
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
    }else if($(".filterBlock .tabButton option:checked").val()==1 && $("#functionBlock .current").index()==3){
        var groupname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(1).html();
        var hostname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(0).find('span').html();
        clientid=parseInt($('.tableContainer .table tr').eq(parseInt(trIndex)).attr("client"));
        var dataa={"fname":"malsite","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        
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
        $(".taskDetailPop .title font").html("恶意网址拦截");
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  终端分组 : "+groupname);
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
                
                th+="<th width='30%'  class='th-ordery' type='time'><span class='filePath'>时间</span><img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='domain'><spanclass='filePath'>拦截网站</span><img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='class'><span class='filePath'>网站分类</span><img src='images/th-ordery.png'/></th>";
                
                $(".taskDetailPop .tableth table tr").html(th);

                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td width='30%'>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td width='30%'>"+safeStr(list[i].domain)+"</td>";
                    if(list[i]['class']=="spy"){
                        table+="<td width='30%'><span class='filePath' title='木马，盗号'>木马，盗号</span></td>";
                    }else if(list[i]['class']=="phising"){
                        table+="<td width='30%'><span class='filePath' title='钓鱼，仿冒'>钓鱼，仿冒</span></td>";
                    }else if(list[i]['class']=="fraud"){
                        table+="<td width='30%'><span class='filePath' title='虚假，欺诈'>虚假，欺诈</span></td>";
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
                $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
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

                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    table+="<td width='30%'>"+safeStr(getLocalTime(list[i].time))+"</td>";
                                    table+="<td width='30%'>"+safeStr(list[i].domain)+"</td>";
                                    if(list[i]['class']=="spy"){
                                        table+="<td width='30%'><span class='filePath' title='木马，盗号'>木马，盗号</span></td>";
                                    }else if(list[i]['class']=="phising"){
                                        table+="<td width='30%'><span class='filePath' title='钓鱼，仿冒'>钓鱼，仿冒</span></td>";
                                    }else if(list[i]['class']=="fraud"){
                                        table+="<td width='30%'><span class='filePath' title='虚假，欺诈'>虚假，欺诈</span></td>";
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
    }else if($(".filterBlock .tabButton option:checked").val()==1 && $("#functionBlock .current").index()==4){
        var groupname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(1).html();
        var hostname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(0).find('span').html();
        clientid=parseInt($('.tableContainer .table tr').eq(parseInt(trIndex)).attr("client"));
        var dataa={"fname":"ipblacklist","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
       
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
       
       $(".taskDetailPop .title font").html("IP黑名单");
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  , 终端分组 : "+groupname);
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
                
                th+="<th width='30%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='raddr'>远程IP<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='memo'>备注<img src='images/th-ordery.png'/></th>";
                th+="<th width='10%' class='th-ordery' type='blocked'>状态<img src='images/th-ordery.png'/></th>";
                $(".taskDetailPop .tableth table tr").html(th);

                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td width='30%'>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td width='30%'>"+safeStr(list[i].raddr)+"</td>";
                    if(list[i].memo==""){
                    	table+="<td width='30%'>-</td>";
                    }else{
                    	table+="<td width='30%'>"+safeStr(list[i].memo)+"</td>";
                    }
                    
                    if(list[i]['blocked']==true){
                        table+="<td width='10%'>已阻止</td>";
                    }else{
                    	table+="<td width='10%'>已放过</td>";
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
                $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
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

                                for (var i = 0; i < list.length; i++) {
				                    table+="<tr>";
				                    table+="<td width='30%'>"+safeStr(getLocalTime(list[i].time))+"</td>";
				                    table+="<td width='30%'>"+safeStr(list[i].raddr)+"</td>";
				                    if(list[i].memo==""){
				                    	table+="<td width='30%'>-</td>";
				                    }else{
				                    	table+="<td width='30%'>"+safeStr(list[i].memo)+"</td>";
				                    }
				                    if(list[i]['blocked']==true){
				                        table+="<td width='10%'>已阻止</td>";
				                    }else{
				                    	table+="<td width='10%'>已放过</td>";
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
    }else if($(".filterBlock .tabButton option:checked").val()==1 && $("#functionBlock .current").index()==5){
        var groupname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(1).html();
        var hostname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(0).find('span').html();
        clientid=parseInt($('.tableContainer .table tr').eq(parseInt(trIndex)).attr("client"));
        var dataa={"fname":"ipproto","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        
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
		
        $(".taskDetailPop .title font").html("IP协议控制");
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  终端分组 : "+groupname);
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
                
                th+="<th width='40%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='25%' class='th-ordery' type='raddr'>触犯规则名称<img src='images/th-ordery.png'/></th>";
                th+="<th width='25%' class='th-ordery' type='outbound'>触犯动作<img src='images/th-ordery.png'/></th>";
                th+="<th width='10%' class='th-ordery' type='blocked'>状态<img src='images/th-ordery.png'/></th>";
                $(".taskDetailPop .tableth table tr").html(th);
                table+="<tr id='tableAlign'>";
                table+="<td width='40%'>时间</span></td>";
                table+="<td width='25%'>触犯规则名称</span></td>";
                table+="<td width='25%'>触犯动作</span></td>";
                table+="<td width='10%'>状态</span></td>";
                table+="</tr>";
                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td>"+safeStr(list[i].name)+"</td>";
                    if(list[i].outbound==true){
                    	table+="<td>联出"+safeStr(list[i].raddr)+"</td>";
                    }else{
                    	table+="<td>联入"+safeStr(list[i].raddr)+"</td>";
                    }
                    
                    if(list[i].blocked==true){
                    	table+="<td>已阻止</td>"; 
                    }else{
                    	table+="<td>已放过</td>"; 
                    }
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
                $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+totalnum+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
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
				                table+="<td width='40%'>时间</span></td>";
				                table+="<td width='25%'>触犯规则名称</span></td>";
				                table+="<td width='25%'>触犯动作</span></td>";
				                table+="<td width='10%'>状态</span></td>";
				                table+="</tr>";
                                for (var i = 0; i < list.length; i++) {
				                    table+="<tr>";
				                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
				                    table+="<td>"+safeStr(list[i].name)+"</td>";
				                    if(list[i].outbound==true){
				                    	table+="<td>联出"+safeStr(list[i].raddr)+"</td>";
				                    }else{
				                    	table+="<td>联入"+safeStr(list[i].raddr)+"</td>";
				                    }
				                    
				                    if(list[i].blocked==true){
				                    	table+="<td>已阻止</td>"; 
				                    }else{
				                    	table+="<td>已放过</td>"; 
				                    }
				                    
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

//调整页面内元素高度
var mainlefth=parent.$("#iframe #mainFrame").height();

$(".main .table").css({height:mainlefth-347});

window.onresize = function(){
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .table").css({height:mainlefth-347});

}

