//loading执行

$("#txtBeginDate").calendar();
$("#txtEndDate").calendar();
$("#txtBeginDate").val(GetDateStr(-6));
$("#txtEndDate").val(GetDateStr(0));
//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a[name='virusDefense.html']").addClass("current");
parent.$(".nav .container a[name='virusDefense.html']").siblings().removeClass("current");
parent.$(".footer").show();

document.cookie='page=historyTask.html';
//按钮样式

$(".bu").click(function(){
	$(this).siblings(".bu").removeClass("current");
	$(this).addClass("current");
});


//下拉列表
$("#status").change(function(){
    accEvent();
})
//类型选择
$("#functionBlock .bu").click(function(){
    accEvent();
    $('.tableth th.th-ordery').removeClass().addClass('th-ordery');
	$('.main .tableth').removeAttr('index indexCls');
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
        resizeTableHeight();
    }else if($(this).find("option:selected").val()==1){
        $("#txtBeginDate").val(GetDateStr(-29));
        $("#txtEndDate").val(GetDateStr(0));
        $(".filterBlock .middle").hide(200);
        resizeTableHeight();
    }else if($(this).find("option:selected").val()==2){
        $("#txtBeginDate").val(GetDateStr(-89));
        $("#txtEndDate").val(GetDateStr(0));
        $(".filterBlock .middle").hide(200);
        resizeTableHeight();
    }else if($(this).find("option:selected").val()==3){
        $("#txtBeginDate").val(GetDateStr(-364));
        $("#txtEndDate").val(GetDateStr(0));
        $(".filterBlock .middle").hide(200);
        resizeTableHeight();
    }else if($(this).find("option:selected").val()==4){
        $(".filterBlock .middle").show(200);
        resizeTableHeight(true);
    }
    accEvent();
})

//任务详情排序


$(document).on('click','.taskDetailPop .tableth th.th-ordery',function(){
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
	var currentPage = $(this).parents('.taskDetailPop').find('.tcdPageCode span.current').text();
	var currentNum = 9;
	var start = (parseInt(currentPage) - 1) * 9;
	taskDetailPop(start);
})
//弹出任务详情
$(document).on('click','.tableContainer .seeDetail',function(){
	$('.taskDetailPop .tableth th.th-ordery').removeClass().addClass('th-ordery');
	
	// 判断任务类型控制详情弹窗每页多少行
    
    $(".taskDetailPop").attr('trIndex',$(this).parents('tr').index());
    $(".taskDetailPop").show();
    shade();
    taskDetailPop();
})

var totalnum="";
var taskid="";
function taskDetailPop(start){
    if(start == undefined) {
		start = 0;
	}else{
		start = start;
	}
    var detailnumperpage=0;
    var trIndex=$(".taskDetailPop").attr('trIndex');
    
    
    var taskid=parseInt($('.tableContainer .table tr').eq(trIndex).attr('taskid'));
    var tasktypetxt=$('.tableContainer .table tr').eq(trIndex).find('td').eq(1).html();
    if(tasktypetxt=="通知任务"||tasktypetxt=="软件卸载"||tasktypetxt=="文件分发"){
        detailnumperpage=7;
    }else{
        detailnumperpage=9;
    }
    dataa={"taskid":taskid,"view":{"begin":start,"count":detailnumperpage}};
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
    var timetext=$('.tableContainer .table tr').eq(trIndex).find('td').eq(0).html();
    var totaltext=$('.tableContainer .table tr').eq(trIndex).find('td').eq(2).html();
    var executetext=$('.tableContainer .table tr').eq(trIndex).find('td').eq(3).html();
    
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
            var list=data.data.list;
            totalnum=data.data.view.total;
            var total=Math.ceil(totalnum/detailnumperpage);

            if(data.data.type=="quick_scan"){
                var configB="<span class='fastSKCB'></span>";
                $(".taskDetailPop .describe").removeClass("describebg");
                $(".taskDetailPop .describe").html("快速查杀时间  : "+timetext+configB);
                $(".taskDetailPop .softInf").hide();
                $(".taskDetailPop .taskDetailTable").height("313px");
                $(".taskDetailPop .messageTxt").hide();

                var first=data.data.param['scan.maxspeed'];
                var second=data.data.param['scan.sysrepair'];
                var third=data.data.param['clean.automate'];
                var fourth=data.data.param['clean.quarantine'];
                if(first==true){
                    $(".fastSKCPop input[name=scanOp]").eq(1).prop("checked",true);
                    $(".fastSKCPop input[name=scanOp]").eq(0).prop("checked",false);

                }else if(first==false){
                    $(".fastSKCPop input[name=scanOp]").eq(0).prop("checked",true);
                    $(".fastSKCPop input[name=scanOp]").eq(1).prop("checked",false);
                }
                if(second==true){
                    $(".fastSKCPop input[name=repairSet]").prop("checked",true);
                }else{
                    $(".fastSKCPop input[name=repairSet]").prop("checked",false);

                }
                if(third==true){
                    $(".fastSKCPop input[name=isHandle]").eq(0).prop("checked",true);
                    $(".fastSKCPop input[name=isHandle]").eq(1).prop("checked",false)
                }else if(third==false){
                    $(".fastSKCPop input[name=isHandle]").eq(1).prop("checked",true);
                    $(".fastSKCPop input[name=isHandle]").eq(0).prop("checked",false)
                }
                if(fourth==true){
                    $(".fastSKCPop input[name=afterClear]").prop("checked",true)
                }else{
                    $(".fastSKCPop input[name=afterClear]").prop("checked",false)
                }
                $(".fastSKCPop input").prop("disabled",true);
            }else if(data.data.type=="full_scan"){
                var configB="<span class='overallSKCB'></span>";
                $(".taskDetailPop .describe").removeClass("describebg");
                $(".taskDetailPop .describe").html("全盘查杀时间  : "+timetext+configB);
                $(".taskDetailPop .softInf").hide();
                $(".taskDetailPop .taskDetailTable").height("313px");
                $(".taskDetailPop .messageTxt").hide();

                var first=data.data.param['scan.maxspeed'];
                var second=data.data.param['scan.sysrepair'];
                var third=data.data.param['clean.automate'];
                var fourth=data.data.param['clean.quarantine'];
                var overallpara1=data.data.param['decompo.limit.size'].enable;
                var overallpara2=data.data.param['scan.exclusion.ext'].enable;
                var overallpara1V=data.data.param['decompo.limit.size'].value;
                var overallpara2V=data.data.param['scan.exclusion.ext'].value;
                if(first==true){
                    $(".overallSKCPop input[name=scanOp]").eq(1).prop("checked",true);
                    $(".overallSKCPop input[name=scanOp]").eq(0).prop("checked",false);
                }else{
                    $(".overallSKCPop input[name=scanOp]").eq(0).prop("checked",true);
                    $(".overallSKCPop input[name=scanOp]").eq(1).prop("checked",false);
                }
                if(second==true){
                    $(".overallSKCPop input[name=repairSet]").prop("checked",true)
                }else{
                    $(".overallSKCPop input[name=repairSet]").prop("checked",false)
                }
                if(third==true){
                    $(".overallSKCPop input[name=isHandle]").eq(0).prop("checked",true);
                    $(".overallSKCPop input[name=isHandle]").eq(1).prop("checked",false);
                }else{
                    $(".overallSKCPop input[name=isHandle]").eq(1).prop("checked",true);
                    $(".overallSKCPop input[name=isHandle]").eq(0).prop("checked",false);
                }
                if(fourth==true){
                    $(".overallSKCPop input[name=afterClear]").prop("checked",true)
                }else{
                    $(".overallSKCPop input[name=afterClear]").prop("checked",false)
                }

                if(overallpara1==true){
                    $(".overallSKCPop input[name=overallSet1]").prop("checked",true);
                    $(".overallSKCPop input[name=overallPara1]").val(overallpara1V);
                }else{
                    $(".overallSKCPop input[name=overallSet1]").prop("checked",false);
                    $(".overallSKCPop input[name=overallPara1]").val(overallpara1V);
                    $(".overallSKCPop input[name=overallPara1]").prop("disabled",true)
                }
                if(overallpara2==true){
                    $(".overallSKCPop input[name=overallSet2]").prop("checked",true);
                    $(".overallSKCPop input[name=overallPara2]").val(overallpara2V);
                }else{
                    $(".overallSKCPop input[name=overallSet2]").prop("checked",false);
                    $(".overallSKCPop input[name=overallPara2]").val(overallpara2V);
                    $(".overallSKCPop input[name=overallPara2]").prop("disabled",true)
                }
                $(".overallSKCPop input").prop("disabled",true);

            }else if(data.data.type=="msg_uninstall"){
                $(".taskDetailPop .describe").addClass("describebg");
                $(".taskDetailPop .describe").html("软件卸载时间  : "+timetext); 
                var softinf="<span>卸载软件 : "+safeStr(safeStr(data.data.param.software.name))+"    "+safeStr(data.data.param.software.version)+"</span><br/><span>软件发布者 : "+safeStr(data.data.param.software.publisher)+"</span>";
                $(".taskDetailPop .softInf").html(softinf);
                $(".taskDetailPop .softInf").show();
                $(".taskDetailPop .messageTxt").hide();
                $(".taskDetailPop .taskDetailTable").height("240px");
            }else if(data.data.type=="msg_distrfile"){
                $(".taskDetailPop .describe").addClass("describebg");
                $(".taskDetailPop .describe").html("文件分发时间  : "+timetext); 
                var softinf="<span class='distrfName'>分发文件 : "+safeStr(data.data.param.name)+"</span><br/><p>通知 : "+safeStr(data.data.param.text)+"</p>";
                $(".taskDetailPop .softInf").html(softinf);
                $(".taskDetailPop .softInf").show();
                $(".taskDetailPop .messageTxt").hide();
                $(".taskDetailPop .taskDetailTable").height("240px");
            }else if(data.data.type=="message"){
                $(".taskDetailPop .describe").addClass("describebg");
                $(".taskDetailPop .describe").html("通知时间  : "+safeStr(timetext)); 
                var messagetxt="<p>"+"通知内容 : "+safeStr(data.data.param.text)+"</p>";
                $(".taskDetailPop .messageTxt").html(messagetxt);
                $(".taskDetailPop .softInf").hide();
                $(".taskDetailPop .messageTxt").show();
                $(".taskDetailPop .taskDetailTable").height("240px");
            }else if(data.data.type=="update"){
                $(".taskDetailPop .describe").removeClass("describebg");
                $(".taskDetailPop .describe").html("升级时间  : "+timetext);  
                $(".taskDetailPop .softInf").hide();
                $(".taskDetailPop .messageTxt").hide();
                $(".taskDetailPop .taskDetailTable").height("313px");
            }else if(data.data.type=="shutdown"){
                $(".taskDetailPop .describe").removeClass("describebg");
                $(".taskDetailPop .describe").html("关机时间  : "+timetext);  
                $(".taskDetailPop .softInf").hide();
                $(".taskDetailPop .messageTxt").hide();
                $(".taskDetailPop .taskDetailTable").height("313px");
            }else if(data.data.type=="reboot"){
                $(".taskDetailPop .describe").removeClass("describebg");
                $(".taskDetailPop .describe").html("重启时间  : "+timetext);  
                $(".taskDetailPop .softInf").hide();
                $(".taskDetailPop .messageTxt").hide();
                $(".taskDetailPop .taskDetailTable").height("313px");
            }else if(data.data.type=="migrate"){
                $(".taskDetailPop .describe").addClass("describebg");
                $(".taskDetailPop .describe").html("迁移时间  : "+timetext); 
                if(data.data.param.group_name==""){
                    var softinf="<span class='distrfName'>迁移分组 : 全网终端</span><br/><p>迁移地址 : "+data.data.param.addr+"</p>";
                }else{
                    var softinf="<span class='distrfName'>迁移分组 : "+data.data.param.group_name+"</span><br/><p>迁移地址 : "+data.data.param.addr+"</p>";
                }
                
                $(".taskDetailPop .softInf").html(softinf);
                $(".taskDetailPop .softInf").show();
                $(".taskDetailPop .messageTxt").hide();
                $(".taskDetailPop .taskDetailTable").height("240px");
            }else if(data.data.type=="leakrepair_scan"){
                $(".taskDetailPop .describe").removeClass("describebg");
                $(".taskDetailPop .describe").html("漏洞扫描时间  : "+timetext);  
                $(".taskDetailPop .softInf").hide();
                $(".taskDetailPop .messageTxt").hide();
                $(".taskDetailPop .taskDetailTable").height("313px");
            }else if(data.data.type=="leakrepair_repair"){
                $(".taskDetailPop .describe").removeClass("describebg");
                $(".taskDetailPop .describe").html("漏洞修复时间  : "+timetext);  
                $(".taskDetailPop .softInf").hide();
                $(".taskDetailPop .messageTxt").hide();
                $(".taskDetailPop .taskDetailTable").height("313px");
            }else if(data.data.type=="vnc_launch"){
                $(".taskDetailPop .describe").removeClass("describebg");
                $(".taskDetailPop .describe").html("远程时间  : "+timetext);  
                $(".taskDetailPop .softInf").hide();
                $(".taskDetailPop .messageTxt").hide();
                $(".taskDetailPop .taskDetailTable").height("313px");
            }
            
            html+="<tr id='tableAlign'>";
            html+="<td width='25%'>终端分组</td>";
            html+="<td width='25%'>终端名称</td>";
            html+="<td width='25%'>任务状态</td>";
            html+="<td width='25%'>备注</td>";
            html+="</tr>";
            var finsh_text = "";
            for (var i = 0; i < list.length; i++) {
                html+="<tr>";
                if(list[i].groupname==""){
                    html+="<td>(已删除终端)</td>";
                }else{
                    html+="<td>"+safeStr(list[i].groupname)+"</td>";
                }
                html+="<td><span style='width:150px' class='filePath' title="+safeStr(pathtitle(list[i].hostname))+">"+safeStr(list[i].hostname)+"</span></td>";
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
            
            $(".taskDetailPop .taskDetailTable table").html(html);
            
            
            // 分页
            $(".taskDetailPop .clearfloat").remove();
            $(".taskDetailPop .tcdPageCode").remove();
            $(".taskDetailPop .totalPages").remove();
            $(".taskDetailPop").append("<a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>执行/下发   : "+executetext+"/"+totaltext+"</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><div class='clear clearfloat'></div>");
           var current = (dataa.view.begin/dataa.view.count) + 1;
           $(".taskDetailPop .tcdPageCode").createPage({
                pageCount:total,
                current:parseInt(current),
                backFn:function(pageIndex){
                    start=(pageIndex-1)*9;
                    dataa.view.begin = start;
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
                            var list=data.data.list;
                            var finsh_text = "";
                            html+="<tr id='tableAlign'>";
                            html+="<td width='25%'>终端分组</td>";
                            html+="<td width='25%'>终端名称</td>";
                            html+="<td width='25%'>任务状态</td>";
                            html+="<td width='25%'>备注</td>";
                            html+="</tr>";
                            for (var i = 0; i < list.length; i++) {
                                html+="<tr>";
                                if(list[i].groupname==""){
                                    html+="<td>(已删除终端)</td>";
                                }else{
                                    html+="<td>"+safeStr(list[i].groupname)+"</td>";
                                }
                html+="<td><span style='width:150px' class='filePath' title="+safeStr(list[i].hostname)+">"+safeStr(list[i].hostname)+"</span></td>";
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
                            $(".taskDetailPop .taskDetailTable table").html(html);
                        }       
                    });
                }
            })

        }       
    });


}
$(".taskDetailPop").on("click",".fastSKCB",function(){
    $(".fastSKCPop").show();
})
$(".taskDetailPop").on("click",".overallSKCB",function(){
    $(".overallSKCPop").show();
})
$(".closeWW").click(function(){
    $(".shadee").hide();
    $(this).parent().parent().hide();
});
//关闭弹层
$(".closeW").click(function(){
    $(".shade").hide();
    $(this).parent().parent().hide();
    parent.$(".topshade").hide();

});
//导出
$(document).on('click','.exportLog',function(){
 	var dataa = accEvnetParam();
	$.download('/mgr/task/_export', 'post', dataa); 

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
    if(start == undefined) {
		start = 0;
	}else{
		start = start;
	}
    if($("#functionBlock .current").index()==1){
    }else if($("#functionBlock .current").index()==2){
        type="quick_scan";
    }else if($("#functionBlock .current").index()==3){
        type="full_scan";
    }else if($("#functionBlock .current").index()==4 ){
        type="update";
    }else if($("#functionBlock .current").index()==5){
        type="message";
    }else if($("#functionBlock .current").index()==6){
        type="shutdown";
    }else if($("#functionBlock .current").index()==7 ){
        type="reboot";
    }else if($("#functionBlock .current").index()==8 ){
        type="msg_uninstall";
    }else if($("#functionBlock .current").index()==9 ){
        type="msg_distrfile";
    }else if($("#functionBlock .current").index()==10 ){
        type="migrate";
    }else if($("#functionBlock .current").index()==11 ){
        type="leakrepair_repair";
    }
    if(type){
    	dataa={"type":type,"create_time":{"begin":begintime,"end":endtime},"view":{"begin":start,"count":numperpage}};
    }else{
    	dataa={"create_time":{"begin":begintime,"end":endtime},"view":{"begin":start,"count":numperpage}};
    }
	
	if($("#status option:selected").val()==1){
    	dataa.status = 1;
    }else if($("#status option:selected").val()==2){
    	dataa.status = 0;
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
        url:'/mgr/task/_list',
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

            tableth+="<tr>";
            tableth+="<th width='24%' class='th-ordery' type='create_time'>时间<img src='images/th-ordery.png'/></th>";
            tableth+="<th width='17%' class='th-ordery' type='type'>任务类型<img src='images/th-ordery.png'/></th>";
            
            tableth+="<th width='15%' class='th-ordery' type='client_all'>下发台数<img src='images/th-ordery.png'/></th>";
            tableth+="<th width='15%' class='th-ordery' type='client_done'>执行台数<img src='images/th-ordery.png'/></th>";
            tableth+="<th width='17%' class='th-ordery' type='status'>状态<img src='images/th-ordery.png'/></th>";
            tableth+="<th width='8%'>详情</th>";
            tableth+="</tr>";

            table+="<table>";
            table+="<tr id='tableAlign'>";
            table+="<td width='24%'>时间</td>";
            table+="<td width='17%'>任务类型</td>";
            
            table+="<td width='15%'>下发台数</td>";
            table+="<td width='15%'>执行台数</td>";
            table+="<td width='17%'>状态</td>";
            table+="<td width='8%'>详情</td>";
            table+="</tr>";
            for(i=0;i<list.length;i++){
                var createtime=list[i].create_time;
                createtime=getLocalTime(createtime);
                table+="<tr taskid='"+list[i].task_id+"'>";
                table+="<td>"+safeStr(createtime)+"</td>";
                if(list[i].type=="quick_scan"){
                    table+="<td>快速查杀</td>";
                }else if(list[i].type=="full_scan"){
                    table+="<td>全盘查杀</td>";
                }else if(list[i].type=="update"){
                    table+="<td>升级任务</td>";
                }else if(list[i].type=="message"){
                    table+="<td>通知任务</td>";
                }else if(list[i].type=="shutdown"){
                    table+="<td>关机</td>";
                }else if(list[i].type=="reboot"){
                    table+="<td>重启</td>";
                }else if(list[i].type=="msg_uninstall"){
                    table+="<td>软件卸载</td>";
                }else if(list[i].type=="msg_distrfile"){
                    table+="<td>文件分发</td>";
                }else if(list[i].type=="migrate"){
                    table+="<td>中心迁移</td>";
                }else if(list[i].type=="leakrepair_scan"){
                	table+="<td>漏洞扫描</td>";
                }else if(list[i].type=="leakrepair_repair"){
                	table+="<td>漏洞修复</td>";
                }else if(list[i].type=="vnc_launch"){
                	table+="<td>远程桌面</td>";
                }else{
                	table+="<td></td>";
                }

                
                table+="<td>"+list[i].client_all+"</td>";
                table+="<td>"+list[i].client_done+"</td>";
                if(list[i].status==0){
                   table+="<td>正在分发</td>"; 
                }else if(list[i].status==1){
                    table+="<td>分发结束</td>";
                }else{
                	table+="<td></td>";
                }
                table+="<td><a class='seeDetail cursor blackfont'>详情</a></td>";
                table+="</tr>";
            }
            table+="</table>";
            $(".table table").hide();
            $(".main .tableth table").html(tableth);
            if(list.length==0){
                $(".table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>");
            }else{
                $(".table").html(table);
            
            }
            $(".table table").show();
             $(".main .tableth table").html(tableth);
            $(".table").html(table);
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
                    $(".table table").html("");

                    start=(pageIndex-1)*numperpage;
					dataa.view.begin = start;
                    if($("#functionBlock .current").index()==1 && $("#status option:selected").val()==0){
                    	
                    }else if($("#functionBlock .current").index()==2 && $("#status option:selected").val()==0){
                        dataa.type="quick_scan";
                    }else if($("#functionBlock .current").index()==3 && $("#status option:selected").val()==0){
                        dataa.type="full_scan";
                    }else if($("#functionBlock .current").index()==4 && $("#status option:selected").val()==0){
                        dataa.type="update";
                    }else if($("#functionBlock .current").index()==5 && $("#status option:selected").val()==0){
                        dataa.type="message";
                    }else if($("#functionBlock .current").index()==6 && $("#status option:selected").val()==0){
                        dataa.type="shutdown";
                    }else if($("#functionBlock .current").index()==7 && $("#status option:selected").val()==0){
                        dataa.type="reboot";
                    }else if($("#functionBlock .current").index()==8 && $("#status option:selected").val()==0){
                        dataa.type="msg_uninstall";
                    }else if($("#functionBlock .current").index()==9 && $("#status option:selected").val()==0){
                        dataa.type="msg_distrfile";
                    }else if($("#functionBlock .current").index()==10 && $("#status option:selected").val()==0){
                        dataa.type="migrate";
                    }else if($("#functionBlock .current").index()==11 && $("#status option:selected").val()==0){
				        dataa.type="leakrepair_repair";
				    }

                    if($("#functionBlock .current").index()==1 && $("#status option:selected").val()==1){
                    }else if($("#functionBlock .current").index()==2 && $("#status option:selected").val()==1){
                        dataa.type="quick_scan";
                    }else if($("#functionBlock .current").index()==3 && $("#status option:selected").val()==1){
                        dataa. type="full_scan";
                    }else if($("#functionBlock .current").index()==4 && $("#status option:selected").val()==1){
                         dataa.type="update";
                    }else if($("#functionBlock .current").index()==5 && $("#status option:selected").val()==1){
                         dataa.type="message";
                    }else if($("#functionBlock .current").index()==6 && $("#status option:selected").val()==1){
                         dataa.type="shutdown";
                    }else if($("#functionBlock .current").index()==7 && $("#status option:selected").val()==1){
                         dataa.type="reboot";
                    }else if($("#functionBlock .current").index()==8 && $("#status option:selected").val()==1){
                         dataa.type="msg_uninstall";
                    }else if($("#functionBlock .current").index()==9 && $("#status option:selected").val()==1){
                         dataa.type="msg_distrfile";
                    }else if($("#functionBlock .current").index()==10 && $("#status option:selected").val()==1){
                         dataa.type="migrate";
                    }else if($("#functionBlock .current").index()==11 && $("#status option:selected").val()==1){
				         dataa.type="leakrepair_repair";
				    }

                    if($("#functionBlock .current").index()==1 && $("#status option:selected").val()==2){
                    }else if($("#functionBlock .current").index()==2 && $("#status option:selected").val()==2){
                         dataa.type="quick_scan";
                    }else if($("#functionBlock .current").index()==3 && $("#status option:selected").val()==2){
                         dataa.type="full_scan";
                    }else if($("#functionBlock .current").index()==4 && $("#status option:selected").val()==2){
                         dataa.type="update";
                    }else if($("#functionBlock .current").index()==5 && $("#status option:selected").val()==2){
                         dataa.type="message";
                    }else if($("#functionBlock .current").index()==6 && $("#status option:selected").val()==2){
                         dataa.type="shutdown";
                    }else if($("#functionBlock .current").index()==7 && $("#status option:selected").val()==2){
                         dataa.type="reboot";
                    }else if($("#functionBlock .current").index()==8 && $("#status option:selected").val()==2){
                         dataa.type="msg_uninstall";
                    }else if($("#functionBlock .current").index()==9 && $("#status option:selected").val()==2){
                         dataa.type="msg_distrfile";
                    }else if($("#functionBlock .current").index()==10 && $("#status option:selected").val()==2){
                         dataa.type="migrate";
                    }else if($("#functionBlock .current").index()==11 && $("#status option:selected").val()==2){
				         dataa.type="leakrepair_repair";
				    }

                    $(".table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
                    ajaxtable=
                    $.ajax({
                        url:'/mgr/task/_list',
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

                            table+="<table>";
                            table+="<tr id='tableAlign'>";
                            table+="<td width='24%'>时间</td>";
                            table+="<td width='17%'>任务类型</td>";
                            
                            table+="<td width='15%'>下发台数</td>";
                            table+="<td width='15%'>执行台数</td>";
                            table+="<td width='17%'>状态</td>";
                            table+="<td width='8%'>详情</td>";
                            table+="</tr>";

                            for(i=0;i<list.length;i++){
                                var createtime=list[i].create_time;
                                createtime=getLocalTime(createtime);
                                table+="<tr taskid='"+list[i].task_id+"'>";
                                table+="<td>"+safeStr(createtime)+"</td>";
                                if(list[i].type=="quick_scan"){
                                    table+="<td>快速查杀</td>";
                                }else if(list[i].type=="full_scan"){
                                    table+="<td>全盘查杀</td>";
                                }else if(list[i].type=="update"){
                                    table+="<td>升级任务</td>";
                                }else if(list[i].type=="message"){
                                    table+="<td>通知任务</td>";
                                }else if(list[i].type=="shutdown"){
                                    table+="<td>关机</td>";
                                }else if(list[i].type=="reboot"){
                                    table+="<td>重启</td>";
                                }else if(list[i].type=="msg_uninstall"){
                                    table+="<td>软件卸载</td>";
                                }else if(list[i].type=="msg_distrfile"){
                                    table+="<td>文件分发</td>";
                                }else if(list[i].type=="migrate"){
                                    table+="<td>中心迁移</td>";
                                }else if(list[i].type=="leakrepair_scan"){
				                	table+="<td>漏洞扫描</td>";
				                }else if(list[i].type=="leakrepair_repair"){
				                	table+="<td>漏洞修复</td>";
				                }else if(list[i].type=="vnc_launch"){
				                	table+="<td>远程桌面</td>";
				                }else{
				                	table+="<td></td>";
				                }
                                
                                table+="<td>"+list[i].client_all+"</td>";
                                table+="<td>"+list[i].client_done+"</td>";
                                if(list[i].status==0){
                                   table+="<td>正在分发</td>"; 
                                }else if(list[i].status==1){
                                    table+="<td>分发结束</td>";
                                }else{
				                	table+="<td></td>";
				                }
                                table+="<td><a class='seeDetail cursor blackfont' >详情</a></td>";
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


resizeTableHeight();
function resizeTableHeight(resize) {
    //调整页面内元素高度
    var mainlefth=parent.$("#iframe #mainFrame").height();

    if(resize){
        $(".main .table").css({height:mainlefth-338});
    }else{
        $(".main .table").css({height:mainlefth-298});
    }
    // window.resizing=false;
}
// window.resizing=false;
// window.onresize = function(){
//     if(!window.resizing) return false;
//     window.resizing=true;
//     resizeTableHeight();
// }

