
<template>
  <!-- 动态展示表格 -->
  <el-table :data="tableData" border stripe :height="height" @row-click="handleRowClick">
    <!-- v-for 循环取表头数据 -->
    <template v-for="item in tableHeader">
      <table-column v-if="item.children && item.children.length" :key="item.id" :column-header="item" />
      <el-table-column v-else :key="item.id" :label="item.label" :prop="item.prop" align="center" />
    </template>
  </el-table>
</template>

<script>
  import TableColumn from '@/components/Table/TableColumn'
 
  export default {
    name: 'DynamicTable',
    components: {
      TableColumn
    },
    props: {
      // 表格的数据
      tableData: {
        type: Array,
        required: true
      },
      // 多级表头的数据
      tableHeader: {
        type: Array,
        required: true
      },
      // 表格的高度
      height: {
        type: String,
        default: '300'
      }
    },
    methods: {
      // 行点击事件
      handleRowClick (row, column, event) {
        // console.log(row)
        // console.log(column)
        // console.log(event)
        // 通知调用父组件的row-click事件
        // row作为参数传递过去
        this.$emit('row-click', row)
      }
    }
  }
</script>
