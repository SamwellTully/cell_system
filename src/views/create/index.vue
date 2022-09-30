<template>
  <div class="all">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="设置文件基本信息"></el-step>
      <el-step title="添加所含列"></el-step>
      <el-step title="提交"></el-step>
    </el-steps>

    <div v-show="active == 1" class="top-block">
      <el-form :model="tableHeader" ref="tableHeader" :label-position="labelPosition" class="demo-ruleForm"
        label-width="100px">
        <el-form-item label="文件名称:" prop="dataname" :rules="[{ required: true, message: '文件名不能为空' }]">
          <el-input v-model="tableHeader.dataname" placeholder="请输入文件名称"></el-input>
        </el-form-item>
        <el-form-item label="文件描述:" prop="descript" :rules="[{ required: true, message: '文件描述不能为空' }]">
          <el-input v-model="tableHeader.descript" placeholder="请描述文件信息"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div v-show="active == 2">
      <el-dialog width="80%" title="详情" :visible.sync="addType" :append-to-body="true">
        <el-form ref="tableForm" :rules="tableFormRules" :label-position="labelPosition" label-width="100px"
        class="demo-dynamic" :model="tableForm">
          <el-form-item label="列类型:" :required="true">
            <el-select @change="clearInput" v-model="tableForm.fieldType" placeholder="数据列类型">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="列名:" prop="attributename" :rules="[{ required: true, message: '列名不能为空' }]">
            <el-input v-model="tableForm.attributename" placeholder="请输入列名"></el-input>
          </el-form-item>
          <el-form-item prop="minLength" v-if="tableForm.fieldType == 'char'" label="最小长度:">
            <el-input v-model="tableForm.minLength" placeholder="请输入该列内容最小长度"></el-input>
          </el-form-item>
          <el-form-item prop="maxLength" v-if="tableForm.fieldType == 'char'" label="最大长度:">
            <el-input v-model="tableForm.maxLength" placeholder="请输入该列内容最大长度"></el-input>
          </el-form-item>
          <el-form-item prop="minLength" v-if="tableForm.fieldType == 'float'" label="最小值:">
            <el-input v-model="tableForm.minLength" placeholder="请输入该列内容最小值"></el-input>
          </el-form-item>
          <el-form-item prop="maxLength" v-if="tableForm.fieldType == 'float'" label="最大值:">
            <el-input v-model="tableForm.maxLength" placeholder="请输入该列内容最大值"></el-input>
          </el-form-item>
          <div style="" v-if="tableForm.fieldType == 'enum'">
            <el-form-item :rules="[{ required: true, message: '枚举项不能为空' }]" v-for="(v, index) in tableForm.enumeration"
              :key="v.key" :prop="'enumeration.' + index + '.value'" :label="'枚举项' + (index + 1) + ':'">
              <el-col :span="12">
                <el-input v-model="v.value" placeholder="请输入枚举项内容"></el-input>
              </el-col>
              <el-col :span="1"></el-col>
              <el-col :span="2">
                <el-button @click.prevent="removeEnum(v)">删除</el-button>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button @click="addEnum">新增枚举项</el-button>
            </el-form-item>
          </div>

          <el-form-item :required="true" label="是否可为空:">
            <el-select v-model="tableForm.isNotNull" placeholder="请选择">
              <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :rules="[{ required: true, message: '示范数据不能为空' }]" label="示范数据:">
            <el-input v-model="tableForm.sample" placeholder="请输入该列示范数据"></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" style="width: 200px; margin-top: 30px; margin-left: 40% ;" @click="addInput">
          添加</el-button>
      </el-dialog>
      <div style="margin-top: 30px">
        <el-row>
          <el-tag type="success">文件名称：{{ tableHeader.dataname }}</el-tag>
        </el-row>
        <el-row style="margin-top: 15px">
          <el-tag type="success">文件描述：{{ tableHeader.descript }}</el-tag>
        </el-row>
      </div>


      <div class="secend-block" style="margin-top: 30px">
        <el-table :data="showLimits">
          <el-table-column prop="fieldType" label="类型">
          </el-table-column>
          <el-table-column prop="attributename" label="名称">
          </el-table-column>
          <el-table-column prop="limit" label="字段约束"> </el-table-column>
          <!-- <el-table-column prop="isNotNull" label="是否为空"> </el-table-column> -->
          <el-table-column label="是否为空"> 
            <template slot-scope="scope">
              <span v-if="scope.row.isNotNull == 'true'">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column prop="sample" label="示范数据"> </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-popconfirm @onConfirm="handleDelete(scope.$index, scope.row)" title="确定删除该列吗？">
                <el-button slot="reference" size="mini" type="danger">删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-button type="primary" style="width: 200px; margin-top: 10px; margin-bottom: 20px;" @click="upload">
        提交表单</el-button> -->
      </div>
    </div>

    <div v-show="active == 3">
      <div style="margin-top: 30px">
        <el-row>
          <el-tag type="success">文件名称：{{ tableHeader.dataname }}</el-tag>
        </el-row>
        <el-row style="margin-top: 15px">
          <el-tag type="success">文件描述：{{ tableHeader.descript }}</el-tag>
        </el-row>
      </div>

      <div class="secend-block" style="margin-top: 30px">
        <el-table :data="showLimits">
          <el-table-column prop="fieldType" label="类型">
          </el-table-column>
          <el-table-column prop="attributename" label="名称">
          </el-table-column>
          <el-table-column prop="limit" label="字段约束"> </el-table-column>
          <!-- <el-table-column prop="isNotNull" label="是否为空"> </el-table-column> -->
          <el-table-column label="是否为空"> 
            <template slot-scope="scope">
              <span v-if="scope.row.isNotNull == 'true'">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column prop="sample" label="示范数据"> </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-popconfirm @onConfirm="handleDelete(scope.$index, scope.row)" title="确定删除该列吗？">
                <el-button slot="reference" size="mini" type="danger">删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" style="width: 200px; margin-top: 20px; margin-bottom: 20px;" @click="upload">
          提交表单</el-button>
      </div>
    </div>
    <div v-show="active == 1">
      <el-button type="primary" style="margin-top: 12px;margin-bottom: 20px;margin-left: 20px;" @click="autoUpload">自动建表
      </el-button>
      <el-button type="primary" style="margin-top: 12px;margin-bottom: 20px;margin-left: 5%;" @click="next">手动建表
      </el-button>
    </div>

    <el-button icon="el-icon-plus" type="success" @click="addType = true" v-if="active == 2" style="margin-top: 12px;margin-bottom: 20px;margin-left: 20px;">添加数据</el-button>
    <br/>
    <el-button type="danger" v-if="active > 1" style="margin-top: 12px;margin-bottom: 20px;margin-left: 20px;"
      @click="before">上一步</el-button>
    <el-button type="primary" v-if="active < 3 && active > 1" style="margin-top: 12px;margin-bottom: 20px;"
      @click="next">下一步
    </el-button>



    <el-dialog title="修改" :visible.sync="editFormVisible">
      <el-form ref="editForm" :rules="editFormRules" :label-position="labelPosition" label-width="100px"
        class="demo-dynamic" :model="editForm">
        <el-form-item :required="true" label="列类型:">
          <el-select @change="clearInput" v-model="editForm.fieldType" placeholder="数据列类型">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="列名:" prop="attributename" :rules="[{ required: true, message: '列名不能为空' }]">
          <el-input v-model="editForm.attributename" placeholder="请输入列名"></el-input>
        </el-form-item>
        <el-form-item prop="minLength" v-if="editForm.fieldType == 'char'" label="最小长度:">
          <el-input v-model="editForm.minLength" placeholder="请输入该列内容最小长度"></el-input>
        </el-form-item>
        <el-form-item prop="maxLength" v-if="editForm.fieldType == 'char'" label="最大长度:">
          <el-input v-model="editForm.maxLength" placeholder="请输入该列内容最大长度"></el-input>
        </el-form-item>
        <el-form-item prop="minLength" v-if="editForm.fieldType == 'float'" label="最小值:">
          <el-input v-model="editForm.minLength" placeholder="请输入该列内容最小值"></el-input>
        </el-form-item>
        <el-form-item prop="maxLength" v-if="editForm.fieldType == 'float'" label="最大值:">
          <el-input v-model="editForm.maxLength" placeholder="请输入该列内容最大值"></el-input>
        </el-form-item>
        <div style="" v-if="editForm.fieldType == 'enum' && keys.includes(editForm.attributename)">
          <el-form-item :rules="[{ required: true, message: '枚举项不能为空' }]" label="枚举项:">
            <el-select v-model="enumerationForSelect" multiple collapse-tags style="" placeholder="请选择枚举项" @change="changeSelect"
            @remove-tag="removeTag">
              <el-option label="全选" value="全选" style="color:red"></el-option>
              <el-option v-for="item in editForm.SampleArray" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <div style="" v-if="editForm.fieldType == 'enum' && !keys.includes(editForm.attributename)">
          <el-form-item :rules="[{ required: true, message: '枚举项不能为空' }]" v-for="(v, index) in editForm.enumeration"
            :key="v.key" :prop="'enumeration.' + index + '.value'" :label="'枚举项' + (index + 1) + ':'">
            <el-col :span="12">
              <el-input v-model="v.value" placeholder="请输入枚举项内容"></el-input>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="2">
              <el-button @click.prevent="removeEnumForEdit(v)">删除</el-button>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button @click="addEnumForEdit">新增枚举项</el-button>
          </el-form-item>
        </div>

        <el-form-item prop="isNotNull" :required="true" label="是否可为空:">
          <el-select v-model="editForm.isNotNull" placeholder="请选择">
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sample" :rules="[{ required: true, message: '示范数据不能为空' }]" label="示范数据:">
          <el-input v-show="!isAuto || !keys.includes(editForm.attributename)" v-model="editForm.sample" placeholder="请输入该列示范数据"></el-input>
          <el-select v-show="isAuto && keys.includes(editForm.attributename)" v-model="editForm.sample" placeholder="请输入该列示范数据">
            <el-option v-for="item in currentSampleArray" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false;enumerationForSelect = []">取 消</el-button>
        <el-button type="primary" @click="clickEdit">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import Axios from "axios";
import { createTable, limits, sample } from '@/api/table'
import { getToken } from '@/utils/auth'
import { getInfo } from '@/api/user'
import { set } from 'js-cookie';
export default {
  data() {
    var checkEnumeration = (rule, value, callback) => {

    };
    //检查min max 数值本身
    var checkLengthForEdit = (rule, value, callback) => {
      console.log("check")
      if (!value && value != 0) {
        return callback(new Error('不能为空'));
      }
      setTimeout(() => {
        if (Number.isNaN(parseInt(value))) {
          callback(new Error('请输入数字值'));
        } else {
          if (this.editForm.fieldType == "char") {
            if (!Number.isInteger(parseInt(value))) {
              console.log(value)
              callback(new Error('请输入整数'));
            } else {
              if (parseInt(value) < 0) {
                callback(new Error('长度不能小于0'))
              } else {
                if (this.editForm.minLength != "" && this.editForm.maxLength != "") {
                  if (parseFloat(this.editForm.minLength) > parseFloat(this.editForm.maxLength)) {
                    callback(new Error('最大长度不能小于最小长度'))
                  } else {
                    callback()
                  }
                } else {
                  callback()
                }
              }
            }
          } else {
            if (this.editForm.minLength != "" && this.editForm.maxLength != "") {
              if (parseFloat(this.editForm.minLength) > parseFloat(this.editForm.maxLength)) {
                callback(new Error('最大值不能小于最小值'))
              } else {
                callback()
              }
            } else {
              callback()
            }
          }

        }
      }, 500);
    };
    var checkLength = (rule, value, callback) => {
      console.log("check")
      if (!value && value != 0) {
        return callback(new Error('不能为空'));
      }
      setTimeout(() => {
        if (Number.isNaN(parseInt(value))) {
          callback(new Error('请输入数字值'));
        } else {
          if (this.tableForm.fieldType == "char") {
            if (!Number.isInteger(parseInt(value))) {
              console.log(value)
              callback(new Error('请输入整数'));
            } else {
              if (parseInt(value) < 0) {
                callback(new Error('长度不能小于0'))
              } else {
                if (this.tableForm.minLength != "" && this.tableForm.maxLength != "") {
                  if (parseFloat(this.tableForm.minLength) > parseFloat(this.tableForm.maxLength)) {
                    callback(new Error('最大长度不能小于最小长度'))
                  } else {
                    callback()
                  }
                } else {
                  callback()
                }
              }
            }
          } else {
            if (this.tableForm.minLength != "" && this.tableForm.maxLength != "") {
              if (parseFloat(this.tableForm.minLength) > parseFloat(this.tableForm.maxLength)) {
                callback(new Error('最大值不能小于最小值'))
              } else {
                callback()
              }
            } else {
              callback()
            }
          }

        }
      }, 500);
    };
    return {
      addType:false,
      selectedRowIndexForSelect: -1,
      enumerationForSelect: [],
      keys: [],
      file: null,
      filedata: null,
      fileinfo: null,
      currentSampleArray: [],
      sampleSet: null,
      isAuto: false,
      editFormVisible: false,
      active: 1,
      tableFormRules: {
        // attributename: [{ required: true, message: '列名不能为空', trigger: 'blur' }],
        // fieldType: [{ required: true}],
        // sample: [{ required: true, message: '示范数据不能为空', trigger: 'blur' }],
        // isNotNull: [{required: true}],
        // choose: [{required: true}],
        // enumeration: [{validator: checkEnumeration, trigger: 'blur', required: true}],
        minLength: [
          { validator: checkLength, trigger: 'blur', required: true }
        ],
        maxLength: [
          { validator: checkLength, trigger: 'blur', required: true }
        ],
      },
      editFormRules: {
        minLength: [
          { validator: checkLengthForEdit, trigger: 'blur', required: true }
        ],
        maxLength: [
          { validator: checkLengthForEdit, trigger: 'blur', required: true }
        ],
      },
      labelPosition: 'left',
      limitations: [], // 上传约束条件 此四个数组为一一对应
      samples: [], // 示范数据
      tableData: [], // 上传建表内容
      showLimits: [], // 显示的约束信息
      options2: [
        { value: "true", label: "是" },
        { value: "false", label: "否" },
      ],
      options: [
        {
          value: "char",
          label: "字符",
        },
        {
          value: "float",
          label: "数字",
        },
        {
          value: "enum",
          label: "枚举",
        }
      ],
      tableHeader: {
        dataname: "",
        descript: "",
      },
      tableFormList: [],
      tableForm: {
        attributename: "",
        fieldType: "char",
        sample: "",
        minLength: "0",
        maxLength: "50",
        isNotNull: "true",
        choose: "选项2",
        enumeration: [{ value: '' }]
      },
      editForm: {
        attributename: "",
        fieldType: "char",
        sample: "",
        minLength: "0",
        maxLength: "50",
        isNotNull: "true",
        choose: "选项2",
        enumeration: [{ value: '' }]
      },
      dataname: "",
      descript: "",
      current_username: "",
      selectedRowIndex: 0,
    };
  },
  created() {

    let params = new URLSearchParams();
    params.append("token", getToken());
    var userName = "";
    Axios.get('http://8.134.49.56:8000/user/info?token=' + getToken())
      .then(res => {
        console.log(res.data.data)
        userName = res.data.data.userName
        this.current_username = userName
        console.log(this.current_username)
      })
    if (this.$route.params.isAuto == true) {
      this.isAuto = true
      this.active = 2
      let temp_keys = this.$route.params.keys
      this.filedata = this.$route.params.data
      this.fileinfo = this.$route.params.file
      this.tableHeader.dataname = this.$route.params.dataname
      this.tableHeader.descript = this.$route.params.descript
      console.log("从文件上传得到的参数")
      this.keys = []
      for (let temp in temp_keys) {
        this.keys.push(temp_keys[temp].key)
      }
      for (let key in this.keys) {
        this.getDefaultItem(this.keys[key])
      }
      this.getSampleSet()
      // console.log(this.keys);
      // console.log(this.filedata);
      // console.log(this.fileinfo);
      // console.log(this.dataname);
      // console.log(this.descript);
      console.log("从文件上传得到的参数--")
    }

  },
  methods: {
    // 多选模式下移除tag时触发,val为移除的tag值
    removeTag(val) {
      if (val === "全选") {
        this.enumerationForSelect = [];
      }
    },
    changeSelect(val) {
      var end = val[val.length - 1];
      if (!val.includes("全选") && val.length === this.editForm.SampleArray.length) {
        val.unshift("全选");
      } else if (val.includes("全选") && val.length == 1) {
        this.editForm.SampleArray.map(item => {
          val.push(item);
        });
      } else if (
        val.includes("全选") &&
        val.length - 1 < this.editForm.SampleArray.length &&
        end == "全选"
      ) {
        val = [];
        this.editForm.SampleArray.map(item => {
          val.push(item);
        });
        val.unshift("全选");
        // this.value = val;
      } else if (val.includes("全选") && val.length - 1 < this.editForm.SampleArray.length) {
        val = val.filter(item => {
          return item !== "全选";
        });
        // this.value = val;
      }
      // 注意，加上  this.value = val，确保勾选值同步
      this.enumerationForSelect = val;
    },

    //设置文件示例值（总体） --> 自动建表使用
    getSampleSet() {
      this.sampleSet = {}
      for (let i = 0; i < this.keys.length; i++) { // 初始化
        this.sampleSet[this.keys[i]] = new Set()
      }
      for (let i = 0; i < this.filedata.length; i++) {
        for (let j = 0; j < this.keys.length; j++) {
          this.sampleSet[this.keys[j]].add(this.filedata[i][this.keys[j]])
        }
      }
      for (let i = 0; i < this.keys.length; i++) { // 转化为array
        this.sampleSet[this.keys[i]] = [...this.sampleSet[this.keys[i]]]
      }
      console.log(this.sampleSet)
    },
    //设置字段示例值（原子） --> 自动建表使用
    getDefaultItem(columnName) {
      let current_field = {}
      let _sample = ""
      if (this.filedata.length > 0 && this.filedata[0][columnName]) {
        _sample = this.filedata[0][columnName]
      }
      current_field.attributename = columnName;
      current_field.fieldType = "char"
      current_field.sample = _sample
      current_field.minLength = 0
      current_field.maxLength = 255
      current_field.isNotNull = "true"
      current_field.choose = "true"
      current_field.enumeration = [{ value: '' }]
      this.tableFormList.push(current_field)
      // 1. 首先新增建表所需数据
      let a = {};
      // console.log(this.data);
      a["attributename"] = columnName;
      a["fieldType"] = "char";
      a["lengthLimit"] = 255;
      a['isNotNull'] = "true"
      a["choose"] = "true";
      this.tableData.push(a);

      // 2. 添加展示约束情况数据
      let showLimit = {};
      showLimit["attributename"] = columnName;
      showLimit["fieldType"] = this.field2name("char"); // 转换为名称
      showLimit["limit"] = "0-255"
      showLimit["sample"] = _sample;
      showLimit["isNotNull"] = "true"
      this.showLimits.push(showLimit);
      console.log(showLimit)

      // 3. 定义发送请求的约束数据
      let limit = {}
      limit['tableName'] = this.tableHeader.dataname
      limit['columnName'] = columnName

      limit['tokenEnume'] = "false"
      limit['itemEnume'] = "null"
      limit['lengthMin'] = 0
      limit['lengthMax'] = 255
      this.limitations.push(limit)

      // 4. 添加示范数据
      let entity_sample = {}
      if (_sample != "" && _sample) {
        entity_sample[columnName] = _sample
        this.samples.push(entity_sample)
      } else {
        entity_sample[columnName] = " "
        this.samples.push(entity_sample)
      }
      this.clearInput()
      this.tableForm.fieldType = "char"
    },
    autoUpload() {
      if (this.tableHeader.dataname == "" || this.tableHeader.descript == "") {
        this.$notify.error({
          title: '错误',
          message: '列名不能为空'
        });
        return;
      }
      this.$router.push({
        name: "auto",
        params: {
          isAuto: true,
          dataname: this.tableHeader.dataname,
          descript: this.tableHeader.descript
        },
      });
    },
    clickEdit() {
      this.$refs['editForm'].validate((valid) => {
        if (!valid) {
          return
        }
        
        if(this.editForm.fieldType == "enum" && this.enumerationForSelect != [] && this.keys.includes(this.editForm.attributename)){ // 首先将enumerationForSelect转化为enumeration
          this.editForm.enumeration = []
          for(let i = 0; i < this.enumerationForSelect.length; i ++){
            this.editForm.enumeration.push({value: this.enumerationForSelect[i]})
          }
        }
        
        // 若是枚举类，则判断示范数据是否包含在枚举项中
        let flag = false
        if (this.editForm.fieldType == "enum") {
          for (let i = 0; i < this.editForm.enumeration.length; i++) {
            console.log(this.editForm.enumeration[i].value)
            if (this.editForm.sample === this.editForm.enumeration[i].value) {
              flag = true
              break
            }
          }
        }
        if (!flag && this.editForm.fieldType == "enum") {
          this.$notify.error({
            title: '错误',
            message: '示范数据必须为枚举项'
          });
          return;
        }
        

        // 若是字符类，则判断示范数据长度是否符合约束
        if (this.editForm.fieldType == "char" && (this.editForm.sample.length < this.editForm.minLength
         || this.editForm.sample.length > this.editForm.maxLength)) {
          this.$notify.error({
            title: '错误',
            message: '示范数据必须在约束范围内'
          });
          return;
        }

        // 若是数字类，则判断示范数据大小是否符合约束
        if (this.editForm.fieldType == "float" && (Number.isNaN(parseFloat(this.editForm.sample)) || (parseFloat(this.editForm.sample) < parseFloat(this.editForm.minLength)
         || parseFloat(this.editForm.sample) > parseFloat(this.editForm.maxLength)))) {
          this.$notify.error({
            title: '错误',
            message: '示范数据必须在约束范围内且必须为数字'
          });
          return;
        }


        // 建表
        this.tableData[this.selectedRowIndex]["attributename"] = this.editForm.attributename;
        this.tableData[this.selectedRowIndex]["fieldType"] = this.editForm.fieldType;
        if (this.editForm.fieldType == "enum") {
          this.tableData[this.selectedRowIndex]["fieldType"] = "char"
          this.tableData[this.selectedRowIndex]["lengthLimit"] = 255;
        } else if (this.editForm.fieldType == "float") {
          this.tableData[this.selectedRowIndex]["lengthLimit"] = 24;
        } else {
          this.tableData[this.selectedRowIndex]["lengthLimit"] = parseInt(this.editForm.maxLength);
        }
        this.tableData[this.selectedRowIndex]["isNotNull"] = this.editForm.isNotNull;
        this.tableData[this.selectedRowIndex]["choose"] = "true";

        // 约束展示
        this.showLimits[this.selectedRowIndex]["attributename"] = this.editForm.attributename;
        this.showLimits[this.selectedRowIndex]["fieldType"] = this.field2name(this.editForm.fieldType); // 转换为名称
        if (this.editForm.fieldType != "enum") {
          this.showLimits[this.selectedRowIndex]["limit"] = this.editForm.minLength + "-" + this.editForm.maxLength
        } else {
          let enums = []
          this.editForm.enumeration.forEach((value, index) => {
            if(value['value'] != "全选"){
              enums.push(value['value'])
            }
          })
          this.showLimits[this.selectedRowIndex]["limit"] = enums.join('\n')
        }
        this.showLimits[this.selectedRowIndex]["sample"] = this.editForm.sample;
        this.showLimits[this.selectedRowIndex]["isNotNull"] = this.editForm.isNotNull;

        // 约束
        if (this.editForm.fieldType == "enum") {
          this.limitations[this.selectedRowIndex]['tokenEnume'] = "true"
          let itemEnumeList = []
          this.editForm.enumeration.forEach((value, index) => {
            let item = {}
            item['enumes'] = value['value']
            itemEnumeList.push(item)
          })
          this.limitations[this.selectedRowIndex]['itemEnume'] = itemEnumeList
        } else if (this.editForm.fieldType == "char") {
          this.limitations[this.selectedRowIndex]['tokenEnume'] = "false"
          this.limitations[this.selectedRowIndex]['itemEnume'] = "null"
          this.limitations[this.selectedRowIndex]['lengthMin'] = parseInt(this.editForm.minLength)
          this.limitations[this.selectedRowIndex]['lengthMax'] = parseInt(this.editForm.maxLength)
        } else {   //lengthMin暂定为大小约束
          this.limitations[this.selectedRowIndex]['tokenEnume'] = "false"
          this.limitations[this.selectedRowIndex]['itemEnume'] = "null"
          this.limitations[this.selectedRowIndex]['lengthMin'] = parseFloat(this.editForm.minLength)
          this.limitations[this.selectedRowIndex]['lengthMax'] = parseFloat(this.editForm.maxLength)
        }

        // 示范数据
        this.samples[this.selectedRowIndex][this.editForm.attributename] = this.editForm.sample
        // 修改
        this.tableFormList[this.selectedRowIndexForSelect] = JSON.parse(JSON.stringify(this.editForm))
        this.tableFormList[this.selectedRowIndexForSelect]['enumerationForSelect'] = this.enumerationForSelect
        this.editFormVisible = false;
        console.log("edit ------ end")
      })
      this.enumerationForSelect = []
    },
    next() {
      if (this.active == 1 && (this.tableHeader.dataname == "" || this.tableHeader.descript == "")) {
        if (this.tableHeader.dataname == "") {
          this.$notify.error({
            title: '错误',
            message: '文件名不能为空'
          });
        } if (this.tableHeader.descript == "") {
          this.$notify.error({
            title: '错误',
            message: '文件描述不能为空'
          });
        }
        return;
      }
      if (this.active == 2 && (this.tableData.length < 1 || this.tableData == [])) {
        alert("数据项不能为空！")
        return;
      }
      if (this.active++ > 3) this.active = 1;
    },
    before() {
      if (this.active-- < 1) this.active = 1;
    },
    field2name(f) {
      let field = {
        enum: "枚举",
        float: "数字",
        char: "字符"
      }
      return field[f]
    },
    removeEnum(item) {
      var index = this.tableForm.enumeration.indexOf(item)
      if (index !== -1) {
        this.tableForm.enumeration.splice(index, 1)
      }
    },
    removeEnumForEdit(item) {
      var index = this.editForm.enumeration.indexOf(item)
      if (index !== -1) {
        this.editForm.enumeration.splice(index, 1)
      }
    },
    addEnum() {
      this.tableForm.enumeration.push({
        value: '',
      });
    },
    addEnumForEdit() {
      this.editForm.enumeration.push({
        value: '',
      });
    },
    handleEdit(index, row) {
      this.editFormVisible = true;
      this.selectedRowIndexForSelect = index
      this.editForm = JSON.parse(JSON.stringify(this.tableFormList[index])); // 进行深层复制，防止用户点击取消时，数据仍然改变了
      if(this.keys.includes(this.editForm.attributename)){
        this.currentSampleArray = this.sampleSet[this.editForm.attributename]
        this.editForm['SampleArray'] = this.currentSampleArray
      }else{
        this.currentSampleArray = []
        this.editForm['SampleArray'] = []
      }
      if(this.editForm.enumerationForSelect){
        this.enumerationForSelect = this.editForm.enumerationForSelect
      }
      console.log("handle Edit")
      console.log(this.editForm)
      console.log("handle Edit Done")
      this.selectedRowIndex = index
    },
    handleDelete(index, row) { // 删除一行
      this.tableData.splice(index, 1);
      this.showLimits.splice(index, 1);
      this.limitations.splice(index, 1);
      this.samples.splice(index, 1);
      this.tableFormList.splice(index, 1);
    },
    // clearIntLimitation() {// 在最终上传时，int类型没有约束
    //   let deleted_int_limitations = []
    //   for (let i = 0; i < this.limitations.length; i++) {
    //     if (this.limitations[i]['tokenEnume'] != "float") {
    //       deleted_int_limitations.push(this.limitations[i])
    //     }
    //   }
    //   this.limitations = deleted_int_limitations;
    // },
    async upload() {
      let a = {};
      a["tableName"] = this.tableHeader.dataname;
      a["tableDescription"] = this.tableHeader.descript;
      a["customTables"] = this.tableData;
      a["tableUsername"] = this.current_username;
      console.log(a)
      try {
        var create_table_response = await createTable(a);
      } catch (error) {
        this.$alert("创建表失败" + a, "提示", {
          confirmButtonText: "确定",
          callback: (action) => { },
        });
        this.active = 1;
        console.log(1)
        return;
      }

      if(!create_table_response.success){
        this.$alert("创建表失败" + a, "提示", {
          confirmButtonText: "确定",
          callback: (action) => { },
        });
        this.active = 1;
        console.log(1)
        return;
      }

      // // 建立表的约束
      // this.clearIntLimitation() // 首先删除int的约束，此约束无用

      try {
        var limits_response = await limits(this.limitations)
      } catch (error) {
        this.$alert("建立字段约束失败，请重新编辑字段约束信息" + this.limitations, "提示", {
          confirmButtonText: "确定",
          callback: (action) => { },
        });
        this.active = 2;
        console.log(2)
        return;
      }

      // 新增示范数据
      let upload_sample_data = {}
      let sample_data = []
      let sample_data_contact = {}
      this.samples.forEach((value, index) => {
        sample_data_contact = Object.assign(sample_data_contact, value)
      })
      sample_data.push(sample_data_contact)
      upload_sample_data["data"] = sample_data
      let relationMap = {}
      this.tableData.forEach((value, index) => {
        relationMap[value.attributename] = value.attributename
      })
      upload_sample_data["relationMap"] = relationMap
      upload_sample_data["tableName"] = this.tableHeader.dataname
      console.log(upload_sample_data)

      try {
        var sample_response = await sample(upload_sample_data)
      } catch (error) {
        this.$alert("示范数据与字段约束不匹配，请修改后再次提交", "提示", {
          confirmButtonText: "确定",
          callback: (action) => { },
        });
        this.active = 2;
        console.log(3)
        return;
      }

      this.$message({
        message: "上传成功",
        type: "success",
      });
      this.$router.push("/")
      this.tableHeader.dataname =
        this.tableHeader.descript =
        "";
      this.tableForm = {
        attributename: "",
        fieldType: "char",
        sample: "",
        minLength: "0",
        maxLength: "50",
        isNotNull: "true",
        choose: "选项2",
        enumeration: [{ value: '' }]
      }
      this.tableData = [];
      this.limitations = [];
      this.showLimits = [];
      this.samples = [];
      this.active = 1;
    },
    clearInput() {
      this.tableForm.attributename = ""
      this.tableForm.sample = ""
      this.tableForm.minLength = "0"
      this.tableForm.maxLength = "50"
      this.tableForm.isNotNull = "true"
      this.tableForm.choose = "选项2"
      this.tableForm.enumeration = [{ value: '' }]
    },
    addInput() {

      if (!this.tableForm.attributename || this.tableForm.attributename == "") {
        this.$notify.error({
          title: '错误',
          message: '列名不能为空'
        });
        return;
      }
      if (!this.tableForm.sample || this.tableForm.sample == "") {
        this.$notify.error({
          title: '错误',
          message: '示范数据不能为空'
        });
        return;
      }
      if (this.tableForm.fieldType == "float" && (Number.isNaN(parseFloat(this.tableForm.sample)) || (parseFloat(this.tableForm.sample) < parseFloat(this.tableForm.minLength)
         || parseFloat(this.tableForm.sample) > parseFloat(this.tableForm.maxLength)))) {
        this.$notify.error({
          title: '错误',
          message: '示范数据必须为数字类型且在约束范围内'
        });
        return;
      }
      if (!this.tableForm.sample || this.tableForm.sample == "") {
        this.$notify.error({
          title: '错误',
          message: '示范数据不能为空'
        });
        return;
      }
      if (this.tableForm.fieldType === "enum" && this.tableForm.enumeration[0].value == "") {
        this.$notify.error({
          title: '错误',
          message: '枚举项不能为空'
        });
        return;
      }
      if (
        !this.tableForm.attributename &&
        !this.tableForm.fieldType &&
        !this.tableForm.maxLength &&
        !this.tableForm.minLength &&
        !this.tableForm.sample
      ) {
        this.$alert("不能为空", "标题名称", {
          confirmButtonText: "确定",
          callback: (action) => {
            this.$message({
              type: "info",
              message: `action: ${action}`,
            });
          },
        });
        return;
      }

      this.$refs['tableForm'].validate((valid) => {
        if (!valid) {
          return
        }

        // 若是枚举类，则判断示范数据是否包含在枚举项中
        let flag = false
        if (this.tableForm.fieldType == "enum") {
          for (let i = 0; i < this.tableForm.enumeration.length; i++) {
            console.log("testttttt")
            if (this.tableForm.sample === this.tableForm.enumeration[i].value) {
              flag = true
              break
            }
          }
        }
        if (!flag && this.tableForm.fieldType == "enum") {
          this.$notify.error({
            title: '错误',
            message: '示范数据必须为枚举项'
          });
          return;
        }

        // 若是字符类，则判断示范数据长度是否符合约束
        if (this.tableForm.fieldType == "char" && (this.tableForm.sample.length < this.tableForm.minLength
         || this.tableForm.sample.length > this.tableForm.maxLength)) {
          this.$notify.error({
            title: '错误',
            message: '示范数据必须在约束范围内'
          });
          return;
        }

        // 若是数字类，则判断示范数据大小是否符合约束
        if (this.tableForm.fieldType == "float" && (Number.isNaN(parseFloat(this.tableForm.sample)) || (parseFloat(this.tableForm.sample) < parseFloat(this.tableForm.minLength)
         || parseFloat(this.tableForm.sample) > parseFloat(this.tableForm.maxLength)))) {
          this.$notify.error({
            title: '错误',
            message: '示范数据必须在约束范围内且必须为数字'
          });
          return;
        }

        let current_field = {}
        current_field.attributename = this.tableForm.attributename;
        current_field.fieldType = this.tableForm.fieldType
        current_field.sample = this.tableForm.sample
        current_field.minLength = this.tableForm.minLength;
        current_field.maxLength = this.tableForm.maxLength
        current_field.isNotNull = this.tableForm.isNotNull
        current_field.choose = this.tableForm.choose
        current_field.enumeration = this.tableForm.enumeration
        this.tableFormList.push(current_field)

        // 1. 首先新增建表所需数据
        let a = {};
        // console.log(this.data);
        a["attributename"] = this.tableForm.attributename;
        a["fieldType"] = this.tableForm.fieldType;
        if (this.tableForm.fieldType == "enum") {
          a["fieldType"] = "char"
          a["lengthLimit"] = 255;
        } else if (this.tableForm.fieldType == "float") {
          a["lengthLimit"] = 24;
        } else {
          a["lengthLimit"] = parseInt(this.tableForm.maxLength);
        }
        a['isNotNull'] = this.tableForm.isNotNull
        a["choose"] = "true";
        // console.log(a);
        this.tableData.push(a);

        // 2. 添加展示约束情况数据
        let showLimit = {};
        showLimit["attributename"] = this.tableForm.attributename;
        showLimit["fieldType"] = this.field2name(this.tableForm.fieldType); // 转换为名称
        if (this.tableForm.fieldType != "enum") {
          showLimit["limit"] = this.tableForm.minLength + "-" + this.tableForm.maxLength
        } else {
          let enums = []
          this.tableForm.enumeration.forEach((value, index) => {
            enums.push(value['value'])
          })
          showLimit["limit"] = enums.join('\n')
        }
        showLimit["sample"] = this.tableForm.sample;
        if (this.tableForm.isNotNull == 'true') {
          showLimit["isNotNull"] = "是"
        } else {
          showLimit["isNotNull"] = "否"
        }
        this.showLimits.push(showLimit);
        console.log(showLimit)

        // 3. 定义发送请求的约束数据
        let limit = {}
        limit['tableName'] = this.tableHeader.dataname
        limit['columnName'] = this.tableForm.attributename

        if (this.tableForm.fieldType == "enum") {
          limit['tokenEnume'] = "true"
          let itemEnumeList = []

          this.tableForm.enumeration.forEach((value, index) => {
            let item = {}
            item['enumes'] = value['value']
            itemEnumeList.push(item)
          })
          limit['itemEnume'] = itemEnumeList
          this.limitations.push(limit)
        } else if (this.tableForm.fieldType == "char") {
          limit['tokenEnume'] = "false"
          limit['itemEnume'] = "null"
          limit['lengthMin'] = parseInt(this.tableForm.minLength)
          limit['lengthMax'] = parseInt(this.tableForm.maxLength)
          this.limitations.push(limit)
        } else {   // double 
          limit['tokenEnume'] = "false"
          limit['itemEnume'] = "null"
          limit['lengthMin'] = parseFloat(this.tableForm.minLength)
          limit['lengthMax'] = parseFloat(this.tableForm.maxLength)
          this.limitations.push(limit)
        }

        // 4. 添加示范数据
        let entity_sample = {}
        if (this.tableForm.sample != "" && this.tableForm.sample) {
          entity_sample[this.tableForm.attributename] = this.tableForm.sample
          this.samples.push(entity_sample)
        } else {
          entity_sample[this.tableForm.attributename] = " "
          this.samples.push(entity_sample)
        }

        this.addType = false
        this.clearInput()
        this.tableForm.fieldType = "char"
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.el-col {
  border: 1px solid transparent;
}

.all {
  margin-left: 20%;
  margin-right: 20%;
}

.first-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
}

.el-select {
  width: 100%;
}

label {
  width: 150px;
}

.secend-block {
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 800px;
}

.top-block {
  margin-top: 20px;
}
</style>
