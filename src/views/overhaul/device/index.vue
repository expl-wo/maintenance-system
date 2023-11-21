<template>
  <div class="full-content">
    <div class="left-part">
      <device-tree  @nodeChanged="nodeChanged"/>
    </div>
    <div class="right-part">
      <el-tabs class="tab-wrapper" v-model="activeName">
        <el-tab-pane label="设备" name="device">
            <device-table ref="deviceTable" />
        </el-tab-pane>
        <el-tab-pane label="通道" name="channel">
            <channel-table ref="channelTable" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>

import DeviceTree from './components/deviceTree';
import DeviceTable from "./components/deviceTable";
import ChannelTable from "./components/channelTable";


export default {
  components: {
    DeviceTree,
    DeviceTable,
    ChannelTable
  },
  data() {
    return {
        activeName: 'device',
        currentNode: null
    };
  },

  methods: {
    // 树节点发生变化
    nodeChanged(node) {
      this.currentNode = node;
    }
  },
};
</script>
<style lang="scss" scoped>
.full-content {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 20px;
  .left-part {
    width: 260px;
    height: 100%;
  }
  .right-part {
    width: calc(100% - 260px);
    height: 100%;
    padding: 0 12px;
    .tab-wrapper {
      height: 100%;
      ::v-deep(.el-tabs__content) {
        height: calc(100% - 55px);
        .el-tab-pane {
            height: 100%;
        }
      }
    }
  }
}
</style>
