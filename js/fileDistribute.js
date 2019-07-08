
//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a[name='softwareStatistics.html']").addClass("current");
parent.$(".nav .container a[name='softwareStatistics.html']").siblings().removeClass("current");
parent.$(".footer").show();
document.cookie='page=fileDistribute.html';
//调整页面内元素高度
var mainlefth=parent.$("#iframe #mainFrame").height();

$(".main .table").css({height:mainlefth-347});
$(".fDTableTabContainer").css({height:mainlefth-260});

window.onresize = function(){
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .table").css({height:mainlefth-347});
    $(".fDTableTabContainer").css({height:mainlefth-260});

}
// 点击文件类型刷新文件列表
$(".fDTableTab a").click(function(){
	$(this).addClass("current");
	$(this).siblings("a").removeClass("current");
	softlist();
})
// 搜索框离开键盘触发搜索
$("#searchKey").keyup(function(){
    softlist();
})
// ie限制文本域字数
// $('.uploadPop form textarea').keyup(function(){
//     if($(this).val().length>20){
//         $($(this).val($(this).val().substring(0,20)))
//     }
// })
// 选择文件改变下载链接
$(".fileDistributeTContainer").on("click","input[name=filename]",function(){

    var filename=$(this).next().html();
    var isExist = isImageExist("/distr/"+filename);
    if(isExist){
        $(".functionButtonsBlock a").eq(2).attr("href","/distr/"+filename);
    }else{
        $(".delayHide").show();
        $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 文件不存在！");
        setTimeout(function(){$(".delayHide").hide()},2000);
    }
   
})
//判断图片是否存在
function isImageExist(url){
    if(url.length==0){
        return false;
    }
    var isExist=true;
    $.ajax(url, {
         type: 'head',
         async:false,//取消ajax的异步实现
         timeout: 1000,
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
         success: function() {
         },
         error: function() {
            isExist = false;  
         }
    });
    return isExist;
}
//分发文件终端选择改变时全选input的变化
$("body .providePop .terminallist").on("change",".td input[type=checkbox]",function(){

    if($(".td input[type=checkbox]:checked").length==($(".td input[type=checkbox]").length)){
        $(".providePop .terminallist .th input[type=checkbox]").prop("checked",true);
        
    }else{
        $(".providePop .terminallist .th input[type=checkbox]").prop("checked",false);
    }
})
//添加分发上传文件时将文件名称显示在下面的名称框内
$(".uploadPop input[type='file']").change(function(){
    var filenametext=$(".uploadPop input[type='file']").val();
    var index=filenametext.lastIndexOf("\\");
    filenametext=filenametext.substring(index+1);
    // if(filenametext.length>20){
    //     filenametext=filenametext.substring(0,20)+"...";
    // }

    $(".uploadPop input[name='name']").val(filenametext);
})
// 下载按钮
$(".downloadB").click(function(){
    if($(".fileDistributeTContainer input[name=filename]:checked").length==0){
        $(this).removeAttr("href");
        $(".delayHide").show();
        $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 请选择文件");
        setTimeout(function(){$(".delayHide").hide()},2000);
    }else{
        // var filename=$(".fileDistributeTContainer input[name=filename]:checked").next().html();
        // window.open('/distr/'+filename);
    }
    
})
// 确认删除文件
function sureDeleteButton(a){
    var fileid=parseInt($(".fileDistributeTContainer input[name=filename]:checked").parents("tr").attr("fileid"));
    $.ajax({
        url:'/mgr/distr/_delete?id='+fileid,
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
            $(".deleteFPop .buttons a").eq(0).click();
            softlist();
            // 添加成功提示
            $(".delayHideS").show();
            $(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> 操作成功</span>");
            setTimeout(function(){$(".delayHideS").hide()},2000);
        }
    }); 
}


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
    softlist();
})
//排序

$(document).on('click','.fileDistributeTContainer .tableth th.th-ordery',function(){
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
	
	softlist();
})
// 软件列表
softlist();
var ajaxtable=null;
function softlist(){
    if(ajaxtable){
    ajaxtable.abort();  
    }
    var start=0;
	var type=$(".fDTableTab .current").attr("type");
	var filtername=trim($("#searchKey").val());
	var dataa={"type":type,"filter":{"filename":filtername},"view":{"begin":0,"count":numperpage}};
	

	var type1 = $('.fileDistributeTContainer .tableth th.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.fileDistributeTContainer .tableth th.th-ordery.th-ordery-current').attr('class');
	var ordery;
	var order = {};
	dataa.order = [];
	if(orderClass == 'th-ordery th-ordery-current th-ordery-up th-ordery-down'){
		ordery = 'desc';
	}else if(orderClass == 'th-ordery th-ordery-current th-ordery-up'){
		ordery = 'asc';
	}
	if(type1){
		order[type1] = ordery;
		dataa.order.push(order);
	}
    $(".fileDistributeTContainer .table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
     ajaxtable=
	$.ajax({
		url:'/mgr/distr/_list',
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
            var wholenum=0;
            var total=Math.ceil(data.data.view.total/numperpage);
            if(data.data.typeclass!==null){
               var numlist=data.data.typeclass;
               var namearr=[];
                for (var i = 0; i < numlist.length; i++) {
                    wholenum+=numlist[i].count;
                    namearr.push(numlist[i].name);
                    if(numlist[i].name=="exe"){
                       $(".fDTableTab font").eq(1).html("("+numlist[i].count+")"); 
                    }else if(numlist[i].name=="doc"){
                        $(".fDTableTab font").eq(2).html("("+numlist[i].count+")"); 
                    }else if(numlist[i].name=="pk"){
                        $(".fDTableTab font").eq(3).html("("+numlist[i].count+")"); 
                    }else if(numlist[i].name=="unknow"){
                        $(".fDTableTab font").eq(4).html("("+numlist[i].count+")"); 
                    }
                    
                };
                if(isInArray(namearr,"exe")==false){
                   $(".fDTableTab font").eq(1).html("(0)");  
                }
                if(isInArray(namearr,"doc")==false){
                   $(".fDTableTab font").eq(2).html("(0)");  
                }
                if(isInArray(namearr,"pk")==false){
                   $(".fDTableTab font").eq(3).html("(0)");  
                }
                if(isInArray(namearr,"unknow")==false){
                   $(".fDTableTab font").eq(4).html("(0)");  
                }
                $(".fDTableTab font").eq(0).html("("+wholenum+")");  
            }else{
            	$(".fDTableTab font").eq(0).html("0"); 
            	$(".fDTableTab font").eq(1).html("0"); 
            	$(".fDTableTab font").eq(2).html("0"); 
            	$(".fDTableTab font").eq(3).html("0"); 
            	$(".fDTableTab font").eq(4).html("0"); 
            }
            

            table+="<table>";
			table+="<tr id='tableAlign'>";
            table+="<td width='33%'>文件名称</td>";
            table+="<td width='29%'>备注</td>";
            table+="<td width='9%'>文件大小</td>";
            table+="<td width='19%'>上传时间</td>";
            table+="</tr>";
            for (var i = 0; i < list.length; i++) {
            	table+="<tr fileid="+list[i].id+">";
	            table+="<td><input type='radio' name='filename' class='verticalMiddle'>&nbsp;&nbsp;&nbsp;&nbsp;<span class='verticalTop nameWidth' title="+safeStr(pathtitle(list[i].name))+">"+safeStr(list[i].name)+"</span></td>";
                if(trim(list[i].remark)==""){
                    table+="<td>(无)</td>";
                }else{
                    table+="<td><span class='nameWidth verticalTop' title="+pathtitle(safeStr(list[i].remark))+">"+safeStr(list[i].remark)+"</span></td>";
                }
	            if(list[i].size<1048576){
                    table+="<td>"+round(list[i].size/1024,1)+"K</td>";
                }else if(list[i].size>=1048576 && list[i].size<1073741824){
                    table+="<td>"+round(list[i].size/1048576,1)+"M</td>";
                }else if(list[i].size>=1073741824 && list[i].size<1099511627776){
                    table+="<td>"+round(list[i].size/1073741824,1)+"G</td>";
                }else if(list[i].size>=1099511627776){
                    table+="<td>"+round(list[i].size/1073741824,1)+"T</td>";
                }
	            
	            table+="<td>"+getLocalTime(list[i].upts)+"</td>";
	            table+="</tr>";
            };
            table+="</table>";
            if(list.length==0){
            	$(".fileDistributeTContainer .table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
            }else{
            	$(".fileDistributeTContainer .table").html(table);
            }
            

            $(".clearfloat").remove();
            $(".tcdPageCode").remove();
            $(".totalPages").remove();
            $(".numperpage").remove();
            $(".fileDistributeTContainer").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left' class='totalPages'>共 "+data.data.view.total+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><a style='font-size:12px;float:right;line-height:54px;padding-right:20px;color:#6a6c6e' class='numperpage'>每页<input type='text' id='numperpageinput' value="+numperpage+" style='font-size:12px;width:40px;height:24px;margin:0 4px;vertical-align:middle;padding:0 10px;'>条</a><div class='clear clearfloat'></div>");
            $(".fileDistributeTContainer .tcdPageCode").createPage({
                pageCount:total,
                current:1,
                backFn:function(pageIndex){
                    $(".table table").html("");
                    start=(pageIndex-1)*numperpage;
                    dataa={"type":type,"filter":{"filename":filtername},"view":{"begin":start,"count":numperpage}};
                    $("fileDistributeTContainer .table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
                    ajaxtable=
                    $.ajax({
                        url:'/mgr/distr/_list',
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
                            table+="<td width='33%'>文件名称</td>";
                            table+="<td width='29%'>备注</td>";
                            table+="<td width='9%'>文件大小</td>";
                            table+="<td width='19%'>上传时间</td>";
                            table+="</tr>";
                            for (var i = 0; i < list.length; i++) {
                                table+="<tr fileid="+list[i].id+">";
                                table+="<td><input type='radio' name='filename' class='verticalMiddle'>&nbsp;&nbsp;&nbsp;&nbsp;<span class='verticalTop nameWidth' title="+safeStr(pathtitle(list[i].name))+">"+safeStr(list[i].name)+"</span></td>";
                                if(trim(list[i].remark)==""){
                                    table+="<td>(无)</td>";
                                }else{
                                    table+="<td><span class='nameWidth verticalTop' title="+pathtitle(safeStr(list[i].remark))+">"+safeStr(list[i].remark)+"</span></td>";
                                }
                                if(list[i].size<1048576){
                                    table+="<td>"+round(list[i].size/1024,1)+"K</td>";
                                }else if(list[i].size>=1048576 && list[i].size<1073741824){
                                    table+="<td>"+round(list[i].size/1048576,1)+"M</td>";
                                }else if(list[i].size>=1073741824 && list[i].size<1099511627776){
                                    table+="<td>"+round(list[i].size/1073741824,1)+"G</td>";
                                }else if(list[i].size>=1099511627776){
                                    table+="<td>"+round(list[i].size/1073741824,1)+"T</td>";
                                }
                                
                                table+="<td>"+safeStr(getLocalTime(list[i].upts))+"</td>";
                                table+="</tr>";
                            };
                            table+="</table>";

                            $(".fileDistributeTContainer .table").html(table);


                        }
                    })

                }
            })
		}
    });
}
// 保留一位小数
function round(v,e){
    var t=1;
    for(;e>0;t*=10,e--);
    for(;e<0;t/=10,e++);
    return Math.round(v*t)/t;
}
// 近期任务
$(".uninstallMB").click(function(){
	$(".recentTaskPop").show();
	recentTaskAjax();
})
//近期任务弹层列表悬浮效果
$(".recentTaskPop .content .container").on("mouseenter",".list",function(){
    $(this).find(".showTaskTerIcon").css({backgroundPosition:"-18px"})
})
$(".recentTaskPop .content .container").on("mouseleave",".list",function(){
    $(this).find(".showTaskTerIcon").css({backgroundPosition:"0px"})
})
// 近期任务列表ajax
function recentTaskAjax(){
    $.ajax({
        url:'/mgr/task/_recent?type=msg_distrfile',
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
            var list=data.data.list;
            
            var html="";
            for (var i = 0; i < list.length; i++) {
                var createtime=list[i].create_time;
                createtime=getLocalTime(createtime);
                html+="<div class='list' taskid='"+list[i].task_id+"'>";
                html+="<span class='td cursor firsttd' onclick='showTaskTer(this)'>"+safeStr(createtime)+"</span>";
                html+="<span class='td cursor' onclick='showTaskTer(this)'>"+list[i].client_done+"/"+list[i].client_all+"</span>";
                if(list[i].status==0){
                    html+="<span class='td cursor' onclick='showTaskTer(this)'>正在分发</span>";
                }else{
                    html+="<span class='td cursor' onclick='showTaskTer(this)'>分发结束</span>";
                }
                html+="<a onclick='showTaskTer(this)' class='showTaskTerIcon verticalMiddle cursor'></a>";
                html+="</div>";
                html+="<div class='table'>";
                html+="<table>";
                html+="<tr class='th'>";
                html+="<th width='120'>终端分组</th>";
                html+="<th width='100'>终端名称</th>";
                html+="<th width='120'>IP地址</th>";
                html+="<th width='120'>任务状态</th>";
                html+="<th width='200'>备注</th>";
                html+="</tr>";
                html+="</table>";
                html+="</div>";

                
            };
            if(list.length==0){
            	$(".recentTaskPop .content .container").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
            }else{
            	$(".recentTaskPop .content .container").html(html);
            }
            

        }
    });
}
//展开或关闭任务相关终端模块
function showTaskTer(a){
    if($(a).parent().next().is(":hidden")){
        $(a).parent().next().siblings(".table").hide();
        $(a).parent().children(".showTaskTerIcon").css({background:"url(images/task2.png)",backgroundPosition:"-18px"});
        $(a).parent().next().slideDown(200);
        var taskid=parseInt($(a).parent().attr("taskid"));
        dataa={"taskid":taskid,"view":{"begin":0,"count":20}};
        $.ajax({
                url:'/mgr/task/_clnt',
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
                    var html="";
                    var finsh_text = "";
                    var list=data.data.list;
                    html+="<table>";
                    html+="<tr>";
                    html+="<td width='50%'>分发文件 : <span class='filePath' title="+safeStr(pathtitle(data.data.param.name))+">"+safeStr(data.data.param.name)+"</span></td>";
                    if(data.data.param.show==true){
                        html+="<td width='50%'>通知 : <span class='filePath' title="+safeStr(pathtitle(data.data.param.text))+">"+safeStr(data.data.param.text)+"</span></td>";
                    }
                    
                    html+="</tr>";
                    html+="</table>";
                    html+="<table>";
                    html+="<tr class='th'>";
                    html+="<th width='28%'>终端分组</th>";
                    html+="<th width='28%'>终端名称</th>";
                    html+="<th width='16%'>状态</th>";
                    html+="<th width='28%'>备注</th>";
                    html+="</tr>";
                    for (var i = 0; i < list.length; i++) {
                        html+="<tr>";
                        if(list[i].groupname==""){
                            html+="<td>(已删除终端)</td>";
                        }else{
                            html+="<td>"+safeStr(list[i].groupname)+"</td>";
                        }
                        
                        html+="<td>"+safeStr(list[i].hostname)+"</td>";
                        if(list[i].status==0){
                            html+="<td>未响应</td>";
                            html+="<td>任务尚未被接受</td>";
                        }else if(list[i].status==1){
                            html+="<td>正在执行</td>";
                            html+="<td>任务正在执行</td>";
                        }else if(list[i].status==2){
                            if(list[i].message == 'completed'){
                                finsh_text = '任务完成'
                            }else if(list[i].message == 'conflict'){
                                finsh_text = '任务冲突'
                            }else if(list[i].message == 'timeout'){
                                finsh_text = '任务超时'
                            }else if(list[i].message == 'unsupported'){
                                finsh_text = '终端不支持'
                            }else if(list[i].message == 'failed'){
                                finsh_text = '执行失败'
                            }else if(list[i].message == 'refused'){
                                finsh_text = '用户拒绝'
                            }else{
                                finsh_text = list[i].message
                            }
                            html+="<td>任务完成</td>";
                            html+="<td>" + finsh_text + "</td>";
                        }else{
                            html+="<td>终端异常</td>";
                            html+="<td>终端服务异常，无法接受任务</td>";
                        }
                        html+="</tr>";
                    };
                    html+="</table>";
                    // html+="<a class='seeMore'>查看更多</a>";
                    $(a).parent().next().html(html);

                }       
        });

    }else{
        $(a).parent().next().hide();
        $(a).parent().children(".showTaskTerIcon").css({background:"url(images/task1.png)",backgroundPosition:"-18px"});
    }

};
//$(".uploadPop").hide();
//上传软件弹层
var uploader;
//var allMaxSize = 2;
$(document).on('click','.uploadB',function(){
	shade();
    $(".uploadPop").show();
    $('input[name=name]').val('');
    $('input[name=data]').val('');
    $('.uploader-list').html('');
    $('.uploadPop .remark').val('');
//  $('.uploadPop .textarea .placeholder').show();
    $('.uploadPop .placeholder').show();
	uploader =new WebUploader.Uploader({
	
	    // swf文件路径
	    swf: 'js/webuploader-0.1.5/Uploader.swf',
	    // 文件接收服务端。
        server: '/mgr/distr/_create',
        //文件数量
        fileNumLimit:1,
        fileSingleSizeLimit:2147483648,
	    // 选择文件的按钮。可选。
	    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
	    pick: '#picker',
	
	    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
	    resize: false,
    });
    //兼容ie8无法上传的问题
    uploader.options.headers = {'Accept' : 'application/x-ms-application, image/jpeg, application/xaml+xml, image/gif, image/pjpeg, application/x-ms-xbap, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/msword, */*', "HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')};
   
    var $list = $('#thelist');
	var $name = $('.uploadPop input[name=name]');
    //当文件被添加之前操作
    uploader.on( 'beforeFileQueued', function( file ){
        $list.empty();
        $name.empty();
        uploader.reset();
    });

	// 当有文件被添加进队列的时候
	
	uploader.on( 'fileQueued', function( file ) {
		if(file.name.length > 30){
			$(".delayHide").show();
            $(".delayHide").css('width','auto');
            $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 文件名称不能超过30个字符！");
            setTimeout(function(){$(".delayHide").hide()},2000);
            
            return false;
		}
	    $list.append( '<div id="' + file.id + '" class="item">' +
	        '<a class="info">' + file.name + '</a>' +
	    '</div>' );
	    
	    $list.siblings('.placeholder').hide();
	    $name.siblings('.placeholder').hide();
	    $name.val(file.name);
	    $('fileValue').val(file.name);
    })

	/**
     * 验证文件格式以及文件大小
     */
	uploader.on("error", function (type) {
        if (type == "Q_TYPE_DENIED") {
            $(".delayHide").show();
            $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 文件不能为空！");
            setTimeout(function(){$(".delayHide").hide()},2000);
        }else if (type == "F_EXCEED_SIZE") {
            $(".delayHide").show();
            $(".delayHide").css('width','auto');
            $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 文件大小不能超过2G！");
            setTimeout(function(){$(".delayHide").hide()},2000);
        }
    });
    
   
})


$("#ctlBtn").on('click', function() { 
		if(uploader.getFiles().length == 0){
			$(".delayHide").show();
            $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'>没有选择文件！");
            setTimeout(function(){$(".delayHide").hide()},2000);
		}else if(trim($(".uploadPop form input[name=name]").val())==""){
            $(".delayHide").show();
            $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'>名称不能为空！");
            setTimeout(function(){$(".delayHide").hide()},2000);
            
		}else{
			uploader.options.formData={ formData: { "fileVal": 'data',"remark": $('.uploadPop .remark').val(), "name1": $('.uploadPop input[name=name]').val() }}; 
        	uploader.upload(); 
         	var $li = $( '.progress' ),
		        $percent = $li.find('.percent');
		        $bar = $li.find('.bar');
	        // 文件上传过程中创建进度条实时显示。
			uploader.on( 'uploadProgress', function( file, percentage ) {
			    var percentVal = Math.ceil(percentage * 100) + '%';
                $bar.width(percentVal)
                $percent.html(percentVal);
                $('.uploading').show();
                $(".uploadingShade").show();

			});
		
	   
	        uploader.on( 'uploadSuccess', function( file ) {
	        	var percentVal = '100%';
                    $bar.width(percentVal)
                    $percent.html(percentVal);
                    
	            // 添加成功提示
	             $(".delayHideS").show();
	             $(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> 添加成功</span>");
	             setTimeout(function(){$(".delayHideS").hide()},2000);
	             softlist();
	             $(".uploadPop .buttons a").eq(0).click();
	             
	         });							
	         
	         uploader.on( 'uploadError', function( file,reason ) {
	         	
	         	if(reason == 'http'){
	         		parent.window.location.href='/';
	         	}else{
	         		$(".delayHideS").show();
	             	$(".delayHideS .p1").html("<img src='images/unusualw.png' class='verticalMiddle'><span class='verticalMiddle'> 操作失败</span>");
	             	setTimeout(function(){$(".delayHideS").hide()},2000);
	         	}
	             
	         });
	        uploader.on("uploadFinished",function() {
				$('.uploading').fadeOut();
				$(".uploadingShade").hide();
	             $('#picker').remove();
	             $('.btns').append('<div id="picker">选择文件</div>');
	        	 uploader.reset();
	             
	        });
         }
	    
         
});
//$(".uploadB").click(function(){
	
//	$(".uploadPop form input").val("");
//  $(".uploadPop form input[type=file]").wrap('<form></form>');
//  $(".uploadPop form input[type=file]").parent()[0].reset();
//  $(".uploadPop form input[type=file]").unwrap();
//	$(".uploadPop form textarea").val("");
    //判断浏览器是否为ie7或8
//  var browser=navigator.appName; 
//  if(browser=="Microsoft Internet Explorer"){
//      var b_version=navigator.appVersion; 
//      var version=b_version.split(";"); 
//      var trim_Version=version[1].replace(/[ ]/g,"");
//      if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0") 
//      { 
//
//      }else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0") 
//      { 
//
//      }else{ 
//          $(".uploadPop form input[name=data]").click();
//          
//      }  
//  }else{
//      $(".uploadPop form input[name=data]").click();
//  }
	
//})
// 提交表单
//function sureFUButton(a){
//  var exists="";
//  $.ajax({
//      url:'/mgr/distr/_fileinfo?name='+encodeURI($("form input[name=name]").val()),
//      data:{},
//      type:'GET',
//      contentType:'text/plain',
// headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
//      error:function(xhr,textStatus,errorThrown){
//      	if(xhr.status==401){
//      	    parent.window.location.href='/';
//      	}else{
//      		
//      	}
//          
//      },
//      success:function(data){
//	            if(data.data.exists==0){
//	                exists=0
//	            }else if(data.data.exists==1){
//	                exists=1;
//	            }
//	            var filesize = 0;
////				var  Sys = {};
////				if(navigator.userAgent.indexOf('NET') != -1 && navigator.userAgent.indexOf("rv") != -1){
////				    Sys.ie=true;
////				}
////				if(navigator.userAgent.indexOf("MSIE") != -1){
////				    Sys.ie=true;
////				}
////				var obj_file = document.getElementById("file");  
////				if(Sys.ie){
////			       var fso = new ActiveXObject("Scripting.FileSystemObject"); 
////			       var url = document.selection.createRange().text;  
////                 var filesize=fso.GetFile(url).size;
////			       var filesize = file.Size;//检测 上传文件大小
////			    }else{
//				    
//				    var obj_file = document.getElementById("file");  
//	
//	            	filesize = obj_file.files[0].size;  
////				}
//	             if(filesize == 0){
//	             	$(".delayHide").show();
//	                $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 文件不能为空！");
//	                setTimeout(function(){$(".delayHide").hide()},2000);
//	             }else{
//		            if($("form input[type=file]").val()==""){
//		                $(".delayHide").show();
//		                $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 文件不能为空");
//		                setTimeout(function(){$(".delayHide").hide()},2000);
//		            }else if(trim($("form input[name=name]").val())==""){
//		                $(".delayHide").show();
//		                $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 名称不能为空");
//		                setTimeout(function(){$(".delayHide").hide()},2000);
//		            }else if(exists==1){
//		                $(".delayHide").show();
//		                $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 文件名称已存在");
//		                setTimeout(function(){$(".delayHide").hide()},2000);  
//		            }else{
//		                $("form").submit();
//		                $(".uploadingShade").show();
//		                $(".uploading").show(); 
//		            }
//          	}
//      }
//  });
//}

// }
//终端名称排序


$(document).on('click','.terminallist p.th-ordery a i',function(){
	var toggleClass = $(this).parents('p').attr('class');
	if(toggleClass == 'th-ordery'){
		$(this).parents('p').addClass('th-ordery-current th-ordery-up');
		$(this).attr('class','fa fa-sort-asc');
	}else if(toggleClass == 'th-ordery th-ordery-current th-ordery-up'){
		$(this).parents('p').addClass('th-ordery-current th-ordery-down');
		$(this).attr('class','fa fa-sort-desc');
	}else if(toggleClass == 'th-ordery th-ordery-current th-ordery-up th-ordery-down'){
		$(this).parents('p').removeClass('th-ordery-current th-ordery-down th-ordery-up');
		$(this).attr('class','fa fa-sort');
	}
	
	terminallist();
})
//分发文件弹层
var terminalidarr=[];
var terminalidName = [];
// 终端列表中的多选框监听改变分发所选的终端
$(".providePop .terminallist .container").on("change","input[type=checkbox]",function(){
    var terminalid=parseInt($(this).parent().attr("terminalid"));
    var terminalname = $(this).siblings('span.verticalMiddle').text();
    if($(this).is(":checked")){
        
        terminalidarr.push(terminalid);    
        terminalidName.push(terminalname);
    }else{
        terminalidarr.splice(jQuery.inArray(terminalid,terminalidarr),1);
        terminalidName.splice(jQuery.inArray(terminalname,terminalidName),1);
    }
})
$(".providePop .terminallist .th").on("change","input[type=checkbox]",function(){
    if($(this).is(":checked")){
       $(".providePop .terminallist .container .td").each(function(){
            var terminalid=parseInt($(this).attr("terminalid"));
            var terminalname = $(this).find('span.verticalMiddle').text();
            if(isInArray(terminalidarr,terminalid)==false){
                terminalidarr.push(terminalid);
                terminalidName.push(terminalname);
            }
       }) 
    }else{
        $(".providePop .terminallist .container .td").each(function(){
            var terminalid=parseInt($(this).attr("terminalid"));
            if(isInArray(terminalidarr,terminalid)==true){
                terminalidarr.splice(jQuery.inArray(terminalid,terminalidarr),1);
                terminalidName.splice(jQuery.inArray(terminalname,terminalidName),1);
            }
        }) 
    }
})
$(".provideB").click(function(){
    if($(".fileDistributeTContainer input[name=filename]:checked").length==0){
        $(this).removeAttr("href");
        $(".delayHide").show();
        $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 请选择文件");
        setTimeout(function(){$(".delayHide").hide()},2000);
    }else{
        $(".providePop input[type=checkbox]").prop("checked",true);
        $(".provideNPop .textarea textarea").val("管理员正在进行分发任务，请配合管理员完成相关文件的阅读或者文件的下载安装操作。");
        terminalidarr=[];
        terminalidName = [];
        shade();
        $(".providePop").show();
        $("#searchKeyT").val("");
        $("#searchKeyT").next().show();
        $.ajax({
            url:'/mgr/group/_list',
            dataType:'json',
            data:{},
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
                html+="<a class='td block cursor current' clientnum="+data.data.all.clients+">所有分组</a>";
                html+="<a class='td block cursor' groupid="+data.data.ungrouped.group_id+" clientnum="+data.data.ungrouped.clients+">未分组终端</a>";
                for (var i = 0; i < list.length; i++) {
                    html+="<a class='td block cursor' groupid="+list[i].group_id+" clientnum="+list[i].clients+">"+safeStr(list[i].group_name)+"</a>";
                };
                $(".providePop .grouplist .container").html(html);

                terminallist();
                
            }
        });  
    }
    
})
$(".providePop").on("click",".grouplist .td",function(){
	$(this).siblings(".td").removeClass('current');
	$(this).addClass("current");
	
	terminallist();
})
$("#searchKeyT").keyup(function(){
	terminallist();
})
function terminallist(){
	var filtername=$("#searchKeyT").val();
	var count=parseInt($(".providePop .grouplist .container .current").attr("clientnum"));
	if($(".providePop .grouplist .container .current").index()==0){
	    var dataa={"view": {"begin": 0,"count": count},"filter":{"name":filtername}};	
	}else{
		var groupid=parseInt($(".providePop .grouplist .container .current").attr("groupid"));
		var dataa={"group_id":groupid,"view": {"begin": 0,"count": count},"filter":{"name":filtername}};
	}
	
	var type = $('.terminallist p.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.terminallist p.th-ordery.th-ordery-current').attr('class');
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
	$.ajax({
		url:'/mgr/clnt/_list',
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
			var html="";
            var checkednum=0;
			for (var i = 0; i < list.length; i++) {
                if(isInArray(terminalidarr,list[i].client_id)==true){
                    checkednum++;
                    html+="<a class='td block' terminalid="+list[i].client_id+"><input type='checkbox' class='verticalMiddle select' checked> <span class='verticalMiddle'> "+safeStr(list[i].hostname)+"</span></a>"; 
                }else{
                    html+="<a class='td block' terminalid="+list[i].client_id+"><input type='checkbox' class='verticalMiddle select'> <span class='verticalMiddle'> "+safeStr(list[i].hostname)+"</span></a>";
                }
				
			};
            if(checkednum==list.length && list.length>0){
                $(".providePop .terminallist .th input[type=checkbox]").prop("checked",true); 
            }else{
                $(".providePop .terminallist .th input[type=checkbox]").prop("checked",false);
            }
			$(".providePop .terminallist .container").html(html);
			
		}
    });

        
}
// 分发文件下一步按钮
function provideNButton(a){
    if(terminalidarr==""){
        $(".delayHide").show();
        $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 请选择终端");
        setTimeout(function(){$(".delayHide").hide()},2000);
    }else{
        var ter_name = terminalidName[terminalidName.length-1];
    
        var ter_num = terminalidarr.length;
        
        $(a).parents(".pop").hide();
        $(".provideNPop").show();
        var name_num = ter_name + '的终端等' + ter_num + '台';
        $(".provideNPop .ter_name span").html(name_num);
        $("#effTime").val(GetDateStr(1));
        $('#providePosition option').eq(0).prop('selected','selected');
        $('input[name=exeMethod]').eq(0).prop('checked','checked');
        terSH(1);
        $('#runPara').val('');
    }
	
}
// 分发文件上一步按钮
function providePButton(a){
	$(a).parents(".pop").hide();
	$(".providePop").show();
}
$("input[name=exeMethod]").click(function(){
    var index = $(this).index();
    terSH(index);
})
function terSH(index){
    

    if(index == 5){
        $('#providePosition option[value=1]').prop('selected','selected');
        $('#providePosition').prop("disabled",true);
        $('.tipsUser').prop("checked",false);
        $('.tipsUser').prop("disabled",true);
        $(".textarea textarea").prop("disabled",true);
    }else{
        $('.tipsUser').prop("checked",true);
        var check = $('.tipsUser').prop('checked');

        if(index == 3){
            $('.runParaP').hide();
        }else{
            $('.runParaP').show();
        }
        if(check == true){
            $('.textarea textarea').prop("disabled",false);
        }else{
            $('.textarea textarea').prop("disabled",true);
        }
        $('.tipsUser').prop("disabled",false);
        $('#providePosition').prop("disabled",false);
    }
}
$(document).on('click','.tipsUser',function(){
    var check = $(this).prop('checked');
    if(check == true){
        $('.textarea textarea').prop("disabled",false);
    }else{
        $('.textarea textarea').prop("disabled",true);
    }
})
// 确认分发分发文件按钮
function distributeFButton(a){
    var text=$(".provideNPop .textarea textarea").val();
    var tipsUser = $(".tipsUser").prop('checked');
    var exe_index = $("input[name=exeMethod]:checked").index();
    if(tipsUser == true){
        var show=true;
    }else{
        var show=false;
    }
    if($("#providePosition").val()==0){
        var saveto="%DESKTOP%";
    }else if($("#providePosition").val()==1){
        var saveto="%TEMP%";
    }else if($("#providePosition").val()==2){
        var saveto="%SYSROOT%";
    }
    if(exe_index==1){
        var launch=true;
    }else if(exe_index==3){
        var launch=false;
    }else if(exe_index==5){
        var background=true;
        var launch=true;
    }else{
        var background=false;
    }
    var name=$(".fileDistributeTContainer input[name=filename]:checked").next().html();
    var cmdline=$("#runPara").val();
    var effTime=getBeginTimes($("#effTime").val());
    var dataa={"type":"msg_distrfile","clients":terminalidarr,"param":{"text":text,"name":name,"show":show,"save.to":saveto,"launch":launch,"cmdline":cmdline,"effTime":effTime,"background":background}};
    $.ajax({
        url:'/mgr/distr/_distr',
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
        	if(data.errno == 0){
        		
	            $(".delayHideS").show();
	            $(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> 操作成功</span>");
	            setTimeout(function(){$(".delayHideS").hide()},2000);
        	}else if(data.errno == -1){
        		$(".delayHideS").show();
	            $(".delayHideS .p1").html("<img src='images/unusualw.png' class='verticalMiddle'><span class='verticalMiddle'> 操作失败</span>");
	            setTimeout(function(){$(".delayHideS").hide()},2000);
        	}else if(data.errno == -2){
        		$(".delayHideS").show();
	            $(".delayHideS .p1").html("<img src='images/unusualw.png' class='verticalMiddle'><span class='verticalMiddle'> 文件不存在</span>");
	            setTimeout(function(){$(".delayHideS").hide()},2000);
        	}
            $(a).parents(".pop").hide();
            $(".shade").hide();
            parent.$(".topshade").hide();
        }
    })

}
// 删除文件按钮
$(".deleteB").click(function(){
    if($(".fileDistributeTContainer input[name=filename]:checked").length==0){
        $(".delayHide").show();
        $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 请选择文件");
        setTimeout(function(){$(".delayHide").hide()},2000);
    }else{
        var filename=$(".fileDistributeTContainer input[name=filename]:checked").next().html();
        shade();
        $(".deleteFPop").show();
        $(".deleteFPop .describe").eq(1).html("<span style='width: 330px;text-overflow:ellipsis;overflow: hidden;white-space: nowrap;display: inline-block;'>"+safeStr(filename)+"</span>");
    }
    

})
//关闭弹层
$(".closeW").click(function(){
	$(".shade").hide();
	parent.$(".topshade").hide();
    $(this).parent().parent().hide();
    $('#picker').remove();
	$('.btns').append('<div id="picker">选择文件</div>');
//  uploader.destroy();
});
function hideButton(a){
	$(".shade").hide();
	parent.$(".topshade").hide();
	$(a).parent().parent().hide();
	$('#picker').remove();
	$('.btns').append('<div id="picker">选择文件</div>');
//  uploader.destroy();
}
//下发软件下一步弹层
$(".closeWW").click(function(){
    $(this).parent().parent().hide();
});

//卸载管理弹层
$(".uninstallMB").click(function(){
	shade();
	$(".uninstallMPop").show();
})

