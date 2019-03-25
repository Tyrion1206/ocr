mui.init();

mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	plus.nativeUI.closeWaiting();
	var data = self.data;
	var imgPath = self.imgPath;
	if (data.words_result_num == 0) {
		mui.toast('未识别,请重新扫描');
	} else {
		//复制识别后的内容
		search.addInfo(data);
		//绑定点击事件
		document.getElementsByClassName("search")[0].addEventListener('tap',function(){
			search.searchData();
		},false)
	}
})

var search = {

	//添加数据
	addInfo: function(data) {
		var wordsResultNum = data.words_result_num;
		var wordsResult = data.words_result;
		var resultUl = document.getElementById('search');
		var str = "";
		for (var i = 0; i < wordsResultNum; i++) {
			str += "<li></li>"
		}
		resultUl.innerHTML = str;
		for (var i = 0; i < wordsResultNum; i++) {
			document.getElementsByTagName('li')[i];
			document.getElementsByTagName('li')[i].innerText = data.words_result[i].words;
		}
	},

	// 给按钮绑定点击事件，打开百度页面
	searchData: function() {
		mui.toast("请先粘贴再搜索");
		mui.openWindow({
			url: "https://www.baidu.com",
			id: 'baidu',
			styles: {
				top: '44px',
				bottom: '50px'
			}
		})
	}
}
