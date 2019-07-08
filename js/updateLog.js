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
	
	accEvent();
})
//请求参数
function accEvnetParam(){
	var begintime=getBeginTimes($("#txtBeginDate").val());
    var endtime=getEndTimes($("#txtEndDate").val());
    var module = $('#specialModel select option:selected').val();

    var type="";
    var dataa="";
    var start=0;

    dataa={"date":{"begin":begintime,"end":endtime},"filter":{"product":module},"view":{"begin":start,"count":numperpage}}

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
var ajaxtable=null;
function accEvent(){
    if(ajaxtable){
        ajaxtable.abort();
    }
    var dataa = accEvnetParam();
    $(".table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
    ajaxtable=
    $.ajax({
        url:'/mgr/upgrade/_history',
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
            table+="<td width='16%'>时间</td>";
            table+="<td width='16%'>升级模块</td>";
            table+="<td width='16%'>升级前版本</td>";
            table+="<td width='16%'>升级后版本</td>";
            table+="<td width='16%'>状态</td>";
            table+="</tr>";
            if(list!=null){
				
	            for(i=0;i<list.length;i++){
	                var time=list[i].time;
	                time=getLocalTime(time);
	                
	                table+="<tr taskid='"+list[i].task_id+"'>";
	                table+="<td>"+time+"</td>";
				
	                if(list[i].product == 'client.windows'){
						table+="<td>windows终端升级</td>";
					}else if(list[i].product == 'client.linux'){
						table+="<td>linux终端升级</td>";
					}else if(list[i].product == 'virdb.windows'){
						table+="<td>windows病毒库升级</td>";
					}else if(list[i].product == 'virdb.linux'){
						table+="<td>linux病毒库升级</td>";
					}else if(list[i].product == 'center.windows'){
						table+="<td>windows中心升级</td>";
					}else if(list[i].product == 'center.linux'){
						table+="<td>linux中心升级</td>";
					}else{
						table+="<td></td>";
					}
	                table+="<td>"+list[i].orgver+"</td>";
	                table+="<td>"+list[i].newver+"</td>";
	                if(list[i].result=="success"){
	                    table+="<td>升级成功</td>"; 
	                }else if(list[i].result=="connect failed"){
	                    table+="<td>连接失败</td>"; 
	                }else if(list[i].result=="fetch failed"){
	                    table+="<td>下载失败</td>";
	                }else if(list[i].result=="merge failed"){
	                    table+="<td>更新失败</td>";
	                }else{
	                	table+="<td></td>";
	                }
	                table+="</tr>";
	            }
	            table+="</table>";
	            $(".table table").hide();	           
	            $(".table table").fadeIn();
	            if(list.length==0){
					$(".table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>"); 
				}else{
					$(".table").html(table);
				}
			}else{
				$(".table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>"); 
			}

            $(".tableContainer .pageBox").remove();
           
            $(".tableContainer").append("<div class='pageBox'><a style='font-size:12px;color:#6a6c6e;line-height:54px;padding-left:20px;float:left;' class='totalPages'>共 "+data.data.view.total+" 条记录</a><div class='tcdPageCode' style='font-size:12px;float:right;padding-top:14px;padding-bottom:14px;padding-right:20px;'></div><a style='font-size:12px;float:right;line-height:54px;padding-right:20px;color:#6a6c6e' class='numperpage'>每页<input type='text' id='numperpageinput' value="+numperpage+" style='font-size:12px;width:40px;height:24px;margin:0 4px;vertical-align:middle;padding:0 10px;'>条</a><div class='clear clearfloat'></div></div>");
            $(".tableContainer .tcdPageCode").createPage({
                pageCount:total,
                current:1,
                backFn:function(pageIndex){
                    $(".table table").html("");
                    start=(pageIndex-1)*numperpage;
 					dataa.view.begin = start;
             
                    $(".table").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
                    ajaxtable=
                    $.ajax({
                        url:'/mgr/upgrade/_history',
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
				            table+="<td width='16%'>时间</td>";
				            table+="<td width='16%'>升级模块</td>";
				            table+="<td width='16%'>升级前版本</td>";
				            table+="<td width='16%'>升级后版本</td>";
				            table+="<td width='16%'>状态</td>";
				            table+="</tr>";
                            for(i=0;i<list.length;i++){
                                var time=list[i].time;
				                time=getLocalTime(time);
				                table+="<tr taskid='"+list[i].task_id+"'>";
				                table+="<td>"+time+"</td>";
								
								if(list[i].product == 'client.windows'){
									table+="<td>windows终端升级</td>";
								}else if(list[i].product == 'client.linux'){
									table+="<td>linux终端升级</td>";
								}else if(list[i].product == 'virdb.windows'){
									table+="<td>windows病毒库升级</td>";
								}else if(list[i].product == 'virdb.linux'){
									table+="<td>linux病毒库升级</td>";
								}else if(list[i].product == 'center.windows'){
									table+="<td>windows中心升级</td>";
								}else if(list[i].product == 'center.linux'){
									table+="<td>linux中心升级</td>";
								}else{
									table+="<td></td>";
								}
				                
				                table+="<td>"+list[i].orgver+"</td>";
				                table+="<td>"+list[i].newver+"</td>";
				                if(list[i].result=="success"){
				                    table+="<td>升级成功</td>"; 
				                }else if(list[i].result=="connect failed"){
				                    table+="<td>连接失败</td>"; 
				                }else if(list[i].result=="fetch failed"){
				                    table+="<td>更新失败</td>";
				                }else if(list[i].result=="merge failed"){
				                    table+="<td>下载失败</td>";
				                }else{
				                	table+="<td></td>";
				                }
				                table+="</tr>";
                            }
                            table+="</table>";
                            $(".table table").hide();
                            $(".table").html(table);
                            $(".table table").fadeIn(500);
                              
                        }
                    });

                }
            })  
            }
    });

}


//调整页面内元素高度
var mainlefth=parent.$("#iframe #mainFrame").height();

$(".main .table").css({height:mainlefth-288});

window.onresize = function(){
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .table").css({height:mainlefth-288});

}

// 改变每页多少数据
$("body").on("blur", "#numperpageinput", function() {
	if($(this).val() == "" || parseInt($(this).val()) < 10) {
		numperpage = 10;
	} else if(parseInt($(this).val()) > 1000) {
		numperpage = 1000;
	} else {
		numperpage = parseInt($("#numperpageinput").val());
	}
	localStorage.setItem('numperpage',numperpage);
	accEvent();
})