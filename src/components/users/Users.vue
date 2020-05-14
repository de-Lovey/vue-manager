<template>
  <div>
    <!--1. 面包屑导航-->
    <!--      <el-breadcrumb separator-class="el-icon-arrow-right">-->
    <!--        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item>用户管理</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item>用户列表</el-breadcrumb-item>-->
    <!--      </el-breadcrumb>-->
    <!--第三步, 调用-->
<!--    <Breadcrumb :firstmenu="'用户管理'" :secmenu="'用户列表'"></Breadcrumb>-->

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
        <el-table-column type="index" label="#"></el-table-column>
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
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(row.id)"></el-button>
            <el-button @click="removeUserById(row.id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRoleDialog(row)"></el-button>
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

    <!--修改用户的对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!--表单结构-->
      <el-form :model="editForm"  :rules="editFormRules" ref="editRef" label-width="70px" hide-required-asterisk>
        <!--prop="username" : 验证规则的属性-->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!--分配角色的对话框-->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <!--内容结构-->
     <div>
       <p>当前的用户: {{userInfo.username}}</p>
       <p>当前的角色: {{ userInfo.role_name }}</p>
       <p>
         分配新角色
         <el-select v-model="roleId" placeholder="请选择">
           <el-option
             v-for="item in roleList"
             :key="item.id"
             :label="item.roleName"
             :value="item.id">
           </el-option>
         </el-select>
       </p>
     </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

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
        // 控制修改弹框的显示和隐藏
        editDialogVisible: false,
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
        },
        // 修改表单的数据对象
        editForm : {},
        // 修改表单的验证规则
        editFormRules:{
          email:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            // 调用自定义的校验规则
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile:[
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkPhone, trigger: 'blur' }
          ]
        },
        // 角色的id
        roleId: '',
        setRoleDialogVisible: false,
        roleList:[],
        // 保存对应的用户信息
        userInfo: {}

      }
    },
    // components: {
    //   // 2. 注册到父组件上
    //   Breadcrumb
    // },
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
      // 监听修改对话框关闭的事件
      editDialogClosed() {
        this.$refs.editRef.resetFields()
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
          console.log(res)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          // 成功 , 刷新数据
          this.getUserList()
        }
      },
      // 点击显示修改的对话框
      async showEditDialog(id) {
        // 根据id查询用户信息
        const { data :res } = await this.$http.get(`users/${id}`)
        if (res.meta.status !== 200) return this.$message.error('查询失败')
        // 成功
        this.editForm = res.data
        // 显示弹框
        this.editDialogVisible = true
      },
      // 点击修改
      editUserInfo() {
        this.$refs.editRef.validate(async valid => {
          if (!valid) return
          // 发请求
          const { data: res } = await this.$http.put(`users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })

          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          // 成功
          // 重新获取用户列表数据
          this.getUserList()
          // 关闭对话框
          this.editDialogVisible = false
          this.$message.success('更新成功')
        })
      },
      // 监听分配角色对话框的关闭事件
      setRoleDialogClosed() {
        // 重置data中的参数
        this.userInfo = {}
        this.roleId = ''
      },
      // 点击分配角色
      async setRoleInfo() {
        // 判断
        if (!this.roleId) return this.$message.info('请选择角色')
        // 请求接口
        const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, {
          rid: this.roleId
        })
        if (res.meta.status !== 200) return this.$message.error('分配角色失败')
        // 成功
        this.$message.success('更新角色成功')
        // 初始化数据
        this.getUserList()
        // 关闭弹框
        this.setRoleDialogVisible = false
      },
      // 点击显示分配角色的对话框
      async showRoleDialog(userInfo) {
        // 保存对应的用户信息
        this.userInfo = userInfo
        // 获取角色列表

        const { data: res } = await this.$http.get('roles')
        if (res.meta.status !== 200) return this.$message.error('获取失败')
        // 成功
        this.roleList = res.data

        this.setRoleDialogVisible = true
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
