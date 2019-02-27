
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

$(document).on('click','.table th.th-ordery',function(){
	var toggleClass = $(this).attr('class');
	var _this = $(this);
    sortingFun(_this,toggleClass);

	var currentPage = $(this).parents('.bgContainer').find('.tcdPageCode span.current').text();
	var currentNum = $(this).parents('.bgContainer').find('#numperpageinput').val();

	var start = (parseInt(currentPage) - 1) * parseInt(currentNum);
	trustZone(start);
})
//列表信息
function columnsDataListFun (){
	var columns = [
		{
			type: "value",title: "信任的项目",name: "value",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {
				return "<span class='projectNameW'  title='"+safeStr(row['data.value'])+"'>"+safeStr(row['data.value'])+"</span>";
			}},
		},
		{
			type: "remark",title: "备注",name: "remark",
			tHead:{style: {width: "30%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "30%"},customFunc: function (data, row, i) {
                if(!("remark" in row)){
                    return "<span class='projectNameW'>(无)</span>";
                }else{
                    return "<span class='projectNameW' title='"+safeStr(data)+"'>"+safeStr(data)+"</span>";
                }
            }},
		},
		{
			type: "type",title: "项目类型",name: "type",
			tHead:{style: {width: "13%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "13%"},customFunc: function (data, row, i) {
                if(row["data.type"]=="path"){
                    return "文件路径";
                }else{
                    return "文件校验和";
                }
            }},
		},
		{
			type: "action",title: "信任文件动作",name: "action",
			tHead:{style: {width: "15%"},class:"th-ordery",customFunc: function (data, row, i) {return "<img src='images/th-ordery.png'/>"}},
			tBody:{style: {width: "15%"},customFunc: function (data, row, i) {
                if(data==true){
                    return "<input type='checkbox' class='verticalMiddle' onclick='updateTrustP(this)' checked>";
                }else{
                    return "<input type='checkbox' class='verticalMiddle' onclick='updateTrustP(this)'>";
                }
            }},
		},
		{
            title: "操作",name: "",
            tHead:{style: {width: "12%"}},
			tBody:{style: {width: "12%"},customFunc: function (data, row, i) {return "<a onclick='deleteTP(this)' value='"+data+"' class='cursor underline blackfont'>删除</a>"}},
		}
	]
	
	var tabstr = new createTable(columns,[] ,$('.bgContainer .table'));
	return tabstr;
}
var tabListstr =columnsDataListFun();
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
    var type = $('.bgContainer .table th.th-ordery.th-ordery-current').attr('type');
	var orderClass = $('.bgContainer .table th.th-ordery.th-ordery-current').attr('class');
    dataa = sortingDataFun(dataa,type,orderClass);
    
    $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;'><img src='images/loading.gif'></div>");
  
    $.ajax({
        url:'/mgr/whitelist/_list',
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
            if(list.length==0){
                $(".bgContainer .table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:100px;font-size:12px'><img src='images/notable.png'><p style='padding-top:24px'>暂无数据内容</p></div>"); 
            }else{
                tabListstr.setData(list);
            }
            tbodyAddHeight();

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
                    $(".table tbody").html("<div style='text-align:center;color:#6a6c6e;padding-top:340px;'><img src='images/loading.gif'></div>");
                    $.ajax({
                        url:'/mgr/whitelist/_list',
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
        error:function(xhr,textStatus,errorThrown){
        	if(xhr.status==401){
        	    parent.window.location.href='/';
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
    var filename=document.getElementById('file');  
    if($("input[value='path']").is(":checked") && trim($("input[name='data.value'][type=text]").val())==""){
       delayHide("请填写名称!");
    }else if($("input[value='sha1']").is(":checked") && $("input[name='data.value'][type=file]").val()==""){
       delayHide("请选择文件!");
    }else{
    	$("#form").submit();
        $(".uploadingShade").show();
        $(".uploading").show();
    }
    
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
            error:function(xhr,textStatus,errorThrown){
	        	if(xhr.status==401){
	        	    parent.window.location.href='/';
	        	}
	        },
            success:function(data){
                trustZone();
                hideButton(a);
            }
        });  
}
tbodyAddHeight();
function tbodyAddHeight(){
//调整页面内元素高度
var mainlefth=parent.$("#iframe #mainFrame").height();

$(".main .trustTable tbody").css({height:mainlefth-336});
}

window.onresize = function(){
    tbodyAddHeight();
}

