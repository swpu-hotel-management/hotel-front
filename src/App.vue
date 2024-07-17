<!--//项目主页面
//<template>写html标签-->
<template>
  <div id="app">
    <img src="./assets/logo.png">
<!--    //更具不同的路径动态的显示对应的vue文件-->
    <router-view/>
  </div>
</template>
<!--//写vue代码-->
<script>
export default {
  name: 'App'
}
</script>
<!--写css样式，有一个scoped属性表示css只在当前文件生效，若果不加则在全局生效-->
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
<script setup lang="ts">
</script>
