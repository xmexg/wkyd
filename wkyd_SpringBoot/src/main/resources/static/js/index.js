//一些参数
var jsonObj = {
	'beginTime':'',
	'campus':'1',
	'endTime':'',
	'markList':[],
	'totalLength':3030,
	'totalTime':1500,
	'userCode':''
};//要提交的body内的json
var roadjson = "";//markList中的,即道路json
var startpoint = [];//起始出发点,[x经度,y纬度],用于获取4个打卡点
var roadlen = 0;//节点的总个数
var roadlenrecord = 0;//记录的节点的个数
var nodespace = 0;//设置的节点间距
var nodespacenow = 0;//当前的节点间距
var roadGeolen = 0;//路线长度(cm)
var canvasWidth = 690;//画布宽度
var canvasHeight = 690;//画布高度
var OriginSX = 118.766916;//原点经度坐标
var OriginSY = 36.891086;//原点纬度坐标
var OriginEX = 118.781829;//对点经度坐标
var OriginEY = 36.879227;//对点纬度坐标
var OriginW = OriginEX - OriginSX//经度宽度
var OriginH = OriginEY - OriginSY//纬度高度
var RatioX = OriginW/canvasWidth;//经度比例
var RatioY = OriginH/canvasHeight;//纬度比例
var GeoW = 1250;//地图地理宽度(cm)
var GeoPixel = GeoW/canvasWidth;//地图像素点长度

//页面元素
let sponsor = document.getElementById("sponsor");//赞助
let TheForm = document.getElementById("TheForm");//表格
let mapinfod1_1 = document.getElementById("mcdid1_1");//节点总数
let mapinfod1_2 = document.getElementById("mcdid1_2");//节点记录数量
let mapinfod2 = document.getElementById("mcdid2");
let ResTe = document.getElementById("res");
let saltbut = document.getElementById("saltredo");
let get4pointres = document.getElementById("get4pointres");//获取打卡点的返回信息
let canvasTOP = document.getElementById("canvasTOP");//画板顶层


//赞助按钮
function sponsorbtn1(){
    sponsor.style.display = "none";
    TheForm.style.display = "flex";
}
function sponsorbtn2(){
    sponsor.style.display = "none";
    TheForm.style.display = "flex";
}


//随机生成8个字符的salt,包含小写字母加数字
function randomSalt(){
	let salt = "";
	for(let i = 0; i < 8; i++){
		let random = Math.random();
		if(random < 0.5){
			salt += String.fromCharCode(Math.floor(Math.random() * 6) + 97);
		}else{
			salt += Math.floor(Math.random() * 10);
		}
	}
	return salt;
}

//字符串计算md5
function getmd5(salt) {
    const date = new Date();
    const yyyyMMdd = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    const encryptedStr = `${salt}${yyyyMMdd}duDusDut`;
    const md5 = CryptoJS.MD5(encryptedStr).toString().toLowerCase();
    return md5;
}


//监听salt刷新按钮
saltbut.onclick = function(){
//    saltbut.style.backgroundColor = "rgb(112, 72, 232)";
	let randomtext = randomSalt();
	document.getElementById("salt").value = randomtext;
	document.getElementById("sign").value = getmd5(randomtext);
}

//salt内容改变时
function saltchange(){
	let randomtext = document.getElementById("salt").value;
	document.getElementById("sign").value = getmd5(randomtext);
}


//设备类型识别

//监听节点间隔改变时
function nodespacechange(){
    let getnodespace = document.getElementById("nodespace").value;
    if(parseInt(getnodespace) > 0){
        nodespace = parseInt(getnodespace);
    }else{
        nodespace = 0;
    }
//    console.log("节点间隔改变:", nodespace);
}


//地图画板
const canvas = document.getElementById("mapcanvasdivcan");
const context = canvas.getContext('2d');
context.strokeStyle = "rgb(112, 72, 232)";
let firstDraw = true;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
function drawLine(e){
	if(!isDrawing) return;
	context.beginPath();
	context.moveTo(lastX, lastY);
	context.lineTo(e.offsetX, e.offsetY);
	context.stroke();
	roadGeolen += calGeolen(e);
	roadlen++;
	let ituse = calXYtoL(e);
	if(nodespacenow >= nodespace){//如果当前节点间隔大于等于设置的节点间隔
	    roadjson += ',{"latLng":{"latitude":'+ituse.y+',"longitude":'+ituse.x+'}}';
	    roadlenrecord++;//记录的节点的个数+1
	    nodespacenow = 0;//当前节点间隔归零
	}else{
	    nodespacenow++;//当前节点间隔+1
	}
	[lastX, lastY] = [e.offsetX, e.offsetY];
	mapinfod1_1.innerHTML = roadlen;
	mapinfod1_2.innerHTML = roadlenrecord;
	mapinfod2.innerHTML = roadGeolen;
	// console.log(roadlen,"Line",e.offsetX, e.offsetY, context.strokeStyle);
}
canvas.addEventListener("mousedown", (e) =>{
	isDrawing = true;
	if(firstDraw){
		firstDraw = false;
		let ituse = calXYtoL(e);
		roadlen++;//节点的总个数+1
		roadlenrecord++;//记录的节点的个数+1
		roadjson = '{"isStartPosition":true,"latLng":{"latitude":'+ituse.y+',"longitude":'+ituse.x+'}}';
		[lastX, lastY] = [e.offsetX, e.offsetY];
	    startpoint = [ituse.x, ituse.y];
	}else{
		drawLine(e);
	}
});
canvas.addEventListener("mousemove", drawLine);
canvas.addEventListener("mouseup", (e) => {
	isDrawing = false;
	roadGeolen += calGeolen(e);
	[lastX, lastY] = [e.offsetX, e.offsetY];//解决鼠标松开后划线不连贯
	mapinfod1_1.innerHTML = roadlen;
	mapinfod1_2.innerHTML = roadlenrecord;
	mapinfod2.innerHTML = roadGeolen;
	// console.log("Line", lastX, lastY, context.strokeStyle);
});
canvas.addEventListener("mouseout", (e) => {
	// isDrawing = false;
});

//计算坐标,将画板坐标转换为地图坐标
function calXYtoL(e){
	let ituse = {
		x: e.offsetX * RatioX + OriginSX,
		y: e.offsetY * RatioY + OriginSY
	} ;
	// console.log("calXYtoL", ituse.x, ituse.y);
	return ituse;
}

//通过勾股定理计算两点间物理距离
function calGeolen(e){
	if(e.offsetX == lastX && e.offsetY == lastY) return 0;
	if(e.offsetX == lastX) return Math.abs(e.offsetY - lastY) * GeoPixel;
	if(e.offsetY == lastY) return Math.abs(e.offsetX - lastX) * GeoPixel;
	return Math.sqrt(Math.pow(e.offsetX - lastX, 2) + Math.pow(e.offsetY - lastY, 2)) * GeoPixel;//勾股定理
}

//计算坐标,将地图坐标转换为画板坐标
function calLtoXY(x, y){
    let ituse = {
        x: (x - OriginSX) / RatioX,
        y: (y - OriginSY) / RatioY
    } ;
    // console.log("caXYtoL", ituse.x, ituse.y);
    return ituse;
}


//地图类型控制
document.getElementById("mapdatatype").onchange = function(){
	let maptype = this.value;
	let mapcanv= document.getElementById("mapcanvasdivcan");
	let maptext = document.getElementById("mapcanvasdivtext");
	let mapinfo = document.getElementById("mapcanvasdrawinfo");
	if(maptype == "m"){
		document.getElementById("get4point").style.display = "block";
		document.getElementById("canvasTOP").style.display = "block";
		mapcanv.style.display = "block";
		maptext.style.display = "none";
	}else{
		document.getElementById("get4point").style.display = "none";
		document.getElementById("canvasTOP").style.display = "none";
		mapcanv.style.display = "none";
		maptext.style.display = "block";
	}
}

let point4;//获取打卡点的响应
//点击获取打卡点按钮后,网络请求,获取打卡点
document.getElementById("get4point").onclick = function(){
    if(startpoint.length == 0 || document.getElementById("id").value == "" || document.getElementById("campus").value == ""){
        alert("参数不完整:\n1.请检查学号\n2.请检查校区是否填写\n3.请先在地图上设置一个起点,然后再获取打卡点!");
        return;
    }
    let url = "/api/semester/queryPoint?salt="+document.getElementById("salt").value+'&sign='+document.getElementById("sign").value;
    let HEAD = {//服务器要设置的请求头信息
		"X-Re-Os": document.getElementById("ostype").value,
		"X-Re-Version": document.getElementById("version").value,
		"X-Re-Device": document.getElementById("phone").value,
		"User-Agent": document.getElementById("useragent").value
	};
	let BODY = {
	    "campus": document.getElementById("campus").value,
	    "pointLat": startpoint[1],
	    "pointLong": startpoint[0],
	    "userCode": document.getElementById("id").value
	};
	let params = {
		"HEAD": HEAD,
		"BODY": BODY
	};
	let xhrget4point = new XMLHttpRequest();
    xhrget4point.open("POST", url, true);
	xhrget4point.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhrget4point.timeout = 40000;//40秒超时
	xhrget4point.ontimeout = function(){
    		get4pointres.innerHTML = '连接超时';
    	};
    	xhrget4point.onerror = function(){
    		get4pointres.innerHTML = '无法发送数据到web服务器';
    	};
    	xhrget4point.onload = function(){
    		if(xhrget4point.status === 200){
    		canvasTOP.innerHTML = "";//清空原有的打卡点
    		    //把响应的json转换
    		    point4 = JSON.parse(xhrget4point.responseText);
    		    get4pointres.innerHTML = point4.msg;
    		    if(point4.code == 1){//成功获取的打卡点坐标
    		        for(i in point4.data){//遍历打卡点
                        let pointL = point4.data[i];
                        let pointXY = calLtoXY(pointL.pointLong, pointL.pointLat);
						pointXY.x -= 10;
						pointXY.y -= 20; 
						//<image id="testimg" th:src="@{/res/local_br.png}" src="../static/res/local_br.png" width="20px"></image>
						//设置打卡点图片
//						console.log("点位:"+pointXY.x, pointXY.y);
						canvasTOP.innerHTML += '<image th:src="@{/res/local_br.png}" src="/res/local_br.png" class="the_point" style="left:'+pointXY.x+'px;top:'+pointXY.y+'px; width:20px" ></image>';
                    }
    		    }
    		    console.log(point4);
    		}else{
    			get4pointres.innerHTML = 'Err:'+xhrget4point.status;
    		}
    	};
    	xhrget4point.onabort = function(){
    		get4pointres.innerHTML = '请求被取消';
    	}
    	xhrget4point.send(JSON.stringify(params));

    console.log("get4point");
}


//点击提交按钮后
document.getElementById("subdata").onclick = function(){
	jsonObj.beginTime = document.getElementById("beginTime").value.replace("T", " ");
	jsonObj.campus = document.getElementById("campus").value;
	jsonObj.endTime = document.getElementById("endTime").value.replace("T", " ");
	let maptype = document.getElementById("mapdatatype").value;
	jsonObj.markList;
	switch(maptype){
	    case "m":
	        jsonObj.markList = '['+roadjson+']';
	        break;
        case "t":
            jsonObj.markList = document.getElementById("mapcanvasdivtext").value;
            break;
        default:
            jsonObj.markList = "";
            break;
	}
	jsonObj.totalLangth = document.getElementById("totalGeoLength").value;
	jsonObj.totalTime = document.getElementById("totalTimeLength").value;
	jsonObj.userCode = document.getElementById("id").value;

	let tourl = '/api/run/addRunInfo?salt='+document.getElementById("salt").value+'&sign='+document.getElementById("sign").value;
	//不允许设置"X-Re-Os"等自定义请求头,先把数据发送到服务器,再由服务器发送请求
	let HEAD = {//服务器要设置的请求头信息
		"X-Re-Os": document.getElementById("ostype").value,
		"X-Re-Version": document.getElementById("version").value,
		"X-Re-Device": document.getElementById("phone").value,
		"User-Agent": document.getElementById("useragent").value
	}
	let params = {
		"HEAD": HEAD,
		"BODY": jsonObj
	};


	//网络请求,提交跑步信息
	ResTe.innerHTML += '<div class="res_n">准备提交数据</div>'
	let xhr = new XMLHttpRequest();
	xhr.open("POST", tourl, true);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhr.timeout = 40000;//40秒超时
	xhr.ontimeout = function(){
		ResTe.innerHTML += '<div class="res_n">连接超时</div>'
	};
	xhr.onerror = function(){
		ResTe.innerHTML += '<div class="res_n">无法发送数据到web服务器</div>'
	};
	xhr.onload = function(){
		if(xhr.status === 200){
			ResTe.innerHTML += '<div class="res_n">获取到服务器的响应:</div>';
			ResTe.innerHTML += '<div class="res_wr">'+xhr.responseText+'</div>';
		}else{
			ResTe.innerHTML += '<div class="res_n">web服务器返回错误的代码:'+xhr.status+'</div>';
		}
	};
	xhr.onabort = function(){
		ResTe.innerHTML += '<div class="res_n">请求被取消</div>';
	}
	xhr.send(JSON.stringify(params));

}

