<template>
    <div>
      <!-- 用户列表卡片 -->
      <el-card class="box-card">
        <!-- 条件 -->
        <div>
          <el-button type="danger" @click="handleTableVis=true" >未处理文件公开申请：{{this.tableMessageNum}}</el-button>
        </div>
        <br/>
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
          
            <el-input style="width: 250px" clearable v-model="item.input" placeholder="请输入信息对用户进行搜索" ></el-input>
            <el-button v-if="item.id" type="primary" icon="el-icon-search" @click="deleteid(item.id)"></el-button>
            
            
          </el-form-item>
          <br/>
          <el-form-item>
            <!-- <el-button type="warning" icon="el-icon-plus" @click="addUserButton=true">添加新管理员</el-button> -->
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
            style="width:100%;height:100%;"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'12px,0px'}"
            :header-cell-style="{padding:'12px,0px'}"
            >
                 <el-table-column
                 fixed
                 prop="hospitalId"
                 label="医院id"
                 width="listWidth">
                 </el-table-column>
                 <el-table-column
                 fixed
                 prop="institutionAddress"
                 label="机构地址"
                 width="listWidth">
                 </el-table-column>
                 <el-table-column
                 fixed
                 prop="institutionInstruction"
                 label="机构简介"
                 width="listWidth">
                 </el-table-column>
                 <el-table-column
                 fixed
                 prop="institutionName"
                 label="机构名称"
                 width="listWidth">
                 </el-table-column>
                 <el-table-column
                 fixed
                 prop="institutionPostalCode"
                 label="机构代码"
                 width="listWidth">
                 </el-table-column>
                 <el-table-column
                 fixed
                 prop="institutionType"
                 label="机构类型"
                 width="listWidth">
                 </el-table-column>
                 <el-table-column
                 fixed
                 prop="userEmail"
                 label="用户邮箱"
                 width="listWidth">
                 </el-table-column>
                 <el-table-column
                 fixed
                 prop="userId"
                 label="用户id"
                 width="100px">
                 </el-table-column>
                 <el-table-column
                 fixed
                 prop="userName"
                 label="用户名"
                 width="100px">
                 </el-table-column>
                 <el-table-column
                 fixed
                 prop="userPhoneNum"
                 label="用户联系方式"
                 width="listWidth">
                 </el-table-column>
                 <el-table-column
                    fixed="right"
                    label="操作"
                    width="150px">
                    <template slot-scope="scope">
                        <!-- <el-button @click="editdata(scope.row)" type="success" size="small" >编辑</el-button> -->
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
  
      </el-card>

      <div class="handleTable-container">
        <el-dialog class="handleTable-container" title="处理表文件公开申请" :visible.sync="handleTableVis" width="80%">
          <el-table :data="tableHandleForm" border style="width: 100%" :row-key="getRowKeys">
            <el-table-column prop="adminInfo" label="管理员意见" align="center"></el-table-column>
            <el-table-column
                  prop="adminState"
                  header-align="center"
                  align="center"
                  label="管理员审核状态">
                <template v-slot="scope">
                    <span v-if="scope.row.adminState === 0">未审核</span>
                    <span v-if="scope.row.adminState === 1">拒绝</span>
                    <span v-if="scope.row.adminState === 3">通过</span>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="currentUserIdList" label="持有表用户id"></el-table-column> -->
            <!-- <el-table-column prop="hospitalAdminId" label="医院管理员id"></el-table-column> -->
            <el-table-column prop="hospitalAdminInfo" label="医院管理员意见" align="center"></el-table-column>
            <el-table-column
                  prop="hospitalAdminState"
                  header-align="center"
                  align="center"
                  label="医院管理员审核状态">
                <template v-slot="scope">
                    <span v-if="scope.row.hospitalAdminState === 0">未审核</span>
                    <span v-if="scope.row.hospitalAdminState === 1">拒绝</span>
                    <span v-if="scope.row.hospitalAdminState === 3">通过</span>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="id" label="表请求id"></el-table-column> -->
            <!-- <el-table-column prop="lastHandletime" label="最后处理时间"></el-table-column> -->
            <el-table-column prop="requestUserIdList" label="请求表的用户id" align="center"></el-table-column>
            <!-- <el-table-column prop="tableId" label="表id"></el-table-column> -->
            <el-table-column prop="tableName" label="表名" align="center"></el-table-column>
            <el-table-column prop="userName" label="表持有者用户名" align="center"></el-table-column>
            <el-table-column label="审批" fixed="right" width="150px" align="center">
              <template slot-scope="scope">
                <el-button @click="handleTable(2,scope.row)" size="small" type="primary">同意</el-button>
                <el-button @click="handleTable(1,scope.row)" size="small" type="danger">拒绝</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="100px" align="center">
              <template slot-scope="scope">
                <el-button @click="showAttribute(scope.row)" size="small">查看</el-button>
              </template>
              <el-dialog  width="80%" title="详情" :visible.sync="showAttributeVis"
                    :append-to-body="true">
                    <el-table :data="attributeData" height="600">
                      <el-table-column v-for="(fieldkey, index) in fieldKeys" :key="index" :property="fieldkey"
                        :prop="fieldkey" :label="fieldkey"></el-table-column>
                    </el-table>
              </el-dialog>
            </el-table-column>
          </el-table>
        </el-dialog>
      </div>
    </div>
  </template>
  
  <style>
  
  </style>
  
  <script>
import Axios from 'axios';
import { readSync } from 'fs';
import {getToken,setToken} from '@/utils/auth';
  export default {
    name: 'Users',
    data () {
      return {
        showAttributeVis:false,
        attributeData:[],
        fieldKeys:["是否为枚举项","列名","数据类型","是否可以为空值","最小长度","最大长度","枚举项"],
        adminToken:'',
        handleRegVis:false,
        handleTableVis:false,
        regMessageNum:0,
        tableMessageNum:0,
        regForm:[],
        tableHandleForm:[],
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
          value:'institutionAddress',
          label:'机构地址',
        },{
          value:'institutionInstruction',
          label:'机构简介',
        },{
          value:'institutionName',
          label:'机构名称',
        },{
          value:'institutionPostalCode',
          label:'机构代码',
        },{
          value:'institutionType',
          label:'机构类型',
        },{
          value:'userEmail',
          label:'联系人邮箱',
        },{
          value:'userId',
          label:'用户id',
        },{
          value:'userName',
          label:'用户名',
        },{
          value:'userPhoneNum',
          label:'用户电话',
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
        
        //   formline数据
        //   institutionAddress:'',
        //   institutionInstruction:'',
        //   institutionName:'',
        //   institutionPostalCode:'',
        //   institutionType:'',
        //   userEmail:'',
        //   userId:'',
        //   userName:'',
        //   userPhoneNum:'',
        //添加界面数据
        addUserButton:false,
        formInlineAdd: {
          email:'',
          hospitalAddress:'',
          hospitalName:'',
          hpspitalInstruction:'',
          id:'',
          realName:'',
          telphoneNumber:'',
          userName:'',
          password:'',
        },
        AddPhone:false,
        AddEmail:false,
        AddCode:false,
        //编辑相关
        eidt:false,//是否编辑操作
        editFormChanged:false,
        isChange:false,
        formInlineEditTempt: {
          email:'',
          hospitalAddress:'',
          hospitalName:'',
          hpspitalInstruction:'',
          id:'',
          realName:'',
          telphoneNumber:'',
          userName:'',
          password:'',
        },
        formInlineEdit: {
          email:'',
          hospitalAddress:'',
          hospitalName:'',
          hpspitalInstruction:'',
          id:'',
          realName:'',
          telphoneNumber:'',
          userName:'',
          password:'',
        },
        // value: '',
        //展示相关
        currentPage1: 1,
        pageSize:8,
        tableDataAll:[],
        tableData:[],
        tableSearchData:[],
        TotalPageNum:0,
        getRowKeys(row) {
        //获取当前行的key
        return row.key;
      },
      }
    },
    async created() {
      await Axios.post(this.url + `/hospitalAdmin/login?username=南华附一&password=123456`).then(
        res => {
          this.adminToken = res.data.data
        }
      )

      Axios.get(this.url+`/hospitalAdmin/userList?token=${this.adminToken}`).then(
        res => {
          if(res.data.code === 200){
            // console.log(res)
            this.tableDataAll = res.data.data
            this.TotalPageNum = res.data.data.length
            // console.log(this.tableDataAll.slice((this.currentPage1-1)*this*this.pageSize,this.currentPage1*this.pageSize,))
            this.tableData = this.tableDataAll.slice((this.currentPage1-1)*this.pageSize,this.currentPage1*this.pageSize,)
            }
        }
    )
      Axios.get(this.url+`/requestPublish/hospitalAdminUnhandleList?token=${this.adminToken}`).then(
        res => {
          if(res.data.code === 200){
            this.tableMessageNum = res.data.data.length
            this.tableHandleForm = res.data.data
          }
        })
    this.isChange = false
    }, 
    methods: {
      showAttribute(row){
        this.showAttributeVis = true;
        let params = new URLSearchParams();
        params.append("tableName", row.tableName);
        this.$axios({
          method: 'post',
          url: "http://8.134.49.56:8000/G/Showattribute",
          data: params
        }).then((response) => {
          this.attributeData = response.data.data
          for(let i = 0;i < this.attributeData.length;i++){
            this.gridData[i]["是否为枚举项"] = this.gridData[i]["是否为枚举项"]=="true"?"是":"否";
            if(this.gridData[i]["数据类型"].includes("char")){
              this.gridData[i]["数据类型"] = "字符型";
            }else{
              this.gridData[i]["数据类型"] = "浮点型";
            }
            if(this.gridData[i]["是否可以为空值"].includes("YES")){
              this.gridData[i]["是否可以为空值"] = "是";
            }else{
              this.gridData[i]["是否可以为空值"] = "否";
            }
          }
        })
      },
      handleTable(opNum,row){
        this.$prompt('请输入批示意见', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          // inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          Axios.get(this.url + `/requestPublish/hospitalAdminHandle?requestId=${row.id}&approve=${opNum}&token=${this.adminToken}&info=${value}`).then(
          res => {
            if(res.data.code === 200){
              Axios.get(this.url+`/requestPublish/hospitalAdminUnhandleList?token=${this.adminToken}`).then(
                res => {
                  if(res.data.code === 200){
                    this.tableMessageNum = res.data.data.length
                    this.tableHandleForm = res.data.data
                  }
                })
              this.$message({
                type: 'success',
                message: '审批成功'
              });
            }else{
              this.$message({
              type: 'error',
              message: '审批失败:' + res.data.data
              });  
            }
          }
        )
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      },
      handleReg(opNum,row){
        Axios.get(this.url+`/admin/handleRegisterRequest?hospitalAdminRegisterId=${row.id}&approve=${opNum}`).then(
          res => {
            if(res.data.code === 200){
              Axios.get(this.url+`/hospitalAdmin/requestRegisterList`).then(
              res => {
                if(res.data.code === 200){
                  this.regMessageNum = res.data.data.length
                  var temp = null
                  this.regForm = []
                  for(let i = 0;i < res.data.data.length; i++){
                    temp = JSON.parse(res.data.data[i].jsonString)
                    temp.id = res.data.data[i].id
                    temp.info = res.data.data[i].info
                    // this.regForm.push({id:res.data.data[i].id , json:JSON.parse(res.data.data[i].jsonString) , info:res.data.data[i].info})
                    this.regForm.push(temp)
                  }
                  this.$message({
                      type: 'success',
                      message: '审批成功'
                  });
                }
              })
          }else{
            this.$message({
              type: 'error',
              message: '审批失败:' + res.data.data
            });  
          }
        })
      },
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
    //   change(){
    //     // console.log(this.url+'/user/update')
    //     // console.log(this.formInline)
        
    //     if(!this.editFormChanged){
    //       console.log('没有变化')
    //       this.$message({
    //         type: 'info',
    //         message: '没有修改'
    //       });
    //     }else{
    //     let params = new URLSearchParams()
        
    //     params.append("institutionName",this.formInlineEdit.institutionName)
    //     params.append("institutionType",this.formInlineEdit.institutionType)
    //     params.append("institutionInstruction",this.formInlineEdit.institutionInstruction)
    //     params.append("institutionPostalCode",this.formInlineEdit.institutionPostalCode)
    //     params.append("institutionAddress",this.formInlineEdit.institutionAddress)
    //     params.append("userName",this.formInlineEdit.userName)
    //     params.append("userPhoneNum",this.formInlineEdit.userPhoneNum)
    //     params.append('userOperatorName',this.formInlineEdit.userOperatorName)
    //     params.append("userEmail",this.formInlineEdit.userEmail)
    //     params.append("hospitalAdminId",this.formInlineEdit.userPrivileges)
        
    //     console.log(params)
    //     Axios.post(this.url+'/user/update',params).then(
    //           res => {
    //             if(res.data.code === 200){
    //               console.log(res.data)
    //             }
    //           }
    //         )
    //     Axios.get(this.url+`/admin/getUserPage`).then(
    //                 res => {
    //                   if(res.data.code === 200){
    //                     console.log("成功获得新数据")
    //                     console.log(res.data.data)
    //                     this.tableDataAll = res.data.data
    //                     this.TotalPageNum = res.data.data.length
    //                     this.$message({
    //                       type: 'success',
    //                       message: '修改成功'
    //                     });  
    //                     this.eidt = false
    //                     this.isChange=true
    //                     this.$router.replace({
    //                         path: '/userblank',
    //                         name: 'Userblank'
    //                       })
    //                   }else{
    //                     this.$message({
    //                       type: 'info',
    //                       message: '错误'
    //                     });  
    //                   }
    //                 }
    //              )
    //     }
  
        
    //   },
      //列表上  添加用户
      adduser(){
        // this.addUserButton=false
        // console.log('tanchuang')
  
        console.log(this.formInlineAdd)
        if (this.AddEmail==true&&this.AddPhone==true) {
          //&& this.formInlineAdd.userPassword != ''&& this.formInlineAdd.institutionName != ''
        let params = new URLSearchParams()
        
        params.append("email",this.formInlineAdd.email)
        params.append("hospital_address",this.formInlineAdd.hospitalAddress)
        params.append("hospital_name",this.formInlineAdd.hospitalName)
        params.append("hospital_instruction",this.formInlineAdd.hpspitalInstruction)
        // params.append("institutionAddress",this.formInlineAdd.id)
        params.append("real_name",this.formInlineAdd.realName)
        params.append("telphone_number",this.formInlineAdd.telphoneNumber)
        params.append("user_name",this.formInlineAdd.userName)
        params.append("password",this.formInlineAdd.password)

        
        console.log(params)
        
        console.log(params)
        Axios.get(this.url+'/hospitalAdmin/addHospitalAdmin',params).then(
              res => {
                console.log(res)
                if(res.data.code === 200){
                  Axios.get(this.url+`/hospitalAdmin/list`).then(
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
                        this.formInlineAd={
                        email:'',
                        hospitalAddress:'',
                        hospitalName:'',
                        hpspitalInstruction:'',
                        id:'',
                        realName:'',
                        telphoneNumber:'',
                        userName:'',
                        password:'',
                        }
            this.AddPhone=false
            this.AddEmail=false
            this.AddCode=false
            this.$router.replace({
                            path: '/authblank',
                            name: 'Authblank'
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
                      message: '电话号码、邮箱错误'
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
          Axios.get(that.url+`/hospitalAdmin/del?id=${row.id}`).then(
              res => {
                if(res.data.code === 200){
                  console.log("成功删除用户")
                  console.log(row.userId)
                  Axios.get(that.url+`/hospitalAdmin/list`).then(
                    res => {
                      if(res.data.code === 200){
                        that.tableDataAll = res.data.data
                        that.TotalPageNum = res.data.data.length
                        if(that.currentPage1>that.TotalPageNum/that.pageSize){
                          that.currentPage1=that.TotalPageNum/that.pageSize
                        }
                      that.tableData = that.tableDataAll.slice((that.currentPage1-1)*that.pageSize,that.currentPage1*that.pageSize,)
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
      
      'formInlineAdd.telphoneNumber':{
        handler(val){
      this.AddPhone = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/.test(val)
          console.log(this.AddPhone)
  
        }
      },
      'formInlineEdit.id':{
        handler(val){
        this.AddCode = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).6/.test(val)
          console.log(this.AddCode)
        }
      },
      'formInlineAdd.email':{
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
  
     
  }
  
  
  </script>