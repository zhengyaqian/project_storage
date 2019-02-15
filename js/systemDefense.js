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
    $(".table").html("");
    
    if($(".filterBlock .tabButton option:checked").val()==1 && $("#functionBlock .current").index()==1){
        tabListstr = columnsDataTerXListFun();
    }else if($(".filterBlock .tabButton option:checked").val()==1 && $("#functionBlock .current").index()==2){
        tabListstr = columnsDataTerRListFun();
    }else if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==1){
        tabListstr = columnsDataDetialXListFun();
    }else if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==2){
        tabListstr = columnsDataDetialRListFun();
    }
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
    $(".table").html("");
    
    if($(".filterBlock .tabButton option:checked").val()==1 && $("#functionBlock .current").index()==1){
        tabListstr = columnsDataTerXListFun();
    }else if($(".filterBlock .tabButton option:checked").val()==1 && $("#functionBlock .current").index()==2){
        tabListstr = columnsDataTerRListFun();
    }else if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==1){
        tabListstr = columnsDataDetialXListFun();
    }else if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==2){
        tabListstr = columnsDataDetialRListFun();
    }
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

/**·············列表数据展示开始············· */

//排序
$(document).on('click','.tableContainer .table th.th-ordery',function(){
	var toggleClass = $(this).attr('class');
	var _this = $(this);
    sortingFun(_this,toggleClass);
	accEvent();
})

//列表参数
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

    if(parseInt($("#groupSelect option:selected").attr("groupid"))!==0 && groupid){
    	 dataa.group_id = "groupid";
    }
   
    var type = $('.table th.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.table th.th-ordery.th-ordery-current').attr('class');
	dataa = sortingDataFun(dataa,type,orderClass);
	
	return dataa;
}
//按终端系统加固列表信息
function columnsDataTerXListFun (){
	var columns = [
        {
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {
				return "<span style='width:400px;' title='"+safeStr(data)+"' class='filePath'>"+safeStr(data)+"</span>";
			}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {
                if(data==""){
                    return "(已删除终端)"; 
               }else{
                    return safeStr(data);
               }
            }},
		},{
			type: "count",title: "威胁数量",name: "count",
			tHead:{style: {width: "20%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {return "<a class='underline cursor blackfont seeDetail' client='"+row.client_id+"'>"+data+"</a>"}},
		}]
	
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
//按终端软件安装列表信息
function columnsDataTerRListFun (){
	var columns = [
        {
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {
				return "<span style='width:400px;' title='"+safeStr(data)+"' class='filePath'>"+safeStr(data)+"</span>";
			}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {
                if(data==""){
                    return "(已删除终端)"; 
               }else{
                    return safeStr(data);
               }
            }},
		},{
			type: "count",title: "拦截次数",name: "count",
			tHead:{style: {width: "20%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {return "<a class='underline cursor blackfont seeDetail' client='"+row.client_id+"'>"+data+"</a>"}},
		}]
	
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
//按详情系统加固列表信息
function columnsDataDetialXListFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "14%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "14%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "17%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "17%"},customFunc: function (data, row, i) {return "<a class='underline cursor filePath blackfont seeDetail' client='"+row.client_id+"' title="+safeStr(pathtitle(data))+" >"+safeStr(data)+"</a>";}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "17%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "17%"},customFunc: function (data, row, i) {
                if(data==""){
                    return "<span class='filePath' title='(已删除终端)'>(已删除终端)</span>";
                }else{
                    return "<span class='filePath' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";
                }
            }},
		},{
			type: "class",title: "保护类型",name: "class",
			tHead:{style: {width: "17%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "17%"},customFunc: function (data, row, i) {
                if(data==0){return "<a class='filePath'>文件保护规则</a>";
                }else if(data==1){return "<a class='filePath'>注册表保护规则</a>";
                }else if(data==2){ return "<a class='filePath'>执行防护规则</a>";
                }else if(data==3){return "<a class='filePath'>病毒免疫</a>";
                }else if(data==4){return "<a class='filePath'>危险动作拦截</a>";
                }else if(data==5){return "<a class='filePath'>进程保护</a>";}
            }},
		},{
			type: "rule_name",title: "保护项目名称",name: "rule_name",
			tHead:{style: {width: "17%"},class: "th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "17%"},customFunc: function (data, row, i) {
                    return "<a class='underline cursor blackfont filePath seeDetail' client='"+row.client_id+"' title="+safeStr(pathtitle(data))+" tc='"+row.class+"'><font>"+safeStr(data)+"</font></a>";
            }},
		},{
            type: "treatment",title: "状态",name: "treatment",
            tHead:{style: {width: "10%"},class: "th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) {
                var treatment = data & 0x0FFFF;
                switch (treatment) {
                    case 0:
                    return "已忽略";
                    break;
                    case 1:
                    return "待处理";
                    break;
                    case 2:
                    return "已处理";
                    break;
                    case 3:
                    return "已阻止";
                    break;
                    case 4:
                    return "已信任";
                    break;
                    case 5:
                    return "已处理";
                    break;
                }
            }}
        },{
            type: "",title: "详情",name: "",
            tHead:{style: {width: "8%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
            tBody:{style: {width: "8%"},class:"relative",customFunc: function (data, row, i) {
                var detailDiv = detailXDiv(row);
                return "<a class='cursor underline blackfont' onclick='seeDetailFloat(this)'>详情</a>"+detailDiv;
            }},
        }]
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}

//按详情软件安装列表信息
function columnsDataDetialRListFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "14%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "14%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "17%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "17%"},customFunc: function (data, row, i) {return "<a class='underline cursor filePath blackfont seeDetail' client='"+row.client_id+"' title="+safeStr(pathtitle(data))+" >"+safeStr(data)+"</a>";}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "17%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "17%"},customFunc: function (data, row, i) {
                if(data==""){
                    return "<span class='filePath' title='(已删除终端)'>(已删除终端)</span>";
                }else{
                    return "<span class='filePath' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";
                }
            }},
		},{
			type: "software_name",title: "软件名称",name: "software_name",
			tHead:{style: {width: "17%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "17%"},customFunc: function (data, row, i) {
                return "<a class='underline cursor blackfont filePath seeDetail' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</a>";
            }},
		},{
            type: "treatment",title: "状态",name: "treatment",
            tHead:{style: {width: "10%"},class: "th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) {
                var treatment = data & 0x0FFFF;
                switch (treatment) {
                    case 0:
                    return "已忽略";
                    break;
                    case 1:
                    return "待处理";
                    break;
                    case 2:
                    return "已处理";
                    break;
                    case 3:
                    return "已阻止";
                    break;
                    case 4:
                    return "已信任";
                    break;
                    case 5:
                    return "已处理";
                    break;
                }
            }}
        },{
            type: "",title: "详情",name: "",
            tHead:{style: {width: "8%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
            tBody:{style: {width: "8%"},class:"relative",customFunc: function (data, row, i) {
                var detailDiv = detailRDiv(row);
                return "<a class='cursor underline blackfont' onclick='seeDetailFloat(this)'>详情</a>"+detailDiv;
            }},
        }]
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}

var tabListstr;
tabListstr = columnsDataDetialXListFun();
accEvent();

var ajaxtable=null;
function accEvent(start){
    if(ajaxtable){
        ajaxtable.abort();
    }
    var dataa = accEvnetParam(start);

    $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
    ajaxtable=
    $.ajax({
        url:'/mgr/log/_search',
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
            var total=Math.ceil(data.data.view.total/numperpage);
            if(list.length == 0 || list == null){
                $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
            }else{
                tabListstr.setData(list);
            }
            tbodyAddHeight();
           
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
                   
                    dataa.view.begin = (pageIndex - 1) * numperpage;
                   
                    $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
                    ajaxtable=
                    $.ajax({
                        url:'/mgr/log/_search',
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
                            tabListstr.setData(list);
                            tbodyAddHeight();
                        }
                    })
                }
            }) 

        }
    });	
}
/**···············列表数据展示结束··············· */
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
/** ··················详情弹窗开始························ */
var threatclass="";
var threatnamee="";
var clientid="";
var totalnum="";
var clientorname="";
var ajaxdetailtable=null;
var tabListPopstr="";
//详情排序
$(document).on('click','.taskDetailPop .taskDetailTable th.th-ordery',function(){
    var toggleClass = $(this).attr('class');
    var _this = $(this);
    sortingFun(_this,toggleClass);
	var currentPage = $(this).parents('.taskDetailPop').find('.tcdPageCode span.current').text();
	var currentNum = 9;
	var start = (parseInt(currentPage) - 1) * 9;
	seeDetailPop(start);
})
//弹出详情
$(document).on('click','.tableContainer .seeDetail',function(){
    var trIndex = $(this).parents('tr').index();
    var tdIndex = $(this).parent('td').index();
    $(".taskDetailPop").attr('trIndex',trIndex);
    $(".taskDetailPop").attr('tdIndex',tdIndex);
    $(".taskDetailPop").attr('client',$(this).attr('client'));
    $(".taskDetailPop").attr('tc',$(this).attr('tc'));
    $('.taskDetailTable').html('');
    var opChecked = $(".filterBlock .tabButton option:checked").val();
    var blockChecked =  $("#functionBlock .current").index();
    if((opChecked == 0 && blockChecked == 1 && parseInt(tdIndex) == 4) || (opChecked == 0 && blockChecked == 2 && parseInt(tdIndex) == 3)){
        tabListPopstr = columnsDataDetXRNamePopFun();
    }else if((opChecked == 0 && blockChecked == 1 && parseInt(tdIndex) == 1) || (opChecked == 1 && blockChecked == 1)){
        tabListPopstr = columnsDataSysPopFun();
    }else if((opChecked == 0 && blockChecked == 2 && parseInt(tdIndex) == 1) || (opChecked == 1 && blockChecked == 2)){
        tabListPopstr = columnsDataSoftPopFun();
    }
    $(".taskDetailPop").show();
    shade();
    seeDetailPop();
})
//详情参数
function seeDetailParam(start){
    var trIndex = $(".taskDetailPop").attr('trIndex');
    var tdIndex=$(".taskDetailPop").attr('tdIndex');
    var begintime=getBeginTimes($("#txtBeginDate").val());
    var endtime=getEndTimes($("#txtEndDate").val());
    clientid=parseInt($('.taskDetailPop').attr("client"));
    var dataa;
     if(start == undefined) {
		start = 0;
	}else{
		start = start;
	}
    if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==1 && parseInt(tdIndex)==1){
        clientorname=1;
        var groupname=$('.tableContainer .table tbody tr').eq(trIndex).children("td").eq(2).find("span").html();
        var hostname=$('.tableContainer .table tbody tr').eq(trIndex).children("td").eq(1).find("a").html();
        dataa={"fname":"sysprot","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        $(".taskDetailPop .title font").html("系统加固");
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  终端分组 : "+groupname);
    }else if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==1 && parseInt(tdIndex)==4){
        clientorname=3;
        threatnamee=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(4).find("font").html();
        threatclass=parseInt($('.taskDetailPop').attr("tc"));
        var classandname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(parseInt(tdIndex)).html();
        var dataa={"fname":"sysprot","date":{"begin":begintime,"end":endtime},"groupby":"event","filter":{"threat_name":threatnamee,"threat_class":threatclass},"view":{"begin":start,"count":9}};
        $(".taskDetailPop .title font").html("系统加固");
        $(".taskDetailPop .describe").html("保护类型 : "+$('.tableContainer .table tr').eq(parseInt(trIndex)).children("td").eq(parseInt(tdIndex)).prev().children().html()+" , 保护项目 : "+classandname);
    }else if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==2 && parseInt(tdIndex)==1){
        clientorname=1;
        var groupname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(2).find("span").html();
        var hostname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(1).find("a").html();
        var dataa={"fname":"instmon","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        $(".taskDetailPop .title font").html("软件拦截");
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  终端分组 : "+groupname);
    }else if($(".filterBlock .tabButton option:checked").val()==0 && $("#functionBlock .current").index()==2 && parseInt(tdIndex)==3){
        clientorname=3;
        threatnamee=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(3).find('a').html();
        var dataa={"fname":"instmon","date":{"begin":begintime,"end":endtime},"groupby":"event","filter":{"threat_name":threatnamee},"view":{"begin":start,"count":9}};
        $(".taskDetailPop .title font").html("软件拦截");
        $(".taskDetailPop .describe").html("软件名称 : "+threatnamee);
    }else if($(".filterBlock .tabButton option:checked").val()==1 && $("#functionBlock .current").index()==1){
        var groupname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(1).html();
        var hostname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(0).find('span').html();
        var dataa={"fname":"sysprot","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        $(".taskDetailPop .title font").html("系统加固");
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  终端分组 : "+groupname);
    }else if($(".filterBlock .tabButton option:checked").val()==1 && $("#functionBlock .current").index()==2){
        var groupname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(1).html();
        var hostname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(0).find('span').html();
        var dataa={"fname":"instmon","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        $(".taskDetailPop .title font").html("软件安装拦截");
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  终端分组 : "+groupname);
    }

    var type = $('.taskDetailPop .taskDetailTable th.th-ordery.th-ordery-current').attr('type');
    var orderClass = $('.taskDetailPop .taskDetailTable th.th-ordery.th-ordery-current').attr('class');
    dataa = sortingDataFun(dataa,type,orderClass);

    return dataa;
}
//按详情不同block名称列表详情
function columnsDataDetXRNamePopFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "28%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "28%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "28%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "28%"},customFunc: function (data, row, i) {return "<span class='filePath' style='width:150px;' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "28%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "28"},customFunc: function (data, row, i) {if(data==""){return "(已删除终端";}else{return safeStr(data);} }},
		},{
			type: "treatment",title: "状态",name: "treatment",
			tHead:{style: {width: "16%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "16%"},customFunc: function (data, row, i) {
                var treatment = data & 0x0FFFF;
                if(treatment==0){ return "已忽略";
                }else if(treatment==1){return "待处理";
                }else if(treatment==2){ return "已处理";
                }else if(treatment==3){return "已阻止";
                }else if(treatment==4){ return "已信任";
                }else if(treatment==5){return "已处理";}else{return ""};
            }}
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.taskDetailTable'));
	return tabstr;
}
//按系统加固不同情况列表详情
function columnsDataSysPopFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "25%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "25%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "proc_path",title: "操作者",name: "proc_path",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {return "<span class='filePath' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";}},
		},{
			type: "rule_name",title: "保护项目",name: "rule_name",
			tHead:{style: {width: "25%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "25"},customFunc: function (data, row, i) {
                if(row.class==0){
                    return "<span class='filePath' title=文件保护规则/"+safeStr(pathtitle(data))+">文件保护规则/"+safeStr(data)+"</span>";
                }else if(row.class==1){
                    return "<span class='filePath' title=注册表保护规则/"+safeStr(pathtitle(data))+">注册表保护规则/"+safeStr(data)+"</span>";
                }else if(row.class==2){
                    return "<span class='filePath' title=执行防护规则/"+safeStr(pathtitle(data))+">执行防护规则/"+safeStr(data)+"</span>";
                }else if(row.class==3){
                    return "<span class='filePath' title=病毒免疫/"+safeStr(pathtitle(data))+">病毒免疫/"+safeStr(data)+"</span><";
                }else if(row.class==4){
                    return "<span class='filePath' title=危险动作拦截/"+safeStr(pathtitle(data))+">危险动作拦截/"+safeStr(data)+"</span>";
                }else if(row.class==5){
                    return "<span class='filePath' title=进程保护/"+safeStr(pathtitle(data))+">进程保护/"+safeStr(data)+"</span>";
                }
            }},
		},{
			type: "treatment",title: "状态",name: "treatment",
			tHead:{style: {width: "10%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) {
                var treatment = data & 0x0FFFF;
                if(treatment==0){ return "已忽略";
                }else if(treatment==1){return "待处理";
                }else if(treatment==2){ return "已处理";
                }else if(treatment==3){return "已阻止";
                }else if(treatment==4){ return "已信任";
                }else if(treatment==5){return "已处理";}else{return ""};
            }}
		},{
			type: "",title: "详情",name: "",
			tHead:{style: {width: "10%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},class:"relative",customFunc: function (data, row, i) {
                    var detailDiv = detailXDiv(row);
                    return "<a class='cursor underline blackfont' onclick='seeDetailFloat(this)'>详情</a>" + detailDiv; 
            }},
		}
	]
	var tabstr = new createTable(columns,[] ,$('.taskDetailTable'));
	return tabstr;
}
//按软件拦截不同情况列表详情
function columnsDataSoftPopFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "software_name",title: "软件名称",name: "software_name",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {return "<span class='filePath' style='width:150px;' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";}},
		},{
			type: "treatment",title: "状态",name: "treatment",
			tHead:{style: {width: "15%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "15%"},customFunc: function (data, row, i) {
                var treatment = data & 0x0FFFF;
                if(treatment==0){ return "已忽略";
                }else if(treatment==1){return "待处理";
                }else if(treatment==2){ return "已处理";
                }else if(treatment==3){return "已阻止";
                }else if(treatment==4){ return "已信任";
                }else if(treatment==5){return "已处理";
                }else{return ""};
            }}
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.taskDetailTable'));
	return tabstr;
}
function seeDetailPop(start){
    if(ajaxdetailtable){
        ajaxdetailtable.abort();
    }
    var dataa = seeDetailParam(start);
    $(".taskDetailPop tbody").append("<div style='text-align:center;color:#6a6c6e;padding-top:201px;' class='detailLoading'><img src='images/loading.gif'></div>");
        
        ajaxdetailtable=
        $.ajax({
            url:'/mgr/log/_detail',
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
                var total=Math.ceil(totalnum/9);
                tabListPopstr.setData(list);
                tbodyAddHeight();
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
                            error:function(xhr,textStatus,errorThrown){
					        	if(xhr.status==401){
					        	    parent.window.location.href='/';
					        	}
					        },
                            success:function(data){
                                var list=data.data.list;
                                tabListPopstr.setData(list);
                                tbodyAddHeight();
                            }
                        })
                    }
                })


            }
        })

}

function detailXDiv(row){
    var table = "";
    table+="<div class='detailFloat'>";
    table+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span></h4>";
    table+="<p>操作者:"+safeStr(row.proc_path)+"</p>";
    table+="<p>命令行:"+safeStr(row.cmdline)+"</p>";
    table+="<p>风险动作:"+safeStr(row.rule_name)+"</p>";
    if(row.class==0){
        table+="<p>目标文件:"+safeStr(row.res_path)+"</p>"; 
    }
    if(row.class==1){
        table+="<p>目标注册表:"+safeStr(row.res_path)+"</p>"; 
    }
    if(row.class==2){
        table+="<p>执行文件:"+safeStr(row.res_path)+"</p>";
    }
    if(row.class==3){
        table+="<p>可疑文件:"+safeStr(row.res_path)+"</p>";
    }
    if((row.action&0x01)!== 0) {

        table+="<p>操作类型 : 创建</p>";
    }else if((row.action&0x02)!= 0){

        table+="<p>操作类型 : 读取</p>";
    }else if((row.action&0x04)!= 0){

        table+="<p>操作类型 : 写入</p>";
    }else if((row.action&0x08)!= 0){

        table+="<p>操作类型 : 删除</p>";
    }else if((row.action&0x10)!= 0){

        table+="<p>操作类型 : 执行</p>";
    }
    if(row.class==1){
        table+="<p>数据内容:"+safeStr(row.res_val)+"</p>";
    }
    
    if((row.treatment & 0x0FFFF)==0){
        table+="<p>状态:已忽略</p>";
    }else if((row.treatment & 0x0FFFF)==1){
        table+="<p>状态:待处理</p>";
    }else if((row.treatment & 0x0FFFF)==2){
        table+="<p>状态:已处理</p>";
    }else if((row.treatment & 0x0FFFF)==3){
        table+="<p>状态:已阻止</p>";
    }else if((row.treatment & 0x0FFFF)==4){
        table+="<p>状态:已信任</p>";
    }else if((row.treatment & 0x0FFFF)==5){
        table+="<p>状态:已处理</p>";
    }
    table+="</div>";

    return table;
}
function detailRDiv(row){
    var table = "";
    table+="<div class='detailFloat'>";
    table+="<h4><p class='floatL'>事件详情</p><span onclick='closeDetailFloat(this)'></span></h4>";
    table+="<p>操作者:"+safeStr(row.proc_path)+"</p>";
    table+="<p>安装软件:"+safeStr(row.software_name)+"</p>";
    table+="<p>软件路径:"+safeStr(row.file_path)+"</p>";
    if((row.treatment & 0x0FFFF)==0){
        table+="<p>状态:已忽略</p>";
    }else if((row.treatment & 0x0FFFF)==1){
        table+="<p>状态:待处理</p>";
    }else if((row.treatment & 0x0FFFF)==2){
        table+="<p>状态:已处理</p>";
    }else if((row.treatment & 0x0FFFF)==3){
        table+="<p>状态:已阻止</p>";
    }else if((row.treatment & 0x0FFFF)==4){
        table+="<p>状态:已信任</p>";
    }else if((row.treatment & 0x0FFFF)==5){
        table+="<p>状态:已处理</p>";
    }
    table+="</div>";

    return table;
}
/** ··················详情弹窗结束························ */
tbodyAddHeight();
//调整页面内元素高度
function tbodyAddHeight(){
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .table tbody").css({height:mainlefth-347});
}


window.onresize = function(){
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .table tbody").css({height:mainlefth-347});

}

