<template>
  <div class="all" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="tip">
      <h3 align="center">上传文件提示</h3>
      文件格式要求单表头，行列无杂乱数据，不支持合并单元格和内部多空行等杂乱数据格式上传；若无法上传，请更改后重新上传。
    </div>
<h3></h3>
<h3>标准上传文件模板示例</h3>
    <div class="demo-image__placeholder">
      <!-- <div class="block">
        <el-image :src="src" style="width: 1200px; height: 320px"></el-image>
      </div> -->
      <el-table
        :data="uploadExample"
        style="width: 100%">
        <el-table-column
          prop="savedGroupName"
          label="保存机构名称">
        </el-table-column>
        <el-table-column
          prop="inventoryCode"
          label="库存清单">
        </el-table-column>
        <el-table-column
          prop="sampleType"
          label="样本类别">
        </el-table-column>
        <el-table-column
          prop="gleanedDate"
          label="采集日期">
        </el-table-column>
        <el-table-column
          prop="savedMethod"
          label="样本类别">
        </el-table-column>
        <el-table-column
          prop="donatorId"
          label="捐赠人编号">
        </el-table-column>
        <el-table-column
          prop="deseaseName"
          label="疾病名称">
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别">
        </el-table-column>
        <el-table-column
          prop="age"
          label="年龄">
        </el-table-column>
        <el-table-column
          prop="sampleCount"
          label="样本份数">
        </el-table-column>
        <el-table-column
          prop="nation"
          label="民族">
        </el-table-column>
        <el-table-column
          prop="hometown"
          label="籍贯">
        </el-table-column>
        <el-table-column
          prop="birthplace"
          label="出生地">
        </el-table-column>
      </el-table>
    </div>

    <el-upload
      class="upload-demo"
      drag
      action="http://8.134.49.56:8000/upload/import"
      multiple
      :on-success="upSuccess"
      style="margin-top: 50px"
      :before-upload="beforeUpload"
      :on-progress="onProgress"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传excle和csv文件</div>
    </el-upload>

     <h3></h3>
      <h3></h3>
       <h3></h3>
  </div>
</template>

<script>

import pic from "@/assets/20220613195546.png";

export default {
  data() {
    return {
      originalField: {},
      file: null,
      src: pic,
      fullscreenLoading: false,
      uploadExample: [
        {
          savedGroupName: "中山大学附属肿瘤医院",
          inventoryCode: "221376-2022764",
          sampleType: "白细胞",
          gleanedDate: "采集日期",
          savedMethod: "-80℃",
          donatorId: "314827",
          deseaseName: "C11.200鼻咽侧壁恶性肿瘤",
          gender: "女",
          age: "42",
          sampleCount: "500ul",
          nation: "汉族",
          hometown: "广东省增城市",
          birthplace: "广东省增城市"
        },
        {
          savedGroupName: "中山大学附属肿瘤医院",
          inventoryCode: "221376-2022764",
          sampleType: "白细胞",
          gleanedDate: "采集日期",
          savedMethod: "-80℃",
          donatorId: "314827",
          deseaseName: "C11.200鼻咽侧壁恶性肿瘤",
          gender: "女",
          age: "42",
          sampleCount: "500ul",
          nation: "汉族",
          hometown: "广东省增城市",
          birthplace: "广东省增城市"
        },
        {
          savedGroupName: "中山大学附属肿瘤医院",
          inventoryCode: "221376-2022764",
          sampleType: "白细胞",
          gleanedDate: "采集日期",
          savedMethod: "-80℃",
          donatorId: "314827",
          deseaseName: "C11.200鼻咽侧壁恶性肿瘤",
          gender: "女",
          age: "42",
          sampleCount: "500ul",
          nation: "汉族",
          hometown: "广东省增城市",
          birthplace: "广东省增城市"
        }
      ],
      isAuto: false,
      dataname: "",
      descript: "",
      tableName: null,
    };
  },
  created() {
    this.tableName = this.$route.params.tableName;
    if(this.$route.params.isAuto == true){
      this.isAuto = true
      this.dataname = this.$route.params.dataname
      this.descript = this.$route.params.descript
    }
  },
  methods: {
    onProgress(){
      this.fullscreenLoading = true;
    },
    upSuccess(response, file, fileList) {
      this.originalField = response.data[1];
      let obj = [];
      Object.keys(this.originalField).some((key) => {
        obj.push({ key: key, value: this.originalField[key] });
      });
      this.originalField = obj; // originalField 是在映射时候初始显示的值，表示得到的数据内容第一行
      this.fullscreenLoading = false;
      if(this.isAuto){
        this.$router.push({
        name: "create",
        params: {
          isAuto: true,
          keys: this.originalField,
          file: this.file, // 文件信息
          data: response.data,
          dataname: this.dataname,
          descript: this.descript
        },
      });
      }else{
        this.$router.push({
        name: "Mapping",
        params: {
          val: this.originalField,
          file: this.file, // 文件信息
          data: response.data,
          tableName: this.tableName,
        },
      });
      }
      
    },

    beforeUpload(file) {
      this.file = file;
    },

    employeesdetails(id) {},
  },
};
</script>

<style scoped>
.all {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tip {
  width: 400px;
  background-color: rgb(242, 241, 241);
  padding: 20px;
  border-radius: 6px;
  margin-top: 20px;
}
</style>
