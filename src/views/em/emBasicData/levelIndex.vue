<template>
  <div class="app-container">
    <el-tabs :tab-position="tabPosition" class="hp content">
      <el-tab-pane label="生产管理分级" class="hp">
        <productManage class="hp"></productManage>
      </el-tab-pane>
      <el-tab-pane label="HSSEG管理分级" class="hp">
        <hsseg class="hp"></hsseg>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import hsseg from './level/hsseg' //hSSEG管理
import productManage from './level/productManage' // 生产管理
export default {
  name: 'Table',
  components: {hsseg, productManage },
  data() {
    return {
      tabPosition: 'left'
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
