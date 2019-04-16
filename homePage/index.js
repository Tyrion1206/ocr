mui.init();


//QQ按钮
document.getElementById("contact").addEventListener("tap",function(){
	mui.alert("1007139980","联系作者QQ","我知道了");
},false)

//拍照识别按钮
document.getElementById("phoCapture").addEventListener("tap",function(){
	index.phoCapture(); //拍照上传识别
},false)

//照片库识别按钮
document.getElementById("phoGallery").addEventListener("tap",function(){
	index.phoGallery(); //照片库识别
},false)


//命名空间
var index = {

	//拍照
	phoCapture: function() {
		var cmr = plus.camera.getCamera();
		cmr.captureImage(function(p) {
			plus.io.resolveLocalFileSystemURL(p, function(entry) {
				var imgPath = entry.toLocalURL();
				index.addMask(index.compressImage(imgPath));//遮罩并且拍照后压缩图片
			}, function(e) {
				console.log("读取拍照文件错误: " + e.message)
			})
		}, function(e) {
			console.log("失败: " + e.message)
		}, {
			filename: "_doc/camera/", //图片在本机的储存位置
			index: 1
		})
	},

	//照片库上传
	phoGallery: function() {
		plus.gallery.pick(function(e) {
			for (var i in e.files) {
				var fileSrc = e.files[i];
				index.addMask(index.compressImage(fileSrc));//遮罩并且压缩图片
			}
		}, function(e) {
			console.log("取消选择图片");
		}, {
			filter: "image",
			multiple: true,
			maximum: 1,
			system: false,
			onmaxed: function() {
				plus.nativeUI.alert('最多只能选择1张图片');
			}
		});
	},
	
	//遮罩的功能
	addMask: function(){
		var mask = mui.createMask();
		mask.show();
	},

	//压缩图片
	compressImage: function(imgPath) {
		console.log("开始压缩");
		plus.zip.compressImage({
			src: imgPath,
			dst: '_doc/zip/' + new Date().getTime() + '.jpg',
			quality: 10,
			format: "jpg",
			overwrite: true
		}, function(zip) {
			index.getBase64Data(zip.target); //压缩后调用base64方法
		}, function(error) {
			alert(JSON.stringify(error));
		})
	},


	//base64图片
	getBase64Data: function(imgPath) {
		var bitmap = new plus.nativeObj.Bitmap(imgPath);
		bitmap.load(imgPath, function(data) {
			
			//IOS
			// var base64Url = bitmap.toBase64Data().substr(22);  
			 
			//Android 
			// var base64Url = bitmap.toBase64Data().substr(23);   
			
			//兼容  去掉data:image/jepg;base64,/9j
			var base64Url = bitmap.toBase64Data().split(",")[1];   

			console.log("base64成功");
			index.upload(base64Url, imgPath); //base64后调用ajax方法
		}, function(e) {
			console.log(e);
		})
	},


	//上传图片到百度api	
	upload: function(base64Url, imgPath) {
		console.log("开始上传");
		mui.ajax({
			url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic',
			data: {
				access_token: '24.a7864e37ee8e78280dcb4755206becb5.2592000.1558022929.282335-15500275',
				image: base64Url
			},
			async: true,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			dataType: 'json',
			crossDomain: true, //强制使用5+跨域
			type: 'post',
			timeout: 10000,
			success: function(data) {
				console.log("上传成功");
				mui.openWindow({ //成功后打开底部导航主页面
					url: './bottomBarNavPage/recoResult.html', //相对于html的位置
					id: 'recoResult',
					styles: {
						top: '0px',
						bottom: '0px',
						width: '100%',
						height: '100%'
					},
					extras: {
						data: data,
						imgPath: imgPath,
					},
					show: {
						autoShow: false, //不立即展示页面，等百度api的响应
						aniShow: 'zoom-fade-out',
						duration: '350'
					},
					waiting: {
						autoShow: true,
						title: '上传中...',
					}
				})
			},
			error: function(xhr, type, errorThrown) {
				console.log(JSON.stringify(xhr));
				console.log(type);
				console.log(errorThrown);
			}
		});
	},
}
