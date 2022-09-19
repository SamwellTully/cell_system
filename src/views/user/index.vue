<template>
  <div>
    <!-- 用户列表卡片 -->
    <el-card class="box-card">
      <!-- 条件 -->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <!-- 添加新的条件查询 -->
        <el-button type="warning" icon="el-icon-plus" @click="addplus">添加</el-button>
      </el-form-item>
      <!-- 条件列表 -->
        <el-form-item  v-for="(item, index) in formInline.input" :key="index" >
       
        <el-select  style="width: 100px" v-if="item.contain" v-model="item.contain" placeholder="请选择">
          <el-option
            v-for="items in containwith"
            :key="items.value"
            :label="items.label"
            :value="items.value">
            <span style="color: #8492a6; font-size: 13px">{{ items.label }}</span>
          </el-option>
        </el-select>
       
        

          <el-select  style="width: 180px" v-model="item.type" placeholder="请选择">
            <el-option
              v-for="items in firstColumn"
              :key="items.value"
              :label="items.label"
              :value="items.value">
              <span style="color: #8492a6; font-size: 13px">{{ items.label }}</span>
            </el-option>
          </el-select>
        
          <el-input style="width: 250px" clearable v-model="item.input" placeholder="请输入" ></el-input>
          <el-button v-if="item.id" type="primary" icon="el-icon-search" @click="deleteid(item.id)"></el-button>
          
          
        </el-form-item>
        <br/>
        <el-form-item>
           <el-button type="warning" icon="el-icon-plus" @click="addUserButton=true">添加</el-button>
           <!-- 添加新用户 -->
            <el-button icon="el-icon-refresh" @click="reset">清空</el-button>
          <el-button type="primary" icon="el-icon-search" @click="multisearch">查询</el-button>
          <!-- 在用户中查询数据 -->
        </el-form-item>
      </el-form>
      <!-- 表格内容显示区域   -->
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%; height: 100%;"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'12px,0px'}"
        :header-cell-style="{padding:'12px,0px'}"
            >
        <el-table-column
          fixed
          prop="userIdtemp"   
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
        show-overflow-tooltip
          prop="institutionName"
          label="机构名称"
          width="listWidth">
        </el-table-column>
        <el-table-column
        show-overflow-tooltip
          prop="institutionType"
          label="机构类型"
          width="listWidth">
        </el-table-column>
           <el-table-column
           show-overflow-tooltip
          prop="userName"
          label="联系人姓名"
          width="100px">
        </el-table-column>
        <el-table-column
        show-overflow-tooltip
          prop="userOperatorName"
          label="操作名"
          width="70px">
        </el-table-column>
        <el-table-column
        show-overflow-tooltip
          prop="userPhoneNum"
          label="联系人电话"
          width="100px">
        </el-table-column>
        <el-table-column
        show-overflow-tooltip
          prop="userEmail"
          label="联系人邮箱"
          width="100px">
        </el-table-column>
        <!-- <el-table-column
        show-overflow-tooltip
          prop="userPrivileges"
          label="用户权限"
          width="listWidth">
        </el-table-column> -->
        <el-table-column
        show-overflow-tooltip
          prop="institutionInstruction"
          label="机构简介"
          width="listWidth">
           <!-- <template slot-scope="scope" > 
            <el-popover popper-class="area_popper" offset=-150 trigger="hover" :open-delay=0 :close-delay=0 placement="top" >
                <p class="showText">{{ scope.row.institutionInstruction }}</p>
                <div slot="reference" >{{ scope.row.institutionInstruction.length > 6? scope.row.institutionInstruction.slice(0, 6) + '...' : scope.row.institutionInstruction}}</div>
            </el-popover>
          </template> -->
        </el-table-column>
        <el-table-column
        show-overflow-tooltip
          prop="institutionAddress"
          label="通讯地址"
          width="listWidth">
          <!-- <template slot-scope="scope" > 
            <el-popover popper-class="area_popper" offset=-150 trigger="hover" :open-delay=0 :close-delay=0 placement="top">
                <p class="showText">{{ scope.row.institutionAddress }}</p>
                <div slot="reference" >{{ scope.row.institutionAddress.length > 6? scope.row.institutionAddress.slice(0, 6) + '...' : scope.row.institutionAddress}}</div>
            </el-popover>
          </template> -->
        </el-table-column>
        <el-table-column
        show-overflow-tooltip
          prop="institutionPostalCode"
          label="机构代码"
          width="listWidth">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150px">
          <template slot-scope="scope">
            <el-button @click="editdata(scope.row)" type="success" size="small" >编辑</el-button>
            <el-button type="danger" size="small" @click="userdelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--   分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage1"
        
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="TotalPageNum">
      </el-pagination>



      <!-- 用户注册 -->
    </el-card>
     <div class="register-container">
      <el-dialog class="register-container" title="注册申请提交" :visible.sync="addUserButton"  width="50%">
        <el-form :inline="true"  :model="formInlineAdd">
          <el-form-item label="机构名称" label-width="100px">
            <el-input v-model="formInlineAdd.institutionName" autocomplete="off" placeholder="请输入机构名称" />
          </el-form-item>
          <el-form-item label="机构类型" label-width="100px">
            <el-input v-model="formInlineAdd.institutionType" autocomplete="off" placeholder="请输入机构类型" />
          </el-form-item>
          <el-form-item label="机构简介" label-width="100px">
            <el-input v-model="formInlineAdd.institutionInstruction" autocomplete="off" placeholder="请输入机构简介" />
          </el-form-item>
          <el-form-item label="通讯地址" label-width="100px">
            <el-input v-model="formInlineAdd.institutionAddress" autocomplete="off" placeholder="请输入通讯地址" />
          </el-form-item>
          <el-form-item label="机构代码" label-width="100px">
            <el-input v-model="formInlineAdd.institutionPostalCode" autocomplete="off" placeholder="请输入机构代码" />
            <div v-text="'机构代码仅限六位数字、字符或特殊字符组成'" v-if="!AddCode"></div>
          </el-form-item>
          <el-form-item label="联系人姓名" label-width="100px">
            <el-input v-model="formInlineAdd.userName" autocomplete="off" placeholder="请输入联系人姓名" />
          </el-form-item>
          <el-form-item label="联系人电话" label-width="100px">
            <el-input v-model="formInlineAdd.userPhoneNum" autocomplete="off" placeholder="请输入联系人电话" />
            <div v-text="'电话号码不正确'" v-if="!AddPhone"></div>
          </el-form-item>
          <el-form-item label="联系人邮箱" label-width="100px">
            <el-input v-model="formInlineAdd.userEmail" autocomplete="off" placeholder="请输入联系人邮箱" />
            <div v-text="'邮箱不正确'" v-if="!AddEmail"></div>
          </el-form-item>
          <el-form-item label="权限申请" label-width="100px">
            <el-select v-model="formInlineAdd.userPrivileges" placeholder="请选择您要申请的权限">
              <el-option label="一级用户" value="1"></el-option>
              <el-option label="二级用户" value="2"></el-option>
              <el-option label="三级用户" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作名" label-width="100px">
            <el-input v-model="formInlineAdd.userOperatorName" autocomplete="off" placeholder="请输入操作名" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addUserButton = false">取 消</el-button>
          <el-button type="primary" @click="adduser">添加</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 用户修改 -->
    <div class="edit-container">
      <el-dialog class="edit-container" title="修改提交" :visible.sync="eidt"  width="50%">
        <el-form :inline="true" style="color: #fff;"  :model="formInlineEdit">
          <el-form-item label="机构名称" label-width="100px">
            <el-input v-model="formInlineEdit.institutionName"  placeholder="请输入机构名称" />
          </el-form-item>
          <el-form-item label="机构类型" label-width="100px">
            <el-input v-model="formInlineEdit.institutionType"  placeholder="请输入机构类型" />
          </el-form-item>
          <el-form-item label="机构简介" label-width="100px">
            <el-input v-model="formInlineEdit.institutionInstruction"  placeholder="请输入机构简介" />
          </el-form-item>
          <el-form-item label="通讯地址" label-width="100px">
            <el-input v-model="formInlineEdit.institutionAddress"  placeholder="请输入通讯地址" />
          </el-form-item>
          <el-form-item label="机构代码" label-width="100px">
            <el-input v-model="formInlineEdit.institutionPostalCode" placeholder="请输入机构代码" />
          </el-form-item>
          <el-form-item label="联系人姓名" label-width="100px">
            <el-input v-model="formInlineEdit.userName" placeholder="请输入联系人姓名" />
          </el-form-item>
          <el-form-item label="联系人电话" label-width="100px">
            <el-input v-model="formInlineEdit.userPhoneNum"  placeholder="请输入联系人电话" />
          </el-form-item>
          <el-form-item label="联系人邮箱" label-width="100px">
            <el-input v-model="formInlineEdit.userEmail"  placeholder="请输入联系人邮箱" />
          </el-form-item>
          <el-form-item label="权限申请" label-width="100px">
            <el-select v-model="formInlineEdit.userPrivileges" placeholder="请选择您要申请的权限">
              <el-option label="管理员" value="2"></el-option>
              <el-option label="用户" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="登录密码" label-width="100px">
            <el-input v-model="formInlineEdit.userPassword" type="password"  placeholder="请输入密码" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="eidt = false">取 消</el-button>
          <el-button type="primary" @click="change">修改</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<style>

</style>

<script>
import Axios from 'axios'
export default {
  name: 'Users',
  data () {
    return {
      url: "http://8.134.49.56:8000",
      //多条件数据
      currentid:0,
      formInline:{
        input:[{
        id:0,
        contain:'',
        type:'机构名称',
        input:''}]
      },
      //条件连接数据
      containwith:[{
        value:'andwith',
        label:'并含'
      },{
        value:'orwith',
        label:'或含'
      },{
        value:'nowith',
        label:'不含'
      },
      ],
      //条件数据
      firstColumn: [{
        value:'institutionName',
        label:'机构名称',
      },{
        value:'institutionType',
        label:'机构类型',
      },{
        value:'institutionInstruction',
        label:'机构简介',
      },{
        value:'institutionAddress',
        label:'通讯地址',
      },{
        value:'institutionPostalCode',
        label:'机构代码',
      },{
        value:'userName',
        label:'联系人姓名',
      },{
        value:'userPhoneNum',
        label:'联系人电话',
      },{
        value:'userEmail',
        label:'联系人邮箱',
      },{
        value:'userPrivileges',
        label:'用户权限',
      },{
        value:'userOperatorName',
        label:'操作名',
      },],
      //用户权限
      userPrivileges: [{
        value: '1',
        label: '一级用户'
      }, {
        value: '2',
        label: '二级用户'
      }, {
        value: '3',
        label: '三级用户'
      }],

      //添加界面数据
      addUserButton:false,
      formInlineAdd: {
        institutionName:'',
        institutionType:'',
        institutionInstruction:'',
        institutionAddress:'',
        institutionPostalCode:'',
        userName:'',
        userPhoneNum:'',
        userEmail:'',
        userPrivileges:'',
        userOperatorName:''
      },
      AddPhone:false,
      AddEmail:false,
      AddCode:false,
      //编辑相关
      eidt:false,//是否编辑操作
      editFormChanged:false,
      isChange:false,
      formInlineEditTempt: {
        institutionName:'',
        institutionType:'',
        institutionInstruction:'',
        institutionAddress:'',
        institutionPostalCode:'',
        userName:'',
        userPhoneNum:'',
        userEmail:'',
        userPrivileges:'',
        userOperatorName:''
      },
      formInlineEdit: {
        institutionName:'',
        institutionType:'',
        institutionInstruction:'',
        institutionAddress:'',
        institutionPostalCode:'',
        userName:'',
        userPhoneNum:'',
        userEmail:'',
        userPrivileges:'',
        userOperatorName:''
      },
      // value: '',
      //展示相关
      currentPage1: 1,
      pageSize:8,
      tableDataAll:[],
      tableData:[],
      tableSearchData:[],
      TotalPageNum:0,
      
    }
  },
  methods: {
    //添加新条件
    addplus(){
      this.currentid+=1
      this.formInline.input.push({
        id:this.currentid,
        contain:'并含',
        type:'机构名称',
        input:'',
      })
    },
    //删除条件
    deleteid(nowid){
      let i=0
      for(i;i<this.formInline.input.length;i++){
        if(this.formInline.input[i].id==nowid){
          break
        }
      }
      this.formInline.input.splice(i,1)
      console.log(this.formInline.input)
    },
    //重置条件
    reset(){
      this.formInline={
        input:[{
        id:0,
        contain:'',
        type:'机构名称',
        input:''}]
      }
      this.multisearch()
    },
    //多条件查询
    multisearch(){
      this.currentPage1=1
      var str='';
      for(let j = 0,len=this.formInline.input.length; j < len; j++) {
        //初始条件关联设置
        if(this.formInline.input[j].contain=='并含'){
          this.formInline.input[j].contain='andwith'
        }
        //初始条件设置
        if(this.formInline.input[j].type=='机构名称'){
          this.formInline.input[j].type='institutionName'
        }
//条件之间的关系
         if(this.formInline.input[j].contain=='andwith'){
          str +='&&'
           console.log(str)
        }else if(this.formInline.input[j].contain=='orwith'){
          str +='||'
           console.log(str)
        }else if(this.formInline.input[j].contain=='nowith'){
          str +='&&!'
          console.log(str)
        }
        //条件语句形成
        if(this.formInline.input[j].type!='userPrivileges'){
          str += '(p.'+this.formInline.input[j].type+'==null'+'||p.'+this.formInline.input[j].type+'.indexOf(that.formInline.input['+j+'].input)!== -1)'
          console.log(str)
        }else{
          console.log(this.formInline.input[j].input)
          str += '(that.formInline.input['+j+'].input==null||p.userPrivileges == that.formInline.input['+j+'].input)'
          console.log(str)
        }
        

      }
      this.strtofunc(str)
      for(let i=0;i<this.tableSearchData.length;i++){
        this.tableSearchData[i].userIdtemp=i+1
      }
      console.log(this.tableSearchData)
      this.TotalPageNum=this.tableSearchData.length
      this.tableData = this.tableSearchData.slice((this.currentPage1-1)*this.pageSize,this.currentPage1*this.pageSize,)

    },
    //处理查询语句，同时返回查询数据
    strtofunc(str){
      let that = this
      this.tableSearchData=this.tableDataAll.filter((p)=>{
        return eval(str)
      })
    },

    //列表中  操作的编辑操作确定操作
    change(){
      // console.log(this.url+'/user/update')
      // console.log(this.formInline)
      
      if(!this.editFormChanged){
        console.log('没有变化')
        this.$message({
          type: 'info',
          message: '没有修改'
        });
      }else{
      let params = new URLSearchParams()
      
      params.append("institutionName",this.formInlineEdit.institutionName)
      params.append("institutionType",this.formInlineEdit.institutionType)
      params.append("institutionInstruction",this.formInlineEdit.institutionInstruction)
      params.append("institutionPostalCode",this.formInlineEdit.institutionPostalCode)
      params.append("institutionAddress",this.formInlineEdit.institutionAddress)
      params.append("userName",this.formInlineEdit.userName)
      params.append("userPhoneNum",this.formInlineEdit.userPhoneNum)
      params.append('userOperatorName',this.formInlineEdit.userOperatorName)
      params.append("userEmail",this.formInlineEdit.userEmail)
      params.append("hospitalAdminId",this.formInlineEdit.userPrivileges)
      
      console.log(params)
      Axios.post(this.url+'/user/update',params).then(
            res => {
              if(res.data.code === 200){
                console.log(res.data)
              }
            }
          )
      Axios.get(this.url+`/admin/getUserPage`).then(
                  res => {
                    if(res.data.code === 200){
                      console.log("成功获得新数据")
                      console.log(res.data.data)
                      this.tableDataAll = res.data.data
                      this.TotalPageNum = res.data.data.length
                      this.$message({
                        type: 'success',
                        message: '修改成功'
                      });  
                      this.eidt = false
                      this.isChange=true
                      this.$router.replace({
                          path: '/userblank',
                          name: 'Userblank'
                        })
                    }else{
                      this.$message({
                        type: 'info',
                        message: '错误'
                      });  
                    }
                  }
               )
      }

      
    },
    //列表上  添加用户
    adduser(){
      // this.addUserButton=false
      // console.log('tanchuang')

console.log(this.formInlineAdd)
      if (this.AddEmail==true&&this.AddPhone==true&&this.AddCode==true) {
        //&& this.formInlineAdd.userPassword != ''&& this.formInlineAdd.institutionName != ''
      let params = new URLSearchParams()
      
      params.append("institutionName",this.formInlineAdd.institutionName)
      params.append("institutionType",this.formInlineAdd.institutionType)
      params.append("institutionInstruction",this.formInlineAdd.institutionInstruction)
      params.append("institutionPostalCode",this.formInlineAdd.institutionPostalCode)
      params.append("institutionAddress",this.formInlineAdd.institutionAddress)
      params.append("userName",this.formInlineAdd.userName)
      params.append("userPhoneNum",this.formInlineAdd.userPhoneNum)
      params.append("userOperatorName",this.formInlineAdd.userOperatorName)
      params.append("userName",this.formInlineAdd.userPrivileges)
      params.append("userEmail",this.formInlineAdd.userEmail)
      params.append("hospitalAdminId",this.formInlineAdd.userPrivileges)
      
      console.log(params)
      
      console.log(params)
      Axios.post(this.url+'/user/register',params).then(
            res => {
              console.log(res)
              if(res.data.code === 200){
                Axios.get(this.url+`/admin/getUserPage`).then(
                  res => {
                    console.log(res)
                    console.log(res.data)
                    if(res.data.code === 200){
                      this.tableDataAll = res.data.data
                      this.TotalPageNum = res.data.data.length
                      this.$message({
                        type: 'success',
                        message: '添加成功'
                      });  
                      this.addUserButton=false
                      this.formInlineAdd={
        institutionName:'',
        institutionType:'',
        institutionInstruction:'',
        institutionAddress:'',
        institutionPostalCode:'',
        userName:'',
        userPhoneNum:'',
        userEmail:'',
        userPrivileges:'',
        userOperatorName:''
      }
      this.AddPhone=false
      this.AddEmail=false
      this.AddCode=false
       this.$router.replace({
                          path: '/userblank',
                          name: 'Userblank'
                        })
                    }
                  }
               )
              }
              else if(res.data.code === 500){
                console.log("afeafwf")
              this.$message({
                  type: 'error',
                  message: res.data.msg
                });  
              }
              else{
                this.$message({
                    type: 'info',
                    message: '电话号码、邮箱或机构代码错误'
                });  
              }
            }
          )
      }else{
        this.$message({
          message: '参数不能为空',
          type: 'warning'
        })
      }
      
      // console.log(this.url+`/admin/addAdmin?admin_name=${this.formInline.userName}&admin_phoneNum=${this.formInline.userPhoneNum}&admin_email=${this.formInline.userEmail}&admin_realName=${this.formInline.userOperatorName}&admin_password=${this.formInline.userPassword}&admin_address=${this.formInline.institutionAddress}`)
      
      // Axios.get(this.url+`/admin/addAdmin?admin_name=${this.formInline.userName}&admin_phoneNum=${this.formInline.userPhoneNum}&admin_email=${this.formInline.userEmail}&admin_realName=${this.formInline.userOperatorName}&admin_password=${this.formInline.userPassword}&admin_address=${this.formInline.institutionAddress}`).then(
      //       res => {
      //         console.log(res)
      //         if(res.data.code === 200){
      //           console.log(res)
      //           Axios.get(this.url+`/admin/getUserPage`).then(
      //             res => {
      //               if(res.data.code === 200){
      //                 this.tableDataAll = res.data.data
      //                 this.TotalPageNum = res.data.data.length
      //                 this.eidt=false
      //                 this.$message({
      //                   type: 'success',
      //                   message: '添加成功'
      //                 });  
      //                           }
      //              else{
      //                 this.$message({
      //                   type: 'info',
      //                   message: '错误'
      //                 });  
      //               }
      //             }                
      //          )
      //         }
      //       }
      //     )
    },
    //列表中  操作的编辑操作
    editdata(row) {
      console.log(row)
      for(var key in  row){
        this.formInlineEdit[key]=row[key]
        this.formInlineEditTempt[key]=row[key]
      }
      
        console.log("formInlineEdit")
        console.log(this.formInlineEdit)
        console.log("formInlineEditTempt")
        console.log(this.formInlineEditTempt)
        this.eidt=true
      },
    //列表中  操作的删除操作
    userdelete(row){
      var that = this
      this.$confirm('确定要删除该用户','警告',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(function(){
        Axios.get(that.url+`/user/del?id=${row.userId}`).then(
            res => {
              if(res.data.code === 200){
                console.log("成功删除用户")
                console.log(row.userId)
                Axios.get(that.url+`/admin/getUserPage`).then(
                  res => {
                    if(res.data.code === 200){
                      that.tableDataAll = res.data.data
                      that.TotalPageNum = res.data.data.length
                      if(that.currentPage1>that.TotalPageNum/that.pageSize){
                        that.currentPage1=that.TotalPageNum/that.pageSize
                      }
                    that.tableData = that.tableDataAll.slice((that.currentPage1-1)*this.pageSize,that.currentPage1*this.pageSize,)
                    that.$message({
                    type: 'success',
                    message: '删除成功!'})
                    }else{
                      that.$message({
                        type: 'info',
                        message: '错误'
                      });  
                    }
                  }
                )
              }
            }
          )
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });      
        });
      },
    
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
//列表分页管理
    handleCurrentChange (val) {
      this.currentPage1=val
      // console.log(this.currentPage1)
      // console.log(this.tableDataAll.slice((this.currentPage1-1)*this.pageSize,this.currentPage1*this.pageSize,))
      if(this.tableSearchData.length!=0 && this.tableSearchData.length !== this.tableDataAll.length){
        this.tableData = this.tableSearchData.slice((this.currentPage1-1)*this.pageSize,this.currentPage1*this.pageSize,)
      }else{
        this.tableData = this.tableDataAll.slice((this.currentPage1-1)*this.pageSize,this.currentPage1*this.pageSize,)

      }
      
    }
  },
  watch:{
    
    'formInlineAdd.userPhoneNum':{
      handler(val){
    this.AddPhone = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/.test(val)
        console.log(this.AddPhone)

      }
    },
    'formInlineEdit.institutionPostalCode':{
      handler(val){
      this.AddCode = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).6/.test(val)
        console.log(this.AddCode)
      }
    },
    'formInlineAdd.userEmail':{
      handler(val){
    this.AddEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(val)
        console.log(this.AddEmail)
      }
    },
    formInlineEdit:{
      handler(val,oldval){
        console.log(val)
       for (let i in this.formInlineEdit) {
        if (val[i] != this.formInlineEditTempt[i]) {
          this.editFormChanged = true;
          console.log("xiugai")
          break;
        } else {
          this.editFormChanged = false;
          console.log("meiyou  xiugai ")
        }
      }
    },
    deep: true
    },
    formInline:{
      handler(val){
        if(val){
          this.multisearch()
        }
      },
      deep: true
    }
},

  mounted() {
    console.log(this.url+`/admin/getUserPage`),
    Axios.get(this.url+`/admin/getUserPage`).then(
      res => {
        if(res.data.code === 200){
          console.log(res)
          this.tableDataAll = res.data.data
          this.TotalPageNum = res.data.data.length
          for(let i=0;i<this.tableDataAll.length;i++){
      console.log(this.tableDataAll)
          this.tableDataAll[i].userIdtemp=i+1
        }
    console.log(this.tableDataAll.slice((this.currentPage1-1)*this*this.pageSize,this.currentPage1*this.pageSize,))
    this.tableData = this.tableDataAll.slice((this.currentPage1-1)*this.pageSize,this.currentPage1*this.pageSize,)
        }
      }
    )

    this.isChange = false
  }, 
   
}


</script>