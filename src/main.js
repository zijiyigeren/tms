// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import api from './api'
import $ from 'jquery'
import store from './store/index.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'babel-polyfill'
import AntDesign from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import moment from 'moment'
import VueBarcode from '@xkeshi/vue-barcode'; //导入条形码插件
Vue.component('barcode', VueBarcode);  //声明条形码组件
// import entrustList from '@/views/entrust/componentsview/Entrustlist.vue'
// Vue.component('entrustList', entrustList);
Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.use(AntDesign);
Vue.use(ElementUI);
Vue.prototype.$moment = moment;
/*
* 事件总线
* */
Vue.prototype.$EventBus = new Vue();
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  $,
  components: { App },
  template: '<App/>'
})
