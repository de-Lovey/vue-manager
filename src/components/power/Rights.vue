<template>
    <div>
      <!--卡片式图-->
      <el-card>
        <el-table :data="rightsList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="权限名称" prop="authName"></el-table-column>
          <el-table-column label="路径" prop="path"></el-table-column>
          <el-table-column label="权限等级" prop="level">
            <template #default="{ row }">
              <el-tag v-if="row.level === '0'">一级</el-tag>
              <el-tag type="success" v-else-if="row.level === '1'">二级</el-tag>
              <el-tag type="warning" v-else>三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
    export default {
        name: 'Rights',
      data() {
          return {
            rightsList:[]
          }
      },
      created() {
          this.getRightsList()
      },
      methods: {
          async getRightsList() {
            // 获取权限列表
            const { data: res } = await this.$http.get('rights/list')
            if (res.meta.status !== 200) return this.$message.error('获取失败')
            // 成功
            this.rightsList = res.data
          }
      }
    }
</script>

<style scoped>

</style>
