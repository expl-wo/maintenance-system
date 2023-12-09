<template>
  <div class="app-container">

    <el-tabs :tab-position="tabPosition" class="hp content">
      <el-tab-pane label="辅材类型管理" >
        <auxiliary-material ></auxiliary-material>
      </el-tab-pane>
      <el-tab-pane label="设备类型管理" >
        <equipment ></equipment>
      </el-tab-pane>
      <el-tab-pane label="工装工具类型管理" >
        <tools ></tools>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import auxiliaryMaterial from './class/auxiliaryMaterial' // 辅材分类管理
import tools from './class/tools' // 工器具管理
import equipment from "./class/equipment";//设备管理

export default {
  components: { tools, auxiliaryMaterial,equipment},
  data() {
    return {
      tabPosition: 'top'
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
