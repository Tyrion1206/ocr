mui.init();


//底部选项卡切换的js
var subpages = ['../subpages/copy/copy.html', '../subpages/translate/translate.html',
	'../subpages/proofread/proofread.html', '../subpages/search/search.html'
];
var subpages_style = {
	top: '44px',
	bottom: '50px',
	scrollIndicator: 'true', //界面内容多的时候出现滚动条 
}
var activeTab = subpages[0]; //当前激活的选项卡
mui('.mui-bar-tab').on('tap', 'a', function(e) { //选项卡点击事件
	var targetTab = this.getAttribute('href'); //this指向被点击的目标,返回指定属性名的属性值
	if (targetTab == activeTab) {
		return; //程序不执行  
	}
	plus.webview.show(targetTab); //显示目标选项卡
	plus.webview.hide(activeTab); //隐藏当前选项卡
	activeTab = targetTab;
})



// 关闭主页面等待窗口并接受主页面传来的参数
setTimeout(function() {
	mui.plusReady(function() {
		plus.nativeUI.closeWaiting();
		var self = plus.webview.currentWebview();
		self.show('zoom-fade-out', 350); //显示页面     
		var data = self.data; //后端传过来的识别数据
		var imgPath = self.imgPath;
		console.log("导航页面拿到了数据");
		for (var i = 0; i < subpages.length; i++) {
			var sub = plus.webview.create(subpages[i], subpages[i], subpages_style, {
				data: data, //ajax识别后的结果
				imgPath: imgPath //图片的地址
			})
			if (i > 0) {
				sub.hide(); //隐藏第二个第三个第四个页面，先显示第一个
			}
			self.append(sub);
		}
	})
}, 2000)




//复制选型卡点击事件
document.getElementById("copy").addEventListener("tap", function() {
	var self = plus.webview.currentWebview();
	var data = self.data;
	recoResult.copy_fun(recoResult.getData(data));
}, false)


//翻译选型卡点击事件
document.getElementById("translate").addEventListener("tap", function() {
	mui.toast("仅支持英 -> 中");
}, false)


//校对选型卡点击事件
document.getElementById("proofread").addEventListener("tap", function() {
	var self = plus.webview.currentWebview();
	var data = self.data;
}, false)


//搜索选型卡点击事件
document.getElementById("search").addEventListener("tap", function() {
	var self = plus.webview.currentWebview();
	var data = self.data;
	recoResult.copy_fun(recoResult.getData(data));
}, false)

//QQ按钮
document.getElementById("contact").addEventListener("tap",function(){
	mui.alert("1007139980","联系作者QQ","我知道了");
},false)


// 命名空间
var recoResult = {


	//  复制方法
	copy_fun: function(copy) { //参数copy是要复制的文本内容
		mui.plusReady(function() {
			//判断是安卓还是ios
			if (mui.os.ios) {
				//ios
				var UIPasteboard = plus.ios.importClass("UIPasteboard");
				var generalPasteboard = UIPasteboard.generalPasteboard();
				//设置/获取文本内容:
				generalPasteboard.plusCallMethod({
					setValue: copy,
					forPasteboardType: "public.utf8-plain-text"
				});
				generalPasteboard.plusCallMethod({
					valueForPasteboardType: "public.utf8-plain-text"
				});
				mui.toast("已成功复制到剪贴板");
			} else {
				//安卓
				var context = plus.android.importClass("android.content.Context");
				var main = plus.android.runtimeMainActivity();
				var clip = main.getSystemService(context.CLIPBOARD_SERVICE);
				plus.android.invoke(clip, "setText", copy);
				mui.toast("已成功复制到剪贴板");
			}
		});
	},


	// 获取json中识别后的字符串结果数据
	getData: function(data) {
		var str = "";
		for (var i = 0; i < data.words_result_num; i++) {
			str += data.words_result[i].words + "\n";
		}
		return str;
	},
}
