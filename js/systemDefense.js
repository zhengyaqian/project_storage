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

document.cookie='page=systemDefense.html';
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
    if($(".filterBlock .tabButton option:checked").val()==0){
        if($("#functionBlock .current").index()==1){
            $("#selectVD1").show();
            $("#selectVD1").siblings("select").hide();
        }else{
            $("#selectVD2").show();
            $("#selectVD2").siblings("select").hide();
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
$("#selectVD1,#selectVT,#selectVD2").change(function(){
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
        }else{
            $("#selectVD2").show();
            $("#selectVD2").siblings("select").hide();
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
    var currentPage = $(this).parents('.tableContainer').find('.tcdPageCode span.current').text();
	var currentNum = $(this).parents('.tableContainer').find('#numperpageinput').val();
	var start = (parseInt(currentPage) - 1) * parseInt(currentNum);
    accEvent(start);
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
        if($("#functionBlock .current").index()==1){
            if($("#selectVD1").val()=="0"){
                hostname=$("#searchKey").val();
            }else{
                threatname=$("#searchKey").val();
            }
        }else{
            if($("#selectVD2").val()=="0"){
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
        dataa.fname = "sysprot";
    }else if($("#functionBlock .current").index()==2){
    	dataa.fname = "instmon";
    }
    if(groupid!==0 && groupid){
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
            $(".table table").html("");
            
            table+="<table>";
            if($(".filterBlock .tabButton option:checked").val()==1 && list!==null && $("#functionBlock .current").index()==1){
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
                tableth+="<th width='20%' class='th-ordery' type='count'>拦截次数<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";
                table+="<tr id='tableAlign'>";
                table+="<td width='40%'>终端名称</td>";
                table+="<td width='40%'>终端分组</td>";
                table+="<td width='20%'>拦截次数</td>";
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
                tableth+="<th width='20%' class='th-ordery' type='count'>威胁数量<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";

            }else if($(".filterBlock .tabButton option:checked").val()==1 && list==null && $("#functionBlock .current").index()==2){
                tableth+="<tr>";
                tableth+="<th width='40%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='40%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='20%' class='th-ordery' type='count'>拦截次数<img src='images/th-ordery.png'/></th>";
                tableth+="</tr>";

            }else if($(".filterBlock .tabButton option:checked").val()==0 && list!==null && $("#functionBlock .current").index()==1){
                tableth+="<tr>";
                tableth+="<th width='14%'  class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='class'>保护类型<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='rule_name'>保护项目名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='10%' class='th-ordery' type='treatment'>状态<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='8%'>详情</th>";
                tableth+="</tr>";

                table+="<tr id='tableAlign'>";
                table+="<td width='14%'>时间</td>";
                table+="<td width='17%'>终端名称</td>";
                table+="<td width='17%'>终端分组</th>";
                table+="<td width='17%'>保护类型</td>";
                table+="<td width='17%'>保护项目名称</td>";
                table+="<td width='10%'>状态</td>";
                table+="<td width='8%'>详情</td>";
                table+="</tr>";
                
                for(i=0;i<list.length;i++){
                    table+="<tr client="+list[i].client_id+" tc="+list[i]['class']+">";
                    table+="<td>"+getLocalTime(list[i].time)+"</td>";
                    table+="<td><a  class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</a></td>";
                    if(list[i].group_name==""){
                        table+="<td><span class='filePath' title='(已删除终端)'>(已删除终端)</span></td>";
                    }else{
                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].group_name))+">"+safeStr(list[i].group_name)+"</span></td>";
                    }
                    
                    if(list[i]['class']==0){
                        table+="<td><a class='filePath'>文件保护规则</a></td>";
                    }else if(list[i]['class']==1){
                        table+="<td><a class='filePath'>注册表保护规则</a></td>";
                    }else if(list[i]['class']==2){
                        table+="<td><a class='filePath'>执行防护规则</a></td>";
                    }else if(list[i]['class']==3){
                        table+="<td><a class='filePath'>病毒免疫</a></td>";
                    }else if(list[i]['class']==4){
                        table+="<td><a class='filePath'>危险动作拦截</a></td>";
                    }else if(list[i]['class']==5){
                        table+="<td><a class='filePath'>进程保护</a></td>";
                    }
                    table+="<td><a  class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].rule_name))+"><font>"+safeStr(list[i].rule_name)+"</font></a></td>";

                    var treatment = list[i].treatment & 0x0FFFF;

                    switch (treatment) {
                        case 0:
                        table+="<td>已忽略</td>";
                        break;
                        case 1:
                        table+="<td>待处理</td>";
                        break;
                        case 2:
                        table+="<td>已处理</td>";
                        break;
                        case 3:
                        table+="<td>已阻止</td>";
                        break;
                        case 4:
                        table+="<td>已信任</td>";
                        break;
                        case 5:
                        table+="<td>已处理</td>";
                        break;
                    }
                    
                    
                    table+="<td class='relative'><a class='cursor underline blackfont' onclick='seeDetailFloat(this)'>详情</a>";
                    table+="<div class='detailFloat'>";
                    table+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span></h4>";
                    table+="<p>操作者:"+safeStr(list[i].proc_path)+"</p>";
                    table+="<p>命令行:"+safeStr(list[i].cmdline)+"</p>";
                    table+="<p>风险动作:"+safeStr(list[i].rule_name)+"</p>";
                    if(list[i]['class']==0){
                        table+="<p>目标文件:"+safeStr(list[i].res_path)+"</p>"; 
                    }
                    if(list[i]['class']==1){
                        table+="<p>目标注册表:"+safeStr(list[i].res_path)+"</p>"; 
                    }
                    if(list[i]['class']==2){
                        table+="<p>执行文件:"+safeStr(list[i].res_path)+"</p>";
                    }
                    if(list[i]['class']==3){
                        table+="<p>可疑文件:"+safeStr(list[i].res_path)+"</p>";
                    }
                    if((list[i].action&0x01)!== 0) {

                        table+="<p>操作类型 : 创建</p>";
                    }else if((list[i].action&0x02)!= 0){

                        table+="<p>操作类型 : 读取</p>";
                    }else if((list[i].action&0x04)!= 0){

                        table+="<p>操作类型 : 写入</p>";
                    }else if((list[i].action&0x08)!= 0){

                        table+="<p>操作类型 : 删除</p>";
                    }else if((list[i].action&0x10)!= 0){

                        table+="<p>操作类型 : 执行</p>";
                    }
                    if(list[i]['class']==1){
                        table+="<p>数据内容:"+safeStr(list[i].res_val)+"</p>";
                    }
                    
                    if((list[i].treatment & 0x0FFFF)==0){
                        table+="<p>状态:已忽略</p>";
                    }else if((list[i].treatment & 0x0FFFF)==1){
                        table+="<p>状态:待处理</p>";
                    }else if((list[i].treatment & 0x0FFFF)==2){
                        table+="<p>状态:已处理</p>";
                    }else if((list[i].treatment & 0x0FFFF)==3){
                        table+="<p>状态:已阻止</p>";
                    }else if((list[i].treatment & 0x0FFFF)==4){
                        table+="<p>状态:已信任</p>";
                    }else if((list[i].treatment & 0x0FFFF)==5){
                        table+="<p>状态:已处理</p>";
                    }
                    table+="</div>";
                    table+="</td>";
                    table+="</tr>";
                }

            }else if($(".filterBlock .tabButton option:checked").val()==0 && list!==null && $("#functionBlock .current").index()==2){
                tableth+="<tr>";
                tableth+="<th width='14%'  class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='software_name'>软件名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='10%' class='th-ordery' type='treatment'>状态<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='9%'>详情</th>";
                tableth+="</tr>";

                table+="<tr id='tableAlign'>";
                table+="<td width='14%'>时间</td>";
                table+="<td width='17%'>终端名称</td>";
                table+="<td width='17%'>终端分组</td>";
                table+="<td width='17%'>软件名称</td>";
                table+="<td width='10%'>状态</td>";
                table+="<td width='9%'>详情</td>";
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
                    
                    table+="<td><a  class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].software_name))+">"+safeStr(list[i].software_name)+"</a></td>";
                    if((list[i].treatment & 0x0FFFF)==0){
                        table+="<td>已忽略</td>";
                    }else if((list[i].treatment & 0x0FFFF)==1){
                        table+="<td>待处理</td>";
                    }else if((list[i].treatment & 0x0FFFF)==2){
                        table+="<td>已处理</td>";
                    }else if((list[i].treatment & 0x0FFFF)==3){
                        table+="<td>已阻止</td>";
                    }else if((list[i].treatment & 0x0FFFF)==4){
                        table+="<td>已信任</td>";
                    }else if((list[i].treatment & 0x0FFFF)==5){
                        table+="<td>已处理</td>";
                    }
                    table+="<td class='relative'><a class='cursor underline blackfont' onclick='seeDetailFloat(this)'>详情</a>";
                    table+="<div class='detailFloat'>";
                    table+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span></h4>";
                    table+="<p>操作者:"+safeStr(list[i].proc_path)+"</p>";
                    table+="<p>安装软件:"+safeStr(list[i].software_name)+"</p>";
                    table+="<p>软件路径:"+safeStr(list[i].file_path)+"</p>";
                    if((list[i].treatment & 0x0FFFF)==0){
                        table+="<p>状态:已忽略</p>";
                    }else if((list[i].treatment & 0x0FFFF)==1){
                        table+="<p>状态:待处理</p>";
                    }else if((list[i].treatment & 0x0FFFF)==2){
                        table+="<p>状态:已处理</p>";
                    }else if((list[i].treatment & 0x0FFFF)==3){
                        table+="<p>状态:已阻止</p>";
                    }else if((list[i].treatment & 0x0FFFF)==4){
                        table+="<p>状态:已信任</p>";
                    }else if((list[i].treatment & 0x0FFFF)==5){
                        table+="<p>状态:已处理</p>";
                    }
                    table+="</div>";
                    table+="</td>";
                    table+="</tr>";
                }

            }else if($(".filterBlock .tabButton option:checked").val()==0 && list==null && $("#functionBlock .current").index()==1){
                tableth+="<tr>";
                 tableth+="<th width='14%'  class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='class'>保护类型<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='rule_name'>保护项目名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='10%' class='th-ordery' type='treatment'>状态<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='450'>详情</th>";
                tableth+="</tr>";

            }else if($(".filterBlock .tabButton option:checked").val()==0 && list==null && $("#functionBlock .current").index()==2){
                tableth+="<tr>";
                tableth+="<th width='14%'  class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='17%' class='th-ordery' type='software_name'>软件名称<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='10%' class='th-ordery' type='treatment'>状态<img src='images/th-ordery.png'/></th>";
                tableth+="<th width='450'>详情</th>";
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
            $(".tableContainer").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+data.data.view.total+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><a style='font-size:12px;float:right;line-height:54px;padding-right:20px;color:#6a6c6e' class='numperpage'>每页<input type='text' id='numperpageinput' value="+numperpage+" style='font-size:12px;width:40px;height:24px;margin:0 4px;vertical-align:middle;padding:0 10px;'>条</a><div class='clear clearfloat'></div>");
	var current = (dataa.view.begin/dataa.view.count) + 1;
            
            $(".tcdPageCode").createPage({
                pageCount:total,
                current:parseInt(current),
                backFn:function(pageIndex){
                    if(ajaxtable){
                        ajaxtable.abort();
                    }
                    $(".table table").html("");
                    dataa.view.begin = (pageIndex - 1) * numperpage;
                    if($("#functionBlock .current").index()==1 && parseInt($("#groupSelect option:selected").attr("groupid"))==0){
                       dataa.fname = "sysprot";
                    }else if($("#functionBlock .current").index()==2 && parseInt($("#groupSelect option:selected").attr("groupid"))==0){
                        dataa.fname = "instmon";
                    }

                    if($("#functionBlock .current").index()==1 && parseInt($("#groupSelect option:selected").attr("groupid"))!==0){
                       dataa.fname = "sysprot";
                    }else if($("#functionBlock .current").index()==2 && parseInt($("#groupSelect option:selected").attr("groupid"))!==0){
                        dataa.fname = "instmon";
                    }
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
                            if($(".filterBlock .tabButton option:checked").val()==1 && $("#functionBlock .current").index()==1){
                                table+="<tr id='tableAlign'>";
                                table+="<td width='40%'>终端名称</td>";
                                table+="<td width='40%'>终端分组</td>";
                                table+="<td width='20%'>威胁数量</td>";
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

                            }else if($(".filterBlock .tabButton option:checked").val()==1 && $("#functionBlock .current").index()==2){
                                
                                table+="<tr id='tableAlign'>";
                                table+="<td width='40%'>终端名称</td>";
                                table+="<td width='40%'>终端分组</td>";
                                table+="<td width='20%'>拦截次数</td>";
                                table+="</tr>";
                                for(i=0;i<list.length;i++){
                                    table+="<tr>";
                    				table+="<td><span style='width:400px;' class='filePath' title="+safeStr(list[i].hostname)+">"+safeStr(list[i].hostname)+"</span></td>";
                                    if(list[i].group_name==""){
                                        table+="<td>已删除终端</td>"; 
                                   }else{
                                        table+="<td>"+safeStr(list[i].group_name)+"</td>";
                                   }
                                    
                                    table+="<td><a  class='underline cursor blackfont seeDetail'>"+list[i].count+"</a></td>";
                                    table+="</tr>";
                                }

                            }else if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==1){
                    
                            
                                table+="<tr id='tableAlign'>";
                                table+="<td width='14%'>时间</td>";
                                table+="<td width='17%'>终端名称</td>";
                                table+="<td width='17%'>终端分组</th>";
                                table+="<td width='17%'>保护类型</td>";
                                table+="<td width='17%'>保护项目名称</td>";
                                table+="<td width='10%'>状态</td>";
                                table+="<td width='8%'>详情</td>";
                                table+="</tr>";

                                for(i=0;i<list.length;i++){
                                    table+="<tr client="+list[i].client_id+" tc="+list[i]['class']+">";
                                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                                    table+="<td><a  class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</a></td>";
                                    if(list[i].group_name==""){
                                        table+="<td><span class='filePath' title='(已删除终端)'>(已删除终端)</span></td>";
                                    }else{
                                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].group_name))+">"+safeStr(list[i].group_name)+"</span></td>";
                                    }
                                    
                                    if(list[i]['class']==0){
                                        table+="<td><a class='filePath'>文件保护规则</a></td>";
                                    }else if(list[i]['class']==1){
                                        table+="<td><a class='filePath'>注册表保护规则</a></td>";
                                    }else if(list[i]['class']==2){
                                        table+="<td><a class='filePath'>执行防护规则</a></td>";
                                    }else if(list[i]['class']==3){
                                        table+="<td><a class='filePath'>病毒免疫</a></td>";
                                    }else if(list[i]['class']==4){
                                        table+="<td><a class='filePath'>危险动作拦截</a></td>";
                                    }else if(list[i]['class']==5){
                                        table+="<td><a class='filePath'>进程保护</a></td>";
                                    }
                                    table+="<td><a  class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].rule_name))+"><font>"+safeStr(list[i].rule_name)+"</font></a></td>";

                                    var treatment = list[i].treatment & 0x0FFFF;

                                    switch (treatment) {
                                        case 0:
                                        table+="<td>已忽略</td>";
                                        break;
                                        case 1:
                                        table+="<td>待处理</td>";
                                        break;
                                        case 2:
                                        table+="<td>已处理</td>";
                                        break;
                                        case 3:
                                        table+="<td>已阻止</td>";
                                        break;
                                        case 4:
                                        table+="<td>已信任</td>";
                                        break;
                                        case 5:
                                        table+="<td>已处理</td>";
                                        break;
                                    }
                                    
                                    
                                    table+="<td class='relative'><a class='cursor underline blackfont' onclick='seeDetailFloat(this)'>详情</a>";
                                    table+="<div class='detailFloat'>";
                                    table+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span></h4>";
                                    table+="<p>操作者:"+safeStr(list[i].proc_path)+"</p>";
                                    table+="<p>命令行:"+safeStr(list[i].cmdline)+"</p>";
                                    table+="<p>风险动作:"+safeStr(list[i].rule_name)+"</p>";
                                    if(list[i]['class']==0){
                                        table+="<p>目标文件:"+safeStr(list[i].res_path)+"</p>"; 
                                    }
                                    if(list[i]['class']==1){
                                        table+="<p>目标注册表:"+safeStr(list[i].res_path)+"</p>";
                                    }
                                    if(list[i]['class']==2){
                                        table+="<p>执行文件:"+safeStr(list[i].res_path)+"</p>";
                                    }
                                    if(list[i]['class']==3){
                                        table+="<p>可疑文件:"+safeStr(list[i].res_path)+"</p>";
                                    }
                                    if((list[i].action&0x01)!== 0) {

                                        table+="<p>操作类型 : 创建</p>";
                                    }else if((list[i].action&0x02)!= 0){

                                        table+="<p>操作类型 : 读取</p>";
                                    }else if((list[i].action&0x04)!= 0){

                                        table+="<p>操作类型 : 写入</p>";
                                    }else if((list[i].action&0x08)!= 0){

                                        table+="<p>操作类型 : 删除</p>";
                                    }else if((list[i].action&0x10)!= 0){

                                        table+="<p>操作类型 : 执行</p>";
                                    }
                                    if(list[i]['class']==1){
                                        table+="<p>数据内容:"+safeStr(list[i].res_val)+"</p>";
                                    }
                                    
                                    if((list[i].treatment & 0x0FFFF)==0){
                                        table+="<p>状态:已忽略</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==1){
                                        table+="<p>状态:待处理</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==2){
                                        table+="<p>状态:已处理</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==3){
                                        table+="<p>状态:已阻止</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==4){
                                        table+="<p>状态:已信任</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==5){
                                        table+="<p>状态:已处理</p>";
                                    }
                                    table+="</div>";
                                    table+="</td>";
                                    table+="</tr>";
                                }

                            }else if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==2){
                                
                                table+="<tr id='tableAlign'>";
                                table+="<td width='14%'>时间</td>";
                                table+="<td width='17%'>终端名称</td>";
                                table+="<td width='17%'>终端分组</td>";
                                table+="<td width='17%'>软件名称</td>";
                                table+="<td width='10%'>状态</td>";
                                table+="<td width='9%'>详情</td>";
                                table+="</tr>";
                                for(i=0;i<list.length;i++){
                                    table+="<tr client="+list[i].client_id+">";
                                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                                    table+="<td><a  class='underline cursor blackfont seeDetail' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</a></td>";
                                    if(list[i].group_name==""){
                                        table+="<td><span class='filePath' title='(已删除终端)'>(已删除终端)</span></td>";
                                    }else{
                                        table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].group_name))+">"+safeStr(list[i].group_name)+"</span></td>";
                                    }
                                    
                                    table+="<td><a  class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(list[i].software_name))+">"+safeStr(list[i].software_name)+"</a></td>";
                                    if((list[i].treatment & 0x0FFFF)==0){
                                        table+="<td>已忽略</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==1){
                                        table+="<td>待处理</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==2){
                                        table+="<td>已处理</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==3){
                                        table+="<td>已阻止</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==4){
                                        table+="<td>已信任</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==5){
                                        table+="<td>已处理</td>";
                                    }
                                    table+="<td class='relative'><a class='cursor underline blackfont' onclick='seeDetailFloat(this)'>详情</a>";
                                    table+="<div class='detailFloat'>";
                                    table+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span></h4>";
                                    table+="<p>操作者:"+safeStr(list[i].proc_path)+"</p>";
                                    table+="<p>安装软件:"+safeStr(list[i].software_name)+"</p>";
                                    table+="<p>软件路径:"+safeStr(list[i].file_path)+"</p>";
                                    if((list[i].treatment & 0x0FFFF)==0){
                                        table+="<p>状态:已忽略</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==1){
                                        table+="<p>状态:待处理</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==2){
                                        table+="<p>状态:已处理</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==3){
                                        table+="<p>状态:已阻止</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==4){
                                        table+="<p>状态:已信任</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==5){
                                        table+="<p>状态:已处理</p>";
                                    }
                                    
                                    table+="</div>";
                                    table+="</td>";
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

//按详情查看日志详情
function seeDetailFloat(a){
    $(".detailFloat").hide();
    $(a).next().show();
    if($(a).parents(".pop").attr("class")=="taskDetailPop pop"){
        
    }else{
        if($(a).parents("tr").index()>5){
            $(a).next(".detailFloat").css({
                top: 'auto',
                bottom: '14px'
            });
        }else{
            $(a).next(".detailFloat").css({
                bottom: 'auto',
                top: '64px'
            });
        }
    }
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
var threatclass="";
var threatnamee="";
var clientid="";
var totalnum="";
var clientorname="";
var ajaxdetailtable=null;
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
    var begintime=getBeginTimes($("#txtBeginDate").val());
    var endtime=getEndTimes($("#txtEndDate").val());
    $(".taskDetailPop").children(":not(:first)").hide();
    $(".taskDetailPop").append("<div style='text-align:center;color:#6a6c6e;padding-top:201px;' class='detailLoading'><img src='images/loading.gif'></div>");
    if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==1 && parseInt(tdIndex)==1){
        clientorname=1;
        
        
        
        var groupname=$('.tableContainer .table tr').eq(trIndex).children("td").eq(2).find("span").html();
        var hostname=$('.tableContainer .table tr').eq(trIndex).children("td").eq(1).find("a").html();
        clientid=parseInt($('.tableContainer .table tr').eq(trIndex).attr("client"));
        var dataa={"fname":"sysprot","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
       
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
		
       $(".taskDetailPop .title font").html("系统加固");
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

                
                th+="<th width='25%' class='th-ordery' type='time' >时间 <img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='proc_path'>操作者<img src='images/th-ordery.png'/></th>";
                th+="<th width='25%' class='th-ordery' type='rule_name'>保护项目<img src='images/th-ordery.png'/></th>";
                th+="<th width='10%' class='th-ordery' type='treatment'>状态<img src='images/th-ordery.png'/></th>";
                th+="<th width='10%'>详情</th>";

                $(".taskDetailPop .tableth table tr").html(th);
                
                table+="<tr id='tableAlign'>";
                
                table+="<td width='25%'>时间</td>";
                table+="<td width='30%'>操作者</td>";
                table+="<td width='25%'>保护项目</td>";
                table+="<td width='10%'>状态</td>";
                table+="<td width='10%'>详情</td>";
                table+="</tr>";
                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].proc_path))+">"+safeStr(path(list[i].proc_path))+"</span></td>";
                    if(list[i]['class']==0){
                        table+="<td width='25%'><span class='filePath' title=文件保护规则/"+safeStr(pathtitle(list[i].rule_name))+">文件保护规则/"+safeStr(list[i].rule_name)+"</span></td>";
                    }else if(list[i]['class']==1){
                        table+="<td width='25%'><span class='filePath' title=注册表保护规则/"+safeStr(pathtitle(list[i].rule_name))+">注册表保护规则/"+safeStr(list[i].rule_name)+"</span></td>";
                    }else if(list[i]['class']==2){
                        table+="<td width='25%'><span class='filePath' title=执行防护规则/"+safeStr(pathtitle(list[i].rule_name))+">执行防护规则/"+safeStr(list[i].rule_name)+"</span></td>";
                    }else if(list[i]['class']==3){
                        table+="<td width='25%'><span class='filePath' title=病毒免疫/"+safeStr(pathtitle(list[i].rule_name))+">病毒免疫/"+safeStr(list[i].rule_name)+"</span></td>";
                    }else if(list[i]['class']==4){
                        table+="<td width='25%'><span class='filePath' title=危险动作拦截/"+safeStr(pathtitle(list[i].rule_name))+">危险动作拦截/"+safeStr(list[i].rule_name)+"</span></td>";
                    }else if(list[i]['class']==5){
                        table+="<td width='25%'><span class='filePath' title=进程保护/"+safeStr(pathtitle(list[i].rule_name))+">进程保护/"+safeStr(list[i].rule_name)+"</span></td>";
                    }
                    if((list[i].treatment & 0x0FFFF)==0){
                        table+="<td>已忽略</td>";
                    }else if((list[i].treatment & 0x0FFFF)==1){
                        table+="<td>待处理</td>";
                    }else if((list[i].treatment & 0x0FFFF)==2){
                        table+="<td>已处理</td>";
                    }else if((list[i].treatment & 0x0FFFF)==3){
                        table+="<td>已阻止</td>";
                    }else if((list[i].treatment & 0x0FFFF)==4){
                        table+="<td>已信任</td>";
                    }else if((list[i].treatment & 0x0FFFF)==5){
                        table+="<td>已处理</td>";
                    }
                    table+="<td class='relative'><a class='cursor underline blackfont' onclick='seeDetailFloat(this)'>详情</a>";
                    table+="<div class='detailFloat'>";
                    table+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span></h4>";
                    table+="<p>操作者:"+safeStr(list[i].proc_path)+"</p>";
                    table+="<p>命令行:"+safeStr(list[i].cmdline)+"</p>";
                    table+="<p>风险动作:"+safeStr(list[i].rule_name)+"</p>";
                    if(list[i]['class']==0){
                        table+="<p>目标文件:"+safeStr(list[i].res_path)+"</p>"; 
                    }
                    if(list[i]['class']==1){
                       table+="<p>目标注册表:"+safeStr(list[i].res_path)+"</p>"; 
                    }
                    if(list[i]['class']==2){
                        table+="<p>执行文件:"+safeStr(list[i].res_path)+"</p>";
                    }
                    if(list[i]['class']==3){
                        table+="<p>可疑文件:"+safeStr(list[i].res_path)+"</p>";
                    }
                    if((list[i].action&0x01)!== 0) {

                        table+="<p>操作类型 : 创建</p>";
                    }else if((list[i].action&0x02)!= 0){

                        table+="<p>操作类型 : 读取</p>";
                    }else if((list[i].action&0x04)!= 0){

                        table+="<p>操作类型 : 写入</p>";
                    }else if((list[i].action&0x08)!= 0){

                        table+="<p>操作类型 : 删除</p>";
                    }else if((list[i].action&0x10)!= 0){

                        table+="<p>操作类型 : 执行</p>";
                    }
                    if(list[i]['class']==1){
                        table+="<p>数据内容:"+safeStr(list[i].res_val)+"</p>";
                    }
                    
                    if((list[i].treatment & 0x0FFFF)==0){
                        table+="<p>状态:已忽略</p>";
                    }else if((list[i].treatment & 0x0FFFF)==1){
                        table+="<p>状态:待处理</p>";
                    }else if((list[i].treatment & 0x0FFFF)==2){
                        table+="<p>状态:已处理</p>";
                    }else if((list[i].treatment & 0x0FFFF)==3){
                        table+="<p>状态:已阻止</p>";
                    }else if((list[i].treatment & 0x0FFFF)==4){
                        table+="<p>状态:已信任</p>";
                    }else if((list[i].treatment & 0x0FFFF)==5){
                        table+="<p>状态:已处理</p>";
                    }
                    table+="</div>";
                    table+="</td>";
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
                                
                                table+="<td width='25%'>时间</td>";
                                table+="<td width='30%'>操作者</td>";
                                table+="<td width='25%'>保护项目</td>";
                                table+="<td width='10%'>状态</td>";
                                table+="<td width='10%'>详情</td>";
                                table+="</tr>";
                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    
                                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                                    table+="<td><span class='filePath' title="+safeStr(pathtitle(list[i].proc_path))+">"+safeStr(path(list[i].proc_path))+"</span></td>";
                                    if(list[i]['class']==0){
                                        table+="<td width='25%'><span class='filePath' title=文件保护规则/"+safeStr(pathtitle(list[i].rule_name))+">文件保护规则/"+safeStr(list[i].rule_name)+"</span></td>";
                                    }else if(list[i]['class']==1){
                                        table+="<td width='25%'><span class='filePath' title=注册表保护规则/"+safeStr(pathtitle(list[i].rule_name))+">注册表保护规则/"+safeStr(list[i].rule_name)+"</span></td>";
                                    }else if(list[i]['class']==2){
                                        table+="<td width='25%'><span class='filePath' title=执行防护规则/"+safeStr(pathtitle(list[i].rule_name))+">执行防护规则/"+safeStr(list[i].rule_name)+"</span></td>";
                                    }else if(list[i]['class']==3){
                                        table+="<td width='25%'><span class='filePath' title=病毒免疫/"+safeStr(pathtitle(list[i].rule_name))+">病毒免疫/"+safeStr(list[i].rule_name)+"</span></td>";
                                    }else if(list[i]['class']==4){
                                        table+="<td width='25%'><span class='filePath' title=危险动作拦截/"+safeStr(pathtitle(list[i].rule_name))+">危险动作拦截/"+safeStr(list[i].rule_name)+"</span></td>";
                                    }else if(list[i]['class']==5){
                                        table+="<td width='25%'><span class='filePath' title=进程保护/"+safeStr(pathtitle(list[i].rule_name))+">进程保护/"+safeStr(list[i].rule_name)+"</span></td>";
                                    }
                                    if((list[i].treatment & 0x0FFFF)==0){
                                        table+="<td>已忽略</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==1){
                                        table+="<td>待处理</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==2){
                                        table+="<td>已处理</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==3){
                                        table+="<td>已阻止</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==4){
                                        table+="<td>已信任</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==5){
                                        table+="<td>已处理</td>";
                                    }
                                    table+="<td class='relative'><a class='cursor underline blackfont' onclick='seeDetailFloat(this)'>详情</a>";
                                    table+="<div class='detailFloat'>";
                                    table+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span></h4>";
                                    table+="<p>操作者:"+safeStr(list[i].proc_path)+"</p>";
                                    table+="<p>命令行:"+safeStr(list[i].cmdline)+"</p>";
                                    table+="<p>风险动作:"+safeStr(list[i].rule_name)+"</p>";
                                    if(list[i]['class']==0){
                                        table+="<p>目标文件:"+safeStr(list[i].res_path)+"</p>"; 
                                    }
                                    if(list[i]['class']==1){
                                       table+="<p>目标注册表:"+safeStr(list[i].res_path)+"</p>"; 
                                    }
                                    if(list[i]['class']==2){
                                        table+="<p>执行文件:"+safeStr(list[i].res_path)+"</p>";
                                    }
                                    if(list[i]['class']==3){
                                        table+="<p>可疑文件:"+safeStr(list[i].res_path)+"</p>";
                                    }
                                    if((list[i].action&0x01)!== 0) {

                                        table+="<p>操作类型 : 创建</p>";
                                    }else if((list[i].action&0x02)!= 0){

                                        table+="<p>操作类型 : 读取</p>";
                                    }else if((list[i].action&0x04)!= 0){

                                        table+="<p>操作类型 : 写入</p>";
                                    }else if((list[i].action&0x08)!= 0){

                                        table+="<p>操作类型 : 删除</p>";
                                    }else if((list[i].action&0x10)!= 0){

                                        table+="<p>操作类型 : 执行</p>";
                                    }
                                    if(list[i]['class']==1){
                                        table+="<p>数据内容:"+safeStr(list[i].res_val)+"</p>";
                                    }
                                    
                                    if((list[i].treatment & 0x0FFFF)==0){
                                        table+="<p>状态:已忽略</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==1){
                                        table+="<p>状态:待处理</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==2){
                                        table+="<p>状态:已处理</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==3){
                                        table+="<p>状态:已阻止</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==4){
                                        table+="<p>状态:已信任</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==5){
                                        table+="<p>状态:已处理</p>";
                                    }
                                    table+="</div>";
                                    table+="</td>";
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
    }else if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==1 && parseInt(tdIndex)==4){
        clientorname=3;
        threatnamee=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(4).find("font").html();
        threatclass=parseInt($('.tableContainer .table tr').eq(parseInt(trIndex)).attr("tc"));
        var classandname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(parseInt(tdIndex)).html();
        var dataa={"fname":"sysprot","date":{"begin":begintime,"end":endtime},"groupby":"event","filter":{"threat_name":threatnamee,"threat_class":threatclass},"view":{"begin":0,"count":9}};
        
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
        
        
        $(".taskDetailPop .title font").html("系统加固");
        $(".taskDetailPop .describe").html("保护类型 : "+$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(parseInt(tdIndex)).prev().children().html()+" , 保护项目 : "+classandname);
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

                th+="<th width='28%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='28%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                th+="<th width='28%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                th+="<th width='16%' class='th-ordery' type='treatment'>状态<img src='images/th-ordery.png'/></th>";
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
                       table+="<td width='250'>(已删除终端)</td>"; 
                   }else{
                    table+="<td>"+safeStr(list[i].group_name)+"</td>";
                   }
                    
                    
                    if((list[i].treatment & 0x0FFFF)==0){
                        table+="<td>已忽略</td>";
                    }else if((list[i].treatment & 0x0FFFF)==1){
                        table+="<td>待处理</td>";
                    }else if((list[i].treatment & 0x0FFFF)==2){
                        table+="<td>已处理</td>";
                    }else if((list[i].treatment & 0x0FFFF)==3){
                        table+="<td>已阻止</td>";
                    }else if((list[i].treatment & 0x0FFFF)==4){
                        table+="<td>已信任</td>";
                    }else if((list[i].treatment & 0x0FFFF)==5){
                        table+="<td>已处理</td>";
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
                                       table+="<td width='250'>(已删除终端)</td>"; 
                                   }else{
                                    table+="<td>"+safeStr(list[i].group_name)+"</td>";
                                   }
                                    
                                    if((list[i].treatment & 0x0FFFF)==0){
                                        table+="<td>已忽略</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==1){
                                        table+="<td>待处理</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==2){
                                        table+="<td>已处理</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==3){
                                        table+="<td>已阻止</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==4){
                                        table+="<td>已信任</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==5){
                                        table+="<td>已处理</td>";
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
        var groupname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(2).find("span").html();
        var hostname=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(1).find("a").html();
        clientid=parseInt($('.tableContainer .table tr').eq(parseInt(trIndex)).attr("client"));
        var dataa={"fname":"instmon","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":0,"count":9}};
       
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
       
       $(".taskDetailPop .title font").html("软件拦截");
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
                th+="<th width='52%' class='th-ordery' type='software_name'>软件名称<img src='images/th-ordery.png'/></th>";
                
                th+="<th width='8%' class='th-ordery' type='treatment'>状态<img src='images/th-ordery.png'/></th>";
                
                $(".taskDetailPop .tableth table tr").html(th);

                table+="<tr id='tableAlign'>";
                table+="<td width='40%'>时间</td>";
                table+="<td width='52%'>软件名称</td>";
                
                table+="<td width='8%'>状态</td>";
                table+="</tr>";
                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td>"+safeStr(list[i].software_name)+"</td>";
                    if((list[i].treatment & 0x0FFFF)==0){
                        table+="<td>已忽略</td>";
                    }else if((list[i].treatment & 0x0FFFF)==1){
                        table+="<td>待处理</td>";
                    }else if((list[i].treatment & 0x0FFFF)==2){
                        table+="<td>已处理</td>";
                    }else if((list[i].treatment & 0x0FFFF)==3){
                        table+="<td>已阻止</td>";
                    }else if((list[i].treatment & 0x0FFFF)==4){
                        table+="<td>已信任</td>";
                    }else if((list[i].treatment & 0x0FFFF)==5){
                        table+="<td>已处理</td>";
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
                                table+="<td width='40%'>时间</td>";
                                table+="<td width='52%'>软件名称</td>";
                                
                                table+="<td width='8%'>状态</td>";
                                table+="</tr>";
                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    table+="<td>"+safeStr(getLocalTime(list[i].time))+"</td>";
                                    table+="<td>"+safeStr(list[i].software_name)+"</td>";
                                    if((list[i].treatment & 0x0FFFF)==0){
                                        table+="<td>已忽略</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==1){
                                        table+="<td>待处理</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==2){
                                        table+="<td>已处理</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==3){
                                        table+="<td>已阻止</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==4){
                                        table+="<td>已信任</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==5){
                                        table+="<td>已处理</td>";
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

        threatnamee=$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(3).find('a').html();
        var dataa={"fname":"instmon","date":{"begin":begintime,"end":endtime},"groupby":"event","filter":{"threat_name":threatnamee},"view":{"begin":0,"count":9}};
       
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
       
       $(".taskDetailPop .title font").html("软件拦截");
        $(".taskDetailPop .describe").html("软件名称 : "+threatnamee);
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
                
                th+="<th width='28%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='28%' class='th-ordery' type='hostname'>终端名称<img src='images/th-ordery.png'/></th>";
                th+="<th width='28%' class='th-ordery' type='group_name'>终端分组<img src='images/th-ordery.png'/></th>";
                th+="<th width='16%' class='th-ordery' type='treatment'>状态<img src='images/th-ordery.png'/></th>";
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
                    
                    if((list[i].treatment & 0x0FFFF)==0){
                        table+="<td>已忽略</td>";
                    }else if((list[i].treatment & 0x0FFFF)==1){
                        table+="<td>待处理</td>";
                    }else if((list[i].treatment & 0x0FFFF)==2){
                        table+="<td>已处理</td>";
                    }else if((list[i].treatment & 0x0FFFF)==3){
                        table+="<td>已阻止</td>";
                    }else if((list[i].treatment & 0x0FFFF)==4){
                        table+="<td>已信任</td>";
                    }else if((list[i].treatment & 0x0FFFF)==5){
                        table+="<td>已处理</td>";
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
                                    
                                    if((list[i].treatment & 0x0FFFF)==0){
                                        table+="<td>已忽略</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==1){
                                        table+="<td>待处理</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==2){
                                        table+="<td>已处理</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==3){
                                        table+="<td>已阻止</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==4){
                                        table+="<td>已信任</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==5){
                                        table+="<td>已处理</td>";
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
        var dataa={"fname":"sysprot","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":0,"count":9}};
       
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
       
       
       $(".taskDetailPop .title font").html("系统加固");
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
                
                th+="<th width='25%' class='th-ordery' type='time'>时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='30%' class='th-ordery' type='proc_path'>操作者<img src='images/th-ordery.png'/></th>";
                th+="<th width='25%' class='th-ordery' type='rule_name'>保护项目<img src='images/th-ordery.png'/></th>";
                th+="<th width='10%' class='th-ordery' type='treatment'>状态<img src='images/th-ordery.png'/></th>";
                th+="<th width='10%'>详情</th>";
                $(".taskDetailPop .tableth table tr").html(th);

                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td width='25%'>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td width='30%'><span class='filePath' title="+safeStr(pathtitle(list[i].proc_path))+">"+safeStr(path(list[i].proc_path))+"</span></td>";
                    if(list[i]['class']==0){
                        table+="<td width='25%'><span class='filePath' title=文件保护规则/"+safeStr(pathtitle(list[i].rule_name))+">文件保护规则/"+safeStr(list[i].rule_name)+"</span></td>";
                    }else if(list[i]['class']==1){
                        table+="<td width='25%'><span class='filePath' title=注册表保护规则/"+safeStr(pathtitle(list[i].rule_name))+">注册表保护规则/"+safeStr(list[i].rule_name)+"</span></td>";
                    }else if(list[i]['class']==2){
                        table+="<td width='25%'><span class='filePath' title=执行防护规则/"+safeStr(pathtitle(list[i].rule_name))+">执行防护规则/"+safeStr(list[i].rule_name)+"</span></td>";
                    }else if(list[i]['class']==3){
                        table+="<td width='25%'><span class='filePath' title=病毒免疫/"+safeStr(pathtitle(list[i].rule_name))+">病毒免疫/"+safeStr(list[i].rule_name)+"</span></td>";
                    }else if(list[i]['class']==4){
                        table+="<td width='25%'><span class='filePath' title=危险动作拦截/"+safeStr(pathtitle(list[i].rule_name))+">危险动作拦截/"+safeStr(list[i].rule_name)+"</span></td>";
                    }else if(list[i]['class']==5){
                        table+="<td width='25%'><span class='filePath' title=进程保护/"+safeStr(pathtitle(list[i].rule_name))+">进程保护/"+safeStr(list[i].rule_name)+"</span></td>";
                    }
                    if((list[i].treatment & 0x0FFFF)==0){
                        table+="<td width='10%'>已忽略</td>";
                    }else if((list[i].treatment & 0x0FFFF)==1){
                        table+="<td width='10%'>待处理</td>";
                    }else if((list[i].treatment & 0x0FFFF)==2){
                        table+="<td width='10%'>已处理</td>";
                    }else if((list[i].treatment & 0x0FFFF)==3){
                        table+="<td width='10%'>已阻止</td>";
                    }else if((list[i].treatment & 0x0FFFF)==4){
                        table+="<td width='10%'>已信任</td>";
                    }else if((list[i].treatment & 0x0FFFF)==5){
                        table+="<td width='10%'>已处理</td>";
                    }
                    table+="<td class='relative' width='10%'><a class='cursor underline blackfont' onclick='seeDetailFloat(this)'>详情</a>";
                    table+="<div class='detailFloat'>";
                    table+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span></h4>";
                    table+="<p>操作者:"+safeStr(list[i].proc_path)+"</p>";
                    table+="<p>命令行:"+safeStr(list[i].cmdline)+"</p>";
                    table+="<p>风险动作:"+safeStr(list[i].rule_name)+"</p>";
                    if(list[i]['class']==0){
                        table+="<p>目标文件:"+safeStr(list[i].res_path)+"</p>"; 
                    }
                    if(list[i]['class']==1){
                        table+="<p>目标注册表:"+safeStr(list[i].res_path)+"</p>";
                    }
                    if(list[i]['class']==2){
                        table+="<p>执行文件:"+safeStr(list[i].res_path)+"</p>";
                    }
                    if(list[i]['class']==3){
                        table+="<p>可疑文件:"+safeStr(list[i].res_path)+"</p>";
                    }
                    if((list[i].action&0x01)!== 0) {

                        table+="<p>操作类型 : 创建</p>";
                    }else if((list[i].action&0x02)!= 0){

                        table+="<p>操作类型 : 读取</p>";
                    }else if((list[i].action&0x04)!= 0){

                        table+="<p>操作类型 : 写入</p>";
                    }else if((list[i].action&0x08)!= 0){

                        table+="<p>操作类型 : 删除</p>";
                    }else if((list[i].action&0x10)!= 0){

                        table+="<p>操作类型 : 执行</p>";
                    }
                    if(list[i]['class']==1){
                       table+="<p>数据内容:"+safeStr(list[i].res_val)+"</p>"; 
                    }
                    
                    if((list[i].treatment & 0x0FFFF)==0){
                        table+="<p>状态:已忽略</p>";
                    }else if((list[i].treatment & 0x0FFFF)==1){
                        table+="<p>状态:待处理</p>";
                    }else if((list[i].treatment & 0x0FFFF)==2){
                        table+="<p>状态:已处理</p>";
                    }else if((list[i].treatment & 0x0FFFF)==3){
                        table+="<p>状态:已阻止</p>";
                    }else if((list[i].treatment & 0x0FFFF)==4){
                        table+="<p>状态:已信任</p>";
                    }else if((list[i].treatment & 0x0FFFF)==5){
                        table+="<p>状态:已处理</p>";
                    }
                    table+="</div>";
                    table+="</td>";
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

                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    table+="<td width='25%'>"+safeStr(getLocalTime(list[i].time))+"</td>";
                                    table+="<td width='30%'><span class='filePath' title="+safeStr(pathtitle(list[i].proc_path))+">"+safeStr(path(list[i].proc_path))+"</span></td>";
                                    if(list[i]['class']==0){
                                        table+="<td width='25%'><span class='filePath' title=文件保护规则/"+safeStr(pathtitle(list[i].rule_name))+">文件保护规则/"+safeStr(list[i].rule_name)+"</span></td>";
                                    }else if(list[i]['class']==1){
                                        table+="<td width='25%'><span class='filePath' title=注册表保护规则/"+safeStr(pathtitle(list[i].rule_name))+">注册表保护规则/"+safeStr(list[i].rule_name)+"</span></td>";
                                    }else if(list[i]['class']==2){
                                        table+="<td width='25%'><span class='filePath' title=执行防护规则/"+safeStr(pathtitle(list[i].rule_name))+">执行防护规则/"+safeStr(list[i].rule_name)+"</span></td>";
                                    }else if(list[i]['class']==3){
                                        table+="<td width='25%'><span class='filePath' title=病毒免疫/"+safeStr(pathtitle(list[i].rule_name))+">病毒免疫/"+safeStr(list[i].rule_name)+"</span></td>";
                                    }else if(list[i]['class']==4){
                                        table+="<td width='25%'><span class='filePath' title=危险动作拦截/"+safeStr(pathtitle(list[i].rule_name))+">危险动作拦截/"+safeStr(list[i].rule_name)+"</span></td>";
                                    }else if(list[i]['class']==5){
                                        table+="<td width='25%'><span class='filePath' title=进程保护/"+safeStr(pathtitle(list[i].rule_name))+">进程保护/"+safeStr(list[i].rule_name)+"</span></td>";
                                    }
                                    if((list[i].treatment & 0x0FFFF)==0){
                                        table+="<td width='10%'>已忽略</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==1){
                                        table+="<td width='10%'>待处理</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==2){
                                        table+="<td width='10%'>已处理</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==3){
                                        table+="<td width='10%'>已阻止</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==4){
                                        table+="<td width='10%'>已信任</td>";
                                    }else if((list[i].treatment & 0x0FFFF)==5){
                                        table+="<td width='10%'>已处理</td>";
                                    }
                                    table+="<td class='relative' width='10%'><a class='cursor underline blackfont' onclick='seeDetailFloat(this)'>详情</a>";
                                    table+="<div class='detailFloat'>";
                                    table+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span></h4>";
                                    table+="<p>操作者:"+safeStr(list[i].proc_path)+"</p>";
                                    table+="<p>命令行:"+safeStr(list[i].cmdline)+"</p>";
                                    table+="<p>风险动作:"+safeStr(list[i].rule_name)+"</p>";
                                    if(list[i]['class']==0){
                                        table+="<p>目标文件:"+safeStr(list[i].res_path)+"</p>"; 
                                    }
                                    if(list[i]['class']==1){
                                        table+="<p>目标注册表:"+safeStr(list[i].res_path)+"</p>";
                                    }
                                    if(list[i]['class']==2){
                                        table+="<p>执行文件:"+safeStr(list[i].res_path)+"</p>";
                                    }
                                    if(list[i]['class']==3){
                                        table+="<p>可疑文件:"+safeStr(list[i].res_path)+"</p>";
                                    }
                                    if((list[i].action&0x01)!== 0) {

                                        table+="<p>操作类型 : 创建</p>";
                                    }else if((list[i].action&0x02)!= 0){

                                        table+="<p>操作类型 : 读取</p>";
                                    }else if((list[i].action&0x04)!= 0){

                                        table+="<p>操作类型 : 写入</p>";
                                    }else if((list[i].action&0x08)!= 0){

                                        table+="<p>操作类型 : 删除</p>";
                                    }else if((list[i].action&0x10)!= 0){

                                        table+="<p>操作类型 : 执行</p>";
                                    }
                                    if(list[i]['class']==1){
                                       table+="<p>数据内容:"+safeStr(list[i].res_val)+"</p>"; 
                                    }
                                    
                                    if((list[i].treatment & 0x0FFFF)==0){
                                        table+="<p>状态:已忽略</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==1){
                                        table+="<p>状态:待处理</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==2){
                                        table+="<p>状态:已处理</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==3){
                                        table+="<p>状态:已阻止</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==4){
                                        table+="<p>状态:已信任</p>";
                                    }else if((list[i].treatment & 0x0FFFF)==5){
                                        table+="<p>状态:已处理</p>";
                                    }
                                    table+="</div>";
                                    table+="</td>";
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
        var dataa={"fname":"instmon","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":0,"count":9}};
       
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

        
       $(".taskDetailPop .title font").html("软件安装拦截");
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
                
                th+="<th width='40%' class='th-ordery' type='time' >时间<img src='images/th-ordery.png'/></th>";
                th+="<th width='52%' class='th-ordery' type='software_name' >软件名称<img src='images/th-ordery.png'/></th>";
                th+="<th width='8%' class='th-ordery' type='treatment' >状态<img src='images/th-ordery.png'/></th>";
                $(".taskDetailPop .tableth table tr").html(th);

                for (var i = 0; i < list.length; i++) {
                    table+="<tr>";
                    table+="<td width='40%'>"+safeStr(getLocalTime(list[i].time))+"</td>";
                    table+="<td width='52%'>"+safeStr(list[i].software_name)+"</td>";
                    if(list[i].treatment==0){
                        table+="<td width='8%'>已忽略</td>";
                    }else if(list[i].treatment==1){
                        table+="<td width='8%'>待处理</td>";
                    }else if(list[i].treatment==2){
                        table+="<td width='8%'>已处理</td>";
                    }else if(list[i].treatment==3){
                        table+="<td width='8%'>已阻止</td>";
                    }else if(list[i].treatment==4){
                        table+="<td width='8%'>已信任</td>";
                    }else if(list[i].treatment==5){
                        table+="<td width='8%'>已处理</td>";
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

                                for (var i = 0; i < list.length; i++) {
                                    table+="<tr>";
                                    table+="<td width='40%'>"+safeStr(getLocalTime(list[i].time))+"</td>";
                                    table+="<td width='52%'>"+safeStr(list[i].software_name)+"</td>";
                                    if(list[i].treatment==0){
                                        table+="<td width='8%'>已忽略</td>";
                                    }else if(list[i].treatment==1){
                                        table+="<td width='8%'>待处理</td>";
                                    }else if(list[i].treatment==2){
                                        table+="<td width='8%'>已处理</td>";
                                    }else if(list[i].treatment==3){
                                        table+="<td width='8%'>已阻止</td>";
                                    }else if(list[i].treatment==4){
                                        table+="<td width='8%'>已信任</td>";
                                    }else if(list[i].treatment==5){
                                        table+="<td width='8%'>已处理</td>";
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


//调整页面内元素高度
var mainlefth=parent.$("#iframe #mainFrame").height();

$(".main .table").css({height:mainlefth-347});

window.onresize = function(){
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .table").css({height:mainlefth-347});

}

