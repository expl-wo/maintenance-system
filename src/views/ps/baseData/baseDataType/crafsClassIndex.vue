<template>
  <div class="app-container" height="500">

    <el-tabs :tab-position="tabPosition" class="hp content">
      <el-tab-pane label="中工序对应辅材信息" >
        <crafs-and-auxiliary ref="crafsAndAuxiliaryRef"></crafs-and-auxiliary>
      </el-tab-pane>
      <el-tab-pane label="中工序对应设备信息" >
        <crafs-and-equipment ref="crafsAndEquipmentRef"></crafs-and-equipment>
      </el-tab-pane>
      <el-tab-pane label="中工序对应工装工具信息" >
        <crafs-and-tools ref="crafsAndToolsRef"></crafs-and-tools>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import crafsAndAuxiliary from './crafsClass/crafsAndAuxiliary' // 辅材分类管理
import crafsAndEquipment from "./crafsClass/crafsAndEquipment"//设备管理
import crafsAndTools from "./crafsClass/crafsAndTools"


export default {
  components: { crafsAndTools,  crafsAndAuxiliary,crafsAndEquipment},
  data() {
    return {
      tabPosition: 'top',
      crafsId:''
    }
  },
  mounted() {
  },
  methods: {
    initData(crafsId) {
      this.crafsId = crafsId ==null ?'':crafsId
      this.$refs.crafsAndAuxiliaryRef && this.$refs.crafsAndAuxiliaryRef.initData(this.crafsId)
      this.$refs.crafsAndEquipmentRef && this.$refs.crafsAndEquipmentRef.initData(this.crafsId)
      this.$refs.crafsAndToolsRef && this.$refs.crafsAndToolsRef.initData(this.crafsId)
    },
  }
}
</script>

<style scoped>

</style>


