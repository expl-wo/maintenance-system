<template>
  <div class="app-container">
    <el-tabs :tab-position="tabPosition" class="hp content">
      <el-tab-pane label="生产工艺分类" class="hp">
        <productCraft class="hp"></productCraft>
      </el-tab-pane>
      <el-tab-pane label="HSEE管理分类" class="hp">
        <hsse class="hp"></hsse>
      </el-tab-pane>
      <el-tab-pane label="机床行业分类" class="hp">
        <lathe class="hp"></lathe>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import hsse from './class/hsse' // 设备分类管理
import lathe from './class/lathe' // 设备台账管理
import productCraft from './class/productCraft' // 设备等级管理

export default {
  name: 'Table',
  components: { hsse, productCraft, lathe },
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
