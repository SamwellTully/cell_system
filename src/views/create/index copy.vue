<template>
  <div class="all">
    <div class="top-block">
      <div class="input-data">
        <label>数据库名称</label
        ><el-input v-model="dataname" placeholder="请输入内容"></el-input>
      </div>
      <div class="input-data">
        <label>描述</label
        ><el-input v-model="descript" placeholder="请输入内容"></el-input>
      </div>
    </div>
    <div class="first-block">
      <div class="input-data">
        <label>字段类型：</label>
        <el-select  @change="clearInput" v-model="fieldType" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <div class="input-data">
        <label>字段名称：</label>
        <el-input v-model="attributename" placeholder="请输入内容"></el-input>
      </div>

      <div v-if="fieldType != 'enum'" class="input-data">
        <label>长度：</label>
        <el-input v-model="lengthLimit" placeholder="请输入内容"></el-input>
      </div>

      <div v-if="fieldType == 'enum'" class="input-data">
        <label>枚举项：</label>
        <el-input v-model="enumeration" placeholder="请输入枚举内容，用英文半角逗号隔开"></el-input>
      </div>

      <div v-if="fieldType == 'char'" class="input-data">
        <label>最小值：</label>
        <el-input v-model="minLength" placeholder="请输入最小值"></el-input>
      </div>
      <div v-if="fieldType == 'char'" class="input-data">
        <label>最大值</label>
        <el-input v-model="maxLength" placeholder="请输入最大值"></el-input>
      </div>

      <div class="input-data">
        <label>是否为空：</label>
        <el-select v-model="isNotNull" placeholder="请选择">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
      </div>

      <div class="input-data">
        <label>示范数据：</label>
        <el-input v-model="sample" placeholder="请输入示范数据"></el-input>
      </div>

      <el-button
        type="primary"
        style="width: 200px; margin-top: 30px"
        @click="addInput"
      >
        添加</el-button
      >
    </div>
    <div class="secend-block">
      <el-table :data="showLimits">
        <el-table-column prop="fieldType" label="类型">
        </el-table-column>
        <el-table-column prop="attributename" label="名称">
        </el-table-column>
        <el-table-column prop="limit" label="字段约束"> </el-table-column>
        <el-table-column prop="isNotNull" label="是否为空"> </el-table-column>
        <el-table-column prop="sample" label="示范数据"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        style="width: 200px; margin-top: 10px"
        @click="upload"
      >
        提交表单</el-button
      >
    </div>
  </div>
</template>

<script>
import Axios from "axios";
export default {
  data() {
    return {
      limitations: [], // 此四个数组为一一对应
      samples: [],
      tableData: [],
      showLimits: [],
      options2: [
        { value: "选项1", label: "true" },
        { value: "选项2", label: "false" },
      ],
      options: [
        {
          value: "char",
          label: "字符",
        },
        {
          value: "int",
          label: "数字",
        },
        {
          value: "enum",
          label: "枚举",
        }
      ],
      fieldType: "",
      sample: "",
      attributename: "",
      lengthLimit: "",
      isNotNull: "",
      dataname: "",
      descript: "",
      enumeration: "",
      maxLength: "",
      minLength: ""
    };
  },
  methods: {
    handleDelete(index, row) { // 删除一行
      this.tableData.splice(index, 1);
      this.showLimits.splice(index, 1);
      this.limitations.splice(index, 1);
      this.samples.splice(index, 1);
    },
    clearIntLimitation(){// 在最终上传时，int类型没有约束
      let deleted_int_limitations = []
      for(let i = 0; i < this.limitations.length; i ++){
        if(this.limitations[i]['tokenEnume'] != "int"){
          deleted_int_limitations.push(this.limitations[i])
        }
      }
      this.limitations = deleted_int_limitations;
    },
    upload() {
      let a = {};
      a["tableName"] = this.dataname;
      a["tableDescription"] = this.descript;
      a["customTables"] = this.tableData;
      let formData = new FormData();
      formData.append("JsonString", JSON.stringify(a));
      console.log(JSON.stringify(a));
      Axios.post("http://8.134.49.56:8000/C/createTable", formData).then(
        (rs) => {
          if(rs.data.code == 200){
            
          }else {
            this.$message({
              message: "建表失败",
              type: "warning",
            });
          }
          console.log(rs);
        }
      );

      // 建立表的约束
      this.clearIntLimitation() // 首先删除int的约束，此约束无用
      let formOfLimits = new FormData()
      formOfLimits.append("JsonString", JSON.stringify(this.limitations))
      console.log("limitations: ")
      console.log(JSON.stringify(this.limitations))
      Axios.post("http://8.134.49.56:8000/C/limits", formOfLimits).then(
        (rs) => {
          if(rs.data.code == 200){

          }else {
            this.$message({
              message: "建表约束失败",
              type: "warning",
            });
          }
          console.log(rs);
        }
      );

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
      upload_sample_data["tableName"] = this.dataname
      console.log(upload_sample_data)
      Axios.post("http://8.134.49.56:8000/C/sample", upload_sample_data).then(
        (rs) => {
          if(rs.data.flag == true){
            this.$message({
              message: "上传成功",
              type: "success",
            });
          }else {
            this.$message({
              message: "上传失败",
              type: "warning",
            });
          }
          console.log(rs);
        }
      );
      

      this.dataname =
      this.descript =
      this.attributename =
      this.fieldType =
      this.lengthLimit =
      this.isNotNull =
      this.enumeration = 
      this.maxLength = 
      this.minLength = 
      this.sample = 
        "";
      this.tableData = [];
      this.limitations = [];
      this.showLimits = [];
      this.samples = [];
    },
    clearInput(value) {
      console.log(this.$route.path)
      this.attributename =
      this.lengthLimit =
      this.isNotNull =
      this.enumeration = 
      this.maxLength = 
      this.minLength = 
      this.sample = 
        "";
    },
    addInput() {
      if (
        !this.attributename &&
        !this.fieldType &&
        !this.lengthLimit &&
        !this.isNotNull
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
      
      // 1. 首先新增建表所需数据
      let a = {};
      // console.log(this.data);
      a["attributename"] = this.attributename;
      a["fieldType"] = this.fieldType;
      if(this.fieldType == "enum"){
        a["fieldType"] = "char"
        a["lengthLimit"] = 255;
      }else{
        a["lengthLimit"] = parseInt(this.lengthLimit);
      }
      a["isNotNull"] = this.isNotNull;
      a["choose"] = "true";
      // console.log(a);
      this.tableData.push(a);

      // 2. 添加展示约束情况数据
      let showLimit = {};
      showLimit["attributename"] = this.attributename;
      showLimit["fieldType"] = this.fieldType;
      if(this.fieldType == "char"){
        showLimit["limit"] = this.minLength + "-" + this.maxLength
      }else if(this.fieldType == "int"){
        showLimit["limit"] = this.lengthLimit
      }else{
        showLimit["limit"] = this.enumeration
      }
      showLimit["sample"] = this.sample;
      showLimit["isNotNull"] = this.isNotNull;
      this.showLimits.push(showLimit);

      // 3. 定义发送请求的约束数据
      let limit = {}
      limit['tableName'] = this.dataname
      limit['columnName'] = this.attributename
      let rangeOfLengthLimit = this.lengthLimit.split('-')

      if(this.fieldType == "enum"){
        limit['tokenEnume'] = "true"
        let itemEnume = this.enumeration.split(',')
        let itemEnumeList = []
        itemEnume.forEach((value, index) => {
          let item = {}
          item['enumes'] = value
          itemEnumeList.push(item)
        })
        limit['itemEnume'] = itemEnumeList
        this.limitations.push(limit)
      }else if (this.fieldType == "char"){
        limit['tokenEnume'] = "false"
        limit['itemEnume'] = "null"
        limit['lengthMin'] = parseInt(this.minLength)
        limit['lengthMax'] = parseInt(this.maxLength)
        this.limitations.push(limit)
      }else{
        limit['tokenEnume'] = "int"
        this.limitations.push(limit)
      }
      
      // 4. 添加示范数据
      let entity_sample = {}
      entity_sample[this.attributename] = this.sample
      this.samples.push(entity_sample)
    },
  },
};
</script>

<style lang="scss" scoped>
.input-data {
  width: 500px;
  display: flex;
}
.all {
  height: 120vh;
  display: flex;
  flex-direction: column;
  align-items: center;
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
