<template>
  <div class="app-container">
    <el-form ref="form" v-model="form" label-width="120px">
      <el-form-item label="机构名称" prop="institutionName">
        <el-input  v-model="form.institutionName">
        </el-input>
      </el-form-item>
      <el-form-item label="法人机构类型" prop="institutionType" >
        <el-input  v-model="form.institutionType">
        </el-input>
      </el-form-item>
      <el-form-item label="保存机构简介" prop="institutionInstruction">
        <el-input  v-model="form.institutionInstruction">
        </el-input>
      </el-form-item>
      <el-form-item label="通讯地址" prop="institutionAddress">
        <el-input  v-model="form.institutionAddress">
        </el-input>
      </el-form-item>
      <el-form-item label="邮政编码" prop="institutionPostalCode">
        <el-input  v-model="form.institutionPostalCode">
        </el-input>
      </el-form-item>
      <el-form-item label="联系人姓名" prop="userName">
        <el-input  v-model="form.userName">
        </el-input>
      </el-form-item>
      <el-form-item label="联系人电话" prop="userPhoneNum">
        <el-input  v-model="form.userPhoneNum">
        </el-input>
      </el-form-item>
      <el-form-item label="联系人邮箱" prop="userEmail">
        <el-input  v-model="form.userEmail">
        </el-input>
      </el-form-item>
      <el-form-item label="用户权限">
        <el-select v-model="form.userPrivileges" @change="handleIsopenSelect">
          <el-option label="一级用户" value= 0 />
          <el-option label="二级用户" value= 1 />
          <el-option label="三级用户" value= 2 />
        </el-select>
      </el-form-item>
     <el-button type="primary" class="submit" @click="onSubmit">提交修改</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        institutionName:'',
        userId:'',
        institutionType:'',
        institutionInstruction:'',
        institutionAddress:'',
        institutionPostalCode:'',
        userName:'',
        userPhoneNum:'',
        userEmail:'',
        userPrivileges:''
      }
    }
  },
  created() {
    this.$store.dispatch('user/getInfo')
      .then((res) => {
        this.form.institutionName = res.institutionName
        this.form.userId = res.userId
        this.form.institutionType = res.institutionType
        this.form.institutionInstruction = res.institutionInstruction
        this.form.institutionAddress = res.institutionAddress
        this.form.institutionPostalCode = res.institutionPostalCode
        this.form.userName = res.userName
        this.form.userPhoneNum = res.userPhoneNum
        this.form.userEmail = res.userEmail
        // this.form.userPrivileges = res.userPrivileges
        if(res.userPrivileges == 0){
          this.form.userPrivileges = "一级用户"
        }else if(res.userPrivileges == 1){
          this.form.userPrivileges = "二级用户"
        }else{
          this.form.userPrivileges = "三级用户"
        }
      }).catch(() => {

      });
  },
  methods: {
    handleIsopenSelect() {
	      this.$forceUpdate()
	   },
    onSubmit() {
     this.$store.dispatch('user/update', this.form)
       .then((res) => {
        this.$message({
                message: "修改成功",
                type: 'success'
              })
        }).catch(() => {

      });
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.submit{
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>

