<template>
  <el-pagination
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :layout="layout"
      :total="total">
  </el-pagination>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
export default defineComponent({
  name: "xui-pagination",
  emits: ["pageChange"],
  props: {
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type:[String, Number],
      default: 20
    },
    total: {
      type: Number,
      default: 0
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    pageSizes: {
      type: Array,
      default: ()=>{
        return [10, 20, 50, 100];
      }
    }
  },
  setup(props, {emit}){
    const handleSizeChange = (pageSize: number) => {
      let params = {
        pageSize: pageSize,
        pageNum: props.pageNum
      }
      emit("pageChange", params);
    };
    const handleCurrentChange = (currentPage: number) => {
      let params = {
        pageSize: props.pageSize,
        pageNum: currentPage
      }
      emit("pageChange", params);
    };

    return {
      handleSizeChange,
      handleCurrentChange,
    }
  }
})
</script>

<style scoped>

</style>