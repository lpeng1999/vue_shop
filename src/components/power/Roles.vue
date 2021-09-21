<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展示列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 == 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5"
                ><el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 和 三级权限 -->
              <el-col :span="19">
                <el-row :class="[i2 == 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6"
                    ><el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.authName }}</el-tag> <i class="el-icon-caret-right"></i
                  ></el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色等级" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRolesById(scope.row.id)">删除</el-button>
            <!-- 分配角色权限 -->
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRolesDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色对话框 -->
      <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="50%" @close="addDialogClose">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改角色对话框 -->
      <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="50%" @close="editDialogClose">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限对话框 -->
      <el-dialog title="提示" :visible.sync="setRightDialogVisible" width="30%" @close="setRightDialogClosed">
        <el-tree :data="rightsList" :props="treeProps" node-key="id" show-checkbox :default-checked-keys="defKeys" default-expand-all ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { Roles, getRights } from '@/request/api'
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 添加角色数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色对话框是否显示
      addRoleDialogVisible: false,
      // 添加角色的验证规则
      addFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      // 编辑角色对话框是否显示
      editRoleDialogVisible: false,
      // 编辑角色数据
      editForm: {},
      // 编辑角色的验证规则
      editFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      // 分配权限对话框是否显示
      setRightDialogVisible: false,
      // 设置权限数据
      rightsList: [],
      // 树形空间属性对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点id
      defKeys: [],
      // 分配权限的id
      roleId: ''
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 获取角色列表
    async getRightsList() {
      const { data, meta } = await Roles.getRoles()
      if (meta.status !== 200) return this.$message.error('获取角色列表失败！')
      // console.log(data)

      this.rolesList = data
    },
    // 关闭添加角色对话框时重置表单
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加角色前预校验并提交
    addRoles() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { meta } = await Roles.createRole(this.addForm)
        if (meta.status !== 201) return this.$message.error('添加角色失败！')

        this.addRoleDialogVisible = false
        this.getRightsList()
        this.$message.success('添加角色成功！')
      })
    },
    // 显示修改用户对话框
    async showEditDialog(id) {
      const { data, meta } = await Roles.getRoleById(id)
      if (meta.status !== 200) return this.$message.error('查询角色信息失败！')

      this.editForm = data
      this.editRoleDialogVisible = true
    },
    // 关闭编辑角色对话框时重置表单
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑角色前预校验并提交
    editRoles() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { meta } = await Roles.updateRoleById(this.editForm.roleId, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        })
        if (meta.status !== 200) return this.$message.error('编辑角色信息失败！')

        this.editRoleDialogVisible = false
        this.getRightsList()
        this.$message.success('编辑角色信息成功！')
      })
    },
    // 根据 id 删除 用户信息
    async removeRolesById(id) {
      const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(result)
      // 确定返回 confirm，取消返回 cancel
      // 判断是否删除
      if (result !== 'confirm') return this.$message.info('已取消删除！')

      const { meta } = await Roles.deleteRoleById(id)
      if (meta.status !== 200) return this.$message.error('删除用户失败！')

      this.getRightsList()
      this.$message.success('删除用户成功！')
    },
    // 根据 id 删除角色指定权限
    async removeRightById(role, rightId) {
      const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(result)
      // 确定返回 confirm，取消返回 cancel
      // 判断是否删除
      if (result !== 'confirm') return this.$message.info('已取消删除！')

      const { data, meta } = await Roles.deleteRoleRightById(role.id, rightId)
      if (meta.status !== 200) return this.$message.error('删除权限失败！')
      // console.log(data)

      role.children = data
      this.$message.success('删除权限成功！')
    },
    // 显示分配权限对话框
    async showSetRolesDialog(role) {
      const { data, meta } = await getRights('tree')
      // console.log(data)
      if (meta.status !== 200) return this.$message.error('查询角色信息失败！')

      this.rightsList = data
      // 三级权限
      this.getLeafkeys(role, this.defKeys)
      // 分配权限的id
      this.roleId = role.id
      this.setRightDialogVisible = true
    },
    // 递归获取角色三级权限id
    getLeafkeys(node, arr) {
      // 如果node节点没有children属性，则是三级节点
      if (!node.children) return arr.push(node.id)

      node.children.forEach(item => {
        this.getLeafkeys(item, arr)
      })
    },
    // 关闭分配权限对话框
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 为角色分配权限
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { meta } = await Roles.updateRoleRightById(this.roleId, {
        rids: idStr
      })
      if (meta.status !== 200) return this.$message.error('分配权限失败！')

      this.$message.success('分配权限成功！')
      this.getRightsList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin-top: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
