<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialogVisible"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 树形表格 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: #20B2AA"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: #F92672" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCateById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="closeAddDialogVisible"
      >
        <el-form
          :model="addCateForm"
          :rules="addCateFormrules"
          ref="addCateFormRef"
          label-width="80px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- 级联选择器 -->
            <!-- options 用来指定数据源 -->
            <!-- props 用来指定配置对象 -->
            <!-- v-model 设置级联菜单绑定数据 -->
            <el-cascader
              :options="parentCateList"
              :props="cascaderProps"
              v-model="selectedKeys"
              @change="parentCateChange"
            >
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改分类对话框 -->
      <el-dialog
        title="编辑分类"
        :visible.sync="editCateDialogVisible"
        width="50%"
        @close="closeEditDialog"
      >
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="80px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 商品分类请求参数
      queryInfo: {
        type: 3,
        // 当前的页数
        pagenum: 1,
        // 每页条数
        pagesize: 5
      },
      // 总条数
      total: 0,
      // 树形表格各列的配置
      columns: [
        {
          // 列标题名称
          label: '分类名称',
          // 对应列内容的属性名
          prop: 'cat_name'
        },
        {
          // 列标题名称
          label: '是否有效',
          // 列类型，可选值有 'template'(自定义列模板)
          type: 'template',
          // 列类型为 'template'(自定义列模板) 时，对应的作用域插槽（它可以获取到 row, rowIndex, column, columnIndex）名称
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 添加分类对话框是否显示
      addDialogVisible: false,
      // 添加分类数据
      addCateForm: {
        // 分类名称
        cat_name: '',
        // 添加分类的父级id，0则表示父级为0.添加一级分类
        cat_pid: 0,
        // 添加分类的等级，0则表示添加一级分类
        cat_level: 0
      },
      // 添加分类验证规则
      addCateFormrules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类数据
      parentCateList: [],
      // 级联选择器配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover', // 次级菜单的展开方式
        checkStrictly: 'true' // 是否严格的遵守父子节点不互相关联
      },
      // 选中项绑定值
      selectedKeys: [],
      // 编辑分类对话框是否显示
      editCateDialogVisible: false,
      // 编辑分类数据
      editForm: {},
      // 编辑分类的验证规则
      editFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$messsage.error('获取商品分类数据失败！')
      }
      // console.log(res)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // pagesize当前的页数 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // pagenum每页条数 改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 显示添加分类对话框
    showAddDialogVisible() {
      // 先获取数据
      this.getParentCateList()
      this.addDialogVisible = true
    },
    // 获取父级分类数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$messsage.error('获取商品分类列表数据失败！')
      }
      // console.log(res.data)
      this.parentCateList = res.data
    },
    // 选中项改变
    parentCateChange() {
      console.log(this.selectedKeys)
      // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 关闭添加分类对话框时重置
    closeAddDialogVisible() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 添加分类前预校验并提交
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        // console.log(this.addCateForm)
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        // console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.getCateList()
        this.addDialogVisible = false
        this.$message.success('添加分类成功')
      })
    },
    // 显示修改分类对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`categories/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询分类信息失败！')
      }
      this.editForm = res.data
      console.log(this.editForm)
      this.editCateDialogVisible = true
    },
    // 关闭编辑角色对话框时重置表单
    closeEditDialog() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑分类前预校验并提交
    editCate() {
      console.log(this.editForm)
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.put(
          'categories/' + this.editForm.cat_id,
          {
            cat_name: this.editForm.cat_name
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑分类信息失败！')
        }
        // 关闭对话框
        this.editCateDialogVisible = false
        // 刷新数据列表
        this.getCateList()
        this.$message.success('编辑分类信息成功！')
      })
    },
    // 根据 id 删除 商品分类
    async removeCateById(id) {
      const result = await this.$confirm(
        '此操作将永久删除该商品分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // console.log(result)
      // 确定返回 confirm，取消返回 cancel
      // 判断是否删除
      if (result !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }
      // 刷新数据列表
      this.getCateList()
      this.$message.success('删除商品分类成功！')
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
