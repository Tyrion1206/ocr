mui.init();

mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.closeWaiting();
	var data = self.data;
	var imgPath = self.imgPath;
	if (data.words_result_num == 0) {
		mui.toast('未识别,请重新扫描');
	} else {
		var textareaDate = translate.getData(data);
		var sign = translate.getSign(textareaDate);
		translate.writeData(textareaDate); //向文本框中写数据
		translate.transData(textareaDate, sign); //翻译数据 
	}
})


// 命名空间
var translate = {


	//写数据
	writeData: function(data) {
		document.getElementById("textareaData").innerText = JSON.stringify(data);
	},

	//获取数据的字符串
	getData: function(data) {
		var str = "";
		for (var i = 0; i < data.words_result_num; i++) {
			str += data.words_result[i].words;
		}
		return str;
	},

	//md5方法获取翻译所需的sign
	getSign: function(q) {
		var appid = "20190218000268487";
		var salt = "12345678";
		var secretKey = "8dDWr4QXAWg1C1Rdf1du";
		var preMd5Str = appid + q + salt + secretKey;
		// console.log(preMd5Str);
		var md5Str = md5(preMd5Str);
		// console.log(md5Str);
		return md5(preMd5Str);
	},

	//翻译并显示数据
	transData: function(q, sign) {
		mui.ajax("https://fanyi-api.baidu.com/api/trans/vip/translate", {
			data: {
				q: q,
				from: "auto",
				to: "zh",
				appid: "20190218000268487",
				salt: "12345678",
				sign: sign,
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				for (var i = 0; i < data.trans_result.length; i++) {
					document.getElementById("transResult").innerText = data.trans_result[0].dst;
				}
			},
			error: function(xhr, type, errorThrown) {
				console.log(JSON.stringify(xhr));
				console.log(type);
				console.log(errorThrown);
			}
		});
	}
}
