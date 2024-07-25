<template>
  <div class="login-container">


    <el-card class="box-card" shadow="hover">
      <h1>酒店管理系统</h1>
      <el-form>
        <el-form-item >
<!--          v-model双向绑定一般在输入框上-->
          <el-input prefix-icon="el-icon-s-custom" placeholder="请输入用户名" v-model="username"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input placeholder="请输入密码" prefix-icon="el-icon-setting" v-model:value="password" show-password ></el-input>
        </el-form-item>

        <el-form-item >
          <el-input placeholder="请输入验证码" prefix-icon="el-icon-s-platform" v-model:value="vcode" style="height:40px;width: 200px"></el-input>
          <img :src="vImgcode" @click="getVocde" style="height:40px ;vertical-align: bottom;"/>

        </el-form-item>
        <el-form-item>
<!--          v-on:触发事件简写成@click事件名称，login事件处理-->
          <el-button type="primary" icon="el-icon-right" style="width: 100%" v-on:click="login" @keyup.enter="keyDown(e)">登录</el-button>
        </el-form-item>
        <el-button type="text" @click="remember">忘记密码</el-button>
      </el-form>
    </el-card>

  </div>
</template>
<script>
export default {
  data() {
    return{
      username:'admin',
      password:'123456',
      vImgcode:'',

      vcode:''
    }
  },

  methods:{

    login(){
      //获取用户输入的用户名和密码
      //定义一个空对象
      var params ={}
      params.username = this.username;
      params.password = this.password;
      params.vcode = this.vcode;
      //将数据发送给后台服务器验证接受返回结果判断登录是否成功
      this.$axios.post('/emp/login',params)
      .then(result=>{
        var data=result.data;
        //根据返回结果跳转到不同的页面
        if(data.code == 200){
          //将后端传回的userid保存到缓存中
          sessionStorage.setItem('userId',data.data.userId);
          //将后端传回的token保存到缓存中
          sessionStorage.setItem('token',data.data.token);
          //页面跳转
          this.$message.success(data.msg)
          this.$router.push("/sys")
        }
        else {
          this.$message.warning(data.msg)
        }
      })
        .catch(e=>{
          console.log(e)
        })
    },
    keyDown(e) {
      // 回车则执行登录方法 enter键的ASCII是13
      if (e.keyCode == 13) {
        this.login();
      }
    },
    remember(){
      this.$message.warning('请联系管理员')
    },
    getVocde(){
      this.$axios.get('emp/vcode')
        .then(result=>{
          var data=result.data
          this.vImgcode=data.data;
        })
    }

  },
  mounted() {
    this.getVocde()
    // 绑定监听事件
    window.addEventListener("keydown", this.keyDown);
  },
  destroyed() {
    // 销毁事件
    window.removeEventListener("keydown", this.keyDown, false);
  },

}

</script>
<style scoped>
/* 类选择器 */
.box-card {
  width: 25vw;
  opacity: 0.9;
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
/*vh：浏览器高度的1/100
vw浏览器宽度的1/100*/
  height: 100vh;
  background-image: url('../../assets/login.jpg');
  background-size: 100% 100%;
}
h1{
  color:rgb(255, 0, 0);

  text-align: center;
}



</style>
