<template>
  <div class="user">
    <!-- 路径导航，面包屑数据 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <div style="margin-top: 30px;" class="addDiv">
      <el-input @keyup.enter.native='seekAssignData' placeholder="请输入内容" v-model="query" class="input-with-select selectBox">
        <el-button slot="append" icon="el-icon-search" @click='seekAssignData'></el-button>
      </el-input>
      <el-button type="success" plain @click='addDialogFormVisible=true'>添加用户</el-button>
    </div>
    <!-- 数据展示区域 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeStatu($event,scope.row.id)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button size="mini" type="success" @click="showEditDialog(scope.row)">编辑</el-button>
          </el-tooltip>
          <!-- 实现删除用户数据 -->
          <el-tooltip content="删除" placement="top">
            <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
          </el-tooltip>
          <el-tooltip content="分配角色" placement="top" class="item" effect="dark">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-share"
              @click="createRoleALLDate(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页数据区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 显示编辑用户数据框 -->
    <el-dialog title="编辑用户" :visible.sync="editdialogFormVisible">
      <el-form :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="用户名" :label-width="editLabelWidth" prop="username">
          <el-input v-model="editForm.username" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="editLabelWidth" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="editLabelWidth" prop="mobile">
          <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editdialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="determine">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 显示分配角色框 -->
    <el-dialog title="分配角色" :visible.sync="roledialogFormVisible">
      <el-form :model="roleform">
        <el-form-item label="用户名" :label-width="roleformLabelWidth">
          <el-input v-model="roleform.username" auto-complete="off" style="width:222px"></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="roleformLabelWidth">
          <el-select v-model="roleform.rid" placeholder="请选择">
            <!-- 循环动态生成数据 -->
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roledialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeRoleDate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 显示添加用户框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addform" :rules="rules" ref="addform">
        <el-form-item label="用户名" :label-width="addFormLabelWidth" prop="username">
          <el-input v-model="addform.username" auto-complete="off" style="width:280px"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="addFormLabelWidth" prop="password">
          <el-input v-model="addform.password" auto-complete="off" style="width:280px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="addFormLabelWidth" prop="email">
          <el-input v-model="addform.email" auto-complete="off" style="width:280px"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="addFormLabelWidth" prop="mobile">
          <el-input v-model="addform.mobile" auto-complete="off" style="width:280px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogFormData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 引入index获取数据
import {
  getUserList,
  editGetData,
  delGetDate,
  getUserState
} from '@/api/index.js'
// 引入所有分配角色数据
import { getAllRoleDate, allotUserRole, addUserData } from '@/api/role_index.js'
export default {
  data () {
    return {
      total: 0,
      // 添加用户数据源
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 显示隐藏添加用户框
      addDialogFormVisible: false,
      addFormLabelWidth: '120px',
      // 角色数据源数组
      roleList: [],
      // 分配角色框显示隐藏
      roledialogFormVisible: false,
      // 表单宽度
      roleformLabelWidth: '120px',
      // 分配角色双向绑定对象
      roleform: {
        id: '',
        username: '',
        rid: ''
      },
      // 编辑操作验证规则
      rules: {
        // required:是否必须   message:如果不合法的提示信息，trigger:什么时候触发
        username: { required: true, message: '请输入用户名', trigger: 'blur' },
        password: { required: true, message: '请输入密码', trigger: 'blur' },
        email: { required: true, message: '请输入邮箱', trigger: 'blur' },
        mobile: { required: true, message: '请输入手机号', trigger: 'blur' }
      },
      // 编辑操作对话框是否显示，默认隐藏
      editdialogFormVisible: false,
      // 设置表单元素对应的label宽度
      editLabelWidth: '120px',
      // 编辑操作所对应的双向绑定对象
      editForm: {
        id: '',
        username: '',
        mobile: '',
        email: ''
      },
      userstatu: true, // 用户状态
      query: '', // 用户搜索关键字
      pagenum: 1, // 显示当前为第几页
      pagesize: 5, // 显示每页几条数据
      tableData: [] // 表格数据源
    }
  },
  methods: {
    // 实现分页数据
    // 当用户修改每页显示的数量进行触发
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.init()
    },
    // 搜索指定数据，筛选
    seekAssignData () {
      this.init()
    },
    // 新增用户数据
    addDialogFormData () {
      // 实现新增
      addUserData(this.addform)
        .then((result) => {
          console.log(result)
          if (result.meta.status === 201) {
            // 显示隐藏添加用户框
            this.addDialogFormVisible = false
            this.init()
            this.$refs.addform.resetFields()
            this.$message({
              type: 'success',
              message: result.meta.msg
            })
          } else {
            this.$message({
              type: 'success',
              message: result.meta.msg
            })
          }
        })
    },
    // 确定修改分配角色
    changeRoleDate () {
      console.log(this.roleform)
      allotUserRole(this.roleform).then(result => {
        console.log(result)
        if (result.meta.status === 200) {
          // 分配角色框显示隐藏
          this.roledialogFormVisible = false
          this.init()
          this.$message({
            type: 'success',
            message: result.meta.msg
          })
        } else {
          this.$message({
            type: 'error',
            message: result.meta.msg
          })
        }
      })
    },
    // 显示分配角色
    createRoleALLDate (row) {
      console.log(row)
      // 分配角色框显示隐藏
      this.roledialogFormVisible = true
      this.roleform.id = row.id
      // 显示当前用户名
      this.roleform.username = row.username
      // 显示当前角色，通过rid获取当前的角色
      this.roleform.rid = row.rid
    },
    // 实现用户状态修改
    changeStatu (type, id) {
      // console.log(type, id)
      // 通过id获取修改状态信息
      getUserState(id, type).then(result => {
        console.log(result)
        if (result.meta.status === 200) {
          this.$message({
            type: 'success',
            message: result.meta.msg
          })
        }
      })
    },
    // 实现删除用户数据
    del (id) {
      // 获取删除数据
      this.$confirm(`此操作将永久删除id为${id}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        // 如果单击确定就会触发then中的回调
        .then(() => {
          // 确认之后再进行删除操作
          delGetDate(id).then(result => {
            console.log(id)
            if (result.meta.status === 200) {
              // console.log(result.meta)
              // 给出提示
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              // 刷新页面
              this.init()
            } else {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            }
          })
        })
        .catch(() => {})
    },
    // 实现编辑提交
    determine () {
      // validate:可以实现指定表单的数据验证
      // 如果通过验证，就会返回true，否则返回false
      this.$refs.editForm.validate(valid => {
        // console.log(valid)
        if (valid) {
          // 实现编辑提交请求
          editGetData(this.editForm).then(result => {
            console.log(result)
            this.init()
            this.editdialogFormVisible = false
          })
          // 实现数据刷新
        } else {
          this.$message({
            message: '用户输入不合法',
            type: 'warning'
          })
        }
      })
    },
    // 点击生成编辑数据
    showEditDialog (data) {
      // console.log(data)
      // 点击显示编辑对话框
      this.editdialogFormVisible = true
      // 在表单中进行了双向数据绑定，直接获取对象进行赋值
      // 保存当前id
      this.editForm.id = data.id
      this.editForm.username = data.username
      this.editForm.mobile = data.mobile
      this.editForm.email = data.email
    },
    init () {
      getUserList({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(result => {
        console.log(result.data)
        this.tableData = result.data.users
        this.total = result.data.total
      })
    }
  },
  mounted () {
    // 调用数据展示
    this.init()
    // 获取所有角色数据
    getAllRoleDate().then(result => {
      console.log(result)
      this.roleList = result.data
    })
  }
}
</script>
<style lang="less" scoped>
.selectBox {
  width: 300px;
  margin-right: 10px;
}
.addDiv {
  margin-bottom: 50px;
}
</style>
