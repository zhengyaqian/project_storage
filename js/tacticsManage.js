// loading执行
//后退到当前页面将父页面选项卡置为当前位置
parent.$(".nav .container a[name='tacticsArrange.html']").addClass("current");
parent.$(".nav .container a[name='tacticsArrange.html']").siblings().removeClass("current");
parent.$(".footer").show();

document.cookie='page=tacticsManage.html';

tacticsManage();
$(document).ready(function(e) {
        $('.lcs_check').lc_switch();
});
// loading加载
$(".mainBlock .right").children(".page").hide();
$(".mainBlock .right").children(".page").eq(0).show();
//全选
function selectAllFP(checkbox) {
    $(checkbox).parents("table").find('.selectFP').prop('checked', $(checkbox).prop('checked'));
}
//新建策略input限制
$("#newTNText").keyup(function(){
    if($(this).val().length>40){
        $(this).val($(this).val().substr(0,40));
    }
})
//端口号正则数字限制 数字范围限制
$(".mailMTable").on("keyup",".portInput",function(){
    var value=$(this).val();
    value=value.replace(/[^\d]/g,'');
    $(this).val(value);   
 
    if($(this).val()>65535){
        $(this).val(65535);
    }
})
// 
$("input[name=overallPara1],input[name=zipSetV],input[name=zipSetDPV],input[name=zipSetMMV]").keyup(function(){
    var value=$(this).val();
    value=parseInt(value.replace(/[^\d]/g,''));
    if(isNaN(value)){
    
    }else{
       $(this).val(parseInt(value));   
    }
})
//点击左边切换显示右边内容
$(".pageTab").click(function(){

        var index=$(this).index(".pageTab");
        $(this).siblings(".pageTab").removeClass("current");
        $(this).addClass("current");
        $(".mainBlock .right").children(".page").eq(index).siblings(".page").hide();
        $(".mainBlock .right").children(".page").eq(index).show();
        
        $('.blackLTable').parents('.page').removeAttr('ipBLB');
        var ipObj = localStorage.getItem('ipBLB');
        if(ipObj){
       		$('.blackLTable').parents('.page').attr('ipBLB',ipObj);
        }
        
        $('.protocolCTable').parents('.page').removeAttr('ipBLB');
        var ipObj1 = localStorage.getItem('ipPC');
        if(ipObj1){
       		$('.protocolCTable').parents('.page').attr('ipBLB',ipObj1);
        }
        $(".mainBlock .right").hide();
        $(".mainBlock .right").show();

})
//系统加固展开列表
$(".systemRooting .tr").mouseenter(function(){
    $(this).find(".deploypng").css({backgroundPosition:"-18px"})
})
$(".systemRooting .tr").mouseleave(function(){
    $(this).find(".deploypng").css({backgroundPosition:"0px"})
})
$(".systemRooting .tr").click(function(){
    if($(this).next().is(":hidden")){
       $(this).next().show(); 
       $(this).find(".deploypng").css({background:"url(../images/task2.png)",backgroundPosition:"-18px"})
    }else{
        $(this).next().hide();
        $(this).find(".deploypng").css({background:"url(../images/task1.png)",backgroundPosition:"-18px"})
    }
})

//编辑策略中多选框或单选框点选变化引起后面文本框变化
$("input[type=checkbox]").change(function(){
    if($(this).is(":checked")){
        $(this).parent().find("input[type=text]").prop("disabled",false);
        if($(this).parent().find("input[type=text]").val() == ''){
        	$(this).parent().find(".placeholder").show();
        }else{
        	$(this).parent().find(".placeholder").hide();
        }

    }else{
        $(this).parent().find("input[type=text]").prop("disabled",true);
        $(this).parent().find(".placeholder").hide();
    }
})
$("input[name=startpage]").click(function(){
    if($(this).val()==0){
        $(this).parent().siblings().find("input[type=text]").prop("disabled",true)
    }else{
        $(this).parent().find("input[type=text]").prop("disabled",false)
    }
})
//排序

$(document).on('click','.table th.th-ordery',function(){
	var toggleClass = $(this).attr('class');
	var _this = $(this);
    sortingFun(_this,toggleClass);
	tacticsManage();
})
// 策略管理
function tacticsManage(){
	var dataa={};
	var type = $('.table th.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.table th.th-ordery.th-ordery-current').attr('class');
	dataa = sortingDataFun(dataa,type,orderClass);
    $.ajax({
        url:'/mgr/policy/_list',
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
            var table="";

            for(i=0;i<list.length;i++){
            	table+="<tr policyid="+list[i].policy_id+">";
            	table+="<td class='relative' width='60%'>";
            	if(list[i].policy_id == 1){
		            table+="<img src='images/tacticsd.png'>";
		            table+="<div class='absoluteTxt'>";
		            table+="<h3>"+safeStr(list[i].policy_name)+"</h3>";
		            table+="<p>火绒为您准备好的默认防护策略，默认防护策略无法编辑与删除</p>";  
		            table+="</div>";
		            table+="</td>";
		            table+="<td width='20%'>"+list[i].refernce+"</td>";
		            table+="<td width='20%'>";
		            table+="<a class='button cursor' onclick='editTacticsPop(this)'>查看策略</a>";
		            table+="<a class='button cursor noava'>删除策略</a>";
		            table+="</td>";
            	}else{
            		table+="<img src='images/tactics.png'>";
	                table+="<div class='absoluteTxt'>";
	                table+="<h3>"+safeStr(list[i].policy_name)+"</h3>";
	                table+="<p>自定义防护规则</p>";
	                table+="</div>";
	                table+="</td>";
	                table+="<td width='20%'>"+list[i].refernce+"</td>";
	                table+="<td width='20%'>";
	                table+="<a class='button cursor' onclick='editTacticsPop(this)'>编辑策略</a>";
	                table+="<a class='button cursor' onclick='deletePPop(this)'>删除策略</a>";
	                table+="</td>";
            	}
            	
               
               
                table+="</tr>";
            }
            
            
            $(".bgContainer .tacticsManageTable table tbody").html(table);

            
          
        }
    })
}
//关闭弹层
$(".closeW").click(function(){
    $(".shade").hide();
    parent.$(".topshade").hide();
    $(this).parent().parent().hide();
});
$(".closeWW").click(function(){
    $(".windowShade").hide();
    $(this).parent().parent().hide();
});
//关闭遮罩和弹窗
function hideButton(a){
    $(".shade").hide();
    parent.$(".topshade").hide();
    $(a).parents(".pop").hide();
}
//关闭遮罩和弹窗
function hideButtonn(a){
    $(".windowShade").hide();
    $(a).parent().parent().hide();
}
//弹出新建策略弹层
function newTacticsPop(){
    shade();
    $("#newTNText").val("");
    $(".newTacticsPop").show();
    $(".newTacticsPop .right .unusualTxt").hide();
    $(".newTacticsPop .placeholder").show();
    // 读取现有的策略
    $.ajax({
        url:'/mgr/policy/_list',
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
            var list=data.data.list;
            var html="";
            html+="<option value="+list[list.length-1].policy_id+">"+safeStr(list[list.length-1].policy_name)+"</option>";
            for(i=0;i<list.length-1;i++){
                html+="<option value="+list[i].policy_id+">"+safeStr(list[i].policy_name)+"</option>";
            }
            
            
            $(".newTacticsPop #tacticsTem").html(html);
        }
    })

}
// 确认新建策略
function submitTN(a){
    
    var newTNText=trim($("#newTNText").val());
    var dataa={"policy_name":newTNText};
    if(newTNText.length == 0){
        $(".newTacticsPop .right .unusualTxt").show();
        $(".newTacticsPop .right .unusualTxt").html("策略名称不能为空<img src='images/unusual.png'>");

    }else{
        $.ajax({
            url:'/mgr/policy/_create',
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
                
                if(data.errno==-1  && data.errmsg.indexOf("1062")>0){
                    $(".newTacticsPop .right .unusualTxt").show();
                    $(".newTacticsPop .right .unusualTxt").html("已存在相同策略名,创建策略失败<img src='images/unusual.png'>");
                }else{
                	var newtacticsid=data.data.policy_id;//新建策略成功后的策略id
                    // 新建策略成功提示
                    delayHideS("新建成功");
                    tacticsManage();
                    $(a).parents(".pop").hide();
                    $(".newTacticsAPop").show();
                    $(".newTacticsAPop .tacticsNameText span").html("<font class='verticalMiddle'>策略名称:</font><font class='name'>"+safeStr(data.data.policy_name)+"</font>");
                    $(".newTacticsAPop .tacticsNameText span").attr("policyid",data.data.policy_id);
                    $(".newTacticsAPop .tacticsNameText span").attr("policyname",data.data.policy_name);
                    // 获取所选模板的策略配置并更新新建策略的配置
                    var tempolicyid=parseInt($(".newTacticsPop #tacticsTem").val());
                    //检测所有开关状态
                    var fname = ["power","scan","filemon","behavior","udiskmon","dlmon","mail","instmon","browserprot","intrusion","ipattack","malsite","sysprot","ipproto","ipblacklist"];
                    for(var i=0;i<fname.length;i++){
                        $.ajax({
                            url:'/mgr/policy/_info?id='+tempolicyid+'&fname='+fname[i],
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
                                var dataa={"policy_id":newtacticsid,"fname":fname[i],"config":data.data.data.config};
                                $.ajax({
                                    url:'/mgr/policy/_update',
                                    data:JSON.stringify(dataa),
                                    type:'POST',
                                    contentType:'text/plain',
                                    error:function(xhr,textStatus,errorThrown){
                                        if(xhr.status==401){
                                            parent.window.location.href='/';
                                        }
                                    },
                                    success:function(data){
    
                                    }
                                });
                            }
                        });
                    }

                }       
                
            }
        });
    }

}

//弹出删除群组

var policyid="";
function deletePPop(a){
    shade();
    $(".deletePPop").show();
    policyid=parseInt($(a).parents("tr").attr("policyid"));
    $(".deletePPop .describe font").html($(a).parents("tr").find("td").eq(0).find("h3").html());
     
}

function sureDeleteButton(a){
    var dataa={"policy_id":policyid};
    $.ajax({
        url:'/mgr/policy/_delete',
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
            tacticsManage();
            hideButton(a);
        }
    });
}

// 弹出编辑策略
function editTacticsPop(a){
    $(".newTacticsAPop").hide();
    shade();

    $(".mainBlock .leftScroll").find(".pageTab").removeClass("current");
    $(".mainBlock .leftScroll").find(".pageTab").eq(0).addClass("current");
    $(".mainBlock .right").children(".page").hide();
    $(".mainBlock .right").children(".page").eq(0).show();
    $(".checkTacticsPop").show();
    if($(a).attr("id")=="judgePolicyid"){
        
        policyid=parseInt($(".newTacticsAPop .tacticsNameText span").attr("policyid"));
        $(".checkTacticsPop").children(".title").children("font").html("编辑策略-"+safeStr($(".newTacticsAPop .tacticsNameText span").attr("policyname")));
        $(".checkTacticsPop input").prop("disabled",false);
        $(".checkTacticsPop .switchShade").hide();
        $(".mMTableTitle .floatR").show();
        $('.checkTacticsPop .buttons').show();//显示编辑策略弹层的保存取消按钮
        $(".bLTableTitle").show();//显示ip控制协议表格和ip黑名单表格的操作按钮

    }else{
        policyid=parseInt($(a).parents("tr").attr("policyid"));
        
        if(policyid==1){
            $('.checkTacticsPop .buttons').hide();
            $('.disabledShade').show();
            $(".checkTacticsPop").children(".title").children("font").html("查看策略-"+safeStr($(a).parents("tr").find("td").eq(0).find("h3").html()));
            $(".checkTacticsPop input").prop("disabled",true);
            // $(".checkTacticsPop .switchShade").show();
            $(".checkTacticsPop .switchShade").css({display:"block"});
            $(".mMTableTitle .floatR").hide();
            $(".bLTableTitle").hide();
        }else{
            $('.checkTacticsPop .buttons').show();
            $('.disabledShade').hide();
            $(".checkTacticsPop").children(".title").children("font").html("编辑策略-"+safeStr($(a).parents("tr").find("td").eq(0).find("h3").html()));
            $(".checkTacticsPop input").prop("disabled",false);
            $(".checkTacticsPop .switchShade").hide();
            $(".mMTableTitle .floatR").show();
            $(".bLTableTitle").show();
        }
    }
    
    //检测所有开关状态
    $.ajax({
        url:'/mgr/policy/_info?id='+policyid+'&fname=power',
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
           if(data.data.data.config.filemon==true){

            $("input[name=fMSwitch]").prop("checked",true);
            $("input[name=fMSwitch]").next().addClass("lcs_on");
            $("input[name=fMSwitch]").next().removeClass("lcs_off");
           }else{
            $("input[name=fMSwitch]").prop("checked",false);
            $("input[name=fMSwitch]").next().addClass("lcs_off");
            $("input[name=fMSwitch]").next().removeClass("lcs_on");
           }

           if(data.data.data.config.behavior==true){

            $("input[name=bAMSwitch]").prop("checked",true);
            $("input[name=bAMSwitch]").next().addClass("lcs_on");
            $("input[name=bAMSwitch]").next().removeClass("lcs_off");
           }else{
            $("input[name=bAMSwitch]").prop("checked",false);
            $("input[name=bAMSwitch]").next().addClass("lcs_off");
            $("input[name=bAMSwitch]").next().removeClass("lcs_on");
           }

           if(data.data.data.config.udiskmon==true){

            $("input[name=uPSwitch]").prop("checked",true);
            $("input[name=uPSwitch]").next().addClass("lcs_on");
            $("input[name=uPSwitch]").next().removeClass("lcs_off");
           }else{
            $("input[name=uPSwitch]").prop("checked",false);
            $("input[name=uPSwitch]").next().addClass("lcs_off");
            $("input[name=uPSwitch]").next().removeClass("lcs_on");
           }

           if(data.data.data.config.dlmon==true){

            $("input[name=dPSwitch]").prop("checked",true);
            $("input[name=dPSwitch]").next().addClass("lcs_on");
            $("input[name=dPSwitch]").next().removeClass("lcs_off");
           }else{
            $("input[name=dPSwitch]").prop("checked",false);
            $("input[name=dPSwitch]").next().addClass("lcs_off");
            $("input[name=dPSwitch]").next().removeClass("lcs_on");
           }

           if(data.data.data.config.sysprot==true){

            $("input[name=sRSwitch]").prop("checked",true);
            $("input[name=sRSwitch]").next().addClass("lcs_on");
            $("input[name=sRSwitch]").next().removeClass("lcs_off");
           }else{
            $("input[name=sRSwitch]").prop("checked",false);
            $("input[name=sRSwitch]").next().addClass("lcs_off");
            $("input[name=sRSwitch]").next().removeClass("lcs_on");
           }

           if(data.data.data.config.instmon==true){

            $("input[name=sISwitch]").prop("checked",true);
            $("input[name=sISwitch]").next().addClass("lcs_on");
            $("input[name=sISwitch]").next().removeClass("lcs_off");
           }else{
            $("input[name=sISwitch]").prop("checked",false);
            $("input[name=sISwitch]").next().addClass("lcs_off");
            $("input[name=sISwitch]").next().removeClass("lcs_on");
           }

           if(data.data.data.config.browserprot==true){

            $("input[name=bPSwitch]").prop("checked",true);
            $("input[name=bPSwitch]").next().addClass("lcs_on");
            $("input[name=bPSwitch]").next().removeClass("lcs_off");
           }else{
            $("input[name=bPSwitch]").prop("checked",false);
            $("input[name=bPSwitch]").next().addClass("lcs_off");
            $("input[name=bPSwitch]").next().removeClass("lcs_on");
           }

           if(data.data.data.config.intrusion==true){

            $("input[name=hISwitch]").prop("checked",true);
            $("input[name=hISwitch]").next().addClass("lcs_on");
            $("input[name=hISwitch]").next().removeClass("lcs_off");
           }else{
            $("input[name=hISwitch]").prop("checked",false);
            $("input[name=hISwitch]").next().addClass("lcs_off");
            $("input[name=hISwitch]").next().removeClass("lcs_on");
           }

           if(data.data.data.config.ipattack==true){

            $("input[name=aCSwitch]").prop("checked",true);
            $("input[name=aCSwitch]").next().addClass("lcs_on");
            $("input[name=aCSwitch]").next().removeClass("lcs_off");
           }else{
            $("input[name=aCSwitch]").prop("checked",false);
            $("input[name=aCSwitch]").next().addClass("lcs_off");
            $("input[name=aCSwitch]").next().removeClass("lcs_on");
           }

           if(data.data.data.config.malsite==true){

            $("input[name=wISwitch]").prop("checked",true);
            $("input[name=wISwitch]").next().addClass("lcs_on");
            $("input[name=wISwitch]").next().removeClass("lcs_off");
           }else{
            $("input[name=wISwitch]").prop("checked",false);
            $("input[name=wISwitch]").next().addClass("lcs_off");
            $("input[name=wISwitch]").next().removeClass("lcs_on");
           }

           if(data.data.data.config.mail==true){
            $("input[name=mMSwitch]").prop("checked",true);
            $("input[name=mMSwitch]").next().addClass("lcs_on");
            $("input[name=mMSwitch]").next().removeClass("lcs_off");
           }else{
            $("input[name=mMSwitch]").prop("checked",false);
            $("input[name=mMSwitch]").next().addClass("lcs_off");
            $("input[name=mMSwitch]").next().removeClass("lcs_on");
           }

           if(data.data.data.config.ipproto==true){
            $("input[name=pCSwitch]").prop("checked",true);
            $("input[name=pCSwitch]").next().addClass("lcs_on");
            $("input[name=pCSwitch]").next().removeClass("lcs_off");
           }else{
            $("input[name=pCSwitch]").prop("checked",false);
            $("input[name=pCSwitch]").next().addClass("lcs_off");
            $("input[name=pCSwitch]").next().removeClass("lcs_on");
           }
           if(data.data.data.config.ipblacklist==true){
            $("input[name=bLSwitch]").prop("checked",true);
            $("input[name=bLSwitch]").next().addClass("lcs_on");
            $("input[name=bLSwitch]").next().removeClass("lcs_off");
           }else{
            $("input[name=bLSwitch]").prop("checked",false);
            $("input[name=bLSwitch]").next().addClass("lcs_off");
            $("input[name=bLSwitch]").next().removeClass("lcs_on");
           }
           
           if(data.data.data.config.devmgr==true){
            $("input[name=devSwitch]").prop("checked",true);
            $("input[name=devSwitch]").next().addClass("lcs_on");
            $("input[name=devSwitch]").next().removeClass("lcs_off");
           }else{
            $("input[name=devSwitch]").prop("checked",false);
            $("input[name=devSwitch]").next().addClass("lcs_off");
            $("input[name=devSwitch]").next().removeClass("lcs_on");
           }
        }
    });
    
    // 病毒查杀
    $.ajax({
        url:'/mgr/policy/_info?id='+policyid+'&fname=scan',
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
            var config=data.data.data.config;
            if(config['decompo.limit.size'].enable==true){
                $("input[name=overallSet1]").prop("checked",true);
                $("input[name=overallPara1]").val(config['decompo.limit.size'].value) 
            }else{
                $("input[name=overallSet1]").prop("checked",false);
                $("input[name=overallPara1]").val(config['decompo.limit.size'].value);
                 $("input[name=overallPara1]").prop("disabled",true)
            }
            if(config['scan.exclusion.ext'].enable==true){
                $("input[name=overallSet2]").prop("checked",true);
                $("input[name=overallPara2]").val(config['scan.exclusion.ext'].value) 
            }else{
                $("input[name=overallSet2]").prop("checked",false);
                $("input[name=overallPara2]").val(config['scan.exclusion.ext'].value); 
                $("input[name=overallPara2]").prop("disabled",true)
            }
            if(config['scan.maxspeed']==true){
                $("input[name=sKSpeed][value='1']").prop("checked",true);
            }else{
                $("input[name=sKSpeed][value='0']").prop("checked",true);
            }
            if(config['scan.sysrepair']==true){
                $("input[name=systemRep]").prop("checked",true);
            }else{
                $("input[name=systemRep]").prop("checked",false);
            }
            if(config['clean.automate']==true){
                $("input[name=actionV][value='0']").prop("checked",true);
            }else{
                $("input[name=actionV][value='1']").prop("checked",true);
            }
            if(config['clean.quarantine']==true){
                $("input[name=backup]").prop("checked",true);
            }else{
                $("input[name=backup]").prop("checked",false);
            }
            if(config['scan.on.boot'].enable==true){
                $("input[name=startAuto]").prop("checked",true);
            }else{
                $("input[name=startAuto").prop("checked",false);
            }
            if(config['scan.on.boot'].type==0){
                $("input[name=startAutoType][value='0']").prop("checked",true);
                $("input[name=startAutoType][value='1']").prop("checked",false);
            }else{
                $("input[name=startAutoType][value='1']").prop("checked",true);
                $("input[name=startAutoType][value='0']").prop("checked",false);
            }

        }
    });
    // 文件实时监控
    $.ajax({
        url:'/mgr/policy/_info?id='+policyid+'&fname=filemon',
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
            var config=data.data.data.config;
            if(config['scan.leve']==0){
                $("input[name=scanOp][value='0']").prop("checked",true);
            } else if(config['scan.leve']==1){
                $("input[name=scanOp][value='1']").prop("checked",true);
            }else{
                $("input[name=scanOp][value='2']").prop("checked",true);
            }
            if(config['clean.automate']==true){
                $("input[name=virusFind][value='0']").prop("checked",true);
            }else{
                $("input[name=virusFind][value='1']").prop("checked",true);
            }
            if(config['clean.quarantine']==true){
                $("input[name=backupF]").prop("checked",true);
            }else{
                $("input[name=backupF]").prop("checked",false);
            }
            if(config['scan.exclusion.file'].enable==true){
                $("input[name=debar]").prop("checked",true);
                $("input[name=debarV]").val(config['scan.exclusion.file'].value);
                $("input[name=debarV]").next().hide();
            }else{
                $("input[name=debar]").prop("checked",false);
                $("input[name=debarV]").val(config['scan.exclusion.file'].value); 
                $("input[name=debarV]").prop("disabled",true);
                $("input[name=debarV]").next().hide();
            }



        }
    });
    // 恶意行为监控
    $.ajax({
        url:'/mgr/policy/_info?id='+policyid+'&fname=behavior',
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
            var config=data.data.data.config;
            if(config['clean.automate']==true){
                $("input[name=virusFindBAM][value='0']").prop("checked",true);
            }else{
                $("input[name=virusFindBAM][value='1']").prop("checked",true);
            }
            if(config['clean.quarantine']==true){
                $("input[name=backupBAM]").prop("checked",true);
            }else{
                $("input[name=backupBAM]").prop("checked",false);
            }
            if(config['bait.enable']==true){
                $("input[name=blackMailBAM]").prop("checked",true);
            }else{
                $("input[name=blackMailBAM]").prop("checked",false);
            }

            
        }
    });
    // U盘保护
    $.ajax({
        url:'/mgr/policy/_info?id='+policyid+'&fname=udiskmon',
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
            var config=data.data.data.config;
            if(config['clean.automate']==true){
                $("input[name=virusFindUP][value='0']").prop("checked",true);
            }else{
                $("input[name=virusFindUP][value='1']").prop("checked",true);
            }
            if(config['clean.quarantine']==true){
                $("input[name=backupUP]").prop("checked",true);
            }else{
                $("input[name=backupUP]").prop("checked",false);
            }
            if(config.scan==true){
                $("input[name=cutIn2]").prop("checked",true);
            }else{
                $("input[name=cutIn2]").prop("checked",false);
            }
            if(config.repair==true){
                $("input[name=cutIn1]").prop("checked",true);
            }else{
                $("input[name=cutIn1]").prop("checked",false);
            }
            if(config['decompo.limit.size'].enable==true){
                $("input[name=zipSet]").prop("checked",true);
                $("input[name=zipSetV]").val(config['decompo.limit.size'].value) 
            }else{
                $("input[name=zipSet]").prop("checked",false);
                $("input[name=zipSetV]").val(config['decompo.limit.size'].value);
                $("input[name=zipSetV]").prop("disabled",true)
            }

        }
    });
    //下载保护
    $.ajax({
        url:'/mgr/policy/_info?id='+policyid+'&fname=dlmon',
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
            var config=data.data.data.config;
            if(config['clean.automate']==true){
                $("input[name=virusFindDP][value='0']").prop("checked",true);
            }else{
                $("input[name=virusFindDP][value='1']").prop("checked",true);
            }
            if(config['clean.quarantine']==true){
                $("input[name=backupDP]").prop("checked",true);
            }else{
                $("input[name=backupDP]").prop("checked",false);
            }
            if(config['decompo.limit.size'].enable==true){
                $("input[name=zipSetDP]").prop("checked",true);
                $("input[name=zipSetDPV]").val(config['decompo.limit.size'].value) 
            }else{
                $("input[name=zipSetDP]").prop("checked",false);
                $("input[name=zipSetDPV]").val(config['decompo.limit.size'].value);
                $("input[name=zipSetDPV]").prop("disabled",true)
            }
            if(config['scan.exclusion.ext'].enable==true){
                $("input[name=debarDP]").prop("checked",true);
                $("input[name=debarDPV]").val(config['scan.exclusion.ext'].value);
                $("input[name=debarDPV]").next().hide() 
            }else{
                $("input[name=debarDP]").prop("checked",false);
                $("input[name=debarDPV]").val(config['scan.exclusion.ext'].value);
                $("input[name=debarDPV]").prop("disabled",true);
                $("input[name=debarDPV]").next().hide();
            }

        }
    });
    //邮件监控
    $.ajax({
        url:'/mgr/policy/_info?id='+policyid+'&fname=mail',
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
            var config=data.data.data.config;
            var mailRTable="";
            if(config['clean.quarantine']==true){
                $("input[name=backupMM]").prop("checked",true);
            }else{
                $("input[name=backupMM]").prop("checked",false);
            }
            if(config['decompo.limit.size'].enable==true){
                $("input[name=zipSetMM]").prop("checked",true);
                $("input[name=zipSetMMV]").val(config['decompo.limit.size'].value) 
            }else{
                $("input[name=zipSetMM]").prop("checked",false);
                $("input[name=zipSetMMV]").val(config['decompo.limit.size'].value);
                $("input[name=zipSetMMV]").prop("disabled",true)  
            }

            if(policyid==1){
                mailRTable+="<tr><th width='10%'><input type='checkbox' onclick='selectAllFP(this)' class='verticalMiddle' disabled></th><th width='36%'>端口</th><th width='36%'>协议</th><th width='18%'>操作</th></tr>";
            }else{
                mailRTable+="<tr><th width='10%'><input type='checkbox' onclick='selectAllFP(this)' class='verticalMiddle'></th><th width='36%'>端口</th><th width='36%'>协议</th><th width='18%'>操作</th></tr>";
            }
            

            for (var i = 0; i < config.list.length; i++) {
                mailRTable+="<tr>";
                if(policyid==1){
                    mailRTable+="<td><input type='checkbox' class='selectFP verticalMiddle' disabled></td>";
                    mailRTable+="<td><input type='text' class='portInput' value="+config.list[i].port+" maxlength='5' disabled></td>";
                }else{
                    mailRTable+="<td><input type='checkbox' class='selectFP verticalMiddle'></td>";
                    mailRTable+="<td><input type='text' class='portInput' value="+config.list[i].port+" maxlength='5'></td>";
                }
               
                mailRTable+="<td>";
                if(config.list[i].type==0){
                    if(policyid==1){
                        mailRTable+="<select disabled>";
                    }else{
                        mailRTable+="<select>";
                    }
                    
                    mailRTable+="<option value=0 selected>SMTP</option>";
                    mailRTable+="<option value=1>POP3</option>";
                    mailRTable+="</select>"; 
                }else{
                    if(policyid==1){
                        mailRTable+="<select disabled>";
                    }else{
                        mailRTable+="<select>";
                    }
                    mailRTable+="<option value=0>SMTP</option>";
                    mailRTable+="<option value=1 selected>POP3</option>";
                    mailRTable+="</select>"; 
                }
                
                mailRTable+="</td>";
                if(policyid==1){
                     mailRTable+="<td><a class='opButton'>不可用</a></td>";
                 }else{
                     mailRTable+="<td><a class='underline blackfont opButton cursor' onclick='deleteMRB(this)'>删除</a></td>";
                 }
               
                mailRTable+="</tr>";
            }
            $(".mailMTable table").html(mailRTable)
        }
    });
    //软件安装拦截
    $.ajax({
        url:'/mgr/policy/_info?id='+policyid+'&fname=instmon',
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
            var config=data.data.data.config;
            if(config.autoblock==false){
                $("input[name=actionII][value='0']").prop("checked",true);
            }else{
                $("input[name=actionII][value='1']").prop("checked",true);
            }
            
        }
    });
    //浏览器保护
    $.ajax({
        url:'/mgr/policy/_info?id='+policyid+'&fname=browserprot',
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
            var config=data.data.data.config;
            if(config['startpage.blank']==true){
                $("input[name=startpage][value='0']").prop("checked",true);
                $("input[name=webpage]").prop("disabled",true);
            }else{
                $("input[name=startpage][value='1']").prop("checked",true);
                $("input[name=webpage]").val(config['startpage.site'])
            }
            
        }
    });
    //黑客入侵拦截
    $.ajax({
        url:'/mgr/policy/_info?id='+policyid+'&fname=intrusion',
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
            var config=data.data.data.config;
            if(config.block==true){
                $("input[name=actionHI][value='0']").prop("checked",true);
            }else{
                $("input[name=actionHI][value='1']").prop("checked",true);
            }
            
        }
    });
    //对外攻击检测
    $.ajax({
        url:'/mgr/policy/_info?id='+policyid+'&fname=ipattack',
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
            var config=data.data.data.config;
            if(config.block==true){
                $("input[name=actionAC][value='0']").prop("checked",true);
            }else{
                $("input[name=actionAC][value='1']").prop("checked",true);
            }
            
        }
    });
    //恶意网址拦截
    $.ajax({
        url:'/mgr/policy/_info?id='+policyid+'&fname=malsite',
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
           if(data.data.data.config['vendor.fraud']==true){

            $("input[name=fraud]").prop("checked",true);
            $("input[name=fraud]").next().addClass("lcs_on");
            $("input[name=fraud]").next().removeClass("lcs_off");
           }else{
            $("input[name=fraud]").prop("checked",false);
            $("input[name=fraud]").next().addClass("lcs_off");
            $("input[name=fraud]").next().removeClass("lcs_on");
           }
           if(data.data.data.config['vendor.spy']==true){
            $("input[name=spy]").prop("checked",true);
            $("input[name=spy]").next().addClass("lcs_on");
            $("input[name=spy]").next().removeClass("lcs_off");
           }else{
            $("input[name=spy]").prop("checked",false);
            $("input[name=spy]").next().addClass("lcs_off");
            $("input[name=spy]").next().removeClass("lcs_on");
           }
           if(data.data.data.config['vendor.phising']==true){
            $("input[name=phising]").prop("checked",true);
            $("input[name=phising]").next().addClass("lcs_on");
            $("input[name=phising]").next().removeClass("lcs_off");
           }else{
            $("input[name=phising]").prop("checked",false);
            $("input[name=phising]").next().addClass("lcs_off");
            $("input[name=phising]").next().removeClass("lcs_on");
           }
        }
    });
    //系统加固
    $.ajax({
        url:'/mgr/policy/_info?id='+policyid+'&fname=sysprot',
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
            var config=data.data.data.config;
            var filePTable="";
            var registryPTable="";
            var executeDTable="";
            var virusITable="";
            var actionITable="";
            var processPTable="";
            if(config['whitelist.enable']==true){
                $("input[name=autoHandle]").prop("checked",true);
               }else{
                $("input[name=autoHandle]").prop("checked",false);
               }
            filePTable+="<tr>";
            filePTable+="<th width='12'>";
            if(policyid==1){
                filePTable+="<input type='checkbox' onclick='selectAllFP(this)' class='selectAll' disabled>";
            }else{
                filePTable+="<input type='checkbox' onclick='selectAllFP(this)' class='selectAll'>";
            }
            
            filePTable+="</th>";
            filePTable+="<th width='500'>";
            filePTable+="<span class='verticalMiddle'>防护项目</span>";
            filePTable+="</th>";
            filePTable+="<th width='150'>";
            filePTable+="<span class='verticalMiddle'>生效方式</span>";
            filePTable+="</th>";
            filePTable+="</tr>";
            var truefilePNum=0;
            var filePNum=0;
            $.each(config['protect.file'], function (k,i) {
                filePNum=filePNum+1;
                filePTable+="<tr>";
                filePTable+="<td>";
                if(i.enable==true){
                    if(policyid==1){
                        filePTable+="<input type='checkbox' class='selectFP defendS' checked='checked' disabled>";
                    }else{
                        filePTable+="<input type='checkbox' class='selectFP defendS' checked='checked'>";
                    }
                    
                    truefilePNum=truefilePNum+1;

                }else{
                    if(policyid==1){
                        filePTable+="<input type='checkbox' class='selectFP defendS' disabled>";
                    }else{
                      filePTable+="<input type='checkbox' class='selectFP defendS'>";  
                    }
                    

                }
                filePTable+="</td>";
                filePTable+="<td>";
                filePTable+="<span class='verticalMiddle projectN'>"+k+"</span><br/>";
                filePTable+="<span class='verticalMiddle defendI'>"+safeStr(i.description)+"</span>";
                filePTable+="</td>";
                filePTable+="<td>";
                if(policyid==1){
                   filePTable+="<select class='efficientT' disabled>"; 
               }else{
                filePTable+="<select class='efficientT'>";
               }
                
                if(i.treatment==0){
                    
                    filePTable+="<option selected value='0'>自动允许</option>";
                    filePTable+="<option value='1'>自动阻止</option>";
                    filePTable+="<option value='2'>弹窗提示</option>";

                }else if(i.treatment==1){

                    filePTable+="<option value='0'>自动允许</option>";
                    filePTable+="<option selected value='1'>自动阻止</option>";
                    filePTable+="<option value='2'>弹窗提示</option>";

                }else{

                    filePTable+="<option value='0'>自动允许</option>";
                    filePTable+="<option value='1'>自动阻止</option>";
                    filePTable+="<option selected value='2'>弹窗提示</option>";
                    
                }
                filePTable+="</select>";
                filePTable+="</td>";
                filePTable+="</tr>";  
            })
            $("#filePTable").html(filePTable);
            $("#filePTable").prev().find(".td2").html("已开启"+$("#filePTable").find(".defendS:checked").length+"项");
            if(truefilePNum==filePNum){
                $("#filePTable .selectAll").prop("checked",true);
            }

            registryPTable+="<tr>";
            registryPTable+="<th width='12'>";
            if(policyid==1){
               registryPTable+="<input type='checkbox' onclick='selectAllFP(this)' class='selectAll' disabled>"; 
            }else{
                registryPTable+="<input type='checkbox' onclick='selectAllFP(this)' class='selectAll'>";
            }
            
            registryPTable+="</th>";
            registryPTable+="<th width='500'>";
            registryPTable+="<span class='verticalMiddle'>防护项目</span>";
            registryPTable+="</th>";
            registryPTable+="<th width='150'>";
            registryPTable+="<span class='verticalMiddle'>生效方式</span>";
            registryPTable+="</th>";
            registryPTable+="</tr>";
            var trueregistryPNum=0;
            var registryPNum=0;
            $.each(config['protect.reg'], function (k,i) {
                registryPNum=registryPNum+1;
                registryPTable+="<tr>";
                registryPTable+="<td>";
                if(i.enable==true){
                    if(policyid==1){
                        registryPTable+="<input type='checkbox' class='selectFP defendS' checked='checked' disabled>";
                    }else{
                        registryPTable+="<input type='checkbox' class='selectFP defendS' checked='checked'>";
                    }
                    
                    trueregistryPNum=trueregistryPNum+1;

                }else{
                    if(policyid==1){
                       registryPTable+="<input type='checkbox' class='selectFP defendS' disabled>"; 
                   }else{
                    registryPTable+="<input type='checkbox' class='selectFP defendS'>";
                   }
                    

                }
                registryPTable+="</td>";
                registryPTable+="<td>";
                registryPTable+="<span class='verticalMiddle projectN'>"+k+"</span><br/>";
                registryPTable+="<span class='verticalMiddle defendI'>"+safeStr(i.description)+"</span>";
                registryPTable+="</td>";
                registryPTable+="<td>";
                if(policyid==1){
                    registryPTable+="<select class='efficientT' disabled>";
                }else{
                    registryPTable+="<select class='efficientT'>";
                }
                
                if(i.treatment==0){
                    
                    registryPTable+="<option selected value='0'>自动允许</option>";
                    registryPTable+="<option value='1'>自动阻止</option>";
                    registryPTable+="<option value='2'>弹窗提示</option>";

                }else if(i.treatment==1){

                    registryPTable+="<option value='0'>自动允许</option>";
                    registryPTable+="<option selected value='1'>自动阻止</option>";
                    registryPTable+="<option value='2'>弹窗提示</option>";

                }else{

                    registryPTable+="<option value='0'>自动允许</option>";
                    registryPTable+="<option value='1'>自动阻止</option>";
                    registryPTable+="<option selected value='2'>弹窗提示</option>";
                    
                }
                registryPTable+="</select>";
                registryPTable+="</td>";
                registryPTable+="</tr>";  
            })
            $("#registryPTable").html(registryPTable);
            $("#registryPTable").prev().find(".td2").html("已开启"+$("#registryPTable").find(".defendS:checked").length+"项");
            if(registryPNum==trueregistryPNum){
                $("#registryPTable .selectAll").prop("checked",true);
            }


            executeDTable+="<tr>";
            executeDTable+="<th width='12'>";
            if(policyid==1){
               executeDTable+="<input type='checkbox' onclick='selectAllFP(this)' class='selectAll' disabled>"; 
            }else{
                executeDTable+="<input type='checkbox' onclick='selectAllFP(this)' class='selectAll'>";
            }
            
            executeDTable+="</th>";
            executeDTable+="<th width='500'>";
            executeDTable+="<span class='verticalMiddle'>防护项目</span>";
            executeDTable+="</th>";
            executeDTable+="<th width='150'>";
            executeDTable+="<span class='verticalMiddle'>生效方式</span>";
            executeDTable+="</th>";
            executeDTable+="</tr>";
            var executeDNum=0;
            var trueexecuteDNum=0;
            $.each(config['protect.run'], function (k,i) {
                executeDNum=executeDNum+1;
                executeDTable+="<tr>";
                executeDTable+="<td>";
                if(i.enable==true){
                    if(policyid==1){
                       executeDTable+="<input type='checkbox' class='selectFP defendS' checked='checked' disabled>"; 
                    }else{
                        executeDTable+="<input type='checkbox' class='selectFP defendS' checked='checked'>";
                    }
                    
                    trueexecuteDNum=trueexecuteDNum+1;

                }else{
                    if(policyid==1){
                       executeDTable+="<input type='checkbox' class='selectFP defendS' disabled>"; 
                    }else{
                        executeDTable+="<input type='checkbox' class='selectFP defendS'>";
                    }
                    

                }
                executeDTable+="</td>";
                executeDTable+="<td>";
                executeDTable+="<span class='verticalMiddle projectN'>"+k+"</span><br/>";
                executeDTable+="<span class='verticalMiddle defendI'>"+safeStr(i.description)+"</span>";
                executeDTable+="</td>";
                executeDTable+="<td>";
                if(policyid==1){
                    executeDTable+="<select class='efficientT' disabled>";
                }else{
                    executeDTable+="<select class='efficientT'>";
                }
                
                if(i.treatment==0){
                    
                    executeDTable+="<option selected value='0'>自动允许</option>";
                    executeDTable+="<option value='1'>自动阻止</option>";
                    executeDTable+="<option value='2'>弹窗提示</option>";

                }else if(i.treatment==1){

                    executeDTable+="<option value='0'>自动允许</option>";
                    executeDTable+="<option selected value='1'>自动阻止</option>";
                    executeDTable+="<option value='2'>弹窗提示</option>";

                }else{

                    executeDTable+="<option value='0'>自动允许</option>";
                    executeDTable+="<option value='1'>自动阻止</option>";
                    executeDTable+="<option selected value='2'>弹窗提示</option>";
                    
                }
                executeDTable+="</select>";
                executeDTable+="</td>";
                executeDTable+="</tr>";  
            })
            $("#executeDTable").html(executeDTable);
            $("#executeDTable").prev().find(".td2").html("已开启"+$("#executeDTable").find(".defendS:checked").length+"项");
            if(executeDNum==trueexecuteDNum){
                $("#executeDTable .selectAll").prop("checked",true);
            }
            // 病毒免疫
            virusITable+="<tr>";
            virusITable+="<th width='12'>";
            if(policyid==1){
                virusITable+="<input type='checkbox' onclick='selectAllFP(this)' class='selectAll' disabled>";
            }else{
                virusITable+="<input type='checkbox' onclick='selectAllFP(this)' class='selectAll'>";
            }
            
            virusITable+="</th>";
            virusITable+="<th width='500'>";
            virusITable+="<span class='verticalMiddle'>防护项目</span>";
            virusITable+="</th>";
            virusITable+="<th width='150'>";
            virusITable+="<span class='verticalMiddle'>生效方式</span>";
            virusITable+="</th>";
            virusITable+="</tr>";
            var virusINum=0;
            var truevirusINum=0;
            $.each(config['protect.immune'], function (k,i) {
                virusINum=virusINum+1;
                virusITable+="<tr>";
                virusITable+="<td>";
                if(i.enable==true){
                    if(policyid==1){
                        virusITable+="<input type='checkbox' class='selectFP defendS' checked='checked' disabled>";
                    }else{
                        virusITable+="<input type='checkbox' class='selectFP defendS' checked='checked'>";
                    }
                    
                    truevirusINum=truevirusINum+1;

                }else{
                    if(policyid==1){
                        virusITable+="<input type='checkbox' class='selectFP defendS' disabled>";
                    }else{
                        virusITable+="<input type='checkbox' class='selectFP defendS'>";
                    }
                    

                }
                virusITable+="</td>";
                virusITable+="<td>";
                virusITable+="<span class='verticalMiddle projectN'>"+k+"</span><br/>";
                virusITable+="<span class='verticalMiddle defendI'>"+safeStr(i.description)+"</span>";

                virusITable+="</td>";
                virusITable+="<td>";
                if(policyid==1){
                    virusITable+="<select class='efficientT' disabled>"; 
               }else{
                    virusITable+="<select class='efficientT'>";
               }
                
                if(i.treatment==0){
                    
                    virusITable+="<option selected value='0'>自动允许</option>";
                    virusITable+="<option value='1'>自动阻止</option>";
                    virusITable+="<option value='2'>弹窗提示</option>";

                }else if(i.treatment==1){

                    virusITable+="<option value='0'>自动允许</option>";
                    virusITable+="<option selected value='1'>自动阻止</option>";
                    virusITable+="<option value='2'>弹窗提示</option>";

                }else{

                    virusITable+="<option value='0'>自动允许</option>";
                    virusITable+="<option value='1'>自动阻止</option>";
                    virusITable+="<option selected value='2'>弹窗提示</option>";
                    
                }
                virusITable+="</select>";
                virusITable+="</td>";
                virusITable+="</tr>";  
            })
            $("#virusITable").html(virusITable);
            $("#virusITable").prev().find(".td2").html("已开启"+$("#virusITable").find(".defendS:checked").length+"项"); 
            if(virusINum==truevirusINum){
                $("#virusITable .selectAll").prop("checked",true);
            }

            // 危险动作拦截
            actionITable+="<tr>";
            actionITable+="<th width='12'>";
            if(policyid==1){
                actionITable+="<input type='checkbox' onclick='selectAllFP(this)' class='selectAll' disabled>";
            }else{
                actionITable+="<input type='checkbox' onclick='selectAllFP(this)' class='selectAll'>";
            }
            
            actionITable+="</th>";
            actionITable+="<th width='500'>";
            actionITable+="<span class='verticalMiddle'>防护项目</span>";
            actionITable+="</th>";
            actionITable+="<th width='150'>";
            actionITable+="<span class='verticalMiddle'>生效方式</span>";
            actionITable+="</th>";
            actionITable+="</tr>";
            var actionINum=0;
            var trueactionINum=0;
            $.each(config['protect.risk'], function (k,i) {
                actionINum=actionINum+1;
                actionITable+="<tr>";
                actionITable+="<td>";
                if(i.enable==true){
                    if(policyid==1){
                        actionITable+="<input type='checkbox' class='selectFP defendS' checked='checked' disabled>";
                    }else{
                        actionITable+="<input type='checkbox' class='selectFP defendS' checked='checked'>";
                    }
                    
                    trueactionINum=trueactionINum+1;

                }else{
                    if(policyid==1){
                        actionITable+="<input type='checkbox' class='selectFP defendS' disabled>";
                    }else{
                        actionITable+="<input type='checkbox' class='selectFP defendS'>";
                    }
                    

                }
                actionITable+="</td>";
                actionITable+="<td>";
                actionITable+="<span class='verticalMiddle projectN'>"+k+"</span><br/>";
                actionITable+="<span class='verticalMiddle defendI'>"+safeStr(i.description)+"</span>";

                actionITable+="</td>";
                actionITable+="<td>";
                if(policyid==1){
                    actionITable+="<select class='efficientT' disabled>"; 
               }else{
                    actionITable+="<select class='efficientT'>";
               }
                
                if(i.treatment==0){
                    
                    actionITable+="<option selected value='0'>自动允许</option>";
                    actionITable+="<option value='1'>自动阻止</option>";
                    actionITable+="<option value='2'>弹窗提示</option>";

                }else if(i.treatment==1){

                    actionITable+="<option value='0'>自动允许</option>";
                    actionITable+="<option selected value='1'>自动阻止</option>";
                    actionITable+="<option value='2'>弹窗提示</option>";

                }else{

                    actionITable+="<option value='0'>自动允许</option>";
                    actionITable+="<option value='1'>自动阻止</option>";
                    actionITable+="<option selected value='2'>弹窗提示</option>";
                    
                }
                actionITable+="</select>";
                actionITable+="</td>";
                actionITable+="</tr>";  
            })
            $("#actionITable").html(actionITable);
            $("#actionITable").prev().find(".td2").html("已开启"+$("#actionITable").find(".defendS:checked").length+"项"); 
            if(actionINum==trueactionINum){
                $("#actionITable .selectAll").prop("checked",true);
            }
             // 进程保护
            processPTable+="<tr>";
            processPTable+="<th width='12'>";
            if(policyid==1){
                processPTable+="<input type='checkbox' onclick='selectAllFP(this)' class='selectAll' disabled>";
            }else{
                processPTable+="<input type='checkbox' onclick='selectAllFP(this)' class='selectAll'>";
            }
            
            processPTable+="</th>";
            processPTable+="<th width='500'>";
            processPTable+="<span class='verticalMiddle'>防护项目</span>";
            processPTable+="</th>";
            processPTable+="<th width='150'>";
            processPTable+="<span class='verticalMiddle'>生效方式</span>";
            processPTable+="</th>";
            processPTable+="</tr>";
            var processPNum=0;
            var trueprocessPNum=0;
            $.each(config['protect.process'], function (k,i) {
                processPNum=processPNum+1;
                processPTable+="<tr>";
                processPTable+="<td>";
                if(i.enable==true){
                    if(policyid==1){
                        processPTable+="<input type='checkbox' class='selectFP defendS' checked='checked' disabled>";
                    }else{
                        processPTable+="<input type='checkbox' class='selectFP defendS' checked='checked'>";
                    }
                    
                    trueprocessPNum=trueprocessPNum+1;

                }else{
                    if(policyid==1){
                        processPTable+="<input type='checkbox' class='selectFP defendS' disabled>";
                    }else{
                        processPTable+="<input type='checkbox' class='selectFP defendS'>";
                    }
                    

                }
                processPTable+="</td>";
                processPTable+="<td>";
                processPTable+="<span class='verticalMiddle projectN'>"+k+"</span><br/>";
                processPTable+="<span class='verticalMiddle defendI'>"+safeStr(i.description)+"</span>";

                processPTable+="</td>";
                processPTable+="<td>";
                if(policyid==1){
                    processPTable+="<select class='efficientT' disabled>"; 
               }else{
                    processPTable+="<select class='efficientT'>";
               }
                
                if(i.treatment==0){
                    
                    processPTable+="<option selected value='0'>自动允许</option>";
                    processPTable+="<option value='1'>自动阻止</option>";
                    processPTable+="<option value='2'>弹窗提示</option>";

                }else if(i.treatment==1){

                    processPTable+="<option value='0'>自动允许</option>";
                    processPTable+="<option selected value='1'>自动阻止</option>";
                    processPTable+="<option value='2'>弹窗提示</option>";

                }else{

                    processPTable+="<option value='0'>自动允许</option>";
                    processPTable+="<option value='1'>自动阻止</option>";
                    processPTable+="<option selected value='2'>弹窗提示</option>";
                    
                }
                processPTable+="</select>";
                processPTable+="</td>";
                processPTable+="</tr>";  
            })
            $("#processPTable").html(processPTable);
            $("#processPTable").prev().find(".td2").html("已开启"+$("#processPTable").find(".defendS:checked").length+"项"); 
            if(processPNum==trueprocessPNum){
                $("#processPTable .selectAll").prop("checked",true);
            }
        }
    });
    //IP黑名单
    $.ajax({
        url:'/mgr/policy/_info?id='+policyid+'&fname=ipblacklist',
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
            var config=data.data.data.config.list;
            var blackLTable="";
            
            if(policyid==1){
                blackLTable+="<tr><th width='10%'><input type='checkbox' onclick='selectAllFP(this)' class='verticalMiddle' disabled></th><th width='36%'>远程IP</th><th width='36%'>备注</th><th width='18%'>操作</th></tr>";
            }else{
                blackLTable+="<tr><th width='10%'><input type='checkbox' onclick='selectAllFP(this)' class='verticalMiddle'></th><th width='36%'>远程IP</th><th width='36%'>备注</th><th width='18%'>操作</th></tr>";
            }
            

            for (var i = 0; i < config.length; i++) {
				blackLTable+="<tr>";
			    blackLTable+="<td><input type='checkbox' class='selectFP verticalMiddle'></td>";
			    if(config[i].raddr_type==0){
			    	blackLTable+="<td raddr_type=0>";
				}else{
					blackLTable+="<td raddr_type=1>";
				}
			   
			    blackLTable+="<span class='ipstart'>"+_int2ip(config[i].raddr)+"</span>";
			    if(config[i].raddr_type==1){
			    	blackLTable+="-"+"<span class='ipend'>"+_int2ip(config[i].raddr_end)+"</span>";
			    }
			    blackLTable+="</td>";
			    blackLTable+="<td><span class='txtWidth' title="+pathtitle(safeStr(config[i].memo))+">"+safeStr(config[i].memo)+"</span></td>";
			    blackLTable+="<td><a class='underline blackfont opButton cursor' onclick='editBLB(this)'>编辑</a><a class='underline blackfont opButton cursor' onclick='deleteMRB(this)'>删除</a></td>";
			    blackLTable+="</tr>";
            }
//          获取localStorage储存的ip对象,赋值给黑名单ip弹窗
            var ipObj = localStorage.getItem('ipBLB');
            if(ipObj){
           		$('.blackLTable').parents('.page').attr('ipBLB',ipObj);
            }

            
            $(".blackLTable table").html(blackLTable)
        }
    });
    //IP协议控制
    $.ajax({
        url:'/mgr/policy/_info?id='+policyid+'&fname=ipproto',
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
            var config=data.data.data.config.list;
            var protocolCTable="";
            
            if(policyid==1){
                protocolCTable+="<tr><th width='10%'><input type='checkbox' onclick='selectAllFP(this)' class='verticalMiddle' disabled></th><th width='15%'>规则名</th><th width='50%'>说明</th><th width='10%'>启用</th><th width='15%'>操作</th></tr>";
            }else{
                protocolCTable+="<tr><th width='10%'><input type='checkbox' onclick='selectAllFP(this)' class='verticalMiddle'></th><th width='15%'>规则名</th><th width='50%'>说明</th><th width='10%'>启用</th><th width='15%'>操作</th></tr>";
            }
            

            for (var i = 0; i < config.length; i++) {
                protocolCTable+="<tr>";
               
                protocolCTable+="<td><input type='checkbox' class='selectFP verticalMiddle'></td>";
                
			    
			    protocolCTable+="<td><span>"+safeStr(config[i].name)+"</span></td>";
			    if(config[i].block==0){
			        protocolCTable+="<td>"+"操作:<span class='ope' opev="+config[i].block+">放行</span>";	
			    }else{
			    	protocolCTable+="<td>"+"操作:<span class='ope' opev="+config[i].block+">阻止</span>";
			    }
			    if(config[i].direction==0){
			    	protocolCTable+=" 方向:<span class='dir' dirv="+config[i].direction+">所有</span>";
			    }else if(config[i].direction==1){
			    	protocolCTable+=" 方向:<span class='dir' dirv="+config[i].direction+">入站</span>";
			    }else{
			    	protocolCTable+=" 方向:<span class='dir' dirv="+config[i].direction+">出站</span>";
			    }
			    
			    protocolCTable+=" 协议:<span class='pro' prov="+config[i].protocol;
			    protocolCTable+=" icmp="+config[i].icmp_type+">";
			    if(config[i].protocol==1){
			    	protocolCTable+="ICMP</span><br/>";
			    }else if(config[i].protocol==2){
			    	protocolCTable+="IGMP</span><br/>";
			    }else if(config[i].protocol==3){
			    	protocolCTable+="GGP</span><br/>";
			    }else if(config[i].protocol==260){
			    	protocolCTable+="TCP/UDP</span><br/>";
			    }else if(config[i].protocol==6){
			    	protocolCTable+="TCP</span><br/>";
			    }else if(config[i].protocol==17){
			    	protocolCTable+="UDP</span><br/>";
			    }else if(config[i].protocol==12){
			    	protocolCTable+="PUP</span><br/>";
			    }else if(config[i].protocol==22){
			    	protocolCTable+="IDP</span><br/>";
			    }else if(config[i].protocol==77){
			    	protocolCTable+="ND</span><br/>";
			    }else if(config[i].protocol==50){
			    	protocolCTable+="ESP</span><br/>";
			    }else if(config[i].protocol==51){
			    	protocolCTable+="AH</span><br/>";
			    }else if(config[i].protocol==47){
			    	protocolCTable+="GRE</span><br/>";
			    }else if(config[i].protocol==27){
			    	protocolCTable+="RDP</span><br/>";
			    }else if(config[i].protocol==57){
			    	protocolCTable+="SKIP</span><br/>";
			    }else if(config[i].protocol==255){
			    	protocolCTable+="RAW</span><br/>";
			    }
			    
			    if (config[i].laddr=="*") {
			    	protocolCTable+="<span class='introWidth'>本地IP:<span class='localip'>任意IP</span>";
			    }else{
			    	protocolCTable+="<span class='introWidth'>本地IP:<span class='localip'>"+config[i].laddr+"</span>";
			    }
			    if(config[i].lport=="*") {
			    	protocolCTable+="&nbsp;本地端口:<span class='localport'>任意端口</span>";
			    }else if(config[i].lport==""){
                    protocolCTable+="&nbsp;本地端口:<span class='localport'>无</span>";
                }else{
			    	protocolCTable+="&nbsp;本地端口:<span class='localport'>"+config[i].lport+"</span>";
			    }
			    if (config[i].raddr=="*") {
			    	protocolCTable+="&nbsp;远程IP:<span class='remoteip'>任意IP</span>";
			    }else{
			    	protocolCTable+="&nbsp;远程IP:<span class='remoteip'>"+config[i].raddr+"</span>";
			    }
			    if (config[i].rport=="*") {
			    	protocolCTable+="&nbsp;远程端口:<span class='remoteport'>任意端口</span>";
			    }else if(config[i].rport==""){
                    protocolCTable+="&nbsp;远程端口:<span class='remoteport'>无</span>";
                }else{
			    	protocolCTable+="&nbsp;远程端口:<span class='remoteport'>"+config[i].rport+"</span>";
			    }
			    protocolCTable+="</span>";
			    protocolCTable+="</td>";
			    if(config[i].enabled==true){
                	protocolCTable+="<td>"+"<input type='checkbox' class='verticalMiddle' checked>"+"</td>";
                }else{
                	protocolCTable+="<td>"+"<input type='checkbox' class='verticalMiddle'>"+"</td>";
                }
			    
			    protocolCTable+="<td><a class='underline blackfont opButton cursor' onclick='editPCB(this)'>编辑</a><a class='underline blackfont opButton cursor' onclick='deleteMRB(this)'>删除</a></td>";
			    protocolCTable+="</tr>";
            }
            
            //          获取localStorage储存的ip对象,赋值规则名给弹窗
            var ipObj = localStorage.getItem('ipPC');

            if(ipObj){
           		$('.protocolCTable').parents('.page').attr('ipBLB',ipObj);
            }
            
            $(".protocolCTable table").html(protocolCTable)
        }
    });
    //设备控制
    $.ajax({
        url:'/mgr/policy/_info?id='+policyid+'&fname=devmgr',
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
           if(data.data.data.config.settings.udisk==true){

            $("input[name=udisk]").prop("checked",true);
            $("input[name=udisk]").next().addClass("lcs_on");
            $("input[name=udisk]").next().removeClass("lcs_off");
           }else{
            $("input[name=udisk]").prop("checked",false);
            $("input[name=udisk]").next().addClass("lcs_off");
            $("input[name=udisk]").next().removeClass("lcs_on");
           }
           if(data.data.data.config.settings.portable==true){
            $("input[name=portable]").prop("checked",true);
            $("input[name=portable]").next().addClass("lcs_on");
            $("input[name=portable]").next().removeClass("lcs_off");
           }else{
            $("input[name=portable]").prop("checked",false);
            $("input[name=portable]").next().addClass("lcs_off");
            $("input[name=portable]").next().removeClass("lcs_on");
           }
           if(data.data.data.config.settings['usb-wifi']==true){
            $("input[name=usb-wifi]").prop("checked",true);
            $("input[name=usb-wifi]").next().addClass("lcs_on");
            $("input[name=usb-wifi]").next().removeClass("lcs_off");
           }else{
            $("input[name=usb-wifi]").prop("checked",false);
            $("input[name=usb-wifi]").next().addClass("lcs_off");
            $("input[name=usb-wifi]").next().removeClass("lcs_on");
           }
           if(data.data.data.config.settings['usb-netcard']==true){
            $("input[name=usb-netcard]").prop("checked",true);
            $("input[name=usb-netcard]").next().addClass("lcs_on");
            $("input[name=usb-netcard]").next().removeClass("lcs_off");
           }else{
            $("input[name=usb-netcard]").prop("checked",false);
            $("input[name=usb-netcard]").next().addClass("lcs_off");
            $("input[name=usb-netcard]").next().removeClass("lcs_on");
           }
           if(data.data.data.config.settings.printer==true){
            $("input[name=printer]").prop("checked",true);
            $("input[name=printer]").next().addClass("lcs_on");
            $("input[name=printer]").next().removeClass("lcs_off");
           }else{
            $("input[name=printer]").prop("checked",false);
            $("input[name=printer]").next().addClass("lcs_off");
            $("input[name=printer]").next().removeClass("lcs_on");
           }
           if(data.data.data.config.settings.cdrom==true){
            $("input[name=cdrom]").prop("checked",true);
            $("input[name=cdrom]").next().addClass("lcs_on");
            $("input[name=cdrom]").next().removeClass("lcs_off");
           }else{
            $("input[name=cdrom]").prop("checked",false);
            $("input[name=cdrom]").next().addClass("lcs_off");
            $("input[name=cdrom]").next().removeClass("lcs_on");
           }
           if(data.data.data.config.settings.bluetooth==true){
            $("input[name=bluetooth]").prop("checked",true);
            $("input[name=bluetooth]").next().addClass("lcs_on");
            $("input[name=bluetooth]").next().removeClass("lcs_off");
           }else{
            $("input[name=bluetooth]").prop("checked",false);
            $("input[name=bluetooth]").next().addClass("lcs_off");
            $("input[name=bluetooth]").next().removeClass("lcs_on");
           }
           
           if(data.data.data.config['tips.hide'] == true){
           		$("input[name=tipsHide]").prop("checked",true);
           }else{
           		$("input[name=tipsHide]").prop("checked",false);
           }
           
           
        }
    });
}
//确认修改策略信息
function sureEditButton(a){
    //功能开关
    var fmswitchs="";
    var bamswitchs="";
    var upswitchs="";
    var dpswitchs="";
    var srswitchs="";
    var siswitchs="";
    var bpswitchs="";
    var hiswitchs="";
    var acswitchs="";
    var wiswitchs="";
    var pcswitchs="";
    var blswitchs="";
    var devSwitchs="";
    if($("input[name=fMSwitch]").is(":checked")){
        fmswitchs=true;
    }else{
        fmswitchs=false;
    }
    if($("input[name=bAMSwitch]").is(":checked")){
        bamswitchs=true;
    }else{
        bamswitchs=false;
    }
    if($("input[name=uPSwitch]").is(":checked")){
        upswitchs=true;
    }else{
        upswitchs=false;
    }
    if($("input[name=dPSwitch]").is(":checked")){
        dpswitchs=true;
    }else{
        dpswitchs=false;
    }
    if($("input[name=sRSwitch]").is(":checked")){
        srswitchs=true;
    }else{
        srswitchs=false;
    }
    if($("input[name=sISwitch]").is(":checked")){
        siswitchs=true;
    }else{
        siswitchs=false;
    }
    if($("input[name=bPSwitch]").is(":checked")){
        bpswitchs=true;
    }else{
        bpswitchs=false;
    }
    if($("input[name=hISwitch]").is(":checked")){
        hiswitchs=true;
    }else{
        hiswitchs=false;
    }
    if($("input[name=aCSwitch]").is(":checked")){
        acswitchs=true;
    }else{
        acswitchs=false;
    }
    if($("input[name=wISwitch]").is(":checked")){
        wiswitchs=true;
    }else{
        wiswitchs=false;
    }

    if($("input[name=mMSwitch]").is(":checked")){
        mmswitchs=true;
    }else{
        mmswitchs=false;
    }
    if($("input[name=pCSwitch]").is(":checked")){
        pcswitchs=true;
    }else{
        pcswitchs=false;
    }
    if($("input[name=bLSwitch]").is(":checked")){
        blswitchs=true;
    }else{
        blswitchs=false;
    }
	if($("input[name=devSwitch]").is(":checked")){
        devSwitchs=true;
    }else{
        devSwitchs=false;
    }
    var dataa={"policy_id":policyid,"fname":"power","config":{"filemon":fmswitchs,"behavior":bamswitchs,"udiskmon":upswitchs,"dlmon":dpswitchs,"sysprot":srswitchs,"instmon":siswitchs,"browserprot":bpswitchs,"intrusion":hiswitchs,"ipattack":acswitchs,"malsite":wiswitchs,"mail":mmswitchs,"ipproto":pcswitchs,"ipblacklist":blswitchs,"devmgr":devSwitchs}};
    $.ajax({
        url:'/mgr/policy/_update',
        data:JSON.stringify(dataa),
        type:'POST',
        contentType:'text/plain',
        error:function(xhr,textStatus,errorThrown){
        	if(xhr.status==401){
        	    parent.window.location.href='/';
        	}
        },
        success:function(data){

        }
    });

    
    // 病毒查杀
    var overallset1s="";
    var overallset1v="";
    var overallset2s="";
    var overallset2v="";
    var skspeeds="";
    var systemreps="";
    var actionvs="";
    var backups="";
    var startautos="";
    var startautotype="";
    if($("input[name=overallSet1]").is(":checked")){
        overallset1s=true;
        overallset1v=parseInt($("input[name=overallPara1]").val());
    }else{
        overallset1s=false;
        overallset1v=parseInt($("input[name=overallPara1]").val());
    }
    if($("input[name=overallSet2]").is(":checked")){
        overallset2s=true;
        overallset2v=$("input[name=overallPara2]").val();
    }else{
        overallset2s=false;

    }
    if($("input[name=sKSpeed]:checked").val()==1){
        skspeeds=true;
    }else{
        skspeeds=false;
    }
    if($("input[name=systemRep]").is(":checked")){
        systemreps=true;
    }else{
        systemreps=false;
    }
    if($("input[name=actionV]:checked").val()==1){
        actionvs=false;
    }else{
        actionvs=true;
    }
    if($("input[name=backup]").is(":checked")){
        backups=true;
    }else{
        backups=false;
    }
    if($("input[name=startAuto]").is(":checked")){
        startautos=true;
    }else{
        startautos=false;
    }
    if($("input[name=startAutoType]:checked").val()==0){
        startautotype=0;
    }else{
        startautotype=1;
    }

    var dataa={"policy_id":policyid,"fname":"scan","config":{"decompo.limit.size":{"enable":overallset1s,"value":overallset1v},"scan.exclusion.ext":{"enable":overallset2s,"value":overallset2v},"scan.maxspeed":skspeeds,"scan.sysrepair":systemreps,"clean.automate":actionvs,"clean.quarantine":backups,"scan.on.boot":{"enable":startautos,"type":startautotype}}};
    $.ajax({
        url:'/mgr/policy/_update',
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

        }
    });
    // 文件实时监控
    var scanops="";
    var debars="";
    var debarvv="";
    var virusfinds="";
    var backupfs="";
    if($("input[name=scanOp]:checked").val()==0){
        scanops=0;
    }else if($("input[name=scanOp]:checked").val()==1){
        scanops=1;
    }else{
        scanops=2;
    }
    if($("input[name=debar]").is(":checked")){
        debars=true;
        debarvv=$("input[name=debarV]").val();
    }else{
        debars=false;
    }
    if($("input[name=virusFind]:checked").val()==0){
        virusfinds=true;
    }else{
        virusfinds=false;
    }
    if($("input[name=backupF]").is(":checked")){
        backupfs=true;
    }else{
        backupfs=false;
    }

    var dataa={"policy_id":policyid,"fname":"filemon","config":{"clean.automate":virusfinds,"clean.quarantine":backupfs,"scan.leve":scanops,"scan.exclusion.file":{"enable":debars,"value":debarvv}}};
    $.ajax({
        url:'/mgr/policy/_update',
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

        }
    });

    var virusfindbams="";
    var backupbams="";
    var blackmailbams="";
    if($("input[name=virusFindBAM]:checked").val()==0){
        virusfindbams=true;
    }else{
        virusfindbams=false;
    }
    if($("input[name=backupBAM]").is(":checked")){
        backupbams=true;
    }else{
        backupbams=false;
    }
    if($("input[name=blackMailBAM]").is(":checked")){
        blackmailbams=true;
    }else{
        blackmailbams=false;
    }
    var dataa={"policy_id":policyid,"fname":"behavior","config":{"clean.automate":virusfindbams,"clean.quarantine":backupbams,"bait.enable":blackmailbams}};
    $.ajax({
        url:'/mgr/policy/_update',
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

        }
    });

    var cutin1s="";
    var cutin2s="";
    var virusfindups="";
    var backupups="";
    var zipsets="";
    var zipsetvv="";
    if($("input[name=cutIn1]").is(":checked")){
        cutin1s=true;
    }else{
        cutin1s=false;
    }
    if($("input[name=virusFindUP]:checked").val()==0){
        virusfindups=true;
    }else{
        virusfindups=false;
    }
    if($("input[name=cutIn2]").is(":checked")){
        cutin2s=true;
    }else{
        cutin2s=false;
    }
    if($("input[name=backupUP]").is(":checked")){
        backupups=true;
    }else{
        backupups=false;
    }
    if($("input[name=zipSet]").is(":checked")){
        zipsets=true;
        zipsetvv=parseInt($("input[name=zipSetV]").val());
    }else{
        zipsets=false;
        zipsetvv=parseInt($("input[name=zipSetV]").val());
    }
    var dataa={"policy_id":policyid,"fname":"udiskmon","config":{"clean.automate":virusfindups,"clean.quarantine":backupups,"repair":cutin1s,"scan":cutin2s,"decompo.limit.size":{"enable":zipsets,"value":zipsetvv}}};
    $.ajax({
        url:'/mgr/policy/_update',
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

        }
    });

    var virusfinddps="";
    var backupdps="";
    var zipsetdps="";
    var zipsetdpvv="";
    var debardps="";
    var debardpvv="";
    if($("input[name=virusFindDP]:checked").val()==0){
        virusfinddps=true;
    }else{
        virusfinddps=false;
    }
    if($("input[name=backupDP]").is(":checked")){
        backupdps=true;
    }else{
        backupdps=false;
    }
    if($("input[name=zipSetDP]").is(":checked")){
        zipsetdps=true;
        zipsetdpvv=parseInt($("input[name=zipSetDPV]").val());
    }else{
        zipsetdps=false;
        zipsetdpvv=parseInt($("input[name=zipSetDPV]").val());
    }
    if($("input[name=debarDP]").is(":checked")){
        debardps=true;
        debardpvv=$("input[name=debarDPV]").val();
    }else{
        debardps=false;
    }
    var dataa={"policy_id":policyid,"fname":"dlmon","config":{"clean.automate":virusfinddps,"clean.quarantine":backupdps,"scan.exclusion.ext":{"enable":debardps,"value":debardpvv},"decompo.limit.size":{"enable":zipsetdps,"value":zipsetdpvv}}};
    $.ajax({
        url:'/mgr/policy/_update',
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

        }
    });

    // 邮件监控
    var backupmms="";
    var zipsetmms="";
    var zipsetmmvv="";
    var port="";
    var agreement="";
    var mailrule="";
    var mailrlist=[];

    if($("input[name=backupMM]").is(":checked")){
        backupmms=true;
    }else{
        backupmms=false;
    }
    if($("input[name=zipSetMM]").is(":checked")){
        zipsetmms=true;
        zipsetmmvv=parseInt($("input[name=zipSetMMV]").val());
    }else{
        zipsetmms=false;
        zipsetmmvv=parseInt($("input[name=zipSetMMV]").val());
    }
    var emptynum=0;
    $(".mailMTable .portInput").each(function(){
        if($(this).val()==""){
            emptynum=emptynum+1;
        }
    })

    if(emptynum>0){
       delayHide("端口不能为空");
    }else{
        $(".mailMTable tr").each(function(index,dom){
            if(index!==0){
                port=parseInt($(dom).find(".portInput").val());
                agreement=$(dom).find("select option:selected").html();
                switch (agreement){
                    case "POP3":
                    agreement=1;
                    break;
                    case "SMTP":
                    agreement=0;
                }
                mailrule={"type":agreement,"port":port};
                mailrlist.push(mailrule);

            }
            
        })
        var dataa={"policy_id":policyid,"fname":"mail","config":{"clean.quarantine":backupmms,"decompo.limit.size":{"enable":zipsetmms,"value":zipsetmmvv},"list":mailrlist}};
        $.ajax({
            url:'/mgr/policy/_update',
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
                hideButton(a);
            }
        });
    }

    

    // 软件安装拦截
    var actioniis="";
    var debariis="";
    var debariivv="";
    if($("input[name=actionII]:checked").val()==0){
        actioniis=false;
    }else{
        actioniis=true;
    }
    // if($("input[name=debarII]").is(":checked")){
    //     debariis=true;
    //     debariivv=$("input[name=debarIIV]").val();
    // }else{
    //     debariis=false;
    // }
    var dataa={"policy_id":policyid,"fname":"instmon","config":{"autoblock":actioniis}};
    $.ajax({
        url:'/mgr/policy/_update',
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

        }
    });

    var startpages="";
    var webpagev="";
    if($("input[name=startpage]:checked").val()==0){
        startpages=true;
    }else{
        startpages=false;
        webpagev=$("input[name=webpage]").val();
    }
    var dataa={"policy_id":policyid,"fname":"browserprot","config":{"startpage.blank":startpages,"startpage.site":webpagev}}
    $.ajax({
        url:'/mgr/policy/_update',
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

        }
    });

    var actionhis="";
    if($("input[name=actionHI]:checked").val()==0){
        actionhis=true;
    }else{
        actionhis=false;

    }
    var dataa={"policy_id":policyid,"fname":"intrusion","config":{"block":actionhis}}
    $.ajax({
        url:'/mgr/policy/_update',
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

        }
    });

    var actionacs="";
    if($("input[name=actionAC]:checked").val()==0){
        actionacs=true;
    }else{
        actionacs=false;

    }
    var dataa={"policy_id":policyid,"fname":"ipattack","config":{"block":actionacs}}
    $.ajax({
        url:'/mgr/policy/_update',
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

        }
    });

    var spys="";
    var frauds="";
    var phisings="";
    if($("input[name=spy]").is(":checked")){
        spys=true;
    }else{
        spys=false;

    }
    if($("input[name=fraud]").is(":checked")){
        frauds=true;
    }else{
        frauds=false;

    }
    if($("input[name=phising]").is(":checked")){
        phisings=true;
    }else{
        phisings=false;

    }

    var dataa={"policy_id":policyid,"fname":"malsite","config":{"vendor.spy":spys,"vendor.fraud":frauds,"vendor.phising":phisings}}
    $.ajax({
        url:'/mgr/policy/_update',
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

        }
    });
    // 系统加固
    var projectn="";
    var defendi="";
    var defends="";
    var efficientt="";
    var fileptabletd={};
    var registryptabletd={};
    var executedtabletd={};
    var actionitabletd={};
    var processptabletd={};
    var virusitabletd={};
    var fileptable={};
    var sysprotconfig={};
    var registryptable={};
    var executedtable={};
    var virusitable={};
    var actionitable={};
    var processptable={};
    var whitelist=true;
    if($("input[name=autoHandle]").is(":checked")){
        whitelist=true;
    }else{
        whitelist=false;

    }

    $("#filePTable tr").each(function(index,dom){
        if(index!==0){
            projectn=$(dom).find(".projectN").html();
            defendi=$(dom).find(".defendI").html();
            if($(dom).find(".defendS").is(":checked")){
                defends=true;
            }else{
                defends=false;
            }
            efficientt=parseInt($(dom).find(".efficientT option:selected").val());
            fileptabletd={"description":defendi,"enable":defends,"treatment":efficientt};
            
            fileptable[projectn]=fileptabletd;
            
        }
        
    })
    $("#registryPTable tr").each(function(index,dom){
        if(index!==0){
            projectn=$(dom).find(".projectN").html();
            defendi=$(dom).find(".defendI").html();
            if($(dom).find(".defendS").is(":checked")){
                defends=true;
            }else{
                defends=false;
            }
            efficientt=parseInt($(dom).find(".efficientT option:selected").val());
            registryptabletd={"description":defendi,"enable":defends,"treatment":efficientt};
            
            registryptable[projectn]=registryptabletd;
            
        }
        
    })
    $("#executeDTable tr").each(function(index,dom){
        if(index!==0){
            projectn=$(dom).find(".projectN").html();
            defendi=$(dom).find(".defendI").html();
            if($(dom).find(".defendS").is(":checked")){
                defends=true;
            }else{
                defends=false;
            }
            efficientt=parseInt($(dom).find(".efficientT option:selected").val());
            executedtabletd={"description":defendi,"enable":defends,"treatment":efficientt};
            
            executedtable[projectn]=executedtabletd;
            
        }
        
    })
    $("#virusITable tr").each(function(index,dom){
        if(index!==0){
            projectn=$(dom).find(".projectN").html();
            defendi=$(dom).find(".defendI").html();
            if($(dom).find(".defendS").is(":checked")){
                defends=true;
            }else{
                defends=false;
            }
            efficientt=parseInt($(dom).find(".efficientT option:selected").val());
            virusitabletd={"description":defendi,"enable":defends,"treatment":efficientt};
            
            virusitable[projectn]=virusitabletd;
            
        }
        
    })
    $("#actionITable tr").each(function(index,dom){
        if(index!==0){
            projectn=$(dom).find(".projectN").html();
            defendi=$(dom).find(".defendI").html();
            if($(dom).find(".defendS").is(":checked")){
                defends=true;
            }else{
                defends=false;
            }
            efficientt=parseInt($(dom).find(".efficientT option:selected").val());
            actionitabletd={"description":defendi,"enable":defends,"treatment":efficientt};
            
            actionitable[projectn]=actionitabletd;
            
        }
        
    })
    $("#processPTable tr").each(function(index,dom){
        if(index!==0){
            projectn=$(dom).find(".projectN").html();
            defendi=$(dom).find(".defendI").html();
            if($(dom).find(".defendS").is(":checked")){
                defends=true;
            }else{
                defends=false;
            }
            efficientt=parseInt($(dom).find(".efficientT option:selected").val());
            processptabletd={"description":defendi,"enable":defends,"treatment":efficientt};
            
            processptable[projectn]=processptabletd;
            
        }
        
    })
    sysprotconfig={"protect.file":fileptable,"protect.reg":registryptable,"protect.run":executedtable,"protect.risk":actionitable,"protect.process":processptable,"protect.immune":virusitable,"whitelist.enable":whitelist};
    var dataa={"policy_id":policyid,"fname":"sysprot","config":sysprotconfig};
    $.ajax({
        url:'/mgr/policy/_update',
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

        }
    });

    // ip协议控制
    var prolist=[];
    $(".protocolCTable tr").each(function(index,dom){
    	
	    
        if(index!==0){
        	var newdom=$(dom).find("td").eq(2);
	    	var block=parseInt(newdom.find(".ope").attr("opev"));
	    	if(newdom.find(".remoteip").html()=="任意IP"){
	    		var raddr="*";
	    	}else{
	    		var raddr=newdom.find(".remoteip").html();
	    	}
		    var name=$(dom).find("td").eq(1).children().html();
		    var icmp_type=parseInt(newdom.find(".pro").attr("icmp"));
		    if(newdom.find(".localport").html()=="任意端口"){
	    		var lport="*";
	    	}else if(newdom.find(".localport").html()=="无"){
                var lport="";
            }else{
	    		var lport=newdom.find(".localport").html();
	    	}
		    var direction=parseInt(newdom.find(".dir").attr("dirv"));
		    var protocol=parseInt(newdom.find(".pro").attr("prov"));
		    if(newdom.find(".localip").html()=="任意IP"){
	    		var laddr="*";
	    	}else{
	    		var laddr=newdom.find(".localip").html();
	    	}
		    if(newdom.find(".remoteport").html()=="任意端口"){
	    		var rport="*";
	    	}else if(newdom.find(".remoteport").html()=="无"){
                var rport="";
            }else{
	    		var rport=newdom.find(".remoteport").html();
	    	}
	    	if($(dom).find("td").eq(3).find("input").is(":checked")){
	    		var enabled=true;
	    	}else{
	    		var enabled=false;
	    	}
            var ipproto={"block":block,"raddr":raddr,"name":name,"icmp_type":icmp_type,"lport":lport,"direction":direction,"protocol":protocol,"laddr":laddr,"rport":rport,"enabled":enabled};

            prolist.push(ipproto);

        }
        
    })
    var dataa={"policy_id":policyid,"fname":"ipproto","config":{"list":prolist}};
    $.ajax({
        url:'/mgr/policy/_update',
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
        	var ipObj = $('.protocolCTable').parents('.page').attr('ipBLB');
        	if(ipObj){
        		localStorage.setItem('ipPC',ipObj);
        	}
        	
            hideButton(a);
        }
    });
    // ip黑名单
    var blacklist=[];
    $(".blackLTable tr").each(function(index,dom){
    	
	    
        if(index!==0){
        	var newdom=$(dom).find("td").eq(1);
	    	var raddr_type=parseInt(newdom.attr("raddr_type"));

	    	var raddr=_ip2int(newdom.find(".ipstart").html());
	    	if(raddr_type==1){
	    		var raddr_end=_ip2int(newdom.find(".ipend").html());
	    	}
	    	

	    	var memo=$(dom).find("td").eq(2).find('span').html();
	    	if(raddr_type==0){
	    		var blackip={"raddr_type":raddr_type,"raddr":raddr,"memo":memo};
	    	}else{
	    		var blackip={"raddr_type":raddr_type,"raddr":raddr,"raddr_end":raddr_end,"memo":memo};
	    	}
            

            blacklist.push(blackip);

        }
        
    })
    var dataa={"policy_id":policyid,"fname":"ipblacklist","config":{"list":blacklist}};
    $.ajax({
        url:'/mgr/policy/_update',
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
        	var ipObj = $('.blackLTable').parents('.page').attr('ipBLB');
        	if(ipObj){
        		localStorage.setItem('ipBLB',ipObj);
        	}
            hideButton(a);
        }
    });
    //设备控制
    var udisk="";
    var portable="";
    var usbWifi="";
    var usbNetcard="";
    var printer="";
    var cdrom="";
    var bluetooth="";
    var tipsHide="";
    if($("input[name=udisk]").is(":checked")){
        udisk=true;
    }else{
        udisk=false;

    }
    if($("input[name=portable]").is(":checked")){
        portable=true;
    }else{
        portable=false;

    }
    if($("input[name=usb-wifi]").is(":checked")){
        usbWifi=true;
    }else{
		usbWifi=false;

    }
     if($("input[name=usb-netcard]").is(":checked")){
        usbNetcard=true;
    }else{
        usbNetcard=false;
    }
 	if($("input[name=printer]").is(":checked")){
        printer=true;
    }else{
        printer=false;

    }
    if($("input[name=cdrom]").is(":checked")){
        cdrom=true;
    }else{
        cdrom=false;

    }
    if($("input[name=bluetooth]").is(":checked")){
        bluetooth=true;
    }else{
        bluetooth=false;

    }
    if($("input[name=tipsHide]").is(":checked")){
        tipsHide=true;
    }else{
        tipsHide=false;

    }

    var dataa={"policy_id":policyid,"fname":"devmgr","config":{"tips.hide":tipsHide,"settings":{"udisk":udisk,"portable":portable,"usb-wifi":usbWifi,"usb-netcard":usbNetcard,"printer":printer,"cdrom":cdrom,"bluetooth":bluetooth}}}
    $.ajax({
        url:'/mgr/policy/_update',
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

        }
    });
    
}

// 邮件监控dom操作

function addMRB(){
    var emptynum=0;
    $(".mailMTable .portInput").each(function(){
        if($(this).val()==""){
            emptynum=emptynum+1;
        }
    })
    if(emptynum==0){
        var mailtabletr="";
        mailtabletr+="<tr>";
        mailtabletr+="<td><input type='checkbox' class='selectFP verticalMiddle'></td>";
        mailtabletr+="<td><input type='text' class='portInput' maxlength='5'></td>";
        mailtabletr+="<td><select><option value=0>SMTP</option><option value=1>POP3</option></select></td>";
        mailtabletr+="<td><a class='underline blackfont opButton cursor' onclick='deleteMRB(this)'>删除</a></td>";
        mailtabletr+="</tr>";
        $(".mailMTable table tr").eq(0).after(mailtabletr);
        $(".mailMTable .portInput").eq(0).focus();

    }else{
       delayHide("端口不能为空");
        $(".mailMTable .portInput").eq(0).focus();
    }
    
}
function deleteMRB(a){
	var ipBLB = $(a).parents(".page").attr('ipBLB');
	ipBLB = ipBLB ? jQuery.parseJSON(ipBLB) : {};
//	ipBLB = JSON.parse(ipBLB);
	var ip=$(a).parents("tr").find('td').eq(1).text();
    if(hasBLBIp(ipBLB,ip)){
    	delete ipBLB[ip];
    }
    $(a).parents(".page").attr('ipBLB',JSON.stringify(ipBLB));
    $(a).parents("tr").remove();
}

function deleteSMRB(a){
	var ipBLB = $(a).parents(".page").attr('ipBLB');
	ipBLB = ipBLB ? jQuery.parseJSON(ipBLB) : {};
//	ipBLB = JSON.parse(ipBLB);
    $(a).parents(".page").find(".selectFP:checked").each(function(){
        var ip=$(this).parents("tr").find('td').eq(1).text();
        if(hasBLBIp(ipBLB,ip)){
        	delete ipBLB[ip];
        }
        $(a).parents(".page").attr('ipBLB',JSON.stringify(ipBLB));
        $(this).parents("tr").remove();
    })
    $(a).parents(".page").find("th input[type=checkbox]").prop("checked",false);
    $(a).removeClass("greenfont");
    $(a).removeClass("cursor");
}

$(".mailMTable").on("blur",".portInput",function(){
    
    var thisinput=$(this);
    var thisvalue=$(this).val();
    
    var index=0;
    $(".mailMTable .portInput").each(function(){
        if($(this).val()==trim(thisvalue)){
            index=index+1;
        }  
    })
    if(trim($(this).val())==""){
        setTimeout(function(){$(".mailMTable .portInput").eq(0).focus()},500);
        delayHide("端口不能为空");
    }
    if(index>1){
        setTimeout(function(){$(".mailMTable .portInput").eq(0).focus()},500);
        delayHide("端口不能重复");
        $(this).val("");
    }
    
})
$(".page").on("change",".selectFP,th input[type=checkbox]",function(){
    if($(this).parents(".page").find(".selectFP:checked").length>0){
        $(this).parents(".page").find(".deleteMRB").addClass("greenfont");
        $(this).parents(".page").find(".deleteMRB").addClass("underline");
        $(this).parents(".page").find(".deleteMRB").addClass("cursor");
    }else{
        $(this).parents(".page").find(".deleteMRB").removeClass("greenfont");
        $(this).parents(".page").find(".deleteMRB").removeClass("cursor");
    }
})

// IP黑名单dom操作
function addBLB(){
    $(".windowShade").show();
    $(".addBLPop").show();
    $(".addBLPop select").val(0);
    $(".addBLPop p").eq(1).children("span").hide();
    $(".addBLPop .ip").val("");
    $(".addBLPop .remark").val("");
}
$(".addBLPop select,.editBLPop select").change(function(event) {
	if($(this).val()==0){
		$(this).parent().next().children('span').hide()
	}else{
		$(this).parent().next().children('span').show()
	}
})
function editBLB(self){
	$(self).parents("tr").siblings("tr").attr("id","");
	$(self).parents("tr").attr("id","editing");
	$(".windowShade").show();
	$(".editBLPop").show();
	var newdom=$(self).parents("tr").find("td").eq(1);
	if(newdom.attr('raddr_type')==0){
		$(".editBLPop select").val(0);
		$(".editBLPop .ip").eq(0).val(newdom.find(".ipstart").html());
		$(".editBLPop .ip").eq(0).attr('preVal1',newdom.find(".ipstart").html());
		$(".editBLPop .ip").eq(0).next().hide();

	}else{
		$(".editBLPop select").val(1);
		$(".editBLPop .ip").eq(0).val(newdom.find(".ipstart").html());
		$(".editBLPop .ip").eq(0).attr('preVal1',newdom.find(".ipstart").html());
		$(".editBLPop .ip").eq(1).val(newdom.find(".ipend").html());
		$(".editBLPop .ip").eq(1).attr('preVal1',newdom.find(".ipend").html());
		$(".editBLPop .ip").eq(0).next().show();
	}
	$(".editBLPop .remark").val($(self).parents("tr").find("td").eq(2).find("span").text())

}

function hasBLBIp(ipBLB,ip){
	if(ipBLB[ip]){
		return true;
	}
	return false;
}
// 确定添加ip黑名单
function sureAddBLB(self){
	if($(".addBLPop select").val()==0 && isValidIP($(".addBLPop .ip").eq(0).val())==false){
       delayHide("ip有误");
	}else if($(".addBLPop select").val()==1 && isValidIP($(".addBLPop .ip").eq(0).val())==false){
       delayHide("ip有误");
	}else if($(".addBLPop select").val()==1 && isValidIP($(".addBLPop .ip").eq(1).val())==false){
       delayHide("ip有误");
    }else{
        var blackLTable="";
        blackLTable+="<tr>";
        blackLTable+="<td><input type='checkbox' class='selectFP verticalMiddle'></td>";
        if($(".addBLPop select").val()==0){
            blackLTable+="<td raddr_type=0>";
        }else{
            blackLTable+="<td raddr_type=1>";
        }
       
        blackLTable+="<span class='ipstart'>"+$(".addBLPop .ip").eq(0).val()+"</span>";
        if($(".addBLPop select").val()==1){
            blackLTable+="-"+"<span class='ipend'>"+$(".addBLPop .ip").eq(1).val()+"</span>";
        }
        blackLTable+="</td>";
        blackLTable+="<td><span class='txtWidth' title="+pathtitle(safeStr($(".addBLPop .remark").val()))+">"+safeStr($(".addBLPop .remark").val())+"</span></td>";
        blackLTable+="<td><a class='underline blackfont opButton cursor' onclick='editBLB(this)'>编辑</a><a class='underline blackfont opButton cursor' onclick='deleteMRB(this)'>删除</a></td>";
        blackLTable+="</tr>";
        var ip1 = $(".addBLPop .ip").eq(0).val();
        var ip2 =$(".addBLPop .ip").eq(0).val() +'-'+ $(".addBLPop .ip").eq(1).val();
        var ipBLB = $('.blackLTable').parent('.page').attr('ipBLB');
        ipBLB = ipBLB ? jQuery.parseJSON(ipBLB) : {};
        if($(".addBLPop .hidden").css('display') == 'none'){
        	if(ip1 &&  hasBLBIp(ipBLB,ip1)){
		       delayHide("此ip已存在");
	        	return false;
	        }
        	ipBLB[ip1] = true;
        
        }else{
        	if(hasBLBIp(ipBLB,ip2)){
		        delayHide("此ip已存在");
	        	return false;
	        }
        	ipBLB[ip2] = true;
        }
        

       	$('.blackLTable').parent('.page').attr('ipBLB',JSON.stringify(ipBLB));
        $(".blackLTable table").append(blackLTable);
        $(self).parents(".windowPop").hide();
        $(self).parents(".windowPop").siblings(".windowShade").hide();
    }
	
}
function sureEditBLB(self){
	if($(".editBLPop select").val()==0 && isValidIP($(".editBLPop .ip").eq(0).val())==false){
       delayHide("ip有误");
	}else if($(".editBLPop select").val()==1 && isValidIP($(".editBLPop .ip").eq(0).val())==false){
       delayHide("ip有误");
	}else if($(".editBLPop select").val()==1 && isValidIP($(".editBLPop .ip").eq(1).val())==false){
       delayHide("ip有误");
    }else{
        
        var blackLTable="";
//      blackLTable+="<tr>";
        blackLTable+="<td><input type='checkbox' class='selectFP verticalMiddle'></td>";
        if($(".editBLPop select").val()==0){
            blackLTable+="<td raddr_type=0>";
        }else{
            blackLTable+="<td raddr_type=1>";
        }
       
        blackLTable+="<span class='ipstart'>"+$(".editBLPop .ip").eq(0).val()+"</span>";
        if($(".editBLPop select").val()==1){
            blackLTable+="-"+"<span class='ipend'>"+$(".editBLPop .ip").eq(1).val()+"</span>";
        }
        blackLTable+="</td>";
        blackLTable+="<td><span class='txtWidth' title="+pathtitle(safeStr($(".editBLPop .remark").val()))+">"+safeStr($(".editBLPop .remark").val())+"</span></td>";
        blackLTable+="<td><a class='underline blackfont opButton cursor' onclick='editBLB(this)'>编辑</a><a class='underline blackfont opButton cursor' onclick='deleteMRB(this)'>删除</a></td>";
//      blackLTable+="</tr>";
		var ip1 = $(".editBLPop .ip").eq(0).val();
        var ip2 =$(".editBLPop .ip").eq(0).val() +'-'+ $(".editBLPop .ip").eq(1).val();
        var preVal1 = $(".editBLPop .ip").eq(0).attr('preVal1');
        var preVal2 = $(".editBLPop .ip").eq(0).attr('preVal1') + '-' + $(".editBLPop .ip").eq(1).attr('preVal2');
        
        var ipBLB = $('.blackLTable').parent('.page').attr('ipBLB');
        ipBLB = ipBLB ? jQuery.parseJSON(ipBLB) : {};
        delete ipBLB[preVal1];
        delete ipBLB[preVal2];
        if($(".editBLPop .hidden").css('display') == 'none'){
        	if(ip1 && hasBLBIp(ipBLB,ip1)){
		        delayHide("此ip已存在");
	        	return false;
	        }
        	ipBLB[ip1] = true;
        }else{
        	if(hasBLBIp(ipBLB,ip2)){
		        delayHide("此ip已存在");
	        	return false;
	        }
        	ipBLB[ip2] = true;
        }
        
        
       
         
        $('.blackLTable').parent('.page').attr('ipBLB',JSON.stringify(ipBLB));
//      $(".blackLTable table").append(blackLTable);
        $(".blackLTable #editing").html(blackLTable);
        $(".blackLTable #editing").removeAttr('id');
        $(self).parents(".windowPop").hide();
        $(self).parents(".windowPop").siblings(".windowShade").hide();  
    }
	
}
// IP协议控制dom操作
function addPCB(){
    $(".windowShade").show();
    $(".addPCPop").show();
    $(".addPCPop input[name=ruleName]").val("");
    $(".addPCPop .ope").val(0);
    $(".addPCPop .dir").val(0);
    $(".addPCPop .pro").val(6);
    $('.addPCPop .localport').val(0);
    $('.addPCPop .localport').prop("disabled",false);
    $('.addPCPop .remoteport').val(0);
    $('.addPCPop .remoteport').prop("disabled",false);
    $(".addPCPop .ipports").val(0);
    $(".addPCPop input").not(":first").hide();
    $(".addPCPop .hintIco").hide();
}

function editPCB(self){
	$(self).parents("tr").siblings("tr").attr("id","");
	$(self).parents("tr").attr("id","editing");
    $(".windowShade").show();
    $(".editPCPop").show();
    var newdom=$(self).parents("tr").find("td").eq(2);
    $(".editPCPop .ope").val(newdom.find(".ope").attr("opev"));
    $(".editPCPop .dir").val(newdom.find(".dir").attr("dirv"));
    $(".editPCPop .pro").val(newdom.find(".pro").attr("prov"));
    if(newdom.find(".pro").attr("prov")==1){
    	$(".editPCPop .ICMP").show();
    }else{
    	$(".editPCPop .ICMP").hide();
    }
    $(".editPCPop input[name=ruleName]").val($(self).parents("tr").find("td").eq(1).find("span").text());
    $(".editPCPop input[name=ruleName]").attr('preVal',$(self).parents("tr").find("td").eq(1).find("span").text());
    $(".editPCPop .ICMP").val(newdom.find(".pro").attr("icmp"));
    if(newdom.find(".localip").html()=="任意IP"){
    	$(".editPCPop .localip").val(0);
    	$(".editPCPop .localipv").hide();
    	$(".editPCPop .localipv").next().hide();
    }else{
    	$(".editPCPop .localip").val(1);
    	$(".editPCPop .localipv").show();
    	$(".editPCPop .localipv").val(newdom.find(".localip").html());
    	$(".editPCPop .localipv").next().show();

    }
    if(newdom.find(".localport").html()=="任意端口"){
    	$(".editPCPop .localport").val(0).prop("disabled",false);
    	$(".editPCPop .localportv").hide();
    	$(".editPCPop .localportv").next().hide();
    }else if(newdom.find(".localport").html()=="无"){
        $(".editPCPop .localport").val(3).prop("disabled",true);
        $(".editPCPop .localportv").hide();
        $(".editPCPop .localportv").next().hide();
    }else{
    	$(".editPCPop .localport").val(1).prop("disabled",false);
    	$(".editPCPop .localportv").show();
    	$(".editPCPop .localportv").val(newdom.find(".localport").html());
    	$(".editPCPop .localportv").next().show();

    }
    if(newdom.find(".remoteip").html()=="任意IP"){
    	$(".editPCPop .remoteip").val(0);
    	$(".editPCPop .remoteipv").hide();
    	$(".editPCPop .remoteipv").next().hide();
    }else{
    	$(".editPCPop .remoteip").val(1);
    	$(".editPCPop .remoteipv").show();
    	$(".editPCPop .remoteipv").val(newdom.find(".remoteip").html());
    	$(".editPCPop .remoteipv").next().show();

    }
    if(newdom.find(".remoteport").html()=="任意端口"){
    	$(".editPCPop .remoteport").val(0).prop("disabled",false);
    	$(".editPCPop .remoteportv").hide();
    	$(".editPCPop .remoteportv").next().hide();
    }else if(newdom.find(".remoteport").html()=="无"){
        $(".editPCPop .remoteport").val(3).prop("disabled",true);
        $(".editPCPop .remoteportv").hide();
        $(".editPCPop .remoteportv").next().hide();
    }else{
    	$(".editPCPop .remoteport").val(1).prop("disabled",false);
    	$(".editPCPop .remoteportv").show();
    	$(".editPCPop .remoteportv").val(newdom.find(".remoteport").html());
    	$(".editPCPop .remoteportv").next().show();

    }

}
// 添加和编辑改变协议时的变化
$(".addPCPop .pro,.editPCPop .pro").change(function(){
	if($(this).val()==1){
		$(this).siblings(".ICMP").show();
	}else{
		$(this).siblings(".ICMP").hide();
	}
    if($(this).val()==6||$(this).val()==17||$(this).val()==260){
        $(this).parents(".windowPop").find('.localport').val(0);
        $(this).parents(".windowPop").find('.localport').prop("disabled",false);
        $(this).parents(".windowPop").find('.localportv').hide();
        $(this).parents(".windowPop").find('.localportv').next().hide();
        $(this).parents(".windowPop").find('.remoteport').val(0);
        $(this).parents(".windowPop").find('.remoteport').prop("disabled",false);
        $(this).parents(".windowPop").find('.remoteportv').hide();
        $(this).parents(".windowPop").find('.remoteportv').next().hide();
    }else{
        $(this).parents(".windowPop").find('.localport').val(3);
        $(this).parents(".windowPop").find('.localport').prop("disabled",true);
        $(this).parents(".windowPop").find('.localportv').hide();
        $(this).parents(".windowPop").find('.localportv').next().hide();
        $(this).parents(".windowPop").find('.remoteport').val(3);
        $(this).parents(".windowPop").find('.remoteport').prop("disabled",true);
        $(this).parents(".windowPop").find('.remoteportv').hide();
        $(this).parents(".windowPop").find('.remoteportv').next().hide();
    }
})
// 确定添加ip协议控制
function sureAddPCB(self){
	if(trim($(".addPCPop input[name=ruleName]").val())==""){
        delayHide("规则名不能为空");
	}else if($(".addPCPop .localip").val()==1&& trim($(".addPCPop .localipv").val())==""){
        delayHid("本地ip不能为空");
	}else if($(".addPCPop .remoteip").val()==1&& trim($(".addPCPop .remoteipv").val())==""){
        delayHide("远程ip不能为空");
	}else if($(".addPCPop .localport").val()==1&& trim($(".addPCPop .localportv").val())==""){
        delayHide("本地端口不能为空");
	}else if($(".addPCPop .remoteport").val()==1&& trim($(".addPCPop .remoteportv").val())==""){
       delayHide("远程端口不能为空");
	}else{
		var protocolCTable="";

	    protocolCTable+="<tr>";
	    
	    protocolCTable+="<td><input type='checkbox' class='selectFP verticalMiddle'></td>";
	    protocolCTable+="<td><span>"+safeStr($(".addPCPop input[name=ruleName]").val())+"</span></td>";
	    
	    protocolCTable+="<td>"+"操作:<span class='ope' opev="+$(".addPCPop .ope option:selected").val()+">"+$(".addPCPop .ope option:selected").html()+"</span> 方向:<span class='dir' dirv="+$(".addPCPop .dir option:selected").val()+">"+$(".addPCPop .dir option:selected").html()+"</span> 协议:<span class='pro' prov="+$(".addPCPop .pro option:selected").val()+" icmp="+$(".addPCPop .ICMP option:selected").val()+">"+$(".addPCPop .pro option:selected").html()+"</span><br/>";
	    if ($(".addPCPop .localip").val()==0) {
	    	protocolCTable+="<span class='introWidth'>本地IP:<span class='localip'>任意IP</span>";
	    }else{
	    	protocolCTable+="<span class='introWidth'>本地IP:<span class='localip'>"+$(".addPCPop .localipv").val()+"</span>";
	    }
	    if ($(".addPCPop .localport").val()==0) {
	    	protocolCTable+="&nbsp;本地端口:<span class='localport'>任意端口</span>";
	    }else if($(".addPCPop .localport").val()==3){
            protocolCTable+="&nbsp;本地端口:<span class='localport'>无</span>";
        }else{
	    	protocolCTable+="&nbsp;本地端口:<span class='localport'>"+$(".addPCPop .localportv").val()+"</span>";
	    }
	    if ($(".addPCPop .remoteip").val()==0) {
	    	protocolCTable+="&nbsp;远程IP:<span class='remoteip'>任意IP</span>";
	    }else{
	    	protocolCTable+="&nbsp;远程IP:<span class='remoteip'>"+$(".addPCPop .remoteipv").val()+"</span>";
	    }
	    if ($(".addPCPop .remoteport").val()==0) {
	    	protocolCTable+="&nbsp;远程端口:<span class='remoteport'>任意端口</span>";
	    }else if($(".addPCPop .remoteport").val()==3){
            protocolCTable+="&nbsp;远程端口:<span class='remoteport'>无</span>";
        }else{
	    	protocolCTable+="&nbsp;远程端口:<span class='remoteport'>"+$(".addPCPop .remoteportv").val()+"</span>";
	    }
	    protocolCTable+="</span>";
	    protocolCTable+="</td>";
	    protocolCTable+="<td>"+"<input type='checkbox' class='verticalMiddle' checked>"+"</td>";
	    protocolCTable+="<td><a class='underline blackfont opButton cursor' onclick='editPCB(this)'>编辑</a><a class='underline blackfont opButton cursor' onclick='deleteMRB(this)'>删除</a></td>";
	    protocolCTable+="</tr>";

		var ip1 = $(".addPCPop input[name=ruleName]").val();
		var ipBLB = $('.protocolCTable').parent('.page').attr('ipBLB');
		ipBLB = ipBLB ? jQuery.parseJSON(ipBLB) : {};
    	if(hasBLBIp(ipBLB,ip1)){
	        delayHide("此规则名已存在");
        	return false;
        }

		ipBLB[ip1] = true;
    	
		$('.protocolCTable').parent('.page').attr('ipBLB',JSON.stringify(ipBLB));
	    $(".protocolCTable table").append(protocolCTable);
	    $(self).parents(".windowPop").hide();
	    $(self).parents(".windowPop").siblings(".windowShade").hide();
	}
	
}
// 确定编辑ip协议控制
function sureEditPCB(self){
	if(trim($(".editPCPop input[name=ruleName]").val())==""){
        delayHide("规则名不能为空");
    }else if($(".editPCPop .localip").val()==1&& trim($(".editPCPop .localipv").val())==""){
        delayHide("本地ip不能为空");
    }else if($(".editPCPop .remoteip").val()==1&& trim($(".editPCPop .remoteipv").val())==""){
        delayHide("远程ip不能为空");
    }else if($(".editPCPop .localport").val()==1&& trim($(".editPCPop .localportv").val())==""){
        delayHide("本地端口不能为空");
    }else if($(".editPCPop .remoteport").val()==1&& trim($(".editPCPop .remoteportv").val())==""){
        delayHide("远程端口不能为空");
    }else{
		var protocolCTable="";
	    
	    
//	    protocolCTable+="<tr>";
	    
	    protocolCTable+="<td><input type='checkbox' class='selectFP verticalMiddle'></td>";
	    protocolCTable+="<td><span>"+safeStr($(".editPCPop input[name=ruleName]").val())+"</span></td>";
	    
	    protocolCTable+="<td>"+"操作:<span class='ope' opev="+$(".editPCPop .ope option:selected").val()+">"+$(".editPCPop .ope option:selected").html()+"</span> 方向:<span class='dir' dirv="+$(".editPCPop .dir option:selected").val()+">"+$(".editPCPop .dir option:selected").html()+"</span> 协议:<span class='pro' prov="+$(".editPCPop .pro option:selected").val()+" icmp="+$(".editPCPop .ICMP option:selected").val()+">"+$(".editPCPop .pro option:selected").html()+"</span><br/>";
	    if ($(".editPCPop .localip").val()==0) {
	    	protocolCTable+="<span class='introWidth'>本地IP:<span class='localip'>任意IP</span>";
	    }else{
	    	protocolCTable+="<span class='introWidth'>本地IP:<span class='localip'>"+$(".editPCPop .localipv").val()+"</span>";
	    }
	    if ($(".editPCPop .localport").val()==0) {
	    	protocolCTable+="&nbsp;本地端口:<span class='localport'>任意端口</span>";
	    }else if($(".editPCPop .localport").val()==3){
	        protocolCTable+="&nbsp;本地端口:<span class='localport'>无</span>";
	    }else{
	    	protocolCTable+="&nbsp;本地端口:<span class='localport'>"+$(".editPCPop .localportv").val()+"</span>";
	    }
	    if ($(".editPCPop .remoteip").val()==0) {
	    	protocolCTable+="&nbsp;远程IP:<span class='remoteip'>任意IP</span>";
	    }else{
	    	protocolCTable+="&nbsp;远程IP:<span class='remoteip'>"+$(".editPCPop .remoteipv").val()+"</span>";
	    }
	    if ($(".editPCPop .remoteport").val()==0) {
	    	protocolCTable+="&nbsp;远程端口:<span class='remoteport'>任意端口</span>";
	    }else if($(".editPCPop .remoteport").val()==3){
	        protocolCTable+="&nbsp;远程端口:<span class='remoteport'>无</span>";
	    }else{
	    	protocolCTable+="&nbsp;远程端口:<span class='remoteport'>"+$(".editPCPop .remoteportv").val()+"</span>";
	    }
	    protocolCTable+="</span>";
	    protocolCTable+="</td>";
	    if($(".protocolCTable #editing").find('input').eq(1).is(":checked")){
	    	protocolCTable+="<td>"+"<input type='checkbox' class='verticalMiddle' checked>"+"</td>";
	    }else{
	    	protocolCTable+="<td>"+"<input type='checkbox' class='verticalMiddle'>"+"</td>";
	    }
	    
	    protocolCTable+="<td><a class='underline blackfont opButton cursor' onclick='editPCB(this)'>编辑</a><a class='underline blackfont opButton cursor' onclick='deleteMRB(this)'>删除</a></td>";
//	    protocolCTable+="</tr>";
		var ip1 = $(".editPCPop input[name=ruleName]").val();
		var ipBLB = $('.protocolCTable').parent('.page').attr('ipBLB');
		var ip2 = $(".editPCPop input[name=ruleName]").attr('preVal');
		ipBLB = ipBLB ? jQuery.parseJSON(ipBLB) : {};
		delete ipBLB[ip2];
		
    	if(hasBLBIp(ipBLB,ip1)){
	        delayHide("此规则名已存在");
        	return false;
       }
		
		ipBLB[ip1] = true;
		
		$('.protocolCTable').parent('.page').attr('ipBLB',JSON.stringify(ipBLB));
	    $(".protocolCTable table #editing").html(protocolCTable);
	    $(".protocolCTable #editing").removeAttr('id');
	    $(self).parents(".windowPop").hide();
	    $(self).parents(".windowPop").siblings(".windowShade").hide();	
    }
	
}
// 提示图标
$(".hintIco").mouseenter(function(){
    $(this).next().show();
})
$(".hintIco").mouseleave(function(){
    $(this).next().hide();
})
// ip或端口选择任意或自定义时隐藏显示后面input
$(".ipports").change(function(event) {
    if($(this).val()==0){
        $(this).next().hide();
        $(this).next().next().hide();
    }else{
        $(this).next().show();
        $(this).next().next().show();
    }
});
tbodyAddHeight();
function tbodyAddHeight(){
    //调整页面内元素高度
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .tacticsManageTable tbody").css({height:mainlefth-294});
}

window.onresize = function(){
    var mainlefth=parent.$("#iframe #mainFrame").height();

    $(".main .tacticsManageTable tbody").css({height:mainlefth-294});

}

//输入框限制数字大小
$("input[name=overallPara1],input[name=zipSetDPV],input[name=zipSetV]").keyup(function(){

    if($(this).val()>9999){
        $(this).val(9999);
    }
})
$("input[name=overallPara1],input[name=zipSetDPV],input[name=zipSetV]").blur(function(){

    if($(this).val()<20){
        $(this).val(20);
    }
})
$("input[name=zipSetMMV]").keyup(function(){

    if($(this).val()>20){
        $(this).val(20);
    }
    if($(this).val()<1){
        $(this).val(1);
    }
})
