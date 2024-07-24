// The Vue build version to load with the `import` command
//(runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 浏览器同源策略:
//   前端和后台的域名要完全一致
// 域名组成.网绕热议(http)、.ip地址类总号
// 也就是说,前端和后台域名的网统协议(http)ip地址，总号都要保持一致
// 不一致就会导致跨域问题
// 前端域名:http://localhost:8080
//   后台域名:httn://localhost:8088
// 用过滤器解决
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
//配置全局后台服务域名，作用在：全局使用axios时，不需要每次都写域名，axios会自动根据配置的url进行拼接。
axios.defaults.baseURL = 'http://localhost:8088'
//请求拦截器
axios.interceptors.request.use(config => {
  // 请求头设置为json

    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    // 请求头添加token
  if(sessionStorage.getItem('token')){
    config.headers['Authorization'] = sessionStorage.getItem('token')
  }
    return config;

}, error => Promise.reject())
//定义全局axios变量，变量名$axios
Vue.prototype.$axios = axios


Vue.config.productionTip = false

Vue.use(ElementUi)

/* eslint-disable no-new */
new Vue({
  // 绑定divdid值app，vued文件的id属性名，作用：vue对象作用zaihtml的标签范围。
  el: '#app',
  //绑定router/index.js的内容做页面路由跳转，根据路由中的path路径绑定不同的vue文件
  router,
  //绑定组件默认App.vue文件，作用：引入App.vue文件
  components: { App },
  template: '<App/>'
})
