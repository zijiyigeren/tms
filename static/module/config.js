/*
 * File   : config.js
 * Created: Thursday August 30th 2018 11:34:38 am
 * Author : yuchunyu97
 * License: MIT License
 * 
 * Copyright (c) 2018 yuchunyu97
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * -----
 * Last Modified: Friday November 2nd 2018 2:38:47 pm
 * Modified By  : yuchunyu97 at <yuchunyu97@gmail.com>
 * -----
 * Description: 配置文件
 * -----
 * HISTORY:
 * 2018-08-30	yuchunyu97	完成基本配置，以及对用户信息的保存、获取与清除
 */

layui.define(function (exports) {

    var config = {
        // 后台地址 http://221.239.111.146:50028/swagger-ui.html
        // 旧版前端 http://221.239.111.146:50028/html/index.html
        base_server: '', // 接口地址，实际项目请换成http形式的地址，空表示当前地址
        tableName: 'ADCDA', // 存储表名
        autoRender: false, // 窗口大小改变后是否自动重新渲染表格，解决layui数据表格非响应式的问题，目前实现的还不是很好，暂时关闭该功能

        // 顶部信息滚动条
        ADCScrollNotice: false,
        ADCScrollNoticeSpeed: 5,
        ADCScrollNoticeString: 'ADC业务流程管理系统二期工程完成，可实现自定义表单（包括单行输入框、多行输入框、下拉菜单、单选框、复选框、文件上传、日期时间选择、人员选择、组织机构选择）以及流程处理（包括：发起流程、待办事项、已办事项、已发事项、受理组任务）等功能',

        // 自动获取数据的时间，毫秒
        ADCPullTime: 1000 * 60 * 30,

        /**
         * 保存登录信息
         *
         * @param {*} account
         */
        putAccount: function (account) {
            layui.data(config.tableName, {
                key: 'account',
                value: JSON.stringify(account)
            });
        },
        /**
         * 获取登录信息
         *
         * @returns
         */
        getAccount: function () {
            var t = layui.data(config.tableName).account;
            if (t) {
                return JSON.parse(t);
            } else {
                // 如果登录信息为空，且当前页面不是登录页
                 if (window.location.pathname.indexOf('/login.html')< 0  ) {
                    config.removeAccount();
                    location.replace('./login.html?redirect_to=' + window.location.hash);
                }
                return false;
            }
        },
        /**
         * 清除登录信息
         *
         */
        removeAccount: function () {
            layui.data(config.tableName, {
                key: 'account',
                remove: true
            });
        },
        // 导航菜单，最多支持三级，因为还有判断权限，所以渲染左侧菜单很复杂，无法做到递归，你需要更多极请联系我添加，添加可以无限添加，只是无法做到递归
        menus: []

    };
    exports('config', config);
});