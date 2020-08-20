// 统一管理Webviews参数，不包括index页面
var Webviews = {

	// 登录页
	'login': {
		url: '/pages/login/login.html',
		id: 'login',
	},

	// 扫码页
	'barcode': {
		url: '/pages/barcode/barcode.html',
		id: 'barcode',
	},

	// 个人设置页
	'user-info': {
		url: '/pages/user-info/user-info.html',
		id: 'user-info',
	},

	// 待办模块
	'todo': {
		url: '/pages/tab-todo/todo/todo.html',
		id: 'todo',
	},
	'todo-detail': {
		url: '/pages/tab-todo/todo-detail/todo-detail.html',
		id: 'todo-detail',
	},
	'todo-item': {
		url: '/pages/tab-todo/todo-item/todo-item.html',
		id: 'todo-item',
	},
	'message-list': {
		url: '/pages/tab-todo/message-list/message-list.html',
		id: 'message-list',
	},
	'message': {
		url: '/pages/tab-todo/message/message.html',
		id: 'message',
	},

	// 任务模块
	'task': {
		url: '/pages/tab-task/task/task.html',
		id: 'task',
	},
	'task-detail': {
		url: '/pages/tab-task/task-detail/task-detail.html',
		id: 'task-detail',
	},
	'video': {
		url: '/pages/tab-task/video/video.html',
		id: 'video',
	},

	// 样车模块
	'car': {
		url: '/pages/tab-car/car/car.html',
		id: 'car',
	},
	'car-reg': {
		url: '/pages/tab-car/car-reg/car-reg.html',
		id: 'car-reg',
	},
	'car-parking': {
		url: '/pages/tab-car/car-parking/car-parking.html',
		id: 'car-parking',
	},
	'car-use':{
		url: '/pages/tab-car/car-use/car-use.html',
		id: 'car-use',
	},
	'car-back':{
		url: '/pages/tab-car/car-back/car-back-list.html',
		id: 'car-back-list',
	},
	// 样件模块
	'sample': { //样件列表
		url: '/pages/tab-sample/sample/sample.html',
		id: 'sample',
	},
	'sampleDetail': { //样件详情
		url: '/pages/tab-sample/sample/sampleDetail.html',
		id: 'sampleDetail',
	},
	'sampleReg': { //样件登记
		url: '/pages/tab-sample/sampleReg.html',
		id: 'sampleReg',
	},
	'bookList': { //预约列表
		url: '/pages/tab-sample/bookList/bookList.html',
		id: 'bookList',
	},
	'sampleExp': { //样件出库
		url: '/pages/tab-sample/sampleExp/sampleExp.html',
		id: 'sampleExp',
	},
	'sampleXchg': { //样件出库
		url: '/pages/tab-sample/sampleExchange.html',
		id: 'sampleXchg',
	},
	'sampleRej': { //样件退样
		url: '/pages/tab-sample/sampleReject/sampleReject.html',
		id: 'sampleRej',
	},
	// 原始记录录入
	'record': {
		url: '/pages/record/record/record.html',
		id: 'record'
	},
	// 原始记录录入
	'view': {
		url: '/pages/record/view/view.html',
		id: 'view'
	},
	// 原始记录录入
	'recordList': {
		url: '/pages/record/list.html',
		id: 'recordList'
	}
};
