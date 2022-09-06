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
            <el-table
              :data="table3"
              border
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
              <el-table-column fixed prop="key" label="源字段"> </el-table-column>
              <el-table-column prop="value" label="目的字段"> </el-table-column>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click="clickbtn(scope.row)"
                    size="mini"
                    style="margin-right: 50px"
                    >替换</el-button
                  ><el-button
                    @click.native.prevent="deleteRow(scope.$index, table3)"
                    size="mini"
                    style="margin-left: 10px"
                    type="danger"
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

    <el-dialog title="内容替换" :visible.sync="dialogFormVisible">
      <div v-if="currentRow3 != null && multipleSelection.length <= 1">
        <h3>{{ currentRow3["key"] }}</h3>
        <el-form :model="form" :inline="true" size="small">
          <el-form-item label="源值">
            <el-input v-model="form.key" clearable></el-input>
          </el-form-item>
          <el-form-item label="目标值">
            <el-input v-model="form.value" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div v-if="multipleSelection.length > 1">
        <div v-for="(item, index) in multipleSelection" :key="index">
          <h3>{{ multipleSelection[index]["key"] }}</h3>
          <el-form :model="form" :inline="true" size="small">
            <el-form-item label="源值">
              <el-input v-model="form[index].key" clearable></el-input>
            </el-form-item>
            <el-form-item label="目标值">
              <el-input v-model="form[index].value" clearable></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="replacement()">确 定</el-button>
      </div>
    </el-dialog>

    <el-row
      :gutter="20"
      style="display: flex; align-items: center"
      type="flex"
      justify="center"
    >
      <el-col :span="20"
        ><div class="grid-content">
          <template>
            <h3>内容替换</h3>
            <el-table
              :data="replaceField"
              border
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column fixed prop="originalField" label="源字段">
              </el-table-column>
              <el-table-column fixed prop="originalValue" label="源值"> </el-table-column>
              <el-table-column prop="targetValue" label="目标值"> </el-table-column>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow2(scope.$index, replaceField)"
                    size="mini"
                    style="margin-left: 10px"
                    type="danger"
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
      <el-col :span="6"><div class="grid-content"></div></el-col>

      <el-col :span="6"
        ><div class="grid-content">
          <el-button @click="replacementAll()" type="primary" style="width: 100%"
            >确定</el-button
          >
        </div></el-col
      >
      <el-col :span="6"><div class="grid-content"></div></el-col>
    </el-row>

    <!-- <el-row
      :gutter="20"
      style="display: flex; align-items: center"
      type="flex"
      justify="center"
    >
      <el-col :span="9"
        ><div class="grid-content" style="margin-top: 32px">
          <el-form :inline="true" style="display: flex; align-items: center">
            <el-form-item label="导出格式">
              <el-radio-group v-model="resource">
                <el-radio label=".xlsx"></el-radio>
                <el-radio label=".xls"></el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="加密">
              <el-checkbox name="type"></el-checkbox
            ></el-form-item>
          </el-form></div
      ></el-col>

      <el-col :span="2"><div class="grid-content"></div></el-col>
      <el-col :span="9"
        ><div class="grid-content">
          <el-button @click="" type="primary" style="width: 100%">导出</el-button>
        </div></el-col
      >
    </el-row> -->
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
import qs from "qs";

export default {
  data() {
    return {
      options: [],
      value: " ",

      table1: [],

      table2: [],

      table3: [],

      originalField: {},
      file: null,
      database: [],

      currentRow1: null,
      currentRow2: null,
      currentRow3: null,
      v1: 0,
      v2: 0,

      resource: "",

      dialogFormVisible: false,
      form: {
        key: "",
        value: "",
      },
      multipleSelection: [],

      replaceField: [],
    };
  },

  created() {
    //获取上传的数据
    this.originalField = this.$route.params.val;
    this.table1 = this.originalField;
    this.file = this.$route.params.file;

    //初始化表格数据
    this.value = "relation_map4";

    setTimeout(() => {
      //获取数据库中的表名
      this.getDatabase();
    }, 0);

    var x = null;
    setTimeout(() => {
      x = this.getData(this.value);
    }, 100);
    setTimeout(() => {
      this.table2 = x;
    }, 250);

    //刷新
    setTimeout(() => {
      this.refdata();
      this.reftable1();
      this.reftable2();
      this.addFlag();
    }, 350);
  },

  methods: {
    addFlag() {
      if (this.table1.length != 0 && this.table2.length != 0)
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
      //刷新
      this.refdata();
    },

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
    handleCurrentChange2(val) {
      this.v2 = 0;
      if (val != null) {
        if (null != val.flag && val.flag == 0) {
          this.currentRow2 = val;
        } else {
          this.$refs.t2.setCurrentRow();
          this.currentRow2 = null;
          // console.info("wo2");
        }
      }
    },

    rowclick1(row, column, event) {
      this.v1 = this.v1 + 1;
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
      this.value = val;
      this.table3 = [];
      this.replaceField = [];

      var x = null;
      setTimeout(() => {
        console.log("1" + this.table2);
        x = this.getData(this.value);
        console.log(x);
      }, 0);
      setTimeout(() => {
        this.table2 = x;
        console.log("2" + this.table2);
      }, 100);

      //刷新
      setTimeout(() => {
        this.refdata();
        this.reftable1();
        this.reftable2();
        this.addFlag();
        console.log("3" + this.table2);
      }, 200);

      if (this.currentRow1 != null && this.currentRow1.flag === 1) {
        this.$refs.t1.setCurrentRow();
        this.currentRow1 = null;
        this.v1 = 0;
      }
      this.$refs.t2.setCurrentRow();
      this.currentRow2 = null;
      this.v2 = 0;
    },

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

    reftable1() {
      for (let i = 0; i < this.table1.length; i++) {
        this.table1[i]["flag"] = 0;
      }
    },

    reftable2() {
      for (let i = 0; i < this.table2.length; i++) {
        this.table2[i]["flag"] = 0;
      }
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

    clickbtn(row) {
      this.currentRow3 = row;
      this.form["key"] = "";
      this.form["value"] = "";
      this.dialogFormVisible = true;
    },

    replacement() {
      this.dialogFormVisible = false;

      let obj = {};

      obj["originalField"] = this.currentRow3["key"];
      obj["targetField"] = this.currentRow3["value"];
      obj["originalValue"] = this.form["key"];
      obj["targetValue"] = this.form["value"];

      this.replaceField.push(obj);
    },

    deleteRow2(index, rows) {
      rows.splice(index, 1);
    },

    replacementAll() {
      let obj1 = {};
      let obj2 = {};

      for (let i = 0; i < this.replaceField.length; i++) {
        obj1[this.replaceField[i]["originalField"]] = this.replaceField[i]["targetField"];
        obj2[this.replaceField[i]["originalField"]] = [];
      }

      for (let i = 0; i < this.replaceField.length; i++) {
        let obj = {};
        obj[this.replaceField[i]["originalValue"]] = this.replaceField[i]["targetValue"];
        obj2[this.replaceField[i]["originalField"]].push(obj);
      }

      for (const key in obj2) {
        let val = {};
        val = Object.values(obj2[key]);
        console.log(val);

        let obj = {}
        for (const key2 in val){
          console.log(Object.keys(val[key2])[0]);
          console.log(Object.values(val[key2])[0]);
          let k = Object.keys(val[key2])[0];
          let v = Object.values(val[key2])[0];
          obj[k]=v;
        }

        obj2[key] = obj;
      }

      let data = new FormData();
      data.append("file", this.file);
      data.append("relationString", JSON.stringify(obj1));
      data.append("hashString", JSON.stringify(obj2));

      // console.log(this.file);
      // console.log(obj1);
      // console.log(obj2);
      console.log(JSON.stringify(obj1));
      console.log(JSON.stringify(obj2));

      // console.log(obj2.length);
      // for (let i = 0; i < obj2.length; i++) {
      //   let obj = {};
      //   obj = Object.assign({}, obj2[i]);
      //   console.log(JSON.stringify(obj));
      // }

      // let obj1 = {};
      // let obj2 = {};
      // let obj3 = {};

      // obj1[this.currentRow3["key"]] = this.currentRow3["value"];
      // obj2[this.form["key"]] = this.form["value"];
      // obj3[this.currentRow3["key"]] = obj2;

      // let data = new FormData();
      // data.append("file", this.file);
      // data.append("relationString", JSON.stringify(obj1));
      // data.append("hashString", JSON.stringify(obj3));

      // console.log(this.file);
      // console.log(JSON.stringify(obj1));
      // console.log(JSON.stringify(obj2));

      this.$http.post("http://8.134.49.56:8000/G/relacement", data).then((res) => {
        this.$alert("替换成功", "提示", {
          confirmButtonText: "确定",
          callback: (action) => {},
        });
      });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.info(val);
    },

    getDatabase() {
      this.$http.get("http://8.134.49.56:8000/G/getdatabase").then((res) => {
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
  },
};
</script>
