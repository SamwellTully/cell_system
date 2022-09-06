<template>
  <el-table-column
    :label="columnHeader.label"
    :prop="columnHeader.label"
    align="center"
  >
    <!--columnHeader对应:column-header-->
    <template v-for="item in columnHeader.children">
      <tableColumn
        v-if="item.children && item.children.length"
        :key="item.id"
        :column-header="item"
      />
      <el-table-column
        v-else
        :key="item.name"
        :label="item.label"
        :prop="item.prop"
        align="center"
      />
    </template>
  </el-table-column>
</template>
 
<script>
  export default {
    name: 'TableColumn',
    props: {
      columnHeader: {
        type: Object,
        required: true
      }
    }
  }
</script>
 
<style scoped>
 
</style>
