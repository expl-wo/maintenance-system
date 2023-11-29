<template>
  <div class="app-container">

    <el-tabs :tab-position="tabPosition" class="hp content">
      <el-tab-pane label="中工序对应主材信息" >
        <crafs-and-main ></crafs-and-main>
      </el-tab-pane>
      <el-tab-pane label="中工序对应辅材信息" >
        <crafs-and-auxiliary ></crafs-and-auxiliary>
      </el-tab-pane>
      <el-tab-pane label="中工序对应设备信息" >
        <crafs-and-equipment ></crafs-and-equipment>
      </el-tab-pane>
      <el-tab-pane label="中工序对应工器具信息" >
        <crafs-and-tools ></crafs-and-tools>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import crafsAndMain from './crafsClass/crafsAndMain' // 主材分类管理
import crafsAndAuxiliary from './crafsClass/crafsAndAuxiliary' // 辅材分类管理
import crafsAndEquipment from "./crafsClass/crafsAndEquipment";//设备管理
import crafsAndTools from './crafsClass/crafsAndTools' // 工器具管理


export default {
  components: { crafsAndTools,crafsAndMain,  crafsAndAuxiliary,crafsAndEquipment},
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
