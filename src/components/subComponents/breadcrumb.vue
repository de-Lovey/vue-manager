<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ authname.itemAuthname }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ authname.subItemAuthname }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
</template>

<script>
    export default {
        name: 'breadcrumb',
      props:['authname']
    }
</script>

<style scoped>

</style>
