var datas = {
	//右键菜单数据
	contextmenu:{
		//document菜单组
		common:[
			{
				name: "新建",
				exe: function(){	
					var name = '新建文件夹';
					checkName()
						refreshDirectory(getChildren(pidN));
						var jsonstr=JSON.stringify(datas.files);
						localStorage.setItem('baiduyun',jsonstr);
						console.dir(localStorage);
				}
			},
			{
				name: "刷新",
				exe: function(){
					refreshDirectory( getChildren(pidN) );
				}
			},
			{
				name: "粘贴",
				exe: function(){
					
				}
			}
		],
		//文件夹菜单组
		folder: [
            {
                name: "打开",
                exe:function(){
                		for(var i=0;i<datas.files.length;i++){
                			if(datas.files[i].id==dNum){
                				if(datas.files[i].cont){
                					$(".list").html(datas.files[i].cont)	;
                					return;
                				}else{
                					pidN=dNum;
			                		refreshDirectory(getChildren(pidN));
			                		dirN.push({
			                			name:spanName,
			                			id:dNum
			                		})
			                		creatDir(dirN[dirN.length-1]);
			                		return;
                				}
                			}
                		}
                		
                }
            },
            {
                name: "重命名",
                exe:function(){  
                		for(var i=0;i<$(".list li").length;i++){                			
                			if($(".list li").eq(i).get(0).fileId==getInfo(dNum).id){                				
                				$(".list li").eq(i).find(".inptext").get(0).focus();
                				$(".list li").eq(i).find(".inptext").css("width",40).css("border","1px solid #ccc")
                				$(".list li").eq(i).find(".rename_box").show();
                				oldValue=$(".list li").eq(i).find(".inptext").val();
                			}
                		}
                		
                }
            },
            {
                name: "移动到",
                exe:function(){
                		$(".all_file").eq(0).show();
                		creatMoveDir(0);
                }
            },
            {
                name: "删除",
                exe:function(){
                		delN.push(dNum);
                		for(var j=0;j<delN.length;j++){
						for(var i=0;i<datas.files.length;i++){				
							if(datas.files[i].id==delN[j]||datas.files[i].pid==delN[j]){
								datas.files.splice(i,1);
								i--;
							}
						}		
					}
                		refreshDirectory(getChildren(pidN));
                		var jsonstr=JSON.stringify(datas.files);
					localStorage.setItem('baiduyun',jsonstr);
                		delN=[];
                }
            }
        ]
	},
	//文件数据
	files:[
		{
            id: 1,
            pid: 0,
            name: "前端"
        },
        {
            id: 2,
            pid: 0,
            name: "后端"
        },
        {
            id: 3,
            pid: 1,
            name: "css"
        },
        {
            id: 4,
            pid: 1,
            name: "js"
        },
        {
            id: 5,
            pid: 1,
            name: "JQ"
        }
	],
	dir:[
		{id:0}
	]	
}
var newdata=localStorage.getItem('baiduyun');
var newfiles=JSON.parse(newdata);
datas.files=newfiles || datas.files;
