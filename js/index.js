var num = 0;
var dNum;		//文件上右键时记录点击的文件的ID
var spanName;	//文件上右键时记录点击的文件的文件名，以便生成span
var pidN=0;			//定义当前页面的pid
var dirN=[{			//定义目录信息
	name:'全部文件',
	id:0
}];		//定义目录数据
var delN=[];
var oldValue;	//定义重命名之前的文件夹名
$(".cloud_box").hover(function(){		//移入移出效果
	$(".cloudNav").slideDown(500);
},function(){
	$(".cloudNav").slideUp(500);
});

$(".user_box").hover(function(){
	$(".userinfo").fadeIn(1000);
},function(){
	$(".userinfo").fadeOut(1000);
});

$(".more_box ").hover(function(){
	$(".morenav").show(500);
},function(){
	$(".morenav").hide(500);
});
	
$(".contrt_cont").css("background","white");
$(".alldocbox").show();
$(".changebox").show();
$(".change").show();
//点击新建文件夹
$(".xjdoc").on("click",function(){
	var name = '新建文件夹';
	checkName()
	refreshDirectory(getChildren(pidN));
	var jsonstr=JSON.stringify(datas.files);
	localStorage.setItem('baiduyun',jsonstr);
})

//点击删除
$(".delete").on("click",function(){	
	for(var j=0;j<delN.length;j++){
		for(var i=0;i<datas.files.length;i++){				
			if(datas.files[i].id==delN[j]||datas.files[i].pid==delN[j]){
				datas.files.splice(i,1);
				i--;
			}
		}		
	}
	delN=[];
	var jsonstr=JSON.stringify(datas.files);
	localStorage.setItem('baiduyun',jsonstr);
	console.log(datas.files);
	$(".libox[style*='rgb']").parent().remove();
	if($(".inpch").length == 0){
		$(".chdicon").attr("checked",false);
		$(".checkbox" ).hide().prev().show().find("input").attr("checked",false);				
	}
	num = 0;
	$(".changebox").find("span").eq(0).html("已选中"+num+"个文件/文件夹");
	$("#totle_file").html("已全部加载，共"+$(".inpch").length+"个");	
});	


//全选
$(".chicon").on("click",function(){		
	delN=[];
	for(var i=0;i<datas.files.length;i++){
		delN.push(datas.files[i].id);
	}
	checkedAll($(this));
	if($(this).get(0).checked){
		$(this).parent().hide().next().show();
		$(this).get(0).checked=false;		
	}
	
});

//全部取消选中
$(".chdicon").on("click",function(){		
	delN=[];
	checkedAll($(this));
	if(!$(this).get(0).checked){
		$(this).parent().hide().prev().show();
		$(this).get(0).checked=false;
	}	
});			

//全局右键菜单
$(".list").on("contextmenu",function(ev){
	showContextmenu(ev,datas.contextmenu.common);	
	return false;
})

//隐藏右键菜单
$(document).on("click",function(){
	$(".contextmenu").hide();
	$("#search_result li").remove();
})
//根据已有文件数据  datas.files 来初始化创建文件夹/文件
refreshDirectory( getChildren(0));
//刷新文件夹布局
refreshDirectoryPosition();

//点击生成碰撞的div
pzDiv($(".list"));

//鼠标移入移出
$(".list li").hover(function(){
	$(this).find(".inpch").show();	
},function(){
	if($(this).find(".inpch").get(0).checked){
		$(this).find(".inpch").show();	
	}else{
		$(this).find(".inpch").hide();	
	}
});
//点击全部文件，回到根目录
$("#file_dir span").eq(0).click(function(){
	refreshDirectory(getChildren(0));
	$("#file_dir span").eq(1).nextAll().remove();
	pidN=0;
	dirN=[{
		name:'全部文件',
		id:0
	}];
})
//点击返回上一级
$("#returnNext").click(function(){
	if($("#file_dir span").length>2){
		refreshDirectory(getChildren(dirN[dirN.length-2].id));	
		dirN.pop();
		$("#file_dir span").eq($("#file_dir span").length-1).remove();
		pidN=dirN[dirN.length-1].id;
	}	
})
//搜索生成文件下拉菜单，选择文件
var searchInp=document.getElementById("search_input");
var searchData=[];
searchInp.oninput=function(){
	$("#search_result li").remove();
	var inpValue=searchInp.value;
	searchData=[];
	for(var i=0;i<datas.files.length;i++){
		if(datas.files[i].name.indexOf(inpValue.trim())!=-1){
			searchData.push(datas.files[i].name);
		}
	}
	creatSearchList(searchData);
	return false;
}
var activeNum=-1;
searchInp.onkeydown=function(ev){
	console.log(ev.keyCode);
	var re=/^\s+$/;
	var searchVal;
	if(ev.keyCode===40){
		ev.preventDefault();
		activeNum++;		
		if(activeNum==$("#search_result li").length){
			activeNum=$("#search_result li").length-1;
		}
	}
	if(ev.keyCode===38){
		ev.preventDefault();
		activeNum--;
		if(activeNum==(-1)){
			activeNum=0;
		}
	}
	$("#search_result li").css("background","white");
	$("#search_result li").eq(activeNum).css("background","gainsboro");
	console.log(activeNum);
	if(ev.keyCode===13){
		searchVal=$("#search_input").val();
		if($("#search_result li").length!=0){
			$("#search_input").get(0).value=$("#search_result li[style*=gainsboro]").html();
			$("#search_result li").remove();
		}else{
			if(!re.test(searchVal)){	//检测输入的是不是空格
				searchVal=searchVal.trim();
				searchRusule(searchVal);
			}else{				
				alert("查找的内容不能为空");
			}
		}
	}
//	
}
//查找文件夹
$(".search").click(function(){
	var re=/^\s+$/;
	var searchVal=$("#search_input").val();
	if(!re.test(searchVal)){	//检测输入的是不是空格
		searchVal=searchVal.trim();
		searchRusule(searchVal);
	}else{		
		alert("查找的内容不能为空");
	}
});
$(".setstate span").eq(0).click(function(){
	$(".list li").css("position","").css("width","100%").css("height",30).css("padding",0);
	$(".list li div").css("float","left").css("width",50).css("height",30);
	$(".list li .inptext").css("float","left").css("width",100);
	$(".list li img").css("height","19px").css("width","19px").addClass('.bg').attr("src","").css("background-position","-2px -205px");
})

//重命名
$(".rename").click(function(){
	var $lis=$(".list li .inpch[style*=block]").parent().parent();
	oldValue=$lis.find(".inptext").val();
	$lis.find(".inptext").get(0).focus();
    $lis.find(".inptext").css("width",40).css("border","1px solid #ccc")
    $lis.find(".rename_box").show(); 
    $lis.find(".inpch").hide().get(0).checked=false;
    $lis.find(".libox").css("border","2px solid #fff");
    
})

//文件上传
var uploadBtn=document.getElementById("uploadbtn");
uploadBtn.onchange=function(){
	if(confirm("亲，只能上传图片哦，确定上传吗？")){
		var file = this.files[0];
		var xhr = new XMLHttpRequest();
		xhr.open('post','../php/post_file.php',true);	
		var fr = new FileReader();	
		xhr.upload.onprogress = function(ev){
			if(file.type.indexOf('image') == -1){
				 	alert('只能只能上传图片');
				 	return;
			}else{
				var $lis=$("<li></li>");
				var $span1=$('<span class="file_name fl">'+file.name+'</span>');
				var $span2=$('<span class="load_scale fl"></span>');
				var $div=$('<div class="li_shadow"></div>');
				var $span3=$('<span class="check">查看<span>');
				$lis.appendTo($(".load_list"));
				$span1.appendTo($lis);
				$span2.appendTo($lis);
				$div.appendTo($lis);
				$span3.appendTo($lis);
				var scale=ev.loaded/ev.total;
				var iWidth=500*scale;		
				$(".loadbox").show();		
				$(".li_shadow").css("width",iWidth);
				$(".load_scale").html(scale*100+"%");
			}
				
		}
		fr.onload = function(ev){
			if(file.type.indexOf('image') != -1){
				 datas.files.push({
				 	id: getMaxId()+1,
				 	pid: pidN,
		            name: file.name,
		            cont:ev.target.result
				 });
				 refreshDirectory(getChildren(pidN));
				 var jsonstr=JSON.stringify(datas.files);
				 localStorage.setItem('baiduyun',jsonstr);
			}
		}		
		fr.readAsDataURL(file);
		var fd = new FormData();
		fd.append('file',file);
		xhr.send(fd);
	}
}

$(".close_btn").click(function(){
	$(".loadbox").hide();
})

//文件分类显示
$("#pic_list").click(function(){
	var data=[];
	for(var i=0;i<datas.files.length;i++){
		if(datas.files[i].cont){
			data.push(datas.files[i])
		}
	}
	refreshDirectory(data);
})


//移动到
$(".moveto").click(function(){
	if($(".list li input[style*=block]").length==0){
		alert("请选中您需要移动的文件");
	}else if($(".list li input[style*=block]").length==1){
		dNum=$(".list li input[style*=block]").parent().parent().get(0).fileId;
		$(".all_file").eq(0).show();
    		creatMoveDir(0);
	}else{
		alert("对不起，一次只能移动一个文件")
	}	
})

//展开多级菜单
$("#list1").click(function(){
	if($(this).find("input").get(0).value=="+"){
		$(this).find("li").hide();
		$(this).next().children("li").show();
		$(this).find("input").get(0).value="-";
	}else{
		$(this).next().find("li").hide();
		$(this).find("input").get(0).value="+";
		$(this).next().find("input").get(0).value="+";
	}
})

//确定移动
$(".yes").click(function(){
	if($(".cont li div[style*=background]").length==0){
		alert("请选择移动到的目录");
	}else{
		getInfo(dNum).pid=$(".cont li div[style*=background]").get(0).id;
		refreshDirectory(getChildren(pidN));
		var jsonstr=JSON.stringify(datas.files);
		localStorage.setItem('baiduyun',jsonstr);
		$("#list1").next().remove();
		$(".all_file").eq(0).hide();
	}
	FnNum();
})
//取消移动
$(".no").click(function(){
	$("#list1").next().remove();
	$(".all_file").hide();
})
$(".no_ico").click(function(){
	$("#list1").next().remove();
	$(".all_file").hide();
})

//复制到
$(".copyto").click(function(){	
	if($(".list .libox input[style*=block]").length==0){
		alert("请选中您需要复制的文件");
	}else if($(".list li input[style*=block]").length==1){
		dNum=$(".list li input[style*=block]").parent().parent().get(0).fileId;
		$(".all_file").eq(1).show();
    		creatCopyDir(0);
	}else{
		alert("对不起，一次只能复制一个文件");
	}
})

//确定复制
$(".yes1").click(function(){
	if($(".cont2 li div[style*=background]").length==0){
		alert("请选择移动到的目录");
	}else{		
		var arr2=[];
		var num=getMaxId()+1;
		if(getInfo(dNum).cont){
			datas.files.push(
			{
				id:num,
				name:getInfo(dNum).name,
				pid:$(".cont2 li div[style*=background]").get(0).id,
				cont:getInfo(dNum).cont
			}
		)
		}else{
			datas.files.push(
				{
					id:num,
					name:getInfo(dNum).name,
					pid:$(".cont2 li div[style*=background]").get(0).id
				}
			)
		}
		fn(dNum,num);
		refreshDirectory(getChildren(pidN));
		var jsonstr=JSON.stringify(datas.files);
		localStorage.setItem('baiduyun',jsonstr);
		$("#list2").next().remove();
		$(".all_file").eq(1).hide();

	}
	function fn(data,num){
	var arr=getChildren(data);
	if(arr.length==0){
		return;
	}
	for(var i=0;i<arr.length;i++){
		var num2=getMaxId()+1;
		if(arr[i].cont){
			datas.files.push({
				id:num2,
				name:arr[i].name,
				pid:getInfo(num).id,
				cont:arr[i].cont
			})
		}else{
			datas.files.push({
				id:num2,
				name:arr[i].name,
				pid:getInfo(num).id
			})
		}				
		fn(arr[i].id,num2);
	}
}
	
})
//取消复制
$(".no1").click(function(){
	$("#list2").next().remove();
	$(".all_file").eq(1).hide();
})

$("#list2").click(function(){
	if($(this).find("input").get(0).value=="+"){
		$(this).find("li").hide();
		$(this).next().children("li").show();
		$(this).find("input").get(0).value="-";
	}else{
		$(this).next().find("li").hide();
		$(this).find("input").get(0).value="+";
		$(this).next().find("input").get(0).value="+";
	}
})

$(".alldocli").click(function(){
	refreshDirectory(getChildren(pidN));
})
