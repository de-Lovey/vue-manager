<template>
    <div>
      <!--卡片式图-->
      <el-card>
        <el-alert title="添加商品信息" center show-icon :closable="false" type="info">
        </el-alert>
        <!--步骤条组件 :active="0" 指定激活项的索引 : number类型-->
        <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>

        <!--表单结构-->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
        <!--竖向标签页-->
        <el-tabs :tab-position="'left'" v-model="activeName" @tab-click="tabClick" :before-leave="beforeTabsEvent">
          <el-tab-pane label="基本参数" name="0">
            <!--表单组-->
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 选择商品分类的级联选择框 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!--动态参数面板-->
            <el-form-item v-for="item in manyData" :key="item.attr_id" :label="item.attr_name" >
              <!--复选框组件-->
              <!--v-model="item.attr_vals" : 绑定选中的数组-->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :key="item2" v-for="item2 in item.attr_vals" :label="item2" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!--静态属性面板-->
            <el-form-item v-for="item in onlyData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--上传图片面板-->
            <!--action : 图片上传的api地址-->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            :headers="headerObj"
              :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!--富文本组件面板-->
            <quill-editor v-model="addForm.goods_introduce" />
            <el-button type="primary"  @click="addGoods" >添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
        </el-form>
      </el-card>

      <!--预览图片的对话框-->
      <el-dialog  title="图片预览"  :visible.sync="picDialogVisible"
        width="50%">
        <!--图片-->
        <img :src="picPath" alt="" width="100%">
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'Add',
      data() {
          return {
            activeIndex: 0,
            // 标签页激活的值
            activeName: '0',
            // 表单数据对象
            addForm:{
              goods_price:1,
              goods_weight: 2,
              goods_number: 3,
              goods_cat:[],
              // 图片数组
              pics:[],
              attrs:[]
            },
            // 验证规则对象
            addFormRules:{
              goods_name:[
                { required: true, message: '请输入商品名称', trigger: 'blur' }
              ],
              goods_price:[
                { required: true, message: '请输入商品价格', trigger: 'blur' }
              ],
              goods_weight:[
                { required: true, message: '请输入商品重量', trigger: 'blur' }
              ],
              goods_number:[
                { required: true, message: '请输入商品数量', trigger: 'blur' }
              ],
              goods_cat:[
                { required: true, message: '请选择三级商品分类', trigger: 'change' }
              ]

            },
            cateList:[],
            // 级联选择框的配置对象
            cateProps: {
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              expandTrigger:'hover'
            },
            // 动态参数的数据
            manyData:[],
            // 静态参数的数据
            onlyData:[],
            // 图片上传的api地址-
            uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
            // 上传图片的请求头
            headerObj:{
              Authorization: window.sessionStorage.getItem('token')
            },
            // 预览图片的路径地址
            picPath:'',
            picDialogVisible: false

          }
      },
      created() {
          this.getCateList()
      },
      methods:{
          // 点击添加商品
        addGoods() {
          this.$refs.addFormRef.validate(async valid => {
            if (!valid) return this.$message.error('请填写必要的表单项')
            // 根据接口参数, 数据的请求
            // 添加动态参数
            this.manyData.forEach(item => {
              // 先拼接一个新对象
              const newObj = {
                attr_id: item.attr_id,
                attr_value: item.attr_vals.join(',')
              }
              this.addForm.attrs.push(newObj)
            })
            // 添加静态属性
            this.onlyData.forEach(item => {
              // 先拼接一个新对象
              const newObj = {
                attr_id: item.attr_id,
                attr_value: item.attr_vals
              }
              this.addForm.attrs.push(newObj)
            })
            // 分析goods_cat改造成字符串
            this.addForm.goods_cat = this.addForm.goods_cat.join(',')
            // console.log(this.addForm)
            const { data: res } = await this.$http.post('goods', this.addForm)
            // 成功
            if (res.meta.status !== 201) return this.$message.error(this.meta.msg)

            // 跳转到商品列表
            this.$router.push('/goods')
          })
        },
          // 监听tabs的click事件
        async tabClick() {
          this.activeIndex = this.activeName
          // 判断
          if (this.activeIndex === '1') {
            // 发请求获取动态参数的数据
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
              params:{
                sel: 'many'
              }
            })
            if (res.meta.status !== 200) return this.$message.error('获取动态参数失败')
            // 成功,  根据需求改造成数组
            res.data.forEach(item => {
              item.attr_vals = item.attr_vals.length > 0 ? item.attr_vals.split(',') : []
            })
            this.manyData = res.data
          } else if (this.activeIndex === '2') {
            // 请求静态属性
            // 发请求获取动态参数的数据
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
              params:{
                sel: 'only'
              }
            })
            if (res.meta.status !== 200) return this.$message.error('获取静态参数失败')
            // 成功,  根据需求改造成数组
            this.onlyData = res.data
            console.log(this.onlyData)
          }
        },
        // 定义函数获取级联选择器中的数据
        async getCateList() {
          const { data: res } = await this.$http.get('categories')
          if (res.meta.status !== 200) { return this.$message.error('获取商品列表失败') }
          // 成功则保存到data中
          this.cateList = res.data
          console.log(this.cateList)
        },
        // 级联选择器改变就会触发的的函数
        handleChange() {
          if (this.addForm.goods_cat.length !== 3) {
            // 清空数组
            this.addForm.goods_cat = []
          }
        },
        // 监听离开标签页之前的事件
        beforeTabsEvent(newActiveName, oldActiveName) {
          // 判断第一个面板未选择三级分类, 则阻止切换
          console.log(this.addForm.goods_cat)
          if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
            this.$message.error('请选择三级分类')
            return false // 阻止切换
          }
        },
        // 图片预览的事件
        handlePreview(file) {
          // 获取上传图片的路径
          this.picPath = file.response.data.url
          this.picDialogVisible = true
        },
        // 图片删除的事件
        handleRemove(file) {
          // 获取你要删除的路径
          const filePath = file.response.data.tmp_path
          // 在哪里删除呢? // 页面上有删除的效果, 最终删除addForm中的数据
         const i = this.addForm.pics.findIndex(item => item.pic === filePath
          )
          this.addForm.pics.splice(i, 1)
          console.log(this.addForm)
        },
        // 图片上传之后成功的钩子函数
        handleSuccess(res, file) {
          const imgPath = { pic: res.data.tmp_path }
          // 追加到数组中
          this.addForm.pics.push(imgPath)
        }
      },
      computed:{
          cateId() {
            return this.addForm.goods_cat[2] || null
          }
      }
    }
</script>

<style scoped>
.el-button{
  margin-top: 15px;
}
</style>
