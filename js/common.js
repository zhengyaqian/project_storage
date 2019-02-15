$(document).ready(function(){
    
    //左导航展开收起
	$(".main .openStatus").click(function(){
		if($(this).attr("src")=="images/open.png"){
		$(".mainLeft").animate({width:"0px"},500);

		$(this).attr("src","images/close.png");
		$(".mainRight").animate({width:"1200px"},500);
	}
	else{
		$(".mainLeft").show();
		$(this).attr("src","images/open.png");
		$(".mainLeft").animate({width:"250px"},500);

		$(".mainRight").animate({width:"930px"},500);
	}
	});
    //选项卡
	$(".mainRight .tab a").click(function(){
		$(".mainRight .tab a").removeClass("current");
		$(this).addClass("current");
	});
	$(".commonCon .tab a").click(function(){
		$(".commonCon .tab a").removeClass("current");
		$(this).addClass("current");
	});
    
    //终端详情弹窗左导航
    // $(".detailPop .left .general").click(function(){
    // 	$(this).find("img").attr("src","images/general2.png");
    // 	$(this).siblings("a").find("span").css({color:"#6c6c6c"});
    // 	$(this).find("span").css({color:"#5fc47f"});
    // 	$(this).siblings(".searchkill").find("img").attr("src","images/searchkill1.png");
    // 	$(this).siblings(".update").find("img").attr("src","images/update1.png");
    // 	$(this).siblings(".tactics").find("img").attr("src","images/tactics1.png");
    // 	$(this).siblings(".log").find("img").attr("src","images/log1.png");

    // });
    // $(".detailPop .left .searchkill").click(function(){
    // 	$(this).siblings("a").find("span").css({color:"#6c6c6c"});
    // 	$(this).find("img").attr("src","images/searchkill2.png");
    // 	$(this).find("span").css({color:"#5fc47f"});
    // 	$(this).siblings(".general").find("img").attr("src","images/general1.png");
    // 	$(this).siblings(".update").find("img").attr("src","images/update1.png");
    // 	$(this).siblings(".tactics").find("img").attr("src","images/tactics1.png");
    // 	$(this).siblings(".log").find("img").attr("src","images/log1.png");
    // });
    // $(".detailPop .left .update").click(function(){
    // 	$(this).siblings("a").find("span").css({color:"#6c6c6c"});
    // 	$(this).find("img").attr("src","images/update2.png");
    // 	$(this).find("span").css({color:"#5fc47f"});
    // 	$(this).siblings(".searchkill").find("img").attr("src","images/searchkill1.png");
    // 	$(this).siblings(".general").find("img").attr("src","images/general1.png");
    // 	$(this).siblings(".tactics").find("img").attr("src","images/tactics1.png");
    // 	$(this).siblings(".log").find("img").attr("src","images/log1.png");
    // });
    // $(".detailPop .left .tactics").click(function(){
    // 	$(this).siblings("a").find("span").css({color:"#6c6c6c"});
    // 	$(this).find("img").attr("src","images/tactics2.png");
    // 	$(this).find("span").css({color:"#5fc47f"});
    // 	$(this).siblings(".searchkill").find("img").attr("src","images/searchkill1.png");
    // 	$(this).siblings(".update").find("img").attr("src","images/update1.png");
    // 	$(this).siblings(".general").find("img").attr("src","images/general1.png");
    // 	$(this).siblings(".log").find("img").attr("src","images/log1.png");
    // });
    // $(".detailPop .left .log").click(function(){
    // 	$(this).siblings("a").find("span").css({color:"#6c6c6c"});
    // 	$(this).find("img").attr("src","images/log2.png");
    // 	$(this).find("span").css({color:"#5fc47f"});
    // 	$(this).siblings(".searchkill").find("img").attr("src","images/searchkill1.png");
    // 	$(this).siblings(".update").find("img").attr("src","images/update1.png");
    // 	$(this).siblings(".tactics").find("img").attr("src","images/tactics1.png");
    // 	$(this).siblings(".general").find("img").attr("src","images/general1.png");
    // });

    // 周一到周日复选
    // $(".day1,.day2,.day3,.day4,.day5,.day6,.day7").click(function(){
    //     if($(this).find("a").length==0){
    //     $(this).css({background:"#5fc47f",color:"#ffffff"});
    //     $(this).append("<a></a>");
    //     $(this).find("input").attr("checked",true)
    // }else{
    //     $(this).css({background:"#ffffff",color:"#6c6c6c"});
    //     $(this).find("a").remove();
    //     $(this).find("input").attr("checked",false)

    // }

    // });
    //placeholder属性兼容
    $(".placeholderInput").focus(function(){
        $(this).siblings(".placeholder").hide();

    });
    $(".placeholder").click(function(){
        $(this).hide();
        $(this).siblings(".placeholderInput").focus();
    });
    $(".placeholderInput").blur(function(){
        var value=$(this).val();
        if(value==""){
        $(this).siblings(".placeholder").show();
    }
    });

    //文本框获得焦点时边框颜色

    $("body").on("focus","input[type=text],input[type=password]",function(){
        $(this).css({border:"1px solid #b3b3b3",transition:0.5});
    })
    $("body").on("blur","input[type=text],input[type=password]",function(){
        $(this).css({border:"1px solid #e5e6e7",transition:0.5})
    })
    
});

//placeholder属性兼容
function fadeOut(a){
    $(a).siblings(".placeholder").hide();
};
function spanFocus(a){
    $(a).hide();
    $(a).siblings(".placeholderInput").focus();
};
function fadeIn(a){
    var value=$(a).val();
    if(value==""){
        $(a).siblings(".placeholder").show();
    }
};
            
            
            
//全选
function selectAll(checkbox) {
    $('.select').prop('checked', $(checkbox).prop('checked'));
    }
//遮罩层显示
function shade(){
    $(".shade").show();
    parent.$(".topshade").show();

}
//二级遮罩显示
function shadee(){
    $(".shadee").show();

}
//时间戳转换成年月日24小时制时分秒

function getLocalTime(nS){
    var date = new Date(nS*1000);

    date.getFullYear();
    date.getMonth();
    date.getDate();
    date.getTime();
    date.getHours();
    date.getMinutes();
    date.getSeconds();

    Y = date.getFullYear() + '-'; 
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'; 
    D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())+ ' '; 
    h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours())+ ':'; 
    m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes())+ ':'; 
    s = (date.getSeconds()< 10 ? '0'+(date.getSeconds()) : date.getSeconds());  

    return(Y+M+D+h+m+s); 

}
//时间戳换成年月日时分并是/连接
function getLocalTime1(nS){
    var date = new Date(nS*1000);

    date.getFullYear();
    date.getMonth();
    date.getDate();
    date.getTime();
    date.getHours();
    date.getMinutes();
    date.getSeconds();

    Y = date.getFullYear() + '/'; 
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/'; 
    D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())+ ' '; 
    h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours())+ ':'; 
    m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes())+ ''; 
    s = (date.getSeconds()< 10 ? '0'+(date.getSeconds()) : date.getSeconds());  

    return(Y+M+D+h+m); 

}
//时间戳换成年月日并是/连接
function getLocalTime2(nS){
    var date = new Date(nS*1000);

    date.getFullYear();
    date.getMonth();
    date.getDate();
    date.getTime();
    date.getHours();
    date.getMinutes();
    date.getSeconds();

    Y = date.getFullYear() + '/'; 
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/'; 
    D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())+ ' '; 
    h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours())+ ':'; 
    m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes())+ ''; 
    s = (date.getSeconds()< 10 ? '0'+(date.getSeconds()) : date.getSeconds());  

    return(Y+M+D); 

}
//时间戳换成年月日并是-连接
function getLocalTime3(nS){
    var date = new Date(nS*1000);

    date.getFullYear();
    date.getMonth();
    date.getDate();
    date.getTime();
    date.getHours();
    date.getMinutes();
    date.getSeconds();

    Y = date.getFullYear() + '-'; 
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'; 
    D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()); 
    h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours())+ ':'; 
    m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes())+ ''; 
    s = (date.getSeconds()< 10 ? '0'+(date.getSeconds()) : date.getSeconds());  

    return(Y+M+D); 

}
//时间戳换成时分
function getLocalTime4(nS){
    var date = new Date(nS*1000);

    date.getFullYear();
    date.getMonth();
    date.getDate();
    date.getTime();
    date.getHours();
    date.getMinutes();
    date.getSeconds();

    Y = date.getFullYear() + '-'; 
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'; 
    D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())+ ' '; 
    h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours())+ ':'; 
    m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes())+ ''; 
    s = (date.getSeconds()< 10 ? '0'+(date.getSeconds()) : date.getSeconds());  

    return(h+m); 

}
//时间戳换成月日
function getLocalTime5(nS){
    var date = new Date(nS*1000);

    date.getFullYear();
    date.getMonth();
    date.getDate();
    date.getTime();
    date.getHours();
    date.getMinutes();
    date.getSeconds();

    Y = date.getFullYear() + '-'; 
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'; 
    D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())+ ' '; 
    h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours())+ ':'; 
    m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes())+ ''; 
    s = (date.getSeconds()< 10 ? '0'+(date.getSeconds()) : date.getSeconds());  

    return(M+D); 

}
//几天前的日期
function GetDateStr(AddDayCount) {   
   var dd = new Date();  
   dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期  
   var y = dd.getFullYear();   
   var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0  
   var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0  
   return y+"-"+m+"-"+d;   
}  
//日期转换成时间戳
function getBeginTimes(YMD){
    var str = YMD; 
    str = str.replace(/-/g,'/'); 
    str = str+" 00:00:00";
    var date = new Date(str); 
    var time = date.getTime();
    time=time/1000;
    return time;

}
function getEndTimes(YMD){
    var str = YMD; 
    str = str.replace(/-/g,'/'); 
    str = str+" 23:59:59";
    var date = new Date(str); 
    var time = date.getTime();
    time=time/1000;
    return time;

}

//删除字符串左右两端的空格
function trim(str){ 
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
//截取字符串\最后的字符串并去掉空格（针对事件日志中的title）
function path(str){
    var index=str.lastIndexOf("\\");
    var result=str.substring(index+1,str.length);

    return result;
}
//去掉字符串中的所有空格
function pathtitle(str){
    result=str.replace(/\s/g, "");
    return result;
}
//数字是否在数组中
function isInArray(arr, val){
    var i, iLen;
    if(!(arr instanceof Array) || arr.length === 0){
        return false;
    }
    if(typeof Array.prototype.indexOf === 'function'){
        return !!~arr.indexOf(val)
    }
    for(i = 0, iLen = arr.length; i < iLen; i++){
        if(val === arr[i]){
            return true;
        }
    }
    return false;
}
// ip地址正则验证
function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
}

// 上传文件大小判断
function onUploadChange(fileInput){

    var filePath = fileInput.value;
    if (fileInput.files && fileInput.files[0]) {  
        var filesize=fileInput.files[0].size;
        filesize=Math.floor(filesize/1048576);
        if(filesize>300){
            $(fileInput).val("");
            $(".delayHide").show();
            $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 不能超过300m");
            setTimeout(function(){$(".delayHide").hide()},2000);
        }
         
    } else {   
        // fileInput.select();  
        // var url = document.selection.createRange().text;  
        // try {  
        //     var fso = new ActiveXObject("Scripting.FileSystemObject"); 
        //     var filesize=fso.GetFile(url).size;
        //     filesize=Math.floor(filesize/1048576);
        //     if(filesize>300){
        //         $(".newTrustPPop input[type='file']").wrap('<form></form>');
        //         $(".newTrustPPop input[type='file']").parent()[0].reset();
        //         $(".newTrustPPop input[type='file']").unwrap();
        //         $(".delayHide").show();
        //         $(".delayHide .p1").html("<img src='images/unusualw.png' class='verticalMiddle'> 不能超过300m");
        //         setTimeout(function(){$(".delayHide").hide()},2000);
        //     } 
        // } catch (e) {  
        //     alert('如果你用的是低版本ie 请将安全级别调低！参考https://jingyan.baidu.com/article/ae97a646d43dc8bbfd461d0b.html'); 
        //     $(".newTrustPPop input[type='file']").wrap('<form></form>');
        //     $(".newTrustPPop input[type='file']").parent()[0].reset();
        //     $(".newTrustPPop input[type='file']").unwrap();
    
        // }  
        
    } 
}
// 防御xss转换
function safeStr(str){
    return str.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
//IP转成整型
function _ip2int(ip) 
{
	var num = 0;
	ip = ip.split(".");
	num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
	num = num >>> 0;
	return num;
}
//整型解析为IP地址
function _int2ip(num) 
{
    var str;
    var tt = new Array();
    tt[0] = (num >>> 24) >>> 0;
    tt[1] = ((num << 8) >>> 24) >>> 0;
    tt[2] = (num << 16) >>> 24;
    tt[3] = (num << 24) >>> 24;
    str = String(tt[0]) + "." + String(tt[1]) + "." + String(tt[2]) + "." + String(tt[3]);
    return str;
}

//字符串转换成布尔值
function stringToBoolean(str){
    switch(str.toLowerCase()){
    	case "true": case "yes": case "1": return true;
		case "false": case "no": case "0": case null: return false;
		default: return Boolean(str);
	}
}
//获取360浏览器信息
function _mime(option, value) {
        var mimeTypes = navigator.mimeTypes;
        for (var mt in mimeTypes) {
        if (mimeTypes[mt][option] == value) {
               return true;
          }
        }
        return false;
}
//判断ie版本
function _ieVersion(userAgent){
	var ieVer = IE5 = IE55 = IE6 = IE7 = IE8 = IE9 = IE10 = '';
    var reIE = new RegExp("msie (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    console.log(fIEVersion);
    IE55 = fIEVersion == 5.5;
    IE6 = fIEVersion == 6.0;
    IE7 = fIEVersion == 7.0;
    IE8 = fIEVersion == 8.0;
    IE9 = fIEVersion == 9.0;
    IE10 = fIEVersion == 10.0;
    return ieVer;
}
//得到浏览器信息
function getBrowserInfo(){
   	var userAgent = navigator.userAgent.toLowerCase(); //取得浏览器的userAgent字符串
   	var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("msie") > -1 && !isOpera; //判断是否IE浏览器
   	var isIE11 = (userAgent.toLowerCase().indexOf("trident") > -1 && userAgent.indexOf("rv") > -1);
	var Sys = {};
	var pass =false;
    if(isIE11){
   	   pass = false;
    }else if(isIE){
    	pass = false;
    }else{
    	//区分360浏览器和谷歌
   		var is360 = _mime("type", "application/vnd.chromium.remoting-viewer");
    	var isOpera = userAgent.indexOf("opr") > -1; //判断是否Opera浏览器
	   	var isEdge = userAgent.indexOf("edge") > -1; //edge浏览器
	   	var isFF = userAgent.indexOf("firefox") > -1; //判断是否Firefox浏览器
	   	var isSafari = userAgent.indexOf("safari") > -1 && !is360; //判断是否Safari浏览器
   		var isChrome = userAgent.indexOf("chrome") > -1 && !isEdge && !is360 && !isOpera; //判断是否chrome浏览器
    	var re =/(firefox|safari|chrome|version).*?([\d.]+)/;
	    var m = userAgent.match(re);
	    Sys.browser = m[1].replace(/version/, "'safari");
	    Sys.ver = parseFloat(m[2].split('.')[0]);
	    
	    if(isChrome){//谷歌区分360浏览器\edge\opera
	    	if(Sys.ver >=69){
	    		pass = true;
	    	}
	    }
	    if(Sys.browser == 'firefox' && Sys.ver >=60){
	    	pass = true;
	    }
	    if(Sys.browser == 'safari' && Sys.ver >=10){
	    	pass = true;
	    }
	    if(isOpera){
	    	re =/(opr|version).*?([\d.]+)/;
	    	m = userAgent.match(re);
	    	Sys.ver = parseFloat(m[2].split('.')[0]);
	    	if(Sys.ver >=56){
	    		pass = true;
	    	}
	    }
	    if(isEdge){
	    	re =/(edge|version).*?([\d.]+)/;
	    	m = userAgent.match(re);
	    	Sys.ver = parseFloat(m[2].split('.')[0]);
	    	if(Sys.ver >=17){
	    		pass = true;
	    	}
	    	
	    }
    }
    return pass;

    
}

// 屏蔽f5刷新
// document.onkeydown = function (e) {
//     if (!e) e = window.event;
//     if ((e.keyCode || e.which) == 116) {
//         return false;
//     }
// }
//按回车搜索
$(document).on('keydown','#numperpageinput',function(e){
	if (!e) e = window.event;
    if ((e.keyCode || e.which) == 13) {
        $(this).blur();
    }
})
//弹层随页面滚动
// $(parent.window).scroll(function(){
//   $('.fastSKCPop,.detailPop,.terminalUpPop,.moveGPop,.fastSKPop,.overallSKPop,.overallSKCPop,.recentTaskPop,.newGroupPop,.checkTacticsPop,.taskDetailPop,.newTrustPPop,.deleteTPPop,.modifyGNPop,.deleteGPop,.newTacticsPop,.newTacticsAPop,.deletePPop').animate({top:$(parent.window).scrollTop()+400},20);
// });

// 每页多少数据数字限制
$("body").on("keyup", "#numperpageinput", function() {
	var value = $(this).val().replace(/[^\d]/g, '');
	$(this).val(value);
})
var numperpage;
if(localStorage.getItem('numperpage')){
	numperpage = parseInt(localStorage.getItem('numperpage'));
}else{
	numperpage = 15;
}


//排序
function sortingFun(_this,toggleClass){
    _this.siblings('th.th-ordery').removeClass().addClass('th-ordery');
    _this.siblings('th.th-ordery').find('img').attr('src','images/th-ordery.png');
    if(toggleClass == 'th-ordery'){
        _this.addClass('th-ordery-up th-ordery-current');
        _this.find('img').attr('src','images/th-ordery-up.png');
	}else if(toggleClass == 'th-ordery th-ordery-up th-ordery-current'){
        _this.attr('class','th-ordery th-ordery-down th-ordery-current');
        _this.find('img').attr('src','images/th-ordery-down.png');
	}else if(toggleClass == 'th-ordery th-ordery-down th-ordery-current'){
        _this.attr('class','th-ordery');
        _this.find('img').attr('src','images/th-ordery.png');
	}
	
}
//列表排序字段
function sortingDataFun(dataa,type,orderClass){
    var ordery;
    var order = {};
    dataa.order = [];
    if(orderClass == 'th-ordery th-ordery-down th-ordery-current'){
        ordery = 'desc';
    }else if(orderClass == 'th-ordery th-ordery-up th-ordery-current'){
        ordery = 'asc';
    }
    if(type){
        order[type] = ordery;
        dataa.order.push(order);
    }
    return dataa;
}

// 原生ajax请求导出excel

function download_excel_using_blob(dataa,url,file_name){
	var url = url;      //【全部导出】请求url
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.responseType = "blob";   //返回类型blob
    xhr.onload = function () {   //定义请求完成的处理函数
        //layer.closeAll('loading');
        if (this.status === 200) {
            var blob = new Blob([xhr.response], {type: 'application/vnd.ms-excel;'});
             // for IE
		    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
		        window.navigator.msSaveOrOpenBlob(blob, file_name);
		    }else{
			// for no-ie
	            var objectURL = URL.createObjectURL(blob);
	            var downloadElement = document.createElement('a'); //转换完成，创建一个a标签用于下载
	            downloadElement.download = 'virusLog.xlsx';
	            downloadElement.href = objectURL;
	            document.body.appendChild(downloadElement);
	            downloadElement.click();
	            document.body.removeChild(downloadElement);
		      }      
        }else if(this.status === 401){
           parent.window.location.href='/';
        }else{
           
        }
    };
    xhr.send(JSON.stringify(dataa));
}




// 文件导出
jQuery.download = function(url, method, param){
	var content = '<form action="'+url+'" method="'+(method||'post')+'" enctype="application/x-www-form-urlencoded">';
	content += "<input type='hidden' name='cond' value='"+JSON.stringify(param)+"'/>";
	content +='</form>';
	jQuery(content).appendTo('body').submit().remove();
}


//提示
/**失败提示 */
function delayHide(msg){
    $(".delayHide").show();
    $(".delayHide .p1").html("<img src='images/unusual.png' class='verticalMiddle'><span class='verticalMiddle'>"+msg+"</span>");
    setTimeout(function(){$(".delayHide").hide()},2000);
}
/**成功提示 */
function delayHideS(msg){
    $(".delayHideS").show();
    $(".delayHideS .p1").html("<img src='images/success.png' class='verticalMiddle'><span class='verticalMiddle'> "+msg+"</span>");
    setTimeout(function(){$(".delayHideS").hide()},2000);
}