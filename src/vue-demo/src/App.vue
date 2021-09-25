<template>
  <div class="app">
    <el-menu :router="true" mode="horizontal">
      <el-menu-item index="/">Table列表</el-menu-item>
      <el-menu-item index="/list">自定义列表</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
