<template>
      <el-container class="home_container">
        <el-header>
          <div>
            <img src="../assets/logo.png" alt="">
            <span>电商后台管理系统</span>
          </div>
          <el-button type="info">退出</el-button>
        </el-header>
        <el-container>
          <el-aside width="200px">Aside</el-aside>
          <el-main>Main</el-main>
        </el-container>
      </el-container>
</template>

<script>
    export default {
        name: 'Home'
    }
</script>

<style scoped lang="less">
.home_container{
  height: 100%;
  .el-header{
    background-color:#373D41;
    display: flex;
    justify-content: space-between;
    color: white;
    font-size: 20px;
    align-items: center;
    > div{
      display: flex;
      align-items: center;
      img {
        width: 50px;
        margin-right: 20px;
      }
    }
  }
}
</style>
