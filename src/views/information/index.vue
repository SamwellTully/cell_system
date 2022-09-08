<template>
  <div class="all" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="tip">
      <h3 align="center">数据转换提示</h3>
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
      :on-error="upError"
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
import { boolean } from "yargs";

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

      tableName: null,
    };
  },
  created() {
    this.tableName = this.$route.params.tableName;
  },
  methods: {
    onProgress(){
      this.fullscreenLoading = true;
    },
    upError(response){
      this.fullscreenLoading = false;
        this.$alert("文件上传格式有误：" + response.data, "提示", {
          confirmButtonText: "确定",
          callback: (action) => {
            if (action === "confirm") {
              console.log(selectTableName)
              this.$router.push({
              name: "Example",
              params: {
                tableName: selectTableName, 
                //跳转至上传页面时携带所选表页面
              },
            });
            }
          },
        });
    },
    async upSuccess(response, file, fileList) {
      this.originalField = response.data[1];
      let obj = []; //上传表的表头与示范数据对
      let upAllKeys = [] //上传文件的所有表头字段
      //取上传文件的表头并整理
      Object.keys(this.originalField).some((key) => {
        obj.push({ key: key, value: this.originalField[key] });
        upAllKeys.push(key)
      });

      //已通过格式判断，现进行表头字段判断
      let selectTableName = this.$route.params.tableName;
      let getDataParams = new URLSearchParams();
      getDataParams.append("tableName", selectTableName);
      let selectAllKeys = [] //所选表的所有表头字段
      await this.$axios({
        method: 'post',
        url: "http://8.134.49.56:8000/G/getdata",
        data: getDataParams
      }).then((response) => {
        selectAllKeys = Object.keys(response.data[0]) // response.data返回的是个数组，里面只有一个元素，为该表的示范数据（键值对），通过keys()获得所有键
      })
      let lackCol = []; //用以记录上传表与所选表的表头差异
      var flag = true;
      for(let i = 0; i < selectAllKeys.length; i++){
        if(upAllKeys.includes(selectAllKeys[i]) == false && selectAllKeys[i] != "导入时间" && selectAllKeys[i] != "操作人"){
          flag = false;
          lackCol.push(selectAllKeys[i])
        }
      }

      //表头字段判断通过
      if(flag){
        //进行内容校验
        //参数沿用上述定义变量
        let selectAllKeysDic = {}; //表头字段的键值对形式
        for(let i = 0; i < selectAllKeys.length; i++){
          selectAllKeysDic[selectAllKeys[i]] = selectAllKeys[i]
        }
        const formData = new FormData();
        formData.append("file",this.file);
        await this.$axios({
            method: 'post',
            url: "http://8.134.49.56:8000/G/check",
            data: formData,
            params:{tableName:selectTableName, relationString:JSON.stringify(selectAllKeysDic)}
            }).then((response) => {
                if(response.data.code != 200){
                  //非正确返回值
                  this.fullscreenLoading = false;
                  this.$alert("上传文件失败，请重新上传", "提示", {
                  confirmButtonText: "确定",
                  callback: (action) => {
                    if (action === "confirm") {
                      this.$router.push({
                      name: "Example",
                      params: {
                      tableName: selectTableName, 
                      //跳转至上传页面时携带所选表页面
                      },
                    });
                  }
                },
              });
            }else if(response.data.data.wrongInfList.length != 0){
                  this.fullscreenLoading = false;
                  this.$alert("上传文件内容有误，请重新上传", "提示", {
                  confirmButtonText: "确定",
                  callback: (action) => {
                    if (action === "confirm") {
                      this.$router.push({
                      name: "Example",
                      params: {
                      tableName: selectTableName, 
                      //跳转至上传页面时携带所选表页面
                      },
                    });
                  }
                  //输出至文本的字符串
                  let wrongList = '';
                  for(let i = 0; i < response.data.data.wrongInfList.length; i++){
                    wrongList += (response.data.data.wrongInfList[i] + '\n'); //添加换行符
                  }
                  //var data = JSON.stringify(response.data.data.wrongInfList);
                  let str = new Blob([wrongList] , {type : 'text/plain;charset=utf-8'});
                  saveAs(str,'错误信息.txt');
                },
              });
            }
        })
        
        //文件内容检验正确
        this.originalField = obj; // originalField 是在映射时候初始显示的值，表示得到的数据内容第一行
        this.fullscreenLoading = false;
        this.$router.push({
          name: "Translate",
          params: {
            val: this.originalField,
            file: this.file, // 文件信息
            data: response.data,
            tableName: this.tableName,
          },
        });
      }else{
        this.fullscreenLoading = false;
        this.$alert("上传文件信息有误,缺乏列：" + lackCol, "提示", {
          confirmButtonText: "确定",
          callback: (action) => {
            if (action === "confirm") {
              console.log(selectTableName)
              this.$router.push({
              name: "Example",
              params: {
                tableName: selectTableName, 
                //跳转至上传页面时携带所选表页面
              },
            });
            }
          },
        });
        //需要展示缺少的列信息
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
