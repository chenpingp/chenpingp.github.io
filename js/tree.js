
/*
* 根据指定的pid查找其下的一级子数据
* */
function getChildren(pid){
    var arr = [];
    for (var i=0;i<datas.files.length;i++) {
        if(datas.files[i].pid == pid) {
        	arr.push(datas.files[i]);
        }
    }
    return arr;
}
/*
* 根据指定id查找对应的数据
* */
function getInfo(id) {
    for (var i=0;i<datas.files.length;i++){
        if(datas.files[i].id == id){
        	return datas.files[i];
        }
    }
}
//新建文件夹时生成的数据的id的最大值
function getMaxId(){
	var maxId = 0;
	for(var i=0;i<datas.files.length;i++){
		if(datas.files[i].id>maxId){
			maxId = datas.files[i].id;
		}
	}
	return maxId;
}
