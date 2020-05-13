<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ firstmenu }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ secmenu }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
</template>

<script>
    export default {
        name: 'breadcrumb',
      props:['firstmenu', 'secmenu']
    }
</script>

<style scoped>

</style>
