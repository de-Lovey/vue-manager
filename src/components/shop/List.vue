<template>
  <div>

    <!-- 卡片式图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" @click="getGoodsList" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 渲染table表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column width="95" label="商品价格(元)" prop="goods_price"></el-table-column>
        <el-table-column width="70" label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column width="140" label="创建时间" prop="add_time">
          <template slot-scope="scope">
            {{ scope.row.add_time}}
          </template>
        </el-table-column>
        <el-table-column width="130" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <!-- 删除功能 -->
            <el-button size="mini" @click="removeById(scope.row.goods_id)" type="danger" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [], // 商品列表
      total: 0 // 商品总数
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取对应的数据列表1.8.1
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) { return this.$message.error('获取商品列表失败') }
      // 成功则保存到data中
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // handleSize改变时的函数,就可以获取最新的size
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getGoodsList()
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getGoodsList()
    },
    // 点击根据id删除
    async removeById(id) {
         const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
            return this.$message.info('已取消删除')
        }
        // 点击确认删除时, 请求数据
        const { data: res } = await this.$http.delete(`goods/${id}`)
        if (res.meta.status !== 200) return this.$message.error('删除商品失败')
        // 删除成功
        this.$message.success('删除商品成功')
        this.getGoodsList()
    },
    // 点击添加商品
    goAddpage() {
        this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
