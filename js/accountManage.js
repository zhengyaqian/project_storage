//loading执行 

//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a[name='accountManage.html']").addClass("current");
parent.$(".nav .container a[name='accountManage.html']").siblings().removeClass("current");
parent.$(".footer").show();

document.cookie='page=accountManage.html';

// 选择管理员类型
$("#selectVT").change(function(){
    $(".tableContainer .tableth input[type=checkbox]").prop("checked",false);
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
    $(".tableContainer .tableth input[type=checkbox]").prop("checked",false);
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
        selectaccountarr.push(parseInt($(this).parents("tr").attr("id")));
    }else{
        selectaccountarr.splice(jQuery.inArray(parseInt($(this).parents("tr").attr("id")),selectaccountarr),1);
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
    var num=parseInt($("#tableAlign").attr("num"));
    dataa={"group":group,"filter":{"name":filter},"view":{"begin":0,"count":num}}
    $.ajax({
        url:'/mgr/user/_list',
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
            var isinarraynum=0;
            for (var i = 0; i < list.length; i++) {
                if(isInArray(selectaccountarr,list[i].id)==true){
                    isinarraynum+=1;
                }
            };
            if(isinarraynum==data.data.view.total-1){
                $(".tableContainer .tableth input[type=checkbox]").prop("checked",true)
            }else{
                $(".tableContainer .tableth input[type=checkbox]").prop("checked",false)
            }
        }
    });
})
// 已经选择的终端数组
var selectaccountarr=[];
// 全选按钮点击将当前所有的账户加入已选账户数组或者全部移除
$(".tableContainer .tableth").on("click","input[type=checkbox]",function(){
    
    var group="";
    var filter=$("#searchKey").val();
    if($("#selectVT").val()==1){
        group="admin"
    }else if($("#selectVT").val()==2){
        group="audit"
    }else if($("#selectVT").val()==3){
        group="root"
    }
    var num=parseInt($("#tableAlign").attr("num"));
    dataa={"group":group,"filter":{"name":filter},"view":{"begin":0,"count":num}}
    $.ajax({
        url:'/mgr/user/_list',
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
            if($(".tableContainer .tableth input[type=checkbox]").is(":checked")){
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

$(document).on('click','.tableth th.th-ordery',function(){
	var toggleClass = $(this).attr('class');
	$(this).siblings('th.th-ordery').removeClass().addClass('th-ordery');
	$(this).siblings('th.th-ordery').find('img').attr('src','images/th-ordery.png');
	
	if(toggleClass == 'th-ordery'){
		$(this).find('img').attr('src','images/th-ordery-up.png');
		$(this).addClass('th-ordery-current th-ordery-up');
	}else if(toggleClass == 'th-ordery th-ordery-current th-ordery-up'){
		$(this).find('img').attr('src','images/th-ordery-down.png');
		$(this).addClass('th-ordery-current th-ordery-down');
		
	}else if(toggleClass == 'th-ordery th-ordery-current th-ordery-up th-ordery-down'){
		$(this).find('img').attr('src','images/th-ordery.png');
		$(this).removeClass('th-ordery-current th-ordery-down th-ordery-up');
	}
	var currentPage = $(this).parents('.tableContainer').find('.tcdPageCode span.current').text();
	var currentNum = $(this).parents('.tableContainer').find('#numperpageinput').val();
	var start = (parseInt(currentPage) - 1) * parseInt(currentNum);
	accEvent(start);
})
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
    $(".table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
    ajaxtable=
    $.ajax({
        url:'/mgr/user/_list',
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
            var total=Math.ceil(data.data.view.total/numperpage);
            

            table+="<table>";
            table+="<tr id='tableAlign' num="+data.data.view.total+">";
            table+="<td width='4%'><input type='checkbox' class='verticalMiddle'></td>";
            table+="<td width='15%'><span class='verticalTop'>账号</span></td>";
            table+="<td width='17%'>备注</td>";
            table+="<td width='17%'>联系方式</td>";
            table+="<td width='9%'>类型</td>";
            table+="<td width='13%'>创建时间</td>";
            table+="<td width='25%'>操作</td>";
            table+="</tr>";
            for(i=0;i<list.length;i++){
                table+="<tr id="+list[i].id+" powers="+list[i].privilege+">"; 
                if(list[i].group=="root"){
                    table+="<td><input type='checkbox' class='verticalMiddle' disabled></td>";
                    table+="<td><span class='verticalTop filePath'>"+safeStr(list[i].name)+"</span></td>";
                }else if(isInArray(selectaccountarr,list[i].id)==true){
                    table+="<td><input type='checkbox' class='verticalMiddle selectAdmin' checked></td>";
                    switch (list[i].state){
                        case 0:
                        table+="<td class='unstartuse'><span class='verticalTop filePath'>"+safeStr(list[i].name)+"</span></td>";
                        break;
                        default:
                        table+="<td><span class='verticalTop filePath'>"+safeStr(list[i].name)+"</span></td>";
                    }
                    
                }else{
                    table+="<td><input type='checkbox' class='verticalMiddle selectAdmin'></td>";
                    switch (list[i].state){
                        case 0:
                        table+="<td class='unstartuse'><span class='verticalTop filePath'>"+safeStr(list[i].name)+"</span></td>";
                        break;
                        default:
                        table+="<td><span class='verticalTop filePath'>"+safeStr(list[i].name)+"</span></td>";
                    }
                }
                
                if(list[i].remark==""){
                    switch(list[i].state){
                        case 0:
                        table+="<td class='unstartuse'>-</td>";
                        break;
                        default:
                        table+="<td>-</td>";
                    }
                    
                }else{
                    switch(list[i].state){
                        case 0:
                        table+="<td class='unstartuse'><span class='filePath'>"+safeStr(list[i].remark)+"</span></td>";
                        break;
                        default:
                        table+="<td><span class='filePath'>"+safeStr(list[i].remark)+"</span></td>";
                    }
                    
                }
                if(list[i].phone==""){
                    switch(list[i].state){
                        case 0:
                        table+="<td class='unstartuse'>-</td>";
                        break;
                        default:
                        table+="<td>-</td>";
                    }
                    
                }else{
                    switch(list[i].state){
                        case 0:
                        table+="<td class='unstartuse'><span class='filePath'>"+safeStr(list[i].phone)+"</span></td>";
                        break;
                        default:
                        table+="<td><span class='filePath'>"+safeStr(list[i].phone)+"</span></td>";
                    }
                    
                }
                if(list[i].group=="admin"){
                    switch (list[i].state){
                        case 0:
                        table+="<td class='unstartuse'>普通管理员</td>"; 
                        break;
                        default:
                        table+="<td>普通管理员</td>";
                    }
                     
                }else if(list[i].group=="root"){
                    table+="<td>超级管理员</td>";
                }else if(list[i].group=="audit"){
                    switch (list[i].state){
                        case 0:
                        table+="<td class='unstartuse'>审计员</td>";
                        break;
                        default:
                        table+="<td>审计员</td>";
                    }
                    
                }
                switch (list[i].state){
                    case 0:
                    table+="<td class='unstartuse'>"+safeStr(getLocalTime(list[i].create_time))+"</td>";
                    break;
                    default:
                    table+="<td>"+safeStr(getLocalTime(list[i].create_time))+"</td>";
                }
                
                table+="<td>";
                if(list[i].state==1){
                    table+="<a class='underline cursor blackfont' onclick='pwResetPop(this)'>密码重置</a>";
                    table+="<a class='underline cursor blackfont marginL20' onclick='editInfPop(this)'>修改信息</a>";
                    if(list[i].group!=="root" && list[i].group!=="audit"){
                        table+="<a class='underline cursor blackfont marginL20' onclick='modifyPowerPop(this)'>权限管理</a>";  
                    }
                    if(list[i].group!=="root"){
                        table+="<a class='underline cursor blackfont marginL20' onclick='stopPop(this)'>停用</a>";
                    }
                }else{
                    table+="<a class='underline cursor blackfont' onclick='startPop(this)'>启用账号</a>";
                }
                
                table+="</td>";
                table+="</tr>";
            }
            table+="</table>";
            $(".table table").hide();
            // $(".main .tableth table").html(tableth);
            $(".table").html(table);
            $(".table table").show();
            

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
                    $(".table table").html("");
                    dataa.view.begin =(pageIndex-1)*numperpage;


                    $(".table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
                    ajaxtable=
                    $.ajax({
                        url:'/mgr/user/_list',
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
                            table+="<tr id='tableAlign' num="+data.data.view.total+">";
                            table+="<td width='4%'><input type='checkbox' class='verticalMiddle'></td>";
                            table+="<td width='15%'><span class='verticalTop'>账号</span></td>";
                            table+="<td width='17%'>备注</td>";
                            table+="<td width='17%'>联系方式</td>";
                            table+="<td width='9%'>类型</td>";
                            table+="<td width='13%'>创建时间</td>";
                            table+="<td width='25%'>操作</td>";
                            table+="</tr>";
                            for(i=0;i<list.length;i++){
                                table+="<tr id="+list[i].id+" powers="+list[i].privilege+">"; 
                                if(list[i].group=="root"){
                                    table+="<td><input type='checkbox' class='verticalMiddle' disabled></td>";
                                    table+="<td><span class='verticalTop filePath'>"+safeStr(list[i].name)+"</span></td>";
                                }else if(isInArray(selectaccountarr,list[i].id)==true){
                                    table+="<td><input type='checkbox' class='verticalMiddle selectAdmin' checked></td>";
                                    switch (list[i].state){
                                        case 0:
                                        table+="<td class='unstartuse'><span class='verticalTop filePath'>"+safeStr(list[i].name)+"</span></td>";
                                        break;
                                        default:
                                        table+="<td><span class='verticalTop filePath'>"+safeStr(list[i].name)+"</span></td>";
                                    }
                                    
                                }else{
                                    table+="<td><input type='checkbox' class='verticalMiddle selectAdmin'></td>";
                                    switch (list[i].state){
                                        case 0:
                                        table+="<td class='unstartuse'><span class='verticalTop filePath'>"+safeStr(list[i].name)+"</span></td>";
                                        break;
                                        default:
                                        table+="<td><span class='verticalTop filePath'>"+safeStr(list[i].name)+"</span></td>";
                                    }
                                }
                                
                                if(list[i].remark==""){
                                    switch(list[i].state){
                                        case 0:
                                        table+="<td class='unstartuse'>-</td>";
                                        break;
                                        default:
                                        table+="<td>-</td>";
                                    }
                                    
                                }else{
                                    switch(list[i].state){
                                        case 0:
                                        table+="<td class='unstartuse'><span class='filePath'>"+safeStr(list[i].remark)+"</span></td>";
                                        break;
                                        default:
                                        table+="<td><span class='filePath'>"+safeStr(list[i].remark)+"</span></td>";
                                    }
                                    
                                }
                                if(list[i].phone==""){
                                    switch(list[i].state){
                                        case 0:
                                        table+="<td class='unstartuse'>-</td>";
                                        break;
                                        default:
                                        table+="<td>-</td>";
                                    }
                                    
                                }else{
                                    switch(list[i].state){
                                        case 0:
                                        table+="<td class='unstartuse'><span class='filePath'>"+safeStr(list[i].phone)+"</span></td>";
                                        break;
                                        default:
                                        table+="<td><span class='filePath'>"+safeStr(list[i].phone)+"</span></td>";
                                    }
                                    
                                }
                                if(list[i].group=="admin"){
                                    switch (list[i].state){
                                        case 0:
                                        table+="<td class='unstartuse'>普通管理员</td>"; 
                                        break;
                                        default:
                                        table+="<td>普通管理员</td>";
                                    }
                                     
                                }else if(list[i].group=="root"){
                                    table+="<td>超级管理员</td>";
                                }else if(list[i].group=="audit"){
                                    switch (list[i].state){
                                        case 0:
                                        table+="<td class='unstartuse'>审计员</td>";
                                        break;
                                        default:
                                        table+="<td>审计员</td>";
                                    }
                                    
                                }
                                switch (list[i].state){
                                    case 0:
                                    table+="<td class='unstartuse'>"+safeStr(getLocalTime(list[i].create_time))+"</td>";
                                    break;
                                    default:
                                    table+="<td>"+safeStr(getLocalTime(list[i].create_time))+"</td>";
                                }
                                
                                table+="<td>";
                                if(list[i].state==1){
                                    table+="<a class='underline cursor blackfont' onclick='pwResetPop(this)'>密码重置</a>";
                                    table+="<a class='underline cursor blackfont marginL20' onclick='editInfPop(this)'>修改信息</a>";
                                    if(list[i].group!=="root" && list[i].group!=="audit"){
                                        table+="<a class='underline cursor blackfont marginL20' onclick='modifyPowerPop(this)'>权限管理</a>";  
                                    }
                                    if(list[i].group!=="root"){
                                        table+="<a class='underline cursor blackfont marginL20' onclick='stopPop(this)'>停用</a>";
                                    }
                                }else{
                                    table+="<a class='underline cursor blackfont' onclick='startPop(this)'>启用账号</a>";
                                }
                                
                                table+="</td>";
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

// 新建管理员弹层
function newAdminPop(){
    shade();
    $(".newAdminPop").show();
    $(".newAdminPop input").val("");
    $(".newAdminPop .placeholder").show()
    $(".newAdminPop select").val(0);
    $(".newAdminPop .auditorIn").hide();
}

// 修改密码验证
var $account = $("#account");
var $new_pass = $("#new_pass");
var $sure_pass = $("#sure_pass");
// 账号
$account.keyup(function(event){
    event = event?event:window.event;
    if(event.keyCode == 9){
        return;
    }
    var val = $(this).val();
    if(val != ''){
        $(this).siblings('font').hide();
    }
}).blur(function(){
    var val = $(this).val();
    if(val == ''){
       $(this).siblings('font').show().html('账号不能为空');
    }
})

//密码
$new_pass.keyup(function(event){
    event = event?event:window.event;
    if(event.keyCode == 9){
        return;
    }
    
    var reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,32}$/,
        regx = /^\S*$/,
        that = $(this),
        val = that.val();

        if(!regx.test(val)){
            that.siblings('font').show().html('密码不可包含空格');
            return;
        }  
        if($sure_pass.val() != ""){
            if($sure_pass.val() == val){
                $sure_pass.siblings('font').hide();
            }else{
                $sure_pass.siblings('font').show();
            }
        }
        if(!reg.test(val)){
            that.siblings('font').show().html('密码必须由8-32位大小写字母、数字、特殊字符组成');
            return;
        }
      
       that.siblings('font').hide();

}).blur(function(){
    var val = $(this).val();
    if(val == ''){
       $(this).siblings('font').show().html('请输入密码');
    }
})

//确认密码
$sure_pass.keyup(function(event){
    event = event?event:window.event;
    if(event.keyCode == 9){
        return;
    }
    var val = $(this).val();
    if(val == $new_pass.val()){
        $(this).siblings('font').hide();
    }else{
        $(this).siblings('font').show();
    }
}).blur(function(){
    var val = $(this).val();
    if(val == ''){
       $(this).siblings('font').show().html('两次输入密码不一致');
    }
})

function sureNAButton(){
      
        var accountName=$(".newAdminPop input[name=account]").val(),
            phone=$(".newAdminPop input[name=contact]").val(),
            remark=$(".newAdminPop input[name=remark]").val(),
            pwd = $(".newAdminPop input[name=pwd]").val(),
            pwdd = $(".newAdminPop input[name=pwdd]").val(),
            authpwd = $(".newAdminPop input[name=authpwd]").val(),
            $form_tips = $('.newAdminPop .form-tips');

        for(var i = 0; i < $form_tips.length; i++){
            if($form_tips.eq(i).css('display') != 'none'){
                return;
            }
        }
        if(pwd == pwdd){
            $("input[name=pwd]").siblings('font').hide();
        }else{
            $("input[name=pwdd]").siblings('font').show();
            return;
        }
        if($(".newAdminPop select").val()==1){
           
            if($(".newAdminPop select").val()==0){
                var group="admin";
            }else{
                var group="audit";
            }

           
            var dataa={"group":group,"name":accountName,"phone":phone,"remark":remark,"password":hex_sha1(pwd)};
            $.ajax({
                url:'/mgr/user/_create',
                data:JSON.stringify(dataa),
                type:'POST',
                contentType:'text/plain',
                headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
                error:function(xhr,textStatus,errorThrown){
		        	if(xhr.status==401){
		        	    parent.window.location.href='/';
		        	}
		        },
                success:function(data){
                    if(data.errno==0){
                        selectaccountarr=[];
                        $(".tableContainer .tableth").prop("checked",false);
                        $(".newAdminPop .closeW").click();
                        accEvent();  
                    }else if(data.errno==-1&&data.errmsg.indexOf("1062")>0){
                        $(".delayHide").show();
                        $(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'> 账号已存在</span>");
                        setTimeout(function(){$(".delayHide").hide()},2000);
                    }else if(data.errno < 0){
                        $(".delayHide").show();
                        $(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'> 操作失败</span>");
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
// 修改权限弹层
function modifyPowerPop(a){
    adminid=parseInt($(a).parents("tr").attr("id"));
    shade();
    $(".modifyPowerPop").show();
    var powers=$(a).parents("tr").attr("powers");
    if(powers.indexOf("client")>0){
        $(".modifyPowerPop .selectPower").eq(0).prop("checked",true)   
    }else{
        $(".modifyPowerPop .selectPower").eq(0).prop("checked",false)   
    }
    if(powers.indexOf("policy")>0){
        $(".modifyPowerPop .selectPower").eq(1).prop("checked",true)   
    }else{
        $(".modifyPowerPop .selectPower").eq(1).prop("checked",false)   
    }
    if(powers.indexOf("distr")>0){
        $(".modifyPowerPop .selectPower").eq(2).prop("checked",true)   
    }else{
        $(".modifyPowerPop .selectPower").eq(2).prop("checked",false)   
    }
    if(powers.indexOf("leakrepair")>0){
        $(".modifyPowerPop .selectPower").eq(3).prop("checked",true)   
    }else{
        $(".modifyPowerPop .selectPower").eq(3).prop("checked",false)   
    }
    if(powers.indexOf("log")>0){
        $(".modifyPowerPop .selectPower").eq(4).prop("checked",true)   
    }else{
        $(".modifyPowerPop .selectPower").eq(4).prop("checked",false)   
    }
    if(powers.indexOf("tools")>0){
        $(".modifyPowerPop .selectPower").eq(5).prop("checked",true)   
    }else{
        $(".modifyPowerPop .selectPower").eq(5).prop("checked",false)   
    }

    if($(".modifyPowerPop .selectPower").length==$(".modifyPowerPop .selectPower:checked").length){
        $(".modifyPowerPop .pMTableth input[type=checkbox]").prop("checked",true)
    }else{
        $(".modifyPowerPop .pMTableth input[type=checkbox]").prop("checked",false)
    }
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
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
        	if(xhr.status==401){
        	    parent.window.location.href='/';
        	}else{
        		
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
        phone=$(".newAdminPop input[name=contact]").val(),
        remark=$(".newAdminPop input[name=remark]").val(),
        pwd = $(".newAdminPop input[name=pwd]").val(),
        authpwd = $(".newAdminPop input[name=authpwd]").val();

    if($(".newAdminPop select").val()==0){
        var group="admin";
    }else{
        var group="audit";
    }
    var powerarr=[];
    $(".powerManagePop .pMTable .selectPower:checked").each(function(){
        powerarr.push($(this).attr("name"))
    })
    var dataa={"group":group,"name":name,"phone":phone,"remark":remark,"privilege":powerarr,"password":hex_sha1(pwd)};
    $.ajax({
        url:'/mgr/user/_create',
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
            if(data.errno==0){
                $(".tableContainer .tableth input[type=checkbox]").prop("checked",false);
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
            }else if(data.errno < 0){
                $(".delayHide").show();
                $(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'> 操作失败</span>");
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
    adminid=parseInt($(a).parents("tr").attr("id"));

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
    // if($(a).parents("tr").find("td").eq(4).html()=="普通管理员"){
    //     $(".modifyInfPop select").val(0);
    //     $(".modifyInfPop input[name=account]").prop("disabled",false);
    //     $(".modifyInfPop .notice").show();
    //     $(".modifyInfPop .auditorIn").hide();
    // }else if($(a).parents("tr").find("td").eq(4).html()=="审计员"){
    //     $(".modifyInfPop select").val(1);
    //     $(".modifyInfPop input[name=account]").prop("disabled",false);
    //     $(".modifyInfPop .notice").show();
    //     $(".modifyInfPop .auditorIn").show();
    // }else{
    //     $(".modifyInfPop select").val(2);
    //     $(".modifyInfPop input[name=account]").prop("disabled",true);
    //     $(".modifyInfPop .notice").hide();
    //     $(".modifyInfPop .auditorIn").hide();
    // }
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
            headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
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
                }else if(data.errno < 0){
                    $(".delayHide").show();
                    $(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'> 操作失败</span>");
                    setTimeout(function(){$(".delayHide").hide()},2000);
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
var $new_pwd = $("#new_pwd");
var $sure_pwd = $("#sure_pwd");

//密码
$new_pwd.keyup(function(event){
    event = event?event:window.event;
    if(event.keyCode == 9){
        return;
    }
    
    var reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,32}$/,
        regx = /^\S+$/,
        that = $(this),
        val = that.val();

        if(!regx.test(val)){
            that.siblings('font').show().html('密码不可包含空格');
            return;
        }  
        if($sure_pwd.val() != ""){
            if($sure_pwd.val() == val){
                $sure_pwd.siblings('font').hide();
            }else{
                $sure_pwd.siblings('font').show();
            }
        }
        if(!reg.test(val)){
            that.siblings('font').show().html('密码必须由8-32位大小写字母、数字、特殊字符组成');
            return;
        }
      
       that.siblings('font').hide();

}).blur(function(){
    var val = $(this).val();
    if(val == ''){
       $(this).siblings('font').show().html('请输入密码');
    }
})

//确认密码
$sure_pwd.keyup(function(event){
    event = event?event:window.event;
    if(event.keyCode == 9){
        return;
    }
    var val = $(this).val();
    if(val == $new_pwd.val()){
        $(this).siblings('font').hide();
    }else{
        $(this).siblings('font').show();
    }
}).blur(function(){
    var val = $(this).val();
    if(val == ''){
       $(this).siblings('font').show().html('两次输入密码不一致');
    }
})

function pwResetPop(a){
   
    adminid=parseInt($(a).parents("tr").attr("id"));
    var adminname=$(a).parents("tr").find("td").eq(1).children().html();
   
    $(".pwResetPop").show();
    $(".pwResetPop input").val('');
    $(".pwResetPop .form-tips").hide();
    $(".pwResetPop .placeholder").show();
    $(".pwResetPop input[name=account]").val(adminname)
    .attr('disabled', true);
    
    shade();
   
}

function surePwResetButton(){
    var pwd = $(".pwResetPop input[name=pwd]").val();
    var sureP = $("#sure_pwd").val();
    var authpwd = $(".pwResetPop input[name=authpwd]").val();
    var $form_tips = $('.pwResetPop .form-tips');
    for(var i = 0; i < $form_tips.length; i++){
        if($form_tips.eq(i).css('display') != 'none'){
            return;
        }
    }
   
    if(pwd == sureP){
        $("#new_pwd").siblings('font').hide();
    }else{
        $("#sure_pwd").siblings('font').show();
        return;
    }
    var dataa = {"id":adminid, "newpwd": hex_sha1(pwd)};

    $.ajax({
        url:'/mgr/user/_repwd',
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
            if(data.errno==0){
                $(".pwResetPop .closeW").click();
                accEvent();
                $(".delayHideS").show();
                $(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> 操作成功</span>");
                setTimeout(function(){$(".delayHideS").hide()},2000);
            }else{
                $(".delayHide").show();
                $(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'> 操作失败</span>");
                setTimeout(function(){$(".delayHide").hide()},2000);
            }
            
        }
    })
}
// 停用弹层
function stopPop(a){
    adminid=parseInt($(a).parents("tr").attr("id"));
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
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
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
    adminid=parseInt($(a).parents("tr").attr("id"));
    var dataa={"id":adminid,"State":1};
    $.ajax({
        url:'/mgr/user/_update',
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
            headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
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
                    $(".tableContainer .tableth input[type=checkbox]").prop("checked",false);
                    $(".deleteAdminPop .closeW").click();
                    if(index==selectaccountarr.length-1){
                    	accEvent();
                    }
                    
                }
                
            }
        })
    })
    
}
//调整页面内元素高度
var mainlefth=parent.$("#iframe #mainFrame").height();

$(".main .table").css({height:mainlefth-296});

window.onresize = function(){
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .table").css({height:mainlefth-296});

}

