//创建table控件
function createTable(columns,data,parentElement){
	this.data = data;
	this.setData = function(data){
		this.data = data;
		this.renderTable();
		// this.clear();
	}
	this.renderTable = function(){
		this.clear();
		//创建内容区域
		this.tableTbody = document.createElement('tbody');
		for(var index = 0;index < this.data.length;index++){
			var tbodyTr = document.createElement('tr');
			var data_item = this.data[index];
			for(var tIndex = 0;tIndex < columns.length;tIndex++){
				var column = columns[tIndex];
				//判断是否存在style
				var tbodyTd = document.createElement('td');
				var style = "";
				jQuery.each(column.tBody.style, function(i, val) { 
					style = style + i + ":" + val + ";"; 
				}); 
				tbodyTd.setAttribute("style",style);
				// 判断是否存在class
				if(column.tBody.class){
					tbodyTd.setAttribute("class",column.tBody.class);
				}
				// 判断tbody是否存在操作
				var value = data_item[column.name];
				if(column.tBody.customFunc){
					var comulnData  = column.tBody.customFunc(value,data_item,tIndex);
					tbodyTd.innerHTML = comulnData;
				}else{
					tbodyTd.innerHTML = value;
				}
				tbodyTr.appendChild(tbodyTd);
			}
			this.tableTbody.appendChild(tbodyTr);
			
		}
		this.table.appendChild(this.tableTbody);
	}
	this.clear = function(){
		var childs = this.table.childNodes;
		for(var rIndex=1;rIndex < childs.length;rIndex++){
			this.table.removeChild(childs.item(rIndex));
		}
		
	}
	//初始化表格
	this.initTable = function(){
		this.table = document.createElement("table");
		this.columns =columns;
		//初始化表头
		this.tableThead = document.createElement('thead');
		this.theadTr = document.createElement('tr');
		for(var tIndex = 0;tIndex < columns.length;tIndex++){
			var column = columns[tIndex];
			var theadTh = document.createElement('th');
			var propertyStr = "";
			var propertyTBStr = "";
			for(property in column.tHead.style){
				propertyStr += property + ":" + column.tHead.style[property];
				propertyTBStr += property + ":" + column.tBody.style[property];
			}
			//表头添加文字
			theadTh.innerHTML = column.title;
			//表头添加样式
			column.tHead.style = propertyTBStr;
			theadTh.setAttribute("style",propertyStr);
			// 判断是否存在class
			if(column.tHead.class){
				theadTh.setAttribute("class",column.tHead.class);
			}
			//判断是否存在type--排序时传值需要
			if(column.type){
				theadTh.setAttribute("type",column.type);
			}
			//判断表头是否排序
			var value = column.name;
			if(column.tHead.customFunc){
				var comulnData  = column.tHead.customFunc(column,tIndex);
				theadTh.innerHTML += comulnData;
			}

			this.theadTr.appendChild(theadTh);
		}
		this.tableThead.appendChild(this.theadTr);

		this.table.appendChild(this.tableThead);
		//初始化表格内容
		this.renderTable();
		parentElement.append(this.table);
		
	}
	this.initTable();
	
}
//创建分页控件
function createPagnation(total,pageSize,parentElement){
	this.currentPage = 0;
	var mod = total % pageSize;
	this.pages = total % pageSize;
	if(this.pages > 0){
		this.pages =  total / pageSize + 1;
	}
	this.changePagesize = function(total,pageSize){
			this.currentPage = 0;
			var mod = total % pageSize;
			this.pages = total % pageSize;
			if(pages > 0){
				this.pages = total / pageSize + 1;
			}
			this.render();
	}
	//渲染分页控件
	this.render = function(){	
		pageStr = [];
		if(currentPage == 1){
			pageStr.push("<span>");
			pageStr.push("<<");
			pageStr.push("</span>");
		}else{
			pageStr=["<a click='" + this.directionLinkClick("left") + "''>"];
			pageStr.push("<a>");
			pageStr.push("<<");
			pageStr.push("</a>");
		}
		
		for(var index = 1;index <= this.pages;index++){	
			if(index == currentPage ){
				pageStr.push('<span class="current">' + index + '</span>');
			}else{
				pageStr.push('<a href="javascript:;" class="tcdNumber">' + index +'</a>');
			}
		}
		if(currentPage == this.pages){
			pageStr.push("<span>");
			pageStr.push(">>");
			pageStr.push("</span>");
		}else{
			pageStr.push("<a click='" + this.directionLinkClick("right") + "''>");
			pageStr.push(">>");
			pageStr.push("</a>");
		}
		if(parentElement){
			parentElement.empty()
			parentElement.append(pageStr.join(""));
		}else{
			alert("the parentElement is not null");
		}

	}
	//页码点击事件
	this.pageLinkClick = function (page){
		this.currentPage = page;
		this.render();
	}
	//方向键点击事件
	this.directionLinkClick = function(direction){
		if(direction == "left"){
			if(this.currentPage > 1){
				this.currentPage--;
			}
		}else{
			if(this.currentPage < this.pages){
				this.currentPage++;
			}
		}
		this.render();
	}
}