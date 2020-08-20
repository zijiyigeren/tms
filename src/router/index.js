import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Laylout from '@/laylout/Laylout'
import Home from '@/views/system/componentsview/publicationmodel/publicationpage.vue'

Vue.use(Router)
let routers = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      hidden: true,
      component: Login,
      meta: {
        title: '登录'
      }
    },
    //
    {
      // 首页
      path: '/home',
      name: 'home',
      component: Laylout,
      meta: {
        title: '首页'
      },
      redirect: {
        path: '/home'
        // path: '/system/publicationpage'
      },
      children: [{
        path: '/home',
        component: Home,
        meta: {
          title: '首页'
        }
      }]
    },
    //
    {
      // 消息通知
      path: '/newsnotice',
      name: 'newsnotice',
      component: Laylout,
      meta: {
        title: '消息通知'
      },
      redirect: {
        path: '/newsnotice'
      },
      children: [{
        path: '/newsnotice',
        name: 'newsnotice',
        component: () => import('@/views/newsnotice/newsnotice.vue'),
        meta: {
          title: '消息通知'
        }
      }]
    },

    {
      // 我的报告
      path: '/report',
      name: 'report',
      meta: {
        title: '我的报告'
      },
      component: Laylout,
      redirect: {
        path: '/report'
      },
      children: [{
        path: '/report',
        name: 'report',
        component: () => import('@/views/report/Report.vue'),
        meta: {
          title: '我的报告'
        }
      }],
    },

    {
      // 检验委托
      path: '/task',
      name: 'task',
      meta: {
        title: '检验委托'
      },
      component: () => import('@/laylout/Laylout.vue'),
      children: [
        {
          // 任务草稿
          path: '/task/draft',
          name: 'draft',
          meta: {
            title: '任务草稿'
          },
          component: () => import('@/views/taskdelegation/componentstask/draft.vue')
        },
        {
          // 任务受理
          path: '/task/acceptance',
          name: 'acceptance',
          meta: {
            title: '任务受理'
          },
          component: () => import('@/views/taskdelegation/componentstask/acceptance.vue')
        },
        {
          // 修改单
          path: '/task/modification',
          name: 'modification',
          meta: {
            title: '修改单'
          },
          component: () => import('@/views/entrust/componentsview/Entrustamend.vue')
        },
      ]
    },

    {
      // 检验报告
      path: '/surveyreport',
      name: 'surveyreport',
      meta: {
        title: '检验报告'
      },
      component: () => import('@/laylout/Laylout.vue'),
      children: [
        {
          // 问题报告
          path: '/surveyreport/issue',
          name: 'surveyissue',
          meta: {
            title: '问题报告'
          },
          component: () => import('@/views/survey/componentsview/Surveyissue.vue')
        },
        {
          // 报告编辑
          path: '/surveyreport/redact',
          name: 'surveyredact',
          meta: {
            title: '报告编辑'
          },
          component: () => import('@/views/survey/componentsview/Surveyredact/Surveyredact.vue')
        },
        {
          // 报告编辑二次分配
          path: '/allocation/allocationtow',
          name: 'allocationtow',
          meta: {
            title: '报告编辑二次分配'
          },
          component: () => import('@/views/survey/componentsview/allocation/allocation.vue')
        },
        {
          // 报告校核
          path: '/surveyreport/parity',
          name: 'surveyparity',
          meta: {
            title: '报告校核'
          },
          component: () => import('@/views/survey/componentsview/parity/Surveyparity.vue')
        },
        {
          // 报告审核
          path: '/surveyreport/audit',
          name: 'surveyaudit',
          meta: {
            title: '报告审核'
          },
          component: () => import('@/views/survey/componentsview/Surveyaudit/Surveyaudit.vue')
        },
        {
          // 报告批准
          path: '/surveyreport/ratify',
          name: 'surveyratify',
          meta: {
            title: '报告批准'
          },
          component: () => import('@/views/survey/componentsview/Surveyratify/Surveyratify.vue')
        },
        {
          // 报告归档
          path: '/report/pigeonhole',
          name: 'pigeonhole',
          meta: {
            title: '报告归档'
          },
          component: () => import('@/views/pigeonhole/pigeonhole.vue')
        },
      ]
    },

    {
      // 检验任务
      path: '/inspectiontask',
      name: 'inspectiontask',
      meta: {
        title: '检验任务'
      },
      component: () => import('@/laylout/Laylout.vue'),
      children: [
        {
          // 任务管理
          path: '/task/manage',
          name: 'taskmanage',
          meta: {
            title: '任务管理'
          },
          component: () => import('@/views/task/componentsview/Taskmanage.vue')
        },
        {
          // 任务审核
          path: '/inspectiontask/audit',
          name: 'audit',
          meta: {
            title: '任务审核'
          },
          component: () => import('@/views/taskinspection/componentstask/audit.vue')
        },
        {
          // 任务分配
          path: '/inspectiontask/allocation',
          name: 'allocation',
          meta: {
            title: '任务分配'
          },
          component: () => import('@/views/taskinspection/componentstask/allocation.vue')
        },
        {
          // 二次分配
          path: '/inspectiontask/distribution',
          name: 'distribution',
          meta: {
            title: '二次分配'
          },
          component: () => import('@/views/taskinspection/componentstask/distribution.vue')
        },
        {
          // 再次分配
          path: '/inspectiontask/redistribution',
          name: 'redistribution',
          meta: {
            title: '再次分配'
          },
          component: () => import('@/views/taskinspection/componentstask/redistribution.vue')
        },
        {
          // 原始记录上传
          path: '/inspectiontask/originalrecord',
          name: 'originalrecord',
          meta: {
            title: '原始记录上传'
          },
          component: () => import('@/views/taskinspection/componentstask/originalrecord.vue')
        },
        {
          // 原始记录审核
          path: '/inspectiontask/revieworiginal',
          name: 'revieworiginal',
          meta: {
            title: '原始记录审核'
          },
          component: () => import('@/views/taskinspection/componentstask/revieworiginal.vue')
        },
      ]
    },

    {
      // 系统管理
      path: '/system',
      name: 'system',
      meta: {
        title: '系统管理'
      },
      component: () => import('@/laylout/Laylout.vue'),
      children: [
        {
          // 组织机构管理
          path: '/system/organization',
          name: 'systemation',
          meta: {
            title: '组织机构管理'
          },
          component: () => import('@/views/system/componentsview/Systemation.vue')
        },
        {
          // 系统角色管理
          path: '/system/role',
          name: 'systemrole',
          meta: {
            title: '系统角色管理'
          },
          component: () => import('@/views/system/componentsview/Systemrole.vue')
        },
        {
          // 系统用户管理
          path: '/system/user',
          name: 'systemuser',
          meta: {
            title: '系统用户管理'
          },
          component: () => import('@/views/system/componentsview/Systemuser.vue')
        },
        {
          // 系统菜单管理
          path: '/system/menu',
          name: 'systemmenu',
          meta: {
            title: '系统菜单管理'
          },
          component: () => import('@/views/system/componentsview/Systemmenu.vue')
        },
        {
          // 检验项目管理
          path: '/system/project',
          name: 'systemproject',
          meta: {
            title: '检验项目管理'
          },
          component: () => import('@/views/system/componentsview/Systemproject.vue')
        },
        {
          // 检验类型管理
          path: '/system/genre',
          name: 'systemgenre',
          meta: {
            title: '检验类型管理'
          },
          component: () => import('@/views/system/componentsview/Systemgenre.vue')
        },
        {
          // 检验参数管理
          path: '/system/params',
          name: 'systemparams',
          meta: {
            title: '检验参数管理'
          },
          component: () => import('@/views/system/componentsview/Systemparams.vue')
        },
        {
          // 编码生成规则
          path: '/system/codebuildrule',
          name: 'codebuildrule',
          meta: {
            title: '编码生成规则'
          },
          component: () => import('@/views/system/componentsview/codebuildrule.vue')
        },
        {
          // 数据字典
          path: '/system/datadictionary',
          name: 'datadictionary',
          meta: {
            title: '数据字典'
          },
          component: () => import('@/views/dictionary/datadic.vue')
        },
        {
          // 企业名录
          path: '/system/enterprise',
          name: 'enterprise',
          meta: {
            title: '企业名录'
          },
          component: () => import('@/components/PublicTools/enterprise/index.vue')
        },
        {
          // 号段管理
          path: '/system/roughly',
          name: 'systemroughly',
          meta: {
            title: '号段管理'
          },
          component: () => import('@/views/system/componentsview/Systemroughly.vue')
        },
        {
          // 日志管理
          path: '/system/logmanagement',
          name: 'systemlogmanagement',
          meta: {
            title: '日志管理'
          },
          component: () => import('@/views/system/componentsview/Systemlogmanagement.vue')
        },
        {
          // 公章图片
          path: '/system/cachetimg',
          name: 'systemcachetimg',
          meta: {
            title: '公章图片'
          },
          component: () => import('@/views/system/componentsview/Systemcachetimg.vue')
        },
        {
          // 公章类型
          path: '/system/cachetallot',
          name: 'systemcachetallot',
          meta: {
            title: '公章类型'
          },
          component: () => import('@/views/system/componentsview/Systemcachetallot.vue')
        },
        {
          // 零部件库房
          path: '/system/storageroom',
          name: 'storageroom',
          meta: {
            title: '零部件库房'
          },
          component: () => import('@/views/sample/componentsview/storageroom.vue')
        },
        {
          // 整车停车场
          path: '/system/carpark',
          name: 'carpark',
          meta: {
            title: '整车停车场'
          },
          component: () => import('@/views/sample/componentsview/carpark.vue')
        },
        {
          // 批量打印
          path: '/system/batchplt',
          name: 'batchplt',
          meta: {
            title: '批量打印'
          },
          component: () => import('@/views/sample/componentsview/batchplt.vue')
        },
        {
          // 参数配置
          path: '/system/paramsconfig',
          name: 'paramsconfig',
          meta: {
            title: '参数配置'
          },
          component: () => import('@/views/system/componentsview/paramsConfig.vue')
        },
        /* 开发自定义表单路由模块 */
        {
          path: '/system/form',
          name: 'formuiss',
          meta: {
            title: '自定义表单'
          },
          component: () => import('@/views/richtext/customize.vue'),
        },
        {
          path: '/system/origin',
          name: 'origin',
          meta: {
            title: '原始记录模板管理'
          },
          component: () => import('@/views/system/componentsview/originalrecord.vue'),
        },
        {
          path: '/exportlist',
          name: 'exportlist',
          meta: {
            title: '自定义导出'
          },
          component: () => import('@/views/exportList/exportList.vue'),
        },

      ]
    },

    {
      // 样品管理
      path: '/sample',
      name: 'sample',
      meta: {
        title: '样品管理'
      },
      component: () => import('@/laylout/Laylout.vue'),
      children: [
        {
          // 整车列表
          path: '/sample/vehicle',
          name: 'vehicle',
          meta: {
            title: '整车列表'
          },
          component: () => import('@/views/sample/componentsview/vehicle.vue')
        },
        {
          // 整车退样列表
          path: '/sample/carretreat',
          name: 'carretreat',
          meta: {
            title: '整车退样列表'
          },
          component: () => import('@/views/sample/componentsview/allCarRetreat.vue')
        },
        {
          // 零部件列表
          path: '/sample/spareparts',
          name: 'spareparts',
          meta: {
            title: '零部件列表'
          },
          component: () => import('@/views/sample/componentsview/spareparts.vue')
        },
        {
          // 零部件退样列表
          path: '/sample/partsretreat',
          name: 'partsretreat',
          meta: {
            title: '零部件退样列表'
          },
          component: () => import('@/views/sample/componentsview/partsRetreat.vue')
        },
      ]
    },

    {
      // 流程管理
      path: '/flowcheng',
      name: 'flowcheng',
      meta: {
        title: '流程管理'
      },
      component: () => import('@/laylout/Laylout.vue'),
      children: [
        {
          // 流程定义
          path: '/flowcheng/startup',
          name: 'startup',
          meta: {
            title: '流程定义'
          },
          component: () => import('@/views/flowcheng/componentsview/startup.vue')
        },
        {
          // 待办事项
          path: '/flowcheng/stay',
          name: 'stay',
          meta: {
            title: '待办事项'
          },
          component: () => import('@/views/flowcheng/componentsview/stay.vue')
        },
        {
          // 已办事项
          path: '/flowcheng/alreadydo',
          name: 'alreadydo',
          meta: {
            title: '已办事项'
          },
          component: () => import('@/views/flowcheng/componentsview/alreadydo.vue')
        },
        {
          // 已发事项
          path: '/flowcheng/alreadyhair',
          name: 'alreadyhair',
          meta: {
            title: '已发事项'
          },
          component: () => import('@/views/flowcheng/componentsview/alreadyhair.vue')
        },
        {
          // 受理组任务
          path: '/flowcheng/suffergroup',
          name: 'suffergroup',
          meta: {
            title: '受理组任务'
          },
          component: () => import('@/views/flowcheng/componentsview/suffergroup.vue')
        },
      ]
    },
    //
    {
      // 中机方案
      path: '/programme',
      name: 'programme',
      meta: {
        title: '中机方案'
      },
      component: () => import('@/laylout/Laylout.vue'),
      children: [
        // {
        //   // 实时产值查询
        //   path: '/programme/realtimeoutput',
        //   name: 'realtimeoutput',
        //   meta: {
        //     title: '实时产值查询'
        //   },
        //   component: () => import('@/views/programme/realtimeoutput/realtimeoutput.vue')
        // },
        {
          // 新产品公告
          path: '/programme/notice',
          name: 'notice',
          meta: {
            title: '新产品公告'
          },
          component: () => import('@/views/programme/notice.vue')
        },
        {
          // 新产品公告历史
          path: '/programme/noticehistory',
          name: 'noticehistory',
          meta: {
            title: '新产品公告历史'
          },
          component: () => import('@/views/programme/noticehistory.vue')
        },
        // {
        //   // 报告上传历史
        //   path: '/programme/upload',
        //   name: 'upload',
        //   meta: {
        //     title: '报告上传历史'
        //   },
        //   component: () => import('@/views/programme/upload.vue')
        // },
        {
          // 统计表
          path: '/programme/tatistical',
          name: 'tatistical',
          meta: {
            title: '统计表'
          },
          component: () => import('@/views/programme/tatistical.vue')
        },
        {
          // 统计表下载
          path: '/programme/download',
          name: 'download',
          meta: {
            title: '统计表下载'
          },
          component: () => import('@/views/programme/download.vue')
        },
        {
          // 统计表编号纠错
          path: '/programme/correction',
          name: 'correction',
          meta: {
            title: '统计表编号纠错'
          },
          component: () => import('@/views/programme/correction.vue')
        },
        {
          // 离线2.0加载
          path: '/programme/load',
          name: 'load',
          meta: {
            title: '离线2.0加载'
          },
          component: () => import('@/views/programme/load.vue')

        },
        {
          // 仪器设备查询
          path: '/instrument/unit',
          name: 'unit',
          meta: {
            title: '仪器设备查询'
          },
          component: () => import('@/views/instrument/componentsview/Instrumentunit.vue')
        },
      ]
    },
    //
    {
      // 财务管理
      path: '/finance',
      name: 'finance',
      meta: {
        title: '财务管理'
      },
      component: () => import('@/laylout/Laylout.vue'),
      children: [
        {
          //费用库管理
          path: '/finance/costbase',
          name: 'costbase',
          meta: {
            title: '费用库管理'
          },
          component: () => import('@/views/finance/costbase.vue')
        },
        {
          //费用确认列表
          path: '/finance/confirmation',
          name: 'confirmation',
          meta: {
            title: '费用确认列表'
          },
          component: () => import('@/views/finance/confirmation.vue')
        },
        {
          //催款单
          path: '/finance/collection',
          name: 'collection',
          meta: {
            title: '催款单'
          },
          component: () => import('@/views/finance/collection.vue')
        },
        {
          //发票管理
          path: '/finance/invoices',
          name: 'invoices',
          meta: {
            title: '发票管理'
          },
          component: () => import('@/views/finance/invoices.vue')
        },
        {
          //费用查询
          path: '/finance/feeinquiry',
          name: 'feeinquiry',
          meta: {
            title: '费用查询'
          },
          component: () => import('@/views/finance/feeinquiry.vue')
        }
      ]
    },
    // 设备管理
    {
      path: '/equipment',
      name: 'equipment',
      meta: {
        title: '设备'
      },
      component: () => import('@/laylout/Laylout.vue'),
      children: [
        /* ************* 设备 ************* */
        // 设备管理
        {
          path: '/eqManage',
          name: 'eqmanage',
          meta: {
            title: '设备管理'
          },
          component: () => import('@/views/equipment/componentsview/eqManage.vue'),
        },
        // 待检设备
        {
          path: '/stayCheck',
          name: 'staycheck',
          meta: {
            title: '待检设备'
          },
          component: () => import('@/views/equipment/componentsview/stayCheck.vue'),
        },
        // 检定(中)设备
        {
          path: '/eqChecking',
          name: 'eqchecking',
          meta: {
            title: '检定设备'
          },
          component: () => import('@/views/equipment/componentsview/eqChecking.vue'),
        },
        // 检定结果科室确认
        {
          path: '/VerificationResults',
          name: 'verificationresults',
          meta: {
            title: '检定结果科室确认'
          },
          component: () => import('@/views/equipment/componentsview/VerificationResults.vue'),
        },
        // 设备保养
        {
          path: '/eqMaintenance',
          name: 'eqmaintenance',
          meta: {
            title: '设备保养'
          },
          component: () => import('@/views/equipment/componentsview/eqMaintenance.vue'),
        },
      ]
    },
    // 模板(实验数据管理)
    {
      path: '/templMain',
      name: 'templmain',
      meta: {
        title: '模板'
      },
      component: () => import('@/laylout/Laylout.vue'),
      children: [
        {
          path: '/templateRule',
          name: 'templaterule',
          hidden: true,
          component: () => import('@/views/templateManage/template_rule.vue'),
          meta: {
            title: '模板生成规则'
          }
        },
        {
          path: '/subTemplateRule',
          name: 'subtemplaterule',
          hidden: true,
          component: () => import('@/views/templateManage/subtemplate_rule.vue'),
          meta: {
            title: '子模板生成规则'
          }
        },
        {
          path: '/templateMgmt',
          name: 'templatemgmt',
          hidden: true,
          component: () => import('@/views/templateManage/template_mgmt.vue'),
          meta: {
            title: '模板管理'
          }
        },
        {
          path: '/paramSubRule',
          name: 'paramsubrule',
          hidden: true,
          component: () => import('@/views/templateManage/param_sub_rule.vue'),
          meta: {
            title: '单数据填写规则'
          }
        },
        {
          path: '/paramRule',
          name: 'paramrule',
          hidden: true,
          component: () => import('@/views/templateManage/param_rule.vue'),
          meta: {
            title: '模板数据填写规则'
          }
        },
        {
          path: '/judgeInfo',
          name: 'judgeinfo',
          hidden: true,
          component: () => import('@/views/templateManage/judge_info.vue'),
          meta: {
            title: '判别信息'
          }
        },
      ]
    },
    // 归档管理
    {
      path: '/archiveManagement',
      name: 'archiveManagement',
      meta: {
        title: '借阅'
      },
      component: () => import('@/laylout/Laylout.vue'),
      children: [
        {
          path: '/BorrowingManagement',
          name: 'borrowingmanagement',
          hidden: true,
          component: () => import('@/views/archiveManagement/BorrowingManagement.vue'),
          meta: {
            title: '借阅管理'
          }
        },
        {
          path: '/BorrowingApproval',
          name: 'borrowingapproval',
          hidden: true,
          component: () => import('@/views/archiveManagement/BorrowingApproval.vue'),
          meta: {
            title: '借阅审批'
          }
        },
        {
          path: '/MyBorrowing',
          name: 'myborrowing',
          hidden: true,
          component: () => import('@/views/archiveManagement/MyBorrowing.vue'),
          meta: {
            title: '我的借阅'
          }
        },
        {
          // 封面管理
          path: '/coverManage',
          name: 'covermanage',
          meta: {
            title: '封面管理'
          },
          component: () => import('@/views/archiveManagement/coverManage.vue'),
        },
        {
          // 发送下载
          path: '/sendDownload',
          name: 'senddownload',
          meta: {
            title: '发送下载'
          },
          component: () => import('@/views/archiveManagement/sendDownload.vue'),
        },
      ]
    },
    // 源数据管理
    {
      path: '/SourceData',
      name: 'source',
      meta: {
        title: ''
      },
      redirect: {
        path: '/SourceDataManagement'
      },
      component: () => import('@/laylout/Laylout.vue'),
      children: [
        {
          path: '/SourceDataManagement',
          name: 'sourcedatamanagement',
          hidden: true,
          component: () => import('@/views/SourceDataManagement/index.vue'),
          meta: {
            title: '源数据'
          }
        },
      ]
    },
    //
    {
      // excle
      path: '/spreadjs',
      name: 'spreadjs',
      meta: {
        title: 'excle'
      },
      component: () => import('@/views/equipment/componentsview/spreadjs.vue')
    },
    // 打印
    {
      path: '/print',
      name: 'print',
      meta: {
        title: '打印'
      },
      component: () => import('@/components/PublicTools/print/print.vue')
    },
    // 中机上传
    {
      path: '/zhongjiUpload',
      name: 'zhongjiUpload',
      meta: {
        title: '中机统计表 上传'
      },
      component: () => import('@/views/programme/component/public.vue')
    },
  ]
})
export default routers
