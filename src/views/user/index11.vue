<template>
  <div>
    <!-- 用户列表卡片 -->
    <el-card class="box-card">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <!-- <el-form-item v-show="isformInline.isChange">
          <el-select  
          @blur="isformInline.isChange=false" 
          v-model="showfirst" placeholder="请选择">
            <el-option
              v-for="item in firstColumn"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @click.native="replaceFirstColumn(item.value,item.label)">
              <span style="color: #8492a6; font-size: 13px">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="!isformInline.isChange" v-if="!(addedColumn.length-1)">
           <el-button icon="el-icon-refresh" @click="isformInline.isChange=true">条件替换</el-button>
        </el-form-item> -->

        <el-form-item v-show="isformInline.isAdd">
          <el-select multiple  v-model="addedColumn"
          @blur="isformInline.isAdd=false"
          @remove-tag="removeTag" placeholder="请选择">
            <el-option
              v-for="item in firstColumn"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @click.native="addColumn(item.label,item.value)"
              >
              <span style="color: #8492a6; font-size: 13px">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="!isformInline.isAdd">
          <el-button icon="el-icon-refresh" @click="isformInline.isAdd=true">添加查询</el-button>
        </el-form-item>
       <el-form-item style="margin-left: 10px">
          <el-button icon="el-icon-refresh" @click="resetSelect">重置查询</el-button>
          
         
        </el-form-item>
         <el-form-item style="margin-left: 10px">
          <el-button icon="el-icon-refresh" @click="reset">清空输入</el-button>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          
         
        </el-form-item>
        <el-form-item>
           <el-button type="warning" icon="el-icon-plus" @click="addUserButton=true">添加</el-button>
        </el-form-item>
     
<br/>
        <el-form-item label="机构代码" v-show="isformInline.isinstitutionName" label-width="100px">
          <el-input clearable v-model="formInline.institutionName" placeholder="请输入机构代码"></el-input>
        </el-form-item>
        <el-form-item label="机构类型" v-show="isformInline.isinstitutionType" label-width="100px">
          <el-input clearable v-model="formInline.institutionType" placeholder="请输入机构类型"></el-input>
        </el-form-item>

        <el-form-item label="联系人姓名" v-show="isformInline.isuserName" label-width="100px">
          <el-input clearable v-model="formInline.userName" placeholder="请输入联系人姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话" v-show="isformInline.isuserPhoneNum" label-width="100px">
          <el-input clearable v-model="formInline.userPhoneNum" placeholder="请输入联系人电话"></el-input>
        </el-form-item>
        <el-form-item label="联系人邮箱" v-show="isformInline.isuserEmail" label-width="100px">
          <el-input clearable v-model="formInline.userEmail" placeholder="请输入联系人邮箱"></el-input>
        </el-form-item>
        <el-form-item label="权限申请" v-show="isformInline.isuserPrivileges" label-width="100px">
          <el-select clearable v-model="formInline.userPrivileges" placeholder="请选择">
            <el-option
              v-for="item in userPrivileges"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="操作名" v-show="isformInline.isuserOperatorName" label-width="100px">
          <el-input clearable v-model="formInline.userOperatorName" placeholder="请输入操作名"></el-input>
        </el-form-item>

        <el-form-item label="机构简介"  v-show="isformInline.isinstitutionInstruction" label-width="100px">
          <el-input clearable v-model="formInline.institutionInstruction"  placeholder="请输入机构简介"></el-input>
        </el-form-item>
        <el-form-item label="通讯地址" v-show="isformInline.isinstitutionAddress" label-width="100px">
          <el-input clearable v-model="formInline.institutionAddress" placeholder="请输入通讯地址"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" v-show="isformInline.isinstitutionPostalCode" label-width="100px">
          <el-input clearable v-model="formInline.institutionPostalCode" placeholder="请输入邮政编码"></el-input>
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
          prop="userId"   
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
        show-overflow-tooltip
          prop="institutionName"
          label="机构代码"
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
        <el-table-column
        show-overflow-tooltip
          prop="userPrivileges"
          label="权限申请"
          width="listWidth">
        </el-table-column>
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
          label="邮政编码"
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
      <!-- <el-pagination
        style="padding-top: 15px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage1"
        :page-size="100"
        layout="total, prev, pager, next, jumper"
        :total="TotalPageNum">
      </el-pagination> -->
    </el-card>
     <div class="register-container">
      <el-dialog class="register-container" title="注册申请提交" :visible.sync="addUserButton"  width="50%">
        <el-form :inline="true"  :model="formInlineAdd">
          <el-form-item label="机构代码" label-width="100px">
            <el-input v-model="formInlineAdd.institutionName" autocomplete="off" placeholder="请输入机构代码" />
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
          <el-form-item label="邮政编码" label-width="100px">
            <el-input v-model="formInlineAdd.institutionPostalCode" autocomplete="off" placeholder="请输入邮政编码" />
          </el-form-item>
          <el-form-item label="联系人姓名" label-width="100px">
            <el-input v-model="formInlineAdd.userName" autocomplete="off" placeholder="请输入联系人姓名" />
          </el-form-item>
          <el-form-item label="联系人电话" label-width="100px">
            <el-input v-model="formInlineAdd.userPhoneNum" autocomplete="off" placeholder="请输入联系人电话" />
          </el-form-item>
          <el-form-item label="联系人邮箱" label-width="100px">
            <el-input v-model="formInlineAdd.userEmail" autocomplete="off" placeholder="请输入联系人邮箱" />
          </el-form-item>
          <el-form-item label="权限申请" label-width="100px">
            <el-select v-model="formInlineAdd.userPrivileges" placeholder="请选择您要申请的权限">
              <el-option label="管理员" value="2"></el-option>
              <el-option label="用户" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="登录密码" label-width="100px">
            <el-input v-model="formInlineAdd.userPassword" type="password" autocomplete="off" placeholder="请输入密码" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addUserButton = false">取 消</el-button>
          <el-button type="primary" @click="adduser">添加</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="edit-container">
      <el-dialog class="edit-container" title="修改提交" :visible.sync="eidt"  width="50%">
        <el-form :inline="true" style="color: #fff;"  :model="formInlineEdit">
          <el-form-item label="机构代码" label-width="100px">
            <el-input v-model="formInlineEdit.institutionName"  placeholder="请输入机构代码" />
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
          <el-form-item label="邮政编码" label-width="100px">
            <el-input v-model="formInlineEdit.institutionPostalCode" placeholder="请输入邮政编码" />
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
      //搜索相关
      formInline: {
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
      showfirst:'机构代码',
      addedColumn:['机构代码'],
      isformInline: {
        first:'isinstitutionName',
        isChange:false,
        isAdd:false,
        isinstitutionName:true,
        isinstitutionType:false,
        isinstitutionInstruction:false,
        isinstitutionAddress:false,
        isinstitutionPostalCode:false,
        isuserName:false,
        isuserPhoneNum:false,
        isuserEmail:false,
        isuserPrivileges:false,
        isuserOperatorName:false
      },
      //添加相关
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
        userOperatorName:'',
        userPassword:''
      },
      firstColumn: [{
        value:'isinstitutionName',
        label:'机构代码',
      },{
        value:'isinstitutionType',
        label:'机构类型',
      },{
        value:'isinstitutionInstruction',
        label:'机构简介',
      },{
        value:'isinstitutionAddress',
        label:'通讯地址',
      },{
        value:'isinstitutionPostalCode',
        label:'邮政编码',
      },{
        value:'isuserName',
        label:'联系人姓名',
      },{
        value:'isuserPhoneNum',
        label:'联系人电话',
      },{
        value:'isuserEmail',
        label:'联系人邮箱',
      },{
        value:'isuserPrivileges',
        label:'权限申请',
      },{
        value:'isuserOperatorName',
        label:'操作名',
      },],
      userPrivileges: [{
        value: '0',
        label: '0'
      }, {
        value: '1',
        label: '一级用户'
      }, {
        value: '2',
        label: '二级用户'
      }, {
        value: '3',
        label: '三级用户'
      }],
      //编辑相关
      eidt:false,
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
      listWidth:60,
      currentPage1: 1,
      pageSize:10,
      tableDataAll:[],
      tableData:[],
      tableSearchData:[],
      TotalPageNum:0,
      
    }
  },
  methods: {
    replaceFirstColumn(value,label){
      // console.log(value)
      // console.log(this.isformInline.first)
      // console.log(this.firstColumn)

//找到firstColumn中的对象
      let i = this.firstColumn.length
      while(i--){
        if(this.firstColumn[i].value===value){
          console.log('true')
          console.log(this.firstColumn[i].label)
          break
        }
      }
      console.log(i)
      //将找到的对象label赋值给str
      let str = this.firstColumn[i].label
      //在已添加数组addedColumn中找对应的数组下标
      let k = this.addedColumn.length
      while(k--){
        if(this.addedColumn[k]===str){
          break
        }
      }
      this.addedColumn.splice(k,1,label)
      console.log(this.addedColumn)
      if(this.isformInline[value]){
        this.$message({
                        type: 'warning',
                        message: '已有添加'
                      });  
      }else{
        this.isformInline[this.isformInline.first]=false
        this.isformInline[value]=true
        this.isformInline.first=value
      }
      
    },
    addColumn(label,value){
      // console.log(value)
      // console.log(this.isformInline[value])


      console.log(label)
      console.log(value)
      console.log(this.addedColumn)

      let j = this.addedColumn.length
      console.log(j)
      this.addedColumn.splice(j-1,1)
      console.log(this.addedColumn)

      while(j--){
        if(this.addedColumn[j]===label){
          break
        }
      }
      console.log("循环结束时的标号"+j)
      if(j===-1){
        this.addedColumn.push(label)
        console.log(this.addedColumn)
      }
      else{
        this.addedColumn.splice(j,1)
        console.log(this.addedColumn)
      }

      if(this.addedColumn.length===1){
        this.showfirst=label
      }else if(this.addedColumn.length===0){
        this.showfirst=null
      }




      
      let i = this.firstColumn.length
      // console.log("firstColumn的长度"+i)
      while(i--){
        if(this.firstColumn[i].label===label){
          break
        }
      }
      // console.log(i)

      this.isformInline[this.firstColumn[i].value]=!this.isformInline[this.firstColumn[i].value]
      
      
    },
    removeTag(key){
      console.log("传回的key是"+key)
      let i = this.firstColumn.length
      console.log("firstColumn的长度"+i)
      while(i--){
        if(this.firstColumn[i].label===key){
          break
        }
      }
     console.log('key位于firstcolumn的'+i)
     
      console.log(this.firstColumn[i].label)
      console.log(this.firstColumn[i].value)
      console.log(this.isformInline[this.firstColumn[i].value])
      this.isformInline[this.firstColumn[i].value]=false

      this.showfirst=this.addedColumn[0]
      this.isformInline.first=this.addedColumn[0]
      console.log(this.addedColumn)


      if(this.addedColumn.length==0){
        this.showfirst=null
        console.log("this.isformInline.first = " +this.isformInline.first)
        this.isformInline[this.isformInline.first]=false
      }
      
      
      
    },

    reset(){
      console.log('init')
      console.log(this.formInline)
      for(var key in  this.formInline){
        this.formInline[key]=''
      }
      console.log('last')
      console.log(this.formInline)
      this.search()
    },
    resetSelect(){
      this.showfirst='机构代码'
      this.isformInline={
        first:'isinstitutionName',
        isChange:false,
        isAdd:false,
        isinstitutionName:true,
        isinstitutionType:false,
        isinstitutionInstruction:false,
        isinstitutionAddress:false,
        isinstitutionPostalCode:false,
        isuserName:false,
        isuserPhoneNum:false,
        isuserEmail:false,
        isuserPrivileges:false,
        isuserOperatorName:false
      }
      this.addedColumn=['机构代码']
    },
    search(){
      console.log('this.formInline.institutionName')
      console.log(this.formInline.institutionName)
      
      this.tableSearchData=this.tableDataAll.filter((p)=>{
      //   if(this.formInline.institutionName==null&&this.formInline.institutionType==null&&this.formInline.institutionInstruction==null&&
      //   this.formInline.institutionAddress==null&&this.formInline.institutionPostalCode==null&&this.formInline.userName==null&&
      //   this.formInline.userPhoneNum==null&&this.formInline.userEmail==null&&this.formInline.userPrivileges==null&&
      //   this.formInline.userOperatorName==null){
      //     return tableData
      //   }else{
        console.log("p.institutionName  "+p.institutionName)
        console.log(p.institutionName.indexOf(this.formInline.institutionName))
        return  (p.institutionName==null||p.institutionName.indexOf(this.formInline.institutionName)!== -1 )&&
                (p.institutionType==null||p.institutionType.indexOf(this.formInline.institutionType)!==-1 )&&
                (p.institutionInstruction==null||p.institutionInstruction.indexOf(this.formInline.institutionInstruction)!==-1 )&&
                (p.institutionAddress==null||p.institutionAddress.indexOf(this.formInline.institutionAddress)!==-1 )&&
                (p.institutionPostalCode==null||p.institutionPostalCode.indexOf(this.formInline.institutionPostalCode)!==-1) &&
                (p.userName==null||p.userName.indexOf(this.formInline.userName)!==-1 )&&
                (p.userPhoneNum==null||p.userPhoneNum.indexOf(this.formInline.userPhoneNum)!==-1) &&
                (p.userEmail==null||p.userEmail.indexOf(this.formInline.userEmail)!==-1) &&
                (p.userPrivileges==null||p.userPrivileges == this.formInline.userPrivileges )&&
                (p.userOperatorName==null||p.userOperatorName.indexOf(this.formInline.userOperatorName)!==-1)
                

      
        })
      console.log(this.tableSearchData)
      this.TotalPageNum=this.tableSearchData.length
      this.tableData = this.tableSearchData.slice((this.currentPage1-1)*this.pageSize,this.currentPage1*this.pageSize,)
    },


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
      for(var key in this.formInlineEdit){
        params.append(key,this.formInlineEdit[key])
      }
      
      console.log(params)
      Axios.post(this.url+'/user/update',params).then(
            res => {
              if(res.data.code === 200){
                console.log(res.data.msg)
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
    adduser(){
      // this.addUserButton=false
      // console.log('tanchuang')

      if (this.formInlineAdd.userName != '' && this.formInlineAdd.userPassword != '' && this.formInlineAdd.institutionName != '') {
        let params = new URLSearchParams()
      for(var key in this.formInline){
        params.append(key,this.formInline[key])
      }
      
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
                    message: '错误'
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
                      if(that.currentPage1>that.TotalPageNum/this.pageSize){
                        that.currentPage1=that.TotalPageNum/this.pageSize
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

    handleCurrentChange (val) {
      this.currentPage1=val
      console.log(this.currentPage1)
      console.log(this.tableDataAll.slice((this.currentPage1-1)*this.pageSize,this.currentPage1*this.pageSize,))
      if(this.tableSearchData.length===0 && this.tableSearchData.length !== this.tableDataAll.length){
        this.tableData = this.tableDataAll.slice((this.currentPage1-1)*this.pageSize,this.currentPage1*this.pageSize,)
      }else{
        this.tableData = this.tableSearchData.slice((this.currentPage1-1)*this.pageSize,this.currentPage1*this.pageSize,)

      }
      
    }
  },
  watch:{
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
          this.search()
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
          console.log(this.tableDataAll.slice((this.currentPage1-1)*this*this.pageSize,this.currentPage1*this.pageSize,))
          this.tableData = this.tableDataAll.slice((this.currentPage1-1)*this.pageSize,this.currentPage1*this.pageSize,)
        }
      }
    )
    this.isChange = false
  }, 
   
}


</script>