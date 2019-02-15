//loading执行 

//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a[name='accountManage.html']").addClass("current");
parent.$(".nav .container a[name='accountManage.html']").siblings().removeClass("current");
parent.$(".footer").show();

document.cookie='page=accountManage.html';

// 选择管理员类型
$("#selectVT").change(function(){
    $(".tableContainer .table th input[type=checkbox]").prop("checked",false);
    selectaccountarr=[];
    accEvent();
})
//关闭弹层
$(".closeW").click(function(){
    
    if($(this).parent().parent().attr("class")=="powerManagePop pop"){
        // $(".delayHide").show();
        // $(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'>无法新建管理员</span>");
        // setTimeout(function(){$(".delayHide").hide()},2000);
        $(".abandonNAPop").show();
        $(".powerManagePop .windowShade").show();
        $(".abandonNAPop .describe font").html(" <b style='max-width: 150px;text-overflow:ellipsis;overflow: hidden;white-space: nowrap;display: inline-block;vertical-align: top;font-size: 14px'>"+$(".newAdminPop input[name='account']").val()+"</b> ");
    }else if($(this).parent().parent().attr("class")=="abandonNAPop pop"){
        $(".abandonNAPop").hide();
        $(".powerManagePop .windowShade").hide();
    }else{
        $(".shade").hide();
        $(this).parent().parent().hide();
        parent.$(".topshade").hide();
    }

});
// 确认放弃新建管理员
function sureAbandonButton(){
    $(".pop").hide();
    $(".shade").hide();
    parent.$(".topshade").hide();
    $(".powerManagePop .windowShade").hide();
}
// 取消放弃新建管理员
function cancelAbandonButton(){
    $(".abandonNAPop").hide();
    $(".powerManagePop .windowShade").hide();
}
function hideButton(a){
    $(a).parent().parent().hide();
    
    if($(a).parent().parent().attr("class")=="powerManagePop pop"){
        // $(".delayHide").show();
        // $(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'>无法新建管理员</span>");
        // setTimeout(function(){$(".delayHide").hide()},2000);
        $(".newAdminPop").show();
    }else{
        $(".shade").hide();
        parent.$(".topshade").hide();
    }
}
// 键盘离开搜索管理员名称
$("#searchKey").keyup(function(){
    $(".tableContainer .table th input[type=checkbox]").prop("checked",false);
    selectaccountarr=[];
    accEvent();
})
//全选
function selectAll(checkbox) {
    $('.selectPower').prop('checked', $(checkbox).prop('checked'));
}
function selectAll1(checkbox){
    $('.selectAdmin').prop('checked', $(checkbox).prop('checked'));
}
$(".powerManagePop").on("click",".selectPower",function(){
    if($(".powerManagePop .selectPower").length==$(".powerManagePop .selectPower:checked").length){
        $(".powerManagePop .pMTableth input[type=checkbox]").prop("checked",true)
    }else{
        $(".powerManagePop .pMTableth input[type=checkbox]").prop("checked",false)
    }
})
$(".modifyPowerPop").on("click",".selectPower",function(){
    if($(".modifyPowerPop .selectPower").length==$(".modifyPowerPop .selectPower:checked").length){
        $(".modifyPowerPop .pMTableth input[type=checkbox]").prop("checked",true)
    }else{
        $(".modifyPowerPop .pMTableth input[type=checkbox]").prop("checked",false)
    }
})
// 新建管理员选择管理员类型时文字
$(".newAdminPop select").change(function(){
    if($(this).val()==1){
        $(".newAdminPop .auditorIn").show();
    }else{
        $(".newAdminPop .auditorIn").hide();
    }
})
// 管理员列表选择时将id推进数组和全选input的变化
$(".tableContainer").on("click",".selectAdmin",function(){
    if($(this).is(":checked")){
        selectaccountarr.push(parseInt($(this).attr("pid")));
    }else{
        selectaccountarr.splice(jQuery.inArray(parseInt($(this).attr("pid")),selectaccountarr),1);
    }
    var group="";
    var filter=$("#searchKey").val();
    if($("#selectVT").val()==1){
        group="admin"
    }else if($("#selectVT").val()==2){
        group="audit"
    }else if($("#selectVT").val()==3){
        group="root"
    }
    var num=parseInt($(".table tbody").attr("num"));
    dataa={"group":group,"filter":{"name":filter},"view":{"begin":0,"count":num}}
    $.ajax({
        url:'/mgr/user/_list',
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
            var isinarraynum=0;
            for (var i = 0; i < list.length; i++) {
                if(isInArray(selectaccountarr,list[i].id)==true){
                    isinarraynum+=1;
                }
            };
            if(isinarraynum==data.data.view.total-1){
                $(".tableContainer .table th input[type=checkbox]").prop("checked",true)
            }else{
                $(".tableContainer .table th input[type=checkbox]").prop("checked",false)
            }
        }
    });
})
// 已经选择的终端数组
var selectaccountarr=[];
// 全选按钮点击将当前所有的账户加入已选账户数组或者全部移除
$(".tableContainer .table").on("click","input[type=checkbox]",function(){
    
    var group="";
    var filter=$("#searchKey").val();
    if($("#selectVT").val()==1){
        group="admin"
    }else if($("#selectVT").val()==2){
        group="audit"
    }else if($("#selectVT").val()==3){
        group="root"
    }
    var num=parseInt($(".tableContainer .table tbody").attr("num"));
    dataa={"group":group,"filter":{"name":filter},"view":{"begin":0,"count":num}}
    $.ajax({
        url:'/mgr/user/_list',
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
            if($(".tableContainer .table input[type=checkbox]").is(":checked")){
                for (var i = 0; i < list.length; i++) {
                    if(isInArray(selectaccountarr,list[i].id)==false&&list[i].id!==1){
                        selectaccountarr.push(list[i].id);  
                    }
                    
                };
            }else{
                for (var i = 0; i < list.length; i++) {
                    if(isInArray(selectaccountarr,list[i].id)==true){
                        selectaccountarr.splice(jQuery.inArray(list[i].id,selectaccountarr),1);
                    }
                    
                };
            }
        }
    });
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

$(document).on('click','.table th.th-ordery',function(){
	var toggleClass = $(this).attr('class');
	var _this = $(this);
    sortingFun(_this,toggleClass);
	var currentPage = $(this).parents('.tableContainer').find('.tcdPageCode span.current').text();
	var currentNum = $(this).parents('.tableContainer').find('#numperpageinput').val();
	var start = (parseInt(currentPage) - 1) * parseInt(currentNum);
	accEvent(start);
})
//列表信息
function columnsDataListFun (){
	var columns = [
		{
			type: "client_id",title: "",name: "client_id",
			tHead:{style: {width: "4%"},class:"",customFunc: function (data, row, i) {return "<input type='checkbox' class='verticalMiddle' onclick='selectAll1(this)'>"}},
			tBody:{style: {width: "4%"},customFunc: function (data, row, i) {
                if(row.group=="root"){
                    return "<input type='checkbox' class='verticalMiddle' disabled>";
                }else if(isInArray(selectaccountarr,row.id)==true){
                    return "<input type='checkbox' class='verticalMiddle selectAdmin' pid='"+row.id+"' checked>";
                }else{
                    return "<input type='checkbox' class='verticalMiddle selectAdmin' pid='"+row.id+"'>";
                }
			}}
	   	},{
			type: "name",title: "账号",name: "name",
			tHead:{style: {width: "15%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "15%"},customFunc: function (data, row, i) {
                switch (row.state){
                    case 0:
                    return "<span class='verticalTop filePath unstartuse'>"+safeStr(data)+"</span>";
                    break;
                    default:
                    return "<span class='verticalTop filePath'>"+safeStr(data)+"</span>";
                }
			}},
		},{
			type: "remark",title: "备注",name: "remark",
			tHead:{style: {width: "17%"},class:"th-ordery",customFunc: function (data, row, i) {return ""}},
			tBody:{style: {width: "17%"},customFunc: function (data, row, i) {
                if(data==""){
                    switch(row.state){
                        case 0:
                        return "<span class='unstartuse'>--</span>";
                        break;
                        default:
                        return "--";
                    }
                }else{
                    switch(row.state){
                        case 0:
                        return "<span class='filePath unstartuse'>"+safeStr(data)+"</span>";
                        break;
                        default:
                        return "<span class='filePath'>"+safeStr(data)+"</span>";
                    }
                }
            }},
		},{
			type: "phone",title: "联系方式",name: "phone",
			tHead:{style: {width: "17%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "17%"},customFunc: function (data, row, i) {
                if(data==""){
                    switch(row.state){
                        case 0:
                        return "<span class='unstartuse'>--</span>";
                        break;
                        default:
                        return "--";
                    }
                }else{
                    switch(row.state){
                        case 0:
                        return "<span class='filePath unstartuse'>"+safeStr(data)+"</span>";
                        break;
                        default:
                        return "<span class='filePath'>"+safeStr(data)+"</span>";
                    }
                }
            }}
		},{
			type: "group",title: "类型",name: "group",
			tHead:{style: {width: "9%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "9%"},customFunc: function (data, row, i) {
                if(data=="admin"){
                    if(row.state == 0){return "<span class='unstartuse'>普通管理员</span>";
                    }else{return "普通管理员"; }
                }else if(row.group=="root"){ return "超级管理员";
                }else if(row.group=="audit"){
                    if(row.state == 0){return "<span class='unstartuse'>审计员</span>";
                    }else{return "审计员"; }
                }
            }},
		},{
			type: "create_time",title: "创建时间",name: "create_time",
			tHead:{style: {width: "13%"},class: "th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "13"},customFunc: function (data, row, i) {
                switch (row.state){
                    case 0:
                    return "<span class='unstartuse'>"+safeStr(getLocalTime(data))+"</span>";
                    break;
                    default:
                    return safeStr(getLocalTime(data));
                }
            }},
		},{
			type: "",title: "操作",name: "",
			tHead:{style: {width: "25%"},class: "th-ordery",customFunc: function (data, row, i) {return ""}},
			tBody:{style: {width: "25%"},customFunc: function (data, row, i) {
                var table = "";
                if(row.state==1){
                    table+="<a class='underline cursor blackfont' onclick='pwResetPop(this)' pid='"+row.id+"'>密码重置</a>";
                    table+="<a class='underline cursor blackfont marginL20' onclick='editInfPop(this)' pid='"+row.id+"'>修改信息</a>";
                    if(row.group!=="root" && row.group!=="audit"){
                        table+="<a class='underline cursor blackfont marginL20' onclick='modifyPowerPop(this)' pid='"+row.id+"' powers='"+row.privilege+"'>权限管理</a>";  
                    }
                    if(row.group!=="root"){
                        table+="<a class='underline cursor blackfont marginL20' onclick='stopPop(this)' pid='"+row.id+"'>停用</a>";
                    }
                }else{
                    table+="<a class='underline cursor blackfont' onclick='startPop(this)' pid='"+row.id+"'>启用账号</a>";
                }

                return table;
            }}
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.tableContainer .table'));
	return tabstr;
}
var tabListstr =columnsDataListFun();
accEvent();
var ajaxtable=null;
function accEvent(start){
    if(ajaxtable){
        ajaxtable.abort();
    }
    var sta="";
    var dataa="";
    if(start == undefined) {
		start = 0;
	}else{
		start = start;
	}
    var group="";
    var filter=$("#searchKey").val();
    if($("#selectVT").val()==1){
        group="admin"
    }else if($("#selectVT").val()==2){
        group="audit"
    }else if($("#selectVT").val()==3){
        group="root"
    }
    dataa={"group":group,"filter":{"name":filter},"view":{"begin":start,"count":numperpage}}
    var type = $('.table th.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.table th.th-ordery.th-ordery-current').attr('class');
    dataa = sortingDataFun(dataa,type,orderClass);
    
    $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
    ajaxtable=
    $.ajax({
        url:'/mgr/user/_list',
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

            tabListstr.setData(list);
            $('.table tbody').attr('num',data.data.view.total);
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
                    dataa.view.begin =(pageIndex-1)*numperpage;
                    $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
                    ajaxtable=
                    $.ajax({
                        url:'/mgr/user/_list',
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
                            tabListstr.setData(list);
                            tbodyAddHeight();
                        }
                    });

                }
            })  
            }
    });

}

// 新建管理员弹层
function newAdminPop(){
    shade();
    $(".newAdminPop").show();
    $(".newAdminPop input[type=text]").val("");
    $(".newAdminPop select").val(0);
    $(".newAdminPop .auditorIn").hide();
}
function sureNAButton(){
    if(trim($(".newAdminPop input[name=account]").val())==""){
        $(".delayHide").show();
        $(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'>账号不能为空</span>");
        setTimeout(function(){$(".delayHide").hide()},2000);
    }else{
        if($(".newAdminPop select").val()==1){
            var name=$(".newAdminPop input[name=account]").val();
            var phone=$(".newAdminPop input[name=contact]").val();
            var remark=$(".newAdminPop input[name=remark]").val();
            if($(".newAdminPop select").val()==0){
                var group="admin";
            }else{
                var group="audit";
            }
            
            var dataa={"group":group,"name":name,"phone":phone,"remark":remark};
            $.ajax({
                url:'/mgr/user/_create',
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
                    if(data.errno==0){
                        selectaccountarr=[];
                        $(".tableContainer .table").prop("checked",false);
                        $(".newAdminPop .closeW").click();
                        accEvent();  
                    }else if(data.errno==-1&&data.errmsg.indexOf("1062")>0){
                        $(".delayHide").show();
                        $(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'> 账号已存在</span>");
                        setTimeout(function(){$(".delayHide").hide()},2000);
                    }
                    
                }
            })  
        }else{
            $(".newAdminPop").hide();
            $(".powerManagePop").show();
            $(".powerManagePop input[type=checkbox]").not("#homepage").prop("checked",false);
        }
    }
}
// 修改权限弹层
function modifyPowerPop(a){
    adminid=parseInt($(a).attr("pid"));
    shade();
    $(".modifyPowerPop").show();
    var checked;
    var powers=$(a).attr("powers");
    var powerarr = ['client','policy','distr','leakrepair','log','tools'];
    for(var i=0;i<powerarr.length;i++){
        if(powers.indexOf(powerarr[i])>0){
            $(".modifyPowerPop .selectPower").eq(i).prop("checked",true);   
        }else{
            $(".modifyPowerPop .selectPower").eq(i).prop("checked",false);  
        }
    }
    if($(".modifyPowerPop .selectPower").length==$(".modifyPowerPop .selectPower:checked").length){
        checked = true;
    }else{
        checked = false;
    }
    $(".modifyPowerPop .pMTableth input[type=checkbox]").prop("checked",checked);
}
function sureMPButton(){
    var powerarr=[];
    $(".modifyPowerPop .pMTable input:checked").each(function(){
        powerarr.push($(this).attr("name"))
    })
    var dataa={"id":adminid,"privilege":powerarr,"group":"admin"};
    $.ajax({
        url:'/mgr/user/_update',
        data:JSON.stringify(dataa),
        type:'POST',
        contentType:'text/plain',
        error:function(xhr,textStatus,errorThrown){
        	if(xhr.status==401){
        	    parent.window.location.href='/';
        	}
        },
        success:function(data){
            $(".modifyPowerPop .closeW").click();
            accEvent();
        }
    })
}
function sureAPButton(){
    var name=$(".newAdminPop input[name=account]").val();
    var phone=$(".newAdminPop input[name=contact]").val();
    var remark=$(".newAdminPop input[name=remark]").val();
    if($(".newAdminPop select").val()==0){
        var group="admin";
    }else{
        var group="audit";
    }
    var powerarr=[];
    $(".powerManagePop .pMTable .selectPower:checked").each(function(){
        powerarr.push($(this).attr("name"))
    })
    var dataa={"group":group,"name":name,"phone":phone,"remark":remark,"privilege":powerarr};
    $.ajax({
        url:'/mgr/user/_create',
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
            if(data.errno==0){
                $(".tableContainer .table input[type=checkbox]").prop("checked",false);
                selectaccountarr=[];
                $(".powerManagePop").hide();
                $(".shade").hide();
                parent.$(".topshade").hide();
                accEvent();
                $(".delayHideS").show();
                $(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> 操作成功</span>");
                setTimeout(function(){$(".delayHideS").hide()},2000);
            }else if(data.errno==-1&data.errmsg.indexOf("1062")>0){
                $(".delayHide").show();
                $(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'> 账号已存在</span>");
                setTimeout(function(){$(".delayHide").hide()},2000);
            }
            
        }
    })
}
// 修改信息弹层
var adminid="";
function editInfPop(a){
    shade();
    $(".modifyInfPop").show();
    adminid=parseInt($(a).attr("pid"));

    $(".modifyInfPop input[name=account]").val($(a).parents("tr").find("td").eq(1).find("span").text());
    if($(a).parents("tr").find("td").eq(2).html()=="-"){
        $(".modifyInfPop input[name=remark]").val("");
    }else{
        $(".modifyInfPop input[name=remark]").val($(a).parents("tr").find("td").eq(2).find("span").text());
    }
    if($(a).parents("tr").find("td").eq(3).html()=="-"){
        $(".modifyInfPop input[name=contact]").val("");
    }else{
        $(".modifyInfPop input[name=contact]").val($(a).parents("tr").find("td").eq(3).text());
    }
    if($(a).parents("tr").find("td").eq(4).html()=="普通管理员"){
        $(".modifyInfPop select").val(0);
        $(".modifyInfPop input[name=account]").prop("disabled",false);
        $(".modifyInfPop .notice").show();
        $(".modifyInfPop .auditorIn").hide();
    }else if($(a).parents("tr").find("td").eq(4).html()=="审计员"){
        $(".modifyInfPop select").val(1);
        $(".modifyInfPop input[name=account]").prop("disabled",false);
        $(".modifyInfPop .notice").show();
        $(".modifyInfPop .auditorIn").show();
    }else{
        $(".modifyInfPop select").val(2);
        $(".modifyInfPop input[name=account]").prop("disabled",true);
        $(".modifyInfPop .notice").hide();
        $(".modifyInfPop .auditorIn").hide();
    }
}
function sureMIButton(){

    if($(".modifyInfPop input[name=account]").val()==""){
        $(".delayHide").show();
        $(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'>账号不能为空</span>");
        setTimeout(function(){$(".delayHide").hide()},2000); 
    }else{
        var name=$(".modifyInfPop input[name=account]").val();
        var phone=$(".modifyInfPop input[name=contact]").val();
        var remark=$(".modifyInfPop input[name=remark]").val();
        if($(".modifyInfPop input[name=account]").prop("disabled")==true){
            var dataa={"id":adminid,"phone":phone,"remark":remark};
        }else{
            var dataa={"id":adminid,"name":name,"phone":phone,"remark":remark};
        }
        
        $.ajax({
            url:'/mgr/user/_update',
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
                if(data.errno==0){
                    $(".modifyInfPop .closeW").click();
                    accEvent(); 
                }else{
                    $(".delayHide").show();
                    $(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'>账号已存在</span>");
                    setTimeout(function(){$(".delayHide").hide()},2000);
                }
                
            }
        })
    }
    
}
// 密码重置弹层
function pwResetPop(a){
    adminid=parseInt($(a).attr("pid"));
    var adminname=$(a).parents("tr").find("td").eq(1).children().html();
    $(".pwResetPop .adminName").html("&nbsp;"+adminname+"&nbsp;");
    if(adminid==1){
        $(".pwResetPop .resetpwd").html('"admin"');
    }else{
        $(".pwResetPop .resetpwd").html('"123456"');
    }
    shade();
    $(".pwResetPop").show();
}
function surePwResetButton(){
    $.ajax({
        url:'/mgr/user/_repwd?id='+adminid,
        data:{},
        type:'GET',
        contentType:'text/plain',
        error:function(xhr,textStatus,errorThrown){
        	if(xhr.status==401){
        	    parent.window.location.href='/';
        	}else{
        		
        	}
            
        },
        success:function(data){
            if(data.errno==0){
                $(".pwResetPop .closeW").click();
                accEvent();
                $(".delayHideS").show();
                $(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> 操作成功</span>");
                setTimeout(function(){$(".delayHideS").hide()},2000);
            }else{
                $(".delayHide").show();
                $(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'> 失败</span>");
                setTimeout(function(){$(".delayHide").hide()},2000);
            }
            
        }
    })
}
// 停用弹层
function stopPop(a){
    adminid=parseInt($(a).attr("pid"));
    var adminname=$(a).parents("tr").find("td").eq(1).children().html();
    $(".stopPop .adminName").html("&nbsp;"+adminname+"&nbsp;");
    shade();
    $(".stopPop").show();

}
function sureStopButton(){
    var dataa={"id":adminid,"State":0};
    $.ajax({
        url:'/mgr/user/_update',
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
            accEvent();
            $(".stopPop .closeW").click();
        }
    }) 
}
// 启用弹层
function startPop(a){
    adminid=parseInt($(a).attr("pid"));
    var dataa={"id":adminid,"State":1};
    $.ajax({
        url:'/mgr/user/_update',
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
            accEvent();
        }
    })  
}
// 删除管理员弹层
function deleteAdminPop(){
    if(selectaccountarr.length==0){
        $(".delayHide").show();
        $(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'> 请选择管理员</span>");
        setTimeout(function(){$(".delayHide").hide()},2000);
    }else{

        if(selectaccountarr.length==1){

            $(".deleteAdminPop .describe font").html("账号 <b>"+$(".tableContainer .selectAdmin:checked").parents("tr").find("td").eq(1).children().html()+"</b>  ");
        }else{
            $(".deleteAdminPop .describe font").html("多个管理员账号 ");
        }
        shade();
        $(".deleteAdminPop").show(); 
    }
    
}
function sureDeleteButton(a){
    $(selectaccountarr).each(function(index,value){
        $.ajax({
            url:'/mgr/user/_delete?id='+value,
            data:{},
            type:'GET',
            contentType:'text/plain',
            error:function(xhr,textStatus,errorThrown){
	        	if(xhr.status==401){
	        	    parent.window.location.href='/';
	        	}else{
	        		
	        	}
	        },
            success:function(data){
                if(data.errno==0){
                    $(".delayHideS").show();
                    $(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> 操作成功</span>");
                    setTimeout(function(){$(".delayHideS").hide()},2000);
                    $(".tableContainer .table input[type=checkbox]").prop("checked",false);
                    $(".deleteAdminPop .closeW").click();
                    if(index==selectaccountarr.length-1){
                    	accEvent();
                    }
                    
                }
                
            }
        })
    })
    
}
tbodyAddHeight();
//调整页面内元素高度
function tbodyAddHeight(){
var mainlefth=parent.$("#iframe #mainFrame").height();

$(".main .table tbody").css({height:mainlefth-296});
}
window.onresize = function(){
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .table tbody").css({height:mainlefth-296});

}

