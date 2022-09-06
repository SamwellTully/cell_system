<template>
  <div class="app-container">
    <el-row
      :gutter="20"
      style="display: flex; align-items: center"
      type="flex"
      justify="center"
    >
      <el-col :span="9"
        ><div class="grid-content"><h3>未关联字段</h3></div></el-col
      >

      <el-col :span="2"><div class="grid-content"></div></el-col>

      <el-col :span="7"
        ><div class="grid-content">
          <h3>
            目标字段组<template>
              <el-select
                v-model="value"
                @change="handleSelectChange"
                style="margin-left: 10px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </h3></div
      ></el-col>
      <el-col :span="2"
        ><div class="grid-content">
          <el-button type="primary" @click="add" style="width: 90px">关联</el-button>
        </div></el-col
      >
    </el-row>

    <el-row
      :gutter="20"
      style="display: flex; align-items: center"
      type="flex"
      justify="center"
    >
      <el-col :span="9"
        ><div class="grid-content">
          <template>
            <el-table
              ref="t1"
              :data="table1"
              border
              highlight-current-row
              @current-change="handleCurrentChange1"
              @row-click="rowclick1"
              style="width: 100%"
              height="230"
            >
              <el-table-column fixed prop="key" label="源字段">
                <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.flag === 1 ? 'info' : ''"
                    disable-transitions
                    >{{ scope.row.key }}</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column prop="value" label="实例数据"> </el-table-column>
            </el-table>
          </template></div
      ></el-col>

      <el-col :span="2"><div class="grid-content"></div></el-col>

      <el-col :span="9"
        ><div class="grid-content">
          <template>
            <el-table
              ref="t2"
              :data="table2"
              border
              highlight-current-row
              @current-change="handleCurrentChange2"
              @row-click="rowclick2"
              style="width: 100%"
              height="230"
            >
              <el-table-column fixed prop="key" label="目标字段">
                <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.flag === 1 ? 'info' : ''"
                    disable-transitions
                    >{{ scope.row.key }}</el-tag
                  >
                </template></el-table-column
              >
              <el-table-column fixed prop="value" label="字段描述">
              </el-table-column> </el-table
          ></template></div
      ></el-col>
    </el-row>

    <el-row
      :gutter="20"
      style="display: flex; align-items: center"
      type="flex"
      justify="center"
    >
      <el-col :span="20"
        ><div class="grid-content">
          <template>
            <h3>已关联字段</h3>
            <el-table :data="table3" border style="width: 100%" height="200">
              <el-table-column fixed prop="key" label="源字段"> </el-table-column>
              <el-table-column prop="value" label="目的字段"> </el-table-column>
              <el-table-column fixed="right" label="操作" width="120">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, table3)"
                    type="text"
                  >
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div></el-col
      >
    </el-row>

    <el-row
      :gutter="20"
      style="display: flex; align-items: center"
      type="flex"
      justify="center"
    >
      <h3><el-button type="primary">下一步</el-button></h3>
    </el-row>
  </div>
</template>

<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
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
export default {
  data() {
    return {
      options: [],
      value: " ",

      table1: [],

      table2: [],

      table3: [],

      originalField: {},
      database: [],

      currentRow1: null,
      currentRow2: null,
      v1: 0,
      v2: 0,
    };
  },

  created() {
    //获取上传的数据
    this.originalField = this.$route.params.val;
    this.table1 = this.originalField;
    // console.info(this.originalField);

    //获取数据库中的表名
    this.getDatabase();

    //初始化数据
    this.value = "relation_map4";
    this.table2 = this.getData(this.value);

    console.info(this.table2.length);

    // let index = this.table2data.findIndex((item) => item.tablename === this.value);
    // this.table2 = this.table2data[index].tabledata;
    // console.info(this.table2data);

    //初始化，选出相同字段
    console.info(this.table1);
    console.info(this.table2);

    this.addFlag();

    console.info(this.table1);
    console.info(this.table2);
  },

  methods: {
    addFlag() {
      console.info("xxxxxxxxxxxxxxxxxxxxxxx");
      for (let i = 0; i < this.table1.length; i++) {
        console.info(i);
        console.info("长度"+this.table2.length);
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
      console.info("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    },

    handleCurrentChange1(val) {
      // console.info(val.key + ":" + val.flag);
      // console.info(val.flag);
      this.v1 = 0;
      if (val != null) {
        if (val.flag != null && val.flag == 0) {
          this.currentRow1 = val;
          // console.info("wo1");
        } else {
          this.$refs.t1.setCurrentRow();
          this.currentRow1 = null;
          // console.info("wo2");
        }
      }
    },
    handleCurrentChange2(val) {
      // console.info(val.key + ":" + val.flag);
      // console.info(val.flag);
      this.v2 = 0;
      if (val != null) {
        if (null != val.flag && val.flag == 0) {
          this.currentRow2 = val;
          // console.info("wo1");
        } else {
          this.$refs.t2.setCurrentRow();
          this.currentRow2 = null;
          // console.info("wo2");
        }
      }
    },

    rowclick1(row, column, event) {
      this.v1 = this.v1 + 1;
      // console.info("row:" + this.v1);
      if (row === this.currentRow1 && this.v1 === 2) {
        this.currentRow1 = null;
        this.$refs.t1.setCurrentRow();
        this.v1 = 0;
      }
    },
    rowclick2(row, column, event) {
      this.v2 = this.v2 + 1;
      if (row === this.currentRow2 && this.v2 === 2) {
        this.currentRow2 = null;
        this.$refs.t2.setCurrentRow();
        this.v2 = 0;
      }
    },

    // 选择器切换表
    handleSelectChange(val) {
      // console.info(val);
      // console.info("切换前表");
      // console.info(this.table2);
      // console.info(this.$refs.t1.data);
      this.value = val;
      // this.$options.methods.upkeydTable2();

      this.table3 = [];

      // let index = this.table2data.findIndex((item) => item["tablename"] === this.value);
      // this.table2 = this.table2data[index].tabledata;
      // console.info("切换后表");
      // console.info(this.table2);

      this.table2 = this.getData(this.value);

      for (let i = 0; i < this.table1.length; i++) {
        for (let j = 0; j < this.table2.length; j++) {
          if (this.table1[i]["key"] === this.table2[j]["key"]) {
            let obj = [];
            obj.key = this.table1[i]["key"];
            obj.value = this.table2[j]["key"];
            this.table3.push(obj);

            this.table1[i]["flag"] = 1;
            console.info(this.table2[j]["key"]);
            this.table2[j]["flag"] = 1;
            console.info(this.table2[j]["flag"]);
            break;
          } else {
            this.table1[i]["flag"] = 0;
            if (this.table2[j]["flag"] != 1) {
              this.table2[j]["flag"] = 0;
            }
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

      if (this.currentRow1.flag === 1) {
        this.$refs.t1.setCurrentRow();
        this.currentRow1 = null;
        this.v1 = 0;
      }
      this.$refs.t2.setCurrentRow();
      this.currentRow2 = null;
      this.v2 = 0;
    },

    add() {
      if (this.currentRow1 !== null && this.currentRow2 !== null) {
        if (this.currentRow1["flag"] === 0 && this.currentRow2["flag"] === 0) {
          let obj = {};
          obj.key = this.currentRow1["key"];
          obj.value = this.currentRow2["key"];
          this.table3.push(obj);
          let index1 = this.table1.findIndex((item) => item["key"] === obj.key);
          this.table1[index1]["flag"] = 1;
          let index2 = this.table2.findIndex((item) => item["key"] === obj.value);
          this.table2[index2]["flag"] = 1;
        }
      } else {
        this.$alert("不能为空", "提示", {
          confirmButtonText: "确定",
          callback: (action) => {},
        });
      }

      //刷新
      this.$refs.t1.setCurrentRow();
      this.$refs.t2.setCurrentRow();
      this.currentRow1 = null;
      this.currentRow2 = null;
      this.v1 = 0;
      this.v2 = 0;
    },

    deleteRow(index, rows) {
      // console.info(rows[index]["key"]);
      let index1 = this.table1.findIndex((item) => item["key"] === rows[index]["key"]);
      this.table1[index1]["flag"] = 0;
      let index2 = this.table2.findIndex((item) => item["key"] === rows[index]["value"]);
      this.table2[index2]["flag"] = 0;
      rows.splice(index, 1);

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
    },

    getDatabase() {
      this.$http.get("http://47.243.141.229:8000/G/getdatabase").then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          let obj = {};
          obj.value = res.data[i]["Generaltable_name"];
          obj.label = res.data[i]["Generaltable_name"];
          this.database.push(obj);
        }
        this.options = this.database;
      });
    },

    getData(name) {
      var url = "http://47.243.141.229:8000/G/getdata";
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
              list.push({ key: key, value: jsonResponse[0][key]});
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
  },
};
</script>


