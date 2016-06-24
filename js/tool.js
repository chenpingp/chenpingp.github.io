
//创建显示右键菜单
function showContextmenu(ev,data){
 	$(".contextmenu").show().css({"left":ev.pageX,"top":ev.pageY}).html("");
    //创建菜单数据
    data.forEach(function(v, k) {
    	$li = $("<li></li>");
		$li.html(v.name)
        //给每一个菜单项，添加点击处理
        $li.click(v.exe);
        $li.appendTo($(".contextmenu"));
    });
}
//生成目录
function creatDir(data){
	var $span=$("<span>"+data.name+"></span>");
		$span.get(0).dirId=pidN;
		$span.appendTo($("#file_dir"));
		$span.click(function(){
			refreshDirectory(getChildren($span.get(0).dirId));
			$(this).nextAll().remove();
			pidN=$span.get(0).dirId;
			for(var i=0;i<dirN.length;i++){				
				if(dirN[dirN.length-1].id==pidN){
					return;
				}else{
					dirN.pop();
				}
			}
		})	
}

//根据数据创建文件夹
function createFolder(data){	
	var jsonstr=JSON.stringify(datas.files);
	localStorage.setItem('baiduyun',jsonstr);
	num=0;
	var $lis = $("<li></li>");
	$lis.addClass(".display1 fl");
	$lis.appendTo($(".list"));	
	$lis.fileId = data.id;
	$lis.get(0).fileId=data.id;		//用于生成div碰撞检测时往delN寸数据
	var $divs = $("<div class='libox'></div>");
	$divs.appendTo($lis);
	var $inpch = $("<input type='checkbox' class='inpch'>");
	$inpch.appendTo($divs);
	if(data.cont){
		var img = new Image();
		img.src = data.cont;
		$(img).appendTo($divs);
	}else{
		var $img = $("<img src='img/docpic.jpg'>");
		$img.appendTo($divs);	
	}		
	var $nameDiv=$("<div></div>");
	$nameDiv.addClass("rename_box fl");
	var $inptext = $("<input type='text' class='inptext fl'>");
	var $btn1=$("<input type='btn' value='确定' class='fl'>");
	var $btn2=$("<input type='btn' value='取消' class='fl'>");
	$inptext.get(0).focus();
	$nameDiv.css("width",50).css("height",32).hide();
	$btn1.css("width",24).css("height",32).css("line-height",32);
	$btn2.css("width",24).css("height",32).css("line-height",32);
	$inptext.val(data.name);
	$inptext.appendTo($lis);
	$nameDiv.appendTo($lis);	
	$btn1.appendTo($nameDiv);
	$btn2.appendTo($nameDiv);
	FnNum();	
	drag($lis)//绑定拖拽
	//重命名
	oldValue=$inptext.val();
	$btn1.click(function(){
		for(var i=0; i<datas.files.length;i++){
            if(datas.files[i].name == $inptext.val()){
	            	if(datas.files[i].pid==pidN){
					 alert('已经存在 '+ $inptext.val() +' 这个文件夹了');
	               	return;
				}              
            }
       }
		$nameDiv.hide();
	 	$inptext.css("width","100%").css("border","none").get(0).blur();
	 	alert("重命名成功");
		 for(var i=0;i<datas.files.length;i++){
		 	if(datas.files[i].id==$lis.fileId){
		 		console.log(datas.files[i].name);
		 		datas.files[i].name=$inptext.get(0).value;
		 		console.log(datas.files[i].name);
		 	}
		 }
		var jsonstr=JSON.stringify(datas.files);
		localStorage.setItem('baiduyun',jsonstr);
	})
	$inptext.keyup(function(e){
		if(e.keyCode==13){
			for(var i=0; i<datas.files.length;i++){
	            if(datas.files[i].name == $inptext.val()){
		            	if(datas.files[i].pid==pidN){
						 alert('已经存在 '+$inptext.val()+' 这个文件夹了');
		               	return;
					}              
	            }
	       }
			$nameDiv.hide();
		 	$inptext.css("width","100%").css("border","none").get(0).blur();
		 	alert("重命名成功");
			 for(var i=0;i<datas.files.length;i++){
			 	if(datas.files[i].id==$lis.fileId){
			 		datas.files[i].name=$inptext.get(0).value;
			 	}
			 }
		}
		var jsonstr=JSON.stringify(datas.files);
		localStorage.setItem('baiduyun',jsonstr);
	})
	$btn2.click(function(){
		if(confirm("确定要取消重命名吗？")){
			$inptext.get(0).value=oldValue;
			$nameDiv.hide();
			$inptext.css("width","100%").css("border","none").get(0).blur();
		}
		
	})
	//双击进入文件夹或打开文件
	$lis.on("dblclick",function(){
		if(data.cont){
			var img = new Image();
			img.src = data.cont;
			$(img).appendTo($(".list"));
			$(img).css("width","300px").css("height","300px").css("position","absolute").css("top",180).css("left",220);
			$(".list").html('')	;
			$(img).appendTo($(".list"));
		}else{
			pidN=$lis.fileId;
			refreshDirectory(getChildren(pidN));
			dirN.push({
				name:data.name,
				id:pidN
			});
			creatDir(data);
		}							
	})
	$("#totle_file").html("已全部加载，共"+$(".list li").length+"个");
	//点击li里的input
	$inpch.off("click").on("click",function(){			
		if($(this).get(0).checked){		
			$(this).parent().css("border","2px solid #347ee1");		
			num++;
			delN.push($lis.fileId);
		}else{
			$(this).parent().css("border","");
			num--;
			for(var i=0;i<delN.length;i++){
				if(delN[i]==$lis.fileId){
					delN.splice(i,1);					
				}
			}
		}
		FnNum();	
	});	
	//鼠标移入移出
	$lis.hover(function(){
		$(this).find(".inpch").show();	
	},function(){
		if($(this).find(".inpch").get(0).checked){
			$(this).find(".inpch").show();	
		}else{
			$(this).find(".inpch").hide();	
		}
	});
	//文件右键菜单
	$lis.on("contextmenu",function(ev){
		dNum=$lis.fileId;
		spanName=data.name;
		showContextmenu(ev,datas.contextmenu.folder);
		return false;		
	})


}
//根据已有文件数据  datas.files 来初始化创建文件夹/文件
function refreshDirectory(data){
    $(".list").html("");
    for (var i=0; i<data.length; i++) {
        createFolder(data[i]);
    }
}

//刷新文件夹布局
function refreshDirectoryPosition(){
	var arr = [];
	$(".list li").each(function(i,elem){
		arr.push([$(elem).offset().left,$(elem).offset().top])
	});
	$(".list li").each(function(i,elem){
		$(elem).css({"float":"none","position":"absolute","left":arr[i][0],"top":arr[i][1]})
	});	
}
//文件夹的拖拽
function drag(obj){
	obj.on("mousedown",function(ev){	
		refreshDirectoryPosition();
		var disX = ev.pageX - $(this).offset().left;
		var disY = ev.pageY - $(this).offset().top;	
		$(document).on("mousemove.drug",function(ev){
			var Left = ev.pageX-disX;
			var Top = ev.pageY-disY;
			Left = Left<$(".list").offset().left?$(".list").offset().left:Left;
			Left = Left>$(".list").width()?$(".list").width():Left;
			Top = Top<$(".list").offset().top?$(".list").offset().top:Top;
			Top = Top>$(".list").height()-obj.height()+$(".list").offset().top?$(".list").height()-obj.height()+$(".list").offset().top:Top;
			obj.css("left",Left).css("top",Top);
			obj.css("z-index","1");
		});
		$(document).on("mouseup.drug",function(ev){			
			$(document).off("mousemove.drug").off("mouseup.drug");
			obj.css("z-index","0");				
		});
		return false;
	});	
}

// 碰撞检测
function crash(obj1,obj2) {
    var pos1 = obj1.get(0).getBoundingClientRect();
	var pos2 = obj2.get(0).getBoundingClientRect();
    return !(pos1.right < pos2.left || pos1.left > pos2.right || pos1.bottom < pos2.top || pos1.top > pos2.bottom);
}

//点击生成碰撞的div
function pzDiv(obj){
	obj.on("mousedown.div",function(ev){
		var StartX = ev.pageX;
		var StartY = ev.pageY;		
		var $pzdiv = $("<div><div>");
		$pzdiv.css({"position":"absolute","left":StartX,"top":StartY,"z-index":"1"})
		$pzdiv.appendTo(obj);
		$(document).on("mousemove.div",function(ev){
			var disX =Math.abs(ev.pageX-StartX);
			var disY = Math.abs(ev.pageY-StartY);
			//判断生成的div扩大的方向
			if(StartX>ev.pageX&StartY>ev.pageY){
				$pzdiv.css({"position":"absolute","left":ev.pageX,"top":ev.pageY})
			}else if(StartY>ev.pageY){
				$pzdiv.css({"position":"absolute","top":ev.pageY})
			}else	if(StartX>ev.pageX){
				$pzdiv.css({"position":"absolute","left":ev.pageX})
			}
			$pzdiv.css({"width":disX,"height":disY,"border":"1px solid #347ee1","background":"powderblue","opacity":.3});
			//碰撞检测
			
		})
		$(document).on("mouseup.div",function(ev){
			num=0;
			$(".list li").each(function(i,elem){
				if(crash($pzdiv,$(elem))){	
					delN.push($(elem).get(0).fileId)
					$(elem).find("input").eq(0).get(0).checked = true;	
                		$(elem).find("input").eq(0).show().parent().css("border","2px solid #347ee1");
				}else{
					for(var i=0;i<delN.length;i++){
						if(delN[i]==$(elem).get(0).fileId){
							delN.splice(i,1);					
						}
					}
					$(elem).find("input").eq(0).get(0).checked = false;
					$(elem).find("input").eq(0).hide().parent().css("border","");
					
				}
				num=$(".list .inpch[style*=block]").length;
				FnNum();
			});
			$(document).off("mousemove.div").off("mouseup.div");
			$pzdiv.remove();			
		})
		return false;			
	})	

}

//全选
function checkedAll(obj){
	if(obj.get(0).checked){
		num = $(".list li").length;
		$(".chdicon").get(0).checked = true;	
		$(".inpch").each(function(i,elem){
			$(elem).get(0).checked = true;
			$(elem).show().parent().css("border","2px solid #347ee1");
		});	
		$(".changebox").find("span").eq(0).html("已选中"+num+"个文件/文件夹");
	}else{
		num = 0;
		$(".chdicon").get(0).checked = false;
		$(".inpch").each(function(i,elem){
			$(elem).get(0).checked = false;
			$(elem).hide().parent().css("border","");
		});		
		$(".changebox").find("span").eq(0).html("已选中"+num+"个文件/文件夹");
	}
}
//选中文件夹的个数
function FnNum(obj){
	num = num<0?0:num;
	if(num == $(".inpch").length){
		$(".chdicon").get(0).checked = true;
	}else{
		$(".chdicon").get(0).checked = false;
	}
	if(!num == 0){				
		$(".change").hide().next().show();
	}else{						
		$(".change").show().next().hide();
	}
	$(".changebox").find("span").eq(0).html("已选中"+num+"个文件/文件夹");
}		
//根据搜索数据创建搜索列表
function creatSearchList(data){
	for(var i=0;i<data.length;i++){
		$li=$("<li></li>");
		$li.html(data[i]);
		$li.click(function(){
			$("#search_input").get(0).value=$(this).html();
			$("#search_result li").remove();
			
		})
		$li.appendTo($("#search_result"));
	}
}
//根据搜索框的内容，搜索相应的文件
function searchRusule(name){
	var data=[];
	for(var i=0;i<datas.files.length;i++){
		if(datas.files[i].name==name){
			data.push(datas.files[i]);
		}
	}
	refreshDirectory(data);
	if(data==[]){
		alert("没有您要查找的文件");
	}
	
}

//生成移动列表
//var m=0;		//定义每个ULmargin－left值
function creatMoveDir(data){
	$("#list1 input").get(0).value="+";
//	m++;
	var arr=[];
	arr=getChildren(data);
	if(arr.length==0){
		return;
	}
	var $ul=$('<ul></ul>');
	$ul.appendTo($(".cont li").eq($(".cont li").length-1));
	for(var i=0;i<arr.length;i++){		
		var $li=$('<li></li>');
		var $div=$('<div></div>');		
		$div.get(0).id=arr[i].id;
		$div.get(0).pid=arr[i].pid;
		if(getChildren(arr[i].id).length!=0){
			var $input=$('<input type="button" value="+"/>');
			$input.appendTo($div)
		}
		if(arr[i].cont){
			$div.get(0).cont=arr[i].cont;
			var $img=$('<img src="img/1.png">');
		}else{
			var $img=$('<img src="img/docpic.jpg">');
		}
		
		var $span=$('<span>'+arr[i].name+'</span>')		
		$li.appendTo($ul);
		$div.appendTo($li);
		$img.appendTo($div);
		$span.appendTo($div);
		$div.off("click").click(function(){
				if(this.id==dNum){
					alert("对不起，不能移动到自己目录及其根目录下")
				}else if(this.cont){
					alert("对不起，只能移动到文件夹下");
				}else{
					if($(this).find("input").length!=0){
						if($(this).find("input").get(0).value=="+"){
							$(this).find("li").hide();
							$(this).next().children("li").show();
							$(this).find("input").get(0).value="-"
						}else{
							$(this).next().find("li").hide();
							$(this).find("input").get(0).value="+";
							$(this).next().find("input").get(0).value="+";
						}						
					}
					$(".cont div").css("background-color","");
					$(this).css("background-color","#095DBF");
				}
		})	
			
		creatMoveDir(arr[i].id);
	}
}
function check(data2){
	if(dNum==data2){
		return true;
	}
}


//生成移动列表
//var m=0;		//定义每个ULmargin－left值
function creatCopyDir(data){
	
	$("#list1 input").get(0).value="+";
//	m++;
	var arr=[];
	arr=getChildren(data);
	if(arr.length==0){
		return;
	}
	var $ul=$('<ul></ul>');
	$ul.appendTo($(".cont2 li").eq($(".cont2 li").length-1));
	for(var i=0;i<arr.length;i++){		
		var $li=$('<li></li>');
		var $div=$('<div></div>');		
		$div.get(0).id=arr[i].id;
		$div.get(0).pid=arr[i].pid;
		if(getChildren(arr[i].id).length!=0){
			var $input=$('<input type="button" value="+"/>');
			$input.appendTo($div);
		}
		if(arr[i].cont){
			$div.get(0).cont=arr[i].cont;
			var $img=$('<img src="img/1.png">');
		}else{
			var $img=$('<img src="img/docpic.jpg">');
		}
		
		var $span=$('<span>'+arr[i].name+'</span>')		
		$li.appendTo($ul);
		$div.appendTo($li);
		$img.appendTo($div);
		$span.appendTo($div);
		$div.off("click").click(function(){
				if(this.id==dNum){
					alert("对不起，不能移动到自己目录及其根目录下")
				}else if(this.cont){
					alert("对不起，只能移动到文件夹下");
				}else{
					if($(this).find("input").length!=0){
						if($(this).find("input").get(0).value=="+"){
							$(this).find("li").hide();
							$(this).next().children("li").show();
							$(this).find("input").get(0).value="-"
						}else{
							$(this).next().find("li").hide();
							$(this).find("input").get(0).value="+";
							$(this).next().find("input").get(0).value="+";
						}						
					}
					$(".cont2 div").css("background-color","");
					$(this).css("background-color","#095DBF");
				}
		})				
		creatCopyDir(arr[i].id);
	}
}

//检查是否已经存在该文件名
function checkName(){
	var num=0;
	var re=/^新建文件夹\d{0,}/;
	for(var i=0; i<datas.files.length;i++){
        if(re.test(datas.files[i].name)){
        	 	if(datas.files[i].pid==pidN){
        	 		num++; 
           }
        }
  	}	   
  	if(num==0){
  		datas.files.push({
			id: getMaxId()+1,
	        pid: pidN,
	        name: "新建文件夹"
		})
  	}else{
  		datas.files.push({
			id: getMaxId()+1,
	        pid: pidN,
	        name: "新建文件夹"+num
		})
  	}
	
	return false;
}