<template>
  <div class="login">
    <div class="container">
      <el-form :model="LoginForm" :rules='rules' ref="LoginForm" class="demo-ruleForm">
          <img src="../assets/avatar.jpg" alt="" class="avatar">
        <el-form-item label prop="username">
          <el-input v-model="LoginForm.username" prefix-icon="myicon myicon-user"></el-input>
        </el-form-item>
        <el-form-item label prop="password">
          <el-input v-model="LoginForm.password" prefix-icon="myicon myicon-key"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loginSubmit('LoginForm')" class="login-btn">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
// 对象的解构
import { login } from '@/api/index.js'
export default {
  data () {
    return {
      LoginForm: {
        username: '',
        password: ''
      },
      //   表单所对应的验证规则
      rules: {
        username: [
          //   required:是否必须 message:如果不合法的提示信息 trigger:什么时候触发
          { required: true, message: '用户名输入错误', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码输入错误', trigger: 'blur' },
          { min: 6, max: 16, message: '请输入6到16位字符', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    loginSubmit (formname) {
      // 实现验证，只需要调用当前表单的validate函数，这函数有一个参数，参数是一个回调函数
      // 回调函数有一个参数，如果验证通过则返回true，否则返回false
      this.$refs[formname].validate((valid) => {
        console.log(this.$refs[formname])
        if (valid) {
          //   说明用户输入合法，那么就可以提交
          login(this.LoginForm)
            .then((result) => {
              if (result.meta.status === 200) {
                localStorage.setItem('itcastpro_token', result.data.token)
                this.$router.push({ name: 'Home' })
              } else {
                this.$message.error(result.meta.msg)
              }
            })
        } else {
          this.$message.error('数据输入不合法')
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;

  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
