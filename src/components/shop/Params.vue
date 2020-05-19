<template>
  <div>
    <!-- 卡片式图 -->
    <el-card>
      <!-- 3.找alert警告组件复制, :closable="false"属性禁止X号 show-icon图标 -->
      <el-alert title="注意:只允许为第三级分类设置参数!" type="warning" :closable="false" show-icon></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!--标签页区域-->
      <!--v-model: 被选中的标签页的名称-->
      <el-tabs v-model="activeName" @tab-click="tabHandleClick">
        <el-tab-pane label="动态参数" name="many">
          <!--添加动态参数的面板-->
          <el-button :disabled="isBtnDisabled" type="primary" size="mini">添加参数</el-button>
          <!--动态参数的表格-->
          <el-table :data="tableData" border stripe>
            <el-table-column type="expand">
              <!--渲染标签-->
              <template #default="{ row }">
                <el-tag closable v-for="item in row.attr_vals" :key="item">{{ item }}</el-tag>
                <!--动态编辑标签结构-->
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!--添加静态属性的面板-->
          <el-button :disabled="isBtnDisabled"  type="primary" size="mini">添加属性</el-button>
          <!--静态属性的表格-->
          <el-table :data="tableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品列表
      cateList: [],
      // 7.级联选择框的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger:'hover'
      },
      // 级联选择框双向绑定到的数组
      selectedCateKeys: [],
      // 标签页被选中的名称
      activeName: 'many',
      // 表格数据
      tableData:[],
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 6. 获取商品分类列表,  因为要获取所有的3级数据, 所以不需要传参数
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) { return this.$message.error('获取商品列表失败') }
      // 成功则保存到data中
      this.cateList = res.data
    },
    // 级联选择器改变就会触发的的函数
    async handleChange() {
      if (this.selectedCateKeys.length !== 3) {
        // 清空数组
        this.selectedCateKeys = []
        // 优化 : 重置表格数据
        this.tableData = []
        return
      }

      // 请求分类数据
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取分类失败')
      // 成功
      // 分析 : 展开列的数据, 有多个标签, 要把获取到的数据改造成数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 优化 : 给每一个item都添加两个字段, 用来操作对应标签结构的
        item.inputVisible = false
        item.inputValue = ''
      })
      this.tableData = res.data
      console.log(this.tableData)
    },
    // 标签页的click事件
    tabHandleClick() {
      this.handleChange()
    },
    // 展开列中的tag标签失焦的事件
    async handleInputConfirm(row) {
      // 把value添加页面中
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      // 添加到数据库
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      })
      // 注意 : 数据库中的attr_vals是以字符串显示的
      if (res.meta.status !== 200) return this.$message.error('提交失败')
      // 成功
      row.inputValue = ''
      row.inputVisible = false
      this.$message.success('提交成功')
    },
    // 点击显示input组件
    showInput(row) {
      row.inputVisible = true
      // 聚焦 $nextTick : 当页面上的组件元素被重新渲染之后触发的
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  computed:{
    // 通过布尔值操作按钮的禁用状态
    isBtnDisabled() {
      return this.selectedCateKeys.length !== 3
    },
    // 获取分类id
    cateId() {
      return this.selectedCateKeys.length === 3 ? this.selectedCateKeys[2] : null
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag{
    width: 150px;
}
</style>
