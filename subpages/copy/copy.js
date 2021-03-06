mui.init();


mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.closeWaiting();
	var data = self.data;
	var imgPath = self.imgPath;
	if (data.words_result_num == 0) {
		mui.toast('未识别,请重新扫描');
	} else {
		copy.addInfo(data);
	}
})

// 命名空间
var copy = {

	//添加数据
	addInfo: function(data) {
		var wordsResultNum = data.words_result_num;
		var wordsResult = data.words_result;
		var resultUl = document.getElementById('copy');
		var str = "";
		for (var i = 0; i < wordsResultNum; i++) {
			str += "<li></li>"
		}
		resultUl.innerHTML = str;
		for (var i = 0; i < wordsResultNum; i++) {
			document.getElementsByTagName('li')[i];
			document.getElementsByTagName('li')[i].innerText = data.words_result[i].words;
		}
	}
}
