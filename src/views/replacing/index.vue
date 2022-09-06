<template slot- scope=" scope">
  <div class="app-container">
    <el-row
      :gutter="20"
      style="display: flex; align-items: center"
      type="flex"
      justify="center"
    >
      <el-col :span="8"
        ><div class="grid-content">
          <h3>
            选择目标字段
            <template>
              <el-select v-model="value" placeholder="请选择" style="margin-left: 10px">
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

      <el-col :span="9"></el-col>
    </el-row>

    <el-row
      :gutter="20"
      style="display: flex; align-items: center"
      type="flex"
      justify="center"
    >
      <el-col :span="8"
        ><div class="grid-content">
          <h3>源值</h3>
        </div></el-col
      >

      <el-col :span="1"><div class="grid-content"></div></el-col>

      <el-col :span="8"
        ><div class="grid-content">
          <h3>目标值</h3>
        </div></el-col
      >
    </el-row>

    <el-row :gutter="20" style="display: flex" type="flex" justify="center">
      <el-col :span="8"
        ><div class="grid-content">
          <el-card class="box-card" shadow="hover">
            <div v-for="o in 5" :key="o" class="text item">
              {{ "列表内容 " + o }}
            </div>
          </el-card>
        </div></el-col
      >

      <el-col :span="1"><div class="grid-content"></div></el-col>

      <el-col :span="8"
        ><div class="grid-content">
          <el-card class="box-card" shadow="hover">
            <div v-for="o in 5" :key="o" class="text item">
              {{ "列表内容 " + o }}
            </div>
          </el-card>

          <h5></h5></div
      ></el-col>
    </el-row>

    <el-row
      :gutter="20"
      style="display: flex; align-items: center"
      type="flex"
      justify="center"
    >
      <el-col :span="8"
        ><div class="grid-content">
          <el-button-group>
            <el-button type="primary" icon="el-icon-arrow-left">上一个</el-button>
            <el-button type="primary"
              >下一个<i class="el-icon-arrow-right el-icon--right"></i
            ></el-button>
          </el-button-group></div
      ></el-col>

      <el-col :span="1"><div class="grid-content"></div></el-col>

      <el-col :span="8"
        ><div class="grid-content">
          <el-button type="primary" style="width: 180px"><span>切换</span></el-button>
        </div></el-col
      >
    </el-row>

    <el-row
      :gutter="20"
      style="display: flex; align-items: center "
      type="flex"
      justify="center"
    >
      <el-col :span="15"
        ><div class="grid-content" style="margin-top: 32px">
          <el-form :inline="true" style="display: flex; align-items: center">
            <el-col :span="7">
              <el-form-item label="导出格式" prop="resource">
                <el-radio-group v-model="ruleForm.resource">
                  <el-radio label=".xlsx"></el-radio>
                  <el-radio label=".xls"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-form-item label="加密">
              <el-checkbox name="type"></el-checkbox
            ></el-form-item>
            
            <el-form-item ><el-button size="medium" style="margin-left:70px" round>导出</el-button></el-form-item>
          </el-form>
        </div></el-col
      >

      <el-col :span="2"><div class="grid-content"></div></el-col>
    </el-row>
  </div>
</template>

<style>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}


</style>

<style>

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



<script>
export default {
  data() {
    return {
        options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      value: "",
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        region: [{ required: true, message: "请选择活动区域", trigger: "change" }],
        date1: [
          { type: "date", required: true, message: "请选择日期", trigger: "change" },
        ],
        date2: [
          { type: "date", required: true, message: "请选择时间", trigger: "change" },
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change",
          },
        ],
        resource: [{ required: true, message: "请选择活动资源", trigger: "change" }],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
