



if(!getCookie('page')){
    $("iframe").attr("src",'firstPage.html');
}else{
    // 页面刷新还原
    $("iframe").attr("src",getCookie('page'));
}

//系统设置中密码保护点选或者不点选后面input是否禁用
$("input[name=terminalPP],input[name=adminPP]").change(function(){

    if($(this).is(":checked")){
        $(this).parent().next().children("input").prop("disabled",false);
    }else{
        $(this).parent().next().children("input").prop("disabled",true);
    }
});
// 每天显示一次授权弹窗（授权期限小于等于15天时）
function isshowemPop(){
    if(getCookie('onceeveryday')!=='yes'){
        var tommorow = new Date();
        tommorow.setHours(23);
        tommorow.setMinutes(59);
        tommorow.setSeconds(59);
        var date=new Date(); 
        date.setTime(tommorow.getTime()+8*60*60*1000);
        // console.log(tommorow.getTime());
        // console.log(date);
        $(".emPop").show();
        shade();
        document.cookie='onceeveryday=yes;expires='+date.toGMTString();
    }
}
// 获取病毒库日期
$.ajax({
    url:'/mgr/sysconf/_version',
    type:'GET',
    contentType:'text/plain',
    headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
    error:function(xhr,textStatus,errorThrown){
        if(xhr.status==401){
            window.location.href='/';
        }else{
            
        }
        
    },
    success:function(data){
        $(".versionFloat font").html(getLocalTime1(data.data.client_dbtime));
        
    }
})
// 移入显示版本信息
$(".versionInformation").mouseenter(function(){
    $(".versionFloat").show();
}).mouseleave(function(event) {
    $(".versionFloat").hide();
});
//升级部分
function updatePop(){
    $(".updatePop").show();
    shade();
    $(".topshade").hide();
    $("#updates1").show();
    $("#updates1").siblings(".updates").hide();
    $.ajax({
        url:'/mgr/upgrade/_check',
        data:{},
        type:'GET',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            
            if(data.errno==0){
                
                newversion=data.data['center.windows'];
                if(JSON.stringify(data.data)=='{}'){
                    $("#updates7").show();
                    $("#updates7").siblings(".updates").hide();
                }else{
                    $("#updates2").show();
                    $("#updates2").siblings(".updates").hide();
                }
            }else if(data.errno==-1){
                if(data.errmsg.indexOf("license")!==-1){
                    $("#updates8").show();
                    $("#updates8 .bigp").html("<font style='color:#ffbe00'>授权已过期</font>");
                    $("#updates8").siblings(".updates").hide();
                }else{
                    $("#updates8").show();
                    $("#updates8 .bigp").html("<font style='color:#ffbe00'>网络故障</font>");
                    $("#updates8").siblings(".updates").hide();
                }
                
            }
        }
    });
}

function goupdate(){
    $("#updates3").show();
    $(".updatePop .disabledPop").show();
    $("#updates3").siblings(".updates").hide();
    $.ajax({
        url:'/mgr/upgrade/_update',
        data:{},
        type:'GET',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){

        }
    });

    var updatesloop=setInterval(function(){
        $.ajax({
            url:'/mgr/upgrade/_status',
            data:{},
            type:'GET',
            contentType:'text/plain',
            headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
            success:function(data){
                if(data.data.status=="succeed"){
                    installloop();
                    clearInterval(updatesloop);
                    
                }else if(data.data.status=="failed"){
                    $(".updatePop .disabledPop").hide();
                    $("#updates5").show();
                    $("#updates5").siblings(".updates").hide();
                    clearInterval(updatesloop);
                }
            }
        });	
    },500)

}
function installloop(){
    var installloop=setInterval(function(){
        $.ajax({
            url:'/mgr/upgrade/_status',
            data:{},
            type:'GET',
            contentType:'text/plain',
            headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
            success:function(data){
                clearInterval(installloop);
                setTimeout(function(){
                    $(".updatePop .disabledPop").hide();
                    $("#updates4").show();
                    $("#updates4").siblings(".updates").hide();
                },10000)
                
            }
        })
    
    },500)
}
function closeupdate(a){
    $(".shade").hide();
    $(a).parents(".pop").hide();
    $(".topshade").hide();
}
function closeupdateA(a){
    $(".shade").hide();
    $(a).parents(".pop").hide();
    $(".topshade").hide();
    window.location.href="/";
}
// 升级部分结束
// 点击导航切换页面
$(".nav .container a").click(function(){
    var link=$(this).prop("name");
    if($("#iframe iframe").prop("src")!==link){
        $("#iframe iframe").prop("src",link);
    }

});


$(".personButton").mouseenter(function(){
        $(".personFloat").show();
});
$(".personButton").mouseleave(function(){
        $(".personFloat").hide();
});

$(".pwModifyB").click(function(){
    $(".personFloat").hide();
    $(".modifyPwPop").show();
    $(".modifyPwPop span.placeholder").show();
    $(".modifyPwPop input").val("");
    shade();
    $(".topshade").hide();
    $(".modifyPwPop .mainBlock p font").hide();

})
$(".closeW,.hideButton").click(function(){
    $(".shade").hide();
    $(this).parents(".pop").hide();
    $(".topshade").hide();

});

$(".loginOutB").click(function(){
    $.ajax({
        url:'/auth/_logout',
        data:{},
        type:'GET',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            if(data.errno==0){
                delCookie('remeber');
                delCookie('page');
                // delCookie('password');
                window.location.href="portal.html";
                
            }else{
                alert("退出失败!");
            }
        }
    });
})
// 删除cookie
function delCookie(name){
   var date = new Date();
   date.setTime(date.getTime() - 10000);
   document.cookie = name + "=a; expires=" + date.toGMTString();
}



// 修改密码验证
var ele_pass = document.getElementById("newP");
var sure_pass = document.getElementById("sureP");
var originalP = document.getElementById("originalP");
// 原密码
originalP.onkeyup = function(event){
    event = event?event:window.event;
    if(event.keyCode == 9){
        return;
    }
    var val = this.value;
    if(val != ''){
        $("input[name=originalP]").siblings('font').hide();
    }
}
originalP.onblur = function(){
    var val = this.value;
    if(val == ''){
        $("input[name=originalP]").siblings('font').show().html('请输入原始密码');
    }
}
// 新密码
ele_pass.onkeyup = function (event) {
    event = event?event:window.event;
    if(event.keyCode == 9){
        return;
    }
    var val = this.value;
    var reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,32}$/;
    var regx = /^\S*$/;

    if(regx.test(val) == false){
        $("input[name=newP]").siblings('font').show().html('密码不可包含空格');
        return;
    }
    if(sure_pass.value != ""){
        if(sure_pass.value == val){
            $("input[name=sureP]").siblings('font').hide();
        }else{
            $("input[name=sureP]").siblings('font').show();
        }
    }
    if(!reg.test(val)){
        $("input[name=newP]").siblings('font').show().html('密码必须由8-32位大小写字母、数字、特殊字符组成');
        
        return;
    }
    $("input[name=newP]").siblings('font').hide();
    
}
ele_pass.onblur = function(){
    var val = this.value;
    if(val == ''){
        $("input[name=newP]").siblings('font').show().html('请输入新密码');
    }
}
// 确认密码
sure_pass.onkeyup = function (event) {
    event = event?event:window.event;
    if(event.keyCode == 9){
        return;
    }
    var val = this.value;

    if(ele_pass.value == val){
        $("input[name=sureP]").siblings('font').hide();
    }else{
        $("input[name=sureP]").siblings('font').show();
    }

}
sure_pass.onblur = function(){
    var val = this.value;
    if(val == ''){
        $("input[name=sureP]").siblings('font').show();
    }
}


//确认修改密码
function sureMPButton(a){
    //判断所有input是否输入正确
    var $tips = $('.vali_pass p .tips');
    for(var i = 0; i < $tips.length; i++){
        if($tips.eq(i).css('display') != 'none'){
            return;
        }
    }
   
    var newP = $("input[name=newP]").val();
    var sureP = $("input[name=sureP]").val();
    var originalP = $('input[name=originalP]').val();
    var originalp=hex_sha1(originalP);

    if(newP == sureP){
        $("input[name=sureP]").siblings('font').hide();
    }else{
        $("input[name=sureP]").siblings('font').show();
        return;
    }

    var dataa={"old_password":originalp,"new_password":hex_sha1(newP)};

    $.ajax({
        url:'/auth/_reset',
        data:JSON.stringify(dataa),
        contentType:'text/plain',
        type:'POST',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){ 
            if(data.errno == 0){
                
                $(".delayHideS").show();
                $(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'> 修改成功");
                setTimeout(function(){$(".delayHideS").hide()},2000); 
                $(".shade").hide();
                $(a).parents(".pop").hide();
                $(".topshade").hide();
                window.location.href="portal.html";
            }else{
                $("input[name=originalP]").siblings('font').show().html('原密码错误');
            }
            
        }
    });
    
    

}

// loading加载
$(".mainBlock .right").children(".page").hide();
$(".mainBlock .right").children(".page").eq(0).show();

//点击左边切换显示右边内容
$(".pageTab").click(function(){

    var index=$(this).index(".pageTab");
        $(this).siblings(".pageTab").removeClass("current");
        $(this).addClass("current");
        $(".mainBlock .right").children(".page").hide();
        $(".mainBlock .right").children(".page").eq(index).show();

})

//指定代理服务器选择屏蔽后面input
$("input[name=agent]").change(function(){
    if($(this).is(":checked")){
        $("#agentaddress").prop("disabled",false);
        $("#port").prop("disabled",false);
        $("#account").prop("disabled",false);
        $("#password").prop("disabled",false);
        $(".netTest").css({background:"rgb(255,255,255)"}).addClass("cursor");

    }else{
        $("#agentaddress").prop("disabled",true);
        $("#port").prop("disabled",true);
        $("#account").prop("disabled",true);
        $("#password").prop("disabled",true);
        $(".netTest").css({background:"#c6c6c6"}).removeClass("cursor");
    }
})
//      syslog数据导出按钮是否启用
$(document).on('click','.sysAllBtn',function(){
    if($(this).is(":checked")){
        $('.setBlock input[name=defense]').prop("disabled",false);
        $('.setBlock input[name=update]').prop("disabled",false);
        $('.setBlock input[name=leakrepair]').prop("disabled",false);
        $("#sysIp").prop("disabled",false);
        $("#sysPort").prop("disabled",false);
        $(".addButton").css({background:"rgb(255,255,255)"}).addClass("cursor");
        $(".deleteSys").addClass("cursor");
        
        
    }else{
        $('.setBlock input[name=defense]').prop("disabled",true);
        $('.setBlock input[name=update]').prop("disabled",true);
        $('.setBlock input[name=leakrepair]').prop("disabled",true);
        $("#sysIp").prop("disabled",true);
        $("#sysPort").prop("disabled",true);
        $(".addButton").css({background:"#c6c6c6"}).removeClass("cursor");
        $(".deleteSys").removeClass("cursor");
        
    }
    
})
//syslog添加ip和端口
$(document).on('click','.addButton',function(){
    if($('.setBlock input[name=enable]').prop("checked") == false){
        return false;
    }
    var sysIp = $('#sysIp').val();
    var sysPort = $('#sysPort').val();
    if(!sysIp){
        $('.addTips').css('display','inline-block');
        $('.addTips .addTips_text').html('ip不能为空');
        return false;
    }
    if(!sysPort){
        $('.addTips').css('display','inline-block');
        $('.addTips .addTips_text').html('端口不能为空');
        return false;
    }
    if(!isValidIP(sysIp)){
        $('.addTips').css('display','inline-block');
        $('.addTips .addTips_text').html('ip错误');
        return false;
    }
    if(sysPort < 0 || sysPort > 655355){
        $('.addTips').css('display','inline-block');
        $('.addTips .addTips_text').html('端口错误');
        return false;
    }
    $('.addTips').hide();
    var dataa = {"addr":sysIp,"port":parseInt(sysPort)};
    $.ajax({
        url:'/mgr/syslog/_append',
        data:JSON.stringify(dataa),
        type:'POST',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            $('#sysIp').val('');
            $('.ipTips').show();
            $('#sysPort').val('');
            $('.portTips').show();
            syslogList();
        }
    })
})
//syslog删除ip和端口
$(document).on('click','.deleteSys',function(){
    if($('.setBlock input[name=enable]').prop("checked") == false){
        return false;
    }
    var id = $(this).parents('tr').attr('sysId');
    $.ajax({
        url:'/mgr/syslog/_delete?id='+parseInt(id),
        data:{},
        type:'GET',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            syslogList();
        }
    })
})
function syslogList(){
    
    $('.syslogTable').html('');
    var dataa = {'view':{'begin':0,'count':20}}
    // 获取syslog相关设置
    $.ajax({
        url:'/mgr/syslog/_list',
        data:JSON.stringify(dataa),
        type:'post',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            var list = data.data.list;
            var table = '<table>';
            table += '<tr><th width="33%">IP</th><th width="33%">端口</th><th width="33%">操作</th></tr>'
            
            for(var i = 0;i<list.length;i++){
                table +='<tr sysId="'+list[i].id+'">'
                table += '<td width="33%">'+list[i].addr+'</td>';
                table += '<td width="33%">'+list[i].port+'</td>';
                table += '<td width="33%"><a class="underline cursor deleteSys">删除</a></td>';
                table += '</tr>'
            }
            table += '</table>'
            $('.syslogTable').append(table);
        }
    });
}

//弹出系统设置弹层
$(".systemSB").click(function(){
    $(".systemSPop").show();
    shade();
    // 获取中心升级设置
    $.ajax({
        url:'/mgr/sysconf/_upgrade',
        data:{},
        type:'GET',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            if(data.data.method==0){
                $("input[name=updateM][value='0']").prop("checked",true);
            }else if(data.data.method==1){
                $("input[name=updateM][value='1']").prop("checked",true);
            }
            if(data.data.proxy.enable==true){
                $("input[name=agent]").prop("checked",true);
                $("#agentaddress").val(data.data.proxy.addr);
                $("#port").val(data.data.proxy.port);
                $("#account").val(data.data.proxy.username);
                $("#password").val(data.data.proxy.password);
                $(".netTest").css({background:"rgb(255,255,255)"}).addClass("cursor");
            }else{
                $("#agentaddress").val(data.data.proxy.addr);
                $("#port").val(data.data.proxy.port);
                $("#account").val(data.data.proxy.username);
                $("#password").val(data.data.proxy.password);
                $("input[name=agent]").prop("checked",false);
                $("#agentaddress").prop("disabled",true);
                $("#port").prop("disabled",true);
                $("#account").prop("disabled",true);
                $("#password").prop("disabled",true);
                $(".netTest").css({background:"#c6c6c6"}).removeClass("cursor");
            }

        }
    });
    // 获取日志相关设置
    $.ajax({
        url:'/mgr/sysconf/_log',
        data:{},
        type:'GET',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){

            if(data.data.expire==7776000){
                $("input[name='saveTime'][value=0]").prop("checked",true);
            }else if(data.data.expire==15552000){
                $("input[name='saveTime'][value=1]").prop("checked",true);
            }else{
                $("input[name='saveTime'][value=2]").prop("checked",true);
            }

        }
    });
    //列出syslog服务端
    syslogList();
     // 获取syslog导出设置
    
    $.ajax({
        url:'/mgr/sysconf/_syslog',
        data:{},
        type:'GET',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            if(data.errno == 0){
                $("#sysIp").val('');
                $('.ipTips').show();
                $("#sysPort").val('');
                $('.portTips').show();
                $('.addTips_text').text('');
                $('.addTips').hide();
                
                if(data.data.enable == false){
                    $('input[name=enable]').prop("checked",false);
                    $('.setBlock input[name=defense]').prop("disabled",true);
                    $('.setBlock input[name=update]').prop("disabled",true);
                    $('.setBlock input[name=leakrepair]').prop("disabled",true);
                    $("#sysIp").prop("disabled",true);
                    $("#sysPort").prop("disabled",true);
                    $(".addButton").css({background:"#c6c6c6"}).removeClass("cursor");
                    $(".deleteSys").removeClass("cursor");
                    
                }else{
                    $('input[name=enable]').prop("checked",true);
                    $('.setBlock input[name=defense]').prop("disabled",false);
                    $('.setBlock input[name=update]').prop("disabled",false);
                    $('.setBlock input[name=leakrepair]').prop("disabled",false);
                    $("#sysIp").prop("disabled",false);
                    $("#sysPort").prop("disabled",false);
                    $(".addButton").css({background:"rgb(255,255,255)"}).addClass("cursor");
                    $(".deleteSys").addClass("cursor");
                }
                if(data.data.category.defense == true){
                    $('input[name=defense]').prop("checked",true);
                }else{
                    $('input[name=defense]').prop("checked",false);
                }
                if(data.data.category.update == true){
                    $('input[name=update]').prop("checked",true);
                }else{
                    $('input[name=update]').prop("checked",false);
                }
                if(data.data.category.leakrepair == true){
                    $('input[name=leakrepair]').prop("checked",true);
                }else{
                    $('input[name=leakrepair]').prop("checked",false);
                }
            }
        }
    });
    
    // 获取管理员联系方式
    $.ajax({
        url:'/mgr/sysconf/_contact',
        data:{},
        type:'GET',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            $("#adminName").val(data.data.name);
            $("#contactMethod").val(data.data.phone);
        }
    });
    // 获取终端保护设置
    $.ajax({
        url:'/mgr/sysconf/_protect',
        data:{},
        type:'GET',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){

            if(data.data["password.uninstall"].enable==true){
                $("input[name=terminalPP]").prop("checked",true);
                $("input[name=terminalP]").val(data.data["password.uninstall"].value);

            }else{
                $("input[name=terminalPP]").prop("checked",false);
                $("input[name=terminalP]").val(data.data["password.uninstall"].value);
                $("input[name=terminalP]").prop("disabled",true)
            }

            if(data.data["password.leave"].enable==true){
                
                $("input[name=adminPP]").prop("checked",true);
                $("input[name=adminP]").val(data.data["password.leave"].value);

            }else{
                $("input[name=adminPP]").prop("checked",false);
                $("input[name=adminP]").val(data.data["password.leave"].value);
                $("input[name=adminP]").prop("disabled",true)
            }

        }
    });
    // 获取分组列表
    $.ajax({
        url:'/mgr/group/_dict',
        type:'GET',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            var list=data.data.list;
            var select="<option value=0>全网终端</option>";

            for (var i = 0; i < list.length; i++) {
                select+="<option value="+list[i].group_id+">"+list[i].group_name+"</option>";
            }
            $("select[name='moveGroups']").html(select);
        }
    });
    // 列出迁移策略
    moveTableAjax();
    $("input[name=newAddress]").val("");
    $("input[name=newPort]").val(80);
    $("select[name=moveAddress]").val(0);
    $("select[name=moveGroups]").nextAll().remove();
    $("input[name=newAddress]").nextAll().remove();
    $("input[name=newPort]").nextAll().remove();
    // 列出备份列表
    backupsTableAjax();
    $("#importbackups input[type=file]").wrap('<form></form>');
    $("#importbackups input[type=file]").parent()[0].reset();
    $("#importbackups input[type=file]").unwrap();
})

//确认保存系统设置
function sureSetButton(a){
    var name=$("#adminName").val();
    var phone=$("#contactMethod").val();
    

    var dataa={"name":name,"phone":phone,"remark":"","password.uninstall":{"enable":ple,"value":plv},"password.leave":{"enable":pue,"value":puv}};
    $.ajax({
        url:'/mgr/sysconf/_contact',
        data:JSON.stringify(dataa),
        type:'POST',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            
        }
    });
    if($("input[name=adminPP]").is(":checked")){
        var pue=true;
        var puv=$("input[name=adminP]").val();
    }else{
        var pue=false;
        var puv=$("input[name=adminP]").val();
    }
    if($("input[name=terminalPP]").is(":checked")){
        var ple=true;
        var plv=$("input[name=terminalP]").val();
    }else{
        var ple=false;
        var plv=$("input[name=terminalP]").val();
    }
    var dataa={"password.uninstall":{"enable":ple,"value":plv},"password.leave":{"enable":pue,"value":puv}};
    $.ajax({
        url:'/mgr/sysconf/_protect',
        data:JSON.stringify(dataa),
        type:'POST',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        success:function(data){
            
        }
    });
    if($("input[name=saveTime]:checked").val()==0){
        var expire=7776000;

    }else if($("input[name=saveTime]:checked").val()==1){
        var expire=15552000;
    }else{
        var expire=31104000;
    }
    var dataa={"expire":expire};
    $.ajax({
        url:'/mgr/sysconf/_log',
        data:JSON.stringify(dataa),
        type:'POST',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        success:function(data){
   

        }
    });
    var addr=$("#agentaddress").val();
    var port=parseInt($("#port").val());
    var username=$("#account").val();
    var password=$("#password").val();

    if($("input[name=updateM][value=0]").is(":checked")){
        var method=0;
    }else{
        var method=1;
    }
    

    if($("input[name=agent]").is(":checked")){
        var dataa={"method":method,"proxy":{"enable":true,"addr":addr,"port":port,"username":username,"password":password}};
    }else{
        var dataa={"method":method,"proxy":{"enable":false,"addr":addr,"port":port,"username":username,"password":password}};
    }
    
    $.ajax({
        url:'/mgr/sysconf/_upgrade',
        data:JSON.stringify(dataa),
        type:'POST',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        success:function(data){
            $(a).parents(".pop").hide();
             $(".shade").hide();
             $(".topshade").hide();

        }
    });
    
    
    //更新syslog导出设置
   
    var dataa = {};
    dataa.category = {};
    if($('input[name=enable]').is(':checked')){
        dataa.enable = true;
    }else{
        dataa.enable = false;
    }
    if($('input[name=defense]').is(':checked')){
        dataa.category['defense'] = true;
    }else{
        dataa.category['defense'] = false;
    }
    if($('input[name=update]').is(':checked')){
        dataa.category['update'] = true;
    }else{
        dataa.category['update'] = false;
    }
    if($('input[name=leakrepair]').is(':checked')){
        dataa.category['leakrepair'] = true;
    }else{
        dataa.category['leakrepair'] = false;
    }
    
    $.ajax({
        url:'/mgr/sysconf/_syslog',
        data:JSON.stringify(dataa),
        type:'POST',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        success:function(data){
            $("#sysIp").val('');
            $('.ipTips').show();
            $("#sysPort").val('');
            $('.portTips').show();
        }
    });
}

// 备份设置弹层
function backupsSetPop(){
    $(".backupsSetPop").show();
    $(".windowShade").show();
    $.ajax({
        url:'/mgr/sysconf/_backup',
        type:'GET',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            if(data.data.auto.enabled==false){
                $("input[name=isautoba]").prop('checked', false);

            }else{
                $("input[name=isautoba]").prop('checked', true);
            }
            if(('mday' in data.data.auto)==true){
                $("input[name=bacyc]").eq(0).prop('checked', true);
                $("select[name=mday]").val(data.data.auto.mday);
            }else{
                $("input[name=bacyc]").eq(1).prop('checked', true);
                $("select[name=wday]").val(data.data.auto.wday);
            }
            $("select[name=bastarttime]").val(data.data.auto.freetime.begin);
            $("select[name=baendtime]").val(data.data.auto.freetime.end);
            $("input[name=backupscata]").val(data.data.path);
        }
    });
    
}
// 保存备份设置
function savebasetButton(self){
    if($("input[name='isautoba']").is(":checked")){
        var enabled=true;
    }else{
        var enabled=false;
    }
    if($("input[name='bacyc']").eq(0).is(":checked")){
        var mday=parseInt($("select[name=mday]").val());
    }else{
        var wday=parseInt($("select[name=wday]").val())
    }
    var begin=parseInt($("select[name=bastarttime]").val());
    var end=parseInt($("select[name=baendtime]").val());
    var path=$("input[name=backupscata]").val();
    var dataa={"auto":{"enabled":enabled,"mday":mday,"wday":wday,"freetime":{"begin":begin,"end":end}},"path":path};
    $.ajax({
        url:'/mgr/sysconf/_backup',
        data:JSON.stringify(dataa),
        type:'POST',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            if(data.errno==0){
                $(self).parents(".windowPop").hide();
                $(self).parents(".pop").find(".windowShade").hide();
                $(".delayHideS").show();
                $(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'> 操作成功");
                setTimeout(function(){$(".delayHideS").hide()},2000); 
                backupsTableAjax();
            }
        }
    });

}
// 删除备份弹层
function deleteBaPop(self){
    $(".deleteBaPop").show().attr("id",$(self).parents("tr").attr("id"));
    $(".windowShade").show();
}
// 确定删除备份
function sureDBaButton(self){
    var id=parseInt($(self).parents(".windowPop").attr("id"));
    $.ajax({
        url:'/mgr/backup/_delete?ts='+id,
        type:'GET',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            if(data.errno==0){
                backupsTableAjax();
                $(self).parents(".windowPop").hide();
                $(self).parents(".pop").find(".windowShade").hide();
                $(".delayHideS").show();
                $(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'> 操作成功");
                setTimeout(function(){$(".delayHideS").hide()},2000); 
            }
        }
    });
}
// 关闭弹层中的弹层
$(".closeWW,.hideButtonn").click(function() {
    
    $(this).parents(".windowPop").hide();
    $(this).parents(".pop").find(".windowShade").hide();
    if($(this).parent().parent().attr("class")=="backupPop windowPop"){
        window.location.href="/waitingB.html";
    }else if($(this).parent().parent().attr("class")=="recoverNPop windowPop"){
        window.location.href="/waitingR.html";
    }
});
// 移入导入备份按钮变化
$("#importbackups input[type=file]").mouseenter(function(){
    $(".iBButton").css('border', '1px solid #77d895');
})
$("#importbackups input[type=file]").mouseleave(function(){
    $(".iBButton").css('border', '1px solid rgb(231,234,236)');
})
// 立即备份弹层
$(".bButton").click(function() {
    $(".backupPop").show();
    $(".windowShade").show();
    var _this=$(this);
    _this.addClass("bButtonDis").removeClass("bButton");
    var dataa={"remark":$("input[name=backupsRemark]").val()};
    $.ajax({
        url:'/mgr/backup/_backup',
        data:JSON.stringify(dataa),
        type:'POST',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            _this.removeClass("bButtonDis").addClass("bButton");
            if(data.errno==0){
                
                    // 定时访问备份状态
                    var loop=setInterval(function(){
                        $.ajax({
                            url:'/mgr/backup/_status',
                            type:'GET',
                            contentType:'text/plain',
                            headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
                            error:function(xhr,textStatus,errorThrown){
                                if(xhr.status==401){
                                    window.location.href='/';
                                }else{
                                    
                                }
                                
                            },
                            success:function(data){
                                if(data.errno==0){
                                    if(data.data.status=="none"){
                                        clearInterval(loop);
                                        backupsTableAjax();
                                        $(".backupPop").hide();
                                        $(".systemSPop").find('.windowShade').hide();
                                        $(".delayHideS").show();
                                        $(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> 备份成功</span>");
                                        setTimeout(function(){$(".delayHideS").hide()},2000);
                                    }
                                }else if(data.errno==-1){
                                    $(".backupPop").hide();
                                    $(".windowShade").hide();
                                    clearInterval(loop);
                                    backupsTableAjax();
                                    $(".delayHideS").show();
                                    $(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> 备份出错</span>");
                                    setTimeout(function(){$(".delayHideS").hide()},2000);
                                }
                                
                            }
                        })
                    },500)
                    
                
            }
        }
    });

});
// 导入备份按钮
$(".iBButton").click(function(){
    $("input[name=data]").click();
})
// input变化时导入备份
$("input[name=data]").change(function(){
    $("#importbackups").submit();
})
//执行提交表单过程
$(function(){
    $('#importbackups').ajaxForm({
        beforeSerialize:function(){

        },
        beforeSubmit:function(){

        },
        beforeSend: function() {

        },
        uploadProgress: function(event, position, total, percentComplete) {//上传的过程

        },
        success: function(data) {//成功

            $("#importbackups input[type=file]").wrap('<form></form>');
            $("#importbackups input[type=file]").parent()[0].reset();
            $("#importbackups input[type=file]").unwrap();
            //判断浏览器是否为ie7或8
            var browser=navigator.appName; 
            if(browser=="Microsoft Internet Explorer"){
                var b_version=navigator.appVersion; 
                var version=b_version.split(";"); 
                var trim_Version=version[1].replace(/[ ]/g,"");
                if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0") 
                { 
                    data=JSON.parse(data);
                }else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0") 
                { 
                    data=JSON.parse(data);
                }else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE9.0") 
                { 
                    data=JSON.parse(data);
                }  
            }
            

            if(data.errno==-1){
                $(".delayHide").show();
                $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 文件有误");
                setTimeout(function(){$(".delayHide").hide()},2000);
            }else if(data.errno==0){
                // 添加成功提示
                backupsTableAjax();
                $(".delayHideS").show();
                $(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> 添加成功</span>");
                setTimeout(function(){$(".delayHideS").hide()},2000);
                
               
            }        
        },
        error:function(err){//失败
            alert("表单提交异常！"+err.msg);
        },
        complete: function(xhr) {//完成
            
        }
    });

});
// 恢复备份弹层
function recoverPop(self){
    $(".recoverPop").show().attr("id",$(self).parents("tr").attr("id"));
    $(".windowShade").show();
}
// 确定恢复备份
function sureRBButton(self){
    var id=parseInt($(self).parents(".windowPop").attr("id"));
    $.ajax({
        url:'/mgr/backup/_restore?ts='+id,
        type:'GET',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            if(data.errno==0){
                $(self).parents(".windowPop").hide();
                $(".recoverNPop").show();
                var loop=setInterval(function(){
                    $.ajax({
                        url:'/mgr/backup/_status',
                        type:'GET',
                        contentType:'text/plain',
                        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
                        error:function(xhr,textStatus,errorThrown){
                            if(xhr.status==401){
                                window.location.href='/';
                            }else{
                                
                            }
                            
                        },
                        success:function(data){
                            if(data.errno==0){
                                if(data.data.status=="none"){
                                    clearInterval(loop);
                                    $(self).parents(".pop").find(".windowShade").hide();
                                    $(".recoverNPop").hide();
                                    $(".delayHideS").show();
                                    $(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'> 恢复成功");
                                    setTimeout(function(){$(".delayHideS").hide()},2000);   
                                }
                            }
                            
                        }
                    })
                },500)
                
            }
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
// 列出备份列表ajax
function backupsTableAjax(){
    $.ajax({
        url:'/mgr/backup/_list?marker=0&max=100',
        type:'GET',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            var list=data.data.list;
            if(list!==null){
                var table="<table>";
                table+="<tr>";
                table+="<th>备份时间</th>";
                table+="<th>中心版本</th>";
                table+="<th>备注</th>";
                table+="<th>备注类型</th>";
                table+="<th>大小</th>";
                table+="<th>操作</th>";
                table+="</tr>";
                for (var i = 0; i < list.length; i++) {
                    table+="<tr id="+list[i].ts+">";
                    table+="<td>"+getLocalTime(list[i].ts)+"</td>";
                    table+="<td>"+list[i].center_version+"</td>";
                    if(list[i].remark==""){
                        table+="<td>-</td>";
                    }else{
                        table+="<td><span class='nameWidth' title="+safeStr(pathtitle(list[i].remark))+">"+safeStr(list[i].remark)+"</span></td>";
                    }
                    
                    if(list[i].type=="auto"){
                        table+="<td>自动备份</td>";
                    }else{
                        table+="<td>手动备份</td>";
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
                    table+="<td>";
                    table+="<a class='cursor underline blackfont' onclick='recoverPop(this)'>立即恢复</a>&nbsp;";
                    table+="<a class='cursor underline blackfont' href='/mgr/backup/_download?ts="+list[i].ts+"'>下载</a>&nbsp;";
                    table+="<a class='cursor underline blackfont' onclick='deleteBaPop(this)'>删除</a>";
                    table+="</td>";
                    table+="</tr>";
                }
                table+="</table>";
                $(".backupsTable").eq(0).html(table);
            }else{
                $(".backupsTable").eq(0).html("");
            }
        }
    });
}
// 列出迁移策略ajax
function moveTableAjax(){
    var dataa={"view":{"begin":0,"count":10000}}
    $.ajax({
        url:'/mgr/migrate/_list',
        data:JSON.stringify(dataa),
        type:'POST',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            
            var list=data.data.list;
            if(list!==null){
                var table="<table>";
                table+="<tr>";
                table+="<th>新控制中心地址</th>";
                table+="<th>迁移终端</th>";
                table+="<th>开始迁移时间</th>";
                table+="<th>已迁移/总迁移数</th>";
                table+="<th>操作</th>";
                table+="</tr>";
                for (var i = 0; i < list.length; i++) {
                    table+="<tr id="+list[i].id+">";
                    table+="<td>"+safeStr(list[i].addr)+"</td>";
                    if(list[i].group_name==""){
                        table+="<td><span class='nameWidth'>全网终端</span></td>";
                    }else{
                        table+="<td><span class='nameWidth' title="+safeStr(pathtitle(list[i].group_name))+">"+safeStr(list[i].group_name)+"</span></td>";
                    }
                    table+="<td>"+getLocalTime(list[i].create_ts)+"</td>";
                    table+="<td>"+list[i].done+"/"+list[i].total+"</td>";
                    table+="<td>";
                    table+="<a class='underline greenfont cursor' onclick='endMovePop(this)'>终止</a>&nbsp;";
                    table+="<a class='underline greenfont cursor' href='/mgr/migrate/_tools'>迁移工具</a>";
                    table+="</td>";
                    table+="</tr>";
                }
                table+="</table>";
                $(".moveTable").html(table);
            }else{
                $(".moveTable").html("");
            }
        }
    });
}
// 
$("input[name=newAddress],input[name=newPort],select[name=moveGroups]").focus(function(){
    $(this).nextAll().remove();
})
// 创建迁移策略
$(".movePara").on("click",".moveButton",function(event) {
    var _this=$(this);
    _this.addClass("moveButtonDis").removeClass("moveButton");
    $("select[name=moveGroups]").nextAll().remove();
    $("input[name=newAddress]").nextAll().remove();
    $("input[name=newPort]").nextAll().remove();
    if(trim($("input[name=newAddress]").val())==""){
        $("input[name=newAddress]").after("&nbsp;<font style='color:#f37e00'>请输入新控制中心地址</font>");
        _this.removeClass("moveButtonDis").addClass("moveButton");
    }else{
        var dataa={"addr":$("input[name=newAddress]").val(),"group_id":parseInt($("select[name=moveGroups]").val())};
        $.ajax({
            url:'/mgr/migrate/_create',
            data:JSON.stringify(dataa),
            type:'POST',
            contentType:'text/plain',
            headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
            error:function(xhr,textStatus,errorThrown){
                if(xhr.status==401){
                    window.location.href='/';
                }else{
                    
                }
                
            },
            success:function(data){
                _this.removeClass("moveButtonDis").addClass("moveButton");
                if(data.errno==0){
                    moveTableAjax();
                    $("input[name=newAddress]").val("");
                    $("select[name=moveAddress]").val(0);
                }else if(data.errno==-1&&data.errmsg.indexOf("Invalid Group")!==-1){
                    $("select[name=moveGroups]").after("&nbsp;<font style='color:#f37e00'>已存在同一分组的迁移任务</font>");
                }else if(data.errno==-1&&data.errmsg.indexOf("Invalid Server")!==-1){
                    $("input[name=newAddress]").after("&nbsp;<font style='color:#f37e00'>无效的地址或者端口</font>");
                }else if(data.errno==-1&&data.errmsg.indexOf("No Clients")!==-1){
                    $("select[name=moveGroups]").after("&nbsp;<font style='color:#f37e00'>此分组没有终端</font>");
                }else{
                    $("input[name=newAddress]").after("&nbsp;<font style='color:#f37e00'>无法连接新的控制中心</font>");
                }
            }
        });
    }
    
});
// 删除迁移策略
function endMovePop(self){
    $(".endMovePop").show().attr("id",$(self).parents("tr").attr("id"));
    $(".windowShade").show();      	
}
function sureDMButton(self){
    $.ajax({
        url:'/mgr/migrate/_delete?id='+$(".endMovePop").attr("id"),
        type:'POST',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            if(data.errno==0){
                $(".endMovePop").hide();
                $(self).parents(".pop").find(".windowShade").hide();
                moveTableAjax();
            }else{

            }
        }
    });
}
//iframe高度随浏览器窗口变化
var h=window.innerHeight-110 || document.documentElement.clientHeight-110 || document.body.clientHeight-110;
if(h<820){
    document.getElementById("iframe").style.height = 820+"px";
    document.getElementById("mainFrame").style.height = 820+"px";
}else{
    document.getElementById("iframe").style.height = h+"px";
    document.getElementById("mainFrame").style.height = h+"px";
}

window.onresize = function(){
    var h=window.innerHeight-110 || document.documentElement.clientHeight-110 || document.body.clientHeight-110;
    if(h<820){
        document.getElementById("iframe").style.height = 820+"px";
        document.getElementById("mainFrame").style.height = 820+"px";
    }else{
        document.getElementById("iframe").style.height = h+"px";
        document.getElementById("mainFrame").style.height = h+"px";
    }
    
}


//引导层逻辑
$(".closeLead").click(function(){
    $("#leadLayer").hide();
    $("#leadContentLayer").hide();
})
$(".next1").click(function(){
    $(".leadBlock1").hide();
    $(".leadBlock2").show();
})
$(".next2").click(function(){
    $(".nav .container a").removeClass("current");
    $(".nav .container a").eq(4).addClass("current");
    $("#mainFrame").attr("src","terminalArrange.html");
    $(".leadBlock2").hide();
    $(".leadBlock3").show();
})
$(".next3").click(function(){
    $("#leadLayer").hide();
    $("#leadContentLayer").hide();

    $("#mainFrame").contents().find(".shade").show();
    $(".topshade").show();
    $("#mainFrame").contents().find(".terminalASPop").show();
    var ip="";
    $.ajax({
        url:'/mgr/sysconf/_deploy',
        data:{},
        type:'GET',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            $("#mainFrame").contents().find("#noticeTitle").val(data.data.title);
            $("#mainFrame").contents().find("#noticeContent").val(data.data.content);
            ip=data.data.addr;

        }
    });
    $.ajax({
        url:'/mgr/sysconf/_iplist',
        data:{},
        type:'GET',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }else{
                
            }
            
        },
        success:function(data){
            
            var list=data.data.list;
            var iplist="";
            if(isInArray(list,ip)==false){
                for (var i = 0; i < list.length; i++) { 
                    iplist+="<option>"+list[i]+"</option>";       
                }
                iplist+="<option value=0 selected>自定义域名</option>";
                $("#mainFrame").contents().find("#addressContent").next().show();
                $("#mainFrame").contents().find("#addressContent").next().next().show();
                $("#mainFrame").contents().find("#addressContent").next().next().val(ip);
            }else{
                for (var i = 0; i < list.length; i++) {
                    if(list[i]==ip){
                        iplist+="<option selected>"+list[i]+"</option>";
                    }else{
                        iplist+="<option>"+list[i]+"</option>";    
                    }
                    
                }
                iplist+="<option value=0>自定义域名</option>";
            }
            
            $("#mainFrame").contents().find("#addressContent").html(iplist);


        }
    });
})

// 网络测试
$(".netTest").click(function(){

    if($("input[name=agent]").is(":checked")){
        var addr=$("#agentaddress").val();
        var port=parseInt($("#port").val());
        var username=$("#account").val();
        var password=$("#password").val();
        if(username==""||password==""){
            var dataa={"addr":addr,"port":port};
        }else{
            var dataa={"addr":addr,"port":port,"username":username,"password":password};
        }
        
        $.ajax({
            url:'/mgr/upgrade/_proxycheck',
            data:JSON.stringify(dataa),
            type:'POST',
            contentType:'text/plain',
            headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
            error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                    window.location.href='/';
                }else{
                    
                }
                
            },
            success:function(data){
                if(data.errno==0){
                    $(".delayHideS").show();
                    $(".delayHideS .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 测试成功");
                    setTimeout(function(){$(".delayHideS").hide()},2000); 
                }else{
                    $(".delayHide").show();
                    $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 测试失败");
                    setTimeout(function(){$(".delayHide").hide()},2000); 
                }
            }
        });
    }
    
})

// 获取cookie里的值
function getCookie(name){
    var arr=document.cookie.split('; ');  
    
    for(var i=0;i<arr.length;i++){
        /* 将cookie名称和值拆分进行判断 */       
        var arr2=arr[i].split('=');               
        if(arr2[0]==name){           
            return arr2[1];       
        }   
    }       
}

// 获取授权状态
emStatus();
function emStatus(){
    $(".emPop .right p").eq(3).html("<p>授权期限&nbsp;&nbsp;:&nbsp;&nbsp;剩余&nbsp;<span class='emOver colorOrange'>0</span>&nbsp;天<span class='specialTxt'>,请立即<font class='colorOrange'>更新授权</font></span></p>");
    $.ajax({
        url:'/mgr/sysconf/_license',
        data:{},
        type:'GET',
        contentType:'text/plain',
        headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
        error:function(xhr,textStatus,errorThrown){
            if(xhr.status==401){
                window.location.href='/';
            }
        },
        success:function(data){
            
            // var emover=parseInt(data.data.remain_days);

            var windows_type = data.data.windows.type;
            var linux_type = data.data.linux.type;
            var windows_time = data.data.windows.remain_days;
            var linux_time = data.data.linux.remain_days;

            // 未授权时，添加或更新授权理由
            var emhintfloat1="<p>产品未授权,将有以下限制</p><p>1,版本无法升级</p><p>2,病毒库无法更新</p><p>3,只可以部署10台终端</p>";
            // 授权天数小于等于15天时/小于等于0，添加或更新授权理由
            var emhintfloat2="<p>产品授权到期后,将有以下限制</p><p>1,版本无法升级</p><p>2,病毒库无法更新</p>";
            // 授权台数
            $(".windows_num .emTerminal").html(data.data.windows.nodes_num);
            $(".linux_num .emTerminal").html(data.data.linux.nodes_num);

            if(windows_type == 0 && linux_type == 0){  /*!!!windows和linux均为未授权!!!*/
               
                // ````入口授权状态``````未授权显示，其它隐藏
                $(".top .container .logo .emmsg0").show();
                $(".top .container .logo .empng0").css({display:"inline-block"});	
                $(".top .container .logo .emmsg1").hide();
                $(".top .container .logo .empng1").css({display:"none"});
                $(".top .container .logo .emmsg2").hide();
                $(".top .container .logo .empng2").css({display:"none"});

                // ````授权信息授权状态``````未授权部分显示，其它隐藏
                $(".emPop .emStatus0").show();
                $(".emPop .emStatus1").hide();
                $(".emPop .emStatus2").hide();
                //授权小于等于15天或者未授权时进入页面弹授权信息窗
                isshowemPop();
                
                //未授权下授权公司为未授权
                $(".emCom").html("未授权");
                // 授权期限描述
                $(".windows_over,.linux_over").html("授权期限&nbsp;&nbsp;:&nbsp;&nbsp;未授权<span class='specialTxt'>,请立即<font class='colorOrange'>更新授权</font></span>");

                //添加授权理由显示
                $(".emPop .emhintfloat").html(emhintfloat1);
                $(".emPop .emhint").show();

                // $(".emPop .specialTxt").show();
                
                

            }else if(windows_type == 1 || linux_type == 1){
                /*!!!windows和linux任意一个处于正常授权状态为正版授权!!!*/
                
                // 正版授权状态start↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
                // ````入口授权状态``````正版授权显示，其余隐藏
                $(".top .container .logo .emmsg0").hide();
                $(".top .container .logo .empng0").css({display:"none"});
                $(".top .container .logo .emmsg2").hide();
                $(".top .container .logo .empng2").css({display:"none"});
                $(".top .container .logo .emmsg1").show();
                $(".top .container .logo .empng1").css({display:"inline-block"});

                // ````授权信息授权状态``````正版授权显示，其它隐藏
                $(".emPop .emStatus0").hide();   
                $('.emPop .emStatus2').hide();
                $(".emPop .emhint").hide();
                $(".emCom").html(data.data.to);  //显示授权公司名称
                $(".emCom").attr("title",pathtitle(data.data.to));

                
                if(windows_type == 1){
                    $(".emPop .windows_over .specialTxt").hide();
                    $(".windows_over .emOver").html(windows_time);// 授权期限
                    

                }else if(windows_type == 0){
                    // 授权期限描述
                    $(".windows_over").html("授权期限&nbsp;&nbsp;:&nbsp;&nbsp;未授权<span class='specialTxt'>,请立即<font class='colorOrange'>更新授权</font></span>");
                }
/**    这块可能暂缺 逻辑判断 某一端type不为1情况下 可能type为0即未授权，授权期限已满，授权小于15天 */
                if(linux_type == 1){
                    $(".emPop .linux_over .specialTxt").hide();
                    $(".linux_over .emOver").html(linux_time);
                    
                }else if(linux_type == 0){
                    // 授权期限描述
                    $(".linux_over").html("授权期限&nbsp;&nbsp;:&nbsp;&nbsp;未授权<span class='specialTxt'>,请立即<font class='colorOrange'>更新授权</font></span>");
                }
                
                
               //正版授权状态end↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                
                // 以下3种为正版授权（已到期）情况start↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
                if( windows_type == 0 && linux_time <= 0 ){ /**windows未授权，linux授权到期 */
                    // ````入口授权状态``````正版授权(已过期)显示，其余隐藏
                    $(".top .container .logo .emmsg1").hide();
                    $(".top .container .logo .empng1").css({display:"none"});
                    $(".top .container .logo .emmsg2").show();
                    $(".top .container .logo .empng2").css({display:"inline-block"});
                    
                    // ````授权信息授权状态``````正版授权(已过期)显示，其它隐藏
                    $(".emPop .emStatus1").hide();   
                    $('.emPop .emStatus2').show();
                    $(".emPop .emhint").show();
                    $(".emPop .emhintfloat").html(emhintfloat2);
                    
                    // 授权期限描述
                    $(".windows_over").html("授权期限&nbsp;&nbsp;:&nbsp;&nbsp;未授权<span class='specialTxt'>,请立即<font class='colorOrange'>更新授权</font></span>");
                    $(".linux_over").html("授权期限&nbsp;&nbsp;:&nbsp;&nbsp;<span  style='color: #eb6948;'>授权到期<span class='specialTxt'>,请立即<font class='colorOrange' style='color: #eb6948;'>更新授权</font></span></span>");
                    

                }

                if( linux_type == 0 && windows_time <= 0 ){ /**linux未授权，windows授权到期 */
                    // ````入口授权状态``````正版授权(已过期)显示，其余隐藏
                    $(".top .container .logo .emmsg1").hide();
                    $(".top .container .logo .empng1").css({display:"none"});
                    $(".top .container .logo .emmsg2").show();
                    $(".top .container .logo .empng2").css({display:"inline-block"});
                    
                    // ````授权信息授权状态``````正版授权(已过期)显示，其它隐藏
                    $(".emPop .emStatus1").hide();   
                    $('.emPop .emStatus2').show();
                    $(".emPop .emhint").show();
                    $(".emPop .emhintfloat").html(emhintfloat2);
                    
                    // 授权期限描述
                    $(".linux_over").html("授权期限&nbsp;&nbsp;:&nbsp;&nbsp;未授权<span class='specialTxt'>,请立即<font class='colorOrange'>更新授权</font></span>");
                    $(".windows_over").html("授权期限&nbsp;&nbsp;:&nbsp;&nbsp;<span  style='color: #eb6948;'>授权到期<span class='specialTxt'>,请立即<font class='colorOrange' style='color: #eb6948;'>更新授权</font></span></span>");
                }

                if( linux_time <= 0 && windows_time <= 0 ){ /**linux授权到期，windows授权到期 */
                     // ````入口授权状态``````正版授权(已过期)显示，其余隐藏
                     $(".top .container .logo .emmsg1").hide();
                     $(".top .container .logo .empng1").css({display:"none"});
                     $(".top .container .logo .emmsg2").show();
                     $(".top .container .logo .empng2").css({display:"inline-block"});
                     
                     // ````授权信息授权状态``````正版授权(已过期)显示，其它隐藏
                     $(".emPop .emStatus1").hide();   
                     $('.emPop .emStatus2').show();
                     $(".emPop .emhint").show();
                     $(".emPop .emhintfloat").html(emhintfloat2);

                    // 授权期限描述
                    $(".windows_over").html("授权期限&nbsp;&nbsp;:&nbsp;&nbsp;未授权<span class='specialTxt'>,请立即<font class='colorOrange'>更新授权</font></span>");
                     $(".windows_over").html("授权期限&nbsp;&nbsp;:&nbsp;&nbsp;<span  style='color: #eb6948;'>授权到期<span class='specialTxt'>,请立即<font class='colorOrange' style='color: #eb6948;'>更新授权</font></span></span>");
                }

                // 以下3种为正版授权（已到期）情况end↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
            } 


           
            // if(data.data.type==0){
            //     $(".top .container .logo .emmsg0").show();
            //     $(".top .container .logo .empng0").css({display:"inline-block"});	
            //     $(".top .container .logo .emmsg1").hide();
            //     $(".top .container .logo .empng1").css({display:"none"});
            //     $(".top .container .logo .emmsg2").hide();
            //     $(".top .container .logo .empng2").css({display:"none"});
            //     $(".emPop .emStatus0").show();
            //     $(".emPop .emStatus1").hide();
            //     $(".emPop .emStatus2").hide();
            //     isshowemPop();	
            //     var emhintfloat="<p>产品未授权</p>";
            //     emhintfloat+="<p>1,版本无法升级</p>";
            //     emhintfloat+="<p>2,病毒库无法更新</p>";
            //     emhintfloat+="<p>3,只可以部署10台终端</p>";
            //     $(".emPop .emhintfloat").html(emhintfloat);
            //     $(".emPop .specialTxt").show();
            //     $(".emPop .emhint").show();
            //     $(".emCom").html("未授权");
            //     $(".emPop .right p").eq(3).html("授权期限&nbsp;&nbsp;:&nbsp;&nbsp;未授权<span class='specialTxt'>,请立即<font class='colorOrange'>更新授权</font></span>");

            // }else if(data.data.type==1){
            //     $(".top .container .logo .emmsg0").hide();
            //     $(".top .container .logo .empng0").css({display:"none"});	
            //     $(".emPop .emStatus0").hide();

            //     $(".emCom").html(data.data.to);
            //     $(".emCom").attr("title",pathtitle(data.data.to));
            //     if(emover<=15){
            //         $(".emPop .specialTxt").show();
            //         isshowemPop();
            //         var emhintfloat="<p>产品授权授权到期后，将有以下限制</p>";
            //         emhintfloat+="<p>1,版本无法升级</p>";
            //         emhintfloat+="<p>2,病毒库无法更新</p>";
            //         $(".emPop .emhintfloat").html(emhintfloat);
            //         $(".emPop .emhint").show();
            //         if(emover<=0){
            //             $(".emPop .emStatus2").show();
            //             $(".emPop .emStatus1").hide();
            //             $(".top .container .logo .emmsg2").show();
            //             $(".top .container .logo .empng2").css({display:"inline-block"});
            //             $(".top .container .logo .emmsg1").hide();
            //             $(".top .container .logo .empng1").css({display:"none"});
            //             $(".emPop .specialTxt").html(",请立即<font class='colorOrange'>更新授权</font>").show();
            //             $(".emPop .right p").eq(3).html("<p>授权期限&nbsp;&nbsp;:&nbsp;&nbsp;<span  style='color: #eb6948;'>授权到期<span class='specialTxt'>,请立即<font class='colorOrange' style='color: #eb6948;'>更新授权</font></span></span></p>");

            //         }else{
            //             $(".emPop .emStatus1").show();
            //             $(".emPop .emStatus2").hide();
            //             $(".top .container .logo .emmsg1").show();
            //             $(".top .container .logo .empng1").css({display:"inline-block"});
            //             $(".top .container .logo .emmsg2").hide();
            //             $(".top .container .logo .empng2").css({display:"none"});
            //             $(".emPop .specialTxt").html(",请及时<font class='colorOrange'>更新授权</font>").show();
            //             $(".emOver").html(emover);
            //         }
                    
            //     }else{
            //         $('.emStatus2').hide();
            //         $(".emPop .specialTxt").hide();
            //         $(".emPop .emhint").hide();
            //         $(".emOver").html(emover);
            //     }
            // }
            // $(".emTerminal").html(data.data.nodes_num);
        }
    });
}
$('.emPop .emhint').mouseenter(function(event) {
    $(".emPop .emhintfloat,.emPop .smalltriangle").show();

});
$('.emPop .emhint').mouseleave(function(event) {
    $(".emPop .emhintfloat,.emPop .smalltriangle").hide();
});
// 选择完文件后立即上传
// $("input[name=license]").change(function(){
// 	$(".updateEm").click();
// })
// 上传授权文件按钮
$(".updateEm").click(function(){
    if($("#emFile input[type=file]").val()==""){
        $(".delayHide").show();
        $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 文件不能为空");
        setTimeout(function(){$(".delayHide").hide()},2000);
    }else{
        $("#emFile").submit();
    }
})
//执行提交表单过程
$(function(){
    $('#emFile').ajaxForm({
        beforeSerialize:function(){

        },
        beforeSubmit:function(){

        },
        beforeSend: function() {

        },
        uploadProgress: function(event, position, total, percentComplete) {//上传的过程

        },
        success: function(data) {//成功


            //判断浏览器是否为ie7或8
            var browser=navigator.appName; 
            if(browser=="Microsoft Internet Explorer"){
                var b_version=navigator.appVersion; 
                var version=b_version.split(";"); 
                var trim_Version=version[1].replace(/[ ]/g,"");
                if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0") 
                { 
                    data=JSON.parse(data);
                }else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0") 
                { 
                    data=JSON.parse(data);
                }else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE9.0") 
                { 
                    data=JSON.parse(data);
                }  
            }
            

            if(data.errno==-1){
                $(".delayHide").show();
                $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 文件有误");
                setTimeout(function(){$(".delayHide").hide()},2000);
            }else if(data.errno==0){    
                // 添加成功提示
                $(".delayHideS").show();
                $(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> 添加成功</span>");
                setTimeout(function(){$(".delayHideS").hide()},2000);
                emStatus(); 
                // $.ajax({
                //     url:'/mgr/sysconf/_license',
                //     data:{},
                //     type:'GET',
                //     contentType:'text/plain',
                //     headers: {"HTTP_CSRF_TOKEN": getCookie('HRESSCSRF')},
                //     success:function(data){
                //         if(data.data.type==1){
                //             $(".top .container .logo").html("<img src='images/logo.png'><span> 火绒终端安全管理系统</span><span class='empng1 absolute cursor'></span><span class='emmsg1 absolute cursor'>正版授权</span>");
                //             $(".top .container .logo .emmsg0").hide();
                //             $(".top .container .logo .empng0").css({display:"none"});	
                //             $(".emPop .emStatus0").hide();
                //             $(".emPop .emStatus1").show();
                //         }else{
                //             $(".top .container .logo").html("<img src='images/logo.png'><span> 火绒终端安全管理系统</span><span class='empng0 absolute cursor'></span><span class='emmsg0 absolute cursor'>未授权</span>");
                //             $(".top .container .logo .emmsg1").hide();
                //             $(".top .container .logo .empng1").css({display:"none"});	
                //             $(".emPop .emStatus1").hide();
                //             $(".emPop .emStatus0").show();
                //         }
                        

                //         $(".emCom").html(data.data.to);
                //         $(".emCom").attr("title",pathtitle(data.data.to));
                //         $(".emTerminal").html(data.data.nodes_num);
                //         var emover=parseInt((data.data.expire_time-(Date.parse(new Date())/1000))/(24*60*60));
                //         if(emover<0){
                //             emover=0;
                //         }else{
                //             emover=emover;
                //         }
                //         $(".emOver").html(emover);

                //     }
                // });
            }
                     
        },
        error:function(err){//失败
            alert("表单提交异常！"+err.msg);
        },
        complete: function(xhr) {//完成
            
        }
    });

});


$(".modifyPwPop .mainBlock p input").focus(function(){
    $(this).next().hide();
})

