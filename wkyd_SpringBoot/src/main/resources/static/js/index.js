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
var roadlen = 0;//点的个数
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
let mapinfod1 = document.getElementById("mcdid1");
let mapinfod2 = document.getElementById("mcdid2");
let ResTe = document.getElementById("res");
let saltbut = document.getElementById("saltredo");

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
	let ituse = calXY(e);
	roadjson += ',{"latLng":{"latitude":'+ituse.y+',"longitude":'+ituse.x+'}}';
	[lastX, lastY] = [e.offsetX, e.offsetY];
	mapinfod1.innerHTML = roadlen;
	mapinfod2.innerHTML = roadGeolen;
	// console.log(roadlen,"Line",e.offsetX, e.offsetY, context.strokeStyle);
}
canvas.addEventListener("mousedown", (e) =>{
	isDrawing = true;
	if(firstDraw){
		firstDraw = false;
		let ituse = calXY(e);
		roadjson = '{"isStartPosition":true,"latLng":{"latitude":'+ituse.y+',"longitude":'+ituse.x+'}}';
		[lastX, lastY] = [e.offsetX, e.offsetY];
	}else{
		drawLine(e);
	}
});
canvas.addEventListener("mousemove", drawLine);
canvas.addEventListener("mouseup", (e) => {
	isDrawing = false;
	roadlen++;
	roadGeolen += calGeolen(e);
	[lastX, lastY] = [e.offsetX, e.offsetY];//解决鼠标松开后划线不连贯
	mapinfod1.innerHTML = roadlen;
	mapinfod2.innerHTML = roadGeolen;
	// console.log("Line", lastX, lastY, context.strokeStyle);
});
canvas.addEventListener("mouseout", (e) => {
	// isDrawing = false;
});
function calXY(e){
	let ituse = {
		x: e.offsetX * RatioX + OriginSX,
		y: e.offsetY * RatioY + OriginSY
	} ;
	// console.log("calXY", ituse.x, ituse.y);
	return ituse;
}
function calGeolen(e){
	if(e.offsetX == lastX && e.offsetY == lastY) return 0;
	if(e.offsetX == lastX) return Math.abs(e.offsetY - lastY) * GeoPixel;
	if(e.offsetY == lastY) return Math.abs(e.offsetX - lastX) * GeoPixel;
	return Math.sqrt(Math.pow(e.offsetX - lastX, 2) + Math.pow(e.offsetY - lastY, 2)) * GeoPixel;//勾股定理
};


//地图类型控制
document.getElementById("mapdatatype").onchange = function(){
	let maptype = this.value;
	let mapcanv= document.getElementById("mapcanvasdivcan");
	let maptext = document.getElementById("mapcanvasdivtext");
	let mapinfo = document.getElementById("mapcanvasdrawinfo");
	if(maptype == "m"){
		mapcanv.style.display = "block";
		maptext.style.display = "none";
	}else{
		mapcanv.style.display = "none";
		maptext.style.display = "block";
	}
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

	//网络请求
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
