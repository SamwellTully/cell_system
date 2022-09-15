<template>
  <div class="app-container">
    <el-row :gutter="20" style="display: flex; align-items: center" type="flex" justify="center">

      <el-col :span="2">
        <div class="grid-content" ></div>
      </el-col>

      <el-col :span="9" >
        <div class="grid-content">
          <h3>{{this.chosenTable}}</h3>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="grid-content">
          <h3>
            目标文件<template>
              <el-select v-model="value" @change="handleSelectChange" style="margin-left: 10px" filterable>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </h3>
        </div>
      </el-col>
      <!-- <el-col :span="2">
        <div class="grid-content">
          <el-button type="primary" @click="clickSearch" style="width: 90px">搜索</el-button>
        </div>
      </el-col>
      <el-dialog title="点击选取映射表" :visible.sync="inputSearchVisable">
        <form>
          <el-input type="text" v-model="inputText" placeholder="请输入您要搜索的表名" />
          <table border="1" cellspacing="0">
            <table>
              <li v-for="data in newoptions" :key="data.value" @click="searchTable(data.value)">  
              data为在搜索中选中的表 -->
                <!-- {{data.value}}
              </li>
            </table>
          </table>
        </form>
      </el-dialog> -->
      <el-col :span="2">
        <div class="grid-content">
          <el-button type="primary" @click="add" style="width: 90px">关联</el-button>
        </div>
      </el-col>
      <el-col :span="2">
        <div class="grid-content">
          <el-button type="primary" @click="reMapSameField" style="width: 90px">同名匹配</el-button>
        </div>
      </el-col>
      <el-col :span="2">
        <div class="grid-content">
          <el-button type="primary" @click="showHistoricalMapping = true" style="width: 90px">历史映射</el-button>
        </div>
      </el-col>
      
      <el-dialog title="历史映射信息" :visible.sync="showHistoricalMapping">
        <el-table max-height="500" :data="historicalMapping" :row-click="clickHistoricalMapping">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" class="demo-table-expand">
                <el-form-item v-for="(key, value) in props.row.map" :key="key" label="">
                  <el-tag>{{ value }}</el-tag>
                  ==========
                  <el-tag>{{ key }}</el-tag>
                  <div v-show="props.row.relation[value]">
                    <div v-for="(rmap, rindex) in props.row.relation[value]" :key="rindex">
                      <div v-for="(rvalue, rkey) in rmap" :key="rkey">
                        <el-tag type="info">{{ rkey }}</el-tag><i class="el-icon-arrow-right"></i><i
                          class="el-icon-arrow-right"></i>
                        <el-tag type="info">{{ rvalue }}</el-tag>
                      </div>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column label="映射名称" prop="MapName"> </el-table-column>
          <el-table-column label="目标文件" prop="name"> </el-table-column>
          <el-table-column label="目标文件单位" prop="company"> </el-table-column>
          <el-table-column label="建立时间" prop="time"> </el-table-column>
          
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="setMapping(scope.row.map, scope.row.relation)" size="mini">应用</el-button>
              <el-button type="danger" @click="deleteHisMapping(scope.row.relation_id)" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-row>

    <el-row :gutter="20" style="display: flex; align-items: center" type="flex" justify="center">
      <el-col :span="9">
        <div class="grid-content">
          <template>
            <el-table ref="t1" :data="table1" border highlight-current-row @current-change="handleCurrentChange1"
              @row-click="rowclick1" style="width: 100%" height="230">
              <el-table-column fixed prop="key" label="源字段">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.flag === 1 ? 'info' : ''" disable-transitions>{{ scope.row.key }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="value" label="实例数据"> </el-table-column>
            </el-table>
          </template>
        </div>
      </el-col>

      <el-col :span="2">
        <div class="grid-content"></div>
      </el-col>

      <el-col :span="9">
        <div class="grid-content">
          <template>
            <el-table ref="t2" :data="table2" border highlight-current-row @current-change="handleCurrentChange2"
              @row-click="rowclick2" style="width: 100%" height="230">
              <el-table-column fixed prop="key" label="目标字段">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.flag === 1 ? 'info' : ''" disable-transitions>{{ scope.row.key }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column fixed prop="value" label="字段描述">
              </el-table-column>
            </el-table>
          </template>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="display: flex; align-items: center" type="flex" justify="center">
      <el-col :span="20">
        <div class="grid-content">
          <template>
            <h3>已关联字段</h3>
            <el-table :data="table3" border style="width: 100%" :row-key="getRowKeys" :expand-row-keys="expands"
              @expand-change="expandSelect">
              <el-table-column prop="key" label="源字段"> </el-table-column>
              <el-table-column prop="value" label="目的字段"> </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="clickbtn(scope.row)" size="mini" style="margin-right: 50px">替换</el-button>
                  <el-button @click.native.prevent="deleteRow(scope.$index, table3)" size="mini" type="danger">
                    移除
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-card shadow="always">
                    <el-table :data="matchingValue" border style="width: 100%" :cell-style="{ background: '#FFFFFF' }">
                      <el-table-column prop="originalValue" label="源值">
                      </el-table-column>
                      <el-table-column prop="targetValue" label="目标值">
                      </el-table-column>
                      <el-table-column prop="right" label="操作">
                        <el-button @click.native.prevent="deleteRow2(props.row)" size="mini" type="danger">
                          移除
                        </el-button>
                      </el-table-column>
                    </el-table>
                  </el-card>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="内容替换" :visible.sync="dialogFormVisible">
      <div v-if="currentRow3 != null">
        <h3>{{ currentRow3["key"] }}</h3>
        <el-form :model="form" :rules="rules" ref="ruleForm" :inline="true" size="small">
          <el-form-item label="源值" prop="key">
            <!-- <el-select v-model="form.key" placeholder="请选择源值">
              <el-option v-for="(item, index) in originalSeletionData" :key="index" :label="item.enumeration" :value="item.enumeration">
              </el-option>
            </el-select> -->
            <el-input v-if="!fileisMulSelection" v-model="form.key" clearable placeholder="请输入源值"></el-input>
            <el-select v-if="fileisMulSelection" v-model="form.key" placeholder="请选择源值">
              <el-option v-for="(item, index) in originalSeletionData" :label="item.enumeration" :value="item.enumeration"
                :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目标值" prop="value">
            <el-input v-if="!isMulSelection" v-model="form.value" clearable placeholder="请输入目标值"></el-input>
            <el-select v-if="isMulSelection" v-model="form.value" placeholder="请选择目标值">
              <el-option v-for="(item, index) in mulSelectionData" :label="item.enumeration" :value="item.enumeration"
                :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位" prop="unit" v-if="isWithUnit">
            <el-select v-model="form.unit" placeholder="请选择单位">
              <el-option v-for="(item, index) in unitData" :key="index" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="replacement()">确 定</el-button>
      </div>
    </el-dialog>
    <el-row :gutter="20" style="display: flex; align-items: center" type="flex" justify="center">
      <el-col :span="6">
        <div class="grid-content"></div>
      </el-col>

      <!-- <el-col :span="6">
        <div class="grid-content">
          <el-button @click="saveMappingsInput()" type="primary" style="width: 100%">保存映射</el-button>
        </div>
      </el-col> -->
      <el-col :span="6">
        <div class="grid-content"></div>
      </el-col>
    </el-row>
    <el-dialog class="input-container" title="请输入映射名称" :visible.sync="mappingNameVisable" :center="true">
      <el-input v-model="mappingName"></el-input>
      <el-row></el-row>
      <el-row :gutter="20" style="display: flex; align-items: center" type="flex" justify="center">

        <!-- 作空格用 -->
        <el-col :span="6">
          <div class="grid-content"></div> 
        </el-col>

        <el-col :span="6">
          <div class="grid-content">
            <el-button type="primary" @click="saveMappings()" style="width: 100%">提 交</el-button>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="grid-content"></div>
        </el-col>

      </el-row>
      
    </el-dialog>
    <el-row :gutter="20" style="display: flex; align-items: center" type="flex" justify="center">
      <el-col :span="20">
        <div class="grid-content">
          <template>
            <h3>内容替换</h3>
            <el-table :data="replaceField" border style="width: 100%">
              <el-table-column fixed prop="originalField" label="源字段">
              </el-table-column>
              <el-table-column fixed prop="originalValue" label="源值"> </el-table-column>
              <el-table-column prop="targetValue" label="目标值"> </el-table-column>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button @click.native.prevent="deleteRow2(scope.row)" size="mini" style="margin-left: 10px"
                    type="danger">
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="display: flex; align-items: center" type="flex" justify="center">
      <el-col :span="6">
        <div class="grid-content"></div>
      </el-col>

      <el-col :span="6">
        <div class="grid-content">
          <el-button @click="saveMappingsInput()" type="primary" style="width: 100%">保存映射</el-button>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content"></div>
      </el-col>
    </el-row>
  </div>
</template>

<style>
.el-row {
  margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
/* 搜索框1
.bar1 {background: #A3D0C3; }
.bar1 input {
  border: 2px solid #7BA7AB;
  border-radius: 5px;
  background: #F9F0DA;
  color: #9E9C9C;
}
.bar1 button {
  top: 0;
  right: 0;
  background: #7BA7AB;
  border-radius: 0 5px 5px 0;
}
.bar1 button:before {
  content: "\f002";
  font-family: FontAwesome,serif;
  font-size: 16px;
  color: #F9F0DA;
}
li{
  text-align: left;
  width:100%;
  background: #F9F0DA;
  list-style: none;
}
li:hover{
  background: #666666;
} */
</style>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>

<style>
.el-table td,
.el-table th {
  text-align: center;
}

,
.el-table_header {
  table-layout: auto;
}
</style>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
import { getToken } from '@/utils/auth'
import Axios from "axios";
import { checkRelation, checkContext, deleteHisMapping } from "@/api/mapping"

export default {
  data() {
    return {
      inputText:"",
      chosenTable:" ",
      mappingName:'',
      mappingNameVisable:false,
      // inputSearchVisable:false,
      relation_map: {},
      userInfo: {},
      historicalMapping: [],
      showHistoricalMapping: false,
      showHistoricalMappingDetails: false,
      selectedHistoricalMappingDate: {},

      options: [], //目标字段组多选框数据（表名集合）
      // newoptions: [], //用于目标表的搜索

      value: " ", //当前选中表名

      table1: [], //未关联字段表格数据

      table2: [], //目标字段表格数据

      table3: [], //已关联字段表格数据

      originalField: null, //初始化未关联字段表格数据
      file: null, //上传文件
      database: [], //获取的目标字段组多选框数据（表名集合）

      currentRow1: null, //table1当前选中行
      currentRow2: null, //table2当前选中行
      currentRow3: null, //table3当前选中行
      v1: 0, //table1点击次数，用于控制table1的双击取消选中
      v2: 0, //table2点击次数，用于控制table2的双击取消选中

      dialogFormVisible: false, //控制点击替换按钮弹出的对话框是否可见
      form: {
        //点击替换按钮弹出的对话框中的源值与目标值的保存
        key: "", //源值
        value: "", //目标值
        unit: "", //单位
      },

      replaceField: [], //内容替换表格数据

      replaceContent: null, //发送请求后得到的将要替换的数据

      isMulSelection: false, //控制枚举类型多选框的出现
      mulSelectionData: [], //枚举类型多选框的数据

      isWithUnit: false, //控制单位多选框的出现
      unitData: [], //单位多选框的数据

      rules: {
        //替换时对源值与目标值的校验规则
        key: [{ required: true, message: "请输入源值", trigger: "blur" }], //源值
        value: [{ required: true, message: "请输入目标值", trigger: "blur" }], //目标值
      },

      fileOriginalData: null, //获取上传文件的json数据
      fileSeletionData: {}, //保存遍历文件得到的各字段的所有源值取值，用于源值的多选框
      originalSeletionData: [], //点击替换按钮时，该行字段的源值多选框数据
      fileisMulSelection: false,

      expands: [], //控制已关联字段的单次展开
      getRowKeys(row) {
        //获取当前行的key
        return row.key;
      },
      matchingValue: [], //已关联字段的展开的表格数据，即所展开的该字段的内容替换数据
    };
  },
  
  async activated() {
    //获取用户信息
    var getUserInfoResponse = await this.getUserInfo()
    this.userInfo = getUserInfoResponse.data
    //初始化未关联字段表格数据，获取table1数据
    //this.originalField = this.$route.params.val;
    //this.table1 = this.originalField;
    //获取上传文件
    //this.file = this.$route.params.file;
    //获取上传文件的json数据
    //this.fileOriginalData = this.$route.params.data;

    //初始化目标字段组多选框选中的表名
    this.chosenTable = this.$route.params.tableName;
    this.value = ''; //this.value默认为表二
    this.table2 = null;
    this.table3 = null;
    //获取数据库中的所有表名
    setTimeout(() => {
      this.getDatabase();
    }, 0);

    //根据表名获取目标字段表格数据
    var x = null;
    setTimeout(() => {
      x = this.getData(this.chosenTable);
    }, 300);
    setTimeout(() => {
      let delete_time_and_operator = []
      for (var i = 0; i < x.length; i++) {
        if (x[i].key != "导入时间" && x[i].key != "操作用户") {
          delete_time_and_operator.push(x[i])
        }
      }
      this.table1 = delete_time_and_operator;
      // this.table2 = delete_time_and_operator;
    }, 600);

    //刷新，为表格数据打上标志位，用于控制双击取消选中
    setTimeout(() => {
      this.refdata();
      this.resetTabele(this.table1);
      this.resetTabele(this.table2);
      this.addFlag();
    }, 900);

    //遍历文件得到的各字段的所有源值取值，获取源值的多选框数据
    setTimeout(() => {
      this.getFileSeletionData();
    }, 1000);

    //获取历史映射数据

    await this.getHistoricalMapping();
  },

  // watch:{
  //   inputText:function(newText){
  //     if(newText.length>0){
  //       this.newoptions.splice(0,this.newoptions.length);//清空之前数组
  //       for(let value of this.options){
  //         if(value.value.indexOf(newText)>-1){// 可以直接用indexOf(属性)
  //           this.newoptions.push({
  //             label:value.label,
  //             value:value.value
  //           });//一定要加this
  //         }
  //       }
  //     }else{
  //       this.newoptions=[];//输入框为空，等于原始数据
  //     }
  //   }
  // },
  methods: {
    // clickSearch(){
    //   this.inputSearchVisable = true;
    // },
    // async searchTable(val){
    //   this.value = val;
    //   //根据表名获取目标字段表格数据
    //   var x = null;
    //   setTimeout(() => {
    //     x = this.getData(this.value);
    //   }, 300);
    //   setTimeout(() => {
    //     let delete_time_and_operator = []
    //     for (var i = 0; i < x.length; i++) {
    //       if (x[i].key != "导入时间" && x[i].key != "操作用户") {
    //         delete_time_and_operator.push(x[i])
    //       }
    //     }
    //     this.table2 = delete_time_and_operator;
    //   }, 600);

    //   //刷新，为表格数据打上标志位，用于控制双击取消选中
    //   setTimeout(() => {
    //     this.refdata();
    //     this.resetTabele(this.table1);
    //     this.resetTabele(this.table2);
    //     this.addFlag();
    //   }, 900);

    //   //遍历文件得到的各字段的所有源值取值，获取源值的多选框数据
    //   setTimeout(() => {
    //     this.getFileSeletionData();
    //   }, 1000);

    //   //获取历史映射数据

    //   await this.getHistoricalMapping();
    //   this.inputSearchVisable = false;
    //   this.inputText = '';
    // },

    async deleteHisMapping(his_mapping_id){
      await deleteHisMapping(this.userInfo.userId, this.value, his_mapping_id)
    },
    async getUserInfo() {
      return (await Axios.get('http://8.134.49.56:8000/user/info?token=' + getToken())).data
    },
    clickHistoricalMapping(row, column, event) {
      this.selectedHistoricalMappingDate = row.map;
      this.showHistoricalMappingDetails = true;
    },

    //获取历史映射
    async getHistoricalMapping() {
      this.historicalMapping = [];
      var mapping_response = await checkRelation(this.userInfo.userId)
      // console.log(mapping_response_str)
      // var mapping_response = eval("(" + mapping_response_str + ")")
      var mapping_data = [];
      for(let i = 0; i < mapping_response.data.length; i++){
        if(mapping_response.data[i].sourceFile == this.chosenTable && mapping_response.data[i].targetFile == this.value){
          mapping_data.push(mapping_response.data[i]);
        }
        if(mapping_response.data[i].sourceFile == this.value && mapping_response.data[i].targetFile == this.chosenTable && this.value != this.chosenTable){
          mapping_data.push(mapping_response.data[i]);
        }
        // if( mapping_response.data[i].targetFile != ''){
        //   mapping_data.push(mapping_response.data[i]);
        // }
      }
      for (var item in mapping_data) {
        var his_mapping_item = {}
        //this.value为表名
        //原item为映射id，现item
        // var relation_maps_str = await checkContext(this.userInfo.userId, this.value, item);
        var relation_maps_str = await checkContext(null,null,mapping_data[item].id);
        var relation_map = JSON.parse(relation_maps_str.data[0])
        // his_mapping_item["name"] = this.value
        his_mapping_item["name"] = mapping_data[item].targetFile
        his_mapping_item["map"] = JSON.parse(mapping_data[item].fieldReplace)
        his_mapping_item["relation_id"] = mapping_data[item].id
        his_mapping_item["time"] = mapping_data[item].timestamp
        his_mapping_item["company"] = mapping_data[item].targetCompany
        his_mapping_item["MapName"] = mapping_data[item].mappingName
        for (var replace_key in relation_map) {
          this.relation_map[replace_key] = relation_map[replace_key]
        }
        his_mapping_item["relation"] = relation_map
        this.historicalMapping.push(his_mapping_item)

      }
      // Axios.post("http://8.134.49.56:8000/mappings/checkRelation", params).then(
      //   (rs) => {
      //     var mapping_response = eval("(" + rs.data + ")")
      //     var mapping_data = mapping_response.data
      //     console.log(mapping_data)
      //     for(var item in mapping_data){
      //       let relation_params = new URLSearchParams();
      //       relation_params.append("UserId", this.userInfo.userId);
      //       relation_params.append("Tablename", this.value);
      //       relation_params.append("id", item);
      //       var relation_map = {};
      //       Axios.post("http://8.134.49.56:8000/mappings/checkContext", relation_params).then(
      //         (relation) => {
      //           // var relation_response = eval( "(" + relation.data + ")")
      //           relation_map = JSON.parse(relation.data.data[0])
      //         }
      //       )
      //       console.log("=======")
      //       console.log(relation_map)

      //       console.log(mapping_data[item])
      //       var his_mapping_item = {}
      //       his_mapping_item["name"] = this.value
      //       his_mapping_item["map"] = mapping_data[item]
      //       this.historicalMapping.push(his_mapping_item)
      //     }
      //   })

    },

    //设置历史映射
    setMapping(map, relation_map) {
      this.$alert("确认使用该历史映射？","提示",{
        confirmButtonText:"确定",
        callback:(action) =>{
          if(action === "confirm"){
            this.table3 = [];
            this.replaceField = [];

            this.resetTabele(this.table1);
            this.resetTabele(this.table2);

            for (const key in map) {
              console.info(key);
              console.info(map[key]);
              if (relation_map[key] != null) { // 添加替换关系
                console.log("内容替换的内容")
                console.log(relation_map[key])
                for (var i = 0; i < relation_map[key].length; i++) {
                  console.log(i)
                  console.log(relation_map[key][i])
                  for (var relation_key in relation_map[key][i]) {
                    console.log("relation_key")
                    console.log(relation_key)
                    var replace_item_info = {};
                    replace_item_info['originalField'] = key
                    replace_item_info['targetField'] = map[key]
                    replace_item_info['originalValue'] = relation_key
                    replace_item_info['targetValue'] = relation_map[key][i][relation_key]
                    this.replaceField.push(replace_item_info)
                    console.log(replace_item_info)
                  }

                }
              }
              for (let i = 0; i < this.table1.length; i++) {
                if (this.table1[i]["key"] === key) {
                  this.table1[i]["flag"] = 1;
                }
              }

              for (let i = 0; i < this.table2.length; i++) {
                if (this.table2[i]["key"] === map[key]) {
                  this.table2[i]["flag"] = 1;
                }
              }

              let obj = {};
              obj.key = key;
              obj.value = map[key];
              this.table3.push(obj);

            }

            this.refdata();
            this.showHistoricalMapping = false;
          }
        }
      })
    },

    saveMappingsInput(){
      this.mappingNameVisable = true;
      this.mappingName = '';
    },
    //保存历史映射
    async saveMappings() {
      this.mappingNameVisable = false;
      let obj1 = {};
      for (let i = 0; i < this.table3.length; i++) {
        obj1[this.table3[i]["key"]] = this.table3[i]["value"];
      }

      let replace_infos = {}
      for(var i = 0; i < this.replaceField.length; i ++){
        if(! replace_infos[this.replaceField[i]['targetField']]){
          replace_infos[this.replaceField[i]['targetField']] = [{}]
        }
        replace_infos[this.replaceField[i]['targetField']][0][this.replaceField[i]['originalValue']] = this.replaceField[i]['targetValue']
      }
      
      console.log(JSON.stringify(replace_infos))


      let data = new FormData();
      data.append("UserId", this.userInfo.userId);
      data.append("sourcefile ", this.chosenTable);
      data.append("targetfile", this.value)
      data.append("fieldReplace", JSON.stringify(obj1));
      data.append("contentReplace", JSON.stringify(replace_infos));
      data.append("mappingName ",this.mappingName)
      this.$http
        .post("http://8.134.49.56:8000/mappings/increase", data)
        .then((res) => {
          this.$alert("保存成功", "提示", {
            confirmButtonText: "确定",
            callback: (action) => {
              if (action === "confirm") {
                this.$router.push({
                  name: "Dashboard",
                  params: {
                    tab: "second", 
                    //跳转至映射
              },
                });
              }
             },
          });
          this.getHistoricalMapping();
        });
    },

    //已关联字段单次下拉控制
    expandSelect(row, expandedRows) {
      this.matchingValue = [];
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
          this.expands.push(row.key);
          if (this.replaceField.length) {
            //遍历内容替换表格数据，在下拉表格内只显示该字段的内容替换
            for (let i = 0; i < this.replaceField.length; i++) {
              if (row.key === this.replaceField[i]["originalField"]) {
                this.matchingValue.push(this.replaceField[i]);
              }
            }
          }
        }
      } else {
        this.expands = []; // 默认不展开
      }
    },

    //对文件中字段与目标字段组中相同的字段进行关联，增加标识位，保证已关联字段无法选中
    addFlag() {
      this.table3 = [];
      if (this.table1.length != 0 && this.table2.length != 0) {
        for (let i = 0; i < this.table1.length; i++) {
          for (let j = 0; j < this.table2.length; j++) {
            if (this.table1[i]["key"] === this.table2[j]["key"]) {
              let obj = {};
              obj.key = this.table1[i]["key"];
              obj.value = this.table2[j]["key"];
              this.table3.push(obj);
              this.table1[i]["flag"] = 1;
              this.table2[j]["flag"] = 1;
              break;
            } else {
              this.table1[i]["flag"] = 0;
              if (this.table2[j]["flag"] != 1) {
                this.table2[j]["flag"] = 0;
              }
            }
          }
        }
      }
      //   this.publicFiles = (await getList(getToken())).data.sort(function (o1, o2) { return o1.time > o2.time ? 1 : -1 }) 排序示例
      this.table1 = this.table1.sort(function(o1, o2) {return o1.flag > o2.flag ? 1 : -1})
      this.table2 = this.table2.sort(function(o1, o2) {return o1.flag > o2.flag ? 1 : -1})
      //刷新
      this.refdata();
      this.resetTabele(this.table3)
    },

    isContains(key) {
      for (var i = 0; i < this.table3.length; i++) {
        if (key == this.table3[i].key) {
          return true
        }
      }
      return false
    },

    reMapSameField() {
      if (this.table1.length != 0 && this.table2.length != 0) {
        for (let i = 0; i < this.table1.length; i++) {
          if (!this.isContains(this.table1[i]["key"])) {
            for (let j = 0; j < this.table2.length; j++) {
              if (this.table1[i]["key"] === this.table2[j]["key"]) {
                let obj = {};
                obj.key = this.table1[i]["key"];
                obj.value = this.table2[j]["key"];
                this.table3.push(obj);
                this.table1[i]["flag"] = 1;
                this.table2[j]["flag"] = 1;
                break;
              } else {
                this.table1[i]["flag"] = 0;
                if (this.table2[j]["flag"] != 1) {
                  this.table2[j]["flag"] = 0;
                }
              }
            }
          }

        }
      }
      //刷新
      this.refdata();
    },


    //table1的行选中切换事件，用于控制双击取消选中
    handleCurrentChange1(val) {
      this.v1 = 0;
      if (val != null) {
        if (val.flag != null && val.flag == 0) {
          this.currentRow1 = val;
        } else {
          this.$refs.t1.setCurrentRow();
          this.currentRow1 = null;
        }
      }
    },
    //table2的行选中切换事件，用于控制双击取消选中
    handleCurrentChange2(val) {
      this.v2 = 0;
      if (val != null) {
        if (null != val.flag && val.flag == 0) {
          this.currentRow2 = val;
        } else {
          this.$refs.t2.setCurrentRow();
          this.currentRow2 = null;
        }
      }
    },

    //table1的行点击事件，用于控制双击取消选中
    rowclick1(row, column, event) {
      this.v1 = this.v1 + 1;
      if (row === this.currentRow1 && this.v1 === 2) {
        this.currentRow1 = null;
        this.$refs.t1.setCurrentRow();
        this.v1 = 0;
      }
    },
    //table2的行点击事件，用于控制双击取消选中
    rowclick2(row, column, event) {
      this.v2 = this.v2 + 1;
      if (row === this.currentRow2 && this.v2 === 2) {
        this.currentRow2 = null;
        this.$refs.t2.setCurrentRow();
        this.v2 = 0;
      }
    },

    // 选择器切换表
    async handleSelectChange(val) {
      this.value = val;
      //重置表格数据
      this.table3 = [];
      this.replaceField = [];

      //根据表名获取目标字段表格数据
      var x = [];
      setTimeout(() => {
        x = this.getData(this.value);
      }, 300);
      setTimeout(() => {
        let delete_time_and_operator = []
        for (var i = 0; i < x.length; i++) {
          if (x[i].key != "导入时间" && x[i].key != "操作用户") {
            delete_time_and_operator.push(x[i])
          }
        }
        this.table2 = delete_time_and_operator;
      }, 600);

      //刷新，为表格数据打上标志位，用于控制双击取消选中
      setTimeout(() => {
        this.refdata();
        this.resetTabele(this.table1);
        this.resetTabele(this.table2);
        this.addFlag();
      }, 600);

      await this.getHistoricalMapping();

      //对table1的选中状态进行重置
      if (this.currentRow1 != null && this.currentRow1.flag === 1) {
        this.$refs.t1.setCurrentRow();
        this.currentRow1 = null;
        this.v1 = 0;
      }

      //对table2的选中状态进行重置
      this.$refs.t2.setCurrentRow();
      this.currentRow2 = null;
      this.v2 = 0;
    },

    //刷新数据，表格数据实时更新
    refdata() {
      var newTableData1 = [];
      var newTableData2 = [];
      for (var i = 0; i < this.table1.length; i++) {
        newTableData1.push(this.table1[i]);
      }
      for (var i = 0; i < this.table2.length; i++) {
        newTableData2.push(this.table2[i]);
      }
      this.table1 = newTableData1;
      this.table2 = newTableData2;
    },

    //重置标识位，恢复全未选中状态
    resetTabele(table) {
      for (let i = 0; i < table.length; i++) {
        table[i]["flag"] = 0;
      }
    },

    //添加关联字段
    add() {
      if (this.currentRow1 !== null && this.currentRow2 !== null) {
        if (this.currentRow1["flag"] === 0 && this.currentRow2["flag"] === 0) {
          let obj = {};
          obj.key = this.currentRow1["key"];
          obj.value = this.currentRow2["key"];
          this.table3.push(obj);

          //设置已选中状态，不能重复选择
          let index1 = this.table1.findIndex((item) => item["key"] === obj.key);
          this.table1[index1]["flag"] = 1;
          let index2 = this.table2.findIndex((item) => item["key"] === obj.value);
          this.table2[index2]["flag"] = 1;
        }
      } else {
        this.$alert("不能为空", "提示", {
          confirmButtonText: "确定",
          callback: (action) => { },
        });
      }

      //重置表格选中状态
      this.table1 = this.table1.sort(function(o1, o2) {return o1.flag > o2.flag ? 1 : -1})
      this.table2 = this.table2.sort(function(o1, o2) {return o1.flag > o2.flag ? 1 : -1})
      this.$refs.t1.setCurrentRow();
      this.$refs.t2.setCurrentRow();
      this.currentRow1 = null;
      this.currentRow2 = null;
      this.v1 = 0;
      this.v2 = 0;
    },

    //已关联字段的删除
    deleteRow(index, rows) {
      //重置为未选中状态
      let index1 = this.table1.findIndex((item) => item["key"] === rows[index]["key"]);
      this.table1[index1]["flag"] = 0;
      let index2 = this.table2.findIndex((item) => item["key"] === rows[index]["value"]);
      this.table2[index2]["flag"] = 0;

      //已关联字段的删除
      let temp = rows.splice(index, 1);

      //内容替换的删除
      if (this.replaceField.length) {
        //遍历内容替换表格数据，删除该字段所有的内容替换值
        for (let i = 0; i < this.replaceField.length; i++) {
          if (temp[0].key === this.replaceField[i]["originalField"]) {
            this.replaceField.splice(i, 1);
          }
        }
      }

      //刷新
      var newTableData1 = [];
      var newTableData2 = [];
      for (var i = 0; i < this.table1.length; i++) {
        newTableData1.push(this.table1[i]);
      }
      for (var i = 0; i < this.table2.length; i++) {
        newTableData2.push(this.table2[i]);
      }
      this.table1 = newTableData1;
      this.table2 = newTableData2;
      this.table1 = this.table1.sort(function(o1, o2) {return o1.flag > o2.flag ? 1 : -1})
      this.table2 = this.table2.sort(function(o1, o2) {return o1.flag > o2.flag ? 1 : -1})
    },

    //内容替换的删除
    deleteRow2(row) {
      let originalField = row["originalField"];
      let originalValue = row["originalValue"];
      let targetValue = row["targetValue"];

      //对内容替换表格数据进行删除
      let i = this.replaceField.findIndex(
        (item) =>
          item["originalField"] === originalField &&
          item["originalValue"] === originalValue &&
          item["targetValue"] === targetValue
      );
      this.replaceField.splice(i, 1);

      //对已关联字段下拉表格数据进行删除
      let j = this.matchingValue.findIndex(
        (item) =>
          item["originalField"] === originalField &&
          item["originalValue"] === originalValue &&
          item["targetValue"] === targetValue
      );
      this.matchingValue.splice(j, 1);
    },

    //已关联字段中替换按钮的点击事件
    clickbtn(row) {
      this.currentRow3 = row;
      this.form["key"] = "";
      this.form["value"] = "";
      this.form["unit"] = "";
      this.isWithUnit = false;
      this.unitData = [];
      this.dialogFormVisible = true;
      if (this.$refs["ruleForm"] !== undefined) {
        this.$refs["ruleForm"].resetFields();
      }
      this.rules.value.splice(1, 1);
      // this.originalSeletionData = this.fileSeletionData[row.key]; 取值方式修改

      //是否为空
      // this.rules.key.push({ required: true, message: "请输入源值", trigger: "blur" });
      // this.rules.value =
      let data_chosen = new FormData();
      data_chosen.append("tableName", this.chosenTable);
      data_chosen.append("columnName", row.key);
      //判断该字段是否为枚举项
      this.$http.post("http://8.134.49.56:8000/G/IsNotEnume", data_chosen).then((res) => {
        this.fileisMulSelection = res.data;

        if (res.data) {
          //获取枚举项项数据
          this.$http
            .post("http://8.134.49.56:8000/G/IsNotEnumeData", data_chosen)
            .then((res) => {
              this.originalSeletionData = res.data.data;
            });
        } else {
          this.$http.post("http://8.134.49.56:8000/G/NotEnumeData", data_chosen).then((res) => {
            //根据长度限制为目标值添加校验规则
            if (res.data.data.length !== 0) {
              let obj = {};
              obj["min"] = res.data.data[0].lengthMin;
              obj["max"] = res.data.data[0].lengthMax;
              obj["message"] = "长度在 " + obj["min"] + " 到 " + obj["max"] + " 个字符";
              obj["trigger"] = "blur";
              this.rules.key.push(obj);
            }
          });
        }
      });

      let data = new FormData();
      data.append("tableName", this.value);
      data.append("columnName", row.value);

      //判断该字段是否为枚举项
      this.$http.post("http://8.134.49.56:8000/G/IsNotEnume", data).then((res) => {
        this.isMulSelection = res.data;

        if (res.data) {
          //获取枚举项项数据
          this.$http
            .post("http://8.134.49.56:8000/G/IsNotEnumeData", data)
            .then((res) => {
              this.mulSelectionData = res.data.data;
            });
        } else {
          this.$http.post("http://8.134.49.56:8000/G/NotEnumeData", data).then((res) => {
            //根据长度限制为目标值添加校验规则
            if (res.data.data.length !== 0) {
              let obj = {};
              obj["min"] = res.data.data[0].lengthMin;
              obj["max"] = res.data.data[0].lengthMax;
              obj["message"] = "长度在 " + obj["min"] + " 到 " + obj["max"] + " 个字符";
              obj["trigger"] = "blur";
              this.rules.value.push(obj);
            }
          });
        }
      });

      //字符处理待定
      // let obj1 = {};

      // for (let i = 0; i < this.table3.length; i++) {
      //   obj1[this.table3[i]["key"]] = this.table3[i]["value"];
      // }

      // let data2 = new FormData();
      // data2.append("file", this.file);
      // data2.append("columnName", row.value);
      // data2.append("relationString", JSON.stringify(obj1));

      // this.$http.post("http://8.134.49.56:8000/G/listUnit", data2).then((res) => {
      //   if (res.data.data.length > 0) {
      //     this.isWithUnit = true;
      //     this.unitData = res.data.data;
      //   }
      // });
    },

    //单行字段的内容替换
    replacement() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false;

          let obj = {};

          obj["originalField"] = this.currentRow3["key"];
          obj["targetField"] = this.currentRow3["value"];
          obj["originalValue"] = this.form["key"];
          obj["targetValue"] = this.form["value"] + this.form["unit"];

          this.replaceField.push(obj);
          //新增
          if (this.expands.length > 0 && this.expands[0] === obj["originalField"]) {
            this.matchingValue.push(obj);
          }
        }
      });
    },

    //点击确认后，对所有字段进行替换，跳转到保存页面
    replacementAll() {
      let obj1 = {}; //字段映射关系
      let obj2 = {}; //内容替换哈希值
      console.log("mapping")
      //获取字段映射关系
      for (let i = 0; i < this.table3.length; i++) {
        obj1[this.table3[i]["key"]] = this.table3[i]["value"];
      }

      //获取内容替换哈希值
      if (this.replaceField.length > 0) {
        for (let i = 0; i < this.replaceField.length; i++) {
          obj2[this.replaceField[i]["originalField"]] = [];
        }

        for (let i = 0; i < this.replaceField.length; i++) {
          let obj = {};
          obj[this.replaceField[i]["originalValue"]] = this.replaceField[i][
            "targetValue"
          ];
          obj2[this.replaceField[i]["originalField"]].push(obj);
        }

        for (const key in obj2) {
          let val = {};
          val = Object.values(obj2[key]);
          console.log(val);

          let obj = {};
          for (const key2 in val) {
            console.log(Object.keys(val[key2])[0]);
            console.log(Object.values(val[key2])[0]);
            let k = Object.keys(val[key2])[0];
            let v = Object.values(val[key2])[0];
            obj[k] = v;
          }

          obj2[key] = obj;
        }
      }

      let data = new FormData();
      data.append("file", this.file);
      data.append("relationString", JSON.stringify(obj1));
      data.append("hashString", JSON.stringify(obj2));

      this.$http.post("http://8.134.49.56:8000/G/relacement", data).then((res) => {
        this.replaceContent = res.data.data;
        console.log(res.data.data)
        let temp = this.replaceContent[0];
        let tableHeader = [];
        console.log(temp)
        Object.keys(res.data.data['result'][0]).some((key) => {
          tableHeader.push({ key: key });
        });

        this.$alert("替换成功", "提示", {
          confirmButtonText: "确定",
          callback: (action) => {
            if (action === "confirm") {
              this.$router.push({
                name: "Save",
                params: {
                  data: res.data.data['result'],
                  map: obj1,
                  name: this.value,
                  header: tableHeader,
                  wrongInfList: res.data.data['wrongInfList']
                },
              });
            }
          },
        });
      });
    },

    //获取数据库中的所有表名
    getDatabase() {
      this.$http.get("http://8.134.49.56:8000/G/getdatabase").then((res) => {
        this.options = [];
        this.database = [];
        for (var i = 0; i < res.data.length; i++) {
          let obj = {};
          obj.value = res.data[i]["Generaltable_name"];
          obj.label = res.data[i]["Generaltable_name"];
          this.database.push(obj);
        }
        this.options = this.database;
      });
    },

    //根据表名获取目标字段表格数据
    getData(name) {
      var url = "http://8.134.49.56:8000/G/getdata";
      var params = "tableName=" + name;
      var xhr = new XMLHttpRequest();
      let list = [];
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.onload = function (e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var data = xhr.responseText;
            var jsonResponse = JSON.parse(data);
            Object.keys(jsonResponse[0]).some((key) => {
              list.push({ key: key, value: jsonResponse[0][key] });
            });
          } else {
            console.error(xhr.statusText);
          }
        }
      };
      xhr.onerror = function (e) {
        console.error(xhr.statusText);
      };
      xhr.send(params);

      return list;
    },

    //保存遍历文件得到的各字段的所有源值取值，用于源值的多选框
    getFileSeletionData() {
      if(this.originalField != null){
        let obj = {};

        for (let i = 0; i < this.originalField.length; i++) {
          obj[this.originalField[i]["key"]] = [];
          for (let j = 0; j < this.fileOriginalData.length; j++) {
            obj[this.originalField[i]["key"]].push(
              this.fileOriginalData[j][this.originalField[i]["key"]]
            );
          }
          obj[this.originalField[i]["key"]] = [
            ...new Set(obj[this.originalField[i]["key"]]),
          ];
        }
        this.fileSeletionData = obj;
      }
    },
  },
};
</script>
