// 基于mui的滚动组件，自己封装上拉加载功能
// 依赖mui.js
function Scroller(option) {
	var _scrollWrapperElem = null;
	var _scrollElem = null;
	var _scroller = null;
	var _loadingStatus = '';

	// 初始化
	function init(option) {

		// option定义
		// interface Option {
		// 	elem: string;
		//	onPullup: function;
		// }

		// 获取滚动容器
		_scrollWrapperElem = document.querySelector(option.elem);

		// 获取滚动块
		_scrollElem = document.querySelector(option.elem + ' .mui-scroll');

		// 创建mui滚动组件对象
		_scroller = mui(option.elem).scroll();

		// 只有定义了上拉加载回调，才初始化上拉加载
		if (option.onPullup) {
			initPullup(option);
		}
	}

	// 初始化上拉功能
	function initPullup(option) {
		_loadingStatus = 'pullup';

		// 添加上拉提示
		var loadingStatus = document.createElement('div');
		loadingStatus.className = 'loading-status-wrapper';
		loadingStatus.innerHTML += '<span class="loading-status pullup active">上拉显示更多</span>';
		loadingStatus.innerHTML += '<span class="loading-status loading"><span class="mui-pull-loading mui-icon mui-spinner"></span>正在加载...</span>';
		loadingStatus.innerHTML += '<span class="loading-status end">没有更多数据了</span>';
		_scrollElem.appendChild(loadingStatus);

		// scroll事件时判断距离，并触发回调
		window.addEventListener('scroll', function() {
			var bottom1 = _scrollElem.getBoundingClientRect().bottom;
			var bottom2 = _scrollWrapperElem.getBoundingClientRect().bottom;
			var top1 = _scrollElem.getBoundingClientRect().top;
			if (bottom2 - bottom1 > 20 && top1<0) { //top1<0的作用：当区域很小不需要滚动时，即使有滚动的动作，不会触发加载
				if (_loadingStatus === 'pullup') {
					setLoadingStatus('loading');
					// 调用上拉的回调
					option.onPullup();
				}
			}
		});
	}

	// 上拉加载结束
	function end(isEnd) {
		if (isEnd) {
			setLoadingStatus('end');
		} else {
			setLoadingStatus('pullup');
		}
	}

	// 封装mui滚动方法
	function scrollTo(x, y) {
		_scroller.scrollTo(x, y);
	}

	// 切换加载状态
	function setLoadingStatus(status) {
		_loadingStatus = status;
		var elements = document.querySelectorAll('.loading-status');
		for (var i = 0; i < elements.length; i++) {
			var item = elements[i];
			if (item.classList.contains(status)) {
				item.classList.add('active');
			} else {
				item.classList.remove('active');
			}
		}
	}

	init(option);
	this.end = end;
	this.scrollTo = scrollTo;
	this.setLoadingStatus = setLoadingStatus;
}
