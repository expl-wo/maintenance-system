<template>
  <div class="app-container">
    <el-tabs :tab-position="tabPosition" class="content hp">
      <el-tab-pane label="故障类别分类管理" class="hp">
        <faultClass class="hp"></faultClass>
      </el-tab-pane>
      <el-tab-pane label="故障因素分类管理" class="hp">
        <faultFactor class="hp"></faultFactor>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import faultClass from './emRepair_001_basicData_children/faultClass' // 故障类别分类管理
import faultFactor from './emRepair_001_basicData_children/faultFactor' // 故障因素分类管理

export default {
  name: 'Table',
  components: { faultClass, faultFactor },
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

