<template>
  <div class="user">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select selectBox">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" plain>成功按钮</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column
      type="index"
      width="50">
    </el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
       <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="success"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button size="mini" type="primary" icon="el-icon-share"></el-button>
      </template>
    </el-table-column>
    </el-table>
  </div>
</template>
<script>
// 引入index获取数据
import { getUserList } from '@/api/index.js'
export default {
  data () {
    return {
      userstatu: true,
      query: '',
      pagenum: 1,
      pagesize: 10,
      tableData: [
      ]
    }
  },
  methods: {
    handleEdit (e) {
      console.log(e)
    },
    handleDelete (e) {
      console.log(e)
    }
  },
  mounted () {
    getUserList({
      query: this.query,
      pagenum: this.pagenum,
      pagesize: this.pagesize
    }).then(result => {
      console.log(result)
      this.tableData = result.data.users
    })
  }
}
</script>
<style lang="less" scoped>
.selectBox {
  width: 300px;
  margin-right: 10px;
}
</style>
