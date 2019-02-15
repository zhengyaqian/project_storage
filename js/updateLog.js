//loading执行

$("#txtBeginDate").calendar();
$("#txtEndDate").calendar();
$("#txtBeginDate").val(GetDateStr(-6));
$("#txtEndDate").val(GetDateStr(0));
accEvent();
//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a[name='virusDefense.html']").addClass("current");
parent.$(".nav .container a[name='virusDefense.html']").siblings().removeClass("current");
parent.$(".footer").show();

document.cookie='page=updateLog.html';

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


$("#specialModel select").change(function(){
    accEvent();
})
//导出
$(document).on('click','.exportLog',function(){
 	var dataa = accEvnetParam();
	$.download('/mgr/upgrade/_export', 'post', dataa); 

})
//排序

$(document).on('click','.table th.th-ordery',function(){
	var toggleClass = $(this).attr('class');
	var _this = $(this);
    sortingFun(_this,toggleClass);
	accEvent();
})
//列表信息
function columnsDataListFun (){
	var columns = [
		{
			type: "time",title: "时间",name: "time",
			tHead:{style: {width: "16%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "16%"},customFunc: function (data, row, i) {return safeStr(getLocalTime(data));}},
		},{
			type: "product",title: "任务类型",name: "product",
			tHead:{style: {width: "16%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "16%"},customFunc: function (data, row, i) {
				if(data == 'client.windows'){return "终端升级";
				}else if(data == 'virdb.windows'){return "病毒库升级";
				}else if(data == 'center.windows'){return "中心升级";
				}else{return "--";}
            }}
		},{
			type: "orgver",title: "升级前版本",name: "orgver",
			tHead:{style: {width: "16%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "16%"},customFunc: function (data, row, i) {
				return safeStr(data);
            }},
		},{
			type: "newver",title: "升级后版本",name: "newver",
			tHead:{style: {width: "16%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "16%"},customFunc: function (data, row, i) {return safeStr(data);}},
		},{
            type: "result",title: "状态",name: "result",
            tHead:{style: {width: "16%"},class: "th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "16%"},customFunc: function (data, row, i) {
				if(data=="success"){return "升级成功"; 
				}else if(data=="connect failed"){return "连接失败"; 
				}else if(data=="fetch failed"){return "下载失败";
				}else if(data=="merge failed"){return "更新失败";
				}else{return "--";}
            }}
		}]
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
var tabListstr = columnsDataListFun();
//请求参数
function accEvnetParam(){
	var begintime=getBeginTimes($("#txtBeginDate").val());
    var endtime=getEndTimes($("#txtEndDate").val());
    var module = $('#specialModel select option:selected').val();

    var sta="";
    var type="";
    var dataa="";
    var start=0;

    dataa={"date":{"begin":begintime,"end":endtime},"filter":{"product":module},"view":{"begin":start,"count":20}}

	var type = $('.table th.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.table th.th-ordery.th-ordery-current').attr('class');
	dataa = sortingDataFun(dataa,type,orderClass);
	return dataa;
}
var ajaxtable=null;
function accEvent(){
    if(ajaxtable){
        ajaxtable.abort();
    }
    var dataa = accEvnetParam();
    $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
    ajaxtable=
    $.ajax({
        url:'/mgr/upgrade/_history',
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
            var total=Math.ceil(data.data.view.total/20);
			if(list.length==0 || list==null){
				$(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>"); 
			}else{
				tabListstr.setData(list);
			}
			tbodyAddHeight();
			

            $(".clearfloat").remove();
            $(".tcdPageCode").remove();
            $(".totalPages").remove();
            $(".tableContainer").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>总共 "+total+" 页</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
            $(".tcdPageCode").createPage({
                pageCount:total,
                current:1,
                backFn:function(pageIndex){
                    start=(pageIndex-1)*20;
 					dataa.view.begin = start;
                    $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
                    ajaxtable=
                    $.ajax({
                        url:'/mgr/upgrade/_history',
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
                    });

                }
            })  
            }
    });

}

tbodyAddHeight();
//调整页面内元素高度
function tbodyAddHeight(){
	var mainlefth=parent.$("#iframe #mainFrame").height();

	$(".main .table tbody").css({height:mainlefth-288});
}
window.onresize = function(){
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .table tbody").css({height:mainlefth-288});

}

