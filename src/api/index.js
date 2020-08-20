/**
 * api接口的统一出口
 */
import login from '@/api/login/login'
/*
* 看板页展示模块_接口
* */
import systemPublicationpage from '@/api/system/systemPublicationpage'
/*我的报告 */
import myReport from '@/api/myReport/myReport'

/* 检验报告 */
import lxtinitial from '@/api/surve/surveyverify'
/**系统管理 */
import role from '@/api/system/role'
import menu from '@/api/system/menu'
import roughly from '@/api/system/roughly'
import cachetallot from '@/api/system/cachetallot'
import draft from '@/api/system/draft'
import systemProject from '@/api/system/systemProject'
import systemdepartmentrinquire from '@/api/system/systemdepartmentrinquire'
import systemuserinquire from '@/api/system/systemuserinquire'
import systemgenre from '@/api/system/systemgenre'
import systemparams from '@/api/system/systemparams'
import systemcachetimg from '@/api/system/systemcachetimg'
import surveyissue from '@/api/survey/surveyissue'
import pigeohole from '@/api/pigeohole/pigeohole'

import datadic from '@/api/system/datadic' // 数据字典
import tempaxios from '@/api/temp/tempaxios' // 模板接口
import storageroom from '@/api/sample/storageroom' // 零部件库房接口
import carpark from '@/api/sample/carpark' // 整车停车场接口
import batchplt from '@/api/sample/batchplt' // 批量打印接口
import spareparts from '@/api/sample/spareparts' // 零部件列表接口
import vehicle from '@/api/sample/vehicle' // 整车列表接口
import taskmanage from '@/api/task/taskmanage' // 任务管理
import codebuildrule from '@/api/system/codebuildrule' // 编码生成规则
import newsnotice from '@/api/login/newsnotice' // 消息通知
import entrustamend from '@/api/entrust/entrustamend'//修改单

import notice from '@/api/program/notice' // 新产品公告
import tatistical from '@/api/program/tatistical' // 统计表
import download from '@/api/program/download' // 统计表下载
import correction from '@/api/program/correction' // 统计表编号纠错
import programload from '@/api/program/programload' // 离线2.0加载
import instrumentunit from '@/api/instrument/instrumentunit' // 仪器设备查询
import flowcheng from '@/api/flowcheng/flowcheng' // 流程管理
import paramsConfig from '@/api/paramsConfig/paramsConfig' // 系统参数配置

// 任务受理(任务下达)
import mly from '@/api/taskdelegation/componentstask/acceptance'
//任务分配
import allot from '@/api/task/allot'
import entrust from '@/api/entrust/entrust'
// 财务
import financial from '@/api/financial/financialinterface'

/* 2020.06.16 */
// 设备管理
import eqManage from '@/api/equipment/eqManage.js'
/* 2020.06.22 */
// 待检设备
import stayCheck from '@/api/equipment/stayCheck.js'
/* 2020.06.24 */
import eqChecking from '@/api/equipment/eqChecking.js'
/* 2020.06.28 */
import VerificationResults from '@/api/equipment/VerificationResults.js'
import eqMaintenance from '@/api/equipment/eqMaintenance.js'
/* 2020.06.15 */
// 实验数据管理
import judgeInfo from '@/api/templateManage/judge_info.js'
/* 2020.06.16 */
import paramRule from '@/api/templateManage/param_rule.js'
import templateRule from '@/api/templateManage/template_rule.js'
import subtemplateRule from '@/api/templateManage/subtemplate_rule.js'
/* 2020.07.01 */
import templateMgmt from '@/api/templateManage/template_mgmt.js'
/* 2020.07.03 */
import paramSubRule from '@/api/templateManage/param_sub_rule.js'
/* 2020.07.06 */
import sendDownload from '@/api/archiveManagement/sendDownload.js'
/* 2020.07.14 */
// 源数据管理
import SourceDataManagement from '@/api/SourceDataManagement/index.js'


import exportlist from '@/api/exportlist/exportlist.js' // 导出列表

// 导出接口
export default {
    login,
    systemPublicationpage,
    myReport,
    lxtinitial,
    role,
    menu,
    roughly,
    cachetallot,
    draft,
    systemProject,
    systemdepartmentrinquire,
    systemuserinquire,
    systemgenre,
    systemparams,
    systemcachetimg,
    pigeohole,
    surveyissue,

    datadic, // 数据字典
    tempaxios, // 模板接口
    storageroom, // 零部件库房接口
    carpark, // 整车停车场接口
    batchplt, // 批量打印接口
    spareparts, // 零部件列表接口
    vehicle, // 整车列表接口
    taskmanage, // 任务管理
    codebuildrule, // 编码生成规则
    newsnotice, // 消息通知

    /* 天津摩托 */
    mly,// 任务受理(任务下达)
    allot,// 任务分配
    entrust,
    entrustamend,

    notice, // 新产品公告
    tatistical, // 统计表
    download, // 统计表下载
    correction, // 统计表编号纠错
    programload, // 离线2.0加载
    instrumentunit, // 仪器设备查询
    flowcheng, // 流程管理
    paramsConfig, // 系统参数配置
    financial,// 财务

    /* 2020.06.16 */
    eqManage,// 设备管理
    /* 2020.06.22 */
    stayCheck,// 待检设备
    /* 2020.06.24 */
    eqChecking,// 在检(中)设备
    /* 2020.06.28 */
    VerificationResults,
    eqMaintenance,
    /* 2020.06.15 */
    judgeInfo,
    /* 2020.06.16 */
    paramRule,
    templateRule,
    subtemplateRule,
    /* 2020.07.01 */
    templateMgmt,
    /* 2020.07.03 */
    paramSubRule,
    /* 2020.07.06 */
    sendDownload,
    /* 2020.07.14 */
    SourceDataManagement,
    exportlist, // 导出列表
}
