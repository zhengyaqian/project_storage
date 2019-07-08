
//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a[name='tacticsArrange.html']").addClass("current");
parent.$(".nav .container a[name='tacticsArrange.html']").siblings().removeClass("current");
parent.$(".footer").show();

document.cookie='page=trustZone.html';


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
    trustZone();
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
	
	var currentPage = $(this).parents('.bgContainer').find('.tcdPageCode span.current').text();
	var currentNum = $(this).parents('.bgContainer').find('#numperpageinput').val();

	var start = (parseInt(currentPage) - 1) * parseInt(currentNum);
	trustZone(start);
})
// loading执行
trustZone();
// 信任区
function trustZone(start){
    if(start == undefined) {
		start = 0;
	}else{
		start = start;
	}
    var dataa={"view":{"begin":start,"count":numperpage}};
    var type = $('.bgContainer .tableth th.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.bgContainer .tableth th.th-ordery.th-ordery-current').attr('class');
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

    $(".table table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
  
    $.ajax({
        url:'/mgr/whitelist/_list',
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
            var total=Math.ceil(data.data.view.total/numperpage);
            table+="<table>";
            table+="<tr id='tableAlign'>";
            table+="<td width='30%'>信任的项目</td>";
            table+="<td width='30%'>备注</td>";
            table+="<td width='13%'>项目类型</td>";
            table+="<td width='15%'>信任文件动作</td>";
            table+="<td width='12%'>删除</td>";
            table+="</tr>";

            for(i=0;i<list.length;i++){
                table+="<tr id='"+list[i].id+"'>";
                table+="<td><span class='projectNameW'  title='"+safeStr(list[i]["data.value"])+"'>"+safeStr(list[i]["data.value"])+"</span></td>";
                if(!("remark" in list[i])){
                    table+="<td><span class='projectNameW'>(无)</span></td>";
                }else{
                    table+="<td><span class='projectNameW' title='"+safeStr(list[i].remark)+"'>"+safeStr(list[i].remark)+"</span></td>";
                }
                if(list[i]["data.type"]=="path"){
                    table+="<td>文件路径</td>";
                }else{
                    table+="<td>文件校验和</td>";
                }

                if(list[i].action==true){
                    table+="<td><input type='checkbox' class='verticalMiddle' onclick='updateTrustP(this)' checked></td>";
                }else{
                    table+="<td><input type='checkbox' class='verticalMiddle' onclick='updateTrustP(this)'></td>";
                }
                table+="<td><a onclick='deleteTP(this)' class='cursor underline blackfont'>删除</a></td>";
                table+="</tr>";
            }
            table+="</table>";
            if(list.length==0){
                $(".bgContainer .table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>"); 
            }else{
                $(".bgContainer .table").html(table);
            }
            

            $(".clearfloat").remove();
            $(".tcdPageCode").remove();
            $(".totalPages").remove();
            $(".numperpage").remove();
           
           $(".bgContainer").append("<a style='font-size:12px;color:#6a6c6e;padding-top:20px;padding-left:20px;float:left;' class='totalPages'>共 "+data.data.view.total+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-right:20px;'></div><a style='font-size:12px;float:right;padding-top:15px;padding-right:20px;color:#6a6c6e' class='numperpage'>每页<input type='text' id='numperpageinput' value="+numperpage+" style='font-size:12px;width:40px;height:24px;margin:0 4px;vertical-align:middle;padding:0 10px;'>条</a><div class='clear clearfloat'></div>");
            var current = (dataa.view.begin/dataa.view.count) + 1;
            $(".bgContainer .tcdPageCode").createPage({
                pageCount:total,
                current:parseInt(current),
                backFn:function(pageIndex){
                    $(".table table").html("");
                    dataa.view.begin = (pageIndex - 1) * numperpage;
                    $(".table table").html("<div style='text-align:center;color:#6a6c6e;padding-top:340px;'><img src='images/loading.gif'></div>");
                    $.ajax({
                        url:'/mgr/whitelist/_list',
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
                            table="<table>";
                            table+="<tr id='tableAlign'>";
                            table+="<td width='30%'>信任的项目</td>";
                            table+="<td width='30%'>备注</td>";
                            table+="<td width='13%'>项目类型</td>";
                            table+="<td width='15%'>信任文件动作</td>";
                            table+="<td width='12%'>删除</td>";
                            table+="</tr>";
                            for(i=0;i<list.length;i++){
                                table+="<tr id='"+list[i].id+"'>";
                                table+="<td><span class='projectNameW'  title='"+safeStr(list[i]["data.value"])+"'>"+safeStr(list[i]["data.value"])+"</span></td>";
                                if(!("remark" in list[i])){
                                    table+="<td><span class='projectNameW'>(无)</span></td>";
                                }else{
                                    table+="<td><span class='projectNameW'  title='"+safeStr(list[i].remark)+"'>"+safeStr(list[i].remark)+"</span></td>";
                                }
                                if(list[i]["data.type"]=="path"){
                                    table+="<td>文件路径</td>";
                                }else{
                                    table+="<td>文件校验和</td>";
                                }

                                if(list[i].action==true){
                                    table+="<td><input type='checkbox' class='verticalMiddle' onclick='updateTrustP(this)' checked></td>";
                                }else{
                                    table+="<td><input type='checkbox' class='verticalMiddle' onclick='updateTrustP(this)'></td>";
                                }
                                table+="<td onclick='deleteTP(this)' class='cursor'>删除</td>";
                                table+="</tr>";
                            }
                            table+="</table>"; 	
                            $(".bgContainer .table").html(table);
                        }
                    })
                }
            })

            
          
        }
    })
   

}
// 选择信任项目添加类型时触发
$("input[name='data.type']").change(function(){
    if($(this).index("input[name='data.type']")==0){
        $("input[name='data.value']").eq(1).prop("disabled",true);
        $("input[name='remark']").eq(1).prop("disabled",true);
        $("input[name='data.value']").eq(0).prop("disabled",false);
        $("input[name='remark']").eq(0).prop("disabled",false);
        $(this).parents(".setBlockk").siblings(".setBlockk").eq(0).show();
        $(this).parents(".setBlockk").siblings(".setBlockk").eq(1).hide();
        
    }else{
        $("input[name='data.value']").eq(0).prop("disabled",true);
        $("input[name='remark']").eq(0).prop("disabled",true);
        $("input[name='data.value']").eq(1).prop("disabled",false);
        $("input[name='remark']").eq(1).prop("disabled",false);
        $(this).parents(".setBlockk").siblings(".setBlockk").eq(0).hide();
        $(this).parents(".setBlockk").siblings(".setBlockk").eq(1).show();
        uploadFiles();
    }
})

function updateTrustP(a){
    var id=parseInt($(a).parents("tr").attr("id"));
    if($(a).is(":checked")){
        action=true;
    }else{
        action=false;
    }
    dataa={"id":id,"action":action};
    $.ajax({
        url:'/mgr/whitelist/_update',
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

        }
    })
}

//关闭弹层
$(".closeW").click(function(){
    $(".shade").hide();
    parent.$(".topshade").hide();
    $(this).parent().parent().hide();
});
//关闭遮罩和弹窗
function hideButton(a){
    $(".shade").hide();
    parent.$(".topshade").hide();
    $(a).parents(".pop").hide();
}
//弹出新建信任项目弹层
function newTrustPPop(){
    shade();
    $(".newTrustPPop").show();
    $(".newTrustPPop input[value=path]").prop("checked",true);
    $(".newTrustPPop input[name='data.value']").eq(1).prop("disabled",true);
    $(".newTrustPPop input[name='remark']").eq(1).prop("disabled",true);
    $(".newTrustPPop input[name='data.value']").eq(0).prop("disabled",false);
    $(".newTrustPPop input[name='remark']").eq(0).prop("disabled",false);
    $(".newTrustPPop input[name='action']").prop("checked",false);
    $(".newTrustPPop input[type='text']").val("");
    $(".newTrustPPop input[type='file']").val("");
    $(".newTrustPPop .setBlockk").eq(1).show();
    $(".newTrustPPop .setBlockk").eq(2).hide();
}
//改变新建信任项目中的上传文件时将文件名称显示在下面的备注文本框内
$(".newTrustPPop input[type='file']").change(function(){
    var filenametext=$(".newTrustPPop input[type='file']").val();
    var index=filenametext.lastIndexOf("\\");
    filenametext=filenametext.substring(index+1);
    if(filenametext.length>40){
        filenametext=filenametext.substring(0,40)+"..."; 
    }
   

    $(".newTrustPPop input[name='remark']").eq(1).val(filenametext);
})

//提交新建信任项目
function submitTP(a){
    if($("input[value='path']").is(":checked") && trim($("input[name='data.value'][type=text]").val())==""){
        $(".delayHide").show();
        $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 请填写名称!");
        setTimeout(function(){$(".delayHide").hide()},2000);
    }else if($("input[value='sha1']").is(":checked") && $("input[name='data.value'][type=file]").val()==""){
        $(".delayHide").show();
        $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 请选择文件!");
        setTimeout(function(){$(".delayHide").hide()},2000);
    }else{
            var action = $('#form input[name=action]').is(':checked');
            var checked;
            if(action){
                checked = 'checked';
            }else{
                checked = '';
            }
            uploader.options.formData = { formData: { "fileVal": 'data.value', "data.type": 'sha1', "remark": $('#form input[name=remark]').val(),"action":  checked}}; 
            
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
                 trustZone();
                 $(".newTrustPPop .buttons a").eq(1).click();
	             
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
    
}

//添加信任条目--信任文件校验和--上传文件
var uploader;
function uploadFiles(){
    uploader =new WebUploader.Uploader({
	
	    // swf文件路径
	    swf: 'js/webuploader-0.1.5/Uploader.swf',
	    // 文件接收服务端。
        server: '/mgr/whitelist/_create',
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
	var $name = $('.newTrustPPop input[name=remark]');
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
}

//弹出删除

function deleteTP(a){
    $(".deleteTPPop .describe .name").html($(a).parents("tr").find("td").eq(0).html());
    id=parseInt($(a).parents("tr").attr("id"));
    shade();
    $(".deleteTPPop").show(); 
}



function sureDeleteButton(a){

        $.ajax({
            url:'/mgr/whitelist/_delete?id='+id,
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
                trustZone();
                hideButton(a);
            }
        });  
}




//调整页面内元素高度
var mainlefth=parent.$("#iframe #mainFrame").height();

$(".main .trustTable").css({height:mainlefth-336});
window.onresize = function(){
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .trustTable").css({height:mainlefth-336});
}

