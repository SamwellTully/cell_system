<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">
          细胞/干细胞管理系统
        </h3>
        <lang-select class="set-language" />
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-row style="margin-bottom:30px;">
        <el-button :loading="loading" style="width: 30%" type="primary"  @click.native.prevent="handleLogin">
          登录
        </el-button>

        <el-button class="thirdparty-button" style="width: 30%" type="primary" @click="getHosAndReg()">
          注册账号
        </el-button>
      </el-row>
      

      <div style="position:relative">
        <div class="tips">
          <span />
          <span />
        </div>
        <div class="tips">
          <span style="margin-right:18px;" />
          <span />
        </div>

        
      </div>
    </el-form>
    <div class="register-container">
      <el-dialog class="register-container" title="注册申请提交" :visible.sync="dialogFormVisible" :center="true" width="50%">
        <el-form :inline="true" style="color: #fff;"  :model="register">
          <el-form-item label="机构名称" :label-width="formLabelWidth">
            <el-input v-model="register.institutionName" autocomplete="off" placeholder="请输入法人机构名称" />
          </el-form-item>
          <el-form-item label="法人机构类型" :label-width="formLabelWidth">
            <el-input v-model="register.institutionType" autocomplete="off" placeholder="请输入法人机构类型" />
          </el-form-item>
          <el-form-item label="保存机构简介" :label-width="formLabelWidth">
            <el-input v-model="register.institutionInstruction" autocomplete="off" placeholder="请输入保存机构简介" />
          </el-form-item>
          <el-form-item label="通讯地址" :label-width="formLabelWidth">
            <el-input v-model="register.institutionAddress" autocomplete="off" placeholder="请输入通讯地址" />
          </el-form-item>
          <el-form-item label="邮政编码" :label-width="formLabelWidth">
            <el-input v-model="register.institutionPostalCode" autocomplete="off" placeholder="请输入邮政编码" />
          </el-form-item>
          <el-form-item label="联系人姓名" :label-width="formLabelWidth">
            <el-input v-model="register.userName" autocomplete="off" placeholder="请输入联系人姓名" />
          </el-form-item>
          <el-form-item label="联系人电话" :label-width="formLabelWidth">
            <el-input v-model="register.userPhoneNum" autocomplete="off" placeholder="请输入联系人电话" />
          </el-form-item>
          <el-form-item label="联系人邮箱" :label-width="formLabelWidth">
            <el-input v-model="register.userEmail" autocomplete="off" placeholder="请输入联系人邮箱" />
          </el-form-item>
          <el-form-item label="权限申请" :label-width="formLabelWidth">
            <el-select v-model="register.authorization" placeholder="请选择您要申请的权限">
              <el-option label="管理员" value="2"></el-option>
              <el-option label="用户" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="登录密码" :label-width="formLabelWidth">
            <el-input v-model="register.userPassword" type="password" autocomplete="off" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="选择所属医院" :label-width="formLabelWidth">
            <el-select v-model="register.belongHos" placeholder="请选择您要申请的医院">
              <el-option v-for="item in hospitals" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="registerf">注 册</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
//  import SocialSign from './components/SocialSignin'
import axios from 'axios'
export default {
  name: 'Login',
  //  components: { LangSelect, SocialSign },
  components: { LangSelect },
  data() {
    const validateUsername = (rule, value, callback) => {
      // if (!validUsername(value.trim())) {
      //   callback(new Error('请输入正确的用户名'))
      // } else {
      //   callback()
      // }
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入不少于6位的密码'))
      } else {
        callback()
      }
    }
    const validateCheckCode = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('请输入不少于6位的密码'))
      } else {
        callback()
      }
    }
    return {
      register: {
        institutionName: '',
        institutionType: '',
        institutionInstruction: '',
        institutionAddress:'',
        institutionPostalCode:'',
        userName: '',
        userPhoneNum: '',
        userEmail: '',
        authorization: '',
        userPassword: '',
        belongHos:'',
      },
      hospitals:[],
      disabled:false,
      time:0,
      btntxt:"重新发送",
      dialogFormVisible: false, // 注册弹框
      formLabelWidth: '130px',
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        checkCode: [{ required: true, trigger: 'blur', validator: validateCheckCode }],
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      verificationCode: "",
      url: "http://8.134.49.56:8000"
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      // this.$refs.loginForm.username.focus()
    } else if (this.loginForm.password === '') {
      // this.$refs.loginForm.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    getHosAndReg(){
      this.dialogFormVisible = true;
      this.$http.get("http://8.134.49.56:8000/hospitalAdmin/list").then((res) => {
        this.hospitals = [];
        let temp = [];
        for (var i = 0; i < res.data.data.length; i++) {
          let obj = {};
          obj.value = res.data.data[i]["hospitalName"];
          obj.label = res.data.data[i]["hospitalName"];
          temp.push(obj);
        }
        this.hospitals = temp;
      });
    },
    registerf() {
      // this.dialogFormVisible = false
      // eslint-disable-next-line eqeqeq
      if (this.register.userId != '' && this.register.userName != '' && this.register.userPwd != '' && this.register.userMark != '') {
        let params = new URLSearchParams();
        params.append("institutionName", this.register.institutionName);
        params.append("institutionType", this.register.institutionType);
        params.append("institutionInstruction", this.register.institutionInstruction);
        params.append("institutionPostalCode", this.register.institutionPostalCode);
        params.append("institutionAddress", this.register.institutionAddress);
        params.append("userEmail", this.register.userEmail);
        params.append("userOperatorName", this.register.userOperatorName);
        params.append("userPhoneNum", this.register.userPhoneNum);
        params.append("userName", this.register.userName);
        params.append("userPrivileges", 0);
        params.append("userPassword", this.register.userPassword);
        params.append("hospitalName",this.belongHos);
        axios.post(this.url + '/user/register', params)
          .then(res => {
            if (res.data.code === 200) {
              this.register = {}
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.dialogFormVisible = false
              console.log("注册成功")

            } else {
              this.$message.warning(res.data.msg)
            }
          })
      } else {
        this.$message({
          message: '参数不能为空',
          type: 'warning'
        })
      }
    },
    sendcode() {
                const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
                if (this.register.phoneNumber == '') {
                    this.$message({
                        message:'手机号不能为空',
                        type:'warning'
                    })
                    return
                }
                if (!reg.test(this.register.phoneNumber)) {
                    this.$message({
                        message:'请输入正确的手机号',
                        type:'warning'
                    })
                    return
                } else {
                  console.log("发送验证码成功")
                  // const data = this.register
                  // axios.post(this.url + '/user/getCheckCode', data)
                  //   .then(res => {
                  //     if (res.data.code === 20000) {
                  //       this.$message({
                  //       message: res.data.desc,
                  //       type: 'success'
                  //       });
                  //       this.time = 60;
                  //       this.disabled = true;
                  //       this.timer();
                  //     } else {
                  //     this.$message.error(res.data.desc)
                  //     }
                  //   });
                  }
           },
           //60S倒计时
            timer() {
                if (this.time > 0) {
                    this.time--;
                    this.btntxt = this.time + "s后重新获取";
                    setTimeout(this.timer, 1000);
                } else {
                    this.time = 0;
                    this.btntxt = "获取验证码";
                    this.disabled = false;
                }
            },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        // this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$root.username = this.loginForm.username
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
.register-container {
  .el-input {
    display: inline-block;
    width: 85%;

    input {
      background: #283443;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #fff;
      height: 47px;
      caret-color: #fff;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #283443 inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #283443;
    border-radius: 5px;
    color: #fff;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.el-input_regis {
  border-radius: 5px;
  color: blue;
}
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
.register-container {
  min-height: 100%;
  width: 100%;
  background-color: #2d3a4b;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #889aa4;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #eee;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
