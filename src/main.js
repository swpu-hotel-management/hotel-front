// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

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
