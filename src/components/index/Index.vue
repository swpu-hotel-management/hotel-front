<script >
export default {
  data() {
    return {
      username:'',
      imgUrl:''
    }

  },
  methods: {
    getUserInfo() {
      //从缓存中获取userId封装
      var params={};
      params.userId = sessionStorage.getItem('userId');
      //发送请求获取菜单列表
      //get格式‘url’{params:参数对象}
      this.$axios.get('/emp/info',{params:params})
        .then(result=>{
          var data=result.data
          if(data.code==200){
            this.username=data.data.username
            this.imgUrl=data.data.imgUrl
          }
       })

    .catch(e=>{console.log(e)})
    },
    logout(){
      this.$confirm('是否退出系统','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        //退出系统清楚缓存
        sessionStorage.clear();
        //跳转页面
        this.$router.push('/')
      })
      .catch(()=>{
        this.$message.info('取消退出')
      })
    }

    },
  mounted(){


    this.getUserInfo()

  }
}







</script>

<template>
  <div class="index-container">
  <el-container >
    <el-aside width="200px">
      <div style="width: 200px; height: 100px">
        <img src="../../assets/logo.png" style="width: 50px;height: 50px"/>

      </div>
      <!--    default-active="2"默认激活那个菜单
text-color字体颜色
active-text-color被激活的菜单字体颜色
router是否使用vue-router的模式，使用该模式会在激活导航时以index作为path进行路由跳转-->
      <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#345c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router>
      <el-submenu index="/sys" >
        <template slot="title">
          <i class="el-icon-location"></i>
<!--          {{}}在文本区域插入变量-->
          <span>员工管理</span>
        </template>
        <el-menu-item-group >
          <el-menu-item index="/sys/empList" >员工列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
        <el-submenu index="/sys" >
          <template slot="title">
            <i class="el-icon-location"></i>
            <!--          {{}}在文本区域插入变量-->
            <span>房间管理</span>
          </template>
          <el-menu-item-group >
            <el-menu-item index="/sys/roomList" >房间列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="/sys" >
          <template slot="title">
            <i class="el-icon-location"></i>
            <!--          {{}}在文本区域插入变量-->
            <span>入住管理</span>
          </template>
          <el-menu-item-group >
            <el-menu-item index="/sys/check_in" >入住列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="/sys" >
          <template slot="title">
            <i class="el-icon-location"></i>
            <!--          {{}}在文本区域插入变量-->
            <span>订单管理</span>
          </template>
          <el-menu-item-group >
            <el-menu-item index="/sys/orderList" >订单列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
    </el-menu>
    </el-aside>


    <el-container>
      <el-header>
        <div>
          <span>酒店管理系统</span>
        </div>
        <div>
          <el-menu default-active="1" class="el-menu-demo" mode="horizontal" background-color="#B3C0D1" text-color="#4a90e2">
            <el-submenu index="1">
              <template slot="title" >{{username }}
                <img :src="imgUrl" style="width: 30px;height: 30px;border-radius: 50%;margin-right: 10px">
              </template>


              <el-menu-item index="1-1" @click="logout">退出登录</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </el-header >
      <el-main class="ui">
<!--        路由视图组件，用于动态渲染对应的路由组件 -->
        <router-view>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
  </div>
</template>

<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-aside {
  background-color: #345c64;
  color: #333;
  text-align: center;
  line-height: 200px;
}



.el-container {

  height: 100vh;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-menu{
  border-right: 0px;
}

.ui{
  background-image: url(../../assets/img.png);
  background-size: 100% 100%;
}

</style>
