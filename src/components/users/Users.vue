<template>
  <div>
    <!--1. 面包屑导航-->
    <!--      <el-breadcrumb separator-class="el-icon-arrow-right">-->
    <!--        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item>用户管理</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item>用户列表</el-breadcrumb-item>-->
    <!--      </el-breadcrumb>-->
    <!--第三步, 调用-->
    <Breadcrumb :firstmenu="'用户管理'" :secmenu="'用户列表'"></Breadcrumb>

    <!--2.卡片组件-->
    <el-card class="card_box">
      <!--3. 利用布局组件gutter调试每一栏的间隔-->
      <el-row :gutter="20">
        <!--input表单-->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable
                    @clear="getUserList">
            <el-button slot="append" @click="getUserList" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <!--button按钮-->
        <el-col :span="4">
          <el-button @click="dialogVisible = true" type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!--4. 表格组件-->
      <el-table :data="userList" border>
        <!--索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column label="状态">
          <!--设置状态, 不需要props, 需要通过作用于插槽显示对应的数据结构, 注意 : scope是临时变量, 在临时变量中通过row属性来接收对应的数据对象-->
          <template #default="scope">
            <el-switch @change="userStateChange(scope.row)" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row}">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button @click="removeUserById(row.id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>

        </el-table-column>
      </el-table>

      <!--5. 分页组件-->
      <!--layout : 用来指定对应的布局结构  page-sizes: 显示个数的选项列表的-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!--添加用户的对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!--表单结构-->
      <el-form :model="addForm"  :rules="addFormRules" ref="addRef" label-width="70px" hide-required-asterisk>
        <!--prop="username" : 验证规则的属性-->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  // 1. 导入公共子组件
  import Breadcrumb from '../subComponents/breadcrumb.vue'

  export default {
    name: 'Users',
    data() {
      // 定义邮箱的校验规则
      const checkEmail = (rule, value, callback) => {
        // 设置邮箱的正则表达式
        const regEmail = /^[a-zA-Z0-9]+@([a-zA-Z0-9])+(\.[a-zA-Z]+)+$/
        if (regEmail.test(value)) {
          // 说明是合法的邮箱
          return callback()
        }
        // 失败
        callback(new Error('请输入合法的邮箱'))
      }

      // 定义手机的校验规则
      const checkPhone = (rule, value, callback) => {
        const regMobile = /^1[34578]\d{9}$/
        if (regMobile.test(value)) return callback()
        callback(new Error('请输入合法的手机号'))
      }

      return {
        // 控制弹框的显示和隐藏
        dialogVisible: false,
        queryInfo: {
          query: '', // 查询字符串
          pagenum: 1, // 默认显示第一页
          pagesize: 2 // 每页显示的条数
        },
        userList: [],
        total: 0,
        // 表单数据对象
        addForm:{

        },
        // 表单验证对象
        addFormRules:{
          username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          email:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            // 调用自定义的校验规则
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile:[
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkPhone, trigger: 'blur' }
          ]
        }

      }
    },
    components: {
      // 2. 注册到父组件上
      Breadcrumb
    },
    created() {
      this.getUserList()
    },
    methods: {
      // 获取用户列表
      async getUserList() {
        const { data: res } = await this.$http.get('users', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) return this.$message.error('用户列表获取失败')
        // 成功
        this.userList = res.data.users
        this.total = res.data.total
      },
      // 监听pagesize改变事件
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        // 重新获取数据
        this.getUserList()
      },
      // 监听page改变事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        // 重新获取数据
        this.getUserList()
      },
      // 监听状态改变事件
      async userStateChange(userInfo) {
        const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        if (res.meta.status !== 200) {
          // 重置状态
          userInfo.mg_state = !userInfo.mg_state
          this.$message.error('更新用户状态失败')
          return
        }
        // 成功
        this.$message.success('更新用户状态成功')
      },
      // 点击按钮新增用户信息
       addUserInfo() {
        // 先校验所有的验证状态
        this.$refs.addRef.validate(async valid => {
          if (!valid) return
          // 发请求
          const { data: res } = await this.$http.post('users', this.addForm)
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          // 成功
          // 重新获取用户列表数据
          this.getUserList()
          // 关闭添加用户的对话框
          this.dialogVisible = false
        })
      },
      // 监听对话框关闭的事件
      addDialogClosed() {
        this.$refs.addRef.resetFields()
      },
      // 点击删除单个用户
      async removeUserById(id) {
        // 消息确认框的组件
       const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        console.log(confirmRes)

        // 如果点击的是确定按钮, confirmRes : confirm
        // 如果点击的是取消按钮, confirmRes : cancel
        if (confirmRes === 'confirm') {
          const { data: res } = await this.$http.delete(`users/${id}`)
          if (res.meta.status !== 200) return this.$message.error('删除失败')
          // 成功 , 刷新数据
          this.getUserList()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .card_box {
    margin-top: 20px;

    .el-table {
      margin: 20px 0;
    }
  }
</style>
