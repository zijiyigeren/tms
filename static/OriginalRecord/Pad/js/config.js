var Config = {

	// 统一管理接口url
	urls: {
		//样件管理，首页扫码，确认到达试验室
		component_goFetchComponentPartPlace: '/component/goFetchComponentPartPlace',

		//样件详情的接口
		component_findComponentParts: '/component/findComponentParts', //主页样件查询列表
		component_findComponentPart: '/component/findComponentPart',
		component_findComponentPartFlow: '/component/findComponentPartFlow',
		component_findUsableTime: '/component/findUsableTime', //获取可预约时间
		component_saveComponentOutDetail: '/component/saveComponentOutDetail', //预约保存

		//样件登记用到的接口
		component_initComponentPart: '/component/initComponentPart',
		component_findComponentCode: '/component/findComponentCode', //根据样品数量生成批次号
		component_saveComponentPart: '/component/saveComponentPart', //样件登记

		//出库接口
		component_findPreparedComponentPart: '/component/findPreparedComponentPart', //出库列表
		component_findOrderInfo: '/component/findOrderInfo', //出库详情
		component_findOrderedComponentPartPlace: '/component/findOrderedComponentPartPlace', //备件条码列表
		component_goBackStore: '/component/goBackStore', //退库接口，未完成

		//预约列表接口
		component_findComponentOutDetails: '/component/findComponentOutDetails',
		component_findOrderInfo: '/component/findOrderInfo', //预约详情
		component_bindBarCodeToComponentOutDetail: '/component/bindBarCodeToComponentOutDetail', //预约详情扫码绑定

		//样件流转的接口
		component_findComponentPartPlaceCirculation: '/component/findComponentPartPlaceCirculation', //列表
		component_goApplyReturnStore: '/component/goApplyReturnStore', //申请还样
		component_goConfirmReturnStore: '/component/goConfirmReturnStore', //确认还样
		component_goReturnStore: '/component/goReturnStore', //扫码还样入库

		//退样列表接口
		component_findComponentPartBacks: '/component/findComponentPartBacks', //列表
		component_initComponentPartBack: '/component/initComponentPartBack', //退样初始化接口
		component_saveComponentPartBack: '/component/saveComponentPartBack', //退样保存
		component_cancleComponentPartBack: '/component/cancleComponentPartBack', //get, 取消退样

		//样车管理模块
		carload_findCarloads: '/carload/findCarloads', //整车列表查询接口
		carload_findCarload: '/carload/findCarload',
		carload_findCarloadFlow: '/carload/findCarloadFlow',
		carload_initCarloadInfo: '/carload/initCarloadInfo', //初始化整车页面编辑信息
		carload_findPlaceBase: '/carload/findPlaceBase', //查询整车库房信息
		carload_findPlace: '/carload/findPlace', //查询车位信息
		carload_saveCarload: '/carload/saveCarload', //保存样车信息
		carload_initCarloadBack: '/carload/initCarloadBack',
		carload_ifCarloadBack: '/carload/ifCarloadBack',
		carload_saveCarloadBack: '/carload/saveCarloadBack',
		carload_findBookCarInfo: '/carload/findBookCarInfo', //查询某个样车所有可用的查询时间
		carload_saveBookCar: '/carload/saveBookCar', //保存样车预约信息
		carload_findCurrentCarLoadFlow: '/carload/findCurrentCarLoadFlow', //查找样车最新的流转信息
		carload_saveCarLoadFlow: '/carload/saveCarLoadFlow', //保存流转信息
		carload_cancelCarloadBack: '/carload/cancelCarloadBack', //取消样车退样
		carload_findCarloadBack: '/carload/findCarloadBack', //查询样车退样列表
		carload_findCurrentCarLoadFlowVIN: '/carload/findCurrentCarLoadFlowVIN', //查找样车最新的流转信息VIN


		//任务管理模块
		job_findTodoJob: '/job/findTodoJob',
		job_findJob: '/job/findJob',
		job_findTaskContents: '/job/findTaskContents',
		job_findWordPath: '/job/findWordPath',
		job_downloadFile: '/job/downloadFile',
		job_toTop: '/job/toTop',
		job_signTaskContent: '/job/signTaskContent',
		job_checkVideo: '/job/checkVideo',
		job_cancelSignTaskContent: '/job/cancelSignTaskContent',
		job_saveVideoInfo: '/job/saveVideoInfo',
		job_findTaskContentsTodo: '/job/findTaskContentsTodo',
		job_goNextTaskContent: '/job/goNextTaskContent',
		job_goBackTaskContent: '/job/goBackTaskContent',
		job_refreshTodoJobNumber: '/job/refreshTodoJobNumber',
		message_findMessages: '/message/findMessages',
		message_findMessage: '/message/findMessage',
		message_updateMessage: '/message/updateMessage',
	},
	status: {
		"1": "待检未上架",
		"2": "待检区上架",
		"3": "检验中",
		"4": "检毕还样",
		"5": "检毕区上架",
		"6": "退"
	}
}
