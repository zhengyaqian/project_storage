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
// 搜索类型选择
$("#selectVD1,#selectVT,#selectVD2,#selectVD3,#selectVD4,#selectVD5").change(function(){
    accEvent();
})
//类型选择
$("#functionBlock .bu").click(function(){
    functionType();
})
//选项卡选择
$(".filterBlock .tabButton").change(function(){
    functionType();
})
function functionType(){
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
    $('.table').html('');
    var opChecked = $(".filterBlock .tabButton option:checked").val();
    var blockChecked =  $("#functionBlock .current").index();
    if(opChecked==1 && blockChecked==1){
        tabListstr = columnsDataTer_1_ListFun();
    }else if(opChecked==1 && blockChecked==2){
        tabListstr = columnsDataTer_2_ListFun();
    }else if(opChecked==1 && blockChecked==3){
        tabListstr = columnsDataTer_3_ListFun();
    }else if(opChecked==1 && blockChecked==4){
        tabListstr = columnsDataTer_4_ListFun();
    }else if(opChecked==1 && blockChecked==5){
        tabListstr = columnsDataTer_5_ListFun();
    }else if((opChecked==0 && blockChecked==1) ||(opChecked==0 && blockChecked==2)){
        tabListstr = columnsDataDetail_1_ListFun();
    }else if(opChecked==0 && blockChecked==3){
        tabListstr = columnsDataDetail_3_ListFun();
    }else if(opChecked==0 && blockChecked==4){
        tabListstr = columnsDataDetail_4_ListFun();
    }else if(opChecked==0 && blockChecked==5){
        tabListstr = columnsDataDetail_5_ListFun();
    }
    accEvent();
}
//选择时间
$("#specialTime select").change(function(){
    var optionVal = $(this).find("option:selected").val();
    var begintime = 0;
    switch(parseInt(optionVal)){
        case 0:
            begintime = -6;
            break;
        case 1:
            begintime = -29;
            break;
        case 2:
            begintime = -89;
            break;
        case 3:
            begintime = -364;
            break;
        default:
            $(".filterBlock .middle").show(200);
            break;
    }
    if(optionVal != 4){
        if(begintime != 0){
            $("#txtBeginDate").val(GetDateStr(begintime));
        }
        $("#txtEndDate").val(GetDateStr(0));
        $(".filterBlock .middle").hide(200);
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
    var currentIndex = $("#functionBlock .current").index();
    if($(".filterBlock .tabButton option:checked").val()==0){
        if($("#selectVD"+currentIndex).val()=="0"){
            hostname=$("#searchKey").val();
        }else{
            threatname=$("#searchKey").val();
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
    var fanmeField = ["intrusion","ipattack","malsite","ipblacklist","ipproto"];
    dataa.fname = fanmeField[currentIndex-1];
 	
	if(parseInt($("#groupSelect option:selected").attr("groupid"))!==0 && groupid){
        dataa.group_id = groupid;
    }

    var type = $('.table th.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.table th.th-ordery.th-ordery-current').attr('class');
    dataa = sortingDataFun(dataa,type,orderClass);
    
	return dataa;
}
//按详情不同block名称列表详情
function columnsDataDetail_1_ListFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "12%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "12%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "15.5%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "15.5%"},customFunc: function (data, row, i) {return "<a class='underline cursor blackfont filePath seeDetail' client_id='"+row.client_id+"' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</a>";}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "15.5%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "15.5%"},customFunc: function (data, row, i) {if(data==""){return "(已删除终端";}else{return safeStr(data);} }},
		},{
			type: "name",title: "入侵类型",name: "name",
			tHead:{style: {width: "15.5%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "15.5%"},customFunc: function (data, row, i) {return "<a class='underline cursor blackfont filePath seeDetail'  client_id='"+row.client_id+"' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</a>";}},
		},{
			type: "raddr",title: "远程地址",name: "raddr",
			tHead:{style: {width: "15.5%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "15.5%"},customFunc: function (data, row, i) {return "<span class='filePath'  title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";}},
		},{
			type: "proc_path",title: "关联进程",name: "proc_path",
			tHead:{style: {width: "15.5%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "15.5%"},class:"th-ordery",customFunc: function (data, row, i) {return "<span class='filePath'  title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</span>";}},
		},{
			type: "blocked",title: "状态",name: "blocked",
			tHead:{style: {width: "10.5%"},customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
            tBody:{style: {width: "10.5%"},customFunc: function (data, row, i) {if(data==true){ return "已阻止";  }else{ return "已放过"; }}},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
function columnsDataDetail_3_ListFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "12%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "12%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "22%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "22%"},customFunc: function (data, row, i) {return "<a class='underline cursor blackfont filePath seeDetail'  client_id='"+row.client_id+"' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</a>";}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "22%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "22%"},customFunc: function (data, row, i) {if(data==""){return "(已删除终端";}else{return safeStr(data);} }},
		},{
			type: "domain",title: "拦截网址",name: "domain",
			tHead:{style: {width: "22%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "22%"},customFunc: function (data, row, i) {return "<a class='underline cursor blackfont filePath seeDetail' client_id='"+row.client_id+"'  title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</a>";}},
		},{
			type: "class",title: "网址类型",name: "class",
			tHead:{style: {width: "22%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "22%"},customFunc: function (data, row, i) {
                return "<span class='filePath' title='"+fieldHandle(clsTypeField,data)+"' site='"+data+"'>"+fieldHandle(clsTypeField,data)+"</span>";
            }},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
function columnsDataDetail_4_ListFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "12%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "12%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "10%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) {return "<a class='underline cursor blackfont filePath seeDetail' client_id='"+row.client_id+"' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</a>";}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "10%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) {if(data==""){return "(已删除终端";}else{return safeStr(data);} }},
		},{
			type: "raddr",title: "远程IP",name: "raddr",
			tHead:{style: {width: "10%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) {return "<a class='underline cursor blackfont filePath seeDetail' client_id='"+row.client_id+"'  title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</a>";}},
		},{
			type: "memo",title: "备注",name: "memo",
			tHead:{style: {width: "10%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) {
                if(data==""){ return "<span class='filePath' title='-'>-</span>";
                }else{return "<span class='filePath' title="+data+">"+data+"</span>";}
            }}
		},{
			type: "blocked",title: "状态",name: "blocked",
			tHead:{style: {width: "8%"},customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>" }},
			tBody:{style: {width: "8%"},customFunc: function (data, row, i) { if(data==true){ return "已阻止";  }else{ return "已放过"; }}},

		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
function columnsDataDetail_5_ListFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "12%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "12%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "20%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {return "<a class='underline cursor blackfont filePath seeDetail' client_id='"+row.client_id+"' title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</a>";}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "20%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {if(data==""){return "(已删除终端";}else{return safeStr(data);} }},
		},{
			type: "name",title: "触犯规则名称",name: "name",
			tHead:{style: {width: "20%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {return "<a class='underline cursor blackfont filePath seeDetail' client_id='"+row.client_id+"'  title="+safeStr(pathtitle(data))+">"+safeStr(data)+"</a>";}},
		},{
			type: "raddr",title: "触犯动作",name: "raddr",
			tHead:{style: {width: "12%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "12%"},customFunc: function (data, row, i) {
                if(data==true){ return "<span class='filePath' title="+safeStr(pathtitle(data))+">联出"+safeStr(data)+"</span>";
                }else{ return "<span class='filePath' title="+safeStr(pathtitle(data))+">联入"+safeStr(data)+"</span>"; }
            }}
		},{
			type: "blocked",title: "状态",name: "blocked",
			tHead:{style: {width: "8%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>" }},
			tBody:{style: {width: "8%"},customFunc: function (data, row, i) { if(data==true){ return "已阻止";  }else{ return "已放过"; }}},

		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
//按终端不同block名称列表详情
function columnsDataTer_1_ListFun (){
	var columns = [
	    {
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {return "<span style='width:400px;' class='filePath' title="+safeStr(data)+">"+safeStr(data)+"</span>"}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {if(data==""){return "(已删除终端";}else{return safeStr(data);} }},
		},{
			type: "count",title: "黑客入侵记录数",name: "count",
			tHead:{style: {width: "20%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {return "<a class='underline cursor blackfont seeDetail' client_id='"+row.client_id+"'>"+data+"</a>";}},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
function columnsDataTer_2_ListFun (){
	var columns = [
	    {
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {return "<span style='width:400px;' class='filePath' title="+safeStr(data)+">"+safeStr(data)+"</span>"}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {if(data==""){return "(已删除终端";}else{return safeStr(data);} }},
		},{
			type: "count",title: "对外攻击数量",name: "count",
			tHead:{style: {width: "20%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {return "<a class='underline cursor blackfont seeDetail' client_id='"+row.client_id+"'>"+data+"</a>";}},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
function columnsDataTer_3_ListFun (){
	var columns = [
	    {
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {return "<span style='width:400px;' class='filePath' title="+safeStr(data)+">"+safeStr(data)+"</span>"}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {if(data==""){return "(已删除终端";}else{return safeStr(data);} }},
		},{
			type: "count",title: "恶意网址拦截数量",name: "count",
			tHead:{style: {width: "20%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {return "<a class='underline cursor blackfont seeDetail' client_id='"+row.client_id+"'>"+data+"</a>";}},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
function columnsDataTer_4_ListFun (){
	var columns = [
	    {
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {return "<span style='width:400px;' class='filePath' title="+safeStr(data)+">"+safeStr(data)+"</span>"}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {if(data==""){return "(已删除终端";}else{return safeStr(data);} }},
		},{
			type: "count",title: "IP黑名单数目",name: "count",
			tHead:{style: {width: "20%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {return "<a class='underline cursor blackfont seeDetail' client_id='"+row.client_id+"'>"+data+"</a>";}},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
function columnsDataTer_5_ListFun (){
	var columns = [
	    {
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {return "<span style='width:400px;' class='filePath' title="+safeStr(data)+">"+safeStr(data)+"</span>"}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "40%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "40%"},customFunc: function (data, row, i) {if(data==""){return "(已删除终端";}else{return safeStr(data);} }},
		},{
			type: "count",title: "触犯控制规则数",name: "count",
			tHead:{style: {width: "20%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "20%"},customFunc: function (data, row, i) {return "<a class='underline cursor blackfont seeDetail' client_id='"+row.client_id+"'>"+data+"</a>";}},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
tabListstr = columnsDataDetail_1_ListFun();
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
        	}
        },
        success:function(data){
            var list=data.data.list;
            var total=Math.ceil(data.data.view.total/numperpage);
            
            if(list==null || list.length == 0){
                $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
            }else{
                tabListstr.setData(list);
            }
            tbodyAddHeight();
            
          
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


//关闭弹层
$(".closeW").click(function(){
    $(".shade").hide();
    parent.$(".topshade").hide();
    $(this).parent().parent().hide();
    $(".taskDetailPop .taskDetailTable").prop("scrollTop","0");

});
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
    var clientid = $(this).attr('client_id');
    $(".taskDetailPop").attr('trIndex',trIndex);
    $(".taskDetailPop").attr('tdIndex',tdIndex);
    $(".taskDetailPop").attr('client_id',clientid);

    $('.taskDetailTable').html('');
    $(".taskDetailPop").show();
    var opChecked = $(".filterBlock .tabButton option:checked").val();
    var blockChecked =  $("#functionBlock .current").index();
    if((opChecked == 0 && blockChecked == 1 && parseInt(tdIndex) == 1) || (opChecked == 0 && blockChecked == 2 && parseInt(tdIndex) == 1) || (opChecked == 1 && blockChecked == 1)){
        tabListPopstr = columnsDataDetail_a1_PopFun();
    }else if((opChecked == 0 && blockChecked == 1 && parseInt(tdIndex) == 3) ||(opChecked == 0 && blockChecked == 2 && parseInt(tdIndex) == 3) || (opChecked == 0 && blockChecked == 3 && parseInt(tdIndex) == 3)){
        tabListPopstr = columnsDataDetail_a3_PopFun();
    }else if((opChecked == 0 && blockChecked == 3 && parseInt(tdIndex) == 1) || (opChecked == 1 && blockChecked == 3)){
        tabListPopstr = columnsDataDetail_b1_PopFun();
    }else if((opChecked == 0 && blockChecked == 4 && parseInt(tdIndex) == 1)||(opChecked == 1 && blockChecked == 4)){
        tabListPopstr = columnsDataDetail_c1_PopFun();
    }else if((opChecked == 0 && blockChecked == 4 && parseInt(tdIndex) == 3)||(opChecked == 0 && blockChecked == 5 && parseInt(tdIndex) == 3)){
        tabListPopstr = columnsDataDetail_c3_PopFun();
    }else if((opChecked == 0 && blockChecked == 4 && parseInt(tdIndex) == 3) ||(opChecked == 1 && blockChecked == 5)){
        tabListPopstr = columnsDataDetail_d1_PopFun();
    }else if(opChecked == 1 && blockChecked == 2){
        tabListPopstr = columnsDataTer_2_PopFun();
    }
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
//详情参数
function seeDetailParam(start){
    var trIndex = $(".taskDetailPop").attr('trIndex');
    var tdIndex=$(".taskDetailPop").attr('tdIndex');
    var begintime=getBeginTimes($("#txtBeginDate").val());
    var endtime=getEndTimes($("#txtEndDate").val());
    var opChecked = $(".filterBlock .tabButton option:checked").val();
    var blockChecked =  $("#functionBlock .current").index();
    clientid=parseInt($('.taskDetailPop').attr("client_id"));

    var dataa;
     if(start == undefined) {
		start = 0;
	}else{
		start = start;
	}
    if(opChecked==0 && blockChecked==1 && parseInt(tdIndex)==1){
        clientorname=1;
        var hostname=$('.tableContainer .table tbody tr').eq(trIndex).children("td").eq(1).find("a").html();
        var groupname=$('.tableContainer .table tbody tr').eq(trIndex).children("td").eq(2).html();

        var dataa={"fname":"intrusion","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        $(".taskDetailPop .title font").html("黑客入侵拦截");
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  终端分组 : "+groupname);
    }else if(opChecked==0 && blockChecked==1 && parseInt(tdIndex)==3){
        clientorname=3;
        name=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(parseInt(tdIndex)).find('a').html();

        var dataa={"fname":"intrusion","date":{"begin":begintime,"end":endtime},"groupby":"event","filter":{"threat_name":name},"view":{"begin":start,"count":9}};
        $(".taskDetailPop .title font").html("黑客入侵拦截");
        $(".taskDetailPop .describe").html("入侵类型 : "+name);
       
    }else if(opChecked==0 && blockChecked==2 && parseInt(tdIndex)==1){
        clientorname=1;
        var hostname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(1).find("a").html();
        var dataa={"fname":"ipattack","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        var groupname=$('.tableContainer .table tbody tr').eq(trIndex).children("td").eq(2).html();
        
        $(".taskDetailPop .title font").html("对外攻击");
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a> 终端分组 : "+groupname);
    }else if(opChecked==0 && blockChecked==2 && parseInt(tdIndex)==3){
        clientorname=3;
        threatclassn=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(parseInt(tdIndex)).find('a').html();
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
        $(".taskDetailPop .title font").html("对外攻击 - "+threatclassn);
        $(".taskDetailPop .describe").html("攻击类型 : "+threatclassn);
    }else if(opChecked==0 && blockChecked==3 && parseInt(tdIndex)==1){
        clientorname=1;
        var hostname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(1).find("a").html();
        var dataa={"fname":"malsite","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        var groupname=$('.tableContainer .table tbody tr').eq(trIndex).children("td").eq(2).html();
		
        $(".taskDetailPop .title font").html("恶意网站拦截");
        $(".taskDetailPop .describe").html("终端名称 :<a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  终端分组 : "+groupname);
       
    }else if(opChecked==0 && blockChecked==3 && parseInt(tdIndex)==3){
        clientorname=3;
        threatnamee=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).find("td").eq(parseInt(tdIndex)).find('a').html();
        threatclass=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).find("td").eq(4).find("span").attr("site");
        var dataa={"fname":"malsite","date":{"begin":begintime,"end":endtime},"groupby":"event","filter":{"threat_name":threatnamee,"threat_class":threatclass},"view":{"begin":start,"count":9}};
       
       $(".taskDetailPop .title font").html("恶意网站拦截");
        $(".taskDetailPop .describe").html("拦截网址 : "+threatnamee);
        
    }else if(opChecked==0 && blockChecked==4 && parseInt(tdIndex)==1){
        clientorname=1;
        var hostname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(1).find("a").html();
        var groupname=$('.tableContainer .table tbody tr').eq(trIndex).children("td").eq(2).html();
        
        $(".taskDetailPop .title font").html("IP黑名单");
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  终端分组 : "+groupname);
    }else if(opChecked==0 && blockChecked==4 && parseInt(tdIndex)==3){
        clientorname=3;
        threatnamee=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).find('td').eq(parseInt(tdIndex)).html();
        threatclass=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).find("td").eq(4).find("span").attr("site");
        var remark=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).find("td").eq(4).find("span").html();
        var dataa={"fname":"ipblacklist","date":{"begin":begintime,"end":endtime},"groupby":"event","filter":{"threat_name":threatnamee,"threat_class":threatclass},"view":{"begin":start,"count":9}};
      
        $(".taskDetailPop .title font").html("IP黑名单");
        $(".taskDetailPop .describe").html("远程IP : "+threatnamee+" , 备注 : "+remark);
        
    }else if(opChecked==0 && blockChecked==5 && parseInt(tdIndex)==1){
        clientorname=1;
        var hostname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(1).find("a").html();
        var dataa={"fname":"ipproto","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        var groupname=$('.tableContainer .table tbody tr').eq(trIndex).children("td").eq(2).html();
        
        $(".taskDetailPop .title font").html("IP协议控制");
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>终端分组 : "+groupname);
        
    }else if(opChecked==0 && blockChecked==5 && parseInt(tdIndex)==3){
        clientorname=3;
        threatnamee=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).find('td').eq(parseInt(tdIndex)).find('a').html();
        threatclass=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).find("td").eq(4).find("span").attr("site");
        var offendac=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).find("td").eq(4).find("span").html();
        var dataa={"fname":"ipproto","date":{"begin":begintime,"end":endtime},"groupby":"event","filter":{"threat_name":threatnamee,"threat_class":threatclass},"view":{"begin":start,"count":9}};
        
        $(".taskDetailPop .title font").html("IP协议控制");
        $(".taskDetailPop .describe").html("规则名称 : "+threatnamee+" , 触犯动作 : "+offendac);
        
    }else if(opChecked==1 && blockChecked==1){
        var hostname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(0).find('span').html();
        var groupname=$('.tableContainer .table tbody tr').eq(trIndex).children("td").eq(1).html();
        var dataa={"fname":"intrusion","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        $(".taskDetailPop .title font").html("黑客入侵拦截");
        $(".taskDetailPop .describe").html("终端名称 :<a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  终端分组 : "+groupname);
       
    }else if(opChecked==1 && blockChecked==2){
        var hostname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(0).find('span').html();
        var dataa={"fname":"ipattack","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        var groupname=$('.tableContainer .table tbody tr').eq(trIndex).children("td").eq(1).html();
        $(".taskDetailPop .title font").html("对外攻击检测");
        $(".taskDetailPop .describe").html("终端名称 :<a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  终端分组 : "+groupname);
        
    }else if(opChecked==1 && blockChecked==3){
        var hostname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(0).find('span').html();
        var dataa={"fname":"malsite","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        var groupname=$('.tableContainer .table tbody tr').eq(trIndex).children("td").eq(1).html();
        $(".taskDetailPop .title font").html("恶意网址拦截");
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  终端分组 : "+groupname);
        
    }else if(opChecked==1 && blockChecked==4){
        var hostname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(0).find('span').html();
        var dataa={"fname":"ipblacklist","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        var groupname=$('.tableContainer .table tbody tr').eq(trIndex).children("td").eq(1).html();
        $(".taskDetailPop .title font").html("IP黑名单");
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  , 终端分组 : "+groupname);
        
    }else if(opChecked==1 && blockChecked==5){
        var hostname=$('.tableContainer .table tbody tr').eq(parseInt(trIndex)).children("td").eq(0).find('span').html();
        var dataa={"fname":"ipproto","date":{"begin":begintime,"end":endtime},"groupby":"client","client_id":clientid,"view":{"begin":start,"count":9}};
        var groupname=$('.tableContainer .table tbody tr').eq(trIndex).children("td").eq(1).html();
        $(".taskDetailPop .title font").html("IP协议控制");
        $(".taskDetailPop .describe").html("终端名称 : <a class='filePath popHostname' title='"+hostname+"'>"+hostname+" ,</a>  终端分组 : "+groupname);
       
    }
    var type = $('.taskDetailPop .taskDetailTable th.th-ordery.th-ordery-current').attr('type');
    var orderClass = $('.taskDetailPop .taskDetailTable th.th-ordery.th-ordery-current').attr('class');
    dataa = sortingDataFun(dataa,type,orderClass);

    return dataa;
}
//详情--按详情不同block下不同列表详情
function columnsDataDetail_a1_PopFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "21%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "21%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "raddr",title: "远程地址",name: "raddr",
			tHead:{style: {width: "21%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "21%"},customFunc: function (data, row, i) {return safeStr(data);}},
		},{
			type: "proc_path",title: "关联进程",name: "proc_path",
			tHead:{style: {width: "21%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "21%"},customFunc: function (data, row, i) {
                return "<span class='filePath' title="+safeStr(pathtitle(data))+">"+safeStr(pathtitle(data))+"</span>"; }},
		},{
			type: "raddr",title: "入侵类型",name: "raddr",
			tHead:{style: {width: "21%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "21%"},customFunc: function (data, row, i) {return "<span class='filePath'>"+safeStr(data)+"</span>";}},
		},{
			type: "blocked",title: "状态",name: "blocked",
			tHead:{style: {width: "16%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>" }},
			tBody:{style: {width: "16%"},customFunc: function (data, row, i) { if(data==true){ return "已阻止";  }else{ return "已放过"; }}},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.taskDetailTable'));
	return tabstr;
}
function columnsDataDetail_a3_PopFun (){
	var columns = [
        {
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}}
		},{
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {return "<span style='width:150px;' class='filePath' title="+safeStr(data)+">"+safeStr(data)+"</span>"}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {if(data==""){return "(已删除终端";}else{return safeStr(data);} }}
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.taskDetailTable'));
	return tabstr;
}
function columnsDataDetail_b1_PopFun (){
	var columns = [
        {
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}}
		},{
			type: "domain",title: "拦截网站",name: "domain",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {return "<span class='filePath' title="+safeStr(data)+">"+safeStr(data)+"</span>"}},
		},{
			type: "class",title: "网站分类",name: "class",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {
                return "<span class='filePath' title='"+fieldHandle(clsTypeField,data)+"'>"+fieldHandle(clsTypeField,data)+"</span>";
           }}
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.taskDetailTable'));
	return tabstr;
}
function columnsDataDetail_c1_PopFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "raddr",title: "远程IP",name: "raddr",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {return safeStr(data);}},
		},{
			type: "memo",title: "备注",name: "memo",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {
                if(data==""){ return "-"; }else{return safeStr(list[i].memo); }
            }}
		},{
			type: "blocked",title: "状态",name: "blocked",
			tHead:{style: {width: "10%"},customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>" }},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) { if(data==true){ return "已阻止";  }else{ return "已放过"; }}},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.taskDetailTable'));
	return tabstr;
}
function columnsDataDetail_c3_PopFun (){
	var columns = [
        {
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}}
		},{
			type: "hostname",title: "终端名称",name: "hostname",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {return "<span style='width:150px;' class='filePath' title="+safeStr(data)+">"+safeStr(data)+"</span>"}},
		},{
			type: "group_name",title: "终端分组",name: "group_name",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {if(data==""){return "(已删除终端";}else{return safeStr(data);} }}
		},{
			type: "blocked",title: "状态",name: "blocked",
			tHead:{style: {width: "10%"},customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>" }},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) { if(data==true){ return "已阻止";  }else{ return "已放过"; }}},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.taskDetailTable'));
	return tabstr;
}
function columnsDataDetail_d1_PopFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "name",title: "触犯规则名称",name: "name",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {return safeStr(data);}},
		},{
			type: "raddr",title: "触犯动作",name: "raddr",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {
                if(row.outbound==true){
                    return "联出"+safeStr(list[i].raddr);
                }else{
                    return "<td>联入"+safeStr(list[i].raddr);
                }
            }}
		},{
			type: "blocked",title: "状态",name: "blocked",
			tHead:{style: {width: "10%"},customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>" }},
			tBody:{style: {width: "10%"},customFunc: function (data, row, i) { if(data==true){ return "已阻止";  }else{ return "已放过"; }}},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.taskDetailTable'));
	return tabstr;
}
//详情--按终端不同block下不同列表详情
function columnsDataTer_2_PopFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "21%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "21%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "raddr",title: "远程地址",name: "raddr",
			tHead:{style: {width: "21%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "21%"},customFunc: function (data, row, i) {return "<span class='filePath'>"+safeStr(data)+"<span>";}},
		},{
			type: "proc_path",title: "关联进程",name: "proc_path",
			tHead:{style: {width: "21%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "21%"},customFunc: function (data, row, i) {
                return "<span class='filePath'>"+safeStr(pathtitle(data))+"</span>"; }},
		},{
			type: "flood_type",title: "攻击类型",name: "flood_type",
			tHead:{style: {width: "21%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "21%"},customFunc: function (data, row, i) {
                switch (data) {
                    case 0 : 
                    return "SYN<";
                    break;
                    case 1 :
                    return "UDP";
                    break;
                    case 2 :
                    return "ICMP";
                    break;
                }
            }},
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
            }
        },
        success:function(data){
            var list=data.data.list;
           
            totalnum=data.data.view.total;
            var total=Math.ceil(totalnum/9);
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
                            }else{
                                
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

//调整页面内元素高度
function tbodyAddHeight(){
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .table tbody").css({height:mainlefth-347});
}


window.onresize = function(){
    tbodyAddHeight();
}

