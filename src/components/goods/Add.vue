<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 提示 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"> </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_name">
              <el-cascader :options="cateList" :props="cascaderProps" v-model="addForm.goods_cat" @change="handleChange"> </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTabData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"> </el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload class="upload-demo" :action="uploadUrl" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handelSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewImgSrc" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { Categories, CategoriesAttributes, Goods } from '@/request/api'
export default {
  data() {
    return {
      activeIndex: '0',
      // 添加商品表单
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品分类数组
        goods_cat: [],
        // 上传图片路径数组
        pics: [],
        // 商品内容
        goods_introduce: '',
        // 商品的参数（数组），包含 动态参数 和 静态属性
        attrs: []
      },
      // 添加商品表单验证规则
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }]
      },
      // 商品分类
      cateList: [],
      // 级联选择器配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover' // 次级菜单的展开方式
      },
      // 选中项绑定值
      selectedKeys: [],
      // 动态参数列表
      manyTabData: [],
      // 静态属性列表
      onlyTabData: [],
      uploadUrl: '',
      // 图片请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片路径
      previewImgSrc: '',
      // 图片预览对话框是否显示
      previewVisible: false
    }
  },
  created() {
    this.getCateList()

    let baseURL

    if (process.env.NODE_ENV === 'development') {
      baseURL = 'http://lpeng.top/api/private/v1'
    } else if (process.env.NODE_ENV === 'production') {
      baseURL = 'http://lpeng.top/api/private/v1'
    }

    this.uploadUrl = baseURL + '/upload'
  },
  methods: {
    async getCateList() {
      const { data, meta } = await Categories.getCategories('categories', {
        params: this.queryInfo
      })
      if (meta.status !== 200) return this.$messsage.error('获取商品分类数据失败！')

      this.cateList = data
    },
    // 选中项改变
    handleChange() {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 切换标签之前的钩子
    beforeTabLeave(activeName, oldActiveName) {
      // console.log('离开', oldActiveName)
      // console.log('进入', activeName)
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    // tab 被选中时触发
    async tabClicked() {
      // 获取动态参数
      if (this.activeIndex === '1') {
        const { data, meta } = await CategoriesAttributes.getAttributesById(this.cateId, {
          sel: 'many'
        })
        if (meta.status !== 200) return this.$message.error('获取动态参数失败！')
        // console.log(data)

        data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })

        this.manyTabData = data
      } else if (this.activeIndex === '2') {
        const { data, meta } = await CategoriesAttributes.getAttributesById(this.cateId, { sel: 'only' })
        if (meta.status !== 200) return this.$message.error('获取静态属性失败！')
        // console.log(data)

        this.onlyTabData = data
      }
    },
    // 移除图片
    handleRemove(file) {
      console.log(file)
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从 pics 数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addForm.pics.splice(i, 1)
    },
    // 图片预览
    handlePreview(file) {
      console.log(file)
      this.previewImgSrc = file.response.data.url
      this.previewVisible = true
    },
    // 图片上传成功
    handelSuccess(response) {
      console.log(response)
      if (response.meta.status === 200) {
        // 把上传成功后，图片的临时路径，保存到 addForm.pics 数组中，作为对象来保存
        this.addForm.pics.push({
          pic: response.data.tmp_path
        })
      }
    },
    // 添加商品前预校验并提交
    async add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项')

        // 深拷贝 lodash cloneDeep(obj) 将goods_cat数组转换为字符串
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 动态参数
        this.manyTabData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 静态属性
        this.onlyTabData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)

        // 商品的名称，必须是唯一的
        const { meta } = await Goods.createGoods(form)
        if (meta.status !== 201) return this.$message.error('添加商品失败！')

        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 分类 ID
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
</style>
