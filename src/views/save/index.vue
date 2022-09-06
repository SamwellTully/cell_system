<template>
  <div class="app-container">
    <el-row
      :gutter="20"
      style="display: flex; align-items: center"
      type="flex"
      justify="center"
    >
      <el-col :span="20"
        ><div class="grid-content">
          <h3>保存内容</h3>
          <el-table :data="replaceContent" border style="width: 100%" height="500">
              <el-table-column
                v-for="(item,index) in tableHeader"
                :label="item.key"
                :key="index">
                <template scope="scope">
                  <el-input
                    v-model="scope.row[item.key]"
                    type="text"
                  ></el-input>
                </template>
              </el-table-column>
          </el-table>
          </div
      ></el-col>
    </el-row>

    <el-row
      :gutter="20"
      style="display: flex; align-items: center"
      type="flex"
      justify="center"
    >
      <el-col :span="6"><div class="grid-content"></div></el-col>

      <el-col :span="6"
        ><div class="grid-content">
          <el-button @click="saveData()" type="primary" style="width: 100%"
            >保存</el-button
          >
        </div></el-col
      >
      <el-col :span="6"
        ><div class="grid-content">
          <el-button @click="exportData()" type="primary" style="width: 100%"
            >导出</el-button
          >
        </div></el-col
      >
      <el-col :span="6"><div class="grid-content"></div></el-col>
    </el-row>
    <el-dialog title="文件下载中" :visible.sync="downloadProgressShow">
      <el-progress  :percentage="filePercentage" color="red"></el-progress>
    </el-dialog>
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
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
.el-aside {
  color: #333;
}
.el-table td,
.el-table th {
  text-align: center;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
import Axios from "axios";
import axios from "axios";
import ind from '../test/ind.vue';
export default {
  components: { ind },
  data() {
    return {
      replaceContent: null,
      relationMap: null,
      tableName: null,
      tableHeader: [],
      filePercentage: 0,
      downloadProgressShow: false,
    };
  },

  created() {
    this.replaceContent = this.$route.params.data;
    this.relationMap = this.$route.params.map;
    this.tableName = this.$route.params.name;
    this.tableHeader = this.$route.params.header;

    console.info(this.replaceContent);
    console.info(this.relationMap);
    console.info(this.tableName);
    console.info(this.tableHeader)
  },

  methods: {

    saveData() {
    //   let data = new FormData();
    //   data.append("data", JSON.stringify(this.replaceContent));
    //   data.append("relationMap", this.relationMap);
    //   data.append("tableName", this.tableName);

      let data = {};
      data["data"]=this.replaceContent;
      data["relationMap"]= this.relationMap;
      data["tableName"]=this.tableName;

    //   this.$axios({
    //       methods:'post',
    //       url:'http://8.134.49.56:8000/save/saveData',
    //       data: data,
    //       header:{
    //           'Content-Type': 'application/json;charset=UTF-8'
    //       }
    //   }).then((res)=>{
    //       this.$alert("保存成功", "提示", {
    //       confirmButtonText: "确定",
    //       callback: (action) => {},
    //     });
    //   });

      console.log("ok")
      this.$http.post("http://8.134.49.56:8000/save/saveData", JSON.stringify(data)).then((res) => {
        console.log(res)
        this.$alert("保存成功", "提示", {
          confirmButtonText: "确定",
          callback: (action) => {
            if (action === "confirm") {
              this.$router.push({
                name: "Dashboard",
              });
            }
          },
        });
      });
    },
    getRandom(min, max) { //根据最小值和最大值产生一个随机数
      return Math.round(Math.random() * (max - min) + min);
    },
    exportData() {
    //   let data = new FormData();
    //   data.append("data", JSON.stringify(this.replaceContent));
    //   data.append("relationMap", this.relationMap);
    //   data.append("tableName", this.tableName);
      this.percentage = 0;
      this.isDisabled = true;
      let data = {};
      data["data"]=this.replaceContent;
      data["relationMap"]= this.relationMap;
      data["tableName"]=this.tableName;
      
      this.downloadProgressShow = true;
      let culPer = window.setInterval(()=>{
      let per = this.filePercentage;
      console.log("当前下载进度："+per)
      if(per > 78){
          this.filePercentage = 99;
          return;
      }
      let addNum = this.getRandom(10,20);
      this.filePercentage = per+addNum;
      },1000);

      axios({
        method: 'post',
        url: 'http://8.134.49.56:8000/save/exportData',
        responseType: 'blob', //设置返回信息为二进制文件，默认为json
        data: data, //后台照常用@RequestBody接收即可
    }).then(response => {
        // debugger;
        setTimeout(()=>{
          const blob = new Blob([response.data],{type: 'application/vnd.ms-excel'});
          const fileName = "文件.xlsx";
          const linkNode = document.createElement("a");
          linkNode.download = fileName; //a标签的download属性规定下载文件的名称
          linkNode.style.display = "none";
          linkNode.href = URL.createObjectURL(blob,{ type: 'application/vnd.ms-excel' }); //生成一个Blob URL
          document.body.appendChild(linkNode);
          linkNode.click(); //模拟在按钮上的一次鼠标单击
          URL.revokeObjectURL(linkNode.href); // 释放URL 对象
          document.body.removeChild(linkNode);
          // 成功之后清空选择的数据
          this.selectedRowKeys = [];
          this.filePercentage = 0;
          window.clearInterval(culPer);
          this.downloadProgressShow = false;
          this.$alert("导出成功,请于下载路径或默认路径获取文件", "提示", {
            confirmButtonText: "确定",
            callback: (action) => {},
          });
        }, 5000)
        
    });
        // this.$http.post("http://localhost:8000/save/exportData", JSON.stringify(data)).then((response) => {
        // this.$alert("导出成功", "提示", {
        //   confirmButtonText: "确定",
        //   callback: (action) => {},
        // });
        
      //   const blob = new Blob([response.data],{type: 'application/vnd.ms-excel'});
      //   const fileName = "用户管理.xlsx";
      //   const linkNode = document.createElement("a");
      //   linkNode.download = fileName; //a标签的download属性规定下载文件的名称
      //   linkNode.style.display = "none";
      //   linkNode.href = URL.createObjectURL(blob,{ type: 'application/vnd.ms-excel' }); //生成一个Blob URL
      //   document.body.appendChild(linkNode);
      //   linkNode.click(); //模拟在按钮上的一次鼠标单击
      //   URL.revokeObjectURL(linkNode.href); // 释放URL 对象
      //   document.body.removeChild(linkNode);
      //   // 成功之后清空选择的数据
      //   this.selectedRowKeys = [];
      // });

    },
  },
 
};
</script>
