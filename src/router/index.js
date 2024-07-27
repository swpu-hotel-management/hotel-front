//初始化一个router数组，数组中添加路由对象，每一个对象都有一个path属性和一个component属性，path属性表示路由的路径，component属性表示路由对应的组件
import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import index from '@/components/index/Index'
import EmpList  from "@/components/user/EmpList.vue";
import OrderList from "@/components/user/order/OrderList.vue";
import RoomList from "@/components/user/RoomList.vue";
import Check_in from "@/components/user/Check_in.vue";
import CheckList from "@/components/user/CheckList.vue"
import Position from "@/components/user/Position.vue";
import ClientList from "@/components/user/ClientList.vue";
import orderStatis from "@/components/user/order/OrderStatis.vue"
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/sys',
      name: 'Index',
      component: index,
      // redirect: '/sys/userList',
      children:[
        //子路径的path路径不能加“/”
        {path:'empList',name:'EmpList',component:EmpList},

        {path:'orderList',name:'OrderList',component:OrderList},

        {path:'roomList',name:'RoomList',component:RoomList},

        {path:'check_in',name:'Check_in',component:Check_in},
        {path:'clientList',name:'ClientList',component:ClientList},
        {path:'checkList',name:'CheckList',component:CheckList},
        {path:'position',name:'Position',component:Position},
        {path:'orderStatis',name:'OrderStatis',component:orderStatis}
      ]
    },

  ]
})
