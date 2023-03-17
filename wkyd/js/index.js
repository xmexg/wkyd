//一些参数
var jsonObj = {
	'beginTime':'',
	'campus':'1',
	'endTime':'',
	'markList':[],
	'totalLangth':3030,
	'totalTime':1500,
	'userCode':''
};//要提交的大json
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
var GeoW = 1525;//地图地理宽度(cm)
var GeoPixel = GeoW/canvasWidth;//地图像素点长度

//页面元素
let mapinfod1 = document.getElementById("mcdid1");
let mapinfod2 = document.getElementById("mcdid2");

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
function getmd5(str){
	str = str + "duDusDut";
	let md5text = CryptoJS.MD5(str).toString();
	return md5text;
}

//监听salt刷新按钮
document.getElementById("saltredo").onclick = function(){
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
	jsonObj.beginTime = document.getElementById("beginTime").value;
	jsonObj.campus = document.getElementById("campus").value;
	jsonObj.endTime = document.getElementById("endTime").value;
	jsonObj.markList = roadjson;
	jsonObj.totalLangth = document.getElementById("totalGeoLength").value;
	jsonObj.totalTime = document.getElementById("totalTimeLength").value;
	jsonObj.userCode = document.getElementById("id").value;

	let host = 'sports.wfust.edu.cn';
	let tourl = 'http://'+host+'/api/run/addRunInfo?salt='+document.getElementById("salt").value+'sign='+document.getElementById("sign").value;
	let params = JSON.stringify(jsonObj);
	let xhr = new XMLHttpRequest();
	xhr.open("POST", tourl, true);
	xhr.setRequestHeader("X-Re-Os",  document.getElementById("ostype").value);
	xhr.setRequestHeader("X-Re-Version", document.getElementById("version").value);
	xhr.setRequestHeader("X-Re-Device", document.getElementById("phone").value);
	xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
	xhr.setRequestHeader("Content-Length", params.length);
	xhr.setRequestHeader("Host",host);
	xhr.setRequestHeader("Connection", "close");
	xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
	xhr.setRequestHeader("User-Agent", document.getElementById("useragent").value);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			let res = xhr.responseText;
			console.log(res);
			document.getElementById("res").innerHTML = res;
		}
	}
	xhr.send(params);

}