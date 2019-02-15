
			var HH=23;
			var MM=59;
			var SS=59;
			var mode={};
			var LOOP;
			
			function loopInit(id,sign){
				LOOP=true;				
				change(id,sign);
			}
			function loopBreak(){
				LOOP=false;
			}
			function getTag(id,tagName,str,attr){
					var tagArray=document.getElementById(id).getElementsByTagName(tagName);
					for(i=0;i<tagArray.length;i++){
							if(eval("tagArray[i]."+attr)==str){
									return tagArray[i];
							}		
					}	
			}
			function setMode(id,hms){
					var selectInputPre = getTag(id,'input',mode[id+"mode"],'name');
					var selectInput = getTag(id,'input',hms,'name');
					selectInputPre.style.backgroundColor="#FFFFFF";
					mode[id+"mode"]=hms;
					selectInput.style.backgroundColor="rgb(230,230,230)";
			}
			function change(id,sign){
					if(LOOP){
						var num=getTag(id,'input',mode[id+"mode"],'name').value-0;
						var changeNum=eval(num+sign+1)+"";
						if(changeNum>=0&changeNum<=eval(mode[id+"mode"])){	
							changeNum=complete(changeNum);
							getTag(id,'input',mode[id+"mode"],'name').value=changeNum;		
						}
						setTimeout("change('"+id+"','"+sign+"')",200);		
					}		
			}
			function complete(num){
					while(!(num.length==2)){
						num="0"+num;	
					}
			return num;		
			}
			function returnTimer(id){
					var strHH=getTag(id,'input','HH','name').value;
					var strMM=getTag(id,'input','MM','name').value;
					var strSS=getTag(id,'input','SS','name').value;
					return strHH+':'+strMM+':'+strSS;
			}
			function checkNum(id,sign,value){
				if(value<10){
					value=complete(value);
					getTag(id,'input',sign,'name').value=value;
				}else{
					if(value>eval(sign)){
						getTag(id,'input',sign,'name').value=eval(sign);
					}
				}
			}
			function keyDown(id,key,onFocusObject){
				var nextObject;
				if(onFocusObject.name=='HH'){
					nextObject='MM';
				}else if(onFocusObject.name=='MM'){
					nextObject='SS';
				}else if(onFocusObject.name=='SS'){
					nextObject='HH';
				}
				if(!((key>=48 && key<=57)||(key>=96 && key<=105)||(key==8)||(key==46)||(key>=37 && key<=40))){
					event.returnValue=false;
				}
				if(key==37||key==39){
					getTag(id,'input',nextObject,'name').focus();
				}
				if(key==38){
					loopInit(id,'+');
				}
				if(key==40){
					loopInit(id,'-');
				}				
			}
			function keyUp(key){
				if(key==38||40){
					loopBreak();
				}		
			}
			function showTimer(tempId){
					mode[tempId+"mode"] = "HH";
					var timerConent='<table cellpadding="0" cellspacing="0" style="background:#ffffff;border:rgb(229,230,231) 1px solid;table-layout : fixed" >'+
													'<tr style="width:85px;height:20px;border-color:rgb(229,230,231);">'+
														'<td width="60" style="border:0px;display:block;"><input type="text"  maxlength="2" style="font-size:12px;border:0;background:transparent;width:15px" name="HH" value="00" onchange="checkNum('+"'"+tempId+"',"+"'HH',"+'this.value)" onkeydown="keyDown('+"'"+tempId+"'"+',event.keyCode,this)" onkeyup="keyUp(event.keyCode)" onfocus="setMode('+"'"+tempId+"','HH'"+')"/><input type="text"  style="border:0;background:transparent;width:6px;" readOnly=true  value=":"/><input type="text"  maxlength="2" style="font-size:12px;border:0;background:transparent;width:15px" name="MM" value="00" onchange="checkNum('+"'"+tempId+"',"+"'MM',"+'this.value)" onkeydown="keyDown('+"'"+tempId+"'"+',event.keyCode,this)" onkeyup="keyUp(event.keyCode)" onfocus="setMode('+"'"+tempId+"','MM'"+')"/><input type="text"  style="border:0;background:transparent;width:6px"  readOnly=true value=":"/><input type="text"  maxlength="2" style="font-size:12px;;border:0;background:transparent;width:15px" name="SS" value="00" onchange="checkNum('+"'"+tempId+"',"+"'SS',"+'this.value)" onkeydown="keyDown('+"'"+tempId+"'"+',event.keyCode,this)" onkeyup="keyUp(event.keyCode)" onfocus="setMode('+"'"+tempId+"','SS'"+')"/></td>'+
													'</tr>'+
											  	'</table>';
					document.getElementById(tempId).innerHTML=timerConent;	
			}
			showTimer("timer1");
			showTimer("timer2");
			showTimer("timer3");
			showTimer("timer4");
			showTimer("timer5");
			showTimer("timer6");

			var timer1=returnTimer("timer1");
			var timer2=returnTimer("timer2");
			var timer3=returnTimer("timer3");
			var timer4=returnTimer("timer4");
			var timer5=returnTimer("timer5");
			var timer6=returnTimer("timer6");
