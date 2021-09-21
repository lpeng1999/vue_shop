<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索和添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrdersList">
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="订单编号" prop="order_number"> </el-table-column>
        <el-table-column label="订单价格" prop="order_price"> </el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"> </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-tooltip class="item" effect="dark" content="修改订单地址" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.order_id)"></el-button>
            </el-tooltip>
            <!-- 查看物流 -->
            <el-tooltip class="item" effect="dark" content="查看物流" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressDialog(scope.row.order_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%" @close="closeEditDialog">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <!-- 级联选择器 -->
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <!-- v-model 设置级联菜单绑定数据 -->
          <el-cascader :options="cityData" v-model="editForm.address1" :props="{ expandTrigger: 'hover' }" @change="parentCateChange"> </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrder">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看物流对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressDialogVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
import progressData from './progress.js'
import { Orders } from '@/request/api'
export default {
  data() {
    return {
      // 查询参数
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 每页条数
        pagesize: 10
      },
      // 订单数据列表
      ordersList: [],
      // 总条数
      total: 0,
      // 编辑地址对话框是否显示
      editDialogVisible: false,
      // 编辑地址
      editForm: {
        address1: [],
        address2: ''
      },
      // 编辑地址的验证规则
      editFormRules: {
        address1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      },
      cityData: cityData,
      // 查看物流信息对话框是否显示
      progressDialogVisible: false,
      // 物流信息
      progressInfo: progressData.data
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    // 获取订单数据列表
    async getOrdersList() {
      const { data, meta } = await Orders.getOrders(this.queryInfo)
      if (meta.status !== 200) return this.$message.error('获取订单列表失败！')
      // console.log(data)

      this.ordersList = data.goods
      this.total = data.total
    },
    // 每页条数改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    // 页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    },
    // 显示编辑地址对话框
    showEditDialog(id) {
      // const { data, meta } = await Orders.getOrderById(id)
      // console.log(data, meta)
      this.editDialogVisible = true
    },
    // 关闭编辑对话框重置
    closeEditDialog() {
      this.$refs.editFormRef.resetFields()
    },
    // 选中项改变
    parentCateChange() {
      console.log(this.editForm.address1)
    },
    // 编辑地址
    editOrder() {},
    // 显示查看物流对话框
    async showProgressDialog(id) {
      // 供测试的物流单号：1106975712662
      //  const { data, meta } = await Orders.getOrderLogisticById('1106975712662')
      //  console.log(data, meta)
      // if (meta.status !== 200) return this.$message.error('获取物流信息失败！')

      // this.progressInfo = data
      this.progressDialogVisible = true
    },
    // 关闭查看物流对话框重置
    closeProgressDialog() {
      this.$refs.progressFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped></style>
