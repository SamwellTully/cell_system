<template>
  <div class="app-container" v-loading="listLoading">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          <p class="title">个人（文件/映射）</p>
        </template>

        <el-tabs v-model="activeName" @tab-click="handleSwitchTabs">
          <el-tab-pane name="first">
            <span slot="label" class="tableTitleClass">文件</span>
            <el-card class="box-card" style="margin-top:30px">

              <div id="example">
                <el-input class="markinput" type="text" style="margin-bottom: 15px" v-model="searchPriData"
                  placeholder="请输入文件名/文件描述/创建单位/创建时间进行查找"></el-input>
              </div>

              <el-table :data="NewPriitems" element-loading-text="Loading" border stripe fit highlight-current-row>
                <el-table-column align="center" label="ID" width="95">
                  <template slot-scope="scope">
                    {{ scope.row.id }}
                  </template>
                </el-table-column>
                <el-table-column label="文件名称" width="150px" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.gTalename }}
                  </template>
                </el-table-column>

                <el-table-column label="文件描述" :show-overflow-tooltip='true' align="center">
                  <template slot-scope="scope">
                    {{ scope.row.gTabledescription }}
                  </template>
                </el-table-column>

                <el-table-column label="创建时间" width="180px" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.gTableTime }}
                  </template>
                </el-table-column>

                <el-table-column label="创建单位" width="180px" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.gTableinstitution }}
                  </template>
                </el-table-column>

                <el-table-column label="操作1" width="110" align="center">
                  <template slot-scope="scope">
                    <el-button type="primary" @click="checkPrivateTable(scope.row.gTalename)">查看</el-button>
                  </template>

                  <el-dialog @close="closeCheckOrExport" width="80%" title="详情" :visible.sync="checkPrivateTableVisible"
                    :append-to-body="true">
                    <el-table :data="gridData" height="600">
                      <el-table-column v-for="(fieldkey, index) in fieldKeys" :key="index" :property="fieldkey"
                        :prop="fieldkey" :label="fieldkey"></el-table-column>
                    </el-table>
                  </el-dialog>
                </el-table-column>

                <el-table-column class-name="status-col" label="操作2" width="110" align="center">
                  <el-button type="danger">删除</el-button>
                </el-table-column>

                <el-table-column class-name="status-col" label="操作3" width="110" align="center">

                  <template slot-scope="scope">
                    <el-button @click="jumpForm(scope.row.gTalename)">数据转换</el-button>
                  </template>


                </el-table-column>

                <el-table-column class-name="status-col" label="操作4" width="110" align="center">

                  <template slot-scope="scope">
                    <el-button @click="jumpTrans(scope.row.gTalename)">映射</el-button>
                  </template>


                </el-table-column>

                <el-table-column label="操作5" width="110" align="center">
                  <template slot-scope="scope">
                    <el-button type="primary" @click="openForPrivate(scope.row.gTalename)">导出</el-button>
                  </template>
                  <el-dialog width="80%" @close="closeCheckOrExport" top="60px" title="详情"
                    :visible.sync="exportPrivateTableVisible" :append-to-body="true">
                    <el-button type="primary" @click="exportToFile">导出数据</el-button>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                    </el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="exportList" @change="handleCheckedCitiesChange">
                      <el-checkbox v-for="(fieldkey, index) in fieldKeys" :key="index" :label="fieldkey"></el-checkbox>
                    </el-checkbox-group>
                    <el-divider></el-divider>
                    <el-table v-loading="loadingTable" :data="gridData" height="520">
                      <el-table-column v-for="(fieldkey, index) in fieldKeys" :key="index" :property="fieldkey"
                        :prop="fieldkey" :label="fieldkey"></el-table-column>
                    </el-table>
                  </el-dialog>
                </el-table-column>
              </el-table>
              <el-pagination @current-change="handlePrivateCurrentChange" :current-page.sync="privatePage"
                :page-size="p2Size" layout="total, prev, pager, next, jumper" :total="privateTotal">
              </el-pagination>
            </el-card>
          </el-tab-pane>
          <el-tab-pane name="second">
            <span slot="label" class="tableTitleClass">映射</span>
            <el-table :data="MapPriitems" row-key="id" style="width: 100%"
            :default-sort="{prop:'timestamp',order:'descending'}">
              <el-table-column label="ID" width="95" align="center">
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column label="映射名称" prop="mappingName" align="center">
              </el-table-column>
              <el-table-column label="源文件" prop="sourceFile" align="center">
              </el-table-column>
              <el-table-column label="目标文件" prop="targetFile" align="center">
              </el-table-column>
              <el-table-column label="源文件单位" prop="sourceCompany" align="center">
              </el-table-column>
              <el-table-column label="目标文件单位" prop="targetCompany" align="center">
              </el-table-column>
              <el-table-column label="创建时间" prop="timestamp" :sortable="true" align="center">
              </el-table-column>
              <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                  <el-input v-model="mappingSearchInputPri" size="medium" placeholder="输入关键字搜索" type="text"/>
                </template>
                <template slot-scope="scope">
                  <el-button size="medium" @click="checkPrivateMapping(scope.$index, scope.row)">查看</el-button>
                  <el-button size="medium" type="danger" @click="handleDeletePrivateMapping(scope.$index, scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @current-change="handleMappingPrivateCurrentChange" :current-page.sync="MappingprivatePage"
              :page-size="p2Size" layout="total, prev, pager, next, jumper" :total="MappingprivateTotal">
            </el-pagination>
          </el-tab-pane>
        </el-tabs>


      </el-collapse-item>

      <el-collapse-item name="2">
        <template slot="title">
          <p class="title">公开（文件/映射）</p>
        </template>

        <el-tabs v-model="activeOpenName" @tab-click="handleSwitchTabs">
          <el-tab-pane name="first">
            <span slot="label" class="tableTitleClass">文件</span>
            <el-card class="box-card">

              <div id="example">
                <el-input class="markinput" type="text" style="margin-bottom: 15px" v-model="searchPubData"
                  placeholder="请输入文件名/文件描述/创建单位/创建时间进行查找"></el-input>
              </div>

              <el-table :data="NewPubitems" element-loading-text="Loading" border stripe fit highlight-current-row>
                <el-table-column align="center" label="ID" width="95">
                  <template slot-scope="scope">
                    {{ scope.row.id }}
                  </template>
                </el-table-column>
                <el-table-column label="文件名称" width="150px" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.gTalename }}
                  </template>
                </el-table-column>

                <el-table-column label="文件描述" :show-overflow-tooltip='true' align="center">
                  <template slot-scope="scope">
                    {{ scope.row.gTabledescription }}
                  </template>
                </el-table-column>

                <el-table-column label="创建时间" width="180px" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.gTableTime }}
                  </template>
                </el-table-column>

                <el-table-column label="创建单位" width="180px" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.gTableinstitution }}
                  </template>
                </el-table-column>



                <el-table-column label="操作1" width="110" align="center">
                  <template slot-scope="scope">
                    <el-button type="primary" @click="checkPublicTable(scope.row.gTalename)">查看</el-button>
                  </template>

                  <el-dialog @close="closeCheckOrExport" width="80%" title="详情" :visible.sync="checkPublicTableVisible"
                    :append-to-body="true">
                    <el-table :data="gridData" height="600">
                      <el-table-column v-for="(fieldkey, index) in fieldKeys" :key="index" :property="fieldkey"
                        :prop="fieldkey" :label="fieldkey"></el-table-column>
                    </el-table>
                  </el-dialog>
                </el-table-column>

                <el-table-column class-name="status-col" label="操作2" width="110" align="center">
                  <el-button type="danger">删除</el-button>
                </el-table-column>

                <el-table-column class-name="status-col" label="操作3" width="110" align="center">

                  <template slot-scope="scope">
                    <el-button @click="jumpForm(scope.row.gTalename)">数据转换</el-button>
                  </template>


                </el-table-column>

                <el-table-column class-name="status-col" label="操作4" width="110" align="center">

                  <template slot-scope="scope">
                    <el-button @click="jumpTrans(scope.row.gTalename)">映射</el-button>
                  </template>

                </el-table-column>
                <el-table-column label="操作5" width="110" align="center">
                  <template slot-scope="scope">
                    <el-button type="primary" @click="openForPublic(scope.row.gTalename)">导出</el-button>
                  </template>
                  <el-dialog @close="closeCheckOrExport" width="80%" top="60px" title="详情"
                    :visible.sync="exportPublicTableVisible" :append-to-body="true">
                    <el-button type="primary" @click="exportToFile">导出数据</el-button>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                    </el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="exportList" @change="handleCheckedCitiesChange">
                      <el-checkbox v-for="(fieldkey, index) in fieldKeys" :key="index" :label="fieldkey"></el-checkbox>
                    </el-checkbox-group>
                    <el-divider></el-divider>
                    <el-table v-loading="loadingTable" :data="gridData" height="520">
                      <el-table-column v-for="(fieldkey, index) in fieldKeys" :key="index" :property="fieldkey"
                        :prop="fieldkey" :label="fieldkey"></el-table-column>
                    </el-table>
                  </el-dialog>
                </el-table-column>
              </el-table>
              <el-pagination @current-change="handlePubilcCurrentChange" :current-page.sync="publicPage"
                :page-size="p2Size" layout="total, prev, pager, next, jumper" :total="publicTotal">
              </el-pagination>
            </el-card>
          </el-tab-pane>

          <el-tab-pane name="second">
            <span slot="label" class="tableTitleClass">映射</span>            <el-button disabled style="margin-top: 10px" @click="upLoadMapping">导入映射文件</el-button>
            <el-table :data="MapPubitems" row-key="id" :expand-row-keys="publicExpands"
              style="width: 100%" @expand-change="expandPublicChange"
              :default-sort="{prop:'timestamp',order:'descending'}">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-table :data="props.row.info" style="width: 100%" row-key="sourceField" highlight-current-row
                    :row-style="tableRowClassName" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                    <el-table-column label=" " prop="''" width="60px" align="center">
                    </el-table-column>
                    <el-table-column label="源字段" prop="sourceField">
                    </el-table-column>
                    <el-table-column label="目标字段" prop="targetField">
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              
              <el-table-column label="ID" width="95" align="center">
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column label="映射名称" prop="mappingName" align="center">
              </el-table-column>
              <el-table-column label="源文件" prop="sourceFile" align="center">
              </el-table-column>
              <el-table-column label="目标文件" prop="targetFile" align="center">
              </el-table-column>
              <el-table-column label="源文件单位" prop="sourceCompany" align="center">
              </el-table-column>
              <el-table-column label="目标文件单位" prop="targetCompany" align="center">
              </el-table-column>
              <el-table-column label="创建时间" prop="timestamp" :sortable="true" align="center">
              </el-table-column>
              <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                  <el-input v-model="mappingSearchInputPub" size="medium" placeholder="输入关键字搜索" />
                </template>
                <template slot-scope="scope">
                  <el-button size="medium" @click="checkPublicMapping(scope.$index, scope.row)">查看</el-button>
                  <el-button size="medium" type="danger" @click="handleDeletePublicMapping(scope.$index, scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @current-change="handleMappingPubilcCurrentChange" :current-page.sync="MappingpublicPage"
              :page-size="p2Size" layout="total, prev, pager, next, jumper" :total="MappingpublicTotal">
            </el-pagination>
          </el-tab-pane>

        </el-tabs>
      </el-collapse-item>

    </el-collapse>

    <el-dialog title="映射详情" :visible.sync="checkMappingVisible">
      <el-table :data="selectedMapping">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.contentReplace">
              <el-table-column property="sourceContent" label="源内容"></el-table-column>
              <el-table-column property="targetContent" label="目标内容"></el-table-column>
            </el-table>
          </template>
        </el-table-column>

        <el-table-column property="sourceField" label="源字段"></el-table-column>
        <el-table-column property="targetField" label="目标字段"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getList, getListById } from '@/api/table'
import { getToken } from '@/utils/auth'
import { deleteHisMapping, getPublicMappings, getPrivateMappings } from '@/api/mapping'
import Axios from "axios";
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      checkMappingVisible: false,
      selectedMapping: [],
      historicalPublicMappings: [],
      historicalPrivateMapping: [],
      historicalPublicMappingsTemp: [],
      historicalPrivateMappingTemp: [],
      mappingSearchInputPri: "",
      mappingSearchInputPub: "",
      publicExpands: [],
      privateExpands: [],
      activeMapping: [], // 展示每个映射的内容替换
      activeName: 'first', // 个人文件横线标签页的展示
      activeOpenName: 'first', // 公开文件横线标签页的展示
      activeNames: ['1', '2'], // 折叠面板的显示
      checkAll: false,
      isIndeterminate: false,
      publicFiles: null,
      publicFilesTemp: null,
      privateFiles: null,
      privateFilesTemp: null,
      p2Size: 5,
      publicPage: 1,
      privatePage: 1,
      publicTotal: 0,
      privateTotal: 0,
      MappingpublicPage: 1,
      MappingprivatePage: 1,
      MappingpublicTotal: 0,
      MappingprivateTotal: 0,
      listLoading: true,
      saveway: '',
      inventoryCode: '',
      loadingTable: false,
      gridData: [{

      }],
      userInfo: {},
      checkPrivateTableVisible: false,
      checkPublicTableVisible: false,
      exportPrivateTableVisible: false,
      exportPublicTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      checkLoading: false,
      exportList: [],
      currentTableName: "", // 当前表名
      fieldKeys: [], // 所有字段
      searchPubData: "",
      searchPriData: "",
      mappingData: [
        {
          "mappingName": "骨折到脑出血疾病",
          "sourceFile": "骨折",
          "targetFile": "脑出血疾病",
          "timestamp": "2022-08-21 09:40:21",
          "info": [
            {
              "id": "1",
              "sourceField": "保存方式",
              "targetField": "保存方式"
            },
            {
              "id": "2",
              "sourceField": "疾病名称",
              "targetField": "疾病名称"
            },
            {
              "id": "3",
              "sourceField": "民族",
              "targetField": "民族"
            },
            {
              "id": "4",
              "sourceField": "库存编码",
              "targetField": "库存编码"
            },
            {
              "id": "5",
              "sourceField": "身体情况",
              "targetField": "身体情况"
            },
            {
              "id": "6",
              "sourceField": "每份样本数量",
              "targetField": "每份样本数量",
              "children": [
                {
                  "sourceField": "2ug",
                  "targetField": "{x+20}份",
                  "isChildren": "true"
                }
              ]
            },
            {
              "id": "7",
              "sourceField": "捐献人编号",
              "targetField": "捐献人编号"
            },
            {
              "id": "8",
              "sourceField": "年龄",
              "targetField": "年龄"
            },
            {
              "id": "9",
              "sourceField": "保存机构名称",
              "targetField": "保存机构名称"
            },
            {
              "id": "10",
              "sourceField": "性别",
              "targetField": "性别",
              "children": [
                {
                  "sourceField": "男",
                  "targetField": "man",
                  "isChildren": "true"
                },
                {
                  "sourceField": "女",
                  "targetField": "woman",
                  "isChildren": "true"
                }
              ]
            }
          ],
          "relation_id": "35"
        },
        {
          "mappingName": "癫痫到脑出血疾病",
          "sourceFile": "癫痫",
          "targetFile": "脑出血疾病",
          "timestamp": "2022-08-21 09:40:21",
          "info": [
            {
              "id": "1",
              "sourceField": "保存方式",
              "targetField": "保存方式"
            },
            {
              "id": "2",
              "sourceField": "疾病名称",
              "targetField": "疾病名称"
            },
            {
              "id": "3",
              "sourceField": "民族",
              "targetField": "民族"
            },
            {
              "id": "4",
              "sourceField": "库存编码",
              "targetField": "库存编码"
            },
            {
              "id": "5",
              "sourceField": "身体情况",
              "targetField": "身体情况"
            },
            {
              "id": "6",
              "sourceField": "每份样本数量",
              "targetField": "每份样本数量",
              "children": [
                {
                  "sourceField": "2ug",
                  "targetField": "{x+20}份",
                  "isChildren": "true"
                }
              ]
            },
            {
              "id": "7",
              "sourceField": "捐献人编号",
              "targetField": "捐献人编号"
            }
          ],
          "relation_id": "39"
        },
        {
          "mappingName": "脑出血疾病到癫痫",
          "sourceFile": "脑出血疾病",
          "targetFile": "癫痫",
          "timestamp": "2022-08-21 09:40:21",
          "info": [
            {
              "id": "1",
              "sourceField": "保存方式",
              "targetField": "保存方式"
            },
            {
              "id": "2",
              "sourceField": "疾病名称",
              "targetField": "疾病名称"
            },
            {
              "id": "3",
              "sourceField": "民族",
              "targetField": "民族"
            }
          ],
          "relation_id": "40"
        }
      ]
    }
  },
  computed: {
    NewPriitems() {
      var _this = this;
      var NewPriitems = [];
      console.log(this.privateFiles)
      if (this.privateFiles != null && this.privateFiles != false) {
        _this.privateFiles.map(function (item) {
          if (
            // item.id.search(_this.searchData) != -1 ||
            JSON.stringify(item.id).search(_this.searchPriData) != -1 ||
            item.gTalename.search(_this.searchPriData) != -1 ||
            item.gTabledescription.search(_this.searchPriData) != -1 ||
            item.gTableinstitution.search(_this.searchPriData) != -1 ||
            item.gTableTime.search(_this.searchPriData) != -1
          ) {
            NewPriitems.push(item);
          }
        });
      }
      this.privateTotal = NewPriitems.length
      return NewPriitems.slice((this.privatePage - 1) * this.p2Size, this.privatePage * this.p2Size);
    },
    NewPubitems() {
      var _this = this;
      var NewPubitems = [];
      if (this.publicFiles != null && this.publicFiles != false) {
        _this.publicFiles.map(function (item) {
          if (
            // item.id.search(_this.searchData) != -1 ||
            JSON.stringify(item.id).search(_this.searchPubData) != -1 ||
            item.gTalename.search(_this.searchPubData) != -1 ||
            item.gTabledescription.search(_this.searchPubData) != -1 ||
            item.gTableinstitution.search(_this.searchPubData) != -1 ||
            item.gTableTime.search(_this.searchPubData) != -1
          ) {
            NewPubitems.push(item);
          }
        });
      }
      this.privateTotal = NewPubitems.length
      return NewPubitems.slice((this.publicPage - 1) * this.p2Size, this.publicPage * this.p2Size);
    },
    MapPubitems() {
      var _this = this;
      var MapPubitems = [];
      if (this.historicalPublicMappingsTemp != null && this.historicalPublicMappingsTemp != false) {
        _this.historicalPublicMappingsTemp.map(function (item) {
          if (
            item.mappingName.search(_this.mappingSearchInputPub) != -1
          ) {
            MapPubitems.push(item);
          }
        });
      }
      this.MappingpublicTotal = MapPubitems.length
      return MapPubitems.slice((this.MappingpublicPage - 1) * this.p2Size, this.MappingpublicPage * this.p2Size);
    },
    MapPriitems() {
      var _this = this;
      var MapPriitems = [];
      if (this.historicalPrivateMappingTemp != null && this.historicalPrivateMappingTemp != false) {
        _this.historicalPrivateMappingTemp.map(function (item) {
          if (
            // item.id.search(_this.searchData) != -1 ||
            item.mappingName.search(_this.mappingSearchInputPri) != -1
          ) {
            MapPriitems.push(item);
          }
        });
      }
      this.MappingprivateTotal = MapPriitems.length
      return MapPriitems.slice((this.MappingprivatePage - 1) * this.p2Size, this.MappingprivatePage * this.p2Size);
    }
  },
  async created() {
    var getUserInfoResponse = await this.getUserInfo()
    this.userInfo = getUserInfoResponse.data
    await this.fetchData(this.userInfo.userId)
    // console.log(this.privateFiles)
    await this.getPrivateHistoricalMapping()
    await this.getPublicHistoricalMapping()
  },
  methods: {
    // 获取公开历史映射，并将数据进行转换
    async getPublicHistoricalMapping() {
      var get_private_mapping_response = this.historicalPrivateMapping;
      let privatelength=get_private_mapping_response.length
      for(let i=0;i<privatelength;i++){
        this.historicalPublicMappings[i]=get_private_mapping_response[privatelength-i-1]
      }
      this.MappingpublicTotal = this.historicalPrivateMapping.length
      this.historicalPublicMappingsTemp = this.historicalPublicMappings.slice((this.MappingpublicPage - 1) * this.p2Size, this.MappingpublicPage * this.p2Size,)
    },
    // 获取个人历史映射，并将数据进行转换
    async getPrivateHistoricalMapping() {

      var get_private_mapping_response = (await getPrivateMappings(this.userInfo.userId)).data
      for (let i = 0; i < get_private_mapping_response.length; i++) {
        var fieldReplace = JSON.parse(get_private_mapping_response[i]['fieldReplace'])
        var contentReplace = JSON.parse(get_private_mapping_response[i]['contentReplace'])
        var info = []
        for (let field in fieldReplace) {
          var item_field = {}
          item_field['sourceField'] = field
          item_field['targetField'] = fieldReplace[field]
          info.push(item_field)
        }

        if (contentReplace != {}) {
          for (var contentReplace_key in contentReplace) {
            for (var j = 0; j < info.length; j++) {
              if (contentReplace_key == info[j].targetField) {
                var content = []
                for (var content_key in contentReplace[contentReplace_key][0]) {
                  var content_item = {}
                  content_item['sourceContent'] = contentReplace[contentReplace_key][0][content_key]
                  content_item['targetContent'] = content_key
                  content.push(content_item)
                }
                info[j]['contentReplace'] = content
              }
            }
          }
        }

        get_private_mapping_response[i]['info'] = info;
      }
      let privatelength=get_private_mapping_response.length
      for(let i=0;i<privatelength;i++){
        this.historicalPrivateMapping[i]=get_private_mapping_response[privatelength-i-1]
      }
      this.MappingprivateTotal = this.historicalPrivateMapping.length
      console.log(this.MappingprivateTotal)
      this.historicalPrivateMappingTemp = this.historicalPrivateMapping.slice((this.MappingprivatePage - 1) * this.p2Size, this.MappingprivatePage * this.p2Size,)
    },
    // 关闭后清空数据
    closeCheckOrExport() {
      this.gridData = []
    },
    // 上传映射文件
    upLoadMapping() {

    },
    // 设置选中行的颜色
    tableRowClassName({ row, rowIndex }) {
      console.log(row)
      if (row.isChildren === "true") {
        console.log("color ----------")
        let rowBackground = {};
        rowBackground.background = '#f5f7fa'
        rowBackground['border-style'] = 'solid'
        rowBackground['border-width'] = 'medium'
        return rowBackground;
      }
    },
    // 只允许展开单个文件，用id作为唯一标识 和row-key绑定  注意：当后端返回的映射属性更改后，此处必须做相应的更改
    expandPublicChange(row, expandedRows) {
      this.publicExpands = []
      if (expandedRows.length > 0) {
        row ? this.publicExpands.push(row.id) : ''
      }
    },
    // 只允许展开单个文件，用id作为唯一标识 和row-key绑定
    expandPrivateChange(row, expandedRows) {
      this.privateExpands = []
      if (expandedRows.length > 0) {
        row ? this.privateExpands.push(row.id) : ''
      }
    },
    // 查看公开映射文件
    checkPublicMapping(index, row) {
      this.checkMappingVisible = true
      this.selectedMapping = row['info']
    },
    // 查看个人映射文件
    checkPrivateMapping(index, row) {
      this.checkMappingVisible = true
      this.selectedMapping = row['info']
    },
    // 删除映射文件
    async handleDeletePublicMapping(index, row) {
      var r = confirm("是否删除");
      if (r == true) {
        let delete_response = await deleteHisMapping(row.id, this.userInfo.userId);
        this.historicalPublicMappingsTemp.splice(index, 1)
      }
    },
    async handleDeletePrivateMapping(index, row) {
      var r = confirm("是否删除");
      if (r == true) {
        let delete_response = await deleteHisMapping(row.id, this.userInfo.userId);
        this.historicalPrivateMappingTemp.splice(index, 1)
      }
    },
    // 更换个人文件的标签页
    handleSwitchTabs(tab, event) {
      console.log(tab, event);
    },
    // 查看公开文件按钮
    checkPublicTable(tName) {
      this.checkPublicTableVisible = true;
      this.checkLoading = true
      let getDataParams = new URLSearchParams();
      getDataParams.append("tableName", tName);
      let allKeys = []
      this.$axios({
        method: 'post',
        url: "http://8.134.49.56:8000/G/getdata",
        data: getDataParams
      }).then((response) => {
        allKeys = Object.keys(response.data[0]) // response.data返回的是个数组，里面只有一个元素，为该表的示范数据（键值对），通过keys()获得所有键
        this.fieldKeys = allKeys // 必须在里面赋值
      })

      // 获取表格数据
      let params = new URLSearchParams();
      params.append("tableName", tName);
      this.$axios({
        method: 'post',
        url: "http://8.134.49.56:8000/G/GetAllData",
        data: params
      }).then((response) => {
        console.log("gridData")
        console.log(response.data.data)
        this.gridData = response.data.data
        for (let i = 0; i < this.gridData.length; i++) {
          let tmp;
          tmp = this.gridData[i]["导入时间"].slice(0, 10) + " " + this.gridData[i]["导入时间"].slice(11, 19);
          this.gridData[i]["导入时间"] = tmp;
        }
      })
      this.checkLoading = false // 加载成功
    },
    // 查看个人文件按钮
    checkPrivateTable(tName) {
      this.checkPrivateTableVisible = true;
      this.checkLoading = true
      let getDataParams = new URLSearchParams();
      getDataParams.append("tableName", tName);
      let allKeys = []
      this.$axios({
        method: 'post',
        url: "http://8.134.49.56:8000/G/getdata",
        data: getDataParams
      }).then((response) => {
        allKeys = Object.keys(response.data[0]) // response.data返回的是个数组，里面只有一个元素，为该表的示范数据（键值对），通过keys()获得所有键
        this.fieldKeys = allKeys // 必须在里面赋值
      })

      // 获取表格数据
      let params = new URLSearchParams();
      params.append("tableName", tName);
      this.$axios({
        method: 'post',
        url: "http://8.134.49.56:8000/G/GetAllData",
        data: params
      }).then((response) => {
        console.log("gridData")
        console.log(response.data.data)
        this.gridData = response.data.data
        for (let i = 0; i < this.gridData.length; i++) {
          let tmp;
          tmp = this.gridData[i]["导入时间"].slice(0, 10) + " " + this.gridData[i]["导入时间"].slice(11, 19);
          this.gridData[i]["导入时间"] = tmp;
        }
      })
      this.checkLoading = false // 加载成功
    },
    // 获取用户信息
    async getUserInfo() {
      var id = "";
      return (await Axios.get('http://8.134.49.56:8000/user/info?token=' + getToken())).data
    },

    // 下面两个函数用于控制导出按钮全选的样式
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.fieldKeys.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.fieldKeys.length;
    },
    handleCheckAllChange(val) {
      this.exportList = val ? this.fieldKeys : [];
      this.isIndeterminate = false;
    },
    //导出文件
    exportToFile() {
      if (this.exportList == undefined || this.exportList.length <= 0) {
        this.$alert("请选择需要导出的列名", "提示", {
          confirmButtonText: "确定",
          callback: (action) => {
            if (action === "confirm") {
              return;
            }
          },
        });
      } else {
        let fields = JSON.stringify(this.exportList);
        let resultFields = "%5B"
        resultFields += fields.slice(1, fields.length - 1)
        resultFields += "%5D"

        var link = 'http://8.134.49.56:8000/EXPORT/download?tableNames=' + this.currentTableName + '&filedNames=' + resultFields
        var popout = window.open(link);
        window.setTimeout(function () {
          popout.close();
        }, 2000);
      }
    },
    async fetchData(id) {
      this.listLoading = true
      if((await getList(getToken())).data != null){
        this.publicFiles = (await getList(getToken())).data.sort(function (o1, o2) { return o1.time > o2.time ? 1 : -1 })
      }
      if((await getListById(id)).data != null){
        this.privateFiles = (await getListById(id)).data.sort(function (o1, o2) { return o1.time > o2.time ? 1 : -1 })
      }
      this.publicTotal = this.publicFiles.length
      this.privateTotal = this.privateFiles.length
      this.listLoading = false
    },
    jumpForm(val) {
      // this.$router.push('/example/publish', 1)
      this.$router.push({
        name: "Example",
        params: {
          tableName: val,
        },
      });
    },
    jumpTrans(val) {
      // this.$router.push('/example/publish', 1)
      this.$router.push({
        name: "Mapping",
        params: {
          tableName: val,
        },
      });
    },
    // 打开个人文件导出窗口
    openForPrivate: function (tName) {
      this.currentTableName = tName
      this.exportPrivateTableVisible = true
      this.loadingTable = true

      // 首先获取列名
      let getDataParams = new URLSearchParams();
      getDataParams.append("tableName", tName);
      let allKeys = []
      this.$axios({
        method: 'post',
        url: "http://8.134.49.56:8000/G/getdata",
        data: getDataParams
      }).then((response) => {
        allKeys = Object.keys(response.data[0]) // response.data返回的是个数组，里面只有一个元素，为该表的示范数据（键值对），通过keys()获得所有键
        this.fieldKeys = allKeys // 必须在里面赋值
      })

      // 获取表格数据
      let params = new URLSearchParams();
      params.append("tableName", tName);
      this.$axios({
        method: 'post',
        url: "http://8.134.49.56:8000/G/GetAllData",
        data: params
      }).then((response) => {
        console.log("gridData")
        console.log(response.data.data)
        this.gridData = response.data.data
        for (let i = 0; i < this.gridData.length; i++) {
          let tmp;
          tmp = this.gridData[i]["导入时间"].slice(0, 10) + " " + this.gridData[i]["导入时间"].slice(11, 19);
          this.gridData[i]["导入时间"] = tmp;
        }
      })
      this.loadingTable = false // 加载成功
    },
    // 打开公开文件导出窗口
    openForPublic: function (tName) {
      this.currentTableName = tName
      this.exportPublicTableVisible = true
      this.loadingTable = true

      // 首先获取列名
      let getDataParams = new URLSearchParams();
      getDataParams.append("tableName", tName);
      let allKeys = []
      this.$axios({
        method: 'post',
        url: "http://8.134.49.56:8000/G/getdata",
        data: getDataParams
      }).then((response) => {
        allKeys = Object.keys(response.data[0]) // response.data返回的是个数组，里面只有一个元素，为该表的示范数据（键值对），通过keys()获得所有键
        this.fieldKeys = allKeys // 必须在里面赋值
      })

      // 获取表格数据
      let params = new URLSearchParams();
      params.append("tableName", tName);
      this.$axios({
        method: 'post',
        url: "http://8.134.49.56:8000/G/GetAllData",
        data: params
      }).then((response) => {
        console.log("gridData")
        console.log(response.data.data)
        this.gridData = response.data.data
        for (let i = 0; i < this.gridData.length; i++) {
          let tmp;
          tmp = this.gridData[i]["导入时间"].slice(0, 10) + " " + this.gridData[i]["导入时间"].slice(11, 19);
          this.gridData[i]["导入时间"] = tmp;
        }
      })
      this.loadingTable = false // 加载成功
    },
    handlePubilcCurrentChange(val) {
      this.publicPage = val
      // console.log(this.publicPage)
      // console.log(this.publicFiles.slice((this.publicPage - 1) * this.p2Size, this.publicPage * this.p2Size,))
      this.publicFilesTemp = this.publicFiles.slice((this.publicPage - 1) * this.p2Size, this.publicPage * this.p2Size,)

    },
    handlePrivateCurrentChange(val) {
      this.privatePage = val
      // console.log(this.privateFiles)
      // console.log(this.privateFiles.slice((this.privatePage - 1) * this.p2Size, this.privatePage * this.p2Size,))
      this.privateFilesTemp = this.privateFiles.slice((this.privatePage - 1) * this.p2Size, this.privatePage * this.p2Size,)

    },
    handleMappingPubilcCurrentChange(val) {
      this.MappingpublicPage = val
      // console.log(this.historicalPublicMappings)
      // console.log(this.historicalPublicMappings.slice((this.MappingpublicPage - 1) * this.p2Size, this.MappingpublicPage * this.p2Size,))
      this.historicalPublicMappingsTemp = this.historicalPublicMappings.slice((this.MappingpublicPage - 1) * this.p2Size, this.MappingpublicPage * this.p2Size,)

    },
    handleMappingPrivateCurrentChange(val) {
      this.MappingprivatePage = val
      this.historicalPrivateMappingTemp = this.historicalPrivateMapping.slice((this.MappingprivatePage - 1) * this.p2Size, this.MappingprivatePage * this.p2Size,)

    }
  }
}
</script>

<style lang="scss" scoped>
.tableTitleClass {
  margin-left: 15px;
  margin-right: 15px;
  font-size: large;
}

.el-tooltip__popper {
  max-width: 20%;
}

.title {
  font-size: 18px;
  padding-bottom: 17px;
  padding-left: 17px;
  padding-top: 17px;
  border: 2px;
}

.el-tooltip__popper,
.el-tooltip__popper.is-dark {
  background: rgb(48, 65, 86) !important;
  color: #fff !important;
  line-height: 24px;

}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
<style lang="scss">
.markinput {
  border-radius: 7px;
  border-style: solid;
  border-width: medium;
  border-color: #9cdcfe;
}
</style>
