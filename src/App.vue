<!--//项目主页面
//<template>写html标签-->
<!--111111111111111111111111111111111111111111111111111111-->

<template>

  <div id="app">

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
/*标签选测器*/
body{

  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}
</style>
<script setup lang="ts">
</script>
