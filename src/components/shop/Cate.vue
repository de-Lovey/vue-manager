<template>
  <div>
    <el-card>
      <!--button按钮-->
      <el-row>
        <el-col>
          <el-button @click="showCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--表格树形控件 :data="数据源" :columns="设置表格中列的配置项"-->
      <zk-table
        ref="table"
        :data="cateList"
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        show-index
        index-text="#"
      >
        <!--第二列: 定义模板列, 使用slot声明模板名-->
        <template #isOK="scope">
          <i class="el-icon-success" style="color: lightgreen" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-success" style="color: red" v-else></i>
        </template>
        <!--第三列: 定义模板列-->
        <template #order="{row }">
          <el-tag size="mini" v-if="row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-if="row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-if="row.cat_level===2">三级</el-tag>
        </template>
        <!--第四列: 定义模板列-->
        <template #option>
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </zk-table>
    </el-card>

    <!--添加分类的对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
    @close="cateDialogClosed">
      <!--表单内容组件-->
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRef" label-width="100px">
        <el-form-item label="分类名称: " prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称: ">
          <!--级联选择器-->
          <!--
          v-model绑定选中的值,必须是数组, options绑定数据源, props指定配置对象, change-on-select设置true表示可以选中任意的一级菜单
          -->
          <el-cascader
            v-model="selectedcKeys"
            :options="options"
            :props="CascaderProps"
            @change="handleChange"
          clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
    </el-dialog>

    <!-- 分页区域--拷贝组件的完整功能的分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'Cate',
    data() {
      return {
        // 商品分类的数据列表
        cateList: [],
        // 分类的参数对象
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        // 配置表格列
        columns: [
          // 第一列
          {
            label: '分类名称',
            prop: 'cat_name'
          },
          // 第二列
          {
            label: '是否有效',
            type: 'template',
            // 表示的是当前列使用的模板名称
            template: 'isOK'
          },
          // 第三列
          {
            label: '排序',
            type: 'template',
            // 表示的是当前列使用的模板名称
            template: 'order'
          },
          // 第四列
          {
            label: '操作',
            type: 'template',
            // 表示的是当前列使用的模板名称
            template: 'option'
          }
        ],
        // 控制添加分类对话框的显示与隐藏
        addCateDialogVisible: false,
        // 添加分类的数据对象
        addCateForm:{},
        addCateRules:{
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        },
        // 定义级联选择器选中的值, 必须是数组
        selectedcKeys:[],
        // 级联选择器的配置项
        CascaderProps:{
          label:'cat_name', // 指定显示的值的属性
          value: 'cat_id', // 指定显示值的对应id
          children: 'children',
          expandTrigger:'hover',
          checkStrictly: true // 禁止父子级联互相关联
        },
        // 级联选择器的数据源
        options:[],
        total:0

      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      // 级联选择器改变触发的事件
      handleChange() {
        console.log(this.selectedcKeys)
        // 如果用户选择了, 获取当前数组的最后一个id
        if (this.selectedcKeys.length > 0) {
          // 赋值父类id
          this.addCateForm.cat_pid = this.selectedcKeys[this.selectedcKeys.length - 1]
          // 赋值层级
          this.addCateForm.cat_level = this.selectedcKeys.length
        } else {
          this.addCateForm.cat_pid = 0
          this.addCateForm.cat_level = 0
        }
      },
      // 点击显示对话框
      async showCateDialog() {
        // 显示对话框
        // 获取分类列表数据
        const { data: res } = await this.$http.get('categories', {
          params:{
            type:2
          }
        })
        if (res.meta.status !== 200) return this.$message.error('获取失败')
        // 成功则保存
        this.options = res.data
        this.addCateDialogVisible = true
      },
      // 点击提交添加分类的数据
      addCate() {
        this.$refs.addCateRef.validate(async valid => {
          if (!valid) return
          // 发请求
          const { data: res } = await this.$http.post('categories', this.addCateForm)
          if (res.meta.status !== 201) return this.$message.error('添加失败')
          // 成功
          this.getCateList()
          // 隐藏对话框
          this.addCateDialogVisible = false
        })
      },
      // 监听对话框关闭事件
      cateDialogClosed() {
        this.$refs.addCateRef.resetFields() // 重置表单
        // 清空数据
        this.selectedcKeys = []
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      },
      // 获取表单数据
      async getCateList() {
        const { data: res } = await this.$http.get('categories', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) return this.$message.error('获取失败')
        // 成功
        this.cateList = res.data.result
        this.total = res.data.total
      },
      // 监听pagesize变化
      handleSizeChange(newsize) {
        // 赋值给queryInfo中的参数
        this.queryInfo.pagesize = newsize
        this.getCateList() // 刷新数据
      },
      // 监听pagenum的改变
      handleCurrentChange(newnum) {
        this.queryInfo.pagenum = newnum
        this.getCateList() // 刷新数据
      }
    }
  }
</script>

<style scoped>
.el-button{
  margin-bottom: 10px;
}
</style>
