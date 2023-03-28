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
var APPversion = "1.0.2";//跑步软件版本号,苹果系统填写此参数,安卓系统不填写此参数
var UAversion = "";//通过UA获取到的系统版本,安卓系统应该填写此参数,苹果系统不填写此参数填写跑步软件的版本号
var UAOsModel = "";//安卓系统用于填写手机型号的一部分参数,这里是通过UA获取的,还有一部分是用户通过下拉框选择的
var UAOsVersion = "";//通过UA获取到的系统版本,苹果系统专有的参数

//页面元素
let mapinfod1_1 = document.getElementById("mcdid1_1");//节点总数
let mapinfod1_2 = document.getElementById("mcdid1_2");//节点记录数量
let mapinfod2 = document.getElementById("mcdid2");
let ResTe = document.getElementById("res");
let saltbut = document.getElementById("saltredo");
let get4pointres = document.getElementById("get4pointres");//获取打卡点的返回信息
let canvasTOP = document.getElementById("canvasTOP");//画板顶层
let ostype = document.getElementById("ostype");//操作系统类型
let version = document.getElementById("version");//系统版本
let phone = document.getElementById("phone");//系统型号
let osversion = document.getElementById("OsVersion");//苹果额外的系统版本
let useragent = document.getElementById("useragent");//useragent
let totalGeoLength = document.getElementById("totalGeoLength");//路线长度
let totalTimeLength = document.getElementById("totalTimeLength");//路线时间
let totalGeoLengthLock = document.getElementById("totalGeoLengthLock");//路线长度锁
let totalTimeLengthLock = document.getElementById("totalTimeLengthLock");//路线时间锁
let selectedAndroidBrand = document.getElementById("selectedAndroidBrand");//安卓品牌下拉列表
let selectediPhoneBrand  = document.getElementById("selectediPhoneBrand");//苹果品牌下拉列表
let selectedBrandInput = document.getElementById("selectedBrandInput");//品牌输入框

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


//设置salt和sign的值
function setsaltsign(){
	let randomtext = randomSalt();
	document.getElementById("salt").value = randomtext;
	document.getElementById("sign").value = getmd5(randomtext);
}

//监听salt刷新按钮
saltbut.onclick = setsaltsign();


//salt内容改变时
function saltchange(){
	let randomtext = document.getElementById("salt").value;
	document.getElementById("sign").value = getmd5(randomtext);
}

//监听苹果品牌选择框改变
selectediPhoneBrand.onchange = function(){
	selectedAndroidBrand.value = "";
	ostype.value = "iOS";//系统类型
	version.value = APPversion;//苹果的版本号是固定的,是跑步软件的版本号
	selectedBrandInput.value = selectediPhoneBrand.value;//手机品牌暂存框,好像也没什么用
	phone.value = selectediPhoneBrand.value;//手机型号
	useragent.value = "RunWay/"+APPversion+" (iPhone; iOS "+ selectediPhoneBrand.value +"; Scale/3.00)";
}

//监听安卓品牌选择框改变
selectedAndroidBrand.onchange = function(){
	selectediPhoneBrand.value = "";
	ostype.value = "android";//系统类型
	version.value = UAversion;//安卓的版本号是通过UA获取的
	selectedBrandInput.value = selectedAndroidBrand.value;//手机品牌暂存框,好像也没什么用
	phone.value = selectedAndroidBrand.value + " " + UAOsModel;//手机型号
	osversion.value = "";//这是苹果系统额外的参数,如果选安卓,此参数删除
	useragent.value = "okhttp/4.5.0";
}

//设备类型识别
function setMyPhone(){
	var userAgent = window.navigator.userAgent;
	console.log(userAgent);

	// 解析设备类型
	var isAndroid = /Android/.test(userAgent);
	var isIOS = /\b(iPhone|iP[ao]d)/.test(userAgent);
	var isPC = !isAndroid && !isIOS;

	if (isAndroid) {
		// 解析 Android 设备型号和版本号
		var androidModel = /Android\s.*;\s([^;]+)\sBuild/.exec(userAgent);
		var androidVersion = /Android\s([\d\.]+)/.exec(userAgent);
		ostype.value = "android";
		UAversion = androidVersion[1];//安卓的版本号,是通过UA获取的
		version.value = androidVersion[1];
		UAOsModel = androidModel[1];
		console.log("设备类型: Android");
	  	console.log("Android 型号：" + androidModel[1]);
	  	console.log("Android 版本号：" + androidVersion[1]);
	} else if (isIOS) {
		// 解析 iOS 设备型号和版本号
		UAOsVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(userAgent);//
		// UAOsVersion = (/OS\s([\d_]+)/.exec(userAgent));//有问题,用不到,先留着
		//把UAOsVersion里的_替换成.
		UAOsVersion = UAOsVersion[1]+"."+UAOsVersion[2]+"."+UAOsVersion[3];
		ostype.value = "iOS";
		version.value = APPversion;//苹果这里应该填写跑步软件的版本号
		osversion.value = UAOsVersion;//苹果的系统版本号写在这里
		// phone.value = "iPhone " + iOSModel[1];//无法通过UA获取该值,不应该由UA填写,要让用户选择
		console.log("设备类型: iOS");
		// console.log("iOS 型号：" + iOSModel[1]);
		console.log("iOS 版本号：" + UAOsVersion);
		var iOSDevice = /(iPhone|iP[ao]d)/.exec(userAgent);

		// var iOSVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(userAgent);
		// let version = iOSVersion[1] + "." + iOSVersion[2] + "." + iOSVersion[3];
		// console.log("设备类型：iOS");
		// console.log("iOS 设备：" + iOSDevice[1]);
		// console.log("iOS 版本号：" + version);
	} else {
		//是PC,不做任何事
	}

}


//监听路线长度锁
totalGeoLengthLock.onclick = function(){
    totalGeoLength.disabled = totalGeoLength.disabled ? false : true;
    if(totalGeoLength.disabled){
        totalGeoLength.value = null;
    }
}

//监听路线时间锁
totalTimeLengthLock.onclick = function(){
    totalTimeLength.disabled = totalTimeLength.disabled ? false : true;
    if(totalTimeLength.disabled){
        totalTimeLength.value = null;
    }
}

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
		"X-Re-Os": ostype.value,
		"X-Re-Version": version.value,
		"X-Re-Device": phone.value,
		"User-Agent": useragent.value
	};
//	//安卓手机设置UA
//	if(ostype.value == "android"){
//	    HEAD["User-Agent"] = "okhttp/4.5.0";
//	}
//	//苹果手机设置UA
//	if(ostype.value == "iOS"){
//	    HEAD["User-Agent"] = "RunWay/1.0.2 (iPhone; iOS "+osversion.value+"; Scale/3.00)";
//	}
	//如果是iOS,HEAD里需要额外设置"X-Re-OsVersion"
	if(ostype.value == "iOS"){
	    console.log("iOS");
	    HEAD["X-Re-OsVersion"] = osversion.value;
	}
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
    //运动路程处于锁定状态时,自动获取
    if(totalGeoLength.disabled == true){
        totalGeoLength.value = Math.floor(roadGeolen);
    }
    //运动时间处于锁定状态时,自动获取
    if(totalTimeLength.disabled == true){
        const startTime = new Date(document.getElementById("beginTime").value);
        const endTime = new Date(document.getElementById("endTime").value);
        const timeDiff = Math.abs(endTime.getTime() - startTime.getTime());
        totalTimeLength.value = Math.floor(timeDiff / 1000);
    }
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
	jsonObj.totalLength = totalGeoLength.value;
	jsonObj.totalTime = totalTimeLength.value;
	jsonObj.userCode = document.getElementById("id").value;

	let tourl = '/api/run/addRunInfo?salt='+document.getElementById("salt").value+'&sign='+document.getElementById("sign").value;
	//不允许设置"X-Re-Os"等自定义请求头,先把数据发送到服务器,再由服务器发送请求
	let HEAD = {//服务器要设置的请求头信息
		"X-Re-Os": ostype.value,
		"X-Re-Version": version.value,
		"X-Re-Device": phone.value,
		"User-Agent": useragent.value
	}
	//安卓手机设置UA
//	if(ostype.value == "android"){
//	    HEAD["User-Agent"] = "okhttp/4.5.0";
//	}
//	//苹果手机设置UA
//	if(ostype.value == "iOS"){
//	    HEAD["User-Agent"] = "RunWay/1.0.2 (iPhone; iOS "+osversion.value+"; Scale/3.00)";
//	}
	//如果是iOS,HEAD里需要额外设置"X-Re-OsVersion"
	if(ostype.value == "iOS"){
	    HEAD["X-Re-OsVersion"] = osversion.value;
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



//页面加载完毕后立即执行的函数
window.onload = function(){
	setsaltsign();//设置salt和sign的值
	setMyPhone();//自动通过UA设置手机型号
}
